import java.util.HashMap;
import java.util.Map;

class Segments {
    static boolean search(String s, String[] words, int i, Map<Integer, Boolean> cache) {
        if (i == s.length()) return true;
        if (cache != null) {
            Boolean saved = cache.get(i);
            if (saved != null) return saved;
        }
        boolean found = false;
        for (String word : words) {
            if (s.startsWith(word, i) && search(s, words, i + word.length(), cache)) {
                found = true;
                break;
            }
        }
        if (cache != null) cache.put(i, found);
        return found;
    }

    static boolean wordBreakDp(String s, String[] words) {
        boolean[] reachable = new boolean[s.length() + 1];
        reachable[0] = true;
        for (int i = 0; i < s.length(); i++) {
            if (!reachable[i]) continue;
            for (String word : words) {
                if (s.startsWith(word, i)) reachable[i + word.length()] = true;
            }
        }
        return reachable[s.length()];
    }

    record Case(String s, String[] words, boolean expected) {}

    public static void main(String[] args) {
        String maxWord = "abcdefghijklmnopqrst";
        Case[] cases = {
            new Case("cabin", new String[]{"cab", "ca", "bin"}, true),
            new Case("cabin", new String[]{"cab", "bin"}, false),
            new Case("cabin", new String[]{"c", "ca", "bin"}, true),
            new Case("mintminttea", new String[]{"mint", "tea"}, true),
            new Case("teas", new String[]{"teashop", "tea", "s"}, true),
            new Case("s", new String[]{"ss"}, false),
            new Case("bot", new String[]{"bot"}, true),
            new Case("ababab", new String[]{"ab", "aba"}, true),
            new Case("a".repeat(18) + "b", new String[]{"a", "aa"}, false),
            new Case(maxWord.repeat(15), new String[]{maxWord}, true),
            new Case("a".repeat(299) + "b", new String[]{"a", "aa"}, false),
        };
        for (Case c : cases) {
            if (wordBreakDp(c.s, c.words) != c.expected ||
                search(c.s, c.words, 0, new HashMap<>()) != c.expected ||
                (c.s.length() <= 20 && search(c.s, c.words, 0, null) != c.expected)) {
                throw new AssertionError("ca kiểm tra sai");
            }
        }
        System.out.printf("%d/%d ca đúng%n", cases.length, cases.length);
    }
}
