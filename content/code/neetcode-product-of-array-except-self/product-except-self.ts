// LeetCode 238, Product of Array Except Self: bốn cách, một bản sai, test và đo.
// Chạy: node product-except-self.ts

function bruteForce(nums: number[]): number[] {
  return nums.map((_, i) => {
    let p = 1;
    for (let j = 0; j < nums.length; j++) if (j !== i) p *= nums[j];
    return p;
  });
}

// SAI: chia cho chính nó. Gặp số 0 thì 0/0 = NaN; đề cũng cấm phép chia.
function naiveDivision(nums: number[]): number[] {
  const total = nums.reduce((a, b) => a * b, 1);
  return nums.map((x) => total / x);
}

// Chia nhưng đếm số 0: ≥ 2 số 0 thì mọi ô là 0; đúng 1 số 0 thì chỉ ô đó khác 0.
function divisionZeroAware(nums: number[]): number[] {
  let zeros = 0, prod = 1;
  for (const x of nums) x === 0 ? zeros++ : (prod *= x);
  return nums.map((x) => (zeros > 1 ? 0 : zeros === 1 ? (x === 0 ? prod : 0) : prod / x));
}

// Hai mảng phụ: prefix[i] = tích nums[0..i-1], suffix[i] = tích nums[i+1..n-1].
function prefixSuffixArrays(nums: number[]): number[] {
  const n = nums.length;
  const prefix = new Array(n).fill(1), suffix = new Array(n).fill(1);
  for (let i = 1; i < n; i++) prefix[i] = prefix[i - 1] * nums[i - 1];
  for (let i = n - 2; i >= 0; i--) suffix[i] = suffix[i + 1] * nums[i + 1];
  return nums.map((_, i) => prefix[i] * suffix[i]);
}

// O(1) bộ nhớ phụ: lượt 1 ghi tiền tố thẳng vào kết quả, lượt 2 nhân hậu tố bằng một biến chạy.
function prefixSuffixInPlace(nums: number[]): number[] {
  const n = nums.length;
  const out = new Array(n).fill(1);
  let left = 1;
  for (let i = 0; i < n; i++) { out[i] = left; left *= nums[i]; }
  let right = 1;
  for (let i = n - 1; i >= 0; i--) { out[i] *= right; right *= nums[i]; }
  return out;
}

const cases: [number[], number[]][] = [
  [[1, 2, 3, 4], [24, 12, 8, 6]], [[-1, 1, 0, -3, 3], [0, 0, 9, 0, 0]], [[2, 3], [3, 2]],
  [[0, 0, 5], [0, 0, 0]], [[0, 4, 5], [20, 0, 0]], [[-2, -3, 4], [-12, -8, 6]],
];
const same = (a: number[], b: number[]) => a.length === b.length && a.every((x, i) => x === b[i]); // === coi -0 và 0 là bằng
for (const fn of [bruteForce, naiveDivision, divisionZeroAware, prefixSuffixArrays, prefixSuffixInPlace]) {
  const bad = cases.filter(([nums, want]) => !same(fn(nums), want));
  console.log(`${fn.name.padEnd(20)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.map(([n]) => JSON.stringify(n) + " → [" + fn(n).join(",") + "]").join(" ") : ""}`);
}
console.log(`\nprefixSuffixInPlace([0, 0, -1]) = [${prefixSuffixInPlace([0, 0, -1]).map((x) => (Object.is(x, -0) ? "-0" : x)).join(", ")}]`);

// Đo. Giá trị chỉ là ±1 để tích không tràn và không thành 0.
const rand = (() => { let s = 7; return () => (s = (s * 1103515245 + 12345) % 2 ** 31) / 2 ** 31; })();
const make = (n: number) => Array.from({ length: n }, () => (rand() < 0.5 ? -1 : 1));
const time = (fn: (a: number[]) => number[], a: number[], runs: number) => {
  const ts: number[] = [];
  for (let k = 0; k < runs; k++) { const t = performance.now(); fn(a); ts.push(performance.now() - t); }
  return ts.sort((x, y) => x - y)[Math.floor(runs / 2)];
};
console.log("\nn          vét cạn   hai mảng   tại chỗ   (ms, trung vị)");
for (const n of [2_000, 4_000, 8_000, 16_000]) {
  const a = make(n);
  console.log(`${String(n).padEnd(10)} ${time(bruteForce, a, 3).toFixed(1).padStart(8)} ${time(prefixSuffixArrays, a, 5).toFixed(2).padStart(10)} ${time(prefixSuffixInPlace, a, 5).toFixed(2).padStart(9)}`);
}
for (const n of [1_000_000]) {
  const a = make(n);
  console.log(`${String(n).padEnd(10)} ${"—".padStart(8)} ${time(prefixSuffixArrays, a, 5).toFixed(2).padStart(10)} ${time(prefixSuffixInPlace, a, 5).toFixed(2).padStart(9)}`);
}
