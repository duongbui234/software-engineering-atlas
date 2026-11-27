// LeetCode 329: đường tăng dài nhất trong ma trận, ba cách giải
// Chạy: rustc --edition 2021 -O climb.rs -o /tmp/climb && /tmp/climb
use std::cell::Cell;

const DIRS: [(i32, i32); 4] = [(1, 0), (-1, 0), (0, 1), (0, -1)];

fn larger_neighbors(grid: &[Vec<i32>], r: usize, c: usize) -> impl Iterator<Item = (usize, usize)> + '_ {
    DIRS.iter().filter_map(move |&(dr, dc)| {
        let nr = r as i32 + dr;
        let nc = c as i32 + dc;
        if nr < 0 || nc < 0 || nr as usize >= grid.len() || nc as usize >= grid[0].len() {
            return None;
        }
        let (nr, nc) = (nr as usize, nc as usize);
        (grid[nr][nc] > grid[r][c]).then_some((nr, nc))
    })
}

// Vét cạn: DFS từ mọi ô, không nhớ gì
fn brute_climb(grid: &[Vec<i32>], r: usize, c: usize, calls: &Cell<u64>) -> i32 {
    calls.set(calls.get() + 1);
    let mut best = 1;
    for (nr, nc) in larger_neighbors(grid, r, c) {
        best = best.max(1 + brute_climb(grid, nr, nc, calls));
    }
    best
}

fn longest_path_brute(grid: &[Vec<i32>], calls: &Cell<u64>) -> i32 {
    let mut answer = 0;
    for r in 0..grid.len() {
        for c in 0..grid[0].len() {
            answer = answer.max(brute_climb(grid, r, c, calls));
        }
    }
    answer
}

// DFS ghi nhớ: memo[ô] = độ dài đường tăng dài nhất bắt đầu ở ô đó.
// Không cần tập "đang thăm": cạnh chỉ đi lên giá trị lớn hơn nên không có vòng.
fn memo_climb(grid: &[Vec<i32>], memo: &mut Vec<i32>, r: usize, c: usize, calls: &Cell<u64>) -> i32 {
    calls.set(calls.get() + 1);
    let key = r * grid[0].len() + c;
    if memo[key] != 0 {
        return memo[key];
    }
    let mut best = 1;
    for (nr, nc) in larger_neighbors(grid, r, c) {
        best = best.max(1 + memo_climb(grid, memo, nr, nc, calls));
    }
    memo[key] = best;
    best
}

fn longest_path_memo(grid: &[Vec<i32>], calls: &Cell<u64>) -> i32 {
    let mut memo = vec![0; grid.len() * grid[0].len()]; // 0 = chưa tính, đáp án luôn ≥ 1
    let mut answer = 0;
    for r in 0..grid.len() {
        for c in 0..grid[0].len() {
            answer = answer.max(memo_climb(grid, &mut memo, r, c, calls));
        }
    }
    answer
}

// Bóc lớp theo thứ tự topo (Kahn): lớp đầu là các "đỉnh" không còn ô lớn hơn kề bên.
// Số lớp bóc được chính là độ dài đường dài nhất. Không đệ quy.
fn longest_increasing_path(grid: &[Vec<i32>]) -> i32 {
    let (rows, cols) = (grid.len(), grid[0].len());
    let mut out_degree = vec![0; rows * cols]; // số ô kề lớn hơn
    let mut layer = Vec::new();
    for r in 0..rows {
        for c in 0..cols {
            out_degree[r * cols + c] = larger_neighbors(grid, r, c).count();
            if out_degree[r * cols + c] == 0 {
                layer.push((r, c));
            }
        }
    }
    let mut layers = 0;
    while !layer.is_empty() {
        layers += 1;
        let mut next = Vec::new();
        for &(r, c) in &layer {
            for &(dr, dc) in &DIRS {
                let (nr, nc) = (r as i32 + dr, c as i32 + dc);
                if nr < 0 || nc < 0 || nr as usize >= rows || nc as usize >= cols {
                    continue;
                }
                let (nr, nc) = (nr as usize, nc as usize);
                // ô nhỏ hơn kề bên mất một lối lên; hết lối thì vào lớp sau
                if grid[nr][nc] < grid[r][c] {
                    out_degree[nr * cols + nc] -= 1;
                    if out_degree[nr * cols + nc] == 0 {
                        next.push((nr, nc));
                    }
                }
            }
        }
        layer = next;
    }
    layers
}

// ---------- kiểm tra ----------
fn snake(n: usize) -> Vec<Vec<i32>> {
    (0..n)
        .map(|r| (0..n).map(|c| (r * n + if r % 2 == 0 { c } else { n - 1 - c }) as i32).collect())
        .collect()
}

// Hàng chẵn là lối đi zigzag, hàng lẻ là tường giá trị 0 chừa một ô nối.
// Từ ô (0, 0) chỉ có đúng một ô kề lớn hơn, nên DFS đi một mạch hết đường.
fn corridor(n: usize) -> Vec<Vec<i32>> {
    let mut grid = vec![vec![0; n]; n];
    let mut value = 0;
    let mut k = 0;
    while 2 * k < n {
        let r = 2 * k;
        for i in 0..n {
            value += 1;
            grid[r][if k % 2 == 0 { i } else { n - 1 - i }] = value;
        }
        if r + 2 < n {
            value += 1;
            grid[r + 1][if k % 2 == 0 { n - 1 } else { 0 }] = value;
        }
        k += 1;
    }
    grid
}

fn shape(flat: &[i32], cols: usize) -> Vec<Vec<i32>> {
    flat.chunks(cols).map(|row| row.to_vec()).collect()
}

fn permute(items: &[i32], prefix: &mut Vec<i32>, out: &mut Vec<Vec<i32>>) {
    if items.is_empty() {
        out.push(prefix.clone());
        return;
    }
    for i in 0..items.len() {
        let mut rest = items.to_vec();
        let v = rest.remove(i);
        prefix.push(v);
        permute(&rest, prefix, out);
        prefix.pop();
    }
}

fn main() {
    let calls = Cell::new(0u64);
    let small: Vec<(Vec<Vec<i32>>, i32)> = vec![
        (vec![vec![1]], 1),
        (vec![vec![7, 7], vec![7, 7]], 1),
        (vec![vec![1, 2, 3], vec![6, 5, 4], vec![7, 8, 9]], 9),
        (vec![vec![5, 4], vec![2, 3]], 4),
        (vec![vec![1, 3, 2, 4, 5]], 3),
        (vec![vec![3], vec![2], vec![1]], 3),
        (vec![vec![0, 2147483647]], 2),
        (vec![vec![7, 8, 1], vec![6, 2, 3], vec![5, 4, 9]], 6),
    ];
    let big: Vec<(Vec<Vec<i32>>, i32)> = vec![
        (vec![vec![5; 200]; 200], 1),
        (snake(200), 40000),
        (corridor(200), 20100),
    ];
    let mut ok = 0;
    for (grid, want) in &small {
        if longest_path_brute(grid, &calls) == *want
            && longest_path_memo(grid, &calls) == *want
            && longest_increasing_path(grid) == *want
        {
            ok += 1;
        } else {
            println!("sai: {:?}", grid);
        }
    }
    for (grid, want) in &big {
        if longest_increasing_path(grid) == *want {
            ok += 1;
        } else {
            println!("sai ở lưới lớn, mong {}", want);
        }
    }
    println!("{}/{} ca đúng", ok, small.len() + big.len());

    // Đối chiếu: mọi lưới r×c (r·c ≤ 6) giá trị 0..2, và mọi lưới 2×3, 3×2 là hoán vị của 1..6
    let (mut total, mut agree) = (0, 0);
    let mut check = |grid: Vec<Vec<i32>>| {
        total += 1;
        let want = longest_path_brute(&grid, &calls);
        if longest_path_memo(&grid, &calls) == want && longest_increasing_path(&grid) == want {
            agree += 1;
        }
    };
    for rows in 1..=6usize {
        let mut cols = 1;
        while rows * cols <= 6 {
            let size = rows * cols;
            for code in 0..3usize.pow(size as u32) {
                let mut x = code;
                let flat: Vec<i32> = (0..size)
                    .map(|_| {
                        let digit = (x % 3) as i32;
                        x /= 3;
                        digit
                    })
                    .collect();
                check(shape(&flat, cols));
            }
            cols += 1;
        }
    }
    let mut perms = Vec::new();
    permute(&[1, 2, 3, 4, 5, 6], &mut Vec::new(), &mut perms);
    for p in &perms {
        check(shape(p, 3));
        check(shape(p, 2));
    }
    println!("{}/{} ca đúng (đối chiếu vét cạn)", agree, total);

    // Đếm lượt gọi trên lưới 10×10 có giá trị i + j: rất nhiều đường tăng chồng lên nhau
    let diagonal: Vec<Vec<i32>> = (0..10).map(|r| (0..10).map(|c| r + c).collect()).collect();
    let (brute_calls, memo_calls) = (Cell::new(0u64), Cell::new(0u64));
    longest_path_brute(&diagonal, &brute_calls);
    longest_path_memo(&diagonal, &memo_calls);
    println!(
        "Lưới 10×10 giá trị i+j: vét cạn {} lượt gọi, memo {} lượt gọi",
        brute_calls.get(),
        memo_calls.get()
    );

    // Lưới hành lang 200×200: DFS từ ô (0, 0) phải đệ quy sâu 20099 tầng.
    // Luồng main lấy ngăn xếp theo ulimit của hệ điều hành (thường 8 MB trên Linux), đủ cho độ sâu này.
    let deep = corridor(200);
    println!(
        "Lưới hành lang 200×200: bóc lớp {}, memo đệ quy {}",
        longest_increasing_path(&deep),
        longest_path_memo(&deep, &calls)
    );
}
