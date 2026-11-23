// LeetCode 84, Largest Rectangle in Histogram: các cách giải và test.
// Chạy: java largest-rectangle.java
import java.util.*;

class LargestRectangle {
    static int bruteForce(int[] h) {
        int best = 0;
        for (int i = 0; i < h.length; i++) {
            int low = h[i];
            for (int j = i; j < h.length; j++) {
                low = Math.min(low, h[j]);
                best = Math.max(best, low * (j - i + 1));
            }
        }
        return best;
    }

    static int divideConquer(int[] h, int lo, int hi) {
        if (lo > hi) return 0;
        int m = lo;
        for (int i = lo + 1; i <= hi; i++) if (h[i] < h[m]) m = i;
        return Math.max(h[m] * (hi - lo + 1), Math.max(divideConquer(h, lo, m - 1), divideConquer(h, m + 1, hi)));
    }

    static int monotonicStack(int[] h) {
        int[] st = new int[h.length + 1]; // mảng int làm ngăn xếp: không đóng hộp như Deque<Integer>
        int top = 0, best = 0;
        for (int i = 0; i <= h.length; i++) {
            int cur = i == h.length ? 0 : h[i]; // lính canh
            while (top > 0 && h[st[top - 1]] >= cur) {
                int height = h[st[--top]];
                int left = top > 0 ? st[top - 1] : -1;
                best = Math.max(best, height * (i - left - 1));
            }
            st[top++] = i;
        }
        return best;
    }

    public static void main(String[] args) {
        int[][] in = {{2, 1, 5, 6, 2, 3}, {2, 4}, {1}, {0, 0}, {1, 2, 3, 4, 5}, {5, 4, 3, 2, 1}, {2, 2, 2, 2}, {4, 2, 0, 3, 2, 5}, {6, 2, 5, 4, 5, 1, 6}};
        int[] want = {10, 4, 1, 0, 9, 9, 8, 6, 12};
        for (String name : new String[] {"bruteForce", "divideConquer", "monotonicStack"}) {
            int ok = 0;
            for (int i = 0; i < in.length; i++) {
                int got = switch (name) {
                    case "bruteForce" -> bruteForce(in[i]);
                    case "divideConquer" -> divideConquer(in[i], 0, in[i].length - 1);
                    default -> monotonicStack(in[i]);
                };
                if (got == want[i]) ok++;
            }
            System.out.printf("%-15s %d/%d ca đúng%n", name, ok, in.length);
        }
        int[] inc = new int[100_000];
        for (int i = 0; i < inc.length; i++) inc[i] = 1; // toàn 1: cột thấp nhất (đầu tiên) luôn ở mép, đệ quy sâu n tầng
        try {
            divideConquer(inc, 0, inc.length - 1);
            System.out.println("\nchia để trị, 100 000 cột bằng nhau: chạy xong");
        } catch (StackOverflowError e) {
            System.out.println("\nchia để trị, 100 000 cột bằng nhau: StackOverflowError");
        }
        System.out.println("monotonicStack cùng dữ liệu: " + monotonicStack(inc));
    }
}
