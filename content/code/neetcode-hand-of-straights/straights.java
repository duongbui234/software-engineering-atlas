// Hand of Straights (LeetCode 846, trùng với 1296): trọng tài thử mọi nhóm, lá nhỏ nhất theo từng lá, theo từng giá trị, hàng nhóm đang mở
// Chạy: java straights.java
import java.util.*;

public class straights {
    static long steps = 0;

    static Map<Integer, Integer> countOf(int[] hand) {
        Map<Integer, Integer> count = new HashMap<>();
        for (int x : hand) count.merge(x, 1, Integer::sum);
        return count;
    }

    // Trọng tài: lấy một lá còn lại bất kỳ (không nhất thiết nhỏ nhất), thử mọi nhóm k lá liên tiếp chứa nó
    static boolean isStraightBrute(int[] hand, int k) {
        return goFrom(hand, k, countOf(hand), 0);
    }

    static boolean goFrom(int[] hand, int k, Map<Integer, Integer> count, int idx) {
        while (idx < hand.length && count.get(hand[idx]) == 0) idx++;
        if (idx == hand.length) return true; // mọi lá đã vào nhóm
        int x = hand[idx];
        for (int s = x - k + 1; s <= x; s++) {
            boolean ok = true;
            for (int v = s; v < s + k; v++) {
                if (count.getOrDefault(v, 0) == 0) {
                    ok = false;
                    break;
                }
            }
            if (!ok) continue;
            for (int v = s; v < s + k; v++) count.merge(v, -1, Integer::sum);
            if (goFrom(hand, k, count, idx)) return true;
            for (int v = s; v < s + k; v++) count.merge(v, 1, Integer::sum);
        }
        return false;
    }

    // Cách 1, theo từng lá: duyệt lá đã sắp xếp, lá nào còn thì nó là lá nhỏ nhất còn lại và phải mở nhóm x..x+k-1
    static boolean isNStraightHand(int[] hand, int k) {
        if (hand.length % k != 0) return false; // dừng sớm: không chia đều được
        Map<Integer, Integer> count = countOf(hand);
        int[] sorted = hand.clone(); // sắp bản sao, không đụng vào mảng của người gọi
        Arrays.sort(sorted);
        for (int x : sorted) {
            if (count.get(x) == 0) continue; // lá này đã nằm trong một nhóm trước
            for (int v = x; v < x + k; v++) {
                steps++;
                int c = count.getOrDefault(v, 0); // get(v) trả null khi thiếu, unbox ra int sẽ ném NPE
                if (c == 0) return false; // thiếu lá v để nối nhóm
                count.put(v, c - 1);
            }
        }
        return true;
    }

    // Cách 2, theo từng giá trị: c lá x cùng mở c nhóm, trừ c khỏi x..x+k-1 trong một lần
    static boolean isNStraightByValue(int[] hand, int k) {
        if (hand.length % k != 0) return false;
        TreeMap<Integer, Integer> count = new TreeMap<>(countOf(hand)); // khóa đã sắp, chỉ các giá trị khác nhau
        for (int x : new ArrayList<>(count.keySet())) {
            int c = count.get(x);
            if (c == 0) continue;
            for (int v = x; v < x + k; v++) {
                steps++;
                int have = count.getOrDefault(v, 0);
                if (have < c) return false; // không đủ lá v cho c nhóm
                count.put(v, have - c);
            }
        }
        return true;
    }

    // Cách 3, hàng nhóm đang mở: nhớ số nhóm mở ở mỗi giá trị, nhóm mở từ k giá trị trước thì đóng
    static boolean isNStraightOpen(int[] hand, int k) {
        if (hand.length % k != 0) return false;
        TreeMap<Integer, Integer> count = new TreeMap<>(countOf(hand));
        ArrayDeque<Integer> started = new ArrayDeque<>(); // số nhóm mới mở tại từng giá trị, theo thứ tự
        int open = 0; // số nhóm đang chờ lá kế tiếp
        int prev = 0;
        for (Map.Entry<Integer, Integer> e : count.entrySet()) {
            int x = e.getKey(), c = e.getValue();
            if (open > 0 && x != prev + 1) return false; // nhóm đang mở cần prev+1 mà không có
            if (c < open) return false; // không đủ lá x để nối mọi nhóm đang mở
            started.addLast(c - open); // phần dư mở nhóm mới tại x
            open = c;
            if (started.size() == k) open -= started.pollFirst(); // nhóm mở từ x-k+1 vừa đủ k lá
            prev = x;
        }
        return open == 0;
    }

    // Bản sai: bỏ bước sắp xếp, mở nhóm tại lá theo thứ tự đề cho
    static boolean isNStraightNoSort(int[] hand, int k) {
        if (hand.length % k != 0) return false;
        Map<Integer, Integer> count = countOf(hand);
        for (int x : hand) {
            if (count.get(x) == 0) continue;
            for (int v = x; v < x + k; v++) {
                int c = count.getOrDefault(v, 0);
                if (c == 0) return false;
                count.put(v, c - 1);
            }
        }
        return true;
    }

    public static void main(String[] args) {
        Object[][] cases = {
            {new int[] {5, 1, 3, 2, 4, 6}, 3, true},
            {new int[] {1, 1, 2, 2, 3, 3}, 3, true},
            {new int[] {3, 2, 2, 1, 4, 3}, 3, true},
            {new int[] {1, 2, 4, 5, 6, 7}, 3, false},
            {new int[] {7, 8, 9, 10}, 3, false},
            {new int[] {4}, 1, true},
            {new int[] {3, 3, 4, 4, 5, 6}, 3, false},
            {new int[] {12, 10, 11, 13, 11, 12}, 3, true},
            {new int[] {1000000000, 999999998, 999999999}, 3, true},
            {new int[] {0, 1, 2, 3}, 2, true},
        };
        int ok = 0;
        for (Object[] c : cases) {
            int[] hand = (int[]) c[0];
            int k = (int) c[1];
            boolean want = (boolean) c[2];
            boolean[] got = {isStraightBrute(hand, k), isNStraightHand(hand, k), isNStraightByValue(hand, k), isNStraightOpen(hand, k)};
            boolean all = true;
            for (boolean g : got) if (g != want) all = false;
            if (all) ok++;
            else System.out.println("sai ở " + Arrays.toString(hand) + " " + k + " " + Arrays.toString(got));
        }
        System.out.println(ok + "/" + cases.length + " ca đúng");

        // Đối chiếu: mọi tay bài với giá trị 0..4, mỗi giá trị 0..3 lá, k = 1..5; lá xếp tăng rồi xoay nửa sau lên trước
        int total = 0, good = 0, wrong = 0;
        for (int mask = 1; mask < 1024; mask++) {
            List<Integer> sorted = new ArrayList<>();
            int m = mask;
            for (int v = 0; v < 5; v++) {
                for (int r = 0; r < m % 4; r++) sorted.add(v);
                m /= 4;
            }
            int len = sorted.size(), half = len / 2;
            int[] hand = new int[len];
            for (int i = 0; i < len; i++) hand[i] = sorted.get((i + half) % len);
            for (int k = 1; k <= 5; k++) {
                total++;
                boolean want = isStraightBrute(hand, k);
                if (isNStraightHand(hand, k) == want && isNStraightByValue(hand, k) == want && isNStraightOpen(hand, k) == want) good++;
                if (isNStraightNoSort(hand, k) != want) wrong++;
            }
        }
        System.out.println(good + "/" + total + " ca đúng (đối chiếu trọng tài)");
        System.out.println("Bỏ sắp xếp: sai " + wrong + "/" + total + " ca");

        // Đo: n = 200000 lá, 1000 giá trị mỗi giá trị 200 lá, xáo bằng (i * 7919) % 1000, k = 10
        int n = 200000;
        int[] big = new int[n];
        for (int i = 0; i < n; i++) big[i] = (int) ((long) i * 7919 % 1000);
        int kBig = 10;
        steps = 0;
        long t0 = System.nanoTime();
        boolean a = isNStraightHand(big, kBig);
        double cardMs = (System.nanoTime() - t0) / 1e6;
        long cardSteps = steps;
        steps = 0;
        t0 = System.nanoTime();
        boolean b = isNStraightByValue(big, kBig);
        double valueMs = (System.nanoTime() - t0) / 1e6;
        System.out.printf("n = %d, k = %d, kết quả %b/%b: theo từng lá %d bước (%.1f ms), theo từng giá trị %d bước (%.1f ms)%n", n, kBig, a, b, cardSteps, cardMs, steps, valueMs);
    }
}
