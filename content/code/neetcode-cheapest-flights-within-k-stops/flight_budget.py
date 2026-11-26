def cheapest_flight(n, flights, start, end, k):
    best = [float("inf")] * n
    best[start] = 0
    for _ in range(k + 1):
        following = best.copy()
        for source, target, price in flights:
            following[target] = min(following[target], best[source] + price)
        best = following
    return -1 if best[end] == float("inf") else best[end]

def cheapest_by_routes(n, flights, start, end, k):
    adj = [[] for _ in range(n)]
    for source, target, fare in flights:
        adj[source].append((target, fare))

    def visit(city, remaining):
        if city == end:
            return 0
        if remaining == 0:
            return float("inf")
        return min(
            (fare + visit(target, remaining - 1) for target, fare in adj[city]),
            default=float("inf"),
        )

    fare = visit(start, k + 1)
    return -1 if fare == float("inf") else fare

def check(got, expected):
    if got != expected:
        raise ValueError(("want", expected, "got", got))

check(cheapest_flight(4, [[0, 1, 1], [1, 2, 1], [0, 2, 6], [2, 3, 1]], 0, 3, 1), 7)
check(cheapest_by_routes(4, [[0, 1, 1], [1, 2, 1], [0, 2, 6], [2, 3, 1]], 0, 3, 1), 7)
check(cheapest_flight(4, [[0, 1, 1], [1, 2, 1], [0, 2, 6], [2, 3, 1]], 0, 3, 2), 3)
check(cheapest_by_routes(4, [[0, 1, 1], [1, 2, 1], [0, 2, 6], [2, 3, 1]], 0, 3, 2), 3)
check(cheapest_flight(3, [[0, 1, 1], [1, 2, 1], [0, 2, 8]], 0, 2, 0), 8)
check(cheapest_by_routes(3, [[0, 1, 1], [1, 2, 1], [0, 2, 8]], 0, 2, 0), 8)
check(cheapest_flight(3, [[0, 1, 1], [1, 2, 1]], 0, 2, 0), -1)
check(cheapest_by_routes(3, [[0, 1, 1], [1, 2, 1]], 0, 2, 0), -1)
check(cheapest_flight(3, [[0, 1, 4], [1, 0, 1], [1, 2, 2]], 0, 2, 2), 6)
check(cheapest_by_routes(3, [[0, 1, 4], [1, 0, 1], [1, 2, 2]], 0, 2, 2), 6)
print("5/5 ca đúng")
