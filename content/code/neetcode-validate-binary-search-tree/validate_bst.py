# LC 98 Validate Binary Search Tree: vét cạn max/min cây con, truyền khoảng (đệ quy và lặp),
# trung thứ tự (đệ quy, lặp, Morris), và các cách sai chạy thật.
# Chạy: python3 validate_bst.py
import sys
import time
from collections import deque

INT_MIN, INT_MAX = -(2**31), 2**31 - 1


class TreeNode:
    __slots__ = ("val", "left", "right")

    def __init__(self, val, left=None, right=None):
        self.val, self.left, self.right = val, left, right


def build(arr):
    """Dựng cây từ mảng theo tầng kiểu LeetCode; None là chỗ trống."""
    if not arr or arr[0] is None:
        return None
    root = TreeNode(arr[0])
    q, i = deque([root]), 1
    while q and i < len(arr):
        node = q.popleft()
        if i < len(arr) and arr[i] is not None:
            node.left = TreeNode(arr[i])
            q.append(node.left)
        i += 1
        if i < len(arr) and arr[i] is not None:
            node.right = TreeNode(arr[i])
            q.append(node.right)
        i += 1
    return root


def balanced_bst(lo, hi):
    if lo > hi:
        return None
    mid = (lo + hi) // 2
    return TreeNode(mid, balanced_bst(lo, mid - 1), balanced_bst(mid + 1, hi))


def right_chain(n):
    root = None
    for v in range(n, 0, -1):
        root = TreeNode(v, None, root)
    return root


def chain_bad_bottom(n):
    """Chuỗi phải 1..n-1, nút đáy là con trái của n-1 mang giá trị 0."""
    root = right_chain(n - 1)
    t = root
    while t.right:
        t = t.right
    t.left = TreeNode(0)
    return root


def wrong_parent_child(root):
    """Sai: chỉ so nút với hai con trực tiếp."""
    if root is None:
        return True
    if root.left and root.left.val >= root.val:
        return False
    if root.right and root.right.val <= root.val:
        return False
    return wrong_parent_child(root.left) and wrong_parent_child(root.right)


def _scan(node):
    """Đi hết cây con bằng ngăn xếp, trả (min, max)."""
    mn, mx = float("inf"), float("-inf")
    stack = [node]
    while stack:
        t = stack.pop()
        mn, mx = min(mn, t.val), max(mx, t.val)
        if t.left:
            stack.append(t.left)
        if t.right:
            stack.append(t.right)
    return mn, mx


def brute_max_min(root):
    """Cách 1: ở mọi nút, max cây con trái < nút < min cây con phải. O(n·h)."""
    stack = [root] if root else []
    while stack:
        node = stack.pop()
        if node.left:
            if _scan(node.left)[1] >= node.val:
                return False
            stack.append(node.left)
        if node.right:
            if _scan(node.right)[0] <= node.val:
                return False
            stack.append(node.right)
    return True


def valid_bounds(root):
    """Cách 2: truyền khoảng mở (lo, hi); vô cực của float so được với mọi int."""
    def go(node, lo, hi):
        if node is None:
            return True
        if not (lo < node.val < hi):
            return False
        return go(node.left, lo, node.val) and go(node.right, node.val, hi)

    return go(root, float("-inf"), float("inf"))


def valid_bounds_iterative(root):
    """Cách 2b: cùng phép kiểm khoảng, ngăn xếp tự quản lý."""
    stack = [(root, float("-inf"), float("inf"))] if root else []
    while stack:
        node, lo, hi = stack.pop()
        if not (lo < node.val < hi):
            return False
        if node.left:
            stack.append((node.left, lo, node.val))
        if node.right:
            stack.append((node.right, node.val, hi))
    return True


def valid_inorder(root):
    """Cách 3: trung thứ tự đệ quy; dãy phải tăng ngặt. prev = None nghĩa là chưa gặp nút nào."""
    prev = None

    def go(node):
        nonlocal prev
        if node is None:
            return True
        if not go(node.left):
            return False
        if prev is not None and node.val <= prev:
            return False
        prev = node.val
        return go(node.right)

    return go(root)


def valid_inorder_iterative(root):
    """Cách 3b: trung thứ tự lặp."""
    stack, cur, prev = [], root, None
    while cur or stack:
        while cur:
            stack.append(cur)
            cur = cur.left
        cur = stack.pop()
        if prev is not None and cur.val <= prev:
            return False
        prev = cur.val
        cur = cur.right
    return True


def valid_morris(root):
    """Cách 3c: Morris, bộ nhớ thêm O(1); đi tới hết để gỡ mọi sợi nối tạm."""
    cur, prev, ok = root, None, True
    while cur:
        if cur.left is None:
            if prev is not None and cur.val <= prev:
                ok = False
            prev = cur.val
            cur = cur.right
        else:
            p = cur.left
            while p.right and p.right is not cur:
                p = p.right
            if p.right is None:
                p.right = cur
                cur = cur.left
            else:
                p.right = None
                if prev is not None and cur.val <= prev:
                    ok = False
                prev = cur.val
                cur = cur.right
    return ok


def wrong_prev_int_min(root):
    """Sai: prev bắt đầu bằng INT_MIN, như thể không nút nào bằng nó."""
    prev = INT_MIN

    def go(node):
        nonlocal prev
        if node is None:
            return True
        if not go(node.left):
            return False
        if node.val <= prev:
            return False
        prev = node.val
        return go(node.right)

    return go(root)


CASES = [
    ("một nút", lambda: build([1]), True),
    ("ba nút đúng", lambda: build([2, 1, 3]), True),
    ("cháu phải nhỏ hơn ông", lambda: build([8, 3, 10, None, None, 6, 12]), False),
    ("cháu trái lớn hơn ông", lambda: build([8, 3, 10, 1, 9]), False),
    ("trùng bên trái", lambda: build([5, 5]), False),
    ("trùng bên phải", lambda: build([5, None, 5]), False),
    ("một nút INT_MIN", lambda: build([INT_MIN]), True),
    ("một nút INT_MAX", lambda: build([INT_MAX]), True),
    ("INT_MIN rồi INT_MAX", lambda: build([INT_MIN, None, INT_MAX]), True),
    ("INT_MAX trùng", lambda: build([INT_MAX, INT_MAX]), False),
    ("cây cân 10^4 nút", lambda: balanced_bst(1, 10000), True),
    ("chuỗi phải 10^4 nút", lambda: right_chain(10000), True),
    ("chuỗi 10^4 nút, đáy sai", lambda: chain_bad_bottom(10000), False),
]

FNS = [
    ("brute_max_min", brute_max_min),
    ("valid_bounds", valid_bounds),
    ("valid_bounds_iterative", valid_bounds_iterative),
    ("valid_inorder", valid_inorder),
    ("valid_inorder_iterative", valid_inorder_iterative),
    ("valid_morris", valid_morris),
    ("wrong_parent_child", wrong_parent_child),
    ("wrong_prev_int_min", wrong_prev_int_min),
]


def main():
    for name, fn in FNS:
        bad = []
        for cname, make, want in CASES:
            try:
                got = fn(make())
            except RecursionError:
                got = "ném RecursionError"
            if got != want:
                bad.append(f"{cname} → {got}")
        ok = len(CASES) - len(bad)
        tail = "; sai ở " + ", ".join(bad) if bad else ""
        print(f"{name:<24}{ok}/{len(CASES)} ca đúng{tail}")

    def median_ms(fn, root):
        ts = []
        for _ in range(5):
            t0 = time.perf_counter()
            fn(root)
            ts.append((time.perf_counter() - t0) * 1000)
        return sorted(ts)[2]

    print("\nthời gian trung vị 5 lần (ms), cây đúng")
    print("cây                 n     vét cạn   khoảng (lặp)   trung thứ tự (lặp)   Morris")
    for label, root, n in [
        ("cây cân", balanced_bst(1, 10000), 10000),
        ("chuỗi phải", right_chain(1000), 1000),
        ("chuỗi phải", right_chain(2000), 2000),
        ("chuỗi phải", right_chain(4000), 4000),
    ]:
        b = median_ms(brute_max_min, root)
        k = median_ms(valid_bounds_iterative, root)
        i = median_ms(valid_inorder_iterative, root)
        m = median_ms(valid_morris, root)
        print(f"{label:<12}{n:>8}{b:>12.1f}{k:>15.2f}{i:>21.2f}{m:>9.2f}")

    sys.setrecursionlimit(50_000)
    print("(chuỗi phải 10^4 nút: vét cạn mất khoảng 9 giây mỗi lần nên không đo 5 lần; ca chạy thử ở trên đã gồm nó)")

    print(f"\nsau sys.setrecursionlimit(50000): valid_bounds trên chuỗi phải 10^4 nút → {valid_bounds(right_chain(10000))}")


main()
