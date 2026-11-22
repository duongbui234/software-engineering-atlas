// NC-02 Valid Anagram (LeetCode 242), Java 21.
// Chạy: java valid-anagram.java
import java.text.Normalizer;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

class ValidAnagram { // không public: tên file không cần trùng tên class
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

    // char của Java là một code unit UTF-16, giống JS. Sắp xếp char[] làm vỡ emoji.
    static boolean isAnagramSorted(String s, String t) {
        char[] a = s.toCharArray(), b = t.toCharArray();
        Arrays.sort(a);
        Arrays.sort(b);
        return Arrays.equals(a, b);
    }

    // Unicode: đếm theo code point sau khi chuẩn hóa NFC.
    static boolean isAnagramUnicode(String s, String t) {
        Map<Integer, Integer> count = new HashMap<>();
        Normalizer.normalize(s, Normalizer.Form.NFC).codePoints().forEach(cp -> count.merge(cp, 1, Integer::sum));
        for (int cp : Normalizer.normalize(t, Normalizer.Form.NFC).codePoints().toArray()) {
            Integer c = count.get(cp);
            if (c == null || c == 0) return false;
            count.put(cp, c - 1);
        }
        return count.values().stream().allMatch(c -> c == 0);
    }

    public static void main(String[] args) {
        System.out.println(isAnagram("anagram", "nagaram") + " " + isAnagram("rat", "car")); // true false
        String a = "😀🌃", b = new String(Character.toChars(0x1F703)) + new String(Character.toChars(0x1F200));
        System.out.println("emoji, sắp xếp char[]: " + isAnagramSorted(a, b) + " (sai) | theo code point: " + isAnagramUnicode(a, b));
        System.out.println("café vs éfac: " + isAnagramSorted("café", "éfac") + " | NFC: " + isAnagramUnicode("café", "éfac"));
    }
}
