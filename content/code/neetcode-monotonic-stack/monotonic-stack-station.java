// Ga ARR-07: ngăn xếp đơn điệu. Giải 739, 853 và 84, tự chạy test.
// Chạy: java monotonic-stack-station.java
import java.util.*;

class MonotonicStackStation {
    // 739
    static int[] dailyTemperatures(int[] t) {
        int[] out = new int[t.length];
        Deque<Integer> stack = new ArrayDeque<>();
        for (int i = 0; i < t.length; i++) {
            while (!stack.isEmpty() && t[i] > t[stack.peek()]) {
                int j = stack.pop();
                out[j] = i - j;
            }
            stack.push(i);
        }
        return out;
    }

    // 853
    static int carFleet(int target, int[] position, int[] speed) {
        Integer[] idx = new Integer[position.length];
        for (int i = 0; i < idx.length; i++) idx[i] = i;
        Arrays.sort(idx, (a, b) -> position[b] - position[a]);
        Deque<Double> fleets = new ArrayDeque<>();
        for (int i : idx) {
            double time = (double) (target - position[i]) / speed[i]; // ép kiểu trước khi chia
            if (fleets.isEmpty() || time > fleets.peek()) fleets.push(time);
        }
        return fleets.size();
    }

    // 84
    static int largestRectangleArea(int[] h) {
        Deque<Integer> stack = new ArrayDeque<>();
        int best = 0;
        for (int i = 0; i <= h.length; i++) {
            int cur = i == h.length ? 0 : h[i];
            while (!stack.isEmpty() && cur < h[stack.peek()]) {
                int height = h[stack.pop()];
                int left = stack.isEmpty() ? -1 : stack.peek();
                best = Math.max(best, height * (i - left - 1));
            }
            stack.push(i);
        }
        return best;
    }

    public static void main(String[] args) {
        boolean[] tests = {
            Arrays.equals(dailyTemperatures(new int[] {73, 74, 75, 71, 69, 72, 76, 73}), new int[] {1, 1, 4, 2, 1, 1, 0, 0}),
            Arrays.equals(dailyTemperatures(new int[] {70, 70, 71}), new int[] {2, 1, 0}),
            carFleet(12, new int[] {10, 8, 0, 5, 3}, new int[] {2, 4, 1, 1, 3}) == 3, carFleet(10, new int[] {3}, new int[] {3}) == 1,
            carFleet(100, new int[] {0, 2, 4}, new int[] {4, 2, 1}) == 1,
            largestRectangleArea(new int[] {2, 1, 5, 6, 2, 3}) == 10, largestRectangleArea(new int[] {2, 4}) == 4,
            largestRectangleArea(new int[] {2, 2, 2}) == 6, largestRectangleArea(new int[] {6, 2, 5, 4, 5, 1, 6}) == 12,
        };
        int ok = 0;
        for (boolean t : tests) if (t) ok++;
        System.out.printf("%d/%d ca đúng%n", ok, tests.length);
    }
}
