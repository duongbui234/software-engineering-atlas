import java.util.ArrayList;
import java.util.List;

class Ways {
    static final long CAP = 1L << 31; // đáp án LeetCode luôn nhỏ hơn mức này
    static int calls;

    static long search(String s, String t, int i, int j, Long[][] cache) {
        calls++;
        if (j == t.length()) return 1;
        if (s.length() - i < t.length() - j) return 0;
        if (cache != null && cache[i][j] != null) return cache[i][j];
        long ways = search(s, t, i + 1, j, cache);
        if (s.charAt(i) == t.charAt(j)) ways = Math.min(ways + search(s, t, i + 1, j + 1, cache), CAP);
        if (cache != null) cache[i][j] = ways;
        return ways;
    }

    static long countSearch(String s, String t, boolean memo) {
        Long[][] cache = memo ? new Long[s.length() + 1][t.length() + 1] : null;
        return search(s, t, 0, 0, cache);
    }

    static long countTable(String s, String t) {
        int m = s.length(), n = t.length();
        // ways[i][j]: số cách chọn t[:j] làm dãy con của s[:i]
        long[][] ways = new long[m + 1][n + 1];
        for (int i = 0; i <= m; i++) ways[i][0] = 1;
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                ways[i][j] = ways[i - 1][j];
                if (s.charAt(i - 1) == t.charAt(j - 1)) ways[i][j] = Math.min(ways[i][j] + ways[i - 1][j - 1], CAP);
            }
        }
        return ways[m][n];
    }

    static long[] fillRow(String s, String t, long cap) {
        long[] row = new long[t.length() + 1];
        row[0] = 1;
        for (int i = 0; i < s.length(); i++) {
            // đi ngược để row[j - 1] vẫn là giá trị của hàng trước
            for (int j = t.length(); j >= 1; j--) {
                if (s.charAt(i) == t.charAt(j - 1)) row[j] = Math.min(row[j] + row[j - 1], cap);
            }
        }
        return row;
    }

    static long countRow(String s, String t, long cap) {
        return fillRow(s, t, cap)[t.length()];
    }

    static boolean allMatch(String s, String t, long expected) {
        if (countTable(s, t) != expected || countRow(s, t, CAP) != expected
            || countSearch(s, t, true) != expected) return false;
        return s.length() > 20 || countSearch(s, t, false) == expected;
    }

    static long countOracle(String s, String t) {
        long found = 0;
        for (int mask = 0; mask < 1 << s.length(); mask++) {
            StringBuilder picked = new StringBuilder();
            for (int k = 0; k < s.length(); k++) if ((mask & (1 << k)) != 0) picked.append(s.charAt(k));
            if (picked.toString().equals(t)) found++;
        }
        return found;
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
            {"banana", "ban", 3L},
            {"banana", "ana", 4L},
            {"aaa", "aa", 3L},
            {"ab", "abc", 0L},
            {"abc", "d", 0L},
            {"Aa", "a", 1L},
            {"mississippi", "sip", 12L},
            {a(1000), a(3), 166167000L},
            {a(1000), a(1000), 1L},
            {a(1000), a(499) + "b", 0L},
            {"ab".repeat(100), "abab", 4249575L},
        };
        for (Object[] c : cases) {
            if (!allMatch((String) c[0], (String) c[1], (Long) c[2])) throw new AssertionError("Ca kiểm tra sai");
        }
        System.out.println(cases.length + "/" + cases.length + " ca đúng");

        List<String> targets = new ArrayList<>();
        for (int size = 1; size <= 3; size++) targets.addAll(stringsOf(size));
        int probes = 0;
        for (int size = 0; size < 8; size++) {
            for (String s : stringsOf(size)) {
                for (String t : targets) {
                    long expected = countOracle(s, t);
                    if (!allMatch(s, t, expected) || countRow(s, t, 3) != Math.min(expected, 3)) {
                        throw new AssertionError("Ca vét đối chiếu sai");
                    }
                    probes++;
                }
            }
        }
        System.out.println(probes + "/" + probes + " ca đúng (vét mọi tập vị trí)");

        long[] row = fillRow(a(1000), a(499) + "b", CAP);
        int full = 0;
        for (long value : row) if (value == CAP) full++;
        System.out.println("Hàng cuối: " + full + "/" + row.length + " ô chạm 2^31, đáp án " + row[500]);
    }
}
