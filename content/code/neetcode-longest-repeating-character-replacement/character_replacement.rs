// LeetCode 424, Longest Repeating Character Replacement: ba cách, một bản sai, test.
// Chạy: rustc --edition 2021 -O character_replacement.rs && ./character_replacement

// Đề chỉ có chữ hoa A–Z, nên làm việc trên byte là đủ.
fn idx(b: u8) -> usize {
    (b - b'A') as usize
}

// Cách 1, vét cạn: mọi điểm bắt đầu, kéo dài và đếm. O(n²).
fn brute_force(s: &str, k: usize) -> usize {
    let b = s.as_bytes();
    let mut best = 0;
    for i in 0..b.len() {
        let mut count = [0usize; 26];
        let mut max_freq = 0;
        for j in i..b.len() {
            count[idx(b[j])] += 1;
            max_freq = max_freq.max(count[idx(b[j])]);
            if j - i + 1 - max_freq <= k { best = best.max(j - i + 1); }
        }
    }
    best
}

// Cách 2, cửa sổ co bằng while, tính lại maxFreq đúng từ 26 ô mỗi lần co. O(26·n).
fn window_recount(s: &str, k: usize) -> usize {
    let b = s.as_bytes();
    let mut count = [0usize; 26];
    let (mut left, mut best) = (0, 0);
    for right in 0..b.len() {
        count[idx(b[right])] += 1;
        while right - left + 1 - count.iter().max().unwrap() > k {
            count[idx(b[left])] -= 1;
            left += 1;
        }
        best = best.max(right - left + 1);
    }
    best
}

// Cách 3, cửa sổ không bao giờ co: maxFreq chỉ tăng, không giảm khi bỏ ký tự bên trái. O(n).
fn window_stale_max(s: &str, k: usize) -> usize {
    let b = s.as_bytes();
    let mut count = [0usize; 26];
    let (mut left, mut max_freq) = (0, 0);
    for right in 0..b.len() {
        count[idx(b[right])] += 1;
        max_freq = max_freq.max(count[idx(b[right])]);
        if right - left + 1 - max_freq > k { // "if", không phải "while": cửa sổ trượt nguyên khối
            count[idx(b[left])] -= 1;
            left += 1;
        }
    }
    b.len() - left // cửa sổ không bao giờ co, nên độ dài cuối là độ dài lớn nhất từng đạt
}

// SAI: coi ký tự ở đầu trái là ký tự giữ lại, thay vì ký tự nhiều nhất trong cửa sổ.
fn wrong_keep_left_char(s: &str, k: usize) -> usize {
    let b = s.as_bytes();
    let mut count = [0usize; 26];
    let (mut left, mut best) = (0, 0);
    for right in 0..b.len() {
        count[idx(b[right])] += 1;
        while right - left + 1 - count[idx(b[left])] > k {
            count[idx(b[left])] -= 1;
            left += 1;
        }
        best = best.max(right - left + 1);
    }
    best
}

fn main() {
    let cases = [
        ("ABAB", 2, 4), ("AABABBA", 1, 4), ("A", 0, 1), ("ABCDE", 1, 2),
        ("AAAA", 0, 4), ("BAAAB", 2, 5), ("ABBB", 2, 4), ("ABCABCAA", 2, 5),
    ];
    let fns: [(&str, fn(&str, usize) -> usize); 4] = [
        ("bruteForce", brute_force), ("windowRecount", window_recount),
        ("windowStaleMax", window_stale_max), ("wrongKeepLeftChar", wrong_keep_left_char),
    ];
    for (name, f) in fns {
        let bad: Vec<String> = cases.iter().filter(|&&(s, k, want)| f(s, k) != want)
            .map(|&(s, k, _)| format!("{} k={} → {}", s, k, f(s, k))).collect();
        let tail = if bad.is_empty() { String::new() } else { format!("; sai ở {}", bad.join(", ")) };
        println!("{:<17} {}/{} ca đúng{}", name, cases.len() - bad.len(), cases.len(), tail);
    }
}
