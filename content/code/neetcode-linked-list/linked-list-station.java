// Ga LINK-01: con trỏ trên danh sách liên kết. Giải 206, 21, 141, 143, 19.
// Chạy: java linked-list-station.java
import java.util.*;
import java.util.function.Supplier;

class LinkedListStation {
    static class ListNode {
        int val;
        ListNode next;
        ListNode(int val, ListNode next) { this.val = val; this.next = next; }
    }

    static ListNode fromArray(int... a) {
        ListNode head = null;
        for (int i = a.length - 1; i >= 0; i--) head = new ListNode(a[i], head);
        return head;
    }

    static List<Integer> toList(ListNode head) {
        List<Integer> out = new ArrayList<>();
        for (ListNode p = head; p != null; p = p.next) out.add(p.val);
        return out;
    }

    static ListNode withCycle(int pos, int... a) {
        ListNode head = fromArray(a);
        if (pos < 0 || head == null) return head;
        ListNode target = null, tail = null;
        int i = 0;
        for (ListNode p = head; p != null; p = p.next, i++) { if (i == pos) target = p; tail = p; }
        tail.next = target;
        return head;
    }

    // 206: lật từng con trỏ.
    static ListNode reverseList(ListNode head) {
        ListNode prev = null, cur = head;
        while (cur != null) { ListNode next = cur.next; cur.next = prev; prev = cur; cur = next; }
        return prev;
    }

    // 21: nút giả đứng trước kết quả.
    static ListNode mergeTwoLists(ListNode a, ListNode b) {
        ListNode dummy = new ListNode(0, null), tail = dummy;
        while (a != null && b != null) {
            if (a.val <= b.val) { tail.next = a; a = a.next; } else { tail.next = b; b = b.next; }
            tail = tail.next;
        }
        tail.next = a != null ? a : b;
        return dummy.next;
    }

    // 141: so hai tham chiếu bằng ==, tức cùng một đối tượng.
    static boolean hasCycle(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) return true;
        }
        return false;
    }

    // 143: tìm giữa, lật nửa sau, đan hai nửa.
    static void reorderList(ListNode head) {
        if (head == null || head.next == null) return;
        ListNode slow = head, fast = head;
        while (fast.next != null && fast.next.next != null) { slow = slow.next; fast = fast.next.next; }
        ListNode second = reverseList(slow.next);
        slow.next = null;
        for (ListNode first = head; second != null; ) {
            ListNode n1 = first.next, n2 = second.next;
            first.next = second;
            second.next = n1;
            first = n1;
            second = n2;
        }
    }

    // 19: nút giả, con trước đi trước n + 1 bước.
    static ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode dummy = new ListNode(0, head), lead = dummy, lag = dummy;
        for (int i = 0; i <= n; i++) lead = lead.next;
        while (lead != null) { lead = lead.next; lag = lag.next; }
        lag.next = lag.next.next;
        return dummy.next;
    }

    static List<Integer> reordered(int... a) { ListNode h = fromArray(a); reorderList(h); return toList(h); }

    public static void main(String[] args) {
        Object[][] cases = {
            {"206 ví dụ", (Supplier<Object>) () -> toList(reverseList(fromArray(1, 2, 3, 4, 5))), List.of(5, 4, 3, 2, 1)},
            {"206 rỗng", (Supplier<Object>) () -> toList(reverseList(null)), List.of()},
            {"21 ví dụ", (Supplier<Object>) () -> toList(mergeTwoLists(fromArray(1, 2, 4), fromArray(1, 3, 4))), List.of(1, 1, 2, 3, 4, 4)},
            {"21 hai rỗng", (Supplier<Object>) () -> toList(mergeTwoLists(null, null)), List.of()},
            {"21 một rỗng", (Supplier<Object>) () -> toList(mergeTwoLists(null, fromArray(0))), List.of(0)},
            {"141 vòng về nút 1", (Supplier<Object>) () -> hasCycle(withCycle(1, 3, 2, 0, -4)), true},
            {"141 vòng về nút 0", (Supplier<Object>) () -> hasCycle(withCycle(0, 1, 2)), true},
            {"141 không vòng", (Supplier<Object>) () -> hasCycle(withCycle(-1, 1)), false},
            {"143 chẵn", (Supplier<Object>) () -> reordered(1, 2, 3, 4), List.of(1, 4, 2, 3)},
            {"143 lẻ", (Supplier<Object>) () -> reordered(1, 2, 3, 4, 5), List.of(1, 5, 2, 4, 3)},
            {"143 một nút", (Supplier<Object>) () -> reordered(1), List.of(1)},
            {"19 ví dụ", (Supplier<Object>) () -> toList(removeNthFromEnd(fromArray(1, 2, 3, 4, 5), 2)), List.of(1, 2, 3, 5)},
            {"19 xóa nút duy nhất", (Supplier<Object>) () -> toList(removeNthFromEnd(fromArray(1), 1)), List.of()},
            {"19 xóa nút đầu", (Supplier<Object>) () -> toList(removeNthFromEnd(fromArray(1, 2), 2)), List.of(2)},
        };
        List<String> bad = new ArrayList<>();
        for (Object[] c : cases) {
            @SuppressWarnings("unchecked") Supplier<Object> f = (Supplier<Object>) c[1];
            if (!f.get().equals(c[2])) bad.add((String) c[0]);
        }
        System.out.println("linked-list-station " + (cases.length - bad.size()) + "/" + cases.length + " ca đúng" + (bad.isEmpty() ? "" : "; sai ở " + bad));
    }
}
