// LC 210 Course Schedule II: tìm một thứ tự học hợp lệ, hoặc [] nếu các môn chờ nhau thành vòng.
// Chạy: java course-schedule-ii.java
import java.util.*;

public class Main {
    static long work = 0; // số bước cơ bản (nhìn qua một môn, xét một điều kiện), dùng cho phép đo

    interface Solver { int[] solve(int n, int[][] prereqs); }

    @SuppressWarnings("unchecked")
    static List<Integer>[] lists(int n) {
        List<Integer>[] out = new List[n];
        for (int i = 0; i < n; i++) out[i] = new ArrayList<>();
        return out;
    }

    // Cách 1: quét lặp. Mỗi lượt đi từ môn 0, lấy môn đầu tiên đã học đủ điều kiện. O(V·(V+E)).
    static int[] orderScan(int n, int[][] prereqs) {
        List<Integer>[] need = lists(n);
        for (int[] p : prereqs) need[p[0]].add(p[1]); // muốn học a thì phải xong b
        boolean[] taken = new boolean[n];
        int[] order = new int[n];
        for (int k = 0; k < n; k++) {
            int found = -1;
            for (int c = 0; c < n && found < 0; c++) {
                work++; // cả môn đã học cũng tốn một lần nhìn qua
                if (taken[c]) continue;
                boolean ready = true;
                for (int b : need[c]) {
                    work++;
                    if (!taken[b]) { ready = false; break; }
                }
                if (ready) found = c;
            }
            if (found < 0) return new int[0]; // còn môn chưa học mà không môn nào đủ điều kiện: có vòng
            taken[found] = true;
            order[k] = found;
        }
        return order;
    }

    // Cách 2: Kahn. Đếm bậc vào, môn nào về 0 thì xếp hàng. Chính hàng đợi là thứ tự. O(V+E).
    static int[] orderKahn(int n, int[][] prereqs) {
        List<Integer>[] next = lists(n);
        int[] indegree = new int[n];
        for (int[] p : prereqs) {
            next[p[1]].add(p[0]); // cạnh b → a: học b xong mới mở khóa a
            indegree[p[0]]++;
        }
        int[] queue = new int[n]; // mảng cỡ n kèm chỉ số đầu/cuối: mỗi môn vào hàng đúng một lần
        int tail = 0;
        for (int c = 0; c < n; c++) if (indegree[c] == 0) queue[tail++] = c;
        for (int head = 0; head < tail; head++) {
            int c = queue[head];
            work++;
            for (int d : next[c]) {
                work++;
                if (--indegree[d] == 0) queue[tail++] = d;
            }
        }
        return tail == n ? queue : new int[0]; // thiếu môn nghĩa là có vòng
    }

    static final int WHITE = 0, GRAY = 1, BLACK = 2; // chưa tới, đang trên đường đi, đã xong

    // Cách 3: DFS ba màu. Môn xong hết đường phía sau thì ghi vào post; đảo post là thứ tự. O(V+E).
    static int[] orderDfs(int n, int[][] prereqs) {
        List<Integer>[] next = lists(n);
        for (int[] p : prereqs) next[p[1]].add(p[0]);
        int[] color = new int[n];
        int[] post = new int[n];
        int[] size = {0};
        for (int c = 0; c < n; c++) {
            if (color[c] == WHITE && !visit(c, next, color, post, size)) return new int[0];
        }
        int[] order = new int[n];
        for (int i = 0; i < n; i++) order[i] = post[n - 1 - i];
        return order;
    }

    static boolean visit(int c, List<Integer>[] next, int[] color, int[] post, int[] size) {
        color[c] = GRAY;
        work++;
        for (int d : next[c]) {
            work++;
            if (color[d] == GRAY) return false; // quay lại một môn đang xám: vòng
            if (color[d] == WHITE && !visit(d, next, color, post, size)) return false;
        }
        color[c] = BLACK;
        post[size[0]++] = c;
        return true;
    }

    // Bản sai 1: lật chiều cạnh (a → b). Thứ tự ra ngược hẳn.
    static int[] wrongEdgeDirection(int n, int[][] prereqs) {
        int[][] flipped = new int[prereqs.length][];
        for (int i = 0; i < prereqs.length; i++) flipped[i] = new int[] {prereqs[i][1], prereqs[i][0]};
        return orderKahn(n, flipped);
    }

    // Bản sai 2: DFS chỉ có một tập "đã thăm". Gặp lại môn đã xong cũng tưởng là vòng.
    static int[] wrongOneSetDfs(int n, int[][] prereqs) {
        List<Integer>[] next = lists(n);
        for (int[] p : prereqs) next[p[1]].add(p[0]);
        boolean[] seen = new boolean[n];
        List<Integer> post = new ArrayList<>();
        for (int c = 0; c < n; c++) {
            if (!seen[c] && !visitOneSet(c, next, seen, post)) return new int[0];
        }
        Collections.reverse(post);
        return post.stream().mapToInt(Integer::intValue).toArray();
    }

    static boolean visitOneSet(int c, List<Integer>[] next, boolean[] seen, List<Integer> post) {
        seen[c] = true;
        for (int d : next[c]) {
            if (seen[d] || !visitOneSet(d, next, seen, post)) return false;
        }
        post.add(c);
        return true;
    }

    // Bản sai 3: Kahn nhưng quên kiểm số môn đã xếp. Có vòng vẫn trả một thứ tự thiếu.
    static int[] wrongNoCycleCheck(int n, int[][] prereqs) {
        List<Integer>[] next = lists(n);
        int[] indegree = new int[n];
        for (int[] p : prereqs) { next[p[1]].add(p[0]); indegree[p[0]]++; }
        int[] queue = new int[n];
        int tail = 0;
        for (int c = 0; c < n; c++) if (indegree[c] == 0) queue[tail++] = c;
        for (int head = 0; head < tail; head++) {
            for (int d : next[queue[head]]) if (--indegree[d] == 0) queue[tail++] = d;
        }
        return Arrays.copyOf(queue, tail);
    }

    // Bộ chấm: không so với một đáp án cố định, mà kiểm mọi điều kiện đều đi xuôi.
    static boolean isValid(int n, int[][] prereqs, int[] order, boolean possible) {
        if (!possible) return order.length == 0;
        if (order.length != n) return false;
        int[] pos = new int[n];
        Arrays.fill(pos, -1);
        for (int i = 0; i < n; i++) {
            int c = order[i];
            if (c < 0 || c >= n || pos[c] != -1) return false;
            pos[c] = i;
        }
        for (int[] p : prereqs) if (pos[p[1]] >= pos[p[0]]) return false;
        return true;
    }

    record Case(String label, int n, int[][] prereqs, boolean possible) {}

    // Gọi f với mọi hoán vị của 0..n-1; f trả true thì dừng sớm.
    interface PermVisitor { boolean visit(int[] perm); }

    static boolean eachPermutation(int[] perm, boolean[] used, int i, PermVisitor f) {
        if (i == perm.length) return f.visit(perm);
        for (int c = 0; c < perm.length; c++) {
            if (used[c]) continue;
            used[c] = true;
            perm[i] = c;
            if (eachPermutation(perm, used, i + 1, f)) return true;
            used[c] = false;
        }
        return false;
    }

    // Số ngẫu nhiên MINSTD: năm ngôn ngữ sinh cùng một dãy.
    static long seed = 42;

    static int rand(int k) {
        seed = seed * 48271 % 2147483647L;
        return (int) (seed % k);
    }

    static String join(int[] order) {
        StringJoiner j = new StringJoiner(",");
        for (int c : order) j.add(String.valueOf(c));
        return j.toString();
    }

    public static void main(String[] args) {
        Case[] cases = {
            new Case("ví dụ sáu môn", 6, new int[][] {{4, 3}, {4, 0}, {1, 4}, {5, 4}, {2, 1}, {2, 5}}, true),
            new Case("không có điều kiện", 3, new int[][] {}, true),
            new Case("một môn", 1, new int[][] {}, true),
            new Case("hai môn", 2, new int[][] {{0, 1}}, true),
            new Case("vòng hai môn", 2, new int[][] {{0, 1}, {1, 0}}, false),
            new Case("vòng ba môn", 3, new int[][] {{0, 1}, {1, 2}, {2, 0}}, false),
            new Case("hình kim cương", 4, new int[][] {{0, 2}, {1, 2}, {3, 0}, {3, 1}}, true),
            new Case("vòng ở một góc", 5, new int[][] {{1, 0}, {2, 1}, {1, 2}, {3, 0}, {4, 3}}, false),
        };
        String[] names = {"orderScan", "orderKahn", "orderDfs", "wrongEdgeDirection", "wrongOneSetDfs", "wrongNoCycleCheck"};
        Solver[] solvers = {Main::orderScan, Main::orderKahn, Main::orderDfs,
            Main::wrongEdgeDirection, Main::wrongOneSetDfs, Main::wrongNoCycleCheck};
        for (int s = 0; s < solvers.length; s++) {
            List<String> wrong = new ArrayList<>();
            for (Case tc : cases) {
                if (!isValid(tc.n(), tc.prereqs(), solvers[s].solve(tc.n(), tc.prereqs()), tc.possible())) wrong.add(tc.label());
            }
            String tail = wrong.isEmpty() ? "" : "; sai ở " + String.join(", ", wrong);
            System.out.printf("%-20s %d/%d ca đúng%s%n", names[s], cases.length - wrong.size(), cases.length, tail);
        }

        // Thứ tự không duy nhất: đếm mọi hoán vị hợp lệ của ví dụ sáu môn.
        Case ex = cases[0];
        int[] fromKahn = orderKahn(ex.n(), ex.prereqs());
        int[] fromDfs = orderDfs(ex.n(), ex.prereqs());
        int[] allValid = {0};
        eachPermutation(new int[ex.n()], new boolean[ex.n()], 0, o -> {
            if (isValid(ex.n(), ex.prereqs(), o, true)) allValid[0]++;
            return false;
        });
        boolean both = isValid(ex.n(), ex.prereqs(), fromKahn, true) && isValid(ex.n(), ex.prereqs(), fromDfs, true);
        System.out.printf("ví dụ sáu môn: Kahn → [%s], DFS → [%s]; cả hai hợp lệ: %b; có %d/720 thứ tự hợp lệ%n",
            join(fromKahn), join(fromDfs), both, allValid[0]);
        System.out.printf("chấm bằng cách so với đáp án cố định [%s]: DFS bị chấm %s%n",
            join(fromKahn), Arrays.equals(fromDfs, fromKahn) ? "đúng" : "sai");

        // Đối chiếu với vét cạn: n ≤ 6, thử mọi hoán vị để biết có thứ tự hợp lệ hay không.
        int agree = 0, cyclic = 0, trials = 1000;
        for (int t = 0; t < trials; t++) {
            int n = 1 + rand(6);
            int m = rand(n * (n - 1) + 1);
            Set<Integer> keys = new HashSet<>();
            List<int[]> list = new ArrayList<>();
            for (int i = 0; i < m; i++) {
                int a = rand(n);
                int b = rand(n);
                if (a != b && keys.add(a * n + b)) list.add(new int[] {a, b});
            }
            int[][] p = list.toArray(new int[0][]);
            boolean possible = eachPermutation(new int[n], new boolean[n], 0, o -> isValid(n, p, o, true));
            if (!possible) cyclic++;
            boolean ok = true;
            for (Solver solve : new Solver[] {Main::orderScan, Main::orderKahn, Main::orderDfs}) {
                if (!isValid(n, p, solve.solve(n, p), possible)) ok = false;
            }
            if (ok) agree++;
        }
        System.out.printf("ngẫu nhiên: %d/%d đồ thị, ba cách đều hợp lệ (%d đồ thị có vòng)%n", agree, trials, cyclic);

        // Đo trên 2 000 môn.
        final int N = 2000;
        int[][] forward = new int[N - 1][];  // môn i+1 cần môn i
        int[][] backward = new int[N - 1][]; // môn i cần môn i+1
        for (int i = 0; i + 1 < N; i++) {
            forward[i] = new int[] {i + 1, i};
            backward[i] = new int[] {i, i + 1};
        }
        int[] rank = new int[N];
        for (int i = 0; i < N; i++) rank[i] = i;
        for (int i = N - 1; i > 0; i--) {
            int j = rand(i + 1);
            int tmp = rank[i]; rank[i] = rank[j]; rank[j] = tmp;
        }
        List<int[]> dag = new ArrayList<>();
        Set<Integer> dagKeys = new HashSet<>();
        while (dag.size() < 20000) {
            int u = rand(N);
            int v = rand(N);
            if (u == v) continue;
            int a = rank[u] > rank[v] ? u : v; // môn hạng cao cần môn hạng thấp
            int b = rank[u] > rank[v] ? v : u;
            if (!dagKeys.add(a * N + b)) continue;
            dag.add(new int[] {a, b});
        }
        String[] labels = {"chuỗi xuôi (i+1 cần i)", "chuỗi ngược (i cần i+1)", "DAG ngẫu nhiên, 20000 điều kiện"};
        int[][][] graphs = {forward, backward, dag.toArray(new int[0][])};
        for (int g = 0; g < graphs.length; g++) {
            System.out.printf("%s, %d môn:%n", labels[g], N);
            for (int s = 0; s < 3; s++) {
                work = 0;
                long t0 = System.nanoTime();
                int[] order = solvers[s].solve(N, graphs[g]);
                double ms = (System.nanoTime() - t0) / 1e6;
                System.out.printf("  %-10s hợp lệ: %b, %d bước, %.2f ms%n", names[s], isValid(N, graphs[g], order, true), work, ms);
            }
        }
    }
}
