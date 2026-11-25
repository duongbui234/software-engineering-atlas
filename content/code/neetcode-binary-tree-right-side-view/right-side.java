// LC 199 Binary Tree Right Side View: BFS chụp cỡ tầng (lấy nút cuối), BFS phải trước (lấy nút đầu),
// DFS phải trước (ghi khi gặp tầng mới), DFS trái trước ghi đè, và ba cách sai chạy thật.
// Chạy: java right-side.java
import java.util.*;
import java.util.function.*;

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

    static TreeNode complete(int n) {
        Integer[] a = new Integer[n];
        for (int i = 0; i < n; i++) a[i] = i + 1;
        return build(a);
    }

    // Cách 1: BFS, chụp cỡ tầng; nút cuối của tầng là nút nhìn thấy.
    static List<Integer> bfsLast(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        if (root == null) return res;
        Deque<TreeNode> q = new ArrayDeque<>();
        q.offer(root);
        while (!q.isEmpty()) {
            int size = q.size();                 // chụp cỡ tầng
            for (int i = 0; i < size; i++) {
                TreeNode node = q.poll();
                if (i == size - 1) res.add(node.val);
                if (node.left != null) q.offer(node.left);
                if (node.right != null) q.offer(node.right);
            }
        }
        return res;
    }

    // Cách 2: BFS đẩy con phải trước; nút đầu của tầng là nút nhìn thấy.
    static List<Integer> bfsRightFirst(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        if (root == null) return res;
        Deque<TreeNode> q = new ArrayDeque<>();
        q.offer(root);
        while (!q.isEmpty()) {
            int size = q.size();
            res.add(q.peek().val);
            for (int i = 0; i < size; i++) {
                TreeNode node = q.poll();
                if (node.right != null) q.offer(node.right);
                if (node.left != null) q.offer(node.left);
            }
        }
        return res;
    }

    // Cách 3: DFS phải trước; nút đầu tiên chạm tới độ sâu mới là nút nhìn thấy.
    static List<Integer> dfsRightFirst(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        walkRight(root, 0, res);
        return res;
    }
    static void walkRight(TreeNode node, int depth, List<Integer> res) {
        if (node == null) return;
        if (depth == res.size()) res.add(node.val);
        walkRight(node.right, depth + 1, res);
        walkRight(node.left, depth + 1, res);
    }

    // Cách 3b: DFS phải trước, bản lặp; ngăn xếp giữ cặp (nút, độ sâu) bằng hai Deque song song.
    static List<Integer> dfsRightFirstIterative(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        if (root == null) return res;
        Deque<TreeNode> nodes = new ArrayDeque<>();
        Deque<Integer> depths = new ArrayDeque<>();
        nodes.push(root); depths.push(0);
        while (!nodes.isEmpty()) {
            TreeNode node = nodes.pop();
            int depth = depths.pop();
            if (depth == res.size()) res.add(node.val);
            if (node.left != null) { nodes.push(node.left); depths.push(depth + 1); }
            if (node.right != null) { nodes.push(node.right); depths.push(depth + 1); }
        }
        return res;
    }

    // Cách 4: DFS trái trước, ghi đè res[depth].
    static List<Integer> dfsOverwrite(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        walkOverwrite(root, 0, res);
        return res;
    }
    static void walkOverwrite(TreeNode node, int depth, List<Integer> res) {
        if (node == null) return;
        if (depth == res.size()) res.add(node.val); else res.set(depth, node.val);
        walkOverwrite(node.left, depth + 1, res);
        walkOverwrite(node.right, depth + 1, res);
    }

    // SAI: chỉ đi theo con trỏ phải.
    static List<Integer> wrongRightPointers(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        for (TreeNode node = root; node != null; node = node.right) res.add(node.val);
        return res;
    }

    // SAI: DFS trái trước mà vẫn ghi lần đầu gặp tầng.
    static List<Integer> wrongLeftFirst(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        walkLeft(root, 0, res);
        return res;
    }
    static void walkLeft(TreeNode node, int depth, List<Integer> res) {
        if (node == null) return;
        if (depth == res.size()) res.add(node.val);
        walkLeft(node.left, depth + 1, res);
        walkLeft(node.right, depth + 1, res);
    }

    // SAI: điều kiện vòng for gọi lại q.size() mỗi lượt, trong lúc poll/offer làm nó đổi.
    static List<Integer> wrongLiveLength(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        if (root == null) return res;
        Deque<TreeNode> q = new ArrayDeque<>();
        q.offer(root);
        while (!q.isEmpty()) {
            TreeNode last = null;
            for (int i = 0; i < q.size(); i++) {
                last = q.poll();
                if (last.left != null) q.offer(last.left);
                if (last.right != null) q.offer(last.right);
            }
            res.add(last.val);
        }
        return res;
    }

    static String show(List<Integer> a) {
        if (a.size() > 8)
            return "[" + a.get(0) + "," + a.get(1) + "," + a.get(2) + ",…," + a.get(a.size() - 1) + "] (" + a.size() + " số)";
        StringJoiner j = new StringJoiner(",", "[", "]");
        for (int v : a) j.add(String.valueOf(v));
        return j.toString();
    }

    record Case(String name, Supplier<TreeNode> make, List<Integer> want) {}

    static List<Integer> seq(int n) {
        List<Integer> a = new ArrayList<>();
        for (int i = 1; i <= n; i++) a.add(i);
        return a;
    }

    static double median(Runnable fn) {
        double[] ts = new double[5];
        for (int i = 0; i < 5; i++) {
            long t0 = System.nanoTime();
            fn.run();
            ts[i] = (System.nanoTime() - t0) / 1e6;
        }
        Arrays.sort(ts);
        return ts[2];
    }

    public static void main(String[] args) {
        List<Case> cases = List.of(
            new Case("cây rỗng", () -> build(), List.of()),
            new Case("một nút", () -> build(7), List.of(7)),
            new Case("cây đầy 7 nút", () -> build(1, 2, 3, 4, 5, 6, 7), List.of(1, 3, 7)),
            new Case("nhánh trái sâu hơn", () -> build(1, 2, 3, 4), List.of(1, 3, 4)),
            new Case("chỉ có nhánh trái", () -> build(1, 2, null, 3), List.of(1, 2, 3)),
            new Case("chỉ có nhánh phải", () -> build(1, null, 2, null, 3), List.of(1, 2, 3)),
            new Case("đáy nằm dưới cây con trái", () -> build(1, 2, 3, null, 5, null, null, 6), List.of(1, 3, 5, 6)),
            new Case("zíc zắc", () -> build(1, 2, 3, 4, null, null, null, null, 5), List.of(1, 3, 4, 5)),
            new Case("giá trị âm và biên", () -> build(0, -100, 100, -50), List.of(0, 100, -50)),
            new Case("chuỗi trái 100 nút", () -> leftChain(100), seq(100)),
            new Case("cây đầy đủ 100 nút", () -> complete(100), List.of(1, 3, 7, 15, 31, 63, 100))
        );
        Map<String, Function<TreeNode, List<Integer>>> fns = new LinkedHashMap<>();
        fns.put("bfsLast", Main::bfsLast);
        fns.put("bfsRightFirst", Main::bfsRightFirst);
        fns.put("dfsRightFirst", Main::dfsRightFirst);
        fns.put("dfsRightFirstIterative", Main::dfsRightFirstIterative);
        fns.put("dfsOverwrite", Main::dfsOverwrite);
        fns.put("wrongRightPointers", Main::wrongRightPointers);
        fns.put("wrongLeftFirst", Main::wrongLeftFirst);
        fns.put("wrongLiveLength", Main::wrongLiveLength);

        for (var e : fns.entrySet()) {
            List<String> bad = new ArrayList<>();
            for (Case c : cases) {
                String got;
                try { got = show(e.getValue().apply(c.make().get())); }
                catch (Throwable t) { got = "ném " + t.getClass().getSimpleName(); }
                if (!got.equals(show(c.want()))) bad.add(c.name() + " → " + got);
            }
            int ok = cases.size() - bad.size();
            System.out.println(String.format("%-22s %d/%d ca đúng", e.getKey(), ok, cases.size())
                + (bad.isEmpty() ? "" : "; sai ở " + String.join(", ", bad)));
        }

        // Đối chiếu ngẫu nhiên.
        Random rng = new Random(42);
        int trials = 3000, agree = 0, rightWrong = 0;
        for (int t = 0; t < trials; t++) {
            int n = rng.nextInt(31);
            TreeNode root = null;
            if (n > 0) {
                root = new TreeNode(rng.nextInt(201) - 100);
                List<TreeNode> nodes = new ArrayList<>(List.of(root));
                while (nodes.size() < n) {
                    TreeNode p = nodes.get(rng.nextInt(nodes.size()));
                    TreeNode c = new TreeNode(rng.nextInt(201) - 100);
                    if (rng.nextDouble() < 0.5) { if (p.left == null) { p.left = c; nodes.add(c); } }
                    else if (p.right == null) { p.right = c; nodes.add(c); }
                }
            }
            String ref = show(bfsLast(root));
            if (show(bfsRightFirst(root)).equals(ref) && show(dfsRightFirst(root)).equals(ref)
                && show(dfsRightFirstIterative(root)).equals(ref) && show(dfsOverwrite(root)).equals(ref)) agree++;
            if (!show(wrongRightPointers(root)).equals(ref)) rightWrong++;
        }
        System.out.printf("%nđối chiếu %d cây ngẫu nhiên 0..30 nút: năm cách đúng khớp nhau %d/%d; wrongRightPointers sai %d cây%n",
            trials, agree, trials, rightWrong);

        System.out.println("\nthời gian trung vị 5 lần (ms)");
        for (int k : new int[] {17, 20}) {
            TreeNode r = complete((1 << k) - 1);
            System.out.printf("cây đầy đủ 2^%d − 1  bfsLast %.2f   bfsRightFirst %.2f   dfsRightFirst %.2f   dfsRightFirstIterative %.2f%n",
                k, median(() -> bfsLast(r)), median(() -> bfsRightFirst(r)),
                median(() -> dfsRightFirst(r)), median(() -> dfsRightFirstIterative(r)));
        }
        try {
            System.out.println("dfsRightFirst trên chuỗi trái 10^5 nút: " + dfsRightFirst(leftChain(100000)).size() + " số");
        } catch (StackOverflowError e) {
            System.out.println("dfsRightFirst trên chuỗi trái 10^5 nút: ném StackOverflowError");
        }
    }
}
