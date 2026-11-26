// LeetCode 3, Longest Substring Without Repeating Characters: ba cách, một bản sai, test.
// Chạy: rustc --edition 2021 -O longest_substring.rs && ./longest_substring
use std::collections::{HashMap, HashSet};

// Rust không cho s[i] trên &str: chọn rõ ràng giữa byte (as_bytes) và ký tự (chars). Ở đây dùng char.
fn chars(s: &str) -> Vec<char> {
    s.chars().collect()
}

// Cách 1, vét cạn: từ mỗi vị trí đầu i, kéo dài tới khi gặp ký tự lặp.
fn brute_force(s: &str) -> usize {
    let c = chars(s);
    let mut best = 0;
    for i in 0..c.len() {
        let mut seen = HashSet::new();
        for &ch in &c[i..] {
            if !seen.insert(ch) { break; } // insert trả false khi đã có
        }
        best = best.max(seen.len());
    }
    best
}

// Cách 2, cửa sổ trượt với tập: thêm c[right]; nếu trùng thì bỏ dần từ bên trái tới khi hết trùng.
fn window_set(s: &str) -> usize {
    let c: Vec<char> = s.chars().collect(); // Rust không cho s[i] trên &str: chọn byte hay char
    let mut in_window = HashSet::new();
    let (mut left, mut best) = (0, 0);
    for right in 0..c.len() {
        while in_window.contains(&c[right]) {
            in_window.remove(&c[left]); // mỗi ký tự bị xóa tối đa một lần
            left += 1;
        }
        in_window.insert(c[right]);
        best = best.max(right - left + 1);
    }
    best
}

// Cách 3, cửa sổ trượt với vị trí gặp gần nhất: nhảy left thẳng qua ký tự trùng.
fn window_last_seen(s: &str) -> usize {
    let mut last: HashMap<char, usize> = HashMap::new();
    let (mut left, mut best) = (0, 0);
    for (right, ch) in s.chars().enumerate() {
        if let Some(&prev) = last.get(&ch) {
            if prev >= left { left = prev + 1; } // chỉ nhảy khi lần gặp trước nằm TRONG cửa sổ
        }
        last.insert(ch, right);
        best = best.max(right - left + 1);
    }
    best
}

// SAI: nhảy left mà không kiểm tra lần gặp trước còn trong cửa sổ không, nên left có thể lùi lại.
fn window_jump_back(s: &str) -> usize {
    let mut last: HashMap<char, usize> = HashMap::new();
    let (mut left, mut best) = (0usize, 0usize);
    for (right, ch) in s.chars().enumerate() {
        if let Some(&prev) = last.get(&ch) { left = prev + 1; } // "abba": tới chữ a cuối, left lùi từ 2 về 1
        last.insert(ch, right);
        best = best.max(right + 1 - left);
    }
    best
}

fn main() {
    let cases = [("abcabcbb", 3), ("bbbbb", 1), ("pwwkew", 3), ("", 0), (" ", 1), ("abba", 2), ("dvdf", 3), ("tmmzuxt", 5)];
    let fns: [(&str, fn(&str) -> usize); 4] = [
        ("bruteForce", brute_force), ("windowSet", window_set),
        ("windowLastSeen", window_last_seen), ("windowJumpBack", window_jump_back),
    ];
    for (name, f) in fns {
        let bad: Vec<String> = cases.iter().filter(|(s, want)| f(s) != *want)
            .map(|(s, _)| format!("{:?} → {}", s, f(s))).collect();
        let tail = if bad.is_empty() { String::new() } else { format!("; sai ở {}", bad.join(" ")) };
        println!("{:<15} {}/{} ca đúng{}", name, cases.len() - bad.len(), cases.len(), tail);
    }
    let e = "a😀😀";
    println!("\n\"a😀😀\".len() = {} byte, chars().count() = {}; window_last_seen(\"a😀😀\") = {}", e.len(), e.chars().count(), window_last_seen(e));
}
