// LeetCode 153, Find Minimum in Rotated Sorted Array: ba cách và test.
// Chạy: java find-min-rotated.java
import java.util.*;

class FindMinRotated {
    static int linearScan(int[] nums) {
        return Arrays.stream(nums).min().getAsInt();
    }

    static int binaryVsHi(int[] nums) {
        int lo = 0, hi = nums.length - 1;
        while (lo < hi) {
            int mid = (lo + hi) >>> 1; // >>> 1 coi tổng là số không dấu: không âm kể cả khi lo + hi tràn int
            if (nums[mid] > nums[hi]) lo = mid + 1;
            else hi = mid;
        }
        return nums[lo];
    }

    static int binaryVsFirst(int[] nums) {
        if (nums[0] <= nums[nums.length - 1]) return nums[0];
        int lo = 0, hi = nums.length - 1;
        while (lo < hi) {
            int mid = (lo + hi) >>> 1;
            if (nums[mid] >= nums[0]) lo = mid + 1;
            else hi = mid;
        }
        return nums[lo];
    }

    public static void main(String[] args) {
        int[][] in = {{3, 4, 5, 1, 2}, {4, 5, 6, 7, 0, 1, 2}, {11, 13, 15, 17}, {1}, {2, 1}, {1, 2}, {5, 1, 2, 3, 4}, {2, 3, 4, 5, 1}};
        int[] want = {1, 0, 11, 1, 1, 1, 1, 1};
        for (String name : new String[] {"linearScan", "binaryVsHi", "binaryVsFirst"}) {
            int ok = 0;
            for (int i = 0; i < in.length; i++) {
                int got = switch (name) {
                    case "linearScan" -> linearScan(in[i]);
                    case "binaryVsHi" -> binaryVsHi(in[i]);
                    default -> binaryVsFirst(in[i]);
                };
                if (got == want[i]) ok++;
            }
            System.out.printf("%-14s %d/%d ca đúng%n", name, ok, in.length);
        }
        int lo = 1_500_000_000, hi = 2_000_000_000;
        System.out.printf("%n(lo + hi) / 2 = %d, (lo + hi) >>> 1 = %d%n", (lo + hi) / 2, (lo + hi) >>> 1);
    }
}
