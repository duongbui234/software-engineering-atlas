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

def network_by_rounds(edges, n, start):
    best = [float("inf")] * n
    best[start - 1] = 0
    for _ in range(n - 1):
        following = best.copy()
        for source, target, weight in edges:
            following[target - 1] = min(following[target - 1], best[source - 1] + weight)
        best = following
    last = max(best)
    return -1 if last == float("inf") else last

def check(got, expected):
    if got != expected:
        raise ValueError(("want", expected, "got", got))

check(network_delay([[1, 2, 9], [1, 3, 2], [3, 2, 1], [2, 4, 4]], 4, 1), 7)
check(network_by_rounds([[1, 2, 9], [1, 3, 2], [3, 2, 1], [2, 4, 4]], 4, 1), 7)
check(network_delay([[1, 2, 0], [2, 3, 0]], 3, 1), 0)
check(network_by_rounds([[1, 2, 0], [2, 3, 0]], 3, 1), 0)
check(network_delay([[2, 1, 7]], 3, 2), -1)
check(network_by_rounds([[2, 1, 7]], 3, 2), -1)
check(network_delay([], 1, 1), 0)
check(network_by_rounds([], 1, 1), 0)
check(network_delay([[1, 2, 8], [1, 3, 2], [3, 2, 6], [3, 4, 1], [4, 2, 1]], 4, 1), 4)
check(network_by_rounds([[1, 2, 8], [1, 3, 2], [3, 2, 6], [3, 4, 1], [4, 2, 1]], 4, 1), 4)
print("5/5 ca đúng")
