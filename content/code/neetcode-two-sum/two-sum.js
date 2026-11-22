// NC-03 Two Sum (LeetCode 1), JavaScript thuần.
// Chạy: node two-sum.js

/** @param {number[]} nums @param {number} target @returns {number[]} */
function twoSum(nums, target) {
  const seen = new Map(); // giá trị → chỉ số. Dùng Map, đừng dùng {}: khóa của object luôn bị đổi thành chuỗi
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return []; // đề bảo đảm luôn có đúng một đáp án
}

console.log(twoSum([2, 7, 11, 15], 9)); // [ 0, 1 ]
console.log(twoSum([3, 2, 4], 6));      // [ 1, 2 ]
console.log(twoSum([3, 3], 6));         // [ 0, 1 ]

// Vì sao không dùng object thuần làm map: khóa số và khóa chuỗi trùng nhau.
const obj = {}; obj[1] = 'số 1'; obj['1'] = 'chuỗi "1"';
const map = new Map(); map.set(1, 'số 1'); map.set('1', 'chuỗi "1"');
console.log('object:', Object.keys(obj).length, 'khóa | Map:', map.size, 'khóa');
