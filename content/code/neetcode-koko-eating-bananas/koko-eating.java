// LeetCode 875, Koko Eating Bananas: tìm nhị phân trên đáp án, tổng giờ int hay long, và hai lỗi số học của Java.
// Chạy: java koko-eating.java
import java.util.*;

class KokoEating {
    // Tổng giờ để trong long: n tới 10⁴ đống, mỗi đống tới 10⁹, nên ở tốc độ 1 tổng tới 10¹³, vượt int.
    static long hoursNeeded(int[] piles, int k) {
        long hours = 0;
        for (int p : piles) hours += (p + k - 1) / k; // p + k - 1 <= 2·10⁹ - 1, vẫn vừa int
        return hours;
    }

    static int minEatingSpeed(int[] piles, int h) {
        int lo = 1, hi = Arrays.stream(piles).max().getAsInt();
        while (lo < hi) { // bất biến: hi luôn kịp, mọi tốc độ < lo đều trễ
            int mid = lo + (hi - lo) / 2;
            if (hoursNeeded(piles, mid) <= h) hi = mid;
            else lo = mid + 1;
        }
        return lo;
    }

    // Cùng thuật toán nhưng cộng giờ vào int. Với lo = 1 và hi = max(piles), mid không bao giờ nhỏ hơn
    // nửa đáp án, nên tổng giờ <= 2h + n và không tràn. Đúng, nhưng chỉ nhờ một lập luận dễ gãy.
    static int sumInInt(int[] piles, int h) {
        int lo = 1, hi = Arrays.stream(piles).max().getAsInt();
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2, hours = 0;
            for (int p : piles) hours += (p + mid - 1) / mid;
            if (hours <= h) hi = mid;
            else lo = mid + 1;
        }
        return lo;
    }

    // SAI: thử từ tốc độ 1 và cộng vào int. Tổng ở k = 1 tràn thành số âm, nên k = 1 "kịp".
    static int linearInt(int[] piles, int h) {
        for (int k = 1; ; k++) {
            int hours = 0;
            for (int p : piles) hours += (p + k - 1) / k;
            if (hours <= h) return k;
        }
    }

    // SAI: hi = Integer.MAX_VALUE cho "chắc ăn" rồi tính (lo + hi) / 2: tổng tràn, mid âm.
    static int hugeHi(int[] piles, int h) {
        int lo = 1, hi = Integer.MAX_VALUE;
        while (lo < hi) {
            int mid = (lo + hi) / 2;
            if (hoursNeeded(piles, mid) <= h) hi = mid;
            else lo = mid + 1;
        }
        return lo;
    }

    // SAI: lo = 0. Khi khoảng còn [0, 1], mid = 0 và (p + 0 - 1) / 0 ném ArithmeticException.
    static int loFromZero(int[] piles, int h) {
        int lo = 0, hi = Arrays.stream(piles).max().getAsInt();
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (hoursNeeded(piles, mid) <= h) hi = mid;
            else lo = mid + 1;
        }
        return lo;
    }

    interface Fn { int apply(int[] piles, int h); }

    public static void main(String[] args) {
        int[][] piles = {{3, 6, 7, 11}, {30, 11, 23, 4, 20}, {30, 11, 23, 4, 20}, {1}, {1, 1}, {1000000000}, {312884470},
            {805306368, 805306368, 805306368}, {2, 2}, {7}};
        int[] hs = {8, 5, 6, 1, 5, 2, 312884469, 1000000000, 2, 3};
        int[] want = {4, 30, 23, 1, 1, 500000000, 2, 3, 2, 3};
        Map<String, Fn> fns = new LinkedHashMap<>();
        fns.put("minEatingSpeed", KokoEating::minEatingSpeed);
        fns.put("sumInInt", KokoEating::sumInInt);
        fns.put("hugeHi", KokoEating::hugeHi);
        fns.put("loFromZero", KokoEating::loFromZero);
        for (var e : fns.entrySet()) {
            List<String> bad = new ArrayList<>();
            for (int i = 0; i < hs.length; i++) {
                String got;
                try { got = String.valueOf(e.getValue().apply(piles[i], hs[i])); }
                catch (ArithmeticException ex) { got = "ArithmeticException"; }
                if (!got.equals(String.valueOf(want[i]))) bad.add(Arrays.toString(piles[i]) + " h=" + hs[i] + " → " + got);
            }
            System.out.printf("%-15s %d/%d ca đúng%s%n", e.getKey(), hs.length - bad.size(), hs.length,
                bad.isEmpty() ? "" : "; sai ở " + String.join(", ", bad));
        }

        int[] big = {805306368, 805306368, 805306368};
        System.out.printf("%n[805306368 ×3], h = 10⁹: linearInt trả %d (đúng là %d)%n", linearInt(big, 1000000000), minEatingSpeed(big, 1000000000));
        System.out.printf("(1 + Integer.MAX_VALUE) / 2 = %d%n", (1 + Integer.MAX_VALUE) / 2);

        // Kiểm ngẫu nhiên: tổng int so với tổng long trên 10⁵ bộ sát giới hạn của đề.
        Random rnd = new Random(7);
        int diff = 0;
        for (int t = 0; t < 100_000; t++) {
            int n = 1 + rnd.nextInt(50);
            int[] p = new int[n];
            for (int i = 0; i < n; i++) p[i] = 1 + rnd.nextInt(1_000_000_000);
            int h = n + rnd.nextInt(1_000_000_000 - n + 1);
            if (sumInInt(p, h) != minEatingSpeed(p, h)) diff++;
        }
        System.out.printf("ngẫu nhiên: tổng int lệch tổng long ở %d/100000 bộ%n", diff);
    }
}
