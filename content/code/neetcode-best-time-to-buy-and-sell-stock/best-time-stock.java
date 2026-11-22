// LeetCode 121, Best Time to Buy and Sell Stock: ba cách và test.
// Chạy: java best-time-stock.java

class BestTimeStock {
    static int bruteForce(int[] prices) {
        int best = 0;
        for (int i = 0; i < prices.length; i++)
            for (int j = i + 1; j < prices.length; j++) best = Math.max(best, prices[j] - prices[i]);
        return best;
    }

    static int runningMin(int[] prices) {
        int minSoFar = Integer.MAX_VALUE, best = 0;
        for (int p : prices) {
            // ngày đầu: p - MAX_VALUE ra số âm (không tràn vì p ≥ 0), nên best vẫn là 0
            best = Math.max(best, p - minSoFar);
            minSoFar = Math.min(minSoFar, p);
        }
        return best;
    }

    static int twoPointers(int[] prices) {
        int left = 0, best = 0;
        for (int right = 1; right < prices.length; right++) {
            if (prices[right] < prices[left]) left = right;
            else best = Math.max(best, prices[right] - prices[left]);
        }
        return best;
    }

    public static void main(String[] args) {
        int[][] in = {{7, 1, 5, 3, 6, 4}, {7, 6, 4, 3, 1}, {2, 4, 1}, {1}, {3, 3, 3}, {2, 1, 2, 1, 0, 1, 2}};
        int[] want = {5, 0, 2, 0, 0, 2};
        for (String name : new String[] {"bruteForce", "runningMin", "twoPointers"}) {
            int ok = 0;
            for (int i = 0; i < in.length; i++) {
                int got = switch (name) {
                    case "bruteForce" -> bruteForce(in[i]);
                    case "runningMin" -> runningMin(in[i]);
                    default -> twoPointers(in[i]);
                };
                if (got == want[i]) ok++;
            }
            System.out.printf("%-12s %d/%d ca đúng%n", name, ok, in.length);
        }
    }
}
