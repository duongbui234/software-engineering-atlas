// Permutations (LeetCode 46): đánh dấu phần tử đã dùng, đổi chỗ tại chỗ, chèn vào mọi khe
// Chạy: java arrange.java
import java.util.*;

public class arrange {
    static int calls = 0;

    // Cách chính: path cộng mảng used đánh dấu phần tử đã nằm trong path
    static List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        walk(nums, new boolean[nums.length], new ArrayList<>(), result);
        return result;
    }

    static void walk(int[] nums, boolean[] used, List<Integer> path, List<List<Integer>> result) {
        calls++;
        if (path.size() == nums.length) {
            result.add(new ArrayList<>(path)); // chép path, vì path còn bị sửa tiếp
            return;
        }
        for (int i = 0; i < nums.length; i++) {
            if (used[i]) continue; // phần tử này đã nằm trong path
            used[i] = true;
            path.add(nums[i]);
            walk(nums, used, path, result);
            path.remove(path.size() - 1);
            used[i] = false; // gỡ dấu để nhánh anh em được dùng lại
        }
    }

    // Đổi chỗ tại chỗ: vị trí k lần lượt nhận từng phần tử đang nằm ở k..n-1
    static List<List<Integer>> permuteSwap(int[] nums) {
        int[] a = nums.clone();
        List<List<Integer>> result = new ArrayList<>();
        swapWalk(a, 0, result);
        return result;
    }

    static void swapWalk(int[] a, int k, List<List<Integer>> result) {
        if (k == a.length) {
            List<Integer> copy = new ArrayList<>();
            for (int v : a) copy.add(v);
            result.add(copy);
            return;
        }
        for (int i = k; i < a.length; i++) {
            int t = a[k]; a[k] = a[i]; a[i] = t;
            swapWalk(a, k + 1, result);
            t = a[k]; a[k] = a[i]; a[i] = t; // đổi lại để mảng về như cũ
        }
    }

    // Cách lặp: chèn phần tử mới vào mọi khe của từng hoán vị đã có
    static List<List<Integer>> permuteInsert(int[] nums) {
        List<List<Integer>> layer = new ArrayList<>();
        layer.add(new ArrayList<>());
        for (int x : nums) {
            List<List<Integer>> next = new ArrayList<>();
            for (List<Integer> p : layer) {
                for (int slot = 0; slot <= p.size(); slot++) {
                    List<Integer> q = new ArrayList<>(p);
                    q.add(slot, x);
                    next.add(q);
                }
            }
            layer = next;
        }
        return layer;
    }

    // Bản sai: mượn chỉ số bắt đầu của bài tổ hợp, chỉ ghi khi path đủ n phần tử
    static List<List<Integer>> permuteWithStart(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        startWalk(nums, 0, new ArrayList<>(), result);
        return result;
    }

    static void startWalk(int[] nums, int start, List<Integer> path, List<List<Integer>> result) {
        if (path.size() == nums.length) {
            result.add(new ArrayList<>(path));
            return;
        }
        for (int i = start; i < nums.length; i++) {
            path.add(nums[i]);
            startWalk(nums, i + 1, path, result); // không bao giờ quay lại phần tử đứng trước i
            path.remove(path.size() - 1);
        }
    }

    // Trọng tài độc lập: vét mọi bộ n chỉ số (n^n bộ), giữ bộ có chỉ số đôi một khác nhau
    static List<List<Integer>> bruteForce(int[] nums) {
        int n = nums.length;
        int total = 1;
        for (int k = 0; k < n; k++) total *= n;
        List<List<Integer>> result = new ArrayList<>();
        for (int code = 0; code < total; code++) {
            int c = code;
            Set<Integer> seen = new HashSet<>();
            List<Integer> perm = new ArrayList<>();
            for (int k = 0; k < n; k++) {
                seen.add(c % n);
                perm.add(nums[c % n]);
                c /= n;
            }
            if (seen.size() == n) result.add(perm);
        }
        return result;
    }

    static String key(List<Integer> p) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < p.size(); i++) {
            if (i > 0) sb.append(',');
            sb.append(p.get(i));
        }
        return sb.toString();
    }

    static String canonical(List<List<Integer>> list) {
        List<String> keys = new ArrayList<>();
        for (List<Integer> p : list) keys.add(key(p));
        Collections.sort(keys);
        return String.join("|", keys);
    }

    static int factorial(int n) {
        return n <= 1 ? 1 : n * factorial(n - 1);
    }

    static boolean check(int[] nums, List<List<Integer>> expected) {
        String want = canonical(expected != null ? expected : bruteForce(nums));
        for (List<List<Integer>> got : List.of(permute(nums), permuteSwap(nums), permuteInsert(nums))) {
            if (got.size() != factorial(nums.length)) return false;
            if (new HashSet<>(got).size() != got.size()) return false;
            if (!canonical(got).equals(want)) return false;
        }
        return true;
    }

    static int total = 0, good = 0;

    // Đối chiếu: mọi mảng dài 1–5 gồm các giá trị khác nhau lấy từ {1, 2, 3, 4, 5}
    static void build(List<Integer> arr) {
        if (!arr.isEmpty()) {
            total++;
            if (check(arr.stream().mapToInt(Integer::intValue).toArray(), null)) good++;
        }
        if (arr.size() == 5) return;
        for (int v = 1; v <= 5; v++) {
            if (arr.contains(v)) continue;
            List<Integer> next = new ArrayList<>(arr);
            next.add(v);
            build(next);
        }
    }

    public static void main(String[] args) {
        Object[][] cases = {
            {new int[]{7}, List.of(List.of(7))},
            {new int[]{4, 9}, List.of(List.of(4, 9), List.of(9, 4))},
            {new int[]{3, 8, 1}, List.of(List.of(3, 8, 1), List.of(3, 1, 8), List.of(8, 3, 1), List.of(8, 1, 3), List.of(1, 3, 8), List.of(1, 8, 3))},
            {new int[]{0, -5, 10}, null},
            {new int[]{-10, 10, 0, 5}, null},
            {new int[]{2, 4, 6, 8, 10}, null},
            {new int[]{-3, -2, -1, 0, 1, 2}, null},
        };
        int ok = 0;
        for (Object[] c : cases) {
            @SuppressWarnings("unchecked")
            List<List<Integer>> expected = (List<List<Integer>>) c[1];
            if (check((int[]) c[0], expected)) ok++;
            else System.out.println("sai ở " + Arrays.toString((int[]) c[0]));
        }
        System.out.println(ok + "/" + cases.length + " ca đúng");

        build(new ArrayList<>());
        System.out.println(good + "/" + total + " ca đúng (đối chiếu vét mọi bộ chỉ số)");

        System.out.println("Dùng chỉ số bắt đầu như bài tổ hợp với [3,8,1]: " + permuteWithStart(new int[]{3, 8, 1}).size() + "/6 hoán vị");

        calls = 0;
        List<List<Integer>> six = permute(new int[]{1, 2, 3, 4, 5, 6});
        System.out.println("n = 6: " + six.size() + " hoán vị, " + calls + " lượt gọi");
    }
}
