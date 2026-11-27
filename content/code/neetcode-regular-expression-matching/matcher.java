// Regular Expression Matching (LeetCode 10): vét cạn, ghi nhớ và bảng trên hai tiền tố.
// Chạy: java matcher.java
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

public class matcher {
    static long calls;

    static boolean matchBrute(String s, String p) {
        calls = 0;
        return brute(s, p, 0, 0);
    }

    // Đệ quy thuần trên hậu tố s[i:] và p[j:]; calls đếm số lần gọi.
    static boolean brute(String s, String p, int i, int j) {
        calls++;
        if (j == p.length()) return i == s.length();
        boolean first = i < s.length() && (p.charAt(j) == s.charAt(i) || p.charAt(j) == '.');
        if (j + 1 < p.length() && p.charAt(j + 1) == '*') {
            // bỏ qua cặp "x*" (0 lần) hoặc ăn một ký tự và giữ nguyên "x*"
            return brute(s, p, i, j + 2) || (first && brute(s, p, i + 1, j));
        }
        return first && brute(s, p, i + 1, j + 1);
    }

    static boolean matchMemo(String s, String p) {
        calls = 0;
        // Boolean[][] để phân biệt "chưa tính" (null) với kết quả false.
        return memo(s, p, 0, 0, new Boolean[s.length() + 1][p.length() + 1]);
    }

    static boolean memo(String s, String p, int i, int j, Boolean[][] memo) {
        calls++;
        if (memo[i][j] != null) return memo[i][j];
        boolean ans;
        if (j == p.length()) {
            ans = i == s.length();
        } else {
            boolean first = i < s.length() && (p.charAt(j) == s.charAt(i) || p.charAt(j) == '.');
            if (j + 1 < p.length() && p.charAt(j + 1) == '*') {
                ans = memo(s, p, i, j + 2, memo) || (first && memo(s, p, i + 1, j, memo));
            } else {
                ans = first && memo(s, p, i + 1, j + 1, memo);
            }
        }
        memo[i][j] = ans;
        return ans;
    }

    static boolean isMatch(String s, String p) {
        // dp[i][j]: tiền tố s[0:i] có khớp trọn mẫu p[0:j] không.
        int n = s.length(), m = p.length();
        boolean[][] dp = new boolean[n + 1][m + 1];
        dp[0][0] = true;
        for (int j = 2; j <= m; j++) {
            // chuỗi rỗng chỉ khớp được các cặp "x*" lấy 0 lần
            dp[0][j] = p.charAt(j - 1) == '*' && dp[0][j - 2];
        }
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= m; j++) {
                char pc = p.charAt(j - 1);
                if (pc == '*') {
                    char prev = p.charAt(j - 2);
                    boolean zero = dp[i][j - 2];
                    boolean more = (prev == s.charAt(i - 1) || prev == '.') && dp[i - 1][j];
                    dp[i][j] = zero || more;
                } else {
                    dp[i][j] = (pc == s.charAt(i - 1) || pc == '.') && dp[i - 1][j - 1];
                }
            }
        }
        return dp[n][m];
    }

    static List<String> product(String[] items, int k) {
        List<String> out = new ArrayList<>(List.of(""));
        for (int r = 0; r < k; r++) {
            List<String> next = new ArrayList<>();
            for (String pre : out) for (String x : items) next.add(pre + x);
            out = next;
        }
        return out;
    }

    public static void main(String[] args) {
        Object[][] cases = {
            {"ba", "b", false},
            {"bb", "b*", true},
            {"xy", ".*", true},
            {"kkd", "z*k*d", true},
            {"tomato", "to*ma*to", true},
            {"tomato", "t.m*a*t", false},
            {"ab", ".*z", false},
            {"aaa", "a*a", true},
            {"aaa", "ab*a*c*a", true},
            {"a", "ab*", true},
            {"bbbba", ".*a*a", true},
            {"abcd", "d*", false},
            {"", "a*b*", true},
            {"a", ".*..a*", false},
            {"a".repeat(20), "a*".repeat(7) + "b", false},
        };
        int ok = 0;
        for (Object[] c : cases) {
            String s = (String) c[0], p = (String) c[1];
            boolean want = (Boolean) c[2];
            boolean a = isMatch(s, p), b = matchMemo(s, p), d = matchBrute(s, p);
            if (a == want && b == want && d == want) ok++;
            else System.out.println("sai: " + s + " " + p);
        }
        System.out.println(ok + "/" + cases.length + " ca đúng");

        // Vét mọi chuỗi a/b dài 0–4 và mọi mẫu 0–3 phần tử (a, b, . có hoặc không có *).
        List<String> strs = new ArrayList<>(), patterns = new ArrayList<>();
        for (int n = 0; n <= 4; n++) strs.addAll(product(new String[] {"a", "b"}, n));
        for (int k = 0; k <= 3; k++) patterns.addAll(product(new String[] {"a", "a*", "b", "b*", ".", ".*"}, k));
        int good = 0, total = 0;
        for (String p : patterns) {
            Pattern nativeRe = Pattern.compile(p); // matcher().matches() đòi khớp trọn chuỗi
            for (String s : strs) {
                total++;
                boolean want = nativeRe.matcher(s).matches();
                if (isMatch(s, p) == want && matchMemo(s, p) == want && matchBrute(s, p) == want) good++;
            }
        }
        System.out.println(good + "/" + total + " ca đúng (đối chiếu regex của ngôn ngữ)");

        matchBrute("a".repeat(20), "a*".repeat(7) + "b");
        long brute = calls;
        matchMemo("a".repeat(20), "a*".repeat(7) + "b");
        System.out.println("20 chữ a với (a*)×7 rồi b: vét cạn " + brute + " lượt gọi, memo " + calls + " lượt gọi");
    }
}
