// Ga SRCH-01: một khuôn tìm kiếm nhị phân cho bốn bài 704, 74, 153, 33.
// Chạy: node binary-search-station.ts

// 704: khoảng đóng [lo, hi], dừng ngay khi gặp target.
function search(nums: number[], target: number): number {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}

// 74: ma trận m×n đọc theo hàng là một mảng tăng dần dài m·n; chỉ số k ứng với ô (k / n, k % n).
function searchMatrix(matrix: number[][], target: number): boolean {
  const n = matrix[0].length;
  let lo = 0, hi = matrix.length * n - 1;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    const v = matrix[Math.floor(mid / n)][mid % n];
    if (v === target) return true;
    if (v < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return false;
}

// 153: so nums[mid] với nums[hi]. Lớn hơn thì điểm gãy (chỗ nhỏ nhất) nằm bên phải mid.
function findMin(nums: number[]): number {
  let lo = 0, hi = nums.length - 1;
  while (lo < hi) { // bất biến: phần tử nhỏ nhất luôn nằm trong [lo, hi]
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] > nums[hi]) lo = mid + 1;
    else hi = mid; // mid có thể chính là phần tử nhỏ nhất, nên giữ nó lại
  }
  return nums[lo];
}

// 33: một trong hai nửa quanh mid luôn tăng dần; target nằm trong nửa đó thì đi vào, không thì sang nửa kia.
function searchRotated(nums: number[], target: number): number {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] === target) return mid;
    if (nums[lo] <= nums[mid]) { // nửa trái [lo, mid] tăng dần
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else { // nửa phải [mid, hi] tăng dần
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return -1;
}

const M = [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]];
const checks: [string, unknown, unknown][] = [
  ["704", search([-1, 0, 3, 5, 9, 12], 9), 4],
  ["704", search([-1, 0, 3, 5, 9, 12], 2), -1],
  ["704", search([5], 5), 0],
  ["74", searchMatrix(M, 3), true],
  ["74", searchMatrix(M, 13), false],
  ["74", searchMatrix([[1]], 1), true],
  ["153", findMin([3, 4, 5, 1, 2]), 1],
  ["153", findMin([4, 5, 6, 7, 0, 1, 2]), 0],
  ["153", findMin([11, 13, 15, 17]), 11],
  ["153", findMin([2, 1]), 1],
  ["33", searchRotated([4, 5, 6, 7, 0, 1, 2], 0), 4],
  ["33", searchRotated([4, 5, 6, 7, 0, 1, 2], 3), -1],
  ["33", searchRotated([1], 0), -1],
  ["33", searchRotated([3, 1], 1), 1],
];
const bad = checks.filter(([, got, want]) => got !== want);
console.log(`binary-search-station ${checks.length - bad.length}/${checks.length} ca đúng`);
for (const [p, got, want] of bad) console.log(`  sai ${p}: được ${got}, cần ${want}`);
