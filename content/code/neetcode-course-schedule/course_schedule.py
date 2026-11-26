# LC 207 Course Schedule: có học hết được mọi môn không? Cùng bộ ca với bản TypeScript.
# Chạy: python3 course_schedule.py
import time
from collections import deque

work = 0  # số lần nhìn một cạnh (một môn tiên quyết), dùng cho phép đo
passes = 0


def build_graph(n, prerequisites):
    # Cặp [a, b] nghĩa là "muốn học a phải học b trước": cạnh đi từ b sang a.
    adj = [[] for _ in range(n)]
    indegree = [0] * n
    for a, b in prerequisites:
        adj[b].append(a)
        indegree[a] += 1
    return adj, indegree


# Cách 1: quét lặp. Mỗi lượt quét mọi môn, học môn nào đã đủ tiên quyết.
# Một lượt không học thêm được môn nào thì dừng. Xấu nhất O(V·(V + E)).
def can_finish_scan(n, prerequisites):
    global work, passes
    needs = [[] for _ in range(n)]
    for a, b in prerequisites:
        needs[a].append(b)
    done = [False] * n
    count = 0
    passes = 0
    progress = True
    while progress:
        progress = False
        passes += 1
        for c in range(n):
            if done[c]:
                continue
            ready = True
            for b in needs[c]:
                work += 1
                if not done[b]:
                    ready = False
                    break
            if ready:
                done[c] = True
                count += 1
                progress = True
    return count == n


# Cách 2: Kahn. Môn có bậc vào 0 thì học được ngay; học xong thì trừ bậc vào
# của các môn đứng sau. Đếm số môn học được. O(V + E).
def can_finish_kahn(n, prerequisites):
    global work
    adj, indegree = build_graph(n, prerequisites)
    queue = deque(c for c in range(n) if indegree[c] == 0)
    taken = 0
    while queue:
        u = queue.popleft()
        taken += 1
        for v in adj[u]:
            work += 1
            indegree[v] -= 1
            if indegree[v] == 0:
                queue.append(v)
    return taken == n  # thiếu môn nào là môn đó kẹt trong một vòng


WHITE, GRAY, BLACK = 0, 1, 2


# Cách 3: DFS ba màu, đệ quy. Trắng = chưa đụng, xám = đang trên đường đi,
# đen = đã xong. Gặp lại một đỉnh xám là có vòng. O(V + E).
def can_finish_dfs(n, prerequisites):
    adj, _ = build_graph(n, prerequisites)
    color = [WHITE] * n

    def visit(u):
        global work
        color[u] = GRAY
        for v in adj[u]:
            work += 1
            if color[v] == GRAY:  # quay về đỉnh đang trên đường: vòng
                return False
            if color[v] == WHITE and not visit(v):
                return False
        color[u] = BLACK
        return True

    return all(color[u] != WHITE or visit(u) for u in range(n))


# Cách 3b: cùng DFS ba màu nhưng tự giữ ngăn xếp, không đệ quy.
def can_finish_dfs_stack(n, prerequisites):
    global work
    adj, _ = build_graph(n, prerequisites)
    color = [WHITE] * n
    nxt = [0] * n  # hàng xóm kế tiếp cần xem của mỗi đỉnh
    for s in range(n):
        if color[s] != WHITE:
            continue
        stack = [s]
        color[s] = GRAY
        while stack:
            u = stack[-1]
            if nxt[u] < len(adj[u]):
                v = adj[u][nxt[u]]
                nxt[u] += 1
                work += 1
                if color[v] == GRAY:
                    return False
                if color[v] == WHITE:
                    color[v] = GRAY
                    stack.append(v)
            else:
                color[u] = BLACK
                stack.pop()
    return True


# Bản sai 1: DFS chỉ có một tập "đã thăm", gặp lại đỉnh đã thăm là kết luận có vòng.
def wrong_one_visited_set(n, prerequisites):
    adj, _ = build_graph(n, prerequisites)
    visited = set()

    def visit(u):
        if u in visited:
            return False
        visited.add(u)
        return all(visit(v) for v in adj[u])

    return all(u in visited or visit(u) for u in range(n))


# Bản sai 2: chỉ hỏi "có môn nào học được ngay không?".
def wrong_has_start(n, prerequisites):
    _, indegree = build_graph(n, prerequisites)
    return any(d == 0 for d in indegree)


cases = [
    ("hai môn", 2, [[1, 0]], True),
    ("hai môn chờ nhau", 2, [[1, 0], [0, 1]], False),
    ("kim cương", 4, [[1, 0], [2, 0], [3, 1], [3, 2]], True),
    ("ví dụ năm môn", 5, [[1, 0], [2, 0], [3, 1], [3, 2], [4, 3]], True),
    ("học được một môn rồi kẹt", 4, [[1, 0], [2, 1], [3, 2], [1, 3]], False),
    ("môn tự cần chính nó", 2, [[1, 1]], False),
    ("không có tiên quyết", 3, [], True),
    ("hai mảnh, mảnh sau có vòng", 6, [[1, 0], [3, 2], [4, 3], [2, 4]], False),
]


def b(x):
    return "true" if x else "false"


def check(name, solve):
    ok = 0
    wrong = []
    for label, n, pre, want in cases:
        got = solve(n, pre)
        if got == want:
            ok += 1
        else:
            wrong.append(f"{label} → {b(got)}")
    tail = "; sai ở " + ", ".join(wrong) if wrong else ""
    print(f"{name:<20} {ok}/{len(cases)} ca đúng{tail}")


check("canFinishScan", can_finish_scan)
check("canFinishKahn", can_finish_kahn)
check("canFinishDfs", can_finish_dfs)
check("canFinishDfsStack", can_finish_dfs_stack)
check("wrongOneVisitedSet", wrong_one_visited_set)
check("wrongHasStart", wrong_has_start)

# Bộ sinh số giả ngẫu nhiên MINSTD: năm ngôn ngữ ra cùng một dãy, cùng đồ thị.
seed = 20261126


def rand(k):
    global seed
    seed = seed * 48271 % 2147483647
    return seed % k


# Đối chiếu bốn cách đúng trên 2 000 đồ thị nhỏ ngẫu nhiên (có thể có vòng, có môn tự cần mình).
agree = finishable = 0
for _ in range(2000):
    n = 1 + rand(8)
    m = rand(n * 2 + 1)
    seen = set()
    pre = []
    for _ in range(m):
        a = rand(n)
        bb = rand(n)
        if a * n + bb in seen:
            continue
        seen.add(a * n + bb)
        pre.append([a, bb])
    r = [f(n, pre) for f in (can_finish_scan, can_finish_kahn, can_finish_dfs, can_finish_dfs_stack)]
    if all(x == r[0] for x in r):
        agree += 1
    if r[0]:
        finishable += 1
print(f"ngẫu nhiên: {agree}/2000 đồ thị, bốn cách khớp nhau ({finishable} học hết được, {2000 - finishable} có vòng)")


def measure(name, solve, n, pre, extra=lambda: ""):
    global work
    best = float("inf")
    got = False
    w = 0
    for _ in range(3):
        work = 0
        t0 = time.perf_counter()
        got = solve(n, pre)
        best = min(best, (time.perf_counter() - t0) * 1000)
        w = work
    print(f"  {name:<18} {b(got)}, {w} lần nhìn cạnh{extra()}, {best:.1f} ms")


# Chuỗi 2 000 môn, môn i cần môn i+1: mỗi lượt quét chỉ học thêm được đúng một môn.
N = 2000
reversed_chain = [[i, i + 1] for i in range(N - 1)]
print(f"chuỗi {N} môn, môn i cần môn i+1:")
measure("canFinishScan", can_finish_scan, N, reversed_chain, lambda: f", {passes} lượt quét")
measure("canFinishKahn", can_finish_kahn, N, reversed_chain)
measure("canFinishDfs", can_finish_dfs, N, reversed_chain)
measure("canFinishDfsStack", can_finish_dfs_stack, N, reversed_chain)

# 2 000 môn, 5 000 cặp không vòng: xếp môn theo một hoán vị ngẫu nhiên, chỉ cho môn sau cần môn trước.
perm = list(range(N))
for i in range(N - 1, 0, -1):
    j = rand(i + 1)
    perm[i], perm[j] = perm[j], perm[i]
dag_seen = set()
dag = []
while len(dag) < 5000:
    x = rand(N)
    y = rand(N)
    if x == y:
        continue
    lo, hi = min(x, y), max(x, y)
    if lo * N + hi in dag_seen:
        continue
    dag_seen.add(lo * N + hi)
    dag.append([perm[hi], perm[lo]])
print(f"ngẫu nhiên {N} môn, 5000 cặp, không vòng:")
measure("canFinishScan", can_finish_scan, N, dag, lambda: f", {passes} lượt quét")
measure("canFinishKahn", can_finish_kahn, N, dag)
measure("canFinishDfs", can_finish_dfs, N, dag)
measure("canFinishDfsStack", can_finish_dfs_stack, N, dag)

# Đệ quy sâu: môn i+1 cần môn i, nên DFS từ môn 0 đi một mạch hết chuỗi.
print("đệ quy sâu, chuỗi môn i+1 cần môn i:")
for length in (2000, 100000):
    chain = [[i + 1, i] for i in range(length - 1)]
    parts = []
    for name, solve in (("canFinishDfs", can_finish_dfs), ("canFinishDfsStack", can_finish_dfs_stack), ("canFinishKahn", can_finish_kahn)):
        try:
            parts.append(f"{name} {b(solve(length, chain))}")
        except RecursionError as e:
            parts.append(f"{name} lỗi {type(e).__name__} (tràn ngăn xếp)")
    print(f"  {length} môn: {'; '.join(parts)}")
