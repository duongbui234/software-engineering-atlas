// Cache nhỏ mà vẫn trúng nhiều: vì người dùng không đọc đều mọi thứ.
// Mô phỏng 10.000 sản phẩm, 200.000 lượt xem. Lượt xem theo phân phối Zipf
// (vài sản phẩm "hot" chiếm phần lớn lượt xem), so với phân phối đều để đối chiếu.
// Cache LRU giữ N sản phẩm gần dùng nhất. Đọc cache tốn 0,5ms, đọc DB tốn 20ms.
// Chạy: node hit-ratio.ts   (không cần Redis)

const ITEMS = 10_000;
const REQUESTS = 200_000;
const CACHE_MS = 0.5;
const DB_MS = 20;

// Bộ sinh số ngẫu nhiên có hạt giống: chạy lại ra đúng kết quả cũ
let seed = 42;
const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32);

// Zipf(s=1): sản phẩm thứ k được xem với xác suất tỉ lệ 1/k
const weights = Array.from({ length: ITEMS }, (_, k) => 1 / (k + 1));
const total = weights.reduce((a, b) => a + b, 0);
const cdf: number[] = [];
weights.reduce((acc, w, i) => (cdf[i] = acc + w / total), 0);
function zipf(): number {
  const u = rand();
  let lo = 0, hi = ITEMS - 1;
  while (lo < hi) { const mid = (lo + hi) >> 1; if (cdf[mid] < u) lo = mid + 1; else hi = mid; }
  return lo;
}
const uniform = () => Math.floor(rand() * ITEMS);

// LRU tối giản: Map giữ thứ tự chèn, đọc thì đưa lên cuối, đầy thì bỏ phần tử đầu
function simulate(size: number, next: () => number) {
  const lru = new Map<number, true>();
  let hits = 0;
  for (let i = 0; i < REQUESTS; i++) {
    const id = next();
    if (lru.has(id)) { hits++; lru.delete(id); lru.set(id, true); continue; }
    lru.set(id, true);
    if (lru.size > size) lru.delete(lru.keys().next().value!);
  }
  const ratio = hits / REQUESTS;
  return { ratio, avgMs: ratio * CACHE_MS + (1 - ratio) * (CACHE_MS + DB_MS) };
}

console.log('cache giữ    | % catalog | Zipf: trúng  TB/request | Đều: trúng  TB/request');
for (const size of [10, 100, 500, 1000, 5000]) {
  seed = 42; const z = simulate(size, zipf);
  seed = 42; const u = simulate(size, uniform);
  console.log(
    `${String(size).padStart(5)} món   | ${String((size / ITEMS) * 100).padStart(6)}%   |` +
    `   ${(z.ratio * 100).toFixed(1).padStart(5)}%   ${z.avgMs.toFixed(1).padStart(5)}ms   |` +
    `  ${(u.ratio * 100).toFixed(1).padStart(5)}%   ${u.avgMs.toFixed(1).padStart(5)}ms`,
  );
}
