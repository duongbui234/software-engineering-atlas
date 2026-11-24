# LC 572 Subtree of Another Tree: so ở mọi nút O(m·n), tuần tự hóa + tìm chuỗi (có sẵn hoặc KMP),
# hash Merkle kiểm lại khi trùng, và đánh số cây con (không va chạm).
# Chạy: python3 subtree.py
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


def chain(n, bottom=1):
    """Cây lệch trái n nút giá trị 1, nút sâu nhất mang giá trị bottom."""
    root = None
    for i in range(n):
        root = TreeNode(bottom if i == 0 else 1, root)
    return root


def is_same(p, q):
    """So hai cây (bài 100), bản vòng lặp."""
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


def preorder_nodes(root):
    out, stack = [], [root]
    while stack:
        n = stack.pop()
        if n is not None:
            out.append(n)
            stack.append(n.right)
            stack.append(n.left)
    return out


# Cách 1 (dạng đệ quy quen thuộc). Cây lệch 2000 nút đã vượt giới hạn đệ quy mặc định 1000 của Python.
def is_same_rec(p, q):
    if p is None or q is None:
        return p is q
    return p.val == q.val and is_same_rec(p.left, q.left) and is_same_rec(p.right, q.right)


def is_subtree_recursive(root, sub):
    if root is None:
        return sub is None
    return is_same_rec(root, sub) or is_subtree_recursive(root.left, sub) or is_subtree_recursive(root.right, sub)


# Cách 1 (vòng lặp): thử so ở từng nút. O(m·n) xấu nhất.
def is_subtree_naive(root, sub):
    if sub is None:
        return True
    return any(is_same(node, sub) for node in preorder_nodes(root))


def serialize_string(root):
    """Preorder: mỗi nút ",giá trị", mỗi chỗ trống ",#". Dấu phẩy đứng TRƯỚC mỗi phần tử."""
    parts, stack = [], [root]
    while stack:
        n = stack.pop()
        if n is None:
            parts.append(",#")
            continue
        parts.append(f",{n.val}")
        stack.append(n.right)
        stack.append(n.left)
    return "".join(parts)


# Cách 2a: tuần tự hóa rồi dùng toán tử in của chuỗi.
def is_subtree_string(root, sub):
    return serialize_string(sub) in serialize_string(root)


def serialize_list(root):
    """Preorder thành list; chỗ trống là None."""
    out, stack = [], [root]
    while stack:
        n = stack.pop()
        if n is None:
            out.append(None)
            continue
        out.append(n.val)
        stack.append(n.right)
        stack.append(n.left)
    return out


def kmp_contains(text, pat):
    fail = [0] * len(pat)
    k = 0
    for i in range(1, len(pat)):
        while k and pat[i] != pat[k]:
            k = fail[k - 1]
        if pat[i] == pat[k]:
            k += 1
        fail[i] = k
    k = 0
    for x in text:
        while k and x != pat[k]:
            k = fail[k - 1]
        if x == pat[k]:
            k += 1
            if k == len(pat):
                return True
    return False


# Cách 2b: tuần tự hóa thành list rồi KMP.
def is_subtree_kmp(root, sub):
    return kmp_contains(serialize_list(root), serialize_list(sub))


M32 = 0xFFFFFFFF
NULL_HASH = 0x165667B1


def fmix32(h):
    """Hàm trộn cuối của MurmurHash3, cắt về 32 bit sau mỗi phép nhân."""
    h ^= h >> 16
    h = (h * 0x85EBCA6B) & M32
    h ^= h >> 13
    h = (h * 0xC2B2AE35) & M32
    return h ^ (h >> 16)


def node_hash(val, hl, hr):
    return fmix32(((hl * 0x9E3779B1) & M32) ^ (((hr ^ 0x85EBCA6B) * 0xC2B2AE35) & M32) ^ ((val + 0x27D4EB2F) & M32))


def subtree_hashes(root, h, null_h):
    """Hash mọi cây con, từ dưới lên (preorder ngược)."""
    hashes = {}
    for n in reversed(preorder_nodes(root)):
        hashes[n] = h(n.val, hashes[n.left] if n.left else null_h, hashes[n.right] if n.right else null_h)
    return hashes


# Cách 3: hash Merkle, trùng hash thì so lại thật.
def is_subtree_hash(root, sub):
    if sub is None:
        return True
    target = subtree_hashes(sub, node_hash, NULL_HASH)[sub]
    return any(h == target and is_same(n, sub) for n, h in subtree_hashes(root, node_hash, NULL_HASH).items())


# Cách 4: đánh số cây con. Khóa là bộ (giá trị, số con trái, số con phải): hai cây cùng số khi và chỉ khi giống hệt.
def is_subtree_ids(root, sub):
    if sub is None:
        return True
    ids, id_of = {}, {None: 0}
    for n in reversed(preorder_nodes(sub)):
        id_of[n] = ids.setdefault((n.val, id_of[n.left], id_of[n.right]), len(ids) + 1)
    target = id_of[sub]
    for n in reversed(preorder_nodes(root)):
        id_of[n] = ids.get((n.val, id_of[n.left], id_of[n.right]), -1)  # -1: không có trong sub
        if id_of[n] == target:
            return True
    return False


# SAI: dấu phẩy chỉ đứng SAU mỗi phần tử: "12,#,#," chứa "2,#,#,".
def wrong_no_leading_delimiter(root, sub):
    def s(t):
        return serialize_string(t)[1:] + ","

    return s(sub) in s(root)


CASES = [
    ("khớp nhánh trái", build([7, 8, 9, 4, 5]), build([8, 4, 5]), True),
    ("nút 5 có thêm con", build([7, 8, 9, 4, 5, None, None, None, None, 6]), build([8, 4, 5]), False),
    ("12 và 2", build([12]), build([2]), False),
    ("-3 và 3", build([-3]), build([3]), False),
    ("trùng cả cây", build([1, 2, 3]), build([1, 2, 3]), True),
    ("sub là lá", build([1, 2, 3]), build([3]), True),
    ("lá và nút có con", build([1, 2, 3, None, None, 4]), build([3]), False),
    ("giá trị lặp", build([1, 1]), build([1]), True),
    ("trái và phải", build([1, 2]), build([1, None, 2]), False),
    ("cùng tổng giá trị", build([1, 2, 3]), build([3, 1, 2]), False),
    ("số âm", build([-1, -2, -3]), build([-3]), True),
    ("trùng Objects.hash", build([1, 1]), build([1, None, 961]), False),
    ("lệch 2000 và 1000", chain(2000), chain(1000), True),
    ("lệch, đáy khác", chain(2000), chain(1000, 2), False),
]

FNS = [is_subtree_recursive, is_subtree_naive, is_subtree_string, is_subtree_kmp, is_subtree_hash, is_subtree_ids,
       wrong_no_leading_delimiter]
for fn in FNS:
    bad = []
    for name, root, sub, want in CASES:
        try:
            got = fn(root, sub)
        except Exception as e:  # noqa: BLE001
            got = "ném " + type(e).__name__
        if got != want:
            bad.append(f"{name} → {got}")
    tail = "; sai ở " + ", ".join(bad) if bad else ""
    print(f"{fn.__name__:<27} {len(CASES) - len(bad)}/{len(CASES)} ca đúng{tail}")


def median_ms(fn, reps=5):
    ts = []
    for _ in range(reps):
        t0 = time.perf_counter()
        fn()
        ts.append((time.perf_counter() - t0) * 1000)
    return sorted(ts)[reps // 2]


print("\nroot lệch m nút, sub lệch n nút khác ở đáy, trung vị 5 lần (ms)")
print(f"{'m':<9} {'n':<8} " + " ".join(f"{x:>8}" for x in ("mọi nút", "in", "KMP", "hash", "đánh số")))
for m, n in ((2000, 1000), (20000, 10000), (200000, 100000), (2_000_000, 1_000_000)):
    root, sub = chain(m), chain(n, 2)
    row = []
    for fn in (is_subtree_naive, is_subtree_string, is_subtree_kmp, is_subtree_hash, is_subtree_ids):
        if fn is is_subtree_naive and m > 2000:
            row.append("")  # 1,5·10⁸ lần so ở cỡ 20000: quá chậm với vòng lặp Python
            continue
        row.append(f"{median_ms(lambda: fn(root, sub), 5 if m <= 200000 else 3):.2f}")
    print(f"{m:<9} {n:<8} " + " ".join(f"{x:>8}" for x in row))
