// Ga ARR-02, khóa chuẩn và đếm tần suất: biến mỗi phần tử thành một KHÓA, rồi đếm hoặc gom theo khóa đó.
// Chạy: java counting-keys.java   (Java 21, không cần javac)
import java.util.*;

class CountingKeys {
    // 242
    static boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;
        int[] count = new int[26];
        for (int i = 0; i < s.length(); i++) {
            count[s.charAt(i) - 'a']++;
            count[t.charAt(i) - 'a']--;
        }
        for (int c : count) if (c != 0) return false;
        return true;
    }

    // 49: int[] KHÔNG làm khóa HashMap được (equals/hashCode theo địa chỉ); dùng Arrays.toString làm khóa chuỗi.
    static List<List<String>> groupAnagrams(String[] words) {
        Map<String, List<String>> groups = new LinkedHashMap<>();
        for (String w : words) {
            int[] count = new int[26];
            for (char ch : w.toCharArray()) count[ch - 'a']++;
            groups.computeIfAbsent(Arrays.toString(count), k -> new ArrayList<>()).add(w);
        }
        return new ArrayList<>(groups.values());
    }

    // 347: bucket sort theo số lần xuất hiện.
    static int[] topKFrequent(int[] nums, int k) {
        Map<Integer, Integer> freq = new HashMap<>();
        for (int x : nums) freq.merge(x, 1, Integer::sum);
        List<List<Integer>> buckets = new ArrayList<>();
        for (int i = 0; i <= nums.length; i++) buckets.add(new ArrayList<>());
        freq.forEach((x, c) -> buckets.get(c).add(x));
        int[] out = new int[k];
        int n = 0;
        for (int c = nums.length; c > 0 && n < k; c--)
            for (int x : buckets.get(c)) if (n < k) out[n++] = x;
        return out;
    }

    // 36: record tự có equals/hashCode theo giá trị các trường, nên làm khóa được.
    record Key(char kind, int index, char digit) {}

    static boolean isValidSudoku(char[][] board) {
        Set<Key> seen = new HashSet<>();
        for (int r = 0; r < 9; r++)
            for (int c = 0; c < 9; c++) {
                char d = board[r][c];
                if (d == '.') continue;
                if (!seen.add(new Key('r', r, d)) || !seen.add(new Key('c', c, d)) || !seen.add(new Key('b', r / 3 * 3 + c / 3, d)))
                    return false;
            }
        return true;
    }

    static List<String> norm(List<List<String>> g) {
        List<String> out = new ArrayList<>();
        for (List<String> x : g) {
            List<String> y = new ArrayList<>(x);
            Collections.sort(y);
            out.add(String.join(" ", y));
        }
        Collections.sort(out);
        return out;
    }

    public static void main(String[] args) {
        String[] rows = {"53..7....", "6..195...", ".98....6.", "8...6...3", "4..8.3..1", "7...2...6", ".6....28.", "...419..5", "....8..79"};
        char[][] board = new char[9][], broken = new char[9][];
        for (int i = 0; i < 9; i++) { board[i] = rows[i].toCharArray(); broken[i] = rows[i].toCharArray(); }
        broken[0][0] = '8';
        Object[][] cases = {
            {"isAnagram anagram/nagaram", isAnagram("anagram", "nagaram"), true},
            {"isAnagram rat/car", isAnagram("rat", "car"), false},
            {"isAnagram aacc/ccac", isAnagram("aacc", "ccac"), false},
            {"groupAnagrams eat…bat", norm(groupAnagrams(new String[] {"eat", "tea", "tan", "ate", "nat", "bat"})), List.of("ate eat tea", "bat", "nat tan")},
            {"groupAnagrams [\"\"]", groupAnagrams(new String[] {""}), List.of(List.of(""))},
            {"topKFrequent [1,1,1,2,2,3] 2", Arrays.toString(topKFrequent(new int[] {1, 1, 1, 2, 2, 3}, 2)), "[1, 2]"},
            {"topKFrequent [1] 1", Arrays.toString(topKFrequent(new int[] {1}, 1)), "[1]"},
            {"isValidSudoku ví dụ 1", isValidSudoku(board), true},
            {"isValidSudoku 8 ở góc", isValidSudoku(broken), false},
        };
        int ok = 0;
        for (Object[] c : cases) {
            if (Objects.equals(c[1], c[2])) ok++;
            else System.out.println("SAI " + c[0] + " " + c[1] + " " + c[2]);
        }
        System.out.println(ok + "/" + cases.length + " ca đúng");
    }
}
