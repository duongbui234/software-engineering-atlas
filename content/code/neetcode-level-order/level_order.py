# Ga LINK-05: duyệt theo tầng và mang trạng thái. Giải 102, 199, 1448.
# Chạy: python3 level_order.py
import math
import time
from collections import deque


class TreeNode:
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


# 102: BFS bằng deque. range(len(queue)) được tính MỘT lần lúc vào vòng for,
# nên nó tự chụp kích thước tầng: con đẩy vào sau không làm vòng for dài thêm.
def level_order(root):
    res = []
    if root is None:
        return res
    queue = deque([root])
    while queue:
        level = []
        for _ in range(len(queue)):  # chụp kích thước tầng
            node = queue.popleft()
            level.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        res.append(level)
    return res


# 102 cách hai: DFS tiền thứ tự mang độ sâu. Trái đi trước nên thứ tự trong tầng vẫn đúng.
def level_order_dfs(root):
    res = []

    def go(node, depth):
        if node is None:
            return
        if len(res) == depth:
            res.append([])
        res[depth].append(node.val)
        go(node.left, depth + 1)
        go(node.right, depth + 1)

    go(root, 0)
    return res


# 199: nút CUỐI của mỗi tầng. Cùng khuôn BFS, chỉ giữ nút i == size - 1.
def right_side_view(root):
    res = []
    if root is None:
        return res
    queue = deque([root])
    while queue:
        size = len(queue)
        for i in range(size):
            node = queue.popleft()
            if i == size - 1:
                res.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
    return res


# 199 cách hai: DFS đi PHẢI trước, mang độ sâu. Lần đầu chạm một độ sâu mới là nút phải nhất của tầng.
def right_side_view_dfs(root):
    res = []

    def go(node, depth):
        if node is None:
            return
        if len(res) == depth:
            res.append(node.val)
        go(node.right, depth + 1)
        go(node.left, depth + 1)

    go(root, 0)
    return res


# 1448: tiền thứ tự, MANG XUỐNG giá trị lớn nhất trên đường từ gốc. Nút tốt khi val >= max đó.
def good_nodes(root):
    def go(node, max_so_far):
        if node is None:
            return 0
        good = 1 if node.val >= max_so_far else 0
        m = max(max_so_far, node.val)
        return good + go(node.left, m) + go(node.right, m)

    return go(root, -math.inf)


# 1448 cách hai: ngăn xếp tự quản lý, mỗi phần tử là cặp (nút, max trên đường tới nó). Không đệ quy.
def good_nodes_iter(root):
    if root is None:
        return 0
    count, stack = 0, [(root, -math.inf)]
    while stack:
        node, max_so_far = stack.pop()
        if node.val >= max_so_far:
            count += 1
        m = max(max_so_far, node.val)
        if node.right:
            stack.append((node.right, m))
        if node.left:
            stack.append((node.left, m))
    return count


# 1448 cách ba: BFS cũng mang được trạng thái, miễn là trạng thái đi CÙNG nút trong hàng đợi.
def good_nodes_bfs(root):
    if root is None:
        return 0
    count, queue = 0, deque([(root, -math.inf)])
    while queue:
        node, max_so_far = queue.popleft()
        if node.val >= max_so_far:
            count += 1
        m = max(max_so_far, node.val)
        if node.left:
            queue.append((node.left, m))
        if node.right:
            queue.append((node.right, m))
    return count


# ---- Các bản SAI, giữ lại để đo ----

# BẪY 102: vòng while đọc len(queue) mỗi lần lặp, nên nuốt luôn con vừa đẩy vào: mọi nút dồn vào một tầng.
# (Python viết "for _ in range(len(queue))" thì không dính; phải cố viết kiểu while mới gặp.)
def level_order_no_snapshot(root):
    res = []
    if root is None:
        return res
    queue = deque([root])
    while queue:
        level = []
        while queue:
            node = queue.popleft()
            level.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        res.append(level)
    return res


# BẪY 199: chỉ đi theo con phải. Sai khi cây con trái sâu hơn.
def right_side_view_only_right(root):
    res, node = [], root
    while node:
        res.append(node.val)
        node = node.right
    return res


# BẪY 1448: chỉ so với cha, không với mọi tổ tiên.
def good_nodes_parent_only(root):
    def go(node, parent):
        if node is None:
            return 0
        return (1 if node.val >= parent else 0) + go(node.left, node.val) + go(node.right, node.val)

    return go(root, -math.inf)


# Vét cạn cho 1448: giữ cả đường đi, quét lại ở mỗi nút. O(n·h), chỉ để đối chiếu.
def good_nodes_brute(root):
    path = []

    def go(node):
        if node is None:
            return 0
        good = 1 if all(v <= node.val for v in path) else 0
        path.append(node.val)
        r = good + go(node.left) + go(node.right)
        path.pop()
        return r

    return go(root)


# ---- Dữ liệu thử ----

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
    """Cây ngẫu nhiên n nút: giá trị trong [-5, 5], cây con trái lấy ngẫu nhiên 0..n-1 nút."""
    if n == 0:
        return None
    node = TreeNode(math.floor(rand() * 11) - 5)
    left_size = math.floor(rand() * n)
    node.left = random_tree(left_size, rand)
    node.right = random_tree(n - 1 - left_size, rand)
    return node


def right_chain(n):
    """Chuỗi lệch phải n nút, giá trị 1..n: mọi nút đều tốt, mỗi tầng một nút."""
    root = cur = TreeNode(1)
    for v in range(2, n + 1):
        cur.right = TreeNode(v)
        cur = cur.right
    return root


def perfect_tree(d, i=1):
    """Cây đầy đủ 2^d - 1 nút, giá trị theo số thứ tự kiểu heap."""
    if d == 0:
        return None
    return TreeNode(i, perfect_tree(d - 1, 2 * i), perfect_tree(d - 1, 2 * i + 1))


fixed = [
    ("102 cây rỗng", lambda: level_order(None) == []),
    ("102 một nút", lambda: level_order(from_level([1])) == [[1]]),
    ("102 bốn tầng", lambda: level_order(from_level([1, 2, 3, 4, None, 5, 6, None, 7])) == [[1], [2, 3], [4, 5, 6], [7]]),
    ("102 chỉ nhánh trái", lambda: level_order(from_level([1, 2, None, 3])) == [[1], [2], [3]]),
    ("199 cây rỗng", lambda: right_side_view(None) == []),
    ("199 nhánh trái sâu hơn", lambda: right_side_view(from_level([1, 2, 3, 4])) == [1, 3, 4]),
    ("199 chỉ nhánh trái", lambda: right_side_view(from_level([5, 4, None, 3])) == [5, 4, 3]),
    ("199 bốn tầng", lambda: right_side_view(from_level([1, 2, 3, 4, None, 5, 6, None, 7])) == [1, 3, 6, 7]),
    ("1448 cây bảy nút", lambda: good_nodes(from_level([2, 1, 5, None, 3, 4, 6])) == 4),
    ("1448 cháu nhỏ hơn ông", lambda: good_nodes(from_level([5, 1, None, 3])) == 1),
    ("1448 giá trị bằng nhau", lambda: good_nodes(from_level([2, 2, 2])) == 3),
    ("1448 gốc âm", lambda: good_nodes(from_level([-1])) == 1),
]

wrong = {"snap": 0, "right": 0, "parent": 0}


def random_case():
    rand = mulberry32(42)
    ok = True
    for _ in range(300):
        root = random_tree(1 + math.floor(rand() * 40), rand)
        lo, rv, g = level_order(root), right_side_view(root), good_nodes_brute(root)
        if lo != level_order_dfs(root):
            ok = False
        if rv != right_side_view_dfs(root) or rv != [l[-1] for l in lo]:
            ok = False
        if not (good_nodes(root) == good_nodes_iter(root) == good_nodes_bfs(root) == g):
            ok = False
        wrong["snap"] += level_order_no_snapshot(root) != lo
        wrong["right"] += right_side_view_only_right(root) != rv
        wrong["parent"] += good_nodes_parent_only(root) != g
    return ok


N = 100_000


def chain_case():
    chain = right_chain(N)
    return good_nodes_iter(chain) == N and len(level_order(chain)) == N and len(right_side_view(chain)) == N


cases = fixed + [
    ("300 cây ngẫu nhiên: mọi cách khớp nhau và khớp vét cạn", random_case),
    ("chuỗi lệch 10^5 nút: 1448 bản ngăn xếp, 102 và 199", chain_case),
]

passed = 0
for name, fn in cases:
    ok = False
    try:
        ok = fn()
    except Exception as e:
        print(f'  lỗi ở "{name}": {type(e).__name__}')
    if ok:
        passed += 1
    else:
        print(f"  sai: {name}")
print(f"level_order {passed}/{len(cases)} ca đúng")
print(f"bẫy trên 300 cây ngẫu nhiên: không chụp kích thước tầng sai {wrong['snap']} cây, "
      f"chỉ đi con phải sai {wrong['right']} cây, chỉ so với cha sai {wrong['parent']} cây")

# ---- Phép đo ----

chain = right_chain(N)
try:
    good_nodes(chain)
    print("1448 đệ quy trên chuỗi 10^5 nút: chạy được")
except RecursionError:
    print(f"1448 đệ quy trên chuỗi 10^5 nút: RecursionError; bản ngăn xếp: {good_nodes_iter(chain)}")


def level_order_list_pop0(root):
    """Như level_order nhưng hàng đợi là list và lấy ra bằng pop(0): mỗi lần lấy dịch cả mảng."""
    res = []
    if root is None:
        return res
    queue = [root]
    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.pop(0)
            level.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        res.append(level)
    return res


def median_ms(fn, runs=5):
    ts = []
    for _ in range(runs):
        t0 = time.perf_counter()
        fn()
        ts.append((time.perf_counter() - t0) * 1000)
    ts.sort()
    return ts[runs // 2]


for d in (15, 16, 17):
    t = perfect_tree(d)
    a = median_ms(lambda: level_order(t))
    b = median_ms(lambda: level_order_list_pop0(t), 3)
    print(f"102 trên cây đầy đủ 2^{d} - 1 nút: deque.popleft() {a:.1f} ms, list.pop(0) {b:.1f} ms")
