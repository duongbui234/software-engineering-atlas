// Ga SRCH-01: một khuôn tìm kiếm nhị phân cho bốn bài 704, 74, 153, 33.
// Chạy: java binary-search-station.java
import java.util.*;

class BinarySearchStation {
    static int search(int[] nums, int target) { // 704
        int lo = 0, hi = nums.length - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] == target) return mid;
            if (nums[mid] < target) lo = mid + 1;
            else hi = mid - 1;
        }
        return -1;
    }

    static boolean searchMatrix(int[][] matrix, int target) { // 74: chỉ số k ứng với ô (k / n, k % n)
        int n = matrix[0].length, lo = 0, hi = matrix.length * n - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2, v = matrix[mid / n][mid % n];
            if (v == target) return true;
            if (v < target) lo = mid + 1;
            else hi = mid - 1;
        }
        return false;
    }

    static int findMin(int[] nums) { // 153: so với nums[hi] để biết điểm gãy ở bên nào
        int lo = 0, hi = nums.length - 1;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] > nums[hi]) lo = mid + 1;
            else hi = mid; // mid có thể là phần tử nhỏ nhất
        }
        return nums[lo];
    }

    static int searchRotated(int[] nums, int target) { // 33: một nửa quanh mid luôn tăng dần
        int lo = 0, hi = nums.length - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] == target) return mid;
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

    public static void main(String[] args) {
        int[][] m = {{1, 3, 5, 7}, {10, 11, 16, 20}, {23, 30, 34, 60}};
        Object[][] checks = {
            {search(new int[] {-1, 0, 3, 5, 9, 12}, 9), 4}, {search(new int[] {-1, 0, 3, 5, 9, 12}, 2), -1}, {search(new int[] {5}, 5), 0},
            {searchMatrix(m, 3), true}, {searchMatrix(m, 13), false}, {searchMatrix(new int[][] {{1}}, 1), true},
            {findMin(new int[] {3, 4, 5, 1, 2}), 1}, {findMin(new int[] {4, 5, 6, 7, 0, 1, 2}), 0}, {findMin(new int[] {11, 13, 15, 17}), 11}, {findMin(new int[] {2, 1}), 1},
            {searchRotated(new int[] {4, 5, 6, 7, 0, 1, 2}, 0), 4}, {searchRotated(new int[] {4, 5, 6, 7, 0, 1, 2}, 3), -1},
            {searchRotated(new int[] {1}, 0), -1}, {searchRotated(new int[] {3, 1}, 1), 1},
        };
        int ok = 0;
        for (Object[] c : checks) if (c[0].equals(c[1])) ok++;
        System.out.printf("binary-search-station %d/%d ca đúng%n", ok, checks.length);
    }
}
