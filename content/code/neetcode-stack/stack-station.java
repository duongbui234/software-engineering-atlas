// Ga ARR-06: ngăn xếp. Giải 20, 155, 150 và 22, tự chạy test.
// Chạy: java stack-station.java
import java.util.*;

class StackStation {
    // 20
    static boolean isValid(String s) {
        Deque<Character> st = new ArrayDeque<>();
        for (char ch : s.toCharArray()) {
            char want = switch (ch) { case ')' -> '('; case ']' -> '['; case '}' -> '{'; default -> 0; };
            if (want == 0) st.push(ch);
            else if (st.isEmpty() || st.pop() != want) return false;
        }
        return st.isEmpty();
    }

    // 155: mỗi tầng nhớ kèm min tới tầng đó.
    static class MinStack {
        private final Deque<int[]> st = new ArrayDeque<>();
        void push(int x) { st.push(new int[] {x, st.isEmpty() ? x : Math.min(x, getMin())}); }
        void pop() { st.pop(); }
        int top() { return st.peek()[0]; }
        int getMin() { return st.peek()[1]; }
    }

    // 150
    static int evalRPN(String[] tokens) {
        Deque<Integer> st = new ArrayDeque<>();
        for (String t : tokens) {
            switch (t) {
                case "+", "-", "*", "/" -> {
                    int b = st.pop(), a = st.pop();
                    st.push(switch (t) { case "+" -> a + b; case "-" -> a - b; case "*" -> a * b; default -> a / b; }); // int chia: làm tròn về 0
                }
                default -> st.push(Integer.parseInt(t));
            }
        }
        return st.pop();
    }

    // 22
    static List<String> generateParenthesis(int n) {
        List<String> out = new ArrayList<>();
        gen(n, 0, 0, new StringBuilder(), out);
        return out;
    }

    static void gen(int n, int open, int close, StringBuilder cur, List<String> out) {
        if (cur.length() == 2 * n) { out.add(cur.toString()); return; }
        if (open < n) { cur.append('('); gen(n, open + 1, close, cur, out); cur.deleteCharAt(cur.length() - 1); }
        if (close < open) { cur.append(')'); gen(n, open, close + 1, cur, out); cur.deleteCharAt(cur.length() - 1); }
    }

    public static void main(String[] args) {
        MinStack ms = new MinStack();
        ms.push(-2); ms.push(0); ms.push(-3);
        int m1 = ms.getMin();
        ms.pop();
        boolean[] tests = {
            isValid("()[]{}"), !isValid("([)]"), !isValid("(("),
            m1 == -3 && ms.top() == 0 && ms.getMin() == -2,
            evalRPN(new String[] {"2", "1", "+", "3", "*"}) == 9, evalRPN(new String[] {"4", "13", "5", "/", "+"}) == 6,
            evalRPN(new String[] {"10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"}) == 22,
            evalRPN(new String[] {"-7", "2", "/"}) == -3,
            generateParenthesis(3).equals(List.of("((()))", "(()())", "(())()", "()(())", "()()()")), generateParenthesis(4).size() == 14,
        };
        int ok = 0;
        for (boolean t : tests) if (t) ok++;
        System.out.printf("%d/%d ca đúng%n", ok, tests.length);
    }
}
