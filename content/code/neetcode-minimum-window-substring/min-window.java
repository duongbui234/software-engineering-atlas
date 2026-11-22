// LeetCode 76, Minimum Window Substring: hai cách, test, và bẫy so Integer bằng ==.
// Chạy: java min-window.java
import java.util.*;

class MinWindow {
    static String bruteForce(String s, String t) {
        String best = "";
        for (int l = 0; l < s.length(); l++) {
            int[] need = new int[128];
            for (char c : t.toCharArray()) need[c]++;
            int missing = t.length();
            for (int r = l; r < s.length(); r++) {
                if (need[s.charAt(r)]-- > 0) missing--;
                if (missing == 0) {
                    if (best.isEmpty() || r - l + 1 < best.length()) best = s.substring(l, r + 1);
                    break;
                }
            }
        }
        return best;
    }

    static String windowMissing(String s, String t) {
        int[] need = new int[128];
        for (char c : t.toCharArray()) need[c]++;
        int missing = t.length(), l = 0, bestL = 0, bestLen = Integer.MAX_VALUE;
        for (int r = 0; r < s.length(); r++) {
            if (need[s.charAt(r)]-- > 0) missing--;
            while (missing == 0) {
                if (r - l + 1 < bestLen) { bestL = l; bestLen = r - l + 1; }
                if (++need[s.charAt(l++)] > 0) missing++;
            }
        }
        return bestLen == Integer.MAX_VALUE ? "" : s.substring(bestL, bestL + bestLen);
    }

    // Bản hay gặp với HashMap: đếm số chữ "đã đủ" (formed). Viết window.get(c) == need.get(c) là so THAM CHIẾU Integer:
    // đúng khi số lần ≤ 127 (Integer cache), sai khi t cần 128 chữ giống nhau trở lên.
    static String windowFormedIntegerEq(String s, String t) {
        Map<Character, Integer> need = new HashMap<>(), window = new HashMap<>();
        for (char c : t.toCharArray()) need.merge(c, 1, Integer::sum);
        int formed = 0, l = 0, bestL = 0, bestLen = Integer.MAX_VALUE;
        for (int r = 0; r < s.length(); r++) {
            char c = s.charAt(r);
            window.merge(c, 1, Integer::sum);
            if (need.containsKey(c) && window.get(c) == need.get(c)) formed++; // SAI: phải là .equals hoặc .intValue()
            while (formed == need.size()) {
                if (r - l + 1 < bestLen) { bestL = l; bestLen = r - l + 1; }
                char d = s.charAt(l++);
                window.merge(d, -1, Integer::sum);
                if (need.containsKey(d) && window.get(d) < need.get(d)) formed--; // < tự mở hộp, nên dòng này đúng
            }
        }
        return bestLen == Integer.MAX_VALUE ? "" : s.substring(bestL, bestL + bestLen);
    }

    public static void main(String[] args) {
        String many = "a".repeat(200);
        String[][] cases = {{"ADOBECODEBANC", "ABC", "BANC"}, {"a", "a", "a"}, {"a", "aa", ""}, {"aa", "aa", "aa"}, {"ab", "b", "b"},
            {"bba", "ab", "ba"}, {"cabwefgewcwaefgcf", "cae", "cwae"}, {"abc", "d", ""}, {"b" + many + "b", many, many}};
        for (String name : new String[] {"bruteForce", "windowMissing", "windowFormedIntegerEq"}) {
            int ok = 0;
            List<String> bad = new ArrayList<>();
            for (String[] c : cases) {
                String got = switch (name) {
                    case "bruteForce" -> bruteForce(c[0], c[1]);
                    case "windowMissing" -> windowMissing(c[0], c[1]);
                    default -> windowFormedIntegerEq(c[0], c[1]);
                };
                if (got.equals(c[2])) ok++; else bad.add("t = " + (c[1].length() > 10 ? "\"a\" × " + c[1].length() : "\"" + c[1] + "\"") + " → \"" + got + "\"");
            }
            System.out.printf("%-22s %d/%d ca đúng%s%n", name, ok, cases.length, bad.isEmpty() ? "" : "; sai ở " + String.join(" ", bad));
        }
    }
}
