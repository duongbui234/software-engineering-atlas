// LC 417 Pacific Atlantic Water Flow: bốn cách đúng, ba cách sai, kiểm chung và phép đo.
// Chạy: rustc --edition 2021 -O pacific_atlantic.rs && ./pacific_atlantic

use std::time::Instant;

type Grid = Vec<Vec<i32>>;
type Cell = (usize, usize);

const DIRS: [(i32, i32); 4] = [(-1, 0), (1, 0), (0, -1), (0, 1)];

// Hàng xóm trong lưới m×n của ô (r, c), đã lọc ô ra ngoài biên.
fn neighbors(m: usize, n: usize, r: usize, c: usize) -> impl Iterator<Item = (usize, usize)> {
    DIRS.iter().filter_map(move |&(dr, dc)| {
        let (nr, nc) = (r as i32 + dr, c as i32 + dc);
        if nr < 0 || nr >= m as i32 || nc < 0 || nc >= n as i32 {
            None
        } else {
            Some((nr as usize, nc as usize))
        }
    })
}

// Cách 1: vét cạn. Từ mỗi ô, cho nước chảy xuôi và xem nó chạm được bờ nào. O((mn)^2).
fn brute_force(heights: &Grid) -> Vec<Cell> {
    let (m, n) = (heights.len(), heights[0].len());
    let mut result = Vec::new();
    for r in 0..m {
        for c in 0..n {
            let (mut pacific, mut atlantic) = (false, false);
            let mut seen = vec![false; m * n];
            let mut queue = vec![r * n + c];
            seen[r * n + c] = true;
            let mut head = 0;
            while head < queue.len() && !(pacific && atlantic) {
                let (cr, cc) = (queue[head] / n, queue[head] % n);
                head += 1;
                if cr == 0 || cc == 0 { pacific = true; }
                if cr == m - 1 || cc == n - 1 { atlantic = true; }
                for (nr, nc) in neighbors(m, n, cr, cc) {
                    if seen[nr * n + nc] || heights[nr][nc] > heights[cr][cc] { continue; }
                    seen[nr * n + nc] = true;
                    queue.push(nr * n + nc);
                }
            }
            if pacific && atlantic { result.push((r, c)); }
        }
    }
    result
}

// Cách 2: đi ngược từ bờ. BFS nhiều nguồn, leo lên ô cao hơn hoặc bằng. O(mn).
fn climb_bfs(heights: &Grid, seeds: &[usize]) -> Vec<bool> {
    let (m, n) = (heights.len(), heights[0].len());
    let mut seen = vec![false; m * n];
    let mut queue = Vec::new();
    for &s in seeds {
        if !seen[s] { seen[s] = true; queue.push(s); }
    }
    let mut head = 0;
    while head < queue.len() {
        let (cr, cc) = (queue[head] / n, queue[head] % n);
        head += 1;
        for (nr, nc) in neighbors(m, n, cr, cc) {
            if seen[nr * n + nc] || heights[nr][nc] < heights[cr][cc] { continue; }
            seen[nr * n + nc] = true;
            queue.push(nr * n + nc);
        }
    }
    seen
}

fn borders(m: usize, n: usize) -> (Vec<usize>, Vec<usize>) {
    let (mut pacific, mut atlantic) = (Vec::new(), Vec::new());
    for c in 0..n { pacific.push(c); atlantic.push((m - 1) * n + c); }
    for r in 0..m { pacific.push(r * n); atlantic.push(r * n + n - 1); }
    (pacific, atlantic)
}

fn intersect(a: &[bool], b: &[bool], n: usize) -> Vec<Cell> {
    (0..a.len()).filter(|&i| a[i] && b[i]).map(|i| (i / n, i % n)).collect()
}

fn reverse_bfs(heights: &Grid) -> Vec<Cell> {
    let (m, n) = (heights.len(), heights[0].len());
    let (pacific, atlantic) = borders(m, n);
    intersect(&climb_bfs(heights, &pacific), &climb_bfs(heights, &atlantic), n)
}

// Cách 3: cùng ý, DFS lặp bằng ngăn xếp.
fn climb_stack(heights: &Grid, seeds: &[usize]) -> Vec<bool> {
    let (m, n) = (heights.len(), heights[0].len());
    let mut seen = vec![false; m * n];
    let mut stack = Vec::new();
    for &s in seeds {
        if !seen[s] { seen[s] = true; stack.push(s); }
    }
    while let Some(cur) = stack.pop() {
        let (cr, cc) = (cur / n, cur % n);
        for (nr, nc) in neighbors(m, n, cr, cc) {
            if seen[nr * n + nc] || heights[nr][nc] < heights[cr][cc] { continue; }
            seen[nr * n + nc] = true;
            stack.push(nr * n + nc);
        }
    }
    seen
}

fn reverse_dfs_iterative(heights: &Grid) -> Vec<Cell> {
    let (m, n) = (heights.len(), heights[0].len());
    let (pacific, atlantic) = borders(m, n);
    intersect(&climb_stack(heights, &pacific), &climb_stack(heights, &atlantic), n)
}

// Cách 4: DFS đệ quy. Độ sâu lời gọi có thể bằng số ô.
fn visit(heights: &Grid, seen: &mut [bool], r: usize, c: usize) {
    let (m, n) = (heights.len(), heights[0].len());
    seen[r * n + c] = true;
    for (nr, nc) in neighbors(m, n, r, c) {
        if seen[nr * n + nc] || heights[nr][nc] < heights[r][c] { continue; }
        visit(heights, seen, nr, nc);
    }
}

fn reverse_dfs_recursive(heights: &Grid) -> Vec<Cell> {
    let (m, n) = (heights.len(), heights[0].len());
    let climb = |seeds: &[usize]| {
        let mut seen = vec![false; m * n];
        for &s in seeds {
            if !seen[s] { visit(heights, &mut seen, s / n, s % n); }
        }
        seen
    };
    let (pacific, atlantic) = borders(m, n);
    intersect(&climb(&pacific), &climb(&atlantic), n)
}

// Khung BFS chung cho các bản sai: step(cur, next) quyết định có bước sang ô kế không.
fn climb_with(heights: &Grid, seeds: &[usize], step: fn(i32, i32) -> bool) -> Vec<bool> {
    let (m, n) = (heights.len(), heights[0].len());
    let mut seen = vec![false; m * n];
    let mut queue = Vec::new();
    for &s in seeds {
        if !seen[s] { seen[s] = true; queue.push(s); }
    }
    let mut head = 0;
    while head < queue.len() {
        let (cr, cc) = (queue[head] / n, queue[head] % n);
        head += 1;
        for (nr, nc) in neighbors(m, n, cr, cc) {
            if seen[nr * n + nc] || !step(heights[cr][cc], heights[nr][nc]) { continue; }
            seen[nr * n + nc] = true;
            queue.push(nr * n + nc);
        }
    }
    seen
}

// Sai 1: đi ngược nhưng vẫn so như lúc nước chảy xuôi (xuống ô thấp hơn).
fn wrong_direction(heights: &Grid) -> Vec<Cell> {
    let (m, n) = (heights.len(), heights[0].len());
    let (pacific, atlantic) = borders(m, n);
    let down = |cur: i32, next: i32| next <= cur;
    intersect(&climb_with(heights, &pacific, down), &climb_with(heights, &atlantic, down), n)
}

// Sai 2: so ngặt (chỉ leo lên ô cao hơn hẳn), quên rằng nước chảy qua ô bằng nhau.
fn wrong_strict(heights: &Grid) -> Vec<Cell> {
    let (m, n) = (heights.len(), heights[0].len());
    let (pacific, atlantic) = borders(m, n);
    let up = |cur: i32, next: i32| next > cur;
    intersect(&climb_with(heights, &pacific, up), &climb_with(heights, &atlantic, up), n)
}

// Sai 3: mỗi đại dương chỉ gieo một cạnh (Thái Bình Dương: hàng trên; Đại Tây Dương: hàng dưới).
fn wrong_one_edge(heights: &Grid) -> Vec<Cell> {
    let (m, n) = (heights.len(), heights[0].len());
    let pacific: Vec<usize> = (0..n).collect();
    let atlantic: Vec<usize> = (0..n).map(|c| (m - 1) * n + c).collect();
    intersect(&climb_bfs(heights, &pacific), &climb_bfs(heights, &atlantic), n)
}

// ---------- Kiểm chung ----------

fn key(cells: &[Cell]) -> Vec<Cell> {
    let mut sorted = cells.to_vec();
    sorted.sort();
    sorted
}

fn row_major(m: usize, n: usize) -> Grid {
    (0..m).map(|r| (0..n).map(|c| (r * n + c) as i32).collect()).collect()
}
fn flat_grid(m: usize, n: usize) -> Grid {
    vec![vec![1; n]; m]
}
fn all_cells(m: usize, n: usize) -> Vec<Cell> {
    (0..m).flat_map(|r| (0..n).map(move |c| (r, c))).collect()
}
fn row_major_answer(m: usize, n: usize) -> Vec<Cell> {
    all_cells(m, n).into_iter().filter(|&(r, c)| r == m - 1 || c == n - 1).collect()
}

fn main() {
    let cases: Vec<(&str, Grid, Vec<Cell>)> = vec![
        ("một ô", vec![vec![7]], vec![(0, 0)]),
        ("một hàng", vec![vec![4, 1, 6]], vec![(0, 0), (0, 1), (0, 2)]),
        ("một cột", vec![vec![2], vec![9], vec![2]], vec![(0, 0), (1, 0), (2, 0)]),
        ("mặt phẳng 3×3", vec![vec![5; 3]; 3], all_cells(3, 3)),
        ("cái chén", vec![vec![3, 3, 3], vec![3, 1, 3], vec![3, 3, 3]],
            vec![(0, 0), (0, 1), (0, 2), (1, 0), (1, 2), (2, 0), (2, 1), (2, 2)]),
        ("góc trũng", vec![vec![9, 9, 1], vec![9, 9, 9], vec![1, 9, 9]], all_cells(3, 3)),
        ("sống núi giữa", vec![vec![1, 2, 3], vec![8, 9, 4], vec![7, 6, 5]],
            vec![(0, 2), (1, 0), (1, 1), (1, 2), (2, 0), (2, 1), (2, 2)]),
        ("bậc bằng nhau", vec![vec![1, 1, 1, 1], vec![1, 2, 2, 1], vec![1, 2, 2, 1], vec![1, 1, 1, 1]],
            all_cells(4, 4)),
        ("lưới tăng 200×200", row_major(200, 200), row_major_answer(200, 200)),
        ("mặt phẳng 200×200", flat_grid(200, 200), all_cells(200, 200)),
    ];

    let solvers: [(&str, fn(&Grid) -> Vec<Cell>); 7] = [
        ("brute_force", brute_force),
        ("reverse_bfs", reverse_bfs),
        ("reverse_dfs_iterative", reverse_dfs_iterative),
        ("reverse_dfs_recursive", reverse_dfs_recursive),
        ("wrong_direction", wrong_direction),
        ("wrong_strict", wrong_strict),
        ("wrong_one_edge", wrong_one_edge),
    ];

    for (name, solve) in solvers {
        let (mut ok, mut total) = (0, 0);
        let mut bad = Vec::new();
        for (case_name, heights, want) in &cases {
            if name == "brute_force" && heights.len() > 50 { continue; } // 40 000 ô: vét cạn quá chậm
            total += 1;
            if key(&solve(heights)) == key(want) { ok += 1; } else { bad.push(*case_name); }
        }
        let tail = if bad.is_empty() { String::new() } else { format!("; sai ở {}", bad.join(", ")) };
        let skipped = if total < cases.len() { " (bỏ hai ca 200×200)" } else { "" };
        println!("{:<22} {}/{} ca đúng{}{}", name, ok, total, skipped, tail);
    }

    // Lưới ngẫu nhiên: mọi cách đúng phải khớp vét cạn.
    let mut seed: u64 = 42;
    let mut rand = |k: u64| -> usize {
        seed = (seed * 1103515245 + 12345) % 2147483648;
        (seed % k) as usize
    };
    let (mut agree, trials) = (0, 2000);
    for _ in 0..trials {
        let m = 1 + rand(7);
        let n = 1 + rand(7);
        let k = 1 + rand(5) as u64;
        let h: Grid = (0..m).map(|_| (0..n).map(|_| rand(k) as i32).collect()).collect();
        let want = key(&brute_force(&h));
        if key(&reverse_bfs(&h)) == want && key(&reverse_dfs_iterative(&h)) == want
            && key(&reverse_dfs_recursive(&h)) == want { agree += 1; }
    }
    println!("ngẫu nhiên: {}/{} lưới, ba cách đi ngược khớp vét cạn", agree, trials);

    // Phép đo: vét cạn so với đi ngược.
    let time = |f: &dyn Fn()| { let t0 = Instant::now(); f(); t0.elapsed().as_secs_f64() * 1000.0 };
    for size in [20, 40, 80] {
        let h = flat_grid(size, size);
        let brute = time(&|| { brute_force(&h); });
        let rev = time(&|| { reverse_bfs(&h); });
        println!("mặt phẳng {size}×{size}: vét cạn {brute:.1} ms, đi ngược {rev:.2} ms");
    }
    let big = flat_grid(200, 200);
    println!("mặt phẳng 200×200: đi ngược BFS {:.1} ms", time(&|| { reverse_bfs(&big); }));
}
