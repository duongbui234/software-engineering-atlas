# LeetCode 329: đường tăng dài nhất trong ma trận, ba cách giải
import itertools
import sys
import threading

DIRS = ((1, 0), (-1, 0), (0, 1), (0, -1))


def longest_path_brute(grid, counter=None):
    """Vét cạn: DFS từ mọi ô, không nhớ gì."""
    rows, cols = len(grid), len(grid[0])

    def climb(r, c):
        if counter is not None:
            counter[0] += 1
        best = 1
        for dr, dc in DIRS:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] > grid[r][c]:
                best = max(best, 1 + climb(nr, nc))
        return best

    return max(climb(r, c) for r in range(rows) for c in range(cols))


def longest_path_memo(grid, counter=None):
    """DFS ghi nhớ: memo[ô] = độ dài đường tăng dài nhất bắt đầu ở ô đó.
    Không cần tập "đang thăm": cạnh chỉ đi lên giá trị lớn hơn nên không có vòng."""
    rows, cols = len(grid), len(grid[0])
    memo = [0] * (rows * cols)  # 0 = chưa tính, đáp án luôn ≥ 1

    def climb(r, c):
        if counter is not None:
            counter[0] += 1
        key = r * cols + c
        if memo[key]:
            return memo[key]
        best = 1
        for dr, dc in DIRS:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] > grid[r][c]:
                best = max(best, 1 + climb(nr, nc))
        memo[key] = best
        return best

    return max(climb(r, c) for r in range(rows) for c in range(cols))


def longest_increasing_path(grid):
    """Bóc lớp theo thứ tự topo (Kahn): lớp đầu là các "đỉnh" không còn ô lớn hơn kề bên.
    Số lớp bóc được chính là độ dài đường dài nhất. Không đệ quy."""
    rows, cols = len(grid), len(grid[0])
    out_degree = [0] * (rows * cols)  # số ô kề lớn hơn
    layer = []
    for r in range(rows):
        for c in range(cols):
            for dr, dc in DIRS:
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] > grid[r][c]:
                    out_degree[r * cols + c] += 1
            if out_degree[r * cols + c] == 0:
                layer.append(r * cols + c)
    layers = 0
    while layer:
        layers += 1
        nxt = []
        for cell in layer:
            r, c = divmod(cell, cols)
            for dr, dc in DIRS:
                nr, nc = r + dr, c + dc
                # ô nhỏ hơn kề bên mất một lối lên; hết lối thì vào lớp sau
                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] < grid[r][c]:
                    out_degree[nr * cols + nc] -= 1
                    if out_degree[nr * cols + nc] == 0:
                        nxt.append(nr * cols + nc)
        layer = nxt
    return layers


# ---------- kiểm tra ----------
def snake(n):
    return [[r * n + (c if r % 2 == 0 else n - 1 - c) for c in range(n)] for r in range(n)]


def corridor(n):
    """Hàng chẵn là lối đi zigzag, hàng lẻ là tường giá trị 0 chừa một ô nối.
    Từ ô (0, 0) chỉ có đúng một ô kề lớn hơn, nên DFS đi một mạch hết đường."""
    grid = [[0] * n for _ in range(n)]
    value = 0
    for k in range(0, (n + 1) // 2):
        r = 2 * k
        for i in range(n):
            value += 1
            grid[r][i if k % 2 == 0 else n - 1 - i] = value
        if r + 2 < n:
            value += 1
            grid[r + 1][n - 1 if k % 2 == 0 else 0] = value
    return grid


small = [
    ([[1]], 1),
    ([[7, 7], [7, 7]], 1),
    ([[1, 2, 3], [6, 5, 4], [7, 8, 9]], 9),
    ([[5, 4], [2, 3]], 4),
    ([[1, 3, 2, 4, 5]], 3),
    ([[3], [2], [1]], 3),
    ([[0, 2147483647]], 2),
    ([[7, 8, 1], [6, 2, 3], [5, 4, 9]], 6),
]
big = [
    ([[5] * 200 for _ in range(200)], 1),
    (snake(200), 40000),
    (corridor(200), 20100),
]
ok = 0
for grid, want in small:
    if longest_path_brute(grid) == want and longest_path_memo(grid) == want and longest_increasing_path(grid) == want:
        ok += 1
    else:
        print("sai:", grid)
for grid, want in big:
    if longest_increasing_path(grid) == want:
        ok += 1
    else:
        print("sai ở lưới lớn, mong", want)
print(f"{ok}/{len(small) + len(big)} ca đúng")

# Đối chiếu: mọi lưới r×c (r·c ≤ 6) giá trị 0..2, và mọi lưới 2×3, 3×2 là hoán vị của 1..6
total = agree = 0


def check(grid):
    global total, agree
    total += 1
    want = longest_path_brute(grid)
    if longest_path_memo(grid) == want and longest_increasing_path(grid) == want:
        agree += 1


def shape(flat, rows, cols):
    return [list(flat[r * cols:(r + 1) * cols]) for r in range(rows)]


for rows in range(1, 7):
    for cols in range(1, 6 // rows + 1):
        size = rows * cols
        for code in range(3 ** size):
            flat, x = [], code
            for _ in range(size):
                flat.append(x % 3)
                x //= 3
            check(shape(flat, rows, cols))
for p in itertools.permutations([1, 2, 3, 4, 5, 6]):
    check(shape(p, 2, 3))
    check(shape(p, 3, 2))
print(f"{agree}/{total} ca đúng (đối chiếu vét cạn)")

# Đếm lượt gọi trên lưới 10×10 có giá trị i + j: rất nhiều đường tăng chồng lên nhau
diagonal = [[r + c for c in range(10)] for r in range(10)]
brute_count, memo_count = [0], [0]
longest_path_brute(diagonal, brute_count)
longest_path_memo(diagonal, memo_count)
print(f"Lưới 10×10 giá trị i+j: vét cạn {brute_count[0]} lượt gọi, memo {memo_count[0]} lượt gọi")

# Lưới hành lang 200×200: DFS từ ô (0, 0) phải đệ quy sâu 20099 tầng
deep = corridor(200)
try:
    memo_result = str(longest_path_memo(deep))
except RecursionError as e:
    memo_result = f"tràn ngăn xếp ({type(e).__name__})"
print(f"Lưới hành lang 200×200: bóc lớp {longest_increasing_path(deep)}, memo đệ quy {memo_result}")

# Nâng giới hạn đếm tầng. Từ Python 3.11, lời gọi giữa hai hàm Python gần như không tốn ngăn xếp C,
# nhưng bản cũ hơn có thể sập cả tiến trình, nên chạy trên luồng có ngăn xếp lớn cho chắc.
result = []
sys.setrecursionlimit(50_000)
threading.stack_size(256 * 1024 * 1024)
worker = threading.Thread(target=lambda: result.append(longest_path_memo(deep)))
worker.start()
worker.join()
print(f"Nâng giới hạn lên 50000 trên luồng ngăn xếp 256 MB: memo đệ quy {result[0]}")
