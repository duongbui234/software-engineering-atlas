// Letter Combinations of a Phone Number (LeetCode 17): ba cách cho cùng một bài.
// Chạy: java keypad.java
import java.util.*;

public class keypad {
    static final String[] KEYS = {"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};
    static int calls = 0;

    // Cách 1: quay lui với một StringBuilder làm bộ đệm, thêm rồi gỡ ở mỗi tầng.
    static List<String> combineBacktrack(String digits) {
        List<String> result = new ArrayList<>();
        if (digits.isEmpty()) return result; // chuỗi rỗng cho [], không phải [""]
        walk(digits, 0, new StringBuilder(), result);
        return result;
    }

    static void walk(String digits, int index, StringBuilder buffer, List<String> result) {
        calls++;
        if (index == digits.length()) {
            result.add(buffer.toString());
            return;
        }
        for (char letter : KEYS[digits.charAt(index) - '0'].toCharArray()) {
            buffer.append(letter);
            walk(digits, index + 1, buffer, result);
            buffer.deleteCharAt(buffer.length() - 1);
        }
    }

    // Cách 2: dựng dần theo từng chữ số, nối mỗi tiền tố với mọi chữ cái của phím kế tiếp.
    static List<String> combineIterative(String digits) {
        if (digits.isEmpty()) return new ArrayList<>();
        List<String> layer = new ArrayList<>(List.of(""));
        for (char digit : digits.toCharArray()) {
            List<String> next = new ArrayList<>();
            for (String prefix : layer) {
                for (char letter : KEYS[digit - '0'].toCharArray()) next.add(prefix + letter);
            }
            layer = next;
        }
        return layer;
    }

    // Cách 3: bộ đếm hỗn cơ số, mỗi vị trí đếm từ 0 tới số chữ cái của phím đó.
    static List<String> combineCounter(String digits) {
        List<String> result = new ArrayList<>();
        int n = digits.length();
        if (n == 0) return result;
        int[] odometer = new int[n];
        char[] word = new char[n];
        while (true) {
            for (int i = 0; i < n; i++) word[i] = KEYS[digits.charAt(i) - '0'].charAt(odometer[i]);
            result.add(new String(word));
            int pos = n - 1;
            while (pos >= 0 && odometer[pos] == KEYS[digits.charAt(pos) - '0'].length() - 1) {
                odometer[pos] = 0;
                pos--;
            }
            if (pos < 0) return result;
            odometer[pos]++;
        }
    }

    record Case(String digits, int count, String first, String last, String full) {}

    static final Case[] CASES = {
        new Case("23", 9, "ad", "cf", "ad,ae,af,bd,be,bf,cd,ce,cf"),
        new Case("", 0, "", "", ""),
        new Case("2", 3, "a", "c", "a,b,c"),
        new Case("7", 4, "p", "s", "p,q,r,s"),
        new Case("9", 4, "w", "z", "w,x,y,z"),
        new Case("22", 9, "aa", "cc", "aa,ab,ac,ba,bb,bc,ca,cb,cc"),
        new Case("79", 16, "pw", "sz", null),
        new Case("56", 9, "jm", "lo", null),
        new Case("234", 27, "adg", "cfi", null),
        new Case("2345", 81, "adgj", "cfil", null),
        new Case("7999", 256, "pwww", "szzz", null),
    };

    static boolean fits(List<String> got, Case c) {
        if (got.size() != c.count()) return false;
        if (c.count() > 0 && (!got.get(0).equals(c.first()) || !got.get(c.count() - 1).equals(c.last()))) return false;
        if (c.full() != null && !String.join(",", got).equals(c.full())) return false;
        return new HashSet<>(got).size() == got.size();
    }

    static int total = 0, same = 0;

    static void each(String prefix) {
        total++;
        List<String> want = combineIterative(prefix);
        if (combineBacktrack(prefix).equals(want) && combineCounter(prefix).equals(want)) same++;
        if (prefix.length() < 4) for (char d : "23456789".toCharArray()) each(prefix + d);
    }

    public static void main(String[] args) {
        int ok = 0;
        for (Case c : CASES) {
            if (fits(combineBacktrack(c.digits()), c) && fits(combineIterative(c.digits()), c) && fits(combineCounter(c.digits()), c)) ok++;
            else System.out.println("sai ở \"" + c.digits() + "\"");
        }
        System.out.println(ok + "/" + CASES.length + " ca đúng");

        // Đối chiếu: mọi chuỗi chữ số 2–9 dài 0–4, so với cách dựng lặp.
        each("");
        System.out.println(same + "/" + total + " ca đúng (đối chiếu tích Descartes lặp)");

        calls = 0;
        List<String> sample = combineBacktrack("7999");
        System.out.println("7999: " + sample.size() + " tổ hợp, " + calls + " lượt gọi quay lui");
    }
}
