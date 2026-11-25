// Ga LINK-05: duyệt theo tầng và mang trạng thái. Giải 102, 199, 1448.
// Chạy: java level-order.java
import java.util.*;
import java.util.function.BooleanSupplier;

public class Main {
    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
        TreeNode(int val, TreeNode left, TreeNode right) { this.val = val; this.left = left; this.right = right; }
    }

    // Dựng cây từ mảng theo tầng kiểu LeetCode: null là "không có nút".
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

    // 102: BFS bằng ArrayDeque. Chụp size = queue.size() TRƯỚC vòng for; con được offer vào sau.
    // ArrayDeque không nhận null, nên phải kiểm con khác null trước khi offer.
    static List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        if (root == null) return res;
        ArrayDeque<TreeNode> queue = new ArrayDeque<>();
        queue.offer(root);
        while (!queue.isEmpty()) {
            int size = queue.size(); // chụp kích thước tầng
            List<Integer> level = new ArrayList<>(size);
            for (int i = 0; i < size; i++) {
                TreeNode node = queue.poll();
                level.add(node.val);
                if (node.left != null) queue.offer(node.left);
                if (node.right != null) queue.offer(node.right);
            }
            res.add(level);
        }
        return res;
    }

    // 102 cách hai: DFS tiền thứ tự mang độ sâu.
    static List<List<Integer>> levelOrderDfs(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        levelDfs(root, 0, res);
        return res;
    }
    static void levelDfs(TreeNode node, int depth, List<List<Integer>> res) {
        if (node == null) return;
        if (res.size() == depth) res.add(new ArrayList<>());
        res.get(depth).add(node.val);
        levelDfs(node.left, depth + 1, res);
        levelDfs(node.right, depth + 1, res);
    }

    // 199: nút CUỐI của mỗi tầng.
    static List<Integer> rightSideView(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        if (root == null) return res;
        ArrayDeque<TreeNode> queue = new ArrayDeque<>();
        queue.offer(root);
        while (!queue.isEmpty()) {
            int size = queue.size();
            for (int i = 0; i < size; i++) {
                TreeNode node = queue.poll();
                if (i == size - 1) res.add(node.val);
                if (node.left != null) queue.offer(node.left);
                if (node.right != null) queue.offer(node.right);
            }
        }
        return res;
    }

    // 199 cách hai: DFS đi PHẢI trước, mang độ sâu.
    static List<Integer> rightSideViewDfs(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        rightDfs(root, 0, res);
        return res;
    }
    static void rightDfs(TreeNode node, int depth, List<Integer> res) {
        if (node == null) return;
        if (res.size() == depth) res.add(node.val);
        rightDfs(node.right, depth + 1, res);
        rightDfs(node.left, depth + 1, res);
    }

    // 1448: tiền thứ tự, MANG XUỐNG giá trị lớn nhất trên đường từ gốc.
    static int goodNodes(TreeNode root) { return good(root, Integer.MIN_VALUE); }
    static int good(TreeNode node, int maxSoFar) {
        if (node == null) return 0;
        int g = node.val >= maxSoFar ? 1 : 0;
        int m = Math.max(maxSoFar, node.val);
        return g + good(node.left, m) + good(node.right, m);
    }

    // 1448 cách hai: ngăn xếp các cặp (nút, max trên đường tới nó). record gói hai giá trị.
    record Item(TreeNode node, int maxSoFar) {}
    static int goodNodesIter(TreeNode root) {
        if (root == null) return 0;
        int count = 0;
        ArrayDeque<Item> stack = new ArrayDeque<>();
        stack.push(new Item(root, Integer.MIN_VALUE));
        while (!stack.isEmpty()) {
            Item it = stack.pop();
            if (it.node().val >= it.maxSoFar()) count++;
            int m = Math.max(it.maxSoFar(), it.node().val);
            if (it.node().right != null) stack.push(new Item(it.node().right, m));
            if (it.node().left != null) stack.push(new Item(it.node().left, m));
        }
        return count;
    }

    // 1448 cách ba: BFS, trạng thái đi cùng nút trong hàng đợi.
    static int goodNodesBfs(TreeNode root) {
        if (root == null) return 0;
        int count = 0;
        ArrayDeque<Item> queue = new ArrayDeque<>();
        queue.offer(new Item(root, Integer.MIN_VALUE));
        while (!queue.isEmpty()) {
            Item it = queue.poll();
            if (it.node().val >= it.maxSoFar()) count++;
            int m = Math.max(it.maxSoFar(), it.node().val);
            if (it.node().left != null) queue.offer(new Item(it.node().left, m));
            if (it.node().right != null) queue.offer(new Item(it.node().right, m));
        }
        return count;
    }

    // ---- Các bản SAI ----

    // BẪY 102: lặp tới khi hàng đợi rỗng thay vì đúng `size` lần: con vừa offer cũng bị lấy luôn.
    static List<List<Integer>> levelOrderNoSnapshot(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        if (root == null) return res;
        ArrayDeque<TreeNode> queue = new ArrayDeque<>();
        queue.offer(root);
        while (!queue.isEmpty()) {
            List<Integer> level = new ArrayList<>();
            while (!queue.isEmpty()) {
                TreeNode node = queue.poll();
                level.add(node.val);
                if (node.left != null) queue.offer(node.left);
                if (node.right != null) queue.offer(node.right);
            }
            res.add(level);
        }
        return res;
    }

    // BẪY 199: chỉ đi theo con phải.
    static List<Integer> rightSideViewOnlyRight(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        for (TreeNode node = root; node != null; node = node.right) res.add(node.val);
        return res;
    }

    // BẪY 1448: chỉ so với cha.
    static int goodNodesParentOnly(TreeNode root) { return parentOnly(root, Integer.MIN_VALUE); }
    static int parentOnly(TreeNode node, int parent) {
        if (node == null) return 0;
        return (node.val >= parent ? 1 : 0) + parentOnly(node.left, node.val) + parentOnly(node.right, node.val);
    }

    // Vét cạn cho 1448: giữ cả đường đi, quét lại ở mỗi nút.
    static int goodNodesBrute(TreeNode root) { return brute(root, new ArrayList<>()); }
    static int brute(TreeNode node, List<Integer> path) {
        if (node == null) return 0;
        int g = 1;
        for (int v : path) if (v > node.val) { g = 0; break; }
        path.add(node.val);
        int r = g + brute(node.left, path) + brute(node.right, path);
        path.remove(path.size() - 1);
        return r;
    }

    // ---- Dữ liệu thử ----

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
        if (n == 0) return null;
        TreeNode node = new TreeNode((int) Math.floor(rand.next() * 11) - 5);
        int leftSize = (int) Math.floor(rand.next() * n);
        node.left = randomTree(leftSize, rand);
        node.right = randomTree(n - 1 - leftSize, rand);
        return node;
    }

    static TreeNode rightChain(int n) {
        TreeNode root = new TreeNode(1), cur = root;
        for (int v = 2; v <= n; v++) { cur.right = new TreeNode(v); cur = cur.right; }
        return root;
    }

    static int wrongSnap, wrongRight, wrongParent;

    static boolean randomCase() {
        Mulberry32 rand = new Mulberry32(42);
        boolean ok = true;
        for (int t = 0; t < 300; t++) {
            TreeNode root = randomTree(1 + (int) Math.floor(rand.next() * 40), rand);
            List<List<Integer>> lo = levelOrder(root);
            List<Integer> rv = rightSideView(root);
            int g = goodNodesBrute(root);
            if (!lo.equals(levelOrderDfs(root))) ok = false;
            List<Integer> last = new ArrayList<>();
            for (List<Integer> l : lo) last.add(l.get(l.size() - 1));
            if (!rv.equals(rightSideViewDfs(root)) || !rv.equals(last)) ok = false;
            if (goodNodes(root) != g || goodNodesIter(root) != g || goodNodesBfs(root) != g) ok = false;
            if (!levelOrderNoSnapshot(root).equals(lo)) wrongSnap++;
            if (!rightSideViewOnlyRight(root).equals(rv)) wrongRight++;
            if (goodNodesParentOnly(root) != g) wrongParent++;
        }
        return ok;
    }

    static final int N = 100_000;

    record Case(String name, BooleanSupplier fn) {}

    public static void main(String[] args) {
        List<Case> cases = List.of(
            new Case("102 cây rỗng", () -> levelOrder(null).equals(List.of())),
            new Case("102 một nút", () -> levelOrder(fromLevel(1)).equals(List.of(List.of(1)))),
            new Case("102 bốn tầng", () -> levelOrder(fromLevel(1, 2, 3, 4, null, 5, 6, null, 7))
                .equals(List.of(List.of(1), List.of(2, 3), List.of(4, 5, 6), List.of(7)))),
            new Case("102 chỉ nhánh trái", () -> levelOrder(fromLevel(1, 2, null, 3))
                .equals(List.of(List.of(1), List.of(2), List.of(3)))),
            new Case("199 cây rỗng", () -> rightSideView(null).equals(List.of())),
            new Case("199 nhánh trái sâu hơn", () -> rightSideView(fromLevel(1, 2, 3, 4)).equals(List.of(1, 3, 4))),
            new Case("199 chỉ nhánh trái", () -> rightSideView(fromLevel(5, 4, null, 3)).equals(List.of(5, 4, 3))),
            new Case("199 bốn tầng", () -> rightSideView(fromLevel(1, 2, 3, 4, null, 5, 6, null, 7)).equals(List.of(1, 3, 6, 7))),
            new Case("1448 cây bảy nút", () -> goodNodes(fromLevel(2, 1, 5, null, 3, 4, 6)) == 4),
            new Case("1448 cháu nhỏ hơn ông", () -> goodNodes(fromLevel(5, 1, null, 3)) == 1),
            new Case("1448 giá trị bằng nhau", () -> goodNodes(fromLevel(2, 2, 2)) == 3),
            new Case("1448 gốc âm", () -> goodNodes(fromLevel(-1)) == 1),
            new Case("300 cây ngẫu nhiên: mọi cách khớp nhau và khớp vét cạn", Main::randomCase),
            new Case("chuỗi lệch 10^5 nút: 1448 bản ngăn xếp, 102 và 199", () -> {
                TreeNode c = rightChain(N);
                return goodNodesIter(c) == N && levelOrder(c).size() == N && rightSideView(c).size() == N;
            })
        );
        int pass = 0;
        for (Case c : cases) {
            boolean ok = false;
            try { ok = c.fn().getAsBoolean(); } catch (Throwable e) { System.out.println("  lỗi ở \"" + c.name() + "\": " + e.getClass().getSimpleName()); }
            if (ok) pass++; else System.out.println("  sai: " + c.name());
        }
        System.out.println("level-order " + pass + "/" + cases.size() + " ca đúng");
        System.out.println("bẫy trên 300 cây ngẫu nhiên: không chụp kích thước tầng sai " + wrongSnap
            + " cây, chỉ đi con phải sai " + wrongRight + " cây, chỉ so với cha sai " + wrongParent + " cây");

        // Đệ quy 10^5 tầng trên luồng main (stack mặc định 1 MB trên máy đo).
        TreeNode chain = rightChain(N);
        try { goodNodes(chain); System.out.println("1448 đệ quy trên chuỗi 10^5 nút: chạy được"); }
        catch (StackOverflowError e) { System.out.println("1448 đệ quy trên chuỗi 10^5 nút: StackOverflowError; bản ngăn xếp: " + goodNodesIter(chain)); }

        // ArrayDeque từ chối null: quên kiểm con khác null là ném ngay ở lá đầu tiên.
        try { new ArrayDeque<TreeNode>().offer(null); System.out.println("ArrayDeque.offer(null): nhận"); }
        catch (NullPointerException e) { System.out.println("ArrayDeque.offer(null): NullPointerException"); }
    }
}
