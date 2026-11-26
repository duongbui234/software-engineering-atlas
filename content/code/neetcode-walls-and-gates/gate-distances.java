import java.util.Arrays;

class GateDistances {
    static final int INF = Integer.MAX_VALUE;
    static final int[][] DIRECTIONS = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};

    record Search(int distance, int popped) {}

    static Search fromRoom(int[][] rooms, int start) {
        int rows = rooms.length, cols = rooms[0].length;
        int[] queue = new int[rows * cols];
        int[] distance = new int[rows * cols];
        Arrays.fill(distance, -1);
        queue[0] = start;
        distance[start] = 0;
        int tail = 1;

        for (int head = 0; head < tail; head++) {
            int cell = queue[head], r = cell / cols, c = cell % cols;
            if (rooms[r][c] == 0) return new Search(distance[cell], head + 1);
            for (int[] step : DIRECTIONS) {
                int nr = r + step[0], nc = c + step[1];
                if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
                int next = nr * cols + nc;
                if (rooms[nr][nc] == -1 || distance[next] != -1) continue;
                distance[next] = distance[cell] + 1;
                queue[tail++] = next;
            }
        }
        return new Search(INF, tail);
    }

    static int perRoom(int[][] rooms) {
        int popped = 0, cols = rooms[0].length;
        for (int r = 0; r < rooms.length; r++) {
            for (int c = 0; c < cols; c++) {
                if (rooms[r][c] != INF) continue;
                Search result = fromRoom(rooms, r * cols + c);
                rooms[r][c] = result.distance();
                popped += result.popped();
            }
        }
        return popped;
    }

    static int fromAllGates(int[][] rooms) {
        int rows = rooms.length, cols = rooms[0].length;
        int[] queue = new int[rows * cols];
        int tail = 0;
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (rooms[r][c] == 0) queue[tail++] = r * cols + c;
            }
        }

        for (int head = 0; head < tail; head++) {
            int cell = queue[head], r = cell / cols, c = cell % cols;
            for (int[] step : DIRECTIONS) {
                int nr = r + step[0], nc = c + step[1];
                if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
                if (rooms[nr][nc] != INF) continue;
                rooms[nr][nc] = rooms[r][c] + 1;
                queue[tail++] = nr * cols + nc;
            }
        }
        return tail;
    }

    static int[][] copyGrid(int[][] rooms) {
        return Arrays.stream(rooms).map(int[]::clone).toArray(int[][]::new);
    }

    static void check(int[][] before, int[][] expected) {
        int[][] roomByRoom = copyGrid(before);
        int[][] inOnePass = copyGrid(before);
        perRoom(roomByRoom);
        fromAllGates(inOnePass);
        if (!Arrays.deepEquals(expected, roomByRoom) || !Arrays.deepEquals(expected, inOnePass)) {
            throw new AssertionError("distance mismatch");
        }
    }

    public static void main(String[] args) {
        int[][][][] cases = {
            {
                {{0, -1, INF, INF, 0}, {INF, INF, INF, -1, INF}, {INF, -1, INF, -1, -1}, {INF, INF, INF, -1, INF}},
                {{0, -1, 2, 1, 0}, {1, 2, 3, -1, 1}, {2, -1, 4, -1, -1}, {3, 4, 5, -1, INF}},
            },
            {{{INF, 0, INF, INF, 0, INF}}, {{1, 0, 1, 1, 0, 1}}},
            {{{0, -1, INF}}, {{0, -1, INF}}},
            {{{INF, INF}, {INF, -1}}, {{INF, INF}, {INF, -1}}},
            {{{0}}, {{0}}},
            {{{-1}, {INF}, {0}, {INF}}, {{-1}, {1}, {0}, {1}}},
            {{{0, -1, INF}, {INF, INF, INF}}, {{0, -1, 4}, {1, 2, 3}}},
        };
        for (int[][][] test : cases) check(test[0], test[1]);
        System.out.printf("%d/%d ca đúng%n", cases.length, cases.length);

        int[][] roomByRoom = new int[24][24];
        for (int[] row : roomByRoom) Arrays.fill(row, INF);
        roomByRoom[0][0] = 0;
        int[][] inOnePass = copyGrid(roomByRoom);
        int repeatedPops = perRoom(roomByRoom);
        int sharedPops = fromAllGates(inOnePass);
        if (!Arrays.deepEquals(roomByRoom, inOnePass)) throw new AssertionError("24 × 24");
        System.out.printf("Số lượt lấy ô khỏi hàng đợi: %d / %d%n", repeatedPops, sharedPops);
    }
}
