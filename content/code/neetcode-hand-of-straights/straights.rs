// Hand of Straights (LeetCode 846, trùng với 1296): trọng tài thử mọi nhóm, lá nhỏ nhất theo từng lá, theo từng giá trị, hàng nhóm đang mở
// Chạy: rustc --edition 2021 -O straights.rs -o straights && ./straights
use std::collections::{BTreeMap, HashMap, VecDeque};
use std::time::Instant;

fn count_of(hand: &[i32]) -> HashMap<i32, i32> {
    let mut count = HashMap::new();
    for &x in hand {
        *count.entry(x).or_insert(0) += 1;
    }
    count
}

// Trọng tài: lấy một lá còn lại bất kỳ (không nhất thiết nhỏ nhất), thử mọi nhóm k lá liên tiếp chứa nó
fn is_straight_brute(hand: &[i32], k: i32) -> bool {
    fn go_from(hand: &[i32], k: i32, count: &mut HashMap<i32, i32>, mut idx: usize) -> bool {
        while idx < hand.len() && count[&hand[idx]] == 0 {
            idx += 1;
        }
        if idx == hand.len() {
            return true; // mọi lá đã vào nhóm
        }
        let x = hand[idx];
        for s in x - k + 1..=x {
            if (s..s + k).any(|v| *count.get(&v).unwrap_or(&0) == 0) {
                continue;
            }
            for v in s..s + k {
                *count.get_mut(&v).unwrap() -= 1;
            }
            if go_from(hand, k, count, idx) {
                return true;
            }
            for v in s..s + k {
                *count.get_mut(&v).unwrap() += 1;
            }
        }
        false
    }
    let mut count = count_of(hand);
    go_from(hand, k, &mut count, 0)
}

// Cách 1, theo từng lá: duyệt lá đã sắp xếp, lá nào còn thì nó là lá nhỏ nhất còn lại và phải mở nhóm x..x+k-1
fn is_n_straight_hand(hand: &[i32], k: i32, steps: &mut u64) -> bool {
    if hand.len() % k as usize != 0 {
        return false; // dừng sớm: không chia đều được
    }
    let mut count = count_of(hand);
    let mut sorted = hand.to_vec(); // hand là &[i32] mượn, muốn sắp phải chép ra Vec
    sorted.sort_unstable();
    for &x in &sorted {
        if count[&x] == 0 {
            continue; // lá này đã nằm trong một nhóm trước
        }
        for v in x..x + k {
            *steps += 1;
            match count.get_mut(&v) {
                Some(c) if *c > 0 => *c -= 1,
                _ => return false, // thiếu lá v để nối nhóm
            }
        }
    }
    true
}

// Cách 2, theo từng giá trị: c lá x cùng mở c nhóm, trừ c khỏi x..x+k-1 trong một lần
fn is_n_straight_by_value(hand: &[i32], k: i32, steps: &mut u64) -> bool {
    if hand.len() % k as usize != 0 {
        return false;
    }
    let mut count = count_of(hand);
    let mut keys: Vec<i32> = count.keys().copied().collect();
    keys.sort_unstable(); // chỉ sắp các giá trị khác nhau
    for x in keys {
        let c = count[&x];
        if c == 0 {
            continue;
        }
        for v in x..x + k {
            *steps += 1;
            match count.get_mut(&v) {
                Some(have) if *have >= c => *have -= c,
                _ => return false, // không đủ lá v cho c nhóm
            }
        }
    }
    true
}

// Cách 3, hàng nhóm đang mở: nhớ số nhóm mở ở mỗi giá trị, nhóm mở từ k giá trị trước thì đóng
fn is_n_straight_open(hand: &[i32], k: i32) -> bool {
    if hand.len() % k as usize != 0 {
        return false;
    }
    let mut count: BTreeMap<i32, i32> = BTreeMap::new(); // duyệt theo khóa tăng dần
    for &x in hand {
        *count.entry(x).or_insert(0) += 1;
    }
    let mut started: VecDeque<i32> = VecDeque::new(); // số nhóm mới mở tại từng giá trị, theo thứ tự
    let mut open = 0; // số nhóm đang chờ lá kế tiếp
    let mut prev = 0;
    for (&x, &c) in &count {
        if open > 0 && x != prev + 1 {
            return false; // nhóm đang mở cần prev+1 mà không có
        }
        if c < open {
            return false; // không đủ lá x để nối mọi nhóm đang mở
        }
        started.push_back(c - open); // phần dư mở nhóm mới tại x
        open = c;
        if started.len() == k as usize {
            open -= started.pop_front().unwrap(); // nhóm mở từ x-k+1 vừa đủ k lá
        }
        prev = x;
    }
    open == 0
}

// Bản sai: bỏ bước sắp xếp, mở nhóm tại lá theo thứ tự đề cho
fn is_n_straight_no_sort(hand: &[i32], k: i32) -> bool {
    if hand.len() % k as usize != 0 {
        return false;
    }
    let mut count = count_of(hand);
    for &x in hand {
        if count[&x] == 0 {
            continue;
        }
        for v in x..x + k {
            match count.get_mut(&v) {
                Some(c) if *c > 0 => *c -= 1,
                _ => return false,
            }
        }
    }
    true
}

fn main() {
    let cases: Vec<(Vec<i32>, i32, bool)> = vec![
        (vec![5, 1, 3, 2, 4, 6], 3, true),
        (vec![1, 1, 2, 2, 3, 3], 3, true),
        (vec![3, 2, 2, 1, 4, 3], 3, true),
        (vec![1, 2, 4, 5, 6, 7], 3, false),
        (vec![7, 8, 9, 10], 3, false),
        (vec![4], 1, true),
        (vec![3, 3, 4, 4, 5, 6], 3, false),
        (vec![12, 10, 11, 13, 11, 12], 3, true),
        (vec![1000000000, 999999998, 999999999], 3, true),
        (vec![0, 1, 2, 3], 2, true),
    ];
    let mut ok = 0;
    let mut dummy = 0u64;
    for (hand, k, want) in &cases {
        let got = [
            is_straight_brute(hand, *k),
            is_n_straight_hand(hand, *k, &mut dummy),
            is_n_straight_by_value(hand, *k, &mut dummy),
            is_n_straight_open(hand, *k),
        ];
        if got.iter().all(|g| g == want) {
            ok += 1;
        } else {
            println!("sai ở {:?} {} {:?}", hand, k, got);
        }
    }
    println!("{}/{} ca đúng", ok, cases.len());

    // Đối chiếu: mọi tay bài với giá trị 0..4, mỗi giá trị 0..3 lá, k = 1..5; lá xếp tăng rồi xoay nửa sau lên trước
    let (mut total, mut good, mut wrong) = (0, 0, 0);
    for mask in 1..1024 {
        let mut sorted = Vec::new();
        let mut m = mask;
        for v in 0..5 {
            for _ in 0..m % 4 {
                sorted.push(v);
            }
            m /= 4;
        }
        let half = sorted.len() / 2;
        let hand: Vec<i32> = sorted[half..].iter().chain(sorted[..half].iter()).copied().collect();
        for k in 1..=5 {
            total += 1;
            let want = is_straight_brute(&hand, k);
            if is_n_straight_hand(&hand, k, &mut dummy) == want
                && is_n_straight_by_value(&hand, k, &mut dummy) == want
                && is_n_straight_open(&hand, k) == want
            {
                good += 1;
            }
            if is_n_straight_no_sort(&hand, k) != want {
                wrong += 1;
            }
        }
    }
    println!("{}/{} ca đúng (đối chiếu trọng tài)", good, total);
    println!("Bỏ sắp xếp: sai {}/{} ca", wrong, total);

    // Đo: n = 200000 lá, 1000 giá trị mỗi giá trị 200 lá, xáo bằng (i * 7919) % 1000, k = 10
    let n = 200000;
    let big: Vec<i32> = (0..n).map(|i: i64| (i * 7919 % 1000) as i32).collect();
    let k_big = 10;
    let mut card_steps = 0u64;
    let t0 = Instant::now();
    let a = is_n_straight_hand(&big, k_big, &mut card_steps);
    let card_ms = t0.elapsed().as_secs_f64() * 1000.0;
    let mut value_steps = 0u64;
    let t0 = Instant::now();
    let b = is_n_straight_by_value(&big, k_big, &mut value_steps);
    let value_ms = t0.elapsed().as_secs_f64() * 1000.0;
    println!(
        "n = {}, k = {}, kết quả {}/{}: theo từng lá {} bước ({:.1} ms), theo từng giá trị {} bước ({:.1} ms)",
        n, k_big, a, b, card_steps, card_ms, value_steps, value_ms
    );
}
