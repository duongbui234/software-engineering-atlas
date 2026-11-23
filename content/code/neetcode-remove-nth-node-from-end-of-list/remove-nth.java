// LeetCode 19: Remove Nth Node From End of List. Chạy: java remove-nth.java
import java.util.*;

class RemoveNth {
    static class ListNode {
        int val;
        ListNode next;
        ListNode(int val, ListNode next) { this.val = val; this.next = next; }
    }

    static ListNode fromArray(int[] a) {
        ListNode head = null;
        for (int i = a.length - 1; i >= 0; i--) head = new ListNode(a[i], head);
        return head;
    }

    static List<Integer> toList(ListNode h) {
        List<Integer> out = new ArrayList<>();
        for (; h != null; h = h.next) out.add(h.val);
        return out;
    }

    // Hai lượt: đếm độ dài, rồi đi L − n bước từ nút giả.
    static ListNode twoPass(ListNode head, int n) {
        int len = 0;
        for (ListNode p = head; p != null; p = p.next) len++;
        ListNode dummy = new ListNode(0, head), prev = dummy;
        for (int i = 0; i < len - n; i++) prev = prev.next;
        prev.next = prev.next.next;
        return dummy.next;
    }

    // Một lượt: fast đi trước n + 1 bước từ nút giả, rồi hai con trỏ cùng đi.
    static ListNode onePass(ListNode head, int n) {
        ListNode dummy = new ListNode(0, head), fast = dummy, slow = dummy;
        for (int i = 0; i <= n; i++) fast = fast.next;
        while (fast != null) { fast = fast.next; slow = slow.next; }
        slow.next = slow.next.next;
        return dummy.next;
    }

    // SAI: không có nút giả; n = L thì fast là null và fast.next ném NullPointerException.
    static ListNode wrongNoDummy(ListNode head, int n) {
        ListNode fast = head, slow = head;
        for (int i = 0; i < n; i++) fast = fast.next;
        while (fast.next != null) { fast = fast.next; slow = slow.next; }
        slow.next = slow.next.next;
        return head;
    }

    interface Remover { ListNode apply(ListNode h, int n); }

    public static void main(String[] args) {
        int[][] arrays = {{1, 2, 3, 4, 5}, {1}, {1, 2}, {1, 2}, {1, 2, 3}, {1, 2, 3}, {5, 6, 7, 8}, {1, 2, 3, 4, 5, 6, 7, 8, 9, 10}};
        int[] ns = {2, 1, 1, 2, 3, 1, 3, 5};
        String[] names = {"twoPass", "onePass", "wrongNoDummy"};
        Remover[] fns = {RemoveNth::twoPass, RemoveNth::onePass, RemoveNth::wrongNoDummy};
        for (int f = 0; f < fns.length; f++) {
            List<String> bad = new ArrayList<>();
            for (int c = 0; c < arrays.length; c++) {
                List<Integer> want = new ArrayList<>();
                for (int i = 0; i < arrays[c].length; i++) if (i != arrays[c].length - ns[c]) want.add(arrays[c][i]);
                String got;
                try { got = toList(fns[f].apply(fromArray(arrays[c]), ns[c])).toString(); }
                catch (NullPointerException e) { got = "NullPointerException"; }
                if (!got.equals(want.toString())) bad.add(Arrays.toString(arrays[c]) + " n=" + ns[c] + " → " + got);
            }
            System.out.printf("%-13s %d/%d ca đúng%s%n", names[f], arrays.length - bad.size(), arrays.length,
                bad.isEmpty() ? "" : "; sai ở " + String.join(", ", bad));
        }

        int L = 1_000_000;
        int[] values = new int[L];
        for (int i = 0; i < L; i++) values[i] = i;
        System.out.println("\nthời gian, L = " + L + ":");
        System.out.println("n          hai lượt   một lượt");
        for (int n : new int[]{1, L / 2, L}) {
            double[] r = new double[2];
            for (int f = 0; f < 2; f++) {
                double[] ts = new double[5];
                for (int k = 0; k < 5; k++) {
                    ListNode h = fromArray(values);
                    long s = System.nanoTime();
                    fns[f].apply(h, n);
                    ts[k] = (System.nanoTime() - s) / 1e6;
                }
                Arrays.sort(ts);
                r[f] = ts[2];
            }
            System.out.printf("%-10d %6.2f ms %7.2f ms%n", n, r[0], r[1]);
        }
    }
}
