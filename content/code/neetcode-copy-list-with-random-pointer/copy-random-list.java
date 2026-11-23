// LC 138 Copy List with Random Pointer: HashMap cũ → mới, đan nút, và bẫy nút có equals/hashCode theo giá trị.
// Chạy: java copy-random-list.java
import java.util.*;

class Main {
    static class Node {
        int val;
        Node next, random;
        Node(int val) { this.val = val; }
    }

    // Nút "tiện tay" có equals/hashCode theo giá trị: hai nút cùng val bị HashMap coi là một khóa.
    static class ValueNode extends Node {
        ValueNode(int val) { super(val); }
        @Override public boolean equals(Object o) { return o instanceof ValueNode v && v.val == val; }
        @Override public int hashCode() { return Integer.hashCode(val); }
    }

    static Node build(int[][] spec, boolean valueNodes) {
        Node[] nodes = new Node[spec.length];
        for (int i = 0; i < spec.length; i++) nodes[i] = valueNodes ? new ValueNode(spec[i][0]) : new Node(spec[i][0]);
        for (int i = 0; i < spec.length; i++) {
            nodes[i].next = i + 1 < spec.length ? nodes[i + 1] : null;
            nodes[i].random = spec[i][1] < 0 ? null : nodes[spec[i][1]];
        }
        return spec.length == 0 ? null : nodes[0];
    }

    static String toSpec(Node head) {
        List<Node> nodes = new ArrayList<>();
        for (Node cur = head; cur != null && nodes.size() <= 100000; cur = cur.next) nodes.add(cur);
        IdentityHashMap<Node, Integer> index = new IdentityHashMap<>();
        for (int i = 0; i < nodes.size(); i++) index.put(nodes.get(i), i);
        StringBuilder sb = new StringBuilder();
        for (Node n : nodes) sb.append('[').append(n.val).append(',').append(n.random == null ? -1 : index.getOrDefault(n.random, -2)).append(']');
        return sb.toString();
    }

    static String specString(int[][] spec) {
        StringBuilder sb = new StringBuilder();
        for (int[] e : spec) sb.append('[').append(e[0]).append(',').append(e[1]).append(']');
        return sb.toString();
    }

    // Cách 1: bảng nút cũ → nút mới, hai lượt. HashMap dùng equals/hashCode của khóa; Node thường kế thừa của Object (so danh tính).
    static Node copyTwoPass(Node head) {
        Map<Node, Node> map = new HashMap<>();
        for (Node cur = head; cur != null; cur = cur.next) map.put(cur, new Node(cur.val));
        for (Node cur = head; cur != null; cur = cur.next) {
            map.get(cur).next = map.get(cur.next);
            map.get(cur).random = map.get(cur.random);
        }
        return map.get(head);
    }

    // Cách 1 với IdentityHashMap: so khóa bằng ==, đúng cả khi nút có equals theo giá trị.
    static Node copyIdentity(Node head) {
        Map<Node, Node> map = new IdentityHashMap<>();
        for (Node cur = head; cur != null; cur = cur.next) map.put(cur, new Node(cur.val));
        for (Node cur = head; cur != null; cur = cur.next) {
            map.get(cur).next = map.get(cur.next);
            map.get(cur).random = map.get(cur.random);
        }
        return map.get(head);
    }

    // Cách 3: đan bản sao sau nút gốc, đặt random, tách ra.
    static Node copyInterleave(Node head) {
        if (head == null) return null;
        for (Node cur = head; cur != null; cur = cur.next.next) {
            Node c = new Node(cur.val);
            c.next = cur.next;
            cur.next = c;
        }
        for (Node cur = head; cur != null; cur = cur.next.next) cur.next.random = cur.random == null ? null : cur.random.next;
        Node newHead = head.next;
        for (Node cur = head; cur != null; cur = cur.next) {
            Node c = cur.next;
            cur.next = c.next;
            c.next = c.next == null ? null : c.next.next;
        }
        return newHead;
    }

    interface Copier { Node copy(Node h); }

    static String check(Copier fn, int[][] spec, boolean valueNodes) {
        Node head = build(spec, valueNodes);
        Set<Node> originals = Collections.newSetFromMap(new IdentityHashMap<>());
        for (Node cur = head; cur != null; cur = cur.next) originals.add(cur);
        Node c;
        try { c = fn.copy(head); } catch (RuntimeException e) { return "ném " + e.getClass().getSimpleName(); }
        for (Node cur = c; cur != null; cur = cur.next)
            if (originals.contains(cur) || (cur.random != null && originals.contains(cur.random))) return "dùng chung nút với danh sách gốc";
        if (!toSpec(c).equals(specString(spec))) return "sai cấu trúc";
        if (!toSpec(head).equals(specString(spec))) return "danh sách gốc bị đổi";
        return null;
    }

    static final String[] NAMES = {"ví dụ 1 của đề", "ví dụ 2", "ví dụ 3 (giá trị trùng)", "rỗng", "một nút tự trỏ", "mọi random null", "mọi random trỏ nút cuối"};
    static final int[][][] CASES = {
        {{7, -1}, {13, 0}, {11, 4}, {10, 2}, {1, 0}}, {{1, 1}, {2, 1}}, {{3, -1}, {3, 0}, {3, -1}}, {},
        {{5, 0}}, {{1, -1}, {2, -1}, {3, -1}}, {{1, 3}, {2, 3}, {3, 3}, {4, 3}},
    };

    static void report(String name, Copier fn, boolean valueNodes) {
        List<String> bad = new ArrayList<>();
        for (int i = 0; i < CASES.length; i++) {
            String err = check(fn, CASES[i], valueNodes);
            if (err != null) bad.add(NAMES[i] + " → " + err);
        }
        System.out.printf("%-26s %d/%d ca đúng%s%n", name, CASES.length - bad.size(), CASES.length, bad.isEmpty() ? "" : "; sai ở " + String.join(", ", bad));
    }

    static double median(Copier fn, int[][] spec) {
        double[] ts = new double[5];
        for (int i = 0; i < 5; i++) { Node h = build(spec, false); long t0 = System.nanoTime(); fn.copy(h); ts[i] = (System.nanoTime() - t0) / 1e6; }
        Arrays.sort(ts);
        return ts[2];
    }

    public static void main(String[] args) {
        report("copyTwoPass", Main::copyTwoPass, false);
        report("copyIdentity", Main::copyIdentity, false);
        report("copyInterleave", Main::copyInterleave, false);
        report("copyTwoPass (ValueNode)", Main::copyTwoPass, true);
        report("copyIdentity (ValueNode)", Main::copyIdentity, true);

        Random rnd = new Random(138);
        System.out.println("\nn nút      HashMap      IdentityHashMap   đan nút");
        for (int n : new int[]{100000, 1000000}) {
            int[][] spec = new int[n][2];
            for (int i = 0; i < n; i++) { spec[i][0] = rnd.nextInt(20001) - 10000; spec[i][1] = rnd.nextDouble() < 0.2 ? -1 : rnd.nextInt(n); }
            for (int w = 0; w < 3; w++) { copyTwoPass(build(spec, false)); copyIdentity(build(spec, false)); copyInterleave(build(spec, false)); }
            double[] ms = new double[3];
            Copier[] fns = {Main::copyTwoPass, Main::copyIdentity, Main::copyInterleave};
            for (int f = 0; f < 3; f++) ms[f] = median(fns[f], spec);
            System.out.printf("%-10d %8.2f ms   %8.2f ms       %8.2f ms%n", n, ms[0], ms[1], ms[2]);
        }
    }
}
