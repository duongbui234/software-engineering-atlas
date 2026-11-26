use std::{cmp::Reverse, collections::BinaryHeap};

fn least_costs(
    graph: &[Vec<(usize, i32)>],
    start: usize,
    initial: i32,
    extend: impl Fn(i32, i32) -> i32,
) -> Vec<i32> {
    let mut best = vec![i32::MAX; graph.len()];
    best[start] = initial;
    let mut pending = BinaryHeap::from([Reverse((initial, start))]);
    while let Some(Reverse((cost, source))) = pending.pop() {
        if cost != best[source] {
            continue;
        }
        for &(target, weight) in &graph[source] {
            let candidate = extend(cost, weight);
            if candidate < best[target] {
                best[target] = candidate;
                pending.push(Reverse((candidate, target)));
            }
        }
    }
    best
}

fn network_delay(edges: &[(usize, usize, i32)], n: usize, start: usize) -> i32 {
    let mut graph = vec![Vec::new(); n];
    for &(from, to, time) in edges {
        graph[from - 1].push((to - 1, time));
    }
    let last_arrival = least_costs(&graph, start - 1, 0, |cost, time| cost + time)
        .into_iter()
        .max()
        .unwrap();
    if last_arrival == i32::MAX {
        -1
    } else {
        last_arrival
    }
}

fn network_by_rounds(edges: &[(usize, usize, i32)], n: usize, start: usize) -> i32 {
    let mut best = vec![i32::MAX; n];
    best[start - 1] = 0;
    for _ in 1..n {
        let mut next = best.clone();
        for &(source, target, cost) in edges {
            if best[source - 1] != i32::MAX {
                next[target - 1] = next[target - 1].min(best[source - 1] + cost);
            }
        }
        best = next;
    }
    let last = best.into_iter().max().unwrap();
    if last == i32::MAX {
        -1
    } else {
        last
    }
}

fn main() {
    check(
        network_delay(&[(1, 2, 9), (1, 3, 2), (3, 2, 1), (2, 4, 4)], 4, 1),
        7,
    );
    check(network_delay(&[(1, 2, 0), (2, 3, 0)], 3, 1), 0);
    check(network_by_rounds(&[(1, 2, 0), (2, 3, 0)], 3, 1), 0);
    check(network_delay(&[(2, 1, 7)], 3, 2), -1);
    check(network_by_rounds(&[(2, 1, 7)], 3, 2), -1);
    check(network_delay(&[], 1, 1), 0);
    check(network_by_rounds(&[], 1, 1), 0);
    check(
        network_delay(
            &[(1, 2, 8), (1, 3, 2), (3, 2, 6), (3, 4, 1), (4, 2, 1)],
            4,
            1,
        ),
        4,
    );
    println!("5/5 ca đúng");
}

fn check(got: i32, want: i32) {
    assert_eq!(got, want);
}
