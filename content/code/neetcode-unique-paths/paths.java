import java.util.HashMap;
import java.util.Map;

public class paths {
    static final long LIMIT = 2_000_000_000L;
    static long calls;

    static int pathsBrute(int m, int n, int r, int c) {
        calls++;
        if (r == m - 1 && c == n - 1) return 1;
        int total = 0;
        if (r + 1 < m) total += pathsBrute(m, n, r + 1, c);
        if (c + 1 < n) total += pathsBrute(m, n, r, c + 1);
        return total;
    }

    static int pathsMemo(int m, int n, int r, int c, Map<Integer, Integer> cache) {
        calls++;
        if (r == m - 1 || c == n - 1) return 1;
        Integer saved = cache.get(r * n + c);
        if (saved != null) return saved;
        int total = pathsMemo(m, n, r + 1, c, cache) + pathsMemo(m, n, r, c + 1, cache);
        cache.put(r * n + c, total);
        return total;
    }

    static int pathsTable(int m, int n) {
        int[][] ways = new int[m][n];
        for (int[] row : ways) java.util.Arrays.fill(row, 1);
        for (int r = 1; r < m; r++) {
            for (int c = 1; c < n; c++) {
                ways[r][c] = ways[r - 1][c] + ways[r][c - 1];
            }
        }
        return ways[m - 1][n - 1];
    }

    static int pathsRow(int m, int n) {
        int[] row = new int[n];
        java.util.Arrays.fill(row, 1);
        for (int r = 1; r < m; r++) {
            for (int c = 1; c < n; c++) row[c] += row[c - 1];
        }
        return row[n - 1];
    }

    static int pathsFormula(int m, int n) {
        int k = Math.min(m, n) - 1;
        int total = m + n - 2;
        long result = 1; // tích trung gian có thể vượt int, nên giữ long
        for (int i = 1; i <= k; i++) {
            result = result * (total - k + i) / i;
        }
        return (int) result;
    }

    static boolean sameAnswer(int m, int n, long expected) {
        return pathsTable(m, n) == expected && pathsRow(m, n) == expected && pathsFormula(m, n) == expected;
    }

    static void check(boolean ok) {
        if (!ok) throw new AssertionError("ca kiểm tra sai");
    }

    public static void main(String[] args) {
        int[][] cases = {{1, 1, 1}, {1, 7, 1}, {2, 2, 2}, {3, 2, 3}, {3, 7, 28}, {10, 10, 48620}, {23, 12, 193536720}};
        for (int[] tc : cases) {
            check(sameAnswer(tc[0], tc[1], tc[2]) && pathsMemo(tc[0], tc[1], 0, 0, new HashMap<>()) == tc[2]);
        }
        System.out.printf("%d/%d ca đúng%n", cases.length, cases.length);

        int checked = 0;
        for (int m = 1; m <= 8; m++) {
            for (int n = 1; n <= 8; n++) {
                int brute = pathsBrute(m, n, 0, 0);
                check(sameAnswer(m, n, brute) && pathsMemo(m, n, 0, 0, new HashMap<>()) == brute);
                checked++;
            }
        }
        System.out.printf("%d/%d ca đúng (đối chiếu vét cạn, lưới tới 8×8)%n", checked, checked);

        // Pascal có chặn trên: ô nào vượt LIMIT thì giữ ở LIMIT + 1.
        long[][] pascal = new long[101][101];
        for (long[] row : pascal) java.util.Arrays.fill(row, 1);
        for (int r = 2; r <= 100; r++) {
            for (int c = 2; c <= 100; c++) {
                pascal[r][c] = Math.min(pascal[r - 1][c] + pascal[r][c - 1], LIMIT + 1);
            }
        }
        int inside = 0;
        for (int m = 1; m <= 100; m++) {
            for (int n = 1; n <= 100; n++) {
                if (pascal[m][n] <= LIMIT) {
                    check(sameAnswer(m, n, pascal[m][n]));
                    inside++;
                }
            }
        }
        System.out.printf("%d/%d ca đúng (mọi lưới 1..100 có đáp án ≤ 2·10⁹)%n", inside, inside);

        calls = 0;
        pathsBrute(10, 10, 0, 0);
        long bruteCalls = calls;
        calls = 0;
        pathsMemo(10, 10, 0, 0, new HashMap<>());
        System.out.printf("Lưới 10×10: vét cạn %d lượt gọi, memo %d lượt gọi%n", bruteCalls, calls);
    }
}
