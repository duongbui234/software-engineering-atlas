// Ga SRCH-03, heap và top K: giải 703, 1046, 973 và 215 bằng PriorityQueue.
// Chạy: java heap-station.java
import java.util.*;
import java.util.function.Supplier;

class HeapStation {
    static class KthLargest { // 703: min-heap (mặc định của PriorityQueue) giữ k số lớn nhất
        private final int k;
        private final PriorityQueue<Integer> pq = new PriorityQueue<>();
        KthLargest(int k, int[] nums) { this.k = k; for (int x : nums) add(x); }
        int add(int val) {
            if (pq.size() < k) pq.offer(val);
            else if (val > pq.peek()) { pq.poll(); pq.offer(val); } // thay ứng viên yếu nhất
            return pq.peek();
        }
    }

    static int lastStoneWeight(int[] stones) { // 1046: max-heap
        PriorityQueue<Integer> pq = new PriorityQueue<>(Collections.reverseOrder());
        for (int s : stones) pq.offer(s);
        while (pq.size() > 1) {
            int y = pq.poll(), x = pq.poll();
            if (y > x) pq.offer(y - x);
        }
        return pq.isEmpty() ? 0 : pq.peek();
    }

    static int[][] kClosest(int[][] points, int k) { // 973: max-heap k chỗ theo bình phương khoảng cách
        PriorityQueue<int[]> pq = new PriorityQueue<>(
            (p, q) -> Integer.compare(q[0] * q[0] + q[1] * q[1], p[0] * p[0] + p[1] * p[1]));
        for (int[] p : points) {
            pq.offer(p);
            if (pq.size() > k) pq.poll(); // bỏ điểm xa nhất
        }
        return pq.toArray(new int[0][]);
    }

    static int findKthLargest(int[] nums, int k) { // 215: min-heap k chỗ
        PriorityQueue<Integer> pq = new PriorityQueue<>();
        for (int x : nums) {
            if (pq.size() < k) pq.offer(x);
            else if (x > pq.peek()) { pq.poll(); pq.offer(x); } // chỉ số mạnh hơn đỉnh mới vào
        }
        return pq.peek();
    }

    static List<Integer> stream(int k, int[] nums, int... adds) {
        KthLargest s = new KthLargest(k, nums);
        List<Integer> out = new ArrayList<>();
        for (int v : adds) out.add(s.add(v));
        return out;
    }

    static List<String> pts(int[][] ps) {
        List<String> s = new ArrayList<>();
        for (int[] p : ps) s.add(Arrays.toString(p));
        Collections.sort(s);
        return s;
    }

    record Case(String name, Supplier<Object> got, Object want) {}

    public static void main(String[] args) {
        List<Case> cases = List.of(
            new Case("703 ví dụ của đề", () -> stream(3, new int[]{4, 5, 8, 2}, 3, 5, 10, 9, 4), List.of(4, 5, 5, 8, 8)),
            new Case("703 nums rỗng", () -> stream(1, new int[]{}, -3, -2, -4, 0, 4), List.of(-3, -2, -2, 0, 4)),
            new Case("703 số trùng", () -> stream(2, new int[]{5, 5}, 5, 1, 6), List.of(5, 5, 5)),
            new Case("1046 ví dụ của đề", () -> lastStoneWeight(new int[]{2, 7, 4, 1, 8, 1}), 1),
            new Case("1046 một viên", () -> lastStoneWeight(new int[]{1}), 1),
            new Case("1046 vỡ hết", () -> lastStoneWeight(new int[]{2, 2}), 0),
            new Case("1046 [3, 7, 2]", () -> lastStoneWeight(new int[]{3, 7, 2}), 2),
            new Case("973 ví dụ 1", () -> pts(kClosest(new int[][]{{1, 3}, {-2, 2}}, 1)), pts(new int[][]{{-2, 2}})),
            new Case("973 ví dụ 2", () -> pts(kClosest(new int[][]{{3, 3}, {5, -1}, {-2, 4}}, 2)), pts(new int[][]{{3, 3}, {-2, 4}})),
            new Case("973 k = n", () -> pts(kClosest(new int[][]{{0, 1}, {1, 0}}, 2)), pts(new int[][]{{0, 1}, {1, 0}})),
            new Case("215 ví dụ 1", () -> findKthLargest(new int[]{3, 2, 1, 5, 6, 4}, 2), 5),
            new Case("215 ví dụ 2", () -> findKthLargest(new int[]{3, 2, 3, 1, 2, 4, 5, 5, 6}, 4), 4),
            new Case("215 một phần tử", () -> findKthLargest(new int[]{1}, 1), 1),
            new Case("215 số âm trùng", () -> findKthLargest(new int[]{-1, -1}, 2), -1));
        List<String> bad = new ArrayList<>();
        for (Case c : cases) if (!c.got().get().equals(c.want())) bad.add(c.name());
        System.out.println("heap-station " + (cases.size() - bad.size()) + "/" + cases.size() + " ca đúng"
            + (bad.isEmpty() ? "" : "; sai ở: " + String.join(", ", bad)));
    }
}
