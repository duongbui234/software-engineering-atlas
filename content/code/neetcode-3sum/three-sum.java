// LeetCode 15, 3Sum: ba cách và test.
// Chạy: java three-sum.java
import java.util.*;

class ThreeSum {
    static List<List<Integer>> bruteForce(int[] nums) {
        Set<List<Integer>> found = new LinkedHashSet<>(); // List.equals so theo nội dung, nên Set lọc trùng được
        for (int i = 0; i < nums.length; i++)
            for (int j = i + 1; j < nums.length; j++)
                for (int k = j + 1; k < nums.length; k++)
                    if (nums[i] + nums[j] + nums[k] == 0) {
                        int[] t = {nums[i], nums[j], nums[k]};
                        Arrays.sort(t);
                        found.add(List.of(t[0], t[1], t[2]));
                    }
        return new ArrayList<>(found);
    }

    static List<List<Integer>> hashPerAnchor(int[] nums) {
        Set<List<Integer>> found = new LinkedHashSet<>();
        for (int i = 0; i < nums.length; i++) {
            Set<Integer> met = new HashSet<>();
            for (int j = i + 1; j < nums.length; j++) {
                int need = -nums[i] - nums[j];
                if (met.contains(need)) {
                    int[] t = {nums[i], nums[j], need};
                    Arrays.sort(t);
                    found.add(List.of(t[0], t[1], t[2]));
                }
                met.add(nums[j]);
            }
        }
        return new ArrayList<>(found);
    }

    static List<List<Integer>> sortTwoPointers(int[] nums) {
        int[] a = nums.clone();
        Arrays.sort(a);
        List<List<Integer>> out = new ArrayList<>();
        for (int i = 0; i < a.length - 2; i++) {
            if (a[i] > 0) break;
            if (i > 0 && a[i] == a[i - 1]) continue; // int nguyên thủy: == so giá trị
            int lo = i + 1, hi = a.length - 1;
            while (lo < hi) {
                int s = a[i] + a[lo] + a[hi];
                if (s < 0) lo++;
                else if (s > 0) hi--;
                else {
                    out.add(List.of(a[i], a[lo], a[hi]));
                    lo++; hi--;
                    while (lo < hi && a[lo] == a[lo - 1]) lo++;
                }
            }
        }
        return out;
    }

    static List<List<Integer>> norm(List<List<Integer>> r) {
        List<List<Integer>> out = new ArrayList<>();
        for (List<Integer> t : r) { List<Integer> c = new ArrayList<>(t); Collections.sort(c); out.add(c); }
        out.sort(Comparator.comparing((List<Integer> t) -> t.get(0)).thenComparing(t -> t.get(1)).thenComparing(t -> t.get(2)));
        return out;
    }

    public static void main(String[] args) {
        int[][] in = {{-1, 0, 1, 2, -1, -4}, {0, 1, 1}, {0, 0, 0}, {0, 0, 0, 0}, {-2, 0, 1, 1, 2},
            {-4, -2, -2, -2, 0, 1, 2, 2, 2, 3, 3, 4, 4, 6, 6}, {-10, 5, 5, -1, 11, -1}};
        List<List<List<Integer>>> want = List.of(List.of(List.of(-1, -1, 2), List.of(-1, 0, 1)), List.of(), List.of(List.of(0, 0, 0)),
            List.of(List.of(0, 0, 0)), List.of(List.of(-2, 0, 2), List.of(-2, 1, 1)),
            List.of(List.of(-4, -2, 6), List.of(-4, 0, 4), List.of(-4, 1, 3), List.of(-4, 2, 2), List.of(-2, -2, 4), List.of(-2, 0, 2)),
            List.of(List.of(-10, -1, 11), List.of(-10, 5, 5)));
        for (String name : new String[] {"bruteForce", "hashPerAnchor", "sortTwoPointers"}) {
            int ok = 0;
            for (int k = 0; k < in.length; k++) {
                var got = switch (name) {
                    case "bruteForce" -> bruteForce(in[k]);
                    case "hashPerAnchor" -> hashPerAnchor(in[k]);
                    default -> sortTwoPointers(in[k]);
                };
                if (norm(got).equals(norm(want.get(k)))) ok++;
            }
            System.out.printf("%-16s %d/%d ca đúng%n", name, ok, in.length);
        }
    }
}
