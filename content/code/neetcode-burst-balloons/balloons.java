// Burst Balloons (LeetCode 312): bốn cách, từ vét cạn tới bảng theo độ dài khoảng.
import java.util.*;

public class balloons {
    static long calls;

    // Vét cạn: thử mọi thứ tự nổ, mỗi lần bỏ một quả khỏi mảng còn lại
    static int burstBrute(List<Integer> arr) {
        calls++;
        int best = 0;
        for (int i = 0; i < arr.size(); i++) {
            int left = i > 0 ? arr.get(i - 1) : 1;
            int right = i + 1 < arr.size() ? arr.get(i + 1) : 1;
            List<Integer> rest = new ArrayList<>(arr);
            rest.remove(i);
            best = Math.max(best, left * arr.get(i) * right + burstBrute(rest));
        }
        return best;
    }

    static int[] pad(int[] nums) {
        int[] p = new int[nums.length + 2];
        p[0] = 1;
        p[p.length - 1] = 1;
        System.arraycopy(nums, 0, p, 1, nums.length);
        return p;
    }

    // Cách SAI: chọn quả nổ ĐẦU TIÊN rồi giải hai bên như hai bài độc lập.
    // Sau khi k nổ, hai bên kề nhau, nên hàng xóm thật không còn là p[k-1], p[k+1].
    static int burstFirstSplitWrong(int[] nums) {
        int[] p = pad(nums);
        Integer[][] memo = new Integer[p.length][p.length];
        return firstSplit(p, memo, 1, nums.length);
    }

    static int firstSplit(int[] p, Integer[][] memo, int l, int r) {
        if (l > r) return 0;
        if (memo[l][r] != null) return memo[l][r];
        int best = 0;
        for (int k = l; k <= r; k++) {
            best = Math.max(best, p[k - 1] * p[k] * p[k + 1] + firstSplit(p, memo, l, k - 1) + firstSplit(p, memo, k + 1, r));
        }
        memo[l][r] = best;
        return best;
    }

    // Ghi nhớ: solve(l, r) = điểm lớn nhất khi nổ hết các quả nằm GIỮA l và r (không gồm l, r).
    // Chọn k là quả nổ CUỐI CÙNG trong khoảng: lúc đó hàng xóm của k chính là p[l] và p[r].
    static int burstMemo(int[] nums) {
        int[] p = pad(nums);
        int[][] memo = new int[p.length][p.length];
        for (int[] row : memo) Arrays.fill(row, -1);
        return solve(p, memo, 0, p.length - 1);
    }

    static int solve(int[] p, int[][] memo, int l, int r) {
        calls++;
        if (l + 1 >= r) return 0;
        if (memo[l][r] != -1) return memo[l][r];
        int best = 0;
        for (int k = l + 1; k < r; k++) {
            best = Math.max(best, p[l] * p[k] * p[r] + solve(p, memo, l, k) + solve(p, memo, k, r));
        }
        memo[l][r] = best;
        return best;
    }

    // Bảng: điền theo độ dài khoảng tăng dần, khoảng ngắn luôn có trước khoảng dài
    static int maxCoins(int[] nums) {
        int[] p = pad(nums);
        int n = p.length;
        int[][] dp = new int[n][n];
        for (int len = 2; len < n; len++) {
            for (int l = 0; l + len < n; l++) {
                int r = l + len;
                int best = 0;
                for (int k = l + 1; k < r; k++) {
                    best = Math.max(best, p[l] * p[k] * p[r] + dp[l][k] + dp[k][r]);
                }
                dp[l][r] = best;
            }
        }
        return dp[0][n - 1];
    }

    static List<Integer> list(int[] a) {
        List<Integer> out = new ArrayList<>();
        for (int v : a) out.add(v);
        return out;
    }

    static int[] repeat(int v, int n) {
        int[] a = new int[n];
        Arrays.fill(a, v);
        return a;
    }

    public static void main(String[] args) {
        int[] mixed = new int[300];
        for (int i = 0; i < 300; i++) mixed[i] = (i * 37 + 11) % 101;
        Object[][] cases = {
            {new int[]{7}, 7},
            {new int[]{2, 3}, 9},
            {new int[]{0, 0, 0}, 0},
            {new int[]{4, 0, 4}, 20},
            {new int[]{2, 9, 4}, 84},
            {new int[]{5, 1, 1, 5}, 60},
            {new int[]{9, 1, 8, 2, 7}, 760},
            {new int[]{1, 2, 3, 4, 5, 6}, 252},
            {repeat(1, 300), 300},
            {repeat(100, 300), 298010100},
            {mixed, 116330212},
        };
        int ok = 0;
        for (Object[] c : cases) {
            int[] nums = (int[]) c[0];
            int expected = (int) c[1];
            boolean good = maxCoins(nums) == expected && burstMemo(nums) == expected;
            if (nums.length <= 6 && burstBrute(list(nums)) != expected) good = false;
            if (good) ok++;
        }
        System.out.println(ok + "/" + cases.length + " ca đúng");

        List<int[]> arrays = new ArrayList<>();
        arrays.add(new int[0]);
        for (int k = 0; k < arrays.size(); k++) {
            int[] base = arrays.get(k);
            if (base.length < 5) {
                for (int v = 0; v <= 3; v++) {
                    int[] next = Arrays.copyOf(base, base.length + 1);
                    next[base.length] = v;
                    arrays.add(next);
                }
            }
        }
        int exhaustiveOk = 0, total = 0;
        for (int[] nums : arrays.subList(1, arrays.size())) {
            total++;
            int expected = burstBrute(list(nums));
            if (maxCoins(nums) == expected && burstMemo(nums) == expected) exhaustiveOk++;
        }
        System.out.println(exhaustiveOk + "/" + total + " ca đúng (đối chiếu mọi thứ tự nổ)");

        System.out.println("Chia theo quả nổ đầu tiên với [2,3]: " + burstFirstSplitWrong(new int[]{2, 3}) + ", đúng là " + maxCoins(new int[]{2, 3}));
        int[] eight = {3, 1, 4, 1, 5, 9, 2, 6};
        calls = 0;
        burstBrute(list(eight));
        long bruteCalls = calls;
        calls = 0;
        burstMemo(eight);
        System.out.println("8 quả: vét cạn " + bruteCalls + " lượt gọi, memo " + calls + " lượt gọi");
    }
}
