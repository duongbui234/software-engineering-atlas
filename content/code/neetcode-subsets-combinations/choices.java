// Ga MISC-01: quay lui trên cây lựa chọn (tập con và tổ hợp).
// Chạy: java choices.java
import java.util.*;
import java.util.function.Supplier;

public class choices {
    // Subsets: ghi lại ở MỌI nút, nhánh con chỉ xét phần tử sau i.
    static List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        walkSubsets(nums, 0, new ArrayList<>(), result);
        return result;
    }

    static void walkSubsets(int[] nums, int start, List<Integer> path, List<List<Integer>> result) {
        result.add(new ArrayList<>(path)); // chép path, vì path còn đổi tiếp
        for (int i = start; i < nums.length; i++) {
            path.add(nums[i]); // chọn
            walkSubsets(nums, i + 1, path, result); // đi sâu, mỗi phần tử dùng một lần
            path.remove(path.size() - 1); // gỡ lựa chọn
        }
    }

    // Subsets II: sắp xếp, rồi ở cùng một tầng bỏ giá trị trùng với anh em đứng trước.
    static List<List<Integer>> subsetsWithDup(int[] nums) {
        int[] sorted = nums.clone();
        Arrays.sort(sorted);
        List<List<Integer>> result = new ArrayList<>();
        walkDup(sorted, 0, new ArrayList<>(), result);
        return result;
    }

    static void walkDup(int[] nums, int start, List<Integer> path, List<List<Integer>> result) {
        result.add(new ArrayList<>(path));
        for (int i = start; i < nums.length; i++) {
            if (i > start && nums[i] == nums[i - 1]) continue; // trùng ở cùng tầng
            path.add(nums[i]);
            walkDup(nums, i + 1, path, result);
            path.remove(path.size() - 1);
        }
    }

    // Combination Sum: chỉ ghi khi còn lại đúng 0; nhánh con bắt đầu lại từ i (được dùng lại).
    // Combination Sum II: mỗi số dùng một lần (i + 1) và bỏ trùng ở cùng tầng.
    static List<List<Integer>> combinationSum(int[] candidates, int target, boolean reuse) {
        int[] sorted = candidates.clone();
        Arrays.sort(sorted);
        List<List<Integer>> result = new ArrayList<>();
        walkSum(sorted, 0, target, reuse, new ArrayList<>(), result);
        return result;
    }

    static void walkSum(int[] nums, int start, int remaining, boolean reuse,
                        List<Integer> path, List<List<Integer>> result) {
        if (remaining == 0) {
            result.add(new ArrayList<>(path));
            return;
        }
        for (int i = start; i < nums.length; i++) {
            if (!reuse && i > start && nums[i] == nums[i - 1]) continue;
            if (nums[i] > remaining) break; // đã sắp xếp: các số sau còn lớn hơn
            path.add(nums[i]);
            walkSum(nums, reuse ? i : i + 1, remaining - nums[i], reuse, path, result);
            path.remove(path.size() - 1);
        }
    }

    static final String[] KEYS = {"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};

    // Letter Combinations: tầng thứ k chọn một chữ của chữ số thứ k; ghi ở lá.
    static List<String> letterCombinations(String digits) {
        List<String> result = new ArrayList<>();
        if (digits.isEmpty()) return result;
        walkLetters(digits, 0, new StringBuilder(), result);
        return result;
    }

    static void walkLetters(String digits, int depth, StringBuilder path, List<String> result) {
        if (depth == digits.length()) {
            result.add(path.toString());
            return;
        }
        for (char letter : KEYS[digits.charAt(depth) - '0'].toCharArray()) {
            path.append(letter);
            walkLetters(digits, depth + 1, path, result);
            path.deleteCharAt(path.length() - 1);
        }
    }

    // So sánh không phụ thuộc thứ tự: sắp xếp trong từng tổ hợp, rồi sắp xếp cả danh sách.
    @SuppressWarnings("unchecked")
    static List<String> norm(List<?> lists) {
        List<String> out = new ArrayList<>();
        for (Object x : lists) {
            if (x instanceof String s) {
                out.add(s);
            } else {
                List<Integer> c = new ArrayList<>((List<Integer>) x);
                Collections.sort(c);
                StringJoiner j = new StringJoiner(",");
                for (int v : c) j.add(String.valueOf(v));
                out.add(j.toString());
            }
        }
        Collections.sort(out);
        return out;
    }

    static List<List<Integer>> lists(int[]... rows) {
        List<List<Integer>> out = new ArrayList<>();
        for (int[] row : rows) {
            List<Integer> l = new ArrayList<>();
            for (int v : row) l.add(v);
            out.add(l);
        }
        return out;
    }

    record Case(String name, Supplier<List<?>> run, List<?> want, int count) {}

    public static void main(String[] args) {
        List<Case> cases = List.of(
            new Case("subsets [2,5,9]", () -> subsets(new int[]{2, 5, 9}),
                lists(new int[]{}, new int[]{2}, new int[]{2, 5}, new int[]{2, 5, 9}, new int[]{2, 9}, new int[]{5}, new int[]{5, 9}, new int[]{9}), 0),
            new Case("subsets [7]", () -> subsets(new int[]{7}), lists(new int[]{}, new int[]{7}), 0),
            new Case("subsets 10 số", () -> subsets(new int[]{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}), null, 1024),
            new Case("subsetsWithDup [3,1,3]", () -> subsetsWithDup(new int[]{3, 1, 3}),
                lists(new int[]{}, new int[]{1}, new int[]{1, 3}, new int[]{1, 3, 3}, new int[]{3}, new int[]{3, 3}), 0),
            new Case("subsetsWithDup [6,6,6]", () -> subsetsWithDup(new int[]{6, 6, 6}),
                lists(new int[]{}, new int[]{6}, new int[]{6, 6}, new int[]{6, 6, 6}), 0),
            new Case("subsetsWithDup [4,4,1,4,2]", () -> subsetsWithDup(new int[]{4, 4, 1, 4, 2}), null, 16),
            new Case("combinationSum [3,4,5] 8", () -> combinationSum(new int[]{3, 4, 5}, 8, true),
                lists(new int[]{3, 5}, new int[]{4, 4}), 0),
            new Case("combinationSum [2,3,7] 9", () -> combinationSum(new int[]{2, 3, 7}, 9, true),
                lists(new int[]{2, 2, 2, 3}, new int[]{2, 7}, new int[]{3, 3, 3}), 0),
            new Case("combinationSum [4] 3", () -> combinationSum(new int[]{4}, 3, true), List.of(), 0),
            new Case("combinationSum [2,3,5,7] 20", () -> combinationSum(new int[]{2, 3, 5, 7}, 20, true), null, 18),
            new Case("combinationSum2 [1,4,1,2,3,4] 6", () -> combinationSum(new int[]{1, 4, 1, 2, 3, 4}, 6, false),
                lists(new int[]{1, 1, 4}, new int[]{1, 2, 3}, new int[]{2, 4}), 0),
            new Case("combinationSum2 [3,3,2,4,3] 6", () -> combinationSum(new int[]{3, 3, 2, 4, 3}, 6, false),
                lists(new int[]{2, 4}, new int[]{3, 3}), 0),
            new Case("combinationSum2 [5] 3", () -> combinationSum(new int[]{5}, 3, false), List.of(), 0),
            new Case("letterCombinations 47", () -> letterCombinations("47"),
                List.of("gp", "gq", "gr", "gs", "hp", "hq", "hr", "hs", "ip", "iq", "ir", "is"), 0),
            new Case("letterCombinations 9", () -> letterCombinations("9"), List.of("w", "x", "y", "z"), 0),
            new Case("letterCombinations 7979", () -> letterCombinations("7979"), null, 256),
            new Case("letterCombinations rỗng", () -> letterCombinations(""), List.of(), 0)
        );
        int ok = 0;
        List<String> fails = new ArrayList<>();
        for (Case c : cases) {
            List<String> got = norm(c.run().get());
            boolean pass = c.want() == null
                ? got.size() == c.count() && new HashSet<>(got).size() == c.count()
                : got.equals(norm(c.want()));
            if (pass) ok++;
            else fails.add(c.name());
        }
        System.out.println(ok + "/" + cases.size() + " ca đúng");
        if (!fails.isEmpty()) System.out.println("sai ở: " + String.join("; ", fails));
    }
}
