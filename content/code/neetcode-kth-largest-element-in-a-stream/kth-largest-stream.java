// LeetCode 703, Kth Largest Element in a Stream: PriorityQueue (min-heap mặc định) và bẫy comparator (a, b) -> b - a.
// Chạy: java kth-largest-stream.java
import java.util.*;

class KthLargestStream {
    // PriorityQueue mặc định là min-heap: peek() trả phần tử nhỏ nhất.
    static class KthLargest {
        private final int k;
        private final PriorityQueue<Integer> pq = new PriorityQueue<>();
        KthLargest(int k, int[] nums) {
            this.k = k;
            for (int x : nums) add(x);
        }
        int add(int val) {
            if (pq.size() < k) pq.offer(val);
            else if (val > pq.peek()) { pq.poll(); pq.offer(val); }
            return pq.peek();
        }
    }

    // SAI: max-heap k chỗ (Collections.reverseOrder()). Giữ k số nhỏ nhất, peek() là số lớn nhất trong đó.
    static class ReverseKthLargest {
        private final int k;
        private final PriorityQueue<Integer> pq = new PriorityQueue<>(Collections.reverseOrder());
        ReverseKthLargest(int k, int[] nums) {
            this.k = k;
            for (int x : nums) add(x);
        }
        int add(int val) {
            pq.offer(val);
            if (pq.size() > k) pq.poll();
            return pq.peek();
        }
    }

    record Case(String name, int k, int[] nums, int[] adds, int[] want) {}

    public static void main(String[] args) {
        List<Case> cases = new ArrayList<>(List.of(
            new Case("ví dụ của đề", 3, new int[]{4, 5, 8, 2}, new int[]{3, 5, 10, 9, 4}, new int[]{4, 5, 5, 8, 8}),
            new Case("nhiều số 7 trùng", 4, new int[]{7, 7, 7, 7, 8, 3}, new int[]{2, 10, 9, 9}, new int[]{7, 7, 7, 8}),
            new Case("nums rỗng, k = 1", 1, new int[]{}, new int[]{-3, -2, -4, 0, 4}, new int[]{-3, -2, -2, 0, 4}),
            new Case("nums thiếu một số", 2, new int[]{0}, new int[]{-1, 1, -2, -4, 3}, new int[]{-1, 0, 0, 0, 1}),
            new Case("số trùng", 2, new int[]{5, 5}, new int[]{5, 1, 6}, new int[]{5, 5, 5}),
            new Case("k bằng cả luồng", 3, new int[]{1, 2}, new int[]{3, 0}, new int[]{1, 1}),
            new Case("số âm", 2, new int[]{-10, -20}, new int[]{-5, -30, -1}, new int[]{-10, -10, -5})));
        Random r = new Random(7);
        int[] nums = r.ints(200, -10000, 10001).toArray(), adds = r.ints(500, -10000, 10001).toArray();
        List<Integer> seen = new ArrayList<>();
        for (int x : nums) seen.add(x);
        int[] want = new int[500];
        for (int i = 0; i < 500; i++) {
            seen.add(adds[i]);
            List<Integer> s = new ArrayList<>(seen);
            Collections.sort(s);
            want[i] = s.get(s.size() - 50);
        }
        cases.add(new Case("ngẫu nhiên 200 + 500 số, k = 50", 50, nums, adds, want));

        for (String name : List.of("KthLargest", "ReverseKthLargest")) {
            int ok = 0;
            List<String> bad = new ArrayList<>();
            for (Case c : cases) {
                int[] got = new int[c.adds().length];
                if (name.equals("KthLargest")) {
                    KthLargest s = new KthLargest(c.k(), c.nums());
                    for (int i = 0; i < got.length; i++) got[i] = s.add(c.adds()[i]);
                } else {
                    ReverseKthLargest s = new ReverseKthLargest(c.k(), c.nums());
                    for (int i = 0; i < got.length; i++) got[i] = s.add(c.adds()[i]);
                }
                if (Arrays.equals(got, c.want())) ok++;
                else bad.add(got.length <= 5 ? c.name() + " → " + Arrays.toString(got) : c.name());
            }
            System.out.println(String.format("%-18s %d/%d ca đúng", name, ok, cases.size()) + (bad.isEmpty() ? "" : "; sai ở: " + String.join("; ", bad)));
        }

        // Bẫy comparator: (a, b) -> b - a tràn int khi hai số cách nhau quá 2³¹ − 1.
        PriorityQueue<Integer> bad = new PriorityQueue<>((a, b) -> b - a);
        PriorityQueue<Integer> good = new PriorityQueue<>((a, b) -> Integer.compare(b, a));
        for (int x : new int[]{Integer.MIN_VALUE, 5, Integer.MAX_VALUE}) { bad.offer(x); good.offer(x); }
        System.out.println("\nmax-heap bằng b - a, peek() = " + bad.peek() + "; bằng Integer.compare(b, a), peek() = " + good.peek());
        System.out.println("vì 5 - Integer.MIN_VALUE = " + (5 - Integer.MIN_VALUE));
    }
}
