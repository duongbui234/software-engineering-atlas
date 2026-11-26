import java.util.Arrays;
import java.util.function.IntBinaryOperator;
import java.util.function.IntUnaryOperator;

class Stairs {
    static int brute(int i, IntUnaryOperator add, IntBinaryOperator choose, int base) {
        if (i < 2) return base;
        return choose.applyAsInt(brute(i-1, add, choose, base) + add.applyAsInt(i-1),
                                 brute(i-2, add, choose, base) + add.applyAsInt(i-2));
    }

    static void check(int n, IntUnaryOperator add, IntBinaryOperator choose, int base, int expected, boolean small) {
        if (small && brute(n, add, choose, base) != expected) throw new AssertionError();
        int[] dp = new int[n+1];
        dp[0] = dp[1] = base;
        int twoBack = base;
        int oneBack = base;
        for (int i = 2; i <= n; i++) {
            dp[i] = choose.applyAsInt(dp[i-1] + add.applyAsInt(i-1), dp[i-2] + add.applyAsInt(i-2));
            int next = choose.applyAsInt(oneBack + add.applyAsInt(i-1), twoBack + add.applyAsInt(i-2));
            twoBack = oneBack;
            oneBack = next;
        }
        if (dp[n] != expected || oneBack != expected) throw new AssertionError();
    }

    public static void main(String[] args) {
        int[] large = new int[1000];
        Arrays.fill(large, 999);
        int[][] inputs = {{6,2,8,1},{19,4},{0,0,0,0},{5,0,9,0,3},large};
        int[] expected = {3,4,0,0,499500};
        for (int i = 0; i < inputs.length; i++) {
            int[] cost = inputs[i];
            check(cost.length, j -> cost[j], Math::min, 0, expected[i], cost.length <= 18);
        }
        System.out.printf("%d/%d ca đúng%n", inputs.length, inputs.length);
    }
}
