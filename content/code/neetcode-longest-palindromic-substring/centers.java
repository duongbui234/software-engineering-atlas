class Centers {
    record Stats(int start, int length, int count) {}

    static Stats palindromes(String text, boolean reuseMirror) {
        int last = 2 * text.length();
        int[] radius = reuseMirror ? new int[last + 1] : new int[0];
        int center = 0, right = 0, start = 0, best = 0, count = 0;

        for (int i = 0; i <= last; i++) {
            int length = reuseMirror && i < right ? Math.min(radius[2 * center - i], right - i) : 0;
            while (i - length > 0 && i + length < last) {
                int left = i - length - 1, next = i + length + 1;
                if (left % 2 != 0 && text.charAt(left / 2) != text.charAt(next / 2)) break;
                length++;
            }
            if (reuseMirror) {
                radius[i] = length;
                if (i + length > right) {
                    center = i;
                    right = i + length;
                }
            }
            if (length > best) {
                start = (i - length) / 2;
                best = length;
            }
            count += (length + 1) / 2;
        }
        return new Stats(start, best, count);
    }

    static String longestPalindrome(String text, boolean reuseMirror) {
        Stats result = palindromes(text, reuseMirror);
        return text.substring(result.start(), result.start() + result.length());
    }

    // TESTS
    public static void main(String[] args) {
        String[][] cases = {
            {"", ""}, {"c", "c"}, {"xabbaq", "abba"}, {"tacocatx", "tacocat"},
            {"abab", "aba"}, {"zzzz", "zzzz"}, {"xyz", "x"}, {"a".repeat(1000), "a".repeat(1000)}
        };
        for (String[] test : cases) {
            if (!longestPalindrome(test[0], false).equals(test[1]) || !longestPalindrome(test[0], true).equals(test[1])) {
                throw new AssertionError("Sai đoạn đối xứng");
            }
        }
        System.out.printf("%d/%d ca đúng%n", cases.length, cases.length);
    }
}
