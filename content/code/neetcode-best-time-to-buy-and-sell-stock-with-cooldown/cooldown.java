// LeetCode 309: mua bán cổ phiếu, bán xong phải nghỉ một ngày
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class cooldown {
    static final int NEG = -1_000_000_000; // trạng thái chưa thể xảy ra
    static long calls = 0;

    // Vét cạn trên (ngày, đang cầm cổ phiếu hay không)
    static int maxProfitBrute(int[] prices) {
        return brute(prices, 0, false);
    }

    static int brute(int[] prices, int day, boolean holding) {
        calls++;
        if (day >= prices.length) return 0;
        int wait = brute(prices, day + 1, holding);
        if (holding) return Math.max(wait, prices[day] + brute(prices, day + 2, false)); // bán, nhảy qua ngày nghỉ
        return Math.max(wait, -prices[day] + brute(prices, day + 1, true)); // mua
    }

    // Ghi nhớ: chỉ có 2n cặp (ngày, đang cầm); Integer null nghĩa là chưa tính
    static int maxProfitMemo(int[] prices) {
        Integer[][] memo = new Integer[2][prices.length];
        return memo(prices, 0, 0, memo);
    }

    static int memo(int[] prices, int day, int holding, Integer[][] memo) {
        calls++;
        if (day >= prices.length) return 0;
        if (memo[holding][day] != null) return memo[holding][day];
        int wait = memo(prices, day + 1, holding, memo);
        int act = holding == 1 ? prices[day] + memo(prices, day + 2, 0, memo)
                               : -prices[day] + memo(prices, day + 1, 1, memo);
        return memo[holding][day] = Math.max(wait, act);
    }

    // Bảng ba trạng thái theo ngày: cầm, vừa bán, tay không
    static int maxProfitTable(int[] prices) {
        int n = prices.length;
        int[] hold = new int[n], sold = new int[n], rest = new int[n];
        hold[0] = -prices[0];
        sold[0] = NEG;
        for (int i = 1; i < n; i++) {
            hold[i] = Math.max(hold[i - 1], rest[i - 1] - prices[i]);
            sold[i] = hold[i - 1] + prices[i];
            rest[i] = Math.max(rest[i - 1], sold[i - 1]);
        }
        return Math.max(sold[n - 1], rest[n - 1]);
    }

    // Ba biến cuộn: mỗi ngày chỉ đọc giá trị của hôm trước
    static int maxProfit(int[] prices) {
        int hold = -prices[0], sold = NEG, rest = 0;
        for (int i = 1; i < prices.length; i++) {
            int prevSold = sold;
            sold = hold + prices[i];
            hold = Math.max(hold, rest - prices[i]);
            rest = Math.max(rest, prevSold);
        }
        return Math.max(sold, rest);
    }

    // Đối chiếu độc lập: liệt kê mọi tập giao dịch (mua b, bán s), lần mua sau từ s + 2
    static int bestByTrades(int[] prices, int start) {
        int best = 0;
        for (int b = start; b < prices.length; b++)
            for (int s = b + 1; s < prices.length; s++)
                best = Math.max(best, prices[s] - prices[b] + bestByTrades(prices, s + 2));
        return best;
    }

    static boolean allEqual(List<Integer> results, int expected) {
        for (int r : results) if (r != expected) return false;
        return true;
    }

    // Bản ghi nhớ đệ quy sâu tới 5000 tầng, vượt ngăn xếp mặc định của luồng main
    public static void main(String[] args) throws InterruptedException {
        Thread worker = new Thread(null, cooldown::run, "kiem-tra", 64L << 20);
        worker.start();
        worker.join();
    }

    static void run() {
        int[] zigzag = new int[5000], ramps = new int[5000];
        for (int i = 0; i < 5000; i++) {
            zigzag[i] = i % 2 == 0 ? 1 : 3;
            ramps[i] = i % 1000;
        }
        Object[][] cases = {
            {new int[]{7}, 0},
            {new int[]{4, 2}, 0},
            {new int[]{2, 9}, 7},
            {new int[]{2, 6, 1, 7}, 6},
            {new int[]{1, 3, 1, 5}, 4},
            {new int[]{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}, 9},
            {new int[]{9, 8, 7, 6, 5}, 0},
            {new int[]{1, 3, 1, 3, 1, 3, 1, 3}, 4},
            {new int[]{3, 3, 3, 3}, 0},
            {new int[]{6, 1, 6, 1, 6, 0, 9}, 14},
            {new int[]{4, 1, 2, 8, 0, 5, 6}, 8},
            {zigzag, 2500},
            {ramps, 4991},
        };
        int ok = 0;
        for (Object[] c : cases) {
            int[] prices = (int[]) c[0];
            int expected = (int) c[1];
            List<Integer> results = new ArrayList<>(List.of(maxProfit(prices), maxProfitTable(prices), maxProfitMemo(prices)));
            if (prices.length <= 16) results.add(maxProfitBrute(prices));
            if (prices.length <= 10) results.add(bestByTrades(prices, 0));
            if (allEqual(results, expected)) ok++;
        }
        System.out.println(ok + "/" + cases.length + " ca đúng");

        int exhaustiveOk = 0, total = 0;
        List<int[]> arrays = new ArrayList<>();
        arrays.add(new int[0]);
        for (int k = 0; k < arrays.size(); k++) {
            if (arrays.get(k).length == 6) continue;
            for (int v = 0; v <= 3; v++) {
                int[] prices = Arrays.copyOf(arrays.get(k), arrays.get(k).length + 1);
                prices[prices.length - 1] = v;
                arrays.add(prices);
                total++;
                List<Integer> results = List.of(maxProfitBrute(prices), maxProfitMemo(prices), maxProfitTable(prices), maxProfit(prices));
                if (allEqual(results, bestByTrades(prices, 0))) exhaustiveOk++;
            }
        }
        System.out.println(exhaustiveOk + "/" + total + " ca đúng (đối chiếu liệt kê giao dịch)");

        int[] sample = {3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8, 9, 7, 9, 3, 2, 3, 8, 4};
        calls = 0;
        maxProfitBrute(sample);
        long bruteCalls = calls;
        calls = 0;
        maxProfitMemo(sample);
        System.out.println("20 ngày: vét cạn " + bruteCalls + " lượt gọi, memo " + calls + " lượt gọi");
    }
}
