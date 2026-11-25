// LC 98 Validate Binary Search Tree: vét cạn max/min cây con, truyền khoảng (đệ quy và lặp),
// trung thứ tự (đệ quy, lặp, Morris), và hai cách sai chạy thật.
// Chạy: java validate-bst.java
import java.util.*;
import java.util.function.Predicate;
import java.util.function.Supplier;

class ValidateBst {
    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val, TreeNode left, TreeNode right) { this.val = val; this.left = left; this.right = right; }
    }

    // Dựng cây từ mảng theo tầng kiểu LeetCode; null là chỗ trống.
    static TreeNode build(Integer... arr) {
        if (arr.length == 0 || arr[0] == null) return null;
        TreeNode root = new TreeNode(arr[0], null, null);
        List<TreeNode> queue = new ArrayList<>(List.of(root));
        int i = 1;
        for (int q = 0; q < queue.size() && i < arr.length; q++) {
            TreeNode node = queue.get(q);
            if (arr[i] != null) { node.left = new TreeNode(arr[i], null, null); queue.add(node.left); }
            i++;
            if (i < arr.length && arr[i] != null) { node.right = new TreeNode(arr[i], null, null); queue.add(node.right); }
            i++;
        }
        return root;
    }

    static TreeNode balancedBST(int lo, int hi) {
        if (lo > hi) return null;
        int mid = (lo + hi) >>> 1;
        return new TreeNode(mid, balancedBST(lo, mid - 1), balancedBST(mid + 1, hi));
    }

    static TreeNode rightChain(int n) {
        TreeNode root = null;
        for (int v = n; v >= 1; v--) root = new TreeNode(v, null, root);
        return root;
    }

    static TreeNode chainBadBottom(int n) {
        TreeNode root = rightChain(n - 1), t = root;
        while (t.right != null) t = t.right;
        t.left = new TreeNode(0, null, null);
        return root;
    }

    static long visits = 0;

    // Sai: chỉ so nút với hai con trực tiếp.
    static boolean wrongParentChild(TreeNode root) {
        if (root == null) return true;
        if (root.left != null && root.left.val >= root.val) return false;
        if (root.right != null && root.right.val <= root.val) return false;
        return wrongParentChild(root.left) && wrongParentChild(root.right);
    }

    static int[] scan(TreeNode node) {
        int mn = Integer.MAX_VALUE, mx = Integer.MIN_VALUE;
        Deque<TreeNode> stack = new ArrayDeque<>();
        stack.push(node);
        while (!stack.isEmpty()) {
            TreeNode t = stack.pop();
            visits++;
            mn = Math.min(mn, t.val);
            mx = Math.max(mx, t.val);
            if (t.left != null) stack.push(t.left);
            if (t.right != null) stack.push(t.right);
        }
        return new int[] { mn, mx };
    }

    // Cách 1: vét cạn, ở mọi nút max(trái) < nút < min(phải). O(n·h).
    static boolean bruteMaxMin(TreeNode root) {
        if (root == null) return true;
        Deque<TreeNode> stack = new ArrayDeque<>();
        stack.push(root);
        while (!stack.isEmpty()) {
            TreeNode node = stack.pop();
            if (node.left != null) {
                if (scan(node.left)[1] >= node.val) return false;
                stack.push(node.left);
            }
            if (node.right != null) {
                if (scan(node.right)[0] <= node.val) return false;
                stack.push(node.right);
            }
        }
        return true;
    }

    // Cách 2: truyền khoảng mở bằng long. Long.MIN_VALUE nhỏ hơn mọi int, nên làm "âm vô cực" an toàn.
    static boolean validBounds(TreeNode root) { return walk(root, Long.MIN_VALUE, Long.MAX_VALUE); }

    static boolean walk(TreeNode node, long lo, long hi) {
        if (node == null) return true;
        visits++;
        if (node.val <= lo || node.val >= hi) return false;
        return walk(node.left, lo, node.val) && walk(node.right, node.val, hi);
    }

    // Cách 2b: cùng phép kiểm, ngăn xếp tự quản lý; cận là Integer, null nghĩa là chưa có cận.
    record Item(TreeNode node, Integer lo, Integer hi) {}

    static boolean validBoundsIterative(TreeNode root) {
        if (root == null) return true;
        Deque<Item> stack = new ArrayDeque<>();
        stack.push(new Item(root, null, null));
        while (!stack.isEmpty()) {
            Item it = stack.pop();
            visits++;
            int v = it.node().val;
            if ((it.lo() != null && v <= it.lo()) || (it.hi() != null && v >= it.hi())) return false;
            if (it.node().left != null) stack.push(new Item(it.node().left, it.lo(), v));
            if (it.node().right != null) stack.push(new Item(it.node().right, v, it.hi()));
        }
        return true;
    }

    // Cách 3: trung thứ tự đệ quy; prev là Integer, null nghĩa là chưa gặp nút nào.
    static Integer prev;

    static boolean validInorder(TreeNode root) { prev = null; return inorder(root); }

    static boolean inorder(TreeNode node) {
        if (node == null) return true;
        if (!inorder(node.left)) return false;
        visits++;
        if (prev != null && node.val <= prev) return false;
        prev = node.val;
        return inorder(node.right);
    }

    // Cách 3b: trung thứ tự lặp.
    static boolean validInorderIterative(TreeNode root) {
        Deque<TreeNode> stack = new ArrayDeque<>();
        TreeNode cur = root;
        boolean hasPrev = false;
        int p = 0;
        while (cur != null || !stack.isEmpty()) {
            while (cur != null) { stack.push(cur); cur = cur.left; }
            cur = stack.pop();
            visits++;
            if (hasPrev && cur.val <= p) return false;
            p = cur.val;
            hasPrev = true;
            cur = cur.right;
        }
        return true;
    }

    // Cách 3c: Morris, bộ nhớ thêm O(1); đi tới hết để gỡ mọi sợi nối tạm.
    static boolean validMorris(TreeNode root) {
        TreeNode cur = root;
        boolean hasPrev = false, ok = true;
        int p = 0;
        while (cur != null) {
            if (cur.left == null) {
                visits++;
                if (hasPrev && cur.val <= p) ok = false;
                p = cur.val; hasPrev = true;
                cur = cur.right;
            } else {
                TreeNode q = cur.left;
                while (q.right != null && q.right != cur) q = q.right;
                if (q.right == null) { q.right = cur; cur = cur.left; }
                else {
                    q.right = null;
                    visits++;
                    if (hasPrev && cur.val <= p) ok = false;
                    p = cur.val; hasPrev = true;
                    cur = cur.right;
                }
            }
        }
        return ok;
    }

    // Sai: cận kiểu int với Integer.MIN_VALUE và MAX_VALUE làm "vô cực".
    static boolean wrongIntSentinel(TreeNode root) { return wrongWalk(root, Integer.MIN_VALUE, Integer.MAX_VALUE); }

    static boolean wrongWalk(TreeNode node, int lo, int hi) {
        if (node == null) return true;
        if (node.val <= lo || node.val >= hi) return false;
        return wrongWalk(node.left, lo, node.val) && wrongWalk(node.right, node.val, hi);
    }

    record Case(String name, Supplier<TreeNode> make, boolean want) {}

    static double[] measure(Predicate<TreeNode> fn, TreeNode root) {
        double[] ts = new double[5];
        long v = 0;
        for (int k = 0; k < 5; k++) {
            visits = 0;
            long t0 = System.nanoTime();
            fn.test(root);
            ts[k] = (System.nanoTime() - t0) / 1e6;
            v = visits;
        }
        Arrays.sort(ts);
        return new double[] { v, ts[2] };
    }

    public static void main(String[] args) {
        int MIN = Integer.MIN_VALUE, MAX = Integer.MAX_VALUE;
        List<Case> cases = List.of(
            new Case("một nút", () -> build(1), true),
            new Case("ba nút đúng", () -> build(2, 1, 3), true),
            new Case("cháu phải nhỏ hơn ông", () -> build(8, 3, 10, null, null, 6, 12), false),
            new Case("cháu trái lớn hơn ông", () -> build(8, 3, 10, 1, 9), false),
            new Case("trùng bên trái", () -> build(5, 5), false),
            new Case("trùng bên phải", () -> build(5, null, 5), false),
            new Case("một nút INT_MIN", () -> build(MIN), true),
            new Case("một nút INT_MAX", () -> build(MAX), true),
            new Case("INT_MIN rồi INT_MAX", () -> build(MIN, null, MAX), true),
            new Case("INT_MAX trùng", () -> build(MAX, MAX), false),
            new Case("cây cân 10^4 nút", () -> balancedBST(1, 10000), true),
            new Case("chuỗi phải 10^4 nút", () -> rightChain(10000), true),
            new Case("chuỗi 10^4 nút, đáy sai", () -> chainBadBottom(10000), false));

        Map<String, Predicate<TreeNode>> fns = new LinkedHashMap<>();
        fns.put("bruteMaxMin", ValidateBst::bruteMaxMin);
        fns.put("validBounds", ValidateBst::validBounds);
        fns.put("validBoundsIterative", ValidateBst::validBoundsIterative);
        fns.put("validInorder", ValidateBst::validInorder);
        fns.put("validInorderIterative", ValidateBst::validInorderIterative);
        fns.put("validMorris", ValidateBst::validMorris);
        fns.put("wrongParentChild", ValidateBst::wrongParentChild);
        fns.put("wrongIntSentinel", ValidateBst::wrongIntSentinel);

        for (var e : fns.entrySet()) {
            List<String> bad = new ArrayList<>();
            for (Case c : cases) {
                String got;
                try { got = String.valueOf(e.getValue().test(c.make().get())); }
                catch (StackOverflowError err) { got = "ném StackOverflowError"; }
                if (!got.equals(String.valueOf(c.want()))) bad.add(c.name() + " → " + got);
            }
            System.out.printf("%-21s %d/%d ca đúng%s%n", e.getKey(), cases.size() - bad.size(), cases.size(),
                bad.isEmpty() ? "" : "; sai ở " + String.join(", ", bad));
        }

        System.out.println("\nsố lần ghé nút và thời gian trung vị 5 lần (ms), cây đúng");
        System.out.println("cây                n   vét cạn: ghé       ms   khoảng (đệ quy)   trung thứ tự (lặp)   Morris");
        Object[][] rows = {
            { "cây cân", balancedBST(1, 10000), 10000 },
            { "chuỗi phải", rightChain(1000), 1000 },
            { "chuỗi phải", rightChain(4000), 4000 },
            { "chuỗi phải", rightChain(10000), 10000 },
        };
        for (Object[] r : rows) {
            TreeNode root = (TreeNode) r[1];
            double[] b = measure(ValidateBst::bruteMaxMin, root);
            double[] k = measure(ValidateBst::validBounds, root);
            double[] i = measure(ValidateBst::validInorderIterative, root);
            double[] m = measure(ValidateBst::validMorris, root);
            System.out.printf("%-11s %6d %14d %8.2f %17.3f %20.3f %8.3f%n", r[0], r[2], (long) b[0], b[1], k[1], i[1], m[1]);
        }
    }
}
