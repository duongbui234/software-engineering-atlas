// LeetCode 239, Sliding Window Maximum: ba cách và test.
// Chạy: java sliding-window-max.java
import java.util.*;

class SlidingWindowMax {
    static int[] bruteForce(int[] nums, int k) {
        int[] out = new int[nums.length - k + 1];
        for (int i = 0; i + k <= nums.length; i++) {
            int m = nums[i];
            for (int j = i + 1; j < i + k; j++) m = Math.max(m, nums[j]);
            out[i] = m;
        }
        return out;
    }

    static int[] blocks(int[] nums, int k) {
        int n = nums.length;
        int[] pre = nums.clone(), suf = nums.clone(), out = new int[n - k + 1];
        for (int i = 1; i < n; i++) if (i % k != 0) pre[i] = Math.max(pre[i - 1], nums[i]);
        for (int i = n - 2; i >= 0; i--) if ((i + 1) % k != 0) suf[i] = Math.max(suf[i + 1], nums[i]);
        for (int i = 0; i + k <= n; i++) out[i] = Math.max(suf[i], pre[i + k - 1]);
        return out;
    }

    static int[] monotonicDeque(int[] nums, int k) {
        // ArrayDeque: thêm, bớt hai đầu O(1). Đừng dùng Stack hay LinkedList: Stack đồng bộ hóa, LinkedList tạo một node mỗi phần tử.
        Deque<Integer> q = new ArrayDeque<>();
        int[] out = new int[nums.length - k + 1];
        for (int i = 0; i < nums.length; i++) {
            if (!q.isEmpty() && q.peekFirst() <= i - k) q.pollFirst();
            while (!q.isEmpty() && nums[q.peekLast()] <= nums[i]) q.pollLast();
            q.offerLast(i);
            if (i >= k - 1) out[i - k + 1] = nums[q.peekFirst()];
        }
        return out;
    }

    public static void main(String[] args) {
        int[][] in = {{1, 3, -1, -3, 5, 3, 6, 7}, {1}, {9, 8, 7, 6, 5}, {1, 2, 3, 4}, {4, 4, 4, 1}, {-7, -8, 7, 5, 7, 1, 6, 0}, {5, 1, 2, 3}};
        int[] ks = {3, 1, 2, 4, 2, 4, 2};
        int[][] want = {{3, 3, 5, 5, 6, 7}, {1}, {9, 8, 7, 6}, {4}, {4, 4, 4}, {7, 7, 7, 7, 7}, {5, 2, 3}};
        for (String name : new String[] {"bruteForce", "blocks", "monotonicDeque"}) {
            int ok = 0;
            for (int i = 0; i < in.length; i++) {
                int[] got = switch (name) {
                    case "bruteForce" -> bruteForce(in[i], ks[i]);
                    case "blocks" -> blocks(in[i], ks[i]);
                    default -> monotonicDeque(in[i], ks[i]);
                };
                if (Arrays.equals(got, want[i])) ok++;
            }
            System.out.printf("%-15s %d/%d ca đúng%n", name, ok, in.length);
        }
    }
}
