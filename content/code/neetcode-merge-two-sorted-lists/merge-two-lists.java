// LeetCode 21: Merge Two Sorted Lists. Chạy: java merge-two-lists.java
import java.util.*;

class MergeTwoLists {
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

    // Nút giả đứng trước đầu kết quả; hết vòng thì nối nguyên phần còn lại.
    static ListNode mergeDummy(ListNode a, ListNode b) {
        ListNode dummy = new ListNode(0, null), tail = dummy;
        while (a != null && b != null) {
            if (a.val <= b.val) { tail.next = a; a = a.next; }
            else { tail.next = b; b = b.next; }
            tail = tail.next;
        }
        tail.next = (a != null) ? a : b;
        return dummy.next;
    }

    // Đệ quy: mỗi nút một khung trên stack của luồng; danh sách dài thì StackOverflowError.
    static ListNode mergeRecursive(ListNode a, ListNode b) {
        if (a == null) return b;
        if (b == null) return a;
        if (a.val <= b.val) { a.next = mergeRecursive(a.next, b); return a; }
        b.next = mergeRecursive(a, b.next);
        return b;
    }

    static boolean recOk(int n) {
        int[] a = new int[n / 2], b = new int[n - n / 2];
        for (int i = 0; i < a.length; i++) a[i] = 2 * i;
        for (int i = 0; i < b.length; i++) b[i] = 2 * i + 1;
        try { mergeRecursive(fromArray(a), fromArray(b)); return true; }
        catch (StackOverflowError e) { return false; }
    }

    public static void main(String[] args) {
        int[][][] cases = {
            {{1, 2, 4}, {1, 3, 4}}, {{}, {}}, {{}, {0}}, {{5}, {1, 2, 3}}, {{1, 2, 3}, {}},
            {{-100, 0, 100}, {-100, -50}}, {{2, 2, 2}, {2, 2}}, {{1, 5, 9}, {2, 3, 4, 6, 7, 8, 10}},
        };
        String[] names = {"mergeDummy", "mergeRecursive"};
        for (int f = 0; f < 2; f++) {
            int ok = 0;
            for (int[][] c : cases) {
                int[] all = new int[c[0].length + c[1].length];
                System.arraycopy(c[0], 0, all, 0, c[0].length);
                System.arraycopy(c[1], 0, all, c[0].length, c[1].length);
                Arrays.sort(all);
                List<Integer> want = new ArrayList<>();
                for (int v : all) want.add(v);
                ListNode got = f == 0 ? mergeDummy(fromArray(c[0]), fromArray(c[1])) : mergeRecursive(fromArray(c[0]), fromArray(c[1]));
                if (toList(got).equals(want)) ok++;
            }
            System.out.printf("%-15s %d/%d ca đúng%n", names[f], ok, cases.length);
        }

        // Độ sâu tối đa, đo ba lần: lần đầu code còn chạy bằng trình thông dịch, các lần sau đã được JIT.
        for (int r = 0; r < 3; r++) {
            int lo = 1, hi = 1 << 20;
            while (lo < hi) { int m = (lo + hi + 1) >>> 1; if (recOk(m)) lo = m; else hi = m - 1; }
            System.out.println("đệ quy chạy được tới tổng " + lo + " nút (lần đo " + (r + 1) + ")");
        }

        Random rnd = new Random(21);
        System.out.println("\nm = n      dummy");
        for (int n : new int[]{10_000, 100_000, 1_000_000}) {
            int[] a = new int[n], b = new int[n];
            for (int i = 0; i < n; i++) { a[i] = rnd.nextInt(2 * n); b[i] = rnd.nextInt(2 * n); }
            Arrays.sort(a); Arrays.sort(b);
            double[] ts = new double[5];
            for (int k = 0; k < 5; k++) {
                ListNode x = fromArray(a), y = fromArray(b);
                long s = System.nanoTime();
                mergeDummy(x, y);
                ts[k] = (System.nanoTime() - s) / 1e6;
            }
            Arrays.sort(ts);
            System.out.printf("%-9d%8.2f ms%n", n, ts[2]);
        }
    }
}
