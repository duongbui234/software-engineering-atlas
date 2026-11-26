fn cheapest_flight(
    n: usize,
    flights: &[(usize, usize, i32)],
    start: usize,
    end: usize,
    k: usize,
) -> i32 {
    let mut best = vec![i32::MAX; n];
    best[start] = 0;
    for _ in 0..=k {
        let mut next = best.clone();
        for &(from, to, price) in flights {
            if best[from] != i32::MAX {
                next[to] = next[to].min(best[from] + price);
            }
        }
        best = next;
    }
    if best[end] == i32::MAX {
        -1
    } else {
        best[end]
    }
}

fn cheapest_by_routes(
    n: usize,
    flights: &[(usize, usize, i32)],
    start: usize,
    end: usize,
    k: usize,
) -> i32 {
    fn visit(adj: &[Vec<(usize, i32)>], city: usize, end: usize, remaining: usize) -> i32 {
        if city == end {
            return 0;
        }
        if remaining == 0 {
            return i32::MAX;
        }
        let mut best = i32::MAX;
        for &(next, fare) in &adj[city] {
            let tail = visit(adj, next, end, remaining - 1);
            if tail != i32::MAX {
                best = best.min(fare + tail);
            }
        }
        best
    }
    let mut adj = vec![vec![]; n];
    for &(from, to, fare) in flights {
        adj[from].push((to, fare));
    }
    let fare = visit(&adj, start, end, k + 1);
    if fare == i32::MAX {
        -1
    } else {
        fare
    }
}

fn main() {
    check(
        cheapest_flight(4, &[(0, 1, 1), (1, 2, 1), (0, 2, 6), (2, 3, 1)], 0, 3, 1),
        7,
    );
    check(
        cheapest_flight(4, &[(0, 1, 1), (1, 2, 1), (0, 2, 6), (2, 3, 1)], 0, 3, 2),
        3,
    );
    check(
        cheapest_flight(3, &[(0, 1, 1), (1, 2, 1), (0, 2, 8)], 0, 2, 0),
        8,
    );
    check(cheapest_flight(3, &[(0, 1, 1), (1, 2, 1)], 0, 2, 0), -1);
    check(cheapest_by_routes(3, &[(0, 1, 1), (1, 2, 1)], 0, 2, 0), -1);
    check(
        cheapest_flight(3, &[(0, 1, 4), (1, 0, 1), (1, 2, 2)], 0, 2, 2),
        6,
    );
    println!("5/5 ca đúng");
}

fn check(got: i32, want: i32) {
    assert_eq!(got, want);
}
