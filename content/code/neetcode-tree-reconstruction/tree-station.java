import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

class TreeStation {
    record Tree(int value, Tree left, Tree right) {}

    static Tree rebuild(int[] preorder, int[] inorder) {
        Map<Integer, Integer> position = new HashMap<>();
        for (int index = 0; index < inorder.length; index++) {
            position.put(inorder[index], index);
        }
        class Builder {
            int next;

            Tree visit(int lo, int hi) {
                if (lo == hi) return null;
                int value = preorder[next++];
                int split = position.get(value);
                return new Tree(value, visit(lo, split), visit(split + 1, hi));
            }
        }
        return new Builder().visit(0, inorder.length);
    }

    static int maxPath(Tree root) {
        class Path {
            int best = root.value();

            int gain(Tree node) {
                if (node == null) return 0;
                int left = Math.max(0, gain(node.left()));
                int right = Math.max(0, gain(node.right()));
                best = Math.max(best, node.value() + left + right);
                return node.value() + Math.max(left, right);
            }
        }
        Path path = new Path();
        path.gain(root);
        return path.best;
    }

    static String encode(Tree root) {
        List<String> tokens = new ArrayList<>();
        class Encoder {
            void visit(Tree node) {
                if (node == null) {
                    tokens.add("#");
                    return;
                }
                tokens.add(Integer.toString(node.value()));
                visit(node.left());
                visit(node.right());
            }
        }
        new Encoder().visit(root);
        return String.join(",", tokens);
    }

    static Tree decode(String data) {
        String[] tokens = data.split(",");
        class Decoder {
            int next;

            Tree visit() {
                String token = tokens[next++];
                if (token.equals("#")) return null;
                return new Tree(Integer.parseInt(token), visit(), visit());
            }
        }
        return new Decoder().visit();
    }

    public static void main(String[] args) {
        String wire = "8,3,#,6,#,#,11,-2,#,#,#";
        Tree rebuilt = rebuild(new int[]{8, 3, 6, 11, -2}, new int[]{3, 6, 8, -2, 11});
        boolean[] cases = {
            encode(rebuilt).equals(wire),
            encode(rebuild(new int[]{8, 3}, new int[]{3, 8})).equals("8,3,#,#,#"),
            encode(rebuild(new int[]{8, 3}, new int[]{8, 3})).equals("8,#,3,#,#"),
            maxPath(rebuilt) == 28,
            maxPath(decode("-8,-3,#,#,-5,#,#")) == -3,
            encode(decode(wire)).equals(wire),
            encode(decode("4,#,4,#,#")).equals("4,#,4,#,#"),
            decode("#") == null,
        };
        for (boolean pass : cases) {
            if (!pass) throw new AssertionError("Có ca sai");
        }
        System.out.printf("%d/%d ca đúng%n", cases.length, cases.length);
    }
}
