// Ga MISC-01: quay lui trên cây lựa chọn (tập con và tổ hợp).
// Chạy: rustc --edition 2021 -O choices.rs -o /tmp/choices && /tmp/choices
use std::collections::HashSet;

// Subsets: ghi lại ở MỌI nút, nhánh con chỉ xét phần tử sau i.
fn subsets(nums: &[i32]) -> Vec<Vec<i32>> {
    fn walk(nums: &[i32], start: usize, path: &mut Vec<i32>, result: &mut Vec<Vec<i32>>) {
        result.push(path.clone()); // chép path, vì path còn đổi tiếp
        for i in start..nums.len() {
            path.push(nums[i]); // chọn
            walk(nums, i + 1, path, result); // đi sâu, mỗi phần tử dùng một lần
            path.pop(); // gỡ lựa chọn
        }
    }
    let mut result = Vec::new();
    walk(nums, 0, &mut Vec::new(), &mut result);
    result
}

// Subsets II: sắp xếp, rồi ở cùng một tầng bỏ giá trị trùng với anh em đứng trước.
fn subsets_with_dup(nums: &[i32]) -> Vec<Vec<i32>> {
    fn walk(nums: &[i32], start: usize, path: &mut Vec<i32>, result: &mut Vec<Vec<i32>>) {
        result.push(path.clone());
        for i in start..nums.len() {
            if i > start && nums[i] == nums[i - 1] {
                continue; // trùng ở cùng tầng
            }
            path.push(nums[i]);
            walk(nums, i + 1, path, result);
            path.pop();
        }
    }
    let mut sorted = nums.to_vec();
    sorted.sort();
    let mut result = Vec::new();
    walk(&sorted, 0, &mut Vec::new(), &mut result);
    result
}

// Combination Sum (reuse = true: nhánh con bắt đầu từ i) và Combination Sum II
// (reuse = false: i + 1, bỏ trùng ở cùng tầng). Chỉ ghi khi còn lại đúng 0.
fn combination_sum(candidates: &[i32], target: i32, reuse: bool) -> Vec<Vec<i32>> {
    fn walk(nums: &[i32], start: usize, remaining: i32, reuse: bool,
            path: &mut Vec<i32>, result: &mut Vec<Vec<i32>>) {
        if remaining == 0 {
            result.push(path.clone());
            return;
        }
        for i in start..nums.len() {
            if !reuse && i > start && nums[i] == nums[i - 1] {
                continue;
            }
            if nums[i] > remaining {
                break; // đã sắp xếp: các số sau còn lớn hơn
            }
            path.push(nums[i]);
            walk(nums, if reuse { i } else { i + 1 }, remaining - nums[i], reuse, path, result);
            path.pop();
        }
    }
    let mut sorted = candidates.to_vec();
    sorted.sort();
    let mut result = Vec::new();
    walk(&sorted, 0, target, reuse, &mut Vec::new(), &mut result);
    result
}

// Letter Combinations: tầng thứ k chọn một chữ của chữ số thứ k; ghi ở lá.
fn letter_combinations(digits: &str) -> Vec<String> {
    const KEYS: [&str; 10] = ["", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"];
    fn walk(digits: &[u8], depth: usize, path: &mut String, result: &mut Vec<String>) {
        if depth == digits.len() {
            result.push(path.clone());
            return;
        }
        for letter in KEYS[(digits[depth] - b'0') as usize].chars() {
            path.push(letter);
            walk(digits, depth + 1, path, result);
            path.pop();
        }
    }
    let mut result = Vec::new();
    if digits.is_empty() {
        return result;
    }
    walk(digits.as_bytes(), 0, &mut String::new(), &mut result);
    result
}

// So sánh không phụ thuộc thứ tự: sắp xếp trong từng tổ hợp, rồi sắp xếp cả danh sách.
fn norm_ints(lists: Vec<Vec<i32>>) -> Vec<String> {
    let mut out: Vec<String> = lists
        .into_iter()
        .map(|mut l| {
            l.sort();
            l.iter().map(|v| v.to_string()).collect::<Vec<_>>().join(",")
        })
        .collect();
    out.sort();
    out
}

fn norm_strs(mut list: Vec<String>) -> Vec<String> {
    list.sort();
    list
}

fn v(rows: &[&[i32]]) -> Vec<Vec<i32>> {
    rows.iter().map(|r| r.to_vec()).collect()
}

fn s(words: &[&str]) -> Vec<String> {
    words.iter().map(|w| w.to_string()).collect()
}

fn main() {
    // (tên, kết quả đã chuẩn hóa, mong đợi đã chuẩn hóa hoặc None, số lượng khi chỉ đếm)
    let cases: Vec<(&str, Vec<String>, Option<Vec<String>>, usize)> = vec![
        ("subsets [2,5,9]", norm_ints(subsets(&[2, 5, 9])),
         Some(norm_ints(v(&[&[], &[2], &[2, 5], &[2, 5, 9], &[2, 9], &[5], &[5, 9], &[9]]))), 0),
        ("subsets [7]", norm_ints(subsets(&[7])), Some(norm_ints(v(&[&[], &[7]]))), 0),
        ("subsets 10 số", norm_ints(subsets(&[1, 2, 3, 4, 5, 6, 7, 8, 9, 10])), None, 1024),
        ("subsetsWithDup [3,1,3]", norm_ints(subsets_with_dup(&[3, 1, 3])),
         Some(norm_ints(v(&[&[], &[1], &[1, 3], &[1, 3, 3], &[3], &[3, 3]]))), 0),
        ("subsetsWithDup [6,6,6]", norm_ints(subsets_with_dup(&[6, 6, 6])),
         Some(norm_ints(v(&[&[], &[6], &[6, 6], &[6, 6, 6]]))), 0),
        ("subsetsWithDup [4,4,1,4,2]", norm_ints(subsets_with_dup(&[4, 4, 1, 4, 2])), None, 16),
        ("combinationSum [3,4,5] 8", norm_ints(combination_sum(&[3, 4, 5], 8, true)),
         Some(norm_ints(v(&[&[3, 5], &[4, 4]]))), 0),
        ("combinationSum [2,3,7] 9", norm_ints(combination_sum(&[2, 3, 7], 9, true)),
         Some(norm_ints(v(&[&[2, 2, 2, 3], &[2, 7], &[3, 3, 3]]))), 0),
        ("combinationSum [4] 3", norm_ints(combination_sum(&[4], 3, true)), Some(vec![]), 0),
        ("combinationSum [2,3,5,7] 20", norm_ints(combination_sum(&[2, 3, 5, 7], 20, true)), None, 18),
        ("combinationSum2 [1,4,1,2,3,4] 6", norm_ints(combination_sum(&[1, 4, 1, 2, 3, 4], 6, false)),
         Some(norm_ints(v(&[&[1, 1, 4], &[1, 2, 3], &[2, 4]]))), 0),
        ("combinationSum2 [3,3,2,4,3] 6", norm_ints(combination_sum(&[3, 3, 2, 4, 3], 6, false)),
         Some(norm_ints(v(&[&[2, 4], &[3, 3]]))), 0),
        ("combinationSum2 [5] 3", norm_ints(combination_sum(&[5], 3, false)), Some(vec![]), 0),
        ("letterCombinations 47", norm_strs(letter_combinations("47")),
         Some(norm_strs(s(&["gp", "gq", "gr", "gs", "hp", "hq", "hr", "hs", "ip", "iq", "ir", "is"]))), 0),
        ("letterCombinations 9", norm_strs(letter_combinations("9")), Some(s(&["w", "x", "y", "z"])), 0),
        ("letterCombinations 7979", norm_strs(letter_combinations("7979")), None, 256),
        ("letterCombinations rỗng", norm_strs(letter_combinations("")), Some(vec![]), 0),
    ];
    let total = cases.len();
    let mut ok = 0;
    let mut fails: Vec<&str> = Vec::new();
    for (name, got, want, count) in cases {
        let pass = match want {
            Some(w) => got == w,
            None => got.len() == count && got.iter().collect::<HashSet<_>>().len() == count,
        };
        if pass {
            ok += 1;
        } else {
            fails.push(name);
        }
    }
    println!("{}/{} ca đúng", ok, total);
    if !fails.is_empty() {
        println!("sai ở: {}", fails.join("; "));
    }
}
