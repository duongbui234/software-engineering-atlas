// Redis làm cache: hết bộ nhớ thì sao, key hết hạn được dọn thế nào, lệnh nào làm Redis "đứng hình".
// Chạy: docker run -d --rm --name atlas-redis -p 6380:6379 redis:8
//       npm i ioredis && node redis-as-cache.ts
// (ví dụ tự đặt maxmemory nhỏ bằng CONFIG SET và trả lại như cũ ở cuối)
import Redis from 'ioredis';

const r = new Redis(6380);
const watcher = new Redis(6380); // kết nối thứ hai: đo xem Redis có trả lời kịp trong lúc bận không
const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));
const VAL = 'x'.repeat(1000); // mỗi giá trị ~1 KB
const info = async (field: string) => Number((await r.info('stats')).match(new RegExp(`${field}:(\\d+)`))![1]);

async function fill(prefix: string, n: number, ttl?: number, val = VAL) {
  for (let i = 0; i < n; i += 500) {
    const p = r.pipeline();
    for (let j = i; j < Math.min(n, i + 500); j++) ttl ? p.set(`${prefix}${j}`, val, 'EX', ttl) : p.set(`${prefix}${j}`, val);
    const res = await p.exec();
    const err = res!.find(([e]) => e)?.[0];
    if (err) return err.message;
  }
  return null;
}
// Đo độ trễ lớn nhất của PING (gửi mỗi 1ms) trong lúc chạy fn
async function worstPing(fn: () => Promise<unknown>) {
  let worst = 0, stop = false;
  const loop = (async () => { while (!stop) { const t = performance.now(); await watcher.ping(); worst = Math.max(worst, performance.now() - t); await sleep(1); } })();
  await sleep(20); const t = performance.now(); await fn(); const took = performance.now() - t;
  stop = true; await loop;
  return { took, worst };
}

await r.flushall();
await r.config('SET', 'maxmemory', '8mb');

console.log('1) maxmemory 8mb, policy noeviction (mặc định)');
await r.config('SET', 'maxmemory-policy', 'noeviction');
console.log(`   ghi 20.000 key 1 KB → ${await fill('k:', 20_000)}`);

console.log('2) 200 key "hot" được đọc liên tục, rồi một lượt quét 15.000 key "lạnh" chỉ đọc một lần');
for (const policy of ['allkeys-lru', 'allkeys-lfu']) {
  await r.flushall(); await r.config('SET', 'maxmemory-policy', policy);
  await fill('hot:', 200);
  for (let round = 0; round < 20; round++) { const p = r.pipeline(); for (let i = 0; i < 200; i++) p.get(`hot:${i}`); await p.exec(); }
  const evictedBefore = await info('evicted_keys');
  await fill('scan:', 15_000);   // ví dụ: job báo cáo đọc lướt toàn bộ catalog một lần
  const p = r.pipeline(); for (let i = 0; i < 200; i++) p.exists(`hot:${i}`);
  const alive = (await p.exec())!.reduce((a, [, v]) => a + Number(v), 0);
  console.log(`   ${policy}: Redis đẩy ra ${(await info('evicted_keys')) - evictedBefore} key, key hot còn lại ${alive}/200`);
}

console.log('3) Redis dùng chung: 3.000 session KHÔNG có TTL + cache CÓ TTL, policy volatile-lru');
await r.flushall(); await r.config('SET', 'maxmemory-policy', 'volatile-lru');
await fill('session:', 3000);
console.log(`   ghi 20.000 key cache (EX 300) → ${(await fill('cache:', 20_000, 300)) ?? 'ok'}`);
const ex = r.pipeline(); for (let i = 0; i < 3000; i++) ex.exists(`session:${i}`);
const sessions = (await ex.exec())!.reduce((a, [, v]) => a + Number(v), 0);
console.log(`   session còn ${sessions}/3000, cache còn ${await r.dbsize() - 3000}, bị đẩy ${await info('evicted_keys')}`);
console.log(`   ghi thêm 6.000 session không TTL → ${await fill('session2:', 6000)}`);

console.log('4) Key hết hạn được dọn kể cả khi không ai đọc tới');
await r.flushall(); await r.config('SET', 'maxmemory', '0'); await r.config('SET', 'maxmemory-policy', 'noeviction');
const exp0 = await info('expired_keys');
await fill('short:', 50_000, 1);
console.log(`   50.000 key TTL 1s vừa ghi: dbsize = ${await r.dbsize()}`);
await sleep(3000);
console.log(`   3 giây sau, không đọc key nào: dbsize = ${await r.dbsize()}, expired_keys tăng ${(await info('expired_keys')) - exp0}`);

console.log('5) Tìm key: KEYS chặn mọi người, SCAN đi từng bước');
await r.flushall();
await fill('product:', 1_000_000, undefined, '1');
let found = 0;
const keys = await worstPing(async () => { found = (await r.keys('product:1*')).length; });
console.log(`   KEYS product:1*  → ${found} key, mất ${keys.took.toFixed(0)}ms, PING chậm nhất ${keys.worst.toFixed(0)}ms`);
const scan = await worstPing(async () => {
  let cursor = '0'; found = 0;
  do { const [next, batch] = await r.scan(cursor, 'MATCH', 'product:1*', 'COUNT', 1000); cursor = next; found += batch.length; } while (cursor !== '0');
});
console.log(`   SCAN COUNT 1000  → ${found} key, mất ${scan.took.toFixed(0)}ms, PING chậm nhất ${scan.worst.toFixed(0)}ms`);

console.log('6) Xóa một key lớn (hash 1 triệu field): DEL chặn, UNLINK giải phóng ở luồng nền');
for (const cmd of ['del', 'unlink'] as const) {
  await r.eval("for i=1,1000000 do redis.call('HSET', KEYS[1], i, 'v') end", 1, 'big');
  const d = await worstPing(() => r[cmd]('big'));
  console.log(`   ${cmd.toUpperCase().padEnd(6)} → lệnh mất ${d.took.toFixed(0)}ms, PING chậm nhất ${d.worst.toFixed(0)}ms`);
}

console.log('7) TTL cho từng field của hash (Redis 7.4+)');
await r.flushall();
await r.hset('flags', 'dark-mode', 'on', 'new-checkout', 'off');
await r.call('HEXPIRE', 'flags', 2, 'FIELDS', 1, 'new-checkout');
console.log(`   HTTL: ${JSON.stringify(await r.call('HTTL', 'flags', 'FIELDS', 2, 'dark-mode', 'new-checkout'))} (−1 = không hết hạn)`);
await sleep(2500);
console.log(`   2,5 giây sau: ${JSON.stringify(await r.hgetall('flags'))}`);

await r.config('SET', 'maxmemory', '0'); await r.config('SET', 'maxmemory-policy', 'noeviction');
await r.flushall(); await r.quit(); await watcher.quit();
