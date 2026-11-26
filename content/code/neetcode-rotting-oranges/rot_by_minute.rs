use std::collections::VecDeque;

type Grid = Vec<Vec<u8>>;

const DIRECTIONS: [(i32, i32); 4] = [(-1, 0), (1, 0), (0, -1), (0, 1)];

fn at(grid: &Grid, r: i32, c: i32) -> Option<u8> {
    if r < 0 || c < 0 {
        return None;
    }
    grid.get(r as usize)?.get(c as usize).copied()
}

fn simulate(mut grid: Grid) -> (i32, usize) {
    let mut fresh = grid.iter().flatten().filter(|&&v| v == 1).count();
    let mut minutes = 0;
    let mut scans = 0;

    while fresh > 0 {
        let mut next = Vec::new();
        for r in 0..grid.len() {
            for c in 0..grid[0].len() {
                scans += 1;
                if grid[r][c] == 1
                    && DIRECTIONS.iter().any(|&(dr, dc)| at(&grid, r as i32 + dr, c as i32 + dc) == Some(2))
                {
                    next.push((r, c));
                }
            }
        }
        if next.is_empty() {
            return (-1, scans);
        }
        for &(r, c) in &next {
            grid[r][c] = 2;
        }
        fresh -= next.len();
        minutes += 1;
    }
    (minutes, scans)
}

fn spread(mut grid: Grid) -> (i32, usize) {
    let mut queue = VecDeque::new();
    let mut fresh = 0;
    for r in 0..grid.len() {
        for c in 0..grid[0].len() {
            if grid[r][c] == 2 { queue.push_back((r as i32, c as i32)); }
            if grid[r][c] == 1 { fresh += 1; }
        }
    }

    let mut pops = 0;
    let mut minutes = 0;
    while !queue.is_empty() {
        let mut rotted_this_minute = false;
        for _ in 0..queue.len() {
            let (r, c) = queue.pop_front().unwrap();
            pops += 1;
            for (dr, dc) in DIRECTIONS {
                let (nr, nc) = (r + dr, c + dc);
                if at(&grid, nr, nc) != Some(1) {
                    continue;
                }
                grid[nr as usize][nc as usize] = 2;
                fresh -= 1;
                rotted_this_minute = true;
                queue.push_back((nr, nc));
            }
        }
        if rotted_this_minute { minutes += 1; }
    }
    (if fresh == 0 { minutes } else { -1 }, pops)
}

fn main() {
    let cases: Vec<(Grid, i32)> = vec![
        (vec![vec![2, 1, 1, 0, 2], vec![0, 1, 1, 1, 1]], 3),
        (vec![vec![2, 1, 0, 1], vec![0, 1, 0, 1]], -1),
        (vec![vec![0, 2, 0]], 0),
        (vec![vec![1]], -1),
        (vec![vec![0]], 0),
        (vec![vec![2, 1, 2]], 1),
        (vec![vec![2, 1, 1, 1, 1, 1, 1, 1, 1, 1]], 9),
    ];

    for (grid, expected) in &cases {
        if simulate(grid.clone()).0 != *expected || spread(grid.clone()).0 != *expected {
            panic!("unexpected result for {:?}", grid);
        }
    }

    let corridor = &cases[cases.len() - 1].0;
    let (_, scans) = simulate(corridor.clone());
    let (_, pops) = spread(corridor.clone());
    if scans != 90 || pops != 10 {
        panic!("unexpected operation counts");
    }
    println!("{}/{} ca đúng", cases.len(), cases.len());
    println!("Quét: {}; lấy khỏi hàng đợi: {}", scans, pops);
}
