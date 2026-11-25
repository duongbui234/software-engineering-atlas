# Ga LINK-04: cây nhị phân tìm kiếm (BST). Giải 235, 98, 230.
# Chạy: python3 bst.py

import math
import time


class TreeNode:
    __slots__ = ("val", "left", "right")

    def __init__(self, val, left=None, right=None):
        self.val, self.left, self.right = val, left, right


def from_level(a):
    """Dựng cây từ mảng theo tầng kiểu LeetCode: [1, None, 2] là gốc 1, con phải 2."""
    if not a or a[0] is None:
        return None
    root = TreeNode(a[0])
    queue, i, q = [root], 1, 0
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


def find(root, v):
    """Tìm nút có giá trị v bằng chính tính chất BST."""
    while root and root.val != v:
        root = root.left if v < root.val else root.right
    return root


# 235: đi một đường từ gốc. Cả hai nhỏ hơn → trái; cả hai lớn hơn → phải; còn lại → đây là đáp án.
def lowest_common_ancestor(root, p, q):
    node = root
    while True:
        if p.val < node.val and q.val < node.val:
            node = node.left
        elif p.val > node.val and q.val > node.val:
            node = node.right
        else:
            return node


# LCA cho cây nhị phân bất kỳ (bài 236): không dùng thứ tự, hỏi cả hai cây con. O(n).
def lca_generic(node, p, q):
    if node is None or node is p or node is q:
        return node
    l, r = lca_generic(node.left, p, q), lca_generic(node.right, p, q)
    return node if l and r else (l or r)


# 98: mỗi nút phải nằm trong khoảng mở (lo, hi) do MỌI tổ tiên đặt ra.
def is_valid_bst(root):
    def check(node, lo, hi):
        if node is None:
            return True
        if not lo < node.val < hi:
            return False
        return check(node.left, lo, node.val) and check(node.right, node.val, hi)

    return check(root, -math.inf, math.inf)


# 98 cách hai: trung thứ tự bằng ngăn xếp, giá trị phải tăng ngặt. Không đệ quy.
def is_valid_bst_inorder(root):
    stack, node, prev = [], root, -math.inf
    while node or stack:
        while node:
            stack.append(node)
            node = node.left
        node = stack.pop()
        if node.val <= prev:
            return False
        prev = node.val
        node = node.right
    return True


# BẪY của 98: chỉ so nút với hai con trực tiếp.
def is_valid_bst_parent_child(node):
    if node is None:
        return True
    if node.left and node.left.val >= node.val:
        return False
    if node.right and node.right.val <= node.val:
        return False
    return is_valid_bst_parent_child(node.left) and is_valid_bst_parent_child(node.right)


# 230: trung thứ tự của BST là dãy tăng. Đi bằng ngăn xếp, đếm, dừng ở nút thứ k: O(h + k).
def kth_smallest(root, k):
    stack, node = [], root
    while True:
        while node:
            stack.append(node)
            node = node.left
        node = stack.pop()
        k -= 1
        if k == 0:
            return node.val
        node = node.right


# 230 cách thẳng: gom cả trung thứ tự ra danh sách. Luôn O(n).
def inorder_values(root, out=None):
    if out is None:
        out = []
    if root:
        inorder_values(root.left, out)
        out.append(root.val)
        inorder_values(root.right, out)
    return out


def kth_smallest_full(root, k):
    return inorder_values(root)[k - 1]


# 230 bằng generator đệ quy: gọn, nhưng mỗi giá trị phải đi ngược qua h tầng `yield from`.
def inorder_gen(node):
    if node:
        yield from inorder_gen(node.left)
        yield node.val
        yield from inorder_gen(node.right)


def kth_smallest_gen(root, k):
    for i, v in enumerate(inorder_gen(root), 1):
        if i == k:
            return v


def insert(root, v):
    p = root
    while True:
        if v == p.val:
            return False
        if v < p.val:
            if p.left is None:
                p.left = TreeNode(v)
                return True
            p = p.left
        else:
            if p.right is None:
                p.right = TreeNode(v)
                return True
            p = p.right


def balanced(lo, hi):
    """BST cân bằng từ dãy 0, 2, 4, …: chọn giữa làm gốc."""
    if lo > hi:
        return None
    mid = (lo + hi) // 2
    return TreeNode(2 * mid, balanced(lo, mid - 1), balanced(mid + 1, hi))


def preorder(root, out=None):
    if out is None:
        out = []
    if root:
        out.append(root)
        preorder(root.left, out)
        preorder(root.right, out)
    return out


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


stats = {"broken": 0, "naive_wrong": 0}


def random_checks():
    """300 BST ngẫu nhiên: 230 so với dãy đã sắp, 235 với LCA tổng quát, 98 trước và sau khi sửa bừa một nút."""
    rand = mulberry32(42)
    for _ in range(300):
        n = 1 + int(rand() * 30)
        root = TreeNode(int(rand() * 100))
        size = 1
        while size < n:
            if insert(root, int(rand() * 100)):
                size += 1
        s = inorder_values(root)
        if any(kth_smallest(root, k) != s[k - 1] for k in range(1, n + 1)):
            return False
        if n >= 2:
            i = int(rand() * n)
            j = (i + 1 + int(rand() * (n - 1))) % n
            p, q = find(root, s[i]), find(root, s[j])
            if lowest_common_ancestor(root, p, q) is not lca_generic(root, p, q):
                return False
        if not is_valid_bst(root) or not is_valid_bst_inorder(root):
            return False
        victim = preorder(root)[int(rand() * n)]  # rút số chọn nút trước, rồi mới rút giá trị mới
        victim.val = int(rand() * 100)
        vals = inorder_values(root)
        ok = all(vals[x - 1] < vals[x] for x in range(1, len(vals)))
        if is_valid_bst(root) != ok or is_valid_bst_inorder(root) != ok:
            return False
        if not ok:
            stats["broken"] += 1
            if is_valid_bst_parent_child(root):
                stats["naive_wrong"] += 1
    return True


T = from_level


def sample():
    return T([20, 10, 30, 5, 15, 25, 35, None, None, 12, 17])


def lca_of(a, b):
    r = sample()
    return lowest_common_ancestor(r, find(r, a), find(r, b)).val


def chain(n):
    r = p = TreeNode(0)
    for v in range(1, n):
        p.right = TreeNode(v)
        p = p.right
    return r


DEEP = [10, 5, 15, None, None, 12, 20, 9]
cases = [
    ("235 hai nút ở hai nhánh của gốc", lambda: lca_of(10, 30) == 20),
    ("235 một nút là tổ tiên của nút kia", lambda: lca_of(10, 17) == 10),
    ("235 hai lá cùng một cha", lambda: lca_of(12, 17) == 15),
    ("235 tách nhau ở tầng giữa", lambda: lca_of(5, 12) == 10),
    ("98 cây ba nút đúng thứ tự", lambda: is_valid_bst(T([5, 3, 8])) and is_valid_bst_inorder(T([5, 3, 8]))),
    ("98 nút sâu vi phạm khoảng của tổ tiên", lambda: not is_valid_bst(T(DEEP)) and not is_valid_bst_inorder(T(DEEP)) and is_valid_bst_parent_child(T(DEEP))),
    ("98 giá trị trùng không hợp lệ", lambda: not is_valid_bst(T([5, 5])) and not is_valid_bst(T([5, None, 5]))),
    ("98 một nút bằng 2^31 − 1", lambda: is_valid_bst(T([2147483647])) and is_valid_bst_inorder(T([2147483647]))),
    ("98 hai đầu mút của int", lambda: is_valid_bst(T([-2147483648, None, 2147483647]))),
    ("230 nhỏ nhất, giữa, lớn nhất", lambda: [kth_smallest(T([20, 10, 30, 5, 15, 25, 35]), k) for k in (1, 4, 7)] == [5, 20, 35]),
    ("230 cây chỉ có nhánh trái", lambda: kth_smallest(T([4, 3, None, 2, None, 1]), 2) == 2),
    ("230 cây chỉ có nhánh phải", lambda: kth_smallest(T([1, None, 2, None, 3]), 3) == 3),
    ("random 300 BST: 235, 98, 230", random_checks),
    ("98 và 230 trên chuỗi lệch 10^5 nút", lambda: is_valid_bst_inorder(chain(100_000)) and kth_smallest(chain(100_000), 99_999) == 99_998),
]

ok = 0
for name, f in cases:
    if f():
        ok += 1
    else:
        print("SAI:", name)
print(f"bst {ok}/{len(cases)} ca đúng")
print(f"98 trên 300 cây bị sửa một nút: {stats['broken']} cây hỏng, cách chỉ so cha-con nhận nhầm {stats['naive_wrong']} cây")

# Đề 98 và 230 cho tới 10^4 nút: một chuỗi lệch 10^4 nút vượt giới hạn đệ quy mặc định (1000).
try:
    is_valid_bst(chain(10_000))
    print("98 đệ quy trên chuỗi 10^4 nút: chạy được")
except RecursionError:
    print(f"98 đệ quy trên chuỗi 10^4 nút: RecursionError; bản ngăn xếp: {is_valid_bst_inorder(chain(10_000))}")


def median(f):
    ts = []
    for _ in range(5):
        t0 = time.perf_counter()
        f()
        ts.append(time.perf_counter() - t0)
    return sorted(ts)[2] * 1000


# Đo trên BST cân bằng 2·10^5 nút (giá trị 0, 2, 4, …), cao 18.
N = 200_000
big = balanced(0, N - 1)
rand = mulberry32(7)
# Cặp hai giá trị liền nhau (v, v + 2): tổ tiên chung nằm sâu, đường đi dài gần bằng chiều cao.
pairs = []
for _ in range(1000):
    v = 2 * int(rand() * (N - 1))
    pairs.append((find(big, v), find(big, v + 2)))
walk = median(lambda: [lowest_common_ancestor(big, p, q) for p, q in pairs]) / len(pairs)
generic = median(lambda: [lca_generic(big, p, q) for p, q in pairs[:5]]) / 5
print(f"235 trên BST cân bằng 2·10^5 nút: đi theo giá trị {walk * 1000:.2f} µs/truy vấn, LCA tổng quát {generic:.1f} ms/truy vấn")


def fmt(ms):
    return f"{ms * 1000:.1f} µs" if ms < 1 else f"{ms:.1f} ms"


for k in (10, N // 2):
    reps = 1000 if k < 1000 else 1  # k nhỏ chạy quá nhanh nên lặp 1000 lần rồi chia
    early = median(lambda: [kth_smallest(big, k) for _ in range(reps)]) / reps
    print(f"230 trên BST cân bằng 2·10^5 nút, k = {k}: dừng sớm {fmt(early)}, gom cả cây {fmt(median(lambda: kth_smallest_full(big, k)))}")
print(f"230 với k = {N}: ngăn xếp {median(lambda: kth_smallest(big, N)):.1f} ms, generator yield from {median(lambda: kth_smallest_gen(big, N)):.1f} ms")
