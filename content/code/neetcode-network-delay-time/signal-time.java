import java.util.*;
import java.util.function.IntBinaryOperator;

class NetworkDelay {
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

    static int networkByRounds(int[][] edges, int n, int start) {
        int[] best = new int[n];
        Arrays.fill(best, Integer.MAX_VALUE);
        best[start - 1] = 0;
        for (int layer = 1; layer < n; layer++) {
            int[] next = best.clone();
            for (int[] edge : edges) {
                int source = edge[0] - 1, target = edge[1] - 1;
                if (best[source] != Integer.MAX_VALUE) {
                    next[target] = Math.min(next[target], best[source] + edge[2]);
                }
            }
            best = next;
        }
        int last = Arrays.stream(best).max().orElseThrow();
        return last == Integer.MAX_VALUE ? -1 : last;
    }

    public static void main(String[] args) {
        check(networkDelay(new int[][]{{1, 2, 9}, {1, 3, 2}, {3, 2, 1}, {2, 4, 4}}, 4, 1), 7);
        check(networkByRounds(new int[][]{{1, 2, 9}, {1, 3, 2}, {3, 2, 1}, {2, 4, 4}}, 4, 1), 7);
        check(networkDelay(new int[][]{{1, 2, 0}, {2, 3, 0}}, 3, 1), 0);
        check(networkByRounds(new int[][]{{1, 2, 0}, {2, 3, 0}}, 3, 1), 0);
        check(networkDelay(new int[][]{{2, 1, 7}}, 3, 2), -1);
        check(networkByRounds(new int[][]{{2, 1, 7}}, 3, 2), -1);
        check(networkDelay(new int[][]{}, 1, 1), 0);
        check(networkByRounds(new int[][]{}, 1, 1), 0);
        check(networkDelay(new int[][]{{1, 2, 8}, {1, 3, 2}, {3, 2, 6}, {3, 4, 1}, {4, 2, 1}}, 4, 1), 4);
        check(networkByRounds(new int[][]{{1, 2, 8}, {1, 3, 2}, {3, 2, 6}, {3, 4, 1}, {4, 2, 1}}, 4, 1), 4);
        System.out.println("5/5 ca đúng");
    }

    static void check(int got, int want) {
        if (got != want) throw new AssertionError("want " + want + ", got " + got);
    }
}
