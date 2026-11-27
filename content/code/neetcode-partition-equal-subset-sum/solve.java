import java.math.BigInteger;
import java.util.Arrays;

class Solve {
    static boolean brute(int[] nums, int target, int i) {
        if (target == 0) return true;
        if (target < 0 || i == nums.length) return false;
        return brute(nums, target - nums[i], i + 1) || brute(nums, target, i + 1);
    }

    static boolean table(int[] nums, int target) {
        boolean[][] rows = new boolean[nums.length + 1][target + 1];
        rows[0][0] = true;
        for (int i = 0; i < nums.length; i++) {
            int x = nums[i];
            for (int sum = 0; sum <= target; sum++) {
                rows[i + 1][sum] = rows[i][sum] || (sum >= x && rows[i][sum - x]);
            }
        }
        return rows[nums.length][target];
    }

    static boolean descending(int[] nums, int target) {
        boolean[] reachable = new boolean[target + 1];
        reachable[0] = true;
        for (int x : nums) {
            for (int sum = target; sum >= x; sum--) {
                reachable[sum] |= reachable[sum - x];
            }
        }
        return reachable[target];
    }

    static boolean bitset(int[] nums, int target) {
        BigInteger goal = BigInteger.ONE.shiftLeft(target);
        BigInteger mask = goal.shiftLeft(1).subtract(BigInteger.ONE);
        BigInteger reachable = BigInteger.ONE;
        for (int x : nums) {
            reachable = reachable.or(reachable.shiftLeft(x)).and(mask);
        }
        return reachable.testBit(target);
    }

    public static void main(String[] args) {
        int[] limits = new int[200];
        Arrays.fill(limits, 100);
        int[] impossible = limits.clone();
        impossible[199] = 98;
        int[][] cases = {
            {8},
            {2, 2},
            {3, 6, 7, 10},
            {2, 3, 7},
            {1, 4, 8},
            {2, 2, 2},
            {31, 31},
            {32, 32},
            {33, 33},
            {31, 2, 30, 3},
            {32, 1, 17, 16},
            {33, 31, 30, 34},
            {63, 2, 33, 32},
            {100, 40, 40},
            limits,
            impossible,
        };
        boolean[] expected = {
            false, true, true, false, false, false, true, true,
            true, true, true, true, true, false, true, false,
        };
        for (int i = 0; i < cases.length; i++) {
            int[] nums = cases[i];
            int total = Arrays.stream(nums).sum();
            boolean even = total % 2 == 0;
            int target = total / 2;
            if ((even && table(nums, target)) != expected[i]
                    || (even && descending(nums, target)) != expected[i]
                    || (even && bitset(nums, target)) != expected[i]
                    || (nums.length < 20 && (even && brute(nums, target, 0)) != expected[i])) {
                throw new AssertionError(Arrays.toString(nums));
            }
        }
        System.out.printf("%d/%d ca đúng%n", cases.length, cases.length);
    }
}
