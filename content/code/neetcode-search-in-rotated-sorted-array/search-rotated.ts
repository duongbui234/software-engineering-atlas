// LeetCode 33, Search in Rotated Sorted Array: ba cách, một bản sai, test và đo.
// Chạy: node search-rotated.ts

function linearScan(nums: number[], target: number): number {
  return nums.indexOf(target); // O(n)
}

// Cách một lượt: ở mỗi bước, ít nhất một nửa [lo, mid] hoặc [mid, hi] đã sắp xếp. Hỏi target có nằm trong nửa đó không.
function onePass(nums: number[], target: number): number {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] === target) return mid;
    if (nums[lo] <= nums[mid]) {
      // nửa trái [lo, mid] tăng dần (dấu = cần cho ca lo == mid)
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {
      // nửa phải [mid, hi] tăng dần
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return -1;
}

// Cách hai lượt: tìm điểm gãy (chỉ số của min, như bài 153), rồi chia đôi thường trên nửa chứa target.
function pivotThenSearch(nums: number[], target: number): number {
  let lo = 0, hi = nums.length - 1;
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] > nums[hi]) lo = mid + 1;
    else hi = mid;
  }
  const pivot = lo; // nums[pivot..] và nums[..pivot-1] đều tăng dần
  const [a, b] = target >= nums[pivot] && target <= nums[nums.length - 1] ? [pivot, nums.length - 1] : [0, pivot - 1];
  return binarySearch(nums, target, a, b);
}

function binarySearch(nums: number[], target: number, lo: number, hi: number): number {
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}

// SAI: dùng < thay cho <= khi kiểm nửa trái. Khi lo == mid (còn hai phần tử), nó tưởng nửa phải đã sắp xếp.
function wrongStrict(nums: number[], target: number): number {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] === target) return mid;
    if (nums[lo] < nums[mid]) {
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return -1;
}

// LeetCode 81 (có số trùng): khi nums[lo] == nums[mid] == nums[hi] không biết nửa nào đã sắp xếp, chỉ thu hẹp hai đầu được.
function searchWithDuplicates(nums: number[], target: number): { found: boolean; steps: number } {
  let lo = 0, hi = nums.length - 1, steps = 0;
  while (lo <= hi) {
    steps++;
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] === target) return { found: true, steps };
    if (nums[lo] === nums[mid] && nums[mid] === nums[hi]) { lo++; hi--; }
    else if (nums[lo] <= nums[mid]) {
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1; else lo = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1; else hi = mid - 1;
    }
  }
  return { found: false, steps };
}

const cases: [number[], number, number][] = [
  [[4, 5, 6, 7, 0, 1, 2], 0, 4], [[4, 5, 6, 7, 0, 1, 2], 3, -1], [[1], 0, -1], [[1], 1, 0],
  [[3, 1], 1, 1], [[5, 1, 3], 3, 2], [[1, 3], 3, 1], [[6, 7, 1, 2, 3, 4, 5], 6, 0], [[1, 2, 3, 4, 5], 4, 3],
];
for (const fn of [linearScan, onePass, pivotThenSearch, wrongStrict]) {
  const bad = cases.filter(([n, t, w]) => fn(n, t) !== w).map(([n, t]) => `${JSON.stringify(n)} t=${t} → ${fn(n, t)}`);
  console.log(`${fn.name.padEnd(16)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(" ") : ""}`);
}

// Kiểm ngẫu nhiên: mọi mảng xoay của 0..n-1 với n ≤ 12, mọi target trong -1..n.
let mismatches = 0, wrongMismatches = 0, checked = 0;
for (let n = 1; n <= 12; n++)
  for (let k = 0; k < n; k++) {
    const a = Array.from({ length: n }, (_, i) => (i + k) % n);
    for (let t = -1; t <= n; t++) {
      checked++;
      if (onePass(a, t) !== a.indexOf(t) || pivotThenSearch(a, t) !== a.indexOf(t)) mismatches++;
      if (wrongStrict(a, t) !== a.indexOf(t)) wrongMismatches++;
    }
  }
console.log(`\nđối chiếu với indexOf: ${checked} bộ (mảng, target), ${mismatches} bộ lệch; bản sai wrongStrict lệch ${wrongMismatches} bộ`);

const median = (xs: number[]) => xs.sort((a, b) => a - b)[xs.length >> 1];
function time(fn: () => unknown, reps: number) {
  const ts: number[] = [];
  for (let r = 0; r < 7; r++) { const t = performance.now(); for (let i = 0; i < reps; i++) fn(); ts.push((performance.now() - t) / reps); }
  return median(ts) * 1000;
}
console.log("\nn          indexOf (µs)   một lượt (µs)   hai lượt (µs)   target = -1 (không có)");
for (const n of [1_000, 100_000, 1_000_000, 10_000_000]) {
  const a = Array.from({ length: n }, (_, i) => (i + Math.floor(n * 0.37)) % n);
  console.log(`${String(n).padEnd(10)} ${time(() => linearScan(a, -1), 100).toFixed(2).padStart(12)} ${time(() => onePass(a, -1), 100_000).toFixed(3).padStart(15)} ${time(() => pivotThenSearch(a, -1), 100_000).toFixed(3).padStart(15)}`);
}

console.log("\nLeetCode 81, số bước khi target không có");
for (const n of [1_000, 10_000, 100_000]) {
  const same = Array(n).fill(1); same[Math.floor(n * 0.9)] = 0;
  const distinct = Array.from({ length: n }, (_, i) => (i + Math.floor(n * 0.37)) % n);
  console.log(`n = ${String(n).padEnd(7)} toàn số 1 trừ một số 0: ${String(searchWithDuplicates(same, 2).steps).padStart(6)} bước;  không trùng: ${searchWithDuplicates(distinct, -1).steps} bước`);
}
