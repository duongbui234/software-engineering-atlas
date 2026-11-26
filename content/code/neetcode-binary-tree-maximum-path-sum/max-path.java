import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.IdentityHashMap;
import java.util.function.ToIntFunction;

class Main {
    record Node(int value, Node left, Node right) {
        Node(int value) { this(value, null, null); }
    }

    record Walk(Node current, Node previous, int sum) {}

    static int brute(Node root) {
        int best = root.value();
        var parent = new IdentityHashMap<Node, Node>();
        parent.put(root, null);
        var nodes = new ArrayList<Node>();
        nodes.add(root);
        for (int cursor = 0; cursor < nodes.size(); cursor++) {
            Node current = nodes.get(cursor);
            for (Node child : new Node[] {current.left(), current.right()}) {
                if (child != null) {
                    parent.put(child, current);
                    nodes.add(child);
                }
            }
        }

        for (Node start : nodes) {
            var stack = new ArrayDeque<Walk>();
            stack.push(new Walk(start, null, start.value()));
            while (!stack.isEmpty()) {
                Walk walk = stack.pop();
                best = Math.max(best, walk.sum());
                Node current = walk.current();
                for (Node next : new Node[] {current.left(), current.right(), parent.get(current)}) {
                    if (next != null && next != walk.previous()) {
                        stack.push(new Walk(next, current, walk.sum() + next.value()));
                    }
                }
            }
        }
        return best;
    }

    static int recursive(Node root) {
        int[] best = {root.value()};
        gain(root, best);
        return best[0];
    }

    static int gain(Node current, int[] best) {
        if (current == null) return 0;
        int left = Math.max(0, gain(current.left(), best));
        int right = Math.max(0, gain(current.right(), best));
        best[0] = Math.max(best[0], current.value() + left + right);
        return current.value() + Math.max(left, right);
    }

    static class Frame {
        final Node current;
        int step;
        int leftGain;

        Frame(Node current) { this.current = current; }
    }

    static int iterative(Node root) {
        int best = root.value();
        int returned = 0;
        var stack = new ArrayDeque<Frame>();
        stack.push(new Frame(root));

        while (!stack.isEmpty()) {
            Frame top = stack.peek();
            Node current = top.current;
            if (top.step == 0) {
                top.step = 1;
                if (current.left() != null) stack.push(new Frame(current.left()));
                continue;
            }

            if (top.step == 1) {
                if (current.left() != null) top.leftGain = Math.max(0, returned);
                top.step = 2;
                if (current.right() != null) stack.push(new Frame(current.right()));
                continue;
            }

            int rightGain = current.right() == null ? 0 : Math.max(0, returned);
            best = Math.max(best, current.value() + top.leftGain + rightGain);
            returned = current.value() + Math.max(top.leftGain, rightGain);
            stack.pop();
        }
        return best;
    }

    record TestCase(Node root, int expected) {}

    public static void main(String[] args) {
        TestCase[] cases = {
            new TestCase(new Node(-9), -9),
            new TestCase(new Node(-6, new Node(-1), new Node(-4)), -1),
            new TestCase(new Node(6, new Node(3), new Node(5)), 14),
            new TestCase(new Node(-8, new Node(4, new Node(7), new Node(5)), new Node(-3)), 16),
            new TestCase(new Node(8, new Node(2, new Node(4), new Node(5)), new Node(1)), 16),
            new TestCase(new Node(5, new Node(-7, new Node(1), null), new Node(4)), 9),
            new TestCase(new Node(2, new Node(2, new Node(2), null), new Node(2)), 8),
            new TestCase(new Node(6, new Node(-2, new Node(9), null), new Node(4)), 17),
        };
        var solvers = java.util.List.<ToIntFunction<Node>>of(Main::brute, Main::recursive, Main::iterative);
        int passed = 0;
        for (TestCase test : cases) {
            for (var solve : solvers) {
                int actual = solve.applyAsInt(test.root());
                if (actual != test.expected()) throw new AssertionError(actual + " != " + test.expected());
            }
            passed++;
        }

        Node deep = new Node(1);
        for (int length = 1; length < 30_000; length++) deep = new Node(1, deep, null);
        if (iterative(deep) != 30_000) throw new AssertionError("iterative: 30_000");
        passed++;

        System.out.printf("%d/%d ca đúng%n", passed, cases.length + 1);
    }
}
