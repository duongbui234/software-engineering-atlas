// LeetCode 1046, Last Stone Weight: PriorityQueue làm max-heap, và hàm so sánh (a, b) -> b - a tràn số.
// Chạy: java last-stone.java
import java.util.*;
import java.util.function.Function;

class LastStone {
    // PriorityQueue là min-heap; truyền Collections.reverseOrder() để đỉnh là phần tử lớn nhất.
    static int lastStoneWeight(int[] stones) {
        PriorityQueue<Integer> pq = new PriorityQueue<>(Collections.reverseOrder());
        for (int s : stones) pq.add(s);
        while (pq.size() > 1) {
            int y = pq.poll(), x = pq.poll(); // poll() trả Integer, tự mở hộp thành int
            if (y > x) pq.add(y - x);
        }
        return pq.isEmpty() ? 0 : pq.peek();
    }

    // Hàm so sánh bằng phép trừ: đúng ở bài này vì cân nặng dương, nhưng tràn khi giá trị trái dấu và lớn.
    static int subtractComparator(int[] stones) {
        PriorityQueue<Integer> pq = new PriorityQueue<>((a, b) -> b - a);
        for (int s : stones) pq.add(s);
        while (pq.size() > 1) {
            int y = pq.poll(), x = pq.poll();
            if (y > x) pq.add(y - x);
        }
        return pq.isEmpty() ? 0 : pq.peek();
    }

    // Đếm theo cân nặng (<= 1000).
    static int counting(int[] stones) {
        int[] cnt = new int[1001];
        for (int s : stones) cnt[s]++;
        int i = 1000;
        while (true) {
            while (i > 0 && cnt[i] == 0) i--;
            if (i == 0) return 0;
            cnt[i] %= 2;
            if (cnt[i] == 0) continue;
            int j = i - 1;
            while (j > 0 && cnt[j] == 0) j--;
            if (j == 0) return i;
            cnt[i] = 0; cnt[j]--; cnt[i - j]++;
            i = Math.max(j, i - j);
        }
    }

    static List<Integer> drain(PriorityQueue<Integer> pq) {
        List<Integer> out = new ArrayList<>();
        while (!pq.isEmpty()) out.add(pq.poll());
        return out;
    }

    public static void main(String[] args) {
        int[][] cs = {{2, 7, 4, 1, 8, 1}, {1}, {2, 2}, {3, 3, 3}, {10, 4, 2, 10}, {10, 2, 9}, {1000, 1}, {7, 6, 7, 6, 9}, {31, 26, 33, 21, 40}};
        int[] want = {1, 1, 0, 3, 2, 1, 999, 3, 9};
        Map<String, Function<int[], Integer>> fns = new LinkedHashMap<>();
        fns.put("lastStoneWeight", LastStone::lastStoneWeight);
        fns.put("subtractComparator", LastStone::subtractComparator);
        fns.put("counting", LastStone::counting);
        for (var e : fns.entrySet()) {
            int ok = 0;
            for (int i = 0; i < cs.length; i++) if (e.getValue().apply(cs[i]) == want[i]) ok++;
            System.out.printf("%-18s %d/%d ca đúng%n", e.getKey(), ok, cs.length);
        }

        // Ngoài đề: giá trị âm lớn. b - a tràn và đảo chiều so sánh.
        int[] vals = {1, Integer.MIN_VALUE, 5};
        PriorityQueue<Integer> bad = new PriorityQueue<>((a, b) -> b - a);
        PriorityQueue<Integer> good = new PriorityQueue<>((a, b) -> Integer.compare(b, a));
        for (int v : vals) { bad.add(v); good.add(v); }
        System.out.println("\nb - a:                lấy ra " + drain(bad));
        System.out.println("Integer.compare(b, a): lấy ra " + drain(good));
        System.out.println("vì Integer.MIN_VALUE - 1 = " + (Integer.MIN_VALUE - 1));
    }
}
