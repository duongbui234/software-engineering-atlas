// Combination Sum (LeetCode 39): liệt kê mọi tổ hợp, mỗi số được dùng lại nhiều lần.
import java.util.*;

public class combos {
    static int calls = 0;

    // Quay lui không sắp xếp, không cắt nhánh: đi tới khi phần còn lại âm.
    static List<List<Integer>> combinationSumPlain(int[] candidates, int target) {
        List<List<Integer>> out = new ArrayList<>();
        plainDfs(candidates, 0, target, new ArrayList<>(), out);
        return out;
    }

    static void plainDfs(int[] c, int start, int remain, List<Integer> path, List<List<Integer>> out) {
        calls++;
        if (remain == 0) {
            out.add(new ArrayList<>(path)); // chép ra, path còn bị sửa tiếp
            return;
        }
        if (remain < 0) return;
        for (int i = start; i < c.length; i++) {
            path.add(c[i]);
            plainDfs(c, i, remain - c[i], path, out); // vẫn là i: được dùng lại số này
            path.remove(path.size() - 1);
        }
    }

    // Sắp xếp rồi cắt nhánh: số đầu tiên lớn hơn phần còn lại thì mọi số sau cũng vậy.
    static List<List<Integer>> combinationSum(int[] candidates, int target) {
        int[] nums = candidates.clone();
        Arrays.sort(nums);
        List<List<Integer>> out = new ArrayList<>();
        dfs(nums, 0, target, new ArrayList<>(), out);
        return out;
    }

    static void dfs(int[] nums, int start, int remain, List<Integer> path, List<List<Integer>> out) {
        calls++;
        if (remain == 0) {
            out.add(new ArrayList<>(path));
            return;
        }
        for (int i = start; i < nums.length; i++) {
            if (nums[i] > remain) break;
            path.add(nums[i]);
            dfs(nums, i, remain - nums[i], path, out); // vẫn là i: được dùng lại số này
            path.remove(path.size() - 1);
        }
    }

    // DP đếm số tổ hợp (như Coin Change II): chỉ ra con số, không ra danh sách.
    static int countWays(int[] candidates, int target) {
        int[] ways = new int[target + 1];
        ways[0] = 1;
        for (int c : candidates)
            for (int t = c; t <= target; t++) ways[t] += ways[t - c];
        return ways[target];
    }

    // Vét mọi vector số lần dùng (0..target/c cho từng số), giữ vector có tổng đúng.
    static List<List<Integer>> brute(int[] candidates, int target) {
        List<List<Integer>> out = new ArrayList<>();
        gen(candidates, target, 0, new int[candidates.length], out);
        return out;
    }

    static void gen(int[] c, int target, int i, int[] counts, List<List<Integer>> out) {
        if (i == c.length) {
            int sum = 0;
            for (int j = 0; j < c.length; j++) sum += counts[j] * c[j];
            if (sum == target) {
                List<Integer> combo = new ArrayList<>();
                for (int j = 0; j < c.length; j++)
                    for (int r = 0; r < counts[j]; r++) combo.add(c[j]);
                out.add(combo);
            }
            return;
        }
        for (int k = 0; k <= target / c[i]; k++) {
            counts[i] = k;
            gen(c, target, i + 1, counts, out);
        }
        counts[i] = 0;
    }

    static String norm(List<List<Integer>> combos) {
        List<String> keys = new ArrayList<>();
        for (List<Integer> c : combos) {
            List<Integer> s = new ArrayList<>(c);
            Collections.sort(s);
            StringBuilder b = new StringBuilder();
            for (int v : s) b.append(b.length() > 0 ? "," : "").append(v);
            keys.add(b.toString());
        }
        Collections.sort(keys);
        return String.join("|", keys);
    }

    static List<List<Integer>> lists(int[][] rows) {
        List<List<Integer>> out = new ArrayList<>();
        for (int[] r : rows) {
            List<Integer> l = new ArrayList<>();
            for (int v : r) l.add(v);
            out.add(l);
        }
        return out;
    }

    public static void main(String[] args) {
        Object[][] cases = {
            {new int[]{4, 5, 9}, 9, new int[][]{{4, 5}, {9}}},
            {new int[]{3, 4, 7}, 10, new int[][]{{3, 3, 4}, {3, 7}}},
            {new int[]{6}, 4, new int[][]{}},
            {new int[]{8, 2, 5}, 10, new int[][]{{2, 2, 2, 2, 2}, {2, 8}, {5, 5}}},
            {new int[]{2, 3}, 1, new int[][]{}},
            {new int[]{40}, 40, new int[][]{{40}}},
            {new int[]{39, 2}, 3, new int[][]{}},
        };
        int ok = 0;
        for (Object[] c : cases) {
            int[] cand = (int[]) c[0];
            int target = (int) c[1];
            String want = norm(lists((int[][]) c[2]));
            List<List<Integer>> got = combinationSum(cand, target);
            if (norm(combinationSumPlain(cand, target)).equals(want) && norm(got).equals(want) && got.size() == countWays(cand, target)) ok++;
            else System.out.println("sai ở " + Arrays.toString(cand) + " " + target + " " + got);
        }
        System.out.println(ok + "/" + cases.length + " ca đúng");

        int[] pool = {2, 3, 4, 5, 6, 7};
        int good = 0, total = 0;
        for (int mask = 1; mask < 1 << pool.length; mask++) {
            List<Integer> picked = new ArrayList<>();
            for (int i = 0; i < pool.length; i++) if ((mask >> i & 1) == 1) picked.add(pool[i]);
            int[] cand = picked.stream().mapToInt(Integer::intValue).toArray();
            for (int target = 1; target < 15; target++) {
                total++;
                String want = norm(brute(cand, target));
                List<List<Integer>> a = combinationSum(cand, target);
                if (norm(a).equals(want) && norm(combinationSumPlain(cand, target)).equals(want) && a.size() == countWays(cand, target)) good++;
                else System.out.println("sai ở " + Arrays.toString(cand) + " " + target);
            }
        }
        System.out.println(good + "/" + total + " ca đúng (đối chiếu vét số lần dùng)");

        int[] primes = {2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37};
        calls = 0;
        combinationSumPlain(primes, 40);
        int plainCalls = calls;
        calls = 0;
        int found = combinationSum(primes, 40).size();
        System.out.println("12 số nguyên tố tới 37, target 40: không cắt nhánh " + plainCalls + " lượt gọi, sắp xếp + cắt nhánh " + calls + " lượt gọi, " + found + " tổ hợp");
    }
}
