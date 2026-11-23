// Ga LINK-02: danh sách liên kết nâng cao. Giải 138, 2, 287, 146, 23, 25.
// Chạy: java advanced-list-station.java

import java.util.*;
import java.util.function.BooleanSupplier;

public class AdvancedListStation {
    static class ListNode {
        int val; ListNode next;
        ListNode(int val, ListNode next) { this.val = val; this.next = next; }
    }

    static class RNode {
        int val; RNode next, random;
        RNode(int val) { this.val = val; }
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

    // 138: chèn bản sao sau mỗi nút, nối random qua bản sao, rồi tách hai danh sách.
    static RNode copyRandomList(RNode head) {
        for (RNode p = head; p != null; p = p.next.next) { RNode c = new RNode(p.val); c.next = p.next; p.next = c; }
        for (RNode p = head; p != null; p = p.next.next) p.next.random = p.random != null ? p.random.next : null;
        RNode dummy = new RNode(0), tail = dummy;
        for (RNode p = head; p != null; p = p.next) { RNode c = p.next; p.next = c.next; tail.next = c; tail = c; }
        return dummy.next;
    }

    // 2: cộng từng chữ số, mang số nhớ sang nút sau.
    static ListNode addTwoNumbers(ListNode a, ListNode b) {
        ListNode dummy = new ListNode(0, null), tail = dummy;
        int carry = 0;
        while (a != null || b != null || carry != 0) {
            int s = carry;
            if (a != null) { s += a.val; a = a.next; }
            if (b != null) { s += b.val; b = b.next; }
            carry = s / 10;
            tail.next = new ListNode(s % 10, null);
            tail = tail.next;
        }
        return dummy.next;
    }

    // 287: i → nums[i] là con trỏ next; số trùng là đầu vòng.
    static int findDuplicate(int[] nums) {
        int slow = 0, fast = 0;
        do { slow = nums[slow]; fast = nums[nums[fast]]; } while (slow != fast);
        int p = 0;
        while (p != slow) { p = nums[p]; slow = nums[slow]; }
        return p;
    }

    // 146: HashMap tra key → nút; danh sách hai chiều có hai nút canh.
    static class LRUCache {
        static class DNode { int key, val; DNode prev, next; DNode(int k, int v) { key = k; val = v; } }
        final int cap;
        final Map<Integer, DNode> map = new HashMap<>();
        final DNode head = new DNode(0, 0), tail = new DNode(0, 0);
        LRUCache(int capacity) { cap = capacity; head.next = tail; tail.prev = head; }
        void unlink(DNode n) { n.prev.next = n.next; n.next.prev = n.prev; }
        void pushFront(DNode n) { n.next = head.next; n.prev = head; head.next.prev = n; head.next = n; }
        int get(int key) {
            DNode n = map.get(key);
            if (n == null) return -1;
            unlink(n); pushFront(n);
            return n.val;
        }
        void put(int key, int val) {
            DNode n = map.get(key);
            if (n != null) { n.val = val; unlink(n); pushFront(n); return; }
            if (map.size() == cap) { DNode old = tail.prev; unlink(old); map.remove(old.key); }
            DNode m = new DNode(key, val);
            map.put(key, m); pushFront(m);
        }
    }

    // 23: trộn từng cặp, mỗi vòng số danh sách giảm một nửa.
    static ListNode mergeTwo(ListNode a, ListNode b) {
        ListNode dummy = new ListNode(0, null), tail = dummy;
        while (a != null && b != null) {
            if (a.val <= b.val) { tail.next = a; a = a.next; } else { tail.next = b; b = b.next; }
            tail = tail.next;
        }
        tail.next = a != null ? a : b;
        return dummy.next;
    }

    static ListNode mergeKLists(ListNode[] lists) {
        if (lists.length == 0) return null;
        List<ListNode> cur = new ArrayList<>(Arrays.asList(lists));
        while (cur.size() > 1) {
            List<ListNode> next = new ArrayList<>();
            for (int i = 0; i < cur.size(); i += 2) next.add(i + 1 < cur.size() ? mergeTwo(cur.get(i), cur.get(i + 1)) : cur.get(i));
            cur = next;
        }
        return cur.get(0);
    }

    // 25: đủ k nút thì lật khúc đó và nối lại.
    static ListNode reverseKGroup(ListNode head, int k) {
        ListNode dummy = new ListNode(0, head), groupPrev = dummy;
        while (true) {
            ListNode kth = groupPrev;
            for (int i = 0; i < k && kth != null; i++) kth = kth.next;
            if (kth == null) return dummy.next;
            ListNode groupNext = kth.next, prev = groupNext, cur = groupPrev.next;
            while (cur != groupNext) { ListNode nx = cur.next; cur.next = prev; prev = cur; cur = nx; }
            ListNode first = groupPrev.next;
            groupPrev.next = kth;
            groupPrev = first;
        }
    }

    static RNode buildRandom(int[][] spec) {
        RNode[] nodes = new RNode[spec.length];
        for (int i = 0; i < spec.length; i++) nodes[i] = new RNode(spec[i][0]);
        for (int i = 0; i < spec.length; i++) {
            if (i + 1 < spec.length) nodes[i].next = nodes[i + 1];
            if (spec[i][1] >= 0) nodes[i].random = nodes[spec[i][1]];
        }
        return spec.length == 0 ? null : nodes[0];
    }

    static String describeRandom(RNode head) {
        Map<RNode, Integer> idx = new IdentityHashMap<>();
        int i = 0;
        for (RNode p = head; p != null; p = p.next) idx.put(p, i++);
        StringBuilder sb = new StringBuilder();
        for (RNode p = head; p != null; p = p.next) sb.append(p.val).append(':').append(p.random == null ? "null" : idx.get(p.random)).append(',');
        return sb.toString();
    }

    static boolean sharesNode(RNode a, RNode b) {
        Set<RNode> s = Collections.newSetFromMap(new IdentityHashMap<>());
        for (RNode p = a; p != null; p = p.next) s.add(p);
        for (RNode p = b; p != null; p = p.next) if (s.contains(p)) return true;
        return false;
    }

    // ops: {0, key, val} là put, {1, key} là get.
    static List<Integer> runLRU(int cap, int[][] ops) {
        LRUCache c = new LRUCache(cap);
        List<Integer> out = new ArrayList<>();
        for (int[] o : ops) { if (o[0] == 1) out.add(c.get(o[1])); else c.put(o[1], o[2]); }
        return out;
    }

    public static void main(String[] args) {
        Map<String, BooleanSupplier> checks = new LinkedHashMap<>();
        checks.put("138 ví dụ của đề", () -> {
            RNode h = buildRandom(new int[][]{{7, -1}, {13, 0}, {11, 4}, {10, 2}, {1, 0}});
            String before = describeRandom(h);
            RNode c = copyRandomList(h);
            return describeRandom(c).equals(before) && describeRandom(h).equals(before) && !sharesNode(h, c);
        });
        checks.put("138 danh sách rỗng", () -> copyRandomList(null) == null);
        checks.put("2 ví dụ của đề", () -> toList(addTwoNumbers(fromArray(2, 4, 3), fromArray(5, 6, 4))).equals(List.of(7, 0, 8)));
        checks.put("2 hai số 0", () -> toList(addTwoNumbers(fromArray(0), fromArray(0))).equals(List.of(0)));
        checks.put("2 nhớ tới cuối", () -> toList(addTwoNumbers(fromArray(9, 9, 9, 9, 9, 9, 9), fromArray(9, 9, 9, 9))).equals(List.of(8, 9, 9, 9, 0, 0, 0, 1)));
        checks.put("287 [1,3,4,2,2]", () -> findDuplicate(new int[]{1, 3, 4, 2, 2}) == 2);
        checks.put("287 [3,1,3,4,2]", () -> findDuplicate(new int[]{3, 1, 3, 4, 2}) == 3);
        checks.put("287 [3,3,3,3,3]", () -> findDuplicate(new int[]{3, 3, 3, 3, 3}) == 3);
        checks.put("146 ví dụ của đề", () -> runLRU(2, new int[][]{{0, 1, 1}, {0, 2, 2}, {1, 1}, {0, 3, 3}, {1, 2}, {0, 4, 4}, {1, 1}, {1, 3}, {1, 4}}).equals(List.of(1, -1, -1, 3, 4)));
        checks.put("146 cập nhật key cũ", () -> runLRU(2, new int[][]{{0, 2, 1}, {0, 1, 1}, {0, 2, 3}, {0, 4, 1}, {1, 1}, {1, 2}}).equals(List.of(-1, 3)));
        checks.put("23 ví dụ của đề", () -> toList(mergeKLists(new ListNode[]{fromArray(1, 4, 5), fromArray(1, 3, 4), fromArray(2, 6)})).equals(List.of(1, 1, 2, 3, 4, 4, 5, 6)));
        checks.put("23 không có danh sách", () -> mergeKLists(new ListNode[0]) == null);
        checks.put("23 một danh sách rỗng", () -> mergeKLists(new ListNode[]{null}) == null);
        checks.put("25 k = 2", () -> toList(reverseKGroup(fromArray(1, 2, 3, 4, 5), 2)).equals(List.of(2, 1, 4, 3, 5)));
        checks.put("25 k = 3", () -> toList(reverseKGroup(fromArray(1, 2, 3, 4, 5), 3)).equals(List.of(3, 2, 1, 4, 5)));
        List<String> bad = new ArrayList<>();
        checks.forEach((name, f) -> { if (!f.getAsBoolean()) bad.add(name); });
        System.out.println("advanced-list-station " + (checks.size() - bad.size()) + "/" + checks.size() + " ca đúng" + (bad.isEmpty() ? "" : "; sai ở " + String.join(", ", bad)));
    }
}
