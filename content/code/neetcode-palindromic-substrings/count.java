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

    static int countSubstrings(String text, boolean reuseMirror) {
        return palindromes(text, reuseMirror).count();
    }

    // TESTS
    record Case(String text, int want) {}
    public static void main(String[] args) {
        Case[] cases = {
            new Case("", 0), new Case("c", 1), new Case("xabbaq", 8), new Case("tacocatx", 11),
            new Case("abab", 6), new Case("zzzz", 10), new Case("xyz", 3), new Case("a".repeat(1000), 500500)
        };
        for (Case test : cases) {
            if (countSubstrings(test.text(), false) != test.want() || countSubstrings(test.text(), true) != test.want()) {
                throw new AssertionError("Sai số đoạn đối xứng");
            }
        }
        System.out.printf("%d/%d ca đúng%n", cases.length, cases.length);
    }
}
