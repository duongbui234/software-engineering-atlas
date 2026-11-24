# LC 543 Diameter of Binary Tree: tính lại chiều cao, một lượt hậu thứ tự (nonlocal), bản lặp, và giới hạn đệ quy.
# Chạy: python3 diameter.py
import sys
import time


class TreeNode:
    __slots__ = ("val", "left", "right")

    def __init__(self, val=0, left=None, right=None):
        self.val, self.left, self.right = val, left, right


def build(arr):
    """Dựng cây từ mảng theo tầng kiểu LeetCode; None là chỗ trống."""
    if not arr or arr[0] is None:
        return None
    root = TreeNode(arr[0])
    queue, i = [root], 1
    for node in queue:
        if i >= len(arr):
            break
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
    root = None
    for i in range(n):
        root = TreeNode(i, root)
    return root


def height(node):
    """Số nút trên đường dài nhất đi xuống; cây rỗng là 0."""
    if node is None:
        return 0
    return 1 + max(height(node.left), height(node.right))


def diameter_naive(root):
    """Cách 1: tính lại chiều cao ở mọi nút. O(n log n) cây cân, O(n²) chuỗi lệch."""
    if root is None:
        return 0
    return max(height(root.left) + height(root.right), diameter_naive(root.left), diameter_naive(root.right))


def diameter_one_pass(root):
    """Cách 2: dfs trả chiều cao; best là biến của hàm ngoài nên hàm trong phải khai báo nonlocal."""
    best = 0

    def dfs(node):
        nonlocal best
        if node is None:
            return 0
        l, r = dfs(node.left), dfs(node.right)
        best = max(best, l + r)
        return 1 + max(l, r)

    dfs(root)
    return best


def diameter_iterative(root):
    """Cách 3: tiền thứ tự bằng ngăn xếp, xử lý theo thứ tự ngược: con luôn xong trước cha."""
    if root is None:
        return 0
    order, stack = [], [root]
    while stack:
        node = stack.pop()
        order.append(node)
        if node.left:
            stack.append(node.left)
        if node.right:
            stack.append(node.right)
    h, best = {None: 0}, 0
    for node in reversed(order):
        l, r = h[node.left], h[node.right]
        best = max(best, l + r)
        h[node] = 1 + max(l, r)
    return best


def wrong_no_nonlocal(root):
    """SAI: gán best trong hàm trong mà không có nonlocal. Python coi best là biến cục bộ của dfs,
    nên đọc best trước khi gán ném UnboundLocalError."""
    best = 0

    def dfs(node):
        if node is None:
            return 0
        l, r = dfs(node.left), dfs(node.right)
        best = max(best, l + r)  # noqa: F841
        return 1 + max(l, r)

    dfs(root)
    return best


CASES = [
    ("một nút", lambda: build([7]), 0),
    ("hai nút", lambda: build([7, 3]), 1),
    ("rẽ ở gốc", lambda: build([1, 2, 3, None, 4, 5, 6]), 4),
    ("không đi qua gốc", lambda: build([1, 2, None, 3, 4, 5, None, None, 6, 7, None, None, 8]), 6),
    ("cây đầy 15 nút", lambda: build(list(range(15))), 6),
    ("giá trị âm", lambda: build([-1, -2, -3, -4, None, None, -5]), 4),
    ("chuỗi lệch 10⁴ nút (giới hạn đề)", lambda: left_chain(10000), 9999),
]

for fn in (diameter_naive, diameter_one_pass, diameter_iterative, wrong_no_nonlocal):
    bad = []
    for name, make, want in CASES:
        try:
            got = fn(make())
        except Exception as e:  # noqa: BLE001
            got = "ném " + type(e).__name__
        if got != want:
            bad.append(f"{name} → {got}")
    print(f"{fn.__name__:20} {len(CASES) - len(bad)}/{len(CASES)} ca đúng" + ("; sai ở " + ", ".join(bad) if bad else ""))


def max_depth(fn):
    lo, hi = 1, 100000
    while lo < hi:
        m = (lo + hi + 1) // 2
        try:
            fn(left_chain(m))
            lo = m
        except RecursionError:
            hi = m - 1
    return lo


print(f"\ngiới hạn đệ quy mặc định {sys.getrecursionlimit()}: diameter_one_pass sâu tối đa {max_depth(diameter_one_pass)} nút")
sys.setrecursionlimit(20000)
print(f"sau setrecursionlimit(20000): chuỗi 10⁴ nút → {diameter_one_pass(left_chain(10000))} cạnh")

root = left_chain(1000000)
t0 = time.perf_counter()
d = diameter_iterative(root)
print(f"bản lặp, chuỗi lệch 10⁶ nút: {d} cạnh, {(time.perf_counter() - t0) * 1000:.0f} ms")
