// LeetCode 128, Longest Consecutive Sequence: ba cách, test, rồi đo.
// Chạy: node longest-consecutive.ts

// Cách 1, vét cạn: với mỗi x, tìm x+1, x+2… bằng cách duyệt lại cả mảng. O(n³) ở ca tệ nhất.
function bruteForce(nums: number[]): number {
  let best = 0;
  for (const x of nums) {
    let len = 1;
    while (nums.includes(x + len)) len++; // includes duyệt cả mảng: O(n) mỗi lần
    best = Math.max(best, len);
  }
  return best;
}

// Cách 2, sắp xếp rồi quét: số liên tiếp nằm cạnh nhau sau khi sắp xếp. O(n log n).
function sortScan(nums: number[]): number {
  if (nums.length === 0) return 0;
  const a = [...nums].sort((p, q) => p - q); // sao chép: không sửa mảng của người gọi; PHẢI có hàm so sánh
  let best = 1, len = 1;
  for (let i = 1; i < a.length; i++) {
    if (a[i] === a[i - 1]) continue; // số trùng: bỏ qua, KHÔNG đứt dãy
    len = a[i] === a[i - 1] + 1 ? len + 1 : 1;
    best = Math.max(best, len);
  }
  return best;
}

// Cách 3, hash set: chỉ đếm từ đầu dãy (x - 1 không có trong set). O(n).
function hashSet(nums: number[]): number {
  const all = new Set(nums);
  let best = 0;
  for (const x of all) {
    if (all.has(x - 1)) continue;
    let len = 1;
    while (all.has(x + len)) len++;
    best = Math.max(best, len);
  }
  return best;
}

// Hai bản sai hay gặp, để test chỉ ra chỗ sai.
function sortScanResetOnDuplicate(nums: number[]): number { // coi số trùng là đứt dãy
  if (nums.length === 0) return 0;
  const a = [...nums].sort((p, q) => p - q);
  let best = 1, len = 1;
  for (let i = 1; i < a.length; i++) {
    len = a[i] === a[i - 1] + 1 ? len + 1 : 1;
    best = Math.max(best, len);
  }
  return best;
}
function sortScanNoComparator(nums: number[]): number { // sort() không hàm so sánh: so theo CHUỖI
  if (nums.length === 0) return 0;
  const a = [...nums].sort();
  let best = 1, len = 1;
  for (let i = 1; i < a.length; i++) {
    if (a[i] === a[i - 1]) continue;
    len = a[i] === a[i - 1] + 1 ? len + 1 : 1;
    best = Math.max(best, len);
  }
  return best;
}

const cases: [number[], number][] = [
  [[100, 4, 200, 1, 3, 2], 4],
  [[0, 3, 7, 2, 5, 8, 4, 6, 0, 1], 9],
  [[1, 0, 1, 2], 3],
  [[], 0],
  [[7], 1],
  [[-3, -1, -2, 5], 3],
  [[9, 10, 8], 3],
];
const fns = { bruteForce, sortScan, hashSet, sortScanResetOnDuplicate, sortScanNoComparator };
for (const [name, fn] of Object.entries(fns)) {
  const bad = cases.filter(([nums, want]) => fn(nums) !== want);
  console.log(`${name.padEnd(25)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? `; sai ở ${bad.map(([n]) => JSON.stringify(n)).join(" ")}` : ""}`);
}

// Đo: trung vị 5 lần.
function median(fn: () => void): number {
  const t: number[] = [];
  for (let k = 0; k < 5; k++) { const s = performance.now(); fn(); t.push(performance.now() - s); }
  return t.sort((a, b) => a - b)[2];
}
let seed = 42;
// Bộ sinh ngẫu nhiên mulberry32: trạng thái là số nguyên 32 bit, mọi phép nhân qua Math.imul nên không mất chính xác.
function mix32(a: number): number { let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return (t ^ (t >>> 14)) >>> 0; }
const rand = () => (((seed = (seed + 0x6d2b79f5) | 0), mix32(seed) >>> 1) / 2147483648);
const shuffle = (a: number[]) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

// Vét cạn trên một dãy dài (ca tệ nhất): n gấp đôi thì thời gian gấp khoảng 8, đúng dáng O(n³).
console.log("\nvét cạn, một dãy dài xáo trộn (ms, một lần chạy)");
for (const n of [250, 500, 1_000, 2_000]) {
  const nums = shuffle(Array.from({ length: n }, (_, i) => i));
  const s = performance.now();
  bruteForce(nums);
  console.log(`n = ${String(n).padEnd(6)} ${(performance.now() - s).toFixed(1).padStart(8)}`);
}

console.log("\nn          dữ liệu           sắp xếp  hash set   (ms, trung vị 5 lần)");
for (const n of [10_000, 100_000, 1_000_000]) {
  const inputs: [string, number[]][] = [
    ["ngẫu nhiên ±10⁹", Array.from({ length: n }, () => Math.floor(rand() * 2e9) - 1e9)],
    ["một dãy dài", shuffle(Array.from({ length: n }, (_, i) => i))],
  ];
  for (const [label, nums] of inputs) {
    console.log(`${String(n).padEnd(10)} ${label.padEnd(16)} ${median(() => sortScan(nums)).toFixed(2).padStart(9)} ${median(() => hashSet(nums)).toFixed(2).padStart(9)}`);
  }
}
