import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class common {
    static long calls;

    static int lcsBrute(String a, String b, int i, int j) {
        calls++;
        if (i == a.length() || j == b.length()) return 0;
        if (a.charAt(i) == b.charAt(j)) return 1 + lcsBrute(a, b, i + 1, j + 1);
        return Math.max(lcsBrute(a, b, i + 1, j), lcsBrute(a, b, i, j + 1));
    }

    static int lcsMemo(String a, String b, int i, int j, Map<Integer, Integer> cache) {
        calls++;
        if (i == a.length() || j == b.length()) return 0;
        int key = i * (b.length() + 1) + j;
        Integer saved = cache.get(key);
        if (saved != null) return saved;
        int best = a.charAt(i) == b.charAt(j)
            ? 1 + lcsMemo(a, b, i + 1, j + 1, cache)
            : Math.max(lcsMemo(a, b, i + 1, j, cache), lcsMemo(a, b, i, j + 1, cache));
        cache.put(key, best);
        return best;
    }

    static int[][] lcsTable(String a, String b) {
        // dp[i][j]: LCS của a[:i] và b[:j]; hàng 0 và cột 0 là tiền tố rỗng
        int[][] dp = new int[a.length() + 1][b.length() + 1];
        for (int i = 1; i <= a.length(); i++) {
            for (int j = 1; j <= b.length(); j++) {
                dp[i][j] = a.charAt(i - 1) == b.charAt(j - 1)
                    ? dp[i - 1][j - 1] + 1
                    : Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
        return dp;
    }

    static int lcsRow(String a, String b) {
        if (b.length() > a.length()) {
            String swap = a;
            a = b;
            b = swap;
        }
        int[] row = new int[b.length() + 1];
        for (int i = 1; i <= a.length(); i++) {
            int diagonal = 0; // dp[i-1][j-1], phải giữ trước khi ghi đè row[j]
            for (int j = 1; j <= b.length(); j++) {
                int above = row[j];
                row[j] = a.charAt(i - 1) == b.charAt(j - 1) ? diagonal + 1 : Math.max(above, row[j - 1]);
                diagonal = above;
            }
        }
        return row[b.length()];
    }

    static String rebuild(String a, String b, int[][] dp) {
        int i = a.length(), j = b.length();
        StringBuilder out = new StringBuilder();
        while (i > 0 && j > 0) {
            if (a.charAt(i - 1) == b.charAt(j - 1)) {
                out.append(a.charAt(i - 1));
                i--;
                j--;
            } else if (dp[i - 1][j] >= dp[i][j - 1]) {
                i--;
            } else {
                j--;
            }
        }
        return out.reverse().toString();
    }

    static boolean isSubsequence(String small, String big) {
        int k = 0;
        for (int i = 0; i < big.length() && k < small.length(); i++) {
            if (big.charAt(i) == small.charAt(k)) k++;
        }
        return k == small.length();
    }

    static int bySubsets(String a, String b) {
        int best = 0;
        for (int mask = 0; mask < 1 << a.length(); mask++) {
            StringBuilder picked = new StringBuilder();
            for (int k = 0; k < a.length(); k++) if ((mask >> k & 1) == 1) picked.append(a.charAt(k));
            if (picked.length() > best && isSubsequence(picked.toString(), b)) best = picked.length();
        }
        return best;
    }

    static boolean allAgree(String a, String b, int expected) {
        int[][] dp = lcsTable(a, b);
        String path = rebuild(a, b, dp);
        return dp[a.length()][b.length()] == expected && lcsRow(a, b) == expected &&
            path.length() == expected && isSubsequence(path, a) && isSubsequence(path, b);
    }

    static void check(boolean ok) {
        if (!ok) throw new AssertionError("ca kiểm tra sai");
    }

    record Case(String a, String b, int expected) {}

    public static void main(String[] args) {
        Case[] cases = {
            new Case("bread", "boardgame", 3),
            new Case("abc", "abc", 3),
            new Case("abc", "xyz", 0),
            new Case("a", "a", 1),
            new Case("a", "b", 0),
            new Case("ezupkr", "ubmrapg", 2),
            new Case("abcba", "abcbcba", 5),
            new Case("ab".repeat(500), "ba".repeat(500), 999),
            new Case("a".repeat(1000), "a".repeat(1000), 1000),
        };
        for (Case c : cases) {
            check(allAgree(c.a(), c.b(), c.expected()));
            if (c.a().length() <= 20) check(lcsMemo(c.a(), c.b(), 0, 0, new HashMap<>()) == c.expected());
        }
        System.out.printf("%d/%d ca đúng%n", cases.length, cases.length);

        List<String> words = new ArrayList<>();
        for (int size = 1; size <= 5; size++) {
            for (int mask = 0; mask < 1 << size; mask++) {
                StringBuilder word = new StringBuilder();
                for (int k = size - 1; k >= 0; k--) word.append((mask >> k & 1) == 1 ? 'b' : 'a');
                words.add(word.toString());
            }
        }
        int checked = 0;
        for (String a : words) {
            for (String b : words) {
                int expected = bySubsets(a, b);
                check(allAgree(a, b, expected) && lcsMemo(a, b, 0, 0, new HashMap<>()) == expected);
                if (a.length() + b.length() <= 8) check(lcsBrute(a, b, 0, 0) == expected);
                checked++;
            }
        }
        System.out.printf("%d/%d ca đúng (đối chiếu mọi tập con, chuỗi a/b dài 1–5)%n", checked, checked);

        calls = 0;
        lcsBrute("abcdefghij", "klmnopqrst", 0, 0);
        long bruteCalls = calls;
        calls = 0;
        lcsMemo("abcdefghij", "klmnopqrst", 0, 0, new HashMap<>());
        System.out.printf("Hai chuỗi 10 ký tự không chung chữ: vét cạn %d lượt gọi, memo %d lượt gọi%n", bruteCalls, calls);
        System.out.println("Một LCS của bread và boardgame: " + rebuild("bread", "boardgame", lcsTable("bread", "boardgame")));
    }
}
