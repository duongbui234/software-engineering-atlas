from dataclasses import dataclass


@dataclass
class TreeNode:
    value: int
    left: "TreeNode | None" = None
    right: "TreeNode | None" = None


def build_ranges(preorder, find_root):
    next_pre = 0

    def build(lo, hi):
        nonlocal next_pre
        if lo == hi:
            return None
        node = TreeNode(preorder[next_pre])
        next_pre += 1
        mid = find_root(node.value, lo)
        node.left = build(lo, mid)
        node.right = build(mid + 1, hi)
        return node

    return build(0, len(preorder))


def by_scan(preorder, inorder):
    return build_ranges(preorder, lambda value, lo: inorder.index(value, lo))


def by_index(preorder, inorder):
    index = {value: i for i, value in enumerate(inorder)}
    return build_ranges(preorder, lambda value, lo: index[value])


def by_stack(preorder, inorder):
    if not preorder:
        return None
    root = TreeNode(preorder[0])
    pending = [root]
    next_in = 0

    for i in range(1, len(preorder)):
        child = TreeNode(preorder[i])
        parent = pending[-1]
        if parent.value != inorder[next_in]:
            parent.left = child
        else:
            while pending and pending[-1].value == inorder[next_in]:
                parent = pending.pop()
                next_in += 1
            parent.right = child
        pending.append(child)

    return root


def check(root, preorder, inorder):
    before, between, pending = [], [], []
    while root is not None or pending:
        while root is not None:
            before.append(root.value)
            pending.append(root)
            root = root.left
        root = pending.pop()
        between.append(root.value)
        root = root.right
    assert before == preorder
    assert between == inorder


if __name__ == "__main__":
    cases = [
        ([-3000], [-3000]),
        ([8, 14, 5, -2, 4, 0], [14, 5, 8, 4, -2, 0]),
        ([1, 2, 3, 4], [4, 3, 2, 1]),
        ([1, 2, 3, 4], [1, 2, 3, 4]),
        ([1, -2, 3, -4], [-2, -4, 3, 1]),
    ]
    ok = 0
    for rebuild in (by_scan, by_index, by_stack):
        for preorder, inorder in cases:
            check(rebuild(preorder, inorder), preorder, inorder)
            ok += 1

    straight = list(range(1, 3001))
    for inorder in (straight, straight[::-1]):
        check(by_stack(straight, inorder), straight, inorder)
        ok += 1
    print(f"{ok}/{len(cases) * 3 + 2} ca đúng")
