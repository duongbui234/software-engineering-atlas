// LC 25 Reverse Nodes in k-Group: lặp với nút giả, đệ quy (StackOverflowError khi n/k lớn), bản sai mất nối.
// Chạy: java reverse-k-group.java
import java.util.*;

class ReverseKGroup {
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

    static String toStr(ListNode head, int limit) {
        List<Integer> out = new ArrayList<>();
        for (; head != null; head = head.next) {
            if (out.size() >= limit) return "vòng";
            out.add(head.val);
        }
        return out.toString();
    }

    static String expected(int[] vals, int k) {
        List<Integer> out = new ArrayList<>();
        for (int i = 0; i < vals.length; i += k) {
            List<Integer> chunk = new ArrayList<>();
            for (int j = i; j < Math.min(i + k, vals.length); j++) chunk.add(vals[j]);
            if (chunk.size() == k) Collections.reverse(chunk);
            out.addAll(chunk);
        }
        return out.toString();
    }

    // Lặp: groupPrev đứng trước nhóm, kth là nút cuối nhóm.
    static ListNode reverseKGroup(ListNode head, int k) {
        ListNode dummy = new ListNode(0, head), groupPrev = dummy;
        while (true) {
            ListNode kth = groupPrev;
            for (int i = 0; i < k && kth != null; i++) kth = kth.next;
            if (kth == null) return dummy.next;
            ListNode groupNext = kth.next, prev = groupNext, cur = groupPrev.next;
            while (cur != groupNext) { ListNode nxt = cur.next; cur.next = prev; prev = cur; cur = nxt; }
            ListNode oldFirst = groupPrev.next;
            groupPrev.next = kth;
            groupPrev = oldFirst;
        }
    }

    // Đệ quy: sâu n/k tầng.
    static ListNode reverseKGroupRecursive(ListNode head, int k) {
        ListNode probe = head;
        for (int i = 0; i < k; i++) { if (probe == null) return head; probe = probe.next; }
        ListNode prev = reverseKGroupRecursive(probe, k), cur = head;
        for (int i = 0; i < k; i++) { ListNode nxt = cur.next; cur.next = prev; prev = cur; cur = nxt; }
        return prev;
    }

    // SAI: đảo nhóm với prev = null, đuôi nhóm trỏ null và mất phần còn lại.
    static ListNode wrongLoseNext(ListNode head, int k) {
        ListNode dummy = new ListNode(0, head), groupPrev = dummy;
        while (true) {
            ListNode kth = groupPrev;
            for (int i = 0; i < k && kth != null; i++) kth = kth.next;
            if (kth == null) return dummy.next;
            ListNode groupNext = kth.next, prev = null, cur = groupPrev.next;
            while (cur != groupNext) { ListNode nxt = cur.next; cur.next = prev; prev = cur; cur = nxt; }
            ListNode oldFirst = groupPrev.next;
            groupPrev.next = kth;
            groupPrev = oldFirst;
        }
    }

    interface Rev { ListNode run(ListNode h, int k); }

    public static void main(String[] args) {
        Object[][] cases = {
            {"ví dụ 1 của đề", new int[] {1, 2, 3, 4, 5}, 2},
            {"ví dụ 2 của đề", new int[] {1, 2, 3, 4, 5}, 3},
            {"k = 1", new int[] {1, 2, 3}, 1},
            {"k = n", new int[] {1, 2, 3, 4}, 4},
            {"một nút", new int[] {7}, 1},
            {"hai nhóm đủ", new int[] {1, 2, 3, 4, 5, 6}, 3},
            {"7 nút, k = 3", new int[] {1, 2, 3, 4, 5, 6, 7}, 3},
            {"giá trị trùng", new int[] {5, 5, 6, 6, 7}, 2},
        };
        Map<String, Rev> fns = new LinkedHashMap<>();
        fns.put("reverseKGroup", ReverseKGroup::reverseKGroup);
        fns.put("reverseKGroupRecursive", ReverseKGroup::reverseKGroupRecursive);
        fns.put("wrongLoseNext", ReverseKGroup::wrongLoseNext);
        for (var e : fns.entrySet()) {
            List<String> bad = new ArrayList<>();
            for (Object[] c : cases) {
                int[] vals = (int[]) c[1];
                int k = (int) c[2];
                String got = toStr(e.getValue().run(build(vals), k), 2 * vals.length + 2);
                if (!got.equals(expected(vals, k))) bad.add(c[0] + " → " + got);
            }
            System.out.printf("%-23s %d/%d ca đúng%s%n", e.getKey(), cases.length - bad.size(), cases.length,
                bad.isEmpty() ? "" : "; sai ở " + String.join(", ", bad));
        }

        int[] big = new int[1000000];
        for (int i = 0; i < big.length; i++) big[i] = i;
        System.out.println("\nn = 1000000 nút, trung vị 5 lần");
        System.out.println("k           lặp            đệ quy");
        for (int k : new int[] {2, 10, 1000}) {
            StringBuilder row = new StringBuilder();
            for (Rev fn : new Rev[] {ReverseKGroup::reverseKGroup, ReverseKGroup::reverseKGroupRecursive}) {
                double[] ts = new double[5];
                String cell = null;
                for (int r = 0; r < 5 && cell == null; r++) {
                    ListNode head = build(big);
                    long t0 = System.nanoTime();
                    try { fn.run(head, k); } catch (StackOverflowError err) { cell = "StackOverflowError"; }
                    ts[r] = (System.nanoTime() - t0) / 1e6;
                }
                if (cell == null) { Arrays.sort(ts); cell = String.format("%.2f ms", ts[2]); }
                row.append(String.format(" %18s", cell));
            }
            System.out.printf("%-6d%s%n", k, row);
        }
    }
}
