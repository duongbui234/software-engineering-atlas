import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

class SearchGrid {
    private static final int[][] DIRECTIONS = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};

    private static final class Result {
        final List<String> found = new ArrayList<>();
        int advances;
    }

    static Result perWord(char[][] board, List<String> words) {
        Result out = new Result();
        wordsLoop:
        for (String word : words) {
            for (int row = 0; row < board.length; row++) {
                for (int col = 0; col < board[0].length; col++) {
                    if (match(board, row, col, word, 0, out)) {
                        out.found.add(word);
                        continue wordsLoop;
                    }
                }
            }
        }
        return out;
    }

    private static boolean match(char[][] board, int row, int col, String word, int index, Result out) {
        if (row < 0 || row >= board.length || col < 0 || col >= board[0].length) return false;
        char letter = board[row][col];
        if (letter != word.charAt(index)) return false;
        out.advances++;
        if (index + 1 == word.length()) return true;

        board[row][col] = '#';
        boolean hit = false;
        for (int[] dir : DIRECTIONS) {
            if (match(board, row + dir[0], col + dir[1], word, index + 1, out)) {
                hit = true;
                break;
            }
        }
        board[row][col] = letter;
        return hit;
    }

    private static final class Node {
        final Map<Character, Node> children = new HashMap<>();
        String word;
    }

    static Result withTrie(char[][] board, List<String> words) {
        Node root = new Node();
        for (String word : words) {
            Node node = root;
            for (int index = 0; index < word.length(); index++) {
                node = node.children.computeIfAbsent(word.charAt(index), unused -> new Node());
            }
            node.word = word;
        }

        Result out = new Result();
        for (int row = 0; row < board.length; row++) {
            for (int col = 0; col < board[0].length; col++) {
                visit(board, row, col, root, out);
            }
        }
        return out;
    }

    private static void visit(char[][] board, int row, int col, Node parent, Result out) {
        if (row < 0 || row >= board.length || col < 0 || col >= board[0].length) return;
        char letter = board[row][col];
        Node node = parent.children.get(letter);
        if (node == null) return;
        out.advances++;
        if (node.word != null) {
            out.found.add(node.word);
            node.word = null;
        }
        board[row][col] = '#';
        for (int[] dir : DIRECTIONS) {
            if (node.children.isEmpty()) break;
            visit(board, row + dir[0], col + dir[1], node, out);
        }
        board[row][col] = letter;
        if (node.children.isEmpty()) parent.children.remove(letter);
    }

    private record Fixture(List<String> rows, List<String> words, List<String> expected) {}

    private static char[][] makeBoard(List<String> rows) {
        return rows.stream().map(String::toCharArray).toArray(char[][]::new);
    }

    private static void check(Result out, char[][] board, Fixture fixture) {
        out.found.sort(String::compareTo);
        if (!out.found.equals(fixture.expected())) throw new AssertionError("Sai kết quả");
        if (!Arrays.deepEquals(board, makeBoard(fixture.rows()))) {
            throw new AssertionError("Bảng chữ đã thay đổi");
        }
    }

    public static void main(String[] args) {
        var cases = List.of(
            new Fixture(List.of("car", "tpx", "xex"), List.of("cap", "cape", "car", "cart", "capa", "cat"), List.of("cap", "cape", "car")),
            new Fixture(List.of("aaa"), List.of("a", "aa", "aaa", "aaaa"), List.of("a", "aa", "aaa")),
            new Fixture(List.of("ax", "xb"), List.of("ab", "axb", "axxb"), List.of("axb")),
            new Fixture(List.of("z"), List.of("a", "z", "zz"), List.of("z")),
            new Fixture(List.of("yx", "xy"), List.of("aaa", "zzz"), List.of())
        );
        for (Fixture fixture : cases) {
            char[][] board = makeBoard(fixture.rows());
            check(perWord(board, fixture.words()), board, fixture);
            check(withTrie(board, fixture.words()), board, fixture);
        }

        char[][] board = makeBoard(List.of("aaa", "aaa", "aaa"));
        List<String> words = new ArrayList<>();
        for (char last = 'b'; last <= 'k'; last++) words.add("aaaaa" + last);
        Result left = perWord(board, words);
        Result right = withTrie(board, words);
        if (!left.found.isEmpty() || !right.found.isEmpty() || right.advances == 0 || left.advances != 10 * right.advances) {
            throw new AssertionError("Sai số bước khớp");
        }
        System.out.printf("%d/%d ca đúng%n", cases.size() + 1, cases.size() + 1);
        System.out.printf("Bước khớp: %d / %d%n", left.advances, right.advances);
    }
}
