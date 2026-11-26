import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

class PrefixIndex {
    interface Index {
        void insert(String word);
        boolean search(String word);
        boolean startsWith(String prefix);
    }

    static class WordSet implements Index {
        private final Set<String> words = new HashSet<>();

        public void insert(String word) {
            words.add(word);
        }

        public boolean search(String word) {
            return words.contains(word);
        }

        public boolean startsWith(String prefix) {
            for (String word : words) {
                if (word.startsWith(prefix)) return true;
            }
            return false;
        }
    }

    static class TrieNode {
        private final Map<Character, TrieNode> sparse;
        private final TrieNode[] dense;
        boolean terminal;

        TrieNode(boolean useArray) {
            sparse = useArray ? null : new HashMap<>();
            dense = useArray ? new TrieNode[26] : null;
        }

        TrieNode get(char letter) {
            return dense == null ? sparse.get(letter) : dense[letter - 'a'];
        }

        void set(char letter, TrieNode child) {
            if (dense == null) sparse.put(letter, child);
            else dense[letter - 'a'] = child;
        }
    }

    static class Trie implements Index {
        private final TrieNode root;
        private final boolean dense;

        Trie(boolean dense) {
            this.dense = dense;
            root = new TrieNode(dense);
        }

        public void insert(String word) {
            TrieNode node = root;
            for (int i = 0; i < word.length(); i++) {
                char letter = word.charAt(i);
                TrieNode child = node.get(letter);
                if (child == null) {
                    child = new TrieNode(dense);
                    node.set(letter, child);
                }
                node = child;
            }
            node.terminal = true;
        }

        public boolean search(String word) {
            TrieNode node = walk(word);
            return node != null && node.terminal;
        }

        public boolean startsWith(String prefix) {
            return walk(prefix) != null;
        }

        private TrieNode walk(String text) {
            TrieNode node = root;
            for (int i = 0; i < text.length(); i++) {
                node = node.get(text.charAt(i));
                if (node == null) return null;
            }
            return node;
        }
    }

    static int cases;
    static void check(boolean actual, boolean expected) {
        cases++;
        if (actual != expected) throw new AssertionError("Sai ca " + cases);
    }

    public static void main(String[] args) {
        Index[] indexes = {new WordSet(), new Trie(false), new Trie(true)};
        for (Index index : indexes) {
            check(index.startsWith("ca"), false);
            for (String word : new String[]{"cart", "car", "cab", "car"}) {
                index.insert(word);
            }
            check(index.search("car"), true);
            check(index.search("cart"), true);
            check(index.search("cab"), true);
            check(index.search("ca"), false);
            check(index.startsWith("ca"), true);
            check(index.startsWith("cat"), false);
            check(index.startsWith("carton"), false);
            String longWord = "z".repeat(2000);
            index.insert(longWord);
            check(index.search(longWord), true);
            check(index.search(longWord.substring(0, 1999)), false);
            check(index.startsWith(longWord.substring(0, 1999)), true);
        }
        System.out.printf("%d/33 ca đúng%n", cases);
    }
}
