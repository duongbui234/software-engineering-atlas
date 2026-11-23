// LeetCode 146: LRU Cache. Danh sách hai chiều tự viết, LinkedHashMap(accessOrder = true), và bẫy quên accessOrder.
// Chạy: java lru-cache.java

import java.util.*;

public class LruCache {
    interface Cache { int get(int key); void put(int key, int val); }

    // Cách 1: HashMap tra key → nút; danh sách hai chiều có hai nút canh. Sau head là mới dùng nhất.
    static class LRUList implements Cache {
        static class DNode { int key, val; DNode prev, next; DNode(int k, int v) { key = k; val = v; } }
        final int cap;
        final Map<Integer, DNode> map = new HashMap<>();
        final DNode head = new DNode(0, 0), tail = new DNode(0, 0);
        LRUList(int capacity) { cap = capacity; head.next = tail; tail.prev = head; }
        void unlink(DNode n) { n.prev.next = n.next; n.next.prev = n.prev; }
        void pushFront(DNode n) { n.next = head.next; n.prev = head; head.next.prev = n; head.next = n; }
        public int get(int key) {
            DNode n = map.get(key);
            if (n == null) return -1;
            unlink(n); pushFront(n);
            return n.val;
        }
        public void put(int key, int val) {
            DNode n = map.get(key);
            if (n != null) { n.val = val; unlink(n); pushFront(n); return; }
            if (map.size() == cap) { DNode old = tail.prev; unlink(old); map.remove(old.key); }
            DNode m = new DNode(key, val);
            map.put(key, m); pushFront(m);
        }
    }

    // Cách 2: LinkedHashMap với accessOrder = true tự đưa key vừa get/put xuống cuối;
    // removeEldestEntry được gọi sau mỗi put, trả true thì key đầu (cũ nhất) bị xóa.
    static class LRULinked extends LinkedHashMap<Integer, Integer> implements Cache {
        final int cap;
        LRULinked(int capacity) { this(capacity, true); }
        LRULinked(int capacity, boolean accessOrder) { super(16, 0.75f, accessOrder); cap = capacity; }
        @Override protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) { return size() > cap; }
        public int get(int key) { return getOrDefault(key, -1); }
        public void put(int key, int val) { super.put(key, val); }
    }

    // SAI: quên accessOrder (mặc định false). Thứ tự là thứ tự chèn, nên đây là FIFO chứ không phải LRU.
    static Cache wrongInsertionOrder(int capacity) { return new LRULinked(capacity, false); }

    // Bản chậm làm chuẩn: danh sách key theo thứ tự dùng.
    static class LRUSlow implements Cache {
        final int cap; final List<Integer> order = new ArrayList<>(); final Map<Integer, Integer> vals = new HashMap<>();
        LRUSlow(int capacity) { cap = capacity; }
        public int get(int key) {
            if (!vals.containsKey(key)) return -1;
            order.remove((Integer) key); order.add(key);
            return vals.get(key);
        }
        public void put(int key, int val) {
            if (vals.containsKey(key)) order.remove((Integer) key);
            else if (order.size() == cap) vals.remove(order.remove(0));
            order.add(key); vals.put(key, val);
        }
    }

    // Bộ sinh ngẫu nhiên mulberry32 (giống bản TypeScript); int của Java tràn số đúng như Math.imul.
    static int state;
    static double rnd() {
        state += 0x6D2B79F5;
        int a = state;
        int t = (a ^ (a >>> 15)) * (1 | a);
        t = (t + ((t ^ (t >>> 7)) * (61 | t))) ^ t;
        return ((t ^ (t >>> 14)) & 0xFFFFFFFFL) / 4294967296.0;
    }

    // Mỗi thao tác là {0, key} (get) hoặc {1, key, val} (put).
    static int[][] randomOps(int n, int keys, int seed) {
        state = seed;
        int[][] ops = new int[n][];
        for (int i = 0; i < n; i++) {
            int k = (int) (rnd() * keys);
            ops[i] = rnd() < 0.5 ? new int[]{0, k} : new int[]{1, k, (int) (rnd() * 1000)};
        }
        return ops;
    }

    static List<Integer> run(Cache c, int[][] ops) {
        List<Integer> out = new ArrayList<>();
        for (int[] o : ops) { if (o[0] == 0) out.add(c.get(o[1])); else c.put(o[1], o[2]); }
        return out;
    }

    static int[] g(int k) { return new int[]{0, k}; }
    static int[] p(int k, int v) { return new int[]{1, k, v}; }

    record Case(String name, int cap, int[][] ops) {}

    public static void main(String[] args) {
        List<Case> cases = List.of(
            new Case("ví dụ của đề", 2, new int[][]{p(1, 1), p(2, 2), g(1), p(3, 3), g(2), p(4, 4), g(1), g(3), g(4)}),
            new Case("cập nhật key cũ", 2, new int[][]{p(2, 1), p(1, 1), p(2, 3), p(4, 1), g(1), g(2)}),
            new Case("sức chứa 1", 1, new int[][]{p(2, 1), g(2), p(3, 2), g(2), g(3)}),
            new Case("get key chưa có", 2, new int[][]{g(5), p(5, 5), g(5)}),
            new Case("đẩy ra rồi thêm lại", 2, new int[][]{p(1, 1), p(2, 2), p(3, 3), g(1), p(1, 10), g(1), g(2), g(3)}),
            new Case("ngẫu nhiên 1 (cap 3)", 3, randomOps(2000, 8, 1)),
            new Case("ngẫu nhiên 2 (cap 10)", 10, randomOps(2000, 25, 2)),
            new Case("ngẫu nhiên 3 (cap 50)", 50, randomOps(2000, 120, 3)));
        Map<String, java.util.function.IntFunction<Cache>> impls = new LinkedHashMap<>();
        impls.put("LRUList", LRUList::new);
        impls.put("LRULinked", LRULinked::new);
        impls.put("wrongInsertionOrder", LruCache::wrongInsertionOrder);
        impls.forEach((name, make) -> {
            List<String> bad = new ArrayList<>();
            for (Case c : cases) if (!run(make.apply(c.cap()), c.ops()).equals(run(new LRUSlow(c.cap()), c.ops()))) bad.add(c.name());
            System.out.printf("%-20s %d/%d ca đúng%s%n", name, cases.size() - bad.size(), cases.size(), bad.isEmpty() ? "" : "; sai ở " + String.join(", ", bad));
        });

        // Đo: 10⁶ thao tác, nửa get nửa put. Chạy 3 lượt khởi động cho JIT rồi lấy trung vị 5 lần.
        System.out.println("\nsức chứa   LRUList (tự viết)          LRULinked (LinkedHashMap)");
        for (int cap : new int[]{100, 10000}) {
            int[][] ops = randomOps(1_000_000, 2 * cap, cap);
            StringBuilder row = new StringBuilder(String.format("%-10d", cap));
            for (java.util.function.IntFunction<Cache> make : List.<java.util.function.IntFunction<Cache>>of(LRUList::new, LRULinked::new)) {
                double[] ts = new double[8];
                for (int r = 0; r < 8; r++) {
                    Cache c = make.apply(cap);
                    long t = System.nanoTime();
                    for (int[] o : ops) { if (o[0] == 0) c.get(o[1]); else c.put(o[1], o[2]); }
                    ts[r] = (System.nanoTime() - t) / 1e6;
                }
                double[] last = Arrays.copyOfRange(ts, 3, 8);
                Arrays.sort(last);
                row.append(String.format(" %7.1f ms  %5.1f triệu/s    ", last[2], 1e6 / last[2] / 1000));
            }
            System.out.println(row.toString().stripTrailing());
        }
    }
}
