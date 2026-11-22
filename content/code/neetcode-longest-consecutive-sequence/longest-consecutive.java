// LeetCode 128, Longest Consecutive Sequence: ba cách, test, và bẫy so Integer bằng ==.
// Chạy: java longest-consecutive.java   (Java 21, không cần javac)
import java.util.*;

class LongestConsecutive {
    static int bruteForce(int[] nums) {
        int best = 0;
        for (int x : nums) {
            int len = 1;
            while (contains(nums, x + len)) len++;
            best = Math.max(best, len);
        }
        return best;
    }

    static boolean contains(int[] a, int v) { // duyệt cả mảng: O(n) mỗi lần
        for (int y : a) if (y == v) return true;
        return false;
    }

    static int sortScan(int[] nums) {
        if (nums.length == 0) return 0;
        int[] a = nums.clone(); // Arrays.sort sửa tại chỗ
        Arrays.sort(a); // mảng int nguyên thủy: Dual-Pivot Quicksort, không đóng hộp
        int best = 1, len = 1;
        for (int i = 1; i < a.length; i++) {
            if (a[i] == a[i - 1]) continue; // số trùng: bỏ qua, không đứt dãy
            len = a[i] == a[i - 1] + 1 ? len + 1 : 1;
            best = Math.max(best, len);
        }
        return best;
    }

    static int hashSet(int[] nums) {
        Set<Integer> all = new HashSet<>();
        for (int x : nums) all.add(x); // mỗi int bị đóng hộp thành một Integer
        int best = 0;
        for (int x : all) {
            if (all.contains(x - 1)) continue;
            int len = 1;
            while (all.contains(x + len)) len++;
            best = Math.max(best, len);
        }
        return best;
    }

    // Bản sai: sắp xếp List<Integer> rồi so số trùng bằng ==, tức so THAM CHIẾU.
    // Integer chỉ được dùng chung (cache) cho giá trị -128..127; ngoài khoảng đó, hai số bằng nhau là hai object khác nhau.
    static int sortScanBoxed(int[] nums) {
        if (nums.length == 0) return 0;
        List<Integer> a = new ArrayList<>();
        for (int x : nums) a.add(x);
        Collections.sort(a);
        int best = 1, len = 1;
        for (int i = 1; i < a.size(); i++) {
            if (a.get(i) == a.get(i - 1)) continue; // SAI: phải là a.get(i).equals(a.get(i - 1))
            len = a.get(i) == a.get(i - 1) + 1 ? len + 1 : 1; // phép + mở hộp, nên dòng này vẫn so giá trị
            best = Math.max(best, len);
        }
        return best;
    }

    public static void main(String[] args) {
        int[][] in = {{100, 4, 200, 1, 3, 2}, {0, 3, 7, 2, 5, 8, 4, 6, 0, 1}, {1, 0, 1, 2}, {}, {7}, {-3, -1, -2, 5}, {9, 10, 8}, {1000, 1001, 1001, 1002}};
        int[] want = {4, 9, 3, 0, 1, 3, 3, 3};
        String[] names = {"bruteForce", "sortScan", "hashSet", "sortScanBoxed"};
        for (String name : names) {
            int ok = 0;
            List<String> bad = new ArrayList<>();
            for (int i = 0; i < in.length; i++) {
                int got = switch (name) {
                    case "bruteForce" -> bruteForce(in[i]);
                    case "sortScan" -> sortScan(in[i]);
                    case "hashSet" -> hashSet(in[i]);
                    default -> sortScanBoxed(in[i]);
                };
                if (got == want[i]) ok++; else bad.add(Arrays.toString(in[i]) + " → " + got);
            }
            System.out.printf("%-14s %d/%d ca đúng%s%n", name, ok, in.length, bad.isEmpty() ? "" : "; sai ở " + String.join(" ", bad));
        }
    }
}
