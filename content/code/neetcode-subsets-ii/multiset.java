import java.util.*;

public class multiset {
    static int calls = 0, generated = 0;

    // Cách chính: sắp xếp, rồi ở mỗi tầng chỉ dùng phần tử đầu của mỗi nhóm giá trị bằng nhau
    static List<List<Integer>> subsetsWithDup(int[] nums) {
        int[] sorted = nums.clone();
        Arrays.sort(sorted);
        List<List<Integer>> result = new ArrayList<>();
        walk(sorted, 0, new ArrayList<>(), result);
        return result;
    }

    // Bản sai: bỏ mọi phần tử bằng phần tử đứng trước, kể cả khi nó là lựa chọn đầu của tầng
    static List<List<Integer>> subsetsSkipAlways(int[] nums) {
        int[] sorted = nums.clone();
        Arrays.sort(sorted);
        List<List<Integer>> result = new ArrayList<>();
        walkSkipAlways(sorted, 0, new ArrayList<>(), result);
        return result;
    }

    static void walk(int[] sorted, int start, List<Integer> path, List<List<Integer>> result) {
        calls++;
        result.add(new ArrayList<>(path));
        for (int i = start; i < sorted.length; i++) {
            // i > start: cùng tầng, giá trị này đã được thử ở anh em đứng trước
            if (i > start && sorted[i] == sorted[i - 1]) continue;
            path.add(sorted[i]);
            walk(sorted, i + 1, path, result);
            path.remove(path.size() - 1);
        }
    }

    static void walkSkipAlways(int[] sorted, int start, List<Integer> path, List<List<Integer>> result) {
        result.add(new ArrayList<>(path));
        for (int i = start; i < sorted.length; i++) {
            if (i > 0 && sorted[i] == sorted[i - 1]) continue; // sai: chặn cả nhánh đi sâu [5] → [5, 5]
            path.add(sorted[i]);
            walkSkipAlways(sorted, i + 1, path, result);
            path.remove(path.size() - 1);
        }
    }

    // Cách lọc sau: sinh đủ 2^n tập của mảng đã sắp, cất List vào HashSet để bỏ trùng
    static List<List<Integer>> subsetsWithSet(int[] nums) {
        int[] sorted = nums.clone();
        Arrays.sort(sorted);
        Set<List<Integer>> seen = new HashSet<>();
        for (int mask = 0; mask < 1 << sorted.length; mask++) {
            List<Integer> subset = new ArrayList<>();
            for (int i = 0; i < sorted.length; i++) {
                if ((mask & (1 << i)) != 0) subset.add(sorted[i]);
            }
            generated++;
            seen.add(subset); // List.equals so theo nội dung, nên HashSet bỏ được trùng
        }
        return new ArrayList<>(seen);
    }

    // Tham chiếu độc lập: đếm số lần xuất hiện, mỗi giá trị lấy 0..count bản
    static List<List<Integer>> subsetsByCount(int[] nums) {
        Map<Integer, Integer> counts = new LinkedHashMap<>();
        for (int x : nums) counts.merge(x, 1, Integer::sum);
        List<List<Integer>> result = new ArrayList<>();
        result.add(new ArrayList<>());
        for (Map.Entry<Integer, Integer> e : counts.entrySet()) {
            List<List<Integer>> next = new ArrayList<>();
            for (List<Integer> subset : result) {
                for (int k = 0; k <= e.getValue(); k++) {
                    List<Integer> grown = new ArrayList<>(subset);
                    for (int j = 0; j < k; j++) grown.add(e.getKey());
                    next.add(grown);
                }
            }
            result = next;
        }
        return result;
    }

    static List<String> canonical(List<List<Integer>> sets) {
        List<String> keys = new ArrayList<>();
        for (List<Integer> s : sets) {
            List<Integer> c = new ArrayList<>(s);
            Collections.sort(c);
            keys.add(c.toString());
        }
        Collections.sort(keys);
        return keys;
    }

    static List<List<Integer>> lists(int[][] rows) {
        List<List<Integer>> out = new ArrayList<>();
        for (int[] row : rows) {
            List<Integer> l = new ArrayList<>();
            for (int v : row) l.add(v);
            out.add(l);
        }
        return out;
    }

    static boolean check(int[] nums, int[][] expected) {
        List<String> reference = canonical(subsetsByCount(nums));
        for (List<List<Integer>> got : List.of(subsetsWithDup(nums), subsetsWithSet(nums))) {
            List<String> keys = canonical(got);
            if (new HashSet<>(keys).size() != keys.size()) return false; // không được có tập lặp
            if (!keys.equals(reference)) return false;
            if (expected != null && !keys.equals(canonical(lists(expected)))) return false;
        }
        return true;
    }

    static int total = 0, good = 0;

    // Đối chiếu: mọi mảng dài 0–5 với giá trị trong {1, 2, 3}
    static void build(int[] arr) {
        total++;
        if (check(arr, null)) good++;
        if (arr.length == 5) return;
        for (int v = 1; v <= 3; v++) {
            int[] next = Arrays.copyOf(arr, arr.length + 1);
            next[arr.length] = v;
            build(next);
        }
    }

    public static void main(String[] args) {
        Object[][] cases = {
            {new int[]{3, 3}, new int[][]{{}, {3}, {3, 3}}},
            {new int[]{5, 5, 1}, new int[][]{{}, {1}, {1, 5}, {1, 5, 5}, {5}, {5, 5}}},
            {new int[]{4, 4, 4, 4}, new int[][]{{}, {4}, {4, 4}, {4, 4, 4}, {4, 4, 4, 4}}},
            {new int[]{0, -1, 0}, new int[][]{{}, {-1}, {-1, 0}, {-1, 0, 0}, {0}, {0, 0}}},
            {new int[]{7}, new int[][]{{}, {7}}},
            {new int[]{1, 1, 2, 2, 3}, null},
            {new int[]{2, 2, 2, 2, 2, 2, 2, 2, 2, 2}, null},
            {new int[]{-5, -4, -3, -2, -1, 0, 1, 2, 3, 4}, null},
        };
        int ok = 0;
        for (Object[] c : cases) {
            if (check((int[]) c[0], (int[][]) c[1])) ok++;
            else System.out.println("sai ở " + Arrays.toString((int[]) c[0]));
        }
        System.out.println(ok + "/" + cases.length + " ca đúng");

        build(new int[0]);
        System.out.println(good + "/" + total + " ca đúng (đối chiếu đếm theo nhóm)");

        int wrong = subsetsSkipAlways(new int[]{5, 5, 1}).size();
        int right = subsetsWithDup(new int[]{5, 5, 1}).size();
        System.out.println("Bỏ trùng mọi lúc với [5,5,1]: " + wrong + " tập, đúng là " + right);

        int[] heavy = {4, 4, 4, 4, 4, 9, 9, 9, 9, 9};
        generated = 0;
        int kept = subsetsWithSet(heavy).size();
        calls = 0;
        subsetsWithDup(heavy);
        System.out.println("[4×5, 9×5]: Set sinh " + generated + " tập để giữ " + kept + ", cắt cùng tầng sinh " + calls);
    }
}
