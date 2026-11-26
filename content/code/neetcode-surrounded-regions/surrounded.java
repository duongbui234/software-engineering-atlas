// LC 130 Surrounded Regions: mọi cách giải trên trang, kèm các bản sai hay gặp.
// Chạy: java surrounded.java
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;

public class surrounded {
    static final int[][] DIRS = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};
    static long bruteVisits = 0;

    static boolean onBorder(int r, int c, int m, int n) { return r == 0 || r == m - 1 || c == 0 || c == n - 1; }

    // Cách 0: vét cạn. Với từng ô O, chạy một BFS riêng để xem nó có tới được biên không. O((mn)²).
    static void bruteForcePerCell(char[][] board) {
        int m = board.length, n = board[0].length;
        int[] stamp = new int[m * n];
        int round = 0;
        List<Integer> toFlip = new ArrayList<>();
        int[] queue = new int[m * n];
        for (int r = 0; r < m; r++) {
            for (int c = 0; c < n; c++) {
                if (board[r][c] != 'O') continue;
                round++;
                int tail = 0;
                queue[tail++] = r * n + c;
                stamp[r * n + c] = round;
                boolean escaped = false;
                for (int head = 0; head < tail && !escaped; head++) {
                    bruteVisits++;
                    int cr = queue[head] / n, cc = queue[head] % n;
                    if (onBorder(cr, cc, m, n)) escaped = true;
                    for (int[] d : DIRS) {
                        int nr = cr + d[0], nc = cc + d[1];
                        if (nr < 0 || nr >= m || nc < 0 || nc >= n || board[nr][nc] != 'O' || stamp[nr * n + nc] == round) continue;
                        stamp[nr * n + nc] = round;
                        queue[tail++] = nr * n + nc;
                    }
                }
                if (!escaped) toFlip.add(r * n + c); // chưa đổi ngay, để các ô sau còn đọc đúng
            }
        }
        for (int id : toFlip) board[id / n][id % n] = 'X';
    }

    // Cách 1: tô từng vùng, duyệt xong mới đổi. O(mn).
    static void regionFill(char[][] board) {
        int m = board.length, n = board[0].length;
        boolean[] seen = new boolean[m * n];
        int[] region = new int[m * n];
        for (int r = 0; r < m; r++) {
            for (int c = 0; c < n; c++) {
                if (board[r][c] != 'O' || seen[r * n + c]) continue;
                int tail = 0;
                region[tail++] = r * n + c;
                seen[r * n + c] = true;
                boolean touches = false;
                for (int head = 0; head < tail; head++) {
                    int cr = region[head] / n, cc = region[head] % n;
                    if (onBorder(cr, cc, m, n)) touches = true;
                    for (int[] d : DIRS) {
                        int nr = cr + d[0], nc = cc + d[1];
                        if (nr < 0 || nr >= m || nc < 0 || nc >= n || board[nr][nc] != 'O' || seen[nr * n + nc]) continue;
                        seen[nr * n + nc] = true;
                        region[tail++] = nr * n + nc;
                    }
                }
                if (!touches) for (int i = 0; i < tail; i++) board[region[i] / n][region[i] % n] = 'X';
            }
        }
    }

    static void finish(char[][] board) {
        for (char[] row : board)
            for (int c = 0; c < row.length; c++)
                row[c] = row[c] == 'O' ? 'X' : row[c] == 'S' ? 'O' : row[c];
    }

    static void borderCells(int m, int n, Consumer<int[]> visit) {
        for (int r = 0; r < m; r++) { visit.accept(new int[]{r, 0}); visit.accept(new int[]{r, n - 1}); }
        for (int c = 0; c < n; c++) { visit.accept(new int[]{0, c}); visit.accept(new int[]{m - 1, c}); }
    }

    // Cách 2 (nên dùng): đi ngược từ biên bằng BFS nhiều nguồn, đánh dấu an toàn 'S'.
    static void borderBfs(char[][] board) {
        int m = board.length, n = board[0].length;
        ArrayDeque<Integer> queue = new ArrayDeque<>();
        borderCells(m, n, p -> {
            if (board[p[0]][p[1]] == 'O') { board[p[0]][p[1]] = 'S'; queue.addLast(p[0] * n + p[1]); }
        });
        while (!queue.isEmpty()) {
            int id = queue.removeFirst(), cr = id / n, cc = id % n;
            for (int[] d : DIRS) {
                int nr = cr + d[0], nc = cc + d[1];
                if (nr < 0 || nr >= m || nc < 0 || nc >= n || board[nr][nc] != 'O') continue;
                board[nr][nc] = 'S';
                queue.addLast(nr * n + nc);
            }
        }
        finish(board);
    }

    // Cách 3: DFS đệ quy từ biên. Luồng main có stack khoảng 1 MB (tùy máy).
    static void dfs(char[][] board, int r, int c) {
        if (r < 0 || r >= board.length || c < 0 || c >= board[0].length || board[r][c] != 'O') return;
        board[r][c] = 'S';
        dfs(board, r - 1, c);
        dfs(board, r + 1, c);
        dfs(board, r, c - 1);
        dfs(board, r, c + 1);
    }

    static void borderDfsRecursive(char[][] board) {
        borderCells(board.length, board[0].length, p -> dfs(board, p[0], p[1]));
        finish(board);
    }

    // Cách 4: DFS với ngăn xếp tự quản lý.
    static void borderDfsIterative(char[][] board) {
        int m = board.length, n = board[0].length;
        ArrayDeque<Integer> stack = new ArrayDeque<>();
        borderCells(m, n, p -> {
            if (board[p[0]][p[1]] == 'O') { board[p[0]][p[1]] = 'S'; stack.push(p[0] * n + p[1]); }
        });
        while (!stack.isEmpty()) {
            int id = stack.pop(), cr = id / n, cc = id % n;
            for (int[] d : DIRS) {
                int nr = cr + d[0], nc = cc + d[1];
                if (nr < 0 || nr >= m || nc < 0 || nc >= n || board[nr][nc] != 'O') continue;
                board[nr][nc] = 'S';
                stack.push(nr * n + nc);
            }
        }
        finish(board);
    }

    // Cách 5: Union-Find với một nút ảo "biên".
    static int[] parent, size;

    static int find(int x) {
        int root = x;
        while (parent[root] != root) root = parent[root];
        while (parent[x] != root) { int next = parent[x]; parent[x] = root; x = next; }
        return root;
    }

    static void union(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return;
        if (size[ra] < size[rb]) { int t = ra; ra = rb; rb = t; }
        parent[rb] = ra;
        size[ra] += size[rb];
    }

    static void unionFind(char[][] board) {
        int m = board.length, n = board[0].length, border = m * n;
        parent = new int[m * n + 1];
        size = new int[m * n + 1];
        for (int i = 0; i <= m * n; i++) { parent[i] = i; size[i] = 1; }
        for (int r = 0; r < m; r++) {
            for (int c = 0; c < n; c++) {
                if (board[r][c] != 'O') continue;
                int id = r * n + c;
                if (onBorder(r, c, m, n)) union(id, border);
                if (r + 1 < m && board[r + 1][c] == 'O') union(id, id + n);
                if (c + 1 < n && board[r][c + 1] == 'O') union(id, id + 1);
            }
        }
        for (int r = 0; r < m; r++)
            for (int c = 0; c < n; c++)
                if (board[r][c] == 'O' && find(r * n + c) != find(border)) board[r][c] = 'X';
    }

    // SAI 1: đổi mọi ô O không nằm trên biên.
    static void wrongNotOnBorder(char[][] board) {
        for (int r = 1; r < board.length - 1; r++)
            for (int c = 1; c < board[0].length - 1; c++)
                if (board[r][c] == 'O') board[r][c] = 'X';
    }

    // SAI 2: đổi ô thành X ngay lúc tìm; && dừng sớm nên phần còn lại không được thăm.
    static boolean surroundedFrom(char[][] board, int r, int c) {
        if (r < 0 || r >= board.length || c < 0 || c >= board[0].length) return false;
        if (board[r][c] != 'O') return true;
        board[r][c] = 'X';
        return surroundedFrom(board, r - 1, c) && surroundedFrom(board, r + 1, c)
            && surroundedFrom(board, r, c - 1) && surroundedFrom(board, r, c + 1);
    }

    static void wrongFlipDuringSearch(char[][] board) {
        for (int r = 0; r < board.length; r++)
            for (int c = 0; c < board[0].length; c++)
                if (board[r][c] == 'O') surroundedFrom(board, r, c);
    }

    // SAI 3: gán lại tham số bằng một bảng mới. Người gọi vẫn giữ mảng cũ.
    static void wrongNewBoard(char[][] board) {
        board = copy(board);
        borderBfs(board);
    }

    // ---------- ca thử ----------
    static char[][] parse(String... rows) {
        char[][] b = new char[rows.length][];
        for (int i = 0; i < rows.length; i++) b[i] = rows[i].toCharArray();
        return b;
    }

    static char[][] copy(char[][] b) { // chép từng hàng; b.clone() chỉ chép mảng ngoài
        char[][] out = new char[b.length][];
        for (int i = 0; i < b.length; i++) out[i] = b[i].clone();
        return out;
    }

    static String show(char[][] b) {
        StringBuilder sb = new StringBuilder();
        for (char[] row : b) sb.append(row).append('/');
        return sb.toString();
    }

    static char[][] square(int n, char inside, char edge) {
        char[][] b = new char[n][n];
        for (int r = 0; r < n; r++)
            for (int c = 0; c < n; c++)
                b[r][c] = onBorder(r, c, n, n) ? edge : inside;
        return b;
    }

    record Case(String name, char[][] board, char[][] want) {}

    interface Solver { void solve(char[][] b); }

    record Named(String name, Solver solver) {}

    public static void main(String[] args) {
        List<Case> cases = List.of(
            new Case("ví dụ 5×5 ở trên", parse("XXXXX", "XOOXX", "XXOXX", "XOXOO", "XOXXX"), parse("XXXXX", "XXXXX", "XXXXX", "XOXOO", "XOXXX")),
            new Case("một ô O", parse("O"), parse("O")),
            new Case("một ô X", parse("X"), parse("X")),
            new Case("3×3 toàn O", parse("OOO", "OOO", "OOO"), parse("OOO", "OOO", "OOO")),
            new Case("vòng X bao một ô O", parse("XXX", "XOX", "XXX"), parse("XXX", "XXX", "XXX")),
            new Case("một hàng OXO", parse("OXO"), parse("OXO")),
            new Case("chạm chéo không tính là nối", parse("OXXX", "XOXX", "XXOX", "XXXX"), parse("OXXX", "XXXX", "XXXX", "XXXX")),
            new Case("đường vòng vèo ra biên", parse("XXXXXX", "XOOOOX", "XXXXOX", "XOOOOX", "XOXXXX", "XOXXXX"),
                parse("XXXXXX", "XOOOOX", "XXXXOX", "XOOOOX", "XOXXXX", "XOXXXX")),
            new Case("200×200 toàn O", square(200, 'O', 'O'), square(200, 'O', 'O')),
            new Case("200×200 viền X, trong toàn O", square(200, 'O', 'X'), square(200, 'X', 'X')));
        List<Named> solvers = List.of(
            new Named("bruteForcePerCell", surrounded::bruteForcePerCell), new Named("regionFill", surrounded::regionFill),
            new Named("borderBfs", surrounded::borderBfs), new Named("borderDfsRecursive", surrounded::borderDfsRecursive),
            new Named("borderDfsIterative", surrounded::borderDfsIterative), new Named("unionFind", surrounded::unionFind),
            new Named("wrongNotOnBorder", surrounded::wrongNotOnBorder), new Named("wrongFlipDuringSearch", surrounded::wrongFlipDuringSearch),
            new Named("wrongNewBoard", surrounded::wrongNewBoard));
        for (Named s : solvers) {
            // vét cạn chỉ chạy các ca nhỏ: ở 200×200 nó cần khoảng 1,5·10⁹ lượt thăm
            List<Case> mine = s.name().equals("bruteForcePerCell") ? cases.subList(0, 8) : cases;
            int ok = 0;
            List<String> bad = new ArrayList<>();
            for (Case tc : mine) {
                char[][] b = copy(tc.board());
                try {
                    s.solver().solve(b);
                    if (show(b).equals(show(tc.want()))) ok++;
                    else bad.add(tc.name());
                } catch (StackOverflowError e) {
                    bad.add(tc.name() + " → ném StackOverflowError");
                }
            }
            String note = mine.size() < cases.size() ? " (chỉ các ca nhỏ)" : "";
            String tail = bad.isEmpty() ? "" : "; sai ở " + String.join(", ", bad);
            System.out.printf("%-22s %d/%d ca đúng%s%s%n", s.name(), ok, mine.size(), note, tail);
        }

        // Đối chiếu ngẫu nhiên với vét cạn.
        int[] seed = {42};
        java.util.function.DoubleSupplier rand = () -> {
            seed[0] += 0x6d2b79f5;
            int t = seed[0];
            t = (t ^ (t >>> 15)) * (1 | t);
            t = (t + (t ^ (t >>> 7)) * (61 | t)) ^ t;
            return ((t ^ (t >>> 14)) & 0xffffffffL) / 4294967296.0;
        };
        int trials = 2000, agree = 0;
        for (int i = 0; i < trials; i++) {
            int m = 1 + (int) (rand.getAsDouble() * 8), n = 1 + (int) (rand.getAsDouble() * 8);
            char[][] board = new char[m][n];
            for (int r = 0; r < m; r++)
                for (int c = 0; c < n; c++)
                    board[r][c] = rand.getAsDouble() < 0.6 ? 'O' : 'X';
            char[][] ref = copy(board);
            bruteForcePerCell(ref);
            boolean good = true;
            for (Solver solve : new Solver[]{surrounded::regionFill, surrounded::borderBfs, surrounded::borderDfsRecursive,
                    surrounded::borderDfsIterative, surrounded::unionFind}) {
                char[][] b = copy(board);
                solve.solve(b);
                good &= show(b).equals(show(ref));
            }
            if (good) agree++;
        }
        System.out.printf("đối chiếu ngẫu nhiên: %d/%d bảng, năm cách đúng khớp vét cạn%n", agree, trials);

        // Đo: vét cạn O((mn)²) so với tô từng vùng O(mn).
        for (int sz : new int[]{30, 60, 90}) {
            char[][] b = square(sz, 'O', 'X');
            bruteVisits = 0;
            long t0 = System.nanoTime();
            bruteForcePerCell(b);
            double brute = (System.nanoTime() - t0) / 1e6;
            b = square(sz, 'O', 'X');
            t0 = System.nanoTime();
            regionFill(b);
            double fast = (System.nanoTime() - t0) / 1e6;
            System.out.printf("%d×%d: vét cạn %d lượt thăm, %.1f ms; tô từng vùng %.2f ms%n", sz, sz, bruteVisits, brute, fast);
        }
    }
}
