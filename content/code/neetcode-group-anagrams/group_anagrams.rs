// NC-04 Group Anagrams (LeetCode 49): khóa sắp xếp, khóa đếm, bẫy nối khóa.
// Chạy: rustc --edition 2021 -O group_anagrams.rs && ./group_anagrams
use std::collections::HashMap;

// Cách 1, khóa = các byte đã sắp xếp. O(n · k log k).
fn by_sorted_key(strs: &[&str]) -> Vec<Vec<String>> {
    let mut groups: HashMap<Vec<u8>, Vec<String>> = HashMap::new();
    for s in strs {
        let mut key = s.as_bytes().to_vec();
        key.sort_unstable();
        groups.entry(key).or_default().push(s.to_string());
    }
    groups.into_values().collect()
}

// Cách 2, khóa = chính mảng đếm [u8; 26]. Mảng cố định có Hash + Eq theo nội dung,
// nên không cần nối thành chuỗi như JS/Java. O(n · k). u8 đủ vì k ≤ 100 < 256.
fn by_count_key(strs: &[&str]) -> Vec<Vec<String>> {
    let mut groups: HashMap<[u8; 26], Vec<String>> = HashMap::new();
    for s in strs {
        let mut count = [0u8; 26];
        for b in s.bytes() {
            count[(b - b'a') as usize] += 1;
        }
        groups.entry(count).or_default().push(s.to_string());
    }
    groups.into_values().collect()
}

// Biến thể lỗi: nối bảng đếm thành chuỗi KHÔNG có dấu phân cách.
fn by_count_key_no_separator(strs: &[&str]) -> Vec<Vec<String>> {
    let mut groups: HashMap<String, Vec<String>> = HashMap::new();
    for s in strs {
        let mut count = [0u32; 26];
        for b in s.bytes() {
            count[(b - b'a') as usize] += 1;
        }
        let key: String = count.iter().map(|c| c.to_string()).collect();
        groups.entry(key).or_default().push(s.to_string());
    }
    groups.into_values().collect()
}

// Đề cho phép thứ tự bất kỳ, và HashMap của Rust duyệt theo thứ tự ngẫu nhiên: chuẩn hóa.
fn normalize(mut gs: Vec<Vec<String>>) -> Vec<Vec<String>> {
    for g in gs.iter_mut() {
        g.sort();
    }
    gs.sort();
    gs
}

fn main() {
    let v = |xs: &[&[&str]]| -> Vec<Vec<String>> {
        xs.iter().map(|g| g.iter().map(|s| s.to_string()).collect()).collect()
    };
    let cases: Vec<(Vec<&str>, Vec<Vec<String>>)> = vec![
        (vec!["eat", "tea", "tan", "ate", "nat", "bat"], v(&[&["bat"], &["nat", "tan"], &["ate", "eat", "tea"]])),
        (vec![""], v(&[&[""]])),
        (vec!["a"], v(&[&["a"]])),
        (vec!["abc", "bca", "cab", "abd"], v(&[&["abc", "bca", "cab"], &["abd"]])),
    ];
    let fns: [(&str, fn(&[&str]) -> Vec<Vec<String>>); 3] = [
        ("bySortedKey", by_sorted_key),
        ("byCountKey", by_count_key),
        ("byCountKeyNoSeparator", by_count_key_no_separator),
    ];
    for (name, f) in fns.iter() {
        let ok = cases.iter().filter(|(inp, want)| normalize(f(inp)) == normalize(want.clone())).count();
        println!("{:<22} {}/{} ca đúng", name, ok, cases.len());
    }

    let x = format!("a{}", "b".repeat(11));
    let y = format!("{}b", "a".repeat(11));
    println!("\n\"{}\" và \"{}\" không phải anagram", x, y);
    println!("  byCountKeyNoSeparator: {} nhóm", by_count_key_no_separator(&[&x, &y]).len());
    println!("  byCountKey:            {} nhóm", by_count_key(&[&x, &y]).len());
}
