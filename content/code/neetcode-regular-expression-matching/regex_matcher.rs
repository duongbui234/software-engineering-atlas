// Regular Expression Matching (LeetCode 10): vét cạn, ghi nhớ và bảng trên hai tiền tố.
// Chạy: rustc --edition 2021 -O regex_matcher.rs -o /tmp/regex_matcher && /tmp/regex_matcher
// Rust chỉ có thư viện chuẩn, không có regex dựng sẵn, nên phép vét đối chiếu với đệ quy thuần.

fn brute(s: &[u8], p: &[u8], i: usize, j: usize, calls: &mut u64) -> bool {
    // Đệ quy thuần trên hậu tố s[i..] và p[j..]; calls đếm số lần gọi.
    *calls += 1;
    if j == p.len() {
        return i == s.len();
    }
    let first = i < s.len() && (p[j] == s[i] || p[j] == b'.');
    if j + 1 < p.len() && p[j + 1] == b'*' {
        // bỏ qua cặp "x*" (0 lần) hoặc ăn một ký tự và giữ nguyên "x*"
        return brute(s, p, i, j + 2, calls) || (first && brute(s, p, i + 1, j, calls));
    }
    first && brute(s, p, i + 1, j + 1, calls)
}

fn match_brute(s: &str, p: &str, calls: &mut u64) -> bool {
    brute(s.as_bytes(), p.as_bytes(), 0, 0, calls)
}

fn memo_go(s: &[u8], p: &[u8], i: usize, j: usize, memo: &mut Vec<Vec<Option<bool>>>, calls: &mut u64) -> bool {
    // Cùng đệ quy, nhưng lưu kết quả của từng cặp (i, j); None là chưa tính.
    *calls += 1;
    if let Some(ans) = memo[i][j] {
        return ans;
    }
    let ans = if j == p.len() {
        i == s.len()
    } else {
        let first = i < s.len() && (p[j] == s[i] || p[j] == b'.');
        if j + 1 < p.len() && p[j + 1] == b'*' {
            memo_go(s, p, i, j + 2, memo, calls) || (first && memo_go(s, p, i + 1, j, memo, calls))
        } else {
            first && memo_go(s, p, i + 1, j + 1, memo, calls)
        }
    };
    memo[i][j] = Some(ans);
    ans
}

fn match_memo(s: &str, p: &str, calls: &mut u64) -> bool {
    let mut memo = vec![vec![None; p.len() + 1]; s.len() + 1];
    memo_go(s.as_bytes(), p.as_bytes(), 0, 0, &mut memo, calls)
}

fn is_match(s: &str, p: &str) -> bool {
    // dp[i][j]: tiền tố s[..i] có khớp trọn mẫu p[..j] không.
    let (s, p) = (s.as_bytes(), p.as_bytes());
    let (n, m) = (s.len(), p.len());
    let mut dp = vec![vec![false; m + 1]; n + 1];
    dp[0][0] = true;
    for j in 2..=m {
        // chuỗi rỗng chỉ khớp được các cặp "x*" lấy 0 lần
        dp[0][j] = p[j - 1] == b'*' && dp[0][j - 2];
    }
    for i in 1..=n {
        for j in 1..=m {
            if p[j - 1] == b'*' {
                let zero = dp[i][j - 2];
                let more = (p[j - 2] == s[i - 1] || p[j - 2] == b'.') && dp[i - 1][j];
                dp[i][j] = zero || more;
            } else {
                dp[i][j] = (p[j - 1] == s[i - 1] || p[j - 1] == b'.') && dp[i - 1][j - 1];
            }
        }
    }
    dp[n][m]
}

fn product(items: &[&str], k: usize) -> Vec<String> {
    let mut out = vec![String::new()];
    for _ in 0..k {
        out = out.iter().flat_map(|pre| items.iter().map(move |x| format!("{pre}{x}"))).collect();
    }
    out
}

fn main() {
    let long_s = "a".repeat(20);
    let long_p = "a*".repeat(7) + "b";
    let cases: Vec<(&str, &str, bool)> = vec![
        ("ba", "b", false),
        ("bb", "b*", true),
        ("xy", ".*", true),
        ("kkd", "z*k*d", true),
        ("tomato", "to*ma*to", true),
        ("tomato", "t.m*a*t", false),
        ("ab", ".*z", false),
        ("aaa", "a*a", true),
        ("aaa", "ab*a*c*a", true),
        ("a", "ab*", true),
        ("bbbba", ".*a*a", true),
        ("abcd", "d*", false),
        ("", "a*b*", true),
        ("a", ".*..a*", false),
        (&long_s, &long_p, false),
    ];
    let mut ok = 0;
    for &(s, p, want) in &cases {
        let (mut x, mut y) = (0, 0);
        let got = [is_match(s, p), match_memo(s, p, &mut x), match_brute(s, p, &mut y)];
        if got.iter().all(|&g| g == want) {
            ok += 1;
        } else {
            println!("sai: {s} {p} {got:?} {want}");
        }
    }
    println!("{ok}/{} ca đúng", cases.len());

    // Vét mọi chuỗi a/b dài 0–4 và mọi mẫu 0–3 phần tử (a, b, . có hoặc không có *).
    let strs: Vec<String> = (0..=4).flat_map(|n| product(&["a", "b"], n)).collect();
    let patterns: Vec<String> = (0..=3).flat_map(|k| product(&["a", "a*", "b", "b*", ".", ".*"], k)).collect();
    let (mut good, mut total) = (0, 0);
    for p in &patterns {
        for s in &strs {
            total += 1;
            let mut x = 0;
            let want = match_brute(s, p, &mut x);
            if is_match(s, p) == want && match_memo(s, p, &mut x) == want {
                good += 1;
            }
        }
    }
    println!("{good}/{total} ca đúng (đối chiếu đệ quy thuần)");

    let (mut b, mut m) = (0, 0);
    match_brute(&long_s, &long_p, &mut b);
    match_memo(&long_s, &long_p, &mut m);
    println!("20 chữ a với (a*)×7 rồi b: vét cạn {b} lượt gọi, memo {m} lượt gọi");
}
