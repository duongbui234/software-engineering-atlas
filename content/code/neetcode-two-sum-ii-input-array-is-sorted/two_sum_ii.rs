// LeetCode 167, Two Sum II (mảng đã sắp xếp): bốn cách, một bản sai, và test.
// Chạy: rustc --edition 2021 -O two_sum_ii.rs && ./two_sum_ii
// Kết quả là chỉ số ĐẾM TỪ 1: [i + 1, j + 1].
use std::collections::HashMap;

fn brute_force(nums: &[i32], target: i32) -> Vec<i32> {
    for i in 0..nums.len() {
        for j in i + 1..nums.len() {
            if nums[i] + nums[j] == target {
                return vec![i as i32 + 1, j as i32 + 1];
            }
        }
    }
    vec![]
}

// Với mỗi nums[i], tìm nhị phân phần bù trong đoạn BÊN PHẢI i. O(n log n), O(1) bộ nhớ.
// binary_search có sẵn trên slice con nums[i + 1..]; chỉ số trả về tính từ đầu slice con.
fn binary_search(nums: &[i32], target: i32) -> Vec<i32> {
    for i in 0..nums.len() {
        if let Ok(k) = nums[i + 1..].binary_search(&(target - nums[i])) {
            return vec![i as i32 + 1, (i + 1 + k) as i32 + 1];
        }
    }
    vec![]
}

// Khuôn của ga 1 (hash map một lượt): đúng, O(n), nhưng tốn O(n) bộ nhớ.
fn hash_map(nums: &[i32], target: i32) -> Vec<i32> {
    let mut seen = HashMap::new();
    for (i, &x) in nums.iter().enumerate() {
        if let Some(&j) = seen.get(&(target - x)) {
            return vec![j as i32 + 1, i as i32 + 1];
        }
        seen.insert(x, i);
    }
    vec![]
}

// Hai con trỏ: tổng nhỏ quá thì tăng trái, lớn quá thì giảm phải. O(n), O(1) bộ nhớ.
fn two_pointers(nums: &[i32], target: i32) -> Vec<i32> {
    let (mut i, mut j) = (0, nums.len() - 1);
    while i < j {
        let sum = nums[i] + nums[j];
        if sum == target {
            return vec![i as i32 + 1, j as i32 + 1];
        }
        if sum < target {
            i += 1; // nums[i] cộng với số LỚN NHẤT còn lại vẫn thiếu
        } else {
            j -= 1; // nums[j] cộng với số NHỎ NHẤT còn lại vẫn thừa
        }
    }
    vec![]
}

// SAI: tìm nhị phân trên CẢ mảng, nên có thể ghép một phần tử với chính nó.
fn binary_search_whole_array(nums: &[i32], target: i32) -> Vec<i32> {
    for i in 0..nums.len() {
        let (mut lo, mut hi) = (0i64, nums.len() as i64 - 1);
        let want = target - nums[i];
        while lo <= hi {
            let mid = (lo + hi) / 2;
            let v = nums[mid as usize];
            if v == want {
                return vec![i as i32 + 1, mid as i32 + 1];
            }
            if v < want {
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
    }
    vec![]
}

fn main() {
    let cases: Vec<(Vec<i32>, i32, Vec<i32>)> = vec![
        (vec![2, 7, 11, 15], 9, vec![1, 2]),
        (vec![2, 3, 4], 6, vec![1, 3]),
        (vec![-1, 0], -1, vec![1, 2]),
        (vec![3, 3], 6, vec![1, 2]),
        (vec![1, 2, 3, 4, 4, 9, 56, 90], 8, vec![4, 5]),
        (vec![-10, -3, 0, 5, 9], 6, vec![2, 5]),
    ];
    let fns: [(&str, fn(&[i32], i32) -> Vec<i32>); 5] = [
        ("brute_force", brute_force),
        ("binary_search", binary_search),
        ("hash_map", hash_map),
        ("two_pointers", two_pointers),
        ("binary_search_whole_array", binary_search_whole_array),
    ];
    for (name, f) in fns {
        let bad: Vec<String> = cases
            .iter()
            .filter(|(n, t, w)| f(n, *t) != *w)
            .map(|(n, t, _)| format!("{:?}, {} → {:?}", n, t, f(n, *t)))
            .collect();
        let msg = if bad.is_empty() { String::new() } else { format!("; sai ở {}", bad.join(" ")) };
        println!("{:<25} {}/{} ca đúng{}", name, cases.len() - bad.len(), cases.len(), msg);
    }
}
