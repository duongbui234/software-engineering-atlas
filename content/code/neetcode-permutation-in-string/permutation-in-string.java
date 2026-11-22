// LeetCode 567, Permutation in String: ba cách, một bản sai, và test.
// Chạy: java permutation-in-string.java
import java.util.*;

class PermutationInString {
    static boolean sortEachWindow(String s1, String s2) {
        char[] key = s1.toCharArray();
        Arrays.sort(key);
        for (int i = 0; i + s1.length() <= s2.length(); i++) {
            char[] w = s2.substring(i, i + s1.length()).toCharArray();
            Arrays.sort(w);
            if (Arrays.equals(w, key)) return true;
        }
        return false;
    }

    static boolean slideCompare26(String s1, String s2) {
        int m = s1.length();
        if (m > s2.length()) return false;
        int[] need = new int[26], have = new int[26];
        for (int i = 0; i < m; i++) { need[s1.charAt(i) - 'a']++; have[s2.charAt(i) - 'a']++; }
        if (Arrays.equals(need, have)) return true; // need == have so tham chiếu: luôn false
        for (int r = m; r < s2.length(); r++) {
            have[s2.charAt(r) - 'a']++;
            have[s2.charAt(r - m) - 'a']--;
            if (Arrays.equals(need, have)) return true;
        }
        return false;
    }

    static boolean matchesCounter(String s1, String s2) {
        int m = s1.length();
        if (m > s2.length()) return false;
        int[] diff = new int[26];
        for (int i = 0; i < m; i++) { diff[s1.charAt(i) - 'a']--; diff[s2.charAt(i) - 'a']++; }
        int matches = 0;
        for (int d : diff) if (d == 0) matches++;
        for (int r = m; r < s2.length() && matches < 26; r++) {
            int in = s2.charAt(r) - 'a', out = s2.charAt(r - m) - 'a';
            if (diff[in] == 0) matches--;
            if (++diff[in] == 0) matches++;
            if (diff[out] == 0) matches--;
            if (--diff[out] == 0) matches++;
        }
        return matches == 26;
    }

    // SAI: so hai int[] bằng ==
    static boolean wrongArrayEquals(String s1, String s2) {
        int m = s1.length();
        if (m > s2.length()) return false;
        int[] need = new int[26], have = new int[26];
        for (int i = 0; i < m; i++) { need[s1.charAt(i) - 'a']++; have[s2.charAt(i) - 'a']++; }
        for (int r = m; ; r++) {
            if (need == have) return true;
            if (r == s2.length()) return false;
            have[s2.charAt(r) - 'a']++;
            have[s2.charAt(r - m) - 'a']--;
        }
    }

    public static void main(String[] args) {
        Object[][] cases = {{"ab", "eidbaooo", true}, {"ab", "eidboaoo", false}, {"adc", "dcda", true}, {"abc", "ab", false},
            {"a", "a", true}, {"aab", "abbab", false}, {"aab", "xxbaa", true}, {"hello", "ooolleoooleh", false}};
        for (String name : new String[] {"sortEachWindow", "slideCompare26", "matchesCounter", "wrongArrayEquals"}) {
            int ok = 0;
            for (Object[] c : cases) {
                String a = (String) c[0], b = (String) c[1];
                boolean got = switch (name) {
                    case "sortEachWindow" -> sortEachWindow(a, b);
                    case "slideCompare26" -> slideCompare26(a, b);
                    case "matchesCounter" -> matchesCounter(a, b);
                    default -> wrongArrayEquals(a, b);
                };
                if (got == (boolean) c[2]) ok++;
            }
            System.out.printf("%-16s %d/%d ca đúng%n", name, ok, cases.length);
        }
    }
}
