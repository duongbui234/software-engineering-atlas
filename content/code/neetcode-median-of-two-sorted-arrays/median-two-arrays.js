// LeetCode 4, Median of Two Sorted Arrays: bốn cách, test và đối chiếu ngẫu nhiên.
// Chạy: node median-two-arrays.js

// Cách 1, trộn rồi lấy giữa: O(m + n) thời gian và bộ nhớ.
function mergeThenPick(a, b) {
  const all = [];
  let i = 0, j = 0;
  while (i < a.length || j < b.length) {
    if (j === b.length || (i < a.length && a[i] <= b[j])) all.push(a[i++]);
    else all.push(b[j++]);
  }
  const t = all.length;
  return t % 2 ? all[t >> 1] : (all[t / 2 - 1] + all[t / 2]) / 2;
}

// Cách 2, hai con trỏ: đi tới phần tử giữa, chỉ nhớ hai giá trị gần nhất.
function twoPointer(a, b) {
  const t = a.length + b.length;
  let i = 0, j = 0, prev = 0, cur = 0;
  for (let k = 0; k <= t >> 1; k++) {
    prev = cur;
    if (j === b.length || (i < a.length && a[i] <= b[j])) cur = a[i++];
    else cur = b[j++];
  }
  return t % 2 ? cur : (prev + cur) / 2;
}

// Cách 3, loại bỏ để tìm phần tử thứ k (k đếm từ 1).
function kth(a, b, k) {
  let i = 0, j = 0;
  while (true) {
    if (i === a.length) return b[j + k - 1];
    if (j === b.length) return a[i + k - 1];
    if (k === 1) return Math.min(a[i], b[j]);
    const h = k >> 1;
    const ni = Math.min(i + h, a.length) - 1, nj = Math.min(j + h, b.length) - 1;
    if (a[ni] <= b[nj]) { k -= ni - i + 1; i = ni + 1; }
    else { k -= nj - j + 1; j = nj + 1; }
  }
}
function kthElimination(a, b) {
  const t = a.length + b.length;
  return t % 2 ? kth(a, b, (t >> 1) + 1) : (kth(a, b, t / 2) + kth(a, b, t / 2 + 1)) / 2;
}

// Cách 4, chia đôi vị trí cắt trên mảng ngắn hơn. -Infinity và Infinity là phần tử canh.
function partition(a, b) {
  if (a.length > b.length) [a, b] = [b, a];
  const m = a.length, n = b.length, half = (m + n + 1) >> 1;
  let lo = 0, hi = m;
  while (lo <= hi) {
    const i = (lo + hi) >> 1, j = half - i;
    const aL = i > 0 ? a[i - 1] : -Infinity, aR = i < m ? a[i] : Infinity;
    const bL = j > 0 ? b[j - 1] : -Infinity, bR = j < n ? b[j] : Infinity;
    if (aL <= bR && bL <= aR) {
      return (m + n) % 2 ? Math.max(aL, bL) : (Math.max(aL, bL) + Math.min(aR, bR)) / 2;
    }
    if (aL > bR) hi = i - 1;
    else lo = i + 1;
  }
  throw new Error("mảng chưa sắp xếp");
}

const cases = [
  [[1, 3], [2], 2], [[1, 2], [3, 4], 2.5], [[], [1], 1], [[2], [], 2], [[], [2, 3], 2.5],
  [[-5, -3, -1], [-4, -2], -3], [[1, 1, 1], [1, 1], 1], [[1, 2, 3, 4, 5], [6, 7, 8, 9, 10, 11], 6],
  [[1, 2, 3, 4, 5, 6], [7], 4], [[-2, -1], [3], -1],
];
const fns = [mergeThenPick, twoPointer, kthElimination, partition];
for (const fn of fns) {
  const ok = cases.filter(([a, b, want]) => fn(a, b) === want).length;
  console.log(`${fn.name.padEnd(15)} ${ok}/${cases.length} ca đúng`);
}

// Đối chiếu ngẫu nhiên với cách ngây thơ: nối, sort (nhớ truyền hàm so sánh số), lấy giữa.
function bruteForce(a, b) {
  const all = [...a, ...b].sort((x, y) => x - y), t = all.length;
  return t % 2 ? all[t >> 1] : (all[t / 2 - 1] + all[t / 2]) / 2;
}
let seed = 42;
// Bộ sinh ngẫu nhiên mulberry32: trạng thái là số nguyên 32 bit, mọi phép nhân qua Math.imul nên không mất chính xác.
function mix32(a) { let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return (t ^ (t >>> 14)) >>> 0; }
const rnd = (k) => { seed = (seed + 0x6d2b79f5) | 0; return (mix32(seed) >>> 1) % k; };
const sortedRandom = (len) => Array.from({ length: len }, () => rnd(101) - 50).sort((x, y) => x - y);
const PAIRS = 100_000;
const wrong = fns.map(() => 0);
for (let p = 0; p < PAIRS; p++) {
  let a = sortedRandom(rnd(21)), b = sortedRandom(rnd(21));
  if (a.length + b.length === 0) a = [0];
  const want = bruteForce(a, b);
  fns.forEach((fn, k) => { if (fn(a, b) !== want) wrong[k]++; });
}
console.log(`\nĐối chiếu với nối rồi sort, ${PAIRS} cặp ngẫu nhiên:`);
fns.forEach((fn, k) => console.log(`${fn.name.padEnd(15)} sai ${wrong[k]} cặp`));
console.log("\n[10, 9, 1].sort() =", JSON.stringify([10, 9, 1].sort()), " (so như chuỗi)");
