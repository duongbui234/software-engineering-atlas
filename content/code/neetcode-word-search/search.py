# Word Search (LeetCode 79): tìm một từ trên lưới chữ, mỗi bước sang ô kề cạnh, không dùng lại ô.
# Chạy: python3 search.py
from collections import Counter

DIRS = [(1, 0), (-1, 0), (0, 1), (0, -1)]
calls = 0


# Cách 1: DFS với một bảng visited riêng.
def exist_visited(board, word):
    rows, cols = len(board), len(board[0])
    visited = [[False] * cols for _ in range(rows)]

    def dfs(r, c, k):
        global calls
        calls += 1
        if k == len(word):
            return True
        if r < 0 or c < 0 or r >= rows or c >= cols:
            return False
        if visited[r][c] or board[r][c] != word[k]:
            return False
        visited[r][c] = True
        for dr, dc in DIRS:
            if dfs(r + dr, c + dc, k + 1):
                visited[r][c] = False
                return True
        visited[r][c] = False
        return False

    return any(dfs(r, c, 0) for r in range(rows) for c in range(cols))


# Cách 2: đánh dấu ngay trên lưới bằng '#', trả lại chữ cũ khi quay lui.
def exist_in_place(board, word):
    rows, cols = len(board), len(board[0])

    def dfs(r, c, k):
        global calls
        calls += 1
        if k == len(word):
            return True
        if r < 0 or c < 0 or r >= rows or c >= cols:
            return False
        if board[r][c] != word[k]:
            return False
        saved = board[r][c]
        board[r][c] = '#'
        found = False
        for dr, dc in DIRS:
            if dfs(r + dr, c + dc, k + 1):
                found = True
                break
        board[r][c] = saved
        return found

    return any(dfs(r, c, 0) for r in range(rows) for c in range(cols))


# Cách 3: cắt nhánh trước khi tìm. Đếm chữ, rồi đảo từ nếu chữ cuối hiếm hơn chữ đầu.
def exist_pruned(board, word):
    have = Counter(ch for row in board for ch in row)
    need = Counter(word)
    if any(have[ch] < n for ch, n in need.items()):
        return False
    if have[word[-1]] < have[word[0]]:
        word = word[::-1]
    return exist_in_place(board, word)


# Trọng tài: liệt kê mọi đường đi đơn dài |word| trên lưới, ghép chữ rồi so cả chuỗi.
def brute_force(board, word):
    rows, cols = len(board), len(board[0])
    used = [[False] * cols for _ in range(rows)]
    hit = False

    def walk(r, c, text):
        nonlocal hit
        if hit:
            return
        nxt = text + board[r][c]
        if len(nxt) == len(word):
            if nxt == word:
                hit = True
            return
        used[r][c] = True
        for dr, dc in DIRS:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and not used[nr][nc]:
                walk(nr, nc, nxt)
        used[r][c] = False

    for r in range(rows):
        for c in range(cols):
            walk(r, c, '')
    return hit


def clone(b):
    return [row[:] for row in b]


grid = [['c', 'a', 't'], ['o', 'd', 's'], ['g', 'e', 'n']]
cases = [
    (grid, 'cat', True),
    (grid, 'cod', True),
    (grid, 'dog', True),
    (grid, 'cats', True),
    (grid, 'neds', True),
    (grid, 'tact', False),
    (grid, 'cab', False),
    ([['z']], 'z', True),
    ([['z']], 'zz', False),
    ([['a', 'b'], ['b', 'a']], 'abab', True),
    ([['a', 'b'], ['b', 'a']], 'abaa', False),
    ([['a', 'b']], 'aba', False),
]

ok = 0
for board, word, want in cases:
    b2, b3 = clone(board), clone(board)
    got = [exist_visited(clone(board), word), exist_in_place(b2, word), exist_pruned(b3, word), brute_force(board, word)]
    if all(g == want for g in got) and b2 == board and b3 == board:
        ok += 1
    else:
        print('sai ở', board, word, got)
print(f'{ok}/{len(cases)} ca đúng')

# Đối chiếu: mọi lưới 2×2 và 2×3 trên {a, b}, mọi từ trên {a, b} dài 1–4.
words = []
for length in range(1, 5):
    for mask in range(1 << length):
        words.append(''.join('b' if (mask >> i) & 1 else 'a' for i in range(length)))
total = agree = 0
for cols in (2, 3):
    cells = 2 * cols
    for mask in range(1 << cells):
        board = [[], []]
        for i in range(cells):
            board[i // cols].append('b' if (mask >> i) & 1 else 'a')
        for w in words:
            total += 1
            want = brute_force(board, w)
            b2, b3 = clone(board), clone(board)
            if (exist_visited(clone(board), w) == want and exist_in_place(b2, w) == want
                    and exist_pruned(b3, w) == want and b2 == board and b3 == board):
                agree += 1
print(f'{agree}/{total} ca đúng (đối chiếu liệt kê mọi đường đi)')

# Phép đo: lưới 4×4 toàn chữ a, chữ b ở góc dưới phải bị hai chữ c chắn, từ aaaaaaab không có.
trap = [['a'] * 4 for _ in range(4)]
trap[3][3] = 'b'
trap[2][3] = 'c'
trap[3][2] = 'c'
calls = 0
exist_in_place(clone(trap), 'aaaaaaab')
plain = calls
calls = 0
exist_pruned(clone(trap), 'aaaaaaab')
print(f'Lưới 4×4 toàn a, b ở góc bị c chắn, từ aaaaaaab: không cắt nhánh {plain} lượt gọi, đảo từ {calls} lượt gọi')
