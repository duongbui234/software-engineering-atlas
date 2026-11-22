// LeetCode 424, Longest Repeating Character Replacement: ba cách và test.
// Chạy: java character-replacement.java
class CharacterReplacement {
    static int bruteForce(String s, int k) {
        int best = 0;
        for (int i = 0; i < s.length(); i++) {
            int[] count = new int[26];
            int maxFreq = 0;
            for (int j = i; j < s.length(); j++) {
                maxFreq = Math.max(maxFreq, ++count[s.charAt(j) - 'A']);
                if (j - i + 1 - maxFreq <= k) best = Math.max(best, j - i + 1);
            }
        }
        return best;
    }

    static int windowRecount(String s, int k) {
        int[] count = new int[26];
        int left = 0, best = 0;
        for (int right = 0; right < s.length(); right++) {
            count[s.charAt(right) - 'A']++;
            while (right - left + 1 - max(count) > k) count[s.charAt(left++) - 'A']--;
            best = Math.max(best, right - left + 1);
        }
        return best;
    }

    static int max(int[] a) {
        int m = 0;
        for (int x : a) m = Math.max(m, x);
        return m;
    }

    static int windowStaleMax(String s, int k) {
        int[] count = new int[26];
        int left = 0, maxFreq = 0;
        for (int right = 0; right < s.length(); right++) {
            maxFreq = Math.max(maxFreq, ++count[s.charAt(right) - 'A']); // char − 'A' ra int 0..25
            if (right - left + 1 - maxFreq > k) count[s.charAt(left++) - 'A']--;
        }
        return s.length() - left;
    }

    public static void main(String[] args) {
        Object[][] cases = {{"ABAB", 2, 4}, {"AABABBA", 1, 4}, {"A", 0, 1}, {"ABCDE", 1, 2}, {"AAAA", 0, 4}, {"BAAAB", 2, 5}, {"ABBB", 2, 4}, {"ABCABCAA", 2, 5}};
        for (String name : new String[] {"bruteForce", "windowRecount", "windowStaleMax"}) {
            int ok = 0;
            for (Object[] c : cases) {
                String s = (String) c[0];
                int k = (int) c[1];
                int got = switch (name) { case "bruteForce" -> bruteForce(s, k); case "windowRecount" -> windowRecount(s, k); default -> windowStaleMax(s, k); };
                if (got == (int) c[2]) ok++;
            }
            System.out.printf("%-15s %d/%d ca đúng%n", name, ok, cases.length);
        }
    }
}
