// LC 207 Course Schedule: có học hết được mọi môn không? Cùng bộ ca với bản TypeScript.
// Chạy: java course-schedule.java
import java.util.*;

public class Main {
    static long work = 0; // số lần nhìn một cạnh (một môn tiên quyết), dùng cho phép đo
    static int passes = 0;

    interface Solver { boolean solve(int n, int[][] prerequisites); }

    // Cặp [a, b] nghĩa là "muốn học a phải học b trước": cạnh đi từ b sang a.
    static List<List<Integer>> buildAdj(int n, int[][] prerequisites, int[] indegree) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int[] p : prerequisites) {
            adj.get(p[1]).add(p[0]);
            indegree[p[0]]++;
        }
        return adj;
    }

    // Cách 1: quét lặp. Mỗi lượt quét mọi môn, học môn nào đã đủ tiên quyết.
    // Một lượt không học thêm được môn nào thì dừng. Xấu nhất O(V·(V + E)).
    static boolean canFinishScan(int n, int[][] prerequisites) {
        List<List<Integer>> needs = new ArrayList<>();
        for (int i = 0; i < n; i++) needs.add(new ArrayList<>());
        for (int[] p : prerequisites) needs.get(p[0]).add(p[1]);
        boolean[] done = new boolean[n];
        int count = 0;
        passes = 0;
        boolean progress = true;
        while (progress) {
            progress = false;
            passes++;
            for (int c = 0; c < n; c++) {
                if (done[c]) continue;
                boolean ready = true;
                for (int b : needs.get(c)) {
                    work++;
                    if (!done[b]) { ready = false; break; }
                }
                if (ready) { done[c] = true; count++; progress = true; }
            }
        }
        return count == n;
    }

    // Cách 2: Kahn. Môn có bậc vào 0 thì học được ngay; học xong thì trừ bậc vào
    // của các môn đứng sau. Đếm số môn học được. O(V + E).
    static boolean canFinishKahn(int n, int[][] prerequisites) {
        int[] indegree = new int[n];
        List<List<Integer>> adj = buildAdj(n, prerequisites, indegree);
        ArrayDeque<Integer> queue = new ArrayDeque<>();
        for (int c = 0; c < n; c++) if (indegree[c] == 0) queue.add(c);
        int taken = 0;
        while (!queue.isEmpty()) {
            int u = queue.poll();
            taken++;
            for (int v : adj.get(u)) {
                work++;
                if (--indegree[v] == 0) queue.add(v);
            }
        }
        return taken == n; // thiếu môn nào là môn đó kẹt trong một vòng
    }

    static final int WHITE = 0, GRAY = 1, BLACK = 2;

    // Cách 3: DFS ba màu, đệ quy. Trắng = chưa đụng, xám = đang trên đường đi,
    // đen = đã xong. Gặp lại một đỉnh xám là có vòng. O(V + E).
    static boolean canFinishDfs(int n, int[][] prerequisites) {
        List<List<Integer>> adj = buildAdj(n, prerequisites, new int[n]);
        int[] color = new int[n];
        for (int u = 0; u < n; u++) {
            if (color[u] == WHITE && !visit(u, adj, color)) return false;
        }
        return true;
    }

    static boolean visit(int u, List<List<Integer>> adj, int[] color) {
        color[u] = GRAY;
        for (int v : adj.get(u)) {
            work++;
            if (color[v] == GRAY) return false; // quay về đỉnh đang trên đường: vòng
            if (color[v] == WHITE && !visit(v, adj, color)) return false;
        }
        color[u] = BLACK;
        return true;
    }

    // Cách 3b: cùng DFS ba màu nhưng tự giữ ngăn xếp, không đệ quy.
    static boolean canFinishDfsStack(int n, int[][] prerequisites) {
        List<List<Integer>> adj = buildAdj(n, prerequisites, new int[n]);
        int[] color = new int[n];
        int[] next = new int[n]; // hàng xóm kế tiếp cần xem của mỗi đỉnh
        for (int s = 0; s < n; s++) {
            if (color[s] != WHITE) continue;
            ArrayDeque<Integer> stack = new ArrayDeque<>();
            stack.push(s);
            color[s] = GRAY;
            while (!stack.isEmpty()) {
                int u = stack.peek();
                if (next[u] < adj.get(u).size()) {
                    int v = adj.get(u).get(next[u]++);
                    work++;
                    if (color[v] == GRAY) return false;
                    if (color[v] == WHITE) { color[v] = GRAY; stack.push(v); }
                } else {
                    color[u] = BLACK;
                    stack.pop();
                }
            }
        }
        return true;
    }

    // Bản sai 1: DFS chỉ có một tập "đã thăm", gặp lại đỉnh đã thăm là kết luận có vòng.
    static boolean wrongOneVisitedSet(int n, int[][] prerequisites) {
        List<List<Integer>> adj = buildAdj(n, prerequisites, new int[n]);
        boolean[] visited = new boolean[n];
        for (int u = 0; u < n; u++) {
            if (!visited[u] && !wrongVisit(u, adj, visited)) return false;
        }
        return true;
    }

    static boolean wrongVisit(int u, List<List<Integer>> adj, boolean[] visited) {
        if (visited[u]) return false;
        visited[u] = true;
        for (int v : adj.get(u)) if (!wrongVisit(v, adj, visited)) return false;
        return true;
    }

    // Bản sai 2: chỉ hỏi "có môn nào học được ngay không?".
    static boolean wrongHasStart(int n, int[][] prerequisites) {
        int[] indegree = new int[n];
        buildAdj(n, prerequisites, indegree);
        for (int d : indegree) if (d == 0) return true;
        return false;
    }

    record Case(String label, int n, int[][] pre, boolean want) {}

    static final List<Case> CASES = List.of(
        new Case("hai môn", 2, new int[][]{{1, 0}}, true),
        new Case("hai môn chờ nhau", 2, new int[][]{{1, 0}, {0, 1}}, false),
        new Case("kim cương", 4, new int[][]{{1, 0}, {2, 0}, {3, 1}, {3, 2}}, true),
        new Case("ví dụ năm môn", 5, new int[][]{{1, 0}, {2, 0}, {3, 1}, {3, 2}, {4, 3}}, true),
        new Case("học được một môn rồi kẹt", 4, new int[][]{{1, 0}, {2, 1}, {3, 2}, {1, 3}}, false),
        new Case("môn tự cần chính nó", 2, new int[][]{{1, 1}}, false),
        new Case("không có tiên quyết", 3, new int[][]{}, true),
        new Case("hai mảnh, mảnh sau có vòng", 6, new int[][]{{1, 0}, {3, 2}, {4, 3}, {2, 4}}, false)
    );

    static void check(String name, Solver solve) {
        int ok = 0;
        List<String> wrong = new ArrayList<>();
        for (Case c : CASES) {
            boolean got = solve.solve(c.n(), c.pre());
            if (got == c.want()) ok++;
            else wrong.add(c.label() + " → " + got);
        }
        String tail = wrong.isEmpty() ? "" : "; sai ở " + String.join(", ", wrong);
        System.out.printf("%-20s %d/%d ca đúng%s%n", name, ok, CASES.size(), tail);
    }

    // Bộ sinh số giả ngẫu nhiên MINSTD: năm ngôn ngữ ra cùng một dãy, cùng đồ thị.
    static long seed = 20261126;

    static int rand(int k) {
        seed = seed * 48271 % 2147483647;
        return (int) (seed % k);
    }

    static void measure(String name, Solver solve, int n, int[][] pre, boolean showPasses) {
        double best = Double.MAX_VALUE;
        boolean got = false;
        long w = 0;
        for (int r = 0; r < 3; r++) {
            work = 0;
            long t0 = System.nanoTime();
            got = solve.solve(n, pre);
            best = Math.min(best, (System.nanoTime() - t0) / 1e6);
            w = work;
        }
        String extra = showPasses ? ", " + passes + " lượt quét" : "";
        System.out.printf(Locale.ROOT, "  %-18s %b, %d lần nhìn cạnh%s, %.1f ms%n", name, got, w, extra, best);
    }

    public static void main(String[] args) {
        check("canFinishScan", Main::canFinishScan);
        check("canFinishKahn", Main::canFinishKahn);
        check("canFinishDfs", Main::canFinishDfs);
        check("canFinishDfsStack", Main::canFinishDfsStack);
        check("wrongOneVisitedSet", Main::wrongOneVisitedSet);
        check("wrongHasStart", Main::wrongHasStart);

        // Đối chiếu bốn cách đúng trên 2 000 đồ thị nhỏ ngẫu nhiên (có thể có vòng, có môn tự cần mình).
        int agree = 0, finishable = 0;
        for (int t = 0; t < 2000; t++) {
            int n = 1 + rand(8);
            int m = rand(n * 2 + 1);
            Set<Integer> seen = new HashSet<>();
            List<int[]> list = new ArrayList<>();
            for (int i = 0; i < m; i++) {
                int a = rand(n), b = rand(n);
                if (!seen.add(a * n + b)) continue;
                list.add(new int[]{a, b});
            }
            int[][] pre = list.toArray(new int[0][]);
            boolean r0 = canFinishScan(n, pre), r1 = canFinishKahn(n, pre), r2 = canFinishDfs(n, pre), r3 = canFinishDfsStack(n, pre);
            if (r0 == r1 && r1 == r2 && r2 == r3) agree++;
            if (r0) finishable++;
        }
        System.out.printf("ngẫu nhiên: %d/2000 đồ thị, bốn cách khớp nhau (%d học hết được, %d có vòng)%n", agree, finishable, 2000 - finishable);

        // Chuỗi 2 000 môn, môn i cần môn i+1: mỗi lượt quét chỉ học thêm được đúng một môn.
        final int N = 2000;
        int[][] reversedChain = new int[N - 1][];
        for (int i = 0; i + 1 < N; i++) reversedChain[i] = new int[]{i, i + 1};
        System.out.printf("chuỗi %d môn, môn i cần môn i+1:%n", N);
        measure("canFinishScan", Main::canFinishScan, N, reversedChain, true);
        measure("canFinishKahn", Main::canFinishKahn, N, reversedChain, false);
        measure("canFinishDfs", Main::canFinishDfs, N, reversedChain, false);
        measure("canFinishDfsStack", Main::canFinishDfsStack, N, reversedChain, false);

        // 2 000 môn, 5 000 cặp không vòng: xếp môn theo một hoán vị ngẫu nhiên, chỉ cho môn sau cần môn trước.
        int[] perm = new int[N];
        for (int i = 0; i < N; i++) perm[i] = i;
        for (int i = N - 1; i > 0; i--) {
            int j = rand(i + 1);
            int tmp = perm[i]; perm[i] = perm[j]; perm[j] = tmp;
        }
        Set<Integer> dagSeen = new HashSet<>();
        List<int[]> dagList = new ArrayList<>();
        while (dagList.size() < 5000) {
            int x = rand(N), y = rand(N);
            if (x == y) continue;
            int lo = Math.min(x, y), hi = Math.max(x, y);
            if (!dagSeen.add(lo * N + hi)) continue;
            dagList.add(new int[]{perm[hi], perm[lo]});
        }
        int[][] dag = dagList.toArray(new int[0][]);
        System.out.printf("ngẫu nhiên %d môn, 5000 cặp, không vòng:%n", N);
        measure("canFinishScan", Main::canFinishScan, N, dag, true);
        measure("canFinishKahn", Main::canFinishKahn, N, dag, false);
        measure("canFinishDfs", Main::canFinishDfs, N, dag, false);
        measure("canFinishDfsStack", Main::canFinishDfsStack, N, dag, false);

        // Đệ quy sâu: môn i+1 cần môn i, nên DFS từ môn 0 đi một mạch hết chuỗi.
        System.out.println("đệ quy sâu, chuỗi môn i+1 cần môn i:");
        for (int len : new int[]{2000, 100000}) {
            int[][] chain = new int[len - 1][];
            for (int i = 0; i + 1 < len; i++) chain[i] = new int[]{i + 1, i};
            List<String> parts = new ArrayList<>();
            String[] names = {"canFinishDfs", "canFinishDfsStack", "canFinishKahn"};
            Solver[] solvers = {Main::canFinishDfs, Main::canFinishDfsStack, Main::canFinishKahn};
            for (int k = 0; k < 3; k++) {
                try {
                    parts.add(names[k] + " " + solvers[k].solve(len, chain));
                } catch (StackOverflowError e) {
                    parts.add(names[k] + " lỗi StackOverflowError (tràn ngăn xếp)");
                }
            }
            System.out.printf("  %d môn: %s%n", len, String.join("; ", parts));
        }
    }
}
