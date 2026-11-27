// Ga DP-05: bảng theo lưới và theo hai tiền tố
import java.util.Arrays;

class Tables {
    static int uniquePaths(int m, int n) {
        int[] row = new int[n];
        Arrays.fill(row, 1); // hàng 0: mọi ô có đúng một đường
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) row[j] += row[j - 1]; // trên + trái
        }
        return row[n - 1];
    }

    static int longestCommonSubsequence(String a, String b) {
        int[][] dp = new int[a.length() + 1][b.length() + 1];
        for (int i = 1; i <= a.length(); i++) {
            for (int j = 1; j <= b.length(); j++) {
                dp[i][j] = a.charAt(i - 1) == b.charAt(j - 1)
                    ? dp[i - 1][j - 1] + 1
                    : Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
        return dp[a.length()][b.length()];
    }

    static boolean isInterleave(String s1, String s2, String s3) {
        if (s1.length() + s2.length() != s3.length()) return false;
        boolean[] row = new boolean[s2.length() + 1];
        for (int i = 0; i <= s1.length(); i++) {
            for (int j = 0; j <= s2.length(); j++) {
                if (i == 0 && j == 0) { row[j] = true; continue; }
                char c = s3.charAt(i + j - 1);
                boolean fromTop = i > 0 && row[j] && s1.charAt(i - 1) == c;
                boolean fromLeft = j > 0 && row[j - 1] && s2.charAt(j - 1) == c;
                row[j] = fromTop || fromLeft;
            }
        }
        return row[s2.length()];
    }

    static int numDistinct(String s, String t) {
        int[] ways = new int[t.length() + 1];
        ways[0] = 1; // t rỗng: một cách, bỏ hết
        for (int i = 1; i <= s.length(); i++) {
            for (int j = t.length(); j >= 1; j--) { // đi lùi để còn đọc hàng cũ
                if (s.charAt(i - 1) == t.charAt(j - 1)) ways[j] += ways[j - 1];
            }
        }
        return ways[t.length()];
    }

    static int minDistance(String a, String b) {
        int[] row = new int[b.length() + 1];
        for (int j = 0; j <= b.length(); j++) row[j] = j; // a rỗng: chèn j ký tự
        for (int i = 1; i <= a.length(); i++) {
            int diag = row[0]; // dp[i-1][j-1]
            row[0] = i;
            for (int j = 1; j <= b.length(); j++) {
                int top = row[j];
                row[j] = a.charAt(i - 1) == b.charAt(j - 1)
                    ? diag
                    : 1 + Math.min(diag, Math.min(top, row[j - 1])); // thay, xóa, chèn
                diag = top;
            }
        }
        return row[b.length()];
    }

    public static void main(String[] args) {
        boolean[] checks = {
            uniquePaths(3, 7) == 28,
            uniquePaths(3, 2) == 3,
            uniquePaths(1, 1) == 1,
            uniquePaths(23, 12) == 193536720,
            longestCommonSubsequence("abcde", "ace") == 3,
            longestCommonSubsequence("abc", "def") == 0,
            longestCommonSubsequence("map", "mop") == 2,
            isInterleave("aabcc", "dbbca", "aadbbcbcac"),
            !isInterleave("aabcc", "dbbca", "aadbbbaccc"),
            isInterleave("", "", ""),
            !isInterleave("a", "", "ab"),
            numDistinct("rabbbit", "rabbit") == 3,
            numDistinct("babgbag", "bag") == 5,
            numDistinct("a", "b") == 0,
            minDistance("horse", "ros") == 3,
            minDistance("intention", "execution") == 5,
            minDistance("", "abc") == 3,
        };
        for (boolean ok : checks) if (!ok) throw new AssertionError("Ca kiểm tra sai");
        System.out.println(checks.length + "/" + checks.length + " ca đúng");
    }
}
