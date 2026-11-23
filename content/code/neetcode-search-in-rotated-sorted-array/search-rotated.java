// LeetCode 33, Search in Rotated Sorted Array: ba cách và test.
// Chạy: java search-rotated.java
import java.util.*;

class SearchRotated {
    static int linearScan(int[] nums, int target) {
        for (int i = 0; i < nums.length; i++) if (nums[i] == target) return i;
        return -1;
    }

    static int onePass(int[] nums, int target) {
        int lo = 0, hi = nums.length - 1;
        while (lo <= hi) {
            int mid = (lo + hi) >>> 1;
            if (nums[mid] == target) return mid;
            if (nums[lo] <= nums[mid]) {
                if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
                else lo = mid + 1;
            } else {
                if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
                else hi = mid - 1;
            }
        }
        return -1;
    }

    static int pivotThenSearch(int[] nums, int target) {
        int lo = 0, hi = nums.length - 1;
        while (lo < hi) {
            int mid = (lo + hi) >>> 1;
            if (nums[mid] > nums[hi]) lo = mid + 1;
            else hi = mid;
        }
        int pivot = lo, n = nums.length;
        int a = 0, b = pivot;
        if (target >= nums[pivot] && target <= nums[n - 1]) { a = pivot; b = n; }
        // Arrays.binarySearch trả -(điểm chèn) - 1 khi không thấy: phải kiểm >= 0, không so với -1
        int i = Arrays.binarySearch(nums, a, b, target);
        return i >= 0 ? i : -1;
    }

    public static void main(String[] args) {
        int[][] in = {{4, 5, 6, 7, 0, 1, 2}, {4, 5, 6, 7, 0, 1, 2}, {1}, {1}, {3, 1}, {5, 1, 3}, {1, 3}, {6, 7, 1, 2, 3, 4, 5}, {1, 2, 3, 4, 5}};
        int[] target = {0, 3, 0, 1, 1, 3, 3, 6, 4}, want = {4, -1, -1, 0, 1, 2, 1, 0, 3};
        for (String name : new String[] {"linearScan", "onePass", "pivotThenSearch"}) {
            int ok = 0;
            for (int i = 0; i < in.length; i++) {
                int got = switch (name) {
                    case "linearScan" -> linearScan(in[i], target[i]);
                    case "onePass" -> onePass(in[i], target[i]);
                    default -> pivotThenSearch(in[i], target[i]);
                };
                if (got == want[i]) ok++;
            }
            System.out.printf("%-16s %d/%d ca đúng%n", name, ok, in.length);
        }
        System.out.printf("%nArrays.binarySearch([1, 3, 5], 4) = %d%n", Arrays.binarySearch(new int[] {1, 3, 5}, 4));
    }
}
