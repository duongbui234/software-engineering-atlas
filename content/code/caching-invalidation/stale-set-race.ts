// Cache "nói dối" sau khi đã xóa đúng chỗ: tái hiện race stale set và ba cách chữa.
// Thứ tự xen kẽ giữa người đọc và người ghi được điều khiển bằng "cổng" (promise) nên lần nào chạy cũng ra một kết quả.
// Chạy: docker run -d --rm --name atlas-redis -p 6380:6379 redis:8
//       npm i ioredis && node stale-set-race.ts
import Redis from 'ioredis';
import { randomUUID } from 'node:crypto';

const redis = new Redis(6380);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const gate = () => { let open!: () => void; const p = new Promise<void>((r) => (open = r)); return { p, open }; };

// Database giả có cột version (tăng mỗi lần ghi)
const row = { price: 100, version: 1 };
const dbGet = async () => { await sleep(5); return { ...row }; };
const dbPut = async (price: number) => { await sleep(5); row.price = price; row.version++; };
const K = 'price:42';
const reset = async () => { row.price = 100; row.version = 1; await redis.del(K, `lease:${K}`); };
const show = async (label: string) => console.log(`   ${label}: DB = ${row.price}, cache = ${await redis.get(K)}`);

// ── 0) Ghi đè cache (update) thay vì xóa: hai người ghi về cache sai thứ tự
console.log('0) Hai người ghi cùng cập nhật cache (update thay vì delete)');
await reset();
{
  const w1Cache = gate();
  const w1 = (async () => { await dbPut(1); await w1Cache.p; await redis.set(K, 1); })(); // W1 chậm khi ghi cache
  const w2 = (async () => { await sleep(10); await dbPut(2); await redis.set(K, 2); w1Cache.open(); })();
  await Promise.all([w1, w2]);
  await show('W1 ghi DB trước, nhưng ghi cache sau W2');
}

// ── 1) Cache-aside chuẩn (ghi DB rồi DEL) vẫn có race "stale set"
console.log('1) Cache-aside: người đọc trượt cache, đọc DB cũ, ghi vào cache SAU khi người ghi đã xóa');
await reset();
{
  const readerHasOldValue = gate(); const writerDone = gate();
  const reader = (async () => {
    if ((await redis.get(K)) === null) {
      const { price } = await dbGet();              // đọc được 100
      readerHasOldValue.open(); await writerDone.p; // ...bị chậm (GC, mạng) đúng lúc này
      await redis.set(K, price, 'EX', 60);          // ghi 100 vào cache
    }
  })();
  const writer = (async () => { await readerHasOldValue.p; await dbPut(200); await redis.del(K); writerDone.open(); })();
  await Promise.all([reader, writer]);
  await show('sai trong 60 giây (tới khi TTL hết)');
}

// ── 2) Chữa bằng lease (giống memcache của Facebook): xóa cache thì vé ghi của người đọc cũng mất hiệu lực
const SET_IF_LEASE = `
if redis.call('GET', KEYS[2]) == ARGV[1] then
  redis.call('SET', KEYS[1], ARGV[2], 'EX', ARGV[3]); redis.call('DEL', KEYS[2]); return 1
end
return 0`;
console.log('2) Lease: người đọc xin "vé" khi trượt, người ghi xóa cả cache lẫn vé');
await reset();
{
  const readerHasOldValue = gate(); const writerDone = gate();
  let accepted = -1;
  const reader = (async () => {
    if ((await redis.get(K)) === null) {
      const token = randomUUID();
      await redis.set(`lease:${K}`, token, 'PX', 10_000);
      const { price } = await dbGet();
      readerHasOldValue.open(); await writerDone.p;
      accepted = (await redis.eval(SET_IF_LEASE, 2, K, `lease:${K}`, token, price, 60)) as number;
    }
  })();
  const writer = (async () => { await readerHasOldValue.p; await dbPut(200); await redis.del(K, `lease:${K}`); writerDone.open(); })();
  await Promise.all([reader, writer]);
  console.log(`   ghi 100 vào cache bị ${accepted ? 'nhận' : 'TỪ CHỐI'} vì vé đã bị hủy`);
  await show('lần đọc sau sẽ trượt và lấy giá đúng');
}

// ── 3) Chữa bằng version: người ghi để lại "bia mộ" mang version mới thay vì xóa trắng
const SET_IF_NEWER = `
local cur = redis.call('GET', KEYS[1])
if cur then
  local v = tonumber(string.match(cur, '^(%d+):'))
  if v and v >= tonumber(ARGV[1]) then return 0 end
end
redis.call('SET', KEYS[1], ARGV[1] .. ':' .. ARGV[2], 'EX', ARGV[3]); return 1`;
console.log('3) Version + tombstone: chỉ nhận giá trị có version mới hơn cái đang nằm trong cache');
await reset();
{
  const readerHasOldValue = gate(); const writerDone = gate();
  let accepted = -1;
  const reader = (async () => {
    if ((await redis.get(K)) === null) {
      const { price, version } = await dbGet();       // version 1
      readerHasOldValue.open(); await writerDone.p;
      accepted = (await redis.eval(SET_IF_NEWER, 1, K, version, price, 60)) as number;
    }
  })();
  const writer = (async () => {
    await readerHasOldValue.p; await dbPut(200);       // version 2
    await redis.set(K, `${row.version}:deleted`, 'EX', 60); // tombstone thay cho DEL
    writerDone.open();
  })();
  await Promise.all([reader, writer]);
  console.log(`   ghi "1:100" bị ${accepted ? 'nhận' : 'TỪ CHỐI'} vì cache đang giữ version ${row.version}`);
  await show('cache giữ bia mộ, lần đọc sau coi như trượt');
}

// ── 4) Xóa hai lần có trễ (delayed double delete): thu hẹp cửa sổ, không đóng hẳn
console.log('4) Delayed double delete: người ghi xóa lại sau 200ms');
await reset();
{
  const readerHasOldValue = gate();
  const reader = (async () => {
    if ((await redis.get(K)) === null) {
      const { price } = await dbGet();
      readerHasOldValue.open(); await sleep(50);     // chậm 50ms, ít hơn độ trễ của lần xóa thứ hai
      await redis.set(K, price, 'EX', 60);
    }
  })();
  const writer = (async () => { await readerHasOldValue.p; await dbPut(200); await redis.del(K); await sleep(200); await redis.del(K); })();
  await reader; await show('ngay sau khi người đọc ghi bản cũ');
  await writer; await show('sau lần xóa thứ hai');
  console.log('   (nếu người đọc chậm hơn 200ms thì bản cũ vẫn lọt qua)');
}
await redis.quit();
