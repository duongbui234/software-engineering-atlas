# Ga LINK-03: đệ quy trên cây. Giải 226, 104, 543, 110, 100, 572.
# Chạy: python3 tree_recursion.py
import sys
import time


class TreeNode:
    __slots__ = ("val", "left", "right")

    def __init__(self, val=0, left=None, right=None):
        self.val, self.left, self.right = val, left, right


def from_level(a):
    """Dựng cây từ mảng theo tầng kiểu LeetCode: [1, None, 2] là gốc 1, con phải 2."""
    if not a or a[0] is None:
        return None
    root = TreeNode(a[0])
    queue, q, i = [root], 0, 1
    while q < len(queue) and i < len(a):
        node = queue[q]
        q += 1
        if i < len(a) and a[i] is not None:
            node.left = TreeNode(a[i])
            queue.append(node.left)
        i += 1
        if i < len(a) and a[i] is not None:
            node.right = TreeNode(a[i])
            queue.append(node.right)
        i += 1
    return root


def to_level(root):
    out, queue, q = [], [root], 0
    while q < len(queue):
        node = queue[q]
        q += 1
        out.append(node.val if node else None)
        if node:
            queue += [node.left, node.right]
    while out and out[-1] is None:
        out.pop()
    return out


# 226: đổi chỗ hai con ở mọi nút.
def invert_tree(root):
    if root is None:
        return None
    root.left, root.right = invert_tree(root.right), invert_tree(root.left)
    return root


# 104: chiều cao = 1 + chiều cao con cao hơn.
def max_depth(root):
    if root is None:
        return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))


# 104 không đệ quy: ngăn xếp tự quản lý giữ (nút, độ sâu).
def max_depth_iter(root):
    best, stack = 0, [(root, 1)] if root else []
    while stack:
        node, d = stack.pop()
        best = max(best, d)
        if node.left:
            stack.append((node.left, d + 1))
        if node.right:
            stack.append((node.right, d + 1))
    return best


# 543: hàm trong TRẢ VỀ chiều cao, đường kính được GHI vào biến ngoài (nonlocal).
def diameter_of_binary_tree(root):
    best = 0

    def height(node):
        nonlocal best
        if node is None:
            return 0
        l, r = height(node.left), height(node.right)
        best = max(best, l + r)
        return 1 + max(l, r)

    height(root)
    return best


# 543 không đệ quy: hậu thứ tự bằng ngăn xếp, cờ "đã thăm con".
def diameter_iter(root):
    if root is None:
        return 0
    h = {None: 0}
    stack, best = [(root, False)], 0
    while stack:
        node, children_done = stack.pop()
        if children_done:
            l, r = h[node.left], h[node.right]
            best = max(best, l + r)
            h[node] = 1 + max(l, r)
        else:
            stack.append((node, True))
            if node.right:
                stack.append((node.right, False))
            if node.left:
                stack.append((node.left, False))
    return best


# 110: trả chiều cao, hoặc -1 làm giá trị canh "đã lệch ở dưới".
def is_balanced(root):
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


# 100: đi song song hai cây.
def is_same_tree(p, q):
    if p is None or q is None:
        return p is q
    return p.val == q.val and is_same_tree(p.left, q.left) and is_same_tree(p.right, q.right)


# 572: thử mọi nút làm gốc, so cả cây. O(m · n) trường hợp xấu nhất.
def is_subtree(root, sub):
    if root is None:
        return sub is None
    return is_same_tree(root, sub) or is_subtree(root.left, sub) or is_subtree(root.right, sub)


# Bản ngây thơ để so: tính lại chiều cao từ đầu ở mỗi nút.
def height_slow(node):
    return 1 + max(height_slow(node.left), height_slow(node.right)) if node else 0


def diameter_slow(node):
    if node is None:
        return 0
    return max(height_slow(node.left) + height_slow(node.right), diameter_slow(node.left), diameter_slow(node.right))


def balanced_slow(node):
    if node is None:
        return True
    return abs(height_slow(node.left) - height_slow(node.right)) <= 1 and balanced_slow(node.left) and balanced_slow(node.right)


def mulberry32(a):
    """Bộ sinh ngẫu nhiên mulberry32, mọi phép tính cắt về 32 bit bằng & 0xFFFFFFFF."""
    a &= 0xFFFFFFFF

    def rand():
        nonlocal a
        a = (a + 0x6D2B79F5) & 0xFFFFFFFF
        t = ((a ^ (a >> 15)) * (1 | a)) & 0xFFFFFFFF
        t = ((t + (((t ^ (t >> 7)) * (61 | t)) & 0xFFFFFFFF)) & 0xFFFFFFFF) ^ t
        return ((t ^ (t >> 14)) & 0xFFFFFFFF) / 4294967296

    return rand


def random_tree(n, rand):
    root = None
    for _ in range(n):
        node = TreeNode(int(rand() * 3))
        if root is None:
            root = node
            continue
        p = root
        while True:
            if rand() < 0.5:
                if p.left is None:
                    p.left = node
                    break
                p = p.left
            else:
                if p.right is None:
                    p.right = node
                    break
                p = p.right
    return root


def nodes(root):
    out, stack = [], [root] if root else []
    while stack:
        n = stack.pop()
        out.append(n)
        stack += [c for c in (n.left, n.right) if c]
    return out


def clone(root):
    return TreeNode(root.val, clone(root.left), clone(root.right)) if root else None


def chain(n):
    root = None
    for k in range(n):
        root = TreeNode(k, root, None)
    return root


def random_cases_agree():
    rand = mulberry32(42)
    for _ in range(300):
        root = random_tree(int(rand() * 40), rand)
        if max_depth(root) != max_depth_iter(root):
            return False
        if diameter_of_binary_tree(root) != diameter_slow(root) or diameter_iter(root) != diameter_slow(root):
            return False
        if is_balanced(root) != balanced_slow(root):
            return False
        if not is_same_tree(invert_tree(invert_tree(clone(root))), root):
            return False
        allnodes = nodes(root)
        if allnodes and not is_subtree(root, clone(allnodes[int(rand() * len(allnodes))])):
            return False
    return True


T = from_level
checks = [
    ("226 ví dụ của đề", lambda: to_level(invert_tree(T([4, 2, 7, 1, 3, 6, 9]))) == [4, 7, 2, 9, 6, 3, 1]),
    ("226 cây rỗng", lambda: invert_tree(None) is None),
    ("104 ví dụ của đề", lambda: max_depth(T([3, 9, 20, None, None, 15, 7])) == 3),
    ("104 chỉ có nhánh phải", lambda: max_depth(T([1, None, 2])) == 2),
    ("543 ví dụ của đề", lambda: diameter_of_binary_tree(T([1, 2, 3, 4, 5])) == 3),
    ("543 hai nút", lambda: diameter_of_binary_tree(T([1, 2])) == 1),
    ("543 đường dài nhất không qua gốc", lambda: diameter_of_binary_tree(T([1, 2, None, 3, 4, 5, None, None, 6])) == 4),
    ("110 cây cân bằng", lambda: is_balanced(T([3, 9, 20, None, None, 15, 7])) is True),
    ("110 lệch ở nhánh trái", lambda: is_balanced(T([1, 2, 2, 3, 3, None, None, 4, 4])) is False),
    ("110 gốc cân nhưng con lệch", lambda: is_balanced(T([1, 2, 2, 3, None, None, 3, 4, None, None, 4])) is False),
    ("100 hai cây giống nhau", lambda: is_same_tree(T([1, 2, 3]), T([1, 2, 3])) is True),
    ("100 cùng giá trị, khác hình", lambda: is_same_tree(T([1, 2]), T([1, None, 2])) is False),
    ("572 có cây con", lambda: is_subtree(T([3, 4, 5, 1, 2]), T([4, 1, 2])) is True),
    ("572 khớp đầu nhưng thừa nút dưới", lambda: is_subtree(T([3, 4, 5, 1, 2, None, None, None, None, 0]), T([4, 1, 2])) is False),
    ("300 cây ngẫu nhiên khớp bản chậm", random_cases_agree),
    ("chuỗi lệch 100 000 nút, bản lặp", lambda: max_depth_iter(chain(100_000)) == 100_000 and diameter_iter(chain(100_000)) == 99_999),
]

bad = [name for name, f in checks if not f()]
print(f"tree_recursion {len(checks) - len(bad)}/{len(checks)} ca đúng" + (f"; sai ở {', '.join(bad)}" if bad else ""))


# Đo 1: giới hạn đệ quy mặc định (sys.getrecursionlimit) chặn cây lệch sâu bao nhiêu nút.
def survives(n):
    root = chain(n)
    try:
        max_depth(root)
        return True
    except RecursionError:
        return False


lo, hi = 10, 100_000
while lo < hi:
    mid = (lo + hi + 1) // 2
    if survives(mid):
        lo = mid
    else:
        hi = mid - 1
print(f"104 đệ quy trên cây lệch: giới hạn {sys.getrecursionlimit()}, chịu được {lo} nút, {lo + 1} nút thì RecursionError")

# Nâng giới hạn: từ Python 3.11 lời gọi Python-sang-Python không ăn C stack, nên 10^5 tầng chạy được.
sys.setrecursionlimit(200_000)
deep = chain(100_000)
t0 = time.perf_counter()
d = max_depth(deep)
print(f"104 sau setrecursionlimit(200000): chuỗi 100 000 nút cao {d}, {1000 * (time.perf_counter() - t0):.1f} ms")
sys.setrecursionlimit(1000)


def median(f):
    ts = []
    for _ in range(5):
        t0 = time.perf_counter()
        f()
        ts.append(time.perf_counter() - t0)
    return sorted(ts)[2] * 1000


big = random_tree(200_000, mulberry32(7))
print(f"543 trên cây ngẫu nhiên 2·10^5 nút (cao {max_depth_iter(big)}): đệ quy {median(lambda: diameter_of_binary_tree(big)):.1f} ms, ngăn xếp {median(lambda: diameter_iter(big)):.1f} ms")
