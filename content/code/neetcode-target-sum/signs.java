import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

class Signs {
    static int enumerateSigns(int[] nums, int index, int target) {
        if (index == nums.length) return target == 0 ? 1 : 0;
        return enumerateSigns(nums,index+1,target-nums[index]) + enumerateSigns(nums,index+1,target+nums[index]);
    }

    static int countBySignedSum(int[] nums,int target) {
        Map<Integer,Integer> ways = Map.of(0,1);
        for (int x : nums) {
            var next = new HashMap<Integer,Integer>();
            for (var entry : ways.entrySet()) {
                next.merge(entry.getKey()+x, entry.getValue(), Integer::sum);
                next.merge(entry.getKey()-x, entry.getValue(), Integer::sum);
            }
            ways = next;
        }
        return ways.getOrDefault(target,0);
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

    record Case(int[] nums, int target, int want) {}

    public static void main(String[] args) {
        int[] ones=new int[16];
        Arrays.fill(ones,1);
        Case[] cases={
            new Case(new int[]{1,2,5},4,1), new Case(new int[]{0,0,2,3},1,4), new Case(new int[]{0,0,2,3},-1,4),
            new Case(new int[]{2,5},0,0), new Case(new int[]{2,5},8,0), new Case(new int[]{2,5},-8,0),
            new Case(new int[]{3,3,3,3},0,6), new Case(new int[]{1000},-1000,1), new Case(new int[]{0},0,2),
            new Case(new int[20],0,1048576), new Case(ones,0,12870),
        };
        for (Case c : cases) {
            if (countBySignedSum(c.nums(),c.target())!=c.want() || countBySubset(c.nums(),c.target())!=c.want() ||
                (c.nums().length<=16 && enumerateSigns(c.nums(),0,c.target())!=c.want())) throw new AssertionError(c);
        }
        System.out.printf("%d/%d ca đúng%n",cases.length,cases.length);
    }
}
