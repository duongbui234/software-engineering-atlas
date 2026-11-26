// LeetCode 76, Minimum Window Substring: ba cách, một bản sai, test.
// Chạy: rustc --edition 2021 -O min_window.rs && ./min_window
use std::collections::HashSet;

// Cách 1, vét cạn: từ mỗi đầu trái, kéo đầu phải tới khi chứa đủ t. O(n²).
fn brute_force(s: &str, t: &str) -> String {
    let (b, mut need) = (s.as_bytes(), [0i32; 128]);
    for c in t.bytes() { need[c as usize] += 1; }
    let mut best: Option<(usize, usize)> = None;
    for l in 0..b.len() {
        let mut left = need; // mảng cố định là Copy: gán là chép
        let mut missing = t.len();
        for r in l..b.len() {
            let c = b[r] as usize;
            if left[c] > 0 { missing -= 1; }
            left[c] -= 1;
            if missing == 0 {
                if best.map_or(true, |(bl, br)| r - l < br - bl) { best = Some((l, r)); }
                break;
            }
        }
    }
    best.map_or(String::new(), |(l, r)| s[l..=r].to_string())
}

// Cách 2, cửa sổ, nhưng mỗi bước so cả bảng đếm 128 ô để biết cửa sổ đã đủ chưa. O(128·n).
fn window_compare_all(s: &str, t: &str) -> String {
    let b = s.as_bytes();
    let (mut need, mut have) = ([0u32; 128], [0u32; 128]);
    for c in t.bytes() { need[c as usize] += 1; }
    let covers = |have: &[u32; 128]| need.iter().zip(have).all(|(n, h)| h >= n);
    let (mut best, mut l): (Option<(usize, usize)>, usize) = (None, 0);
    for r in 0..b.len() {
        have[b[r] as usize] += 1;
        while covers(&have) {
            if best.map_or(true, |(bl, br)| r - l < br - bl) { best = Some((l, r)); }
            have[b[l] as usize] -= 1;
            l += 1;
        }
    }
    best.map_or(String::new(), |(l, r)| s[l..=r].to_string())
}

// Cách 3, cửa sổ với bảng "còn thiếu" và một biến missing: biết cửa sổ đủ hay chưa trong O(1). O(n + m).
fn window_missing(s: &str, t: &str) -> String {
    let b = s.as_bytes();
    let mut need = [0i32; 128]; // need[c] > 0: còn thiếu c; < 0: cửa sổ có thừa c (nên phải là số có dấu)
    for c in t.bytes() { need[c as usize] += 1; }
    let (mut missing, mut l, mut best_l, mut best_len) = (t.len(), 0, 0, usize::MAX);
    for r in 0..b.len() {
        let c = b[r] as usize;
        if need[c] > 0 { missing -= 1; } // ký tự này lấp một chỗ thiếu
        need[c] -= 1;
        while missing == 0 { // đủ: co từ trái chừng nào còn đủ, ghi đáp án TRONG lúc co
            if r - l + 1 < best_len { best_l = l; best_len = r - l + 1; }
            let d = b[l] as usize;
            need[d] += 1;
            if need[d] > 0 { missing += 1; } // bỏ đi một ký tự cần thiết: lại thiếu
            l += 1;
        }
    }
    if best_len == usize::MAX { String::new() } else { s[best_l..best_l + best_len].to_string() }
}

// SAI: chỉ xét t có những CHỮ nào, quên số lần. t = "aa" chỉ cần một chữ a.
fn ignore_multiplicity(s: &str, t: &str) -> String {
    let need: HashSet<u8> = t.bytes().collect();
    let b = s.as_bytes();
    let mut best: Option<(usize, usize)> = None;
    for l in 0..b.len() {
        let mut seen = HashSet::new();
        for r in l..b.len() {
            if need.contains(&b[r]) { seen.insert(b[r]); }
            if seen.len() == need.len() {
                if best.map_or(true, |(bl, br)| r - l < br - bl) { best = Some((l, r)); }
                break;
            }
        }
    }
    best.map_or(String::new(), |(l, r)| s[l..=r].to_string())
}

fn main() {
    let cases = [
        ("ADOBECODEBANC", "ABC", "BANC"), ("a", "a", "a"), ("a", "aa", ""), ("aa", "aa", "aa"), ("ab", "b", "b"),
        ("bba", "ab", "ba"), ("cabwefgewcwaefgcf", "cae", "cwae"), ("abc", "d", ""),
    ];
    let fns: [(&str, fn(&str, &str) -> String); 4] = [
        ("bruteForce", brute_force), ("windowCompareAll", window_compare_all),
        ("windowMissing", window_missing), ("ignoreMultiplicity", ignore_multiplicity),
    ];
    for (name, f) in fns {
        let bad: Vec<String> = cases.iter().filter(|&&(s, t, want)| f(s, t) != want)
            .map(|&(s, t, _)| format!("(\"{}\", \"{}\") → \"{}\"", s, t, f(s, t))).collect();
        let tail = if bad.is_empty() { String::new() } else { format!("; sai ở {}", bad.join(" ")) };
        println!("{:<18} {}/{} ca đúng{}", name, cases.len() - bad.len(), cases.len(), tail);
    }
}
