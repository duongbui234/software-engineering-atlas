# LC 210 Course Schedule II: tìm một thứ tự học hợp lệ, hoặc [] nếu các môn chờ nhau thành vòng.
# Chạy: python3 course_schedule_ii.py
from collections import deque
from itertools import permutations
import time

work = 0  # số bước cơ bản (nhìn qua một môn, xét một điều kiện), dùng cho phép đo


# Cách 1: quét lặp. Mỗi lượt đi từ môn 0, lấy môn đầu tiên đã học đủ điều kiện. O(V·(V+E)).
def order_scan(n: int, prereqs: list[list[int]]) -> list[int]:
    global work
    need: list[list[int]] = [[] for _ in range(n)]
    for a, b in prereqs:
        need[a].append(b)  # muốn học a thì phải xong b
    taken = [False] * n
    order: list[int] = []
    while len(order) < n:
        found = -1
        for c in range(n):
            work += 1  # cả môn đã học cũng tốn một lần nhìn qua
            if taken[c]:
                continue
            ready = True
            for b in need[c]:
                work += 1
                if not taken[b]:
                    ready = False
                    break
            if ready:
                found = c
                break
        if found < 0:
            return []  # còn môn chưa học mà không môn nào đủ điều kiện: có vòng
        taken[found] = True
        order.append(found)
    return order


# Cách 2: Kahn. Đếm bậc vào, môn nào về 0 thì xếp hàng. O(V+E).
def order_kahn(n: int, prereqs: list[list[int]]) -> list[int]:
    global work
    nxt: list[list[int]] = [[] for _ in range(n)]
    indegree = [0] * n
    for a, b in prereqs:
        nxt[b].append(a)  # cạnh b → a: học b xong mới mở khóa a
        indegree[a] += 1
    queue = deque(c for c in range(n) if indegree[c] == 0)
    order: list[int] = []
    while queue:
        c = queue.popleft()
        work += 1
        order.append(c)
        for d in nxt[c]:
            work += 1
            indegree[d] -= 1
            if indegree[d] == 0:
                queue.append(d)
    return order if len(order) == n else []  # thiếu môn nghĩa là có vòng


WHITE, GRAY, BLACK = 0, 1, 2  # chưa tới, đang trên đường đi, đã xong


# Cách 3: DFS ba màu, đệ quy. Đảo thứ tự "xong" là thứ tự học. O(V+E).
# Chuỗi 2 000 môn đệ quy sâu 2 000 tầng, vượt giới hạn mặc định 1 000 của Python.
def order_dfs(n: int, prereqs: list[list[int]]) -> list[int]:
    nxt: list[list[int]] = [[] for _ in range(n)]
    for a, b in prereqs:
        nxt[b].append(a)
    color = [WHITE] * n
    post: list[int] = []

    def visit(c: int) -> bool:
        global work
        color[c] = GRAY
        work += 1
        for d in nxt[c]:
            work += 1
            if color[d] == GRAY:
                return False  # quay lại một môn đang xám: vòng
            if color[d] == WHITE and not visit(d):
                return False
        color[c] = BLACK
        post.append(c)
        return True

    for c in range(n):
        if color[c] == WHITE and not visit(c):
            return []
    post.reverse()
    return post


# Cách 3, bản dùng ngăn xếp tự quản: cùng thứ tự với bản đệ quy, không lo giới hạn đệ quy.
def order_dfs_iterative(n: int, prereqs: list[list[int]]) -> list[int]:
    global work
    nxt: list[list[int]] = [[] for _ in range(n)]
    for a, b in prereqs:
        nxt[b].append(a)
    color = [WHITE] * n
    post: list[int] = []
    for start in range(n):
        if color[start] != WHITE:
            continue
        color[start] = GRAY
        work += 1
        stack = [(start, 0)]  # (môn, vị trí hàng xóm sẽ xét tiếp)
        while stack:
            c, i = stack[-1]
            if i == len(nxt[c]):
                stack.pop()
                color[c] = BLACK
                post.append(c)
                continue
            stack[-1] = (c, i + 1)
            d = nxt[c][i]
            work += 1
            if color[d] == GRAY:
                return []
            if color[d] == WHITE:
                color[d] = GRAY
                work += 1
                stack.append((d, 0))
    post.reverse()
    return post


# Bản sai 1: lật chiều cạnh (a → b). Thứ tự ra ngược hẳn.
def wrong_edge_direction(n: int, prereqs: list[list[int]]) -> list[int]:
    return order_kahn(n, [[b, a] for a, b in prereqs])


# Bản sai 2: DFS chỉ có một tập "đã thăm". Gặp lại môn đã xong cũng tưởng là vòng.
def wrong_one_set_dfs(n: int, prereqs: list[list[int]]) -> list[int]:
    nxt: list[list[int]] = [[] for _ in range(n)]
    for a, b in prereqs:
        nxt[b].append(a)
    seen = [False] * n
    post: list[int] = []

    def visit(c: int) -> bool:
        seen[c] = True
        for d in nxt[c]:
            if seen[d] or not visit(d):
                return False
        post.append(c)
        return True

    for c in range(n):
        if not seen[c] and not visit(c):
            return []
    return post[::-1]


# Bản sai 3: Kahn nhưng quên kiểm số môn đã xếp. Có vòng vẫn trả một thứ tự thiếu.
def wrong_no_cycle_check(n: int, prereqs: list[list[int]]) -> list[int]:
    nxt: list[list[int]] = [[] for _ in range(n)]
    indegree = [0] * n
    for a, b in prereqs:
        nxt[b].append(a)
        indegree[a] += 1
    queue = deque(c for c in range(n) if indegree[c] == 0)
    order: list[int] = []
    while queue:
        c = queue.popleft()
        order.append(c)
        for d in nxt[c]:
            indegree[d] -= 1
            if indegree[d] == 0:
                queue.append(d)
    return order


# Bộ chấm: không so với một đáp án cố định, mà kiểm mọi điều kiện đều đi xuôi.
def is_valid(n: int, prereqs: list[list[int]], order: list[int], possible: bool) -> bool:
    if not possible:
        return len(order) == 0
    if len(order) != n:
        return False
    pos = [-1] * n
    for i, c in enumerate(order):
        if c < 0 or c >= n or pos[c] != -1:
            return False
        pos[c] = i
    return all(pos[b] < pos[a] for a, b in prereqs)


cases = [
    ("ví dụ sáu môn", 6, [[4, 3], [4, 0], [1, 4], [5, 4], [2, 1], [2, 5]], True),
    ("không có điều kiện", 3, [], True),
    ("một môn", 1, [], True),
    ("hai môn", 2, [[0, 1]], True),
    ("vòng hai môn", 2, [[0, 1], [1, 0]], False),
    ("vòng ba môn", 3, [[0, 1], [1, 2], [2, 0]], False),
    ("hình kim cương", 4, [[0, 2], [1, 2], [3, 0], [3, 1]], True),
    ("vòng ở một góc", 5, [[1, 0], [2, 1], [1, 2], [3, 0], [4, 3]], False),
]

solvers = [
    ("order_scan", order_scan),
    ("order_kahn", order_kahn),
    ("order_dfs", order_dfs),
    ("order_dfs_iterative", order_dfs_iterative),
    ("wrong_edge_direction", wrong_edge_direction),
    ("wrong_one_set_dfs", wrong_one_set_dfs),
    ("wrong_no_cycle_check", wrong_no_cycle_check),
]

for name, solve in solvers:
    wrong = [label for label, n, p, possible in cases if not is_valid(n, p, solve(n, p), possible)]
    tail = "; sai ở " + ", ".join(wrong) if wrong else ""
    print(f"{name:<20} {len(cases) - len(wrong)}/{len(cases)} ca đúng{tail}")

# Thứ tự không duy nhất: đếm mọi hoán vị hợp lệ của ví dụ sáu môn.
_, ex_n, ex_p, _ = cases[0]
from_kahn = order_kahn(ex_n, ex_p)
from_dfs = order_dfs(ex_n, ex_p)
all_valid = sum(1 for o in permutations(range(ex_n)) if is_valid(ex_n, ex_p, list(o), True))
both = is_valid(ex_n, ex_p, from_kahn, True) and is_valid(ex_n, ex_p, from_dfs, True)
fmt = lambda o: ",".join(map(str, o))
print(f"ví dụ sáu môn: Kahn → [{fmt(from_kahn)}], DFS → [{fmt(from_dfs)}]; cả hai hợp lệ: {str(both).lower()}; có {all_valid}/720 thứ tự hợp lệ")
print(f"chấm bằng cách so với đáp án cố định [{fmt(from_kahn)}]: DFS bị chấm {'đúng' if from_dfs == from_kahn else 'sai'}")

# Số ngẫu nhiên MINSTD: năm ngôn ngữ sinh cùng một dãy.
seed = 42


def rand(k: int) -> int:
    global seed
    seed = seed * 48271 % 2147483647
    return seed % k


# Đối chiếu với vét cạn: n ≤ 6, thử mọi hoán vị để biết có thứ tự hợp lệ hay không.
agree = cyclic = 0
trials = 1000
for _ in range(trials):
    n = 1 + rand(6)
    m = rand(n * (n - 1) + 1)
    keys: set[int] = set()
    p: list[list[int]] = []
    for _ in range(m):
        a = rand(n)
        b = rand(n)
        if a != b and a * n + b not in keys:
            keys.add(a * n + b)
            p.append([a, b])
    possible = any(is_valid(n, p, list(o), True) for o in permutations(range(n)))
    if not possible:
        cyclic += 1
    if all(is_valid(n, p, solve(n, p), possible) for solve in (order_scan, order_kahn, order_dfs, order_dfs_iterative)):
        agree += 1
print(f"ngẫu nhiên: {agree}/{trials} đồ thị, bốn cách đều hợp lệ ({cyclic} đồ thị có vòng)")

# Đo trên 2 000 môn.
N = 2000
forward = [[i + 1, i] for i in range(N - 1)]  # môn i+1 cần môn i
backward = [[i, i + 1] for i in range(N - 1)]  # môn i cần môn i+1
rank = list(range(N))
for i in range(N - 1, 0, -1):
    j = rand(i + 1)
    rank[i], rank[j] = rank[j], rank[i]
random_dag: list[list[int]] = []
dag_keys: set[int] = set()
while len(random_dag) < 20000:
    u = rand(N)
    v = rand(N)
    if u == v:
        continue
    a, b = (u, v) if rank[u] > rank[v] else (v, u)  # môn hạng cao cần môn hạng thấp
    if a * N + b in dag_keys:
        continue
    dag_keys.add(a * N + b)
    random_dag.append([a, b])

graphs = [
    ("chuỗi xuôi (i+1 cần i)", forward),
    ("chuỗi ngược (i cần i+1)", backward),
    ("DAG ngẫu nhiên, 20000 điều kiện", random_dag),
]
for label, p in graphs:
    print(f"{label}, {N} môn:")
    for name, solve in solvers[:4]:
        work = 0
        t0 = time.perf_counter()
        try:
            order = solve(N, p)
        except RecursionError:
            ms = (time.perf_counter() - t0) * 1000
            print(f"  {name:<19} RecursionError: đệ quy sâu quá {__import__('sys').getrecursionlimit()} tầng, {ms:.2f} ms")
            continue
        ms = (time.perf_counter() - t0) * 1000
        print(f"  {name:<19} hợp lệ: {str(is_valid(N, p, order, True)).lower()}, {work} bước, {ms:.2f} ms")
