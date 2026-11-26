from heapq import heappop, heappush

def least_costs(graph, start, initial, extend):
    best = [float("inf")] * len(graph)
    best[start] = initial
    pending = [(initial, start)]
    while pending:
        cost, source = heappop(pending)
        if cost != best[source]:
            continue
        for target, weight in graph[source]:
            candidate = extend(cost, weight)
            if candidate < best[target]:
                best[target] = candidate
                heappush(pending, (candidate, target))
    return best

def swim_time(grid):
    n = len(grid)
    graph = [[] for _ in range(n * n)]
    for row in range(n):
        for col in range(n):
            for dr, dc in ((-1, 0), (1, 0), (0, -1), (0, 1)):
                r, c = row + dr, col + dc
                if 0 <= r < n and 0 <= c < n:
                    graph[row * n + col].append((r * n + c, grid[r][c]))
    return least_costs(graph, 0, grid[0][0], max)[-1]

def swim_by_threshold(grid, binary):
    n = len(grid)

    def reachable(level):
        queue = [(0, 0)]
        seen = {(0, 0)}
        for row, col in queue:
            if row == col == n - 1:
                return True
            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                r, c = row + dr, col + dc
                if 0 <= r < n and 0 <= c < n and grid[r][c] <= level and (r, c) not in seen:
                    seen.add((r, c))
                    queue.append((r, c))
        return False

    low, high = max(grid[0][0], grid[-1][-1]), n * n - 1
    if not binary:
        while not reachable(low):
            low += 1
        return low
    while low < high:
        mid = (low + high) // 2
        if reachable(mid):
            high = mid
        else:
            low = mid + 1
    return low

def check(got, expected):
    if got != expected:
        raise ValueError(("want", expected, "got", got))

check(swim_time([[0]]), 0)
check(swim_by_threshold([[0]], True), 0)
check(swim_by_threshold([[0]], False), 0)
check(swim_time([[3, 0], [2, 1]]), 3)
check(swim_by_threshold([[3, 0], [2, 1]], True), 3)
check(swim_by_threshold([[3, 0], [2, 1]], False), 3)
check(swim_time([[0, 8, 7], [1, 6, 5], [2, 3, 4]]), 4)
check(swim_by_threshold([[0, 8, 7], [1, 6, 5], [2, 3, 4]], True), 4)
check(swim_by_threshold([[0, 8, 7], [1, 6, 5], [2, 3, 4]], False), 4)
check(swim_time([[0, 1, 8], [7, 2, 6], [5, 3, 4]]), 4)
check(swim_by_threshold([[0, 1, 8], [7, 2, 6], [5, 3, 4]], True), 4)
check(swim_by_threshold([[0, 1, 8], [7, 2, 6], [5, 3, 4]], False), 4)
check(swim_time([[0, 1], [2, 3]]), 3)
check(swim_by_threshold([[0, 1], [2, 3]], True), 3)
check(swim_by_threshold([[0, 1], [2, 3]], False), 3)
print("5/5 ca đúng")
