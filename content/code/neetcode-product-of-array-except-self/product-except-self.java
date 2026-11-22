// LeetCode 238, Product of Array Except Self: bốn cách và test.
// Chạy: java product-except-self.java
import java.util.*;

class ProductExceptSelf {
    static int[] bruteForce(int[] nums) {
        int[] out = new int[nums.length];
        for (int i = 0; i < nums.length; i++) {
            int p = 1;
            for (int j = 0; j < nums.length; j++) if (j != i) p *= nums[j];
            out[i] = p;
        }
        return out;
    }

    static int[] divisionZeroAware(int[] nums) {
        int zeros = 0, p = 1;
        for (int x : nums) if (x == 0) zeros++; else p *= x;
        int[] out = new int[nums.length]; // Java điền sẵn 0
        for (int i = 0; i < nums.length; i++) {
            if (zeros == 1 && nums[i] == 0) out[i] = p;
            else if (zeros == 0) out[i] = p / nums[i]; // chia int cho 0 ném ArithmeticException
        }
        return out;
    }

    static int[] prefixSuffixArrays(int[] nums) {
        int n = nums.length;
        int[] prefix = new int[n], suffix = new int[n], out = new int[n];
        prefix[0] = 1; suffix[n - 1] = 1;
        for (int i = 1; i < n; i++) prefix[i] = prefix[i - 1] * nums[i - 1];
        for (int i = n - 2; i >= 0; i--) suffix[i] = suffix[i + 1] * nums[i + 1];
        for (int i = 0; i < n; i++) out[i] = prefix[i] * suffix[i];
        return out;
    }

    static int[] prefixSuffixInPlace(int[] nums) {
        int n = nums.length;
        int[] out = new int[n];
        int left = 1;
        for (int i = 0; i < n; i++) { out[i] = left; left *= nums[i]; }
        int right = 1;
        for (int i = n - 1; i >= 0; i--) { out[i] *= right; right *= nums[i]; }
        return out;
    }

    public static void main(String[] args) {
        int[][] in = {{1, 2, 3, 4}, {-1, 1, 0, -3, 3}, {2, 3}, {0, 0, 5}, {0, 4, 5}, {-2, -3, 4}};
        int[][] want = {{24, 12, 8, 6}, {0, 0, 9, 0, 0}, {3, 2}, {0, 0, 0}, {20, 0, 0}, {-12, -8, 6}};
        for (String name : new String[] {"bruteForce", "divisionZeroAware", "prefixSuffixArrays", "prefixSuffixInPlace"}) {
            int ok = 0;
            for (int i = 0; i < in.length; i++) {
                int[] got = switch (name) {
                    case "bruteForce" -> bruteForce(in[i]);
                    case "divisionZeroAware" -> divisionZeroAware(in[i]);
                    case "prefixSuffixArrays" -> prefixSuffixArrays(in[i]);
                    default -> prefixSuffixInPlace(in[i]);
                };
                if (Arrays.equals(got, want[i])) ok++; // == giữa hai mảng so tham chiếu; Arrays.equals so nội dung
            }
            System.out.printf("%-20s %d/%d ca đúng%n", name, ok, in.length);
        }
    }
}
