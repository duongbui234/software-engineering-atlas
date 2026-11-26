# LC 269 Alien Dictionary: rút thứ tự chữ cái từ một danh sách từ đã xếp sẵn.
# Chạy: python3 alien_dictionary.py
import heapq
import time
from collections import deque
from functools import cmp_to_key

A = ord("a")


def code(ch):
    return ord(ch) - A


def chr_(i):
    return chr(A + i)


# Bước chung: so từng cặp từ KỀ NHAU, lấy chữ khác ĐẦU TIÊN làm một cạnh u → v.
# Trả None khi danh sách tự mâu thuẫn: một từ đứng trước phần đầu của chính nó.
def build_graph(words):
    present = [False] * 26
    for w in words:
        for ch in w:
            present[code(ch)] = True  # chữ nào có mặt cũng phải ra
    adj = [[False] * 26 for _ in range(26)]
    indeg = [0] * 26
    for a, b in zip(words, words[1:]):
        n = min(len(a), len(b))
        j = 0
        while j < n and a[j] == b[j]:
            j += 1
        if j == n:
            if len(a) > len(b):
                return None  # "abc" đứng trước "ab": danh bạ sai
            continue  # "ab" trước "abc": hợp lệ, không có manh mối
        u, v = code(a[j]), code(b[j])
        if not adj[u][v]:
            adj[u][v] = True
            indeg[v] += 1  # cạnh trùng chỉ đếm một lần
    return present, adj, indeg


# Kahn trên một đồ thị đã dựng: chữ nào không còn chữ nào phải đứng trước (bậc vào 0) thì viết ra.
def kahn_order(g):
    present, adj, indeg = g
    indeg = indeg[:]
    queue = deque(c for c in range(26) if present[c] and indeg[c] == 0)
    out = []
    while queue:
        u = queue.popleft()
        out.append(chr_(u))
        for v in range(26):
            if adj[u][v]:
                indeg[v] -= 1
                if indeg[v] == 0:
                    queue.append(v)
    return "".join(out) if len(out) == sum(present) else ""  # thiếu chữ nghĩa là có vòng


# Cách 2: dựng đồ thị rồi chạy Kahn.
def alien_order_kahn(words):
    g = build_graph(words)
    return kahn_order(g) if g is not None else ""


# Cách 3: DFS ba màu. Trắng = chưa thăm, xám = đang trên đường đi, đen = xong.
WHITE, GRAY, BLACK = 0, 1, 2


def alien_order_dfs(words):
    g = build_graph(words)
    if g is None:
        return ""
    present, adj, _ = g
    color = [WHITE] * 26
    post = []

    def visit(u):  # sâu nhất 26 tầng, không chạm giới hạn đệ quy
        color[u] = GRAY
        for v in range(26):
            if not adj[u][v]:
                continue
            if color[v] == GRAY:
                return False  # quay về một chữ đang trên đường: có vòng
            if color[v] == WHITE and not visit(v):
                return False
        color[u] = BLACK
        post.append(u)  # u xong sau mọi chữ phải đứng sau nó
        return True

    for u in range(26):
        if present[u] and color[u] == WHITE and not visit(u):
            return ""
    return "".join(chr_(u) for u in reversed(post))


# Biến thể LintCode 892: nhiều đáp án thì trả chuỗi nhỏ nhất theo a..z.
# Thay hàng đợi bằng min-heap: mỗi lượt lấy chữ NHỎ NHẤT đang sẵn sàng.
def alien_order_smallest(words):
    g = build_graph(words)
    if g is None:
        return ""
    present, adj, indeg = g
    indeg = indeg[:]
    heap = [c for c in range(26) if present[c] and indeg[c] == 0]
    heapq.heapify(heap)
    out = []
    while heap:
        u = heapq.heappop(heap)
        out.append(chr_(u))
        for v in range(26):
            if adj[u][v]:
                indeg[v] -= 1
                if indeg[v] == 0:
                    heapq.heappush(heap, v)
    return "".join(out) if len(out) == sum(present) else ""


# Kiểm tra: danh sách có thật sự xếp đúng theo bảng chữ `rank` không?
def is_sorted(words, rank):
    for a, b in zip(words, words[1:]):
        n = min(len(a), len(b))
        j = 0
        while j < n and a[j] == b[j]:
            j += 1
        if j == n:
            if len(a) > len(b):
                return False
            continue
        if rank[code(a[j])] > rank[code(b[j])]:
            return False
    return True


def letters_of(words):
    return "".join(sorted({ch for w in words for ch in w}))


# Cách 1: vét cạn. Thử mọi hoán vị theo thứ tự từ điển, dừng ở hoán vị đầu tiên hợp lệ.
tried = 0


def alien_order_brute(words):
    global tried
    letters = letters_of(words)
    rank = [0] * 26
    used = [False] * len(letters)
    perm = []

    def go():
        global tried
        if len(perm) == len(letters):
            tried += 1
            for i, ch in enumerate(perm):
                rank[code(ch)] = i
            return is_sorted(words, rank)
        for i, ch in enumerate(letters):
            if used[i]:
                continue
            used[i] = True
            perm.append(ch)
            if go():
                return True
            used[i] = False
            perm.pop()
        return False

    return "".join(perm) if go() else ""


# Một đáp án đúng khi: danh sách hợp lệ thì chuỗi chứa đủ mỗi chữ một lần và xếp đúng danh sách;
# danh sách mâu thuẫn thì chuỗi rỗng. LeetCode nhận MỌI thứ tự hợp lệ, nên không so với một chuỗi cố định.
def is_valid_answer(words, answer, expect_valid):
    if not expect_valid:
        return answer == ""
    if "".join(sorted(answer)) != letters_of(words):
        return False
    rank = [0] * 26
    for i, ch in enumerate(answer):
        rank[code(ch)] = i
    return is_sorted(words, rank)


cases = [
    (["bcae", "bcd", "cb", "cab", "ad"], True),  # ví dụ trong bài
    (["zx"], True),  # một từ: không có manh mối nào, thứ tự nào cũng được
    (["abc", "ab"], False),  # từ dài đứng trước phần đầu của nó
    (["a", "b", "a"], False),  # a trước b và b trước a: vòng
    (["ab", "ab"], True),  # hai từ giống nhau
    (["ab", "abc"], True),  # phần đầu đứng trước: hợp lệ
    (["ac", "ab", "zc", "zb"], True),  # cạnh c → b xuất hiện hai lần
    (["ab", "ba"], True),  # chỉ chữ khác ĐẦU TIÊN mới là manh mối
]


def show(s):
    return '""' if s == "" else s


ok = 0
for i, (words, expect_valid) in enumerate(cases):
    tried = 0
    kahn = alien_order_kahn(words)
    dfs = alien_order_dfs(words)
    small = alien_order_smallest(words)
    brute = alien_order_brute(words)
    good = all(is_valid_answer(words, ans, expect_valid) for ans in (kahn, dfs, small, brute)) and small == brute
    ok += good
    print(
        f"ca {i + 1} [{' '.join(words)}]: Kahn {show(kahn)}, DFS {show(dfs)}, nhỏ nhất {show(small)}, "
        f"vét cạn {show(brute)} ({tried} hoán vị) {'đúng' if good else 'SAI'}"
    )
print(f"{ok}/{len(cases)} ca đúng")

# Bản sai: mỗi bản sửa đúng một chỗ của build_graph rồi vẫn chạy kahn_order.
def build_graph_buggy(words, bug):
    present = [False] * 26
    for w in words:
        for ch in w:
            present[code(ch)] = True
    adj = [[False] * 26 for _ in range(26)]
    indeg = [0] * 26
    for a, b in zip(words, words[1:]):
        n = min(len(a), len(b))
        j = 0
        while j < n and a[j] == b[j]:
            j += 1
        if j == n:
            if len(a) > len(b) and bug != "noPrefix":  # noPrefix: quên kiểm tra
                return None
            continue
        while j < n:
            if a[j] != b[j]:
                u, v = code(a[j]), code(b[j])
                if bug == "dupIndeg":
                    indeg[v] += 1  # dupIndeg: đếm cả cạnh trùng
                if not adj[u][v]:
                    adj[u][v] = True
                    if bug != "dupIndeg":
                        indeg[v] += 1
                if bug != "allDiffs":
                    break  # allDiffs: lấy MỌI chữ khác làm manh mối
            j += 1
    if bug == "edgeLettersOnly":
        # edgeLettersOnly: chỉ tính những chữ có mặt trong một cạnh nào đó
        present = [any(adj[c]) or any(row[c] for row in adj) for c in range(26)]
    return present, adj, indeg


for bug in ["allDiffs", "noPrefix", "edgeLettersOnly", "dupIndeg"]:

    def wrong(w):
        g = build_graph_buggy(w, bug)
        return kahn_order(g) if g is not None else ""

    right = sum(is_valid_answer(w, wrong(w), v) for w, v in cases)
    print(f"bản sai {bug}: đúng {right}/{len(cases)} ca")

# Đối chiếu ngẫu nhiên: 2 000 danh sách nhỏ, một nửa xếp theo một bảng chữ ngẫu nhiên.
seed = 2026


def rnd(n):
    global seed
    seed ^= (seed << 13) & 0xFFFFFFFF
    seed ^= seed >> 17
    seed ^= (seed << 5) & 0xFFFFFFFF
    return seed % n


def compare_by(rank):
    def cmp(a, b):
        for x, y in zip(a, b):
            if x != y:
                return rank[code(x)] - rank[code(y)]
        return len(a) - len(b)

    return cmp_to_key(cmp)


RUNS = 2000
agree = valid_count = 0
for _ in range(RUNS):
    k = 2 + rnd(5)
    order = list(range(k))
    for i in range(k - 1, 0, -1):
        j = rnd(i + 1)
        order[i], order[j] = order[j], order[i]
    rank = [0] * 26
    for i, c in enumerate(order):
        rank[c] = i
    n = 1 + rnd(6)
    words = []
    for _ in range(n):
        length = 1 + rnd(4)
        words.append("".join(chr_(rnd(k)) for _ in range(length)))
    if rnd(2) == 0:
        words.sort(key=compare_by(rank))
    brute = alien_order_brute(words)
    valid = brute != ""
    valid_count += valid
    answers = [alien_order_kahn(words), alien_order_dfs(words), alien_order_smallest(words)]
    if all(is_valid_answer(words, ans, valid) for ans in answers) and answers[2] == brute:
        agree += 1
print(f"đối chiếu {RUNS} danh sách ngẫu nhiên ({valid_count} hợp lệ): khớp vét cạn {agree}/{RUNS}")

# Đo: k chữ, 100 từ xếp theo bảng chữ ngược (k-1)..a, tức hoán vị cuối cùng vét cạn gặp.
for k in (7, 8, 9):
    target = "".join(chr_(c) for c in range(k - 1, -1, -1))
    rank = [0] * 26
    for i, ch in enumerate(target):
        rank[code(ch)] = i
    words = []
    for _ in range(100):
        length = 1 + rnd(10)
        words.append("".join(chr_(rnd(k)) for _ in range(length)))
    words.sort(key=compare_by(rank))
    tried = 0
    t0 = time.perf_counter()
    brute = alien_order_brute(words)
    brute_ms = (time.perf_counter() - t0) * 1000
    t0 = time.perf_counter()
    for _ in range(1000):
        kahn = alien_order_kahn(words)
    kahn_us = (time.perf_counter() - t0) * 1000  # tổng 1 000 lần (ms) = µs mỗi lần
    print(f"đo {k} chữ, 100 từ: vét cạn ra {brute} sau {tried} hoán vị, {brute_ms:.1f} ms; Kahn ra {kahn}, {kahn_us:.1f} µs")
