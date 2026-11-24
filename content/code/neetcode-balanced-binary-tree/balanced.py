# LC 110 Balanced Binary Tree: từ trên xuống, từ dưới lên với giá trị canh -1, bản lặp, và giới hạn đệ quy ở 5000 nút.
# Chạy: python3 balanced.py
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


def fib_tree(h):
    """Con trái bậc h-1, con phải bậc h-2: cân ở mọi nút, lá ở nhiều độ sâu."""
    return None if h <= 0 else TreeNode(h, fib_tree(h - 1), fib_tree(h - 2))


def height(node):
    return 0 if node is None else 1 + max(height(node.left), height(node.right))


def balanced_top_down(root):
    """Cách 1: tính lại chiều cao ở mỗi nút. O(n log n) với cây cân."""
    if root is None:
        return True
    return abs(height(root.left) - height(root.right)) <= 1 and balanced_top_down(root.left) and balanced_top_down(root.right)


def balanced_bottom_up(root):
    """Cách 2: check trả chiều cao, hoặc -1 khi cây con đã lệch. O(n)."""
    def check(node):
        if node is None:
            return 0
        l = check(node.left)
        if l == -1:
            return -1
        r = check(node.right)
        if r == -1 or abs(l - r) > 1:
            return -1
        return 1 + max(l, r)

    return check(root) != -1


def balanced_iterative(root):
    """Cách 3: tiền thứ tự bằng ngăn xếp, xử lý ngược; không giới hạn độ sâu."""
    if root is None:
        return True
    order, stack = [], [root]
    while stack:
        node = stack.pop()
        order.append(node)
        if node.left:
            stack.append(node.left)
        if node.right:
            stack.append(node.right)
    h = {None: 0}
    for node in reversed(order):
        l, r = h[node.left], h[node.right]
        if abs(l - r) > 1:
            return False
        h[node] = 1 + max(l, r)
    return True


def wrong_min_max_depth(root):
    """SAI: so lá nông nhất với lá sâu nhất. Đó là định nghĩa khác, chặt hơn."""
    if root is None:
        return True
    depths, stack = [], [(root, 1)]
    while stack:
        n, d = stack.pop()
        if not n.left and not n.right:
            depths.append(d)
        for c in (n.left, n.right):
            if c:
                stack.append((c, d + 1))
    return max(depths) - min(depths) <= 1


CASES = [
    ("cây rỗng", lambda: None, True),
    ("một nút", lambda: build([1]), True),
    ("cây đầy 7 nút", lambda: build([1, 2, 3, 4, 5, 6, 7]), True),
    ("lệch ngay ở gốc", lambda: build([1, 2, None, 3]), False),
    ("gốc cân, con lệch", lambda: build([1, 2, 3, 4, None, None, 5, 6, None, None, 7]), False),
    ("chuỗi 4 nút (-1 cạnh 0)", lambda: build([1, 2, None, 3, None, 4]), False),
    ("cây Fibonacci bậc 5", lambda: fib_tree(5), True),
    ("cây đủ 5000 nút", lambda: build(list(range(5000))), True),
    ("chuỗi lệch 5000 nút (giới hạn đề)", lambda: left_chain(5000), False),
]

for fn in (balanced_top_down, balanced_bottom_up, balanced_iterative, wrong_min_max_depth):
    bad = []
    for name, make, want in CASES:
        try:
            got = fn(make())
        except Exception as e:  # noqa: BLE001
            got = "ném " + type(e).__name__
        if got != want:
            bad.append(f"{name} → {got}")
    print(f"{fn.__name__:20} {len(CASES) - len(bad)}/{len(CASES)} ca đúng" + ("; sai ở " + ", ".join(bad) if bad else ""))

print("\ncây hoàn hảo 2^17 - 1 nút, trung vị 5 lần (ms)")
root = build(list(range(2**17 - 1)))
for fn in (balanced_top_down, balanced_bottom_up, balanced_iterative):
    ts = []
    for _ in range(5):
        t0 = time.perf_counter()
        fn(root)
        ts.append((time.perf_counter() - t0) * 1000)
    print(f"{fn.__name__:20} {sorted(ts)[2]:8.1f}")
