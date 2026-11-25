# LC 230 Kth Smallest Element in a BST: sắp xếp, trung thứ tự hết cây, trung thứ tự dừng sớm (đệ quy và ngăn xếp),
# Morris, và cây có cỡ cây con cho câu hỏi phụ "chèn/xóa liên tục".
# Chạy: python3 kth_smallest.py
import bisect
import random
import time


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
    queue, q, i = [root], 0, 1
    while q < len(queue) and i < len(arr):
        node = queue[q]
        q += 1
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
    """Chuỗi lệch trái: gốc là n, lá là 1."""
    root = None
    for v in range(1, n + 1):
        t = TreeNode(v)
        t.left = root
        root = t
    return root


def right_chain(n):
    """Chuỗi lệch phải: gốc là 1, lá là n."""
    root = None
    for v in range(n, 0, -1):
        t = TreeNode(v)
        t.right = root
        root = t
    return root


def balanced_range(lo, hi):
    """Cây cân từ dãy lo..hi; giá trị nhỏ thứ k là lo + k - 1."""
    if lo > hi:
        return None
    mid = (lo + hi) // 2
    t = TreeNode(mid)
    t.left = balanced_range(lo, mid - 1)
    t.right = balanced_range(mid + 1, hi)
    return t


def kth_sort(root, k):
    """Cách 1: gom mọi giá trị, sắp xếp, lấy phần tử k-1. O(n log n)."""
    vals, stack = [], [root] if root else []
    while stack:
        node = stack.pop()
        vals.append(node.val)
        if node.left:
            stack.append(node.left)
        if node.right:
            stack.append(node.right)
    vals.sort()
    return vals[k - 1]


def kth_inorder_all(root, k):
    """Cách 2: trung thứ tự đệ quy gom hết (dãy tăng), lấy phần tử k-1. O(n)."""
    out = []

    def walk(node):
        if node is None:
            return
        walk(node.left)
        out.append(node.val)
        walk(node.right)

    walk(root)
    return out[k - 1]


def kth_recursive(root, k):
    """Cách 3: trung thứ tự đệ quy, đếm và dừng khi đủ k. O(h + k)."""
    count = 0
    answer = -1

    def walk(node):
        nonlocal count, answer  # thiếu dòng này: UnboundLocalError
        if node is None or count >= k:
            return
        walk(node.left)
        if count >= k:
            return
        count += 1
        if count == k:
            answer = node.val
            return
        walk(node.right)

    walk(root)
    return answer


def kth_iterative(root, k):
    """Cách 4: trung thứ tự bằng ngăn xếp tự quản lý, lấy ra đủ k nút. O(h + k)."""
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


def kth_morris(root, k):
    """Cách 5: Morris, O(1) bộ nhớ. Chỉ dừng khi đã có đáp án và không còn sợi chỉ nào (pending == 0)."""
    cur, count, answer, pending = root, 0, -1, 0
    while cur:
        if cur.left is None:
            count += 1
            if count == k:
                answer = cur.val
            if count >= k and pending == 0:
                break
            cur = cur.right
        else:
            pred = cur.left
            while pred.right is not None and pred.right is not cur:
                pred = pred.right
            if pred.right is None:
                pred.right = cur  # buộc chỉ quay về cur
                pending += 1
                cur = cur.left
            else:
                pred.right = None  # gỡ chỉ
                pending -= 1
                count += 1
                if count == k:
                    answer = cur.val
                if count >= k and pending == 0:
                    break
                cur = cur.right
    return answer


class SizedNode:
    """Cách 6 (câu hỏi phụ): mỗi nút nhớ cỡ cây con."""
    __slots__ = ("val", "left", "right", "size")

    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
        self.size = 1


def size_of(n):
    return 0 if n is None else n.size


def kth_by_size(root, k):
    """Đi đúng một đường từ gốc: O(h)."""
    node = root
    while True:
        left_size = size_of(node.left)
        if k <= left_size:
            node = node.left
        elif k == left_size + 1:
            return node.val
        else:
            k -= left_size + 1
            node = node.right


def insert_sized(node, v):
    if node is None:
        return SizedNode(v)
    if v < node.val:
        node.left = insert_sized(node.left, v)
    else:
        node.right = insert_sized(node.right, v)
    node.size += 1
    return node


def remove_sized(node, v):
    if v < node.val:
        node.left = remove_sized(node.left, v)
    elif v > node.val:
        node.right = remove_sized(node.right, v)
    else:
        if node.left is None:
            return node.right
        if node.right is None:
            return node.left
        succ = node.right
        while succ.left:
            succ = succ.left
        node.val = succ.val
        node.right = remove_sized(node.right, succ.val)
    node.size = 1 + size_of(node.left) + size_of(node.right)
    return node


def augment(root):
    """Chép cây thường thành cây có size, không đệ quy."""
    if root is None:
        return None
    top = SizedNode(root.val)
    order, stack = [], [(root, top)]
    while stack:
        t, s = stack.pop()
        order.append(s)
        if t.left:
            s.left = SizedNode(t.left.val)
            stack.append((t.left, s.left))
        if t.right:
            s.right = SizedNode(t.right.val)
            stack.append((t.right, s.right))
    for s in reversed(order):
        s.size = 1 + size_of(s.left) + size_of(s.right)
    return top


def kth_augmented(root, k):
    return kth_by_size(augment(root), k)


def wrong_no_nonlocal(root, k):
    """SAI: gán count trong hàm lồng mà không khai nonlocal, nên count thành biến cục bộ của walk."""
    count = 0
    answer = -1

    def walk(node):
        if node is None:
            return
        walk(node.left)
        count += 1  # UnboundLocalError: count được gán trong walk nên Python coi nó là biến cục bộ
        if count == k:
            answer = node.val
        walk(node.right)

    walk(root)
    return answer


def wrong_falsy_zero(root, k):
    """SAI: trả "giá trị hoặc None" rồi kiểm bằng `if l:`. Đáp án 0 bị coi là chưa thấy."""
    count = 0

    def walk(node):
        nonlocal count
        if node is None:
            return None
        l = walk(node.left)
        if l:
            return l
        count += 1
        if count == k:
            return node.val
        return walk(node.right)

    return walk(root)


def snapshot(root):
    out, stack = [], [root] if root else []
    while stack:
        n = stack.pop()
        out.append((n, n.left, n.right))
        if n.left:
            stack.append(n.left)
        if n.right:
            stack.append(n.right)
    return out


def intact(snap):
    return all(n.left is l and n.right is r for n, l, r in snap)


CASES = [
    ("một nút, k = 1", lambda: build([9]), 1, 9),
    ("cây đầy 7 nút, k = 1", lambda: build([8, 4, 12, 2, 6, 10, 14]), 1, 2),
    ("cây đầy 7 nút, k = 4 (gốc)", lambda: build([8, 4, 12, 2, 6, 10, 14]), 4, 8),
    ("cây đầy 7 nút, k = 7", lambda: build([8, 4, 12, 2, 6, 10, 14]), 7, 14),
    ("có giá trị 0, k = 1", lambda: build([3, 1, 5, 0, 2, 4, 6]), 1, 0),
    ("có giá trị 0, k = 2", lambda: build([3, 1, 5, 0, 2, 4, 6]), 2, 1),
    ("đáp án trong cây con phải của con trái, k = 3", lambda: build([10, 5, 15, None, 7, None, 20, 6, 8]), 3, 7),
    ("chuỗi lệch trái 10⁴ nút, k = 1", lambda: left_chain(10000), 1, 1),
    ("chuỗi lệch trái 10⁴ nút, k = 5000", lambda: left_chain(10000), 5000, 5000),
    ("chuỗi lệch phải 10⁴ nút, k = 10⁴", lambda: right_chain(10000), 10000, 10000),
]

FNS = [kth_sort, kth_inorder_all, kth_recursive, kth_iterative, kth_morris, kth_augmented, wrong_no_nonlocal, wrong_falsy_zero]
for fn in FNS:
    bad = []
    for name, make, k, want in CASES:
        root = make()
        snap = snapshot(root)
        try:
            got = fn(root, k)
        except Exception as e:  # noqa: BLE001
            got = "ném " + type(e).__name__
        if got != want:
            bad.append(f"{name} → {got}")
        elif not intact(snap):
            bad.append(f"{name} → {got} nhưng cây bị đổi")
    print(f"{fn.__name__:<17} {len(CASES) - len(bad)}/{len(CASES)} ca đúng" + ("; sai ở " + ", ".join(bad) if bad else ""))


def insert_bst(root, v):
    t = TreeNode(v)
    if root is None:
        return t
    cur = root
    while True:
        if v < cur.val:
            if cur.left is None:
                cur.left = t
                return root
            cur = cur.left
        else:
            if cur.right is None:
                cur.right = t
                return root
            cur = cur.right


rnd = random.Random(230)
T = 2000
agree = 0
for _ in range(T):
    n = rnd.randint(1, 30)
    vals = rnd.sample(range(101), n)
    root = None
    for v in vals:
        root = insert_bst(root, v)
    k = rnd.randint(1, n)
    want = sorted(vals)[k - 1]
    got = [f(root, k) for f in (kth_sort, kth_inorder_all, kth_recursive, kth_iterative, kth_morris, kth_augmented)]
    if all(g == want for g in got):
        agree += 1
print(f"\nđối chiếu {T} cây tìm kiếm ngẫu nhiên 1..30 nút: sáu cách khớp với mảng sắp xếp {agree}/{T}")

rnd = random.Random(7)
root, srt = None, []
queries = ok = 0
for _ in range(5000):
    r = rnd.random()
    if not srt or r < 0.45:
        v = rnd.randint(0, 10000)
        i = bisect.bisect_left(srt, v)
        if i < len(srt) and srt[i] == v:
            continue
        root = insert_sized(root, v)
        srt.insert(i, v)
    elif r < 0.7:
        i = rnd.randrange(len(srt))
        root = remove_sized(root, srt[i])
        srt.pop(i)
    else:
        k = rnd.randint(1, len(srt))
        queries += 1
        if kth_by_size(root, k) == srt[k - 1] and size_of(root) == len(srt):
            ok += 1
print(f"cây có size: 5000 thao tác chèn/xóa/hỏi ngẫu nhiên, {ok}/{queries} câu hỏi khớp mảng sắp xếp")


def median(f, reps=5):
    ts = []
    for _ in range(reps):
        t0 = time.perf_counter()
        f()
        ts.append((time.perf_counter() - t0) * 1000)
    ts.sort()
    return ts[reps // 2]


n = 2**17 - 1
root = balanced_range(0, n - 1)
sized = augment(root)
print(f"\ncây cân {n} nút (cao 17), thời gian trung vị 5 lần (ms)")
print("k        sắp xếp  trung thứ tự hết  đệ quy dừng sớm  ngăn xếp   Morris   theo size")
for k in (1, 100, (n + 1) // 2, n):
    fs = [kth_sort, kth_inorder_all, kth_recursive, kth_iterative, kth_morris]
    ms = [median(lambda f=f: f(root, k)) for f in fs] + [median(lambda: kth_by_size(sized, k))]
    assert kth_iterative(root, k) == k - 1 and kth_morris(root, k) == k - 1 and kth_by_size(sized, k) == k - 1
    w = [9, 18, 17, 10, 9, 12]
    print(f"{k:<6}" + "".join(f"{m:.3f}".rjust(w[i]) for i, m in enumerate(ms)))

rnd = random.Random(99)
n, Q = 20000, 500
root = None
for v in rnd.sample(range(10**9), n):
    root = insert_sized(root, v)
ks = [rnd.randint(1, n) for _ in range(Q)]
t1 = median(lambda: [kth_iterative(root, k) for k in ks], 3)
t2 = median(lambda: [kth_by_size(root, k) for k in ks], 3)
assert [kth_iterative(root, k) for k in ks] == [kth_by_size(root, k) for k in ks]
print(f"\ncây ngẫu nhiên {n} nút, {Q} câu hỏi k ngẫu nhiên: ngăn xếp {t1:.1f} ms, theo size {t2:.2f} ms")
