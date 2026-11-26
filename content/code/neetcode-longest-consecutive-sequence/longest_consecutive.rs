// LeetCode 128, Longest Consecutive Sequence: ba cách, một bản sai, và test.
// Chạy: rustc --edition 2021 -O longest_consecutive.rs && ./longest_consecutive
use std::collections::HashSet;

// Cách 1, vét cạn: với mỗi x, tìm x+1, x+2… bằng contains trên slice, mỗi lần quét cả mảng. O(n³).
fn brute_force(nums: &[i32]) -> i32 {
    let mut best = 0;
    for &x in nums {
        let mut len = 1;
        while nums.contains(&(x + len)) {
            len += 1;
        }
        best = best.max(len);
    }
    best
}

// Cách 2, sắp xếp rồi quét. nums chỉ được mượn để đọc, nên phải to_vec() trước khi sắp.
// dedup() bỏ các số trùng đứng cạnh nhau, nên vòng quét không phải lo chuyện trùng.
fn sort_scan(nums: &[i32]) -> i32 {
    if nums.is_empty() {
        return 0;
    }
    let mut a = nums.to_vec();
    a.sort_unstable();
    a.dedup();
    let (mut best, mut len) = (1, 1);
    for w in a.windows(2) {
        len = if w[1] == w[0] + 1 { len + 1 } else { 1 };
        best = best.max(len);
    }
    best
}

// Cách 3, hash set: chỉ đếm từ đầu dãy (x - 1 không có trong set). O(n) trung bình.
fn hash_set(nums: &[i32]) -> i32 {
    let all: HashSet<i32> = nums.iter().copied().collect();
    let mut best = 0;
    for &x in &all {
        if all.contains(&(x - 1)) {
            continue;
        }
        let mut len = 1;
        while all.contains(&(x + len)) {
            len += 1;
        }
        best = best.max(len);
    }
    best
}

// Bản sai: sắp xếp nhưng quên dedup, coi số trùng là đứt dãy.
fn sort_scan_reset_on_duplicate(nums: &[i32]) -> i32 {
    if nums.is_empty() {
        return 0;
    }
    let mut a = nums.to_vec();
    a.sort_unstable();
    let (mut best, mut len) = (1, 1);
    for w in a.windows(2) {
        len = if w[1] == w[0] + 1 { len + 1 } else { 1 };
        best = best.max(len);
    }
    best
}

fn main() {
    let cases: Vec<(Vec<i32>, i32)> = vec![
        (vec![100, 4, 200, 1, 3, 2], 4),
        (vec![0, 3, 7, 2, 5, 8, 4, 6, 0, 1], 9),
        (vec![1, 0, 1, 2], 3),
        (vec![], 0),
        (vec![7], 1),
        (vec![-3, -1, -2, 5], 3),
        (vec![9, 10, 8], 3),
    ];
    let fns: [(&str, fn(&[i32]) -> i32); 4] = [
        ("brute_force", brute_force),
        ("sort_scan", sort_scan),
        ("hash_set", hash_set),
        ("sort_scan_reset_on_duplicate", sort_scan_reset_on_duplicate),
    ];
    for (name, f) in fns {
        let bad: Vec<String> = cases
            .iter()
            .filter(|(nums, want)| f(nums) != *want)
            .map(|(nums, _)| format!("{:?}", nums))
            .collect();
        let msg = if bad.is_empty() { String::new() } else { format!("; sai ở {}", bad.join(" ")) };
        println!("{:<29} {}/{} ca đúng{}", name, cases.len() - bad.len(), cases.len(), msg);
    }
}
