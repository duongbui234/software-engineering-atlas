// Palindrome Partitioning (LeetCode 131): cắt tại mọi tiền tố đối xứng của phần còn lại
// Chạy: java cuts.java
import java.util.*;

public class cuts {
    static long compares = 0;

    // Kiểm tra s[lo..hi] bằng hai con trỏ, đếm số phép so ký tự
    static boolean isPalindrome(String s, int lo, int hi) {
        while (lo < hi) {
            compares++;
            if (s.charAt(lo) != s.charAt(hi)) return false;
            lo++;
            hi--;
        }
        return true;
    }

    // Cách 1: ở mỗi vị trí start, thử mọi điểm cắt end và kiểm tra lại đoạn s[start..end] mỗi lần
    static List<List<String>> partitionCheck(String s) {
        List<List<String>> result = new ArrayList<>();
        checkWalk(s, 0, new ArrayList<>(), result);
        return result;
    }

    static void checkWalk(String s, int start, List<String> path, List<List<String>> result) {
        if (start == s.length()) {
            result.add(new ArrayList<>(path));
            return;
        }
        for (int end = start; end < s.length(); end++) {
            if (!isPalindrome(s, start, end)) continue;
            path.add(s.substring(start, end + 1));
            checkWalk(s, end + 1, path, result);
            path.remove(path.size() - 1);
        }
    }

    // Cách chính: dựng bảng isPal[i][j] một lần (i đi từ phải sang trái), rồi quay lui chỉ tra bảng
    static List<List<String>> partition(String s) {
        int n = s.length();
        boolean[][] isPal = new boolean[n][n];
        for (int i = n - 1; i >= 0; i--) {
            for (int j = i; j < n; j++) {
                compares++;
                // đối xứng khi hai đầu bằng nhau và phần bên trong (ngắn hơn, đã tính) cũng đối xứng
                isPal[i][j] = s.charAt(i) == s.charAt(j) && (j - i < 2 || isPal[i + 1][j - 1]);
            }
        }
        List<List<String>> result = new ArrayList<>();
        walk(s, isPal, 0, new ArrayList<>(), result);
        return result;
    }

    static void walk(String s, boolean[][] isPal, int start, List<String> path, List<List<String>> result) {
        if (start == s.length()) {
            result.add(new ArrayList<>(path)); // cắt hết chuỗi: ghi một cách chia
            return;
        }
        for (int end = start; end < s.length(); end++) {
            if (!isPal[start][end]) continue; // mảnh đầu không đối xứng: bỏ cả nhánh
            path.add(s.substring(start, end + 1));
            walk(s, isPal, end + 1, path, result);
            path.remove(path.size() - 1);
        }
    }

    // Trọng tài độc lập: vét mọi 2^(n-1) cách đặt vết cắt, giữ cách mà mọi mảnh đọc xuôi ngược như nhau
    static List<List<String>> bruteForce(String s) {
        int n = s.length();
        List<List<String>> result = new ArrayList<>();
        for (int mask = 0; mask < 1 << (n - 1); mask++) {
            List<String> parts = new ArrayList<>();
            int from = 0;
            for (int gap = 0; gap < n - 1; gap++) {
                if ((mask & (1 << gap)) != 0) {
                    parts.add(s.substring(from, gap + 1));
                    from = gap + 1;
                }
            }
            parts.add(s.substring(from));
            boolean all = true;
            for (String p : parts) {
                if (!p.equals(new StringBuilder(p).reverse().toString())) {
                    all = false;
                    break;
                }
            }
            if (all) result.add(parts);
        }
        return result;
    }

    static String canonical(List<List<String>> list) {
        List<String> keys = new ArrayList<>();
        for (List<String> p : list) keys.add(String.join("/", p));
        Collections.sort(keys);
        return String.join("|", keys);
    }

    static boolean check(String s, List<List<String>> expected) {
        String want = canonical(expected != null ? expected : bruteForce(s));
        for (List<List<String>> got : List.of(partition(s), partitionCheck(s))) {
            if (new HashSet<>(got).size() != got.size()) return false;
            if (!canonical(got).equals(want)) return false;
        }
        return true;
    }

    static int total = 0, good = 0;

    // Đối chiếu: mọi chuỗi trên {a, b} dài 1–9
    static void build(String s) {
        if (!s.isEmpty()) {
            total++;
            if (check(s, null)) good++;
        }
        if (s.length() == 9) return;
        build(s + "a");
        build(s + "b");
    }

    public static void main(String[] args) {
        Object[][] cases = {
            {"x", List.of(List.of("x"))},
            {"noon", List.of(List.of("n", "o", "o", "n"), List.of("n", "oo", "n"), List.of("noon"))},
            {"abc", List.of(List.of("a", "b", "c"))},
            {"aaaa", null},
            {"level", null},
            {"racecar", null},
            {"abcdefghijklmnop", List.of(List.of("abcdefghijklmnop".split("")))},
            {"a".repeat(16), null},
        };
        int ok = 0;
        for (Object[] c : cases) {
            @SuppressWarnings("unchecked")
            List<List<String>> expected = (List<List<String>>) c[1];
            if (check((String) c[0], expected)) ok++;
            else System.out.println("sai ở " + c[0]);
        }
        System.out.println(ok + "/" + cases.length + " ca đúng");

        build("");
        System.out.println(good + "/" + total + " ca đúng (đối chiếu vét mọi cách đặt vết cắt)");

        String sixteen = "a".repeat(16);
        compares = 0;
        int count = partitionCheck(sixteen).size();
        long viaCheck = compares;
        compares = 0;
        partition(sixteen);
        System.out.println("16 chữ a: " + count + " cách chia; kiểm tra lại mỗi lần " + viaCheck + " phép so, bảng isPal " + compares + " phép so");
    }
}
