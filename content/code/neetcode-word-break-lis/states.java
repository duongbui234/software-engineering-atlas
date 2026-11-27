import java.util.Arrays;
import java.util.stream.IntStream;

class States {
    static boolean wordBreak(String s, String[] words) {
        boolean[] reachable = new boolean[s.length() + 1];
        reachable[0] = true;
        for (int start = 0; start < s.length(); start++) {
            if (!reachable[start]) continue;
            for (String word : words) {
                if (s.startsWith(word, start)) reachable[start + word.length()] = true;
            }
        }
        return reachable[s.length()];
    }

    static int lisLength(int[] nums) {
        int[] tails = new int[nums.length];
        int size = 0;
        for (int value : nums) {
            int lo = 0, hi = size;
            while (lo < hi) {
                int mid = lo + (hi - lo) / 2;
                if (tails[mid] < value) lo = mid + 1;
                else hi = mid;
            }
            tails[lo] = value;
            if (lo == size) size++;
        }
        return size;
    }

    public static void main(String[] args) {
        String[] prefixes = IntStream.rangeClosed(1, 20).mapToObj(i -> "a".repeat(i)).toArray(String[]::new);
        int[] duplicate = new int[2500];
        Arrays.fill(duplicate, -10000);
        boolean[] checks = {
            wordBreak("atlasroute", new String[]{"at", "atlas", "route"}),
            wordBreak("trailtrail", new String[]{"trail"}),
            !wordBreak("mapz", new String[]{"ma", "map", "ap"}),
            wordBreak("ababa", new String[]{"aba", "ab"}),
            !wordBreak("a".repeat(299) + "b", prefixes),
            wordBreak("a".repeat(300), new String[]{"a".repeat(20)}),
            wordBreak("survey", new String[]{"survey"}),
            !wordBreak("map", new String[]{"mapping"}),
            lisLength(new int[]{-5, -3, -1, 0}) == 4,
            lisLength(new int[]{10, 8, 6, 4}) == 1,
            lisLength(new int[]{7, 7, 7}) == 1,
            lisLength(new int[]{3, 5, 6, 2, 4}) == 3,
            lisLength(new int[]{4, 4, 1, 2, 2, 3}) == 3,
            lisLength(new int[]{6, 8, 2, 3, 5, 9}) == 4,
            lisLength(IntStream.range(-1250, 1250).toArray()) == 2500,
            lisLength(duplicate) == 1,
        };
        for (int i = 0; i < checks.length; i++) {
            if (!checks[i]) throw new AssertionError("Ca kiểm tra sai: " + (i + 1));
        }
        System.out.printf("%d/%d ca đúng%n", checks.length, checks.length);
    }
}
