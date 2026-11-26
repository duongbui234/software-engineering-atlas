from dataclasses import dataclass


@dataclass
class Tree:
    value: int
    left: "Tree | None" = None
    right: "Tree | None" = None


def rebuild(preorder, inorder):
    position = {value: index for index, value in enumerate(inorder)}
    values = iter(preorder)

    def visit(lo, hi):
        if lo == hi:
            return None
        value = next(values)
        split = position[value]
        return Tree(value, visit(lo, split), visit(split + 1, hi))

    return visit(0, len(inorder))


def max_path(root):
    best = root.value

    def gain(node):
        nonlocal best
        if node is None:
            return 0
        left = max(0, gain(node.left))
        right = max(0, gain(node.right))
        best = max(best, node.value + left + right)
        return node.value + max(left, right)

    gain(root)
    return best


def encode(root):
    tokens = []

    def visit(node):
        if node is None:
            tokens.append("#")
            return
        tokens.append(str(node.value))
        visit(node.left)
        visit(node.right)

    visit(root)
    return ",".join(tokens)


def decode(data):
    tokens = iter(data.split(","))

    def visit():
        token = next(tokens)
        return None if token == "#" else Tree(int(token), visit(), visit())

    return visit()


wire = "8,3,#,6,#,#,11,-2,#,#,#"
rebuilt = rebuild([8, 3, 6, 11, -2], [3, 6, 8, -2, 11])
cases = [
    encode(rebuilt) == wire,
    encode(rebuild([8, 3], [3, 8])) == "8,3,#,#,#",
    encode(rebuild([8, 3], [8, 3])) == "8,#,3,#,#",
    max_path(rebuilt) == 28,
    max_path(decode("-8,-3,#,#,-5,#,#")) == -3,
    encode(decode(wire)) == wire,
    encode(decode("4,#,4,#,#")) == "4,#,4,#,#",
    decode("#") is None,
]
if not all(cases):
    raise AssertionError("Có ca sai")
print(f"{len(cases)}/{len(cases)} ca đúng")
