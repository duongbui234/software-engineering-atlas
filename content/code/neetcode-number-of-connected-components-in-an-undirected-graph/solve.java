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

    static int componentsByDsu(int n, int[][] edges) {
        var ds = new DisjointSet(n);
        for (int[] e : edges) ds.union(e[0], e[1]);
        return ds.count;
    }

    static int componentsByWalk(int n, int[][] edges) {
        var adj = adjacency(n, edges);
        var seen = new boolean[n];
        int count = 0;
        for (int vertex = 0; vertex < n; vertex++) {
            if (seen[vertex]) continue;
            walk(adj, vertex, seen);
            count++;
        }
        return count;
    }

    public static void main(String[] args) {
        if (componentsByDsu(7, new int[][]{{0, 2}, {2, 4}, {0, 4}, {1, 3}}) != 4 || componentsByWalk(7, new int[][]{{0, 2}, {2, 4}, {0, 4}, {1, 3}}) != 4) throw new AssertionError("Ca components n=7");
        if (componentsByDsu(5, new int[][]{{3, 4}, {1, 2}, {0, 4}, {2, 3}}) != 1 || componentsByWalk(5, new int[][]{{3, 4}, {1, 2}, {0, 4}, {2, 3}}) != 1) throw new AssertionError("Ca components n=5");
        if (componentsByDsu(1, new int[][]{}) != 1 || componentsByWalk(1, new int[][]{}) != 1) throw new AssertionError("Ca components n=1");
        if (componentsByDsu(6, new int[][]{{2, 5}}) != 5 || componentsByWalk(6, new int[][]{{2, 5}}) != 5) throw new AssertionError("Ca components n=6");
        if (componentsByDsu(4, new int[][]{}) != 4 || componentsByWalk(4, new int[][]{}) != 4) throw new AssertionError("Ca components n=4");
        System.out.println("10/10 ca đúng");
    }
}
