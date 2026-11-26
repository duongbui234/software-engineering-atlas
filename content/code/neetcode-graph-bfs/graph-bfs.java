// Ga GRPH-02: một khuôn BFS cho bốn bài đồ thị.
// Chạy: java graph-bfs.java
import java.util.*;
import java.util.function.Function;

class GraphBfs {
    // ---------- Khuôn chung: BFS từ một hoặc nhiều điểm xuất phát ----------
    static <T> Map<T, Integer> bfs(List<T> starts, Function<T, List<T>> neighbors) {
        Map<T, Integer> dist = new HashMap<>();
        ArrayDeque<T> queue = new ArrayDeque<>();
        for (T s : starts) {
            if (dist.containsKey(s)) continue;
            dist.put(s, 0); // ghi sổ ngay khi xếp hàng
            queue.add(s);
        }
        while (!queue.isEmpty()) {
            T x = queue.poll();
            for (T y : neighbors.apply(x)) {
                if (dist.containsKey(y)) continue;
                dist.put(y, dist.get(x) + 1);
                queue.add(y);
            }
        }
        return dist;
    }

    // ---------- 133. Clone Graph: sổ đã thăm kiêm bảng "cũ → mới" ----------
    static class Node {
        int val;
        List<Node> neighbors = new ArrayList<>();
        Node(int val) { this.val = val; }
    }

    static Node cloneGraph(Node node) {
        if (node == null) return null;
        // IdentityHashMap: so theo đúng đối tượng, không theo equals()
        Map<Node, Node> copyOf = new IdentityHashMap<>();
        copyOf.put(node, new Node(node.val));
        ArrayDeque<Node> queue = new ArrayDeque<>(List.of(node));
        while (!queue.isEmpty()) {
            Node old = queue.poll();
            for (Node nb : old.neighbors) {
                if (!copyOf.containsKey(nb)) { // lần đầu gặp: tạo bản sao rồi xếp hàng
                    copyOf.put(nb, new Node(nb.val));
                    queue.add(nb);
                }
                copyOf.get(old).neighbors.add(copyOf.get(nb)); // nối cạnh giữa hai bản sao
            }
        }
        return copyOf.get(node);
    }

    // ---------- 417. Pacific Atlantic: đi ngược từ biển lên dốc ----------
    record Cell(int r, int c) {}
    static final int[][] DIRS = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};

    interface Edge { boolean ok(Cell from, Cell to); }

    // near trả về các ô kề trong lưới thỏa ok(từ, tới).
    static Function<Cell, List<Cell>> near(int R, int C, Edge edge) {
        return x -> {
            List<Cell> out = new ArrayList<>();
            for (int[] d : DIRS) {
                Cell y = new Cell(x.r() + d[0], x.c() + d[1]);
                if (y.r() >= 0 && y.r() < R && y.c() >= 0 && y.c() < C && edge.ok(x, y)) out.add(y);
            }
            return out;
        };
    }

    static List<List<Integer>> pacificAtlantic(int[][] h) {
        int R = h.length, C = h[0].length;
        // Từ ô x, nước có thể chảy NGƯỢC lên ô y nếu y không thấp hơn x.
        var uphill = near(R, C, (a, b) -> h[b.r()][b.c()] >= h[a.r()][a.c()]);
        List<Cell> pacific = new ArrayList<>(), atlantic = new ArrayList<>();
        for (int r = 0; r < R; r++) { pacific.add(new Cell(r, 0)); atlantic.add(new Cell(r, C - 1)); }
        for (int c = 0; c < C; c++) { pacific.add(new Cell(0, c)); atlantic.add(new Cell(R - 1, c)); }
        var P = bfs(pacific, uphill);
        var A = bfs(atlantic, uphill);
        List<List<Integer>> out = new ArrayList<>();
        for (int r = 0; r < R; r++)
            for (int c = 0; c < C; c++)
                if (P.containsKey(new Cell(r, c)) && A.containsKey(new Cell(r, c))) out.add(List.of(r, c));
        return out;
    }

    // Vét cạn để đối chiếu: từ mỗi ô, thả nước chảy xuống và xem nó chạm biển nào.
    static List<List<Integer>> pacificAtlanticBrute(int[][] h) {
        int R = h.length, C = h[0].length;
        var downhill = near(R, C, (a, b) -> h[b.r()][b.c()] <= h[a.r()][a.c()]);
        List<List<Integer>> out = new ArrayList<>();
        for (int r = 0; r < R; r++)
            for (int c = 0; c < C; c++) {
                boolean pac = false, atl = false;
                for (Cell x : bfs(List.of(new Cell(r, c)), downhill).keySet()) {
                    pac |= x.r() == 0 || x.c() == 0;
                    atl |= x.r() == R - 1 || x.c() == C - 1;
                }
                if (pac && atl) out.add(List.of(r, c));
            }
        return out;
    }

    // ---------- 130. Surrounded Regions: đi từ mép vào, ô nào chạm tới là an toàn ----------
    static void solve(char[][] board) {
        int R = board.length, C = board[0].length;
        var open = near(R, C, (a, b) -> board[b.r()][b.c()] == 'O');
        List<Cell> border = new ArrayList<>();
        for (int r = 0; r < R; r++)
            for (int c = 0; c < C; c++)
                if ((r == 0 || c == 0 || r == R - 1 || c == C - 1) && board[r][c] == 'O') border.add(new Cell(r, c));
        var safe = bfs(border, open);
        for (int r = 0; r < R; r++)
            for (int c = 0; c < C; c++)
                if (board[r][c] == 'O' && !safe.containsKey(new Cell(r, c))) board[r][c] = 'X';
    }

    // Vét cạn: một ô O bị lật khi lượt tô từ chính nó không chạm mép.
    static char[][] solveBrute(char[][] board) {
        int R = board.length, C = board[0].length;
        var open = near(R, C, (a, b) -> board[b.r()][b.c()] == 'O');
        char[][] out = new char[R][];
        for (int r = 0; r < R; r++) {
            out[r] = board[r].clone();
            for (int c = 0; c < C; c++) {
                if (board[r][c] != 'O') continue;
                boolean edge = false;
                for (Cell x : bfs(List.of(new Cell(r, c)), open).keySet())
                    edge |= x.r() == 0 || x.c() == 0 || x.r() == R - 1 || x.c() == C - 1;
                if (!edge) out[r][c] = 'X';
            }
        }
        return out;
    }

    // ---------- 127. Word Ladder: đồ thị ẩn, hàng xóm sinh theo luật ----------
    // Cách 1: so từng cặp. Mỗi lần lấy một từ ra, quét cả danh sách.
    static int ladderNaive(String begin, String end, List<String> words) {
        if (!words.contains(end)) return 0;
        Map<String, Integer> dist = new HashMap<>(Map.of(begin, 1));
        ArrayDeque<String> queue = new ArrayDeque<>(List.of(begin));
        while (!queue.isEmpty()) {
            String w = queue.poll();
            for (String v : words) {
                if (dist.containsKey(v)) continue;
                int diff = 0;
                for (int i = 0; i < w.length(); i++) if (w.charAt(i) != v.charAt(i)) diff++;
                if (diff != 1) continue;
                if (v.equals(end)) return dist.get(w) + 1;
                dist.put(v, dist.get(w) + 1);
                queue.add(v);
            }
        }
        return 0;
    }

    // Cách 2: xô theo mẫu. "hot" nằm trong các xô "*ot", "h*t", "ho*".
    static int ladderBuckets(String begin, String end, List<String> words) {
        if (!words.contains(end)) return 0;
        Map<String, List<String>> buckets = new HashMap<>();
        List<String> all = new ArrayList<>(words);
        all.add(0, begin);
        for (String w : all)
            for (int i = 0; i < w.length(); i++)
                buckets.computeIfAbsent(w.substring(0, i) + "*" + w.substring(i + 1), p -> new ArrayList<>()).add(w);
        Map<String, Integer> dist = new HashMap<>(Map.of(begin, 1));
        ArrayDeque<String> queue = new ArrayDeque<>(List.of(begin));
        while (!queue.isEmpty()) {
            String w = queue.poll();
            for (int i = 0; i < w.length(); i++)
                for (String v : buckets.get(w.substring(0, i) + "*" + w.substring(i + 1))) {
                    if (dist.containsKey(v)) continue;
                    if (v.equals(end)) return dist.get(w) + 1;
                    dist.put(v, dist.get(w) + 1);
                    queue.add(v);
                }
        }
        return 0;
    }

    // Cách 3: BFS hai đầu. Mỗi vòng mở rộng phía có ít từ hơn, dừng khi hai phía chạm nhau.
    static int ladderBidirectional(String begin, String end, List<String> words) {
        Set<String> dict = new HashSet<>(words);
        if (!dict.contains(end)) return 0;
        Set<String> front = new HashSet<>(Set.of(begin)), back = new HashSet<>(Set.of(end));
        Set<String> seen = new HashSet<>(Set.of(begin, end));
        int length = 1;
        while (!front.isEmpty() && !back.isEmpty()) {
            if (front.size() > back.size()) { Set<String> t = front; front = back; back = t; }
            Set<String> next = new HashSet<>();
            length++;
            for (String w : front) {
                char[] b = w.toCharArray();
                for (int i = 0; i < b.length; i++) {
                    char orig = b[i];
                    for (char ch = 'a'; ch <= 'z'; ch++) {
                        b[i] = ch;
                        String v = new String(b);
                        if (back.contains(v)) return length;
                        if (!dict.contains(v) || !seen.add(v)) continue;
                        next.add(v);
                    }
                    b[i] = orig;
                }
            }
            front = next;
        }
        return 0;
    }

    // ---------- Kiểm tra ----------
    static Node buildGraph(int[][] adj) {
        if (adj.length == 0) return null;
        Node[] nodes = new Node[adj.length];
        for (int i = 0; i < adj.length; i++) nodes[i] = new Node(i + 1);
        for (int i = 0; i < adj.length; i++) for (int v : adj[i]) nodes[i].neighbors.add(nodes[v - 1]);
        return nodes[0];
    }

    static Set<Node> reach(Node node) {
        return bfs(List.of(node), n -> n.neighbors).keySet();
    }

    static String toAdj(Node node) {
        Set<Node> nodes = reach(node);
        int[][] adj = new int[nodes.size()][];
        for (Node n : nodes) adj[n.val - 1] = n.neighbors.stream().mapToInt(x -> x.val).toArray();
        return Arrays.deepToString(adj);
    }

    static char[][] board(String... rows) {
        char[][] out = new char[rows.length][];
        for (int i = 0; i < rows.length; i++) out[i] = rows[i].toCharArray();
        return out;
    }

    static char[][] flipped(char[][] b) {
        char[][] x = new char[b.length][];
        for (int i = 0; i < b.length; i++) x[i] = b[i].clone();
        solve(x);
        return x;
    }

    public static void main(String[] args) {
        Random rng = new Random(42);
        int[][] square = {{2, 4}, {1, 3}, {2, 4}, {1, 3}};
        Node original = buildGraph(square);
        Node copy = cloneGraph(original);
        Set<Node> origNodes = reach(original);
        boolean shared = reach(copy).stream().anyMatch(origNodes::contains);

        boolean gridsAgree = true, boardsAgree = true, laddersAgree = true;
        for (int t = 0; t < 200; t++) {
            int R = 1 + rng.nextInt(5), C = 1 + rng.nextInt(5);
            int[][] g = new int[R][C];
            for (int[] row : g) for (int c = 0; c < C; c++) row[c] = rng.nextInt(4);
            gridsAgree &= pacificAtlantic(g).equals(pacificAtlanticBrute(g));
        }
        for (int t = 0; t < 200; t++) {
            int R = 1 + rng.nextInt(6), C = 1 + rng.nextInt(6);
            char[][] b = new char[R][C];
            for (char[] row : b) for (int c = 0; c < C; c++) row[c] = rng.nextDouble() < 0.55 ? 'O' : 'X';
            boardsAgree &= Arrays.deepEquals(flipped(b), solveBrute(b));
        }
        List<String> randomWords = new ArrayList<>();
        for (int i = 0; i < 300; i++) {
            StringBuilder w = new StringBuilder();
            for (int j = 0; j < 3; j++) w.append("abcd".charAt(rng.nextInt(4)));
            randomWords.add(w.toString());
        }
        for (int t = 0; t < 200; t++) {
            String a = randomWords.get(rng.nextInt(300)), b = randomWords.get(rng.nextInt(300));
            if (a.equals(b)) continue;
            int x = ladderNaive(a, b, randomWords), y = ladderBuckets(a, b, randomWords), z = ladderBidirectional(a, b, randomWords);
            laddersAgree &= x == y && y == z;
        }
        List<String> words = List.of("cord", "card", "ward", "warm", "word", "worm", "wore", "core", "cold");
        List<String> noWarm = words.stream().filter(w -> !w.equals("warm")).toList();

        Object[][] cases = {
            {"133 bản sao giữ đúng cạnh", toAdj(copy).equals(Arrays.deepToString(square))},
            {"133 bản sao không dùng chung nút nào", !shared},
            {"133 đồ thị rỗng", cloneGraph(null) == null},
            {"133 một nút không cạnh", toAdj(cloneGraph(buildGraph(new int[][] {{}}))).equals("[[]]")},
            {"417 lưới xoắn ốc", pacificAtlantic(new int[][] {{1, 2, 3}, {8, 9, 4}, {7, 6, 5}}).toString()
                .equals("[[0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]]")},
            {"417 một ô", pacificAtlantic(new int[][] {{5}}).toString().equals("[[0, 0]]")},
            {"417 khớp vét cạn trên 200 lưới ngẫu nhiên", gridsAgree},
            {"130 vùng kín bị lật, ô ở mép giữ nguyên",
                Arrays.deepEquals(flipped(board("XXXX", "XOOX", "XXOX", "XOXX")), board("XXXX", "XXXX", "XXXX", "XOXX"))},
            {"130 vùng nối ra mép thì an toàn", Arrays.deepEquals(flipped(board("XOX", "XOX", "XXX")), board("XOX", "XOX", "XXX"))},
            {"130 khớp vét cạn trên 200 bảng ngẫu nhiên", boardsAgree},
            {"127 cold → warm cần 5 từ", ladderBuckets("cold", "warm", words) == 5},
            {"127 đích không có trong danh sách", ladderBuckets("cold", "warm", noWarm) == 0},
            {"127 đích cách một chữ", ladderBidirectional("cold", "cord", words) == 2},
            {"127 ba cách khớp nhau trên 200 cặp ngẫu nhiên", laddersAgree},
        };
        int ok = 0;
        for (Object[] c : cases) {
            if ((Boolean) c[1]) ok++;
            else System.out.println("SAI: " + c[0]);
        }
        System.out.printf("graph-bfs %d/%d ca đúng%n", ok, cases.length);
    }
}
