// Ga ARR-04: hai con trỏ. Giải 125, 167, 15, 11, 42 bằng cùng một khuôn, tự chạy test.
// Chạy: java two-pointers.java
import java.util.*;

class TwoPointers {
    static boolean alnum(char c) { return c < 128 && Character.isLetterOrDigit(c); }

    // 125
    static boolean isPalindrome(String s) {
        for (int i = 0, j = s.length() - 1; i < j; ) {
            if (!alnum(s.charAt(i))) i++;
            else if (!alnum(s.charAt(j))) j--;
            else if (Character.toLowerCase(s.charAt(i++)) != Character.toLowerCase(s.charAt(j--))) return false;
        }
        return true;
    }

    // 167
    static int[] twoSumSorted(int[] nums, int target) {
        for (int i = 0, j = nums.length - 1; i < j; ) {
            int s = nums[i] + nums[j];
            if (s == target) return new int[] {i + 1, j + 1};
            if (s < target) i++; else j--;
        }
        return new int[0];
    }

    // 15
    static List<List<Integer>> threeSum(int[] nums) {
        int[] a = nums.clone();
        Arrays.sort(a);
        List<List<Integer>> out = new ArrayList<>();
        for (int i = 0; i < a.length - 2 && a[i] <= 0; i++) {
            if (i > 0 && a[i] == a[i - 1]) continue;
            for (int lo = i + 1, hi = a.length - 1; lo < hi; ) {
                int s = a[i] + a[lo] + a[hi];
                if (s < 0) lo++;
                else if (s > 0) hi--;
                else {
                    out.add(List.of(a[i], a[lo++], a[hi--]));
                    while (lo < hi && a[lo] == a[lo - 1]) lo++;
                }
            }
        }
        return out;
    }

    // 11
    static int maxArea(int[] h) {
        int best = 0;
        for (int i = 0, j = h.length - 1; i < j; ) {
            best = Math.max(best, (j - i) * Math.min(h[i], h[j]));
            if (h[i] < h[j]) i++; else j--;
        }
        return best;
    }

    // 42
    static int trap(int[] h) {
        int total = 0, lm = 0, rm = 0;
        for (int i = 0, j = h.length - 1; i < j; ) {
            lm = Math.max(lm, h[i]);
            rm = Math.max(rm, h[j]);
            if (lm < rm) total += lm - h[i++];
            else total += rm - h[j--];
        }
        return total;
    }

    public static void main(String[] args) {
        boolean[] tests = {
            isPalindrome("A man, a plan, a canal: Panama"), !isPalindrome("race a car"), isPalindrome(" "),
            Arrays.equals(twoSumSorted(new int[] {2, 7, 11, 15}, 9), new int[] {1, 2}),
            Arrays.equals(twoSumSorted(new int[] {-1, 0}, -1), new int[] {1, 2}),
            threeSum(new int[] {-1, 0, 1, 2, -1, -4}).equals(List.of(List.of(-1, -1, 2), List.of(-1, 0, 1))),
            threeSum(new int[] {0, 0, 0, 0}).equals(List.of(List.of(0, 0, 0))),
            maxArea(new int[] {1, 8, 6, 2, 5, 4, 8, 3, 7}) == 49, maxArea(new int[] {1, 1}) == 1,
            trap(new int[] {0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1}) == 6, trap(new int[] {4, 2, 0, 3, 2, 5}) == 9,
        };
        int ok = 0;
        for (boolean t : tests) if (t) ok++;
        System.out.printf("%d/%d ca đúng%n", ok, tests.length);
    }
}
