// LeetCode 74, Search a 2D Matrix: bốn cách, test, và bẫy tràn khi tính điểm giữa.
// Chạy: java search-2d-matrix.java
import java.util.*;

class Search2DMatrix {
    static boolean linearScan(int[][] matrix, int target) {
        for (int[] row : matrix) for (int x : row) if (x == target) return true;
        return false;
    }

    static boolean twoBinarySearch(int[][] matrix, int target) {
        int lo = 0, hi = matrix.length;
        while (lo < hi) {
            int mid = (lo + hi) >>> 1;
            if (matrix[mid][0] <= target) lo = mid + 1; else hi = mid;
        }
        int r = lo - 1;
        if (r < 0) return false;
        // Arrays.binarySearch trả chỉ số nếu thấy, còn không thì trả -(vị trí chèn) - 1: luôn âm
        return Arrays.binarySearch(matrix[r], target) >= 0;
    }

    static boolean flatBinarySearch(int[][] matrix, int target) {
        int m = matrix.length, n = matrix[0].length;
        int lo = 0, hi = m * n; // m·n ≤ 10⁴ theo đề; với ma trận rất lớn phải dùng long
        while (lo < hi) {
            int mid = (lo + hi) >>> 1; // >>> dịch không dấu: đúng cả khi lo + hi tràn int
            int x = matrix[mid / n][mid % n];
            if (x == target) return true;
            if (x < target) lo = mid + 1; else hi = mid;
        }
        return false;
    }

    static boolean staircase(int[][] matrix, int target) {
        int r = 0, c = matrix[0].length - 1;
        while (r < matrix.length && c >= 0) {
            int x = matrix[r][c];
            if (x == target) return true;
            if (x > target) c--; else r++;
        }
        return false;
    }

    public static void main(String[] args) {
        int[][] ex = {{1, 3, 5, 7}, {10, 11, 16, 20}, {23, 30, 34, 60}};
        Object[][] cases = {{ex, 3, true}, {ex, 13, false}, {ex, 60, true}, {ex, 23, true}, {ex, 0, false}, {ex, 61, false},
            {new int[][] {{1}}, 1, true}, {new int[][] {{1}}, 2, false}, {new int[][] {{1}, {3}}, 3, true}, {new int[][] {{1, 2}, {3, 4}}, 4, true}};
        for (String name : new String[] {"linearScan", "twoBinarySearch", "flatBinarySearch", "staircase"}) {
            int ok = 0;
            for (Object[] c : cases) {
                int[][] m = (int[][]) c[0];
                int t = (int) c[1];
                boolean got = switch (name) {
                    case "linearScan" -> linearScan(m, t);
                    case "twoBinarySearch" -> twoBinarySearch(m, t);
                    case "flatBinarySearch" -> flatBinarySearch(m, t);
                    default -> staircase(m, t);
                };
                if (got == (boolean) c[2]) ok++;
            }
            System.out.printf("%-17s %d/%d ca đúng%n", name, ok, cases.length);
        }
        int lo = 1_500_000_000, hi = 2_000_000_000;
        System.out.printf("%nlo = %d, hi = %d: (lo + hi) / 2 = %d, (lo + hi) >>> 1 = %d, lo + (hi - lo) / 2 = %d%n",
            lo, hi, (lo + hi) / 2, (lo + hi) >>> 1, lo + (hi - lo) / 2);
        System.out.printf("Arrays.binarySearch([1, 3, 5, 7], 4) = %d%n", Arrays.binarySearch(new int[] {1, 3, 5, 7}, 4));
    }
}
