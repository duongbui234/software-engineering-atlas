// NC-03 Two Sum (LeetCode 1): vét cạn, hai con trỏ, hash map một lượt.
// Chạy: rustc --edition 2021 -O two_sum.rs && ./two_sum
use std::collections::HashMap;

// Cách 1, vét cạn: thử mọi cặp i < j. O(n²).
fn brute_force(nums: &[i32], target: i32) -> Option<[usize; 2]> {
    for i in 0..nums.len() {
        for j in i + 1..nums.len() {
            if nums[i] + nums[j] == target {
                return Some([i, j]);
            }
        }
    }
    None
}

// Cách 2, sắp xếp CHỈ SỐ theo giá trị + hai con trỏ: O(n log n).
fn two_pointers(nums: &[i32], target: i32) -> Option<[usize; 2]> {
    let mut idx: Vec<usize> = (0..nums.len()).collect();
    idx.sort_unstable_by_key(|&i| nums[i]); // sắp theo số, không có bẫy so chuỗi như JS
    let (mut l, mut r) = (0, idx.len().checked_sub(1)?);
    while l < r {
        let sum = nums[idx[l]] + nums[idx[r]];
        if sum == target {
            return Some([idx[l].min(idx[r]), idx[l].max(idx[r])]);
        }
        if sum < target { l += 1 } else { r -= 1 }
    }
    None
}

// Cách 3, hash map một lượt: hỏi trước, ghi sau. O(n).
fn one_pass(nums: &[i32], target: i32) -> Option<[usize; 2]> {
    let mut seen: HashMap<i32, usize> = HashMap::with_capacity(nums.len()); // giá trị → chỉ số
    for (i, &x) in nums.iter().enumerate() {
        if let Some(&j) = seen.get(&(target - x)) {
            return Some([j, i]); // get trả Option: không có "giá trị 0 giả" như map của Go
        }
        seen.insert(x, i);
    }
    None
}

// Biến thể sai: ghi TRƯỚC rồi mới hỏi.
fn one_pass_wrong_order(nums: &[i32], target: i32) -> Option<[usize; 2]> {
    let mut seen: HashMap<i32, usize> = HashMap::new();
    for (i, &x) in nums.iter().enumerate() {
        seen.insert(x, i);
        if let Some(&j) = seen.get(&(target - x)) {
            return Some([j, i]);
        }
    }
    None
}

fn main() {
    let cases: Vec<(Vec<i32>, i32, [usize; 2])> = vec![
        (vec![2, 7, 11, 15], 9, [0, 1]),
        (vec![3, 2, 4], 6, [1, 2]),
        (vec![3, 3], 6, [0, 1]),
        (vec![-3, 4, 3, 90], 0, [0, 2]),
        (vec![1_000_000_000, -999_999_999, 5], 1, [0, 1]),
    ];
    let fns: [(&str, fn(&[i32], i32) -> Option<[usize; 2]>); 4] = [
        ("bruteForce", brute_force),
        ("twoPointers", two_pointers),
        ("onePass", one_pass),
        ("onePassWrongOrder", one_pass_wrong_order),
    ];
    for (name, f) in fns.iter() {
        let bad: Vec<_> = cases.iter().filter(|(n, t, w)| f(n, *t) != Some(*w)).collect();
        let mut line = format!("{:<18} {}/{} ca đúng", name, cases.len() - bad.len(), cases.len());
        if let Some((n, t, _)) = bad.first() {
            line += &format!("; sai ở {:?}, target {} → {:?}", n, t, f(n, *t).unwrap_or([0, 0]));
        }
        println!("{}", line);
    }

    // ── bẫy: i32 tràn khi cộng hai số lớn ──────────────────────────────────────
    let (a, b) = (2_000_000_000i32, 1_000_000_000i32);
    println!("\n2e9 + 1e9 với i32: checked_add = {:?}, wrapping_add = {}", a.checked_add(b), a.wrapping_add(b));
}
