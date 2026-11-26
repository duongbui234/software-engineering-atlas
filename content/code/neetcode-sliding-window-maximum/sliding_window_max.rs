// LeetCode 239, Sliding Window Maximum: bốn cách, một bản sai, test.
// Chạy: rustc --edition 2021 -O sliding_window_max.rs && ./sliding_window_max
use std::collections::VecDeque;

// Cách 1, vét cạn: mỗi cửa sổ tìm max lại từ đầu. O(n·k).
fn brute_force(nums: &[i32], k: usize) -> Vec<i32> {
    nums.windows(k).map(|w| *w.iter().max().unwrap()).collect()
}

// SAI: giữ một max chạy, chỉ so với phần tử mới. Khi max cũ trượt ra khỏi cửa sổ, nó vẫn bị giữ lại.
fn running_max_only(nums: &[i32], k: usize) -> Vec<i32> {
    let (mut out, mut m) = (Vec::new(), i32::MIN);
    for (i, &x) in nums.iter().enumerate() {
        m = m.max(x);
        if i + 1 >= k { out.push(m); }
    }
    out
}

// Cách 2, chia khối k: max tiền tố trong khối và max hậu tố trong khối.
fn blocks(nums: &[i32], k: usize) -> Vec<i32> {
    let n = nums.len();
    let (mut pre, mut suf) = (nums.to_vec(), nums.to_vec());
    for i in 1..n { if i % k != 0 { pre[i] = pre[i - 1].max(nums[i]); } }
    for i in (0..n.saturating_sub(1)).rev() { if (i + 1) % k != 0 { suf[i] = suf[i + 1].max(nums[i]); } }
    (0..=n - k).map(|i| suf[i].max(pre[i + k - 1])).collect()
}

// Cách 3, hàng đợi đơn điệu với VecDeque: lấy ra ở cả hai đầu đều O(1).
fn monotonic_deque(nums: &[i32], k: usize) -> Vec<i32> {
    let mut q: VecDeque<usize> = VecDeque::new(); // chỉ số; giá trị giảm dần từ đầu hàng
    let mut out = Vec::with_capacity(nums.len() + 1 - k);
    for (i, &x) in nums.iter().enumerate() {
        // viết front + k <= i, KHÔNG viết front <= i - k: với usize, i - k tràn khi i < k
        if q.front().is_some_and(|&f| f + k <= i) { q.pop_front(); }
        while q.back().is_some_and(|&b| nums[b] <= x) { q.pop_back(); }
        q.push_back(i);
        if i + 1 >= k { out.push(nums[q[0]]); }
    }
    out
}

// Cách 3 bằng Vec và remove(0): đúng, nhưng remove(0) dời cả vec, O(k) mỗi lần.
fn monotonic_shift(nums: &[i32], k: usize) -> Vec<i32> {
    let (mut q, mut out): (Vec<usize>, Vec<i32>) = (Vec::new(), Vec::new());
    for (i, &x) in nums.iter().enumerate() {
        if !q.is_empty() && q[0] + k <= i { q.remove(0); }
        while q.last().is_some_and(|&b| nums[b] <= x) { q.pop(); }
        q.push(i);
        if i + 1 >= k { out.push(nums[q[0]]); }
    }
    out
}

fn main() {
    let cases: Vec<(Vec<i32>, usize, Vec<i32>)> = vec![
        (vec![1, 3, -1, -3, 5, 3, 6, 7], 3, vec![3, 3, 5, 5, 6, 7]), (vec![1], 1, vec![1]), (vec![9, 8, 7, 6, 5], 2, vec![9, 8, 7, 6]),
        (vec![1, 2, 3, 4], 4, vec![4]), (vec![4, 4, 4, 1], 2, vec![4, 4, 4]), (vec![-7, -8, 7, 5, 7, 1, 6, 0], 4, vec![7, 7, 7, 7, 7]), (vec![5, 1, 2, 3], 2, vec![5, 2, 3]),
    ];
    let fns: [(&str, fn(&[i32], usize) -> Vec<i32>); 5] = [
        ("bruteForce", brute_force), ("runningMaxOnly", running_max_only), ("blocks", blocks),
        ("monotonicDeque", monotonic_deque), ("monotonicShift", monotonic_shift),
    ];
    let j = |v: &[i32]| v.iter().map(|x| x.to_string()).collect::<Vec<_>>().join(",");
    for (name, f) in fns {
        let bad: Vec<String> = cases.iter().filter(|(a, k, want)| f(a, *k) != *want)
            .map(|(a, k, _)| format!("[{}] k={} → [{}]", j(a), k, j(&f(a, *k)))).collect();
        let tail = if bad.is_empty() { String::new() } else { format!("; sai ở {}", bad.join(" ")) };
        println!("{:<15} {}/{} ca đúng{}", name, cases.len() - bad.len(), cases.len(), tail);
    }
}
