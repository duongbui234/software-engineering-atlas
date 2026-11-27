import java.util.Arrays;

class Capacity {
    static boolean canPartition(int[] nums) {
        int sum = Arrays.stream(nums).sum();
        if (sum%2!=0) return false;
        int goal = sum/2;
        boolean[] reachable = new boolean[goal+1];
        reachable[0] = true;
        for (int x : nums) {
            for (int s=goal;s>=x;s--) reachable[s] |= reachable[s-x];
        }
        return reachable[goal];
    }

    static int minCoins(int[] coins,int amount) {
        int[] best = new int[amount+1];
        Arrays.fill(best,amount+1);
        best[0] = 0;
        for (int coin : coins) {
            for (int s=coin;s<=amount;s++) best[s]=Math.min(best[s],best[s-coin]+1);
        }
        return best[amount] == amount+1 ? -1 : best[amount];
    }

    static int coinCombinations(int[] coins,int amount) {
        int[] ways = new int[amount+1];
        ways[0] = 1;
        for (int coin : coins) {
            for (int s=coin;s<=amount;s++) {
                ways[s] = (int)Math.min(Integer.MAX_VALUE, (long)ways[s]+ways[s-coin]);
            }
        }
        return ways[amount];
    }

    static int countBySubset(int[] nums, int target) {
        int sum = Arrays.stream(nums).sum();
        int twice = sum-target;
        if (Math.abs(target)>sum || twice%2!=0) return 0;
        int goal = twice/2;
        int[] ways = new int[goal+1];
        ways[0] = 1;
        for (int x : nums) {
            for (int s=goal;s>=x;s--) ways[s] += ways[s-x];
        }
        return ways[goal];
    }

    public static void main(String[] args) {
            int[] manyEvenCoins=new int[300];
            for(int i=0;i<299;i++) manyEvenCoins[i]=2*(i+1);
            manyEvenCoins[299]=4999;
            boolean[] checks={
                canPartition(new int[]{4,4,6,2}),
                !canPartition(new int[]{2,3,7}),
                minCoins(new int[]{1,4,6},8)==2,
                minCoins(new int[]{4,6},7)==-1,
                minCoins(new int[]{2147483647},0)==0,
                coinCombinations(new int[]{2,3,4},7)==2,
                coinCombinations(new int[]{4,6},0)==1,
                coinCombinations(manyEvenCoins,4999)==1,
                countBySubset(new int[]{0,0,2,3},-1)==4,
                countBySubset(new int[]{2,5},0)==0,
            };
            for (boolean ok : checks) if (!ok) throw new AssertionError();
            System.out.printf("%d/%d ca đúng%n",checks.length,checks.length);
        }
}
