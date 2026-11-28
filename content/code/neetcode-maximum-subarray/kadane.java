// Maximum Subarray (LeetCode 53): vét O(n³), vét O(n²), chia để trị, tổng tiền tố, Kadane
// Chạy: java kadane.java        (thêm tham số bench để đo thời gian)
import java.util.*;
import java.util.function.IntSupplier;

public class kadane {
    static long adds = 0;

    // Cách chính: Kadane. Tổng đang mang mà âm thì bỏ, bắt đầu lại từ phần tử hiện tại
    static int maxSubArray(int[] nums) {
        int cur = nums[0]; // tổng tốt nhất của đoạn kết thúc tại i
        int best = nums[0];
        for (int i = 1; i < nums.length; i++) {
            cur = cur < 0 ? nums[i] : cur + nums[i]; // phần đầu âm chỉ kéo tổng xuống
            if (cur > best) best = cur;
        }
        return best;
    }

    // Kadane kèm biên: nhớ chỗ bắt đầu lại, chép biên mỗi khi phá kỷ lục
    static int[] maxSubArrayBounds(int[] nums) {
        int cur = nums[0], best = nums[0];
        int start = 0, lo = 0, hi = 0;
        for (int i = 1; i < nums.length; i++) {
            if (cur < 0) {
                cur = nums[i];
                start = i; // đoạn mới bắt đầu tại i
            } else {
                cur += nums[i];
            }
            if (cur > best) {
                best = cur;
                lo = start;
                hi = i;
            }
        }
        return new int[]{best, lo, hi};
    }

    // Tổng tiền tố: đoạn i..j có tổng P[j+1] - P[i], nên trừ đi tiền tố nhỏ nhất đứng trước
    static int maxSubArrayPrefix(int[] nums) {
        int prefix = 0, minPrefix = 0; // P[0] = 0: tiền tố rỗng
        int best = Integer.MIN_VALUE;
        for (int x : nums) {
            prefix += x;
            best = Math.max(best, prefix - minPrefix);
            minPrefix = Math.min(minPrefix, prefix);
        }
        return best;
    }

    // Chia để trị: đáp án nằm hẳn bên trái, hẳn bên phải, hoặc vắt qua điểm giữa
    static int maxSubArrayDivide(int[] nums) {
        return solve(nums, 0, nums.length - 1);
    }

    static int solve(int[] nums, int lo, int hi) {
        if (lo == hi) return nums[lo];
        int mid = (lo + hi) >>> 1;
        int sum = 0, leftBest = Integer.MIN_VALUE; // tổng lớn nhất của đoạn kết thúc tại mid
        for (int i = mid; i >= lo; i--) {
            sum += nums[i];
            leftBest = Math.max(leftBest, sum);
        }
        sum = 0;
        int rightBest = Integer.MIN_VALUE; // tổng lớn nhất của đoạn bắt đầu tại mid + 1
        for (int i = mid + 1; i <= hi; i++) {
            sum += nums[i];
            rightBest = Math.max(rightBest, sum);
        }
        return Math.max(Math.max(solve(nums, lo, mid), solve(nums, mid + 1, hi)), leftBest + rightBest);
    }

    // Vét O(n²): cố định điểm đầu i, cộng dồn sang phải
    static int maxSubArrayQuadratic(int[] nums) {
        int best = Integer.MIN_VALUE;
        long count = 0;
        for (int i = 0; i < nums.length; i++) {
            int sum = 0;
            for (int j = i; j < nums.length; j++) {
                sum += nums[j];
                count++;
                if (sum > best) best = sum;
            }
        }
        adds += count;
        return best;
    }

    // Trọng tài O(n³): cộng lại từ đầu mọi đoạn i..j, không dùng chung dòng nào với các cách trên
    static int maxSubArrayCubic(int[] nums) {
        int best = Integer.MIN_VALUE;
        for (int i = 0; i < nums.length; i++) {
            for (int j = i; j < nums.length; j++) {
                int sum = 0;
                for (int k = i; k <= j; k++) sum += nums[k];
                best = Math.max(best, sum);
            }
        }
        return best;
    }

    // Bản sai: khởi tạo best = 0, coi như được chọn đoạn rỗng
    static int maxSubArrayZeroInit(int[] nums) {
        int cur = 0, best = 0;
        for (int x : nums) {
            cur = Math.max(0, cur + x);
            best = Math.max(best, cur);
        }
        return best;
    }

    static boolean check(int[] nums, int expected) {
        int[] b = maxSubArrayBounds(nums);
        int best = b[0], lo = b[1], hi = b[2];
        if (lo < 0 || lo > hi || hi >= nums.length) return false;
        int sum = 0;
        for (int k = lo; k <= hi; k++) sum += nums[k];
        if (best != expected || sum != best) return false;
        int[] answers = {maxSubArray(nums), maxSubArrayPrefix(nums), maxSubArrayDivide(nums), maxSubArrayQuadratic(nums), maxSubArrayCubic(nums)};
        for (int a : answers) if (a != expected) return false;
        return true;
    }

    // Sinh số giả ngẫu nhiên MINSTD, để bảy ngôn ngữ cùng sinh một dãy
    static long seed = 2026;

    static int next() {
        seed = seed * 48271 % 2147483647;
        return (int) seed;
    }

    static String timed(IntSupplier f, int reps) {
        long t = System.nanoTime();
        for (int r = 0; r < reps; r++) f.getAsInt();
        return String.format(Locale.ROOT, "%.3f", (System.nanoTime() - t) / 1e6 / reps);
    }

    public static void main(String[] args) {
        Object[][] cases = {
            {new int[]{7}, 7},
            {new int[]{-4}, -4},
            {new int[]{-3, -1, -2}, -1},
            {new int[]{0, 0, 0}, 0},
            {new int[]{3, -2, 5, -1}, 6},
            {new int[]{2, -8, 3, -2, 4, -10}, 5},
            {new int[]{-1, 6, -7, 5, 3, -2}, 8},
            {new int[]{10000, 10000, -1, 10000}, 29999},
            {new int[]{-10000, -10000, -10000}, -10000},
        };
        int ok = 0;
        for (Object[] c : cases) {
            if (check((int[]) c[0], (Integer) c[1])) ok++;
            else System.out.println("sai ở " + Arrays.toString((int[]) c[0]));
        }
        System.out.println(ok + "/" + cases.length + " ca đúng");

        // Đối chiếu: 3000 mảng ngẫu nhiên dài 1–12, giá trị −10..10, so với trọng tài O(n³)
        int good = 0, rounds = 3000;
        for (int r = 0; r < rounds; r++) {
            int n = 1 + next() % 12;
            int[] nums = new int[n];
            for (int k = 0; k < n; k++) nums[k] = next() % 21 - 10;
            if (check(nums, maxSubArrayCubic(nums))) good++;
        }
        System.out.println(good + "/" + rounds + " ca đúng (đối chiếu vét O(n³))");

        int[] neg = {-3, -1, -2};
        System.out.println("Khởi tạo best = 0 với [-3,-1,-2]: ra " + maxSubArrayZeroInit(neg) + ", đúng là " + maxSubArray(neg));

        // Phép đo: n = 10000, giá trị −10000..10000
        int[] big = new int[10000];
        for (int k = 0; k < big.length; k++) big[k] = next() % 20001 - 10000;
        adds = 0;
        int slow = maxSubArrayQuadratic(big);
        int fast = maxSubArray(big);
        System.out.println("n = " + big.length + ": O(n²) cộng " + adds + " lần, Kadane " + big.length + " lần, cùng ra " + (slow == fast ? String.valueOf(fast) : "KHÁC NHAU"));

        if (Arrays.asList(args).contains("bench")) {
            // chạy cách nhanh nhiều lượt rồi chia, vì một lượt Kadane ngắn hơn độ phân giải của đồng hồ
            System.out.println("thời gian mỗi lượt: O(n²) " + timed(() -> maxSubArrayQuadratic(big), 3)
                + " ms, chia để trị " + timed(() -> maxSubArrayDivide(big), 100)
                + " ms, Kadane " + timed(() -> maxSubArray(big), 1000) + " ms");
        }
    }
}
