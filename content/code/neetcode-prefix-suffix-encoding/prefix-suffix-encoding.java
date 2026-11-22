// Ga ARR-03: tiền tố, hậu tố và mã hóa. Giải 271 và 238, tự chạy test.
// Chạy: java prefix-suffix-encoding.java
import java.util.*;

class PrefixSuffixEncoding {
    // 271
    static String encode(List<String> strs) {
        StringBuilder b = new StringBuilder();
        for (String s : strs) b.append(s.length()).append('#').append(s);
        return b.toString();
    }

    static List<String> decode(String s) {
        List<String> out = new ArrayList<>();
        for (int i = 0; i < s.length(); ) {
            int h = s.indexOf('#', i);
            int n = Integer.parseInt(s.substring(i, h));
            out.add(s.substring(h + 1, h + 1 + n));
            i = h + 1 + n;
        }
        return out;
    }

    // 238
    static int[] productExceptSelf(int[] nums) {
        int[] out = new int[nums.length];
        int left = 1;
        for (int i = 0; i < nums.length; i++) { out[i] = left; left *= nums[i]; }
        int right = 1;
        for (int i = nums.length - 1; i >= 0; i--) { out[i] *= right; right *= nums[i]; }
        return out;
    }

    public static void main(String[] args) {
        boolean[] tests = {
            decode(encode(List.of("neet", "code", "love", "you"))).equals(List.of("neet", "code", "love", "you")),
            decode(encode(List.of())).equals(List.of()), decode(encode(List.of(""))).equals(List.of("")),
            decode(encode(List.of("12#ab", "#"))).equals(List.of("12#ab", "#")),
            Arrays.equals(productExceptSelf(new int[] {1, 2, 3, 4}), new int[] {24, 12, 8, 6}),
            Arrays.equals(productExceptSelf(new int[] {-1, 1, 0, -3, 3}), new int[] {0, 0, 9, 0, 0}),
            Arrays.equals(productExceptSelf(new int[] {0, 0, 5}), new int[] {0, 0, 0}),
        };
        int ok = 0;
        for (boolean t : tests) if (t) ok++;
        System.out.printf("%d/%d ca đúng%n", ok, tests.length);
    }
}
