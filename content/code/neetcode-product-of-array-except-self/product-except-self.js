// LeetCode 238, Product of Array Except Self: bốn cách và test.
// Chạy: node product-except-self.js

function bruteForce(nums) {
  return nums.map((_, i) => nums.reduce((p, x, j) => (j === i ? p : p * x), 1));
}

function divisionZeroAware(nums) {
  let zeros = 0, prod = 1;
  for (const x of nums) x === 0 ? zeros++ : (prod *= x);
  return nums.map((x) => (zeros > 1 ? 0 : zeros === 1 ? (x === 0 ? prod : 0) : prod / x));
}

function prefixSuffixArrays(nums) {
  const n = nums.length;
  const prefix = new Array(n).fill(1), suffix = new Array(n).fill(1);
  for (let i = 1; i < n; i++) prefix[i] = prefix[i - 1] * nums[i - 1];
  for (let i = n - 2; i >= 0; i--) suffix[i] = suffix[i + 1] * nums[i + 1];
  return nums.map((_, i) => prefix[i] * suffix[i]);
}

function prefixSuffixInPlace(nums) {
  const n = nums.length;
  const out = new Array(n).fill(1);
  let left = 1;
  for (let i = 0; i < n; i++) { out[i] = left; left *= nums[i]; }
  let right = 1;
  for (let i = n - 1; i >= 0; i--) { out[i] *= right; right *= nums[i]; }
  return out;
}

const cases = [
  [[1, 2, 3, 4], [24, 12, 8, 6]], [[-1, 1, 0, -3, 3], [0, 0, 9, 0, 0]], [[2, 3], [3, 2]],
  [[0, 0, 5], [0, 0, 0]], [[0, 4, 5], [20, 0, 0]], [[-2, -3, 4], [-12, -8, 6]],
];
for (const fn of [bruteForce, divisionZeroAware, prefixSuffixArrays, prefixSuffixInPlace]) {
  const ok = cases.filter(([nums, want]) => fn(nums).every((x, i) => x === want[i])).length;
  console.log(`${fn.name.padEnd(20)} ${ok}/${cases.length} ca đúng`);
}
