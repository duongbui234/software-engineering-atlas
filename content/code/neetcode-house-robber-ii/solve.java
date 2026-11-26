class Solve {
    interface RangeSolver {
        int solve(int[] nums, int start, int end);
    }

    static int rolling(int[] nums, int start, int end) {
        int twoBack = 0;
        int oneBack = 0;
        for (int i = start; i < end; i++) {
            int best = Math.max(oneBack, twoBack + nums[i]);
            twoBack = oneBack;
            oneBack = best;
        }
        return oneBack;
    }

    static int table(int[] nums, int start, int end) {
        int[] best = new int[end - start + 2];
        for (int i = start; i < end; i++) {
            int j = i - start;
            best[j + 2] = Math.max(best[j + 1], best[j] + nums[i]);
        }
        return best[best.length - 1];
    }

    static int brute(int[] nums, int i, int end) {
        if (i >= end) return 0;
        return Math.max(brute(nums, i + 1, end), nums[i] + brute(nums, i + 2, end));
    }

    static int rob(int[] nums, RangeSolver solve) {
        if (nums.length == 1) return nums[0];
        return Math.max(solve.solve(nums, 0, nums.length - 1), solve.solve(nums, 1, nums.length));
    }

    public static void main(String[] args) {
        int[][] nums = {
            {8},
            {0, 0, 0},
            {8, 11, 8},
            {9, 1, 1, 9},
            {4, 9, 1, 8, 3, 7},
            {10, 1},
        };
        int[] expected = {8, 0, 11, 10, 24, 10};
        int passed = 0;
        RangeSolver[] methods = {Solve::brute, Solve::table, Solve::rolling};
        for (int i = 0; i < nums.length; i++) {
            for (RangeSolver solve : methods) {
                if (rob(nums[i], solve) != expected[i]) throw new AssertionError(i);
                passed++;
            }
        }
        int[] longCase = new int[100];
        java.util.Arrays.fill(longCase, 3);
        RangeSolver[] linear = {Solve::table, Solve::rolling};
        for (RangeSolver solve : linear) {
            if (rob(longCase, solve) != 150) throw new AssertionError("ca dài");
            passed++;
        }
        System.out.printf("%d/%d ca đúng%n", passed, nums.length * 3 + 2);
    }
}
