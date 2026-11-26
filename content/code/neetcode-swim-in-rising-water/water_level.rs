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

fn swim_by_threshold(grid: &[&[i32]], binary: bool) -> i32 {
    let n = grid.len();
    let reachable = |level: i32| {
        let mut queue = vec![(0_usize, 0_usize)];
        let mut seen = vec![false; n * n];
        seen[0] = true;
        let mut head = 0;
        while head < queue.len() {
            let (row, col) = queue[head];
            head += 1;
            if row == n - 1 && col == n - 1 {
                return true;
            }
            for (dr, dc) in [(1, 0), (-1, 0), (0, 1), (0, -1)] {
                let r = row.wrapping_add_signed(dr);
                let c = col.wrapping_add_signed(dc);
                if r < n && c < n && grid[r][c] <= level && !seen[r * n + c] {
                    seen[r * n + c] = true;
                    queue.push((r, c));
                }
            }
        }
        false
    };

    let mut low = grid[0][0].max(grid[n - 1][n - 1]);
    let mut high = (n * n - 1) as i32;
    if !binary {
        while !reachable(low) {
            low += 1;
        }
        return low;
    }
    while low < high {
        let mid = (low + high) / 2;
        if reachable(mid) {
            high = mid;
        } else {
            low = mid + 1;
        }
    }
    low
}

fn main() {
    check(swim_time(&[&[0]]), 0);
    check(swim_by_threshold(&[&[0]], true), 0);
    check(swim_by_threshold(&[&[0]], false), 0);
    check(swim_time(&[&[3, 0], &[2, 1]]), 3);
    check(swim_by_threshold(&[&[3, 0], &[2, 1]], true), 3);
    check(swim_by_threshold(&[&[3, 0], &[2, 1]], false), 3);
    check(swim_time(&[&[0, 8, 7], &[1, 6, 5], &[2, 3, 4]]), 4);
    check(
        swim_by_threshold(&[&[0, 8, 7], &[1, 6, 5], &[2, 3, 4]], true),
        4,
    );
    check(
        swim_by_threshold(&[&[0, 8, 7], &[1, 6, 5], &[2, 3, 4]], false),
        4,
    );
    check(swim_time(&[&[0, 1, 8], &[7, 2, 6], &[5, 3, 4]]), 4);
    check(
        swim_by_threshold(&[&[0, 1, 8], &[7, 2, 6], &[5, 3, 4]], true),
        4,
    );
    check(
        swim_by_threshold(&[&[0, 1, 8], &[7, 2, 6], &[5, 3, 4]], false),
        4,
    );
    check(swim_time(&[&[0, 1], &[2, 3]]), 3);
    check(swim_by_threshold(&[&[0, 1], &[2, 3]], true), 3);
    check(swim_by_threshold(&[&[0, 1], &[2, 3]], false), 3);
    println!("5/5 ca đúng");
}

fn check(got: i32, want: i32) {
    assert_eq!(got, want);
}
