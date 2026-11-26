// EXAMPLE
class Station {
    public static void main(String[] args) {
        String text = "xabbaq";
        for (boolean reuseMirror : new boolean[]{false, true}) {
            if (!Centers.longestPalindrome(text, reuseMirror).equals("abba")) {
                throw new AssertionError("Sai đoạn dài nhất");
            }
            if (Centers.countSubstrings(text, reuseMirror) != 8) {
                throw new AssertionError("Sai số đoạn");
            }
        }
        System.out.println("2/2 ca đúng");
    }
}

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

    static int countSubstrings(String text, boolean reuseMirror) {
        return palindromes(text, reuseMirror).count();
    }
}
