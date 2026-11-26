type Edge = [usize; 2];

struct DisjointSet {
    parent: Vec<usize>,
    size: Vec<usize>,
    count: usize,
}

impl DisjointSet {
    fn new(n: usize) -> Self {
        Self {
            parent: (0..n).collect(),
            size: vec![1; n],
            count: n,
        }
    }

    fn find(&mut self, mut node: usize) -> usize {
        while node != self.parent[node] {
            self.parent[node] = self.parent[self.parent[node]];
            node = self.parent[node];
        }
        node
    }

    fn union(&mut self, a: usize, b: usize) -> bool {
        let mut ra = self.find(a);
        let mut rb = self.find(b);
        if ra == rb {
            return false;
        }
        if self.size[ra] < self.size[rb] {
            std::mem::swap(&mut ra, &mut rb);
        }
        self.parent[rb] = ra;
        self.size[ra] += self.size[rb];
        self.count -= 1;
        true
    }
}

fn adjacency(n: usize, edges: &[Edge]) -> Vec<Vec<usize>> {
    let mut adj = vec![vec![]; n];
    for &[a, b] in edges {
        adj[a].push(b);
        adj[b].push(a);
    }
    adj
}

fn walk(adj: &[Vec<usize>], start: usize, seen: &mut [bool]) -> usize {
    let mut pending = vec![start];
    seen[start] = true;
    let mut visited = 0;
    while let Some(node) = pending.pop() {
        visited += 1;
        for &next in &adj[node] {
            if !seen[next] {
                seen[next] = true;
                pending.push(next);
            }
        }
    }
    visited
}

fn redundant_by_dsu(n: usize, edges: &[Edge]) -> Edge {
    let mut ds = DisjointSet::new(n + 1);
    for &[a, b] in edges {
        if !ds.union(a, b) {
            return [a, b];
        }
    }
    panic!("Cần đúng một cạnh dư");
}

fn redundant_by_walk(n: usize, edges: &[Edge]) -> Edge {
    let mut adj = adjacency(n + 1, &[]);
    for &[a, b] in edges {
        let mut seen = vec![false; n + 1];
        walk(&adj, a, &mut seen);
        if seen[b] {
            return [a, b];
        }
        adj[a].push(b);
        adj[b].push(a);
    }
    panic!("Cần đúng một cạnh dư");
}

fn main() {
    assert_eq!(
        redundant_by_dsu(5, &[[1, 4], [2, 4], [1, 2], [4, 5], [3, 5]]),
        [1, 2]
    );
    assert_eq!(
        redundant_by_walk(5, &[[1, 4], [2, 4], [1, 2], [4, 5], [3, 5]]),
        [1, 2]
    );
    assert_eq!(
        redundant_by_dsu(4, &[[1, 4], [1, 3], [2, 4], [2, 3]]),
        [2, 3]
    );
    assert_eq!(
        redundant_by_walk(4, &[[1, 4], [1, 3], [2, 4], [2, 3]]),
        [2, 3]
    );
    assert_eq!(
        redundant_by_dsu(6, &[[1, 4], [3, 5], [1, 5], [3, 4], [2, 6], [2, 5]]),
        [3, 4]
    );
    assert_eq!(
        redundant_by_walk(6, &[[1, 4], [3, 5], [1, 5], [3, 4], [2, 6], [2, 5]]),
        [3, 4]
    );
    println!("6/6 ca đúng");
}
