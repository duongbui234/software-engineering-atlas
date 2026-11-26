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

    static boolean treeByDsu(int n, int[][] edges) {
        if (edges.length != n - 1) return false;
        var ds = new DisjointSet(n);
        for (int[] e : edges) {
            if (!ds.union(e[0], e[1])) return false;
        }
        return true;
    }

    static boolean treeByWalk(int n, int[][] edges) {
        return edges.length == n - 1 && walk(adjacency(n, edges), 0, new boolean[n]) == n;
    }

    public static void main(String[] args) {
        if (treeByDsu(1, new int[][]{}) != true || treeByWalk(1, new int[][]{}) != true) throw new AssertionError("Ca tree n=1");
        if (treeByDsu(3, new int[][]{{0, 2}, {2, 1}}) != true || treeByWalk(3, new int[][]{{0, 2}, {2, 1}}) != true) throw new AssertionError("Ca tree n=3");
        if (treeByDsu(5, new int[][]{{0, 1}, {1, 2}, {0, 2}, {3, 4}}) != false || treeByWalk(5, new int[][]{{0, 1}, {1, 2}, {0, 2}, {3, 4}}) != false) throw new AssertionError("Ca tree n=5");
        if (treeByDsu(5, new int[][]{{0, 1}, {1, 2}, {3, 4}}) != false || treeByWalk(5, new int[][]{{0, 1}, {1, 2}, {3, 4}}) != false) throw new AssertionError("Ca tree n=5");
        if (treeByDsu(4, new int[][]{{0, 1}, {1, 3}, {2, 3}, {0, 2}}) != false || treeByWalk(4, new int[][]{{0, 1}, {1, 3}, {2, 3}, {0, 2}}) != false) throw new AssertionError("Ca tree n=4");
        System.out.println("10/10 ca đúng");
    }
}
