import java.util.*;

class CheapestFlight {
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

    static int visit(List<List<int[]>> adj, int city, int end, int remaining) {
        if (city == end) return 0;
        if (remaining == 0) return Integer.MAX_VALUE;
        int best = Integer.MAX_VALUE;
        for (int[] edge : adj.get(city)) {
            int tail = visit(adj, edge[0], end, remaining - 1);
            if (tail != Integer.MAX_VALUE) best = Math.min(best, edge[1] + tail);
        }
        return best;
    }

    static int cheapestByRoutes(int n, int[][] flights, int start, int end, int k) {
        var adj = new ArrayList<List<int[]>>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int[] flight : flights) adj.get(flight[0]).add(new int[]{flight[1], flight[2]});
        int fare = visit(adj, start, end, k + 1);
        return fare == Integer.MAX_VALUE ? -1 : fare;
    }

    public static void main(String[] args) {
        check(cheapestFlight(4, new int[][]{{0, 1, 1}, {1, 2, 1}, {0, 2, 6}, {2, 3, 1}}, 0, 3, 1), 7);
        check(cheapestByRoutes(4, new int[][]{{0, 1, 1}, {1, 2, 1}, {0, 2, 6}, {2, 3, 1}}, 0, 3, 1), 7);
        check(cheapestFlight(4, new int[][]{{0, 1, 1}, {1, 2, 1}, {0, 2, 6}, {2, 3, 1}}, 0, 3, 2), 3);
        check(cheapestByRoutes(4, new int[][]{{0, 1, 1}, {1, 2, 1}, {0, 2, 6}, {2, 3, 1}}, 0, 3, 2), 3);
        check(cheapestFlight(3, new int[][]{{0, 1, 1}, {1, 2, 1}, {0, 2, 8}}, 0, 2, 0), 8);
        check(cheapestByRoutes(3, new int[][]{{0, 1, 1}, {1, 2, 1}, {0, 2, 8}}, 0, 2, 0), 8);
        check(cheapestFlight(3, new int[][]{{0, 1, 1}, {1, 2, 1}}, 0, 2, 0), -1);
        check(cheapestByRoutes(3, new int[][]{{0, 1, 1}, {1, 2, 1}}, 0, 2, 0), -1);
        check(cheapestFlight(3, new int[][]{{0, 1, 4}, {1, 0, 1}, {1, 2, 2}}, 0, 2, 2), 6);
        check(cheapestByRoutes(3, new int[][]{{0, 1, 4}, {1, 0, 1}, {1, 2, 2}}, 0, 2, 2), 6);
        System.out.println("5/5 ca đúng");
    }

    static void check(int got, int want) {
        if (got != want) throw new AssertionError("want " + want + ", got " + got);
    }
}
