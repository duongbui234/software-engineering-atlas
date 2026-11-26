# Ga GRPH-03: sắp xếp topo cho ba bài Course Schedule, Course Schedule II, Alien Dictionary.
# Chạy: python3 topological_sort.py
import sys
from collections import deque

# DFS đệ quy trên chuỗi 2 000 môn sâu 2 000 tầng; Python mặc định chỉ cho khoảng 1 000.
sys.setrecursionlimit(10_000)


# ---------- Khuôn chung: thuật toán Kahn ----------
# n đỉnh 0..n-1, edges là các cặp (trước, sau). Trả về thứ tự lấy ra được.
# Nếu thứ tự ngắn hơn n thì đồ thị có chu trình.
def kahn(n, edges):
    adj = [[] for _ in range(n)]
    indeg = [0] * n
    for before, after in edges:
        adj[before].append(after)
        indeg[after] += 1  # "after" còn chờ thêm một việc
    queue = deque(v for v in range(n) if indeg[v] == 0)
    order = []
    while queue:
        v = queue.popleft()
        order.append(v)
        for w in adj[v]:
            indeg[w] -= 1
            if indeg[w] == 0:  # hết việc phải chờ: sẵn sàng
                queue.append(w)
    return order


# Đề cho [a, b] nghĩa là "học b trước a", tức cạnh b → a.
def to_edges(prerequisites):
    return [(b, a) for a, b in prerequisites]


# ---------- 207. Course Schedule: chỉ hỏi có học hết được không ----------
def can_finish(num_courses, prerequisites):
    return len(kahn(num_courses, to_edges(prerequisites))) == num_courses


# Cách thứ hai: DFS ba màu. Trắng = chưa thăm, xám = đang trên đường đi, đen = đã xong.
WHITE, GRAY, BLACK = 0, 1, 2


def can_finish_dfs(num_courses, prerequisites):
    adj = [[] for _ in range(num_courses)]
    for b, a in to_edges(prerequisites):
        adj[b].append(a)
    color = [WHITE] * num_courses

    def has_cycle_from(v):
        color[v] = GRAY
        for w in adj[v]:
            if color[w] == GRAY:  # quay lại một đỉnh còn trên đường: chu trình
                return True
            if color[w] == WHITE and has_cycle_from(w):
                return True
        color[v] = BLACK
        return False

    return not any(color[v] == WHITE and has_cycle_from(v) for v in range(num_courses))


# ---------- 210. Course Schedule II: trả về một thứ tự học ----------
def find_order(num_courses, prerequisites):
    order = kahn(num_courses, to_edges(prerequisites))
    return order if len(order) == num_courses else []


# DFS: một môn "xong" (tô đen) sau mọi môn đứng sau nó. Đảo ngược thứ tự xong là thứ tự topo.
def find_order_dfs(num_courses, prerequisites):
    adj = [[] for _ in range(num_courses)]
    for b, a in to_edges(prerequisites):
        adj[b].append(a)
    color = [WHITE] * num_courses
    finished = []

    def visit(v):
        color[v] = GRAY
        for w in adj[v]:
            if color[w] == GRAY:
                return False
            if color[w] == WHITE and not visit(w):
                return False
        color[v] = BLACK
        finished.append(v)
        return True

    for v in range(num_courses):
        if color[v] == WHITE and not visit(v):
            return []
    return finished[::-1]


# ---------- 269. Alien Dictionary: tự dựng cạnh từ các cặp từ kề nhau ----------
def alien_order(words):
    letters = []  # theo thứ tự xuất hiện đầu tiên
    ids = {}
    for word in words:
        for ch in word:
            if ch not in ids:
                ids[ch] = len(letters)
                letters.append(ch)
    edges = []
    seen_edge = set()
    for a, b in zip(words, words[1:]):
        n = min(len(a), len(b))
        j = 0
        while j < n and a[j] == b[j]:
            j += 1
        if j == n:
            if len(a) > len(b):
                return ""  # "abc" đứng trước "ab": danh sách sai
            continue  # một từ là đầu của từ kia: không cho biết gì
        if (a[j], b[j]) not in seen_edge:  # mỗi cạnh chỉ thêm một lần, để danh sách kề và bậc vào khớp nhau
            seen_edge.add((a[j], b[j]))
            edges.append((ids[a[j]], ids[b[j]]))
    order = kahn(len(letters), edges)
    return "".join(letters[v] for v in order) if len(order) == len(letters) else ""


# ---------- Kiểm tra ----------
def is_valid_order(n, prerequisites, order):
    if len(order) != n or sorted(order) != list(range(n)):
        return False
    pos = {v: i for i, v in enumerate(order)}
    return all(pos[b] < pos[a] for a, b in prerequisites)


def sort_key(alphabet):
    rank = {c: i for i, c in enumerate(alphabet)}
    return lambda w: [rank[c] for c in w]


# Danh sách từ có được xếp đúng theo bảng chữ `alphabet` không, và có đủ mọi chữ không.
def sorted_by(words, alphabet):
    if set("".join(words)) != set(alphabet) or len(alphabet) != len(set(alphabet)):
        return False
    key = sort_key(alphabet)
    return all(key(a) <= key(b) for a, b in zip(words, words[1:]))


# Bộ sinh số giả ngẫu nhiên cố định hạt giống, để lần chạy nào cũng như nhau.
seed = 42


def rand(k):
    global seed
    seed = seed * 48271 % 2147483647
    return seed % k


# Trang phục buổi sáng: 0 tất, 1 quần, 2 áo sơ mi, 3 giày, 4 thắt lưng, 5 cà vạt, 6 áo khoác.
outfit = [[3, 0], [3, 1], [4, 1], [4, 2], [5, 2], [6, 5], [6, 4]]
chain = [[i + 1, i] for i in range(1999)]
graphs = []
for _ in range(300):
    n = 1 + rand(8)
    m = rand(10)
    graphs.append((n, [[rand(n), rand(n)] for _ in range(m)]))
alien_lists = []
for _ in range(200):
    pool = "abcdef"[: 2 + rand(5)]
    words = []
    for _ in range(2 + rand(6)):
        words.append("".join(pool[rand(len(pool))] for _ in range(1 + rand(3))))
    # xếp theo một bảng chữ đảo ngược, để đáp án không trùng thứ tự a-z
    words.sort(key=sort_key(pool[::-1]))
    alien_lists.append(words)


def order_ok(n, p):
    o = find_order(n, p)
    if can_finish(n, p):
        return is_valid_order(n, p, o) and is_valid_order(n, p, find_order_dfs(n, p))
    return o == []


cases = [
    ("207 hai môn, một điều kiện", can_finish(2, [[1, 0]]) is True),
    ("207 hai môn chờ nhau: chu trình", can_finish(2, [[1, 0], [0, 1]]) is False),
    ("207 môn tự cần chính nó", can_finish(1, [[0, 0]]) is False),
    ("207 chuỗi 2 000 môn", can_finish(2000, chain) and can_finish_dfs(2000, chain)),
    ("207 Kahn và DFS ba màu khớp nhau trên 300 đồ thị",
     all(can_finish(n, p) == can_finish_dfs(n, p) for n, p in graphs)),
    ("210 trang phục buổi sáng", find_order(7, outfit) == [0, 1, 2, 3, 4, 5, 6]),
    ("210 DFS cũng cho thứ tự hợp lệ", is_valid_order(7, outfit, find_order_dfs(7, outfit))),
    ("210 có chu trình thì trả mảng rỗng", find_order(3, [[0, 1], [1, 2], [2, 0]]) == []),
    ("210 thứ tự hợp lệ trên 300 đồ thị", all(order_ok(n, p) for n, p in graphs)),
    ("269 ví dụ bốn từ", alien_order(["ba", "bc", "ac", "cab"]) == "bac"),
    ("269 hai chữ ngược nhau: chu trình", alien_order(["z", "x", "z"]) == ""),
    ("269 từ dài đứng trước đầu của nó", alien_order(["abc", "ab"]) == ""),
    ("269 chữ không có cạnh vẫn phải có mặt", sorted_by(["za", "zb"], alien_order(["za", "zb"]))),
    ("269 khớp bảng chữ trên 200 danh sách ngẫu nhiên",
     all(sorted_by(l, alien_order(l)) for l in alien_lists)),
]

ok = 0
for name, passed in cases:
    if passed:
        ok += 1
    else:
        print("SAI:", name)
print(f"topological_sort {ok}/{len(cases)} ca đúng")
