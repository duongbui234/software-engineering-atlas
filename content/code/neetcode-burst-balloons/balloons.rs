// Burst Balloons (LeetCode 312): bốn cách, từ vét cạn tới bảng theo độ dài khoảng.
use std::collections::HashMap;

// Vét cạn: thử mọi thứ tự nổ, mỗi lần bỏ một quả khỏi mảng còn lại
fn burst_brute(arr: &[i32], calls: &mut u64) -> i32 {
    *calls += 1;
    let mut best = 0;
    for i in 0..arr.len() {
        let left = if i > 0 { arr[i - 1] } else { 1 };
        let right = if i + 1 < arr.len() { arr[i + 1] } else { 1 };
        let mut rest = arr.to_vec();
        rest.remove(i);
        best = best.max(left * arr[i] * right + burst_brute(&rest, calls));
    }
    best
}

fn pad(nums: &[i32]) -> Vec<i32> {
    let mut p = Vec::with_capacity(nums.len() + 2);
    p.push(1);
    p.extend_from_slice(nums);
    p.push(1);
    p
}

// Cách SAI: chọn quả nổ ĐẦU TIÊN rồi giải hai bên như hai bài độc lập.
// Sau khi k nổ, hai bên kề nhau, nên hàng xóm thật không còn là p[k-1], p[k+1].
fn burst_first_split_wrong(nums: &[i32]) -> i32 {
    fn solve(p: &[i32], memo: &mut HashMap<(usize, usize), i32>, l: usize, r: usize) -> i32 {
        if l > r {
            return 0;
        }
        if let Some(&v) = memo.get(&(l, r)) {
            return v;
        }
        let mut best = 0;
        for k in l..=r {
            best = best.max(p[k - 1] * p[k] * p[k + 1] + solve(p, memo, l, k - 1) + solve(p, memo, k + 1, r));
        }
        memo.insert((l, r), best);
        best
    }
    let p = pad(nums);
    solve(&p, &mut HashMap::new(), 1, nums.len())
}

// Ghi nhớ: solve(l, r) = điểm lớn nhất khi nổ hết các quả nằm GIỮA l và r (không gồm l, r).
// Chọn k là quả nổ CUỐI CÙNG trong khoảng: lúc đó hàng xóm của k chính là p[l] và p[r].
fn burst_memo(nums: &[i32], calls: &mut u64) -> i32 {
    fn solve(p: &[i32], memo: &mut Vec<Vec<i32>>, calls: &mut u64, l: usize, r: usize) -> i32 {
        *calls += 1;
        if l + 1 >= r {
            return 0;
        }
        if memo[l][r] != -1 {
            return memo[l][r];
        }
        let mut best = 0;
        for k in l + 1..r {
            best = best.max(p[l] * p[k] * p[r] + solve(p, memo, calls, l, k) + solve(p, memo, calls, k, r));
        }
        memo[l][r] = best;
        best
    }
    let p = pad(nums);
    let n = p.len();
    let mut memo = vec![vec![-1; n]; n];
    solve(&p, &mut memo, calls, 0, n - 1)
}

// Bảng: điền theo độ dài khoảng tăng dần, khoảng ngắn luôn có trước khoảng dài
fn max_coins(nums: Vec<i32>) -> i32 {
    let p = pad(&nums);
    let n = p.len();
    let mut dp = vec![vec![0i32; n]; n];
    for len in 2..n {
        for l in 0..n - len {
            let r = l + len;
            let mut best = 0;
            for k in l + 1..r {
                best = best.max(p[l] * p[k] * p[r] + dp[l][k] + dp[k][r]);
            }
            dp[l][r] = best;
        }
    }
    dp[0][n - 1]
}

fn main() {
    let mixed: Vec<i32> = (0..300).map(|i| (i * 37 + 11) % 101).collect();
    let cases: Vec<(Vec<i32>, i32)> = vec![
        (vec![7], 7),
        (vec![2, 3], 9),
        (vec![0, 0, 0], 0),
        (vec![4, 0, 4], 20),
        (vec![2, 9, 4], 84),
        (vec![5, 1, 1, 5], 60),
        (vec![9, 1, 8, 2, 7], 760),
        (vec![1, 2, 3, 4, 5, 6], 252),
        (vec![1; 300], 300),
        (vec![100; 300], 298010100),
        (mixed, 116330212),
    ];
    let mut ok = 0;
    for (nums, expected) in &cases {
        let mut calls = 0;
        let mut good = max_coins(nums.clone()) == *expected && burst_memo(nums, &mut calls) == *expected;
        if nums.len() <= 6 && burst_brute(nums, &mut calls) != *expected {
            good = false;
        }
        if good {
            ok += 1;
        }
    }
    println!("{}/{} ca đúng", ok, cases.len());

    let mut arrays: Vec<Vec<i32>> = vec![vec![]];
    let mut k = 0;
    while k < arrays.len() {
        if arrays[k].len() < 5 {
            for v in 0..=3 {
                let mut next = arrays[k].clone();
                next.push(v);
                arrays.push(next);
            }
        }
        k += 1;
    }
    let (mut exhaustive_ok, mut total) = (0, 0);
    for nums in &arrays[1..] {
        total += 1;
        let mut calls = 0;
        let expected = burst_brute(nums, &mut calls);
        if max_coins(nums.clone()) == expected && burst_memo(nums, &mut calls) == expected {
            exhaustive_ok += 1;
        }
    }
    println!("{}/{} ca đúng (đối chiếu mọi thứ tự nổ)", exhaustive_ok, total);

    println!(
        "Chia theo quả nổ đầu tiên với [2,3]: {}, đúng là {}",
        burst_first_split_wrong(&[2, 3]),
        max_coins(vec![2, 3])
    );
    let eight = [3, 1, 4, 1, 5, 9, 2, 6];
    let (mut brute_calls, mut memo_calls) = (0u64, 0u64);
    burst_brute(&eight, &mut brute_calls);
    burst_memo(&eight, &mut memo_calls);
    println!("8 quả: vét cạn {} lượt gọi, memo {} lượt gọi", brute_calls, memo_calls);
}
