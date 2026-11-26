from dataclasses import dataclass


@dataclass(eq=False)
class Node:
    value: int
    left: "Node | None" = None
    right: "Node | None" = None


def brute(root: Node) -> int:
    best = root.value
    parent = {root: None}
    nodes = [root]
    cursor = 0
    while cursor < len(nodes):
        current = nodes[cursor]
        cursor += 1
        for child in (current.left, current.right):
            if child is not None:
                parent[child] = current
                nodes.append(child)

    for start in nodes:
        stack = [(start, None, start.value)]
        while stack:
            current, previous, total = stack.pop()
            best = max(best, total)
            for neighbor in (current.left, current.right, parent[current]):
                if neighbor is not None and neighbor is not previous:
                    stack.append((neighbor, current, total + neighbor.value))
    return best


def recursive(root: Node) -> int:
    best = root.value

    def gain(current: Node | None) -> int:
        nonlocal best
        if current is None:
            return 0
        left = max(0, gain(current.left))
        right = max(0, gain(current.right))
        best = max(best, current.value + left + right)
        return current.value + max(left, right)

    gain(root)
    return best


@dataclass
class Frame:
    current: Node
    step: int = 0
    left_gain: int = 0


def iterative(root: Node) -> int:
    best = root.value
    returned = 0
    stack = [Frame(root)]

    while stack:
        top = stack[-1]
        current = top.current
        if top.step == 0:
            top.step = 1
            if current.left is not None:
                stack.append(Frame(current.left))
            continue

        if top.step == 1:
            if current.left is not None:
                top.left_gain = max(0, returned)
            top.step = 2
            if current.right is not None:
                stack.append(Frame(current.right))
            continue

        right_gain = 0 if current.right is None else max(0, returned)
        best = max(best, current.value + top.left_gain + right_gain)
        returned = current.value + max(top.left_gain, right_gain)
        stack.pop()
    return best


if __name__ == "__main__":
    cases = [
        (Node(-9), -9),
        (Node(-6, Node(-1), Node(-4)), -1),
        (Node(6, Node(3), Node(5)), 14),
        (Node(-8, Node(4, Node(7), Node(5)), Node(-3)), 16),
        (Node(8, Node(2, Node(4), Node(5)), Node(1)), 16),
        (Node(5, Node(-7, Node(1)), Node(4)), 9),
        (Node(2, Node(2, Node(2)), Node(2)), 8),
        (Node(6, Node(-2, Node(9)), Node(4)), 17),
    ]
    passed = 0
    for root, expected in cases:
        for solve in (brute, recursive, iterative):
            actual = solve(root)
            if actual != expected:
                raise AssertionError(f"{solve.__name__}: {actual} != {expected}")
        passed += 1

    deep = Node(1)
    for _ in range(1, 30_000):
        deep = Node(1, deep)
    if iterative(deep) != 30_000:
        raise AssertionError("iterative: 30_000")
    passed += 1

    print(f"{passed}/{len(cases) + 1} ca đúng")
