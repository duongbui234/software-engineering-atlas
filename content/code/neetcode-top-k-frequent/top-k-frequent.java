// NC-05 Top K Frequent Elements (LeetCode 347), Java 21: PriorityQueue và bucket sort.
// Chạy: java top-k-frequent.java
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.PriorityQueue;

class TopKFrequent { // không public: tên file không cần trùng tên class
    static int[] topKHeap(int[] nums, int k) {
        Map<Integer, Integer> count = new HashMap<>();
        for (int x : nums) count.merge(x, 1, Integer::sum);
        // PriorityQueue mặc định là min-heap. So sánh bằng Integer.compare, đừng trừ hai số.
        PriorityQueue<Map.Entry<Integer, Integer>> heap =
                new PriorityQueue<>((a, b) -> Integer.compare(a.getValue(), b.getValue()));
        for (Map.Entry<Integer, Integer> e : count.entrySet()) {
            heap.offer(e);
            if (heap.size() > k) heap.poll(); // O(log k)
        }
        int[] out = new int[heap.size()];
        for (int i = out.length - 1; i >= 0; i--) out[i] = heap.poll().getKey();
        return out;
    }

    static int[] topKBuckets(int[] nums, int k) {
        Map<Integer, Integer> count = new HashMap<>();
        for (int x : nums) count.merge(x, 1, Integer::sum);
        List<List<Integer>> buckets = new ArrayList<>();
        for (int i = 0; i <= nums.length; i++) buckets.add(new ArrayList<>());
        count.forEach((v, f) -> buckets.get(f).add(v));
        int[] out = new int[k];
        int n = 0;
        for (int f = nums.length; f > 0 && n < k; f--)
            for (int v : buckets.get(f)) {
                if (n == k) break;
                out[n++] = v;
            }
        return out;
    }

    public static void main(String[] args) {
        int[][] inputs = {{1, 1, 1, 2, 2, 3}, {1}, {4, 4, 4, 4, -1, -1, -1, 2, 2, 7}};
        int[] ks = {2, 1, 3};
        for (int i = 0; i < inputs.length; i++)
            System.out.println(Arrays.toString(inputs[i]) + " " + ks[i] + " → heap " + Arrays.toString(topKHeap(inputs[i], ks[i]))
                    + " | bucket " + Arrays.toString(topKBuckets(inputs[i], ks[i])));

        // Bẫy so sánh bằng phép trừ: tràn số làm đảo chiều.
        int a = Integer.MIN_VALUE, b = 1;
        System.out.println("so sánh MIN_VALUE với 1 bằng phép trừ: " + (a - b) + " (dương, tức 'lớn hơn': sai)"
                + " | Integer.compare: " + Integer.compare(a, b));
    }
}
