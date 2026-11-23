// LC 23 Merge k Sorted Lists: PriorityQueue với Comparator, chia để trị, và bẫy offer(null).
// Chạy: java merge-k-lists.java
import java.util.*;

class MergeKLists {
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

    static List<Integer> toList(ListNode head) {
        List<Integer> out = new ArrayList<>();
        for (; head != null; head = head.next) out.add(head.val);
        return out;
    }

    static ListNode mergeTwo(ListNode a, ListNode b) {
        ListNode dummy = new ListNode(0, null), tail = dummy;
        while (a != null && b != null) {
            if (a.val <= b.val) { tail.next = a; a = a.next; } else { tail.next = b; b = b.next; }
            tail = tail.next;
        }
        tail.next = a != null ? a : b;
        return dummy.next;
    }

    // Heap k đầu danh sách. Integer.compare không tràn số, khác với a.val - b.val.
    static ListNode mergeHeap(ListNode[] lists) {
        PriorityQueue<ListNode> pq = new PriorityQueue<>((x, y) -> Integer.compare(x.val, y.val));
        for (ListNode l : lists) if (l != null) pq.offer(l);
        ListNode dummy = new ListNode(0, null), tail = dummy;
        while (!pq.isEmpty()) {
            ListNode node = pq.poll();
            tail.next = node;
            tail = node;
            if (node.next != null) pq.offer(node.next);
        }
        return dummy.next;
    }

    // Chia để trị: trộn từng cặp với bước nhảy gấp đôi, ngay trên mảng lists.
    static ListNode mergeDivide(ListNode[] lists) {
        if (lists.length == 0) return null;
        for (int step = 1; step < lists.length; step *= 2)
            for (int i = 0; i + step < lists.length; i += 2 * step)
                lists[i] = mergeTwo(lists[i], lists[i + step]);
        return lists[0];
    }

    // SAI: offer cả danh sách rỗng. PriorityQueue không nhận null: ném NullPointerException.
    static ListNode wrongOfferNull(ListNode[] lists) {
        PriorityQueue<ListNode> pq = new PriorityQueue<>((x, y) -> Integer.compare(x.val, y.val));
        for (ListNode l : lists) pq.offer(l);
        ListNode dummy = new ListNode(0, null), tail = dummy;
        while (!pq.isEmpty()) {
            ListNode node = pq.poll();
            tail.next = node;
            tail = node;
            if (node.next != null) pq.offer(node.next);
        }
        return dummy.next;
    }

    interface Merger { ListNode merge(ListNode[] lists); }

    public static void main(String[] args) {
        int[][] twenty = new int[20][];
        for (int i = 0; i < 20; i++) twenty[i] = new int[] {(i * 7) % 20};
        Object[][] cases = {
            {"ví dụ của đề", new int[][] {{1, 4, 5}, {1, 3, 4}, {2, 6}}},
            {"không có danh sách", new int[][] {}},
            {"một danh sách rỗng", new int[][] {{}}},
            {"rỗng xen kẽ", new int[][] {{}, {1}, {}, {0, 2}}},
            {"một danh sách", new int[][] {{1, 2, 3}}},
            {"số âm", new int[][] {{-10, -5, 0}, {-3, 10}}},
            {"9 và 10", new int[][] {{9}, {10}, {2}}},
            {"20 danh sách 1 phần tử", twenty},
            {"trùng hết", new int[][] {{5, 5}, {5}, {5, 5, 5}}},
        };
        Map<String, Merger> fns = new LinkedHashMap<>();
        fns.put("mergeHeap", MergeKLists::mergeHeap);
        fns.put("mergeDivide", MergeKLists::mergeDivide);
        fns.put("wrongOfferNull", MergeKLists::wrongOfferNull);
        for (var e : fns.entrySet()) {
            List<String> bad = new ArrayList<>();
            for (Object[] c : cases) {
                int[][] in = (int[][]) c[1];
                List<Integer> want = new ArrayList<>();
                for (int[] l : in) for (int v : l) want.add(v);
                Collections.sort(want);
                ListNode[] lists = new ListNode[in.length];
                for (int i = 0; i < in.length; i++) lists[i] = build(in[i]);
                String got;
                try { got = toList(e.getValue().merge(lists)).toString(); }
                catch (RuntimeException ex) { got = "ném " + ex.getClass().getSimpleName(); }
                if (!got.equals(want.toString())) bad.add(c[0] + " → " + got);
            }
            System.out.printf("%-15s %d/%d ca đúng%s%n", e.getKey(), cases.length - bad.size(), cases.length,
                bad.isEmpty() ? "" : "; sai ở " + String.join(", ", bad));
        }

        System.out.println("\nN = 1000000 nút, trung vị 5 lần (ms)");
        System.out.println("k           heap   chia đôi");
        for (int k : new int[] {10, 1000, 100000}) {
            Random r = new Random(k);
            int per = 1000000 / k;
            int[][] in = new int[k][per];
            for (int[] l : in) { for (int j = 0; j < per; j++) l[j] = r.nextInt(20001) - 10000; Arrays.sort(l); }
            StringBuilder row = new StringBuilder();
            for (Merger fn : new Merger[] {MergeKLists::mergeHeap, MergeKLists::mergeDivide}) {
                double[] ts = new double[5];
                for (int rep = 0; rep < 5; rep++) {
                    ListNode[] lists = new ListNode[k];
                    for (int i = 0; i < k; i++) lists[i] = build(in[i]);
                    long t0 = System.nanoTime();
                    fn.merge(lists);
                    ts[rep] = (System.nanoTime() - t0) / 1e6;
                }
                Arrays.sort(ts);
                row.append(String.format(" %9.2f", ts[2]));
            }
            System.out.printf("%-8d%s%n", k, row);
        }
    }
}
