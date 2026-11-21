// Năm cách phối hợp cache (Redis) với database khi ĐỌC và GHI.
// "Database" ở đây là một Map chậm 20ms mỗi lần đọc/ghi, có đếm số lần gọi.
// Chạy: docker run -d --rm --name atlas-redis -p 6380:6379 redis:8
//       npm i ioredis && node read-write-patterns.ts
import Redis from 'ioredis';

const redis = new Redis(6380);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// --- Database giả: chậm, có đếm
const rows = new Map<string, number>();
const db = {
  reads: 0, writes: 0,
  async get(id: string) { this.reads++; await sleep(20); return rows.get(id); },
  async put(id: string, v: number) { this.writes++; await sleep(20); rows.set(id, v); },
  reset() { this.reads = 0; this.writes = 0; },
};
async function timed<T>(fn: () => Promise<T>): Promise<[T, number]> {
  const t = performance.now(); const v = await fn(); return [v, performance.now() - t];
}
const k = (id: string) => `stock:${id}`;
const TTL = 60;

// 1) CACHE-ASIDE: ứng dụng tự đọc cache, trượt thì đọc DB rồi ghi vào cache. Ghi: DB trước, rồi XÓA cache.
async function asideRead(id: string) {
  const hit = await redis.get(k(id));
  if (hit !== null) return Number(hit);
  const v = await db.get(id);
  if (v !== undefined) await redis.set(k(id), v, 'EX', TTL);
  return v;
}
async function asideWrite(id: string, v: number) { await db.put(id, v); await redis.del(k(id)); }

// 2) WRITE-THROUGH: ghi DB và ghi luôn giá trị mới vào cache, trong cùng một lời gọi.
async function throughWrite(id: string, v: number) { await db.put(id, v); await redis.set(k(id), v, 'EX', TTL); }

// 3) WRITE-BEHIND: chỉ ghi cache rồi trả lời ngay; một tiến trình nền gom lại ghi xuống DB sau.
const dirty = new Map<string, number>(); // bộ đệm trong RAM của ứng dụng: chưa xuống DB
async function behindWrite(id: string, v: number) { await redis.set(k(id), v, 'EX', TTL); dirty.set(id, v); }
async function flush() { const batch = [...dirty]; dirty.clear(); for (const [id, v] of batch) await db.put(id, v); }

// 4) WRITE-AROUND: ghi thẳng DB, KHÔNG đụng cache (cache tự hết hạn sau TTL).
async function aroundWrite(id: string, v: number) { await db.put(id, v); }

// 5) REFRESH-AHEAD: khi đọc thấy key sắp hết hạn (còn < 20% TTL) thì làm mới ở nền, người đọc không phải chờ.
async function aheadRead(id: string, ttl: number) {
  const [hit, left] = await Promise.all([redis.get(k(id)), redis.ttl(k(id))]);
  if (hit !== null) {
    if (left <= ttl * 0.2) void db.get(id).then((v) => redis.set(k(id), v!, 'EX', ttl));
    return { v: Number(hit), from: left <= ttl * 0.2 ? 'cache (+ làm mới ở nền)' : 'cache' };
  }
  const v = (await db.get(id))!;
  await redis.set(k(id), v, 'EX', ttl);
  return { v, from: 'DB' };
}

await redis.flushdb();
rows.set('42', 100);

console.log('1) Cache-aside');
let [v, ms] = await timed(() => asideRead('42'));   console.log(`   đọc lần 1: ${v} (${ms.toFixed(1)}ms, trượt → DB)`);
[v, ms] = await timed(() => asideRead('42'));       console.log(`   đọc lần 2: ${v} (${ms.toFixed(1)}ms, trúng cache)`);
await asideWrite('42', 99);
[v, ms] = await timed(() => asideRead('42'));       console.log(`   ghi 99 (DB rồi xóa cache), đọc lại: ${v} (${ms.toFixed(1)}ms, trượt 1 lần sau mỗi lần ghi)`);

console.log('2) Write-through');
let [, wms] = await timed(() => throughWrite('42', 98));
[v, ms] = await timed(() => asideRead('42'));
console.log(`   ghi 98 mất ${wms.toFixed(1)}ms (DB + cache), đọc ngay: ${v} (${ms.toFixed(1)}ms, trúng)`);

console.log('3) Write-behind');
db.reset();
[, wms] = await timed(async () => { for (let i = 1; i <= 100; i++) await behindWrite('42', 200 + i); });
console.log(`   100 lần ghi liên tiếp mất ${wms.toFixed(0)}ms tổng, DB chưa bị ghi lần nào (db.writes = ${db.writes})`);
await flush();
console.log(`   flush: DB nhận ${db.writes} lần ghi (chỉ giá trị cuối ${rows.get('42')}), 99 lần ghi trung gian được gộp`);
await behindWrite('42', 1);
dirty.clear(); // tiến trình chết trước khi kịp flush: bộ đệm trong RAM mất
await redis.del(k('42')); // ...và key trong Redis bị evict/hết hạn
console.log(`   sập trước khi flush: đặt 1 nhưng DB vẫn là ${rows.get('42')} → mất một lần ghi`);

console.log('4) Write-around');
await redis.set(k('42'), rows.get('42')!, 'EX', TTL); // đang có trong cache
await aroundWrite('42', 50);
[v] = await timed(() => asideRead('42'));
console.log(`   ghi 50 thẳng vào DB, đọc qua cache: ${v} (cũ, đúng tới khi key hết hạn sau tối đa ${TTL}s)`);

console.log('5) Refresh-ahead (TTL 5s)');
await redis.del(k('42'));
db.reset();
for (const wait of [0, 2500, 1600, 300]) {
  await sleep(wait);
  if (wait === 1600) rows.set('42', 60); // DB vừa đổi thành 60
  const [r, rms] = await timed(() => aheadRead('42', 5));
  console.log(`   +${String(wait).padStart(4)}ms đọc: ${r.v} từ ${r.from.padEnd(23)} ${rms.toFixed(1)}ms`);
}
console.log(`   DB bị đọc ${db.reads} lần (lần đầu + 1 lần làm mới ở nền), chỉ lần đầu người dùng phải chờ`);
await redis.quit();
