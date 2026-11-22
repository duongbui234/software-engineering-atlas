// LeetCode 167, Two Sum II (mảng đã sắp xếp): bốn cách, một bản sai, test và đo.
// Chạy: node two-sum-ii.ts
// Kết quả là chỉ số ĐẾM TỪ 1: [i + 1, j + 1].

function bruteForce(nums: number[], target: number): number[] {
  for (let i = 0; i < nums.length; i++)
    for (let j = i + 1; j < nums.length; j++) if (nums[i] + nums[j] === target) return [i + 1, j + 1];
  return [];
}

// Với mỗi nums[i], tìm nhị phân phần bù trong đoạn BÊN PHẢI i. O(n log n), O(1) bộ nhớ.
function binarySearch(nums: number[], target: number): number[] {
  for (let i = 0; i < nums.length; i++) {
    let lo = i + 1, hi = nums.length - 1;
    const want = target - nums[i];
    while (lo <= hi) {
      const mid = (lo + hi) >>> 1;
      if (nums[mid] === want) return [i + 1, mid + 1];
      if (nums[mid] < want) lo = mid + 1; else hi = mid - 1;
    }
  }
  return [];
}

// Khuôn của ga 1 (hash map một lượt): đúng, O(n), nhưng tốn O(n) bộ nhớ và bỏ phí thứ tự đã sắp xếp.
function hashMap(nums: number[], target: number): number[] {
  const seen = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const j = seen.get(target - nums[i]);
    if (j !== undefined) return [j + 1, i + 1];
    seen.set(nums[i], i);
  }
  return [];
}

// Hai con trỏ: tổng nhỏ quá thì tăng trái, lớn quá thì giảm phải. O(n), O(1) bộ nhớ.
function twoPointers(nums: number[], target: number): number[] {
  let i = 0, j = nums.length - 1;
  while (i < j) {
    const sum = nums[i] + nums[j];
    if (sum === target) return [i + 1, j + 1];
    if (sum < target) i++; // nums[i] cộng với số LỚN NHẤT còn lại vẫn thiếu: nums[i] không thuộc cặp nào
    else j--; // nums[j] cộng với số NHỎ NHẤT còn lại vẫn thừa: nums[j] không thuộc cặp nào
  }
  return [];
}

// SAI: tìm nhị phân trên CẢ mảng, nên có thể ghép một phần tử với chính nó.
function binarySearchWholeArray(nums: number[], target: number): number[] {
  for (let i = 0; i < nums.length; i++) {
    let lo = 0, hi = nums.length - 1;
    const want = target - nums[i];
    while (lo <= hi) {
      const mid = (lo + hi) >>> 1;
      if (nums[mid] === want) return [i + 1, mid + 1];
      if (nums[mid] < want) lo = mid + 1; else hi = mid - 1;
    }
  }
  return [];
}

const cases: [number[], number, number[]][] = [
  [[2, 7, 11, 15], 9, [1, 2]], [[2, 3, 4], 6, [1, 3]], [[-1, 0], -1, [1, 2]],
  [[3, 3], 6, [1, 2]], [[1, 2, 3, 4, 4, 9, 56, 90], 8, [4, 5]], [[-10, -3, 0, 5, 9], 6, [2, 5]],
];
for (const fn of [bruteForce, binarySearch, hashMap, twoPointers, binarySearchWholeArray]) {
  const bad = cases.filter(([n, t, w]) => fn(n, t).join() !== w.join()).map(([n, t]) => `${JSON.stringify(n)}, ${t} → [${fn(n, t)}]`);
  console.log(`${fn.name.padEnd(22)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(" ") : ""}`);
}

// Đo ca tệ nhất: 0, 1, …, n − 1 và target là tổng hai số lớn nhất, nên cặp duy nhất nằm ở cuối mảng.
const make = (n: number) => ({ a: Array.from({ length: n }, (_, i) => i), t: 2 * n - 3 });
const median = (f: () => void, runs = 5) => {
  const ts: number[] = [];
  for (let k = 0; k < runs; k++) { const t = performance.now(); f(); ts.push(performance.now() - t); }
  return ts.sort((x, y) => x - y)[Math.floor(runs / 2)];
};
console.log("\nn          vét cạn  tìm nhị phân  hash map  hai con trỏ   (ms, trung vị)");
for (const n of [5_000, 10_000, 20_000, 1_000_000]) {
  const { a, t } = make(n);
  const bf = n <= 20_000 ? median(() => bruteForce(a, t), 3).toFixed(1) : "—";
  console.log(`${String(n).padEnd(10)} ${bf.padStart(7)} ${median(() => binarySearch(a, t)).toFixed(2).padStart(13)} ${median(() => hashMap(a, t)).toFixed(2).padStart(9)} ${median(() => twoPointers(a, t)).toFixed(2).padStart(12)}`);
}
