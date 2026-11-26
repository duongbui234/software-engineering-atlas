# Ga GRPH-02: một khuôn BFS cho bốn bài đồ thị.
# Chạy: python3 graph_bfs.py
import random
from collections import deque

DIRS = ((-1, 0), (1, 0), (0, -1), (0, 1))


# ---------- Khuôn chung: BFS từ một hoặc nhiều điểm xuất phát ----------
def bfs(starts, neighbors):
    dist = {}
    queue = deque()
    for s in starts:
        if s in dist:
            continue
        dist[s] = 0  # ghi sổ ngay khi xếp hàng
        queue.append(s)
    while queue:
        x = queue.popleft()
        for y in neighbors(x):
            if y in dist:
                continue
            dist[y] = dist[x] + 1
            queue.append(y)
    return dist


# ---------- 133. Clone Graph: sổ đã thăm kiêm bảng "cũ → mới" ----------
class Node:
    def __init__(self, val=0, neighbors=None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []


def clone_graph(node):
    if node is None:
        return None
    copy_of = {node: Node(node.val)}
    queue = deque([node])
    while queue:
        old = queue.popleft()
        for nb in old.neighbors:
            if nb not in copy_of:  # lần đầu gặp: tạo bản sao rồi xếp hàng
                copy_of[nb] = Node(nb.val)
                queue.append(nb)
            copy_of[old].neighbors.append(copy_of[nb])  # nối cạnh giữa hai bản sao
    return copy_of[node]


# ---------- 417. Pacific Atlantic: đi ngược từ biển lên dốc ----------
def pacific_atlantic(h):
    R, C = len(h), len(h[0])

    # Từ ô x, nước có thể chảy NGƯỢC lên ô y nếu y không thấp hơn x.
    def uphill(cell):
        r, c = cell
        return [(r + dr, c + dc) for dr, dc in DIRS
                if 0 <= r + dr < R and 0 <= c + dc < C and h[r + dr][c + dc] >= h[r][c]]

    pacific = [(r, 0) for r in range(R)] + [(0, c) for c in range(C)]
    atlantic = [(r, C - 1) for r in range(R)] + [(R - 1, c) for c in range(C)]
    P, A = bfs(pacific, uphill), bfs(atlantic, uphill)
    return [[r, c] for r in range(R) for c in range(C) if (r, c) in P and (r, c) in A]


# Vét cạn để đối chiếu: từ mỗi ô, thả nước chảy xuống và xem nó chạm biển nào.
def pacific_atlantic_brute(h):
    R, C = len(h), len(h[0])
    out = []
    for r in range(R):
        for c in range(C):
            def downhill(cell):
                x, y = cell
                return [(x + dx, y + dy) for dx, dy in DIRS
                        if 0 <= x + dx < R and 0 <= y + dy < C and h[x + dx][y + dy] <= h[x][y]]
            seen = bfs([(r, c)], downhill)
            pac = any(a == 0 or b == 0 for a, b in seen)
            atl = any(a == R - 1 or b == C - 1 for a, b in seen)
            if pac and atl:
                out.append([r, c])
    return out


# ---------- 130. Surrounded Regions: đi từ mép vào, ô nào chạm tới là an toàn ----------
def solve(board):
    R, C = len(board), len(board[0])

    def open_cells(cell):
        r, c = cell
        return [(r + dr, c + dc) for dr, dc in DIRS
                if 0 <= r + dr < R and 0 <= c + dc < C and board[r + dr][c + dc] == "O"]

    border = [(r, c) for r in range(R) for c in range(C)
              if (r in (0, R - 1) or c in (0, C - 1)) and board[r][c] == "O"]
    safe = bfs(border, open_cells)
    for r in range(R):
        for c in range(C):
            if board[r][c] == "O" and (r, c) not in safe:
                board[r][c] = "X"


# Vét cạn: một ô O bị lật khi lượt tô từ chính nó không chạm mép.
def solve_brute(board):
    R, C = len(board), len(board[0])

    def open_cells(cell):
        x, y = cell
        return [(x + dx, y + dy) for dx, dy in DIRS
                if 0 <= x + dx < R and 0 <= y + dy < C and board[x + dx][y + dy] == "O"]

    out = []
    for r in range(R):
        row = []
        for c in range(C):
            if board[r][c] != "O":
                row.append(board[r][c])
                continue
            seen = bfs([(r, c)], open_cells)
            edge = any(a in (0, R - 1) or b in (0, C - 1) for a, b in seen)
            row.append("O" if edge else "X")
        out.append(row)
    return out


# ---------- 127. Word Ladder: đồ thị ẩn, hàng xóm sinh theo luật ----------
# Cách 1: so từng cặp. Mỗi lần lấy một từ ra, quét cả danh sách.
def ladder_naive(begin, end, words):
    if end not in words:
        return 0

    def one_apart(a, b):
        return sum(x != y for x, y in zip(a, b)) == 1

    dist = {begin: 1}
    queue = deque([begin])
    while queue:
        w = queue.popleft()
        for v in words:
            if v in dist or not one_apart(w, v):
                continue
            if v == end:
                return dist[w] + 1
            dist[v] = dist[w] + 1
            queue.append(v)
    return 0


# Cách 2: xô theo mẫu. "hot" nằm trong các xô "*ot", "h*t", "ho*".
def ladder_buckets(begin, end, words):
    if end not in words:
        return 0
    buckets = {}
    for w in [begin, *words]:
        for i in range(len(w)):
            buckets.setdefault(w[:i] + "*" + w[i + 1:], []).append(w)
    dist = {begin: 1}
    queue = deque([begin])
    while queue:
        w = queue.popleft()
        for i in range(len(w)):
            for v in buckets[w[:i] + "*" + w[i + 1:]]:
                if v in dist:
                    continue
                if v == end:
                    return dist[w] + 1
                dist[v] = dist[w] + 1
                queue.append(v)
    return 0


# Cách 3: BFS hai đầu. Mỗi vòng mở rộng phía có ít từ hơn, dừng khi hai phía chạm nhau.
def ladder_bidirectional(begin, end, words):
    words = set(words)
    if end not in words:
        return 0
    front, back = {begin}, {end}
    seen = {begin, end}
    length = 1
    while front and back:
        if len(front) > len(back):
            front, back = back, front
        nxt = set()
        length += 1
        for w in front:
            for i in range(len(w)):
                for ch in "abcdefghijklmnopqrstuvwxyz":
                    v = w[:i] + ch + w[i + 1:]
                    if v in back:
                        return length
                    if v not in words or v in seen:
                        continue
                    seen.add(v)
                    nxt.add(v)
        front = nxt
    return 0


# ---------- Kiểm tra ----------
def build_graph(adj):
    if not adj:
        return None
    nodes = [Node(i + 1) for i in range(len(adj))]
    for i, lst in enumerate(adj):
        nodes[i].neighbors = [nodes[v - 1] for v in lst]
    return nodes[0]


def to_adj(node):
    if node is None:
        return [], set()
    seen = bfs([node], lambda n: n.neighbors)
    adj = [None] * len(seen)
    for n in seen:
        adj[n.val - 1] = [x.val for x in n.neighbors]
    return adj, set(map(id, seen))


def flipped(board):
    b = [row[:] for row in board]
    solve(b)
    return b


rng = random.Random(42)
square = [[2, 4], [1, 3], [2, 4], [1, 3]]
original = build_graph(square)
copy = clone_graph(original)
spiral = [[1, 2, 3], [8, 9, 4], [7, 6, 5]]
random_grids = []
for _ in range(200):
    R, C = rng.randint(1, 5), rng.randint(1, 5)
    random_grids.append([[rng.randrange(4) for _ in range(C)] for _ in range(R)])
random_boards = []
for _ in range(200):
    R, C = rng.randint(1, 6), rng.randint(1, 6)
    random_boards.append([["O" if rng.random() < 0.55 else "X" for _ in range(C)] for _ in range(R)])
words = ["cord", "card", "ward", "warm", "word", "worm", "wore", "core", "cold"]
random_words = ["".join(rng.choice("abcd") for _ in range(3)) for _ in range(300)]
pairs = [(rng.choice(random_words), rng.choice(random_words)) for _ in range(200)]
pairs = [(a, b) for a, b in pairs if a != b]

cases = [
    ("133 bản sao giữ đúng cạnh", to_adj(copy)[0] == square),
    ("133 bản sao không dùng chung nút nào", not (to_adj(copy)[1] & to_adj(original)[1])),
    ("133 đồ thị rỗng", clone_graph(None) is None),
    ("133 một nút không cạnh", to_adj(clone_graph(build_graph([[]])))[0] == [[]]),
    ("417 lưới xoắn ốc", pacific_atlantic(spiral) == [[0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]]),
    ("417 một ô", pacific_atlantic([[5]]) == [[0, 0]]),
    ("417 khớp vét cạn trên 200 lưới ngẫu nhiên",
     all(pacific_atlantic(g) == pacific_atlantic_brute(g) for g in random_grids)),
    ("130 vùng kín bị lật, ô ở mép giữ nguyên",
     flipped([list("XXXX"), list("XOOX"), list("XXOX"), list("XOXX")])
     == [list("XXXX"), list("XXXX"), list("XXXX"), list("XOXX")]),
    ("130 vùng nối ra mép thì an toàn",
     flipped([list("XOX"), list("XOX"), list("XXX")]) == [list("XOX"), list("XOX"), list("XXX")]),
    ("130 khớp vét cạn trên 200 bảng ngẫu nhiên",
     all(flipped(b) == solve_brute(b) for b in random_boards)),
    ("127 cold → warm cần 5 từ", ladder_buckets("cold", "warm", words) == 5),
    ("127 đích không có trong danh sách", ladder_buckets("cold", "warm", [w for w in words if w != "warm"]) == 0),
    ("127 đích cách một chữ", ladder_bidirectional("cold", "cord", words) == 2),
    ("127 ba cách khớp nhau trên 200 cặp ngẫu nhiên",
     all(ladder_naive(a, b, random_words) == ladder_buckets(a, b, random_words)
         == ladder_bidirectional(a, b, random_words) for a, b in pairs)),
]
ok = sum(p for _, p in cases)
for name, p in cases:
    if not p:
        print("SAI:", name)
print(f"graph_bfs {ok}/{len(cases)} ca đúng")
