// LeetCode 238, Product of Array Except Self: bốn cách, một bản sai, test.
// Chạy: rustc --edition 2021 -O product_except_self.rs && ./product_except_self

fn brute_force(nums: &[i32]) -> Option<Vec<i32>> {
    Some(
        (0..nums.len())
            .map(|i| nums.iter().enumerate().filter(|&(j, _)| j != i).map(|(_, &x)| x).product())
            .collect(),
    )
}

// SAI: chia cho chính nó. Chia số nguyên cho 0 trong Rust là panic;
// checked_div trả None để test đếm được thay vì làm sập chương trình.
fn naive_division(nums: &[i32]) -> Option<Vec<i32>> {
    let total: i32 = nums.iter().product();
    nums.iter().map(|&x| total.checked_div(x)).collect() // một None → cả kết quả là None
}

// Chia nhưng đếm số 0.
fn division_zero_aware(nums: &[i32]) -> Option<Vec<i32>> {
    let zeros = nums.iter().filter(|&&x| x == 0).count();
    let prod: i32 = nums.iter().filter(|&&x| x != 0).product();
    Some(
        nums.iter()
            .map(|&x| match zeros {
                0 => prod / x,
                1 => if x == 0 { prod } else { 0 },
                _ => 0,
            })
            .collect(),
    )
}

// Hai mảng phụ: prefix[i] = tích trước i, suffix[i] = tích sau i.
fn prefix_suffix_arrays(nums: &[i32]) -> Option<Vec<i32>> {
    let n = nums.len();
    let (mut prefix, mut suffix) = (vec![1; n], vec![1; n]);
    for i in 1..n {
        prefix[i] = prefix[i - 1] * nums[i - 1];
    }
    for i in (0..n.saturating_sub(1)).rev() {
        suffix[i] = suffix[i + 1] * nums[i + 1];
    }
    Some((0..n).map(|i| prefix[i] * suffix[i]).collect())
}

// O(1) bộ nhớ phụ: lượt 1 ghi tiền tố, lượt 2 nhân hậu tố bằng một biến chạy.
fn prefix_suffix_in_place(nums: &[i32]) -> Option<Vec<i32>> {
    let n = nums.len();
    let mut out = vec![1; n];
    let mut left = 1;
    for i in 0..n {
        out[i] = left;
        left *= nums[i];
    }
    let mut right = 1;
    for i in (0..n).rev() {
        out[i] *= right;
        right *= nums[i];
    }
    Some(out)
}

fn main() {
    let cases: Vec<(Vec<i32>, Vec<i32>)> = vec![
        (vec![1, 2, 3, 4], vec![24, 12, 8, 6]),
        (vec![-1, 1, 0, -3, 3], vec![0, 0, 9, 0, 0]),
        (vec![2, 3], vec![3, 2]),
        (vec![0, 0, 5], vec![0, 0, 0]),
        (vec![0, 4, 5], vec![20, 0, 0]),
        (vec![-2, -3, 4], vec![-12, -8, 6]),
    ];
    let fns: [(&str, fn(&[i32]) -> Option<Vec<i32>>); 5] = [
        ("bruteForce", brute_force),
        ("naiveDivision", naive_division),
        ("divisionZeroAware", division_zero_aware),
        ("prefixSuffixArrays", prefix_suffix_arrays),
        ("prefixSuffixInPlace", prefix_suffix_in_place),
    ];
    for (name, f) in fns.iter() {
        let bad: Vec<String> = cases
            .iter()
            .filter_map(|(n, w)| match f(n) {
                None => Some(format!("{:?}: chia cho 0", n)),
                Some(got) if got != *w => Some(format!("{:?}", n)),
                _ => None,
            })
            .collect();
        let tail = if bad.is_empty() { String::new() } else { format!("; lỗi ở {}", bad.join(", ")) };
        println!("{:<20} {}/{} ca đúng{}", name, cases.len() - bad.len(), cases.len(), tail);
    }

    // ── bẫy: tràn i32 ────────────────────────────────────────────────────────
    let big = [100_000i32, 100_000];
    println!("\n100000 * 100000: checked_mul = {:?}, wrapping_mul = {}", big[0].checked_mul(big[1]), big[0].wrapping_mul(big[1]));
}
