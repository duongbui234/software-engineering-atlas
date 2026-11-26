import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

class GridDemo {
    record Cell(int r, int c) {}

    static final int INF = Integer.MAX_VALUE;
    static final int[][] DIRECTIONS = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};

    static int[][] blankDistances(int[][] grid) {
        int[][] distance = new int[grid.length][];
        for (int r = 0; r < grid.length; r++) {
            distance[r] = new int[grid[r].length];
            Arrays.fill(distance[r], -1);
        }
        return distance;
    }

    static List<Cell> cellsWith(int[][] grid, int value) {
        List<Cell> cells = new ArrayList<>();
        for (int r = 0; r < grid.length; r++) {
            for (int c = 0; c < grid[r].length; c++) {
                if (grid[r][c] == value) cells.add(new Cell(r, c));
            }
        }
        return cells;
    }

    static int flood(int[][] grid, int[][] distance, List<Cell> queue, int enter) {
        for (Cell p : queue) distance[p.r()][p.c()] = 0;
        for (int head = 0; head < queue.size(); head++) {
            Cell p = queue.get(head);
            for (int[] step : DIRECTIONS) {
                int r = p.r() + step[0], c = p.c() + step[1];
                if (r < 0 || r >= grid.length || c < 0 || c >= grid[r].length) continue;
                if (grid[r][c] != enter || distance[r][c] != -1) continue;
                distance[r][c] = distance[p.r()][p.c()] + 1;
                queue.add(new Cell(r, c));
            }
        }
        return queue.size();
    }

    static int[] islands(int[][] grid) {
        int[][] distance = blankDistances(grid);
        int count = 0, largest = 0;
        for (Cell p : cellsWith(grid, 1)) {
            if (distance[p.r()][p.c()] == -1) {
                count++;
                largest = Math.max(largest, flood(grid, distance, new ArrayList<>(List.of(p)), 1));
            }
        }
        return new int[] {count, largest};
    }

    static int minutes(int[][] grid) {
        int[][] distance = blankDistances(grid);
        flood(grid, distance, cellsWith(grid, 2), 1);
        int last = 0;
        for (Cell p : cellsWith(grid, 1)) {
            int d = distance[p.r()][p.c()];
            if (d == -1) return -1;
            last = Math.max(last, d);
        }
        return last;
    }

    static int[][] nearestGates(int[][] grid) {
        int[][] distance = blankDistances(grid);
        flood(grid, distance, cellsWith(grid, 0), INF);
        int[][] result = new int[grid.length][];
        for (int r = 0; r < grid.length; r++) {
            result[r] = grid[r].clone();
            for (int c = 0; c < grid[r].length; c++) {
                if (grid[r][c] == INF && distance[r][c] != -1) result[r][c] = distance[r][c];
            }
        }
        return result;
    }

    public static void main(String[] args) {
        int[][] land = {{1, 0, 0, 1, 1}, {0, 0, 0, 1, 1}, {0, 1, 0, 1, 0}, {1, 1, 0, 0, 0}};
        int[][] oranges = {{2, 1, 1, 0, 2}, {0, 1, 1, 1, 1}};
        int[][] rooms = {{INF, -1, 0}, {INF, INF, INF}, {0, -1, INF}};
        boolean[] cases = {
            Arrays.equals(islands(land), new int[] {3, 5}),
            Arrays.equals(islands(new int[][] {{1, 0}, {0, 1}}), new int[] {2, 1}),
            Arrays.equals(islands(new int[][] {{0}}), new int[] {0, 0}),
            minutes(oranges) == 3,
            minutes(new int[][] {{2, 0, 1}}) == -1,
            minutes(new int[][] {{0, 2}}) == 0,
            minutes(new int[][] {{1}}) == -1,
            Arrays.deepEquals(nearestGates(rooms), new int[][] {{2, -1, 0}, {1, 2, 1}, {0, -1, 2}}),
            nearestGates(new int[][] {{0, -1, INF}})[0][2] == INF,
            nearestGates(new int[][] {{INF}})[0][0] == INF,
        };
        for (boolean pass : cases) {
            if (!pass) throw new AssertionError("Có ca sai");
        }
        System.out.printf("%d/%d ca đúng%n", cases.length, cases.length);
    }
}
