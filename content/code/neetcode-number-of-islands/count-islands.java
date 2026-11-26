import java.util.ArrayDeque;
import java.util.Arrays;

class CountIslands {
    static final int[][] DIRECTIONS = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};

    static int floodBfs(int[][] grid) {
        int rows = grid.length, cols = grid[0].length;
        boolean[] seen = new boolean[rows * cols];
        int result = 0;
        for (int start = 0; start < seen.length; start++) {
            int row = start / cols, col = start % cols;
            if (grid[row][col] != 1 || seen[start]) continue;

            result++;
            var queue = new ArrayDeque<Integer>();
            seen[start] = true;
            queue.addLast(start);
            while (!queue.isEmpty()) {
                int cell = queue.removeFirst();
                for (int[] d : DIRECTIONS) {
                    int r = cell / cols + d[0], c = cell % cols + d[1];
                    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] != 1) continue;
                    int next = r * cols + c;
                    if (seen[next]) continue;
                    seen[next] = true;
                    queue.addLast(next);
                }
            }
        }
        return result;
    }

    static int floodDfsInPlace(int[][] grid) {
        int rows = grid.length, cols = grid[0].length;
        int result = 0;
        for (int start = 0; start < rows * cols; start++) {
            int row = start / cols, col = start % cols;
            if (grid[row][col] != 1) continue;

            result++;
            var stack = new ArrayDeque<Integer>();
            grid[row][col] = 0;
            stack.addLast(start);
            while (!stack.isEmpty()) {
                int cell = stack.removeLast();
                for (int[] d : DIRECTIONS) {
                    int r = cell / cols + d[0], c = cell % cols + d[1];
                    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] != 1) continue;
                    grid[r][c] = 0;
                    stack.addLast(r * cols + c);
                }
            }
        }
        return result;
    }

    record Case(String[] grid, int want) {}

    public static void main(String[] args) {
        String[] full = new String[300];
        Arrays.fill(full, "1".repeat(300));
        Case[] cases = {
            new Case(new String[]{"10011", "00011", "01010", "11000"}, 3),
            new Case(new String[]{"100", "010", "001"}, 3),
            new Case(new String[]{"000", "000"}, 0),
            new Case(new String[]{"11111"}, 1),
            new Case(new String[]{"11", "11"}, 1),
            new Case(full, 1),
        };
        for (Case example : cases) {
            int[][] cells = Arrays.stream(example.grid)
                .map(row -> row.chars().map(ch -> ch - '0').toArray()).toArray(int[][]::new);
            if (floodBfs(cells) != example.want) throw new AssertionError("BFS sai");
            for (int r = 0; r < cells.length; r++) {
                for (int c = 0; c < cells[r].length; c++) {
                    if (cells[r][c] != example.grid[r].charAt(c) - '0') throw new AssertionError("BFS sai");
                }
            }
            if (floodDfsInPlace(cells) != example.want) throw new AssertionError("DFS sai");
            for (int[] row : cells) {
                for (int cell : row) {
                    if (cell != 0) throw new AssertionError("DFS sai");
                }
            }
        }
        System.out.printf("%d/%d ca đúng%n", cases.length, cases.length);
    }
}
