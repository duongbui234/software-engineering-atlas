from collections import deque

DIRECTIONS = ((-1, 0), (1, 0), (0, -1), (0, 1))


def simulate(grid):
    rows, cols = len(grid), len(grid[0])
    fresh = sum(row.count(1) for row in grid)
    minutes = scans = 0

    while fresh:
        upcoming = []
        for r in range(rows):
            for c in range(cols):
                scans += 1
                if grid[r][c] == 1 and any(
                    0 <= r + dr < rows
                    and 0 <= c + dc < cols
                    and grid[r + dr][c + dc] == 2
                    for dr, dc in DIRECTIONS
                ):
                    upcoming.append((r, c))
        if not upcoming:
            return -1, scans
        for r, c in upcoming:
            grid[r][c] = 2
        fresh -= len(upcoming)
        minutes += 1
    return minutes, scans


def spread(grid):
    rows, cols = len(grid), len(grid[0])
    queue = deque()
    fresh = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:
                queue.append((r, c))
            elif grid[r][c] == 1:
                fresh += 1

    minutes = pops = 0
    while queue:
        layer_size = len(queue)
        for _ in range(layer_size):
            r, c = queue.popleft()
            pops += 1
            for dr, dc in DIRECTIONS:
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                    grid[nr][nc] = 2
                    fresh -= 1
                    queue.append((nr, nc))
        if queue:
            minutes += 1
    return (minutes if fresh == 0 else -1), pops


def main():
    cases = [
        ([[2, 1, 1, 0, 2], [0, 1, 1, 1, 1]], 3),
        ([[2, 1, 0, 1], [0, 1, 0, 1]], -1),
        ([[0, 2, 0]], 0),
        ([[1]], -1),
        ([[0]], 0),
        ([[2, 1, 2]], 1),
        ([[2, 1, 1, 1, 1, 1, 1, 1, 1, 1]], 9),
    ]
    for grid, expected in cases:
        assert simulate([row[:] for row in grid])[0] == expected, grid
        assert spread([row[:] for row in grid])[0] == expected, grid

    corridor = cases[-1][0]
    _, scans = simulate([row[:] for row in corridor])
    _, pops = spread([row[:] for row in corridor])
    assert (scans, pops) == (90, 10)
    print(f"{len(cases)}/{len(cases)} ca đúng")
    print(f"Quét: {scans}; lấy khỏi hàng đợi: {pops}")


if __name__ == "__main__":
    main()
