# LC 104 Maximum Depth of Binary Tree: đệ quy hậu thứ tự, DFS bằng ngăn xếp tự quản, BFS đếm tầng.
# Chạy: python3 max_depth.py
import statistics
import sys
import time
from collections import deque


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val, self.left, self.right = val, left, right


def from_level(vals):
    """Dựng cây từ danh sách theo tầng kiểu LeetCode, ví dụ [1, None, 2]: None là chỗ trống."""
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


# Cách 1: đệ quy. Độ sâu = 1 + độ sâu lớn hơn của hai cây con; cây rỗng sâu 0.
def max_depth_recursive(root):
    if root is None:
        return 0
    return 1 + max(max_depth_recursive(root.left), max_depth_recursive(root.right))


# Cách 2: DFS với ngăn xếp tự quản; mỗi phần tử là (nút, độ sâu của nút).
def max_depth_stack(root):
    best = 0
    stack = [(root, 1)] if root else []
    while stack:
        node, d = stack.pop()
        best = max(best, d)
        if node.left:
            stack.append((node.left, d + 1))
        if node.right:
            stack.append((node.right, d + 1))
    return best


# Cách 3: BFS theo tầng; mỗi vòng ngoài lấy ra đúng số nút của một tầng.
def max_depth_bfs(root):
    if root is None:
        return 0
    queue, depth = deque([root]), 0
    while queue:
        depth += 1
        for _ in range(len(queue)):
            node = queue.popleft()
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
    return depth


# SAI: giữ kỷ lục trong một list làm giá trị mặc định. Python tạo list đó MỘT lần lúc định nghĩa hàm,
# nên kỷ lục của lần gọi trước vẫn còn ở lần gọi sau. Gọi lần đầu thì đúng.
def wrong_mutable_default(root, depth=1, best=[0]):
    if root is None:
        return best[0]
    best[0] = max(best[0], depth)
    wrong_mutable_default(root.left, depth + 1, best)
    wrong_mutable_default(root.right, depth + 1, best)
    return best[0]


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
    ("cây rỗng", [], 0),
    ("một nút", [5], 1),
    ("chỉ có con phải", [1, None, 2], 2),
    ("cây đủ 3 tầng", [1, 2, 3, 4, 5, 6, 7], 3),
    ("nhánh sâu bên phải", [8, 3, 10, 1, 6, None, 14, None, None, 4, 7, 13], 4),
    ("chuỗi trái 6 nút", [1, 2, None, 3, None, 4, None, 5, None, 6], 6),
    ("zigzag 5 tầng", [1, 2, None, None, 3, 4, None, None, 5], 5),
    ("giá trị âm và 0", [0, -1, -2, None, -3], 3),
]

FNS = [max_depth_recursive, max_depth_stack, max_depth_bfs, wrong_mutable_default]
for fn in FNS:
    bad = []
    for name, vals, want in CASES:
        got = fn(from_level(vals))
        if got != want:
            bad.append(f"{name} → {got} (đúng là {want})")
    tail = "; sai ở " + ", ".join(bad) if bad else ""
    print(f"{fn.__name__:22} {len(CASES) - len(bad)}/{len(CASES)} ca đúng{tail}")


def random_tree(rnd, n):
    """Cây ngẫu nhiên n nút: mỗi nút mới gắn vào một chỗ trống chọn ngẫu nhiên; trả kèm độ sâu đúng."""
    if n == 0:
        return None, 0
    root = TreeNode(0)
    slots, depth = [(root, "left", 2), (root, "right", 2)], 1
    for i in range(1, n):
        j = int(rnd() * len(slots))
        parent, side, d = slots[j]
        slots[j] = slots[-1]
        slots.pop()
        node = TreeNode(i)
        setattr(parent, side, node)
        depth = max(depth, d)
        slots += [(node, "left", d + 1), (node, "right", d + 1)]
    return root, depth


rnd = mulberry32(104)
ok = [0, 0, 0]
for _ in range(2000):
    root, want = random_tree(rnd, int(rnd() * 41))
    for j, fn in enumerate(FNS[:3]):
        ok[j] += fn(root) == want
print("\nngẫu nhiên: " + ", ".join(f"{fn.__name__} {ok[j]}/2000" for j, fn in enumerate(FNS[:3])))


def chain(d):
    """Chuỗi lệch trái d nút, dựng bằng vòng lặp (không đệ quy)."""
    root = cur = TreeNode(0)
    for i in range(1, d):
        cur.left = TreeNode(i)
        cur = cur.left
    return root


def timed(fn, root, want, reps=5):
    try:
        ts = []
        for _ in range(reps):
            t0 = time.perf_counter()
            got = fn(root)
            ts.append((time.perf_counter() - t0) * 1000)
        return f"{statistics.median(ts):.2f}" if got == want else f"sai {got}"
    except RecursionError:
        return "RecursionError"


print(f"\nChuỗi lệch trái d nút, trung vị 5 lần (ms), giới hạn đệ quy {sys.getrecursionlimit()}")
print("d          đệ quy   ngăn xếp        BFS")
for d in (500, 1_000, 10_000, 100_000):
    root = chain(d)
    row = [timed(fn, root, d) for fn in FNS[:3]]
    print(f"{d:<8} " + " ".join(x.rjust(14) for x in row))

# Nâng giới hạn: từ Python 3.11, hàm Python gọi hàm Python gần như không chiếm ngăn xếp C,
# nên 10⁵ tầng chạy được. Bản cũ hơn có thể sập cả tiến trình (segfault) thay vì ném lỗi.
sys.setrecursionlimit(200_000)
root = chain(100_000)
print(f"sau setrecursionlimit(200000): chuỗi 100000 nút, đệ quy {timed(max_depth_recursive, root, 100_000)} ms")

n = (1 << 20) - 1
nodes = [TreeNode(i) for i in range(n)]
for i in range(n // 2):
    nodes[i].left, nodes[i].right = nodes[2 * i + 1], nodes[2 * i + 2]
print(f"\nCây đầy đủ {n} nút, trung vị 5 lần (ms)")
for fn in FNS[:3]:
    print(f"{fn.__name__:22} {timed(fn, nodes[0], 20):>8}")
