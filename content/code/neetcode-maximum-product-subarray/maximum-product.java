class MaximumProduct {
    static int maximumProduct(int[] values) {
        int high = values[0], low = values[0], best = values[0];
        for (int index = 1; index < values.length; index++) {
            int x = values[index];
            int extendHigh = high * x, extendLow = low * x;
            high = Math.max(x, Math.max(extendHigh, extendLow));
            low = Math.min(x, Math.min(extendHigh, extendLow));
            best = Math.max(best, high);
        }
        return best;
    }

    static int maximumByIntervals(int[] nums) {
        int best = nums[0];
        for (int left = 0; left < nums.length; left++) {
            int product = 1;
            for (int right = left; right < nums.length; right++) {
                product *= nums[right];
                best = Math.max(best, product);
            }
        }
        return best;
    }

    public static void main(String[] args) {
        check(maximumProduct(new int[]{-2, 3, -4}), 24);
        check(maximumByIntervals(new int[]{-2, 3, -4}), 24);
        check(maximumProduct(new int[]{-3}), -3);
        check(maximumByIntervals(new int[]{-3}), -3);
        check(maximumProduct(new int[]{-2, -3, -4}), 12);
        check(maximumByIntervals(new int[]{-2, -3, -4}), 12);
        check(maximumProduct(new int[]{0, -2, 0, -3, -4}), 12);
        check(maximumByIntervals(new int[]{0, -2, 0, -3, -4}), 12);
        check(maximumProduct(new int[]{0, -3, 0}), 0);
        check(maximumByIntervals(new int[]{0, -3, 0}), 0);
        check(maximumProduct(new int[]{1}), 1);
        check(maximumByIntervals(new int[]{1}), 1);
        check(maximumProduct(new int[]{2, 3, 0, -2, -4}), 8);
        check(maximumByIntervals(new int[]{2, 3, 0, -2, -4}), 8);
        System.out.println("7/7 ca đúng");
    }

    static void check(int got, int want) {
        if (got != want) throw new AssertionError("want " + want + ", got " + got);
    }
}
