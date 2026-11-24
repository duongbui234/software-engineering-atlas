// LC 572 Subtree of Another Tree: so ở mọi nút O(m·n), tuần tự hóa + tìm chuỗi (có sẵn hoặc KMP),
// hash Merkle kiểm lại khi trùng, và đánh số cây con (không va chạm).
// Chạy: java subtree.java
import java.util.*;

public class Subtree {
    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
    }

    static TreeNode build(Integer... level) {
        if (level.length == 0 || level[0] == null) return null;
        TreeNode root = new TreeNode(level[0]);
        ArrayDeque<TreeNode> queue = new ArrayDeque<>(List.of(root));
        for (int i = 1; i < level.length; ) {
            TreeNode node = queue.poll();
            if (level[i] != null) { node.left = new TreeNode(level[i]); queue.add(node.left); }
            i++;
            if (i < level.length && level[i] != null) { node.right = new TreeNode(level[i]); queue.add(node.right); }
            i++;
        }
        return root;
    }

    // Cây lệch trái n nút giá trị 1, nút sâu nhất mang giá trị bottom.
    static TreeNode chain(int n, int bottom) {
        TreeNode root = null;
        for (int i = 0; i < n; i++) {
            TreeNode t = new TreeNode(i == 0 ? bottom : 1);
            t.left = root;
            root = t;
        }
        return root;
    }

    // So hai cây (bài 100), bản vòng lặp. ArrayList nhận null, ArrayDeque thì không.
    static boolean isSame(TreeNode p, TreeNode q) {
        ArrayList<TreeNode> stack = new ArrayList<>();
        stack.add(p);
        stack.add(q);
        while (!stack.isEmpty()) {
            TreeNode b = stack.remove(stack.size() - 1), a = stack.remove(stack.size() - 1);
            if (a == null && b == null) continue;
            if (a == null || b == null || a.val != b.val) return false;
            stack.add(a.right); stack.add(b.right);
            stack.add(a.left); stack.add(b.left);
        }
        return true;
    }

    static List<TreeNode> preorderNodes(TreeNode root) {
        List<TreeNode> out = new ArrayList<>();
        ArrayList<TreeNode> stack = new ArrayList<>();
        stack.add(root);
        while (!stack.isEmpty()) {
            TreeNode n = stack.remove(stack.size() - 1);
            if (n == null) continue;
            out.add(n);
            stack.add(n.right);
            stack.add(n.left);
        }
        return out;
    }

    // Cách 1 (dạng đệ quy quen thuộc).
    static boolean isSameRec(TreeNode p, TreeNode q) {
        if (p == null || q == null) return p == q;
        return p.val == q.val && isSameRec(p.left, q.left) && isSameRec(p.right, q.right);
    }
    static boolean isSubtreeRecursive(TreeNode root, TreeNode sub) {
        if (root == null) return sub == null;
        return isSameRec(root, sub) || isSubtreeRecursive(root.left, sub) || isSubtreeRecursive(root.right, sub);
    }

    // Cách 1 (vòng lặp): thử so ở từng nút. O(m·n) xấu nhất.
    static boolean isSubtreeNaive(TreeNode root, TreeNode sub) {
        if (sub == null) return true;
        for (TreeNode n : preorderNodes(root)) if (isSame(n, sub)) return true;
        return false;
    }

    // Mỗi nút ",giá trị", mỗi chỗ trống ",#". Dấu phẩy đứng TRƯỚC mỗi phần tử.
    static String serializeString(TreeNode root) {
        StringBuilder sb = new StringBuilder();
        ArrayList<TreeNode> stack = new ArrayList<>();
        stack.add(root);
        while (!stack.isEmpty()) {
            TreeNode n = stack.remove(stack.size() - 1);
            if (n == null) { sb.append(",#"); continue; }
            sb.append(',').append(n.val);
            stack.add(n.right);
            stack.add(n.left);
        }
        return sb.toString();
    }

    // Cách 2a: tuần tự hóa rồi String.contains (bên trong là indexOf).
    static boolean isSubtreeString(TreeNode root, TreeNode sub) {
        return serializeString(root).contains(serializeString(sub));
    }

    static final int NONE = Integer.MIN_VALUE;
    static int[] serializeInts(TreeNode root) {
        int[] out = new int[16];
        int n = 0;
        ArrayList<TreeNode> stack = new ArrayList<>();
        stack.add(root);
        while (!stack.isEmpty()) {
            TreeNode node = stack.remove(stack.size() - 1);
            if (n == out.length) out = Arrays.copyOf(out, n * 2);
            if (node == null) { out[n++] = NONE; continue; }
            out[n++] = node.val;
            stack.add(node.right);
            stack.add(node.left);
        }
        return Arrays.copyOf(out, n);
    }

    static boolean kmpContains(int[] text, int[] pat) {
        int[] fail = new int[pat.length];
        for (int i = 1, k = 0; i < pat.length; i++) {
            while (k > 0 && pat[i] != pat[k]) k = fail[k - 1];
            if (pat[i] == pat[k]) k++;
            fail[i] = k;
        }
        for (int i = 0, k = 0; i < text.length; i++) {
            while (k > 0 && text[i] != pat[k]) k = fail[k - 1];
            if (text[i] == pat[k]) k++;
            if (k == pat.length) return true;
        }
        return false;
    }

    // Cách 2b: tuần tự hóa thành mảng int rồi KMP.
    static boolean isSubtreeKmp(TreeNode root, TreeNode sub) { return kmpContains(serializeInts(root), serializeInts(sub)); }

    static final int NULL_HASH = 0x165667b1;
    // fmix32 của MurmurHash3. int của Java tràn số theo modulo 2³², >>> là dịch không dấu.
    static int fmix32(int h) {
        h ^= h >>> 16;
        h *= 0x85ebca6b;
        h ^= h >>> 13;
        h *= 0xc2b2ae35;
        return h ^ (h >>> 16);
    }
    static int nodeHash(int val, int hl, int hr) {
        return fmix32(hl * 0x9e3779b1 ^ (hr ^ 0x85ebca6b) * 0xc2b2ae35 ^ (val + 0x27d4eb2f));
    }

    interface Hasher { int apply(int val, int hl, int hr); }

    static IdentityHashMap<TreeNode, Integer> subtreeHashes(TreeNode root, Hasher h, int nullH) {
        IdentityHashMap<TreeNode, Integer> hashes = new IdentityHashMap<>();
        List<TreeNode> nodes = preorderNodes(root);
        for (int i = nodes.size() - 1; i >= 0; i--) {
            TreeNode n = nodes.get(i);
            hashes.put(n, h.apply(n.val, n.left == null ? nullH : hashes.get(n.left), n.right == null ? nullH : hashes.get(n.right)));
        }
        return hashes;
    }

    // Cách 3: hash Merkle, trùng hash thì so lại thật.
    static boolean isSubtreeHash(TreeNode root, TreeNode sub) {
        if (sub == null) return true;
        int target = subtreeHashes(sub, Subtree::nodeHash, NULL_HASH).get(sub);
        for (var e : subtreeHashes(root, Subtree::nodeHash, NULL_HASH).entrySet())
            if (e.getValue() == target && isSame(e.getKey(), sub)) return true;
        return false;
    }

    record Triple(int val, int l, int r) {}

    // Cách 4: đánh số cây con. record Triple tự có equals và hashCode nên dùng thẳng làm khóa HashMap.
    static boolean isSubtreeIds(TreeNode root, TreeNode sub) {
        if (sub == null) return true;
        HashMap<Triple, Integer> ids = new HashMap<>();
        IdentityHashMap<TreeNode, Integer> idOf = new IdentityHashMap<>();
        List<TreeNode> subNodes = preorderNodes(sub);
        for (int i = subNodes.size() - 1; i >= 0; i--) {
            TreeNode n = subNodes.get(i);
            Triple k = new Triple(n.val, n.left == null ? 0 : idOf.get(n.left), n.right == null ? 0 : idOf.get(n.right));
            idOf.put(n, ids.computeIfAbsent(k, x -> ids.size() + 1));
        }
        int target = idOf.get(sub);
        List<TreeNode> rootNodes = preorderNodes(root);
        for (int i = rootNodes.size() - 1; i >= 0; i--) {
            TreeNode n = rootNodes.get(i);
            int l = n.left == null ? 0 : idOf.get(n.left), r = n.right == null ? 0 : idOf.get(n.right);
            int id = l < 0 || r < 0 ? -1 : ids.getOrDefault(new Triple(n.val, l, r), -1);
            if (id == target) return true;
            idOf.put(n, id);
        }
        return false;
    }

    // SAI: hash bằng Objects.hash (đa thức cơ số 31, tuyến tính) và không so lại khi trùng.
    static boolean wrongObjectsHash(TreeNode root, TreeNode sub) {
        if (sub == null) return true;
        Hasher h = (v, l, r) -> Objects.hash(v, l, r);
        int target = subtreeHashes(sub, h, 0).get(sub);
        // không dùng containsValue: IdentityHashMap so cả giá trị bằng ==, hai Integer ngoài -128..127 sẽ khác nhau
        for (int v : subtreeHashes(root, h, 0).values()) if (v == target) return true;
        return false;
    }

    record Case(String name, TreeNode root, TreeNode sub, boolean want) {}

    interface Fn { boolean apply(TreeNode root, TreeNode sub); }

    static double medianMs(Runnable fn, int reps) {
        double[] ts = new double[reps];
        for (int r = 0; r < reps; r++) {
            long t0 = System.nanoTime();
            fn.run();
            ts[r] = (System.nanoTime() - t0) / 1e6;
        }
        Arrays.sort(ts);
        return ts[reps / 2];
    }

    public static void main(String[] args) {
        List<Case> cases = List.of(
            new Case("khớp nhánh trái", build(7, 8, 9, 4, 5), build(8, 4, 5), true),
            new Case("nút 5 có thêm con", build(7, 8, 9, 4, 5, null, null, null, null, 6), build(8, 4, 5), false),
            new Case("12 và 2", build(12), build(2), false),
            new Case("-3 và 3", build(-3), build(3), false),
            new Case("trùng cả cây", build(1, 2, 3), build(1, 2, 3), true),
            new Case("sub là lá", build(1, 2, 3), build(3), true),
            new Case("lá và nút có con", build(1, 2, 3, null, null, 4), build(3), false),
            new Case("giá trị lặp", build(1, 1), build(1), true),
            new Case("trái và phải", build(1, 2), build(1, null, 2), false),
            new Case("cùng tổng giá trị", build(1, 2, 3), build(3, 1, 2), false),
            new Case("số âm", build(-1, -2, -3), build(-3), true),
            new Case("trùng Objects.hash", build(1, 1), build(1, null, 961), false),
            new Case("lệch 2000 và 1000", chain(2000, 1), chain(1000, 1), true),
            new Case("lệch, đáy khác", chain(2000, 1), chain(1000, 2), false));

        LinkedHashMap<String, Fn> fns = new LinkedHashMap<>();
        fns.put("isSubtreeRecursive", Subtree::isSubtreeRecursive);
        fns.put("isSubtreeNaive", Subtree::isSubtreeNaive);
        fns.put("isSubtreeString", Subtree::isSubtreeString);
        fns.put("isSubtreeKmp", Subtree::isSubtreeKmp);
        fns.put("isSubtreeHash", Subtree::isSubtreeHash);
        fns.put("isSubtreeIds", Subtree::isSubtreeIds);
        fns.put("wrongObjectsHash", Subtree::wrongObjectsHash);
        for (var e : fns.entrySet()) {
            List<String> bad = new ArrayList<>();
            for (Case c : cases) {
                String got;
                try { got = String.valueOf(e.getValue().apply(c.root(), c.sub())); }
                catch (RuntimeException | StackOverflowError ex) { got = "ném " + ex.getClass().getSimpleName(); }
                if (!got.equals(String.valueOf(c.want()))) bad.add(c.name() + " → " + got);
            }
            System.out.printf("%-19s %d/%d ca đúng%s%n", e.getKey(), cases.size() - bad.size(), cases.size(),
                bad.isEmpty() ? "" : "; sai ở " + String.join(", ", bad));
        }
        Hasher oh = (v, l, r) -> Objects.hash(v, l, r);
        TreeNode x = build(1, 1), y = build(1, null, 961);
        System.out.printf("%nObjects.hash: [1,1] → %d, [1,null,961] → %d%n",
            subtreeHashes(x, oh, 0).get(x), subtreeHashes(y, oh, 0).get(y));

        System.out.println("\nroot lệch m nút, sub lệch n nút khác ở đáy, trung vị 5 lần (ms)");
        System.out.printf("%-9s %-8s %8s %8s %8s %8s %8s%n", "m", "n", "mọi nút", "contains", "KMP", "hash", "đánh số");
        int[][] sizes = {{2000, 1000}, {20000, 10000}, {200000, 100000}, {2_000_000, 1_000_000}};
        for (int[] mn : sizes) {
            int m = mn[0], n = mn[1];
            TreeNode root = chain(m, 1), sub = chain(n, 2);
            List<String> row = new ArrayList<>();
            for (String name : List.of("isSubtreeNaive", "isSubtreeString", "isSubtreeKmp", "isSubtreeHash", "isSubtreeIds")) {
                // so ở mọi nút và String.contains chậm theo m·n trên đầu vào này: chỉ chạy tới cỡ 20000
                if ((name.equals("isSubtreeNaive") || name.equals("isSubtreeString")) && m > 20000) { row.add(""); continue; }
                Fn fn = fns.get(name);
                row.add(String.format("%.2f", medianMs(() -> fn.apply(root, sub), m > 200000 ? 3 : 5)));
            }
            System.out.printf("%-9d %-8d %8s %8s %8s %8s %8s%n", m, n, row.get(0), row.get(1), row.get(2), row.get(3), row.get(4));
        }
    }
}
