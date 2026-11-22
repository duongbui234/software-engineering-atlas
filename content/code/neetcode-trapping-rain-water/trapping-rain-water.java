// LeetCode 42, Trapping Rain Water: bốn cách và test.
// Chạy: java trapping-rain-water.java
import java.util.*;

class TrappingRainWater {
    static int bruteForce(int[] h) {
        int total = 0;
        for (int i = 0; i < h.length; i++) {
            int left = 0, right = 0;
            for (int k = 0; k <= i; k++) left = Math.max(left, h[k]);
            for (int k = i; k < h.length; k++) right = Math.max(right, h[k]);
            total += Math.min(left, right) - h[i];
        }
        return total;
    }

    static int prefixMax(int[] h) {
        int n = h.length;
        if (n == 0) return 0;
        int[] left = new int[n], right = new int[n];
        left[0] = h[0]; right[n - 1] = h[n - 1];
        for (int i = 1; i < n; i++) left[i] = Math.max(left[i - 1], h[i]);
        for (int i = n - 2; i >= 0; i--) right[i] = Math.max(right[i + 1], h[i]);
        int total = 0;
        for (int i = 0; i < n; i++) total += Math.min(left[i], right[i]) - h[i];
        return total;
    }

    static int twoPointers(int[] h) {
        int i = 0, j = h.length - 1, leftMax = 0, rightMax = 0, total = 0;
        while (i < j) {
            leftMax = Math.max(leftMax, h[i]);
            rightMax = Math.max(rightMax, h[j]);
            if (leftMax < rightMax) total += leftMax - h[i++];
            else total += rightMax - h[j--];
        }
        return total;
    }

    static int monotonicStack(int[] h) {
        Deque<Integer> stack = new ArrayDeque<>(); // ArrayDeque thay cho lớp Stack cũ (đồng bộ hóa, chậm hơn)
        int total = 0;
        for (int i = 0; i < h.length; i++) {
            while (!stack.isEmpty() && h[i] > h[stack.peek()]) {
                int bottom = stack.pop();
                if (stack.isEmpty()) break;
                int l = stack.peek();
                total += (i - l - 1) * (Math.min(h[l], h[i]) - h[bottom]);
            }
            stack.push(i);
        }
        return total;
    }

    public static void main(String[] args) {
        int[][] in = {{0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1}, {4, 2, 0, 3, 2, 5}, {}, {3}, {1, 2, 3, 4}, {5, 4, 1, 2}, {2, 0, 2}, {3, 0, 0, 2, 0, 4}};
        int[] want = {6, 9, 0, 0, 0, 1, 2, 10};
        for (String name : new String[] {"bruteForce", "prefixMax", "twoPointers", "monotonicStack"}) {
            int ok = 0;
            for (int k = 0; k < in.length; k++) {
                int got = switch (name) {
                    case "bruteForce" -> bruteForce(in[k]);
                    case "prefixMax" -> prefixMax(in[k]);
                    case "twoPointers" -> twoPointers(in[k]);
                    default -> monotonicStack(in[k]);
                };
                if (got == want[k]) ok++;
            }
            System.out.printf("%-15s %d/%d ca đúng%n", name, ok, in.length);
        }
    }
}
