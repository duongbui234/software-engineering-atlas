// LeetCode 4, Median of Two Sorted Arrays: bốn cách, ba bản sai, test, đối chiếu ngẫu nhiên và đo.
// Chạy: node median-two-arrays.ts

let steps = 0; // đếm số vòng lặp của hai cách logarit

// Cách 1, trộn rồi lấy giữa: O(m + n) thời gian, O(m + n) bộ nhớ.
function mergeThenPick(a: number[], b: number[]): number {
  const all: number[] = [];
  let i = 0, j = 0;
  while (i < a.length || j < b.length) {
    if (j === b.length || (i < a.length && a[i] <= b[j])) all.push(a[i++]);
    else all.push(b[j++]);
  }
  const t = all.length;
  return t % 2 ? all[t >> 1] : (all[t / 2 - 1] + all[t / 2]) / 2;
}

// Cách 2, hai con trỏ không trộn: đi tới phần tử giữa, chỉ nhớ hai giá trị gần nhất. O(m + n) thời gian, O(1) bộ nhớ.
function twoPointer(a: number[], b: number[]): number {
  const t = a.length + b.length;
  let i = 0, j = 0, prev = 0, cur = 0;
  for (let k = 0; k <= t >> 1; k++) {
    prev = cur;
    if (j === b.length || (i < a.length && a[i] <= b[j])) cur = a[i++];
    else cur = b[j++];
  }
  return t % 2 ? cur : (prev + cur) / 2;
}

// Cách 3, loại bỏ để tìm phần tử thứ k: mỗi bước bỏ k/2 phần tử chắc chắn đứng trước phần tử thứ k. O(log(m + n)).
function kth(a: number[], b: number[], k: number): number {
  let i = 0, j = 0; // a[i..] và b[j..] là phần còn lại; k đếm từ 1
  while (true) {
    steps++;
    if (i === a.length) return b[j + k - 1];
    if (j === b.length) return a[i + k - 1];
    if (k === 1) return Math.min(a[i], b[j]);
    const h = k >> 1;
    const ni = Math.min(i + h, a.length) - 1, nj = Math.min(j + h, b.length) - 1;
    if (a[ni] <= b[nj]) { k -= ni - i + 1; i = ni + 1; } // a[i..ni] đều đứng trước phần tử thứ k: bỏ
    else { k -= nj - j + 1; j = nj + 1; }
  }
}
function kthElimination(a: number[], b: number[]): number {
  const t = a.length + b.length;
  return t % 2 ? kth(a, b, (t >> 1) + 1) : (kth(a, b, t / 2) + kth(a, b, t / 2 + 1)) / 2;
}

// Cách 4, chia đôi vị trí cắt trên mảng ngắn hơn: O(log min(m, n)).
// Cắt a ở i và b ở j = half − i sao cho nửa trái có half phần tử; cắt đúng khi aL ≤ bR và bL ≤ aR.
function partition(a: number[], b: number[]): number {
  if (a.length > b.length) [a, b] = [b, a]; // luôn chia đôi trên mảng ngắn hơn, để j = half − i luôn nằm trong [0, n]
  const m = a.length, n = b.length, half = (m + n + 1) >> 1;
  let lo = 0, hi = m;
  while (lo <= hi) {
    steps++;
    const i = (lo + hi) >> 1, j = half - i;
    const aL = i > 0 ? a[i - 1] : -Infinity, aR = i < m ? a[i] : Infinity; // phần tử canh: cạnh rỗng không bao giờ cản
    const bL = j > 0 ? b[j - 1] : -Infinity, bR = j < n ? b[j] : Infinity;
    if (aL <= bR && bL <= aR) {
      return (m + n) % 2 ? Math.max(aL, bL) : (Math.max(aL, bL) + Math.min(aR, bR)) / 2;
    }
    if (aL > bR) hi = i - 1; // cắt a quá phải
    else lo = i + 1; // cắt a quá trái
  }
  throw new Error("mảng chưa sắp xếp");
}

// SAI: không đổi chỗ để chia đôi trên mảng ngắn hơn. Khi a dài hơn, j = half − i có thể âm và b[j] là undefined.
function partitionNoSwap(a: number[], b: number[]): number {
  const m = a.length, n = b.length, half = (m + n + 1) >> 1;
  let lo = 0, hi = m;
  while (lo <= hi) {
    const i = (lo + hi) >> 1, j = half - i;
    if (j < 0 || j > n) throw new Error(`j = ${j} ra ngoài b`); // Java ném ArrayIndexOutOfBoundsException ở đây
    const aL = i > 0 ? a[i - 1] : -Infinity, aR = i < m ? a[i] : Infinity;
    const bL = j > 0 ? b[j - 1] : -Infinity, bR = j < n ? b[j] : Infinity;
    if (aL <= bR && bL <= aR) return (m + n) % 2 ? Math.max(aL, bL) : (Math.max(aL, bL) + Math.min(aR, bR)) / 2;
    if (aL > bR) hi = i - 1; else lo = i + 1;
  }
  throw new Error("không tìm được vị trí cắt");
}

// SAI: dùng 0 làm phần tử canh thay cho ±Infinity. Đúng khi mọi số dương, sai khi có số âm.
function partitionZeroSentinel(a: number[], b: number[]): number {
  if (a.length > b.length) [a, b] = [b, a];
  const m = a.length, n = b.length, half = (m + n + 1) >> 1;
  let lo = 0, hi = m;
  while (lo <= hi) {
    const i = (lo + hi) >> 1, j = half - i;
    const aL = i > 0 ? a[i - 1] : 0, aR = i < m ? a[i] : Infinity;
    const bL = j > 0 ? b[j - 1] : 0, bR = j < n ? b[j] : Infinity;
    if (aL <= bR && bL <= aR) return (m + n) % 2 ? Math.max(aL, bL) : (Math.max(aL, bL) + Math.min(aR, bR)) / 2;
    if (aL > bR) hi = i - 1; else lo = i + 1;
  }
  throw new Error("không tìm được vị trí cắt");
}

// SAI: chia nguyên khi tổng chẵn, như (x + y) / 2 với hai int trong Java hay // trong Python.
function partitionIntMedian(a: number[], b: number[]): number {
  if (a.length > b.length) [a, b] = [b, a];
  const m = a.length, n = b.length, half = (m + n + 1) >> 1;
  let lo = 0, hi = m;
  while (lo <= hi) {
    const i = (lo + hi) >> 1, j = half - i;
    const aL = i > 0 ? a[i - 1] : -Infinity, aR = i < m ? a[i] : Infinity;
    const bL = j > 0 ? b[j - 1] : -Infinity, bR = j < n ? b[j] : Infinity;
    if (aL <= bR && bL <= aR) return (m + n) % 2 ? Math.max(aL, bL) : Math.trunc((Math.max(aL, bL) + Math.min(aR, bR)) / 2);
    if (aL > bR) hi = i - 1; else lo = i + 1;
  }
  throw new Error("không tìm được vị trí cắt");
}

const cases: [number[], number[], number][] = [
  [[1, 3], [2], 2], [[1, 2], [3, 4], 2.5], [[], [1], 1], [[2], [], 2], [[], [2, 3], 2.5],
  [[-5, -3, -1], [-4, -2], -3], [[1, 1, 1], [1, 1], 1], [[1, 2, 3, 4, 5], [6, 7, 8, 9, 10, 11], 6],
  [[1, 2, 3, 4, 5, 6], [7], 4], [[-2, -1], [3], -1],
];
const fns = [mergeThenPick, twoPointer, kthElimination, partition, partitionNoSwap, partitionZeroSentinel, partitionIntMedian];
const run = (fn: (a: number[], b: number[]) => number, a: number[], b: number[]) => {
  try { return fn(a, b); } catch (e) { return (e as Error).message; }
};
for (const fn of fns) {
  const bad = cases.filter(([a, b, want]) => run(fn, a, b) !== want).map(([a, b]) => `${JSON.stringify(a)} ${JSON.stringify(b)} → ${run(fn, a, b)}`);
  console.log(`${fn.name.padEnd(21)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(", ") : ""}`);
}

// Đối chiếu ngẫu nhiên với cách ngây thơ (nối rồi sort): 10⁵ cặp, mỗi mảng 0..20 phần tử, giá trị trong [-50, 50].
let seed = 42;
// Bộ sinh ngẫu nhiên mulberry32: trạng thái là số nguyên 32 bit, mọi phép nhân qua Math.imul nên không mất chính xác.
function mix32(a: number): number { let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return (t ^ (t >>> 14)) >>> 0; }
const rnd = (k: number) => { seed = (seed + 0x6d2b79f5) | 0; return (mix32(seed) >>> 1) % k; };
const sortedRandom = (len: number) => Array.from({ length: len }, () => rnd(101) - 50).sort((x, y) => x - y);
// Cách ngây thơ để đối chiếu: nối hai mảng, sort lại, lấy giữa.
function bruteForce(a: number[], b: number[]): number {
  const all = [...a, ...b].sort((x, y) => x - y), t = all.length;
  return t % 2 ? all[t >> 1] : (all[t / 2 - 1] + all[t / 2]) / 2;
}
const wrong = new Map(fns.map((f) => [f.name, 0]));
const PAIRS = 100_000;
for (let p = 0; p < PAIRS; p++) {
  let a = sortedRandom(rnd(21)), b = sortedRandom(rnd(21));
  if (a.length + b.length === 0) a = [0];
  const want = bruteForce(a, b);
  for (const fn of fns) if (run(fn, a, b) !== want) wrong.set(fn.name, wrong.get(fn.name)! + 1);
}
console.log(`\nĐối chiếu với nối rồi sort, ${PAIRS} cặp ngẫu nhiên:`);
for (const [name, w] of wrong) console.log(`${name.padEnd(21)} sai ${w} cặp`);

// Đo: hai mảng ngẫu nhiên đã sắp xếp. Trung vị 7 lần.
const median = (xs: number[]) => xs.sort((x, y) => x - y)[xs.length >> 1];
const bigSorted = (len: number) => { const r = new Float64Array(len); for (let i = 0; i < len; i++) r[i] = rnd(1_000_000_000); return Array.from(r.sort()); };
function time(fn: (a: number[], b: number[]) => number, a: number[], b: number[], reps: number) {
  const ts: number[] = [];
  for (let r = 0; r < 7; r++) {
    const t = performance.now();
    for (let k = 0; k < reps; k++) fn(a, b);
    ts.push(((performance.now() - t) / reps) * 1000);
  }
  return median(ts);
}
console.log("\nm          n          trộn (µs)  hai con trỏ (µs)  thứ k (µs)  cắt (µs)  bước thứ k  bước cắt");
for (const [m, n] of [[1_000, 1_000], [100_000, 100_000], [1_000_000, 1_000_000], [10, 1_000_000]]) {
  const a = bigSorted(m), b = bigSorted(n);
  const lin = m + n > 200_000 ? 20 : 200;
  steps = 0; kthElimination(a, b); const sk = steps;
  steps = 0; partition(a, b); const sp = steps;
  console.log(`${String(m).padEnd(10)} ${String(n).padEnd(10)} ${time(mergeThenPick, a, b, lin).toFixed(1).padStart(9)} ${time(twoPointer, a, b, lin).toFixed(1).padStart(17)} ${time(kthElimination, a, b, 100_000).toFixed(3).padStart(11)} ${time(partition, a, b, 100_000).toFixed(3).padStart(9)} ${String(sk).padStart(11)} ${String(sp).padStart(9)}`);
}
