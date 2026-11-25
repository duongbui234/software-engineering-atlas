"""LC 199 Binary Tree Right Side View: BFS chụp cỡ tầng (lấy nút cuối), BFS phải trước (lấy nút đầu),
DFS phải trước (ghi khi gặp tầng mới), DFS trái trước ghi đè, và ba cách sai chạy thật.
Chạy: python3 right_side.py
"""
import random
import time
from collections import deque


class TreeNode:
    __slots__ = ("val", "left", "right")

    def __init__(self, val, left=None, right=None):
        self.val, self.left, self.right = val, left, right


def build(arr):
    """Dựng cây từ mảng theo tầng kiểu LeetCode: None là chỗ trống."""
    if not arr or arr[0] is None:
        return None
    root = TreeNode(arr[0])
    queue, q, i = [root], 0, 1
    while q < len(queue) and i < len(arr):
        node = queue[q]
        q += 1
        if i < len(arr) and arr[i] is not None:
            node.left = TreeNode(arr[i])
            queue.append(node.left)
        i += 1
        if i < len(arr) and arr[i] is not None:
            node.right = TreeNode(arr[i])
            queue.append(node.right)
        i += 1
    return root


def left_chain(n):
    """Chuỗi lệch trái n nút: 1 → 2 → … → n."""
    root = None
    for v in range(n, 0, -1):
        root = TreeNode(v, left=root)
    return root


def complete(n):
    """Cây đầy đủ n nút, giá trị 1..n theo thứ tự tầng."""
    return build(list(range(1, n + 1)))


def bfs_last(root):
    """Cách 1: BFS, chụp cỡ tầng; nút cuối của tầng là nút nhìn thấy."""
    res = []
    if root is None:
        return res
    q = deque([root])
    while q:
        size = len(q)  # range(size) tính một lần, nên con đẩy vào sau không lọt vào tầng này
        for i in range(size):
            node = q.popleft()
            if i == size - 1:
                res.append(node.val)
            if node.left:
                q.append(node.left)
            if node.right:
                q.append(node.right)
    return res


def bfs_right_first(root):
    """Cách 2: BFS đẩy con phải trước; nút đầu của tầng là nút nhìn thấy. Dùng hai list thay cho hàng đợi."""
    res = []
    level = [root] if root else []
    while level:
        res.append(level[0].val)
        nxt = []
        for node in level:
            if node.right:
                nxt.append(node.right)
            if node.left:
                nxt.append(node.left)
        level = nxt
    return res


def dfs_right_first(root):
    """Cách 3: DFS phải trước; nút đầu tiên chạm tới độ sâu mới là nút nhìn thấy."""
    res = []

    def go(node, depth):
        if node is None:
            return
        if depth == len(res):
            res.append(node.val)
        go(node.right, depth + 1)
        go(node.left, depth + 1)

    go(root, 0)
    return res


def dfs_right_first_iterative(root):
    """Cách 3b: DFS phải trước, bản lặp với ngăn xếp tự quản lý."""
    res = []
    stack = [(root, 0)] if root else []
    while stack:
        node, depth = stack.pop()
        if depth == len(res):
            res.append(node.val)
        if node.left:
            stack.append((node.left, depth + 1))  # đẩy trái trước để phải được lấy ra trước
        if node.right:
            stack.append((node.right, depth + 1))
    return res


def dfs_overwrite(root):
    """Cách 4: DFS trái trước, ghi đè res[depth]; lần ghi cuối ở mỗi tầng là nút phải nhất."""
    res = []

    def go(node, depth):
        if node is None:
            return
        if depth == len(res):
            res.append(node.val)
        else:
            res[depth] = node.val
        go(node.left, depth + 1)
        go(node.right, depth + 1)

    go(root, 0)
    return res


def wrong_right_pointers(root):
    """SAI: chỉ đi theo con trỏ phải từ gốc."""
    res = []
    while root:
        res.append(root.val)
        root = root.right
    return res


def wrong_left_first(root):
    """SAI: DFS trái trước mà vẫn ghi lần đầu gặp tầng: ra góc nhìn bên trái."""
    res = []

    def go(node, depth):
        if node is None:
            return
        if depth == len(res):
            res.append(node.val)
        go(node.left, depth + 1)
        go(node.right, depth + 1)

    go(root, 0)
    return res


def wrong_iterate_deque(root):
    """SAI: duyệt `for node in q` rồi popleft/append ngay trong vòng: deque không cho sửa khi đang duyệt."""
    res = []
    if root is None:
        return res
    q = deque([root])
    while q:
        res.append(q[-1].val)
        for node in q:
            q.popleft()
            if node.left:
                q.append(node.left)
            if node.right:
                q.append(node.right)
    return res


CASES = [
    ("cây rỗng", lambda: build([]), []),
    ("một nút", lambda: build([7]), [7]),
    ("cây đầy 7 nút", lambda: build([1, 2, 3, 4, 5, 6, 7]), [1, 3, 7]),
    ("nhánh trái sâu hơn", lambda: build([1, 2, 3, 4]), [1, 3, 4]),
    ("chỉ có nhánh trái", lambda: build([1, 2, None, 3]), [1, 2, 3]),
    ("chỉ có nhánh phải", lambda: build([1, None, 2, None, 3]), [1, 2, 3]),
    ("đáy nằm dưới cây con trái", lambda: build([1, 2, 3, None, 5, None, None, 6]), [1, 3, 5, 6]),
    ("zíc zắc", lambda: build([1, 2, 3, 4, None, None, None, None, 5]), [1, 3, 4, 5]),
    ("giá trị âm và biên", lambda: build([0, -100, 100, -50]), [0, 100, -50]),
    ("chuỗi trái 100 nút", lambda: left_chain(100), list(range(1, 101))),
    ("cây đầy đủ 100 nút", lambda: complete(100), [1, 3, 7, 15, 31, 63, 100]),
]

FNS = [
    ("bfs_last", bfs_last),
    ("bfs_right_first", bfs_right_first),
    ("dfs_right_first", dfs_right_first),
    ("dfs_right_first_iterative", dfs_right_first_iterative),
    ("dfs_overwrite", dfs_overwrite),
    ("wrong_right_pointers", wrong_right_pointers),
    ("wrong_left_first", wrong_left_first),
    ("wrong_iterate_deque", wrong_iterate_deque),
]


def show(a):
    if len(a) > 8:
        return f"[{','.join(map(str, a[:3]))},…,{a[-1]}] ({len(a)} số)"
    return "[" + ",".join(map(str, a)) + "]"


for name, fn in FNS:
    bad = []
    for cname, make, want in CASES:
        try:
            got = show(fn(make()))
        except Exception as e:  # noqa: BLE001
            got = "ném " + type(e).__name__
        if got != show(want):
            bad.append(f"{cname} → {got}")
    ok = len(CASES) - len(bad)
    print(f"{name:<25} {ok}/{len(CASES)} ca đúng" + ("; sai ở " + ", ".join(bad) if bad else ""))

try:
    wrong_iterate_deque(build([1, 2, 3]))
except RuntimeError as e:
    print(f"\nwrong_iterate_deque ném RuntimeError: {e}")

# Đối chiếu ngẫu nhiên: cây 0..30 nút, giá trị −100..100.
rng = random.Random(42)


def random_tree(n):
    if n == 0:
        return None
    root = TreeNode(rng.randint(-100, 100))
    nodes = [root]
    while len(nodes) < n:
        p = rng.choice(nodes)
        t = TreeNode(rng.randint(-100, 100))
        if rng.random() < 0.5:
            if p.left is None:
                p.left = t
                nodes.append(t)
        elif p.right is None:
            p.right = t
            nodes.append(t)
    return root


TRIALS = 3000
agree = right_wrong = 0
for _ in range(TRIALS):
    root = random_tree(rng.randint(0, 30))
    ref = bfs_last(root)
    if all(f(root) == ref for f in (bfs_right_first, dfs_right_first, dfs_right_first_iterative, dfs_overwrite)):
        agree += 1
    if wrong_right_pointers(root) != ref:
        right_wrong += 1
print(f"\nđối chiếu {TRIALS} cây ngẫu nhiên 0..30 nút: năm cách đúng khớp nhau {agree}/{TRIALS}; "
      f"wrong_right_pointers sai {right_wrong} cây")


# Thời gian: hàng đợi bằng list.pop(0) so với deque.popleft và hai list.
def bfs_list_pop0(root):
    res = []
    q = [root] if root else []
    while q:
        size = len(q)
        for i in range(size):
            node = q.pop(0)  # O(len(q)): dời mọi phần tử còn lại lên một ô
            if i == size - 1:
                res.append(node.val)
            if node.left:
                q.append(node.left)
            if node.right:
                q.append(node.right)
    return res


def median(fn, runs=5):
    ts = []
    for _ in range(runs):
        t0 = time.perf_counter()
        fn()
        ts.append((time.perf_counter() - t0) * 1000)
    ts.sort()
    return ts[runs // 2]


print("\nthời gian trung vị 5 lần (ms)")
for label, n in (("2^15 − 1", 2**15 - 1), ("2^16 − 1", 2**16 - 1), ("2^17 − 1", 2**17 - 1)):
    r = complete(n)
    cols = [
        ("deque", median(lambda: bfs_last(r))),
        ("hai list", median(lambda: bfs_right_first(r))),
        ("list.pop(0)", median(lambda: bfs_list_pop0(r))),
        ("DFS lặp", median(lambda: dfs_right_first_iterative(r))),
    ]
    print(f"cây đầy đủ {label:<9} " + "   ".join(f"{k} {v:.1f}" for k, v in cols))

# Đệ quy trên chuỗi dài: ngoài giới hạn đề (100 nút) nhưng là bẫy khi dùng lại hàm.
try:
    dfs_right_first(left_chain(5000))
    print("\ndfs_right_first trên chuỗi trái 5000 nút: chạy được")
except RecursionError:
    print("\ndfs_right_first trên chuỗi trái 5000 nút: ném RecursionError (giới hạn mặc định 1000 tầng)")
print(f"bfs_last trên chuỗi trái 5000 nút: {len(bfs_last(left_chain(5000)))} số")
