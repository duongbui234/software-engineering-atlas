# LC 100 Same Tree: đệ quy song song, ngăn xếp cặp nút, hàng đợi cặp nút, tuần tự hóa có đánh dấu null.
# Chạy: python3 same_tree.py
import subprocess
import sys
import time
from collections import deque


class TreeNode:
    __slots__ = ("val", "left", "right")

    def __init__(self, val=0, left=None, right=None):
        self.val, self.left, self.right = val, left, right


def build(level):
    """Dựng cây từ mảng theo tầng kiểu LeetCode: None là chỗ trống."""
    if not level or level[0] is None:
        return None
    root = TreeNode(level[0])
    queue, i = deque([root]), 1
    while i < len(level):
        node = queue.popleft()
        if level[i] is not None:
            node.left = TreeNode(level[i])
            queue.append(node.left)
        i += 1
        if i < len(level) and level[i] is not None:
            node.right = TreeNode(level[i])
            queue.append(node.right)
        i += 1
    return root


def chain(n, side="left", val=1):
    """Cây lệch n nút, dựng bằng vòng lặp."""
    root = None
    for _ in range(n):
        t = TreeNode(val)
        setattr(t, side, root)
        root = t
    return root


# Cách 1: đệ quy song song. O(n) thời gian, O(h) ngăn xếp gọi hàm.
def is_same_recursive(p, q):
    if p is None or q is None:
        return p is q  # chỉ đúng khi cả hai cùng None
    return p.val == q.val and is_same_recursive(p.left, q.left) and is_same_recursive(p.right, q.right)


# Cách 2: ngăn xếp các cặp nút (DFS). Không phụ thuộc giới hạn đệ quy.
def is_same_stack(p, q):
    stack = [(p, q)]
    while stack:
        a, b = stack.pop()
        if a is None and b is None:
            continue
        if a is None or b is None or a.val != b.val:
            return False
        stack.append((a.right, b.right))
        stack.append((a.left, b.left))
    return True


# Cách 3: hàng đợi các cặp nút (BFS).
def is_same_queue(p, q):
    queue = deque([(p, q)])
    while queue:
        a, b = queue.popleft()
        if a is None and b is None:
            continue
        if a is None or b is None or a.val != b.val:
            return False
        queue.append((a.left, b.left))
        queue.append((a.right, b.right))
    return True


def serialize(root):
    """Preorder, None ghi thành None. Vòng lặp."""
    out, stack = [], [root]
    while stack:
        node = stack.pop()
        if node is None:
            out.append(None)
            continue
        out.append(node.val)
        stack.append(node.right)
        stack.append(node.left)
    return out


# Cách 4: tuần tự hóa có đánh dấu None rồi so hai list.
def is_same_serialize(p, q):
    return serialize(p) == serialize(q)


# SAI: quên trường hợp đúng một bên None: đọc .val của None.
def wrong_missing_one_none(p, q):
    if p is None and q is None:
        return True
    return p.val == q.val and wrong_missing_one_none(p.left, q.left) and wrong_missing_one_none(p.right, q.right)


CASES = [
    ("giống hệt", build([1, 2, 3]), build([1, 2, 3]), True),
    ("con trái và con phải", build([1, 2]), build([1, None, 2]), False),
    ("đổi chỗ giá trị", build([1, 2, 1]), build([1, 1, 2]), False),
    ("hai cây rỗng", build([]), build([]), True),
    ("một bên rỗng", build([]), build([1]), False),
    ("một nút", build([5]), build([5]), True),
    ("giá trị lớn hơn 127", build([1000, 2000]), build([1000, 2000]), True),
    ("số âm", build([-10000, None, 7]), build([-10000, None, 7]), True),
    ("cây đầy 7 nút", build([1, 2, 3, 4, 5, 6, 7]), build([1, 2, 3, 4, 5, 6, 7]), True),
    ("khác lá cuối", build([1, 2, 3, 4, 5, 6, 7]), build([1, 2, 3, 4, 5, 6, 8]), False),
    ("lệch trái và lệch phải", chain(50, "left"), chain(50, "right"), False),
    ("lệch trái 100 nút", chain(100), chain(100), True),
]

FNS = [is_same_recursive, is_same_stack, is_same_queue, is_same_serialize, wrong_missing_one_none]
for fn in FNS:
    bad = []
    for name, p, q, want in CASES:
        try:
            got = fn(p, q)
        except Exception as e:  # noqa: BLE001
            got = "ném " + type(e).__name__
        if got != want:
            bad.append(f"{name} → {got}")
    tail = "; sai ở " + ", ".join(bad) if bad else ""
    print(f"{fn.__name__:<24} {len(CASES) - len(bad)}/{len(CASES)} ca đúng{tail}")


def works(fn, d):
    try:
        return fn(chain(d), chain(d))
    except RecursionError:
        return False


def deepest_ok(fn):
    lo, hi = 1, 2
    while works(fn, hi):
        lo, hi = hi, hi * 2
    while hi - lo > 1:
        mid = (lo + hi) // 2
        lo, hi = (mid, hi) if works(fn, mid) else (lo, mid)
    return lo


print(f"\ngiới hạn đệ quy mặc định: {sys.getrecursionlimit()}")
print(f"độ sâu lớn nhất bản đệ quy chạy được: {deepest_ok(is_same_recursive)}")
for fn in (is_same_stack, is_same_queue, is_same_serialize):
    print(f"{fn.__name__:<18} cây lệch 10⁶ nút: {works(fn, 1_000_000)}")

# Nâng giới hạn đệ quy: chạy trong tiến trình con, phòng khi tiến trình chết hẳn.
PROBE = """
import sys
sys.setrecursionlimit(2_000_100)
class T:
    __slots__ = ("val", "left", "right")
    def __init__(s, v): s.val, s.left, s.right = v, None, None
def chain(n):
    r = None
    for _ in range(n):
        t = T(1); t.left = r; r = t
    return r
def same(p, q):
    if p is None or q is None:
        return p is q
    return p.val == q.val and same(p.left, q.left) and same(p.right, q.right)
d = int(sys.argv[1])
print(same(chain(d), chain(d)))
"""
for d in (100_000, 1_000_000):
    r = subprocess.run([sys.executable, "-c", PROBE, str(d)], capture_output=True, text=True)
    out = r.stdout.strip() or (r.stderr.strip().splitlines() or ["?"])[-1]
    print(f"setrecursionlimit(2_000_100), cây lệch {d} nút: mã thoát {r.returncode}, {out}")

# Đo: hai cây giống hệt 10⁵ nút (cây tìm kiếm nhị phân từ khóa ngẫu nhiên mulberry32), trung vị 5 lần.
def mulberry32(seed):
    a = seed & 0xFFFFFFFF

    def rnd():
        nonlocal a
        a = (a + 0x6D2B79F5) & 0xFFFFFFFF
        t = ((a ^ (a >> 15)) * (1 | a)) & 0xFFFFFFFF
        t = ((t + (((t ^ (t >> 7)) * (61 | t)) & 0xFFFFFFFF)) & 0xFFFFFFFF) ^ t
        return ((t ^ (t >> 14)) & 0xFFFFFFFF) / 4294967296

    return rnd


rnd = mulberry32(7)
keys = [int(rnd() * 2**31) for _ in range(100_000)]


def bst():
    root = None
    for k in keys:
        t = TreeNode(k)
        if root is None:
            root = t
            continue
        cur = root
        while True:
            if k < cur.val:
                if cur.left is None:
                    cur.left = t
                    break
                cur = cur.left
            else:
                if cur.right is None:
                    cur.right = t
                    break
                cur = cur.right
    return root


p, q = bst(), bst()
print("\nhai cây giống hệt 10⁵ nút, trung vị 5 lần (ms)")
for fn in (is_same_recursive, is_same_stack, is_same_queue, is_same_serialize):
    ts = []
    for _ in range(5):
        t0 = time.perf_counter()
        fn(p, q)
        ts.append((time.perf_counter() - t0) * 1000)
    print(f"{fn.__name__:<18} {sorted(ts)[2]:8.2f}")
