# LC 417 Pacific Atlantic Water Flow: bốn cách đúng, ba cách sai, kiểm chung và phép đo.
# Chạy: python3 pacific_atlantic.py
from collections import deque
import random
import time

DIRS = ((-1, 0), (1, 0), (0, -1), (0, 1))


# Cách 1: vét cạn. Từ mỗi ô, cho nước chảy xuôi và xem nó chạm bờ nào. O((mn)^2).
def brute_force(heights):
    m, n = len(heights), len(heights[0])
    result = []
    for r in range(m):
        for c in range(n):
            pacific = atlantic = False
            seen = [[False] * n for _ in range(m)]
            seen[r][c] = True
            queue = deque([(r, c)])
            while queue and not (pacific and atlantic):
                cr, cc = queue.popleft()
                if cr == 0 or cc == 0:
                    pacific = True
                if cr == m - 1 or cc == n - 1:
                    atlantic = True
                for dr, dc in DIRS:
                    nr, nc = cr + dr, cc + dc
                    if 0 <= nr < m and 0 <= nc < n and not seen[nr][nc] \
                            and heights[nr][nc] <= heights[cr][cc]:
                        seen[nr][nc] = True
                        queue.append((nr, nc))
            if pacific and atlantic:
                result.append([r, c])
    return result


def borders(m, n):
    pacific = [(0, c) for c in range(n)] + [(r, 0) for r in range(m)]
    atlantic = [(m - 1, c) for c in range(n)] + [(r, n - 1) for r in range(m)]
    return pacific, atlantic


# Cách 2: đi ngược từ bờ. BFS nhiều nguồn, leo lên ô cao hơn hoặc bằng. O(mn).
def climb_bfs(heights, seeds):
    m, n = len(heights), len(heights[0])
    seen = [[False] * n for _ in range(m)]
    queue = deque()
    for r, c in seeds:
        if not seen[r][c]:
            seen[r][c] = True
            queue.append((r, c))
    while queue:
        cr, cc = queue.popleft()
        for dr, dc in DIRS:
            nr, nc = cr + dr, cc + dc
            if 0 <= nr < m and 0 <= nc < n and not seen[nr][nc] \
                    and heights[nr][nc] >= heights[cr][cc]:
                seen[nr][nc] = True
                queue.append((nr, nc))
    return seen


def intersect(a, b):
    return [[r, c] for r in range(len(a)) for c in range(len(a[0])) if a[r][c] and b[r][c]]


def reverse_bfs(heights):
    pacific, atlantic = borders(len(heights), len(heights[0]))
    return intersect(climb_bfs(heights, pacific), climb_bfs(heights, atlantic))


# Cách 3: cùng ý, DFS lặp bằng ngăn xếp.
def climb_stack(heights, seeds):
    m, n = len(heights), len(heights[0])
    seen = [[False] * n for _ in range(m)]
    stack = []
    for r, c in seeds:
        if not seen[r][c]:
            seen[r][c] = True
            stack.append((r, c))
    while stack:
        cr, cc = stack.pop()
        for dr, dc in DIRS:
            nr, nc = cr + dr, cc + dc
            if 0 <= nr < m and 0 <= nc < n and not seen[nr][nc] \
                    and heights[nr][nc] >= heights[cr][cc]:
                seen[nr][nc] = True
                stack.append((nr, nc))
    return seen


def reverse_dfs_iterative(heights):
    pacific, atlantic = borders(len(heights), len(heights[0]))
    return intersect(climb_stack(heights, pacific), climb_stack(heights, atlantic))


# Cách 4: DFS đệ quy. Python dừng ở khoảng 1000 tầng gọi.
def reverse_dfs_recursive(heights):
    m, n = len(heights), len(heights[0])

    def climb(seeds):
        seen = [[False] * n for _ in range(m)]

        def visit(r, c):
            seen[r][c] = True
            for dr, dc in DIRS:
                nr, nc = r + dr, c + dc
                if 0 <= nr < m and 0 <= nc < n and not seen[nr][nc] \
                        and heights[nr][nc] >= heights[r][c]:
                    visit(nr, nc)

        for r, c in seeds:
            if not seen[r][c]:
                visit(r, c)
        return seen

    pacific, atlantic = borders(m, n)
    return intersect(climb(pacific), climb(atlantic))


# Cách 2 viết bằng set các tuple thay cho mảng hai chiều: đúng, nhưng chậm hơn.
def reverse_bfs_sets(heights):
    m, n = len(heights), len(heights[0])

    def climb(seeds):
        seen = set(seeds)
        queue = deque(seen)
        while queue:
            cr, cc = queue.popleft()
            for dr, dc in DIRS:
                nr, nc = cr + dr, cc + dc
                if 0 <= nr < m and 0 <= nc < n and (nr, nc) not in seen \
                        and heights[nr][nc] >= heights[cr][cc]:
                    seen.add((nr, nc))
                    queue.append((nr, nc))
        return seen

    pacific, atlantic = borders(m, n)
    return [list(p) for p in climb(pacific) & climb(atlantic)]


# Sai 1: đi ngược nhưng vẫn so như nước chảy xuôi (xuống ô thấp hơn hoặc bằng).
def wrong_direction(heights):
    m, n = len(heights), len(heights[0])

    def climb_down(seeds):
        seen = [[False] * n for _ in range(m)]
        queue = deque()
        for r, c in seeds:
            if not seen[r][c]:
                seen[r][c] = True
                queue.append((r, c))
        while queue:
            cr, cc = queue.popleft()
            for dr, dc in DIRS:
                nr, nc = cr + dr, cc + dc
                if 0 <= nr < m and 0 <= nc < n and not seen[nr][nc] \
                        and heights[nr][nc] <= heights[cr][cc]:
                    seen[nr][nc] = True
                    queue.append((nr, nc))
        return seen

    pacific, atlantic = borders(m, n)
    return intersect(climb_down(pacific), climb_down(atlantic))


# Sai 2: so ngặt, quên rằng nước chảy qua ô cao bằng nhau.
def wrong_strict(heights):
    m, n = len(heights), len(heights[0])

    def climb_strict(seeds):
        seen = [[False] * n for _ in range(m)]
        queue = deque()
        for r, c in seeds:
            if not seen[r][c]:
                seen[r][c] = True
                queue.append((r, c))
        while queue:
            cr, cc = queue.popleft()
            for dr, dc in DIRS:
                nr, nc = cr + dr, cc + dc
                if 0 <= nr < m and 0 <= nc < n and not seen[nr][nc] \
                        and heights[nr][nc] > heights[cr][cc]:
                    seen[nr][nc] = True
                    queue.append((nr, nc))
        return seen

    pacific, atlantic = borders(m, n)
    return intersect(climb_strict(pacific), climb_strict(atlantic))


# Sai 3: mỗi đại dương chỉ gieo một cạnh (hàng trên, hàng dưới), quên hai cột.
def wrong_one_edge(heights):
    m, n = len(heights), len(heights[0])
    pacific = [(0, c) for c in range(n)]
    atlantic = [(m - 1, c) for c in range(n)]
    return intersect(climb_bfs(heights, pacific), climb_bfs(heights, atlantic))


# ---------- Kiểm chung ----------

def key(cells):
    return sorted(tuple(x) for x in cells)


def row_major(m, n):
    return [[r * n + c for c in range(n)] for r in range(m)]


def row_major_answer(m, n):
    return [[r, c] for r in range(m) for c in range(n) if r == m - 1 or c == n - 1]


def flat_grid(m, n):
    return [[1] * n for _ in range(m)]


def all_cells(m, n):
    return [[r, c] for r in range(m) for c in range(n)]


CASES = [
    ("một ô", [[7]], [[0, 0]]),
    ("một hàng", [[4, 1, 6]], [[0, 0], [0, 1], [0, 2]]),
    ("một cột", [[2], [9], [2]], [[0, 0], [1, 0], [2, 0]]),
    ("mặt phẳng 3×3", [[5, 5, 5], [5, 5, 5], [5, 5, 5]], all_cells(3, 3)),
    ("cái chén", [[3, 3, 3], [3, 1, 3], [3, 3, 3]],
     [[0, 0], [0, 1], [0, 2], [1, 0], [1, 2], [2, 0], [2, 1], [2, 2]]),
    ("góc trũng", [[9, 9, 1], [9, 9, 9], [1, 9, 9]], all_cells(3, 3)),
    ("sống núi giữa", [[1, 2, 3], [8, 9, 4], [7, 6, 5]],
     [[0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]]),
    ("bậc bằng nhau", [[1, 1, 1, 1], [1, 2, 2, 1], [1, 2, 2, 1], [1, 1, 1, 1]], all_cells(4, 4)),
    ("lưới tăng 200×200", row_major(200, 200), row_major_answer(200, 200)),
    ("mặt phẳng 200×200", flat_grid(200, 200), all_cells(200, 200)),
]

SOLVERS = [
    ("brute_force", brute_force),
    ("reverse_bfs", reverse_bfs),
    ("reverse_dfs_iterative", reverse_dfs_iterative),
    ("reverse_dfs_recursive", reverse_dfs_recursive),
    ("reverse_bfs_sets", reverse_bfs_sets),
    ("wrong_direction", wrong_direction),
    ("wrong_strict", wrong_strict),
    ("wrong_one_edge", wrong_one_edge),
]

for name, solve in SOLVERS:
    ok = total = 0
    bad = []
    for case_name, heights, want in CASES:
        if name == "brute_force" and len(heights) > 50:
            continue  # 40 000 ô: vét cạn quá chậm, đo riêng bên dưới
        total += 1
        try:
            if key(solve(heights)) == key(want):
                ok += 1
            else:
                bad.append(case_name)
        except RecursionError:
            bad.append(f"{case_name} → ném RecursionError")
    skipped = " (bỏ hai ca 200×200)" if total < len(CASES) else ""
    tail = f"; sai ở {', '.join(bad)}" if bad else ""
    print(f"{name:<22} {ok}/{total} ca đúng{skipped}{tail}")

rng = random.Random(42)


def random_grid(m, n, k):
    return [[rng.randrange(k) for _ in range(n)] for _ in range(m)]


agree, trials = 0, 1000
for _ in range(trials):
    h = random_grid(1 + rng.randrange(7), 1 + rng.randrange(7), 1 + rng.randrange(5))
    want = key(brute_force(h))
    if key(reverse_bfs(h)) == want and key(reverse_dfs_iterative(h)) == want \
            and key(reverse_bfs_sets(h)) == want:
        agree += 1
print(f"ngẫu nhiên: {agree}/{trials} lưới, các cách đi ngược khớp vét cạn")


def timed(fn):
    t0 = time.perf_counter()
    fn()
    return (time.perf_counter() - t0) * 1000


for size in (20, 40):
    h = flat_grid(size, size)
    print(f"mặt phẳng {size}×{size}: vét cạn {timed(lambda: brute_force(h)):.1f} ms, "
          f"đi ngược {timed(lambda: reverse_bfs(h)):.2f} ms")
big = flat_grid(200, 200)
print(f"mặt phẳng 200×200: mảng hai chiều {timed(lambda: reverse_bfs(big)):.1f} ms, "
      f"set các tuple {timed(lambda: reverse_bfs_sets(big)):.1f} ms")
