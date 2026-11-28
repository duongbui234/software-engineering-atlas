// Merge Triplets to Form Target Triplet (LeetCode 1899): vét cạn mọi tập con, lọc bộ an toàn, max của bộ an toàn
// Chạy: java triplets.java
import java.util.*;

public class triplets {
    static long steps = 0; // long: vét cạn ở n = 27 đã cần khoảng 3,6·10^9 bước, tràn int

    // Vét cạn: thử mọi tập con khác rỗng, gộp bằng max từng thành phần, xem có ra đúng target không
    static boolean mergeTripletsBrute(int[][] triplets, int[] target) {
        int n = triplets.length;
        for (int mask = 1; mask < 1 << n; mask++) {
            int a = 0, b = 0, c = 0;
            for (int i = 0; i < n; i++) {
                steps++;
                if (((mask >> i) & 1) == 1) {
                    int[] t = triplets[i];
                    a = Math.max(a, t[0]);
                    b = Math.max(b, t[1]);
                    c = Math.max(c, t[2]);
                }
            }
            if (a == target[0] && b == target[1] && c == target[2]) return true;
        }
        return false;
    }

    // Cách chính: bỏ mọi bộ có thành phần vượt target, trong số còn lại đánh dấu thành phần nào khớp đúng
    static boolean mergeTriplets(int[][] triplets, int[] target) {
        int x = target[0], y = target[1], z = target[2];
        boolean[] found = new boolean[3];
        for (int[] t : triplets) {
            steps++;
            if (t[0] > x || t[1] > y || t[2] > z) continue; // bộ không an toàn: gộp vào là vượt, không gỡ được
            for (int k = 0; k < 3; k++) {
                if (t[k] == target[k]) found[k] = true; // bộ an toàn này mang đúng giá trị cần ở vị trí k
            }
        }
        return found[0] && found[1] && found[2];
    }

    // Cách tương đương: gộp hết mọi bộ an toàn bằng max, so với target
    static boolean mergeTripletsMax(int[][] triplets, int[] target) {
        int[] m = new int[3];
        for (int[] t : triplets) {
            if (t[0] > target[0] || t[1] > target[1] || t[2] > target[2]) continue;
            for (int k = 0; k < 3; k++) m[k] = Math.max(m[k], t[k]);
        }
        return Arrays.equals(m, target);
    }

    // Bản sai: không lọc, thấy thành phần nào bằng target là đánh dấu
    static boolean mergeTripletsNoFilter(int[][] triplets, int[] target) {
        boolean[] found = new boolean[3];
        for (int[] t : triplets) {
            for (int k = 0; k < 3; k++) if (t[k] == target[k]) found[k] = true;
        }
        return found[0] && found[1] && found[2];
    }

    static int total = 0, good = 0, wrong = 0;
    static int[][] values = new int[27][];
    static final int[] TARGET = {2, 2, 2};

    static void build(List<int[]> list) {
        if (!list.isEmpty()) {
            int[][] arr = list.toArray(new int[0][]);
            total++;
            boolean b = mergeTripletsBrute(arr, TARGET);
            if (mergeTriplets(arr, TARGET) == b && mergeTripletsMax(arr, TARGET) == b) good++;
            if (mergeTripletsNoFilter(arr, TARGET) != b) wrong++;
        }
        if (list.size() == 4) return;
        for (int[] v : values) {
            list.add(v);
            build(list);
            list.remove(list.size() - 1);
        }
    }

    public static void main(String[] args) {
        Object[][] cases = {
            {new int[][] {{1, 2, 3}}, new int[] {1, 2, 3}, true},
            {new int[][] {{2, 9, 5}, {1, 7, 1}}, new int[] {2, 7, 5}, false},
            {new int[][] {{3, 1, 1}, {1, 4, 1}, {1, 1, 6}}, new int[] {3, 4, 6}, true},
            {new int[][] {{3, 4, 6}, {5, 1, 1}}, new int[] {3, 4, 6}, true},
            {new int[][] {{1, 1, 1}, {2, 2, 2}}, new int[] {3, 3, 3}, false},
            {new int[][] {{4, 2, 1}, {1, 2, 4}, {4, 4, 4}}, new int[] {4, 2, 4}, true},
            {new int[][] {{2, 3, 4}, {2, 3, 4}}, new int[] {2, 3, 5}, false},
        };
        int ok = 0;
        for (Object[] c : cases) {
            int[][] tr = (int[][]) c[0];
            int[] tg = (int[]) c[1];
            boolean want = (Boolean) c[2];
            boolean[] got = {mergeTripletsBrute(tr, tg), mergeTriplets(tr, tg), mergeTripletsMax(tr, tg)};
            if (got[0] == want && got[1] == want && got[2] == want) ok++;
            else System.out.println("sai ở " + Arrays.deepToString(tr) + " " + Arrays.toString(tg) + " " + Arrays.toString(got));
        }
        System.out.println(ok + "/" + cases.length + " ca đúng");

        // Đối chiếu: mọi danh sách 1–4 bộ, mỗi thành phần trong {1, 2, 3}, target [2, 2, 2]
        int idx = 0;
        for (int a = 1; a <= 3; a++) for (int b = 1; b <= 3; b++) for (int c = 1; c <= 3; c++) values[idx++] = new int[] {a, b, c};
        build(new ArrayList<>());
        System.out.println(good + "/" + total + " ca đúng (đối chiếu vét cạn)");
        System.out.println("Bỏ bước lọc: sai " + wrong + "/" + total + " ca");

        // Đo 1: n = 18, mọi bộ an toàn nhưng không bộ nào có z = 1000, nên vét cạn phải thử hết 2^18 - 1 tập con
        int[][] small = new int[18][];
        for (int i = 0; i < 18; i++) small[i] = new int[] {i == 0 ? 1000 : i + 1, i == 1 ? 1000 : i + 1, i + 1};
        int[] big = {1000, 1000, 1000};
        steps = 0;
        long t0 = System.nanoTime();
        boolean rb = mergeTripletsBrute(small, big);
        double bruteMs = (System.nanoTime() - t0) / 1e6;
        long bs = steps;
        steps = 0;
        t0 = System.nanoTime();
        boolean rg = mergeTriplets(small, big);
        double greedyMs = (System.nanoTime() - t0) / 1e6;
        long gs = steps;
        System.out.printf("n = 18, đáp án %b/%b: vét cạn %d bước (%.1f ms), tham lam %d bước (%.3f ms)%n", rb, rg, bs, bruteMs, gs, greedyMs);

        // Đo 2: n = 100000 (giới hạn của đề), bộ thứ i = [(7i mod 1000) + 1, (13i mod 1000) + 1, (31i mod 1000) + 1]
        int[][] full = new int[100000][];
        for (int i = 0; i < 100000; i++) full[i] = new int[] {(7 * i) % 1000 + 1, (13 * i) % 1000 + 1, (31 * i) % 1000 + 1};
        int[] goal = {700, 800, 900};
        steps = 0;
        t0 = System.nanoTime();
        boolean rf = mergeTriplets(full, goal);
        double fullMs = (System.nanoTime() - t0) / 1e6;
        System.out.printf("n = 100000, đáp án %b: tham lam %d bước (%.2f ms)%n", rf, steps, fullMs);
    }
}
