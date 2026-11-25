# LC 235 Lowest Common Ancestor of a Binary Search Tree: LCA tổng quát (hậu thứ tự), so hai đường đi,
# đi xuống theo thứ tự của BST (đệ quy và vòng lặp), và hai cách hiểu sai.
# Chạy: python3 lca.py
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
    queue = deque([root])
    i = 1
    while queue and i < len(arr):
        node = queue.popleft()
        if i < len(arr) and arr[i] is not None:
            node.left = TreeNode(arr[i])
            queue.append(node.left)
        i += 1
        if i < len(arr) and arr[i] is not None:
            node.right = TreeNode(arr[i])
            queue.append(node.right)
        i += 1
    return root


def find(root, v):
    node = root
    while node is not None and node.val != v:
        node = node.left if v < node.val else node.right
    if node is None:
        raise KeyError(v)
    return node


def right_chain(n):
    """Chuỗi lệch phải 0 → 1 → … → n-1: BST hợp lệ, cao n."""
    root = None
    for i in range(n - 1, -1, -1):
        t = TreeNode(i)
        t.right = root
        root = t
    return root


def balanced_bst(vals, lo, hi):
    if lo > hi:
        return None
    mid = (lo + hi) // 2
    node = TreeNode(vals[mid])
    node.left = balanced_bst(vals, lo, mid - 1)
    node.right = balanced_bst(vals, mid + 1, hi)
    return node


def lca_general(root, p, q):
    """Cách 1: LCA của cây nhị phân bất kỳ (LC 236), hậu thứ tự, O(n)."""
    if root is None or root is p or root is q:
        return root
    l = lca_general(root.left, p, q)
    r = lca_general(root.right, p, q)
    if l and r:
        return root
    return l or r


def path_to(root, target):
    path, node = [], root
    while node is not None:
        path.append(node)
        if node is target:
            break
        node = node.left if target.val < node.val else node.right
    return path


def lca_paths(root, p, q):
    """Cách 2: hai đường đi từ gốc, nút chung cuối cùng. O(h) thời gian và bộ nhớ."""
    a, b = path_to(root, p), path_to(root, q)
    i = 0
    while i < len(a) and i < len(b) and a[i] is b[i]:
        i += 1
    return a[i - 1]


def lca_recursive(node, p, q):
    """Cách 3: đi xuống theo thứ tự, đệ quy. O(h) thời gian, O(h) ngăn xếp."""
    if node is None:
        return None
    if p.val < node.val and q.val < node.val:
        return lca_recursive(node.left, p, q)
    if p.val > node.val and q.val > node.val:
        return lca_recursive(node.right, p, q)
    return node


def lca_iterative(root, p, q):
    """Cách 4: cùng phép đi bằng vòng lặp. O(h) thời gian, O(1) bộ nhớ."""
    node = root
    while node is not None:
        if p.val < node.val and q.val < node.val:
            node = node.left
        elif p.val > node.val and q.val > node.val:
            node = node.right
        else:
            return node
    return None


def lca_product(root, p, q):
    """Biến thể nhân hai hiệu: int của Python không tràn, nên dấu luôn đúng."""
    node = root
    while node is not None:
        if (node.val - p.val) * (node.val - q.val) <= 0:
            return node
        node = node.left if p.val < node.val else node.right
    return None


def wrong_assume_ordered(root, p, q):
    """Hiểu sai: tưởng p luôn nhỏ hơn q."""
    node = root
    while node is not None:
        if q.val < node.val:
            node = node.left
        elif p.val > node.val:
            node = node.right
        else:
            return node
    return None


T = [20, 10, 30, 5, 15, 25, 35, None, None, 12, 17]
CASES = [
    ("hai phía của gốc (5, 35)", lambda: build(T), 5, 35, 20),
    ("cùng bên trái (5, 17)", lambda: build(T), 5, 17, 10),
    ("p là tổ tiên của q (10, 12)", lambda: build(T), 10, 12, 10),
    ("p lớn hơn q (17, 12)", lambda: build(T), 17, 12, 15),
    ("cùng bên phải (25, 35)", lambda: build(T), 25, 35, 30),
    ("gốc là p (20, 17)", lambda: build(T), 20, 17, 20),
    ("cây 2 nút (2, 1)", lambda: build([2, 1]), 2, 1, 2),
    ("giá trị ±10⁹ (10⁹, 10⁹ − 1)", lambda: build([-10**9, None, 10**9, 999999999]), 10**9, 999999999, 10**9),
    ("cùng phía, hiệu cỡ 5·10⁴ (50000, 50001)", lambda: build([0, None, 50000, None, 50001]), 50000, 50001, 50000),
    ("chuỗi tăng 10⁵ nút (99998, 99999)", lambda: right_chain(100000), 99998, 99999, 99998),
]


def check(fn):
    bad = []
    for name, make, pv, qv, want in CASES:
        root = make()
        try:
            r = fn(root, find(root, pv), find(root, qv))
            got = "None" if r is None else str(r.val)
        except Exception as e:  # RecursionError ở chuỗi dài
            got = "ném " + type(e).__name__
        if got != str(want):
            bad.append(f"{name} → {got}")
    tail = "; sai ở " + ", ".join(bad) if bad else ""
    print(f"{fn.__name__:<20} {len(CASES) - len(bad)}/{len(CASES)} ca đúng{tail}")


for fn in (lca_general, lca_paths, lca_recursive, lca_iterative, lca_product, wrong_assume_ordered):
    check(fn)

# Đo trên BST cân 2^17 - 1 nút với 2000 cặp ngẫu nhiên.
n = 2**17 - 1
root = balanced_bst(list(range(n)), 0, n - 1)
rng = random.Random(17)
pairs = []
for _ in range(2000):
    a, b = rng.sample(range(n), 2)
    pairs.append((find(root, a), find(root, b)))
G = 20
t0 = time.perf_counter()
for p, q in pairs[:G]:
    lca_general(root, p, q)
gt = (time.perf_counter() - t0) * 1e6 / G
t0 = time.perf_counter()
for p, q in pairs:
    lca_iterative(root, p, q)
wt = (time.perf_counter() - t0) * 1e6 / len(pairs)
print(f"\nBST cân {n} nút, cặp ngẫu nhiên, mỗi truy vấn: tổng quát {gt:,.0f} µs, đi theo thứ tự {wt:.2f} µs")
