use std::collections::HashMap;

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

fn find_itinerary<'a>(tickets: &[(&'a str, &'a str)]) -> Vec<&'a str> {
    let mut outgoing: HashMap<&str, Vec<&str>> = HashMap::new();
    for &(from, to) in tickets {
        outgoing.entry(from).or_default().push(to);
    }
    for destinations in outgoing.values_mut() {
        destinations.sort_unstable_by(|a, b| b.cmp(a));
    }

    let mut stack = vec!["JFK"];
    let mut suffix = Vec::with_capacity(tickets.len() + 1);
    while let Some(&current) = stack.last() {
        if let Some(next) = outgoing.get_mut(current).and_then(Vec::pop) {
            stack.push(next);
        } else {
            suffix.push(stack.pop().unwrap());
        }
    }
    suffix.reverse();
    suffix
}

// EXAMPLE
fn main() {
    let points = [(0, 0), (4, 0), (5, 0), (5, 2)];
    let tickets = [("JFK", "AAA"), ("JFK", "BBB"), ("BBB", "JFK")];
    assert_eq!(prim(&points), 7);
    assert_eq!(kruskal(&points), 7);
    assert_eq!(find_itinerary(&tickets), ["JFK", "BBB", "JFK", "AAA"]);
    println!("2/2 ca đúng");
}
