// LeetCode 704, Binary Search: hai quy ước khoảng, Arrays.binarySearch và lỗi tràn điểm giữa.
// Chạy: java binary-search.java
import java.util.*;

class BinarySearch {
    static int closedInterval(int[] nums, int target) {
        int lo = 0, hi = nums.length - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2; // KHÔNG viết (lo + hi) / 2: tổng có thể vượt Integer.MAX_VALUE
            if (nums[mid] == target) return mid;
            if (nums[mid] < target) lo = mid + 1;
            else hi = mid - 1;
        }
        return -1;
    }

    static int halfOpen(int[] nums, int target) {
        int lo = 0, hi = nums.length;
        while (lo < hi) {
            int mid = (lo + hi) >>> 1; // dịch không dấu: tổng tràn thành số âm vẫn được đọc như số dương
            if (nums[mid] == target) return mid;
            if (nums[mid] < target) lo = mid + 1;
            else hi = mid;
        }
        return -1;
    }

    static int viaLibrary(int[] nums, int target) {
        int i = Arrays.binarySearch(nums, target); // không thấy thì trả -(vị trí chèn) - 1, luôn âm
        return i >= 0 ? i : -1;
    }

    public static void main(String[] args) {
        int[][] in = {{-1, 0, 3, 5, 9, 12}, {-1, 0, 3, 5, 9, 12}, {5}, {5}, {1, 3}, {1, 3}, {1, 3, 5, 7, 9, 11, 13}, {1, 3, 5, 7, 9, 11, 13}};
        int[] t = {9, 2, 5, 7, 3, 0, 13, 1}, want = {4, -1, 0, -1, 1, -1, 6, 0};
        for (String name : new String[] {"closedInterval", "halfOpen", "viaLibrary"}) {
            int ok = 0;
            for (int i = 0; i < in.length; i++) {
                int got = switch (name) {
                    case "closedInterval" -> closedInterval(in[i], t[i]);
                    case "halfOpen" -> halfOpen(in[i], t[i]);
                    default -> viaLibrary(in[i], t[i]);
                };
                if (got == want[i]) ok++;
            }
            System.out.printf("%-15s %d/%d ca đúng%n", name, ok, in.length);
        }
        System.out.printf("%nArrays.binarySearch([1, 3, 5], 4) = %d  (vị trí chèn 2 → -2 - 1)%n", Arrays.binarySearch(new int[] {1, 3, 5}, 4));
        int lo = 1_500_000_000, hi = 2_000_000_000;
        System.out.printf("lo = %d, hi = %d%n", lo, hi);
        System.out.printf("(lo + hi) / 2         = %d%n", (lo + hi) / 2);
        System.out.printf("(lo + hi) >>> 1       = %d%n", (lo + hi) >>> 1);
        System.out.printf("lo + (hi - lo) / 2    = %d%n", lo + (hi - lo) / 2);
    }
}
