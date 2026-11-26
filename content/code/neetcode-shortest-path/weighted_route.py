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

def network_delay(edges, n, start):
    graph = [[] for _ in range(n)]
    for source, target, time in edges:
        graph[source - 1].append((target - 1, time))
    last_arrival = max(least_costs(graph, start - 1, 0, lambda cost, time: cost + time))
    return -1 if last_arrival == float("inf") else last_arrival

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

def cheapest_flight(n, flights, start, end, k):
    best = [float("inf")] * n
    best[start] = 0
    for _ in range(k + 1):
        following = best.copy()
        for source, target, price in flights:
            following[target] = min(following[target], best[source] + price)
        best = following
    return -1 if best[end] == float("inf") else best[end]

passed = 0
def check(got, expected):
    global passed
    if got != expected:
        raise ValueError(("want", expected, "got", got))
    passed += 1

check(network_delay([[1, 2, 9], [1, 3, 2], [3, 2, 1], [2, 4, 4]], 4, 1), 7)
check(network_delay([[1, 2, 0], [2, 3, 0]], 3, 1), 0)
check(network_delay([[2, 1, 7]], 3, 2), -1)
check(network_delay([], 1, 1), 0)
check(network_delay([[1, 2, 8], [1, 3, 2], [3, 2, 6], [3, 4, 1], [4, 2, 1]], 4, 1), 4)
check(swim_time([[0]]), 0)
check(swim_time([[3, 0], [2, 1]]), 3)
check(swim_time([[0, 8, 7], [1, 6, 5], [2, 3, 4]]), 4)
check(swim_time([[0, 1, 8], [7, 2, 6], [5, 3, 4]]), 4)
check(swim_time([[0, 1], [2, 3]]), 3)
check(cheapest_flight(4, [[0, 1, 1], [1, 2, 1], [0, 2, 6], [2, 3, 1]], 0, 3, 1), 7)
check(cheapest_flight(4, [[0, 1, 1], [1, 2, 1], [0, 2, 6], [2, 3, 1]], 0, 3, 2), 3)
check(cheapest_flight(3, [[0, 1, 1], [1, 2, 1], [0, 2, 8]], 0, 2, 0), 8)
check(cheapest_flight(3, [[0, 1, 1], [1, 2, 1]], 0, 2, 0), -1)
check(cheapest_flight(3, [[0, 1, 4], [1, 0, 1], [1, 2, 2]], 0, 2, 2), 6)
print(f"{passed}/15 ca đúng")
