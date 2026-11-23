// LeetCode 215, Kth Largest Element in an Array (JavaScript): sort mặc định so sánh chuỗi, Int32Array.sort thì không,
// và quickselect ba phần.
// Chạy: node kth-largest.js

// SAI: Array.prototype.sort() không có hàm so sánh đổi mọi phần tử thành chuỗi rồi so theo UTF-16.
function wrongDefaultSort(nums, k) {
  const a = [...nums].sort();
  return a[a.length - k];
}

function sortThenPick(nums, k) {
  const a = [...nums].sort((x, y) => x - y);
  return a[a.length - k];
}

// Mảng kiểu (typed array) sắp theo số ngay cả khi không truyền hàm so sánh.
function typedSort(nums, k) {
  const a = Int32Array.from(nums).sort();
  return a[a.length - k];
}

function quickselect3Way(nums, k) {
  const a = [...nums], target = a.length - k;
  let lo = 0, hi = a.length - 1;
  for (;;) {
    const pivot = a[lo + Math.floor(Math.random() * (hi - lo + 1))];
    let lt = lo, i = lo, gt = hi;
    while (i <= gt) {
      if (a[i] < pivot) { [a[lt], a[i]] = [a[i], a[lt]]; lt++; i++; }
      else if (a[i] > pivot) { [a[i], a[gt]] = [a[gt], a[i]]; gt--; }
      else i++;
    }
    if (target < lt) hi = lt - 1;
    else if (target > gt) lo = gt + 1;
    else return pivot;
  }
}

const cases = [
  [[3, 2, 1, 5, 6, 4], 2, 5],
  [[3, 2, 3, 1, 2, 4, 5, 5, 6], 4, 4],
  [[1], 1, 1],
  [[7, 7, 7, 7], 2, 7],
  [[-1, -2, -3], 1, -1],
  [[-10000, 10000], 2, -10000],
  [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3, 8],
  [[10, 9, 8, 7, 6, 5, 4, 3, 2, 1], 10, 1],
  [[10, 9, 1], 1, 10],
  [[2, -1, 10, -20], 2, 2],
];
for (const fn of [sortThenPick, typedSort, quickselect3Way, wrongDefaultSort]) {
  const bad = cases.filter(([n, k, want]) => fn(n, k) !== want).map(([n, k]) => `[${n}] k=${k} → ${fn(n, k)}`);
  console.log(`${fn.name.padEnd(17)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(", ") : ""}`);
}
console.log(`\n[10, 9, 1].sort()               = [${[10, 9, 1].sort()}]`);
console.log(`[-1, -2, -3].sort()             = [${[-1, -2, -3].sort()}]`);
console.log(`Int32Array.from([10, 9, 1]).sort() = [${Int32Array.from([10, 9, 1]).sort()}]`);
