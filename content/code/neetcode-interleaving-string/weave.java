import java.util.ArrayList;
import java.util.List;

class Weave {
    static int calls;

    static boolean search(String s1, String s2, String s3, int i, int j, Boolean[][] cache) {
        calls++;
        if (i == s1.length() && j == s2.length()) return true;
        if (cache != null && cache[i][j] != null) return cache[i][j];
        int k = i + j;
        boolean found = (i < s1.length() && s1.charAt(i) == s3.charAt(k) && search(s1, s2, s3, i + 1, j, cache))
            || (j < s2.length() && s2.charAt(j) == s3.charAt(k) && search(s1, s2, s3, i, j + 1, cache));
        if (cache != null) cache[i][j] = found;
        return found;
    }

    static boolean interleaveSearch(String s1, String s2, String s3, boolean memo) {
        if (s1.length() + s2.length() != s3.length()) return false;
        Boolean[][] cache = memo ? new Boolean[s1.length() + 1][s2.length() + 1] : null;
        return search(s1, s2, s3, 0, 0, cache);
    }

    static boolean interleaveTable(String s1, String s2, String s3) {
        int m = s1.length(), n = s2.length();
        if (m + n != s3.length()) return false;
        // ok[i][j]: s1[:i] và s2[:j] đan thành s3[:i + j]
        boolean[][] ok = new boolean[m + 1][n + 1];
        ok[0][0] = true;
        for (int i = 0; i <= m; i++) {
            for (int j = 0; j <= n; j++) {
                if (i > 0 && ok[i - 1][j] && s1.charAt(i - 1) == s3.charAt(i + j - 1)) ok[i][j] = true;
                if (j > 0 && ok[i][j - 1] && s2.charAt(j - 1) == s3.charAt(i + j - 1)) ok[i][j] = true;
            }
        }
        return ok[m][n];
    }

    static boolean interleaveRow(String s1, String s2, String s3) {
        int m = s1.length(), n = s2.length();
        if (m + n != s3.length()) return false;
        boolean[] row = new boolean[n + 1];
        for (int i = 0; i <= m; i++) {
            for (int j = 0; j <= n; j++) {
                if (i == 0 && j == 0) {
                    row[j] = true;
                    continue;
                }
                // row[j] còn giữ hàng i - 1 (ô trên), row[j - 1] đã là hàng i (ô trái)
                boolean fromTop = i > 0 && row[j] && s1.charAt(i - 1) == s3.charAt(i + j - 1);
                boolean fromLeft = j > 0 && row[j - 1] && s2.charAt(j - 1) == s3.charAt(i + j - 1);
                row[j] = fromTop || fromLeft;
            }
        }
        return row[n];
    }

    static boolean allMatch(String s1, String s2, String s3, boolean expected) {
        if (interleaveTable(s1, s2, s3) != expected || interleaveRow(s1, s2, s3) != expected
            || interleaveSearch(s1, s2, s3, true) != expected) return false;
        return s3.length() > 24 || interleaveSearch(s1, s2, s3, false) == expected;
    }

    static boolean interleaveOracle(String s1, String s2, String s3) {
        int total = s3.length();
        if (s1.length() + s2.length() != total) return false;
        for (int mask = 0; mask < 1 << total; mask++) {
            StringBuilder first = new StringBuilder(), second = new StringBuilder();
            for (int k = 0; k < total; k++) {
                if ((mask & (1 << k)) != 0) first.append(s3.charAt(k));
                else second.append(s3.charAt(k));
            }
            if (first.toString().equals(s1) && second.toString().equals(s2)) return true;
        }
        return false;
    }

    static List<String> stringsOf(int size) {
        List<String> out = new ArrayList<>();
        for (int mask = 0; mask < 1 << size; mask++) {
            StringBuilder word = new StringBuilder();
            for (int k = size - 1; k >= 0; k--) word.append((mask & (1 << k)) != 0 ? 'b' : 'a');
            out.add(word.toString());
        }
        return out;
    }

    static String a(int count) {
        return "a".repeat(count);
    }

    public static void main(String[] args) {
        Object[][] cases = {
            {"ab", "cd", "acbd", true},
            {"ab", "cd", "acdb", true},
            {"ab", "cd", "badc", false},
            {"ab", "ac", "acab", true},
            {"a", "b", "abc", false},
            {"", "", "", true},
            {"", "kiwi", "kiwi", true},
            {"", "kiwi", "kiwj", false},
            {"aab", "aac", "aacaab", true},
            {"aab", "aac", "abaaac", false},
            {a(100), a(100), a(200), true},
            {a(100), a(99) + "b", a(198) + "ba", true},
            {a(100), a(99) + "b", a(198) + "bb", false},
        };
        for (Object[] c : cases) {
            if (!allMatch((String) c[0], (String) c[1], (String) c[2], (Boolean) c[3])) {
                throw new AssertionError("Ca kiểm tra sai");
            }
        }
        System.out.println(cases.length + "/" + cases.length + " ca đúng");

        List<String> words = new ArrayList<>();
        for (int size = 0; size <= 3; size++) words.addAll(stringsOf(size));
        int probes = 0;
        for (String s1 : words) {
            for (String s2 : words) {
                for (int size : new int[] {s1.length() + s2.length(), s1.length() + s2.length() + 1}) {
                    for (String s3 : stringsOf(size)) {
                        if (!allMatch(s1, s2, s3, interleaveOracle(s1, s2, s3))) {
                            throw new AssertionError("Ca vét đối chiếu sai");
                        }
                        probes++;
                    }
                }
            }
        }
        System.out.println(probes + "/" + probes + " ca đúng (vét mọi cách chia)");

        calls = 0;
        interleaveSearch(a(10), a(10), a(19) + "b", false);
        int brute = calls;
        calls = 0;
        interleaveSearch(a(10), a(10), a(19) + "b", true);
        System.out.println("Vét cạn: " + brute + " lượt gọi, memo: " + calls + " lượt gọi");
    }
}
