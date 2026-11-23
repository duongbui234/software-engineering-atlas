// LeetCode 150, Evaluate Reverse Polish Notation: hai cách đúng, một bản sai, test.
// Chạy: java eval-rpn.java
import java.util.*;

class EvalRpn {
    static int apply(String op, int a, int b) {
        return switch (op) {
            case "+" -> a + b;
            case "-" -> a - b;
            case "*" -> a * b;
            default -> a / b; // chia int của Java làm tròn về 0; Math.floorDiv thì làm tròn xuống
        };
    }

    static boolean isOp(String t) { return t.equals("+") || t.equals("-") || t.equals("*") || t.equals("/"); } // equals, không phải ==

    static int evalStack(String[] tokens) {
        ArrayDeque<Integer> st = new ArrayDeque<>();
        for (String t : tokens) {
            if (isOp(t)) {
                int b = st.pop(), a = st.pop();
                st.push(apply(t, a, b));
            } else st.push(Integer.parseInt(t));
        }
        return st.pop();
    }

    static int[] pos = {0};

    static int evalRecursive(String[] tokens) {
        pos[0] = tokens.length - 1;
        return walk(tokens);
    }

    static int walk(String[] tokens) {
        String t = tokens[pos[0]--];
        if (!isOp(t)) return Integer.parseInt(t);
        int b = walk(tokens), a = walk(tokens);
        return apply(t, a, b);
    }

    static int evalFloorDiv(String[] tokens) { // SAI: Math.floorDiv
        ArrayDeque<Integer> st = new ArrayDeque<>();
        for (String t : tokens) {
            if (isOp(t)) {
                int b = st.pop(), a = st.pop();
                st.push(t.equals("/") ? Math.floorDiv(a, b) : apply(t, a, b));
            } else st.push(Integer.parseInt(t));
        }
        return st.pop();
    }

    public static void main(String[] args) {
        String[][] in = {{"2", "1", "+", "3", "*"}, {"4", "13", "5", "/", "+"},
            {"10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"}, {"3", "4", "-"}, {"7", "-2", "/"}, {"-7", "2", "/"}, {"42"}};
        int[] want = {9, 6, 22, -1, -3, -3, 42};
        for (String name : new String[] {"evalStack", "evalRecursive", "evalFloorDiv"}) {
            int ok = 0;
            for (int i = 0; i < in.length; i++) {
                int got = switch (name) {
                    case "evalStack" -> evalStack(in[i]);
                    case "evalRecursive" -> evalRecursive(in[i]);
                    default -> evalFloorDiv(in[i]);
                };
                if (got == want[i]) ok++;
            }
            System.out.printf("%-14s %d/%d ca đúng%n", name, ok, in.length);
        }
        List<String> deep = new ArrayList<>(List.of("1"));
        for (int k = 0; k < 100_000; k++) { deep.add("1"); deep.add("+"); }
        String[] d = deep.toArray(new String[0]);
        try {
            System.out.println("\nđệ quy 10⁵ tầng: " + evalRecursive(d));
        } catch (StackOverflowError e) {
            System.out.println("\nđệ quy 10⁵ tầng: StackOverflowError");
        }
        System.out.println("ngăn xếp 10⁵ tầng: " + evalStack(d));
    }
}
