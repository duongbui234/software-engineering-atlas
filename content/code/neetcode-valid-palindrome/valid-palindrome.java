// LeetCode 125, Valid Palindrome: hai cách và test.
// Chạy: java valid-palindrome.java
class ValidPalindrome {
    static boolean isAlnum(char c) { return c >= '0' && c <= '9' || c >= 'A' && c <= 'Z' || c >= 'a' && c <= 'z'; }

    static boolean cleanReverse(String s) {
        StringBuilder b = new StringBuilder();
        for (char c : s.toCharArray()) if (isAlnum(c)) b.append(Character.toLowerCase(c));
        String clean = b.toString();
        return clean.equals(b.reverse().toString()); // reverse() sửa chính b, nên lấy clean ra trước
    }

    static boolean twoPointers(String s) {
        int i = 0, j = s.length() - 1;
        while (i < j) {
            char a = s.charAt(i), c = s.charAt(j);
            if (!isAlnum(a)) i++;
            else if (!isAlnum(c)) j--;
            else if (Character.toLowerCase(a) != Character.toLowerCase(c)) return false;
            else { i++; j--; }
        }
        return true;
    }

    public static void main(String[] args) {
        String[] in = {"A man, a plan, a canal: Panama", "race a car", " ", "", "0P", "a_", "No 'x' in Nixon", ".,"};
        boolean[] want = {true, false, true, true, false, true, true, true};
        for (String name : new String[] {"cleanReverse", "twoPointers"}) {
            int ok = 0;
            for (int k = 0; k < in.length; k++) {
                boolean got = name.equals("cleanReverse") ? cleanReverse(in[k]) : twoPointers(in[k]);
                if (got == want[k]) ok++;
            }
            System.out.printf("%-13s %d/%d ca đúng%n", name, ok, in.length);
        }
    }
}
