import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

class DictionaryExample {
    static final class LengthDictionary {
        private final Map<Integer, Set<String>> words = new HashMap<>();
        int comparisons;

        void addWord(String word) {
            words.computeIfAbsent(word.length(), length -> new HashSet<>()).add(word);
        }

        boolean search(String pattern) {
            comparisons = 0;
            for (String word : words.getOrDefault(pattern.length(), Set.of())) {
                int index = 0;
                for (; index < pattern.length(); index++) {
                    comparisons++;
                    char expected = pattern.charAt(index);
                    if (expected != '.' && expected != word.charAt(index)) break;
                }
                if (index == pattern.length()) return true;
            }
            return false;
        }
    }

    static final class TrieNode {
        final Map<Character, TrieNode> children = new HashMap<>();
        boolean terminal;
    }

    static final class WordDictionary {
        private final TrieNode root = new TrieNode();
        int visits;

        void addWord(String word) {
            TrieNode node = root;
            for (int index = 0; index < word.length(); index++) {
                node = node.children.computeIfAbsent(word.charAt(index), key -> new TrieNode());
            }
            node.terminal = true;
        }

        boolean search(String pattern) {
            visits = 0;
            return match(root, pattern, 0);
        }

        private boolean match(TrieNode node, String pattern, int index) {
            visits++;
            if (index == pattern.length()) return node.terminal;
            char expected = pattern.charAt(index);
            if (expected != '.') {
                TrieNode child = node.children.get(expected);
                return child != null && match(child, pattern, index + 1);
            }
            for (TrieNode child : node.children.values()) {
                if (match(child, pattern, index + 1)) return true;
            }
            return false;
        }
    }

    record Query(String added, String pattern, boolean expected) {}

    public static void main(String[] args) {
        Query[] queries = {
            new Query("", ".", false),
            new Query("ape ash cape caper cave dawn dusk", "ape", true),
            new Query("", "ap", false),
            new Query("", "a.h", true),
            new Query("", "a.z", false),
            new Query("", ".a.e", true),
            new Query("", "..wk", false),
            new Query("", "ca..r", true),
            new Query("", "cap.", true),
            new Query("", ".a", false),
            new Query("cap", "cap", true),
            new Query("cape", "cape", true),
        };
        LengthDictionary scan = new LengthDictionary();
        WordDictionary trie = new WordDictionary();
        for (Query query : queries) {
            if (!query.added().isEmpty()) {
                for (String word : query.added().split(" ")) {
                    scan.addWord(word);
                    trie.addWord(word);
                }
            }
            if (scan.search(query.pattern()) != query.expected() || trie.search(query.pattern()) != query.expected()) {
                throw new AssertionError(query.pattern());
            }
        }

        LengthDictionary scanProbe = new LengthDictionary();
        WordDictionary trieProbe = new WordDictionary();
        for (int value = 0; value < 1000; value++) {
            String word = new String(new char[] {
                'a',
                (char) ('a' + value / 676),
                (char) ('a' + value / 26 % 26),
                (char) ('a' + value % 26),
            });
            scanProbe.addWord(word);
            trieProbe.addWord(word);
        }
        if (scanProbe.search("za..") || trieProbe.search("za..")) throw new AssertionError("za..");
        if (scanProbe.comparisons != 1000 || trieProbe.visits != 1) throw new AssertionError("work");
        System.out.printf("%d/%d ca đúng%n", queries.length, queries.length);
        System.out.printf("So sánh khi quét: %d, trạng thái Trie: %d%n", scanProbe.comparisons, trieProbe.visits);
    }
}
