// LeetCode 621, Task Scheduler: mô phỏng bằng PriorityQueue + ArrayDeque, công thức khung, một bản sai và phép đo.
// Chạy: java task-scheduler.java
import java.util.*;

class TaskScheduler {
    // PriorityQueue là min-heap; Collections.reverseOrder() đưa số lần còn lại lớn nhất lên đỉnh.
    // Hàng đợi nguội giữ int[]{số lần còn lại, nhịp chạy lại được}.
    static int leastIntervalHeap(char[] tasks, int n) {
        int[] cnt = new int[26];
        for (char t : tasks) cnt[t - 'A']++;
        PriorityQueue<Integer> pq = new PriorityQueue<>(Collections.reverseOrder());
        for (int c : cnt) if (c > 0) pq.add(c);
        ArrayDeque<int[]> cooling = new ArrayDeque<>();
        int time = 0;
        while (!pq.isEmpty() || !cooling.isEmpty()) {
            time++;
            if (!pq.isEmpty()) {
                int c = pq.poll() - 1;
                if (c > 0) cooling.add(new int[]{c, time + n});
            }
            if (!cooling.isEmpty() && cooling.peek()[1] == time) pq.add(cooling.poll()[0]);
        }
        return time;
    }

    // Công thức khung: max(số việc, (f - 1)(n + 1) + k).
    static int leastIntervalFormula(char[] tasks, int n) {
        int[] cnt = new int[26];
        int f = 0;
        for (char t : tasks) f = Math.max(f, ++cnt[t - 'A']);
        int k = 0;
        for (int c : cnt) if (c == f) k++;
        return Math.max(tasks.length, (f - 1) * (n + 1) + k);
    }

    // SAI: quên comparator, PriorityQueue mặc định trả việc còn ÍT nhất trước.
    static int minHeapDefault(char[] tasks, int n) {
        int[] cnt = new int[26];
        for (char t : tasks) cnt[t - 'A']++;
        PriorityQueue<Integer> pq = new PriorityQueue<>();
        for (int c : cnt) if (c > 0) pq.add(c);
        ArrayDeque<int[]> cooling = new ArrayDeque<>();
        int time = 0;
        while (!pq.isEmpty() || !cooling.isEmpty()) {
            time++;
            if (!pq.isEmpty()) {
                int c = pq.poll() - 1;
                if (c > 0) cooling.add(new int[]{c, time + n});
            }
            if (!cooling.isEmpty() && cooling.peek()[1] == time) pq.add(cooling.poll()[0]);
        }
        return time;
    }

    interface Fn { int apply(char[] t, int n); }

    public static void main(String[] args) {
        Object[][] cases = {
            {"AAABBB", 2, 8}, {"ACABDB", 1, 6}, {"AAABBB", 3, 10}, {"AAABBB", 0, 6}, {"A", 100, 1},
            {"AAAAAABCDEFG", 2, 16}, {"ABBB", 1, 5}, {"AABBCCDD", 1, 8}, {"AAABBBCCCDDE", 2, 12}, {"AAAB", 3, 9},
        };
        String[] names = {"leastIntervalHeap", "leastIntervalFormula", "minHeapDefault"};
        Fn[] fns = {TaskScheduler::leastIntervalHeap, TaskScheduler::leastIntervalFormula, TaskScheduler::minHeapDefault};
        for (int i = 0; i < fns.length; i++) {
            List<String> bad = new ArrayList<>();
            for (Object[] c : cases) {
                int got = fns[i].apply(((String) c[0]).toCharArray(), (int) c[1]);
                if (got != (int) c[2]) bad.add(c[0] + " n=" + c[1] + " → " + got);
            }
            System.out.printf("%-21s %d/%d ca đúng%s%n", names[i], cases.length - bad.size(), cases.length,
                bad.isEmpty() ? "" : "; sai ở " + String.join(", ", bad));
        }

        Random rng = new Random(621);
        int agree = 0;
        for (int r = 0; r < 300; r++) {
            char[] t = new char[1 + rng.nextInt(2000)];
            int letters = 1 + rng.nextInt(26);
            for (int i = 0; i < t.length; i++) t[i] = (char) ('A' + rng.nextInt(letters));
            int n = rng.nextInt(101);
            if (leastIntervalHeap(t, n) == leastIntervalFormula(t, n)) agree++;
        }
        System.out.printf("%nngẫu nhiên: heap và công thức khớp ở %d/300 bộ%n", agree);

        System.out.println("\nsố việc   n      heap        công thức");
        int[][] sizes = {{10000, 2}, {100000, 100}, {1000000, 100}};
        for (int[] s : sizes) {
            char[] t = new char[s[0]];
            for (int i = 0; i < t.length; i++) t[i] = (char) ('A' + rng.nextInt(26));
            double[] h = new double[5], f = new double[5];
            for (int r = 0; r < 5; r++) {
                long t0 = System.nanoTime(); leastIntervalHeap(t, s[1]); h[r] = (System.nanoTime() - t0) / 1e6;
                t0 = System.nanoTime(); leastIntervalFormula(t, s[1]); f[r] = (System.nanoTime() - t0) / 1e6;
            }
            Arrays.sort(h); Arrays.sort(f);
            System.out.printf("%-9d %-6d %7.2f ms %8.2f ms%n", s[0], s[1], h[2], f[2]);
        }
    }
}
