// LC 141 Linked List Cycle: HashSet các nút đã thăm, rùa và thỏ (Floyd), tìm đầu vòng (LC 142), và hai bẫy.
// Chạy: java list-cycle.java
import java.util.*;
import java.util.function.Function;

class ListCycle {
    static class ListNode {
        int val;
        ListNode next;
        ListNode(int val) { this.val = val; }
    }

    // Bẫy: nút ghi đè equals/hashCode theo giá trị. HashSet khi đó coi hai nút cùng val là một.
    static class ValueNode extends ListNode {
        ValueNode(int val) { super(val); }
        @Override public boolean equals(Object o) { return o instanceof ListNode n && n.val == val; }
        @Override public int hashCode() { return Integer.hashCode(val); }
    }

    static ListNode[] build(int[] vals, int pos, boolean byValue) {
        ListNode[] nodes = new ListNode[vals.length];
        for (int i = 0; i < vals.length; i++) nodes[i] = byValue ? new ValueNode(vals[i]) : new ListNode(vals[i]);
        for (int i = 0; i + 1 < nodes.length; i++) nodes[i].next = nodes[i + 1];
        if (pos >= 0 && nodes.length > 0) nodes[nodes.length - 1].next = nodes[pos];
        return nodes;
    }

    // Cách 1: HashSet các nút. Mặc định Object.equals là so danh tính (==), nên set nhớ đúng nút.
    static boolean hasCycleSet(ListNode head) {
        Set<ListNode> seen = new HashSet<>();
        for (ListNode cur = head; cur != null; cur = cur.next) {
            if (!seen.add(cur)) return true;
        }
        return false;
    }

    // Cách 2: rùa và thỏ, so sánh bằng == (cùng một object).
    static boolean hasCycleFloyd(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) return true;
        }
        return false;
    }

    // LC 142: gặp nhau xong, đưa một con về đầu; cùng đi 1 bước, chỗ gặp lại là đầu vòng.
    static ListNode detectCycle(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) {
                ListNode a = head;
                while (a != slow) { a = a.next; slow = slow.next; }
                return a;
            }
        }
        return null;
    }

    // SAI: quên kiểm fast.next. Số nút lẻ, không vòng thì fast.next là null và fast.next.next ném NullPointerException.
    static boolean wrongNoNextCheck(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) return true;
        }
        return false;
    }

    record Case(String name, int[] vals, int pos, boolean want) {}

    static final Case[] CASES = {
        new Case("ví dụ 1 của đề", new int[]{3, 2, 0, -4}, 1, true),
        new Case("ví dụ 2 của đề", new int[]{1, 2}, 0, true),
        new Case("ví dụ 3 của đề", new int[]{1}, -1, false),
        new Case("rỗng", new int[]{}, -1, false),
        new Case("một nút tự trỏ", new int[]{1}, 0, true),
        new Case("giá trị trùng, không vòng", new int[]{1, 1, 1}, -1, false),
        new Case("chẵn, không vòng", new int[]{1, 2, 3, 4, 5, 6}, -1, false),
        new Case("lẻ, không vòng", new int[]{1, 2, 3, 4, 5}, -1, false),
        new Case("nút cuối tự trỏ", new int[]{1, 2, 3, 4, 5}, 4, true),
        new Case("toàn số 0, có vòng", new int[]{0, 0, 0, 0, 0}, 1, true),
    };

    static void check(String name, Function<ListNode, Boolean> fn, boolean byValue) {
        List<String> bad = new ArrayList<>();
        for (Case c : CASES) {
            ListNode[] nodes = build(c.vals(), c.pos(), byValue);
            String got;
            try { got = String.valueOf(fn.apply(nodes.length > 0 ? nodes[0] : null)); }
            catch (RuntimeException e) { got = "ném " + e.getClass().getSimpleName(); }
            if (!got.equals(String.valueOf(c.want()))) bad.add(c.name() + " → " + got);
        }
        System.out.printf("%-26s %d/%d ca đúng%s%n", name, CASES.length - bad.size(), CASES.length,
            bad.isEmpty() ? "" : "; sai ở " + String.join(", ", bad));
    }

    static double medianMs(Runnable r) {
        double[] ts = new double[5];
        for (int i = 0; i < 5; i++) { long t0 = System.nanoTime(); r.run(); ts[i] = (System.nanoTime() - t0) / 1e6; }
        Arrays.sort(ts);
        return ts[2];
    }

    public static void main(String[] args) {
        check("hasCycleSet", ListCycle::hasCycleSet, false);
        check("hasCycleFloyd", ListCycle::hasCycleFloyd, false);
        check("hasCycleSet (ValueNode)", ListCycle::hasCycleSet, true);
        check("hasCycleFloyd (ValueNode)", ListCycle::hasCycleFloyd, true);
        check("wrongNoNextCheck", ListCycle::wrongNoNextCheck, false);
        int ok = 0;
        for (Case c : CASES) {
            ListNode[] nodes = build(c.vals(), c.pos(), false);
            ListNode want = c.pos() >= 0 ? nodes[c.pos()] : null;
            if (detectCycle(nodes.length > 0 ? nodes[0] : null) == want) ok++;
        }
        System.out.printf("%-26s %d/%d ca đúng (LC 142)%n", "detectCycle", ok, CASES.length);

        System.out.println("\nn nút      dạng            HashSet      Floyd");
        for (int n : new int[]{100_000, 1_000_000}) {
            for (int pos : new int[]{-1, n / 2}) {
                ListNode head = build(new int[n], pos, false)[0];
                double tSet = medianMs(() -> hasCycleSet(head));
                double tFloyd = medianMs(() -> hasCycleFloyd(head));
                System.out.printf("%-10d %-15s %8.2f ms  %8.2f ms%n", n, pos < 0 ? "không vòng" : "vòng ở giữa", tSet, tFloyd);
            }
        }
    }
}
