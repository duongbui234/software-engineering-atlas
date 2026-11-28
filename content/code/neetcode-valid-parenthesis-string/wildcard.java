// Valid Parenthesis String (LeetCode 678): vét cạn 3^k cách hiểu, DP nhớ (i, số mở), hai ngăn xếp, khoảng [lo, hi]
// Chạy: java wildcard.java
import java.util.ArrayDeque;
import java.util.Arrays;

public class wildcard {
    static long steps = 0;

    // Vét cạn: thử mọi cách hiểu của từng dấu * (")" , rỗng, "("), kiểm từng chuỗi ngoặc thu được
    static boolean checkBrute(String s) {
        return bruteGo(s, 0, new StringBuilder());
    }

    static boolean balanced(StringBuilder buf) {
        int open = 0;
        for (int k = 0; k < buf.length(); k++) {
            open += buf.charAt(k) == '(' ? 1 : -1;
            if (open < 0) return false;
        }
        return open == 0;
    }

    static boolean bruteGo(String s, int i, StringBuilder buf) {
        if (i == s.length()) {
            steps++; // một cách hiểu trọn vẹn
            return balanced(buf);
        }
        char c = s.charAt(i);
        if (c != '*') {
            buf.append(c);
            boolean r = bruteGo(s, i + 1, buf);
            buf.setLength(buf.length() - 1);
            return r;
        }
        boolean found = false;
        for (char pick : new char[] {')', 0, '('}) {
            if (pick != 0) buf.append(pick);
            if (bruteGo(s, i + 1, buf)) found = true; // không dừng sớm: đếm đủ 3^k cách hiểu
            if (pick != 0) buf.setLength(buf.length() - 1);
        }
        return found;
    }

    // DP nhớ: f(i, open) = phần s[i..] có đóng được đúng open ngoặc đang mở không
    static boolean checkDP(String s) {
        int n = s.length();
        byte[] memo = new byte[(n + 1) * (n + 2)];
        Arrays.fill(memo, (byte) -1); // -1: chưa tính, 0: sai, 1: đúng
        return dp(s, 0, 0, memo);
    }

    static boolean dp(String s, int i, int open, byte[] memo) {
        int n = s.length();
        if (open < 0) return false; // đóng nhiều hơn mở ở một tiền tố
        if (i == n) return open == 0;
        int key = i * (n + 2) + open;
        if (memo[key] != -1) return memo[key] == 1;
        steps++; // một trạng thái mới
        char c = s.charAt(i);
        boolean r;
        if (c == '(') r = dp(s, i + 1, open + 1, memo);
        else if (c == ')') r = dp(s, i + 1, open - 1, memo);
        else r = dp(s, i + 1, open - 1, memo) || dp(s, i + 1, open, memo) || dp(s, i + 1, open + 1, memo);
        memo[key] = (byte) (r ? 1 : 0);
        return r;
    }

    // Hai ngăn xếp chỉ số: ")" ăn "(" gần nhất trước, hết thì ăn "*"; cuối cùng mỗi "(" còn lại cần một "*" đứng sau nó
    static boolean checkStacks(String s) {
        ArrayDeque<Integer> opens = new ArrayDeque<>();
        ArrayDeque<Integer> stars = new ArrayDeque<>();
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c == '(') opens.push(i);
            else if (c == '*') stars.push(i);
            else if (!opens.isEmpty()) opens.pop();
            else if (!stars.isEmpty()) stars.pop();
            else return false; // ")" không có gì để khớp
        }
        while (!opens.isEmpty() && !stars.isEmpty()) {
            if (opens.pop() > stars.pop()) return false; // "*" đứng trước "(" thì không đóng được nó
        }
        return opens.isEmpty();
    }

    // Cách chính: giữ khoảng [lo, hi] các số ngoặc mở có thể có
    static boolean checkValidString(String s) {
        int lo = 0; // số ngoặc mở ít nhất có thể
        int hi = 0; // số ngoặc mở nhiều nhất có thể
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            steps++;
            if (c == '(') {
                lo++;
                hi++;
            } else if (c == ')') {
                lo--;
                hi--;
            } else {
                lo--; // "*" là ")"
                hi++; // "*" là "("
            }
            if (hi < 0) return false; // kể cả coi mọi "*" là "(" vẫn đóng thừa
            if (lo < 0) lo = 0; // bỏ các cách hiểu làm số mở âm
        }
        return lo == 0; // 0 nằm trong khoảng: có cách hiểu đóng hết
    }

    // Bản sai: không kẹp lo về 0, rồi "sửa" bằng lo <= 0
    static boolean checkNoClamp(String s) {
        int lo = 0, hi = 0;
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c == '(') {
                lo++;
                hi++;
            } else if (c == ')') {
                lo--;
                hi--;
            } else {
                lo--;
                hi++;
            }
            if (hi < 0) return false;
        }
        return lo <= 0;
    }

    static int total = 0, good = 0, wrong = 0;

    static void gen(String prefix) {
        if (!prefix.isEmpty()) {
            total++;
            boolean b = checkBrute(prefix);
            if (checkDP(prefix) == b && checkStacks(prefix) == b && checkValidString(prefix) == b) good++;
            if (checkNoClamp(prefix) != b) wrong++;
        }
        if (prefix.length() == 8) return;
        for (char c : "()*".toCharArray()) gen(prefix + c);
    }

    public static void main(String[] args) {
        String[] ss = {"*", ")", "*(", "(*", "((*", "(()*", "*)(*", "(*)*)(", "**())", "((**)"};
        boolean[] want = {true, false, false, true, false, true, true, false, true, true};
        int ok = 0;
        for (int k = 0; k < ss.length; k++) {
            String s = ss[k];
            boolean[] got = {checkBrute(s), checkDP(s), checkStacks(s), checkValidString(s)};
            boolean all = true;
            for (boolean g : got) if (g != want[k]) all = false;
            if (all) ok++;
            else System.out.println("sai ở " + s + " " + Arrays.toString(got));
        }
        System.out.printf("%d/%d ca đúng%n", ok, ss.length);

        // Đối chiếu: mọi chuỗi độ dài 1–8 trên ba ký tự ( ) *
        gen("");
        System.out.printf("%d/%d ca đúng (đối chiếu vét cạn)%n", good, total);
        System.out.printf("Không kẹp lo: sai %d/%d ca%n", wrong, total);

        // Đo ở giới hạn n = 100: 99 dấu * rồi một "(", đáp án sai nên DP phải đi hết mọi trạng thái
        String big = "*".repeat(99) + "(";
        steps = 0;
        long t0 = System.nanoTime();
        boolean d = checkDP(big);
        double dpMs = (System.nanoTime() - t0) / 1e6;
        long dc = steps;
        steps = 0;
        t0 = System.nanoTime();
        boolean g = checkValidString(big);
        double greedyMs = (System.nanoTime() - t0) / 1e6;
        long gc = steps;
        System.out.printf("n = 100, đáp án %b/%b: DP %d trạng thái (%.2f ms), khoảng [lo, hi] %d bước (%.3f ms)%n", d, g, dc, dpMs, gc, greedyMs);

        // Vét cạn ở cỡ nhỏ: 12 dấu * rồi một "("
        String small = "*".repeat(12) + "(";
        steps = 0;
        t0 = System.nanoTime();
        boolean b = checkBrute(small);
        double bruteMs = (System.nanoTime() - t0) / 1e6;
        System.out.printf("n = 13, đáp án %b: vét cạn %d cách hiểu (%.1f ms)%n", b, steps, bruteMs);
    }
}
