// LeetCode 36, Valid Sudoku: ba cách và test.
// Chạy: java valid-sudoku.java   (Java 21, không cần javac)
import java.util.*;

class ValidSudoku {
    static boolean unique(char[] cells) {
        boolean[] seen = new boolean[9];
        for (char d : cells) {
            if (d == '.') continue;
            if (seen[d - '1']) return false; // char trừ char ra int: '7' - '1' = 6
            seen[d - '1'] = true;
        }
        return true;
    }

    static boolean threePass(char[][] board) {
        for (int i = 0; i < 9; i++) {
            char[] col = new char[9], box = new char[9];
            int br = i / 3 * 3, bc = i % 3 * 3;
            for (int k = 0; k < 9; k++) {
                col[k] = board[k][i];
                box[k] = board[br + k / 3][bc + k % 3];
            }
            if (!unique(board[i]) || !unique(col) || !unique(box)) return false;
        }
        return true;
    }

    static boolean onePass(char[][] board) {
        List<Set<Character>> rows = new ArrayList<>(), cols = new ArrayList<>(), boxes = new ArrayList<>();
        for (int i = 0; i < 9; i++) { rows.add(new HashSet<>()); cols.add(new HashSet<>()); boxes.add(new HashSet<>()); }
        for (int r = 0; r < 9; r++)
            for (int c = 0; c < 9; c++) {
                char d = board[r][c];
                if (d == '.') continue;
                int b = r / 3 * 3 + c / 3;
                // add trả false khi đã có: kiểm và ghi trong một lệnh
                if (!rows.get(r).add(d) || !cols.get(c).add(d) || !boxes.get(b).add(d)) return false;
            }
        return true;
    }

    static boolean bitmask(char[][] board) {
        int[] rows = new int[9], cols = new int[9], boxes = new int[9];
        for (int r = 0; r < 9; r++)
            for (int c = 0; c < 9; c++) {
                if (board[r][c] == '.') continue;
                int bit = 1 << (board[r][c] - '1'), b = r / 3 * 3 + c / 3;
                if (((rows[r] | cols[c] | boxes[b]) & bit) != 0) return false; // Java: phải có ngoặc, & thấp hơn !=
                rows[r] |= bit; cols[c] |= bit; boxes[b] |= bit;
            }
        return true;
    }

    static char[][] parse(String... rows) {
        char[][] b = new char[9][];
        for (int i = 0; i < 9; i++) b[i] = rows[i].toCharArray();
        return b;
    }

    public static void main(String[] args) {
        String[] ex = {"53..7....", "6..195...", ".98....6.", "8...6...3", "4..8.3..1", "7...2...6", ".6....28.", "...419..5", "....8..79"};
        String e = ".........";
        Object[][] cases = {
            {"ví dụ hợp lệ", parse(ex), true},
            {"8 ở góc", change(ex, 0, 0, '8'), false},
            {"trùng hàng 0", change(ex, 0, 8, '5'), false},
            {"trùng chỉ trong ô 3×3", change(ex, 1, 1, '8'), false},
            {"bảng trống", parse(e, e, e, e, e, e, e, e, e), true},
            {"hai số 1 ở hai ô khác nhau", parse("...1.....", e, e, "1........", e, e, e, e, e), true},
        };
        String[] names = {"threePass", "onePass", "bitmask"};
        for (String name : names) {
            int ok = 0;
            for (Object[] c : cases) {
                char[][] b = (char[][]) c[1];
                boolean got = switch (name) { case "threePass" -> threePass(b); case "onePass" -> onePass(b); default -> bitmask(b); };
                if (got == (boolean) c[2]) ok++;
            }
            System.out.printf("%-10s %d/%d ca đúng%n", name, ok, cases.length);
        }
    }

    static char[][] change(String[] ex, int r, int c, char d) {
        char[][] b = parse(ex);
        b[r][c] = d;
        return b;
    }
}
