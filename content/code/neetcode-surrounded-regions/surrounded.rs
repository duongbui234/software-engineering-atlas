// LC 130 Surrounded Regions: mọi cách giải trên trang, kèm các bản sai hay gặp.
// Chạy: rustc --edition 2021 -O surrounded.rs && ./surrounded

use std::time::Instant;

type Board = Vec<Vec<u8>>;

const DIRS: [(i32, i32); 4] = [(-1, 0), (1, 0), (0, -1), (0, 1)];

// Hàng xóm trong bảng m×n của ô (r, c), đã lọc ô ra ngoài biên.
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

// Cách 0: vét cạn. Với từng ô O, chạy một BFS riêng để xem nó có tới được biên không. O((mn)²).
fn brute_force_per_cell(board: &mut Board, visits: &mut u64) {
    let (m, n) = (board.len(), board[0].len());
    let mut stamp = vec![0u32; m * n];
    let mut round = 0;
    let mut to_flip = Vec::new();
    for r in 0..m {
        for c in 0..n {
            if board[r][c] != b'O' { continue; }
            round += 1;
            let mut queue = vec![r * n + c];
            stamp[r * n + c] = round;
            let mut escaped = false;
            let mut head = 0;
            while head < queue.len() && !escaped {
                *visits += 1;
                let (cr, cc) = (queue[head] / n, queue[head] % n);
                head += 1;
                if cr == 0 || cr == m - 1 || cc == 0 || cc == n - 1 { escaped = true; }
                for (nr, nc) in neighbors(m, n, cr, cc) {
                    if board[nr][nc] != b'O' || stamp[nr * n + nc] == round { continue; }
                    stamp[nr * n + nc] = round;
                    queue.push(nr * n + nc);
                }
            }
            if !escaped { to_flip.push(r * n + c); } // chưa đổi ngay, để các ô sau còn đọc đúng
        }
    }
    for id in to_flip { board[id / n][id % n] = b'X'; }
}

fn brute_force(board: &mut Board) {
    let mut visits = 0;
    brute_force_per_cell(board, &mut visits);
}

// Cách 1: tô từng vùng. Gom cả vùng bằng BFS, nhớ xem vùng có chạm biên không, duyệt xong mới đổi. O(mn).
fn region_fill(board: &mut Board) {
    let (m, n) = (board.len(), board[0].len());
    let mut seen = vec![false; m * n];
    for r in 0..m {
        for c in 0..n {
            if board[r][c] != b'O' || seen[r * n + c] { continue; }
            let mut region = vec![r * n + c];
            seen[r * n + c] = true;
            let mut touches_border = false;
            let mut head = 0;
            while head < region.len() {
                let (cr, cc) = (region[head] / n, region[head] % n);
                head += 1;
                if cr == 0 || cr == m - 1 || cc == 0 || cc == n - 1 { touches_border = true; }
                for (nr, nc) in neighbors(m, n, cr, cc) {
                    if board[nr][nc] != b'O' || seen[nr * n + nc] { continue; }
                    seen[nr * n + nc] = true;
                    region.push(nr * n + nc);
                }
            }
            if !touches_border {
                for id in region { board[id / n][id % n] = b'X'; }
            }
        }
    }
}

// Các ô O trên biên: điểm xuất phát của những cách đi ngược.
fn border_cells(m: usize, n: usize) -> Vec<(usize, usize)> {
    let mut cells = Vec::new();
    for r in 0..m { cells.push((r, 0)); cells.push((r, n - 1)); }
    for c in 0..n { cells.push((0, c)); cells.push((m - 1, c)); }
    cells
}

// Cách 2 (nên dùng): đi ngược từ biên. Ô O trên biên vào hàng đợi, đánh dấu an toàn 'S',
// BFS lan 'S' vào trong. Cuối cùng: O còn lại thành X, S trả lại thành O.
fn border_bfs(board: &mut Board) {
    let (m, n) = (board.len(), board[0].len());
    let mut queue = Vec::new();
    for (r, c) in border_cells(m, n) {
        if board[r][c] == b'O' { board[r][c] = b'S'; queue.push(r * n + c); }
    }
    let mut head = 0;
    while head < queue.len() {
        let (cr, cc) = (queue[head] / n, queue[head] % n);
        head += 1;
        for (nr, nc) in neighbors(m, n, cr, cc) {
            if board[nr][nc] != b'O' { continue; }
            board[nr][nc] = b'S';
            queue.push(nr * n + nc);
        }
    }
    finish(board);
}

fn finish(board: &mut Board) {
    for cell in board.iter_mut().flatten() {
        *cell = match *cell { b'O' => b'X', b'S' => b'O', other => other };
    }
}

// Cách 3: đi ngược từ biên, lan bằng DFS đệ quy. Độ sâu lời gọi có thể bằng số ô của vùng.
fn mark_safe(board: &mut Board, r: i32, c: i32) {
    if r < 0 || r >= board.len() as i32 || c < 0 || c >= board[0].len() as i32 { return; }
    if board[r as usize][c as usize] != b'O' { return; }
    board[r as usize][c as usize] = b'S';
    mark_safe(board, r - 1, c);
    mark_safe(board, r + 1, c);
    mark_safe(board, r, c - 1);
    mark_safe(board, r, c + 1);
}

fn border_dfs_recursive(board: &mut Board) {
    let (m, n) = (board.len(), board[0].len());
    for (r, c) in border_cells(m, n) { mark_safe(board, r as i32, c as i32); }
    finish(board);
}

// Cách 4: DFS với ngăn xếp tự quản lý, không phụ thuộc giới hạn đệ quy.
fn border_dfs_iterative(board: &mut Board) {
    let (m, n) = (board.len(), board[0].len());
    let mut stack = Vec::new();
    for (r, c) in border_cells(m, n) {
        if board[r][c] == b'O' { board[r][c] = b'S'; stack.push(r * n + c); }
    }
    while let Some(id) = stack.pop() {
        for (nr, nc) in neighbors(m, n, id / n, id % n) {
            if board[nr][nc] != b'O' { continue; }
            board[nr][nc] = b'S';
            stack.push(nr * n + nc);
        }
    }
    finish(board);
}

// Cách 5: Union-Find với một nút ảo "biên".
fn find(parent: &mut [usize], mut x: usize) -> usize {
    let mut root = x;
    while parent[root] != root { root = parent[root]; }
    while parent[x] != root { let next = parent[x]; parent[x] = root; x = next; }
    root
}

fn union(parent: &mut [usize], size: &mut [usize], a: usize, b: usize) {
    let (mut ra, mut rb) = (find(parent, a), find(parent, b));
    if ra == rb { return; }
    if size[ra] < size[rb] { std::mem::swap(&mut ra, &mut rb); }
    parent[rb] = ra;
    size[ra] += size[rb];
}

fn union_find(board: &mut Board) {
    let (m, n) = (board.len(), board[0].len());
    let border = m * n;
    let mut parent: Vec<usize> = (0..=m * n).collect();
    let mut size = vec![1; m * n + 1];
    for r in 0..m {
        for c in 0..n {
            if board[r][c] != b'O' { continue; }
            let id = r * n + c;
            if r == 0 || r == m - 1 || c == 0 || c == n - 1 { union(&mut parent, &mut size, id, border); }
            if r + 1 < m && board[r + 1][c] == b'O' { union(&mut parent, &mut size, id, id + n); }
            if c + 1 < n && board[r][c + 1] == b'O' { union(&mut parent, &mut size, id, id + 1); }
        }
    }
    for r in 0..m {
        for c in 0..n {
            if board[r][c] == b'O' && find(&mut parent, r * n + c) != find(&mut parent, border) {
                board[r][c] = b'X';
            }
        }
    }
}

// SAI 1: đổi mọi ô O không nằm trên biên.
fn wrong_not_on_border(board: &mut Board) {
    let (m, n) = (board.len(), board[0].len());
    for r in 1..m.saturating_sub(1) {
        for c in 1..n.saturating_sub(1) {
            if board[r][c] == b'O' { board[r][c] = b'X'; }
        }
    }
}

// SAI 2: đổi ô thành X ngay lúc tìm; && còn dừng sớm nên phần còn lại của vùng không được thăm.
fn surrounded_search(board: &mut Board, r: i32, c: i32) -> bool {
    if r < 0 || r >= board.len() as i32 || c < 0 || c >= board[0].len() as i32 { return false; }
    if board[r as usize][c as usize] != b'O' { return true; }
    board[r as usize][c as usize] = b'X'; // đổi luôn, coi như "đã thăm"
    surrounded_search(board, r - 1, c) && surrounded_search(board, r + 1, c)
        && surrounded_search(board, r, c - 1) && surrounded_search(board, r, c + 1)
}

fn wrong_flip_during_search(board: &mut Board) {
    for r in 0..board.len() {
        for c in 0..board[0].len() {
            if board[r][c] == b'O' { surrounded_search(board, r as i32, c as i32); }
        }
    }
}

// SAI 3: làm đúng trên một bản sao (che tên `board` bằng `let`). Người gọi vẫn giữ bảng cũ.
fn wrong_new_board(board: &mut Board) {
    let mut board = board.clone();
    border_bfs(&mut board);
}

// ---------- ca thử ----------
fn parse(rows: &[&str]) -> Board {
    rows.iter().map(|row| row.bytes().collect()).collect()
}
fn square(n: usize, fill: impl Fn(usize, usize) -> u8) -> Board {
    (0..n).map(|r| (0..n).map(|c| fill(r, c)).collect()).collect()
}

fn main() {
    let ring = |r: usize, c: usize| if r == 0 || c == 0 || r == 199 || c == 199 { b'X' } else { b'O' };
    let cases: Vec<(&str, Board, Board)> = vec![
        ("ví dụ 5×5 ở trên", parse(&["XXXXX", "XOOXX", "XXOXX", "XOXOO", "XOXXX"]),
            parse(&["XXXXX", "XXXXX", "XXXXX", "XOXOO", "XOXXX"])),
        ("một ô O", parse(&["O"]), parse(&["O"])),
        ("một ô X", parse(&["X"]), parse(&["X"])),
        ("3×3 toàn O", parse(&["OOO", "OOO", "OOO"]), parse(&["OOO", "OOO", "OOO"])),
        ("vòng X bao một ô O", parse(&["XXX", "XOX", "XXX"]), parse(&["XXX", "XXX", "XXX"])),
        ("một hàng OXO", parse(&["OXO"]), parse(&["OXO"])),
        ("chạm chéo không tính là nối", parse(&["OXXX", "XOXX", "XXOX", "XXXX"]),
            parse(&["OXXX", "XXXX", "XXXX", "XXXX"])),
        ("đường vòng vèo ra biên", parse(&["XXXXXX", "XOOOOX", "XXXXOX", "XOOOOX", "XOXXXX", "XOXXXX"]),
            parse(&["XXXXXX", "XOOOOX", "XXXXOX", "XOOOOX", "XOXXXX", "XOXXXX"])),
        ("200×200 toàn O", square(200, |_, _| b'O'), square(200, |_, _| b'O')),
        ("200×200 viền X, trong toàn O", square(200, ring), square(200, |_, _| b'X')),
    ];

    let solvers: [(&str, fn(&mut Board)); 9] = [
        ("brute_force_per_cell", brute_force), ("region_fill", region_fill), ("border_bfs", border_bfs),
        ("border_dfs_recursive", border_dfs_recursive), ("border_dfs_iterative", border_dfs_iterative),
        ("union_find", union_find), ("wrong_not_on_border", wrong_not_on_border),
        ("wrong_flip_during_search", wrong_flip_during_search), ("wrong_new_board", wrong_new_board),
    ];

    for (name, solve) in solvers {
        let (mut ok, mut total) = (0, 0);
        let mut bad = Vec::new();
        for (case_name, start, want) in &cases {
            // vét cạn chỉ chạy các ca nhỏ: ở 200×200 nó cần khoảng 1,5·10⁹ lượt thăm
            if name == "brute_force_per_cell" && start.len() > 10 { continue; }
            total += 1;
            let mut board = start.clone();
            solve(&mut board);
            if board == *want { ok += 1; } else { bad.push(*case_name); }
        }
        let note = if total < cases.len() { " (chỉ các ca nhỏ)" } else { "" };
        let tail = if bad.is_empty() { String::new() } else { format!("; sai ở {}", bad.join(", ")) };
        println!("{:<24} {}/{} ca đúng{}{}", name, ok, total, note, tail);
    }

    // Đối chiếu ngẫu nhiên: các cách đúng phải ra cùng bảng với vét cạn.
    let mut state: u64 = 42;
    let mut rand = || {
        state = (state * 1103515245 + 12345) % 2147483648;
        state as f64 / 2147483648.0
    };
    let (trials, mut agree) = (2000, 0);
    for _ in 0..trials {
        let m = 1 + (rand() * 8.0) as usize;
        let n = 1 + (rand() * 8.0) as usize;
        let board: Board = (0..m).map(|_| (0..n).map(|_| if rand() < 0.6 { b'O' } else { b'X' }).collect()).collect();
        let mut reference = board.clone();
        brute_force(&mut reference);
        let correct: [fn(&mut Board); 5] = [region_fill, border_bfs, border_dfs_recursive, border_dfs_iterative, union_find];
        if correct.iter().all(|solve| {
            let mut b = board.clone();
            solve(&mut b);
            b == reference
        }) {
            agree += 1;
        }
    }
    println!("đối chiếu ngẫu nhiên: {}/{} bảng, năm cách đúng khớp vét cạn", agree, trials);

    // Đo: vét cạn O((mn)²) so với tô từng vùng O(mn) trên bảng viền X, trong toàn O.
    for size in [30, 60, 90] {
        let make = || square(size, |r, c| if r == 0 || c == 0 || r == size - 1 || c == size - 1 { b'X' } else { b'O' });
        let mut b = make();
        let mut visits = 0;
        let t0 = Instant::now();
        brute_force_per_cell(&mut b, &mut visits);
        let brute = t0.elapsed().as_secs_f64() * 1000.0;
        let mut b = make();
        let t0 = Instant::now();
        region_fill(&mut b);
        let fast = t0.elapsed().as_secs_f64() * 1000.0;
        println!("{size}×{size}: vét cạn {visits} lượt thăm, {brute:.1} ms; tô từng vùng {fast:.2} ms");
    }
}
