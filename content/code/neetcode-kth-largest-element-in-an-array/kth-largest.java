// LeetCode 215, Kth Largest Element in an Array: Arrays.sort, PriorityQueue, quickselect ba phần,
// và bẫy so sánh bằng phép trừ (b - a) tràn int.
// Chạy: java kth-largest.java
import java.util.*;
import java.util.function.*;

class KthLargest {
    static int sortThenPick(int[] nums, int k) {
        int[] a = nums.clone();
        Arrays.sort(a); // int[]: Dual-Pivot Quicksort, so sánh số
        return a[a.length - k];
    }

    // PriorityQueue mặc định là min-heap: peek() là phần tử nhỏ nhất. Giữ k phần tử lớn nhất đã thấy.
    static int heapOfK(int[] nums, int k) {
        PriorityQueue<Integer> pq = new PriorityQueue<>(k + 1);
        for (int x : nums) {
            pq.offer(x);
            if (pq.size() > k) pq.poll();
        }
        return pq.peek();
    }

    // Max-heap đúng cách: Collections.reverseOrder(), rồi lấy ra k - 1 lần.
    static int maxHeapPoll(int[] nums, int k) {
        PriorityQueue<Integer> pq = new PriorityQueue<>(Collections.reverseOrder());
        for (int x : nums) pq.offer(x);
        for (int i = 1; i < k; i++) pq.poll();
        return pq.peek();
    }

    // SAI (khi giá trị lớn): max-heap với so sánh (a, b) -> b - a. Phép trừ tràn int khi hai số cách nhau quá 2³¹ - 1.
    static int maxHeapSubtract(int[] nums, int k) {
        PriorityQueue<Integer> pq = new PriorityQueue<>((a, b) -> b - a);
        for (int x : nums) pq.offer(x);
        for (int i = 1; i < k; i++) pq.poll();
        return pq.peek();
    }

    static final Random RNG = new Random();

    static int quickselect3Way(int[] nums, int k) {
        int[] a = nums.clone();
        int target = a.length - k, lo = 0, hi = a.length - 1;
        while (true) {
            int pivot = a[lo + RNG.nextInt(hi - lo + 1)];
            int lt = lo, i = lo, gt = hi;
            while (i <= gt) {
                if (a[i] < pivot) { int t = a[lt]; a[lt] = a[i]; a[i] = t; lt++; i++; }
                else if (a[i] > pivot) { int t = a[gt]; a[gt] = a[i]; a[i] = t; gt--; }
                else i++;
            }
            if (target < lt) hi = lt - 1;
            else if (target > gt) lo = gt + 1;
            else return pivot;
        }
    }

    static int countingPick(int[] nums, int k) {
        int[] cnt = new int[20001];
        for (int x : nums) cnt[x + 10000]++;
        for (int v = 20000; v >= 0; v--) {
            k -= cnt[v];
            if (k <= 0) return v - 10000;
        }
        throw new IllegalArgumentException("k lớn hơn n");
    }

    record Case(int[] nums, int k, int want) {}

    public static void main(String[] args) {
        List<Case> cases = List.of(
            new Case(new int[]{3, 2, 1, 5, 6, 4}, 2, 5),
            new Case(new int[]{3, 2, 3, 1, 2, 4, 5, 5, 6}, 4, 4),
            new Case(new int[]{1}, 1, 1),
            new Case(new int[]{7, 7, 7, 7}, 2, 7),
            new Case(new int[]{-1, -2, -3}, 1, -1),
            new Case(new int[]{-10000, 10000}, 2, -10000),
            new Case(new int[]{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}, 3, 8),
            new Case(new int[]{10, 9, 8, 7, 6, 5, 4, 3, 2, 1}, 10, 1),
            new Case(new int[]{10, 9, 1}, 1, 10),
            new Case(new int[]{2, -1, 10, -20}, 2, 2));
        Map<String, BiFunction<int[], Integer, Integer>> fns = new LinkedHashMap<>();
        fns.put("sortThenPick", KthLargest::sortThenPick);
        fns.put("heapOfK", KthLargest::heapOfK);
        fns.put("maxHeapPoll", KthLargest::maxHeapPoll);
        fns.put("maxHeapSubtract", KthLargest::maxHeapSubtract);
        fns.put("quickselect3Way", KthLargest::quickselect3Way);
        fns.put("countingPick", KthLargest::countingPick);
        for (var e : fns.entrySet()) {
            List<String> bad = new ArrayList<>();
            for (Case c : cases) {
                int got = e.getValue().apply(c.nums(), c.k());
                if (got != c.want()) bad.add(Arrays.toString(c.nums()) + " k=" + c.k() + " → " + got);
            }
            System.out.printf("%-16s %d/%d ca đúng%s%n", e.getKey(), cases.size() - bad.size(), cases.size(),
                bad.isEmpty() ? "" : "; sai ở " + String.join(", ", bad));
        }
        // Ngoài giới hạn đề: giá trị trải hết int. b - a tràn và đảo chiều so sánh.
        int[] wide = {Integer.MIN_VALUE, 1, Integer.MAX_VALUE, -5};
        System.out.println("\n" + Arrays.toString(wide) + ", k = 1:");
        System.out.println("  maxHeapPoll     → " + maxHeapPoll(wide, 1));
        System.out.println("  maxHeapSubtract → " + maxHeapSubtract(wide, 1));
        System.out.println("  1 - Integer.MIN_VALUE = " + (1 - Integer.MIN_VALUE));
    }
}
