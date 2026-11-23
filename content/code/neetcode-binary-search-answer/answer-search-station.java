// Ga SRCH-02, tìm kiếm nhị phân trên đáp án: lời giải của 875, 981 và 4.
// Chạy: java answer-search-station.java
import java.util.*;

class AnswerSearchStation {
    static int minEatingSpeed(int[] piles, int h) { // 875
        int lo = 1, hi = Arrays.stream(piles).max().getAsInt();
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            long hours = 0; // tổng giờ có thể vượt int
            for (int p : piles) hours += (p + mid - 1) / mid;
            if (hours <= h) hi = mid; // kịp: giữ mid
            else lo = mid + 1;
        }
        return lo;
    }

    static class TimeMap { // 981: TreeMap.floorEntry trả mốc lớn nhất <= timestamp
        private final Map<String, TreeMap<Integer, String>> store = new HashMap<>();
        void set(String key, String value, int timestamp) {
            store.computeIfAbsent(key, k -> new TreeMap<>()).put(timestamp, value);
        }
        String get(String key, int timestamp) {
            TreeMap<Integer, String> t = store.get(key);
            if (t == null) return "";
            Map.Entry<Integer, String> e = t.floorEntry(timestamp);
            return e == null ? "" : e.getValue();
        }
    }

    static double findMedianSortedArrays(int[] a, int[] b) { // 4: chia đôi trên vị trí cắt
        if (a.length > b.length) { int[] t = a; a = b; b = t; }
        int m = a.length, n = b.length, half = (m + n + 1) / 2, lo = 0, hi = m;
        while (lo <= hi) {
            int i = (lo + hi) / 2, j = half - i;
            long aL = i > 0 ? a[i - 1] : Long.MIN_VALUE, aR = i < m ? a[i] : Long.MAX_VALUE;
            long bL = j > 0 ? b[j - 1] : Long.MIN_VALUE, bR = j < n ? b[j] : Long.MAX_VALUE;
            if (aL <= bR && bL <= aR) {
                if ((m + n) % 2 == 1) return Math.max(aL, bL);
                return (Math.max(aL, bL) + Math.min(aR, bR)) / 2.0;
            }
            if (aL > bR) hi = i - 1; // lấy quá nhiều từ a
            else lo = i + 1;
        }
        throw new IllegalArgumentException("mảng đầu vào chưa sắp");
    }

    static int ok = 0, total = 0;
    static void check(Object got, Object want, String label) {
        total++;
        if (got.equals(want)) ok++;
        else System.out.println("sai: " + label + " → " + got + ", cần " + want);
    }

    public static void main(String[] args) {
        check(minEatingSpeed(new int[]{3, 6, 7, 11}, 8), 4, "875");
        check(minEatingSpeed(new int[]{30, 11, 23, 4, 20}, 5), 30, "875 h=5");
        check(minEatingSpeed(new int[]{30, 11, 23, 4, 20}, 6), 23, "875 h=6");
        check(minEatingSpeed(new int[]{1000000000}, 2), 500000000, "875 [10⁹]");
        TimeMap tm = new TimeMap();
        tm.set("foo", "bar", 1);
        check(tm.get("foo", 1), "bar", "981 get 1");
        check(tm.get("foo", 3), "bar", "981 get 3");
        tm.set("foo", "bar2", 4);
        check(tm.get("foo", 4), "bar2", "981 get 4");
        check(tm.get("foo", 0), "", "981 get 0");
        check(tm.get("baz", 5), "", "981 khóa chưa có");
        check(findMedianSortedArrays(new int[]{1, 3}, new int[]{2}), 2.0, "4 [1,3] [2]");
        check(findMedianSortedArrays(new int[]{1, 2}, new int[]{3, 4}), 2.5, "4 [1,2] [3,4]");
        check(findMedianSortedArrays(new int[]{}, new int[]{1}), 1.0, "4 [] [1]");
        check(findMedianSortedArrays(new int[]{0, 0}, new int[]{0, 0}), 0.0, "4 toàn 0");
        check(findMedianSortedArrays(new int[]{1, 2, 3, 4, 5}, new int[]{6, 7, 8}), 4.5, "4 tách rời");
        System.out.println("answer-search-station " + ok + "/" + total + " ca đúng");
    }
}
