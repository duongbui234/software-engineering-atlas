// LeetCode 4, Median of Two Sorted Arrays: bốn cách, ba bản sai, test và đối chiếu ngẫu nhiên.
// Chạy: java median-two-arrays.java
import java.util.*;

class MedianTwoArrays {
    // Cách 1, trộn rồi lấy giữa: O(m + n) thời gian và bộ nhớ.
    static double mergeThenPick(int[] a, int[] b) {
        int[] all = new int[a.length + b.length];
        int i = 0, j = 0, k = 0;
        while (i < a.length || j < b.length) {
            if (j == b.length || (i < a.length && a[i] <= b[j])) all[k++] = a[i++];
            else all[k++] = b[j++];
        }
        int t = all.length;
        return t % 2 == 1 ? all[t / 2] : (all[t / 2 - 1] + all[t / 2]) / 2.0;
    }

    // Cách 2, hai con trỏ: đi tới phần tử giữa, chỉ nhớ hai giá trị gần nhất.
    static double twoPointer(int[] a, int[] b) {
        int t = a.length + b.length, i = 0, j = 0, prev = 0, cur = 0;
        for (int k = 0; k <= t / 2; k++) {
            prev = cur;
            if (j == b.length || (i < a.length && a[i] <= b[j])) cur = a[i++];
            else cur = b[j++];
        }
        return t % 2 == 1 ? cur : (prev + cur) / 2.0;
    }

    // Cách 3, loại bỏ để tìm phần tử thứ k (k đếm từ 1).
    static int kth(int[] a, int[] b, int k) {
        int i = 0, j = 0;
        while (true) {
            if (i == a.length) return b[j + k - 1];
            if (j == b.length) return a[i + k - 1];
            if (k == 1) return Math.min(a[i], b[j]);
            int h = k / 2;
            int ni = Math.min(i + h, a.length) - 1, nj = Math.min(j + h, b.length) - 1;
            if (a[ni] <= b[nj]) { k -= ni - i + 1; i = ni + 1; }
            else { k -= nj - j + 1; j = nj + 1; }
        }
    }

    static double kthElimination(int[] a, int[] b) {
        int t = a.length + b.length;
        return t % 2 == 1 ? kth(a, b, t / 2 + 1) : (kth(a, b, t / 2) + kth(a, b, t / 2 + 1)) / 2.0;
    }

    // Cách 4, chia đôi vị trí cắt trên mảng ngắn hơn. Integer.MIN_VALUE/MAX_VALUE làm phần tử canh:
    // chỉ dùng để so sánh; với tổng chẵn, hai số được cộng luôn là phần tử thật.
    static double partition(int[] a, int[] b) {
        if (a.length > b.length) { int[] tmp = a; a = b; b = tmp; }
        int m = a.length, n = b.length, half = (m + n + 1) / 2, lo = 0, hi = m;
        while (lo <= hi) {
            int i = (lo + hi) >>> 1, j = half - i;
            int aL = i > 0 ? a[i - 1] : Integer.MIN_VALUE, aR = i < m ? a[i] : Integer.MAX_VALUE;
            int bL = j > 0 ? b[j - 1] : Integer.MIN_VALUE, bR = j < n ? b[j] : Integer.MAX_VALUE;
            if (aL <= bR && bL <= aR) {
                if ((m + n) % 2 == 1) return Math.max(aL, bL);
                return ((long) Math.max(aL, bL) + Math.min(aR, bR)) / 2.0; // cộng trong long: không tràn dù giá trị gần 2³¹
            }
            if (aL > bR) hi = i - 1;
            else lo = i + 1;
        }
        throw new IllegalArgumentException("mảng chưa sắp xếp");
    }

    // SAI: không đổi chỗ, chia đôi trên mảng dài hơn: j = half − i âm và b[j] ném ArrayIndexOutOfBoundsException.
    static double partitionNoSwap(int[] a, int[] b) {
        int m = a.length, n = b.length, half = (m + n + 1) / 2, lo = 0, hi = m;
        while (lo <= hi) {
            int i = (lo + hi) >>> 1, j = half - i;
            int aL = i > 0 ? a[i - 1] : Integer.MIN_VALUE, aR = i < m ? a[i] : Integer.MAX_VALUE;
            int bL = j > 0 ? b[j - 1] : Integer.MIN_VALUE, bR = j < n ? b[j] : Integer.MAX_VALUE;
            if (aL <= bR && bL <= aR) {
                if ((m + n) % 2 == 1) return Math.max(aL, bL);
                return ((long) Math.max(aL, bL) + Math.min(aR, bR)) / 2.0;
            }
            if (aL > bR) hi = i - 1;
            else lo = i + 1;
        }
        throw new IllegalArgumentException("không tìm được vị trí cắt");
    }

    // SAI: (x + y) / 2 với hai int là phép chia nguyên, mất phần .5 trước khi đổi sang double.
    static double wrongIntDivision(int[] a, int[] b) {
        int[] all = mergeAll(a, b);
        int t = all.length;
        return t % 2 == 1 ? all[t / 2] : (all[t / 2 - 1] + all[t / 2]) / 2;
    }

    static int[] mergeAll(int[] a, int[] b) {
        int[] all = Arrays.copyOf(a, a.length + b.length);
        System.arraycopy(b, 0, all, a.length, b.length);
        Arrays.sort(all);
        return all;
    }

    static double bruteForce(int[] a, int[] b) {
        int[] all = mergeAll(a, b);
        int t = all.length;
        return t % 2 == 1 ? all[t / 2] : (all[t / 2 - 1] + all[t / 2]) / 2.0;
    }

    interface Fn { double apply(int[] a, int[] b); }
    record Named(String name, Fn fn) {}

    static String run(Fn fn, int[] a, int[] b) {
        try { return String.valueOf(fn.apply(a, b)); }
        catch (RuntimeException e) { return e.getClass().getSimpleName(); }
    }

    public static void main(String[] args) {
        Object[][] cases = {
            {new int[]{1, 3}, new int[]{2}, 2.0}, {new int[]{1, 2}, new int[]{3, 4}, 2.5}, {new int[]{}, new int[]{1}, 1.0},
            {new int[]{2}, new int[]{}, 2.0}, {new int[]{}, new int[]{2, 3}, 2.5}, {new int[]{-5, -3, -1}, new int[]{-4, -2}, -3.0},
            {new int[]{1, 1, 1}, new int[]{1, 1}, 1.0}, {new int[]{1, 2, 3, 4, 5}, new int[]{6, 7, 8, 9, 10, 11}, 6.0},
            {new int[]{1, 2, 3, 4, 5, 6}, new int[]{7}, 4.0}, {new int[]{-2, -1}, new int[]{3}, -1.0},
        };
        List<Named> fns = List.of(new Named("mergeThenPick", MedianTwoArrays::mergeThenPick), new Named("twoPointer", MedianTwoArrays::twoPointer),
            new Named("kthElimination", MedianTwoArrays::kthElimination), new Named("partition", MedianTwoArrays::partition),
            new Named("partitionNoSwap", MedianTwoArrays::partitionNoSwap), new Named("wrongIntDivision", MedianTwoArrays::wrongIntDivision));
        for (Named f : fns) {
            int ok = 0;
            StringBuilder bad = new StringBuilder();
            for (Object[] c : cases) {
                String got = run(f.fn(), (int[]) c[0], (int[]) c[1]);
                if (got.equals(String.valueOf(c[2]))) ok++;
                else bad.append(bad.length() == 0 ? "; sai ở " : ", ").append(Arrays.toString((int[]) c[0])).append(" ").append(Arrays.toString((int[]) c[1])).append(" → ").append(got);
            }
            System.out.printf("%-16s %d/%d ca đúng%s%n", f.name(), ok, cases.length, bad);
        }

        // Đối chiếu ngẫu nhiên với cách ngây thơ: nối, sort, lấy giữa.
        Random r = new Random(42);
        int pairs = 100_000;
        int[] wrong = new int[fns.size()];
        for (int p = 0; p < pairs; p++) {
            int[] a = r.ints(r.nextInt(21), -50, 51).sorted().toArray();
            int[] b = r.ints(r.nextInt(21), -50, 51).sorted().toArray();
            if (a.length + b.length == 0) a = new int[]{0};
            String want = String.valueOf(bruteForce(a, b));
            for (int k = 0; k < fns.size(); k++) if (!run(fns.get(k).fn(), a, b).equals(want)) wrong[k]++;
        }
        System.out.printf("%nĐối chiếu với nối rồi sort, %d cặp ngẫu nhiên:%n", pairs);
        for (int k = 0; k < fns.size(); k++) System.out.printf("%-16s sai %d cặp%n", fns.get(k).name(), wrong[k]);

        // Tràn khi cộng hai int lớn trước khi chia: dù chia cho 2.0, phép cộng vẫn làm trong int.
        int x = 2_000_000_000, y = 2_000_000_000;
        System.out.printf("%n(x + y) / 2.0 = %s, ((long) x + y) / 2.0 = %s%n", (x + y) / 2.0, ((long) x + y) / 2.0);
    }
}
