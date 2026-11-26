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

def redundant_by_dsu(n, edges):
    ds = DisjointSet(n + 1)
    for edge in edges:
        if not ds.union(*edge):
            return edge
    raise ValueError("Cần đúng một cạnh dư")


def redundant_by_walk(n, edges):
    adj = adjacency(n + 1, [])
    for a, b in edges:
        seen = [False] * (n + 1)
        walk(adj, a, seen)
        if seen[b]:
            return [a, b]
        adj[a].append(b)
        adj[b].append(a)
    raise ValueError("Cần đúng một cạnh dư")

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

def tree_by_dsu(n, edges):
    if len(edges) != n - 1:
        return False
    ds = DisjointSet(n)
    return all(ds.union(a, b) for a, b in edges)


def tree_by_walk(n, edges):
    return len(edges) == n - 1 and walk(adjacency(n, edges), 0, [False] * n) == n

def check():
    assert redundant_by_dsu(5, [[1, 4], [2, 4], [1, 2], [4, 5], [3, 5]]) == [1, 2]
    assert redundant_by_walk(5, [[1, 4], [2, 4], [1, 2], [4, 5], [3, 5]]) == [1, 2]
    assert redundant_by_dsu(4, [[1, 4], [1, 3], [2, 4], [2, 3]]) == [2, 3]
    assert redundant_by_walk(4, [[1, 4], [1, 3], [2, 4], [2, 3]]) == [2, 3]
    assert redundant_by_dsu(6, [[1, 4], [3, 5], [1, 5], [3, 4], [2, 6], [2, 5]]) == [3, 4]
    assert redundant_by_walk(6, [[1, 4], [3, 5], [1, 5], [3, 4], [2, 6], [2, 5]]) == [3, 4]

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

    assert tree_by_dsu(1, []) == True
    assert tree_by_walk(1, []) == True
    assert tree_by_dsu(3, [[0, 2], [2, 1]]) == True
    assert tree_by_walk(3, [[0, 2], [2, 1]]) == True
    assert tree_by_dsu(5, [[0, 1], [1, 2], [0, 2], [3, 4]]) == False
    assert tree_by_walk(5, [[0, 1], [1, 2], [0, 2], [3, 4]]) == False
    assert tree_by_dsu(5, [[0, 1], [1, 2], [3, 4]]) == False
    assert tree_by_walk(5, [[0, 1], [1, 2], [3, 4]]) == False
    assert tree_by_dsu(4, [[0, 1], [1, 3], [2, 3], [0, 2]]) == False
    assert tree_by_walk(4, [[0, 1], [1, 3], [2, 3], [0, 2]]) == False
    print("26/26 ca đúng")


if __name__ == "__main__":
    check()
