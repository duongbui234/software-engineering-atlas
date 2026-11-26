type Point = (i32, i32);

fn distance(p: Point, q: Point) -> i32 {
    (p.0 - q.0).abs() + (p.1 - q.1).abs()
}

fn prim(points: &[Point]) -> i64 {
    let n = points.len();
    let mut in_tree = vec![false; n];
    let mut best = vec![i32::MAX; n];
    best[0] = 0;
    let mut total = 0;

    for _ in points {
        let next = (0..n)
            .filter(|&i| !in_tree[i])
            .min_by_key(|&i| best[i])
            .unwrap();
        in_tree[next] = true;
        total += i64::from(best[next]);
        for i in 0..n {
            if !in_tree[i] {
                best[i] = best[i].min(distance(points[next], points[i]));
            }
        }
    }
    total
}

fn root(parent: &mut [usize], mut i: usize) -> usize {
    while parent[i] != i {
        parent[i] = parent[parent[i]];
        i = parent[i];
    }
    i
}

fn kruskal(points: &[Point]) -> i64 {
    let n = points.len();
    let mut edges = Vec::with_capacity(n * (n - 1) / 2);
    for a in 0..n {
        for b in a + 1..n {
            edges.push((distance(points[a], points[b]), a, b));
        }
    }
    edges.sort_unstable_by_key(|edge| edge.0);
    let mut parent: Vec<usize> = (0..n).collect();
    let mut size = vec![1; n];
    let mut total = 0;
    let mut used = 0;
    for (weight, a, b) in edges {
        let (mut x, mut y) = (root(&mut parent, a), root(&mut parent, b));
        if x == y {
            continue;
        }
        if size[x] < size[y] {
            std::mem::swap(&mut x, &mut y);
        }
        parent[y] = x;
        size[x] += size[y];
        total += i64::from(weight);
        used += 1;
        if used == n - 1 {
            break;
        }
    }
    total
}

// TESTS
fn main() {
    let cases: &[(&[Point], i64)] = &[
        (&[(4, 8)], 0),
        (&[(-2, 1), (1, 3)], 5),
        (&[(0, 0), (2, 0), (0, 2), (2, 2)], 6),
        (&[(0, 0), (10, 0), (11, 0), (22, 0)], 22),
        (&[(-3, -3), (-3, 2), (0, 2), (0, 4)], 10),
        (&[(-1000000, -1000000), (1000000, 1000000)], 4000000),
    ];
    for &(points, expected) in cases {
        assert_eq!(prim(points), expected);
        assert_eq!(kruskal(points), expected);
    }
    println!("{0}/{0} ca đúng", cases.len());
}
