// Vận hành cache: đọc hit ratio, và chuyện gì xảy ra khi chính cache sập.
// Chạy: docker run -d --rm --name atlas-redis -p 6380:6379 redis:8
//       npm i ioredis && node hit-ratio-and-failover.ts
import Redis from 'ioredis';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
let dbQueries = 0;
const db = async (id: string) => { dbQueries++; await sleep(20); return `sp-${id}`; };

// 1) Hit ratio: Redis chỉ đếm chung cho cả instance; ứng dụng nên tự đếm theo từng loại cache
const r = new Redis(6380);
await r.flushall(); await r.config('RESETSTAT');
const mine = { hit: 0, miss: 0 };
for (let i = 0; i < 2000; i++) {
  const id = String(Math.floor(Math.random() ** 3 * 500)); // vài sản phẩm được xem nhiều
  if ((await r.get(`p:${id}`)) !== null) { mine.hit++; continue; }
  mine.miss++; await r.set(`p:${id}`, await db(id), 'EX', 60);
}
for (let i = 0; i < 2000; i++) await r.get(`session:${i}`); // một tính năng khác chỉ toàn trượt
const stats = await r.info('stats');
const n = (f: string) => Number(stats.match(new RegExp(`${f}:(\\d+)`))![1]);
console.log('1) Hit ratio');
console.log(`   Redis INFO: keyspace_hits=${n('keyspace_hits')} keyspace_misses=${n('keyspace_misses')} → ${(100 * n('keyspace_hits') / (n('keyspace_hits') + n('keyspace_misses'))).toFixed(1)}% (trộn mọi tính năng)`);
console.log(`   ứng dụng tự đếm cache sản phẩm: ${mine.hit} trúng / ${mine.miss} trượt → ${(100 * mine.hit / 2000).toFixed(1)}%`);
r.disconnect();

// 2) Redis sập. Client mặc định của ioredis xếp lệnh vào hàng chờ và thử nối lại → request treo.
const dead = new Redis(6399, { lazyConnect: true }); // không có Redis nào ở cổng 6399
dead.on('error', () => {});
console.log('2) Redis không trả lời');
let t = performance.now();
const naive = await Promise.race([dead.get('p:1').then(() => 'trả lời'), sleep(3000).then(() => 'vẫn chờ sau 3 giây')]).catch((e) => `lỗi: ${e.message}`);
console.log(`   client mặc định: ${naive} (${(performance.now() - t).toFixed(0)}ms)`);
dead.disconnect();

// Bọc cache: hết 50ms thì coi như trượt và đọc DB (fail-open); lỗi liên tiếp thì tạm bỏ qua cache 5 giây
const fast = new Redis(6399, { lazyConnect: true, enableOfflineQueue: false, maxRetriesPerRequest: 0, connectTimeout: 200 });
fast.on('error', () => {});
let failures = 0, skipUntil = 0;
async function cachedGet(id: string) {
  if (Date.now() < skipUntil) return db(id);                 // "cầu dao" đang ngắt: khỏi hỏi cache
  try {
    const v = await Promise.race([fast.get(`p:${id}`), sleep(50).then(() => { throw new Error('timeout'); })]);
    failures = 0; if (v !== null) return v;
  } catch { if (++failures >= 3) skipUntil = Date.now() + 5000; }
  return db(id);
}
dbQueries = 0; t = performance.now();
const results = await Promise.all(Array.from({ length: 200 }, (_, i) => cachedGet(String(i % 20))));
console.log(`   bọc timeout 50ms + bỏ qua cache khi lỗi: ${results.length} request xong sau ${(performance.now() - t).toFixed(0)}ms, nhưng DB nhận ${dbQueries} query`);
console.log('   (cache sập = toàn bộ tải dồn về DB; DB phải chịu được, hoặc phải giới hạn tải)');
fast.disconnect();
