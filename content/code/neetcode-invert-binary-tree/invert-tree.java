// LC 226 Invert Binary Tree: đổi chỗ hai con ở mọi nút, bằng đệ quy, ngăn xếp tự quản, hoặc BFS theo tầng.
// Chạy: java invert-tree.java
import java.util.*;
import java.util.function.UnaryOperator;

public class InvertTree {
    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
    }

    // Dựng cây từ mảng theo tầng kiểu LeetCode; null là chỗ trống.
    static TreeNode fromLevel(Integer... vals) {
        if (vals.length == 0 || vals[0] == null) return null;
        TreeNode root = new TreeNode(vals[0]);
        Deque<TreeNode> queue = new ArrayDeque<>(List.of(root));
        int i = 1;
        while (i < vals.length) {
            TreeNode node = queue.poll();
            if (i < vals.length && vals[i] != null) { node.left = new TreeNode(vals[i]); queue.add(node.left); }
            i++;
            if (i < vals.length && vals[i] != null) { node.right = new TreeNode(vals[i]); queue.add(node.right); }
            i++;
        }
        return root;
    }

    // Đọc cây ra chuỗi theo tầng, bỏ các null ở cuối. LinkedList nhận null, ArrayDeque thì không.
    static String toLevel(TreeNode root) {
        List<String> out = new ArrayList<>();
        Queue<TreeNode> queue = new LinkedList<>();
        queue.add(root);
        while (!queue.isEmpty()) {
            TreeNode node = queue.poll();
            out.add(node == null ? "null" : String.valueOf(node.val));
            if (node != null) { queue.add(node.left); queue.add(node.right); }
        }
        while (!out.isEmpty() && out.get(out.size() - 1).equals("null")) out.remove(out.size() - 1);
        return "[" + String.join(",", out) + "]";
    }

    // Cách 1: đệ quy. Java không có gán bộ, nên cất kết quả vào biến tạm trước khi gán.
    static TreeNode invertRecursive(TreeNode root) {
        if (root == null) return null;
        TreeNode left = invertRecursive(root.left);
        root.left = invertRecursive(root.right);
        root.right = left;
        return root;
    }

    // Cách 2: ngăn xếp tự quản (ArrayDeque dùng như ngăn xếp: push/pop ở đầu).
    static TreeNode invertStack(TreeNode root) {
        if (root == null) return null;
        Deque<TreeNode> stack = new ArrayDeque<>();
        stack.push(root);
        while (!stack.isEmpty()) {
            TreeNode node = stack.pop();
            TreeNode tmp = node.left;
            node.left = node.right;
            node.right = tmp;
            if (node.left != null) stack.push(node.left);
            if (node.right != null) stack.push(node.right);
        }
        return root;
    }

    // Cách 3: BFS theo tầng (ArrayDeque dùng như hàng đợi: offer ở cuối, poll ở đầu).
    static TreeNode invertBfs(TreeNode root) {
        if (root == null) return null;
        Deque<TreeNode> queue = new ArrayDeque<>();
        queue.offer(root);
        while (!queue.isEmpty()) {
            TreeNode node = queue.poll();
            TreeNode tmp = node.left;
            node.left = node.right;
            node.right = tmp;
            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
        return root;
    }

    // SAI: hai câu gán nối tiếp, không có biến tạm. Câu thứ hai đọc root.left đã bị ghi đè.
    static TreeNode wrongOverwrite(TreeNode root) {
        if (root == null) return null;
        root.left = wrongOverwrite(root.right);
        root.right = wrongOverwrite(root.left);
        return root;
    }

    // mulberry32: int của Java tự cắt về 32 bit; >>> là dịch không dấu.
    static int seed;
    static double rnd() {
        seed += 0x6d2b79f5;
        int t = seed;
        t = (t ^ (t >>> 15)) * (1 | t);
        t = (t + (t ^ (t >>> 7)) * (61 | t)) ^ t;
        return ((t ^ (t >>> 14)) & 0xffffffffL) / 4294967296.0;
    }

    // Cây ngẫu nhiên n nút: mỗi nút mới gắn vào một chỗ trống chọn ngẫu nhiên (true là con trái).
    static TreeNode randomTree(int n) {
        if (n == 0) return null;
        TreeNode root = new TreeNode(0);
        List<Object[]> slots = new ArrayList<>(List.of(new Object[] {root, true}, new Object[] {root, false}));
        for (int i = 1; i < n; i++) {
            int j = (int) (rnd() * slots.size());
            Object[] s = slots.get(j);
            slots.set(j, slots.get(slots.size() - 1));
            slots.remove(slots.size() - 1);
            TreeNode parent = (TreeNode) s[0], node = new TreeNode(i);
            if ((boolean) s[1]) parent.left = node; else parent.right = node;
            slots.add(new Object[] {node, true});
            slots.add(new Object[] {node, false});
        }
        return root;
    }

    // Gương độc lập: mirror = true viết cây theo thứ tự phải → gốc → trái.
    static String ser(TreeNode t, boolean mirror) {
        if (t == null) return "#";
        TreeNode a = mirror ? t.right : t.left, b = mirror ? t.left : t.right;
        return "(" + ser(a, mirror) + " " + t.val + " " + ser(b, mirror) + ")";
    }

    static String timed(UnaryOperator<TreeNode> fn, TreeNode root) {
        try {
            double[] ts = new double[5];
            for (int r = 0; r < 5; r++) {
                long t0 = System.nanoTime();
                fn.apply(root);
                ts[r] = (System.nanoTime() - t0) / 1e6;
            }
            Arrays.sort(ts);
            return String.format("%.2f", ts[2]);
        } catch (StackOverflowError e) {
            return "StackOverflow";
        }
    }

    public static void main(String[] args) {
        Object[][] cases = {
            {"cây rỗng", new Integer[] {}, "[]"},
            {"một nút", new Integer[] {1}, "[1]"},
            {"chỉ có con trái", new Integer[] {1, 2}, "[1,null,2]"},
            {"ba nút", new Integer[] {2, 1, 3}, "[2,3,1]"},
            {"cây đủ 3 tầng", new Integer[] {5, 3, 8, 1, 4, 7, 9}, "[5,8,3,9,7,4,1]"},
            {"chuỗi trái thành chuỗi phải", new Integer[] {1, 2, null, 3}, "[1,null,2,null,3]"},
            {"lệch hai bên", new Integer[] {1, 2, 3, null, 4, null, 5}, "[1,3,2,5,null,4]"},
            {"giá trị âm và 0", new Integer[] {0, -1, null, -2, -3}, "[0,null,-1,-3,-2]"},
        };
        String[] names = {"invertRecursive", "invertStack", "invertBfs", "wrongOverwrite"};
        List<UnaryOperator<TreeNode>> fns = List.of(
            InvertTree::invertRecursive, InvertTree::invertStack, InvertTree::invertBfs, InvertTree::wrongOverwrite);
        for (int f = 0; f < fns.size(); f++) {
            List<String> bad = new ArrayList<>();
            for (Object[] c : cases) {
                String got = toLevel(fns.get(f).apply(fromLevel((Integer[]) c[1])));
                if (!got.equals(c[2])) bad.add(c[0] + " → " + got);
            }
            System.out.printf("%-16s %d/%d ca đúng%s%n", names[f], cases.length - bad.size(), cases.length,
                bad.isEmpty() ? "" : "; sai ở " + String.join(", ", bad));
        }

        seed = 226;
        int[] ok = new int[3];
        for (int t = 0; t < 2000; t++) {
            int n = (int) (rnd() * 41), treeSeed = (int) (rnd() * 2147483648.0);
            for (int j = 0; j < 3; j++) {
                int saved = seed;
                seed = treeSeed;
                TreeNode root = randomTree(n); // mỗi cách đảo một bản riêng của cùng một cây
                seed = saved;
                String want = ser(root, true);
                if (ser(fns.get(j).apply(root), false).equals(want)) ok[j]++;
            }
        }
        System.out.printf("%nngẫu nhiên: %s %d/2000, %s %d/2000, %s %d/2000%n", names[0], ok[0], names[1], ok[1], names[2], ok[2]);

        int n = (1 << 20) - 1;
        TreeNode[] nodes = new TreeNode[n];
        for (int i = 0; i < n; i++) nodes[i] = new TreeNode(i);
        for (int i = 0; 2 * i + 2 < n; i++) { nodes[i].left = nodes[2 * i + 1]; nodes[i].right = nodes[2 * i + 2]; }
        System.out.printf("%nCây đầy đủ %d nút, trung vị 5 lần (ms)%n", n);
        for (int j = 0; j < 3; j++) System.out.printf("%-16s %8s%n", names[j], timed(fns.get(j), nodes[0]));

        System.out.println("\nChuỗi lệch trái d nút, trung vị 5 lần (ms)");
        System.out.println("d                đệ quy   ngăn xếp        BFS");
        for (int d : new int[] {1_000, 10_000, 100_000}) {
            TreeNode root = new TreeNode(0), cur = root;
            for (int i = 1; i < d; i++) { cur.left = new TreeNode(i); cur = cur.left; }
            System.out.printf("%-10d", d);
            for (int j = 0; j < 3; j++) System.out.printf(" %14s", timed(fns.get(j), root));
            System.out.println();
        }
    }
}
