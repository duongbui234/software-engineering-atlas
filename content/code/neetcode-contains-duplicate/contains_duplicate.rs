// NC-01 Contains Duplicate (LeetCode 217): bốn cách giải và test.
// Chạy: rustc --edition 2021 -O contains_duplicate.rs && ./contains_duplicate
use std::collections::HashSet;

// Cách 1, vét cạn: so mọi cặp. O(n²) thời gian, O(1) bộ nhớ.
fn brute_force(nums: &[i32]) -> bool {
    for i in 0..nums.len() {
        for j in i + 1..nums.len() {
            if nums[i] == nums[j] {
                return true;
            }
        }
    }
    false
}

// Cách 2, sắp xếp rồi quét: phải sao chép (to_vec) vì nums chỉ được mượn để đọc.
fn sort_then_scan(nums: &[i32]) -> bool {
    let mut a = nums.to_vec();
    a.sort_unstable();
    a.windows(2).any(|w| w[0] == w[1])
}

// Cách 3, sổ đã thấy: insert trả về false nếu phần tử đã có.
fn hash_set(nums: &[i32]) -> bool {
    let mut seen = HashSet::with_capacity(nums.len());
    for &x in nums {
        if !seen.insert(x) {
            return true;
        }
    }
    false
}

// Cách 4, một dòng: gọn, nhưng luôn dựng cả HashSet.
fn set_size(nums: &[i32]) -> bool {
    nums.iter().collect::<HashSet<_>>().len() != nums.len()
}

fn main() {
    let cases: Vec<(Vec<i32>, bool)> = vec![
        (vec![1, 2, 3, 1], true),
        (vec![1, 2, 3, 4], false),
        (vec![1, 1, 1, 3, 3, 4, 3, 2, 4, 2], true),
        (vec![], false),
        (vec![7], false),
        (vec![-1_000_000_000, 1_000_000_000, -1_000_000_000], true),
    ];
    let solutions: [(&str, fn(&[i32]) -> bool); 4] = [
        ("brute_force", brute_force),
        ("sort_then_scan", sort_then_scan),
        ("hash_set", hash_set),
        ("set_size", set_size),
    ];
    let mut failed = 0;
    for (name, f) in solutions.iter() {
        for (input, want) in &cases {
            if f(input) != *want {
                failed += 1;
                println!("SAI {}({:?})", name, input);
            }
        }
    }
    println!("test: {} cách × {} ca, {} ca sai", solutions.len(), cases.len(), failed);
}
