// Permutations (LeetCode 46): đánh dấu phần tử đã dùng, đổi chỗ tại chỗ, chèn vào mọi khe
// Chạy: rustc --edition 2021 -O arrange.rs -o /tmp/arrange && /tmp/arrange
use std::collections::HashSet;

// Cách chính: path cộng mảng used đánh dấu phần tử đã nằm trong path
fn permute(nums: &[i32], calls: &mut usize) -> Vec<Vec<i32>> {
    fn walk(nums: &[i32], used: &mut Vec<bool>, path: &mut Vec<i32>, result: &mut Vec<Vec<i32>>, calls: &mut usize) {
        *calls += 1;
        if path.len() == nums.len() {
            result.push(path.clone()); // chép path, vì path còn bị sửa tiếp
            return;
        }
        for i in 0..nums.len() {
            if used[i] {
                continue; // phần tử này đã nằm trong path
            }
            used[i] = true;
            path.push(nums[i]);
            walk(nums, used, path, result, calls);
            path.pop();
            used[i] = false; // gỡ dấu để nhánh anh em được dùng lại
        }
    }
    let mut result = Vec::new();
    walk(nums, &mut vec![false; nums.len()], &mut Vec::new(), &mut result, calls);
    result
}

// Đổi chỗ tại chỗ: vị trí k lần lượt nhận từng phần tử đang nằm ở k..n-1
fn permute_swap(nums: &[i32]) -> Vec<Vec<i32>> {
    fn walk(a: &mut Vec<i32>, k: usize, result: &mut Vec<Vec<i32>>) {
        if k == a.len() {
            result.push(a.clone());
            return;
        }
        for i in k..a.len() {
            a.swap(k, i);
            walk(a, k + 1, result);
            a.swap(k, i); // đổi lại để mảng về như cũ
        }
    }
    let mut result = Vec::new();
    walk(&mut nums.to_vec(), 0, &mut result);
    result
}

// Cách lặp: chèn phần tử mới vào mọi khe của từng hoán vị đã có
fn permute_insert(nums: &[i32]) -> Vec<Vec<i32>> {
    let mut layer: Vec<Vec<i32>> = vec![vec![]];
    for &x in nums {
        let mut next = Vec::new();
        for p in &layer {
            for slot in 0..=p.len() {
                let mut q = p.clone();
                q.insert(slot, x);
                next.push(q);
            }
        }
        layer = next;
    }
    layer
}

// Bản sai: mượn chỉ số bắt đầu của bài tổ hợp, chỉ ghi khi path đủ n phần tử
fn permute_with_start(nums: &[i32]) -> Vec<Vec<i32>> {
    fn walk(nums: &[i32], start: usize, path: &mut Vec<i32>, result: &mut Vec<Vec<i32>>) {
        if path.len() == nums.len() {
            result.push(path.clone());
            return;
        }
        for i in start..nums.len() {
            path.push(nums[i]);
            walk(nums, i + 1, path, result); // không bao giờ quay lại phần tử đứng trước i
            path.pop();
        }
    }
    let mut result = Vec::new();
    walk(nums, 0, &mut Vec::new(), &mut result);
    result
}

// Trọng tài độc lập: vét mọi bộ n chỉ số (n^n bộ), giữ bộ có chỉ số đôi một khác nhau
fn brute_force(nums: &[i32]) -> Vec<Vec<i32>> {
    let n = nums.len();
    let total = n.pow(n as u32);
    let mut result = Vec::new();
    for code in 0..total {
        let mut c = code;
        let mut seen = HashSet::new();
        let mut perm = Vec::new();
        for _ in 0..n {
            seen.insert(c % n);
            perm.push(nums[c % n]);
            c /= n;
        }
        if seen.len() == n {
            result.push(perm);
        }
    }
    result
}

fn canonical(list: &[Vec<i32>]) -> Vec<Vec<i32>> {
    let mut sorted = list.to_vec();
    sorted.sort();
    sorted
}

fn factorial(n: usize) -> usize {
    (1..=n).product()
}

fn check(nums: &[i32], expected: Option<Vec<Vec<i32>>>) -> bool {
    let want = canonical(&expected.unwrap_or_else(|| brute_force(nums)));
    let mut calls = 0;
    for got in [permute(nums, &mut calls), permute_swap(nums), permute_insert(nums)] {
        if got.len() != factorial(nums.len()) {
            return false;
        }
        if got.iter().collect::<HashSet<_>>().len() != got.len() {
            return false;
        }
        if canonical(&got) != want {
            return false;
        }
    }
    true
}

fn build(arr: &mut Vec<i32>, total: &mut usize, good: &mut usize) {
    if !arr.is_empty() {
        *total += 1;
        if check(arr, None) {
            *good += 1;
        }
    }
    if arr.len() == 5 {
        return;
    }
    for v in 1..=5 {
        if !arr.contains(&v) {
            arr.push(v);
            build(arr, total, good);
            arr.pop();
        }
    }
}

fn main() {
    let cases: Vec<(Vec<i32>, Option<Vec<Vec<i32>>>)> = vec![
        (vec![7], Some(vec![vec![7]])),
        (vec![4, 9], Some(vec![vec![4, 9], vec![9, 4]])),
        (vec![3, 8, 1], Some(vec![vec![3, 8, 1], vec![3, 1, 8], vec![8, 3, 1], vec![8, 1, 3], vec![1, 3, 8], vec![1, 8, 3]])),
        (vec![0, -5, 10], None),
        (vec![-10, 10, 0, 5], None),
        (vec![2, 4, 6, 8, 10], None),
        (vec![-3, -2, -1, 0, 1, 2], None),
    ];
    let mut ok = 0;
    for (nums, expected) in &cases {
        if check(nums, expected.clone()) {
            ok += 1;
        } else {
            println!("sai ở {:?}", nums);
        }
    }
    println!("{}/{} ca đúng", ok, cases.len());

    // Đối chiếu: mọi mảng dài 1–5 gồm các giá trị khác nhau lấy từ {1, 2, 3, 4, 5}
    let (mut total, mut good) = (0, 0);
    build(&mut Vec::new(), &mut total, &mut good);
    println!("{}/{} ca đúng (đối chiếu vét mọi bộ chỉ số)", good, total);

    println!("Dùng chỉ số bắt đầu như bài tổ hợp với [3,8,1]: {}/6 hoán vị", permute_with_start(&[3, 8, 1]).len());

    let mut calls = 0;
    let six = permute(&[1, 2, 3, 4, 5, 6], &mut calls);
    println!("n = 6: {} hoán vị, {} lượt gọi", six.len(), calls);
}
