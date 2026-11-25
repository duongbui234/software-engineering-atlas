// LC 235 Lowest Common Ancestor of a Binary Search Tree: LCA tổng quát (hậu thứ tự), so hai đường đi,
// đi xuống theo thứ tự của BST (đệ quy và vòng lặp), mẹo nhân hai hiệu bằng int (tràn) và bằng long.
// Chạy: java lca.java
import java.util.*;
import java.util.function.Supplier;

public class lca {
    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
    }

    // Dựng cây từ mảng theo tầng kiểu LeetCode: null là chỗ trống.
    static TreeNode build(Integer... arr) {
        if (arr.length == 0 || arr[0] == null) return null;
        TreeNode root = new TreeNode(arr[0]);
        Deque<TreeNode> queue = new ArrayDeque<>();
        queue.add(root);
        int i = 1;
        while (!queue.isEmpty() && i < arr.length) {
            TreeNode node = queue.poll();
            if (i < arr.length && arr[i] != null) { node.left = new TreeNode(arr[i]); queue.add(node.left); }
            i++;
            if (i < arr.length && arr[i] != null) { node.right = new TreeNode(arr[i]); queue.add(node.right); }
            i++;
        }
        return root;
    }

    static TreeNode find(TreeNode root, int v) {
        TreeNode node = root;
        while (node != null && node.val != v) node = v < node.val ? node.left : node.right;
        return node;
    }

    // Chuỗi lệch phải 0 → 1 → … → n-1: BST hợp lệ, cao n.
    static TreeNode rightChain(int n) {
        TreeNode root = null;
        for (int i = n - 1; i >= 0; i--) { TreeNode t = new TreeNode(i); t.right = root; root = t; }
        return root;
    }

    static TreeNode balancedBST(int lo, int hi) {
        if (lo > hi) return null;
        int mid = (lo + hi) >>> 1;
        TreeNode node = new TreeNode(mid);
        node.left = balancedBST(lo, mid - 1);
        node.right = balancedBST(mid + 1, hi);
        return node;
    }

    // Cách 1: LCA của cây nhị phân bất kỳ (LC 236), hậu thứ tự, O(n).
    static TreeNode lcaGeneral(TreeNode root, TreeNode p, TreeNode q) {
        if (root == null || root == p || root == q) return root;
        TreeNode l = lcaGeneral(root.left, p, q);
        TreeNode r = lcaGeneral(root.right, p, q);
        if (l != null && r != null) return root;
        return l != null ? l : r;
    }

    // Cách 2: hai đường đi từ gốc, nút chung cuối cùng.
    static List<TreeNode> pathTo(TreeNode root, TreeNode target) {
        List<TreeNode> path = new ArrayList<>();
        TreeNode node = root;
        while (node != null) {
            path.add(node);
            if (node == target) break;
            node = target.val < node.val ? node.left : node.right;
        }
        return path;
    }

    static TreeNode lcaPaths(TreeNode root, TreeNode p, TreeNode q) {
        List<TreeNode> a = pathTo(root, p), b = pathTo(root, q);
        int i = 0;
        while (i < a.size() && i < b.size() && a.get(i) == b.get(i)) i++;
        return a.get(i - 1);
    }

    // Cách 3: đi xuống theo thứ tự, đệ quy.
    static TreeNode lcaRecursive(TreeNode node, TreeNode p, TreeNode q) {
        if (node == null) return null;
        if (p.val < node.val && q.val < node.val) return lcaRecursive(node.left, p, q);
        if (p.val > node.val && q.val > node.val) return lcaRecursive(node.right, p, q);
        return node;
    }

    // Cách 4: vòng lặp, O(1) bộ nhớ.
    static TreeNode lcaIterative(TreeNode root, TreeNode p, TreeNode q) {
        TreeNode node = root;
        while (node != null) {
            if (p.val < node.val && q.val < node.val) node = node.left;
            else if (p.val > node.val && q.val > node.val) node = node.right;
            else return node;
        }
        return null;
    }

    // Bẫy Java: nhân hai hiệu bằng int. Tích có thể tới 4·10^18, tràn 32 bit và đổi dấu.
    static TreeNode wrongProductInt(TreeNode root, TreeNode p, TreeNode q) {
        TreeNode node = root;
        while (node != null) {
            if ((node.val - p.val) * (node.val - q.val) <= 0) return node;
            node = p.val < node.val ? node.left : node.right;
        }
        return null;
    }

    // Sửa: ép sang long trước khi nhân.
    static TreeNode lcaProductLong(TreeNode root, TreeNode p, TreeNode q) {
        TreeNode node = root;
        while (node != null) {
            if ((long) (node.val - p.val) * (node.val - q.val) <= 0) return node;
            node = p.val < node.val ? node.left : node.right;
        }
        return null;
    }

    interface Fn { TreeNode apply(TreeNode r, TreeNode p, TreeNode q); }
    record Case(String name, Supplier<TreeNode> make, int p, int q, int want) {}

    static final Integer[] T = {20, 10, 30, 5, 15, 25, 35, null, null, 12, 17};
    static final List<Case> CASES = List.of(
        new Case("hai phía của gốc (5, 35)", () -> build(T), 5, 35, 20),
        new Case("cùng bên trái (5, 17)", () -> build(T), 5, 17, 10),
        new Case("p là tổ tiên của q (10, 12)", () -> build(T), 10, 12, 10),
        new Case("p lớn hơn q (17, 12)", () -> build(T), 17, 12, 15),
        new Case("cùng bên phải (25, 35)", () -> build(T), 25, 35, 30),
        new Case("gốc là p (20, 17)", () -> build(T), 20, 17, 20),
        new Case("cây 2 nút (2, 1)", () -> build(2, 1), 2, 1, 2),
        new Case("giá trị ±10⁹ (10⁹, 10⁹ − 1)", () -> build(-1000000000, null, 1000000000, 999999999), 1000000000, 999999999, 1000000000),
        new Case("cùng phía, hiệu cỡ 5·10⁴ (50000, 50001)", () -> build(0, null, 50000, null, 50001), 50000, 50001, 50000),
        new Case("chuỗi tăng 10⁵ nút (99998, 99999)", () -> rightChain(100000), 99998, 99999, 99998)
    );

    static void check(String name, Fn fn) {
        List<String> bad = new ArrayList<>();
        for (Case c : CASES) {
            TreeNode root = c.make().get();
            String got;
            try {
                TreeNode r = fn.apply(root, find(root, c.p()), find(root, c.q()));
                got = r == null ? "null" : String.valueOf(r.val);
            } catch (Throwable e) { // StackOverflowError là Error, không phải Exception
                got = "ném " + e.getClass().getSimpleName();
            }
            if (!got.equals(String.valueOf(c.want()))) bad.add(c.name() + " → " + got);
        }
        System.out.printf("%-18s %d/%d ca đúng%s%n", name, CASES.size() - bad.size(), CASES.size(),
            bad.isEmpty() ? "" : "; sai ở " + String.join(", ", bad));
    }

    public static void main(String[] args) {
        check("lcaGeneral", lca::lcaGeneral);
        check("lcaPaths", lca::lcaPaths);
        check("lcaRecursive", lca::lcaRecursive);
        check("lcaIterative", lca::lcaIterative);
        check("lcaProductLong", lca::lcaProductLong);
        check("wrongProductInt", lca::wrongProductInt);

        // Đo trên BST cân 2^20 - 1 nút với cặp ngẫu nhiên.
        int n = (1 << 20) - 1;
        TreeNode root = balancedBST(0, n - 1);
        Random rng = new Random(20);
        TreeNode[][] pairs = new TreeNode[2000][];
        for (int i = 0; i < pairs.length; i++) {
            int a = rng.nextInt(n), b = rng.nextInt(n - 1);
            if (b >= a) b++;
            pairs[i] = new TreeNode[] {find(root, a), find(root, b)};
        }
        for (int i = 0; i < 10; i++) lcaGeneral(root, pairs[i][0], pairs[i][1]); // làm nóng JIT
        int G = 40;
        long t0 = System.nanoTime();
        for (int i = 0; i < G; i++) lcaGeneral(root, pairs[i][0], pairs[i][1]);
        double gt = (System.nanoTime() - t0) / 1000.0 / G;
        long sink = 0;
        for (int rep = 0; rep < 50; rep++) for (TreeNode[] pr : pairs) sink += lcaIterative(root, pr[0], pr[1]).val;
        t0 = System.nanoTime();
        for (int rep = 0; rep < 50; rep++) for (TreeNode[] pr : pairs) sink += lcaIterative(root, pr[0], pr[1]).val;
        double wt = (System.nanoTime() - t0) / 1000.0 / (50 * pairs.length);
        System.out.printf("%nBST cân %d nút, cặp ngẫu nhiên, mỗi truy vấn: tổng quát %.0f µs, đi theo thứ tự %.3f µs%s%n",
            n, gt, wt, sink < 0 ? "" : "");
    }
}
