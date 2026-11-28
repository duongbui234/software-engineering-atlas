// Word Search (LeetCode 79): tìm một từ trên lưới chữ, mỗi bước sang ô kề cạnh, không dùng lại ô.
// Chạy: java search.java
import java.util.*;

class Search {
    static final int[][] DIRS = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
    static int calls = 0;

    // Cách 1: DFS với một bảng visited riêng.
    static boolean existVisited(char[][] board, String word) {
        boolean[][] visited = new boolean[board.length][board[0].length];
        for (int r = 0; r < board.length; r++)
            for (int c = 0; c < board[0].length; c++)
                if (dfsVisited(board, word, visited, r, c, 0)) return true;
        return false;
    }

    static boolean dfsVisited(char[][] board, String word, boolean[][] visited, int r, int c, int k) {
        calls++;
        if (k == word.length()) return true;
        if (r < 0 || c < 0 || r >= board.length || c >= board[0].length) return false;
        if (visited[r][c] || board[r][c] != word.charAt(k)) return false;
        visited[r][c] = true;
        for (int[] d : DIRS) {
            if (dfsVisited(board, word, visited, r + d[0], c + d[1], k + 1)) {
                visited[r][c] = false;
                return true;
            }
        }
        visited[r][c] = false;
        return false;
    }

    // Cách 2: đánh dấu ngay trên lưới bằng '#', trả lại chữ cũ khi quay lui.
    static boolean existInPlace(char[][] board, String word) {
        for (int r = 0; r < board.length; r++)
            for (int c = 0; c < board[0].length; c++)
                if (dfsInPlace(board, word, r, c, 0)) return true;
        return false;
    }

    static boolean dfsInPlace(char[][] board, String word, int r, int c, int k) {
        calls++;
        if (k == word.length()) return true;
        if (r < 0 || c < 0 || r >= board.length || c >= board[0].length) return false;
        if (board[r][c] != word.charAt(k)) return false;
        char saved = board[r][c];
        board[r][c] = '#';
        boolean found = false;
        for (int[] d : DIRS) {
            if (dfsInPlace(board, word, r + d[0], c + d[1], k + 1)) {
                found = true;
                break;
            }
        }
        board[r][c] = saved;
        return found;
    }

    // Cách 3: cắt nhánh trước khi tìm. Đếm chữ, rồi đảo từ nếu chữ cuối hiếm hơn chữ đầu.
    static boolean existPruned(char[][] board, String word) {
        int[] have = new int[128], need = new int[128];
        for (char[] row : board) for (char ch : row) have[ch]++;
        for (char ch : word.toCharArray()) need[ch]++;
        for (int ch = 0; ch < 128; ch++) if (need[ch] > have[ch]) return false;
        if (have[word.charAt(word.length() - 1)] < have[word.charAt(0)]) {
            word = new StringBuilder(word).reverse().toString();
        }
        return existInPlace(board, word);
    }

    // Trọng tài: liệt kê mọi đường đi đơn dài |word| trên lưới, ghép chữ rồi so cả chuỗi.
    static boolean bruteForce(char[][] board, String word) {
        boolean[][] used = new boolean[board.length][board[0].length];
        for (int r = 0; r < board.length; r++)
            for (int c = 0; c < board[0].length; c++)
                if (walk(board, word, used, r, c, "")) return true;
        return false;
    }

    static boolean walk(char[][] board, String word, boolean[][] used, int r, int c, String text) {
        String next = text + board[r][c];
        if (next.length() == word.length()) return next.equals(word);
        used[r][c] = true;
        boolean hit = false;
        for (int[] d : DIRS) {
            int nr = r + d[0], nc = c + d[1];
            if (nr >= 0 && nc >= 0 && nr < board.length && nc < board[0].length && !used[nr][nc]
                    && walk(board, word, used, nr, nc, next)) {
                hit = true;
                break;
            }
        }
        used[r][c] = false;
        return hit;
    }

    static char[][] board(String... rows) {
        char[][] b = new char[rows.length][];
        for (int i = 0; i < rows.length; i++) b[i] = rows[i].toCharArray();
        return b;
    }

    static char[][] copy(char[][] b) {
        char[][] out = new char[b.length][];
        for (int i = 0; i < b.length; i++) out[i] = b[i].clone();
        return out;
    }

    public static void main(String[] args) {
        char[][] grid = board("cat", "ods", "gen");
        Object[][] cases = {
            {grid, "cat", true}, {grid, "cod", true}, {grid, "dog", true},
            {grid, "cats", true}, {grid, "neds", true}, {grid, "tact", false},
            {grid, "cab", false}, {board("z"), "z", true}, {board("z"), "zz", false},
            {board("ab", "ba"), "abab", true}, {board("ab", "ba"), "abaa", false},
            {board("ab"), "aba", false},
        };
        int ok = 0;
        for (Object[] t : cases) {
            char[][] b = (char[][]) t[0];
            String word = (String) t[1];
            boolean want = (Boolean) t[2];
            char[][] b2 = copy(b), b3 = copy(b);
            boolean[] got = {existVisited(copy(b), word), existInPlace(b2, word), existPruned(b3, word), bruteForce(b, word)};
            boolean good = Arrays.deepEquals(b2, b) && Arrays.deepEquals(b3, b);
            for (boolean g : got) if (g != want) good = false;
            if (good) ok++;
            else System.out.println("sai ở " + word + " " + Arrays.toString(got));
        }
        System.out.println(ok + "/" + cases.length + " ca đúng");

        // Đối chiếu: mọi lưới 2×2 và 2×3 trên {a, b}, mọi từ trên {a, b} dài 1–4.
        List<String> words = new ArrayList<>();
        for (int len = 1; len <= 4; len++) {
            for (int mask = 0; mask < 1 << len; mask++) {
                StringBuilder w = new StringBuilder();
                for (int i = 0; i < len; i++) w.append(((mask >> i) & 1) == 1 ? 'b' : 'a');
                words.add(w.toString());
            }
        }
        int total = 0, agree = 0;
        for (int cols : new int[] {2, 3}) {
            int cells = 2 * cols;
            for (int mask = 0; mask < 1 << cells; mask++) {
                char[][] b = new char[2][cols];
                for (int i = 0; i < cells; i++) b[i / cols][i % cols] = ((mask >> i) & 1) == 1 ? 'b' : 'a';
                for (String w : words) {
                    total++;
                    boolean want = bruteForce(b, w);
                    char[][] b2 = copy(b), b3 = copy(b);
                    if (existVisited(copy(b), w) == want && existInPlace(b2, w) == want
                            && existPruned(b3, w) == want && Arrays.deepEquals(b2, b) && Arrays.deepEquals(b3, b)) agree++;
                }
            }
        }
        System.out.println(agree + "/" + total + " ca đúng (đối chiếu liệt kê mọi đường đi)");

        // Phép đo: lưới 4×4 toàn chữ a, chữ b ở góc dưới phải bị hai chữ c chắn, từ aaaaaaab không có.
        char[][] trap = board("aaaa", "aaaa", "aaac", "aacb");
        calls = 0;
        existInPlace(copy(trap), "aaaaaaab");
        int plain = calls;
        calls = 0;
        existPruned(copy(trap), "aaaaaaab");
        System.out.println("Lưới 4×4 toàn a, b ở góc bị c chắn, từ aaaaaaab: không cắt nhánh " + plain
                + " lượt gọi, đảo từ " + calls + " lượt gọi");
    }
}
