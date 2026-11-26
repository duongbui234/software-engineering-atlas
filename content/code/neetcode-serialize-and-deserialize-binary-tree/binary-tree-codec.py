from collections import deque
from dataclasses import dataclass


@dataclass
class TreeNode:
    value: int
    left: "TreeNode | None" = None
    right: "TreeNode | None" = None


def add_children(pending, left, right, by_level):
    pending.extend((left, right) if by_level else (right, left))


def serialize(root, by_level=False):
    pending = deque([root])
    take = pending.popleft if by_level else pending.pop
    tokens = []
    while pending:
        node = take()
        if node is None:
            tokens.append("#")
        else:
            tokens.append(str(node.value))
            add_children(pending, node.left, node.right, by_level)
    return ",".join(tokens)


def deserialize(wire, by_level=False):
    holder = TreeNode(0)
    pending = deque([(holder, "left")])
    take = pending.popleft if by_level else pending.pop
    for token in wire.split(","):
        if not pending:
            raise ValueError("extra token")
        parent, side = take()
        if token == "#":
            continue
        value = int(token)
        if abs(value) > 1000 or str(value) != token:
            raise ValueError("invalid token")
        node = TreeNode(value)
        setattr(parent, side, node)
        add_children(pending, (node, "left"), (node, "right"), by_level)
    if pending:
        raise ValueError("missing token")
    return holder.left


leaf = TreeNode(5)
examples = [
    (None, "#", "#"),
    (TreeNode(0), "0,#,#", "0,#,#"),
    (TreeNode(5, leaf), "5,5,#,#,#", "5,5,#,#,#"),
    (TreeNode(5, None, leaf), "5,#,5,#,#", "5,#,5,#,#"),
    (
        TreeNode(8, TreeNode(-4, None, TreeNode(0)), TreeNode(8, TreeNode(-1000), TreeNode(1000))),
        "8,-4,#,0,#,#,8,-1000,#,#,1000,#,#",
        "8,-4,8,#,0,-1000,1000,#,#,#,#,#,#",
    ),
]
invalid = ["", "1,#", "#,", "1x,#,#", "1001,#,#"]

for by_level in (False, True):
    for tree, preorder, level in examples:
        wire = level if by_level else preorder
        assert serialize(tree, by_level) == wire
        assert deserialize(wire, by_level) == tree
    for side, other in (("left", "right"), ("right", "left")):
        chain = None
        for i in reversed(range(10_000)):
            node = TreeNode(i % 11 - 5)
            setattr(node, side, chain)
            chain = node
        wire = serialize(chain, by_level)
        assert len(wire.split(",")) == 20_001
        restored = deserialize(wire, by_level)
        for i in range(10_000):
            assert restored.value == i % 11 - 5
            assert getattr(restored, other) is None
            restored = getattr(restored, side)
        assert restored is None
    for wire in invalid:
        try:
            deserialize(wire, by_level)
        except ValueError:
            continue
        raise AssertionError("accepted invalid wire")
print(f"{len(examples) + 2 + len(invalid)}/12 ca đúng")
