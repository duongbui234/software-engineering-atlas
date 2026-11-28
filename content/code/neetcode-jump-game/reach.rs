// Jump Game (LeetCode 55): quay lui, ghi nhớ, bảng DP, tham lam xuôi và tham lam ngược
// Chạy: rustc --edition 2021 -O reach.rs -o /tmp/reach && /tmp/reach
use std::time::Instant;

// Quay lui: từ ô i thử mọi bước 1..nums[i], bước dài trước
fn can_jump_backtrack(nums: &[i32], calls: &mut u64) -> bool {
    fn dfs(nums: &[i32], i: usize, calls: &mut u64) -> bool {
        *calls += 1;
        let last = nums.len() - 1;
        if i == last {
            return true;
        }
        for step in (1..=(nums[i] as usize).min(last - i)).rev() {
            if dfs(nums, i + step, calls) {
                return true;
            }
        }
        false
    }
    dfs(nums, 0, calls)
}

// Ghi nhớ từ trên xuống: memo[i] là 0 chưa biết, 1 tới đích được, 2 kẹt
fn can_jump_memo(nums: &[i32], calls: &mut u64) -> bool {
    fn dfs(nums: &[i32], i: usize, memo: &mut Vec<u8>, calls: &mut u64) -> bool {
        *calls += 1;
        let last = nums.len() - 1;
        if i == last {
            return true;
        }
        if memo[i] != 0 {
            return memo[i] == 1;
        }
        for step in (1..=(nums[i] as usize).min(last - i)).rev() {
            if dfs(nums, i + step, memo, calls) {
                memo[i] = 1;
                return true;
            }
        }
        memo[i] = 2;
        false
    }
    dfs(nums, 0, &mut vec![0; nums.len()], calls)
}

// Bảng DP từ dưới lên: good[i] đúng khi từ i nhảy tới được một ô good bên phải
fn can_jump_table(nums: &[i32], steps: &mut u64) -> bool {
    let n = nums.len();
    let mut good = vec![false; n];
    good[n - 1] = true;
    for i in (0..n - 1).rev() {
        let end = (i + nums[i] as usize).min(n - 1);
        for j in i + 1..=end {
            *steps += 1;
            if good[j] {
                good[i] = true;
                break;
            }
        }
    }
    good[0]
}

// Tham lam xuôi: các ô tới được luôn là một khúc liền 0..farthest
fn can_jump(nums: &[i32], steps: &mut u64) -> bool {
    let mut farthest = 0;
    for i in 0..nums.len() {
        *steps += 1;
        if i > farthest {
            return false; // ô i nằm ngoài khúc tới được: kẹt
        }
        farthest = farthest.max(i + nums[i] as usize);
        if farthest >= nums.len() - 1 {
            return true;
        }
    }
    true
}

// Tham lam ngược: dời đích về ô trái nhất đã biết là tới đích được
fn can_jump_goal(nums: &[i32]) -> bool {
    let mut goal = nums.len() - 1;
    for i in (0..nums.len() - 1).rev() {
        if i + nums[i] as usize >= goal {
            goal = i; // từ i nhảy tới goal, nên i thành đích mới
        }
    }
    goal == 0
}

// Bản sai 1: quên kiểm tra i > farthest, cứ cộng tiếp cả những ô không tới được
fn can_jump_no_guard(nums: &[i32]) -> bool {
    let mut farthest = 0;
    for i in 0..nums.len() {
        farthest = farthest.max(i + nums[i] as usize);
    }
    farthest >= nums.len() - 1
}

// Bản sai 2: mỗi lượt nhảy bước dài nhất từ ô đang đứng
fn can_jump_longest_hop(nums: &[i32]) -> bool {
    let mut i = 0;
    while i < nums.len() - 1 {
        if nums[i] == 0 {
            return false;
        }
        i += nums[i] as usize;
    }
    true
}

// Trọng tài độc lập: lan tập ô tới được cho tới khi không đổi nữa
fn referee(nums: &[i32]) -> bool {
    let n = nums.len();
    let mut reach = vec![false; n];
    reach[0] = true;
    let mut changed = true;
    while changed {
        changed = false;
        for i in 0..n {
            if !reach[i] {
                continue;
            }
            let mut j = i + 1;
            while j <= i + nums[i] as usize && j < n {
                if !reach[j] {
                    reach[j] = true;
                    changed = true;
                }
                j += 1;
            }
        }
    }
    reach[n - 1]
}

fn all_correct(nums: &[i32], want: bool) -> bool {
    let mut c = 0;
    can_jump_backtrack(nums, &mut c) == want
        && can_jump_memo(nums, &mut c) == want
        && can_jump_table(nums, &mut c) == want
        && can_jump(nums, &mut c) == want
        && can_jump_goal(nums) == want
}

// Mảng tệ nhất cho bảng DP: mọi ô đều nhảy đúng tới ô số 0 ở vị trí n - 2
fn worst_case(n: usize) -> Vec<i32> {
    let mut a: Vec<i32> = (0..n - 1).map(|i| (n - 2 - i) as i32).collect();
    a.push(0);
    a
}

fn build(arr: &mut Vec<i32>, total: &mut u32, good: &mut u32) {
    if !arr.is_empty() {
        *total += 1;
        if all_correct(arr, referee(arr)) {
            *good += 1;
        }
    }
    if arr.len() == 6 {
        return;
    }
    for v in 0..=3 {
        arr.push(v);
        build(arr, total, good);
        arr.pop();
    }
}

fn main() {
    let cases: Vec<(Vec<i32>, bool)> = vec![
        (vec![0], true),
        (vec![1, 0], true),
        (vec![0, 1], false),
        (vec![2, 0, 0], true),
        (vec![1, 0, 1], false),
        (vec![2, 3, 0, 0, 1], true),
        (vec![5, 0, 0, 0, 0, 0], true),
        (vec![1, 2, 0, 1, 0, 3], false),
        (vec![2, 0, 2, 0, 1, 0], true),
        (vec![4, 0, 0, 0, 0, 1], false),
        (worst_case(10), false),
    ];
    let mut ok = 0;
    for (nums, want) in &cases {
        if all_correct(nums, *want) && referee(nums) == *want {
            ok += 1;
        } else {
            println!("sai ở {:?}", nums);
        }
    }
    println!("{}/{} ca đúng", ok, cases.len());

    // Đối chiếu: mọi mảng dài 1–6, mỗi phần tử từ 0 đến 3
    let (mut total, mut good) = (0, 0);
    build(&mut Vec::new(), &mut total, &mut good);
    println!("{}/{} ca đúng (đối chiếu trọng tài lan tập)", good, total);

    let score = |f: fn(&[i32]) -> bool| cases.iter().filter(|(nums, want)| f(nums) == *want).count();
    println!("Bản quên kiểm tra i > farthest: {}/{} ca đúng", score(can_jump_no_guard), cases.len());
    println!("Bản nhảy bước dài nhất: {}/{} ca đúng", score(can_jump_longest_hop), cases.len());

    let small = worst_case(20);
    let (mut bt, mut mm) = (0, 0);
    can_jump_backtrack(&small, &mut bt);
    can_jump_memo(&small, &mut mm);
    println!("n = 20, mảng tệ nhất: quay lui {} lượt gọi, ghi nhớ {} lượt gọi", bt, mm);

    let big = worst_case(10000);
    let (mut table_steps, mut greedy_steps) = (0, 0);
    can_jump_table(&big, &mut table_steps);
    can_jump(&big, &mut greedy_steps);
    println!("n = 10000, mảng tệ nhất: bảng DP {} bước, tham lam {} bước", table_steps, greedy_steps);

    let mut sink = 0;
    let t = Instant::now();
    std::hint::black_box(can_jump_table(std::hint::black_box(&big), &mut sink));
    let table_ms = t.elapsed().as_secs_f64() * 1000.0;
    let t = Instant::now();
    for _ in 0..100 {
        std::hint::black_box(can_jump(std::hint::black_box(&big), &mut sink));
    }
    let greedy_ms = t.elapsed().as_secs_f64() * 1000.0 / 100.0;
    println!("Thời gian n = 10000: bảng DP {:.1} ms, tham lam {:.3} ms", table_ms, greedy_ms);
}
