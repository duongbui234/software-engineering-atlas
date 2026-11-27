// Ga DP-07: DP khoảng (Burst Balloons) và DP khớp mẫu (Regular Expression Matching).
// Chạy: java intervals.java
import java.util.Arrays;

class Intervals {
    // best[l][r] = số xu nhiều nhất khi nổ hết bóng nằm giữa l và r (không tính l, r).
    // Chọn k là quả nổ CUỐI CÙNG trong khoảng: lúc đó hai bên của k là l và r.
    static int maxCoins(int[] nums) {
        int size = nums.length + 2;
        int[] vals = new int[size]; // thêm hai quả bóng giá 1 ở hai đầu
        vals[0] = 1;
        vals[size - 1] = 1;
        System.arraycopy(nums, 0, vals, 1, nums.length);
        int[][] best = new int[size][size];
        for (int gap = 2; gap < size; gap++) { // khoảng ngắn trước, dài sau
            for (int l = 0; l + gap < size; l++) {
                int r = l + gap;
                for (int k = l + 1; k < r; k++) {
                    int coins = vals[l] * vals[k] * vals[r] + best[l][k] + best[k][r];
                    best[l][r] = Math.max(best[l][r], coins);
                }
            }
        }
        return best[0][size - 1];
    }

    // match[i][j] = s[0:i] khớp trọn p[0:j]. Dấu * đi cùng ký tự đứng trước nó.
    static boolean isMatch(String s, String p) {
        int m = s.length(), n = p.length();
        boolean[][] match = new boolean[m + 1][n + 1];
        match[0][0] = true;
        for (int i = 0; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (p.charAt(j - 1) == '*') {
                    // dùng x* không lần nào (đọc lùi hai cột), hoặc ăn thêm một ký tự của s
                    boolean eats = i > 0 && (p.charAt(j - 2) == '.' || p.charAt(j - 2) == s.charAt(i - 1)) && match[i - 1][j];
                    match[i][j] = match[i][j - 2] || eats;
                } else {
                    match[i][j] = i > 0 && (p.charAt(j - 1) == '.' || p.charAt(j - 1) == s.charAt(i - 1)) && match[i - 1][j - 1];
                }
            }
        }
        return match[m][n];
    }

    public static void main(String[] args) {
        int[][] balloons = { {2, 4, 3}, {5}, {1, 5}, {0, 4}, {3, 3, 3}, {9, 1, 2, 8}, {4, 2, 7, 1, 6} };
        int[] coinsWant = { 33, 5, 10, 4, 39, 243, 296 };
        String[][] patterns = {
            {"", ""}, {"", "a*"}, {"", "a*b*.*"}, {"abc", "abc"},
            {"abc", "a.c"}, {"abc", "ab"}, {"aaa", "a*"}, {"aaa", "ab*a*"},
            {"xyz", ".*"}, {"xyz", ".*q"}, {"ab", ".*c"}, {"aaab", "a*ab"},
            {"ba", "a*ba*"}, {"a", "ab*"}, {"bbbba", ".*a*a"}, {"ab", "a*"},
        };
        boolean[] matchWant = { true, true, true, true, true, false, true, true, true, false, false, true, true, true, true, false };
        int ok = 0;
        for (int c = 0; c < balloons.length; c++) {
            int got = maxCoins(balloons[c]);
            if (got == coinsWant[c]) ok++;
            else System.out.println("sai ở: maxCoins(" + Arrays.toString(balloons[c]) + ") = " + got + ", cần " + coinsWant[c]);
        }
        for (int c = 0; c < patterns.length; c++) {
            boolean got = isMatch(patterns[c][0], patterns[c][1]);
            if (got == matchWant[c]) ok++;
            else System.out.println("sai ở: isMatch(\"" + patterns[c][0] + "\", \"" + patterns[c][1] + "\") = " + got + ", cần " + matchWant[c]);
        }
        System.out.println(ok + "/" + (balloons.length + patterns.length) + " ca đúng");
    }
}
