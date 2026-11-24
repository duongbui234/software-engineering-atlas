# LC 226 Invert Binary Tree: đổi chỗ hai con ở mọi nút, bằng đệ quy, ngăn xếp tự quản, hoặc BFS theo tầng.
# Chạy: python3 invert_tree.py
import json
import statistics
import time
from collections import deque


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val, self.left, self.right = val, left, right


def from_level(vals):
    """Dựng cây từ danh sách theo tầng kiểu LeetCode; None là chỗ trống."""
    if not vals or vals[0] is None:
        return None
    root = TreeNode(vals[0])
    queue, i = deque([root]), 1
    while i < len(vals):
        node = queue.popleft()
        for side in ("left", "right"):
            if i < len(vals) and vals[i] is not None:
                child = TreeNode(vals[i])
                setattr(node, side, child)
                queue.append(child)
            i += 1
    return root


def to_level(root):
    """Đọc cây ra danh sách theo tầng, bỏ các None ở cuối."""
    out, queue = [], deque([root])
    while queue:
        node = queue.popleft()
        out.append(None if node is None else node.val)
        if node is not None:
            queue.extend((node.left, node.right))
    while out and out[-1] is None:
        out.pop()
    return out


# Cách 1: đệ quy. Gán bộ: Python tính xong cả vế phải rồi mới gán, nên không cần biến tạm.
def invert_recursive(root):
    if root is None:
        return None
    root.left, root.right = invert_recursive(root.right), invert_recursive(root.left)
    return root


# Cách 2: ngăn xếp tự quản; thứ tự thăm không quan trọng.
def invert_stack(root):
    stack = [root] if root else []
    while stack:
        node = stack.pop()
        node.left, node.right = node.right, node.left
        if node.left:
            stack.append(node.left)
        if node.right:
            stack.append(node.right)
    return root


# Cách 3: BFS theo tầng với deque (popleft O(1), khác list.pop(0) là O(n)).
def invert_bfs(root):
    queue = deque([root] if root else [])
    while queue:
        node = queue.popleft()
        node.left, node.right = node.right, node.left
        if node.left:
            queue.append(node.left)
        if node.right:
            queue.append(node.right)
    return root


# SAI: tách gán bộ thành hai câu. Câu thứ hai đọc root.left đã bị ghi đè.
def wrong_overwrite(root):
    if root is None:
        return None
    root.left = wrong_overwrite(root.right)
    root.right = wrong_overwrite(root.left)
    return root


def mulberry32(seed):
    """Bộ sinh ngẫu nhiên mulberry32, mọi phép tính cắt về 32 bit như Math.imul của JavaScript."""
    a = seed & 0xFFFFFFFF

    def rnd():
        nonlocal a
        a = (a + 0x6D2B79F5) & 0xFFFFFFFF
        t = ((a ^ (a >> 15)) * (1 | a)) & 0xFFFFFFFF
        t = ((t + (((t ^ (t >> 7)) * (61 | t)) & 0xFFFFFFFF)) & 0xFFFFFFFF) ^ t
        return ((t ^ (t >> 14)) & 0xFFFFFFFF) / 4294967296

    return rnd


CASES = [
    ("cây rỗng", [], []),
    ("một nút", [1], [1]),
    ("chỉ có con trái", [1, 2], [1, None, 2]),
    ("ba nút", [2, 1, 3], [2, 3, 1]),
    ("cây đủ 3 tầng", [5, 3, 8, 1, 4, 7, 9], [5, 8, 3, 9, 7, 4, 1]),
    ("chuỗi trái thành chuỗi phải", [1, 2, None, 3], [1, None, 2, None, 3]),
    ("lệch hai bên", [1, 2, 3, None, 4, None, 5], [1, 3, 2, 5, None, 4]),
    ("giá trị âm và 0", [0, -1, None, -2, -3], [0, None, -1, -3, -2]),
]

FNS = [invert_recursive, invert_stack, invert_bfs, wrong_overwrite]
for fn in FNS:
    bad = []
    for name, vals, want in CASES:
        got = to_level(fn(from_level(vals)))
        if got != want:
            bad.append(f"{name} → {json.dumps(got)}")
    tail = "; sai ở " + ", ".join(bad) if bad else ""
    print(f"{fn.__name__:17} {len(CASES) - len(bad)}/{len(CASES)} ca đúng{tail}")


# Gương độc lập: viết cây theo thứ tự phải → gốc → trái; cây đã đảo viết trái → gốc → phải phải ra y hệt.
def ser(t):
    return "#" if t is None else f"({ser(t.left)} {t.val} {ser(t.right)})"


def ser_mirror(t):
    return "#" if t is None else f"({ser_mirror(t.right)} {t.val} {ser_mirror(t.left)})"


def random_tree(rnd, n):
    if n == 0:
        return None
    root = TreeNode(0)
    slots = [(root, "left"), (root, "right")]
    for i in range(1, n):
        j = int(rnd() * len(slots))
        parent, side = slots[j]
        slots[j] = slots[-1]
        slots.pop()
        node = TreeNode(i)
        setattr(parent, side, node)
        slots += [(node, "left"), (node, "right")]
    return root


rnd = mulberry32(226)
ok = [0, 0, 0]
for _ in range(2000):
    n, seed = int(rnd() * 41), int(rnd() * 2**31)
    for j, fn in enumerate(FNS[:3]):
        root = random_tree(mulberry32(seed), n)  # mỗi cách đảo một bản riêng của cùng một cây
        want = ser_mirror(root)
        ok[j] += ser(fn(root)) == want
print("\nngẫu nhiên: " + ", ".join(f"{fn.__name__} {ok[j]}/2000" for j, fn in enumerate(FNS[:3])))


def timed(fn, root, reps=5):
    try:
        ts = []
        for _ in range(reps):
            t0 = time.perf_counter()
            fn(root)
            ts.append((time.perf_counter() - t0) * 1000)
        return f"{statistics.median(ts):.2f}"
    except RecursionError:
        return "RecursionError"


n = (1 << 20) - 1
nodes = [TreeNode(i) for i in range(n)]
for i in range(n // 2):
    nodes[i].left, nodes[i].right = nodes[2 * i + 1], nodes[2 * i + 2]
print(f"\nCây đầy đủ {n} nút, trung vị 5 lần (ms)")
for fn in FNS[:3]:
    print(f"{fn.__name__:17} {timed(fn, nodes[0]):>8}")

print("\nChuỗi lệch trái d nút, trung vị 5 lần (ms)")
print("d                đệ quy   ngăn xếp        BFS")
for d in (500, 1_000, 100_000):
    root = cur = TreeNode(0)
    for i in range(1, d):
        cur.left = TreeNode(i)
        cur = cur.left
    print(f"{d:<8} " + " ".join(timed(fn, root).rjust(14) for fn in FNS[:3]))
