// LeetCode 11, Container With Most Water: hai cách và test.
// Chạy: java container-most-water.java
class ContainerMostWater {
    static int bruteForce(int[] h) {
        int best = 0;
        for (int i = 0; i < h.length; i++)
            for (int j = i + 1; j < h.length; j++) best = Math.max(best, (j - i) * Math.min(h[i], h[j]));
        return best;
    }

    static int twoPointers(int[] h) {
        int i = 0, j = h.length - 1, best = 0;
        while (i < j) {
            best = Math.max(best, (j - i) * Math.min(h[i], h[j])); // tối đa 10⁵ · 10⁴ = 10⁹ < 2³¹: vừa int
            if (h[i] < h[j]) i++; else j--;
        }
        return best;
    }

    public static void main(String[] args) {
        int[][] in = {{1, 8, 6, 2, 5, 4, 8, 3, 7}, {1, 1}, {4, 3, 2, 1, 4}, {1, 2, 1}, {2, 3, 4, 5, 18, 17, 6}, {0, 0, 0}, {1, 3, 2, 5, 25, 24, 5}};
        int[] want = {49, 1, 16, 2, 17, 0, 24};
        for (String name : new String[] {"bruteForce", "twoPointers"}) {
            int ok = 0;
            for (int k = 0; k < in.length; k++) if ((name.equals("bruteForce") ? bruteForce(in[k]) : twoPointers(in[k])) == want[k]) ok++;
            System.out.printf("%-12s %d/%d ca đúng%n", name, ok, in.length);
        }
    }
}
