// LC 230 Kth Smallest Element in a BST: sắp xếp, trung thứ tự hết cây, trung thứ tự dừng sớm (đệ quy và ngăn xếp),
// Morris, và cây có cỡ cây con cho câu hỏi phụ "chèn/xóa liên tục".
// Chạy: java kth-smallest.java
import java.util.*;
import java.util.function.Supplier;

class KthSmallest {
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
        for (int v = 1; v <= n; v++) { TreeNode t = new TreeNode(v); t.left = root; root = t; }
        return root;
    }

    static TreeNode rightChain(int n) {
        TreeNode root = null;
        for (int v = n; v >= 1; v--) { TreeNode t = new TreeNode(v); t.right = root; root = t; }
        return root;
    }

    // Cây cân từ lo..hi; giá trị nhỏ thứ k là lo + k - 1.
    static TreeNode balancedRange(int lo, int hi) {
        if (lo > hi) return null;
        int mid = (lo + hi) >>> 1;
        TreeNode t = new TreeNode(mid);
        t.left = balancedRange(lo, mid - 1);
        t.right = balancedRange(mid + 1, hi);
        return t;
    }

    // Cách 1: gom mọi giá trị, sắp xếp, lấy phần tử k-1. O(n log n).
    static int kthSort(TreeNode root, int k) {
        List<Integer> vals = new ArrayList<>();
        Deque<TreeNode> stack = new ArrayDeque<>();
        if (root != null) stack.push(root);
        while (!stack.isEmpty()) {
            TreeNode node = stack.pop();
            vals.add(node.val);
            if (node.left != null) stack.push(node.left);
            if (node.right != null) stack.push(node.right);
        }
        int[] arr = vals.stream().mapToInt(Integer::intValue).toArray();
        Arrays.sort(arr);
        return arr[k - 1];
    }

    // Cách 2: trung thứ tự đệ quy gom hết (dãy tăng), lấy phần tử k-1. O(n).
    static int kthInorderAll(TreeNode root, int k) {
        List<Integer> out = new ArrayList<>();
        collect(root, out);
        return out.get(k - 1);
    }

    static void collect(TreeNode node, List<Integer> out) {
        if (node == null) return;
        collect(node.left, out);
        out.add(node.val);
        collect(node.right, out);
    }

    // Cách 3: trung thứ tự đệ quy, đếm và dừng khi đủ k. O(h + k).
    // Lambda trong Java không gán lại được biến cục bộ, nên số đếm nằm trong một đối tượng nhỏ truyền xuống.
    static final class Counter { int count, answer = -1; final int k; Counter(int k) { this.k = k; } }

    static int kthRecursive(TreeNode root, int k) {
        Counter c = new Counter(k);
        walk(root, c);
        return c.answer;
    }

    static void walk(TreeNode node, Counter c) {
        if (node == null || c.count >= c.k) return;
        walk(node.left, c);
        if (c.count >= c.k) return;
        if (++c.count == c.k) { c.answer = node.val; return; }
        walk(node.right, c);
    }

    // Cách 4: trung thứ tự bằng ngăn xếp tự quản lý, lấy ra đủ k nút. O(h + k).
    static int kthIterative(TreeNode root, int k) {
        Deque<TreeNode> stack = new ArrayDeque<>();
        TreeNode node = root;
        while (true) {
            while (node != null) { stack.push(node); node = node.left; }
            node = stack.pop();
            if (--k == 0) return node.val;
            node = node.right;
        }
    }

    // Cách 5: Morris, O(1) bộ nhớ. Chỉ dừng khi đã có đáp án và không còn sợi chỉ nào.
    static int kthMorris(TreeNode root, int k) {
        TreeNode cur = root;
        int count = 0, answer = -1, pending = 0;
        while (cur != null) {
            if (cur.left == null) {
                if (++count == k) answer = cur.val;
                if (count >= k && pending == 0) break;
                cur = cur.right;
            } else {
                TreeNode pred = cur.left;
                while (pred.right != null && pred.right != cur) pred = pred.right;
                if (pred.right == null) { pred.right = cur; pending++; cur = cur.left; }   // buộc chỉ
                else {
                    pred.right = null; pending--;                                          // gỡ chỉ
                    if (++count == k) answer = cur.val;
                    if (count >= k && pending == 0) break;
                    cur = cur.right;
                }
            }
        }
        return answer;
    }

    // Cách 6 (câu hỏi phụ): mỗi nút nhớ cỡ cây con.
    static class SizedNode {
        int val, size = 1;
        SizedNode left, right;
        SizedNode(int val) { this.val = val; }
    }

    static int sizeOf(SizedNode n) { return n == null ? 0 : n.size; }

    // Đi đúng một đường từ gốc: O(h).
    static int kthBySize(SizedNode root, int k) {
        SizedNode node = root;
        while (true) {
            int leftSize = sizeOf(node.left);
            if (k <= leftSize) node = node.left;
            else if (k == leftSize + 1) return node.val;
            else { k -= leftSize + 1; node = node.right; }
        }
    }

    static SizedNode insertSized(SizedNode node, int v) {
        if (node == null) return new SizedNode(v);
        if (v < node.val) node.left = insertSized(node.left, v);
        else node.right = insertSized(node.right, v);
        node.size++;
        return node;
    }

    static SizedNode removeSized(SizedNode node, int v) {
        if (v < node.val) node.left = removeSized(node.left, v);
        else if (v > node.val) node.right = removeSized(node.right, v);
        else {
            if (node.left == null) return node.right;
            if (node.right == null) return node.left;
            SizedNode succ = node.right;
            while (succ.left != null) succ = succ.left;
            node.val = succ.val;
            node.right = removeSized(node.right, succ.val);
        }
        node.size = 1 + sizeOf(node.left) + sizeOf(node.right);
        return node;
    }

    // Chép cây thường thành cây có size, không đệ quy.
    static SizedNode augment(TreeNode root) {
        if (root == null) return null;
        SizedNode top = new SizedNode(root.val);
        List<SizedNode> order = new ArrayList<>();
        Deque<Object[]> stack = new ArrayDeque<>();
        stack.push(new Object[]{root, top});
        while (!stack.isEmpty()) {
            Object[] p = stack.pop();
            TreeNode t = (TreeNode) p[0];
            SizedNode s = (SizedNode) p[1];
            order.add(s);
            if (t.left != null) { s.left = new SizedNode(t.left.val); stack.push(new Object[]{t.left, s.left}); }
            if (t.right != null) { s.right = new SizedNode(t.right.val); stack.push(new Object[]{t.right, s.right}); }
        }
        for (int i = order.size() - 1; i >= 0; i--) {
            SizedNode s = order.get(i);
            s.size = 1 + sizeOf(s.left) + sizeOf(s.right);
        }
        return top;
    }

    static int kthAugmented(TreeNode root, int k) { return kthBySize(augment(root), k); }

    // SAI: truyền count kiểu int. Java truyền theo giá trị, nên phần tăng ở tầng con không về tới cha.
    static int wrongCountByValue(TreeNode root, int k) {
        int[] res = {-1};
        walkByValue(root, k, 0, res);
        return res[0];
    }

    static boolean walkByValue(TreeNode node, int k, int count, int[] res) {
        if (node == null) return false;
        if (walkByValue(node.left, k, count, res)) return true;
        count++;
        if (count == k) { res[0] = node.val; return true; }
        return walkByValue(node.right, k, count, res);
    }

    // SAI: biến đếm static không đặt lại. Lần gọi đầu đúng, các lần sau đếm tiếp từ số cũ.
    static int staticCount = 0, staticAnswer = -1;

    static int wrongStaticNotReset(TreeNode root, int k) {
        staticWalk(root, k);
        return staticAnswer;
    }

    static void staticWalk(TreeNode node, int k) {
        if (node == null) return;
        staticWalk(node.left, k);
        if (++staticCount == k) staticAnswer = node.val;
        staticWalk(node.right, k);
    }

    interface Kth { int apply(TreeNode root, int k); }

    record Link(TreeNode n, TreeNode l, TreeNode r) {}

    static List<Link> snapshot(TreeNode root) {
        List<Link> out = new ArrayList<>();
        Deque<TreeNode> stack = new ArrayDeque<>();
        if (root != null) stack.push(root);
        while (!stack.isEmpty()) {
            TreeNode n = stack.pop();
            out.add(new Link(n, n.left, n.right));
            if (n.left != null) stack.push(n.left);
            if (n.right != null) stack.push(n.right);
        }
        return out;
    }

    static boolean intact(List<Link> snap) {
        for (Link x : snap) if (x.n().left != x.l() || x.n().right != x.r()) return false;
        return true;
    }

    static TreeNode insertBST(TreeNode root, int v) {
        TreeNode t = new TreeNode(v);
        if (root == null) return t;
        TreeNode cur = root;
        while (true) {
            if (v < cur.val) { if (cur.left == null) { cur.left = t; return root; } cur = cur.left; }
            else { if (cur.right == null) { cur.right = t; return root; } cur = cur.right; }
        }
    }

    static int kthIterativeSized(SizedNode root, int k) {
        Deque<SizedNode> stack = new ArrayDeque<>();
        SizedNode node = root;
        while (true) {
            while (node != null) { stack.push(node); node = node.left; }
            node = stack.pop();
            if (--k == 0) return node.val;
            node = node.right;
        }
    }

    static double median(Runnable f, int reps) {
        double[] ts = new double[reps];
        for (int r = 0; r < reps; r++) {
            long t0 = System.nanoTime();
            f.run();
            ts[r] = (System.nanoTime() - t0) / 1e6;
        }
        Arrays.sort(ts);
        return ts[reps / 2];
    }

    public static void main(String[] args) {
        String[] names = {"một nút, k = 1", "cây đầy 7 nút, k = 1", "cây đầy 7 nút, k = 4 (gốc)", "cây đầy 7 nút, k = 7",
            "có giá trị 0, k = 1", "có giá trị 0, k = 2", "đáp án trong cây con phải của con trái, k = 3",
            "chuỗi lệch trái 10⁴ nút, k = 1", "chuỗi lệch trái 10⁴ nút, k = 5000", "chuỗi lệch phải 10⁴ nút, k = 10⁴"};
        List<Supplier<TreeNode>> makers = List.of(
            () -> build(9), () -> build(8, 4, 12, 2, 6, 10, 14), () -> build(8, 4, 12, 2, 6, 10, 14), () -> build(8, 4, 12, 2, 6, 10, 14),
            () -> build(3, 1, 5, 0, 2, 4, 6), () -> build(3, 1, 5, 0, 2, 4, 6), () -> build(10, 5, 15, null, 7, null, 20, 6, 8),
            () -> leftChain(10000), () -> leftChain(10000), () -> rightChain(10000));
        int[] ks = {1, 1, 4, 7, 1, 2, 3, 1, 5000, 10000};
        int[] want = {9, 2, 8, 14, 0, 1, 7, 1, 5000, 10000};
        String[] fnNames = {"kthSort", "kthInorderAll", "kthRecursive", "kthIterative", "kthMorris", "kthAugmented",
            "wrongCountByValue", "wrongStaticNotReset"};
        Kth[] fns = {KthSmallest::kthSort, KthSmallest::kthInorderAll, KthSmallest::kthRecursive, KthSmallest::kthIterative,
            KthSmallest::kthMorris, KthSmallest::kthAugmented, KthSmallest::wrongCountByValue, KthSmallest::wrongStaticNotReset};
        for (int f = 0; f < fns.length; f++) {
            List<String> bad = new ArrayList<>();
            for (int c = 0; c < names.length; c++) {
                TreeNode root = makers.get(c).get();
                List<Link> snap = snapshot(root);
                String got;
                try { got = String.valueOf(fns[f].apply(root, ks[c])); }
                catch (Throwable e) { got = "ném " + e.getClass().getSimpleName(); }
                if (!got.equals(String.valueOf(want[c]))) bad.add(names[c] + " → " + got);
                else if (!intact(snap)) bad.add(names[c] + " → " + got + " nhưng cây bị đổi");
            }
            System.out.printf("%-20s %d/%d ca đúng%s%n", fnNames[f], names.length - bad.size(), names.length,
                bad.isEmpty() ? "" : "; sai ở " + String.join(", ", bad));
        }

        Random rnd = new Random(230);
        int T = 2000, agree = 0;
        for (int t = 0; t < T; t++) {
            int n = 1 + rnd.nextInt(30);
            List<Integer> pool = new ArrayList<>();
            for (int v = 0; v <= 100; v++) pool.add(v);
            Collections.shuffle(pool, rnd);
            List<Integer> vals = pool.subList(0, n);
            TreeNode root = null;
            for (int v : vals) root = insertBST(root, v);
            int k = 1 + rnd.nextInt(n);
            List<Integer> s = new ArrayList<>(vals);
            Collections.sort(s);
            boolean ok = true;
            for (int f = 0; f < 6; f++) if (fns[f].apply(root, k) != s.get(k - 1)) ok = false;
            if (ok) agree++;
        }
        System.out.printf("%nđối chiếu %d cây tìm kiếm ngẫu nhiên 1..30 nút: sáu cách khớp với mảng sắp xếp %d/%d%n", T, agree, T);

        rnd = new Random(7);
        SizedNode sroot = null;
        List<Integer> srt = new ArrayList<>();
        int queries = 0, ok = 0;
        for (int op = 0; op < 5000; op++) {
            double r = rnd.nextDouble();
            if (srt.isEmpty() || r < 0.45) {
                int v = rnd.nextInt(10001);
                int i = Collections.binarySearch(srt, v);
                if (i >= 0) continue;
                sroot = insertSized(sroot, v);
                srt.add(-i - 1, v);
            } else if (r < 0.7) {
                int i = rnd.nextInt(srt.size());
                sroot = removeSized(sroot, srt.get(i));
                srt.remove(i);
            } else {
                int k = 1 + rnd.nextInt(srt.size());
                queries++;
                if (kthBySize(sroot, k) == srt.get(k - 1) && sizeOf(sroot) == srt.size()) ok++;
            }
        }
        System.out.printf("cây có size: 5000 thao tác chèn/xóa/hỏi ngẫu nhiên, %d/%d câu hỏi khớp mảng sắp xếp%n", ok, queries);

        int n = (1 << 20) - 1;
        TreeNode root = balancedRange(0, n - 1);
        SizedNode sized = augment(root);
        System.out.printf("%ncây cân %d nút (cao 20), thời gian trung vị 5 lần (ms)%n", n);
        System.out.println("k          sắp xếp  trung thứ tự hết  đệ quy dừng sớm  ngăn xếp   Morris   theo size");
        int[] w = {8, 18, 17, 10, 9, 12};
        for (int k : new int[]{1, 100, (n + 1) / 2, n}) {
            double[] ms = new double[6];
            for (int f = 0; f < 5; f++) { Kth fn = fns[f]; ms[f] = median(() -> fn.apply(root, k), 5); }
            ms[5] = median(() -> kthBySize(sized, k), 5);
            if (kthIterative(root, k) != k - 1 || kthMorris(root, k) != k - 1 || kthBySize(sized, k) != k - 1) throw new AssertionError("sai đáp án");
            StringBuilder line = new StringBuilder(String.format("%-8d", k));
            for (int i = 0; i < 6; i++) line.append(String.format("%" + w[i] + ".3f", ms[i]));
            System.out.println(line);
        }

        rnd = new Random(99);
        int N = 100000, Q = 2000;
        SizedNode big = null;
        Set<Integer> used = new HashSet<>();
        while (used.size() < N) { int v = rnd.nextInt(1_000_000_000); if (used.add(v)) big = insertSized(big, v); }
        int[] qs = new int[Q];
        for (int i = 0; i < Q; i++) qs[i] = 1 + rnd.nextInt(N);
        long[] sums = new long[2];
        SizedNode bigF = big;
        double t1 = median(() -> { sums[0] = 0; for (int k : qs) sums[0] += kthIterativeSized(bigF, k); }, 3);
        double t2 = median(() -> { sums[1] = 0; for (int k : qs) sums[1] += kthBySize(bigF, k); }, 3);
        if (sums[0] != sums[1]) throw new AssertionError("hai cách lệch nhau");
        System.out.printf("%ncây ngẫu nhiên %d nút, %d câu hỏi k ngẫu nhiên: ngăn xếp %.1f ms, theo size %.2f ms%n", N, Q, t1, t2);
    }
}
