// LC 104 Maximum Depth of Binary Tree: đệ quy hậu thứ tự, DFS bằng ngăn xếp tự quản, BFS đếm tầng.
// Chạy: java max-depth.java
import java.util.*;
import java.util.function.ToIntFunction;

public class MaxDepth {
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

    // Cách 1: đệ quy. Độ sâu = 1 + độ sâu lớn hơn của hai cây con; cây rỗng sâu 0.
    static int maxDepthRecursive(TreeNode root) {
        if (root == null) return 0;
        return 1 + Math.max(maxDepthRecursive(root.left), maxDepthRecursive(root.right));
    }

    // Cách 2: DFS với ngăn xếp tự quản; hai ngăn xếp song song cho nút và độ sâu.
    static int maxDepthStack(TreeNode root) {
        if (root == null) return 0;
        Deque<TreeNode> nodes = new ArrayDeque<>();
        Deque<Integer> depths = new ArrayDeque<>();
        nodes.push(root);
        depths.push(1);
        int best = 0;
        while (!nodes.isEmpty()) {
            TreeNode node = nodes.pop();
            int d = depths.pop();
            best = Math.max(best, d);
            if (node.left != null) { nodes.push(node.left); depths.push(d + 1); }
            if (node.right != null) { nodes.push(node.right); depths.push(d + 1); }
        }
        return best;
    }

    // Cách 3: BFS theo tầng; mỗi vòng ngoài lấy ra đúng số nút của một tầng.
    static int maxDepthBfs(TreeNode root) {
        if (root == null) return 0;
        Deque<TreeNode> queue = new ArrayDeque<>();
        queue.offer(root);
        int depth = 0;
        while (!queue.isEmpty()) {
            depth++;
            for (int k = queue.size(); k > 0; k--) {
                TreeNode node = queue.poll();
                if (node.left != null) queue.offer(node.left);
                if (node.right != null) queue.offer(node.right);
            }
        }
        return depth;
    }

    // SAI: đẩy con vào hàng đợi rồi mới kiểm null khi lấy ra. ArrayDeque không nhận null:
    // offer(null) ném NullPointerException ngay ở nút đầu tiên thiếu một con.
    static int wrongOfferNull(TreeNode root) {
        if (root == null) return 0;
        Deque<TreeNode> queue = new ArrayDeque<>();
        queue.offer(root);
        int depth = 0;
        while (!queue.isEmpty()) {
            depth++;
            for (int k = queue.size(); k > 0; k--) {
                TreeNode node = queue.poll();
                if (node == null) continue;
                queue.offer(node.left);
                queue.offer(node.right);
            }
        }
        return depth;
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

    // Cây ngẫu nhiên n nút: mỗi nút mới gắn vào một chỗ trống chọn ngẫu nhiên; độ sâu đúng ghi vào depthOut[0].
    static TreeNode randomTree(int n, int[] depthOut) {
        depthOut[0] = 0;
        if (n == 0) return null;
        TreeNode root = new TreeNode(0);
        List<Object[]> slots = new ArrayList<>(List.of(new Object[] {root, true, 2}, new Object[] {root, false, 2}));
        depthOut[0] = 1;
        for (int i = 1; i < n; i++) {
            int j = (int) (rnd() * slots.size());
            Object[] s = slots.get(j);
            slots.set(j, slots.get(slots.size() - 1));
            slots.remove(slots.size() - 1);
            TreeNode parent = (TreeNode) s[0], node = new TreeNode(i);
            int d = (int) s[2];
            if ((boolean) s[1]) parent.left = node; else parent.right = node;
            depthOut[0] = Math.max(depthOut[0], d);
            slots.add(new Object[] {node, true, d + 1});
            slots.add(new Object[] {node, false, d + 1});
        }
        return root;
    }

    static TreeNode chain(int d) {
        TreeNode root = new TreeNode(0), cur = root;
        for (int i = 1; i < d; i++) { cur.left = new TreeNode(i); cur = cur.left; }
        return root;
    }

    static String timed(ToIntFunction<TreeNode> fn, TreeNode root, int want) {
        try {
            double[] ts = new double[5];
            int got = 0;
            for (int r = 0; r < 5; r++) {
                long t0 = System.nanoTime();
                got = fn.applyAsInt(root);
                ts[r] = (System.nanoTime() - t0) / 1e6;
            }
            Arrays.sort(ts);
            return got == want ? String.format("%.2f", ts[2]) : "sai " + got;
        } catch (StackOverflowError e) {
            return "StackOverflow";
        }
    }

    public static void main(String[] args) throws Exception {
        Object[][] cases = {
            {"cây rỗng", new Integer[] {}, 0},
            {"một nút", new Integer[] {5}, 1},
            {"chỉ có con phải", new Integer[] {1, null, 2}, 2},
            {"cây đủ 3 tầng", new Integer[] {1, 2, 3, 4, 5, 6, 7}, 3},
            {"nhánh sâu bên phải", new Integer[] {8, 3, 10, 1, 6, null, 14, null, null, 4, 7, 13}, 4},
            {"chuỗi trái 6 nút", new Integer[] {1, 2, null, 3, null, 4, null, 5, null, 6}, 6},
            {"zigzag 5 tầng", new Integer[] {1, 2, null, null, 3, 4, null, null, 5}, 5},
            {"giá trị âm và 0", new Integer[] {0, -1, -2, null, -3}, 3},
        };
        String[] names = {"maxDepthRecursive", "maxDepthStack", "maxDepthBfs", "wrongOfferNull"};
        List<ToIntFunction<TreeNode>> fns =
            List.of(MaxDepth::maxDepthRecursive, MaxDepth::maxDepthStack, MaxDepth::maxDepthBfs, MaxDepth::wrongOfferNull);
        for (int f = 0; f < fns.size(); f++) {
            List<String> bad = new ArrayList<>();
            for (Object[] c : cases) {
                try {
                    int got = fns.get(f).applyAsInt(fromLevel((Integer[]) c[1]));
                    if (got != (int) c[2]) bad.add(c[0] + " → " + got + " (đúng là " + c[2] + ")");
                } catch (RuntimeException e) {
                    bad.add(c[0] + " → ném " + e.getClass().getSimpleName());
                }
            }
            System.out.printf("%-18s %d/%d ca đúng%s%n", names[f], cases.length - bad.size(), cases.length,
                bad.isEmpty() ? "" : "; sai ở " + String.join(", ", bad));
        }

        seed = 104;
        int[] ok = new int[3], depth = new int[1];
        for (int t = 0; t < 2000; t++) {
            TreeNode root = randomTree((int) (rnd() * 41), depth);
            for (int j = 0; j < 3; j++) if (fns.get(j).applyAsInt(root) == depth[0]) ok[j]++;
        }
        System.out.printf("%nngẫu nhiên: %s %d/2000, %s %d/2000, %s %d/2000%n", names[0], ok[0], names[1], ok[1], names[2], ok[2]);

        System.out.println("\nChuỗi lệch trái d nút, trung vị 5 lần (ms), luồng main");
        System.out.println("d                đệ quy   ngăn xếp        BFS");
        for (int d : new int[] {1_000, 10_000, 100_000, 1_000_000}) {
            TreeNode root = chain(d);
            System.out.printf("%-10d", d);
            for (int j = 0; j < 3; j++) System.out.printf(" %14s", timed(fns.get(j), root, d));
            System.out.println();
        }

        // Độ sâu lớn nhất bản đệ quy chịu được trên luồng main (chia đôi). StackOverflowError là Error,
        // không phải Exception, nên catch (Exception e) không bắt được nó.
        int lo = 1_000, hi = 1_000_000;
        while (hi - lo > 1) {
            int mid = (lo + hi) >>> 1;
            try { maxDepthRecursive(chain(mid)); lo = mid; } catch (StackOverflowError e) { hi = mid; }
        }
        System.out.println("đệ quy chịu được tối đa " + lo + " tầng (ngăn xếp mặc định của luồng main)");

        // Cách chữa khi buộc phải đệ quy: chạy trong luồng riêng với ngăn xếp tự chọn (ở đây 512 MB).
        String[] out = new String[1];
        TreeNode deep = chain(1_000_000);
        Thread big = new Thread(null, () -> out[0] = timed(MaxDepth::maxDepthRecursive, deep, 1_000_000), "sâu", 512L << 20);
        big.start();
        big.join();
        System.out.println("luồng riêng ngăn xếp 512 MB: chuỗi 1000000 nút, đệ quy " + out[0] + " ms");

        int n = (1 << 20) - 1;
        TreeNode[] nodes = new TreeNode[n];
        for (int i = 0; i < n; i++) nodes[i] = new TreeNode(i);
        for (int i = 0; 2 * i + 2 < n; i++) { nodes[i].left = nodes[2 * i + 1]; nodes[i].right = nodes[2 * i + 2]; }
        System.out.printf("%nCây đầy đủ %d nút, trung vị 5 lần (ms)%n", n);
        for (int j = 0; j < 3; j++) System.out.printf("%-18s %8s%n", names[j], timed(fns.get(j), nodes[0], 20));
    }
}
