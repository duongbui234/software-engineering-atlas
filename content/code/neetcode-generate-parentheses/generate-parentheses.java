// LeetCode 22, Generate Parentheses: quay lui với StringBuilder, ngăn xếp tự quản, một bản quên "bỏ ra", và test.
// Chạy: java generate-parentheses.java
import java.util.*;

class GenerateParentheses {
    static List<String> backtrack(int n) {
        List<String> out = new ArrayList<>();
        go(new StringBuilder(), 0, 0, n, out);
        return out;
    }

    static void go(StringBuilder sb, int open, int close, int n, List<String> out) {
        if (sb.length() == 2 * n) { out.add(sb.toString()); return; } // toString sao chép nội dung
        if (open < n) {
            sb.append('(');
            go(sb, open + 1, close, n, out);
            sb.setLength(sb.length() - 1); // bỏ ký tự vừa thêm: StringBuilder là MỘT bộ đệm dùng chung
        }
        if (close < open) {
            sb.append(')');
            go(sb, open, close + 1, n, out);
            sb.setLength(sb.length() - 1);
        }
    }

    // SAI: quên setLength sau mỗi nhánh, nên ký tự của nhánh trước còn nằm lại trong bộ đệm.
    static List<String> forgetUndo(int n) {
        List<String> out = new ArrayList<>();
        goNoUndo(new StringBuilder(), 0, 0, n, out);
        return out;
    }

    static void goNoUndo(StringBuilder sb, int open, int close, int n, List<String> out) {
        if (sb.length() >= 2 * n) { out.add(sb.toString()); return; }
        if (open < n) { sb.append('('); goNoUndo(sb, open + 1, close, n, out); }
        if (close < open) { sb.append(')'); goNoUndo(sb, open, close + 1, n, out); }
    }

    static List<String> explicitStack(int n) {
        record State(String s, int open, int close) {}
        List<String> out = new ArrayList<>();
        Deque<State> st = new ArrayDeque<>();
        st.push(new State("", 0, 0));
        while (!st.isEmpty()) {
            State t = st.pop();
            if (t.s().length() == 2 * n) { out.add(t.s()); continue; }
            if (t.close() < t.open()) st.push(new State(t.s() + ")", t.open(), t.close() + 1));
            if (t.open() < n) st.push(new State(t.s() + "(", t.open() + 1, t.close()));
        }
        return out;
    }

    static boolean correct(List<String> out, int n) {
        long cat = 1;
        for (int i = 0; i < n; i++) cat = cat * 2 * (2 * i + 1) / (i + 2);
        if (out.size() != cat || new HashSet<>(out).size() != out.size()) return false;
        for (String s : out) {
            int bal = 0;
            for (char ch : s.toCharArray()) { bal += ch == '(' ? 1 : -1; if (bal < 0) return false; }
            if (bal != 0 || s.length() != 2 * n) return false;
        }
        return true;
    }

    public static void main(String[] args) {
        for (String name : new String[] {"backtrack", "explicitStack", "forgetUndo"}) {
            int ok = 0;
            for (int n = 1; n <= 8; n++) {
                List<String> got = switch (name) {
                    case "backtrack" -> backtrack(n);
                    case "explicitStack" -> explicitStack(n);
                    default -> forgetUndo(n);
                };
                if (correct(got, n)) ok++;
            }
            System.out.printf("%-14s %d/8 ca đúng%n", name, ok);
        }
        System.out.println("\nforgetUndo(2) = " + forgetUndo(2));
    }
}
