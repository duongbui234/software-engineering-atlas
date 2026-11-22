// LeetCode 167, Two Sum II (mảng đã sắp xếp): bốn cách và test.
// Chạy: java two-sum-ii.java
import java.util.*;

class TwoSumII {
    static int[] bruteForce(int[] nums, int target) {
        for (int i = 0; i < nums.length; i++)
            for (int j = i + 1; j < nums.length; j++) if (nums[i] + nums[j] == target) return new int[] {i + 1, j + 1};
        return new int[0];
    }

    static int[] binarySearch(int[] nums, int target) {
        for (int i = 0; i < nums.length; i++) {
            // khoảng [i + 1, n): không ghép nums[i] với chính nó. Trả số âm nếu không thấy.
            int j = Arrays.binarySearch(nums, i + 1, nums.length, target - nums[i]);
            if (j >= 0) return new int[] {i + 1, j + 1};
        }
        return new int[0];
    }

    static int[] hashMap(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            Integer j = seen.get(target - nums[i]);
            if (j != null) return new int[] {j + 1, i + 1};
            seen.put(nums[i], i);
        }
        return new int[0];
    }

    static int[] twoPointers(int[] nums, int target) {
        int i = 0, j = nums.length - 1;
        while (i < j) {
            int sum = nums[i] + nums[j];
            if (sum == target) return new int[] {i + 1, j + 1};
            if (sum < target) i++; else j--;
        }
        return new int[0];
    }

    public static void main(String[] args) {
        int[][] in = {{2, 7, 11, 15}, {2, 3, 4}, {-1, 0}, {3, 3}, {1, 2, 3, 4, 4, 9, 56, 90}, {-10, -3, 0, 5, 9}};
        int[] t = {9, 6, -1, 6, 8, 6};
        int[][] want = {{1, 2}, {1, 3}, {1, 2}, {1, 2}, {4, 5}, {2, 5}};
        for (String name : new String[] {"bruteForce", "binarySearch", "hashMap", "twoPointers"}) {
            int ok = 0;
            for (int k = 0; k < in.length; k++) {
                int[] got = switch (name) {
                    case "bruteForce" -> bruteForce(in[k], t[k]);
                    case "binarySearch" -> binarySearch(in[k], t[k]);
                    case "hashMap" -> hashMap(in[k], t[k]);
                    default -> twoPointers(in[k], t[k]);
                };
                if (Arrays.equals(got, want[k])) ok++;
            }
            System.out.printf("%-13s %d/%d ca đúng%n", name, ok, in.length);
        }
    }
}
