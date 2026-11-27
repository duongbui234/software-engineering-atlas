# Ga DP-06: DP có trạng thái. Chạy: python3 states.py
import sys

sys.setrecursionlimit(100_000)  # DFS trên lưới 200×200 có thể sâu tới 40.000 tầng


def max_profit_cooldown(prices):
    hold = float("-inf")  # đang giữ một cổ phiếu
    sold = float("-inf")  # vừa bán hôm nay, mai phải nghỉ
    rest = 0              # tay không, được mua
    for price in prices:
        hold, sold, rest = max(hold, rest - price), hold + price, max(rest, sold)
    return max(rest, sold)


DIRS = ((1, 0), (-1, 0), (0, 1), (0, -1))


def longest_increasing_path(grid):
    m, n = len(grid), len(grid[0])
    memo = [[0] * n for _ in range(m)]

    def dfs(r, c):
        if memo[r][c]:
            return memo[r][c]
        best = 1
        for dr, dc in DIRS:
            nr, nc = r + dr, c + dc
            if 0 <= nr < m and 0 <= nc < n and grid[nr][nc] > grid[r][c]:
                best = max(best, 1 + dfs(nr, nc))
        memo[r][c] = best
        return best

    return max(dfs(r, c) for r in range(m) for c in range(n))


def longest_increasing_path_layers(grid):
    m, n = len(grid), len(grid[0])
    out = [[0] * n for _ in range(m)]
    layer = []
    for r in range(m):
        for c in range(n):
            for dr, dc in DIRS:
                nr, nc = r + dr, c + dc
                if 0 <= nr < m and 0 <= nc < n and grid[nr][nc] > grid[r][c]:
                    out[r][c] += 1
            if out[r][c] == 0:
                layer.append((r, c))
    layers = 0
    while layer:
        layers += 1
        nxt = []
        for r, c in layer:
            for dr, dc in DIRS:
                nr, nc = r + dr, c + dc
                if 0 <= nr < m and 0 <= nc < n and grid[nr][nc] < grid[r][c]:
                    out[nr][nc] -= 1
                    if out[nr][nc] == 0:
                        nxt.append((nr, nc))
        layer = nxt
    return layers


stock_cases = [
    ([5], 0), ([5, 4, 3], 0), ([1, 2], 1), ([1, 3, 2, 8], 7), ([2, 4, 1, 7], 6),
    ([1, 4, 2, 7], 6), ([3, 1, 4, 8, 2, 6], 7), ([6, 1, 6, 4, 3, 0, 2], 7), ([1, 2, 4, 2, 5, 7, 2, 4, 9, 0], 11),
]
grid_cases = [
    ([[7]], 1), ([[1, 2], [4, 3]], 4), ([[3, 3], [3, 3]], 1),
    ([[5, 4, 3], [6, 1, 2], [7, 8, 9]], 9), ([[1, 2, 3, 4, 5]], 5), ([[3], [2], [1]], 3),
]
ok = total = 0
for prices, want in stock_cases:
    total += 1
    if max_profit_cooldown(prices) == want:
        ok += 1
    else:
        print("sai ở", prices)
for grid, want in grid_cases:
    total += 1
    if longest_increasing_path(grid) == want and longest_increasing_path_layers(grid) == want:
        ok += 1
    else:
        print("sai ở", grid)
print(f"{ok}/{total} ca đúng")
