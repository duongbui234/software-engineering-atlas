// Ga LINK-04: cây nhị phân tìm kiếm (BST). Giải 235, 98, 230.
// Chạy: java bst.java

import java.util.*;
import java.util.function.BooleanSupplier;

public class Bst {
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

    // Tìm nút có giá trị v bằng chính tính chất BST.
    static TreeNode find(TreeNode root, int v) {
        while (root != null && root.val != v) root = v < root.val ? root.left : root.right;
        return root;
    }

    // 235: đi một đường từ gốc. Cả hai nhỏ hơn → trái; cả hai lớn hơn → phải; còn lại → đây là đáp án.
    static TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        TreeNode node = root;
        while (true) {
            if (p.val < node.val && q.val < node.val) node = node.left;
            else if (p.val > node.val && q.val > node.val) node = node.right;
            else return node;
        }
    }

    // LCA cho cây nhị phân bất kỳ (bài 236): không dùng thứ tự, hỏi cả hai cây con. O(n).
    static TreeNode lcaGeneric(TreeNode node, TreeNode p, TreeNode q) {
        if (node == null || node == p || node == q) return node;
        TreeNode l = lcaGeneric(node.left, p, q), r = lcaGeneric(node.right, p, q);
        return l != null && r != null ? node : (l != null ? l : r);
    }

    // 98: mỗi nút phải nằm trong khoảng mở (lo, hi) do MỌI tổ tiên đặt ra.
    // Khoảng là long: Long.MIN_VALUE/MAX_VALUE nằm ngoài mọi giá trị int của đề.
    static boolean isValidBST(TreeNode root) { return check(root, Long.MIN_VALUE, Long.MAX_VALUE); }
    static boolean check(TreeNode node, long lo, long hi) {
        if (node == null) return true;
        if (node.val <= lo || node.val >= hi) return false;
        return check(node.left, lo, node.val) && check(node.right, node.val, hi);
    }

    // BẪY riêng của Java: dùng Integer.MIN_VALUE/MAX_VALUE làm "vô cực" thì nút bằng đúng giá trị đó bị chấm sai.
    static boolean isValidBSTIntSentinel(TreeNode root) { return checkInt(root, Integer.MIN_VALUE, Integer.MAX_VALUE); }
    static boolean checkInt(TreeNode node, int lo, int hi) {
        if (node == null) return true;
        if (node.val <= lo || node.val >= hi) return false;
        return checkInt(node.left, lo, node.val) && checkInt(node.right, node.val, hi);
    }

    // 98 cách hai: trung thứ tự bằng ngăn xếp, giá trị phải tăng ngặt. Không đệ quy.
    static boolean isValidBSTInorder(TreeNode root) {
        ArrayDeque<TreeNode> stack = new ArrayDeque<>();
        TreeNode node = root;
        long prev = Long.MIN_VALUE;
        while (node != null || !stack.isEmpty()) {
            while (node != null) { stack.push(node); node = node.left; }
            node = stack.pop();
            if (node.val <= prev) return false;
            prev = node.val;
            node = node.right;
        }
        return true;
    }

    // BẪY của 98: chỉ so nút với hai con trực tiếp.
    static boolean isValidBSTParentChild(TreeNode node) {
        if (node == null) return true;
        if (node.left != null && node.left.val >= node.val) return false;
        if (node.right != null && node.right.val <= node.val) return false;
        return isValidBSTParentChild(node.left) && isValidBSTParentChild(node.right);
    }

    // 230: trung thứ tự của BST là dãy tăng. Đi bằng ngăn xếp, đếm, dừng ở nút thứ k: O(h + k).
    static int kthSmallest(TreeNode root, int k) {
        ArrayDeque<TreeNode> stack = new ArrayDeque<>();
        TreeNode node = root;
        while (true) {
            while (node != null) { stack.push(node); node = node.left; }
            node = stack.pop();
            if (--k == 0) return node.val;
            node = node.right;
        }
    }

    // 230 cách thẳng: gom cả trung thứ tự ra danh sách. Luôn O(n).
    static List<Integer> inorderValues(TreeNode root, List<Integer> out) {
        if (root != null) { inorderValues(root.left, out); out.add(root.val); inorderValues(root.right, out); }
        return out;
    }
    static int kthSmallestFull(TreeNode root, int k) { return inorderValues(root, new ArrayList<>()).get(k - 1); }

    static boolean insert(TreeNode root, int v) {
        TreeNode p = root;
        while (true) {
            if (v == p.val) return false;
            if (v < p.val) { if (p.left == null) { p.left = new TreeNode(v); return true; } p = p.left; }
            else { if (p.right == null) { p.right = new TreeNode(v); return true; } p = p.right; }
        }
    }

    // BST cân bằng từ dãy 0, 2, 4, …: chọn giữa làm gốc.
    static TreeNode balanced(int lo, int hi) {
        if (lo > hi) return null;
        int mid = (lo + hi) >>> 1;
        return new TreeNode(2 * mid, balanced(lo, mid - 1), balanced(mid + 1, hi));
    }

    static List<TreeNode> preorder(TreeNode root, List<TreeNode> out) {
        if (root != null) { out.add(root); preorder(root.left, out); preorder(root.right, out); }
        return out;
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

    static int broken = 0, naiveWrong = 0;

    // 300 BST ngẫu nhiên: 230 so với dãy đã sắp, 235 với LCA tổng quát, 98 trước và sau khi sửa bừa một nút.
    static boolean randomChecks() {
        Mulberry32 rand = new Mulberry32(42);
        for (int t = 0; t < 300; t++) {
            int n = 1 + (int) (rand.next() * 30);
            TreeNode root = new TreeNode((int) (rand.next() * 100));
            for (int size = 1; size < n; ) if (insert(root, (int) (rand.next() * 100))) size++;
            List<Integer> sorted = inorderValues(root, new ArrayList<>());
            for (int k = 1; k <= n; k++) if (kthSmallest(root, k) != sorted.get(k - 1)) return false;
            if (n >= 2) {
                int i = (int) (rand.next() * n), j = (i + 1 + (int) (rand.next() * (n - 1))) % n;
                TreeNode p = find(root, sorted.get(i)), q = find(root, sorted.get(j));
                if (lowestCommonAncestor(root, p, q) != lcaGeneric(root, p, q)) return false;
            }
            if (!isValidBST(root) || !isValidBSTInorder(root)) return false;
            TreeNode victim = preorder(root, new ArrayList<>()).get((int) (rand.next() * n));
            victim.val = (int) (rand.next() * 100);
            List<Integer> vals = inorderValues(root, new ArrayList<>());
            boolean ok = true;
            for (int x = 1; x < vals.size(); x++) if (vals.get(x - 1) >= vals.get(x)) ok = false;
            if (isValidBST(root) != ok || isValidBSTInorder(root) != ok) return false;
            if (!ok) { broken++; if (isValidBSTParentChild(root)) naiveWrong++; }
        }
        return true;
    }

    static TreeNode T(Integer... a) { return fromLevel(a); }
    static int lcaOf(int a, int b) {
        TreeNode r = T(20, 10, 30, 5, 15, 25, 35, null, null, 12, 17);
        return lowestCommonAncestor(r, find(r, a), find(r, b)).val;
    }
    static TreeNode chain(int n) {
        TreeNode r = new TreeNode(0), p = r;
        for (int v = 1; v < n; v++) { p.right = new TreeNode(v); p = p.right; }
        return r;
    }

    static double median(Runnable f) {
        double[] ts = new double[5];
        for (int k = 0; k < 5; k++) { long t0 = System.nanoTime(); f.run(); ts[k] = (System.nanoTime() - t0) / 1e6; }
        Arrays.sort(ts);
        return ts[2];
    }
    static String fmt(double ms) { return ms < 1 ? String.format("%.1f µs", ms * 1000) : String.format("%.1f ms", ms); }

    public static void main(String[] args) {
        Integer n = null;
        Integer[] deep = {10, 5, 15, n, n, 12, 20, 9};
        Integer[] full = {20, 10, 30, 5, 15, 25, 35};
        Object[][] cases = {
            {"235 hai nút ở hai nhánh của gốc", (BooleanSupplier) () -> lcaOf(10, 30) == 20},
            {"235 một nút là tổ tiên của nút kia", (BooleanSupplier) () -> lcaOf(10, 17) == 10},
            {"235 hai lá cùng một cha", (BooleanSupplier) () -> lcaOf(12, 17) == 15},
            {"235 tách nhau ở tầng giữa", (BooleanSupplier) () -> lcaOf(5, 12) == 10},
            {"98 cây ba nút đúng thứ tự", (BooleanSupplier) () -> isValidBST(T(5, 3, 8)) && isValidBSTInorder(T(5, 3, 8))},
            {"98 nút sâu vi phạm khoảng của tổ tiên", (BooleanSupplier) () -> !isValidBST(T(deep)) && !isValidBSTInorder(T(deep)) && isValidBSTParentChild(T(deep))},
            {"98 giá trị trùng không hợp lệ", (BooleanSupplier) () -> !isValidBST(T(5, 5)) && !isValidBST(T(5, n, 5))},
            {"98 một nút bằng 2^31 − 1", (BooleanSupplier) () -> isValidBST(T(2147483647)) && isValidBSTInorder(T(2147483647))},
            {"98 hai đầu mút của int", (BooleanSupplier) () -> isValidBST(T(-2147483648, n, 2147483647))},
            {"230 nhỏ nhất, giữa, lớn nhất", (BooleanSupplier) () -> kthSmallest(T(full), 1) == 5 && kthSmallest(T(full), 4) == 20 && kthSmallest(T(full), 7) == 35},
            {"230 cây chỉ có nhánh trái", (BooleanSupplier) () -> kthSmallest(T(4, 3, n, 2, n, 1), 2) == 2},
            {"230 cây chỉ có nhánh phải", (BooleanSupplier) () -> kthSmallest(T(1, n, 2, n, 3), 3) == 3},
            {"random 300 BST: 235, 98, 230", (BooleanSupplier) Bst::randomChecks},
            {"98 và 230 trên chuỗi lệch 10^5 nút", (BooleanSupplier) () -> isValidBSTInorder(chain(100_000)) && kthSmallest(chain(100_000), 99_999) == 99_998},
        };
        int ok = 0;
        for (Object[] c : cases) {
            if (((BooleanSupplier) c[1]).getAsBoolean()) ok++;
            else System.out.println("SAI: " + c[0]);
        }
        System.out.println("bst " + ok + "/" + cases.length + " ca đúng");
        System.out.println("98 trên 300 cây bị sửa một nút: " + broken + " cây hỏng, cách chỉ so cha-con nhận nhầm " + naiveWrong + " cây");
        System.out.println("98 với Integer.MIN_VALUE/MAX_VALUE làm vô cực: cây [2147483647] bị chấm " + isValidBSTIntSentinel(T(2147483647)) + ", bản dùng long: " + isValidBST(T(2147483647)));

        // Đo trên BST cân bằng 10^6 nút (giá trị 0, 2, 4, …), cao 20.
        final int N = 1_000_000;
        TreeNode big = balanced(0, N - 1);
        Mulberry32 rand = new Mulberry32(7);
        // Cặp hai giá trị liền nhau (v, v + 2): tổ tiên chung nằm sâu, đường đi dài gần bằng chiều cao.
        TreeNode[][] pairs = new TreeNode[1000][];
        for (int t = 0; t < pairs.length; t++) {
            int v = 2 * (int) (rand.next() * (N - 1));
            pairs[t] = new TreeNode[] {find(big, v), find(big, v + 2)};
        }
        // Chạy nóng để JIT biên dịch trước khi đo.
        for (int w = 0; w < 20; w++) for (TreeNode[] pq : pairs) lowestCommonAncestor(big, pq[0], pq[1]);
        lcaGeneric(big, pairs[0][0], pairs[0][1]);
        double walk = median(() -> { for (TreeNode[] pq : pairs) lowestCommonAncestor(big, pq[0], pq[1]); }) / pairs.length;
        double generic = median(() -> { for (int t = 0; t < 5; t++) lcaGeneric(big, pairs[t][0], pairs[t][1]); }) / 5;
        System.out.printf("235 trên BST cân bằng 10^6 nút: đi theo giá trị %.2f µs/truy vấn, LCA tổng quát %.1f ms/truy vấn%n", walk * 1000, generic);
        for (int k : new int[] {10, N / 2}) {
            int reps = k < 1000 ? 1000 : 1; // k nhỏ chạy quá nhanh nên lặp 1000 lần rồi chia
            double early = median(() -> { for (int r = 0; r < reps; r++) kthSmallest(big, k); }) / reps;
            System.out.println("230 trên BST cân bằng 10^6 nút, k = " + k + ": dừng sớm " + fmt(early) + ", gom cả cây " + fmt(median(() -> kthSmallestFull(big, k))));
        }
    }
}
