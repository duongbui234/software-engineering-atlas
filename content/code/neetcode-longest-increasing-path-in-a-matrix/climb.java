// LeetCode 329: đường tăng dài nhất trong ma trận, ba cách giải
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class climb {
    static final int[][] DIRS = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
    static long calls = 0;

    // Vét cạn: DFS từ mọi ô, không nhớ gì
    static int longestPathBrute(int[][] grid) {
        int answer = 0;
        for (int r = 0; r < grid.length; r++)
            for (int c = 0; c < grid[0].length; c++) answer = Math.max(answer, bruteClimb(grid, r, c));
        return answer;
    }

    static int bruteClimb(int[][] grid, int r, int c) {
        calls++;
        int best = 1;
        for (int[] d : DIRS) {
            int nr = r + d[0], nc = c + d[1];
            if (nr >= 0 && nr < grid.length && nc >= 0 && nc < grid[0].length && grid[nr][nc] > grid[r][c]) {
                best = Math.max(best, 1 + bruteClimb(grid, nr, nc));
            }
        }
        return best;
    }

    // DFS ghi nhớ: memo[r][c] = độ dài đường tăng dài nhất bắt đầu ở ô đó.
    // Không cần tập "đang thăm": cạnh chỉ đi lên giá trị lớn hơn nên không có vòng.
    static int longestPathMemo(int[][] grid) {
        int[][] memo = new int[grid.length][grid[0].length]; // 0 = chưa tính, đáp án luôn ≥ 1
        int answer = 0;
        for (int r = 0; r < grid.length; r++)
            for (int c = 0; c < grid[0].length; c++) answer = Math.max(answer, memoClimb(grid, memo, r, c));
        return answer;
    }

    static int memoClimb(int[][] grid, int[][] memo, int r, int c) {
        calls++;
        if (memo[r][c] != 0) return memo[r][c];
        int best = 1;
        for (int[] d : DIRS) {
            int nr = r + d[0], nc = c + d[1];
            if (nr >= 0 && nr < grid.length && nc >= 0 && nc < grid[0].length && grid[nr][nc] > grid[r][c]) {
                best = Math.max(best, 1 + memoClimb(grid, memo, nr, nc));
            }
        }
        return memo[r][c] = best;
    }

    // Bóc lớp theo thứ tự topo (Kahn): lớp đầu là các "đỉnh" không còn ô lớn hơn kề bên.
    // Số lớp bóc được chính là độ dài đường dài nhất. Không đệ quy.
    static int longestIncreasingPath(int[][] grid) {
        int rows = grid.length, cols = grid[0].length;
        int[] outDegree = new int[rows * cols]; // số ô kề lớn hơn
        int[] layer = new int[rows * cols];
        int size = 0;
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                for (int[] d : DIRS) {
                    int nr = r + d[0], nc = c + d[1];
                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] > grid[r][c]) outDegree[r * cols + c]++;
                }
                if (outDegree[r * cols + c] == 0) layer[size++] = r * cols + c;
            }
        }
        int layers = 0;
        int[] next = new int[rows * cols];
        while (size > 0) {
            layers++;
            int nextSize = 0;
            for (int k = 0; k < size; k++) {
                int r = layer[k] / cols, c = layer[k] % cols;
                for (int[] d : DIRS) {
                    int nr = r + d[0], nc = c + d[1];
                    // ô nhỏ hơn kề bên mất một lối lên; hết lối thì vào lớp sau
                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] < grid[r][c]) {
                        if (--outDegree[nr * cols + nc] == 0) next[nextSize++] = nr * cols + nc;
                    }
                }
            }
            int[] swap = layer; layer = next; next = swap;
            size = nextSize;
        }
        return layers;
    }

    // ---------- kiểm tra ----------
    static int[][] filled(int n, int v) {
        int[][] grid = new int[n][n];
        for (int[] row : grid) Arrays.fill(row, v);
        return grid;
    }

    static int[][] snake(int n) {
        int[][] grid = new int[n][n];
        for (int r = 0; r < n; r++)
            for (int c = 0; c < n; c++) grid[r][c] = r * n + (r % 2 == 0 ? c : n - 1 - c);
        return grid;
    }

    // Hàng chẵn là lối đi zigzag, hàng lẻ là tường giá trị 0 chừa một ô nối.
    // Từ ô (0, 0) chỉ có đúng một ô kề lớn hơn, nên DFS đi một mạch hết đường.
    static int[][] corridor(int n) {
        int[][] grid = new int[n][n];
        int value = 0;
        for (int k = 0; 2 * k < n; k++) {
            int r = 2 * k;
            for (int i = 0; i < n; i++) grid[r][k % 2 == 0 ? i : n - 1 - i] = ++value;
            if (r + 2 < n) grid[r + 1][k % 2 == 0 ? n - 1 : 0] = ++value;
        }
        return grid;
    }

    static int[][] shape(int[] flat, int rows, int cols) {
        int[][] grid = new int[rows][cols];
        for (int r = 0; r < rows; r++) grid[r] = Arrays.copyOfRange(flat, r * cols, (r + 1) * cols);
        return grid;
    }

    static void permute(List<Integer> items, List<Integer> prefix, List<int[]> out) {
        if (items.isEmpty()) {
            out.add(prefix.stream().mapToInt(Integer::intValue).toArray());
            return;
        }
        for (int i = 0; i < items.size(); i++) {
            List<Integer> rest = new ArrayList<>(items);
            int v = rest.remove(i);
            List<Integer> longer = new ArrayList<>(prefix);
            longer.add(v);
            permute(rest, longer, out);
        }
    }

    static int total = 0, agree = 0;

    static void check(int[][] grid) {
        total++;
        int want = longestPathBrute(grid);
        if (longestPathMemo(grid) == want && longestIncreasingPath(grid) == want) agree++;
    }

    public static void main(String[] args) throws InterruptedException {
        int[][][] small = {
            {{1}},
            {{7, 7}, {7, 7}},
            {{1, 2, 3}, {6, 5, 4}, {7, 8, 9}},
            {{5, 4}, {2, 3}},
            {{1, 3, 2, 4, 5}},
            {{3}, {2}, {1}},
            {{0, 2147483647}},
            {{7, 8, 1}, {6, 2, 3}, {5, 4, 9}},
        };
        int[] smallWant = {1, 1, 9, 4, 3, 3, 2, 6};
        int[][][] big = {filled(200, 5), snake(200), corridor(200)};
        int[] bigWant = {1, 40000, 20100};
        int ok = 0;
        for (int i = 0; i < small.length; i++) {
            int w = smallWant[i];
            if (longestPathBrute(small[i]) == w && longestPathMemo(small[i]) == w && longestIncreasingPath(small[i]) == w) ok++;
            else System.out.println("sai: " + Arrays.deepToString(small[i]));
        }
        for (int i = 0; i < big.length; i++) {
            if (longestIncreasingPath(big[i]) == bigWant[i]) ok++;
            else System.out.println("sai ở lưới lớn, mong " + bigWant[i]);
        }
        System.out.println(ok + "/" + (small.length + big.length) + " ca đúng");

        // Đối chiếu: mọi lưới r×c (r·c ≤ 6) giá trị 0..2, và mọi lưới 2×3, 3×2 là hoán vị của 1..6
        for (int rows = 1; rows <= 6; rows++) {
            for (int cols = 1; rows * cols <= 6; cols++) {
                int size = rows * cols, limit = (int) Math.pow(3, size);
                for (int code = 0; code < limit; code++) {
                    int[] flat = new int[size];
                    for (int k = 0, x = code; k < size; k++, x /= 3) flat[k] = x % 3;
                    check(shape(flat, rows, cols));
                }
            }
        }
        List<int[]> perms = new ArrayList<>();
        permute(new ArrayList<>(List.of(1, 2, 3, 4, 5, 6)), new ArrayList<>(), perms);
        for (int[] p : perms) {
            check(shape(p, 2, 3));
            check(shape(p, 3, 2));
        }
        System.out.println(agree + "/" + total + " ca đúng (đối chiếu vét cạn)");

        // Đếm lượt gọi trên lưới 10×10 có giá trị i + j: rất nhiều đường tăng chồng lên nhau
        int[][] diagonal = new int[10][10];
        for (int r = 0; r < 10; r++) for (int c = 0; c < 10; c++) diagonal[r][c] = r + c;
        calls = 0;
        longestPathBrute(diagonal);
        long bruteCalls = calls;
        calls = 0;
        longestPathMemo(diagonal);
        System.out.println("Lưới 10×10 giá trị i+j: vét cạn " + bruteCalls + " lượt gọi, memo " + calls + " lượt gọi");

        // Lưới hành lang 200×200: DFS từ ô (0, 0) phải đệ quy sâu 20099 tầng
        int[][] deep = corridor(200);
        String memoResult;
        try {
            memoResult = String.valueOf(longestPathMemo(deep));
        } catch (StackOverflowError e) {
            memoResult = "tràn ngăn xếp (StackOverflowError)";
        }
        System.out.println("Lưới hành lang 200×200: bóc lớp " + longestIncreasingPath(deep) + ", memo đệ quy " + memoResult);

        // Luồng riêng với ngăn xếp 256 MB thì đệ quy sâu không tràn
        int[] result = new int[1];
        Thread worker = new Thread(null, () -> result[0] = longestPathMemo(deep), "deep", 256L * 1024 * 1024);
        worker.start();
        worker.join();
        System.out.println("Luồng ngăn xếp 256 MB: memo đệ quy " + result[0]);
    }
}
