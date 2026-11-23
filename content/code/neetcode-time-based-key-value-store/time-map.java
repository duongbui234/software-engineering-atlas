// LeetCode 981: Time Based Key-Value Store. Chạy: java time-map.java
// get(key, t) trả giá trị của lần set có timestamp lớn nhất ≤ t, không có thì "".
import java.util.*;

class TimeMapDemo {
    interface TimeMapLike { void set(String key, String value, int timestamp); String get(String key, int timestamp); }

    // Cách 1, TreeMap: floorEntry(t) trả mốc lớn nhất ≤ t, hoặc null. O(log k) mỗi lần set và get.
    static class TreeTimeMap implements TimeMapLike {
        private final Map<String, TreeMap<Integer, String>> store = new HashMap<>();
        public void set(String key, String value, int timestamp) {
            store.computeIfAbsent(key, k -> new TreeMap<>()).put(timestamp, value);
        }
        public String get(String key, int timestamp) {
            TreeMap<Integer, String> h = store.get(key);
            if (h == null) return "";
            Map.Entry<Integer, String> e = h.floorEntry(timestamp);
            return e == null ? "" : e.getValue();
        }
    }

    // Cách 2, hai mảng nối thêm + chia đôi viết tay: set O(1) vì đề hứa timestamp tăng dần.
    static class ArrayTimeMap implements TimeMapLike {
        private final Map<String, int[]> times = new HashMap<>();
        private final Map<String, String[]> values = new HashMap<>();
        private final Map<String, Integer> sizes = new HashMap<>();
        public void set(String key, String value, int timestamp) {
            int n = sizes.getOrDefault(key, 0);
            int[] ts = times.computeIfAbsent(key, k -> new int[4]);
            String[] vs = values.computeIfAbsent(key, k -> new String[4]);
            if (n == ts.length) { // đầy thì nhân đôi, như ArrayList, nhưng không bọc int thành Integer
                ts = Arrays.copyOf(ts, 2 * n); vs = Arrays.copyOf(vs, 2 * n);
                times.put(key, ts); values.put(key, vs);
            }
            ts[n] = timestamp; vs[n] = value;
            sizes.put(key, n + 1);
        }
        public String get(String key, int timestamp) {
            int[] ts = times.get(key);
            if (ts == null) return "";
            int lo = 0, hi = sizes.get(key); // nửa mở [lo, hi): đếm số mốc ≤ timestamp
            while (lo < hi) {
                int mid = (lo + hi) >>> 1;
                if (ts[mid] <= timestamp) lo = mid + 1;
                else hi = mid;
            }
            return lo == 0 ? "" : values.get(key)[lo - 1];
        }
    }

    record Op(boolean isSet, String key, String value, int t) {}
    static Op S(String k, String v, int t) { return new Op(true, k, v, t); }
    static Op G(String k, int t, String want) { return new Op(false, k, want, t); }

    public static void main(String[] args) {
        Map<String, List<Op>> cases = new LinkedHashMap<>();
        cases.put("ví dụ của đề", List.of(S("foo", "bar", 1), G("foo", 1, "bar"), G("foo", 3, "bar"), S("foo", "bar2", 4), G("foo", 4, "bar2"), G("foo", 5, "bar2")));
        cases.put("key chưa từng set", List.of(G("x", 10, "")));
        cases.put("t nhỏ hơn mốc đầu", List.of(S("a", "v", 5), G("a", 4, ""), G("a", 5, "v")));
        cases.put("t nằm giữa hai mốc", List.of(S("a", "v1", 10), S("a", "v2", 20), G("a", 15, "v1")));
        cases.put("t lớn hơn mốc cuối", List.of(S("a", "v1", 10), S("a", "v2", 20), G("a", 99, "v2")));
        cases.put("hai key xen kẽ", List.of(S("a", "a1", 1), S("b", "b1", 2), S("a", "a2", 3), G("b", 3, "b1"), G("a", 2, "a1"), G("b", 1, "")));
        cases.put("trùng mốc ở giữa", List.of(S("k", "1", 1), S("k", "2", 2), S("k", "3", 3), G("k", 2, "2")));
        cases.put("timestamp 10⁷", List.of(S("k", "lo", 1), S("k", "hi", 10_000_000), G("k", 9_999_999, "lo"), G("k", 10_000_000, "hi")));

        Map<String, java.util.function.Supplier<TimeMapLike>> impls = new LinkedHashMap<>();
        impls.put("TreeTimeMap", TreeTimeMap::new);
        impls.put("ArrayTimeMap", ArrayTimeMap::new);
        for (var impl : impls.entrySet()) {
            List<String> bad = new ArrayList<>();
            for (var c : cases.entrySet()) {
                TimeMapLike m = impl.getValue().get();
                boolean ok = true;
                for (Op o : c.getValue()) {
                    if (o.isSet()) m.set(o.key(), o.value(), o.t());
                    else if (!m.get(o.key(), o.t()).equals(o.value())) ok = false;
                }
                if (!ok) bad.add(c.getKey());
            }
            System.out.printf("%-13s %d/%d ca đúng%s%n", impl.getKey(), cases.size() - bad.size(), cases.size(), bad.isEmpty() ? "" : "; sai ở: " + String.join("; ", bad));
        }

        TreeMap<Integer, String> tm = new TreeMap<>(Map.of(10, "v1", 20, "v2"));
        System.out.println("\nfloorEntry(15) = " + tm.floorEntry(15) + ", floorEntry(5) = " + tm.floorEntry(5) + ", ceilingEntry(15) = " + tm.ceilingEntry(15));
        System.out.println("Collections.binarySearch([10, 20], 15) = " + Collections.binarySearch(List.of(10, 20), 15));

        // Đo: một key, 10⁶ lần set rồi 10⁶ lần get ngẫu nhiên. Chạy 5 lần, lấy trung vị (các lần đầu có cả thời gian JIT).
        int K = 1_000_000;
        Random rnd = new Random(42);
        int[] qs = new int[K];
        for (int i = 0; i < K; i++) qs[i] = 1 + rnd.nextInt(2 * K);
        for (var impl : impls.entrySet()) {
            long[] setNs = new long[5], getNs = new long[5];
            long sink = 0;
            for (int r = 0; r < 5; r++) {
                TimeMapLike m = impl.getValue().get();
                long t0 = System.nanoTime();
                for (int i = 1; i <= K; i++) m.set("k", "v", 2 * i);
                long t1 = System.nanoTime();
                for (int q : qs) sink += m.get("k", q).length();
                long t2 = System.nanoTime();
                setNs[r] = t1 - t0; getNs[r] = t2 - t1;
            }
            Arrays.sort(setNs); Arrays.sort(getNs);
            System.out.printf("%-13s 10⁶ set: %6.1f ms, 10⁶ get: %6.1f ms (trung vị 5 lần)%s%n", impl.getKey(), setNs[2] / 1e6, getNs[2] / 1e6, sink < 0 ? "!" : "");
        }
    }
}
