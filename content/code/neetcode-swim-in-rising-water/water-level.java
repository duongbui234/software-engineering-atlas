import java.util.*;
import java.util.function.IntBinaryOperator;

class SwimTime {
    static int[] leastCosts(List<List<int[]>> graph, int start, int initial, IntBinaryOperator extend) {
        int[] best = new int[graph.size()];
        Arrays.fill(best, Integer.MAX_VALUE);
        best[start] = initial;
        var queue = new PriorityQueue<int[]>(Comparator.comparingInt(entry -> entry[0]));
        queue.add(new int[]{initial, start});
        while (!queue.isEmpty()) {
            int[] entry = queue.remove();
            int cost = entry[0], source = entry[1];
            if (cost != best[source]) continue;
            for (int[] edge : graph.get(source)) {
                int target = edge[0];
                int candidate = extend.applyAsInt(cost, edge[1]);
                if (candidate < best[target]) {
                    best[target] = candidate;
                    queue.add(new int[]{candidate, target});
                }
            }
        }
        return best;
    }

    static List<List<int[]>> emptyGraph(int n) {
        var graph = new ArrayList<List<int[]>>();
        for (int i = 0; i < n; i++) {
            graph.add(new ArrayList<>());
        }
        return graph;
    }

    static int swimTime(int[][] grid) {
        int n = grid.length;
        var graph = emptyGraph(n * n);
        int[][] directions = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};
        for (int row = 0; row < n; row++) {
            for (int col = 0; col < n; col++) {
                for (int[] delta : directions) {
                    int r = row + delta[0], c = col + delta[1];
                    if (0 <= r && r < n && 0 <= c && c < n) {
                        graph.get(row * n + col).add(new int[]{r * n + c, grid[r][c]});
                    }
                }
            }
        }
        return leastCosts(graph, 0, grid[0][0], Math::max)[n * n - 1];
    }

    static boolean reachable(int[][] grid, int level) {
        int n = grid.length;
        var queue = new ArrayDeque<Integer>();
        boolean[] seen = new boolean[n * n];
        queue.add(0);
        seen[0] = true;
        int[][] directions = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        while (!queue.isEmpty()) {
            int cell = queue.remove();
            if (cell == n * n - 1) return true;
            for (int[] direction : directions) {
                int r = cell / n + direction[0], c = cell % n + direction[1];
                if (r >= 0 && r < n && c >= 0 && c < n && grid[r][c] <= level && !seen[r * n + c]) {
                    seen[r * n + c] = true;
                    queue.add(r * n + c);
                }
            }
        }
        return false;
    }

    static int swimByThreshold(int[][] grid, boolean binary) {
        int n = grid.length;
        int low = Math.max(grid[0][0], grid[n - 1][n - 1]), high = n * n - 1;
        if (!binary) {
            while (!reachable(grid, low)) low++;
            return low;
        }
        while (low < high) {
            int mid = (low + high) / 2;
            if (reachable(grid, mid)) high = mid;
            else low = mid + 1;
        }
        return low;
    }

    public static void main(String[] args) {
        check(swimTime(new int[][]{{0}}), 0);
        check(swimByThreshold(new int[][]{{0}}, true), 0);
        check(swimByThreshold(new int[][]{{0}}, false), 0);
        check(swimTime(new int[][]{{3, 0}, {2, 1}}), 3);
        check(swimByThreshold(new int[][]{{3, 0}, {2, 1}}, true), 3);
        check(swimByThreshold(new int[][]{{3, 0}, {2, 1}}, false), 3);
        check(swimTime(new int[][]{{0, 8, 7}, {1, 6, 5}, {2, 3, 4}}), 4);
        check(swimByThreshold(new int[][]{{0, 8, 7}, {1, 6, 5}, {2, 3, 4}}, true), 4);
        check(swimByThreshold(new int[][]{{0, 8, 7}, {1, 6, 5}, {2, 3, 4}}, false), 4);
        check(swimTime(new int[][]{{0, 1, 8}, {7, 2, 6}, {5, 3, 4}}), 4);
        check(swimByThreshold(new int[][]{{0, 1, 8}, {7, 2, 6}, {5, 3, 4}}, true), 4);
        check(swimByThreshold(new int[][]{{0, 1, 8}, {7, 2, 6}, {5, 3, 4}}, false), 4);
        check(swimTime(new int[][]{{0, 1}, {2, 3}}), 3);
        check(swimByThreshold(new int[][]{{0, 1}, {2, 3}}, true), 3);
        check(swimByThreshold(new int[][]{{0, 1}, {2, 3}}, false), 3);
        System.out.println("5/5 ca đúng");
    }

    static void check(int got, int want) {
        if (got != want) throw new AssertionError("want " + want + ", got " + got);
    }
}
