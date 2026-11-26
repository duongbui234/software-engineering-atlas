class DisjointSet:
    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n
        self.count = n

    def find(self, node):
        while node != self.parent[node]:
            self.parent[node] = self.parent[self.parent[node]]
            node = self.parent[node]
        return node

    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return False
        if self.size[ra] < self.size[rb]:
            ra, rb = rb, ra
        self.parent[rb] = ra
        self.size[ra] += self.size[rb]
        self.count -= 1
        return True


def adjacency(n, edges):
    adj = [[] for _ in range(n)]
    for a, b in edges:
        adj[a].append(b)
        adj[b].append(a)
    return adj


def walk(adj, start, seen):
    pending = [start]
    seen[start] = True
    visited = 0
    while pending:
        visited += 1
        for nxt in adj[pending.pop()]:
            if not seen[nxt]:
                seen[nxt] = True
                pending.append(nxt)
    return visited

def components_by_dsu(n, edges):
    ds = DisjointSet(n)
    for a, b in edges:
        ds.union(a, b)
    return ds.count


def components_by_walk(n, edges):
    adj = adjacency(n, edges)
    seen = [False] * n
    count = 0
    for vertex in range(n):
        if not seen[vertex]:
            walk(adj, vertex, seen)
            count += 1
    return count

def check():
    assert components_by_dsu(7, [[0, 2], [2, 4], [0, 4], [1, 3]]) == 4
    assert components_by_walk(7, [[0, 2], [2, 4], [0, 4], [1, 3]]) == 4
    assert components_by_dsu(5, [[3, 4], [1, 2], [0, 4], [2, 3]]) == 1
    assert components_by_walk(5, [[3, 4], [1, 2], [0, 4], [2, 3]]) == 1
    assert components_by_dsu(1, []) == 1
    assert components_by_walk(1, []) == 1
    assert components_by_dsu(6, [[2, 5]]) == 5
    assert components_by_walk(6, [[2, 5]]) == 5
    assert components_by_dsu(4, []) == 4
    assert components_by_walk(4, []) == 4
    print("10/10 ca đúng")


if __name__ == "__main__":
    check()
