import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;

class Connect {
    record Edge(int weight, int a, int b) {}

    static int distance(int[] p, int[] q) {
        return Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]);
    }

    static long prim(int[][] points) {
        int n = points.length;
        boolean[] inTree = new boolean[n];
        int[] best = new int[n];
        Arrays.fill(best, Integer.MAX_VALUE);
        best[0] = 0;
        long total = 0;

        for (int step = 0; step < n; step++) {
            int next = -1;
            for (int i = 0; i < n; i++) {
                if (!inTree[i] && (next == -1 || best[i] < best[next])) next = i;
            }
            inTree[next] = true;
            total += best[next];
            for (int i = 0; i < n; i++) {
                if (!inTree[i]) best[i] = Math.min(best[i], distance(points[next], points[i]));
            }
        }
        return total;
    }

    static int root(int[] parent, int i) {
        while (parent[i] != i) {
            parent[i] = parent[parent[i]];
            i = parent[i];
        }
        return i;
    }

    static long kruskal(int[][] points) {
        int n = points.length;
        var edges = new ArrayList<Edge>(n * (n - 1) / 2);
        for (int a = 0; a < n; a++) {
            for (int b = a + 1; b < n; b++) edges.add(new Edge(distance(points[a], points[b]), a, b));
        }
        edges.sort(Comparator.comparingInt(Edge::weight));
        int[] parent = new int[n];
        int[] size = new int[n];
        Arrays.fill(size, 1);
        for (int i = 0; i < n; i++) parent[i] = i;

        int used = 0;
        long total = 0;
        for (Edge edge : edges) {
            int x = root(parent, edge.a()), y = root(parent, edge.b());
            if (x == y) continue;
            if (size[x] < size[y]) {
                int oldX = x;
                x = y;
                y = oldX;
            }
            parent[y] = x;
            size[x] += size[y];
            total += edge.weight();
            if (++used == n - 1) break;
        }
        return total;
    }

    // TESTS
    record Case(int[][] points, long want) {}
    public static void main(String[] args) {
        Case[] cases = {
            new Case(new int[][]{{4, 8}}, 0),
            new Case(new int[][]{{-2, 1}, {1, 3}}, 5),
            new Case(new int[][]{{0, 0}, {2, 0}, {0, 2}, {2, 2}}, 6),
            new Case(new int[][]{{0, 0}, {10, 0}, {11, 0}, {22, 0}}, 22),
            new Case(new int[][]{{-3, -3}, {-3, 2}, {0, 2}, {0, 4}}, 10),
            new Case(new int[][]{{-1000000, -1000000}, {1000000, 1000000}}, 4000000),
        };
        for (Case test : cases) {
            if (prim(test.points()) != test.want() || kruskal(test.points()) != test.want()) {
                throw new AssertionError("Sai chi phí");
            }
        }
        System.out.printf("%d/%d ca đúng%n", cases.length, cases.length);
    }
}
