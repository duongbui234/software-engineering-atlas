// Jump Game II (LeetCode 45): DP O(n²), BFS tường minh, tham lam theo lớp nhảy O(n)
// Chạy: rustc --edition 2021 -O layers.rs && ./layers
use std::collections::VecDeque;

const UNREACHABLE: usize = usize::MAX;

// DP: best[j] = số bước ít nhất để tới j; mỗi ô i đẩy best[i] + 1 sang mọi ô nó với tới
fn jump_dp(nums: &[i32], ops: &mut usize) -> usize {
    let n = nums.len();
    let mut best = vec![UNREACHABLE; n];
    best[0] = 0;
    for i in 0..n {
        if best[i] == UNREACHABLE {
            continue; // ô i chưa tới được: usize::MAX + 1 sẽ tràn
        }
        let last = (i + nums[i] as usize).min(n - 1);
        for j in i + 1..=last {
            *ops += 1;
            best[j] = best[j].min(best[i] + 1);
        }
    }
    best[n - 1]
}

// BFS tường minh: mỗi chỉ số là một đỉnh, cạnh i → i+1..i+nums[i]
fn jump_bfs(nums: &[i32], ops: &mut usize) -> usize {
    let n = nums.len();
    let mut dist = vec![UNREACHABLE; n];
    dist[0] = 0;
    let mut queue = VecDeque::from([0usize]);
    while let Some(i) = queue.pop_front() {
        let last = (i + nums[i] as usize).min(n - 1);
        for j in i + 1..=last {
            *ops += 1;
            if dist[j] == UNREACHABLE {
                dist[j] = dist[i] + 1;
                queue.push_back(j);
            }
        }
    }
    dist[n - 1]
}

// Cách chính: lớp nhảy. [.., end] là lớp hiện tại, far là chỗ xa nhất lớp sau với tới
fn jump(nums: &[i32], ops: &mut usize) -> usize {
    let (mut jumps, mut end, mut far) = (0, 0, 0);
    for i in 0..nums.len() - 1 { // dừng trước ô cuối
        *ops += 1;
        far = far.max(i + nums[i] as usize);
        if i == end { // đi hết lớp hiện tại: phải nhảy thêm một bước
            jumps += 1;
            end = far;
        }
    }
    jumps
}

// Bản sai: vòng lặp chạy tới cả ô cuối, nên có thể đếm thêm một bước thừa
fn jump_to_last(nums: &[i32]) -> usize {
    let (mut jumps, mut end, mut far) = (0, 0, 0);
    for i in 0..nums.len() {
        far = far.max(i + nums[i] as usize);
        if i == end {
            jumps += 1;
            end = far;
        }
    }
    jumps
}

// Bản sai: từ chỗ đang đứng luôn nhảy xa nhất có thể; None nếu kẹt ở ô 0
fn jump_farthest_now(nums: &[i32]) -> Option<usize> {
    let (mut pos, mut jumps) = (0, 0);
    while pos < nums.len() - 1 {
        if nums[pos] == 0 {
            return None;
        }
        pos = (pos + nums[pos] as usize).min(nums.len() - 1);
        jumps += 1;
    }
    Some(jumps)
}

// Trọng tài độc lập: thử mọi đường nhảy bằng đệ quy, không nhớ gì
fn brute_force(nums: &[i32], i: usize) -> usize {
    if i == nums.len() - 1 {
        return 0;
    }
    let mut best = UNREACHABLE;
    let last = (i + nums[i] as usize).min(nums.len() - 1);
    for j in i + 1..=last {
        let sub = brute_force(nums, j);
        if sub != UNREACHABLE {
            best = best.min(1 + sub);
        }
    }
    best
}

fn build(arr: &mut Vec<i32>, total: &mut usize, good: &mut usize, wrong: &mut usize, wrong_now: &mut usize) {
    if !arr.is_empty() {
        let want = brute_force(arr, 0);
        if want != UNREACHABLE {
            *total += 1;
            let mut tmp = 0;
            if jump_dp(arr, &mut tmp) == want && jump_bfs(arr, &mut tmp) == want && jump(arr, &mut tmp) == want {
                *good += 1;
            }
            if jump_to_last(arr) != want {
                *wrong += 1;
            }
            if jump_farthest_now(arr) != Some(want) {
                *wrong_now += 1;
            }
        }
    }
    if arr.len() == 6 {
        return;
    }
    for v in 0..=3 {
        arr.push(v);
        build(arr, total, good, wrong, wrong_now);
        arr.pop();
    }
}

fn main() {
    let cases: Vec<(Vec<i32>, usize)> = vec![
        (vec![0], 0),
        (vec![5], 0),
        (vec![1, 1, 1, 1], 3),
        (vec![4, 0, 0, 0, 0], 1),
        (vec![3, 1, 0, 2, 0, 1], 2),
        (vec![2, 0, 2, 0, 1], 2),
        (vec![1, 2, 1, 1, 1], 3),
        (vec![1, 3, 0, 0, 5, 0, 0, 1], 3),
    ];
    let mut ok = 0;
    let mut tmp = 0;
    for (nums, want) in &cases {
        let got = [jump_dp(nums, &mut tmp), jump_bfs(nums, &mut tmp), jump(nums, &mut tmp), brute_force(nums, 0)];
        if got.iter().all(|g| g == want) {
            ok += 1;
        } else {
            println!("sai ở {:?} {:?}", nums, got);
        }
    }
    println!("{}/{} ca đúng", ok, cases.len());

    // Đối chiếu: mọi mảng dài 1–6, giá trị 0–3, mà ô cuối với tới được
    let (mut total, mut good, mut wrong, mut wrong_now) = (0, 0, 0, 0);
    build(&mut Vec::new(), &mut total, &mut good, &mut wrong, &mut wrong_now);
    println!("{}/{} ca đúng (đối chiếu vét mọi đường nhảy)", good, total);
    println!("Cho vòng lặp chạy tới ô cuối: sai {}/{} ca, [0] cho {} thay vì 0", wrong, total, jump_to_last(&[0]));
    println!("Luôn nhảy xa nhất từ chỗ đang đứng: sai {}/{} ca, [2,4,1,1,1,1] cho {} thay vì 2", wrong_now, total, jump_farthest_now(&[2, 4, 1, 1, 1, 1]).unwrap());

    // Đo: n = 10000, mọi ô bằng 1000 (giới hạn lớn nhất của đề)
    let big = vec![1000; 10000];
    let (mut dp, mut bfs, mut greedy) = (0, 0, 0);
    let answers = [jump_dp(&big, &mut dp), jump_bfs(&big, &mut bfs), jump(&big, &mut greedy)];
    println!(
        "n = 10000, mọi ô 1000: {}/{}/{} bước; DP {} lượt cập nhật, BFS {} cạnh, lớp nhảy {} vòng",
        answers[0], answers[1], answers[2], dp, bfs, greedy
    );
}
