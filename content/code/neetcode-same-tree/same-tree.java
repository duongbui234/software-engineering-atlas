// LC 100 Same Tree: đệ quy song song, ngăn xếp cặp nút, hàng đợi cặp nút, tuần tự hóa có đánh dấu null.
// Chạy: java same-tree.java
import java.util.*;

public class SameTree {
    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
    }

    // Nút có giá trị kiểu Integer (đối tượng), để chạy bẫy so bằng ==.
    static class BoxedNode {
        Integer val;
        BoxedNode left, right;
        BoxedNode(Integer val) { this.val = val; }
    }

    // Dựng cây từ mảng theo tầng kiểu LeetCode: null là chỗ trống.
    static TreeNode build(Integer... level) {
        if (level.length == 0 || level[0] == null) return null;
        TreeNode root = new TreeNode(level[0]);
        ArrayDeque<TreeNode> queue = new ArrayDeque<>(List.of(root));
        for (int i = 1; i < level.length; ) {
            TreeNode node = queue.poll();
            if (level[i] != null) { node.left = new TreeNode(level[i]); queue.add(node.left); }
            i++;
            if (i < level.length && level[i] != null) { node.right = new TreeNode(level[i]); queue.add(node.right); }
            i++;
        }
        return root;
    }

    // Cùng hình dạng, nút kiểu BoxedNode (chép từ cây TreeNode).
    static BoxedNode boxed(TreeNode t) {
        if (t == null) return null;
        BoxedNode b = new BoxedNode(t.val); // Integer.valueOf: chỉ dùng lại đối tượng cho -128..127
        b.left = boxed(t.left);
        b.right = boxed(t.right);
        return b;
    }

    static TreeNode chain(int n, boolean left) {
        TreeNode root = null;
        for (int i = 0; i < n; i++) {
            TreeNode t = new TreeNode(1);
            if (left) t.left = root; else t.right = root;
            root = t;
        }
        return root;
    }

    // Cách 1: đệ quy song song. O(n) thời gian, O(h) ngăn xếp gọi hàm.
    static boolean isSameRecursive(TreeNode p, TreeNode q) {
        if (p == null || q == null) return p == q; // chỉ đúng khi cả hai cùng null
        return p.val == q.val && isSameRecursive(p.left, q.left) && isSameRecursive(p.right, q.right);
    }

    // Cách 2: ngăn xếp các cặp nút (DFS). ArrayDeque không nhận null, nên mỗi phần tử là một mảng hai ô.
    static boolean isSameStack(TreeNode p, TreeNode q) {
        ArrayDeque<TreeNode[]> stack = new ArrayDeque<>();
        stack.push(new TreeNode[] {p, q});
        while (!stack.isEmpty()) {
            TreeNode[] c = stack.pop();
            TreeNode a = c[0], b = c[1];
            if (a == null && b == null) continue;
            if (a == null || b == null || a.val != b.val) return false;
            stack.push(new TreeNode[] {a.right, b.right});
            stack.push(new TreeNode[] {a.left, b.left});
        }
        return true;
    }

    // Cách 3: hàng đợi các cặp nút (BFS).
    static boolean isSameQueue(TreeNode p, TreeNode q) {
        ArrayDeque<TreeNode[]> queue = new ArrayDeque<>();
        queue.add(new TreeNode[] {p, q});
        while (!queue.isEmpty()) {
            TreeNode[] c = queue.poll();
            TreeNode a = c[0], b = c[1];
            if (a == null && b == null) continue;
            if (a == null || b == null || a.val != b.val) return false;
            queue.add(new TreeNode[] {a.left, b.left});
            queue.add(new TreeNode[] {a.right, b.right});
        }
        return true;
    }

    // Preorder, null ghi thành NONE (ngoài khoảng giá trị của đề). Vòng lặp.
    static final int NONE = Integer.MIN_VALUE;
    static int[] serialize(TreeNode root) {
        int[] out = new int[16];
        int n = 0;
        ArrayList<TreeNode> stack = new ArrayList<>();
        stack.add(root);
        while (!stack.isEmpty()) {
            TreeNode node = stack.remove(stack.size() - 1);
            if (n == out.length) out = Arrays.copyOf(out, n * 2);
            if (node == null) { out[n++] = NONE; continue; }
            out[n++] = node.val;
            stack.add(node.right);
            stack.add(node.left);
        }
        return Arrays.copyOf(out, n);
    }

    // Cách 4: tuần tự hóa có đánh dấu null rồi so hai mảng.
    static boolean isSameSerialize(TreeNode p, TreeNode q) { return Arrays.equals(serialize(p), serialize(q)); }

    // SAI: so hai Integer bằng ==, tức so địa chỉ đối tượng. Đúng với -128..127 nhờ bộ đệm Integer, sai từ 128.
    static boolean wrongBoxedEquals(BoxedNode p, BoxedNode q) {
        if (p == null || q == null) return p == q;
        return p.val == q.val && wrongBoxedEquals(p.left, q.left) && wrongBoxedEquals(p.right, q.right);
    }

    // SAI: quên trường hợp đúng một bên null.
    static boolean wrongMissingOneNull(TreeNode p, TreeNode q) {
        if (p == null && q == null) return true;
        return p.val == q.val && wrongMissingOneNull(p.left, q.left) && wrongMissingOneNull(p.right, q.right);
    }

    record Case(String name, TreeNode p, TreeNode q, boolean want) {}

    interface Fn { boolean apply(TreeNode p, TreeNode q); }

    static boolean works(Fn fn, int d) {
        TreeNode p = chain(d, true), q = chain(d, true);
        try { return fn.apply(p, q); } catch (StackOverflowError e) { return false; }
    }

    static int deepestOk(Fn fn) {
        int lo = 1, hi = 2;
        while (works(fn, hi)) { lo = hi; hi *= 2; }
        while (hi - lo > 1) { int mid = (lo + hi) >>> 1; if (works(fn, mid)) lo = mid; else hi = mid; }
        return lo;
    }

    // mulberry32: int 32 bit tràn số theo modulo 2³², >>> là dịch không dấu.
    static int seed;
    static double rnd() {
        seed += 0x6D2B79F5;
        int t = seed;
        t = (t ^ (t >>> 15)) * (1 | t);
        t = (t + (t ^ (t >>> 7)) * (61 | t)) ^ t;
        return ((t ^ (t >>> 14)) & 0xFFFFFFFFL) / 4294967296.0;
    }

    static TreeNode bst(int[] keys) {
        TreeNode root = null;
        for (int k : keys) {
            TreeNode t = new TreeNode(k);
            if (root == null) { root = t; continue; }
            TreeNode cur = root;
            while (true) {
                if (k < cur.val) { if (cur.left == null) { cur.left = t; break; } cur = cur.left; }
                else { if (cur.right == null) { cur.right = t; break; } cur = cur.right; }
            }
        }
        return root;
    }

    public static void main(String[] args) throws Exception {
        List<Case> cases = List.of(
            new Case("giống hệt", build(1, 2, 3), build(1, 2, 3), true),
            new Case("con trái và con phải", build(1, 2), build(1, null, 2), false),
            new Case("đổi chỗ giá trị", build(1, 2, 1), build(1, 1, 2), false),
            new Case("hai cây rỗng", build(), build(), true),
            new Case("một bên rỗng", build(), build(1), false),
            new Case("một nút", build(5), build(5), true),
            new Case("giá trị lớn hơn 127", build(1000, 2000), build(1000, 2000), true),
            new Case("số âm", build(-10000, null, 7), build(-10000, null, 7), true),
            new Case("cây đầy 7 nút", build(1, 2, 3, 4, 5, 6, 7), build(1, 2, 3, 4, 5, 6, 7), true),
            new Case("khác lá cuối", build(1, 2, 3, 4, 5, 6, 7), build(1, 2, 3, 4, 5, 6, 8), false),
            new Case("lệch trái và lệch phải", chain(50, true), chain(50, false), false),
            new Case("lệch trái 100 nút", chain(100, true), chain(100, true), true));

        LinkedHashMap<String, Fn> fns = new LinkedHashMap<>();
        fns.put("isSameRecursive", SameTree::isSameRecursive);
        fns.put("isSameStack", SameTree::isSameStack);
        fns.put("isSameQueue", SameTree::isSameQueue);
        fns.put("isSameSerialize", SameTree::isSameSerialize);
        fns.put("wrongBoxedEquals", (p, q) -> wrongBoxedEquals(boxed(p), boxed(q)));
        fns.put("wrongMissingOneNull", SameTree::wrongMissingOneNull);
        for (var e : fns.entrySet()) {
            List<String> bad = new ArrayList<>();
            for (Case c : cases) {
                String got;
                try { got = String.valueOf(e.getValue().apply(c.p(), c.q())); }
                catch (RuntimeException ex) { got = "ném " + ex.getClass().getSimpleName(); }
                if (!got.equals(String.valueOf(c.want()))) bad.add(c.name() + " → " + got);
            }
            System.out.printf("%-20s %d/%d ca đúng%s%n", e.getKey(), cases.size() - bad.size(), cases.size(),
                bad.isEmpty() ? "" : "; sai ở " + String.join(", ", bad));
        }

        Integer a = 127, b = 127, c = 128, d = 128;
        System.out.printf("%nInteger 127 == 127: %b, 128 == 128: %b, 128 equals 128: %b%n", a == b, c == d, c.equals(d));

        System.out.printf("%nđộ sâu lớn nhất bản đệ quy chạy được (luồng main): %d%n", deepestOk(SameTree::isSameRecursive));
        System.out.printf("isSameStack cây lệch 10⁶ nút: %b%n", works(SameTree::isSameStack, 1_000_000));
        // Luồng riêng với ngăn xếp 512 MB: đệ quy sâu 10⁶ chạy được.
        boolean[] res = new boolean[1];
        Thread t = new Thread(null, () -> res[0] = works(SameTree::isSameRecursive, 1_000_000), "sau", 512L << 20);
        t.start();
        t.join();
        System.out.printf("luồng có ngăn xếp 512 MB, đệ quy cây lệch 10⁶ nút: %b%n", res[0]);

        // Đo: hai cây giống hệt 10⁶ nút (cây tìm kiếm nhị phân từ khóa ngẫu nhiên mulberry32), trung vị 5 lần.
        seed = 7;
        int[] keys = new int[1_000_000];
        for (int i = 0; i < keys.length; i++) keys[i] = (int) (rnd() * 2147483648.0);
        TreeNode p = bst(keys), q = bst(keys);
        System.out.println("\nhai cây giống hệt 10⁶ nút, trung vị 5 lần (ms)");
        for (String name : List.of("isSameRecursive", "isSameStack", "isSameQueue", "isSameSerialize")) {
            double[] ts = new double[5];
            for (int r = 0; r < 5; r++) {
                long t0 = System.nanoTime();
                fns.get(name).apply(p, q);
                ts[r] = (System.nanoTime() - t0) / 1e6;
            }
            Arrays.sort(ts);
            System.out.printf("%-16s %8.2f%n", name, ts[2]);
        }
    }
}
