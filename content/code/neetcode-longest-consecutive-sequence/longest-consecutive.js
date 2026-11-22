// LeetCode 128, Longest Consecutive Sequence: ba cách và test.
// Chạy: node longest-consecutive.js

function bruteForce(nums) {
  let best = 0;
  for (const x of nums) {
    let len = 1;
    while (nums.includes(x + len)) len++; // includes duyệt cả mảng: O(n) mỗi lần
    best = Math.max(best, len);
  }
  return best;
}

function sortScan(nums) {
  if (nums.length === 0) return 0;
  const a = [...nums].sort((p, q) => p - q); // thiếu hàm so sánh thì sort so theo chuỗi: [1, 100, 2, 200, 3, 4]
  let best = 1, len = 1;
  for (let i = 1; i < a.length; i++) {
    if (a[i] === a[i - 1]) continue;
    len = a[i] === a[i - 1] + 1 ? len + 1 : 1;
    best = Math.max(best, len);
  }
  return best;
}

function hashSet(nums) {
  const all = new Set(nums);
  let best = 0;
  for (const x of all) {
    if (all.has(x - 1)) continue;
    let len = 1;
    while (all.has(x + len)) len++;
    best = Math.max(best, len);
  }
  return best;
}

const cases = [
  [[100, 4, 200, 1, 3, 2], 4], [[0, 3, 7, 2, 5, 8, 4, 6, 0, 1], 9], [[1, 0, 1, 2], 3],
  [[], 0], [[7], 1], [[-3, -1, -2, 5], 3], [[9, 10, 8], 3],
];
for (const fn of [bruteForce, sortScan, hashSet]) {
  const ok = cases.filter(([nums, want]) => fn(nums) === want).length;
  console.log(`${fn.name.padEnd(12)} ${ok}/${cases.length} ca đúng`);
}
