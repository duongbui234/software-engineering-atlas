// LC 287 Find the Duplicate Number bằng Java: HashSet, tìm nhị phân trên giá trị, đếm bit, rùa và thỏ (Floyd), và bẫy Arrays.sort sửa mảng gốc.
// Chạy: java find-duplicate.java
import java.util.*;
import java.util.function.ToIntFunction;

class FindDuplicate {
    // HashSet các số đã gặp: mỗi số được đóng hộp thành Integer, O(n) bộ nhớ.
    static int hashSet(int[] nums) {
        Set<Integer> seen = new HashSet<>();
        for (int x : nums) {
            if (!seen.add(x)) return x;
        }
        return -1;
    }

    // Tìm nhị phân trên giá trị: số trùng là m nhỏ nhất có cnt(m) = số phần tử ≤ m lớn hơn m.
    static int binaryCount(int[] nums) {
        int lo = 1, hi = nums.length - 1;
        while (lo < hi) {
            int mid = (lo + hi) >>> 1;
            int cnt = 0;
            for (int x : nums) if (x <= mid) cnt++;
            if (cnt > mid) hi = mid; else lo = mid + 1;
        }
        return lo;
    }

    // Đếm bit: bit b của số trùng bật khi nums có nhiều số bật bit b hơn dãy 1..n.
    static int bitCount(int[] nums) {
        int n = nums.length - 1, ans = 0;
        for (int b = 0; (1 << b) <= n; b++) {
            int mask = 1 << b, inNums = 0, inRange = 0;
            for (int x : nums) if ((x & mask) != 0) inNums++;
            for (int v = 1; v <= n; v++) if ((v & mask) != 0) inRange++;
            if (inNums > inRange) ans |= mask;
        }
        return ans;
    }

    // Rùa và thỏ trên đồ thị i → nums[i], xuất phát từ chỉ số 0.
    static int floyd(int[] nums) {
        int slow = 0, fast = 0;
        do {
            slow = nums[slow];
            fast = nums[nums[fast]];
        } while (slow != fast);
        int a = 0;
        while (a != slow) {
            a = nums[a];
            slow = nums[slow];
        }
        return a;
    }

    // BẪY: Arrays.sort sắp tại chỗ; mảng là tham chiếu nên người gọi thấy mảng đã bị đổi.
    static int sortInPlace(int[] nums) {
        Arrays.sort(nums);
        for (int i = 1; i < nums.length; i++) if (nums[i] == nums[i - 1]) return nums[i];
        return -1;
    }

    static int[] makeInput(int n, Random r) {
        int[] perm = new int[n];
        for (int i = 0; i < n; i++) perm[i] = i + 1;
        for (int i = n - 1; i > 0; i--) { int j = r.nextInt(i + 1); int t = perm[i]; perm[i] = perm[j]; perm[j] = t; }
        int[] nums = new int[n + 1];
        nums[0] = perm[0];
        System.arraycopy(perm, 0, nums, 1, n);
        for (int i = n; i > 0; i--) { int j = r.nextInt(i + 1); int t = nums[i]; nums[i] = nums[j]; nums[j] = t; }
        return nums;
    }

    static double median(Runnable fn, int reps) {
        double[] ts = new double[reps];
        for (int i = 0; i < reps; i++) { long t0 = System.nanoTime(); fn.run(); ts[i] = (System.nanoTime() - t0) / 1e6; }
        Arrays.sort(ts);
        return ts[reps / 2];
    }

    public static void main(String[] args) {
        int[][] cases = {{1, 3, 4, 2, 2}, {3, 1, 3, 4, 2}, {3, 3, 3, 3, 3}, {1, 1}, {1, 1, 2}, {2, 2, 2, 2, 2},
            {2, 5, 9, 6, 9, 3, 8, 9, 7, 1}, {1, 4, 4, 2, 4}, {2, 1, 2}, {4, 3, 1, 4, 2}};
        int[] want = {2, 3, 3, 1, 1, 2, 9, 4, 2, 4};
        Map<String, ToIntFunction<int[]>> solvers = new LinkedHashMap<>();
        solvers.put("hashSet", FindDuplicate::hashSet);
        solvers.put("binaryCount", FindDuplicate::binaryCount);
        solvers.put("bitCount", FindDuplicate::bitCount);
        solvers.put("floyd", FindDuplicate::floyd);
        solvers.put("sortInPlace", FindDuplicate::sortInPlace);
        for (var e : solvers.entrySet()) {
            int ok = 0;
            for (int i = 0; i < cases.length; i++) if (e.getValue().applyAsInt(cases[i].clone()) == want[i]) ok++;
            System.out.printf("%-12s %d/%d ca đúng%n", e.getKey(), ok, cases.length);
        }

        int[] nums = {3, 1, 3, 4, 2};
        int got = sortInPlace(nums);
        System.out.printf("%nsortInPlace([3, 1, 3, 4, 2]) = %d; mảng của người gọi giờ là %s%n", got, Arrays.toString(nums));

        Random r = new Random(287);
        Map<String, Integer> bad = new LinkedHashMap<>();
        for (int t = 0; t < 2000; t++) {
            int n = 1 + r.nextInt(2000);
            int[] a = makeInput(n, r);
            int d = hashSet(a); // đáp án tham chiếu
            for (var e : solvers.entrySet()) {
                if (e.getKey().equals("sortInPlace")) continue;
                if (e.getValue().applyAsInt(a.clone()) != d) bad.merge(e.getKey(), 1, Integer::sum);
            }
        }
        System.out.printf("ngẫu nhiên 2000 mảng: số mảng sai: binaryCount %d, bitCount %d, floyd %d (so với hashSet)%n",
            bad.getOrDefault("binaryCount", 0), bad.getOrDefault("bitCount", 0), bad.getOrDefault("floyd", 0));

        System.out.println("\nn            hashSet  binaryCount  bitCount    floyd   (ms, trung vị 5 lần)");
        for (int n : new int[]{100_000, 1_000_000}) {
            int[] a = makeInput(n, r);
            System.out.printf("%-10d %9.2f %12.2f %9.2f %8.2f%n", n,
                median(() -> hashSet(a), 5), median(() -> binaryCount(a), 5), median(() -> bitCount(a), 5), median(() -> floyd(a), 5));
        }
    }
}
