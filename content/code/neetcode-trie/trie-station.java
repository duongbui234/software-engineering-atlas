import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

class TrieStation {
    static class TrieNode {
        final Map<Character, TrieNode> children = new HashMap<>();
        String word;
    }

    static void insert(TrieNode node, String word) {
        for (int i = 0; i < word.length(); i++) {
            node = node.children.computeIfAbsent(word.charAt(i), ignored -> new TrieNode());
        }
        node.word = word;
    }

    static TrieNode walk(TrieNode node, String text) {
        for (int i = 0; i < text.length(); i++) {
            node = node.children.get(text.charAt(i));
            if (node == null) return null;
        }
        return node;
    }

    static boolean matches(TrieNode node, String pattern, int i) {
        if (i == pattern.length()) return node.word != null;
        if (pattern.charAt(i) == '.') {
            for (TrieNode child : node.children.values()) {
                if (matches(child, pattern, i + 1)) return true;
            }
            return false;
        }
        TrieNode child = node.children.get(pattern.charAt(i));
        return child != null && matches(child, pattern, i + 1);
    }

    static void visit(char[][] board, int row, int col, TrieNode parent, Set<String> found) {
        if (row < 0 || row >= board.length || col < 0 || col >= board[row].length) return;
        char letter = board[row][col];
        TrieNode node = parent.children.get(letter);
        if (letter == '#' || node == null) return;
        if (node.word != null) found.add(node.word);
        board[row][col] = '#';
        visit(board, row - 1, col, node, found);
        visit(board, row + 1, col, node, found);
        visit(board, row, col - 1, node, found);
        visit(board, row, col + 1, node, found);
        board[row][col] = letter;
    }

    static List<String> findWords(char[][] board, String... words) {
        TrieNode root = new TrieNode();
        for (String word : words) insert(root, word);
        Set<String> found = new HashSet<>();
        for (int row = 0; row < board.length; row++) {
            for (int col = 0; col < board[row].length; col++) {
                visit(board, row, col, root, found);
            }
        }
        return found.stream().sorted().toList();
    }

    public static void main(String[] args) {
        TrieNode root = new TrieNode();
        for (String word : List.of("cart", "cat", "dog")) insert(root, word);
        char[][] board = {"cat".toCharArray(), "dre".toCharArray()};
        boolean[] cases = {
            walk(root, "car") != null,
            walk(root, "car").word == null,
            "cart".equals(walk(root, "cart").word),
            walk(root, "cab") == null,
            matches(root, "ca.", 0),
            matches(root, "c..t", 0),
            matches(root, ".og", 0),
            !matches(root, "c.t.", 0),
            !matches(root, "do", 0),
            findWords(board, "car", "care", "cat", "cart", "cata").equals(List.of("car", "care", "cat")),
            Arrays.deepEquals(board, new char[][]{"cat".toCharArray(), "dre".toCharArray()}),
            findWords(new char[][]{"aa".toCharArray()}, "a", "aa", "aaa").equals(List.of("a", "aa")),
        };
        insert(root, "car");
        if (!"car".equals(walk(root, "car").word) || !"cart".equals(walk(root, "cart").word)) {
            throw new AssertionError("Có ca sai");
        }
        for (boolean pass : cases) {
            if (!pass) throw new AssertionError("Có ca sai");
        }
        System.out.printf("%d/%d ca đúng%n", cases.length + 1, cases.length + 1);
    }
}
