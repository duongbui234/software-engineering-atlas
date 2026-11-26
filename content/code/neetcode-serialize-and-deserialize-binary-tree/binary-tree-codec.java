import java.util.LinkedList;

class BinaryTreeCodec {
    static class Node {
        final int value;
        Node left;
        Node right;

        Node(int value) {
            this(value, null, null);
        }

        Node(int value, Node left, Node right) {
            this.value = value;
            this.left = left;
            this.right = right;
        }
    }

    static class Pending<T> {
        final LinkedList<T> items = new LinkedList<>();
        final boolean byLevel;

        Pending(T root, boolean byLevel) {
            items.add(root);
            this.byLevel = byLevel;
        }

        T take() {
            return byLevel ? items.removeFirst() : items.removeLast();
        }

        void addChildren(T left, T right) {
            items.add(byLevel ? left : right);
            items.add(byLevel ? right : left);
        }
    }

    static String serialize(Node root, boolean byLevel) {
        var pending = new Pending<>(root, byLevel);
        var tokens = new StringBuilder();
        while (!pending.items.isEmpty()) {
            var node = pending.take();
            if (!tokens.isEmpty()) tokens.append(',');
            if (node == null) {
                tokens.append('#');
            } else {
                tokens.append(node.value);
                pending.addChildren(node.left, node.right);
            }
        }
        return tokens.toString();
    }

    record Slot(Node parent, boolean left) {}

    static Node deserialize(String wire, boolean byLevel) {
        var holder = new Node(0);
        var pending = new Pending<>(new Slot(holder, true), byLevel);
        for (String token : wire.split(",", -1)) {
            if (pending.items.isEmpty()) throw new IllegalArgumentException("extra token");
            var slot = pending.take();
            if (token.equals("#")) continue;
            int value = Integer.parseInt(token);
            if (value < -1000 || value > 1000 || !Integer.toString(value).equals(token)) {
                throw new IllegalArgumentException("invalid token");
            }
            var node = new Node(value);
            if (slot.left()) slot.parent().left = node;
            else slot.parent().right = node;
            pending.addChildren(new Slot(node, true), new Slot(node, false));
        }
        if (!pending.items.isEmpty()) throw new IllegalArgumentException("missing token");
        return holder.left;
    }

    record Example(Node tree, String preorder, String level) {}

    static boolean equalSmall(Node a, Node b) {
        if (a == null || b == null) return a == b;
        return a.value == b.value && equalSmall(a.left, b.left) && equalSmall(a.right, b.right);
    }

    static void check(boolean ok) {
        if (!ok) throw new AssertionError("test failed");
    }

    public static void main(String[] args) {
        var leaf = new Node(5);
        var examples = new Example[] {
            new Example(null, "#", "#"),
            new Example(new Node(0), "0,#,#", "0,#,#"),
            new Example(new Node(5, leaf, null), "5,5,#,#,#", "5,5,#,#,#"),
            new Example(new Node(5, null, leaf), "5,#,5,#,#", "5,#,5,#,#"),
            new Example(
                new Node(8, new Node(-4, null, new Node(0)), new Node(8, new Node(-1000), new Node(1000))),
                "8,-4,#,0,#,#,8,-1000,#,#,1000,#,#",
                "8,-4,8,#,0,-1000,1000,#,#,#,#,#,#"
            )
        };
        var invalid = new String[] {"", "1,#", "#,", "1x,#,#", "1001,#,#"};

        for (boolean byLevel : new boolean[] {false, true}) {
            for (var ex : examples) {
                String wire = byLevel ? ex.level() : ex.preorder();
                check(serialize(ex.tree(), byLevel).equals(wire));
                check(equalSmall(deserialize(wire, byLevel), ex.tree()));
            }
            for (boolean left : new boolean[] {false, true}) {
                Node chain = null;
                for (int i = 9999; i >= 0; i--) {
                    int value = i % 11 - 5;
                    chain = left ? new Node(value, chain, null) : new Node(value, null, chain);
                }
                String wire = serialize(chain, byLevel);
                check(wire.split(",", -1).length == 20_001);
                Node restored = deserialize(wire, byLevel);
                for (int i = 0; i < 10_000; i++) {
                    check(restored != null && restored.value == i % 11 - 5);
                    check((left ? restored.right : restored.left) == null);
                    restored = left ? restored.left : restored.right;
                }
                check(restored == null);
            }
            for (String wire : invalid) {
                try {
                    deserialize(wire, byLevel);
                } catch (IllegalArgumentException ex) {
                    continue;
                }
                throw new AssertionError("accepted invalid wire");
            }
        }
        System.out.printf("%d/12 ca đúng%n", examples.length + 2 + invalid.length);
    }
}
