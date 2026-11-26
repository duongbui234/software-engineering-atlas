class DecodeCount {
    static int decodeCount(String digits) {
        long beforePrevious = 0, previous = 1;
        for (int i = 0; i < digits.length(); i++) {
            char digit = digits.charAt(i);
            long current = digit == '0' ? 0 : previous;
            if (i > 0 && (digits.charAt(i - 1) == '1' || (digits.charAt(i - 1) == '2' && digit <= '6'))) {
                current += beforePrevious;
            }
            if (current == 0) return 0;
            if (current > Integer.MAX_VALUE) current = Integer.MAX_VALUE;
            beforePrevious = previous;
            previous = current;
        }
        return (int) previous;
    }

    static int visit(String digits, int index, int[] memo) {
        if (index == digits.length()) return 1;
        if (digits.charAt(index) == '0') return 0;
        if (memo != null && memo[index] != -1) return memo[index];
        int count = visit(digits, index + 1, memo);
        char current = digits.charAt(index);
        if (index + 1 < digits.length() &&
                (current == '1' || (current == '2' && digits.charAt(index + 1) <= '6'))) {
            count += visit(digits, index + 2, memo);
        }
        if (memo != null) memo[index] = count;
        return count;
    }

    static int decodeByCuts(String digits, boolean memoized) {
        int[] memo = memoized ? new int[digits.length()] : null;
        if (memo != null) java.util.Arrays.fill(memo, -1);
        return visit(digits, 0, memo);
    }

    public static void main(String[] args) {
        check(decodeCount("11204"), 2);
        check(decodeByCuts("11204", true), 2);
        check(decodeByCuts("11204", false), 2);
        check(decodeCount("27"), 1);
        check(decodeByCuts("27", true), 1);
        check(decodeByCuts("27", false), 1);
        check(decodeCount("1010"), 1);
        check(decodeByCuts("1010", true), 1);
        check(decodeByCuts("1010", false), 1);
        check(decodeCount("100"), 0);
        check(decodeByCuts("100", true), 0);
        check(decodeByCuts("100", false), 0);
        check(decodeCount("07"), 0);
        check(decodeByCuts("07", true), 0);
        check(decodeByCuts("07", false), 0);
        check(decodeCount("1234"), 3);
        check(decodeByCuts("1234", true), 3);
        check(decodeByCuts("1234", false), 3);
        check(decodeCount("301"), 0);
        check(decodeByCuts("301", true), 0);
        check(decodeByCuts("301", false), 0);
        check(decodeCount("9"), 1);
        check(decodeByCuts("9", true), 1);
        check(decodeByCuts("9", false), 1);
        check(decodeCount("0"), 0);
        check(decodeByCuts("0", true), 0);
        check(decodeByCuts("0", false), 0);
        check(decodeCount("1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111300"), 0);
        check(decodeByCuts("1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111300", true), 0);
        System.out.println("10/10 ca đúng");
    }

    static void check(int got, int want) {
        if (got != want) throw new AssertionError("want " + want + ", got " + got);
    }
}
