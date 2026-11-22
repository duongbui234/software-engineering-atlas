// NC-04 Group Anagrams (LeetCode 49), Java 21.
// Chạy: java GroupAnagrams.java
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class GroupAnagrams {
    static List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> groups = new HashMap<>();
        for (String s : strs) {
            char[] count = new char[26]; // char là số 16 bit: đủ đếm tới 65 535
            for (int i = 0; i < s.length(); i++) count[s.charAt(i) - 'a']++;
            String key = new String(count); // 26 "ký tự" là 26 con số: không mơ hồ, không cần dấu phân cách
            groups.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
        }
        return new ArrayList<>(groups.values());
    }

    static List<List<String>> groupAnagramsSorted(String[] strs) {
        Map<String, List<String>> groups = new HashMap<>();
        for (String s : strs) {
            char[] c = s.toCharArray();
            Arrays.sort(c);
            groups.computeIfAbsent(String.valueOf(c), k -> new ArrayList<>()).add(s);
        }
        return new ArrayList<>(groups.values());
    }

    public static void main(String[] args) {
        String[] inp = {"eat", "tea", "tan", "ate", "nat", "bat"};
        System.out.println(groupAnagrams(inp));
        System.out.println(groupAnagramsSorted(inp));
        // Mảng làm khóa HashMap: equals/hashCode của mảng theo danh tính, nên hai bảng đếm giống nhau vẫn là hai khóa.
        Map<int[], String> bad = new HashMap<>();
        bad.put(new int[] {1, 2}, "x");
        System.out.println("int[] làm khóa: get(new int[]{1, 2}) = " + bad.get(new int[] {1, 2}));
    }
}
