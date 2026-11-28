// Combination Sum II (LeetCode 40): mỗi vị trí dùng tối đa một lần, mảng có thể có số trùng.
import java.util.*;

public class once {
    static int calls = 0;

    // Sắp xếp, bỏ số trùng ở cùng một tầng, cắt nhánh khi số đã lớn hơn phần còn lại.
    static List<List<Integer>> combinationSum2(int[] candidates, int target) {
        int[] nums = candidates.clone();
        Arrays.sort(nums);
        List<List<Integer>> out = new ArrayList<>();
        dfs(nums, 0, target, new ArrayList<>(), out);
        return out;
    }

    static void dfs(int[] nums, int start, int remain, List<Integer> path, List<List<Integer>> out) {
        calls++;
        if (remain == 0) {
            out.add(new ArrayList<>(path)); // chép ra, path còn bị sửa tiếp
            return;
        }
        for (int i = start; i < nums.length; i++) {
            if (i > start && nums[i] == nums[i - 1]) continue; // cùng tầng đã thử giá trị này rồi
            if (nums[i] > remain) break;
            path.add(nums[i]);
            dfs(nums, i + 1, remain - nums[i], path, out); // i + 1: vị trí này đã dùng
            path.remove(path.size() - 1);
        }
    }

    // Cùng cây đó nhưng không bỏ trùng: sinh lặp rồi khử bằng tập khóa.
    static List<List<Integer>> combinationSum2Set(int[] candidates, int target) {
        int[] nums = candidates.clone();
        Arrays.sort(nums);
        Set<List<Integer>> seen = new LinkedHashSet<>();
        setDfs(nums, 0, target, new ArrayList<>(), seen);
        return new ArrayList<>(seen);
    }

    static void setDfs(int[] nums, int start, int remain, List<Integer> path, Set<List<Integer>> seen) {
        calls++;
        if (remain == 0) {
            seen.add(new ArrayList<>(path)); // List có equals/hashCode theo nội dung
            return;
        }
        for (int i = start; i < nums.length; i++) {
            if (nums[i] > remain) break;
            path.add(nums[i]);
            setDfs(nums, i + 1, remain - nums[i], path, seen);
            path.remove(path.size() - 1);
        }
    }

    // Vét mọi tập con theo bitmask, sắp từng tập rồi khử trùng.
    static List<List<Integer>> brute(int[] candidates, int target) {
        Set<List<Integer>> seen = new HashSet<>();
        int n = candidates.length;
        for (int mask = 0; mask < 1 << n; mask++) {
            List<Integer> pick = new ArrayList<>();
            int sum = 0;
            for (int i = 0; i < n; i++) {
                if ((mask >> i & 1) == 1) {
                    pick.add(candidates[i]);
                    sum += candidates[i];
                }
            }
            if (sum == target) {
                Collections.sort(pick);
                seen.add(pick);
            }
        }
        return new ArrayList<>(seen);
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

    static int[] ones(int k) {
        int[] a = new int[k];
        Arrays.fill(a, 1);
        return a;
    }

    public static void main(String[] args) {
        Object[][] cases = {
            {new int[]{3, 1, 3, 5, 1, 1}, 8, new int[][]{{1, 1, 1, 5}, {1, 1, 3, 3}, {3, 5}}},
            {new int[]{2, 2, 2}, 4, new int[][]{{2, 2}}},
            {new int[]{5}, 3, new int[][]{}},
            {new int[]{4, 1, 4, 1}, 5, new int[][]{{1, 4}}},
            {ones(20), 10, new int[][]{ones(10)}},
            {new int[]{6, 2, 4, 2}, 6, new int[][]{{2, 4}, {6}}},
            {new int[]{50, 30}, 30, new int[][]{{30}}},
        };
        int ok = 0;
        for (Object[] c : cases) {
            int[] cand = (int[]) c[0];
            int target = (int) c[1];
            String want = norm(lists((int[][]) c[2]));
            List<List<Integer>> a = combinationSum2(cand, target);
            if (norm(a).equals(want) && norm(combinationSum2Set(cand, target)).equals(want)) ok++;
            else System.out.println("sai ở " + Arrays.toString(cand) + " " + target + " " + a);
        }
        System.out.println(ok + "/" + cases.length + " ca đúng");

        int good = 0, total = 0;
        for (int n = 1; n <= 6; n++) {
            int[] digits = new int[n];
            int steps = (int) Math.pow(3, n);
            for (int step = 0; step < steps; step++) {
                int[] cand = new int[n];
                for (int i = 0; i < n; i++) cand[i] = digits[i] + 1;
                for (int target = 1; target <= 8; target++) {
                    total++;
                    String want = norm(brute(cand, target));
                    if (norm(combinationSum2(cand, target)).equals(want) && norm(combinationSum2Set(cand, target)).equals(want)) good++;
                    else System.out.println("sai ở " + Arrays.toString(cand) + " " + target);
                }
                for (int j = n - 1; j >= 0; j--) {
                    if (++digits[j] < 3) break;
                    digits[j] = 0;
                }
            }
        }
        System.out.println(good + "/" + total + " ca đúng (đối chiếu vét tập con)");

        calls = 0;
        combinationSum2Set(ones(20), 10);
        int setCalls = calls;
        calls = 0;
        combinationSum2(ones(20), 10);
        System.out.println("20 số 1, target 10: khử trùng bằng tập " + setCalls + " lượt gọi, bỏ trùng cùng tầng " + calls + " lượt gọi");
    }
}
