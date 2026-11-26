import java.util.ArrayDeque;
import java.util.Deque;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.IntBinaryOperator;

class RebuildTree {
    static class TreeNode {
        final int value;
        TreeNode left, right;

        TreeNode(int value) {
            this.value = value;
        }
    }

    interface Rebuild {
        TreeNode build(int[] preorder, int[] inorder);
    }

    static TreeNode buildRanges(int[] preorder, IntBinaryOperator findRoot) {
        class Builder {
            int next;

            TreeNode build(int lo, int hi) {
                if (lo == hi) return null;
                TreeNode node = new TreeNode(preorder[next++]);
                int mid = findRoot.applyAsInt(node.value, lo);
                node.left = build(lo, mid);
                node.right = build(mid + 1, hi);
                return node;
            }
        }

        return new Builder().build(0, preorder.length);
    }

    static TreeNode byScan(int[] preorder, int[] inorder) {
        return buildRanges(preorder, (value, lo) -> {
            while (inorder[lo] != value) lo++;
            return lo;
        });
    }

    static TreeNode byIndex(int[] preorder, int[] inorder) {
        Map<Integer, Integer> index = new HashMap<>();
        for (int i = 0; i < inorder.length; i++) {
            index.put(inorder[i], i);
        }
        return buildRanges(preorder, (value, lo) -> index.get(value));
    }

    static TreeNode byStack(int[] preorder, int[] inorder) {
        if (preorder.length == 0) return null;
        TreeNode root = new TreeNode(preorder[0]);
        Deque<TreeNode> pending = new ArrayDeque<>();
        pending.push(root);
        int nextIn = 0;

        for (int i = 1; i < preorder.length; i++) {
            TreeNode child = new TreeNode(preorder[i]);
            TreeNode parent = pending.peek();
            if (parent.value != inorder[nextIn]) {
                parent.left = child;
            } else {
                while (!pending.isEmpty() && pending.peek().value == inorder[nextIn]) {
                    parent = pending.pop();
                    nextIn++;
                }
                parent.right = child;
            }
            pending.push(child);
        }
        return root;
    }

    static void check(TreeNode root, int[] preorder, int[] inorder) {
        Deque<TreeNode> pending = new ArrayDeque<>();
        int before = 0, between = 0;
        while (root != null || !pending.isEmpty()) {
            while (root != null) {
                require(before < preorder.length && preorder[before++] == root.value);
                pending.push(root);
                root = root.left;
            }
            root = pending.pop();
            require(between < inorder.length && inorder[between++] == root.value);
            root = root.right;
        }
        require(before == preorder.length && between == inorder.length);
    }

    static void require(boolean passed) {
        if (!passed) throw new AssertionError("thứ tự duyệt không khớp");
    }

    public static void main(String[] args) {
        int[][][] cases = {
            {{-3000}, {-3000}},
            {{8, 14, 5, -2, 4, 0}, {14, 5, 8, 4, -2, 0}},
            {{1, 2, 3, 4}, {4, 3, 2, 1}},
            {{1, 2, 3, 4}, {1, 2, 3, 4}},
            {{1, -2, 3, -4}, {-2, -4, 3, 1}},
        };
        List<Rebuild> builders = List.of(RebuildTree::byScan, RebuildTree::byIndex, RebuildTree::byStack);
        int ok = 0;
        for (Rebuild rebuild : builders) {
            for (int[][] fixture : cases) {
                check(rebuild.build(fixture[0], fixture[1]), fixture[0], fixture[1]);
                ok++;
            }
        }

        int[] straight = new int[3000], reverse = new int[3000];
        for (int i = 0; i < straight.length; i++) {
            straight[i] = i + 1;
            reverse[i] = straight.length - i;
        }
        for (int[] inorder : new int[][] {straight, reverse}) {
            check(byStack(straight, inorder), straight, inorder);
            ok++;
        }
        System.out.printf("%d/%d ca đúng%n", ok, cases.length * 3 + 2);
    }
}
