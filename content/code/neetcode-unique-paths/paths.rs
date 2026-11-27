use std::collections::HashMap;

const LIMIT: u64 = 2_000_000_000;

fn paths_brute(m: usize, n: usize, r: usize, c: usize, calls: &mut u64) -> u64 {
    *calls += 1;
    if r == m - 1 && c == n - 1 {
        return 1;
    }
    let mut total = 0;
    if r + 1 < m {
        total += paths_brute(m, n, r + 1, c, calls);
    }
    if c + 1 < n {
        total += paths_brute(m, n, r, c + 1, calls);
    }
    total
}

fn paths_memo(m: usize, n: usize, r: usize, c: usize, cache: &mut HashMap<(usize, usize), u64>, calls: &mut u64) -> u64 {
    *calls += 1;
    if r == m - 1 || c == n - 1 {
        return 1;
    }
    if let Some(&saved) = cache.get(&(r, c)) {
        return saved;
    }
    let total = paths_memo(m, n, r + 1, c, cache, calls) + paths_memo(m, n, r, c + 1, cache, calls);
    cache.insert((r, c), total);
    total
}

fn paths_table(m: usize, n: usize) -> u64 {
    let mut ways = vec![vec![1u64; n]; m];
    for r in 1..m {
        for c in 1..n {
            ways[r][c] = ways[r - 1][c] + ways[r][c - 1];
        }
    }
    ways[m - 1][n - 1]
}

fn paths_row(m: usize, n: usize) -> u64 {
    let mut row = vec![1u64; n];
    for _ in 1..m {
        for c in 1..n {
            row[c] += row[c - 1];
        }
    }
    row[n - 1]
}

fn paths_formula(m: usize, n: usize) -> u64 {
    let k = (m.min(n) - 1) as u64;
    let total = (m + n - 2) as u64;
    let mut result: u64 = 1; // u64 chứa được tích trung gian cỡ 4·10¹¹
    for i in 1..=k {
        result = result * (total - k + i) / i;
    }
    result
}

fn same_answer(m: usize, n: usize, expected: u64) -> bool {
    paths_table(m, n) == expected && paths_row(m, n) == expected && paths_formula(m, n) == expected
}

fn check(ok: bool) {
    assert!(ok, "ca kiểm tra sai");
}

fn main() {
    let cases: [(usize, usize, u64); 7] = [(1, 1, 1), (1, 7, 1), (2, 2, 2), (3, 2, 3), (3, 7, 28), (10, 10, 48620), (23, 12, 193536720)];
    for &(m, n, expected) in &cases {
        let mut calls = 0;
        check(same_answer(m, n, expected) && paths_memo(m, n, 0, 0, &mut HashMap::new(), &mut calls) == expected);
    }
    println!("{}/{} ca đúng", cases.len(), cases.len());

    let mut checked = 0;
    for m in 1..=8 {
        for n in 1..=8 {
            let mut calls = 0;
            let brute = paths_brute(m, n, 0, 0, &mut calls);
            check(same_answer(m, n, brute) && paths_memo(m, n, 0, 0, &mut HashMap::new(), &mut calls) == brute);
            checked += 1;
        }
    }
    println!("{}/{} ca đúng (đối chiếu vét cạn, lưới tới 8×8)", checked, checked);

    // Pascal có chặn trên: ô nào vượt LIMIT thì giữ ở LIMIT + 1.
    let mut pascal = vec![vec![1u64; 101]; 101];
    for r in 2..=100 {
        for c in 2..=100 {
            pascal[r][c] = (pascal[r - 1][c] + pascal[r][c - 1]).min(LIMIT + 1);
        }
    }
    let mut inside = 0;
    for m in 1..=100 {
        for n in 1..=100 {
            if pascal[m][n] <= LIMIT {
                check(same_answer(m, n, pascal[m][n]));
                inside += 1;
            }
        }
    }
    println!("{}/{} ca đúng (mọi lưới 1..100 có đáp án ≤ 2·10⁹)", inside, inside);

    let (mut brute_calls, mut memo_calls) = (0, 0);
    paths_brute(10, 10, 0, 0, &mut brute_calls);
    paths_memo(10, 10, 0, 0, &mut HashMap::new(), &mut memo_calls);
    println!("Lưới 10×10: vét cạn {} lượt gọi, memo {} lượt gọi", brute_calls, memo_calls);
}
