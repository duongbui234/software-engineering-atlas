// LeetCode 153, Find Minimum in Rotated Sorted Array: ba cách và test.
// Chạy: node find-min-rotated.js

function linearScan(nums) {
  return Math.min(...nums); // spread: mảng rất lớn sẽ ném RangeError, nên dùng vòng lặp khi n lớn
}

function binaryVsHi(nums) {
  let lo = 0, hi = nums.length - 1;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2); // số JS là double, (lo + hi) không tràn ở cỡ mảng thật
    if (nums[mid] > nums[hi]) lo = mid + 1;
    else hi = mid;
  }
  return nums[lo];
}

function binaryVsFirst(nums) {
  if (nums[0] <= nums[nums.length - 1]) return nums[0];
  let lo = 0, hi = nums.length - 1;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (nums[mid] >= nums[0]) lo = mid + 1;
    else hi = mid;
  }
  return nums[lo];
}

const cases = [
  [[3, 4, 5, 1, 2], 1], [[4, 5, 6, 7, 0, 1, 2], 0], [[11, 13, 15, 17], 11], [[1], 1],
  [[2, 1], 1], [[1, 2], 1], [[5, 1, 2, 3, 4], 1], [[2, 3, 4, 5, 1], 1],
];
for (const fn of [linearScan, binaryVsHi, binaryVsFirst]) {
  const ok = cases.filter(([nums, want]) => fn(nums) === want).length;
  console.log(`${fn.name.padEnd(14)} ${ok}/${cases.length} ca đúng`);
}
