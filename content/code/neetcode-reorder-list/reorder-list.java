// LC 143 Reorder List: ba bước, ArrayDeque các nút, và bản cắt sai làm nửa sau dài hơn.
// Chạy: java reorder-list.java
import java.util.*;
import java.util.function.Consumer;

class ReorderList {
    static class ListNode {
        int val;
        ListNode next;
        ListNode(int val, ListNode next) { this.val = val; this.next = next; }
    }

    static ListNode build(int[] vals) {
        ListNode head = null;
        for (int i = vals.length - 1; i >= 0; i--) head = new ListNode(vals[i], head);
        return head;
    }

    static String show(ListNode head, int limit) {
        List<Integer> out = new ArrayList<>();
        for (ListNode cur = head; cur != null; cur = cur.next) {
            if (out.size() >= limit) return "vòng";
            out.add(cur.val);
        }
        return out.toString();
    }

    static String expected(int[] vals) {
        List<Integer> out = new ArrayList<>();
        for (int i = 0, j = vals.length - 1; i <= j; i++, j--) {
            out.add(vals[i]);
            if (i != j) out.add(vals[j]);
        }
        return out.toString();
    }

    static ListNode reverse(ListNode head) {
        ListNode prev = null, cur = head;
        while (cur != null) { ListNode nxt = cur.next; cur.next = prev; prev = cur; cur = nxt; }
        return prev;
    }

    // Cách 1: tìm giữa, cắt, đảo nửa sau, đan xen.
    static void reorderThreeSteps(ListNode head) {
        if (head == null || head.next == null) return;
        ListNode slow = head, fast = head;
        while (fast.next != null && fast.next.next != null) { slow = slow.next; fast = fast.next.next; }
        ListNode second = reverse(slow.next);
        slow.next = null;
        ListNode first = head;
        while (second != null) {
            ListNode n1 = first.next, n2 = second.next;
            first.next = second; second.next = n1;
            first = n1; second = n2;
        }
    }

    // Cách 2: ArrayDeque các nút, lần lượt lấy đầu rồi lấy cuối.
    static void reorderDeque(ListNode head) {
        Deque<ListNode> dq = new ArrayDeque<>();
        for (ListNode cur = head; cur != null; cur = cur.next) dq.addLast(cur);
        ListNode tail = null;
        boolean left = true;
        while (!dq.isEmpty()) {
            ListNode node = left ? dq.pollFirst() : dq.pollLast();
            if (tail != null) tail.next = node;
            tail = node;
            left = !left;
        }
        if (tail != null) tail.next = null;
    }

    // SAI: cắt ngay trước giữa thứ hai, nửa sau dài hơn nửa đầu. Độ dài lẻ thì first thành null trước, first.next ném lỗi.
    static void wrongSecondLonger(ListNode head) {
        if (head == null || head.next == null) return;
        ListNode prev = null, slow = head, fast = head;
        while (fast != null && fast.next != null) { prev = slow; slow = slow.next; fast = fast.next.next; }
        prev.next = null;
        ListNode second = reverse(slow), first = head;
        while (second != null) {
            ListNode n1 = first.next, n2 = second.next;
            first.next = second; second.next = n1;
            first = n1; second = n2;
        }
    }

    public static void main(String[] args) {
        int[][] cases = {{1, 2, 3, 4}, {1, 2, 3, 4, 5}, {1}, {1, 2}, {1, 2, 3}, {}, {10, 20, 30, 40, 50, 60}, {7, 7, 7, 8, 8}};
        Map<String, Consumer<ListNode>> fns = new LinkedHashMap<>();
        fns.put("reorderThreeSteps", ReorderList::reorderThreeSteps);
        fns.put("reorderDeque", ReorderList::reorderDeque);
        fns.put("wrongSecondLonger", ReorderList::wrongSecondLonger);
        for (var e : fns.entrySet()) {
            List<String> bad = new ArrayList<>();
            for (int[] vals : cases) {
                ListNode head = build(vals);
                String got;
                try { e.getValue().accept(head); got = show(head, 2 * vals.length + 2); }
                catch (RuntimeException ex) { got = "ném " + ex.getClass().getSimpleName(); }
                if (!got.equals(expected(vals))) bad.add(Arrays.toString(vals) + " → " + got);
            }
            System.out.printf("%-18s %d/%d ca đúng%s%n", e.getKey(), cases.length - bad.size(), cases.length,
                bad.isEmpty() ? "" : "; sai ở " + String.join(", ", bad));
        }

        System.out.println("\nn nút      ba bước      deque các nút");
        for (int n : new int[]{100_000, 1_000_000}) {
            StringBuilder row = new StringBuilder(String.format("%-10d", n));
            for (Consumer<ListNode> fn : List.<Consumer<ListNode>>of(ReorderList::reorderThreeSteps, ReorderList::reorderDeque)) {
                double[] ts = new double[5];
                for (int r = 0; r < 5; r++) {
                    int[] vals = new int[n];
                    for (int i = 0; i < n; i++) vals[i] = i;
                    ListNode head = build(vals);
                    long t0 = System.nanoTime();
                    fn.accept(head);
                    ts[r] = (System.nanoTime() - t0) / 1e6;
                }
                Arrays.sort(ts);
                row.append(String.format(" %8.2f ms  ", ts[2]));
            }
            System.out.println(row);
        }
    }
}
