// LeetCode 153, Find Minimum in Rotated Sorted Array: ba cách, hai bản sai, test và đo.
// Chạy: node find-min-rotated.ts

// Cách 1, quét tuyến tính: O(n). Đúng, nhưng đề đòi O(log n).
function linearScan(nums: number[]): number {
  let min = nums[0];
  for (const x of nums) if (x < min) min = x;
  return min;
}

// Cách 2, chia đôi so với nums[hi]. Bất biến: phần tử nhỏ nhất luôn nằm trong [lo, hi].
function binaryVsHi(nums: number[]): number {
  let lo = 0, hi = nums.length - 1;
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] > nums[hi]) lo = mid + 1; // mid ở nửa "cao" bên trái điểm gãy: min nằm hẳn bên phải mid
    else hi = mid; // nums[mid] < nums[hi]: đoạn [mid, hi] tăng dần, min là mid hoặc ở bên trái
  }
  return nums[lo];
}

// Cách 3, tìm điểm gãy bằng cách so với nums[0]: phần tử đầu tiên nhỏ hơn nums[0].
function binaryVsFirst(nums: number[]): number {
  if (nums[0] <= nums[nums.length - 1]) return nums[0]; // không xoay (hoặc xoay đủ vòng): min ở đầu
  let lo = 0, hi = nums.length - 1;
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] >= nums[0]) lo = mid + 1;
    else hi = mid;
  }
  return nums[lo];
}

// SAI: so với nums[lo] mà không kiểm ca không xoay. Với mảng tăng dần, nó luôn đi sang phải và trả phần tử lớn nhất.
function wrongVsLo(nums: number[]): number {
  let lo = 0, hi = nums.length - 1;
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] >= nums[lo]) lo = mid + 1;
    else hi = mid;
  }
  return nums[lo];
}

// SAI: dùng lo <= hi và hi = mid: khi lo == hi thì mid == hi, vòng lặp không bao giờ dừng. Có giới hạn bước để báo lỗi.
function wrongLoopCondition(nums: number[]): number {
  let lo = 0, hi = nums.length - 1, steps = 0;
  while (lo <= hi) {
    if (++steps > 100) throw new Error("lặp vô hạn");
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] > nums[hi]) lo = mid + 1;
    else hi = mid;
  }
  return nums[lo];
}

// LeetCode 154 (có số trùng): khi nums[mid] == nums[hi] không biết min ở bên nào, chỉ bỏ được hi. Ca tệ nhất O(n).
function binaryWithDuplicates(nums: number[]): { min: number; steps: number } {
  let lo = 0, hi = nums.length - 1, steps = 0;
  while (lo < hi) {
    steps++;
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] > nums[hi]) lo = mid + 1;
    else if (nums[mid] < nums[hi]) hi = mid;
    else hi--;
  }
  return { min: nums[lo], steps };
}

const cases: [number[], number][] = [
  [[3, 4, 5, 1, 2], 1], [[4, 5, 6, 7, 0, 1, 2], 0], [[11, 13, 15, 17], 11], [[1], 1],
  [[2, 1], 1], [[1, 2], 1], [[5, 1, 2, 3, 4], 1], [[2, 3, 4, 5, 1], 1],
];
for (const fn of [linearScan, binaryVsHi, binaryVsFirst, wrongVsLo, wrongLoopCondition]) {
  const bad: string[] = [];
  for (const [nums, want] of cases) {
    let got: number | string;
    try { got = fn(nums); } catch (e) { got = (e as Error).message; }
    if (got !== want) bad.push(`${JSON.stringify(nums)} → ${got}`);
  }
  console.log(`${fn.name.padEnd(19)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(" ") : ""}`);
}

// Đo: n phần tử tăng dần rồi xoay ở vị trí ngẫu nhiên. Trung vị 7 lần, mỗi lần gọi 1 000 lần.
const median = (xs: number[]) => xs.sort((a, b) => a - b)[xs.length >> 1];
function rotated(n: number, k: number) {
  return Array.from({ length: n }, (_, i) => (i + k) % n);
}
function time(fn: (a: number[]) => unknown, a: number[], reps: number) {
  const ts: number[] = [];
  for (let r = 0; r < 7; r++) {
    const t = performance.now();
    for (let i = 0; i < reps; i++) fn(a);
    ts.push((performance.now() - t) / reps);
  }
  return median(ts);
}
console.log("\nn          quét (µs/lần)   chia đôi (µs/lần)");
for (const n of [1_000, 100_000, 1_000_000, 10_000_000]) {
  const a = rotated(n, Math.floor(n * 0.37));
  console.log(`${String(n).padEnd(10)} ${(time(linearScan, a, 200) * 1000).toFixed(2).padStart(13)} ${(time(binaryVsHi, a, 100_000) * 1000).toFixed(3).padStart(19)}`);
}

// Số trùng: chỉ một phần tử khác, còn lại bằng nhau. Chia đôi bị ép bỏ từng phần tử một.
console.log("\nLeetCode 154, số bước vòng lặp");
for (const n of [1_000, 10_000, 100_000]) {
  const allSame = Array(n).fill(1); allSame[Math.floor(n * 0.9)] = 0; // 0 nằm gần cuối
  const distinct = rotated(n, Math.floor(n * 0.37));
  console.log(`n = ${String(n).padEnd(7)} một số khác giữa toàn số 1: ${String(binaryWithDuplicates(allSame).steps).padStart(6)} bước;  không trùng: ${binaryWithDuplicates(distinct).steps} bước`);
}
