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


# TESTS
cases = [
    ([(4, 8)], 0),
    ([(-2, 1), (1, 3)], 5),
    ([(0, 0), (2, 0), (0, 2), (2, 2)], 6),
    ([(0, 0), (10, 0), (11, 0), (22, 0)], 22),
    ([(-3, -3), (-3, 2), (0, 2), (0, 4)], 10),
    ([(-1000000, -1000000), (1000000, 1000000)], 4000000),
]
for points, expected in cases:
    assert prim(points) == kruskal(points) == expected
print(f"{len(cases)}/{len(cases)} ca đúng")
