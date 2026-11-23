// LeetCode 704, Binary Search: hai quy ước khoảng và cận dưới.
// Chạy: node binary-search.js

function closedInterval(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2); // số JS là double: tổng không tràn tới 2^53
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}

function halfOpen(nums, target) {
  let lo = 0, hi = nums.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1; // >>> đọc tổng như uint32: đúng khi lo + hi < 2^32, dư cho mảng thực tế
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return -1;
}

function lowerBound(nums, target) {
  let lo = 0, hi = nums.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

function viaLowerBound(nums, target) {
  const i = lowerBound(nums, target);
  return i < nums.length && nums[i] === target ? i : -1;
}

const cases = [
  [[-1, 0, 3, 5, 9, 12], 9, 4], [[-1, 0, 3, 5, 9, 12], 2, -1], [[5], 5, 0], [[5], 7, -1],
  [[1, 3], 3, 1], [[1, 3], 0, -1], [[1, 3, 5, 7, 9, 11, 13], 13, 6], [[1, 3, 5, 7, 9, 11, 13], 1, 0],
];
for (const fn of [closedInterval, halfOpen, viaLowerBound]) {
  const ok = cases.filter(([n, t, w]) => fn(n, t) === w).length;
  console.log(`${fn.name.padEnd(15)} ${ok}/${cases.length} ca đúng`);
}
