"""LC 102 Binary Tree Level Order Traversal: BFS chụp kích thước tầng (deque và list.pop(0)),
hai danh sách, vạch ngăn tầng, DFS mang độ sâu (đệ quy và lặp); ba cách sai chạy thật.
Chạy: python3 level_order.py
"""
import json
import random
import time
from collections import deque


class TreeNode:
    __slots__ = ("val", "left", "right")

    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None


def build(arr):
    """Dựng cây từ mảng theo tầng kiểu LeetCode: None là chỗ trống."""
    if not arr or arr[0] is None:
        return None
    root = TreeNode(arr[0])
    queue, i, q = [root], 1, 0
    while q < len(queue) and i < len(arr):
        node = queue[q]
        q += 1
        if arr[i] is not None:
            node.left = TreeNode(arr[i])
            queue.append(node.left)
        i += 1
        if i < len(arr) and arr[i] is not None:
            node.right = TreeNode(arr[i])
            queue.append(node.right)
        i += 1
    return root


def left_chain(n):
    """Chuỗi lệch trái n nút: mỗi tầng một nút."""
    root = None
    for v in range(n, 0, -1):
        t = TreeNode(v)
        t.left = root
        root = t
    return root


def level_snapshot(root):
    """Cách 1: BFS bằng deque; len(queue) chụp một lần cho mỗi tầng."""
    res = []
    if root is None:
        return res
    queue = deque([root])
    while queue:
        level = []
        for _ in range(len(queue)):  # range() tính len một lần, trước vòng lặp
            node = queue.popleft()
            level.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        res.append(level)
    return res


def level_snapshot_pop0(root):
    """Cách 1 nhưng dùng list.pop(0): đúng, chỉ để đo."""
    res = []
    if root is None:
        return res
    queue = [root]
    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.pop(0)  # dời mọi phần tử còn lại lên một ô
            level.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        res.append(level)
    return res


def level_two_lists(root):
    """Cách 2: tầng hiện tại sinh ra tầng sau."""
    res = []
    cur = [root] if root else []
    while cur:
        res.append([n.val for n in cur])
        cur = [c for n in cur for c in (n.left, n.right) if c]
    return res


def level_marker(root):
    """Cách 3: None trong hàng đợi là vạch "hết một tầng"."""
    res = []
    if root is None:
        return res
    queue = deque([root, None])
    level = []
    while queue:
        node = queue.popleft()
        if node is None:
            res.append(level)
            level = []
            if queue:
                queue.append(None)
        else:
            level.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
    return res


def level_dfs(root):
    """Cách 4: DFS tiền thứ tự mang độ sâu, đệ quy."""
    res = []

    def go(node, depth):
        if node is None:
            return
        if len(res) == depth:
            res.append([])
        res[depth].append(node.val)
        go(node.left, depth + 1)
        go(node.right, depth + 1)

    go(root, 0)
    return res


def level_dfs_iterative(root):
    """Cách 4b: DFS bằng ngăn xếp tự quản lý; đẩy phải trước để trái ra trước."""
    res = []
    stack = [(root, 0)] if root else []
    while stack:
        node, depth = stack.pop()
        if len(res) == depth:
            res.append([])
        res[depth].append(node.val)
        if node.right:
            stack.append((node.right, depth + 1))
        if node.left:
            stack.append((node.left, depth + 1))
    return res


def wrong_iterate_while_append(root):
    """Sai 1: duyệt q bằng for trong lúc append vào chính q: for đi luôn cả nút mới."""
    res = []
    if root is None:
        return res
    q = [root]
    while q:
        level = []
        for node in q:
            level.append(node.val)
            if node.left:
                q.append(node.left)
            if node.right:
                q.append(node.right)
        res.append(level)
        del q[: len(level)]  # định bỏ các nút của tầng vừa xong
    return res


def wrong_right_first(root):
    """Sai 2: DFS đi phải trước trái."""
    res = []

    def go(node, depth):
        if node is None:
            return
        if len(res) == depth:
            res.append([])
        res[depth].append(node.val)
        go(node.right, depth + 1)
        go(node.left, depth + 1)

    go(root, 0)
    return res


def wrong_mutable_default(root, depth=0, res=[]):
    """Sai 3: res=[] là giá trị mặc định, tạo MỘT lần khi định nghĩa hàm và dùng chung cho mọi lần gọi."""
    if root is None:
        return res
    if len(res) == depth:
        res.append([])
    res[depth].append(root.val)
    wrong_mutable_default(root.left, depth + 1, res)
    wrong_mutable_default(root.right, depth + 1, res)
    return res


# ---------- ca chạy thử ----------

LIMIT_ARR = [(i * 37) % 2001 - 1000 for i in range(2000)]


def split_levels(arr):
    out, start, w = [], 0, 1
    while start < len(arr):
        out.append(arr[start : start + w])
        start += w
        w *= 2
    return out


CASES = [
    ("cây rỗng", lambda: None, []),
    ("một nút", lambda: build([7]), [[7]]),
    ("ba tầng có chỗ trống", lambda: build([5, 2, 8, None, 4, 7, 9]), [[5], [2, 8], [4, 7, 9]]),
    ("chỉ con trái", lambda: build([1, 2, None, 3, None, 4]), [[1], [2], [3], [4]]),
    ("chỉ con phải", lambda: build([1, None, 2, None, 3]), [[1], [2], [3]]),
    ("cây đầy 15 nút", lambda: build(list(range(1, 16))), [[1], [2, 3], [4, 5, 6, 7], list(range(8, 16))]),
    ("nhánh so le", lambda: build([1, 2, 3, 4, None, None, 5, 6, None, None, 7]), [[1], [2, 3], [4, 5], [6, 7]]),
    ("giá trị âm và trùng", lambda: build([0, -1000, 1000, -1000, None, None, 1000]), [[0], [-1000, 1000], [-1000, 1000]]),
    ("cây đủ 2000 nút", lambda: build(LIMIT_ARR), split_levels(LIMIT_ARR)),
    ("chuỗi trái 2000 nút", lambda: left_chain(2000), [[i + 1] for i in range(2000)]),
]


def short(x):
    s = json.dumps(x, separators=(",", ":"))
    return s if len(s) <= 40 else s[:37] + "..."


def run(name, fn):
    ok, bad = 0, []
    for cname, tree, want in CASES:
        try:
            got = fn(tree())
            if got == want:
                ok += 1
            else:
                bad.append(f"{cname} → {short(got)}")
        except Exception as e:  # noqa: BLE001
            bad.append(f"{cname} → ném {type(e).__name__}")
    tail = "; sai ở " + ", ".join(bad) if bad else ""
    print(f"{name:<26} {ok}/{len(CASES)} ca đúng{tail}")


for fn in (level_snapshot, level_snapshot_pop0, level_two_lists, level_marker, level_dfs, level_dfs_iterative,
           wrong_iterate_while_append, wrong_right_first, wrong_mutable_default):
    run(fn.__name__, fn)

# ---------- đối chiếu ngẫu nhiên ----------

rng = random.Random(42)


def random_tree(n):
    if n == 0:
        return None
    nodes = [TreeNode(rng.randint(-1000, 1000))]
    while len(nodes) < n:
        parent = rng.choice(nodes)
        child = TreeNode(rng.randint(-1000, 1000))
        if rng.random() < 0.5:
            if parent.left is None:
                parent.left = child
                nodes.append(child)
        elif parent.right is None:
            parent.right = child
            nodes.append(child)
    return nodes[0]


agree = 0
for _ in range(2000):
    r = random_tree(rng.randrange(60))
    a = level_snapshot(r)
    if all(f(r) == a for f in (level_snapshot_pop0, level_two_lists, level_marker, level_dfs, level_dfs_iterative)):
        agree += 1
print(f"\nđối chiếu 2000 cây ngẫu nhiên 0..59 nút: sáu cách khớp nhau {agree}/2000")

# ---------- đo ----------


def timed(fn, root):
    xs = []
    for _ in range(5):
        t0 = time.perf_counter()
        fn(root)
        xs.append((time.perf_counter() - t0) * 1000)
    return sorted(xs)[2]


print("\nthời gian trung vị 5 lần (ms), cây đầy")
print(f"{'n':>7} {'rộng nhất':>10} {'deque':>8} {'pop(0)':>9} {'hai danh sách':>14} {'vạch ngăn':>10} {'DFS':>8}")
for n in (2000, (1 << 14) - 1, (1 << 16) - 1):
    root = build(list(range(n)))
    width = max(len(level) for level in level_snapshot(root))
    row = [timed(f, root) for f in (level_snapshot, level_snapshot_pop0, level_two_lists, level_marker, level_dfs)]
    print(f"{n:>7} {width:>10} {row[0]:>8.2f} {row[1]:>9.2f} {row[2]:>14.2f} {row[3]:>10.2f} {row[4]:>8.2f}")
