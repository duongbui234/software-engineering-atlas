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

fn swim_time(grid: &[&[i32]]) -> i32 {
    let n = grid.len();
    let mut graph = vec![Vec::new(); n * n];
    let directions = [(-1, 0), (1, 0), (0, -1), (0, 1)];
    for row in 0..n {
        for col in 0..n {
            for (dr, dc) in directions {
                let r = row.wrapping_add_signed(dr);
                let c = col.wrapping_add_signed(dc);
                if r < n && c < n {
                    graph[row * n + col].push((r * n + c, grid[r][c]));
                }
            }
        }
    }
    least_costs(&graph, 0, grid[0][0], i32::max)[n * n - 1]
}

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

fn main() {
    check(
        network_delay(&[(1, 2, 9), (1, 3, 2), (3, 2, 1), (2, 4, 4)], 4, 1),
        7,
    );
    check(network_delay(&[(1, 2, 0), (2, 3, 0)], 3, 1), 0);
    check(network_delay(&[(2, 1, 7)], 3, 2), -1);
    check(network_delay(&[], 1, 1), 0);
    check(
        network_delay(
            &[(1, 2, 8), (1, 3, 2), (3, 2, 6), (3, 4, 1), (4, 2, 1)],
            4,
            1,
        ),
        4,
    );
    check(swim_time(&[&[0]]), 0);
    check(swim_time(&[&[3, 0], &[2, 1]]), 3);
    check(swim_time(&[&[0, 8, 7], &[1, 6, 5], &[2, 3, 4]]), 4);
    check(swim_time(&[&[0, 1, 8], &[7, 2, 6], &[5, 3, 4]]), 4);
    check(swim_time(&[&[0, 1], &[2, 3]]), 3);
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
    check(
        cheapest_flight(3, &[(0, 1, 4), (1, 0, 1), (1, 2, 2)], 0, 2, 2),
        6,
    );
    println!("15/15 ca đúng");
}

fn check(got: i32, want: i32) {
    assert_eq!(got, want);
}
