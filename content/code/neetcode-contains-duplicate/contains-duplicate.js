// NC-01 Contains Duplicate (LeetCode 217), JavaScript thuần.
// Chạy: node contains-duplicate.js

/** @param {number[]} nums @returns {boolean} */
function containsDuplicate(nums) {
  const seen = new Set();
  for (const x of nums) {
    if (seen.has(x)) return true; // đã thấy: có trùng
    seen.add(x);
  }
  return false;
}

/** Sắp xếp rồi quét. Nhớ truyền hàm so sánh: mặc định sort() so sánh chuỗi. */
function containsDuplicateSorted(nums) {
  const a = nums.slice().sort((x, y) => x - y);
  for (let i = 1; i < a.length; i++) if (a[i] === a[i - 1]) return true;
  return false;
}

const cases = [
  [[1, 2, 3, 1], true],
  [[1, 2, 3, 4], false],
  [[1, 1, 1, 3, 3, 4, 3, 2, 4, 2], true],
  [[], false],
];
for (const fn of [containsDuplicate, containsDuplicateSorted])
  for (const [input, want] of cases)
    console.log(`${fn.name}(${JSON.stringify(input)}) = ${fn(input)} ${fn(input) === want ? '✓' : '✗ SAI'}`);
