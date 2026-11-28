// Gas Station (LeetCode 134): vét cạn từ mọi trạm, tham lam một lượt, tổng tiền tố nhỏ nhất
// Chạy: java circuit.java
import java.util.*;

public class circuit {
    static long steps = 0; // long: n = 10^5 cho vét cạn khoảng 5·10^9 bước, tràn int

    // Vét cạn: thử xuất phát ở từng trạm, chạy trọn vòng hoặc tới khi bình âm
    static int canCompleteBrute(int[] gas, int[] cost) {
        int n = gas.length;
        for (int s = 0; s < n; s++) {
            int tank = 0;
            boolean ok = true;
            for (int k = 0; k < n; k++) {
                int j = (s + k) % n;
                tank += gas[j] - cost[j];
                steps++;
                if (tank < 0) {
                    ok = false; // hụt xăng trên đoạn j -> j+1
                    break;
                }
            }
            if (ok) return s;
        }
        return -1;
    }

    // Cách chính: một lượt, bình âm ở i thì bỏ mọi trạm từ start tới i, đặt start = i + 1
    static int canCompleteCircuit(int[] gas, int[] cost) {
        int total = 0; // tổng gas - cost của cả vòng
        int tank = 0; // xăng còn lại tính từ start
        int start = 0;
        for (int i = 0; i < gas.length; i++) {
            int d = gas[i] - cost[i];
            total += d;
            tank += d;
            steps++;
            if (tank < 0) {
                start = i + 1; // không trạm nào trong [start, i] đi qua được i
                tank = 0;
            }
        }
        return total < 0 ? -1 : start; // tổng không âm thì start chắc chắn đi trọn vòng
    }

    // Tổng tiền tố: xuất phát ngay sau chỗ tổng tiền tố thấp nhất (lần đầu đạt mức thấp nhất)
    static int canCompletePrefix(int[] gas, int[] cost) {
        int prefix = 0;
        int lowest = 0; // tiền tố rỗng (trước trạm 0) bằng 0
        int lowestAt = -1;
        for (int i = 0; i < gas.length; i++) {
            prefix += gas[i] - cost[i];
            if (prefix < lowest) {
                lowest = prefix;
                lowestAt = i;
            }
        }
        return prefix < 0 ? -1 : lowestAt + 1;
    }

    // Bản sai: quên kiểm tra tổng, luôn trả start cuối cùng
    static int canCompleteNoTotal(int[] gas, int[] cost) {
        int tank = 0;
        int start = 0;
        for (int i = 0; i < gas.length; i++) {
            tank += gas[i] - cost[i];
            if (tank < 0) {
                start = i + 1;
                tank = 0;
            }
        }
        return start;
    }

    // Mô phỏng một điểm xuất phát, dùng để xác nhận đáp án
    static boolean completes(int[] gas, int[] cost, int s) {
        int n = gas.length;
        if (s < 0 || s >= n) return false;
        int tank = 0;
        for (int k = 0; k < n; k++) {
            int j = (s + k) % n;
            tank += gas[j] - cost[j];
            if (tank < 0) return false;
        }
        return true;
    }

    // Đúng khi: tham lam khớp tiền tố, và trả -1 đúng lúc vét cạn trả -1, còn không thì trạm trả về đi trọn vòng
    static boolean agrees(int[] gas, int[] cost) {
        int g = canCompleteCircuit(gas, cost);
        int p = canCompletePrefix(gas, cost);
        int b = canCompleteBrute(gas, cost);
        if (g != p) return false;
        if (b == -1) return g == -1;
        return completes(gas, cost, g);
    }

    static int total = 0, good = 0, wrong = 0;

    static void build(int[] gas, int[] cost) {
        if (gas.length > 0) {
            total++;
            if (agrees(gas, cost)) good++;
            int b = canCompleteBrute(gas, cost);
            int w = canCompleteNoTotal(gas, cost);
            if (b == -1 ? w != -1 : !completes(gas, cost, w)) wrong++;
        }
        if (gas.length == 4) return;
        for (int g = 0; g <= 2; g++) {
            for (int c = 0; c <= 2; c++) {
                int[] ng = Arrays.copyOf(gas, gas.length + 1);
                int[] nc = Arrays.copyOf(cost, cost.length + 1);
                ng[gas.length] = g;
                nc[cost.length] = c;
                build(ng, nc);
            }
        }
    }

    public static void main(String[] args) {
        int[][][] cases = {
            {{5}, {5}, {0}},
            {{2}, {3}, {-1}},
            {{1, 6, 2}, {3, 1, 4}, {1}},
            {{4, 0, 5, 1, 2}, {2, 3, 1, 4, 2}, {2}},
            {{0, 0, 0, 9}, {2, 2, 2, 1}, {3}},
            {{3, 3, 3}, {3, 3, 4}, {-1}},
            {{0, 2, 0}, {1, 0, 1}, {1}},
        };
        int ok = 0;
        for (int[][] c : cases) {
            int want = c[2][0];
            int[] got = {canCompleteBrute(c[0], c[1]), canCompleteCircuit(c[0], c[1]), canCompletePrefix(c[0], c[1])};
            if (got[0] == want && got[1] == want && got[2] == want) ok++;
            else System.out.println("sai ở " + Arrays.toString(c[0]) + " " + Arrays.toString(c[1]) + " " + Arrays.toString(got));
        }
        System.out.println(ok + "/" + cases.length + " ca đúng");

        // Đối chiếu: mọi vòng 1–4 trạm với gas, cost trong {0, 1, 2}
        build(new int[0], new int[0]);
        System.out.println(good + "/" + total + " ca đúng (đối chiếu vét cạn)");
        System.out.println("Bỏ kiểm tra tổng: sai " + wrong + "/" + total + " ca");

        // Đo: n trạm, trạm n-2 tốn rất nhiều xăng, chỉ trạm cuối đi trọn vòng
        int n = 10000;
        int[] gas = new int[n];
        int[] cost = new int[n];
        Arrays.fill(gas, 1);
        cost[n - 2] = n + 1; // trạm n-2: gas 1, cost n+1, tức hụt n
        gas[n - 1] = 2;
        steps = 0;
        long t0 = System.nanoTime();
        int b = canCompleteBrute(gas, cost);
        double bruteMs = (System.nanoTime() - t0) / 1e6;
        long bs = steps;
        steps = 0;
        t0 = System.nanoTime();
        int g = canCompleteCircuit(gas, cost);
        double greedyMs = (System.nanoTime() - t0) / 1e6;
        System.out.printf("n = %d, đáp án %d/%d: vét cạn %d bước (%.1f ms), tham lam %d bước (%.2f ms)%n", n, b, g, bs, bruteMs, steps, greedyMs);
    }
}
