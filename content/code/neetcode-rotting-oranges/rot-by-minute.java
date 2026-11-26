import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

class RotByMinute {
    record Cell(int row, int col) {}
    record Result(int minutes, int inspections) {}
    record Test(int[][] grid, int expected) {}

    static final int[][] DIRECTIONS = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};

    static boolean inside(int row, int col, int[][] grid) {
        return row >= 0 && row < grid.length && col >= 0 && col < grid[0].length;
    }

    static Result simulate(int[][] grid) {
        int fresh = 0, minutes = 0, scans = 0;
        for (int[] row : grid) {
            for (int value : row) {
                if (value == 1) fresh++;
            }
        }

        while (fresh > 0) {
            List<Cell> next = new ArrayList<>();
            for (int row = 0; row < grid.length; row++) {
                for (int col = 0; col < grid[0].length; col++) {
                    scans++;
                    if (grid[row][col] != 1) continue;
                    for (int[] d : DIRECTIONS) {
                        int nr = row + d[0], nc = col + d[1];
                        if (inside(nr, nc, grid) && grid[nr][nc] == 2) {
                            next.add(new Cell(row, col));
                            break;
                        }
                    }
                }
            }
            if (next.isEmpty()) return new Result(-1, scans);
            for (Cell p : next) grid[p.row()][p.col()] = 2;
            fresh -= next.size();
            minutes++;
        }
        return new Result(minutes, scans);
    }

    static Result spread(int[][] grid) {
        var queue = new ArrayDeque<Cell>();
        int fresh = 0;
        for (int row = 0; row < grid.length; row++) {
            for (int col = 0; col < grid[0].length; col++) {
                if (grid[row][col] == 2) queue.addLast(new Cell(row, col));
                if (grid[row][col] == 1) fresh++;
            }
        }

        int minutes = 0, pops = 0;
        while (!queue.isEmpty()) {
            int layerSize = queue.size();
            for (int i = 0; i < layerSize; i++) {
                Cell p = queue.removeFirst();
                pops++;
                for (int[] d : DIRECTIONS) {
                    int nr = p.row() + d[0], nc = p.col() + d[1];
                    if (!inside(nr, nc, grid) || grid[nr][nc] != 1) continue;
                    grid[nr][nc] = 2;
                    fresh--;
                    queue.addLast(new Cell(nr, nc));
                }
            }
            if (!queue.isEmpty()) minutes++;
        }
        return new Result(fresh == 0 ? minutes : -1, pops);
    }

    static int[][] copy(int[][] grid) {
        return Arrays.stream(grid).map(int[]::clone).toArray(int[][]::new);
    }

    public static void main(String[] args) {
        Test[] cases = {
            new Test(new int[][]{{2, 1, 1, 0, 2}, {0, 1, 1, 1, 1}}, 3),
            new Test(new int[][]{{2, 1, 0, 1}, {0, 1, 0, 1}}, -1),
            new Test(new int[][]{{0, 2, 0}}, 0),
            new Test(new int[][]{{1}}, -1),
            new Test(new int[][]{{0}}, 0),
            new Test(new int[][]{{2, 1, 2}}, 1),
            new Test(new int[][]{{2, 1, 1, 1, 1, 1, 1, 1, 1, 1}}, 9),
        };
        for (Test test : cases) {
            if (simulate(copy(test.grid())).minutes() != test.expected()
                || spread(copy(test.grid())).minutes() != test.expected()) {
                throw new AssertionError(Arrays.deepToString(test.grid()));
            }
        }

        int[][] corridor = cases[cases.length - 1].grid();
        int scans = simulate(copy(corridor)).inspections();
        int pops = spread(copy(corridor)).inspections();
        if (scans != 90 || pops != 10) throw new AssertionError("unexpected operation counts");
        System.out.printf("%d/%d ca đúng%n", cases.length, cases.length);
        System.out.printf("Quét: %d; lấy khỏi hàng đợi: %d%n", scans, pops);
    }
}
