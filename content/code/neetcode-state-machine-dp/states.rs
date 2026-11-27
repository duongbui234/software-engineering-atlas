// Ga DP-06: DP có trạng thái.
// Chạy: rustc --edition 2021 -O states.rs -o /tmp/states && /tmp/states

const NEG_INF: i32 = -(1 << 30); // như −∞, còn chỗ trừ thêm mà không tràn i32
const DIRS: [(i32, i32); 4] = [(1, 0), (-1, 0), (0, 1), (0, -1)];

fn max_profit_cooldown(prices: &[i32]) -> i32 {
    let (mut hold, mut sold, mut rest) = (NEG_INF, NEG_INF, 0); // đang giữ, vừa bán, tay không
    for &price in prices {
        let prev_sold = sold;
        sold = hold + price;
        hold = hold.max(rest - price);
        rest = rest.max(prev_sold);
    }
    rest.max(sold)
}

fn neighbor(grid: &[Vec<i32>], r: usize, c: usize, d: (i32, i32)) -> Option<(usize, usize)> {
    let (nr, nc) = (r as i32 + d.0, c as i32 + d.1);
    if nr < 0 || nc < 0 || nr as usize >= grid.len() || nc as usize >= grid[0].len() {
        return None;
    }
    Some((nr as usize, nc as usize))
}

fn dfs(grid: &[Vec<i32>], memo: &mut Vec<Vec<i32>>, r: usize, c: usize) -> i32 {
    if memo[r][c] > 0 {
        return memo[r][c];
    }
    let mut best = 1;
    for d in DIRS {
        if let Some((nr, nc)) = neighbor(grid, r, c, d) {
            if grid[nr][nc] > grid[r][c] {
                best = best.max(1 + dfs(grid, memo, nr, nc));
            }
        }
    }
    memo[r][c] = best;
    best
}

fn longest_increasing_path(grid: &[Vec<i32>]) -> i32 {
    let (m, n) = (grid.len(), grid[0].len());
    let mut memo = vec![vec![0; n]; m];
    let mut answer = 0;
    for r in 0..m {
        for c in 0..n {
            answer = answer.max(dfs(grid, &mut memo, r, c));
        }
    }
    answer
}

fn longest_increasing_path_layers(grid: &[Vec<i32>]) -> i32 {
    let (m, n) = (grid.len(), grid[0].len());
    let mut out = vec![vec![0; n]; m];
    let mut layer = Vec::new();
    for r in 0..m {
        for c in 0..n {
            for d in DIRS {
                if let Some((nr, nc)) = neighbor(grid, r, c, d) {
                    if grid[nr][nc] > grid[r][c] {
                        out[r][c] += 1;
                    }
                }
            }
            if out[r][c] == 0 {
                layer.push((r, c));
            }
        }
    }
    let mut layers = 0;
    while !layer.is_empty() {
        layers += 1;
        let mut next = Vec::new();
        for &(r, c) in &layer {
            for d in DIRS {
                if let Some((nr, nc)) = neighbor(grid, r, c, d) {
                    if grid[nr][nc] < grid[r][c] {
                        out[nr][nc] -= 1;
                        if out[nr][nc] == 0 {
                            next.push((nr, nc));
                        }
                    }
                }
            }
        }
        layer = next;
    }
    layers
}

fn main() {
    let stock_cases: Vec<(Vec<i32>, i32)> = vec![
        (vec![5], 0), (vec![5, 4, 3], 0), (vec![1, 2], 1), (vec![1, 3, 2, 8], 7), (vec![2, 4, 1, 7], 6),
        (vec![1, 4, 2, 7], 6), (vec![3, 1, 4, 8, 2, 6], 7), (vec![6, 1, 6, 4, 3, 0, 2], 7),
        (vec![1, 2, 4, 2, 5, 7, 2, 4, 9, 0], 11),
    ];
    let grid_cases: Vec<(Vec<Vec<i32>>, i32)> = vec![
        (vec![vec![7]], 1), (vec![vec![1, 2], vec![4, 3]], 4), (vec![vec![3, 3], vec![3, 3]], 1),
        (vec![vec![5, 4, 3], vec![6, 1, 2], vec![7, 8, 9]], 9), (vec![vec![1, 2, 3, 4, 5]], 5),
        (vec![vec![3], vec![2], vec![1]], 3),
    ];
    let (mut ok, mut total) = (0, 0);
    for (prices, want) in &stock_cases {
        total += 1;
        if max_profit_cooldown(prices) == *want {
            ok += 1;
        } else {
            println!("sai ở {:?}", prices);
        }
    }
    for (grid, want) in &grid_cases {
        total += 1;
        if longest_increasing_path(grid) == *want && longest_increasing_path_layers(grid) == *want {
            ok += 1;
        } else {
            println!("sai ở {:?}", grid);
        }
    }
    println!("{}/{} ca đúng", ok, total);
}
