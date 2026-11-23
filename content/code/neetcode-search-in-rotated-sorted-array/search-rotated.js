// LeetCode 33, Search in Rotated Sorted Array: ba cách và test.
// Chạy: node search-rotated.js

const linearScan = (nums, target) => nums.indexOf(target);

function onePass(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (nums[mid] === target) return mid;
    if (nums[lo] <= nums[mid]) {
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return -1;
}

function pivotThenSearch(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (nums[mid] > nums[hi]) lo = mid + 1;
    else hi = mid;
  }
  const pivot = lo;
  let [a, b] = target >= nums[pivot] && target <= nums[nums.length - 1] ? [pivot, nums.length - 1] : [0, pivot - 1];
  while (a <= b) {
    const mid = Math.floor((a + b) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) a = mid + 1;
    else b = mid - 1;
  }
  return -1;
}

const cases = [
  [[4, 5, 6, 7, 0, 1, 2], 0, 4], [[4, 5, 6, 7, 0, 1, 2], 3, -1], [[1], 0, -1], [[1], 1, 0],
  [[3, 1], 1, 1], [[5, 1, 3], 3, 2], [[1, 3], 3, 1], [[6, 7, 1, 2, 3, 4, 5], 6, 0], [[1, 2, 3, 4, 5], 4, 3],
];
for (const fn of [linearScan, onePass, pivotThenSearch]) {
  const ok = cases.filter(([n, t, w]) => fn(n, t) === w).length;
  console.log(`${fn.name.padEnd(16)} ${ok}/${cases.length} ca đúng`);
}
