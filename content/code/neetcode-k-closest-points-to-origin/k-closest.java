// LeetCode 973, K Closest Points to Origin: Arrays.sort, PriorityQueue k chỗ, và x*x + y*y tràn int ngoài giới hạn đề.
// Chạy: java k-closest.java
import java.util.*;
import java.util.function.BiFunction;

class KClosest {
    static int dist2(int[] p) { return p[0] * p[0] + p[1] * p[1]; } // toạ độ <= 10⁴ thì tối đa 2·10⁸, vừa int

    static int[][] sortAll(int[][] points, int k) {
        int[][] s = points.clone();
        Arrays.sort(s, Comparator.comparingInt(KClosest::dist2));
        return Arrays.copyOf(s, k);
    }

    // Max-heap k chỗ: đỉnh là điểm xa nhất đang giữ. Trừ hai số không âm thì không tràn, nên b - a an toàn ở đây.
    static int[][] maxHeapK(int[][] points, int k) {
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> dist2(b) - dist2(a));
        for (int[] p : points) {
            pq.add(p);
            if (pq.size() > k) pq.poll(); // vượt k thì bỏ điểm xa nhất
        }
        return pq.toArray(new int[0][]);
    }

    // Cùng thuật toán nhưng tính khoảng cách bằng long, so sánh bằng Long.compare.
    static long dist2Long(int[] p) { return (long) p[0] * p[0] + (long) p[1] * p[1]; }

    static int[][] maxHeapKLong(int[][] points, int k) {
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> Long.compare(dist2Long(b), dist2Long(a)));
        for (int[] p : points) {
            pq.add(p);
            if (pq.size() > k) pq.poll();
        }
        return pq.toArray(new int[0][]);
    }

    static List<String> norm(int[][] ps) {
        List<String> out = new ArrayList<>();
        for (int[] p : ps) out.add(Arrays.toString(p));
        Collections.sort(out);
        return out;
    }

    public static void main(String[] args) {
        int[][][] ps = {{{1, 3}, {-2, 2}}, {{3, 3}, {5, -1}, {-2, 4}}, {{0, 0}}, {{1, 0}, {0, 1}, {2, 2}, {-1, -1}},
            {{1, 1}, {2, 2}, {3, 3}}, {{-5, -5}, {4, 4}, {-1, 0}, {10, -10}}, {{10000, 10000}, {-10000, -10000}, {1, 1}},
            {{2, 2}, {1, 1}, {3, 3}, {0, 1}, {5, 0}}};
        int[] ks = {1, 2, 1, 3, 3, 2, 1, 2};
        int[][][] want = {{{-2, 2}}, {{3, 3}, {-2, 4}}, {{0, 0}}, {{1, 0}, {0, 1}, {-1, -1}}, {{1, 1}, {2, 2}, {3, 3}},
            {{-1, 0}, {4, 4}}, {{1, 1}}, {{0, 1}, {1, 1}}};
        Map<String, BiFunction<int[][], Integer, int[][]>> fns = new LinkedHashMap<>();
        fns.put("sortAll", KClosest::sortAll);
        fns.put("maxHeapK", KClosest::maxHeapK);
        fns.put("maxHeapKLong", KClosest::maxHeapKLong);
        for (var e : fns.entrySet()) {
            int ok = 0;
            for (int i = 0; i < ps.length; i++) if (norm(e.getValue().apply(ps[i], ks[i])).equals(norm(want[i]))) ok++;
            System.out.printf("%-12s %d/%d ca đúng%n", e.getKey(), ok, ps.length);
        }

        // Ngoài giới hạn đề: toạ độ 40 000 thì x*x + y*y = 3,2·10⁹ vượt Integer.MAX_VALUE.
        int[][] big = {{40000, 40000}, {1, 1}};
        System.out.println("\ndist2([40000, 40000]) bằng int = " + dist2(big[0]) + ", bằng long = " + dist2Long(big[0]));
        System.out.println("maxHeapK(k = 1) trả " + Arrays.toString(maxHeapK(big, 1)[0]) + ", maxHeapKLong trả " + Arrays.toString(maxHeapKLong(big, 1)[0]));
    }
}
