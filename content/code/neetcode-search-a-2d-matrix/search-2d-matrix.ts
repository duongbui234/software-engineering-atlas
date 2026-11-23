// LeetCode 74, Search a 2D Matrix: bốn cách, hai bản sai, test và đo.
// Chạy: node search-2d-matrix.ts

// Cách 1, quét hết: O(m·n).
function linearScan(matrix: number[][], target: number): boolean {
  for (const row of matrix) for (const x of row) if (x === target) return true;
  return false;
}

// Cách 2, hai lần chia đôi: tìm hàng cuối cùng có phần tử đầu ≤ target, rồi chia đôi trong hàng đó.
function twoBinarySearch(matrix: number[][], target: number): boolean {
  let lo = 0, hi = matrix.length; // nửa mở [lo, hi): đếm số hàng có phần tử đầu ≤ target
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (matrix[mid][0] <= target) lo = mid + 1;
    else hi = mid;
  }
  const r = lo - 1; // hàng cuối cùng có phần tử đầu ≤ target
  if (r < 0) return false; // target nhỏ hơn mọi phần tử
  const row = matrix[r];
  let a = 0, b = row.length;
  while (a < b) {
    const mid = (a + b) >>> 1;
    if (row[mid] < target) a = mid + 1;
    else b = mid;
  }
  return a < row.length && row[a] === target;
}

// Cách 3, một lần chia đôi trên chỉ số phẳng k ∈ [0, m·n): hàng = ⌊k/n⌋, cột = k mod n (n là số CỘT).
function flatBinarySearch(matrix: number[][], target: number): boolean {
  const m = matrix.length, n = matrix[0].length;
  let lo = 0, hi = m * n;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    const x = matrix[Math.floor(mid / n)][mid % n];
    if (x === target) return true;
    if (x < target) lo = mid + 1;
    else hi = mid;
  }
  return false;
}

// Cách 4, bậc thang từ góc trên phải: lớn hơn target thì sang trái, nhỏ hơn thì xuống. O(m + n).
function staircase(matrix: number[][], target: number): boolean {
  let r = 0, c = matrix[0].length - 1;
  while (r < matrix.length && c >= 0) {
    const x = matrix[r][c];
    if (x === target) return true;
    if (x > target) c--;
    else r++;
  }
  return false;
}

// SAI: lấy lo (hàng đầu tiên có phần tử đầu > target) thay vì lo − 1.
function wrongRowPick(matrix: number[][], target: number): boolean {
  let lo = 0, hi = matrix.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (matrix[mid][0] <= target) lo = mid + 1;
    else hi = mid;
  }
  if (lo >= matrix.length) return false;
  return matrix[lo].includes(target);
}

// SAI: chia chỉ số phẳng cho số HÀNG m thay vì số cột n. Đúng khi ma trận vuông, sai khi m ≠ n.
function wrongFlatIndex(matrix: number[][], target: number): boolean {
  const m = matrix.length;
  let lo = 0, hi = m * matrix[0].length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    const x = matrix[Math.floor(mid / m)]?.[mid % m];
    if (x === target) return true;
    if (x !== undefined && x < target) lo = mid + 1;
    else hi = mid;
  }
  return false;
}

const ex = [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]];
const cases: [string, number[][], number, boolean][] = [
  ["ví dụ → 3", ex, 3, true], ["ví dụ → 13", ex, 13, false], ["ví dụ → 60 (cuối)", ex, 60, true],
  ["ví dụ → 23 (đầu hàng cuối)", ex, 23, true], ["ví dụ → 0 (nhỏ hơn hết)", ex, 0, false],
  ["ví dụ → 61 (lớn hơn hết)", ex, 61, false], ["[[1]] → 1", [[1]], 1, true], ["[[1]] → 2", [[1]], 2, false],
  ["một cột [[1],[3]] → 3", [[1], [3]], 3, true], ["vuông [[1,2],[3,4]] → 4", [[1, 2], [3, 4]], 4, true],
];
const fns = { linearScan, twoBinarySearch, flatBinarySearch, staircase, wrongRowPick, wrongFlatIndex };
for (const [name, fn] of Object.entries(fns)) {
  const bad = cases.filter(([, m, t, want]) => fn(m, t) !== want).map(([d]) => d);
  console.log(`${name.padEnd(17)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở: " + bad.join(", ") : ""}`);
}

// Đo: ma trận m × n, giá trị 2·k (chỉ số chẵn), truy vấn ngẫu nhiên (nửa có, nửa không).
// Bộ sinh ngẫu nhiên mulberry32: trạng thái là số nguyên 32 bit, mọi phép nhân qua Math.imul nên không mất chính xác.
function mix32(a: number): number { let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return (t ^ (t >>> 14)) >>> 0; }
const rand = (() => { let s = 12345; return () => ((s = (s + 0x6d2b79f5) | 0), mix32(s) >>> 1) / 2 ** 31; })();
const make = (m: number, n: number) => Array.from({ length: m }, (_, r) => Array.from({ length: n }, (_, c) => 2 * (r * n + c)));
const time = (fn: (m: number[][], t: number) => boolean, mat: number[][], qs: number[]) => {
  const ts: number[] = [];
  for (let k = 0; k < 5; k++) { const t0 = performance.now(); let hit = 0; for (const q of qs) if (fn(mat, q)) hit++; ts.push(performance.now() - t0); if (hit < 0) console.log(hit); }
  return ts.sort((a, b) => a - b)[2];
};
console.log("\nm × n          truy vấn  quét hết   hai lần chia đôi  chia đôi phẳng  bậc thang   (ms, trung vị 5 lần)");
for (const [m, n, q] of [[100, 100, 10_000], [1000, 1000, 10_000], [10, 100_000, 10_000], [100_000, 10, 10_000]] as const) {
  const mat = make(m, n);
  const qs = Array.from({ length: q }, () => Math.floor(rand() * 2 * m * n));
  const lin = m * n <= 10_000 ? time(linearScan, mat, qs).toFixed(1) : "—";
  console.log(`${(m + " × " + n).padEnd(14)} ${String(q).padStart(8)} ${lin.padStart(9)} ${time(twoBinarySearch, mat, qs).toFixed(2).padStart(17)} ${time(flatBinarySearch, mat, qs).toFixed(2).padStart(15)} ${time(staircase, mat, qs).toFixed(2).padStart(11)}`);
}
