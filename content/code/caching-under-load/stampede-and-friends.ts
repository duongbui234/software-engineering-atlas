// Cache dưới tải cao: bốn cách cache "thủng" và cách vá từng cái.
// Cache ở đây là một Map trong RAM có hạn dùng (đủ để thấy cơ chế, không cần Redis).
// Database giả mất 100ms mỗi query và đếm số query.
// Chạy: node stampede-and-friends.ts
import { createHash } from 'node:crypto';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
let seed = 7;
const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32 || 1e-9);

let dbQueries = 0;
let dbMs = 100;
const db = async (id: string) => { dbQueries++; await sleep(dbMs); return id.startsWith('ghost') ? null : `sp-${id}`; };

type Entry = { v: string | null; expiry: number; delta: number };
const cache = new Map<string, Entry>();
const fresh = (e: Entry | undefined) => e && e.expiry > performance.now();
async function recompute(key: string, ttlMs: number) {
  const t = performance.now(); const v = await db(key);
  cache.set(key, { v, expiry: performance.now() + ttlMs, delta: performance.now() - t });
  return v;
}

// 1) STAMPEDE: key hot vừa hết hạn, 500 request cùng tới
async function naive(key: string) { const e = cache.get(key); return fresh(e) ? e!.v : recompute(key, 1000); }
const inflight = new Map<string, Promise<string | null>>();
async function singleflight(key: string) {
  const e = cache.get(key); if (fresh(e)) return e!.v;
  if (!inflight.has(key)) inflight.set(key, recompute(key, 1000).finally(() => inflight.delete(key)));
  return inflight.get(key)!; // mọi người cùng chờ MỘT lần gọi DB
}
console.log('1) Stampede: 500 request cùng lúc vào key hot vừa hết hạn');
for (const [name, fn] of [['không làm gì', naive], ['singleflight', singleflight]] as const) {
  cache.clear(); dbQueries = 0;
  await Promise.all(Array.from({ length: 500 }, () => fn('hot')));
  console.log(`   ${name.padEnd(13)} → ${String(dbQueries).padStart(3)} query xuống DB`);
}

// 2) XFETCH: tính lại SỚM theo xác suất, trước khi hết hạn (Vattani và cộng sự, VLDB 2015)
//    điều kiện: now − delta · beta · ln(rand()) ≥ expiry   (ln(rand()) < 0 nên vế trái lớn hơn now)
async function xfetch(key: string, ttlMs: number, beta = 1) {
  const e = cache.get(key);
  if (!e || performance.now() - e.delta * beta * Math.log(rand()) >= e.expiry) return recompute(key, ttlMs);
  return e.v;
}
// Bản thực dụng: ai trúng xác suất thì khởi động MỘT lần làm mới ở nền (singleflight), vẫn trả giá trị đang có
async function xfetchBg(key: string, ttlMs: number, beta = 1) {
  const e = cache.get(key);
  if (e && performance.now() - e.delta * beta * Math.log(rand()) < e.expiry) return e.v;
  if (!inflight.has(key)) inflight.set(key, recompute(key, ttlMs).finally(() => inflight.delete(key)));
  return e && fresh(e) ? e.v : inflight.get(key)!;
}
async function steadyTraffic(fn: (k: string) => Promise<unknown>) {
  cache.clear(); dbQueries = 0;
  let waited = 0; const pending: Promise<unknown>[] = [];
  const end = performance.now() + 3500;
  while (performance.now() < end) {           // ~1 request mỗi 2ms trong 3,5 giây
    const t = performance.now();
    pending.push(fn('hot').then(() => { if (performance.now() - t > 50) waited++; }));
    await sleep(2);
  }
  await Promise.all(pending);
  return { queries: dbQueries, waited, total: pending.length };
}
console.log('2) Lưu lượng đều ~500 request/giây trong 3,5 giây, TTL 1 giây, DB mất 100ms');
for (const [name, fn] of [['TTL thường', (k: string) => naive(k)], ['XFetch beta=1', (k: string) => xfetch(k, 1000)],
  ['XFetch + singleflight ở nền', (k: string) => xfetchBg(k, 1000)]] as const) {
  const r = await steadyTraffic(fn);
  console.log(`   ${name.padEnd(27)} → ${String(r.queries).padStart(3)} query DB, ${String(r.waited).padStart(4)}/${r.total} request phải chờ DB`);
}

// 3) AVALANCHE: 2000 key được nạp cùng lúc với cùng TTL → hết hạn cùng lúc
async function avalanche(jitter: boolean) {
  cache.clear(); dbQueries = 0;
  const now = performance.now();
  for (let i = 0; i < 2000; i++) {
    const ttl = 1000 * (jitter ? 0.8 + 0.4 * rand() : 1); // jitter ±20%
    cache.set(`p${i}`, { v: 'x', expiry: now + ttl, delta: 100 });
  }
  const perBucket: number[] = [];
  for (let b = 0; b < 15; b++) {                  // 15 khoảng 100ms; mỗi khoảng đọc mọi key một lần
    const before = dbQueries;
    await Promise.all(Array.from({ length: 2000 }, (_, i) => naive(`p${i}`)));
    perBucket.push(dbQueries - before);
    await sleep(Math.max(0, now + (b + 1) * 100 - performance.now()));
  }
  return perBucket;
}
console.log('3) Avalanche: 2000 key nạp cùng lúc, TTL 1 giây; số query DB trong từng khoảng 100ms');
for (const j of [false, true]) {
  const p = await avalanche(j);
  console.log(`   ${(j ? 'TTL ± 20%' : 'TTL cố định').padEnd(13)} → đỉnh ${String(Math.max(...p)).padStart(4)} query/100ms  [${p.join(' ')}]`);
}

// 4) PENETRATION: hỏi những id KHÔNG tồn tại → cache không bao giờ trúng
class Bloom {
  m: number; k: number; bits: Uint8Array;
  constructor(m: number, k: number) { this.m = m; this.k = k; this.bits = new Uint8Array(Math.ceil(m / 8)); }
  private idx(s: string) {
    const h = createHash('sha256').update(s).digest();
    return Array.from({ length: this.k }, (_, i) => h.readUInt32BE(i * 4) % this.m);
  }
  add(s: string) { for (const i of this.idx(s)) this.bits[i >> 3] |= 1 << (i & 7); }
  has(s: string) { return this.idx(s).every((i) => this.bits[i >> 3] & (1 << (i & 7))); }
}
const bloom = new Bloom(96_000, 7); // 10.000 phần tử, ~1% dương tính giả: m ≈ 9,6 bit/phần tử, k = 7
for (let i = 0; i < 10_000; i++) bloom.add(`${i}`);
console.log('4) Penetration: 1000 request vào 200 id không tồn tại (ghost-*)');
dbMs = 1; // ở đây chỉ đếm query, không cần chờ thật
const ghosts = Array.from({ length: 1000 }, (_, i) => `ghost-${i % 200}`);
for (const mode of ['không làm gì', 'cache cả "không có"', 'Bloom filter'] as const) {
  cache.clear(); dbQueries = 0;
  for (const id of ghosts) {
    if (mode === 'Bloom filter' && !bloom.has(id)) continue; // chắc chắn không có → khỏi hỏi ai
    const e = cache.get(id);
    if (mode !== 'không làm gì' && fresh(e)) continue;      // negative cache trúng
    await recompute(id, mode === 'không làm gì' ? 0 : 30_000);
  }
  console.log(`   ${mode.padEnd(20)} → ${String(dbQueries).padStart(4)} query DB`);
}
let fp = 0;
for (let i = 0; i < 100_000; i++) if (bloom.has(`ghost-x${i}`)) fp++;
console.log(`   Bloom filter 12 KB cho 10.000 id thật: dương tính giả đo được ${(fp / 1000).toFixed(2)}% trên 100.000 id lạ`);
