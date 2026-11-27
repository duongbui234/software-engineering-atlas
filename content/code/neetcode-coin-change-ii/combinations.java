class Combinations {
    static long enumerate(int amount, int[] coins, int index) {
        if (index == coins.length) return amount == 0 ? 1 : 0;
        long ways = 0;
        for (int rest = amount; rest >= 0; rest -= coins[index]) {
            ways += enumerate(rest, coins, index + 1);
        }
        return ways;
    }

    static int countTable(int amount, int[] coins) {
        int[][] rows = new int[coins.length + 1][];
        rows[0] = new int[amount + 1];
        rows[0][0] = 1;
        for (int i = 0; i < coins.length; i++) {
            int coin = coins[i];
            int[] previous = rows[i];
            int[] current = previous.clone();
            for (int total = coin; total <= amount; total++) {
                current[total] = (int) Math.min(Integer.MAX_VALUE,
                    (long) previous[total] + current[total - coin]);
            }
            rows[i + 1] = current;
        }
        return rows[coins.length][amount];
    }

    static int countCombinations(int amount, int[] coins) {
        int[] ways = new int[amount + 1];
        ways[0] = 1;
        for (int coin : coins) {
            for (int total = coin; total <= amount; total++) {
                ways[total] = (int) Math.min(Integer.MAX_VALUE,
                    (long) ways[total] + ways[total - coin]);
            }
        }
        return ways[amount];
    }

    record Test(int amount, int[] coins, int expected) {}

    public static void main(String[] args) {
        int[] many = new int[300];
        for (int i = 0; i < 299; i++) many[i] = 2 * (i + 1);
        many[299] = 4999;
        Test[] tests = {
            new Test(8, new int[]{2, 3, 5}, 3),
            new Test(5, new int[]{3, 2}, 1),
            new Test(10, new int[]{5, 2, 3}, 4),
            new Test(7, new int[]{6, 4}, 0),
            new Test(16, new int[]{4}, 1),
            new Test(0, new int[]{7, 11}, 1),
            new Test(2, new int[]{3, 5000}, 0),
            new Test(4, new int[]{2, 1}, 3),
            new Test(120, new int[]{6, 1, 4, 9, 17}, 4131),
            new Test(4999, many, 1),
        };
        for (Test t : tests) {
            if (countTable(t.amount(), t.coins()) != t.expected()
                || countCombinations(t.amount(), t.coins()) != t.expected()
                || (t.amount() <= 20 && enumerate(t.amount(), t.coins(), 0) != t.expected())) {
                throw new AssertionError(t);
            }
        }
        System.out.printf("%d/%d ca đúng%n", tests.length, tests.length);
    }
}
