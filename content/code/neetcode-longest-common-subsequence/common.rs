use std::collections::HashMap;

fn lcs_brute(a: &[u8], b: &[u8], i: usize, j: usize, calls: &mut u64) -> usize {
    *calls += 1;
    if i == a.len() || j == b.len() {
        return 0;
    }
    if a[i] == b[j] {
        return 1 + lcs_brute(a, b, i + 1, j + 1, calls);
    }
    lcs_brute(a, b, i + 1, j, calls).max(lcs_brute(a, b, i, j + 1, calls))
}

fn lcs_memo(a: &[u8], b: &[u8], i: usize, j: usize, cache: &mut HashMap<(usize, usize), usize>, calls: &mut u64) -> usize {
    *calls += 1;
    if i == a.len() || j == b.len() {
        return 0;
    }
    if let Some(&saved) = cache.get(&(i, j)) {
        return saved;
    }
    let best = if a[i] == b[j] {
        1 + lcs_memo(a, b, i + 1, j + 1, cache, calls)
    } else {
        lcs_memo(a, b, i + 1, j, cache, calls).max(lcs_memo(a, b, i, j + 1, cache, calls))
    };
    cache.insert((i, j), best);
    best
}

fn lcs_table(a: &[u8], b: &[u8]) -> Vec<Vec<usize>> {
    // dp[i][j]: LCS của a[:i] và b[:j]; hàng 0 và cột 0 là tiền tố rỗng
    let mut dp = vec![vec![0usize; b.len() + 1]; a.len() + 1];
    for i in 1..=a.len() {
        for j in 1..=b.len() {
            dp[i][j] = if a[i - 1] == b[j - 1] {
                dp[i - 1][j - 1] + 1
            } else {
                dp[i - 1][j].max(dp[i][j - 1])
            };
        }
    }
    dp
}

fn lcs_row(a: &[u8], b: &[u8]) -> usize {
    let (a, b) = if b.len() > a.len() { (b, a) } else { (a, b) };
    let mut row = vec![0usize; b.len() + 1];
    for i in 1..=a.len() {
        let mut diagonal = 0; // dp[i-1][j-1], phải giữ trước khi ghi đè row[j]
        for j in 1..=b.len() {
            let above = row[j];
            row[j] = if a[i - 1] == b[j - 1] { diagonal + 1 } else { above.max(row[j - 1]) };
            diagonal = above;
        }
    }
    row[b.len()]
}

fn rebuild(a: &[u8], b: &[u8], dp: &[Vec<usize>]) -> String {
    let (mut i, mut j) = (a.len(), b.len());
    let mut out = Vec::new();
    while i > 0 && j > 0 {
        if a[i - 1] == b[j - 1] {
            out.push(a[i - 1]);
            i -= 1;
            j -= 1;
        } else if dp[i - 1][j] >= dp[i][j - 1] {
            i -= 1;
        } else {
            j -= 1;
        }
    }
    out.reverse();
    String::from_utf8(out).unwrap()
}

fn is_subsequence(small: &[u8], big: &[u8]) -> bool {
    let mut k = 0;
    for &ch in big {
        if k < small.len() && ch == small[k] {
            k += 1;
        }
    }
    k == small.len()
}

fn by_subsets(a: &[u8], b: &[u8]) -> usize {
    let mut best = 0;
    for mask in 0..1u32 << a.len() {
        let picked: Vec<u8> = (0..a.len()).filter(|&k| mask >> k & 1 == 1).map(|k| a[k]).collect();
        if picked.len() > best && is_subsequence(&picked, b) {
            best = picked.len();
        }
    }
    best
}

fn all_agree(a: &str, b: &str, expected: usize) -> bool {
    let (a, b) = (a.as_bytes(), b.as_bytes());
    let dp = lcs_table(a, b);
    let path = rebuild(a, b, &dp);
    dp[a.len()][b.len()] == expected && lcs_row(a, b) == expected
        && path.len() == expected && is_subsequence(path.as_bytes(), a) && is_subsequence(path.as_bytes(), b)
}

fn check(ok: bool) {
    assert!(ok, "ca kiểm tra sai");
}

fn memo_answer(a: &str, b: &str) -> usize {
    let mut calls = 0;
    lcs_memo(a.as_bytes(), b.as_bytes(), 0, 0, &mut HashMap::new(), &mut calls)
}

fn main() {
    let cases: Vec<(String, String, usize)> = vec![
        ("bread".into(), "boardgame".into(), 3),
        ("abc".into(), "abc".into(), 3),
        ("abc".into(), "xyz".into(), 0),
        ("a".into(), "a".into(), 1),
        ("a".into(), "b".into(), 0),
        ("ezupkr".into(), "ubmrapg".into(), 2),
        ("abcba".into(), "abcbcba".into(), 5),
        ("ab".repeat(500), "ba".repeat(500), 999),
        ("a".repeat(1000), "a".repeat(1000), 1000),
    ];
    for (a, b, expected) in &cases {
        check(all_agree(a, b, *expected));
        if a.len() <= 20 {
            check(memo_answer(a, b) == *expected);
        }
    }
    println!("{}/{} ca đúng", cases.len(), cases.len());

    let mut words = Vec::new();
    for size in 1..=5 {
        for mask in 0..1u32 << size {
            let word: String = (0..size).rev().map(|k| if mask >> k & 1 == 1 { 'b' } else { 'a' }).collect();
            words.push(word);
        }
    }
    let mut checked = 0;
    for a in &words {
        for b in &words {
            let expected = by_subsets(a.as_bytes(), b.as_bytes());
            check(all_agree(a, b, expected) && memo_answer(a, b) == expected);
            if a.len() + b.len() <= 8 {
                let mut calls = 0;
                check(lcs_brute(a.as_bytes(), b.as_bytes(), 0, 0, &mut calls) == expected);
            }
            checked += 1;
        }
    }
    println!("{}/{} ca đúng (đối chiếu mọi tập con, chuỗi a/b dài 1–5)", checked, checked);

    let (x, y) = (b"abcdefghij", b"klmnopqrst");
    let (mut brute_calls, mut memo_calls) = (0, 0);
    lcs_brute(x, y, 0, 0, &mut brute_calls);
    lcs_memo(x, y, 0, 0, &mut HashMap::new(), &mut memo_calls);
    println!("Hai chuỗi 10 ký tự không chung chữ: vét cạn {} lượt gọi, memo {} lượt gọi", brute_calls, memo_calls);
    let (a, b) = (b"bread", b"boardgame");
    println!("Một LCS của bread và boardgame: {}", rebuild(a, b, &lcs_table(a, b)));
}
