// LC 287 Find the Duplicate Number bằng JavaScript: Set, tìm nhị phân trên giá trị, rùa và thỏ (Floyd), và hai điều về sort().
// Chạy: node find-duplicate.js

// Set các số đã gặp: O(n) bộ nhớ.
function hashSet(nums) {
  const seen = new Set();
  for (const x of nums) {
    if (seen.has(x)) return x;
    seen.add(x);
  }
  return -1;
}

// Tìm nhị phân trên giá trị: số trùng là m nhỏ nhất có cnt(m) = số phần tử ≤ m lớn hơn m.
function binaryCount(nums) {
  let lo = 1, hi = nums.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    let cnt = 0;
    for (const x of nums) if (x <= mid) cnt++;
    if (cnt > mid) hi = mid; else lo = mid + 1;
  }
  return lo;
}

// Rùa và thỏ trên đồ thị i → nums[i], xuất phát từ chỉ số 0.
function floyd(nums) {
  let slow = 0, fast = 0;
  do {
    slow = nums[slow];
    fast = nums[nums[fast]];
  } while (slow !== fast);
  let a = 0;
  while (a !== slow) {
    a = nums[a];
    slow = nums[slow];
  }
  return a;
}

// sort() mặc định so theo chuỗi: thứ tự sai ([10, 2, 9]) nhưng hai số bằng nhau vẫn đứng cạnh nhau, nên vẫn tìm được số trùng.
function sortDefaultCopy(nums) {
  const a = [...nums].sort();
  for (let i = 1; i < a.length; i++) if (a[i] === a[i - 1]) return a[i];
  return -1;
}

// BẪY: nums.sort() sắp tại chỗ và trả về chính mảng đó, nên mảng của người gọi bị đổi.
function sortInPlace(nums) {
  nums.sort((x, y) => x - y);
  for (let i = 1; i < nums.length; i++) if (nums[i] === nums[i - 1]) return nums[i];
  return -1;
}

const cases = [
  [[1, 3, 4, 2, 2], 2], [[3, 1, 3, 4, 2], 3], [[3, 3, 3, 3, 3], 3], [[1, 1], 1], [[1, 1, 2], 1],
  [[2, 2, 2, 2, 2], 2], [[2, 5, 9, 6, 9, 3, 8, 9, 7, 1], 9], [[1, 4, 4, 2, 4], 4], [[2, 1, 2], 2], [[4, 3, 1, 4, 2], 4],
  [[10, 2, 9, 1, 3, 4, 5, 6, 7, 8, 10], 10],
];
for (const fn of [hashSet, binaryCount, floyd, sortDefaultCopy, sortInPlace]) {
  const ok = cases.filter(([nums, want]) => fn([...nums]) === want).length;
  console.log(`${fn.name.padEnd(16)} ${ok}/${cases.length} ca đúng`);
}

console.log(`\n[10, 2, 9, 10].sort() = [${[10, 2, 9, 10].sort()}]`);
const nums = [3, 1, 3, 4, 2];
const got = sortInPlace(nums);
console.log(`sortInPlace([3, 1, 3, 4, 2]) = ${got}; mảng của người gọi giờ là [${nums}]`);
