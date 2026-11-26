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

def tree_by_dsu(n, edges):
    if len(edges) != n - 1:
        return False
    ds = DisjointSet(n)
    return all(ds.union(a, b) for a, b in edges)


def tree_by_walk(n, edges):
    return len(edges) == n - 1 and walk(adjacency(n, edges), 0, [False] * n) == n

def check():
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
    print("10/10 ca đúng")


if __name__ == "__main__":
    check()
