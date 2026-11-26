// LeetCode 567, Permutation in String: ba cách, một bản sai, test.
// Chạy: rustc --edition 2021 -O permutation_in_string.rs && ./permutation_in_string
use std::collections::BTreeSet;

fn at(b: &[u8], i: usize) -> usize {
    (b[i] - b'a') as usize // đề chỉ có chữ thường a–z
}

// Cách 1: mọi cửa sổ dài m, sắp xếp rồi so với s1 đã sắp xếp. O(n · m log m).
fn sort_each_window(s1: &str, s2: &str) -> bool {
    let mut key = s1.as_bytes().to_vec();
    key.sort_unstable();
    s2.as_bytes().windows(s1.len()).any(|w| {
        let mut w = w.to_vec();
        w.sort_unstable();
        w == key
    })
}

// Cách 2: cửa sổ cố định dài m, trượt bảng đếm 26 ô, so cả 26 ô mỗi bước. O(26 · n).
fn slide_compare_26(s1: &str, s2: &str) -> bool {
    let (a, b) = (s1.as_bytes(), s2.as_bytes());
    let m = a.len();
    if m > b.len() { return false; }
    let (mut need, mut have) = ([0u32; 26], [0u32; 26]);
    for i in 0..m { need[at(a, i)] += 1; have[at(b, i)] += 1; }
    if need == have { return true; } // [u32; 26] so theo giá trị, từng ô một
    for r in m..b.len() {
        have[at(b, r)] += 1;     // ký tự vào bên phải
        have[at(b, r - m)] -= 1; // ký tự ra bên trái
        if need == have { return true; }
    }
    false
}

// Cách 3: đếm số chữ cái đang khớp (0..26). Mỗi bước chỉ hai ô đổi, nên chỉ cập nhật hai ô đó. O(n).
fn matches_counter(s1: &str, s2: &str) -> bool {
    let (a, b) = (s1.as_bytes(), s2.as_bytes());
    let m = a.len();
    if m > b.len() { return false; }
    let mut diff = [0i32; 26]; // diff[c] = số lần c trong cửa sổ − số lần c trong s1 (có thể âm: i32)
    for i in 0..m { diff[at(a, i)] -= 1; diff[at(b, i)] += 1; }
    let mut matches = diff.iter().filter(|&&d| d == 0).count();
    // hàm thường thay cho closure: closure giữ &mut diff thì vòng for không đọc diff được nữa
    fn bump(diff: &mut [i32; 26], matches: &mut usize, c: usize, delta: i32) {
        if diff[c] == 0 { *matches -= 1; } // ô đang khớp sắp lệch
        diff[c] += delta;
        if diff[c] == 0 { *matches += 1; } // ô vừa khớp lại
    }
    let mut r = m;
    while r < b.len() && matches < 26 {
        bump(&mut diff, &mut matches, at(b, r), 1);
        bump(&mut diff, &mut matches, at(b, r - m), -1);
        r += 1;
    }
    matches == 26
}

// SAI: so tập ký tự, bỏ qua số lần xuất hiện.
fn wrong_set_only(s1: &str, s2: &str) -> bool {
    let want: BTreeSet<u8> = s1.bytes().collect();
    s2.as_bytes().windows(s1.len()).any(|w| w.iter().copied().collect::<BTreeSet<u8>>() == want)
}

fn main() {
    let cases = [
        ("ab", "eidbaooo", true), ("ab", "eidboaoo", false), ("adc", "dcda", true), ("abc", "ab", false),
        ("a", "a", true), ("aab", "abbab", false), ("aab", "xxbaa", true), ("hello", "ooolleoooleh", false),
    ];
    let fns: [(&str, fn(&str, &str) -> bool); 4] = [
        ("sortEachWindow", sort_each_window), ("slideCompare26", slide_compare_26),
        ("matchesCounter", matches_counter), ("wrongSetOnly", wrong_set_only),
    ];
    for (name, f) in fns {
        let bad: Vec<String> = cases.iter().filter(|&&(a, b, want)| f(a, b) != want)
            .map(|&(a, b, _)| format!("({}, {})", a, b)).collect();
        let tail = if bad.is_empty() { String::new() } else { format!("; sai ở {}", bad.join(" ")) };
        println!("{:<16} {}/{} ca đúng{}", name, cases.len() - bad.len(), cases.len(), tail);
    }
}
