// Ga DP-05: bảng theo lưới và theo hai tiền tố
fn unique_paths(m: usize, n: usize) -> u64 {
    let mut row = vec![1u64; n]; // hàng 0: mọi ô có đúng một đường
    for _ in 1..m {
        for j in 1..n {
            row[j] += row[j - 1]; // trên + trái
        }
    }
    row[n - 1]
}

fn longest_common_subsequence(a: &str, b: &str) -> usize {
    let (a, b) = (a.as_bytes(), b.as_bytes());
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
    dp[a.len()][b.len()]
}

fn is_interleave(s1: &str, s2: &str, s3: &str) -> bool {
    let (s1, s2, s3) = (s1.as_bytes(), s2.as_bytes(), s3.as_bytes());
    if s1.len() + s2.len() != s3.len() {
        return false;
    }
    let mut row = vec![false; s2.len() + 1];
    for i in 0..=s1.len() {
        for j in 0..=s2.len() {
            if i == 0 && j == 0 {
                row[j] = true;
                continue;
            }
            let c = s3[i + j - 1];
            let from_top = i > 0 && row[j] && s1[i - 1] == c;
            let from_left = j > 0 && row[j - 1] && s2[j - 1] == c;
            row[j] = from_top || from_left;
        }
    }
    row[s2.len()]
}

fn num_distinct(s: &str, t: &str) -> u64 {
    let t = t.as_bytes();
    let mut ways = vec![0u64; t.len() + 1];
    ways[0] = 1; // t rỗng: một cách, bỏ hết
    for &ch in s.as_bytes() {
        for j in (1..=t.len()).rev() {
            // đi lùi để còn đọc hàng cũ
            if ch == t[j - 1] {
                ways[j] += ways[j - 1];
            }
        }
    }
    ways[t.len()]
}

fn min_distance(a: &str, b: &str) -> usize {
    let (a, b) = (a.as_bytes(), b.as_bytes());
    let mut row: Vec<usize> = (0..=b.len()).collect(); // a rỗng: chèn j ký tự
    for i in 1..=a.len() {
        let mut diag = row[0]; // dp[i-1][j-1]
        row[0] = i;
        for j in 1..=b.len() {
            let top = row[j];
            row[j] = if a[i - 1] == b[j - 1] {
                diag
            } else {
                1 + diag.min(top).min(row[j - 1]) // thay, xóa, chèn
            };
            diag = top;
        }
    }
    row[b.len()]
}

fn main() {
    let checks = [
        unique_paths(3, 7) == 28,
        unique_paths(3, 2) == 3,
        unique_paths(1, 1) == 1,
        unique_paths(23, 12) == 193536720,
        longest_common_subsequence("abcde", "ace") == 3,
        longest_common_subsequence("abc", "def") == 0,
        longest_common_subsequence("map", "mop") == 2,
        is_interleave("aabcc", "dbbca", "aadbbcbcac"),
        !is_interleave("aabcc", "dbbca", "aadbbbaccc"),
        is_interleave("", "", ""),
        !is_interleave("a", "", "ab"),
        num_distinct("rabbbit", "rabbit") == 3,
        num_distinct("babgbag", "bag") == 5,
        num_distinct("a", "b") == 0,
        min_distance("horse", "ros") == 3,
        min_distance("intention", "execution") == 5,
        min_distance("", "abc") == 3,
    ];
    assert!(checks.iter().all(|&ok| ok), "Ca kiểm tra sai");
    println!("{}/{} ca đúng", checks.len(), checks.len());
}
