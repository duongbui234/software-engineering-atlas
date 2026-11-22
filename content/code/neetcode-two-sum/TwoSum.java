// NC-03 Two Sum (LeetCode 1), Java 21, kèm phép thử va chạm hash.
// Chạy: java TwoSum.java
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class TwoSum {
    static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>(); // giá trị → chỉ số
        for (int i = 0; i < nums.length; i++) {
            Integer j = seen.get(target - nums[i]);
            if (j != null) return new int[] {j, i};
            seen.put(nums[i], i);
        }
        return new int[0];
    }

    // "Aa" và "BB" có cùng hashCode (2112). Ghép k khối như vậy được 2^k chuỗi cùng hashCode.
    static List<String> colliding(int k) {
        List<String> out = new ArrayList<>(List.of(""));
        for (int i = 0; i < k; i++) {
            List<String> next = new ArrayList<>(out.size() * 2);
            for (String s : out) { next.add(s + "Aa"); next.add(s + "BB"); }
            out = next;
        }
        return out;
    }

    static double putAll(List<String> keys) {
        long t0 = System.nanoTime();
        Map<String, Integer> m = new HashMap<>();
        for (int i = 0; i < keys.size(); i++) m.put(keys.get(i), i);
        for (String k : keys) m.get(k);
        return (System.nanoTime() - t0) / 1e6;
    }

    // Khóa cùng hashCode nhưng KHÔNG so sánh được thứ tự (không Comparable):
    // bin vẫn thành cây, nhưng get() phải dò cả hai nhánh, nên mỗi lần tra thành O(n).
    record SameHash(int v) {
        @Override public int hashCode() { return 42; }
    }

    static double putAllSameHash(int n) {
        long t0 = System.nanoTime();
        Map<SameHash, Integer> m = new HashMap<>();
        for (int i = 0; i < n; i++) m.put(new SameHash(i), i);
        for (int i = 0; i < n; i++) m.get(new SameHash(i));
        return (System.nanoTime() - t0) / 1e6;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(twoSum(new int[] {2, 7, 11, 15}, 9)) + " "
                + Arrays.toString(twoSum(new int[] {3, 2, 4}, 6)) + " " + Arrays.toString(twoSum(new int[] {3, 3}, 6)));

        System.out.println("\"Aa\".hashCode() = " + "Aa".hashCode() + ", \"BB\".hashCode() = " + "BB".hashCode());
        List<String> bad = colliding(16);                       // 65 536 chuỗi, tất cả cùng một hashCode
        List<String> good = new ArrayList<>();
        for (int i = 0; i < bad.size(); i++) good.add("k" + i * 7919); // 65 536 chuỗi bình thường
        System.out.println("hashCode khác nhau: chuỗi xấu " + bad.stream().map(String::hashCode).distinct().count()
                + ", chuỗi thường " + good.stream().map(String::hashCode).distinct().count());
        for (int r = 0; r < 3; r++) putAll(bad); // khởi động JIT
        for (int r = 0; r < 3; r++) putAll(good);
        System.out.printf("put + get 65 536 khóa: thường %.1f ms, cùng hashCode (String, Comparable) %.1f ms%n", putAll(good), putAll(bad));
        for (int n : new int[] {5_000, 10_000, 20_000})
            System.out.printf("put + get %d khóa cùng hashCode, không Comparable: %.1f ms%n", n, putAllSameHash(n));
    }
}
