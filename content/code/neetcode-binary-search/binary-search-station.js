// Ga SRCH-01: một khuôn tìm kiếm nhị phân cho bốn bài 704, 74, 153, 33.
// Chạy: node binary-search-station.js

function search(nums, target) { // 704
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}

function searchMatrix(matrix, target) { // 74: chỉ số k ứng với ô (k / n, k % n)
  const n = matrix[0].length;
  let lo = 0, hi = matrix.length * n - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    const v = matrix[Math.floor(mid / n)][mid % n];
    if (v === target) return true;
    if (v < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return false;
}

function findMin(nums) { // 153: so với nums[hi] để biết điểm gãy ở bên nào
  let lo = 0, hi = nums.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (nums[mid] > nums[hi]) lo = mid + 1;
    else hi = mid; // mid có thể là phần tử nhỏ nhất
  }
  return nums[lo];
}

function searchRotated(nums, target) { // 33: một nửa quanh mid luôn tăng dần
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    if (nums[mid] === target) return mid;
    if (nums[lo] <= nums[mid]) { // nửa trái tăng dần
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else { // nửa phải tăng dần
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return -1;
}

const M = [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]];
const checks = [
  [search([-1, 0, 3, 5, 9, 12], 9), 4], [search([-1, 0, 3, 5, 9, 12], 2), -1], [search([5], 5), 0],
  [searchMatrix(M, 3), true], [searchMatrix(M, 13), false], [searchMatrix([[1]], 1), true],
  [findMin([3, 4, 5, 1, 2]), 1], [findMin([4, 5, 6, 7, 0, 1, 2]), 0], [findMin([11, 13, 15, 17]), 11], [findMin([2, 1]), 1],
  [searchRotated([4, 5, 6, 7, 0, 1, 2], 0), 4], [searchRotated([4, 5, 6, 7, 0, 1, 2], 3), -1],
  [searchRotated([1], 0), -1], [searchRotated([3, 1], 1), 1],
];
console.log(`binary-search-station ${checks.filter(([g, w]) => g === w).length}/${checks.length} ca đúng`);
