// LeetCode 125, Valid Palindrome: hai cách, một bản sai, và test.
// Chạy: rustc --edition 2021 -O valid_palindrome.rs && ./valid_palindrome

// Cách 1: lọc ra chuỗi sạch, đảo ngược, so. O(n) thời gian, O(n) bộ nhớ phụ.
fn clean_reverse(s: &str) -> bool {
    let clean: Vec<u8> = s
        .bytes()
        .filter(|b| b.is_ascii_alphanumeric())
        .map(|b| b.to_ascii_lowercase())
        .collect();
    clean.iter().eq(clean.iter().rev())
}

// Cách 2: hai con trỏ trên MẢNG BYTE. Chuỗi Rust là UTF-8, không cho đánh chỉ số s[i];
// đề chỉ có ASCII nên mỗi byte là một ký tự. O(1) bộ nhớ phụ.
fn two_pointers(s: &str) -> bool {
    let b = s.as_bytes();
    if b.is_empty() {
        return true;
    }
    let (mut i, mut j) = (0usize, b.len() - 1); // b.len() - 1 trên usize: chuỗi rỗng sẽ tràn, nên kiểm trước
    while i < j {
        if !b[i].is_ascii_alphanumeric() {
            i += 1;
        } else if !b[j].is_ascii_alphanumeric() {
            j -= 1;
        } else if b[i].to_ascii_lowercase() != b[j].to_ascii_lowercase() {
            return false; // khác nhau: dừng ngay
        } else {
            i += 1;
            j -= 1;
        }
    }
    true
}

// SAI: lọc như \w, tức giữ cả dấu gạch dưới "_".
fn word_regex(s: &str) -> bool {
    let clean: Vec<u8> = s
        .bytes()
        .filter(|b| b.is_ascii_alphanumeric() || *b == b'_')
        .map(|b| b.to_ascii_lowercase())
        .collect();
    clean.iter().eq(clean.iter().rev())
}

fn main() {
    let cases: [(&str, bool); 8] = [
        ("A man, a plan, a canal: Panama", true),
        ("race a car", false),
        (" ", true),
        ("", true),
        ("0P", false),
        ("a_", true),
        ("No 'x' in Nixon", true),
        (".,", true),
    ];
    let fns: [(&str, fn(&str) -> bool); 3] =
        [("clean_reverse", clean_reverse), ("two_pointers", two_pointers), ("word_regex", word_regex)];
    for (name, f) in fns {
        let bad: Vec<String> = cases.iter().filter(|(s, want)| f(s) != *want).map(|(s, _)| format!("{:?}", s)).collect();
        let msg = if bad.is_empty() { String::new() } else { format!("; sai ở {}", bad.join(" ")) };
        println!("{:<13} {}/{} ca đúng{}", name, cases.len() - bad.len(), cases.len(), msg);
    }
}
