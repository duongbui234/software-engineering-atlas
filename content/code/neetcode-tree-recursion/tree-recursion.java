// Ga LINK-03: đệ quy trên cây. Giải 226, 104, 543, 110, 100, 572.
// Chạy: java tree-recursion.java

import java.util.*;
import java.util.function.BooleanSupplier;

public class TreeRecursion {
    static class TreeNode {
        int val; TreeNode left, right;
        TreeNode(int val) { this.val = val; }
        TreeNode(int val, TreeNode left, TreeNode right) { this.val = val; this.left = left; this.right = right; }
    }

    // Dựng cây từ mảng theo tầng kiểu LeetCode; null là chỗ trống.
    static TreeNode fromLevel(Integer... a) {
        if (a.length == 0 || a[0] == null) return null;
        TreeNode root = new TreeNode(a[0]);
        List<TreeNode> queue = new ArrayList<>(List.of(root));
        int i = 1;
        for (int q = 0; q < queue.size() && i < a.length; q++) {
            TreeNode node = queue.get(q);
            if (i < a.length && a[i] != null) { node.left = new TreeNode(a[i]); queue.add(node.left); }
            i++;
            if (i < a.length && a[i] != null) { node.right = new TreeNode(a[i]); queue.add(node.right); }
            i++;
        }
        return root;
    }

    static List<Integer> toLevel(TreeNode root) {
        List<Integer> out = new ArrayList<>();
        List<TreeNode> queue = new ArrayList<>();
        queue.add(root);
        for (int q = 0; q < queue.size(); q++) {
            TreeNode node = queue.get(q);
            out.add(node == null ? null : node.val);
            if (node != null) { queue.add(node.left); queue.add(node.right); }
        }
        while (!out.isEmpty() && out.get(out.size() - 1) == null) out.remove(out.size() - 1);
        return out;
    }

    // 226: đổi chỗ hai con ở mọi nút.
    static TreeNode invertTree(TreeNode root) {
        if (root == null) return null;
        TreeNode left = invertTree(root.left);
        root.left = invertTree(root.right);
        root.right = left;
        return root;
    }

    // 104: chiều cao = 1 + chiều cao con cao hơn.
    static int maxDepth(TreeNode root) {
        if (root == null) return 0;
        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
    }

    // 104 không đệ quy: hai ngăn xếp song song giữ nút và độ sâu.
    static int maxDepthIter(TreeNode root) {
        if (root == null) return 0;
        int best = 0;
        ArrayDeque<TreeNode> nodes = new ArrayDeque<>(List.of(root));
        ArrayDeque<Integer> depths = new ArrayDeque<>(List.of(1));
        while (!nodes.isEmpty()) {
            TreeNode node = nodes.pop();
            int d = depths.pop();
            best = Math.max(best, d);
            if (node.left != null) { nodes.push(node.left); depths.push(d + 1); }
            if (node.right != null) { nodes.push(node.right); depths.push(d + 1); }
        }
        return best;
    }

    // 543: hàm TRẢ VỀ chiều cao, đường kính được GHI vào mảng 1 phần tử (lambda Java không gán được biến ngoài).
    static int diameterOfBinaryTree(TreeNode root) {
        int[] best = {0};
        height(root, best);
        return best[0];
    }
    static int height(TreeNode node, int[] best) {
        if (node == null) return 0;
        int l = height(node.left, best), r = height(node.right, best);
        best[0] = Math.max(best[0], l + r);
        return 1 + Math.max(l, r);
    }

    // 543 không đệ quy: hậu thứ tự bằng ngăn xếp, cờ "đã thăm con".
    static int diameterIter(TreeNode root) {
        if (root == null) return 0;
        Map<TreeNode, Integer> h = new HashMap<>();
        ArrayDeque<TreeNode> nodes = new ArrayDeque<>(List.of(root));
        ArrayDeque<Boolean> done = new ArrayDeque<>(List.of(false));
        int best = 0;
        while (!nodes.isEmpty()) {
            TreeNode node = nodes.pop();
            boolean childrenDone = done.pop();
            if (childrenDone) {
                int l = h.getOrDefault(node.left, 0), r = h.getOrDefault(node.right, 0);
                best = Math.max(best, l + r);
                h.put(node, 1 + Math.max(l, r));
            } else {
                nodes.push(node); done.push(true);
                if (node.right != null) { nodes.push(node.right); done.push(false); }
                if (node.left != null) { nodes.push(node.left); done.push(false); }
            }
        }
        return best;
    }

    // 110: trả chiều cao, hoặc -1 làm giá trị canh "đã lệch ở dưới".
    static boolean isBalanced(TreeNode root) { return check(root) != -1; }
    static int check(TreeNode node) {
        if (node == null) return 0;
        int l = check(node.left);
        if (l == -1) return -1;
        int r = check(node.right);
        if (r == -1 || Math.abs(l - r) > 1) return -1;
        return 1 + Math.max(l, r);
    }

    // 100: đi song song hai cây.
    static boolean isSameTree(TreeNode p, TreeNode q) {
        if (p == null || q == null) return p == q;
        return p.val == q.val && isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
    }

    // 572: thử mọi nút làm gốc, so cả cây. O(m · n) trường hợp xấu nhất.
    static boolean isSubtree(TreeNode root, TreeNode sub) {
        if (root == null) return sub == null;
        return isSameTree(root, sub) || isSubtree(root.left, sub) || isSubtree(root.right, sub);
    }

    // Bản ngây thơ để so: tính lại chiều cao từ đầu ở mỗi nút.
    static int heightSlow(TreeNode n) { return n == null ? 0 : 1 + Math.max(heightSlow(n.left), heightSlow(n.right)); }
    static int diameterSlow(TreeNode n) {
        if (n == null) return 0;
        return Math.max(heightSlow(n.left) + heightSlow(n.right), Math.max(diameterSlow(n.left), diameterSlow(n.right)));
    }
    static boolean balancedSlow(TreeNode n) {
        if (n == null) return true;
        return Math.abs(heightSlow(n.left) - heightSlow(n.right)) <= 1 && balancedSlow(n.left) && balancedSlow(n.right);
    }

    // Bộ sinh ngẫu nhiên mulberry32: int 32 bit tự tràn, >>> là dịch không dấu.
    static class Mulberry32 {
        int a;
        Mulberry32(int seed) { a = seed; }
        double next() {
            a += 0x6D2B79F5;
            int t = (a ^ (a >>> 15)) * (1 | a);
            t = (t + (t ^ (t >>> 7)) * (61 | t)) ^ t;
            return ((t ^ (t >>> 14)) & 0xFFFFFFFFL) / 4294967296.0;
        }
    }

    static TreeNode randomTree(int n, Mulberry32 rand) {
        TreeNode root = null;
        for (int k = 0; k < n; k++) {
            TreeNode node = new TreeNode((int) (rand.next() * 3));
            if (root == null) { root = node; continue; }
            TreeNode p = root;
            while (true) {
                if (rand.next() < 0.5) { if (p.left == null) { p.left = node; break; } p = p.left; }
                else { if (p.right == null) { p.right = node; break; } p = p.right; }
            }
        }
        return root;
    }

    static List<TreeNode> nodes(TreeNode root) {
        List<TreeNode> out = new ArrayList<>();
        ArrayDeque<TreeNode> stack = new ArrayDeque<>();
        if (root != null) stack.push(root);
        while (!stack.isEmpty()) {
            TreeNode n = stack.pop();
            out.add(n);
            if (n.left != null) stack.push(n.left);
            if (n.right != null) stack.push(n.right);
        }
        return out;
    }

    static TreeNode cloneTree(TreeNode n) { return n == null ? null : new TreeNode(n.val, cloneTree(n.left), cloneTree(n.right)); }

    static TreeNode chain(int n) {
        TreeNode root = null;
        for (int k = 0; k < n; k++) root = new TreeNode(k, root, null);
        return root;
    }

    static boolean randomCasesAgree() {
        Mulberry32 rand = new Mulberry32(42);
        for (int t = 0; t < 300; t++) {
            TreeNode root = randomTree((int) (rand.next() * 40), rand);
            if (maxDepth(root) != maxDepthIter(root)) return false;
            if (diameterOfBinaryTree(root) != diameterSlow(root) || diameterIter(root) != diameterSlow(root)) return false;
            if (isBalanced(root) != balancedSlow(root)) return false;
            if (!isSameTree(invertTree(invertTree(cloneTree(root))), root)) return false;
            List<TreeNode> all = nodes(root);
            if (!all.isEmpty() && !isSubtree(root, cloneTree(all.get((int) (rand.next() * all.size()))))) return false;
        }
        return true;
    }

    static boolean survives(TreeNode root) {
        try { maxDepth(root); return true; } catch (StackOverflowError e) { return false; }
    }

    // Tìm nhị phân độ sâu lớn nhất mà maxDepth chạy được trên luồng hiện tại.
    static int deepestChain() {
        int lo = 100, hi = 2_000_000;
        while (lo < hi) {
            int mid = (int) (((long) lo + hi + 1) / 2);
            if (survives(chain(mid))) lo = mid; else hi = mid - 1;
        }
        return lo;
    }

    static double median(Runnable f) {
        double[] ts = new double[5];
        for (int k = 0; k < 5; k++) { long t0 = System.nanoTime(); f.run(); ts[k] = (System.nanoTime() - t0) / 1e6; }
        Arrays.sort(ts);
        return ts[2];
    }

    static TreeNode T(Integer... a) { return fromLevel(a); }

    public static void main(String[] args) throws Exception {
        Integer n = null;
        Map<String, BooleanSupplier> checks = new LinkedHashMap<>();
        checks.put("226 ví dụ của đề", () -> toLevel(invertTree(T(4, 2, 7, 1, 3, 6, 9))).equals(List.of(4, 7, 2, 9, 6, 3, 1)));
        checks.put("226 cây rỗng", () -> invertTree(null) == null);
        checks.put("104 ví dụ của đề", () -> maxDepth(T(3, 9, 20, n, n, 15, 7)) == 3);
        checks.put("104 chỉ có nhánh phải", () -> maxDepth(T(1, n, 2)) == 2);
        checks.put("543 ví dụ của đề", () -> diameterOfBinaryTree(T(1, 2, 3, 4, 5)) == 3);
        checks.put("543 hai nút", () -> diameterOfBinaryTree(T(1, 2)) == 1);
        checks.put("543 đường dài nhất không qua gốc", () -> diameterOfBinaryTree(T(1, 2, n, 3, 4, 5, n, n, 6)) == 4);
        checks.put("110 cây cân bằng", () -> isBalanced(T(3, 9, 20, n, n, 15, 7)));
        checks.put("110 lệch ở nhánh trái", () -> !isBalanced(T(1, 2, 2, 3, 3, n, n, 4, 4)));
        checks.put("110 gốc cân nhưng con lệch", () -> !isBalanced(T(1, 2, 2, 3, n, n, 3, 4, n, n, 4)));
        checks.put("100 hai cây giống nhau", () -> isSameTree(T(1, 2, 3), T(1, 2, 3)));
        checks.put("100 cùng giá trị, khác hình", () -> !isSameTree(T(1, 2), T(1, n, 2)));
        checks.put("572 có cây con", () -> isSubtree(T(3, 4, 5, 1, 2), T(4, 1, 2)));
        checks.put("572 khớp đầu nhưng thừa nút dưới", () -> !isSubtree(T(3, 4, 5, 1, 2, n, n, n, n, 0), T(4, 1, 2)));
        checks.put("300 cây ngẫu nhiên khớp bản chậm", TreeRecursion::randomCasesAgree);
        checks.put("chuỗi lệch 100 000 nút, bản lặp", () -> maxDepthIter(chain(100_000)) == 100_000 && diameterIter(chain(100_000)) == 99_999);

        List<String> bad = new ArrayList<>();
        checks.forEach((name, f) -> { if (!f.getAsBoolean()) bad.add(name); });
        System.out.println("tree-recursion " + (checks.size() - bad.size()) + "/" + checks.size() + " ca đúng"
                + (bad.isEmpty() ? "" : "; sai ở " + String.join(", ", bad)));

        // Đo 1: luồng main dùng stack mặc định (-Xss); một luồng mới có thể xin stack lớn hơn.
        System.out.println("104 đệ quy trên cây lệch, luồng main: chịu được khoảng " + deepestChain() + " nút");
        int[] big = {0};
        TreeNode deep = chain(1_000_000);
        Thread t = new Thread(null, () -> big[0] = maxDepth(deep), "deep", 256L << 20);
        t.start();
        t.join();
        System.out.println("104 đệ quy trên chuỗi 1000000 nút, luồng có stack 256 MB: cao " + big[0]);

        // Đo 2: cây ngẫu nhiên 10^6 nút, đệ quy so với ngăn xếp tự quản lý.
        TreeNode tree = randomTree(1_000_000, new Mulberry32(7));
        double rec = median(() -> diameterOfBinaryTree(tree));
        double it = median(() -> diameterIter(tree));
        System.out.printf("543 trên cây ngẫu nhiên 10^6 nút (cao %d): đệ quy %.1f ms, ngăn xếp %.1f ms%n", maxDepthIter(tree), rec, it);
    }
}
