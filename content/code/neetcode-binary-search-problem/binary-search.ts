// LeetCode 704, Binary Search: tìm tuyến tính, hai quy ước khoảng, cận dưới, hai bản sai và phép đo.
// Chạy: node binary-search.ts

function linearScan(nums: number[], target: number): number {
  for (let i = 0; i < nums.length; i++) if (nums[i] === target) return i;
  return -1;
}

// Khoảng đóng [lo, hi]: bất biến "nếu target có mặt thì nó nằm trong nums[lo..hi]".
function closedInterval(nums: number[], target: number): number {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) { // khoảng còn ít nhất một phần tử khi lo = hi
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1; // mid đã xét: loại nó luôn
    else hi = mid - 1;
  }
  return -1;
}

// Khoảng nửa mở [lo, hi): hi là vị trí ĐẦU TIÊN không còn xét.
function halfOpen(nums: number[], target: number): number {
  let lo = 0, hi = nums.length;
  while (lo < hi) { // lo = hi nghĩa là khoảng rỗng
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid; // hi không thuộc khoảng, nên gán mid chứ không phải mid - 1
  }
  return -1;
}

// Cận dưới: vị trí đầu tiên có nums[i] >= target (giống bisect_left). Không dừng sớm.
function lowerBound(nums: number[], target: number): number {
  let lo = 0, hi = nums.length;
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}
function viaLowerBound(nums: number[], target: number): number {
  const i = lowerBound(nums, target);
  return i < nums.length && nums[i] === target ? i : -1;
}

// SAI 1: khoảng đóng nhưng điều kiện lặp là lo < hi, nên khoảng một phần tử cuối cùng không bao giờ được xét.
function wrongLoopCondition(nums: number[], target: number): number {
  let lo = 0, hi = nums.length - 1;
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}

// SAI 2: lo = mid thay vì mid + 1. Khi hi = lo + 1, mid = lo và khoảng không bao giờ co: lặp mãi.
// Có giới hạn số vòng để chương trình dừng và báo lỗi.
function wrongLoEqualsMid(nums: number[], target: number): number {
  let lo = 0, hi = nums.length - 1, steps = 0;
  while (lo <= hi) {
    if (++steps > 1000) throw new Error("lặp mãi");
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid;
    else hi = mid - 1;
  }
  return -1;
}

const cases: [number[], number, number][] = [
  [[-1, 0, 3, 5, 9, 12], 9, 4], [[-1, 0, 3, 5, 9, 12], 2, -1], [[5], 5, 0], [[5], 7, -1],
  [[1, 3], 3, 1], [[1, 3], 0, -1], [[1, 3, 5, 7, 9, 11, 13], 13, 6], [[1, 3, 5, 7, 9, 11, 13], 1, 0],
];
for (const fn of [linearScan, closedInterval, halfOpen, viaLowerBound, wrongLoopCondition, wrongLoEqualsMid]) {
  const bad: string[] = [];
  for (const [nums, t, want] of cases) {
    let got: number | string;
    try { got = fn(nums, t); } catch (e) { got = (e as Error).message; }
    if (got !== want) bad.push(`${JSON.stringify(nums)} t=${t} → ${got}`);
  }
  console.log(`${fn.name.padEnd(18)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(", ") : ""}`);
}

// Chia đôi trong JS: số là double, không tràn như int 32 bit, nhưng >> ép về int32 có dấu.
const lo = 1_500_000_000, hi = 2_000_000_000;
console.log(`\nlo = ${lo}, hi = ${hi}`);
console.log(`(lo + hi) >> 1       = ${(lo + hi) >> 1}`);
console.log(`(lo + hi) >>> 1      = ${(lo + hi) >>> 1}`);
console.log(`lo + ((hi - lo) >> 1) = ${lo + ((hi - lo) >> 1)}`);

// Đo: tìm 10⁵ target ngẫu nhiên (một nửa có mặt) trong mảng tăng dần. Mỗi cách một vòng đo riêng, gọi trực tiếp.
let sink = 0; // cộng dồn kết quả để trình biên dịch JIT không bỏ qua lời gọi
const median = (xs: number[]) => xs.sort((a, b) => a - b)[Math.floor(xs.length / 2)];
let seed = 42;
const rand = () => (seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31;
function benchLinear(nums: number[], targets: number[]): number {
  const t0 = performance.now();
  for (const t of targets) sink += linearScan(nums, t);
  return performance.now() - t0;
}
function benchBinary(nums: number[], targets: number[]): number {
  const t0 = performance.now();
  for (const t of targets) sink += closedInterval(nums, t);
  return performance.now() - t0;
}
console.log("\nn          tuyến tính   chia đôi   (ms cho 10⁵ lần tìm, trung vị 5 lần)");
for (const n of [100, 1_000, 10_000, 100_000, 1_000_000]) {
  const nums = Array.from({ length: n }, (_, i) => 2 * i);
  const targets = Array.from({ length: 100_000 }, () => Math.floor(rand() * 2 * n));
  const lin = n <= 10_000 ? median(Array.from({ length: 5 }, () => benchLinear(nums, targets))).toFixed(1) : "—";
  const bin = median(Array.from({ length: 5 }, () => benchBinary(nums, targets))).toFixed(2);
  console.log(`${String(n).padEnd(10)} ${lin.padStart(10)} ${bin.padStart(10)}`);
}
if (sink === 0.5) console.log(sink);
