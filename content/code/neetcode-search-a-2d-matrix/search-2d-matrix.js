// LeetCode 74, Search a 2D Matrix: bốn cách và test.
// Chạy: node search-2d-matrix.js

function linearScan(matrix, target) {
  return matrix.some((row) => row.includes(target));
}

function twoBinarySearch(matrix, target) {
  let lo = 0, hi = matrix.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (matrix[mid][0] <= target) lo = mid + 1;
    else hi = mid;
  }
  const r = lo - 1;
  if (r < 0) return false;
  const row = matrix[r];
  let a = 0, b = row.length;
  while (a < b) {
    const mid = (a + b) >>> 1;
    if (row[mid] < target) a = mid + 1;
    else b = mid;
  }
  return a < row.length && row[a] === target;
}

function flatBinarySearch(matrix, target) {
  const m = matrix.length, n = matrix[0].length;
  let lo = 0, hi = m * n;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1; // >>> 1 đúng tới 2³²; >> 1 sai từ 2³¹ (thành số âm)
    const x = matrix[Math.floor(mid / n)][mid % n]; // "/" của JS ra số thực: phải Math.floor
    if (x === target) return true;
    if (x < target) lo = mid + 1;
    else hi = mid;
  }
  return false;
}

function staircase(matrix, target) {
  let r = 0, c = matrix[0].length - 1;
  while (r < matrix.length && c >= 0) {
    const x = matrix[r][c];
    if (x === target) return true;
    if (x > target) c--;
    else r++;
  }
  return false;
}

const ex = [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]];
const cases = [[ex, 3, true], [ex, 13, false], [ex, 60, true], [ex, 23, true], [ex, 0, false], [ex, 61, false],
  [[[1]], 1, true], [[[1]], 2, false], [[[1], [3]], 3, true], [[[1, 2], [3, 4]], 4, true]];
for (const fn of [linearScan, twoBinarySearch, flatBinarySearch, staircase]) {
  const ok = cases.filter(([m, t, want]) => fn(m, t) === want).length;
  console.log(`${fn.name.padEnd(17)} ${ok}/${cases.length} ca đúng`);
}
const big = 3_000_000_000;
console.log(`\n${big} >> 1 = ${big >> 1}, ${big} >>> 1 = ${big >>> 1}, 7 / 2 = ${7 / 2}`);
