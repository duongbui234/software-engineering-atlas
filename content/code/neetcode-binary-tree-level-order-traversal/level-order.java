// LC 102 Binary Tree Level Order Traversal: BFS chụp kích thước tầng (ArrayDeque và LinkedList),
// hai danh sách, vạch ngăn tầng bằng nút canh, DFS mang độ sâu; hai cách sai chạy thật.
// Chạy: java level-order.java

import java.util.*;
import java.util.function.Function;

public class Main {
    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int v) { val = v; }
    }

    // Dựng cây từ mảng theo tầng kiểu LeetCode: null là chỗ trống.
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
        for (int v = n; v >= 1; v--) { TreeNode t = new TreeNode(v); t.left = root; root = t; }
        return root;
    }

    // Cách 1: BFS với ArrayDeque, chụp size() trước khi đẩy con vào.
    static List<List<Integer>> levelSnapshot(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        if (root == null) return res;
        Deque<TreeNode> queue = new ArrayDeque<>();
        queue.offer(root);
        while (!queue.isEmpty()) {
            int size = queue.size();
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

    // Cách 1 với LinkedList làm hàng đợi: đúng, chỉ để đo.
    static List<List<Integer>> levelSnapshotLinked(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        if (root == null) return res;
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        while (!queue.isEmpty()) {
            int size = queue.size();
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

    // Cách 2: hai danh sách.
    static List<List<Integer>> levelTwoLists(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        List<TreeNode> cur = new ArrayList<>();
        if (root != null) cur.add(root);
        while (!cur.isEmpty()) {
            List<Integer> level = new ArrayList<>(cur.size());
            List<TreeNode> next = new ArrayList<>(2 * cur.size());
            for (TreeNode node : cur) {
                level.add(node.val);
                if (node.left != null) next.add(node.left);
                if (node.right != null) next.add(node.right);
            }
            res.add(level);
            cur = next;
        }
        return res;
    }

    // Cách 3: vạch ngăn tầng. ArrayDeque cấm null, nên vạch là một nút canh riêng.
    static final TreeNode MARK = new TreeNode(0);

    static List<List<Integer>> levelMarker(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        if (root == null) return res;
        Deque<TreeNode> queue = new ArrayDeque<>();
        queue.offer(root);
        queue.offer(MARK);
        List<Integer> level = new ArrayList<>();
        while (!queue.isEmpty()) {
            TreeNode node = queue.poll();
            if (node == MARK) { // so địa chỉ, không so val
                res.add(level);
                level = new ArrayList<>();
                if (!queue.isEmpty()) queue.offer(MARK);
            } else {
                level.add(node.val);
                if (node.left != null) queue.offer(node.left);
                if (node.right != null) queue.offer(node.right);
            }
        }
        return res;
    }

    // Cách 4: DFS tiền thứ tự mang độ sâu.
    static List<List<Integer>> levelDfs(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        dfs(root, 0, res);
        return res;
    }

    static void dfs(TreeNode node, int depth, List<List<Integer>> res) {
        if (node == null) return;
        if (res.size() == depth) res.add(new ArrayList<>());
        res.get(depth).add(node.val);
        dfs(node.left, depth + 1, res);
        dfs(node.right, depth + 1, res);
    }

    // Sai 1: điều kiện vòng for gọi queue.size() mỗi vòng, mà poll() và offer() đều đổi nó.
    static List<List<Integer>> wrongLiveSize(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        if (root == null) return res;
        Deque<TreeNode> queue = new ArrayDeque<>();
        queue.offer(root);
        while (!queue.isEmpty()) {
            List<Integer> level = new ArrayList<>();
            for (int i = 0; i < queue.size(); i++) {
                TreeNode node = queue.poll();
                level.add(node.val);
                if (node.left != null) queue.offer(node.left);
                if (node.right != null) queue.offer(node.right);
            }
            res.add(level);
        }
        return res;
    }

    // Sai 2: dùng null làm vạch ngăn trong ArrayDeque.
    static List<List<Integer>> wrongNullMarker(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        if (root == null) return res;
        Deque<TreeNode> queue = new ArrayDeque<>();
        queue.offer(root);
        queue.offer(null); // ArrayDeque ném NullPointerException ở đây
        List<Integer> level = new ArrayList<>();
        while (!queue.isEmpty()) {
            TreeNode node = queue.poll();
            if (node == null) {
                res.add(level);
                level = new ArrayList<>();
                if (!queue.isEmpty()) queue.offer(null);
            } else {
                level.add(node.val);
                if (node.left != null) queue.offer(node.left);
                if (node.right != null) queue.offer(node.right);
            }
        }
        return res;
    }

    // ---------- ca chạy thử ----------

    record Case(String name, java.util.function.Supplier<TreeNode> tree, List<List<Integer>> want) {}

    static List<Integer> seq(int a, int b) {
        List<Integer> out = new ArrayList<>();
        for (int v = a; v <= b; v++) out.add(v);
        return out;
    }

    static List<Case> cases = new ArrayList<>();

    static String shortStr(Object x) {
        String s = String.valueOf(x).replace(" ", "");
        return s.length() > 40 ? s.substring(0, 37) + "..." : s;
    }

    static void run(String name, Function<TreeNode, List<List<Integer>>> fn) {
        int ok = 0;
        List<String> bad = new ArrayList<>();
        for (Case c : cases) {
            try {
                List<List<Integer>> got = fn.apply(c.tree().get());
                if (got.equals(c.want())) ok++;
                else bad.add(c.name() + " → " + shortStr(got));
            } catch (Throwable e) {
                bad.add(c.name() + " → ném " + e.getClass().getSimpleName());
            }
        }
        System.out.printf("%-19s %d/%d ca đúng%s%n", name, ok, cases.size(),
            bad.isEmpty() ? "" : "; sai ở " + String.join(", ", bad));
    }

    static double timed(Function<TreeNode, List<List<Integer>>> fn, TreeNode root) {
        double[] xs = new double[5];
        for (int k = 0; k < 5; k++) {
            long t0 = System.nanoTime();
            fn.apply(root);
            xs[k] = (System.nanoTime() - t0) / 1e6;
        }
        Arrays.sort(xs);
        return xs[2];
    }

    public static void main(String[] args) {
        Integer[] limitArr = new Integer[2000];
        for (int i = 0; i < 2000; i++) limitArr[i] = (i * 37) % 2001 - 1000;
        List<List<Integer>> split = new ArrayList<>();
        for (int start = 0, w = 1; start < 2000; start += w, w *= 2) {
            List<Integer> l = new ArrayList<>();
            for (int j = start; j < Math.min(2000, start + w); j++) l.add(limitArr[j]);
            split.add(l);
        }
        List<List<Integer>> chainWant = new ArrayList<>();
        for (int i = 1; i <= 2000; i++) chainWant.add(List.of(i));
        Integer[] full15 = new Integer[15];
        for (int i = 0; i < 15; i++) full15[i] = i + 1;

        cases.add(new Case("cây rỗng", () -> null, List.of()));
        cases.add(new Case("một nút", () -> build(7), List.of(List.of(7))));
        cases.add(new Case("ba tầng có chỗ trống", () -> build(5, 2, 8, null, 4, 7, 9),
            List.of(List.of(5), List.of(2, 8), List.of(4, 7, 9))));
        cases.add(new Case("chỉ con trái", () -> build(1, 2, null, 3, null, 4),
            List.of(List.of(1), List.of(2), List.of(3), List.of(4))));
        cases.add(new Case("chỉ con phải", () -> build(1, null, 2, null, 3),
            List.of(List.of(1), List.of(2), List.of(3))));
        cases.add(new Case("cây đầy 15 nút", () -> build(full15),
            List.of(List.of(1), List.of(2, 3), seq(4, 7), seq(8, 15))));
        cases.add(new Case("nhánh so le", () -> build(1, 2, 3, 4, null, null, 5, 6, null, null, 7),
            List.of(List.of(1), List.of(2, 3), List.of(4, 5), List.of(6, 7))));
        cases.add(new Case("giá trị âm và trùng", () -> build(0, -1000, 1000, -1000, null, null, 1000),
            List.of(List.of(0), List.of(-1000, 1000), List.of(-1000, 1000))));
        cases.add(new Case("cây đủ 2000 nút", () -> build(limitArr), split));
        cases.add(new Case("chuỗi trái 2000 nút", () -> leftChain(2000), chainWant));

        run("levelSnapshot", Main::levelSnapshot);
        run("levelSnapshotLinked", Main::levelSnapshotLinked);
        run("levelTwoLists", Main::levelTwoLists);
        run("levelMarker", Main::levelMarker);
        run("levelDfs", Main::levelDfs);
        run("wrongLiveSize", Main::wrongLiveSize);
        run("wrongNullMarker", Main::wrongNullMarker);

        // đối chiếu ngẫu nhiên
        Random rng = new Random(42);
        int agree = 0;
        for (int t = 0; t < 3000; t++) {
            int n = rng.nextInt(60);
            TreeNode root = null;
            if (n > 0) {
                List<TreeNode> nodes = new ArrayList<>(List.of(new TreeNode(rng.nextInt(2001) - 1000)));
                while (nodes.size() < n) {
                    TreeNode p = nodes.get(rng.nextInt(nodes.size()));
                    TreeNode c = new TreeNode(rng.nextInt(2001) - 1000);
                    if (rng.nextBoolean()) { if (p.left == null) { p.left = c; nodes.add(c); } }
                    else if (p.right == null) { p.right = c; nodes.add(c); }
                }
                root = nodes.get(0);
            }
            List<List<Integer>> a = levelSnapshot(root);
            if (a.equals(levelSnapshotLinked(root)) && a.equals(levelTwoLists(root))
                && a.equals(levelMarker(root)) && a.equals(levelDfs(root))) agree++;
        }
        System.out.printf("%nđối chiếu 3000 cây ngẫu nhiên 0..59 nút: năm cách khớp nhau %d/3000%n", agree);

        // đo
        System.out.println("\nthời gian trung vị 5 lần (ms), cây đầy, sau khi làm nóng");
        System.out.printf("%8s %10s %11s %11s %14s %10s %7s%n", "n", "rộng nhất", "ArrayDeque", "LinkedList", "hai danh sách", "vạch ngăn", "DFS");
        for (int size : new int[]{2000, (1 << 17) - 1, (1 << 20) - 1}) {
            Integer[] arr = new Integer[size];
            for (int i = 0; i < size; i++) arr[i] = i;
            TreeNode root = build(arr);
            List<Function<TreeNode, List<List<Integer>>>> fns = List.of(
                Main::levelSnapshot, Main::levelSnapshotLinked, Main::levelTwoLists, Main::levelMarker, Main::levelDfs);
            for (int w = 0; w < 3; w++) for (var f : fns) f.apply(root); // làm nóng JIT
            int width = 0;
            for (List<Integer> l : levelSnapshot(root)) width = Math.max(width, l.size());
            System.out.printf("%8d %10d %11.2f %11.2f %14.2f %10.2f %7.2f%n", size, width,
                timed(fns.get(0), root), timed(fns.get(1), root), timed(fns.get(2), root),
                timed(fns.get(3), root), timed(fns.get(4), root));
        }
    }
}
