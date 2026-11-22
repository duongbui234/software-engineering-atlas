// Ga ARR-01, tra cứu bằng hash: ba bài, cùng một khuôn "hỏi bảng, rồi ghi vào bảng".
// Chạy: node hash-lookup.js

// 217
function containsDuplicate(nums) {
  const seen = new Set();
  for (const x of nums) {
    if (seen.has(x)) return true;
    seen.add(x);
  }
  return false;
}

// 1: dùng Map, đừng dùng object {}: khóa của object luôn bị đổi thành chuỗi.
function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const j = seen.get(target - nums[i]);
    if (j !== undefined) return [j, i]; // đừng viết "if (j)": chỉ số 0 là falsy
    seen.set(nums[i], i);
  }
  return null;
}

// 128
function longestConsecutive(nums) {
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
  ["containsDuplicate [1,2,3,1]", containsDuplicate([1, 2, 3, 1]), true],
  ["containsDuplicate [1,2,3,4]", containsDuplicate([1, 2, 3, 4]), false],
  ["containsDuplicate []", containsDuplicate([]), false],
  ["twoSum [2,7,11,15] 9", twoSum([2, 7, 11, 15], 9), [0, 1]],
  ["twoSum [3,2,4] 6", twoSum([3, 2, 4], 6), [1, 2]],
  ["twoSum [3,3] 6", twoSum([3, 3], 6), [0, 1]],
  ["longestConsecutive [100,4,200,1,3,2]", longestConsecutive([100, 4, 200, 1, 3, 2]), 4],
  ["longestConsecutive [0,3,7,2,5,8,4,6,0,1]", longestConsecutive([0, 3, 7, 2, 5, 8, 4, 6, 0, 1]), 9],
  ["longestConsecutive []", longestConsecutive([]), 0],
];
let ok = 0;
for (const [name, got, want] of cases) {
  if (JSON.stringify(got) === JSON.stringify(want)) ok++;
  else console.log("SAI", name, got, want);
}
console.log(`${ok}/${cases.length} ca đúng`);
