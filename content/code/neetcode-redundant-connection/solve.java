class Solve {
    static final class DisjointSet {
        private final int[] parent;
        private final int[] size;
        int count;

        DisjointSet(int n) {
            parent = new int[n];
            size = new int[n];
            count = n;
            for (int i = 0; i < n; i++) {
                parent[i] = i;
                size[i] = 1;
            }
        }

        int find(int node) {
            while (node != parent[node]) {
                parent[node] = parent[parent[node]];
                node = parent[node];
            }
            return node;
        }

        boolean union(int a, int b) {
            int ra = find(a), rb = find(b);
            if (ra == rb) return false;
            if (size[ra] < size[rb]) {
                int swap = ra;
                ra = rb;
                rb = swap;
            }
            parent[rb] = ra;
            size[ra] += size[rb];
            count--;
            return true;
        }
    }

    static java.util.List<java.util.List<Integer>> adjacency(int n, int[][] edges) {
        var adj = new java.util.ArrayList<java.util.List<Integer>>(n);
        for (int i = 0; i < n; i++) adj.add(new java.util.ArrayList<>());
        for (int[] e : edges) {
            adj.get(e[0]).add(e[1]);
            adj.get(e[1]).add(e[0]);
        }
        return adj;
    }

    static int walk(java.util.List<java.util.List<Integer>> adj, int start, boolean[] seen) {
        var pending = new java.util.ArrayDeque<Integer>();
        pending.push(start);
        seen[start] = true;
        int visited = 0;
        while (!pending.isEmpty()) {
            int node = pending.pop();
            visited++;
            for (int next : adj.get(node)) {
                if (seen[next]) continue;
                seen[next] = true;
                pending.push(next);
            }
        }
        return visited;
    }

    static int[] redundantByDsu(int n, int[][] edges) {
        var ds = new DisjointSet(n + 1);
        for (int[] e : edges) {
            if (!ds.union(e[0], e[1])) return e;
        }
        throw new IllegalArgumentException("Cần đúng một cạnh dư");
    }

    static int[] redundantByWalk(int n, int[][] edges) {
        var adj = adjacency(n + 1, new int[0][]);
        for (int[] e : edges) {
            int a = e[0], b = e[1];
            var seen = new boolean[n + 1];
            walk(adj, a, seen);
            if (seen[b]) return e;
            adj.get(a).add(b);
            adj.get(b).add(a);
        }
        throw new IllegalArgumentException("Cần đúng một cạnh dư");
    }

    public static void main(String[] args) {
        if (!java.util.Arrays.equals(redundantByDsu(5, new int[][]{{1, 4}, {2, 4}, {1, 2}, {4, 5}, {3, 5}}), new int[]{1, 2}) || !java.util.Arrays.equals(redundantByWalk(5, new int[][]{{1, 4}, {2, 4}, {1, 2}, {4, 5}, {3, 5}}), new int[]{1, 2})) throw new AssertionError("Ca redundant n=5");
        if (!java.util.Arrays.equals(redundantByDsu(4, new int[][]{{1, 4}, {1, 3}, {2, 4}, {2, 3}}), new int[]{2, 3}) || !java.util.Arrays.equals(redundantByWalk(4, new int[][]{{1, 4}, {1, 3}, {2, 4}, {2, 3}}), new int[]{2, 3})) throw new AssertionError("Ca redundant n=4");
        if (!java.util.Arrays.equals(redundantByDsu(6, new int[][]{{1, 4}, {3, 5}, {1, 5}, {3, 4}, {2, 6}, {2, 5}}), new int[]{3, 4}) || !java.util.Arrays.equals(redundantByWalk(6, new int[][]{{1, 4}, {3, 5}, {1, 5}, {3, 4}, {2, 6}, {2, 5}}), new int[]{3, 4})) throw new AssertionError("Ca redundant n=6");
        System.out.println("6/6 ca đúng");
    }
}
