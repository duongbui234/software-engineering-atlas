// Ga DP-06: DP có trạng thái. Chạy: java states.java
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

class States {
    static final int NEG_INF = -(1 << 30); // như −∞, còn chỗ trừ thêm mà không tràn int
    static final int[][] DIRS = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

    static int maxProfitCooldown(int[] prices) {
        int hold = NEG_INF; // đang giữ một cổ phiếu
        int sold = NEG_INF; // vừa bán hôm nay, mai phải nghỉ
        int rest = 0;       // tay không, được mua
        for (int price : prices) {
            int prevSold = sold;
            sold = hold + price;
            hold = Math.max(hold, rest - price);
            rest = Math.max(rest, prevSold);
        }
        return Math.max(rest, sold);
    }

    static int longestIncreasingPath(int[][] grid) {
        int m = grid.length, n = grid[0].length;
        int[][] memo = new int[m][n];
        int answer = 0;
        for (int r = 0; r < m; r++)
            for (int c = 0; c < n; c++) answer = Math.max(answer, dfs(grid, memo, r, c));
        return answer;
    }

    static int dfs(int[][] grid, int[][] memo, int r, int c) {
        if (memo[r][c] > 0) return memo[r][c];
        int best = 1;
        for (int[] d : DIRS) {
            int nr = r + d[0], nc = c + d[1];
            if (nr >= 0 && nr < grid.length && nc >= 0 && nc < grid[0].length && grid[nr][nc] > grid[r][c]) {
                best = Math.max(best, 1 + dfs(grid, memo, nr, nc));
            }
        }
        return memo[r][c] = best;
    }

    static int longestIncreasingPathLayers(int[][] grid) {
        int m = grid.length, n = grid[0].length;
        int[][] out = new int[m][n];
        List<int[]> layer = new ArrayList<>();
        for (int r = 0; r < m; r++)
            for (int c = 0; c < n; c++) {
                for (int[] d : DIRS) {
                    int nr = r + d[0], nc = c + d[1];
                    if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] > grid[r][c]) out[r][c]++;
                }
                if (out[r][c] == 0) layer.add(new int[]{r, c});
            }
        int layers = 0;
        while (!layer.isEmpty()) {
            layers++;
            List<int[]> next = new ArrayList<>();
            for (int[] cell : layer) {
                int r = cell[0], c = cell[1];
                for (int[] d : DIRS) {
                    int nr = r + d[0], nc = c + d[1];
                    if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] < grid[r][c]) {
                        if (--out[nr][nc] == 0) next.add(new int[]{nr, nc});
                    }
                }
            }
            layer = next;
        }
        return layers;
    }

    public static void main(String[] args) {
        int[][] prices = {{5}, {5, 4, 3}, {1, 2}, {1, 3, 2, 8}, {2, 4, 1, 7},
            {1, 4, 2, 7}, {3, 1, 4, 8, 2, 6}, {6, 1, 6, 4, 3, 0, 2}, {1, 2, 4, 2, 5, 7, 2, 4, 9, 0}};
        int[] profits = {0, 0, 1, 7, 6, 6, 7, 7, 11};
        int[][][] grids = {{{7}}, {{1, 2}, {4, 3}}, {{3, 3}, {3, 3}},
            {{5, 4, 3}, {6, 1, 2}, {7, 8, 9}}, {{1, 2, 3, 4, 5}}, {{3}, {2}, {1}}};
        int[] paths = {1, 4, 1, 9, 5, 3};
        int ok = 0, total = 0;
        for (int i = 0; i < prices.length; i++) {
            total++;
            if (maxProfitCooldown(prices[i]) == profits[i]) ok++;
            else System.out.println("sai ở " + Arrays.toString(prices[i]));
        }
        for (int i = 0; i < grids.length; i++) {
            total++;
            if (longestIncreasingPath(grids[i]) == paths[i] && longestIncreasingPathLayers(grids[i]) == paths[i]) ok++;
            else System.out.println("sai ở " + Arrays.deepToString(grids[i]));
        }
        System.out.println(ok + "/" + total + " ca đúng");
    }
}
