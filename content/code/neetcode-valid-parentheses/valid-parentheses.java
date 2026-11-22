// LeetCode 20, Valid Parentheses: ngăn xếp bằng ArrayDeque, so với Stack cũ.
// Chạy: java valid-parentheses.java
import java.util.*;

class ValidParentheses {
    static boolean replacePairs(String s) {
        String prev = null;
        while (!s.equals(prev)) {
            prev = s;
            s = s.replace("()", "").replace("[]", "").replace("{}", "");
        }
        return s.isEmpty();
    }

    static boolean stack(String s) {
        Deque<Character> st = new ArrayDeque<>(); // ArrayDeque thay cho Stack: Stack kế thừa Vector, mọi lệnh đều synchronized
        for (char ch : s.toCharArray()) {
            char want = switch (ch) { case ')' -> '('; case ']' -> '['; case '}' -> '{'; default -> 0; };
            if (want == 0) st.push(ch);
            else if (st.isEmpty() || st.pop() != want) return false; // pop() trên deque rỗng ném NoSuchElementException
        }
        return st.isEmpty();
    }

    static boolean legacyStack(String s) {
        Stack<Character> st = new Stack<>();
        for (char ch : s.toCharArray()) {
            char want = switch (ch) { case ')' -> '('; case ']' -> '['; case '}' -> '{'; default -> 0; };
            if (want == 0) st.push(ch);
            else if (st.isEmpty() || st.pop() != want) return false;
        }
        return st.isEmpty();
    }

    public static void main(String[] args) {
        String[] in = {"()", "()[]{}", "(]", "([)]", "{[]}", "((", "){", "", "(((([]))))"};
        boolean[] want = {true, true, false, false, true, false, false, true, true};
        for (String name : new String[] {"replacePairs", "stack", "legacyStack"}) {
            int ok = 0;
            for (int i = 0; i < in.length; i++) {
                boolean got = switch (name) { case "replacePairs" -> replacePairs(in[i]); case "stack" -> stack(in[i]); default -> legacyStack(in[i]); };
                if (got == want[i]) ok++;
            }
            System.out.printf("%-13s %d/%d ca đúng%n", name, ok, in.length);
        }
        String big = "(".repeat(500_000) + ")".repeat(500_000);
        for (int round = 0; round < 3; round++) { // vài vòng khởi động để JIT biên dịch xong
            long t1 = System.nanoTime(); stack(big); long t2 = System.nanoTime(); legacyStack(big); long t3 = System.nanoTime();
            if (round == 2) System.out.printf("%n10^6 ký tự: ArrayDeque %.1f ms, Stack %.1f ms%n", (t2 - t1) / 1e6, (t3 - t2) / 1e6);
        }
    }
}
