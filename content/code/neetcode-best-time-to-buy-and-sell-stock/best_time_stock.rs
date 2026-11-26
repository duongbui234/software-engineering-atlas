// LeetCode 121, Best Time to Buy and Sell Stock: ba cách, một bản sai, test.
// Chạy: rustc --edition 2021 -O best_time_stock.rs && ./best_time_stock

// Cách 1, vét cạn: thử mọi cặp (ngày mua i, ngày bán j > i).
fn brute_force(prices: &[i32]) -> i32 {
    let mut best = 0;
    for i in 0..prices.len() {
        for j in i + 1..prices.len() {
            best = best.max(prices[j] - prices[i]);
        }
    }
    best
}

// SAI: lấy giá cao nhất trừ giá thấp nhất, bỏ qua thứ tự ngày (bán trước khi mua).
fn max_minus_min(prices: &[i32]) -> i32 {
    prices.iter().max().unwrap() - prices.iter().min().unwrap()
}

// Cách 2, giá thấp nhất từ trước tới nay: mỗi ngày hỏi "nếu bán hôm nay thì lời bao nhiêu?".
fn running_min(prices: &[i32]) -> i32 {
    let (mut min_so_far, mut best) = (i32::MAX, 0);
    for &p in prices {
        // p - i32::MAX không tràn vì p ≥ 0; ngày đầu ra số âm nên best vẫn là 0
        best = best.max(p - min_so_far);
        min_so_far = min_so_far.min(p);
    }
    best
}

// Cách 3, hai con trỏ: left là ngày mua, right là ngày bán; gặp giá rẻ hơn thì dời left tới đó.
fn two_pointers(prices: &[i32]) -> i32 {
    let (mut left, mut best) = (0, 0);
    for right in 1..prices.len() {
        if prices[right] < prices[left] {
            left = right;
        } else {
            best = best.max(prices[right] - prices[left]);
        }
    }
    best
}

fn main() {
    let cases: Vec<(Vec<i32>, i32)> = vec![
        (vec![7, 1, 5, 3, 6, 4], 5), (vec![7, 6, 4, 3, 1], 0), (vec![2, 4, 1], 2),
        (vec![1], 0), (vec![3, 3, 3], 0), (vec![2, 1, 2, 1, 0, 1, 2], 2),
    ];
    let fns: [(&str, fn(&[i32]) -> i32); 4] = [
        ("bruteForce", brute_force), ("maxMinusMin", max_minus_min),
        ("runningMin", running_min), ("twoPointers", two_pointers),
    ];
    for (name, f) in fns {
        let bad: Vec<String> = cases.iter().filter(|(p, want)| f(p) != *want)
            .map(|(p, _)| format!("{:?} → {}", p, f(p)).replace(", ", ",")).collect();
        let tail = if bad.is_empty() { String::new() } else { format!("; sai ở {}", bad.join(" ")) };
        println!("{:<12} {}/{} ca đúng{}", name, cases.len() - bad.len(), cases.len(), tail);
    }
}
