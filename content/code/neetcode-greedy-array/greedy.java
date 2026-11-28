// Ga MISC-03: tham lam trên mảng, một lượt trái sang phải với một trạng thái nhỏ.
// Chạy: java greedy.java

import java.util.Objects;
import java.util.function.Supplier;

public class greedy {
    // Maximum Subarray (Kadane): tổng chạy âm thì bỏ, bắt đầu lại từ phần tử hiện tại.
    static int maxSubArray(int[] nums) {
        int run = nums[0]; // tổng của đoạn tốt nhất kết thúc tại i
        int best = nums[0]; // tốt nhất từ trước tới giờ
        for (int i = 1; i < nums.length; i++) {
            run = run < 0 ? nums[i] : run + nums[i]; // tiền tố âm chỉ kéo tổng xuống: bỏ nó
            best = Math.max(best, run);
        }
        return best;
    }

    // Jump Game: giữ chỗ xa nhất có thể tới; đứng ở ô ngoài tầm là kẹt.
    static boolean canJump(int[] nums) {
        int reach = 0;
        for (int i = 0; i < nums.length; i++) {
            if (i > reach) return false; // không ô nào trước đó nhảy tới được i
            reach = Math.max(reach, i + nums[i]);
        }
        return true;
    }

    // Jump Game II: quét theo lớp; hết lớp hiện tại thì nhảy thêm một bước.
    static int jump(int[] nums) {
        int jumps = 0;
        int end = 0; // ô cuối của lớp đang quét
        int far = 0; // chỗ xa nhất mà lớp kế tiếp tới được
        for (int i = 0; i < nums.length - 1; i++) {
            far = Math.max(far, i + nums[i]);
            if (i == end) { // đã quét hết lớp này
                jumps++;
                end = far;
            }
        }
        return jumps;
    }

    // Gas Station: bình hụt ở trạm i thì không điểm nào từ start tới i xuất phát được.
    static int canCompleteCircuit(int[] gas, int[] cost) {
        int total = 0, tank = 0, start = 0;
        for (int i = 0; i < gas.length; i++) {
            int diff = gas[i] - cost[i];
            total += diff;
            tank += diff;
            if (tank < 0) { // xuất phát lại từ trạm kế tiếp
                start = i + 1;
                tank = 0;
            }
        }
        return total < 0 ? -1 : start;
    }

    record Case(String name, Supplier<Object> run, Object want) {}

    public static void main(String[] args) {
        Case[] cases = {
            new Case("maxSubArray đoạn giữa", () -> maxSubArray(new int[]{2, -5, 4, -1, 3, -7, 2}), 6),
            new Case("maxSubArray toàn âm", () -> maxSubArray(new int[]{-3, -1, -2}), -1),
            new Case("maxSubArray một phần tử", () -> maxSubArray(new int[]{5}), 5),
            new Case("maxSubArray toàn dương", () -> maxSubArray(new int[]{1, 2, 3}), 6),
            new Case("maxSubArray vượt qua số âm", () -> maxSubArray(new int[]{-1, 4, -2, 4, -10, 3}), 6),
            new Case("canJump kẹt ở số 0", () -> canJump(new int[]{2, 0, 1, 0, 3}), false),
            new Case("canJump tới đích", () -> canJump(new int[]{1, 2, 0, 1, 0}), true),
            new Case("canJump một ô", () -> canJump(new int[]{0}), true),
            new Case("canJump đứng yên", () -> canJump(new int[]{0, 1}), false),
            new Case("canJump kẹt giữa đường", () -> canJump(new int[]{3, 0, 0, 1, 0, 2}), false),
            new Case("jump ba bước", () -> jump(new int[]{1, 2, 0, 1, 0}), 3),
            new Case("jump hai bước", () -> jump(new int[]{3, 1, 1, 1, 1}), 2),
            new Case("jump một ô", () -> jump(new int[]{0}), 0),
            new Case("jump một bước", () -> jump(new int[]{4, 1, 1, 1, 1}), 1),
            new Case("jump từng ô", () -> jump(new int[]{1, 1, 1, 1}), 3),
            new Case("gas không đủ xăng", () -> canCompleteCircuit(new int[]{2, 3, 4}, new int[]{3, 4, 3}), -1),
            new Case("gas xuất phát ở trạm 3", () -> canCompleteCircuit(new int[]{3, 1, 2, 5}, new int[]{2, 4, 3, 1}), 3),
            new Case("gas một trạm", () -> canCompleteCircuit(new int[]{5}, new int[]{4}), 0),
            new Case("gas tổng bằng 0", () -> canCompleteCircuit(new int[]{1, 4, 1}, new int[]{2, 1, 3}), 1),
        };
        int ok = 0;
        for (Case c : cases) {
            Object got = c.run().get();
            if (Objects.equals(got, c.want())) ok++;
            else System.out.println("SAI " + c.name() + ": được " + got + ", cần " + c.want());
        }
        System.out.println(ok + "/" + cases.length + " ca đúng");
    }
}
