// LeetCode 853, Car Fleet: các cách giải, bẫy tràn int khi nhân chéo, và test.
// Chạy: java car-fleet.java
import java.util.*;

class CarFleet {
    static Integer[] byPositionDesc(int[] position) {
        Integer[] idx = new Integer[position.length]; // Arrays.sort với Comparator cần mảng object, không nhận int[]
        for (int i = 0; i < idx.length; i++) idx[i] = i;
        Arrays.sort(idx, (a, b) -> Integer.compare(position[b], position[a]));
        return idx;
    }

    static int sortStack(int target, int[] position, int[] speed) {
        Deque<Double> stack = new ArrayDeque<>();
        for (int i : byPositionDesc(position)) {
            double t = (double) (target - position[i]) / speed[i]; // ép kiểu TRƯỚC khi chia, không thì chia nguyên
            if (stack.isEmpty() || t > stack.peek()) stack.push(t);
        }
        return stack.size();
    }

    static int sortCrossMultiply(int target, int[] position, int[] speed) {
        int fleets = 0;
        long leadD = 0, leadS = 1;
        for (int i : byPositionDesc(position)) {
            long d = target - position[i];
            if (fleets == 0 || d * leadS > leadD * speed[i]) { fleets++; leadD = d; leadS = speed[i]; } // long: 10¹² vừa
        }
        return fleets;
    }

    // SAI: nhân chéo bằng int. 10⁶ · 999 999 vượt 2³¹ − 1 ≈ 2,1·10⁹ và quay vòng lặng lẽ.
    static int crossMultiplyInt(int target, int[] position, int[] speed) {
        int fleets = 0, leadD = 0, leadS = 1;
        for (int i : byPositionDesc(position)) {
            int d = target - position[i];
            if (fleets == 0 || d * leadS > leadD * speed[i]) { fleets++; leadD = d; leadS = speed[i]; }
        }
        return fleets;
    }

    public static void main(String[] args) {
        Object[][] cases = {
            {12, new int[] {10, 8, 0, 5, 3}, new int[] {2, 4, 1, 1, 3}, 3}, {10, new int[] {3}, new int[] {3}, 1},
            {100, new int[] {0, 2, 4}, new int[] {4, 2, 1}, 1}, {10, new int[] {6, 8}, new int[] {3, 2}, 2},
            {10, new int[] {0, 4, 2}, new int[] {2, 1, 3}, 1}, {4, new int[] {3, 1}, new int[] {3, 9}, 1},
            {20, new int[] {6, 2, 17}, new int[] {3, 9, 2}, 2},
            {1_000_000, new int[] {500_000, 0}, new int[] {999_999, 1_000_000}, 2}, // xe sau tới lúc 1, xe trước lúc ≈ 0,5
        };
        for (String name : new String[] {"sortStack", "sortCrossMultiply", "crossMultiplyInt"}) {
            int ok = 0;
            List<String> bad = new ArrayList<>();
            for (Object[] c : cases) {
                int t = (int) c[0];
                int[] p = (int[]) c[1], s = (int[]) c[2];
                int got = switch (name) {
                    case "sortStack" -> sortStack(t, p, s);
                    case "sortCrossMultiply" -> sortCrossMultiply(t, p, s);
                    default -> crossMultiplyInt(t, p, s);
                };
                if (got == (int) c[3]) ok++; else bad.add("t=" + t + " " + Arrays.toString(p) + " → " + got);
            }
            System.out.printf("%-18s %d/%d ca đúng%s%n", name, ok, cases.length, bad.isEmpty() ? "" : "; sai ở " + String.join(" ", bad));
        }
        System.out.println("1_000_000 * 999_999 trong int = " + (1_000_000 * 999_999));
    }
}
