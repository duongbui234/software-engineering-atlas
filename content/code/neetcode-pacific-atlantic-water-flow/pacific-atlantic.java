// LC 417 Pacific Atlantic Water Flow: bốn cách đúng, ba cách sai, kiểm chung và phép đo.
// Chạy: java pacific-atlantic.java
import java.util.*;
import java.util.function.IntBinaryOperator;

public class Main {
    static final int[][] DIRS = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};

    // Cách 1: vét cạn. Từ mỗi ô, cho nước chảy xuôi và xem nó chạm bờ nào. O((mn)^2).
    static List<List<Integer>> bruteForce(int[][] heights) {
        int m = heights.length, n = heights[0].length;
        List<List<Integer>> result = new ArrayList<>();
        int[] queue = new int[m * n];
        for (int r = 0; r < m; r++) {
            for (int c = 0; c < n; c++) {
                boolean pacific = false, atlantic = false;
                boolean[] seen = new boolean[m * n];
                int head = 0, tail = 0;
                seen[r * n + c] = true;
                queue[tail++] = r * n + c;
                while (head < tail && !(pacific && atlantic)) {
                    int cur = queue[head++], cr = cur / n, cc = cur % n;
                    if (cr == 0 || cc == 0) pacific = true;
                    if (cr == m - 1 || cc == n - 1) atlantic = true;
                    for (int[] d : DIRS) {
                        int nr = cr + d[0], nc = cc + d[1];
                        if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
                        if (seen[nr * n + nc] || heights[nr][nc] > heights[cr][cc]) continue;
                        seen[nr * n + nc] = true;
                        queue[tail++] = nr * n + nc;
                    }
                }
                if (pacific && atlantic) result.add(List.of(r, c));
            }
        }
        return result;
    }

    static int[][] borders(int m, int n) {
        int[] pacific = new int[m + n], atlantic = new int[m + n];
        for (int c = 0; c < n; c++) { pacific[c] = c; atlantic[c] = (m - 1) * n + c; }
        for (int r = 0; r < m; r++) { pacific[n + r] = r * n; atlantic[n + r] = r * n + n - 1; }
        return new int[][] {pacific, atlantic};
    }

    // BFS nhiều nguồn; ok trả 1 nếu được đi từ ô cao "cur" sang ô cao "next".
    static boolean[] climb(int[][] heights, int[] seeds, IntBinaryOperator ok) {
        int m = heights.length, n = heights[0].length;
        boolean[] seen = new boolean[m * n];
        ArrayDeque<Integer> queue = new ArrayDeque<>();
        for (int s : seeds) if (!seen[s]) { seen[s] = true; queue.addLast(s); }
        while (!queue.isEmpty()) {
            int cur = queue.removeFirst(), cr = cur / n, cc = cur % n;
            for (int[] d : DIRS) {
                int nr = cr + d[0], nc = cc + d[1];
                if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
                if (seen[nr * n + nc] || ok.applyAsInt(heights[nr][nc], heights[cr][cc]) == 0) continue;
                seen[nr * n + nc] = true;
                queue.addLast(nr * n + nc);
            }
        }
        return seen;
    }

    static final IntBinaryOperator UPHILL = (next, cur) -> next >= cur ? 1 : 0;

    static List<List<Integer>> intersect(boolean[] a, boolean[] b, int n) {
        List<List<Integer>> result = new ArrayList<>();
        for (int i = 0; i < a.length; i++) if (a[i] && b[i]) result.add(List.of(i / n, i % n));
        return result;
    }

    // Cách 2: đi ngược từ bờ, leo lên ô cao hơn hoặc bằng. O(mn).
    static List<List<Integer>> reverseBfs(int[][] heights) {
        int n = heights[0].length;
        int[][] b = borders(heights.length, n);
        return intersect(climb(heights, b[0], UPHILL), climb(heights, b[1], UPHILL), n);
    }

    // Cách 3: cùng ý, DFS lặp bằng ngăn xếp.
    static boolean[] climbStack(int[][] heights, int[] seeds) {
        int m = heights.length, n = heights[0].length;
        boolean[] seen = new boolean[m * n];
        ArrayDeque<Integer> stack = new ArrayDeque<>();
        for (int s : seeds) if (!seen[s]) { seen[s] = true; stack.push(s); }
        while (!stack.isEmpty()) {
            int cur = stack.pop(), cr = cur / n, cc = cur % n;
            for (int[] d : DIRS) {
                int nr = cr + d[0], nc = cc + d[1];
                if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
                if (seen[nr * n + nc] || heights[nr][nc] < heights[cr][cc]) continue;
                seen[nr * n + nc] = true;
                stack.push(nr * n + nc);
            }
        }
        return seen;
    }

    static List<List<Integer>> reverseDfsIterative(int[][] heights) {
        int n = heights[0].length;
        int[][] b = borders(heights.length, n);
        return intersect(climbStack(heights, b[0]), climbStack(heights, b[1]), n);
    }

    // Cách 4: DFS đệ quy. Stack mặc định của luồng main không đủ cho 40 000 tầng.
    static void visit(int[][] heights, boolean[] seen, int r, int c) {
        int m = heights.length, n = heights[0].length;
        seen[r * n + c] = true;
        for (int[] d : DIRS) {
            int nr = r + d[0], nc = c + d[1];
            if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
            if (seen[nr * n + nc] || heights[nr][nc] < heights[r][c]) continue;
            visit(heights, seen, nr, nc);
        }
    }

    static List<List<Integer>> reverseDfsRecursive(int[][] heights) {
        int m = heights.length, n = heights[0].length;
        int[][] b = borders(m, n);
        boolean[][] seen = {new boolean[m * n], new boolean[m * n]};
        for (int k = 0; k < 2; k++)
            for (int s : b[k]) if (!seen[k][s]) visit(heights, seen[k], s / n, s % n);
        return intersect(seen[0], seen[1], n);
    }

    // Sai 1: đi ngược nhưng vẫn so như nước chảy xuôi.
    static List<List<Integer>> wrongDirection(int[][] heights) {
        int n = heights[0].length;
        int[][] b = borders(heights.length, n);
        IntBinaryOperator down = (next, cur) -> next <= cur ? 1 : 0;
        return intersect(climb(heights, b[0], down), climb(heights, b[1], down), n);
    }

    // Sai 2: so ngặt, quên rằng nước chảy qua ô cao bằng nhau.
    static List<List<Integer>> wrongStrict(int[][] heights) {
        int n = heights[0].length;
        int[][] b = borders(heights.length, n);
        IntBinaryOperator strict = (next, cur) -> next > cur ? 1 : 0;
        return intersect(climb(heights, b[0], strict), climb(heights, b[1], strict), n);
    }

    // Sai 3: mỗi đại dương chỉ gieo một cạnh (hàng trên, hàng dưới).
    static List<List<Integer>> wrongOneEdge(int[][] heights) {
        int m = heights.length, n = heights[0].length;
        int[] pacific = new int[n], atlantic = new int[n];
        for (int c = 0; c < n; c++) { pacific[c] = c; atlantic[c] = (m - 1) * n + c; }
        return intersect(climb(heights, pacific, UPHILL), climb(heights, atlantic, UPHILL), n);
    }

    // ---------- Kiểm chung ----------

    static String key(List<List<Integer>> cells) {
        List<String> parts = new ArrayList<>();
        for (List<Integer> p : cells) parts.add(p.get(0) + "," + p.get(1));
        Collections.sort(parts);
        return String.join(" ", parts);
    }

    static int[][] rowMajor(int m, int n) {
        int[][] g = new int[m][n];
        for (int r = 0; r < m; r++) for (int c = 0; c < n; c++) g[r][c] = r * n + c;
        return g;
    }

    static List<List<Integer>> rowMajorAnswer(int m, int n) {
        List<List<Integer>> out = new ArrayList<>();
        for (int r = 0; r < m; r++) for (int c = 0; c < n; c++) if (r == m - 1 || c == n - 1) out.add(List.of(r, c));
        return out;
    }

    static int[][] flatGrid(int m, int n) {
        int[][] g = new int[m][n];
        for (int[] row : g) Arrays.fill(row, 1);
        return g;
    }

    static List<List<Integer>> allCells(int m, int n) {
        List<List<Integer>> out = new ArrayList<>();
        for (int r = 0; r < m; r++) for (int c = 0; c < n; c++) out.add(List.of(r, c));
        return out;
    }

    static List<List<Integer>> cells(int[][] pairs) {
        List<List<Integer>> out = new ArrayList<>();
        for (int[] p : pairs) out.add(List.of(p[0], p[1]));
        return out;
    }

    record Case(String name, int[][] heights, List<List<Integer>> want) {}

    interface Solver { List<List<Integer>> solve(int[][] h); }

    public static void main(String[] args) {
        List<Case> cases = List.of(
            new Case("một ô", new int[][] {{7}}, cells(new int[][] {{0, 0}})),
            new Case("một hàng", new int[][] {{4, 1, 6}}, cells(new int[][] {{0, 0}, {0, 1}, {0, 2}})),
            new Case("một cột", new int[][] {{2}, {9}, {2}}, cells(new int[][] {{0, 0}, {1, 0}, {2, 0}})),
            new Case("mặt phẳng 3×3", new int[][] {{5, 5, 5}, {5, 5, 5}, {5, 5, 5}}, allCells(3, 3)),
            new Case("cái chén", new int[][] {{3, 3, 3}, {3, 1, 3}, {3, 3, 3}},
                cells(new int[][] {{0, 0}, {0, 1}, {0, 2}, {1, 0}, {1, 2}, {2, 0}, {2, 1}, {2, 2}})),
            new Case("góc trũng", new int[][] {{9, 9, 1}, {9, 9, 9}, {1, 9, 9}}, allCells(3, 3)),
            new Case("sống núi giữa", new int[][] {{1, 2, 3}, {8, 9, 4}, {7, 6, 5}},
                cells(new int[][] {{0, 2}, {1, 0}, {1, 1}, {1, 2}, {2, 0}, {2, 1}, {2, 2}})),
            new Case("bậc bằng nhau", new int[][] {{1, 1, 1, 1}, {1, 2, 2, 1}, {1, 2, 2, 1}, {1, 1, 1, 1}}, allCells(4, 4)),
            new Case("lưới tăng 200×200", rowMajor(200, 200), rowMajorAnswer(200, 200)),
            new Case("mặt phẳng 200×200", flatGrid(200, 200), allCells(200, 200)));

        LinkedHashMap<String, Solver> solvers = new LinkedHashMap<>();
        solvers.put("bruteForce", Main::bruteForce);
        solvers.put("reverseBfs", Main::reverseBfs);
        solvers.put("reverseDfsIterative", Main::reverseDfsIterative);
        solvers.put("reverseDfsRecursive", Main::reverseDfsRecursive);
        solvers.put("wrongDirection", Main::wrongDirection);
        solvers.put("wrongStrict", Main::wrongStrict);
        solvers.put("wrongOneEdge", Main::wrongOneEdge);

        for (Map.Entry<String, Solver> e : solvers.entrySet()) {
            int ok = 0, total = 0;
            List<String> bad = new ArrayList<>();
            for (Case t : cases) {
                if (e.getKey().equals("bruteForce") && t.heights().length > 50) continue; // 40 000 ô: đo riêng
                total++;
                try {
                    if (key(e.getValue().solve(t.heights())).equals(key(t.want()))) ok++;
                    else bad.add(t.name());
                } catch (StackOverflowError err) {
                    bad.add(t.name() + " → ném StackOverflowError");
                }
            }
            String skipped = total < cases.size() ? " (bỏ hai ca 200×200)" : "";
            String tail = bad.isEmpty() ? "" : "; sai ở " + String.join(", ", bad);
            System.out.printf("%-20s %d/%d ca đúng%s%s%n", e.getKey(), ok, total, skipped, tail);
        }

        Random rng = new Random(42);
        int agree = 0, trials = 2000;
        for (int t = 0; t < trials; t++) {
            int m = 1 + rng.nextInt(7), n = 1 + rng.nextInt(7), k = 1 + rng.nextInt(5);
            int[][] h = new int[m][n];
            for (int[] row : h) for (int c = 0; c < n; c++) row[c] = rng.nextInt(k);
            String want = key(bruteForce(h));
            if (key(reverseBfs(h)).equals(want) && key(reverseDfsIterative(h)).equals(want)
                    && key(reverseDfsRecursive(h)).equals(want)) agree++;
        }
        System.out.printf("ngẫu nhiên: %d/%d lưới, ba cách đi ngược khớp vét cạn%n", agree, trials);

        for (int size : new int[] {20, 40, 80}) {
            int[][] h = flatGrid(size, size);
            long t0 = System.nanoTime();
            bruteForce(h);
            long t1 = System.nanoTime();
            reverseBfs(h);
            long t2 = System.nanoTime();
            System.out.printf("mặt phẳng %d×%d: vét cạn %.1f ms, đi ngược %.2f ms%n",
                size, size, (t1 - t0) / 1e6, (t2 - t1) / 1e6);
        }

        // Cho DFS đệ quy một luồng có stack 64 MB thì 40 000 tầng chạy được.
        int[][] big = flatGrid(200, 200);
        int[] count = new int[1];
        Thread worker = new Thread(null, () -> count[0] = reverseDfsRecursive(big).size(), "deep", 64L << 20);
        worker.start();
        try { worker.join(); } catch (InterruptedException ignored) {}
        System.out.printf("mặt phẳng 200×200, DFS đệ quy trên luồng stack 64 MB: %d ô%n", count[0]);
    }
}
