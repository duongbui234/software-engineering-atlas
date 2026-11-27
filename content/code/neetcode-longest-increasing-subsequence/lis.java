class Lis {
    static int lisByBrute(int[] nums, int i, int last) {
        if (i == nums.length) return 0;
        int skip = lisByBrute(nums, i + 1, last);
        if (last < 0 || nums[last] < nums[i]) {
            return Math.max(skip, 1 + lisByBrute(nums, i + 1, i));
        }
        return skip;
    }

    static int lisByEndpoint(int[] nums) {
        int[] longest = new int[nums.length];
        int best = 0;
        for (int i = 0; i < nums.length; i++) {
            longest[i] = 1;
            for (int j = 0; j < i; j++) {
                if (nums[j] < nums[i]) longest[i] = Math.max(longest[i], longest[j] + 1);
            }
            best = Math.max(best, longest[i]);
        }
        return best;
    }

    static int lisByTails(int[] nums) {
        int[] tails = new int[nums.length];
        int size = 0;
        for (int x : nums) {
            int lo = 0, hi = size;
            while (lo < hi) {
                int mid = lo + (hi - lo) / 2;
                if (tails[mid] < x) lo = mid + 1;
                else hi = mid;
            }
            tails[lo] = x;
            if (lo == size) size++;
        }
        return size;
    }

    record Case(int[] nums, int want) {}

    public static void main(String[] args) {
        int[] ascending = new int[2500], descending = new int[2500];
        for (int i = 0; i < ascending.length; i++) {
            ascending[i] = i - 1250;
            descending[i] = 1249 - i;
        }
        Case[] cases = {
            new Case(new int[]{},0),new Case(new int[]{-10000},1),
            new Case(new int[]{4,8,1,6,9,2},3),new Case(new int[]{1,4,9,-1},3),
            new Case(new int[]{3,3,3,3},1),new Case(new int[]{8,6,4,2},1),
            new Case(new int[]{-10000,-2,0,10000},4),new Case(new int[]{1,3,3,8},3),
            new Case(new int[]{-3,-1,-2,0},3),new Case(new int[]{2,6,3,4,1,5},4),
            new Case(ascending,2500),new Case(descending,1),
        };
        for (Case c : cases) {
            if (lisByEndpoint(c.nums()) != c.want() || lisByTails(c.nums()) != c.want() ||
                (c.nums().length <= 10 && lisByBrute(c.nums(),0,-1) != c.want())) throw new AssertionError(c);
        }
        System.out.printf("%d/%d ca đúng%n", cases.length,cases.length);
    }
}
