// Ga ARR-05: cửa sổ trượt. Giải 121, 3, 424, 567, 76, 239 và tự chạy test.
// Chạy: java sliding-window.java
import java.util.*;

class SlidingWindow {
    // 121
    static int maxProfit(int[] prices) {
        int left = 0, best = 0;
        for (int right = 1; right < prices.length; right++) {
            if (prices[right] < prices[left]) left = right;
            else best = Math.max(best, prices[right] - prices[left]);
        }
        return best;
    }

    // 3
    static int lengthOfLongestSubstring(String s) {
        int[] last = new int[128];
        int left = 0, best = 0;
        for (int right = 0; right < s.length(); right++) {
            left = Math.max(left, last[s.charAt(right)]);
            last[s.charAt(right)] = right + 1;
            best = Math.max(best, right - left + 1);
        }
        return best;
    }

    // 424
    static int characterReplacement(String s, int k) {
        int[] count = new int[26];
        int left = 0, maxFreq = 0, best = 0;
        for (int right = 0; right < s.length(); right++) {
            maxFreq = Math.max(maxFreq, ++count[s.charAt(right) - 'A']);
            if (right - left + 1 - maxFreq > k) count[s.charAt(left++) - 'A']--;
            best = Math.max(best, right - left + 1);
        }
        return best;
    }

    // 567
    static boolean checkInclusion(String s1, String s2) {
        int n = s1.length();
        if (n > s2.length()) return false;
        int[] need = new int[26], have = new int[26];
        for (int i = 0; i < n; i++) { need[s1.charAt(i) - 'a']++; have[s2.charAt(i) - 'a']++; }
        for (int right = n; ; right++) {
            if (Arrays.equals(need, have)) return true; // need == have chỉ so tham chiếu
            if (right == s2.length()) return false;
            have[s2.charAt(right) - 'a']++;
            have[s2.charAt(right - n) - 'a']--;
        }
    }

    // 76
    static String minWindow(String s, String t) {
        int[] need = new int[128];
        for (char c : t.toCharArray()) need[c]++;
        int missing = t.length(), left = 0, bestL = 0, bestLen = Integer.MAX_VALUE;
        for (int right = 0; right < s.length(); right++) {
            if (need[s.charAt(right)]-- > 0) missing--;
            while (missing == 0) {
                if (right - left + 1 < bestLen) { bestLen = right - left + 1; bestL = left; }
                if (++need[s.charAt(left++)] > 0) missing++;
            }
        }
        return bestLen == Integer.MAX_VALUE ? "" : s.substring(bestL, bestL + bestLen);
    }

    // 239
    static int[] maxSlidingWindow(int[] nums, int k) {
        Deque<Integer> dq = new ArrayDeque<>(); // ArrayDeque: thêm/bớt hai đầu O(1)
        int[] out = new int[nums.length - k + 1];
        for (int i = 0; i < nums.length; i++) {
            while (!dq.isEmpty() && nums[dq.peekLast()] <= nums[i]) dq.pollLast();
            dq.offerLast(i);
            if (dq.peekFirst() <= i - k) dq.pollFirst();
            if (i >= k - 1) out[i - k + 1] = nums[dq.peekFirst()];
        }
        return out;
    }

    public static void main(String[] args) {
        boolean[] tests = {
            maxProfit(new int[] {7, 1, 5, 3, 6, 4}) == 5, maxProfit(new int[] {7, 6, 4, 3, 1}) == 0,
            lengthOfLongestSubstring("abcabcbb") == 3, lengthOfLongestSubstring("abba") == 2,
            characterReplacement("ABAB", 2) == 4, characterReplacement("AABABBA", 1) == 4,
            checkInclusion("ab", "eidbaooo"), !checkInclusion("ab", "eidboaoo"),
            minWindow("ADOBECODEBANC", "ABC").equals("BANC"), minWindow("a", "aa").equals(""),
            Arrays.equals(maxSlidingWindow(new int[] {1, 3, -1, -3, 5, 3, 6, 7}, 3), new int[] {3, 3, 5, 5, 6, 7}),
            Arrays.equals(maxSlidingWindow(new int[] {1}, 1), new int[] {1}),
        };
        int ok = 0;
        for (boolean t : tests) if (t) ok++;
        System.out.printf("%d/%d ca đúng%n", ok, tests.length);
    }
}
