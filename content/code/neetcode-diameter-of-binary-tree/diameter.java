// LC 543 Diameter of Binary Tree: tính lại chiều cao, một lượt với mảng int[1] làm hộp chứa, bản lặp, và bẫy truyền int theo giá trị.
// Chạy: java diameter.java
import java.util.*;
import java.util.function.Supplier;
import java.util.function.ToIntFunction;

class Diameter {
    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
    }

    // Dựng cây từ mảng theo tầng kiểu LeetCode; null là chỗ trống.
    static TreeNode build(Integer... arr) {
        if (arr.length == 0 || arr[0] == null) return null;
        TreeNode root = new TreeNode(arr[0]);
        List<TreeNode> queue = new ArrayList<>(List.of(root));
        int i = 1;
        for (int q = 0; q < queue.size() && i < arr.length; q++) {
            TreeNode node = queue.get(q);
            if (arr[i] != null) { node.left = new TreeNode(arr[i]); queue.add(node.left); }
            i++;
            if (i < arr.length && arr[i] != null) { node.right = new TreeNode(arr[i]); queue.add(node.right); }
            i++;
        }
        return root;
    }

    static TreeNode leftChain(int n) {
        TreeNode root = null;
        for (int i = 0; i < n; i++) { TreeNode t = new TreeNode(i); t.left = root; root = t; }
        return root;
    }

    // Số nút trên đường dài nhất đi xuống; cây rỗng là 0.
    static int height(TreeNode node) {
        return node == null ? 0 : 1 + Math.max(height(node.left), height(node.right));
    }

    // Cách 1: tính lại chiều cao ở mọi nút.
    static int diameterNaive(TreeNode root) {
        if (root == null) return 0;
        return Math.max(height(root.left) + height(root.right), Math.max(diameterNaive(root.left), diameterNaive(root.right)));
    }

    // Cách 2: một lượt. Java truyền int theo giá trị, nên best nằm trong mảng một phần tử (hoặc một field).
    static int diameterOnePass(TreeNode root) {
        int[] best = {0};
        dfs(root, best);
        return best[0];
    }

    static int dfs(TreeNode node, int[] best) {
        if (node == null) return 0;
        int l = dfs(node.left, best), r = dfs(node.right, best);
        best[0] = Math.max(best[0], l + r);
        return 1 + Math.max(l, r);
    }

    // Cách 3: tiền thứ tự bằng ngăn xếp, xử lý ngược; chiều cao trong IdentityHashMap theo nút.
    static int diameterIterative(TreeNode root) {
        if (root == null) return 0;
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
        int best = 0;
        for (int i = order.size() - 1; i >= 0; i--) {
            TreeNode node = order.get(i);
            int l = node.left == null ? 0 : h.get(node.left);
            int r = node.right == null ? 0 : h.get(node.right);
            best = Math.max(best, l + r);
            h.put(node, 1 + Math.max(l, r));
        }
        return best;
    }

    // SAI: best là tham số int. Mỗi lời gọi có bản sao riêng; hàm ngoài luôn thấy 0.
    static int dfsByValue(TreeNode node, int best) {
        if (node == null) return 0;
        int l = dfsByValue(node.left, best), r = dfsByValue(node.right, best);
        best = Math.max(best, l + r);
        return 1 + Math.max(l, r);
    }

    static int wrongByValue(TreeNode root) {
        int best = 0;
        dfsByValue(root, best);
        return best;
    }

    static int maxDepth() {
        int lo = 1, hi = 1_000_000;
        while (lo < hi) {
            int m = (lo + hi + 1) >>> 1;
            try { diameterOnePass(leftChain(m)); lo = m; } catch (StackOverflowError e) { hi = m - 1; }
        }
        return lo;
    }

    public static void main(String[] args) {
        Integer[] full = new Integer[15];
        for (int i = 0; i < 15; i++) full[i] = i;
        String[] names = {"một nút", "hai nút", "rẽ ở gốc", "không đi qua gốc", "cây đầy 15 nút", "giá trị âm", "chuỗi lệch 10⁴ nút (giới hạn đề)"};
        List<Supplier<TreeNode>> makers = List.of(
            () -> build(7), () -> build(7, 3), () -> build(1, 2, 3, null, 4, 5, 6),
            () -> build(1, 2, null, 3, 4, 5, null, null, 6, 7, null, null, 8), () -> build(full),
            () -> build(-1, -2, -3, -4, null, null, -5), () -> leftChain(10_000));
        int[] want = {0, 1, 4, 6, 6, 4, 9999};
        String[] fnNames = {"diameterNaive", "diameterOnePass", "diameterIterative", "wrongByValue"};
        List<ToIntFunction<TreeNode>> fns = List.of(Diameter::diameterNaive, Diameter::diameterOnePass, Diameter::diameterIterative, Diameter::wrongByValue);
        for (int f = 0; f < fns.size(); f++) {
            List<String> bad = new ArrayList<>();
            for (int k = 0; k < names.length; k++) {
                String got;
                try { got = String.valueOf(fns.get(f).applyAsInt(makers.get(k).get())); }
                catch (StackOverflowError e) { got = "ném StackOverflowError"; }
                if (!got.equals(String.valueOf(want[k]))) bad.add(names[k] + " → " + got);
            }
            System.out.printf("%-18s %d/%d ca đúng%s%n", fnNames[f], names.length - bad.size(), names.length, bad.isEmpty() ? "" : "; sai ở " + String.join(", ", bad));
        }
        System.out.println();
        for (int r = 0; r < 3; r++) System.out.println("đệ quy một lượt sâu tối đa, lần " + (r + 1) + ": " + maxDepth() + " nút");
    }
}
