// LeetCode 739, Daily Temperatures: ba cách và test.
// Chạy: java daily-temperatures.java
import java.util.*;

class DailyTemperatures {
    static int[] bruteForce(int[] t) {
        int[] out = new int[t.length];
        for (int i = 0; i < t.length; i++)
            for (int j = i + 1; j < t.length; j++)
                if (t[j] > t[i]) { out[i] = j - i; break; }
        return out;
    }

    static int[] monotonicStack(int[] t) {
        int[] out = new int[t.length];
        Deque<Integer> stack = new ArrayDeque<>(); // không dùng java.util.Stack: lớp cũ, đồng bộ hóa mọi thao tác
        for (int i = 0; i < t.length; i++) {
            while (!stack.isEmpty() && t[i] > t[stack.peek()]) {
                int j = stack.pop();
                out[j] = i - j;
            }
            stack.push(i);
        }
        return out;
    }

    static int[] intArrayStack(int[] t) {
        int[] out = new int[t.length], stack = new int[t.length]; // ngăn xếp bằng mảng int: không đóng hộp Integer
        int top = 0;
        for (int i = 0; i < t.length; i++) {
            while (top > 0 && t[i] > t[stack[top - 1]]) {
                int j = stack[--top];
                out[j] = i - j;
            }
            stack[top++] = i;
        }
        return out;
    }

    static int[] jumpFromRight(int[] t) {
        int n = t.length;
        int[] out = new int[n];
        for (int i = n - 2; i >= 0; i--) {
            int j = i + 1;
            while (j < n && t[j] <= t[i]) {
                if (out[j] == 0) { j = n; break; }
                j += out[j];
            }
            if (j < n) out[i] = j - i;
        }
        return out;
    }

    public static void main(String[] args) {
        int[][] in = {{73, 74, 75, 71, 69, 72, 76, 73}, {30, 40, 50, 60}, {30, 60, 90}, {90, 80, 70}, {70, 70, 71}, {50}, {55, 38, 53, 81, 61, 93, 97, 32, 43, 78}};
        int[][] want = {{1, 1, 4, 2, 1, 1, 0, 0}, {1, 1, 1, 0}, {1, 1, 0}, {0, 0, 0}, {2, 1, 0}, {0}, {3, 1, 1, 2, 1, 1, 0, 1, 1, 0}};
        for (String name : new String[] {"bruteForce", "monotonicStack", "intArrayStack", "jumpFromRight"}) {
            int ok = 0;
            for (int i = 0; i < in.length; i++) {
                int[] got = switch (name) {
                    case "bruteForce" -> bruteForce(in[i]);
                    case "monotonicStack" -> monotonicStack(in[i]);
                    case "intArrayStack" -> intArrayStack(in[i]);
                    default -> jumpFromRight(in[i]);
                };
                if (Arrays.equals(got, want[i])) ok++;
            }
            System.out.printf("%-15s %d/%d ca đúng%n", name, ok, in.length);
        }
        // Đo thô (một lần sau 3 vòng khởi động JIT), n = 10^6 giảm dần.
        int n = 1_000_000;
        int[] t = new int[n];
        for (int i = 0; i < n; i++) t[i] = 100 - (int) (70L * i / n);
        for (int w = 0; w < 3; w++) { monotonicStack(t); intArrayStack(t); }
        long s = System.nanoTime(); monotonicStack(t); long a = System.nanoTime(); intArrayStack(t); long b = System.nanoTime();
        System.out.printf("%nn = 1000000 giảm dần: ArrayDeque<Integer> %.1f ms, int[] %.1f ms%n", (a - s) / 1e6, (b - a) / 1e6);
    }
}
