// Jump Game (LeetCode 55): quay lui, ghi nhớ, bảng DP, tham lam xuôi và tham lam ngược
// Chạy: java reach.java
import java.util.*;
import java.util.function.Predicate;

public class reach {
    static long calls = 0;
    static long steps = 0;

    // Quay lui: từ ô i thử mọi bước 1..nums[i], bước dài trước
    static boolean canJumpBacktrack(int[] nums) {
        return backtrack(nums, 0);
    }

    static boolean backtrack(int[] nums, int i) {
        calls++;
        int last = nums.length - 1;
        if (i == last) return true;
        for (int step = Math.min(nums[i], last - i); step >= 1; step--) {
            if (backtrack(nums, i + step)) return true;
        }
        return false;
    }

    // Ghi nhớ từ trên xuống: memo[i] là 0 chưa biết, 1 tới đích được, 2 kẹt
    static boolean canJumpMemo(int[] nums) {
        return memo(nums, 0, new byte[nums.length]);
    }

    static boolean memo(int[] nums, int i, byte[] memo) {
        calls++;
        int last = nums.length - 1;
        if (i == last) return true;
        if (memo[i] != 0) return memo[i] == 1;
        for (int step = Math.min(nums[i], last - i); step >= 1; step--) {
            if (memo(nums, i + step, memo)) {
                memo[i] = 1;
                return true;
            }
        }
        memo[i] = 2;
        return false;
    }

    // Bảng DP từ dưới lên: good[i] đúng khi từ i nhảy tới được một ô good bên phải
    static boolean canJumpTable(int[] nums) {
        int n = nums.length;
        boolean[] good = new boolean[n];
        good[n - 1] = true;
        for (int i = n - 2; i >= 0; i--) {
            int end = Math.min(i + nums[i], n - 1);
            for (int j = i + 1; j <= end; j++) {
                steps++;
                if (good[j]) {
                    good[i] = true;
                    break;
                }
            }
        }
        return good[0];
    }

    // Tham lam xuôi: các ô tới được luôn là một khúc liền 0..farthest
    static boolean canJump(int[] nums) {
        int farthest = 0;
        for (int i = 0; i < nums.length; i++) {
            steps++;
            if (i > farthest) return false; // ô i nằm ngoài khúc tới được: kẹt
            farthest = Math.max(farthest, i + nums[i]);
            if (farthest >= nums.length - 1) return true;
        }
        return true;
    }

    // Tham lam ngược: dời đích về ô trái nhất đã biết là tới đích được
    static boolean canJumpGoal(int[] nums) {
        int goal = nums.length - 1;
        for (int i = nums.length - 2; i >= 0; i--) {
            if (i + nums[i] >= goal) goal = i; // từ i nhảy tới goal, nên i thành đích mới
        }
        return goal == 0;
    }

    // Bản sai 1: quên kiểm tra i > farthest, cứ cộng tiếp cả những ô không tới được
    static boolean canJumpNoGuard(int[] nums) {
        int farthest = 0;
        for (int i = 0; i < nums.length; i++) {
            farthest = Math.max(farthest, i + nums[i]);
        }
        return farthest >= nums.length - 1;
    }

    // Bản sai 2: mỗi lượt nhảy bước dài nhất từ ô đang đứng
    static boolean canJumpLongestHop(int[] nums) {
        int i = 0;
        while (i < nums.length - 1) {
            if (nums[i] == 0) return false;
            i += nums[i];
        }
        return true;
    }

    // Trọng tài độc lập: lan tập ô tới được cho tới khi không đổi nữa
    static boolean referee(int[] nums) {
        boolean[] reach = new boolean[nums.length];
        reach[0] = true;
        boolean changed = true;
        while (changed) {
            changed = false;
            for (int i = 0; i < nums.length; i++) {
                if (!reach[i]) continue;
                for (int j = i + 1; j <= i + nums[i] && j < nums.length; j++) {
                    if (!reach[j]) {
                        reach[j] = true;
                        changed = true;
                    }
                }
            }
        }
        return reach[nums.length - 1];
    }

    static final List<Predicate<int[]>> CORRECT = List.of(
        reach::canJumpBacktrack, reach::canJumpMemo, reach::canJumpTable, reach::canJump, reach::canJumpGoal);

    static boolean allCorrect(int[] nums, boolean want) {
        for (Predicate<int[]> f : CORRECT) if (f.test(nums) != want) return false;
        return true;
    }

    // Mảng tệ nhất cho bảng DP: mọi ô đều nhảy đúng tới ô số 0 ở vị trí n - 2
    static int[] worstCase(int n) {
        int[] a = new int[n];
        for (int i = 0; i < n - 1; i++) a[i] = n - 2 - i;
        a[n - 1] = 0;
        return a;
    }

    static int total = 0, good = 0;

    static void build(int[] arr) {
        if (arr.length > 0) {
            total++;
            if (allCorrect(arr, referee(arr))) good++;
        }
        if (arr.length == 6) return;
        for (int v = 0; v <= 3; v++) {
            int[] next = Arrays.copyOf(arr, arr.length + 1);
            next[arr.length] = v;
            build(next);
        }
    }

    record Case(int[] nums, boolean want) {}

    public static void main(String[] args) {
        List<Case> cases = List.of(
            new Case(new int[] {0}, true),
            new Case(new int[] {1, 0}, true),
            new Case(new int[] {0, 1}, false),
            new Case(new int[] {2, 0, 0}, true),
            new Case(new int[] {1, 0, 1}, false),
            new Case(new int[] {2, 3, 0, 0, 1}, true),
            new Case(new int[] {5, 0, 0, 0, 0, 0}, true),
            new Case(new int[] {1, 2, 0, 1, 0, 3}, false),
            new Case(new int[] {2, 0, 2, 0, 1, 0}, true),
            new Case(new int[] {4, 0, 0, 0, 0, 1}, false),
            new Case(worstCase(10), false));
        int ok = 0;
        for (Case c : cases) {
            if (allCorrect(c.nums(), c.want()) && referee(c.nums()) == c.want()) ok++;
            else System.out.println("sai ở " + Arrays.toString(c.nums()));
        }
        System.out.println(ok + "/" + cases.size() + " ca đúng");

        // Đối chiếu: mọi mảng dài 1–6, mỗi phần tử từ 0 đến 3
        build(new int[0]);
        System.out.println(good + "/" + total + " ca đúng (đối chiếu trọng tài lan tập)");

        int noGuard = 0, longest = 0;
        for (Case c : cases) {
            if (canJumpNoGuard(c.nums()) == c.want()) noGuard++;
            if (canJumpLongestHop(c.nums()) == c.want()) longest++;
        }
        System.out.println("Bản quên kiểm tra i > farthest: " + noGuard + "/" + cases.size() + " ca đúng");
        System.out.println("Bản nhảy bước dài nhất: " + longest + "/" + cases.size() + " ca đúng");

        int[] small = worstCase(20);
        calls = 0;
        canJumpBacktrack(small);
        long bt = calls;
        calls = 0;
        canJumpMemo(small);
        System.out.println("n = 20, mảng tệ nhất: quay lui " + bt + " lượt gọi, ghi nhớ " + calls + " lượt gọi");

        int[] big = worstCase(10000);
        steps = 0;
        canJumpTable(big);
        long tableSteps = steps;
        steps = 0;
        canJump(big);
        System.out.println("n = 10000, mảng tệ nhất: bảng DP " + tableSteps + " bước, tham lam " + steps + " bước");

        long t = System.nanoTime();
        canJumpTable(big);
        double tableMs = (System.nanoTime() - t) / 1e6;
        t = System.nanoTime();
        for (int k = 0; k < 100; k++) canJump(big);
        double greedyMs = (System.nanoTime() - t) / 1e6 / 100;
        System.out.printf(Locale.ROOT, "Thời gian n = 10000: bảng DP %.1f ms, tham lam %.3f ms%n", tableMs, greedyMs);
    }
}
