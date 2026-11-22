// LeetCode 3, Longest Substring Without Repeating Characters: ba cách và test.
// Chạy: java longest-substring.java
import java.util.*;

class LongestSubstring {
    static int bruteForce(String s) {
        int best = 0;
        for (int i = 0; i < s.length(); i++) {
            Set<Character> seen = new HashSet<>();
            for (int j = i; j < s.length() && seen.add(s.charAt(j)); j++) { } // add trả false khi đã có
            best = Math.max(best, seen.size());
        }
        return best;
    }

    static int windowSet(String s) {
        Set<Character> inWindow = new HashSet<>();
        int left = 0, best = 0;
        for (int right = 0; right < s.length(); right++) {
            while (!inWindow.add(s.charAt(right))) inWindow.remove(s.charAt(left++));
            best = Math.max(best, right - left + 1);
        }
        return best;
    }

    static int windowLastSeen(String s) {
        int[] last = new int[128]; // vị trí + 1; mảng int mới toàn 0 nghĩa là "chưa gặp"
        int left = 0, best = 0;
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            left = Math.max(left, last[c]);
            last[c] = right + 1;
            best = Math.max(best, right - left + 1);
        }
        return best;
    }

    public static void main(String[] args) {
        String[] in = {"abcabcbb", "bbbbb", "pwwkew", "", " ", "abba", "dvdf", "tmmzuxt"};
        int[] want = {3, 1, 3, 0, 1, 2, 3, 5};
        for (String name : new String[] {"bruteForce", "windowSet", "windowLastSeen"}) {
            int ok = 0;
            for (int i = 0; i < in.length; i++) {
                int got = switch (name) {
                    case "bruteForce" -> bruteForce(in[i]);
                    case "windowSet" -> windowSet(in[i]);
                    default -> windowLastSeen(in[i]);
                };
                if (got == want[i]) ok++;
            }
            System.out.printf("%-15s %d/%d ca đúng%n", name, ok, in.length);
        }
    }
}
