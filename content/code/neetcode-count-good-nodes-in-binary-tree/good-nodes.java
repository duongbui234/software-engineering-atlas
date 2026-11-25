// LeetCode 1448 Count Good Nodes in Binary Tree.
// Một nút là "tốt" nếu trên đường từ gốc xuống nó không có nút nào lớn hơn nó.
// Các cách: vét cạn leo ngược về gốc, DFS mang max đường đi xuống (đệ quy và lặp), BFS mang max, và các bản sai hay gặp.
// Chạy: java good-nodes.java
import java.util.*;
import java.util.function.IntUnaryOperator;
import java.util.function.ToIntFunction;

class GoodNodes {
    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
    }

    record Item(TreeNode node, int maxSoFar) {}

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

    // Chuỗi n nút, mọi nút chỉ có con một phía.
    static TreeNode chain(int n, IntUnaryOperator valueAt, boolean right) {
        TreeNode root = new TreeNode(valueAt.applyAsInt(0)), cur = root;
        for (int i = 1; i < n; i++) {
            TreeNode next = new TreeNode(valueAt.applyAsInt(i));
            if (right) cur.right = next; else cur.left = next;
            cur = next;
        }
        return root;
    }

    // ---------- Cách 1: vét cạn, mỗi nút leo ngược lên gốc. O(n·h). ----------
    static long compares = 0;
    static int goodBrute(TreeNode root) {
        if (root == null) return 0;
        Map<TreeNode, TreeNode> parent = new IdentityHashMap<>();
        List<TreeNode> order = new ArrayList<>(List.of(root));
        for (int i = 0; i < order.size(); i++) {
            TreeNode node = order.get(i);
            for (TreeNode child : new TreeNode[] {node.left, node.right}) {
                if (child != null) { parent.put(child, node); order.add(child); }
            }
        }
        int good = 0;
        for (TreeNode node : order) {
            boolean ok = true;
            for (TreeNode a = parent.get(node); a != null; a = parent.get(a)) {
                compares++;
                if (a.val > node.val) { ok = false; break; }
            }
            if (ok) good++;
        }
        return good;
    }

    // ---------- Cách 2: DFS tiền thứ tự, mang max xuống. O(n), O(h). ----------
    static int goodDfs(TreeNode root) { return walk(root, Integer.MIN_VALUE); }

    static int walk(TreeNode node, int maxSoFar) {
        if (node == null) return 0;
        int good = node.val >= maxSoFar ? 1 : 0;  // bằng max vẫn là tốt
        int m = Math.max(maxSoFar, node.val);
        return good + walk(node.left, m) + walk(node.right, m);
    }

    // ---------- Cách 3: DFS lặp, ngăn xếp giữ cặp (nút, max). ----------
    static int goodIterative(TreeNode root) {
        if (root == null) return 0;
        int good = 0;
        Deque<Item> stack = new ArrayDeque<>();
        stack.push(new Item(root, root.val));
        while (!stack.isEmpty()) {
            Item it = stack.pop();
            if (it.node().val >= it.maxSoFar()) good++;
            int m = Math.max(it.maxSoFar(), it.node().val);
            if (it.node().right != null) stack.push(new Item(it.node().right, m));
            if (it.node().left != null) stack.push(new Item(it.node().left, m));
        }
        return good;
    }

    // ---------- Cách 4: BFS theo tầng bằng ArrayDeque. ----------
    static int goodBfs(TreeNode root) {
        if (root == null) return 0;
        int good = 0;
        Deque<Item> queue = new ArrayDeque<>();
        queue.offer(new Item(root, root.val));
        while (!queue.isEmpty()) {
            Item it = queue.poll();
            if (it.node().val >= it.maxSoFar()) good++;
            int m = Math.max(it.maxSoFar(), it.node().val);
            if (it.node().left != null) queue.offer(new Item(it.node().left, m));
            if (it.node().right != null) queue.offer(new Item(it.node().right, m));
        }
        return good;
    }

    // BFS giống hệt nhưng dùng ArrayList.remove(0): đúng, nhưng remove(0) dời cả danh sách.
    static int goodBfsRemove0(TreeNode root) {
        if (root == null) return 0;
        int good = 0;
        List<Item> queue = new ArrayList<>(List.of(new Item(root, root.val)));
        while (!queue.isEmpty()) {
            Item it = queue.remove(0);
            if (it.node().val >= it.maxSoFar()) good++;
            int m = Math.max(it.maxSoFar(), it.node().val);
            if (it.node().left != null) queue.add(new Item(it.node().left, m));
            if (it.node().right != null) queue.add(new Item(it.node().right, m));
        }
        return good;
    }

    // ---------- Các bản sai ----------
    // Sai 1: so ngặt. Nút bằng max của đường đi cũng là nút tốt.
    static int wrongStrict(TreeNode root) {
        if (root == null) return 0;
        int good = 1;  // gốc luôn tốt
        Deque<Item> stack = new ArrayDeque<>();
        if (root.right != null) stack.push(new Item(root.right, root.val));
        if (root.left != null) stack.push(new Item(root.left, root.val));
        while (!stack.isEmpty()) {
            Item it = stack.pop();
            if (it.node().val > it.maxSoFar()) good++;  // sai: phải là >=
            int m = Math.max(it.maxSoFar(), it.node().val);
            if (it.node().right != null) stack.push(new Item(it.node().right, m));
            if (it.node().left != null) stack.push(new Item(it.node().left, m));
        }
        return good;
    }

    // Sai 2: khởi tạo max bằng 0. Giá trị có thể âm.
    static int wrongInitZero(TreeNode root) {
        if (root == null) return 0;
        int good = 0;
        Deque<Item> stack = new ArrayDeque<>();
        stack.push(new Item(root, 0));
        while (!stack.isEmpty()) {
            Item it = stack.pop();
            if (it.node().val >= it.maxSoFar()) good++;
            int m = Math.max(it.maxSoFar(), it.node().val);
            if (it.node().right != null) stack.push(new Item(it.node().right, m));
            if (it.node().left != null) stack.push(new Item(it.node().left, m));
        }
        return good;
    }

    // Sai 3: một biến max dùng chung cho cả cây. Max của nhánh trái rò sang nhánh phải.
    static int wrongSharedMax(TreeNode root) {
        if (root == null) return 0;
        int mx = Integer.MIN_VALUE, good = 0;
        Deque<TreeNode> stack = new ArrayDeque<>();
        stack.push(root);
        while (!stack.isEmpty()) {
            TreeNode node = stack.pop();
            if (node.val >= mx) { good++; mx = node.val; }
            if (node.right != null) stack.push(node.right);
            if (node.left != null) stack.push(node.left);
        }
        return good;
    }

    // Sai 4: truyền biến đếm theo giá trị. Java luôn truyền int theo giá trị: mỗi lời gọi tăng bản sao của riêng nó.
    static int wrongCountByValue(TreeNode root) {
        int count = 0;
        countInto(root, Integer.MIN_VALUE, count);
        return count;
    }

    static void countInto(TreeNode node, int maxSoFar, int count) {
        if (node == null) return;
        if (node.val >= maxSoFar) count++;  // chỉ tăng bản sao cục bộ
        int m = Math.max(maxSoFar, node.val);
        countInto(node.left, m, count);
        countInto(node.right, m, count);
    }

    record Case(String name, TreeNode tree, int want) {}
    record Fn(String name, ToIntFunction<TreeNode> fn) {}

    static double median(Runnable fn) {
        double[] ts = new double[5];
        for (int r = 0; r < 5; r++) {
            long t = System.nanoTime();
            fn.run();
            ts[r] = (System.nanoTime() - t) / 1e6;
        }
        Arrays.sort(ts);
        return ts[2];
    }

    public static void main(String[] args) {
        final int N = 100_000;
        TreeNode upChain = chain(N, i -> -10_000 + i / 5, true);     // không giảm: mọi nút đều tốt
        TreeNode downChain = chain(N, i -> 10_000 - i / 5, false);   // không tăng: chỉ 5 nút đầu (bằng gốc) là tốt

        List<Case> cases = List.of(
            new Case("một nút", build(7), 1),
            new Case("một nút âm", build(-10000), 1),
            new Case("ba nút", build(2, 1, 3), 2),
            new Case("bằng max vẫn tốt", build(5, 5, 5), 3),
            new Case("toàn số âm", build(-3, -5, -1, -4, null, null, -2), 2),
            new Case("max nhánh trái lớn", build(1, 9, 2, null, null, 2, 3), 5),
            new Case("cây đầy 7 nút", build(4, 2, 6, 1, 3, 5, 7), 3),
            new Case("xuống thấp rồi vượt lại", build(6, 2, null, 1, 7), 2),
            new Case("chuỗi không giảm 10^5 nút", upChain, N),
            new Case("chuỗi không tăng 10^5 nút", downChain, 5));

        List<Fn> fns = List.of(
            new Fn("goodBrute", GoodNodes::goodBrute),
            new Fn("goodDfs", GoodNodes::goodDfs),
            new Fn("goodIterative", GoodNodes::goodIterative),
            new Fn("goodBfs", GoodNodes::goodBfs),
            new Fn("wrongStrict", GoodNodes::wrongStrict),
            new Fn("wrongInitZero", GoodNodes::wrongInitZero),
            new Fn("wrongSharedMax", GoodNodes::wrongSharedMax),
            new Fn("wrongCountByValue", GoodNodes::wrongCountByValue));

        int width = fns.stream().mapToInt(f -> f.name().length()).max().orElse(0);
        for (Fn f : fns) {
            int ok = 0;
            List<String> fails = new ArrayList<>();
            for (Case c : cases) {
                if (f.name().equals("goodBrute") && c.tree() == upChain) { ok++; continue; } // 5·10^9 phép so; đo riêng ở dưới
                try {
                    int got = f.fn().applyAsInt(c.tree());
                    if (got == c.want()) ok++; else fails.add(c.name() + " → " + got);
                } catch (StackOverflowError e) {
                    fails.add(c.name() + " → ném StackOverflowError");
                }
            }
            System.out.println(String.format("%-" + width + "s %d/%d ca đúng", f.name(), ok, cases.size())
                + (fails.isEmpty() ? "" : "; sai ở " + String.join(", ", fails)));
        }

        System.out.println("\nchuỗi không giảm (mọi nút tốt, vét cạn không dừng sớm), trung vị 5 lần (ms)");
        System.out.println("n        vét cạn: phép so       ms   DFS lặp ms");
        for (int n : new int[] {1000, 2000, 4000, 10000}) {
            TreeNode tree = chain(n, i -> i, true);
            compares = 0;
            goodBrute(tree);
            long c = compares;
            double tb = median(() -> goodBrute(tree));
            double ti = median(() -> goodIterative(tree));
            System.out.printf("%-8d %16d %10.2f %12.3f%n", n, c, tb, ti);
        }

        // Cây đầy đủ 10^5 nút (cao 17), giá trị giả ngẫu nhiên: cùng bộ sinh tuyến tính ở cả năm ngôn ngữ.
        long seed = 42;
        Integer[] vals = new Integer[N];
        for (int i = 0; i < N; i++) {
            seed = (seed * 1103515245L + 12345) % (1L << 31);
            vals[i] = (int) (seed % 20001) - 10000;
        }
        TreeNode full = build(vals);
        compares = 0;
        int fullWant = goodBrute(full);
        System.out.printf("%ncây đầy đủ 10^5 nút (cao 17): %d nút tốt, vét cạn %d phép so%n", fullWant, compares);
        for (Fn f : List.of(new Fn("vét cạn", GoodNodes::goodBrute), new Fn("DFS đệ quy", GoodNodes::goodDfs),
                new Fn("DFS lặp", GoodNodes::goodIterative), new Fn("BFS ArrayDeque", GoodNodes::goodBfs),
                new Fn("BFS remove(0)", GoodNodes::goodBfsRemove0))) {
            if (f.fn().applyAsInt(full) != fullWant) throw new AssertionError(f.name());
            System.out.printf("%-16s %8.2f ms%n", f.name(), median(() -> f.fn().applyAsInt(full)));
        }

        // Luồng riêng với ngăn xếp 256 MB: bản đệ quy chạy được chuỗi 10^5 nút.
        int[] res = new int[1];
        Thread t = new Thread(null, () -> res[0] = goodDfs(upChain), "big-stack", 256L << 20);
        t.start();
        try { t.join(); } catch (InterruptedException e) { throw new RuntimeException(e); }
        System.out.println("\nluồng có ngăn xếp 256 MB: goodDfs trên chuỗi 10^5 nút → " + res[0]);
    }
}
