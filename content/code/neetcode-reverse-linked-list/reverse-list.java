// LC 206 Reverse Linked List: lật chiều mọi con trỏ next.
// Chạy: java reverse-list.java
import java.util.*;

class ReverseList {
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

    static List<Integer> toList(ListNode head) {
        List<Integer> out = new ArrayList<>();
        for (ListNode p = head; p != null; p = p.next) out.add(p.val);
        return out;
    }

    // Lặp: giữ next trước khi lật cur.next.
    static ListNode reverseIterative(ListNode head) {
        ListNode prev = null, cur = head;
        while (cur != null) {
            ListNode next = cur.next;
            cur.next = prev;
            prev = cur;
            cur = next;
        }
        return prev;
    }

    // Đệ quy: mỗi nút một khung trên stack của luồng.
    static ListNode reverseRecursive(ListNode head) {
        if (head == null || head.next == null) return head;
        ListNode newHead = reverseRecursive(head.next);
        head.next.next = head;
        head.next = null;
        return newHead;
    }

    // SAI: kiểm tra head.next trước head == null; danh sách rỗng ném NullPointerException.
    static ListNode wrongCheckOrder(ListNode head) {
        if (head.next == null || head == null) return head;
        ListNode newHead = wrongCheckOrder(head.next);
        head.next.next = head;
        head.next = null;
        return newHead;
    }

    static int maxDepth() {
        int lo = 1, hi = 200000;
        while (lo < hi) {
            int m = (lo + hi + 1) >>> 1;
            int[] a = new int[m];
            boolean ok;
            try { reverseRecursive(fromArray(a)); ok = true; } catch (StackOverflowError e) { ok = false; }
            if (ok) lo = m; else hi = m - 1;
        }
        return lo;
    }

    public static void main(String[] args) {
        int[] big = new int[5000];
        for (int i = 0; i < big.length; i++) big[i] = i;
        int[][] cases = {{1, 2, 3, 4, 5}, {1, 2}, {}, {1}, {3, 3, 1}, big};
        String[] names = {"ví dụ 1", "ví dụ 2", "rỗng", "một nút", "trùng giá trị", "5000 nút (giới hạn đề)"};
        String[] fnNames = {"reverseIterative", "reverseRecursive", "wrongCheckOrder"};
        for (int f = 0; f < 3; f++) {
            List<String> bad = new ArrayList<>();
            for (int k = 0; k < cases.length; k++) {
                List<Integer> want = new ArrayList<>();
                for (int v : cases[k]) want.add(v);
                Collections.reverse(want);
                try {
                    ListNode h = fromArray(cases[k]);
                    ListNode r = f == 0 ? reverseIterative(h) : f == 1 ? reverseRecursive(h) : wrongCheckOrder(h);
                    if (!toList(r).equals(want)) bad.add(names[k]);
                } catch (NullPointerException e) {
                    bad.add(names[k] + " → NullPointerException");
                }
            }
            System.out.printf("%-17s %d/%d ca đúng%s%n", fnNames[f], cases.length - bad.size(), cases.length, bad.isEmpty() ? "" : "; sai ở " + bad);
        }
        for (int r = 0; r < 3; r++) System.out.println("đệ quy sâu tối đa, lần " + (r + 1) + ": " + maxDepth() + " nút");
    }
}
