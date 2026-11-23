// LC 2 Add Two Numbers: cộng từng chữ số có nhớ, đổi qua long (tràn im lặng, hoặc parseLong ném lỗi), và BigInteger.
// Chạy: java add-two-numbers.java
import java.math.BigInteger;
import java.util.*;

class Main {
    static class ListNode {
        int val;
        ListNode next;
        ListNode(int val, ListNode next) { this.val = val; this.next = next; }
    }

    static ListNode build(int[] d) {
        ListNode head = null;
        for (int i = d.length - 1; i >= 0; i--) head = new ListNode(d[i], head);
        return head;
    }

    static List<Integer> toList(ListNode h) {
        List<Integer> out = new ArrayList<>();
        for (; h != null; h = h.next) out.add(h.val);
        return out;
    }

    // Cách chuẩn: cộng từng cặp chữ số, mang số nhớ sang nút sau, nút giả giữ đầu kết quả.
    static ListNode addDigits(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode(0, null), tail = dummy;
        int carry = 0;
        while (l1 != null || l2 != null || carry != 0) {
            int sum = carry;
            if (l1 != null) { sum += l1.val; l1 = l1.next; }
            if (l2 != null) { sum += l2.val; l2 = l2.next; }
            carry = sum / 10;
            tail.next = new ListNode(sum % 10, null);
            tail = tail.next;
        }
        return dummy.next;
    }

    static ListNode fromString(String s) {
        int[] d = new int[s.length()];
        for (int i = 0; i < s.length(); i++) d[s.length() - 1 - i] = s.charAt(i) - '0';
        return build(d);
    }

    static String digitsForward(ListNode l) {
        StringBuilder sb = new StringBuilder();
        for (; l != null; l = l.next) sb.append(l.val);
        return sb.reverse().toString();
    }

    // SAI: tự cộng dồn vào long. Quá 19 chữ số thì tràn, quay vòng không báo lỗi.
    static ListNode wrongViaLong(ListNode l1, ListNode l2) {
        long a = 0, b = 0, p = 1;
        for (ListNode c = l1; c != null; c = c.next, p *= 10) a += c.val * p;
        p = 1;
        for (ListNode c = l2; c != null; c = c.next, p *= 10) b += c.val * p;
        return fromString(Long.toString(a + b).replace("-", ""));
    }

    // SAI: Long.parseLong. Quá phạm vi long thì ném NumberFormatException.
    static ListNode wrongParseLong(ListNode l1, ListNode l2) {
        return fromString(Long.toString(Long.parseLong(digitsForward(l1)) + Long.parseLong(digitsForward(l2))));
    }

    // Đúng nhưng vòng vèo: BigInteger.
    static ListNode viaBigInteger(ListNode l1, ListNode l2) {
        return fromString(new BigInteger(digitsForward(l1)).add(new BigInteger(digitsForward(l2))).toString());
    }

    static List<Integer> reference(int[] a, int[] b) {
        List<Integer> out = new ArrayList<>();
        int carry = 0;
        for (int i = 0; i < Math.max(a.length, b.length) || carry > 0; i++) {
            int s = carry + (i < a.length ? a[i] : 0) + (i < b.length ? b[i] : 0);
            out.add(s % 10);
            carry = s / 10;
        }
        return out;
    }

    static int[] randomDigits(Random r, int n) {
        int[] d = new int[n];
        for (int i = 0; i < n; i++) d[i] = r.nextInt(10);
        if (n > 1 && d[n - 1] == 0) d[n - 1] = 1 + r.nextInt(9);
        return d;
    }

    interface Adder { ListNode add(ListNode a, ListNode b); }

    public static void main(String[] args) {
        Random r = new Random(2);
        String[] names = {"ví dụ 1 của đề", "ví dụ 2", "ví dụ 3", "[9,9] + [1]", "dài lệch nhau", "100 chữ số (giới hạn đề)"};
        int[][][] cases = {
            {{2, 4, 3}, {5, 6, 4}}, {{0}, {0}}, {{9, 9, 9, 9, 9, 9, 9}, {9, 9, 9, 9}}, {{9, 9}, {1}},
            {{1}, {9, 9, 9, 9, 9, 8}}, {randomDigits(r, 100), randomDigits(r, 100)},
        };
        String[] fnNames = {"addDigits", "wrongViaLong", "wrongParseLong", "viaBigInteger"};
        Adder[] fns = {Main::addDigits, Main::wrongViaLong, Main::wrongParseLong, Main::viaBigInteger};
        for (int f = 0; f < fns.length; f++) {
            List<String> bad = new ArrayList<>();
            for (int i = 0; i < cases.length; i++) {
                try {
                    List<Integer> got = toList(fns[f].add(build(cases[i][0]), build(cases[i][1])));
                    if (!got.equals(reference(cases[i][0], cases[i][1]))) bad.add(names[i] + " → " + got.size() + " chữ số");
                } catch (RuntimeException e) {
                    bad.add(names[i] + " → ném " + e.getClass().getSimpleName());
                }
            }
            System.out.printf("%-15s %d/%d ca đúng%s%n", fnNames[f], cases.length - bad.size(), cases.length, bad.isEmpty() ? "" : "; sai ở " + String.join(", ", bad));
        }
        System.out.println("\nLong.MAX_VALUE + 1 = " + (Long.MAX_VALUE + 1));

        System.out.println("\nn chữ số   từng chữ số     qua BigInteger");
        for (int n : new int[]{1000, 10000, 100000, 1000000}) {
            int[] a = randomDigits(r, n), b = randomDigits(r, n);
            for (int w = 0; w < 3; w++) { addDigits(build(a), build(b)); if (n <= 100000) viaBigInteger(build(a), build(b)); }
            StringBuilder line = new StringBuilder(String.format("%-10d", n));
            for (Adder fn : new Adder[]{Main::addDigits, Main::viaBigInteger}) {
                double[] ts = new double[5];
                for (int i = 0; i < 5; i++) {
                    ListNode l1 = build(a), l2 = build(b);
                    long t0 = System.nanoTime();
                    fn.add(l1, l2);
                    ts[i] = (System.nanoTime() - t0) / 1e6;
                }
                Arrays.sort(ts);
                line.append(String.format(" %9.2f ms   ", ts[2]));
            }
            System.out.println(line.toString().stripTrailing());
        }
    }
}
