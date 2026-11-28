// Jump Game II (LeetCode 45): DP O(n²), BFS tường minh, tham lam theo lớp nhảy O(n)
// Chạy: java layers.java
import java.util.*;

public class layers {
    static long ops = 0;

    // DP: best[j] = số bước ít nhất để tới j; mỗi ô i đẩy best[i] + 1 sang mọi ô nó với tới
    static int jumpDP(int[] nums) {
        int n = nums.length;
        int[] best = new int[n];
        Arrays.fill(best, n); // n bước là "chưa tới"; Integer.MAX_VALUE + 1 sẽ tràn thành số âm
        best[0] = 0;
        for (int i = 0; i < n; i++) {
            for (int k = 1; k <= nums[i] && i + k < n; k++) {
                ops++;
                best[i + k] = Math.min(best[i + k], best[i] + 1);
            }
        }
        return best[n - 1];
    }

    // BFS tường minh: mỗi chỉ số là một đỉnh, cạnh i → i+1..i+nums[i]
    static int jumpBFS(int[] nums) {
        int n = nums.length;
        int[] dist = new int[n];
        Arrays.fill(dist, -1);
        dist[0] = 0;
        ArrayDeque<Integer> queue = new ArrayDeque<>();
        queue.add(0);
        while (!queue.isEmpty()) {
            int i = queue.poll();
            for (int k = 1; k <= nums[i] && i + k < n; k++) {
                ops++;
                if (dist[i + k] == -1) {
                    dist[i + k] = dist[i] + 1;
                    queue.add(i + k);
                }
            }
        }
        return dist[n - 1];
    }

    // Cách chính: lớp nhảy. [.., end] là lớp hiện tại, far là chỗ xa nhất lớp sau với tới
    static int jump(int[] nums) {
        int jumps = 0, end = 0, far = 0;
        for (int i = 0; i < nums.length - 1; i++) { // dừng trước ô cuối
            ops++;
            far = Math.max(far, i + nums[i]);
            if (i == end) { // đi hết lớp hiện tại: phải nhảy thêm một bước
                jumps++;
                end = far;
            }
        }
        return jumps;
    }

    // Bản sai: vòng lặp chạy tới cả ô cuối, nên có thể đếm thêm một bước thừa
    static int jumpToLast(int[] nums) {
        int jumps = 0, end = 0, far = 0;
        for (int i = 0; i < nums.length; i++) {
            far = Math.max(far, i + nums[i]);
            if (i == end) {
                jumps++;
                end = far;
            }
        }
        return jumps;
    }

    // Bản sai: từ chỗ đang đứng luôn nhảy xa nhất có thể; -1 nếu kẹt ở ô 0
    static int jumpFarthestNow(int[] nums) {
        int pos = 0, jumps = 0;
        while (pos < nums.length - 1) {
            if (nums[pos] == 0) return -1;
            pos = Math.min(pos + nums[pos], nums.length - 1);
            jumps++;
        }
        return jumps;
    }

    // Trọng tài độc lập: thử mọi đường nhảy bằng đệ quy, không nhớ gì
    static final int UNREACHABLE = 1_000_000;

    static int bruteForce(int[] nums, int i) {
        if (i == nums.length - 1) return 0;
        int best = UNREACHABLE;
        for (int k = 1; k <= nums[i] && i + k < nums.length; k++) {
            best = Math.min(best, 1 + bruteForce(nums, i + k));
        }
        return best;
    }

    static int total = 0, good = 0, wrong = 0, wrongNow = 0;

    static void build(int[] arr) {
        if (arr.length > 0) {
            int want = bruteForce(arr, 0);
            if (want < UNREACHABLE) {
                total++;
                if (jumpDP(arr) == want && jumpBFS(arr) == want && jump(arr) == want) good++;
                if (jumpToLast(arr) != want) wrong++;
                if (jumpFarthestNow(arr) != want) wrongNow++;
            }
        }
        if (arr.length == 6) return;
        for (int v = 0; v <= 3; v++) {
            int[] next = Arrays.copyOf(arr, arr.length + 1);
            next[arr.length] = v;
            build(next);
        }
    }

    public static void main(String[] args) {
        int[][] inputs = {
            {0}, {5}, {1, 1, 1, 1}, {4, 0, 0, 0, 0}, {3, 1, 0, 2, 0, 1},
            {2, 0, 2, 0, 1}, {1, 2, 1, 1, 1}, {1, 3, 0, 0, 5, 0, 0, 1},
        };
        int[] wants = {0, 0, 3, 1, 2, 2, 3, 3};
        int ok = 0;
        for (int c = 0; c < inputs.length; c++) {
            int[] nums = inputs[c];
            int want = wants[c];
            int[] got = {jumpDP(nums), jumpBFS(nums), jump(nums), bruteForce(nums, 0)};
            if (Arrays.stream(got).allMatch(g -> g == want)) ok++;
            else System.out.println("sai ở " + Arrays.toString(nums) + " " + Arrays.toString(got));
        }
        System.out.println(ok + "/" + inputs.length + " ca đúng");

        // Đối chiếu: mọi mảng dài 1–6, giá trị 0–3, mà ô cuối với tới được
        build(new int[0]);
        System.out.println(good + "/" + total + " ca đúng (đối chiếu vét mọi đường nhảy)");
        System.out.println("Cho vòng lặp chạy tới ô cuối: sai " + wrong + "/" + total + " ca, [0] cho " + jumpToLast(new int[] {0}) + " thay vì 0");
        System.out.println("Luôn nhảy xa nhất từ chỗ đang đứng: sai " + wrongNow + "/" + total + " ca, [2,4,1,1,1,1] cho " + jumpFarthestNow(new int[] {2, 4, 1, 1, 1, 1}) + " thay vì 2");

        // Đo: n = 10000, mọi ô bằng 1000 (giới hạn lớn nhất của đề)
        int[] big = new int[10000];
        Arrays.fill(big, 1000);
        ops = 0;
        int a1 = jumpDP(big);
        long dp = ops;
        ops = 0;
        int a2 = jumpBFS(big);
        long bfs = ops;
        ops = 0;
        int a3 = jump(big);
        long greedy = ops;
        System.out.println("n = 10000, mọi ô 1000: " + a1 + "/" + a2 + "/" + a3 + " bước; DP " + dp + " lượt cập nhật, BFS " + bfs + " cạnh, lớp nhảy " + greedy + " vòng");
    }
}
