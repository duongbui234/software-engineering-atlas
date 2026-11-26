// NC-02 Valid Anagram (LeetCode 242): ba cách, test, và bẫy Unicode.
// Chạy: rustc --edition 2021 -O valid_anagram.rs && ./valid_anagram
use std::collections::HashMap;

// Cách 1, sắp xếp rồi so: O(n log n). Sắp theo char (code point), không vỡ emoji.
fn by_sorting(s: &str, t: &str) -> bool {
    if s.len() != t.len() {
        return false;
    }
    let mut a: Vec<char> = s.chars().collect();
    let mut b: Vec<char> = t.chars().collect();
    a.sort_unstable();
    b.sort_unstable();
    a == b
}

// Cách 2, mảng đếm 26 ô theo byte: chỉ đúng khi input là 'a'..'z'.
fn by_count26(s: &str, t: &str) -> bool {
    if s.len() != t.len() {
        return false;
    }
    let mut count = [0i32; 26];
    for (a, b) in s.bytes().zip(t.bytes()) {
        count[(a - b'a') as usize] += 1; // byte ngoài a..z: trừ tràn hoặc vượt chỉ số → panic
        count[(b - b'a') as usize] -= 1;
    }
    count == [0; 26] // mảng cố định so sánh được bằng ==
}

// Cách 3, đếm bằng HashMap theo char. Thư viện chuẩn KHÔNG có chuẩn hóa NFC.
fn by_map(s: &str, t: &str) -> bool {
    let mut count: HashMap<char, i32> = HashMap::new();
    for ch in s.chars() {
        *count.entry(ch).or_insert(0) += 1;
    }
    for ch in t.chars() {
        match count.get_mut(&ch) {
            Some(c) if *c > 0 => *c -= 1,
            _ => return false, // không có hoặc đã dùng hết
        }
    }
    count.values().all(|&c| c == 0)
}

fn main() {
    let cases = [
        ("anagram", "nagaram", true),
        ("rat", "car", false),
        ("a", "ab", false),
        ("aacc", "ccac", false),
        ("", "", true),
    ];
    let fns: [(&str, fn(&str, &str) -> bool); 3] =
        [("by_sorting", by_sorting), ("by_count26", by_count26), ("by_map", by_map)];
    let mut failed = 0;
    for (name, f) in fns.iter() {
        for (s, t, want) in cases.iter() {
            if f(s, t) != *want {
                failed += 1;
                println!("SAI {}(\"{}\", \"{}\")", name, s, t);
            }
        }
    }
    println!("test chữ thường: 3 cách × {} ca, {} ca sai\n", cases.len(), failed);

    // ── bẫy: len() là số byte UTF-8, chars() là code point ────────────────────
    let composed = "caf\u{e9}";
    let decomposed = "e\u{301}fac";
    println!(
        "\"{}\" vs \"{}\": len {} vs {} byte, chars {} vs {}",
        composed, decomposed, composed.len(), decomposed.len(),
        composed.chars().count(), decomposed.chars().count()
    );
    println!("  by_sorting: {}, by_map: {} (không có NFC thì cả hai sai)", by_sorting(composed, decomposed), by_map(composed, decomposed));
    let a = "😀🌃";
    let b = "\u{1F703}\u{1F200}";
    println!("  emoji: by_sorting {}, by_map {} (char là code point, không vỡ)", by_sorting(a, b), by_map(a, b));
}
