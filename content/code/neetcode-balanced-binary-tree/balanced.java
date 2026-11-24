// LC 110 Balanced Binary Tree: từ trên xuống, từ dưới lên với giá trị canh -1, bản lặp, và bẫy chỉ xét gốc.
// Chạy: java balanced.java
import java.util.*;
import java.util.function.Predicate;
import java.util.function.Supplier;

class Balanced {
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

    static Integer[] seq(int n) {
        Integer[] a = new Integer[n];
        for (int i = 0; i < n; i++) a[i] = i;
        return a;
    }

    static TreeNode leftChain(int n) {
        TreeNode root = null;
        for (int i = 0; i < n; i++) root = new TreeNode(i, root, null);
        return root;
    }

    static TreeNode fibTree(int h) {
        return h <= 0 ? null : new TreeNode(h, fibTree(h - 1), fibTree(h - 2));
    }

    static TreeNode combTree(int L) {
        TreeNode spine = null;
        for (int i = L - 1; i >= 0; i--) spine = new TreeNode(i, spine, leftChain(L - 1 - i));
        return spine;
    }

    static int height(TreeNode node) {
        return node == null ? 0 : 1 + Math.max(height(node.left), height(node.right));
    }

    // Cách 1: từ trên xuống.
    static boolean balancedTopDown(TreeNode root) {
        if (root == null) return true;
        return Math.abs(height(root.left) - height(root.right)) <= 1 && balancedTopDown(root.left) && balancedTopDown(root.right);
    }

    // Cách 2: từ dưới lên; -1 nghĩa là "đã lệch", nên một int mang được cả hai thông tin.
    static int check(TreeNode node) {
        if (node == null) return 0;
        int l = check(node.left);
        if (l == -1) return -1;
        int r = check(node.right);
        if (r == -1 || Math.abs(l - r) > 1) return -1;
        return 1 + Math.max(l, r);
    }

    static boolean balancedBottomUp(TreeNode root) { return check(root) != -1; }

    // Cách 3: tiền thứ tự bằng ngăn xếp, xử lý ngược.
    static boolean balancedIterative(TreeNode root) {
        if (root == null) return true;
        List<TreeNode> order = new ArrayList<>();
        Deque<TreeNode> stack = new ArrayDeque<>();
        stack.push(root);
        while (!stack.isEmpty()) {
            TreeNode node = stack.pop();
            order.add(node);
            if (node.left != null) stack.push(node.left);
            if (node.right != null) stack.push(node.right);
        }
        Map<TreeNode, Integer> h = new IdentityHashMap<>();
        for (int i = order.size() - 1; i >= 0; i--) {
            TreeNode node = order.get(i);
            int l = node.left == null ? 0 : h.get(node.left);
            int r = node.right == null ? 0 : h.get(node.right);
            if (Math.abs(l - r) > 1) return false;
            h.put(node, 1 + Math.max(l, r));
        }
        return true;
    }

    // SAI: chỉ so hai cây con của gốc.
    static boolean wrongRootOnly(TreeNode root) {
        return root == null || Math.abs(height(root.left) - height(root.right)) <= 1;
    }

    static double median(Runnable f, int reps) {
        double[] ts = new double[reps];
        for (int i = 0; i < reps; i++) {
            long t0 = System.nanoTime();
            f.run();
            ts[i] = (System.nanoTime() - t0) / 1e6;
        }
        Arrays.sort(ts);
        return ts[reps / 2];
    }

    public static void main(String[] args) {
        String[] names = {"cây rỗng", "một nút", "cây đầy 7 nút", "lệch ngay ở gốc", "gốc cân, con lệch", "chuỗi 4 nút (-1 cạnh 0)",
            "cây Fibonacci bậc 5", "cây đủ 5000 nút", "chuỗi lệch 5000 nút (giới hạn đề)"};
        List<Supplier<TreeNode>> makers = List.of(
            () -> null, () -> build(1), () -> build(1, 2, 3, 4, 5, 6, 7), () -> build(1, 2, null, 3),
            () -> build(1, 2, 3, 4, null, null, 5, 6, null, null, 7), () -> build(1, 2, null, 3, null, 4),
            () -> fibTree(5), () -> build(seq(5000)), () -> leftChain(5000));
        boolean[] want = {true, true, true, false, false, false, true, true, false};
        String[] fnNames = {"balancedTopDown", "balancedBottomUp", "balancedIterative", "wrongRootOnly"};
        List<Predicate<TreeNode>> fns = List.of(Balanced::balancedTopDown, Balanced::balancedBottomUp, Balanced::balancedIterative, Balanced::wrongRootOnly);
        for (int f = 0; f < fns.size(); f++) {
            List<String> bad = new ArrayList<>();
            for (int k = 0; k < names.length; k++) {
                String got;
                try { got = String.valueOf(fns.get(f).test(makers.get(k).get())); }
                catch (StackOverflowError e) { got = "ném StackOverflowError"; }
                if (!got.equals(String.valueOf(want[k]))) bad.add(names[k] + " → " + got);
            }
            System.out.printf("%-18s %d/%d ca đúng%s%n", fnNames[f], names.length - bad.size(), names.length, bad.isEmpty() ? "" : "; sai ở " + String.join(", ", bad));
        }

        System.out.println("\ntrung vị 5 lần (ms)");
        System.out.println("cây                        trên xuống   dưới lên    bản lặp");
        TreeNode perfect = build(seq((1 << 20) - 1)), comb = combTree(1000);
        Object[][] rows = {{"hoàn hảo 2^20 - 1 nút", perfect}, {"răng lược L = 1000", comb}};
        for (Object[] row : rows) {
            TreeNode root = (TreeNode) row[1];
            System.out.printf("%-26s %10.2f %10.2f %10.2f%n", row[0],
                median(() -> balancedTopDown(root), 5), median(() -> balancedBottomUp(root), 5), median(() -> balancedIterative(root), 5));
        }
    }
}
