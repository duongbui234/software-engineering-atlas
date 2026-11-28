// N-Queens (LeetCode 51): vét mọi hoán vị, quay lui với ba tập xung đột, đếm bằng bitmask
// Chạy: rustc --edition 2021 -O n_queens.rs -o /tmp/n_queens && /tmp/n_queens
use std::collections::HashSet;

// Đổi danh sách cột (cols[r] là cột của hậu ở hàng r) thành bàn cờ dạng chuỗi
fn to_board(cols: &[usize]) -> Vec<String> {
    let n = cols.len();
    cols.iter()
        .map(|&c| format!("{}Q{}", ".".repeat(c), ".".repeat(n - c - 1)))
        .collect()
}

// Cách 1: mỗi hàng một hậu, mỗi cột một hậu, tức một hoán vị cột; dựng xong mới xét hai đường chéo
fn solve_brute(n: usize, calls: &mut u64) -> Vec<Vec<String>> {
    fn walk(n: usize, cols: &mut Vec<usize>, used: &mut Vec<bool>, result: &mut Vec<Vec<String>>, calls: &mut u64) {
        *calls += 1;
        if cols.len() == n {
            if diagonals_ok(cols) {
                result.push(to_board(cols));
            }
            return;
        }
        for c in 0..n {
            if used[c] {
                continue;
            }
            used[c] = true;
            cols.push(c);
            walk(n, cols, used, result, calls);
            cols.pop();
            used[c] = false;
        }
    }
    let mut result = Vec::new();
    walk(n, &mut Vec::new(), &mut vec![false; n], &mut result, calls);
    result
}

fn diagonals_ok(cols: &[usize]) -> bool {
    for a in 0..cols.len() {
        for b in a + 1..cols.len() {
            if cols[a].abs_diff(cols[b]) == b - a {
                return false;
            }
        }
    }
    true
}

// Cách 2: đặt từng hàng; ba mảng đánh dấu cột, chéo chính (r - c + n - 1) và chéo phụ (r + c)
fn solve_n_queens(n: usize, calls: &mut u64) -> Vec<Vec<String>> {
    struct State {
        n: usize,
        cols: Vec<usize>,
        col_used: Vec<bool>,
        diag: Vec<bool>,
        anti: Vec<bool>,
        result: Vec<Vec<String>>,
    }
    fn place(r: usize, s: &mut State, calls: &mut u64) {
        *calls += 1;
        if r == s.n {
            s.result.push(to_board(&s.cols)); // chỉ dựng chuỗi ở lá
            return;
        }
        for c in 0..s.n {
            let (d, a) = (r + s.n - 1 - c, r + c); // cộng n - 1 trước khi trừ: usize không âm
            if s.col_used[c] || s.diag[d] || s.anti[a] {
                continue;
            }
            s.col_used[c] = true;
            s.diag[d] = true;
            s.anti[a] = true;
            s.cols.push(c);
            place(r + 1, s, calls);
            s.cols.pop();
            s.col_used[c] = false; // gỡ cả ba dấu
            s.diag[d] = false;
            s.anti[a] = false;
        }
    }
    let mut s = State {
        n,
        cols: Vec::new(),
        col_used: vec![false; n],
        diag: vec![false; 2 * n - 1],
        anti: vec![false; 2 * n - 1],
        result: Vec::new(),
    };
    place(0, &mut s, calls);
    s.result
}

// Cách 3: chỉ đếm; ba tập là ba số nguyên, bit 1 là cột bị chiếu ở hàng đang xét
fn count_bits(n: usize, calls: &mut u64) -> u64 {
    fn go(full: u32, cols: u32, left: u32, right: u32, calls: &mut u64) -> u64 {
        *calls += 1;
        if cols == full {
            return 1;
        }
        let mut count = 0;
        let mut free = full & !(cols | left | right);
        while free != 0 {
            let bit = free & free.wrapping_neg(); // bit 1 thấp nhất: một cột còn trống
            free -= bit;
            // chéo dịch một cột sang trái hoặc phải khi xuống hàng sau
            count += go(full, cols | bit, ((left | bit) << 1) & full, (right | bit) >> 1, calls);
        }
        count
    }
    go((1u32 << n) - 1, 0, 0, 0, calls)
}

// Bản sai: quên gỡ dấu chéo phụ khi quay lui
fn count_forget_anti(n: usize) -> u64 {
    fn place(r: usize, n: usize, col_used: &mut [bool], diag: &mut [bool], anti: &mut [bool]) -> u64 {
        if r == n {
            return 1;
        }
        let mut count = 0;
        for c in 0..n {
            let (d, a) = (r + n - 1 - c, r + c);
            if col_used[c] || diag[d] || anti[a] {
                continue;
            }
            col_used[c] = true;
            diag[d] = true;
            anti[a] = true;
            count += place(r + 1, n, col_used, diag, anti);
            col_used[c] = false;
            diag[d] = false;
        }
        count
    }
    place(0, n, &mut vec![false; n], &mut vec![false; 2 * n - 1], &mut vec![false; 2 * n - 1])
}

// Kiểm tra độc lập: đọc lại bàn cờ từ chuỗi
fn valid_board(board: &[String], n: usize) -> bool {
    if board.len() != n {
        return false;
    }
    let (mut cols, mut diags, mut antis) = (HashSet::new(), HashSet::new(), HashSet::new());
    for (r, row) in board.iter().enumerate() {
        if row.len() != n || row.matches('Q').count() != 1 || row.chars().any(|ch| ch != 'Q' && ch != '.') {
            return false;
        }
        let c = row.find('Q').unwrap() as i64;
        let r = r as i64;
        cols.insert(c);
        diags.insert(r - c);
        antis.insert(r + c);
    }
    cols.len() == n && diags.len() == n && antis.len() == n
}

fn key(boards: &[Vec<String>]) -> String {
    let mut keys: Vec<String> = boards.iter().map(|b| b.join("/")).collect();
    keys.sort();
    keys.join("|")
}

fn main() {
    let known = [1u64, 0, 0, 2, 10, 4, 40, 92, 352];
    let mut calls = 0u64;
    let (mut ok, mut total) = (0, 0);
    let mut check = |cond: bool, name: &str| {
        total += 1;
        if cond {
            ok += 1;
        } else {
            println!("sai ở {}", name);
        }
    };
    for n in 1..=9 {
        let sets = solve_n_queens(n, &mut calls).len() as u64;
        let bits = count_bits(n, &mut calls);
        check(sets == known[n - 1] && bits == known[n - 1], &format!("n = {}", n));
    }
    let five = solve_n_queens(5, &mut calls);
    check(five.iter().any(|b| b.join("/") == "Q..../..Q../....Q/.Q.../...Q."), "n = 5 có bàn mẫu");
    let six = solve_n_queens(6, &mut calls);
    check(six.iter().all(|b| valid_board(b, 6)), "n = 6 mọi bàn hợp lệ");
    let seen: HashSet<String> = six.iter().map(|b| b.join("/")).collect();
    check(seen.len() == six.len(), "n = 6 không trùng");
    println!("{}/{} ca đúng", ok, total);

    let cross_ok = (1..=7)
        .filter(|&n| key(&solve_brute(n, &mut calls)) == key(&solve_n_queens(n, &mut calls)))
        .count();
    println!("{}/7 ca đúng (đối chiếu vét mọi hoán vị)", cross_ok);

    let mut brute = 0;
    solve_brute(8, &mut brute);
    let mut sets = 0;
    solve_n_queens(8, &mut sets);
    let mut bits = 0;
    count_bits(8, &mut bits);
    println!("n = 8: vét hoán vị {} lượt gọi, ba tập {} lượt gọi, bitmask {} lượt gọi", brute, sets, bits);
    println!("Quên gỡ chéo phụ: n = 8 ra {} bàn, đúng là 92", count_forget_anti(8));
}
