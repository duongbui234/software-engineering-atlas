// NC-01 Contains Duplicate (LeetCode 217), Java 21.
// Chạy: java contains-duplicate.java   (chạy thẳng file nguồn, không cần javac)
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

class ContainsDuplicate { // không public: tên file không cần trùng tên class
    // HashSet.add trả về false nếu phần tử đã có: một lần tra thay cho contains + add.
    static boolean containsDuplicate(int[] nums) {
        Set<Integer> seen = new HashSet<>(nums.length * 2); // mỗi int bị "đóng hộp" thành Integer
        for (int x : nums) {
            if (!seen.add(x)) return true;
        }
        return false;
    }

    static boolean containsDuplicateSorted(int[] nums) {
        int[] a = nums.clone();
        Arrays.sort(a); // int[]: Dual-Pivot Quicksort, không cần đóng hộp
        for (int i = 1; i < a.length; i++) {
            if (a[i] == a[i - 1]) return true;
        }
        return false;
    }

    public static void main(String[] args) {
        int[][] inputs = {{1, 2, 3, 1}, {1, 2, 3, 4}, {1, 1, 1, 3, 3, 4, 3, 2, 4, 2}, {}};
        boolean[] want = {true, false, true, false};
        for (int i = 0; i < inputs.length; i++) {
            boolean a = containsDuplicate(inputs[i]), b = containsDuplicateSorted(inputs[i]);
            System.out.printf("%s → set %b, sắp xếp %b %s%n", Arrays.toString(inputs[i]), a, b,
                    a == want[i] && b == want[i] ? "✓" : "✗ SAI");
        }
    }
}
