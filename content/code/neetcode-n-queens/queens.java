// N-Queens (LeetCode 51): vét mọi hoán vị, quay lui với ba tập xung đột, đếm bằng bitmask
// Chạy: java queens.java
import java.util.*;

public class queens {
    static int calls = 0;

    // Đổi danh sách cột (cols[r] là cột của hậu ở hàng r) thành bàn cờ dạng chuỗi
    static List<String> toBoard(List<Integer> cols) {
        int n = cols.size();
        List<String> board = new ArrayList<>();
        for (int c : cols) board.add(".".repeat(c) + "Q" + ".".repeat(n - c - 1));
        return board;
    }

    // Cách 1: mỗi hàng một hậu, mỗi cột một hậu, tức một hoán vị cột; dựng xong mới xét hai đường chéo
    static List<List<String>> solveBrute(int n) {
        List<List<String>> result = new ArrayList<>();
        walk(n, new ArrayList<>(), new boolean[n], result);
        return result;
    }

    static void walk(int n, List<Integer> cols, boolean[] used, List<List<String>> result) {
        calls++;
        if (cols.size() == n) {
            if (diagonalsOk(cols)) result.add(toBoard(cols));
            return;
        }
        for (int c = 0; c < n; c++) {
            if (used[c]) continue;
            used[c] = true;
            cols.add(c);
            walk(n, cols, used, result);
            cols.remove(cols.size() - 1);
            used[c] = false;
        }
    }

    static boolean diagonalsOk(List<Integer> cols) {
        for (int a = 0; a < cols.size(); a++)
            for (int b = a + 1; b < cols.size(); b++)
                if (Math.abs(cols.get(a) - cols.get(b)) == b - a) return false;
        return true;
    }

    // Cách 2: đặt từng hàng; ba mảng đánh dấu cột, chéo chính (r - c + n - 1) và chéo phụ (r + c)
    static List<List<String>> solveNQueens(int n) {
        List<List<String>> result = new ArrayList<>();
        place(0, n, new ArrayList<>(), new boolean[n], new boolean[2 * n - 1], new boolean[2 * n - 1], result);
        return result;
    }

    static void place(int r, int n, List<Integer> cols, boolean[] colUsed, boolean[] diag, boolean[] anti,
                      List<List<String>> result) {
        calls++;
        if (r == n) {
            result.add(toBoard(cols)); // chỉ dựng chuỗi ở lá
            return;
        }
        for (int c = 0; c < n; c++) {
            int d = r - c + n - 1, a = r + c;
            if (colUsed[c] || diag[d] || anti[a]) continue;
            colUsed[c] = diag[d] = anti[a] = true;
            cols.add(c);
            place(r + 1, n, cols, colUsed, diag, anti, result);
            cols.remove(cols.size() - 1);
            colUsed[c] = diag[d] = anti[a] = false; // gỡ cả ba dấu
        }
    }

    // Cách 3: chỉ đếm; ba tập là ba số nguyên, bit 1 là cột bị chiếu ở hàng đang xét
    static int countBits(int n) {
        return go((1 << n) - 1, 0, 0, 0);
    }

    static int go(int full, int cols, int left, int right) {
        calls++;
        if (cols == full) return 1;
        int count = 0;
        int free = full & ~(cols | left | right);
        while (free != 0) {
            int bit = free & -free; // bit 1 thấp nhất: một cột còn trống
            free -= bit;
            // chéo dịch một cột sang trái hoặc phải khi xuống hàng sau
            count += go(full, cols | bit, ((left | bit) << 1) & full, (right | bit) >> 1);
        }
        return count;
    }

    // Bản sai: quên gỡ dấu chéo phụ khi quay lui
    static int countForgetAnti(int n) {
        return forget(0, n, new boolean[n], new boolean[2 * n - 1], new boolean[2 * n - 1]);
    }

    static int forget(int r, int n, boolean[] colUsed, boolean[] diag, boolean[] anti) {
        if (r == n) return 1;
        int count = 0;
        for (int c = 0; c < n; c++) {
            int d = r - c + n - 1, a = r + c;
            if (colUsed[c] || diag[d] || anti[a]) continue;
            colUsed[c] = diag[d] = anti[a] = true;
            count += forget(r + 1, n, colUsed, diag, anti);
            colUsed[c] = diag[d] = false;
        }
        return count;
    }

    // Kiểm tra độc lập: đọc lại bàn cờ từ chuỗi
    static boolean validBoard(List<String> board, int n) {
        if (board.size() != n) return false;
        Set<Integer> cols = new HashSet<>(), diags = new HashSet<>(), antis = new HashSet<>();
        for (int r = 0; r < n; r++) {
            String row = board.get(r);
            if (row.length() != n || !row.matches("\\.*Q\\.*")) return false;
            int c = row.indexOf('Q');
            cols.add(c);
            diags.add(r - c);
            antis.add(r + c);
        }
        return cols.size() == n && diags.size() == n && antis.size() == n;
    }

    static String key(List<List<String>> boards) {
        List<String> keys = new ArrayList<>();
        for (List<String> b : boards) keys.add(String.join("/", b));
        Collections.sort(keys);
        return String.join("|", keys);
    }

    static int ok = 0, total = 0;

    static void check(boolean cond, String name) {
        total++;
        if (cond) ok++;
        else System.out.println("sai ở " + name);
    }

    public static void main(String[] args) {
        int[] known = {1, 0, 0, 2, 10, 4, 40, 92, 352};
        for (int n = 1; n <= 9; n++)
            check(solveNQueens(n).size() == known[n - 1] && countBits(n) == known[n - 1], "n = " + n);
        check(solveNQueens(5).stream().anyMatch(b -> String.join("/", b).equals("Q..../..Q../....Q/.Q.../...Q.")),
              "n = 5 có bàn mẫu");
        List<List<String>> six = solveNQueens(6);
        check(six.stream().allMatch(b -> validBoard(b, 6)), "n = 6 mọi bàn hợp lệ");
        Set<String> seen = new HashSet<>();
        for (List<String> b : six) seen.add(String.join("/", b));
        check(seen.size() == six.size(), "n = 6 không trùng");
        System.out.println(ok + "/" + total + " ca đúng");

        int crossOk = 0;
        for (int n = 1; n <= 7; n++) if (key(solveBrute(n)).equals(key(solveNQueens(n)))) crossOk++;
        System.out.println(crossOk + "/7 ca đúng (đối chiếu vét mọi hoán vị)");

        calls = 0; solveBrute(8); int brute = calls;
        calls = 0; solveNQueens(8); int sets = calls;
        calls = 0; countBits(8); int bits = calls;
        System.out.println("n = 8: vét hoán vị " + brute + " lượt gọi, ba tập " + sets + " lượt gọi, bitmask " + bits + " lượt gọi");
        System.out.println("Quên gỡ chéo phụ: n = 8 ra " + countForgetAnti(8) + " bàn, đúng là 92");
    }
}
