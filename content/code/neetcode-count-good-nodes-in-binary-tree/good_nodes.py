"""LeetCode 1448 Count Good Nodes in Binary Tree.

Một nút là "tốt" nếu trên đường từ gốc xuống nó không có nút nào lớn hơn nó.
Các cách: vét cạn leo ngược về gốc, DFS mang max đường đi xuống (đệ quy và lặp), BFS mang max, và các bản sai hay gặp.
Chạy: python3 good_nodes.py
"""
import sys
import time
from collections import deque


class TreeNode:
    __slots__ = ("val", "left", "right")

    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None


def build(arr):
    """Dựng cây từ mảng theo tầng kiểu LeetCode, None là chỗ trống."""
    if not arr or arr[0] is None:
        return None
    root = TreeNode(arr[0])
    queue, head, i = [root], 0, 1
    while i < len(arr):
        node = queue[head]
        head += 1
        if i < len(arr) and arr[i] is not None:
            node.left = TreeNode(arr[i])
            queue.append(node.left)
        i += 1
        if i < len(arr) and arr[i] is not None:
            node.right = TreeNode(arr[i])
            queue.append(node.right)
        i += 1
    return root


def chain(n, value_at, side):
    """Chuỗi n nút, mọi nút chỉ có con một phía."""
    root = cur = TreeNode(value_at(0))
    for i in range(1, n):
        nxt = TreeNode(value_at(i))
        setattr(cur, side, nxt)
        cur = nxt
    return root


# ---------- Cách 1: vét cạn, mỗi nút leo ngược lên gốc. O(n·h). ----------
compares = 0


def good_brute(root):
    global compares
    if root is None:
        return 0
    parent = {id(root): None}
    order = [root]
    for node in order:  # order dài ra trong lúc lặp: duyệt theo tầng
        for child in (node.left, node.right):
            if child is not None:
                parent[id(child)] = node
                order.append(child)
    good = 0
    for node in order:
        a = parent[id(node)]
        ok = True
        while a is not None:
            compares += 1
            if a.val > node.val:
                ok = False
                break
            a = parent[id(a)]
        good += ok
    return good


# ---------- Cách 2: DFS tiền thứ tự, mang max xuống, trả số nút tốt lên. O(n), O(h). ----------
def good_dfs(root):
    def go(node, max_so_far):
        if node is None:
            return 0
        good = 1 if node.val >= max_so_far else 0  # bằng max vẫn là tốt
        m = max(max_so_far, node.val)
        return good + go(node.left, m) + go(node.right, m)

    return go(root, float("-inf"))


# Cách 2b: cùng DFS, đếm bằng biến ngoài. Cần nonlocal.
def good_dfs_nonlocal(root):
    count = 0

    def go(node, max_so_far):
        nonlocal count
        if node is None:
            return
        if node.val >= max_so_far:
            count += 1
        m = max(max_so_far, node.val)
        go(node.left, m)
        go(node.right, m)

    go(root, float("-inf"))
    return count


# ---------- Cách 3: DFS lặp, ngăn xếp giữ cặp (nút, max). ----------
def good_iterative(root):
    if root is None:
        return 0
    good = 0
    stack = [(root, root.val)]
    while stack:
        node, max_so_far = stack.pop()
        if node.val >= max_so_far:
            good += 1
        m = max(max_so_far, node.val)
        if node.right is not None:
            stack.append((node.right, m))
        if node.left is not None:
            stack.append((node.left, m))
    return good


# ---------- Cách 4: BFS theo tầng bằng collections.deque. ----------
def good_bfs(root):
    if root is None:
        return 0
    good = 0
    queue = deque([(root, root.val)])
    while queue:
        node, max_so_far = queue.popleft()
        if node.val >= max_so_far:
            good += 1
        m = max(max_so_far, node.val)
        if node.left is not None:
            queue.append((node.left, m))
        if node.right is not None:
            queue.append((node.right, m))
    return good


# BFS giống hệt nhưng dùng list.pop(0): đúng, nhưng pop(0) dời cả list.
def good_bfs_pop0(root):
    if root is None:
        return 0
    good = 0
    queue = [(root, root.val)]
    while queue:
        node, max_so_far = queue.pop(0)
        if node.val >= max_so_far:
            good += 1
        m = max(max_so_far, node.val)
        if node.left is not None:
            queue.append((node.left, m))
        if node.right is not None:
            queue.append((node.right, m))
    return good


# ---------- Các bản sai ----------
def wrong_strict(root):
    """Sai 1: so ngặt. Nút bằng max của đường đi cũng là nút tốt."""
    if root is None:
        return 0
    good = 1  # gốc luôn tốt
    stack = [(c, root.val) for c in (root.right, root.left) if c is not None]
    while stack:
        node, max_so_far = stack.pop()
        if node.val > max_so_far:  # sai: phải là >=
            good += 1
        m = max(max_so_far, node.val)
        if node.right is not None:
            stack.append((node.right, m))
        if node.left is not None:
            stack.append((node.left, m))
    return good


def wrong_init_zero(root):
    """Sai 2: khởi tạo max bằng 0. Giá trị có thể âm."""
    if root is None:
        return 0
    good = 0
    stack = [(root, 0)]
    while stack:
        node, max_so_far = stack.pop()
        if node.val >= max_so_far:
            good += 1
        m = max(max_so_far, node.val)
        if node.right is not None:
            stack.append((node.right, m))
        if node.left is not None:
            stack.append((node.left, m))
    return good


def wrong_shared_max(root):
    """Sai 3: một biến max dùng chung cho cả cây. Max của nhánh trái rò sang nhánh phải."""
    if root is None:
        return 0
    mx, good = float("-inf"), 0
    stack = [root]
    while stack:
        node = stack.pop()
        if node.val >= mx:
            good += 1
            mx = node.val
        if node.right is not None:
            stack.append(node.right)
        if node.left is not None:
            stack.append(node.left)
    return good


def wrong_no_nonlocal(root):
    """Sai 4: quên nonlocal. count += 1 trong hàm lồng biến count thành biến cục bộ chưa gán."""
    count = 0

    def go(node, max_so_far):
        if node is None:
            return
        if node.val >= max_so_far:
            count += 1  # UnboundLocalError
        m = max(max_so_far, node.val)
        go(node.left, m)
        go(node.right, m)

    go(root, float("-inf"))
    return count


# ---------- Ca chạy thử chung ----------
N = 100_000
up_chain = chain(N, lambda i: -10_000 + i // 5, "right")  # không giảm: mọi nút đều tốt
down_chain = chain(N, lambda i: 10_000 - i // 5, "left")  # không tăng: chỉ 5 nút đầu (bằng gốc) là tốt

cases = [
    ("một nút", build([7]), 1),
    ("một nút âm", build([-10000]), 1),
    ("ba nút", build([2, 1, 3]), 2),
    ("bằng max vẫn tốt", build([5, 5, 5]), 3),
    ("toàn số âm", build([-3, -5, -1, -4, None, None, -2]), 2),
    ("max nhánh trái lớn", build([1, 9, 2, None, None, 2, 3]), 5),
    ("cây đầy 7 nút", build([4, 2, 6, 1, 3, 5, 7]), 3),
    ("xuống thấp rồi vượt lại", build([6, 2, None, 1, 7]), 2),
    ("chuỗi không giảm 10^5 nút", up_chain, N),
    ("chuỗi không tăng 10^5 nút", down_chain, 5),
]

fns = [
    ("good_brute", good_brute),
    ("good_dfs", good_dfs),
    ("good_dfs_nonlocal", good_dfs_nonlocal),
    ("good_iterative", good_iterative),
    ("good_bfs", good_bfs),
    ("wrong_strict", wrong_strict),
    ("wrong_init_zero", wrong_init_zero),
    ("wrong_shared_max", wrong_shared_max),
    ("wrong_no_nonlocal", wrong_no_nonlocal),
]

width = max(len(n) for n, _ in fns) + 1
for name, fn in fns:
    ok, fails = 0, []
    for cname, tree, want in cases:
        if name == "good_brute" and tree is up_chain:
            ok += 1  # vét cạn trên chuỗi 10^5 nút là 5·10^9 phép so; đo riêng ở dưới
            continue
        try:
            got = fn(tree)
            if got == want:
                ok += 1
            else:
                fails.append(f"{cname} → {got}")
        except Exception as e:  # RecursionError, UnboundLocalError
            fails.append(f"{cname} → ném {type(e).__name__}")
    tail = "; sai ở " + ", ".join(fails) if fails else ""
    print(f"{name:<{width}} {ok}/{len(cases)} ca đúng{tail}")


def median(fn, runs=5):
    ts = []
    for _ in range(runs):
        t = time.perf_counter()
        fn()
        ts.append((time.perf_counter() - t) * 1000)
    ts.sort()
    return ts[runs // 2]


print("\nchuỗi không giảm (mọi nút tốt, vét cạn không dừng sớm), trung vị 5 lần (ms)")
print("n        vét cạn: phép so       ms   DFS lặp ms")
for n in (1000, 2000, 4000):
    tree = chain(n, lambda i: i, "right")
    compares = 0
    good_brute(tree)
    c = compares
    tb = median(lambda: good_brute(tree))
    ti = median(lambda: good_iterative(tree))
    print(f"{n:<8} {c:>16} {tb:>10.1f} {ti:>12.2f}")

# Cây đầy đủ 10^5 nút (cao 17), giá trị giả ngẫu nhiên trong [-10^4, 10^4] (bộ sinh tuyến tính, cố định).
seed = 42
vals = []
for _ in range(N):
    seed = (seed * 1103515245 + 12345) % 2**31
    vals.append(seed % 20001 - 10000)
full = build(vals)
compares = 0
full_want = good_brute(full)
print(f"\ncây đầy đủ 10^5 nút (cao 17): {full_want} nút tốt, vét cạn {compares} phép so")
for name, fn in [("vét cạn", good_brute), ("DFS đệ quy", good_dfs), ("DFS lặp", good_iterative),
                 ("BFS deque", good_bfs), ("BFS list.pop(0)", good_bfs_pop0)]:
    assert fn(full) == full_want, name
    print(f"{name:<16} {median(lambda: fn(full)):>9.1f} ms")

print(f"\ngiới hạn đệ quy mặc định: {sys.getrecursionlimit()}")
sys.setrecursionlimit(200_000)
print(f"sau sys.setrecursionlimit(200000): good_dfs trên chuỗi 10^5 nút → {good_dfs(up_chain)}")
