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

fn components_by_dsu(n: usize, edges: &[Edge]) -> usize {
    let mut ds = DisjointSet::new(n);
    for &[a, b] in edges {
        ds.union(a, b);
    }
    ds.count
}

fn components_by_walk(n: usize, edges: &[Edge]) -> usize {
    let adj = adjacency(n, edges);
    let mut seen = vec![false; n];
    let mut count = 0;
    for v in 0..n {
        if !seen[v] {
            walk(&adj, v, &mut seen);
            count += 1;
        }
    }
    count
}

fn tree_by_dsu(n: usize, edges: &[Edge]) -> bool {
    if edges.len() != n - 1 {
        return false;
    }
    let mut ds = DisjointSet::new(n);
    edges.iter().all(|&[a, b]| ds.union(a, b))
}

fn tree_by_walk(n: usize, edges: &[Edge]) -> bool {
    edges.len() == n - 1 && walk(&adjacency(n, edges), 0, &mut vec![false; n]) == n
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

    assert_eq!(components_by_dsu(7, &[[0, 2], [2, 4], [0, 4], [1, 3]]), 4);
    assert_eq!(components_by_walk(7, &[[0, 2], [2, 4], [0, 4], [1, 3]]), 4);
    assert_eq!(components_by_dsu(5, &[[3, 4], [1, 2], [0, 4], [2, 3]]), 1);
    assert_eq!(components_by_walk(5, &[[3, 4], [1, 2], [0, 4], [2, 3]]), 1);
    assert_eq!(components_by_dsu(1, &[]), 1);
    assert_eq!(components_by_walk(1, &[]), 1);
    assert_eq!(components_by_dsu(6, &[[2, 5]]), 5);
    assert_eq!(components_by_walk(6, &[[2, 5]]), 5);
    assert_eq!(components_by_dsu(4, &[]), 4);
    assert_eq!(components_by_walk(4, &[]), 4);

    assert_eq!(tree_by_dsu(1, &[]), true);
    assert_eq!(tree_by_walk(1, &[]), true);
    assert_eq!(tree_by_dsu(3, &[[0, 2], [2, 1]]), true);
    assert_eq!(tree_by_walk(3, &[[0, 2], [2, 1]]), true);
    assert_eq!(tree_by_dsu(5, &[[0, 1], [1, 2], [0, 2], [3, 4]]), false);
    assert_eq!(tree_by_walk(5, &[[0, 1], [1, 2], [0, 2], [3, 4]]), false);
    assert_eq!(tree_by_dsu(5, &[[0, 1], [1, 2], [3, 4]]), false);
    assert_eq!(tree_by_walk(5, &[[0, 1], [1, 2], [3, 4]]), false);
    assert_eq!(tree_by_dsu(4, &[[0, 1], [1, 3], [2, 3], [0, 2]]), false);
    assert_eq!(tree_by_walk(4, &[[0, 1], [1, 3], [2, 3], [0, 2]]), false);
    println!("26/26 ca đúng");
}
