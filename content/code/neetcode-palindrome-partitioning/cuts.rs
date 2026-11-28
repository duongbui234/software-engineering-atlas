// Palindrome Partitioning (LeetCode 131): cắt tại mọi tiền tố đối xứng của phần còn lại
// Chạy: rustc --edition 2021 -O cuts.rs -o /tmp/cuts && /tmp/cuts
use std::collections::HashSet;

// Kiểm tra s[lo..hi] bằng hai con trỏ, đếm số phép so ký tự
fn is_palindrome(s: &[u8], mut lo: usize, mut hi: usize, compares: &mut usize) -> bool {
    while lo < hi {
        *compares += 1;
        if s[lo] != s[hi] {
            return false;
        }
        lo += 1;
        hi -= 1;
    }
    true
}

// Cách 1: ở mỗi vị trí start, thử mọi điểm cắt end và kiểm tra lại đoạn s[start..end] mỗi lần
fn partition_check(s: &str, compares: &mut usize) -> Vec<Vec<String>> {
    fn walk(s: &str, start: usize, path: &mut Vec<String>, result: &mut Vec<Vec<String>>, compares: &mut usize) {
        if start == s.len() {
            result.push(path.clone());
            return;
        }
        for end in start..s.len() {
            if !is_palindrome(s.as_bytes(), start, end, compares) {
                continue;
            }
            path.push(s[start..=end].to_string());
            walk(s, end + 1, path, result, compares);
            path.pop();
        }
    }
    let mut result = Vec::new();
    walk(s, 0, &mut Vec::new(), &mut result, compares);
    result
}

// Cách chính: dựng bảng is_pal[i][j] một lần (i đi từ phải sang trái), rồi quay lui chỉ tra bảng
fn partition(s: &str, compares: &mut usize) -> Vec<Vec<String>> {
    let b = s.as_bytes();
    let n = b.len();
    let mut is_pal = vec![vec![false; n]; n];
    for i in (0..n).rev() {
        for j in i..n {
            *compares += 1;
            // đối xứng khi hai đầu bằng nhau và phần bên trong (ngắn hơn, đã tính) cũng đối xứng
            is_pal[i][j] = b[i] == b[j] && (j - i < 2 || is_pal[i + 1][j - 1]);
        }
    }
    fn walk(s: &str, is_pal: &[Vec<bool>], start: usize, path: &mut Vec<String>, result: &mut Vec<Vec<String>>) {
        if start == s.len() {
            result.push(path.clone()); // cắt hết chuỗi: ghi một cách chia
            return;
        }
        for end in start..s.len() {
            if !is_pal[start][end] {
                continue; // mảnh đầu không đối xứng: bỏ cả nhánh
            }
            path.push(s[start..=end].to_string());
            walk(s, is_pal, end + 1, path, result);
            path.pop();
        }
    }
    let mut result = Vec::new();
    walk(s, &is_pal, 0, &mut Vec::new(), &mut result);
    result
}

// Trọng tài độc lập: vét mọi 2^(n-1) cách đặt vết cắt, giữ cách mà mọi mảnh đọc xuôi ngược như nhau
fn brute_force(s: &str) -> Vec<Vec<String>> {
    let n = s.len();
    let mut result = Vec::new();
    for mask in 0..(1usize << (n - 1)) {
        let mut parts = Vec::new();
        let mut from = 0;
        for gap in 0..n - 1 {
            if mask & (1 << gap) != 0 {
                parts.push(s[from..=gap].to_string());
                from = gap + 1;
            }
        }
        parts.push(s[from..].to_string());
        if parts.iter().all(|p| p.chars().rev().collect::<String>() == *p) {
            result.push(parts);
        }
    }
    result
}

fn canonical(list: &[Vec<String>]) -> Vec<Vec<String>> {
    let mut sorted = list.to_vec();
    sorted.sort();
    sorted
}

fn check(s: &str, expected: Option<Vec<Vec<String>>>) -> bool {
    let want = canonical(&expected.unwrap_or_else(|| brute_force(s)));
    let mut compares = 0;
    for got in [partition(s, &mut compares), partition_check(s, &mut compares)] {
        if got.iter().collect::<HashSet<_>>().len() != got.len() {
            return false;
        }
        if canonical(&got) != want {
            return false;
        }
    }
    true
}

fn build(s: &mut String, total: &mut usize, good: &mut usize) {
    if !s.is_empty() {
        *total += 1;
        if check(s, None) {
            *good += 1;
        }
    }
    if s.len() == 9 {
        return;
    }
    for c in ['a', 'b'] {
        s.push(c);
        build(s, total, good);
        s.pop();
    }
}

fn parts(list: &[&[&str]]) -> Vec<Vec<String>> {
    list.iter().map(|p| p.iter().map(|x| x.to_string()).collect()).collect()
}

fn main() {
    let letters: Vec<&str> = "abcdefghijklmnop".split("").filter(|x| !x.is_empty()).collect();
    let sixteen = "a".repeat(16);
    let cases: Vec<(&str, Option<Vec<Vec<String>>>)> = vec![
        ("x", Some(parts(&[&["x"]]))),
        ("noon", Some(parts(&[&["n", "o", "o", "n"], &["n", "oo", "n"], &["noon"]]))),
        ("abc", Some(parts(&[&["a", "b", "c"]]))),
        ("aaaa", None),
        ("level", None),
        ("racecar", None),
        ("abcdefghijklmnop", Some(parts(&[&letters]))),
        (&sixteen, None),
    ];
    let mut ok = 0;
    for (s, expected) in &cases {
        if check(s, expected.clone()) {
            ok += 1;
        } else {
            println!("sai ở {}", s);
        }
    }
    println!("{}/{} ca đúng", ok, cases.len());

    // Đối chiếu: mọi chuỗi trên {a, b} dài 1–9
    let (mut total, mut good) = (0, 0);
    build(&mut String::new(), &mut total, &mut good);
    println!("{}/{} ca đúng (đối chiếu vét mọi cách đặt vết cắt)", good, total);

    let mut via_check = 0;
    let count = partition_check(&sixteen, &mut via_check).len();
    let mut via_table = 0;
    partition(&sixteen, &mut via_table);
    println!("16 chữ a: {} cách chia; kiểm tra lại mỗi lần {} phép so, bảng isPal {} phép so", count, via_check, via_table);
}
