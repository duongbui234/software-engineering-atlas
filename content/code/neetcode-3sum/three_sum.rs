// LeetCode 15, 3Sum: ba cách, một bản sai, và test.
// Chạy: rustc --edition 2021 -O three_sum.rs && ./three_sum
use std::collections::HashSet;

// Vét cạn: thử mọi bộ ba, lọc trùng bằng HashSet<[i32; 3]> (mảng cố định băm được). O(n³).
fn brute_force(nums: &[i32]) -> Vec<Vec<i32>> {
    let (mut seen, mut out) = (HashSet::new(), vec![]);
    let n = nums.len();
    for i in 0..n {
        for j in i + 1..n {
            for k in j + 1..n {
                if nums[i] + nums[j] + nums[k] == 0 {
                    let mut t = [nums[i], nums[j], nums[k]];
                    t.sort_unstable();
                    if seen.insert(t) {
                        out.push(t.to_vec());
                    }
                }
            }
        }
    }
    out
}

// Cố định nums[i], tìm cặp còn lại bằng hash set (khuôn ga 1). O(n²).
fn hash_per_anchor(nums: &[i32]) -> Vec<Vec<i32>> {
    let (mut seen, mut out) = (HashSet::new(), vec![]);
    for i in 0..nums.len() {
        let mut met = HashSet::new();
        for j in i + 1..nums.len() {
            let need = -nums[i] - nums[j];
            if met.contains(&need) {
                let mut t = [nums[i], nums[j], need];
                t.sort_unstable();
                if seen.insert(t) {
                    out.push(t.to_vec());
                }
            }
            met.insert(nums[j]);
        }
    }
    out
}

// Sắp xếp + hai con trỏ: cố định a = nums[i], tìm b + c = −a trên đoạn bên phải.
fn sort_two_pointers(nums: &[i32]) -> Vec<Vec<i32>> {
    let mut a = nums.to_vec();
    a.sort_unstable();
    let mut out = vec![];
    // a.len() - 2 trên usize sẽ tràn nếu mảng có dưới 2 phần tử; saturating_sub giữ nó ở 0.
    for i in 0..a.len().saturating_sub(2) {
        if a[i] > 0 {
            break; // số nhỏ nhất đã dương thì tổng ba số không thể bằng 0
        }
        if i > 0 && a[i] == a[i - 1] {
            continue; // cùng giá trị neo: mọi bộ ba đã được tìm
        }
        let (mut lo, mut hi) = (i + 1, a.len() - 1);
        while lo < hi {
            let s = a[i] + a[lo] + a[hi];
            if s < 0 {
                lo += 1;
            } else if s > 0 {
                hi -= 1;
            } else {
                out.push(vec![a[i], a[lo], a[hi]]);
                lo += 1;
                hi -= 1;
                while lo < hi && a[lo] == a[lo - 1] {
                    lo += 1; // nhảy qua b trùng
                }
            }
        }
    }
    out
}

// SAI: không bỏ trùng. Cùng một bộ ba xuất hiện nhiều lần.
fn no_duplicate_skip(nums: &[i32]) -> Vec<Vec<i32>> {
    let mut a = nums.to_vec();
    a.sort_unstable();
    let mut out = vec![];
    for i in 0..a.len().saturating_sub(2) {
        let (mut lo, mut hi) = (i + 1, a.len() - 1);
        while lo < hi {
            let s = a[i] + a[lo] + a[hi];
            if s < 0 {
                lo += 1;
            } else if s > 0 {
                hi -= 1;
            } else {
                out.push(vec![a[i], a[lo], a[hi]]);
                lo += 1;
                hi -= 1;
            }
        }
    }
    out
}

fn norm(r: &[Vec<i32>]) -> Vec<Vec<i32>> {
    let mut v: Vec<Vec<i32>> = r
        .iter()
        .map(|t| {
            let mut t = t.clone();
            t.sort_unstable();
            t
        })
        .collect();
    v.sort();
    v
}

fn main() {
    let cases: Vec<(Vec<i32>, Vec<Vec<i32>>)> = vec![
        (vec![-1, 0, 1, 2, -1, -4], vec![vec![-1, -1, 2], vec![-1, 0, 1]]),
        (vec![0, 1, 1], vec![]),
        (vec![0, 0, 0], vec![vec![0, 0, 0]]),
        (vec![0, 0, 0, 0], vec![vec![0, 0, 0]]),
        (vec![-2, 0, 1, 1, 2], vec![vec![-2, 0, 2], vec![-2, 1, 1]]),
        (
            vec![-4, -2, -2, -2, 0, 1, 2, 2, 2, 3, 3, 4, 4, 6, 6],
            vec![vec![-4, -2, 6], vec![-4, 0, 4], vec![-4, 1, 3], vec![-4, 2, 2], vec![-2, -2, 4], vec![-2, 0, 2]],
        ),
        (vec![-10, 5, 5, -1, 11, -1], vec![vec![-10, -1, 11], vec![-10, 5, 5]]),
    ];
    let fns: [(&str, fn(&[i32]) -> Vec<Vec<i32>>); 4] = [
        ("brute_force", brute_force),
        ("hash_per_anchor", hash_per_anchor),
        ("sort_two_pointers", sort_two_pointers),
        ("no_duplicate_skip", no_duplicate_skip),
    ];
    for (name, f) in fns {
        let bad: Vec<String> = cases
            .iter()
            .filter(|(n, w)| norm(&f(n)) != norm(w))
            .map(|(n, _)| format!("{:?}", n))
            .collect();
        let msg = if bad.is_empty() { String::new() } else { format!("; sai ở {}", bad.join(" ")) };
        println!("{:<17} {}/{} ca đúng{}", name, cases.len() - bad.len(), cases.len(), msg);
    }
}
