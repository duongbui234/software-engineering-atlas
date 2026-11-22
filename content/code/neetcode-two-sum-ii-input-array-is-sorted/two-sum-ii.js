// LeetCode 167, Two Sum II (mảng đã sắp xếp): bốn cách và test.
// Chạy: node two-sum-ii.js

function bruteForce(nums, target) {
  for (let i = 0; i < nums.length; i++)
    for (let j = i + 1; j < nums.length; j++) if (nums[i] + nums[j] === target) return [i + 1, j + 1];
  return [];
}

function binarySearch(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    let lo = i + 1, hi = nums.length - 1;
    const want = target - nums[i];
    while (lo <= hi) {
      const mid = (lo + hi) >>> 1; // >>> 1: chia đôi lấy nguyên, không thành số thực
      if (nums[mid] === want) return [i + 1, mid + 1];
      if (nums[mid] < want) lo = mid + 1; else hi = mid - 1;
    }
  }
  return [];
}

function hashMap(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    if (seen.has(target - nums[i])) return [seen.get(target - nums[i]) + 1, i + 1];
    seen.set(nums[i], i);
  }
  return [];
}

function twoPointers(nums, target) {
  let i = 0, j = nums.length - 1;
  while (i < j) {
    const sum = nums[i] + nums[j];
    if (sum === target) return [i + 1, j + 1];
    if (sum < target) i++; else j--;
  }
  return [];
}

const cases = [
  [[2, 7, 11, 15], 9, [1, 2]], [[2, 3, 4], 6, [1, 3]], [[-1, 0], -1, [1, 2]],
  [[3, 3], 6, [1, 2]], [[1, 2, 3, 4, 4, 9, 56, 90], 8, [4, 5]], [[-10, -3, 0, 5, 9], 6, [2, 5]],
];
for (const fn of [bruteForce, binarySearch, hashMap, twoPointers]) {
  const ok = cases.filter(([n, t, w]) => fn(n, t).join() === w.join()).length;
  console.log(`${fn.name.padEnd(13)} ${ok}/${cases.length} ca đúng`);
}
