import java.util.*;
import java.util.function.Function;

public class powerset {
    // Cách 1: lấy hoặc bỏ từng phần tử, mỗi lá của cây là một tập con
    static List<List<Integer>> subsetsTakeSkip(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        takeSkip(nums, 0, new ArrayList<>(), result);
        return result;
    }

    static void takeSkip(int[] nums, int i, List<Integer> path, List<List<Integer>> result) {
        if (i == nums.length) {
            result.add(new ArrayList<>(path)); // sao chép, vì path còn bị sửa tiếp
            return;
        }
        path.add(nums[i]); // lấy nums[i]
        takeSkip(nums, i + 1, path, result);
        path.remove(path.size() - 1);
        takeSkip(nums, i + 1, path, result); // bỏ nums[i]
    }

    // Cách 2: chỉ số bắt đầu, mỗi nút của cây là một tập con
    static List<List<Integer>> subsetsStart(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        fromStart(nums, 0, new ArrayList<>(), result);
        return result;
    }

    static void fromStart(int[] nums, int start, List<Integer> path, List<List<Integer>> result) {
        result.add(new ArrayList<>(path));
        for (int i = start; i < nums.length; i++) {
            path.add(nums[i]);
            fromStart(nums, i + 1, path, result); // chỉ xét các phần tử sau i, nên [a, b] không có bản sao [b, a]
            path.remove(path.size() - 1);
        }
    }

    // Cách 3: bit thứ i của mask cho biết có lấy nums[i] hay không
    static List<List<Integer>> subsetsBitmask(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        for (int mask = 0; mask < 1 << nums.length; mask++) {
            List<Integer> subset = new ArrayList<>();
            for (int i = 0; i < nums.length; i++) {
                if ((mask & (1 << i)) != 0) subset.add(nums[i]);
            }
            result.add(subset);
        }
        return result;
    }

    // Cách 4: nhân đôi danh sách, mỗi tập cũ sinh thêm một bản có x
    static List<List<Integer>> subsetsDoubling(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        result.add(new ArrayList<>());
        for (int x : nums) {
            int size = result.size();
            for (int k = 0; k < size; k++) {
                List<Integer> next = new ArrayList<>(result.get(k));
                next.add(x);
                result.add(next);
            }
        }
        return result;
    }

    // Bản lỗi: đẩy chính path vào kết quả, không sao chép
    static List<List<Integer>> subsetsNoCopy(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        noCopy(nums, 0, new ArrayList<>(), result);
        return result;
    }

    static void noCopy(int[] nums, int start, List<Integer> path, List<List<Integer>> result) {
        result.add(path); // cùng một đối tượng được thêm 8 lần
        for (int i = start; i < nums.length; i++) {
            path.add(nums[i]);
            noCopy(nums, i + 1, path, result);
            path.remove(path.size() - 1);
        }
    }

    // Dạng chuẩn để so không phụ thuộc thứ tự: sắp từng tập, rồi sắp cả danh sách
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

    static final List<Function<int[], List<List<Integer>>>> APPROACHES =
        List.of(powerset::subsetsTakeSkip, powerset::subsetsStart, powerset::subsetsBitmask, powerset::subsetsDoubling);

    // Mọi cách phải cho đủ 2^n tập, không tập nào lặp, và khớp đáp án viết tay nếu có
    static boolean check(int[] nums, int[][] expected) {
        List<String> reference = canonical(subsetsBitmask(nums));
        for (Function<int[], List<List<Integer>>> solve : APPROACHES) {
            List<List<Integer>> got = solve.apply(nums.clone());
            if (got.size() != 1 << nums.length) return false;
            List<String> keys = canonical(got);
            if (new HashSet<>(keys).size() != got.size()) return false;
            if (expected != null && !keys.equals(canonical(lists(expected)))) return false;
            if (!keys.equals(reference)) return false;
        }
        return true;
    }

    static int total = 0, good = 0;
    static final int[] POOL = {-2, -1, 0, 1, 2};

    // Đối chiếu chéo: mọi mảng gồm các giá trị khác nhau lấy từ {-2..2}, dài 0–4, mọi thứ tự
    static void build(int[] arr) {
        total++;
        if (check(arr, null)) good++;
        if (arr.length == 4) return;
        for (int v : POOL) {
            boolean used = false;
            for (int a : arr) if (a == v) used = true;
            if (used) continue;
            int[] next = Arrays.copyOf(arr, arr.length + 1);
            next[arr.length] = v;
            build(next);
        }
    }

    public static void main(String[] args) {
        Object[][] cases = {
            {new int[]{5}, new int[][]{{}, {5}}},
            {new int[]{4, -2}, new int[][]{{}, {4}, {-2}, {4, -2}}},
            {new int[]{7, 1, 9}, new int[][]{{}, {7}, {1}, {9}, {7, 1}, {7, 9}, {1, 9}, {7, 1, 9}}},
            {new int[]{-10, 10}, new int[][]{{}, {-10}, {10}, {-10, 10}}},
            {new int[]{3, -1, 0, 8}, null},
            {new int[]{-5, -4, -3, -2, -1, 0, 1, 2, 3, 4}, null},
            {new int[]{6, -6, 2}, new int[][]{{}, {6}, {-6}, {2}, {6, -6}, {6, 2}, {-6, 2}, {6, -6, 2}}},
        };
        int ok = 0;
        for (Object[] c : cases) {
            if (check((int[]) c[0], (int[][]) c[1])) ok++;
            else System.out.println("sai ở " + Arrays.toString((int[]) c[0]));
        }
        System.out.println(ok + "/" + cases.length + " ca đúng");

        build(new int[0]);
        System.out.println(good + "/" + total + " ca đúng (đối chiếu chéo bốn cách)");

        int[] demo = {1, 2, 3};
        Set<String> broken = new HashSet<>(canonical(subsetsNoCopy(demo)));
        int matched = 0;
        for (String key : canonical(subsetsBitmask(demo))) if (broken.contains(key)) matched++;
        System.out.println("Quên sao chép path với [1,2,3]: " + matched + "/8 tập con đúng");
    }
}
