import java.util.Arrays;

class MinCoins {
    static int minCoins(int[] coins, int amount) {
        int impossible = amount + 1;
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, impossible);
        dp[0] = 0;

        for (int coin : coins) {
            for (int sum = coin; sum <= amount; sum++) {
                dp[sum] = Math.min(dp[sum], dp[sum - coin] + 1);
            }
        }
        return dp[amount] == impossible ? -1 : dp[amount];
    }

    static int byAmount(int[] coins, int amount) {
        int impossible = amount + 1;
        int[] dp = new int[amount + 1];
        for (int sum = 1; sum <= amount; sum++) {
            dp[sum] = impossible;
            for (int coin : coins) {
                if (coin <= sum) dp[sum] = Math.min(dp[sum], dp[sum - coin] + 1);
            }
        }
        return dp[amount] == impossible ? -1 : dp[amount];
    }

    static int visit(int[] coins, int remaining, int impossible, int[] memo, int[] calls) {
        calls[0]++;
        if (remaining == 0) return 0;
        if (memo != null && memo[remaining] != -1) return memo[remaining];
        int best = impossible;
        for (int coin : coins) {
            if (coin <= remaining) {
                best = Math.min(best, visit(coins, remaining - coin, impossible, memo, calls) + 1);
            }
        }
        if (memo != null) memo[remaining] = best;
        return best;
    }

    record Search(int value, int calls) {}

    static Search search(int[] coins, int amount, boolean useMemo) {
        int[] memo = useMemo ? new int[amount + 1] : null;
        if (memo != null) Arrays.fill(memo, -1);
        int[] calls = {0};
        int best = visit(coins, amount, amount + 1, memo, calls);
        return new Search(best == amount + 1 ? -1 : best, calls[0]);
    }

    record Case(int[] coins, int amount, int want) {}

    public static void main(String[] args) {
        Case[] cases = {
            new Case(new int[]{4, 7}, 14, 2),
            new Case(new int[]{4, 7}, 13, -1),
            new Case(new int[]{1, 5, 7}, 10, 2),
            new Case(new int[]{1}, 10000, 10000),
            new Case(new int[]{2147483647, 3}, 9, 3),
            new Case(new int[]{8, 9}, 0, 0),
            new Case(new int[]{4, 6}, 7, -1),
            new Case(new int[]{9, 4}, 12, 3),
            new Case(new int[]{14, 21}, 28, 2),
            new Case(new int[]{10, 15, 25}, 30, 2),
        };
        for (Case c : cases) {
            if (minCoins(c.coins, c.amount) != c.want || byAmount(c.coins, c.amount) != c.want) {
                throw new AssertionError("DP sai");
            }
            if (c.amount <= 30
                && (search(c.coins, c.amount, false).value != c.want
                    || search(c.coins, c.amount, true).value != c.want)) {
                throw new AssertionError("Đệ quy sai");
            }
        }
        System.out.printf("%d/%d ca đúng%n", cases.length, cases.length);
        Search brute = search(new int[]{4, 6, 9}, 36, false);
        Search memoized = search(new int[]{4, 6, 9}, 36, true);
        if (brute.value != 4 || memoized.value != brute.value) throw new AssertionError("Ca đo sai");
        System.out.printf("A=36: vét cạn %d, memo %d lượt gọi%n", brute.calls, memoized.calls);
    }
}
