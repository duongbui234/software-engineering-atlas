// Ga MISC-02: quay lui khi thứ tự có ý nghĩa, với trạng thái phải gỡ ra.
// Chạy: java search.java
import java.util.*;

public class search {
    static int permuteCalls = 0, queenCalls = 0;

    // Permutations: không có start; đánh dấu phần tử đã nằm trong path.
    static List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        walkPermute(nums, new boolean[nums.length], new ArrayList<>(), result);
        return result;
    }

    static void walkPermute(int[] nums, boolean[] used, List<Integer> path, List<List<Integer>> result) {
        permuteCalls++;
        if (path.size() == nums.length) {
            result.add(new ArrayList<>(path)); // chép path, vì path còn đổi tiếp
            return;
        }
        for (int i = 0; i < nums.length; i++) {
            if (used[i]) continue; // đã nằm trong path
            used[i] = true; // đánh dấu
            path.add(nums[i]); // chọn
            walkPermute(nums, used, path, result); // đi sâu
            path.remove(path.size() - 1); // gỡ lựa chọn
            used[i] = false; // gỡ dấu
        }
    }

    // Word Search: ghi đè ô đang đi qua, khôi phục khi quay lui.
    static boolean exist(char[][] board, String word) {
        for (int r = 0; r < board.length; r++) {
            for (int c = 0; c < board[0].length; c++) {
                if (dfs(board, word, r, c, 0)) return true;
            }
        }
        return false;
    }

    static boolean dfs(char[][] board, String word, int r, int c, int k) {
        if (r < 0 || c < 0 || r >= board.length || c >= board[0].length || board[r][c] != word.charAt(k)) return false;
        if (k == word.length() - 1) return true;
        char saved = board[r][c];
        board[r][c] = '#'; // đánh dấu đang đi qua
        boolean found = dfs(board, word, r + 1, c, k + 1) || dfs(board, word, r - 1, c, k + 1)
                || dfs(board, word, r, c + 1, k + 1) || dfs(board, word, r, c - 1, k + 1);
        board[r][c] = saved; // khôi phục
        return found;
    }

    // Palindrome Partitioning: chọn vị trí cắt tiếp theo, chỉ đi sâu nếu mảnh vừa cắt là palindrome.
    static List<List<String>> partition(String s) {
        List<List<String>> result = new ArrayList<>();
        walkPartition(s, 0, new ArrayList<>(), result);
        return result;
    }

    static boolean isPalindrome(String s, int lo, int hi) {
        while (lo < hi) {
            if (s.charAt(lo++) != s.charAt(hi--)) return false;
        }
        return true;
    }

    static void walkPartition(String s, int start, List<String> path, List<List<String>> result) {
        if (start == s.length()) {
            result.add(new ArrayList<>(path));
            return;
        }
        for (int end = start; end < s.length(); end++) {
            if (!isPalindrome(s, start, end)) continue; // cắt nhánh sớm
            path.add(s.substring(start, end + 1));
            walkPartition(s, end + 1, path, result);
            path.remove(path.size() - 1);
        }
    }

    // N-Queens: mỗi hàng một hậu; ba tập xung đột cho cột, chéo chính và chéo phụ.
    static List<List<String>> solveNQueens(int n) {
        List<List<String>> result = new ArrayList<>();
        place(n, 0, new ArrayList<>(), new HashSet<>(), new HashSet<>(), new HashSet<>(), result);
        return result;
    }

    static void place(int n, int r, List<Integer> colOf, Set<Integer> cols, Set<Integer> diag, Set<Integer> anti,
            List<List<String>> result) {
        queenCalls++;
        if (r == n) {
            List<String> rows = new ArrayList<>();
            for (int c : colOf) rows.add(".".repeat(c) + "Q" + ".".repeat(n - c - 1));
            result.add(rows);
            return;
        }
        for (int c = 0; c < n; c++) {
            if (cols.contains(c) || diag.contains(r - c) || anti.contains(r + c)) continue;
            cols.add(c);
            diag.add(r - c);
            anti.add(r + c);
            colOf.add(c);
            place(n, r + 1, colOf, cols, diag, anti, result);
            colOf.remove(colOf.size() - 1);
            cols.remove(c);
            diag.remove(r - c);
            anti.remove(r + c);
        }
    }

    static String key(List<? extends List<?>> lists) {
        List<String> parts = new ArrayList<>();
        for (List<?> x : lists) parts.add(x.toString());
        Collections.sort(parts);
        return String.join("|", parts);
    }

    static char[][] grid(String... rows) {
        char[][] g = new char[rows.length][];
        for (int i = 0; i < rows.length; i++) g[i] = rows[i].toCharArray();
        return g;
    }

    static List<List<Integer>> ints(int[]... rows) {
        List<List<Integer>> out = new ArrayList<>();
        for (int[] row : rows) {
            List<Integer> l = new ArrayList<>();
            for (int v : row) l.add(v);
            out.add(l);
        }
        return out;
    }

    static List<List<String>> strs(String[]... rows) {
        List<List<String>> out = new ArrayList<>();
        for (String[] row : rows) out.add(Arrays.asList(row));
        return out;
    }

    public static void main(String[] args) {
        String[] b = {"TOP", "ARE", "NED"};
        Set<List<Integer>> six = new HashSet<>(permute(new int[] {1, 2, 3, 4, 5, 6}));
        Object[][] cases = {
            {"permute [4,7,9]", key(permute(new int[] {4, 7, 9})),
                key(ints(new int[] {4, 7, 9}, new int[] {4, 9, 7}, new int[] {7, 4, 9}, new int[] {7, 9, 4}, new int[] {9, 4, 7}, new int[] {9, 7, 4}))},
            {"permute [5]", key(permute(new int[] {5})), key(ints(new int[] {5}))},
            {"permute 6 số", six.size(), 720},
            {"exist TOP", exist(grid(b), "TOP"), true},
            {"exist TAN", exist(grid(b), "TAN"), true},
            {"exist PERE", exist(grid(b), "PERE"), true},
            {"exist ROPED", exist(grid(b), "ROPED"), true},
            {"exist TOT (không dùng lại ô)", exist(grid(b), "TOT"), false},
            {"exist ARENA", exist(grid(b), "ARENA"), false},
            {"exist NEED", exist(grid(b), "NEED"), false},
            {"partition noon", key(partition("noon")),
                key(strs(new String[] {"noon"}, new String[] {"n", "oo", "n"}, new String[] {"n", "o", "o", "n"}))},
            {"partition abc", key(partition("abc")), key(strs(new String[] {"a", "b", "c"}))},
            {"partition aaa", key(partition("aaa")),
                key(strs(new String[] {"aaa"}, new String[] {"a", "aa"}, new String[] {"aa", "a"}, new String[] {"a", "a", "a"}))},
            {"partition 8 chữ a", partition("aaaaaaaa").size(), 128},
            {"partition racecar", partition("racecar").size(), 4},
            {"nQueens 4", key(solveNQueens(4)),
                key(strs(new String[] {".Q..", "...Q", "Q...", "..Q."}, new String[] {"..Q.", "Q...", "...Q", ".Q.."}))},
            {"nQueens 1", key(solveNQueens(1)), key(strs(new String[] {"Q"}))},
            {"nQueens 3", solveNQueens(3).size(), 0},
            {"nQueens 6", solveNQueens(6).size(), 4},
        };
        int ok = 0;
        List<String> fails = new ArrayList<>();
        for (Object[] c : cases) {
            if (c[1].equals(c[2])) ok++;
            else fails.add((String) c[0]);
        }
        System.out.println(ok + "/" + cases.length + " ca đúng");
        if (!fails.isEmpty()) System.out.println("sai ở: " + String.join("; ", fails));
        permuteCalls = 0;
        int perms = permute(new int[] {1, 2, 3, 4, 5, 6, 7, 8}).size();
        queenCalls = 0;
        int boards = solveNQueens(8).size();
        System.out.println("Hoán vị 8 số: " + permuteCalls + " lần gọi, " + perms + " kết quả");
        System.out.println("8 hậu: " + queenCalls + " lần gọi, " + boards + " lời giải");
    }
}
