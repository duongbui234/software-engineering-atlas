# LC 130 Surrounded Regions: mọi cách giải trên trang, kèm các bản sai hay gặp.
# Chạy: python3 surrounded.py
import time
from collections import deque

DIRS = ((-1, 0), (1, 0), (0, -1), (0, 1))
brute_visits = 0


# Cách 0: vét cạn. Với từng ô O, chạy một BFS riêng để xem nó có tới được biên không.
# Thời gian O((mn)²): cả vùng bị duyệt lại một lần cho mỗi ô của nó.
def brute_force_per_cell(board):
    global brute_visits
    m, n = len(board), len(board[0])
    to_flip = []
    for r in range(m):
        for c in range(n):
            if board[r][c] != 'O':
                continue
            seen = {(r, c)}
            queue = deque([(r, c)])
            escaped = False
            while queue and not escaped:
                cr, cc = queue.popleft()
                brute_visits += 1
                if cr in (0, m - 1) or cc in (0, n - 1):
                    escaped = True
                for dr, dc in DIRS:
                    nr, nc = cr + dr, cc + dc
                    if 0 <= nr < m and 0 <= nc < n and board[nr][nc] == 'O' and (nr, nc) not in seen:
                        seen.add((nr, nc))
                        queue.append((nr, nc))
            if not escaped:
                to_flip.append((r, c))  # chưa đổi ngay, để các ô sau còn đọc đúng
    for r, c in to_flip:
        board[r][c] = 'X'


# Cách 1: tô từng vùng. Gom cả vùng bằng BFS, nhớ xem vùng có chạm biên không,
# duyệt xong mới đổi. O(mn).
def region_fill(board):
    m, n = len(board), len(board[0])
    seen = [[False] * n for _ in range(m)]
    for r in range(m):
        for c in range(n):
            if board[r][c] != 'O' or seen[r][c]:
                continue
            seen[r][c] = True
            region = [(r, c)]
            touches_border = False
            head = 0
            while head < len(region):
                cr, cc = region[head]
                head += 1
                if cr in (0, m - 1) or cc in (0, n - 1):
                    touches_border = True
                for dr, dc in DIRS:
                    nr, nc = cr + dr, cc + dc
                    if 0 <= nr < m and 0 <= nc < n and board[nr][nc] == 'O' and not seen[nr][nc]:
                        seen[nr][nc] = True
                        region.append((nr, nc))
            if not touches_border:
                for cr, cc in region:
                    board[cr][cc] = 'X'


def finish(board):
    for row in board:
        for c, ch in enumerate(row):
            row[c] = 'X' if ch == 'O' else 'O' if ch == 'S' else ch


def border_cells(m, n):
    for r in range(m):
        yield r, 0
        yield r, n - 1
    for c in range(n):
        yield 0, c
        yield m - 1, c


# Cách 2 (nên dùng): đi ngược từ biên. Mọi ô O trên biên vào hàng đợi cùng lúc
# và được đánh dấu an toàn 'S'. BFS lan 'S' vào trong. Cuối cùng quét một lượt:
# O còn lại bị vây nên thành X, S trả lại thành O.
def border_bfs(board):
    m, n = len(board), len(board[0])
    queue = deque()
    for r, c in border_cells(m, n):
        if board[r][c] == 'O':
            board[r][c] = 'S'
            queue.append((r, c))
    while queue:
        cr, cc = queue.popleft()
        for dr, dc in DIRS:
            nr, nc = cr + dr, cc + dc
            if 0 <= nr < m and 0 <= nc < n and board[nr][nc] == 'O':
                board[nr][nc] = 'S'
                queue.append((nr, nc))
    finish(board)


# Cách 3: cùng ý tưởng, lan bằng DFS đệ quy. Python mặc định chỉ cho khoảng 1000 tầng gọi.
def border_dfs_recursive(board):
    m, n = len(board), len(board[0])

    def dfs(r, c):
        if r < 0 or r >= m or c < 0 or c >= n or board[r][c] != 'O':
            return
        board[r][c] = 'S'
        dfs(r - 1, c)
        dfs(r + 1, c)
        dfs(r, c - 1)
        dfs(r, c + 1)

    for r, c in border_cells(m, n):
        dfs(r, c)
    finish(board)


# Cách 4: DFS với ngăn xếp tự quản lý, không phụ thuộc giới hạn đệ quy.
def border_dfs_iterative(board):
    m, n = len(board), len(board[0])
    stack = []
    for r, c in border_cells(m, n):
        if board[r][c] == 'O':
            board[r][c] = 'S'
            stack.append((r, c))
    while stack:
        cr, cc = stack.pop()
        for dr, dc in DIRS:
            nr, nc = cr + dr, cc + dc
            if 0 <= nr < m and 0 <= nc < n and board[nr][nc] == 'O':
                board[nr][nc] = 'S'
                stack.append((nr, nc))
    finish(board)


# Cách 5: Union-Find với một nút ảo "biên".
def union_find(board):
    m, n = len(board), len(board[0])
    border = m * n
    parent = list(range(m * n + 1))
    size = [1] * (m * n + 1)

    def find(x):
        root = x
        while parent[root] != root:
            root = parent[root]
        while parent[x] != root:
            parent[x], x = root, parent[x]
        return root

    def union(a, b):
        ra, rb = find(a), find(b)
        if ra == rb:
            return
        if size[ra] < size[rb]:
            ra, rb = rb, ra
        parent[rb] = ra
        size[ra] += size[rb]

    for r in range(m):
        for c in range(n):
            if board[r][c] != 'O':
                continue
            i = r * n + c
            if r in (0, m - 1) or c in (0, n - 1):
                union(i, border)
            if r + 1 < m and board[r + 1][c] == 'O':
                union(i, i + n)
            if c + 1 < n and board[r][c + 1] == 'O':
                union(i, i + 1)
    for r in range(m):
        for c in range(n):
            if board[r][c] == 'O' and find(r * n + c) != find(border):
                board[r][c] = 'X'


# SAI 1: đổi mọi ô O không nằm trên biên.
def wrong_not_on_border(board):
    for r in range(1, len(board) - 1):
        for c in range(1, len(board[0]) - 1):
            if board[r][c] == 'O':
                board[r][c] = 'X'


# SAI 2: đổi ô thành X ngay lúc tìm; `and` dừng sớm nên phần còn lại không được thăm.
def wrong_flip_during_search(board):
    m, n = len(board), len(board[0])

    def surrounded(r, c):
        if r < 0 or r >= m or c < 0 or c >= n:
            return False
        if board[r][c] != 'O':
            return True
        board[r][c] = 'X'
        return surrounded(r - 1, c) and surrounded(r + 1, c) and surrounded(r, c - 1) and surrounded(r, c + 1)

    for r in range(m):
        for c in range(n):
            if board[r][c] == 'O':
                surrounded(r, c)


# SAI 3: gán lại tên tham số. Người gọi vẫn giữ bảng cũ.
def wrong_new_board(board):
    board = [row[:] for row in board]
    border_bfs(board)


# ---------- ca thử ----------
def parse(rows):
    return [list(row) for row in rows]


def square(n, fill):
    return [[fill(r, c) for c in range(n)] for r in range(n)]


def framed(n):
    return square(n, lambda r, c: 'X' if r in (0, n - 1) or c in (0, n - 1) else 'O')


cases = [
    ('ví dụ 5×5 ở trên', parse(['XXXXX', 'XOOXX', 'XXOXX', 'XOXOO', 'XOXXX']),
     parse(['XXXXX', 'XXXXX', 'XXXXX', 'XOXOO', 'XOXXX'])),
    ('một ô O', parse(['O']), parse(['O'])),
    ('một ô X', parse(['X']), parse(['X'])),
    ('3×3 toàn O', parse(['OOO', 'OOO', 'OOO']), parse(['OOO', 'OOO', 'OOO'])),
    ('vòng X bao một ô O', parse(['XXX', 'XOX', 'XXX']), parse(['XXX', 'XXX', 'XXX'])),
    ('một hàng OXO', parse(['OXO']), parse(['OXO'])),
    ('chạm chéo không tính là nối', parse(['OXXX', 'XOXX', 'XXOX', 'XXXX']),
     parse(['OXXX', 'XXXX', 'XXXX', 'XXXX'])),
    ('đường vòng vèo ra biên', parse(['XXXXXX', 'XOOOOX', 'XXXXOX', 'XOOOOX', 'XOXXXX', 'XOXXXX']),
     parse(['XXXXXX', 'XOOOOX', 'XXXXOX', 'XOOOOX', 'XOXXXX', 'XOXXXX'])),
    ('200×200 toàn O', square(200, lambda r, c: 'O'), square(200, lambda r, c: 'O')),
    ('200×200 viền X, trong toàn O', framed(200), square(200, lambda r, c: 'X')),
]

solvers = [
    brute_force_per_cell, region_fill, border_bfs, border_dfs_recursive, border_dfs_iterative, union_find,
    wrong_not_on_border, wrong_flip_during_search, wrong_new_board,
]

for solve in solvers:
    ok, bad = 0, []
    # vét cạn chỉ chạy các ca nhỏ: ở 200×200 nó cần khoảng 1,5·10⁹ lượt thăm
    mine = [tc for tc in cases if len(tc[1]) <= 10] if solve is brute_force_per_cell else cases
    for name, board, want in mine:
        b = [row[:] for row in board]
        try:
            solve(b)
            if b == want:
                ok += 1
            else:
                bad.append(name)
        except Exception as e:  # noqa: BLE001
            bad.append(f'{name} → ném {type(e).__name__}')
    note = ' (chỉ các ca nhỏ)' if len(mine) < len(cases) else ''
    tail = '; sai ở ' + ', '.join(bad) if bad else ''
    print(f'{solve.__name__:<24} {ok}/{len(mine)} ca đúng{note}{tail}')

# Bẫy riêng của Python: hàng là chuỗi thì không gán từng ký tự được.
try:
    rows = ['XXX', 'XOX', 'XXX']
    border_bfs(rows)
except TypeError as e:
    print(f'bảng là list[str]: ném TypeError ({e})')


# Đối chiếu ngẫu nhiên với vét cạn.
def mulberry32(seed):
    state = [seed & 0xFFFFFFFF]

    def nxt():
        state[0] = (state[0] + 0x6D2B79F5) & 0xFFFFFFFF
        t = state[0]
        t = ((t ^ (t >> 15)) * (1 | t)) & 0xFFFFFFFF
        t = (t + (((t ^ (t >> 7)) * (61 | t)) & 0xFFFFFFFF)) & 0xFFFFFFFF ^ t
        return ((t ^ (t >> 14)) & 0xFFFFFFFF) / 4294967296

    return nxt


rand = mulberry32(42)
TRIALS = 2000
agree = 0
for _ in range(TRIALS):
    m, n = 1 + int(rand() * 8), 1 + int(rand() * 8)
    board = [['O' if rand() < 0.6 else 'X' for _ in range(n)] for _ in range(m)]
    ref = [row[:] for row in board]
    brute_force_per_cell(ref)
    good = True
    for solve in (region_fill, border_bfs, border_dfs_recursive, border_dfs_iterative, union_find):
        b = [row[:] for row in board]
        solve(b)
        good = good and b == ref
    agree += good
print(f'đối chiếu ngẫu nhiên: {agree}/{TRIALS} bảng, năm cách đúng khớp vét cạn')

# Đo: vét cạn O((mn)²) so với tô từng vùng O(mn) trên bảng viền X, trong toàn O.
for size in (20, 30, 40):
    b = framed(size)
    brute_visits = 0
    t0 = time.perf_counter()
    brute_force_per_cell(b)
    brute = (time.perf_counter() - t0) * 1000
    b = framed(size)
    t0 = time.perf_counter()
    region_fill(b)
    fast = (time.perf_counter() - t0) * 1000
    print(f'{size}×{size}: vét cạn {brute_visits} lượt thăm, {brute:.1f} ms; tô từng vùng {fast:.2f} ms')
