import java.util.*;
import java.util.function.IntBinaryOperator;

class StationShortestPaths {
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

    static int networkDelay(int[][] edges, int n, int start) {
        var graph = emptyGraph(n);
        for (int[] edge : edges) {
            graph.get(edge[0] - 1).add(new int[]{edge[1] - 1, edge[2]});
        }
        int lastArrival = Arrays.stream(leastCosts(graph, start - 1, 0, Integer::sum)).max().orElseThrow();
        return lastArrival == Integer.MAX_VALUE ? -1 : lastArrival;
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

    static int cheapestFlight(int n, int[][] flights, int start, int end, int k) {
        int[] best = new int[n];
        Arrays.fill(best, Integer.MAX_VALUE);
        best[start] = 0;
        for (int used = 0; used <= k; used++) {
            int[] next = best.clone();
            for (int[] flight : flights) {
                int from = flight[0], to = flight[1], price = flight[2];
                if (best[from] != Integer.MAX_VALUE) {
                    next[to] = Math.min(next[to], best[from] + price);
                }
            }
            best = next;
        }
        return best[end] == Integer.MAX_VALUE ? -1 : best[end];
    }

    public static void main(String[] args) {
        check(networkDelay(new int[][]{{1, 2, 9}, {1, 3, 2}, {3, 2, 1}, {2, 4, 4}}, 4, 1), 7);
        check(networkDelay(new int[][]{{1, 2, 0}, {2, 3, 0}}, 3, 1), 0);
        check(networkDelay(new int[][]{{2, 1, 7}}, 3, 2), -1);
        check(networkDelay(new int[][]{}, 1, 1), 0);
        check(networkDelay(new int[][]{{1, 2, 8}, {1, 3, 2}, {3, 2, 6}, {3, 4, 1}, {4, 2, 1}}, 4, 1), 4);
        check(swimTime(new int[][]{{0}}), 0);
        check(swimTime(new int[][]{{3, 0}, {2, 1}}), 3);
        check(swimTime(new int[][]{{0, 8, 7}, {1, 6, 5}, {2, 3, 4}}), 4);
        check(swimTime(new int[][]{{0, 1, 8}, {7, 2, 6}, {5, 3, 4}}), 4);
        check(swimTime(new int[][]{{0, 1}, {2, 3}}), 3);
        check(cheapestFlight(4, new int[][]{{0, 1, 1}, {1, 2, 1}, {0, 2, 6}, {2, 3, 1}}, 0, 3, 1), 7);
        check(cheapestFlight(4, new int[][]{{0, 1, 1}, {1, 2, 1}, {0, 2, 6}, {2, 3, 1}}, 0, 3, 2), 3);
        check(cheapestFlight(3, new int[][]{{0, 1, 1}, {1, 2, 1}, {0, 2, 8}}, 0, 2, 0), 8);
        check(cheapestFlight(3, new int[][]{{0, 1, 1}, {1, 2, 1}}, 0, 2, 0), -1);
        check(cheapestFlight(3, new int[][]{{0, 1, 4}, {1, 0, 1}, {1, 2, 2}}, 0, 2, 2), 6);
        System.out.println("15/15 ca đúng");
    }

    static void check(int got, int want) {
        if (got != want) throw new AssertionError("want " + want + ", got " + got);
    }
}
