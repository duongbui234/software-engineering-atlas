class Recurrences {
    static int countStairs(int n) {
        int older = 1, latest = 1;
        for (int i = 2; i <= n; i++) {
            int next = older + latest;
            older = latest;
            latest = next;
        }
        return latest;
    }

    static int cheapestStairs(int[] cost) {
        int older = 0, latest = 0;
        for (int i = 2; i <= cost.length; i++) {
            int next = Math.min(latest + cost[i-1], older + cost[i-2]);
            older = latest;
            latest = next;
        }
        return latest;
    }

    static int robRange(int[] nums, int start, int end) {
        int older = 0, latest = 0;
        for (int i = start; i < end; i++) {
            int next = Math.max(latest, older + nums[i]);
            older = latest;
            latest = next;
        }
        return latest;
    }

    static int robRing(int[] nums) {
        if (nums.length == 1) return nums[0];
        return Math.max(robRange(nums, 0, nums.length-1), robRange(nums, 1, nums.length));
    }

    static int decode(String s) {
        int older = 1, latest = s.charAt(0) == '0' ? 0 : 1;
        for (int i = 1; i < s.length(); i++) {
            int pair = (s.charAt(i-1)-'0')*10 + s.charAt(i)-'0';
            long next = (s.charAt(i) == '0' ? 0L : latest) + (pair >= 10 && pair <= 26 ? older : 0);
            older = latest;
            latest = (int) Math.min(next, Integer.MAX_VALUE);
        }
        return latest;
    }

    static int maxProduct(int[] nums) {
        int high = nums[0], low = nums[0], best = nums[0];
        for (int i = 1; i < nums.length; i++) {
            int x = nums[i];
            int withHigh = x * high, withLow = x * low;
            high = Math.max(x, Math.max(withHigh, withLow));
            low = Math.min(x, Math.min(withHigh, withLow));
            best = Math.max(best, high);
        }
        return best;
    }

    public static void main(String[] args) {
        boolean[] checks = {
            countStairs(6) == 13,
            cheapestStairs(new int[]{6,2,8,1}) == 3,
            robRange(new int[]{4,1,1,7,2},0,5) == 11,
            robRing(new int[]{9,1,1,9}) == 10,
            robRing(new int[]{7}) == 7,
            decode("127") == 2,
            decode("1".repeat(60) + "00") == 0,
            decode("100") == 0,
            maxProduct(new int[]{-3,2,-4}) == 24,
            maxProduct(new int[]{-2,0,-1}) == 0,
        };
        for (boolean ok : checks) {
            if (!ok) throw new AssertionError();
        }
        System.out.printf("%d/%d ca đúng%n", checks.length, checks.length);
    }
}
