def distance(p, q):
    return abs(p[0] - q[0]) + abs(p[1] - q[1])


def prim(points):
    n = len(points)
    in_tree = [False] * n
    best = [float("inf")] * n
    best[0] = 0
    total = 0

    for _ in points:
        next_point = min((i for i in range(n) if not in_tree[i]), key=best.__getitem__)
        in_tree[next_point] = True
        total += best[next_point]
        for i in range(n):
            if not in_tree[i]:
                best[i] = min(best[i], distance(points[next_point], points[i]))
    return total


def kruskal(points):
    n = len(points)
    edges = sorted((distance(points[a], points[b]), a, b)
                   for a in range(n) for b in range(a + 1, n))
    parent = list(range(n))
    size = [1] * n

    def root(i):
        while i != parent[i]:
            parent[i] = parent[parent[i]]
            i = parent[i]
        return i

    total = used = 0
    for weight, a, b in edges:
        x, y = root(a), root(b)
        if x == y:
            continue
        if size[x] < size[y]:
            x, y = y, x
        parent[y] = x
        size[x] += size[y]
        total += weight
        used += 1
        if used == n - 1:
            break
    return total

def find_itinerary(tickets):
    outgoing = {}
    for start, end in tickets:
        outgoing.setdefault(start, []).append(end)
    for destinations in outgoing.values():
        destinations.sort(reverse=True)

    stack = ["JFK"]
    suffix = []
    while stack:
        destinations = outgoing.get(stack[-1])
        if destinations:
            stack.append(destinations.pop())
        else:
            suffix.append(stack.pop())
    return suffix[::-1]

# EXAMPLE
points = [(0, 0), (4, 0), (5, 0), (5, 2)]
tickets = [("JFK", "AAA"), ("JFK", "BBB"), ("BBB", "JFK")]
assert prim(points) == kruskal(points) == 7
assert find_itinerary(tickets) == ["JFK", "BBB", "JFK", "AAA"]
print("2/2 ca đúng")
