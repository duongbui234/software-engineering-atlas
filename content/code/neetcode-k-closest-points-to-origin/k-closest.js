// LeetCode 973, K Closest Points to Origin: sắp xếp và quickselect trên mảng điểm, không cần heap.
// Chạy: node k-closest.js

const dist2 = ([x, y]) => x * x + y * y;

function sortAll(points, k) {
  return [...points].sort((a, b) => dist2(a) - dist2(b)).slice(0, k);
}

// Quickselect chia ba phần quanh chốt ngẫu nhiên, đổi chỗ ngay trên bản sao của mảng điểm.
function quickselect(points, k) {
  const a = [...points];
  let lo = 0, hi = a.length - 1;
  while (lo < hi) {
    const pivot = dist2(a[lo + Math.floor(Math.random() * (hi - lo + 1))]);
    let lt = lo, i = lo, gt = hi;
    while (i <= gt) {
      const d = dist2(a[i]);
      if (d < pivot) { [a[lt], a[i]] = [a[i], a[lt]]; lt++; i++; }
      else if (d > pivot) { [a[i], a[gt]] = [a[gt], a[i]]; gt--; }
      else i++;
    }
    if (k <= lt) hi = lt - 1;
    else if (k > gt + 1) lo = gt + 1;
    else break;
  }
  return a.slice(0, k);
}

const norm = (ps) => ps.map((p) => p.join(",")).sort().join(" ");
const cases = [
  [[[1, 3], [-2, 2]], 1, [[-2, 2]]],
  [[[3, 3], [5, -1], [-2, 4]], 2, [[3, 3], [-2, 4]]],
  [[[0, 0]], 1, [[0, 0]]],
  [[[1, 0], [0, 1], [2, 2], [-1, -1]], 3, [[1, 0], [0, 1], [-1, -1]]],
  [[[1, 1], [2, 2], [3, 3]], 3, [[1, 1], [2, 2], [3, 3]]],
  [[[-5, -5], [4, 4], [-1, 0], [10, -10]], 2, [[-1, 0], [4, 4]]],
  [[[10000, 10000], [-10000, -10000], [1, 1]], 1, [[1, 1]]],
  [[[2, 2], [1, 1], [3, 3], [0, 1], [5, 0]], 2, [[0, 1], [1, 1]]],
];
for (const fn of [sortAll, quickselect]) {
  const ok = cases.filter(([p, k, want]) => norm(fn(p, k)) === norm(want)).length;
  console.log(`${fn.name.padEnd(11)} ${ok}/${cases.length} ca đúng`);
}

// Đo: n = 10⁶ điểm, toạ độ -10⁴..10⁴, trung vị 5 lần.
let seed = 973;
const rand = () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const pts = Array.from({ length: 1e6 }, () => [Math.floor(rand() * 20001) - 10000, Math.floor(rand() * 20001) - 10000]);
for (const fn of [sortAll, quickselect]) {
  const ts = [];
  for (let r = 0; r < 5; r++) { const t0 = performance.now(); fn(pts, 1000); ts.push(performance.now() - t0); }
  console.log(`k = 1000: ${fn.name.padEnd(11)} ${ts.sort((a, b) => a - b)[2].toFixed(0)} ms`);
}
