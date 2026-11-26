// LeetCode 4, Median of Two Sorted Arrays: bốn cách, một bản sai chia nguyên, test và đối chiếu ngẫu nhiên.
// Chạy: rustc --edition 2021 -O median_two_arrays.rs && ./median_two_arrays

// Cách 1, trộn rồi lấy giữa: O(m + n) thời gian, O(m + n) bộ nhớ.
fn merge_then_pick(a: &[i32], b: &[i32]) -> f64 {
    let mut all = Vec::with_capacity(a.len() + b.len());
    let (mut i, mut j) = (0, 0);
    while i < a.len() || j < b.len() {
        if j == b.len() || (i < a.len() && a[i] <= b[j]) {
            all.push(a[i]);
            i += 1;
        } else {
            all.push(b[j]);
            j += 1;
        }
    }
    let t = all.len();
    if t % 2 == 1 { all[t / 2] as f64 } else { (all[t / 2 - 1] as f64 + all[t / 2] as f64) / 2.0 }
}

// Cách 2, hai con trỏ không trộn: chỉ nhớ hai giá trị gần nhất. O(m + n) thời gian, O(1) bộ nhớ.
fn two_pointer(a: &[i32], b: &[i32]) -> f64 {
    let t = a.len() + b.len();
    let (mut i, mut j, mut prev, mut cur) = (0, 0, 0, 0);
    for _ in 0..=t / 2 {
        prev = cur;
        if j == b.len() || (i < a.len() && a[i] <= b[j]) {
            cur = a[i];
            i += 1;
        } else {
            cur = b[j];
            j += 1;
        }
    }
    if t % 2 == 1 { cur as f64 } else { (prev as f64 + cur as f64) / 2.0 }
}

// Cách 3, loại bỏ để tìm phần tử thứ k (k đếm từ 1). O(log(m + n)).
// Slice làm việc này gọn: bỏ phần đầu bằng cách cắt a = &a[h..], không cần giữ chỉ số i, j.
fn kth(mut a: &[i32], mut b: &[i32], mut k: usize) -> i32 {
    loop {
        if a.is_empty() {
            return b[k - 1];
        }
        if b.is_empty() {
            return a[k - 1];
        }
        if k == 1 {
            return a[0].min(b[0]);
        }
        let (ha, hb) = ((k / 2).min(a.len()), (k / 2).min(b.len()));
        if a[ha - 1] <= b[hb - 1] {
            k -= ha; // a[..ha] đều đứng trước phần tử thứ k: bỏ
            a = &a[ha..];
        } else {
            k -= hb;
            b = &b[hb..];
        }
    }
}

fn kth_elimination(a: &[i32], b: &[i32]) -> f64 {
    let t = a.len() + b.len();
    if t % 2 == 1 { kth(a, b, t / 2 + 1) as f64 } else { (kth(a, b, t / 2) as f64 + kth(a, b, t / 2 + 1) as f64) / 2.0 }
}

// Cách 4, chia đôi vị trí cắt trên mảng ngắn hơn: O(log min(m, n)).
// Cắt a ở i và b ở j = half − i; cắt đúng khi aL ≤ bR và bL ≤ aR. Phần tử canh là i64::MIN / i64::MAX.
fn partition(a: &[i32], b: &[i32]) -> f64 {
    let (a, b) = if a.len() > b.len() { (b, a) } else { (a, b) }; // đổi hai tham chiếu, không chép mảng
    let (m, n) = (a.len(), b.len());
    let half = (m + n + 1) / 2;
    let (mut lo, mut hi) = (0, m);
    loop {
        let i = (lo + hi) / 2;
        let j = half - i; // usize: không âm được vì m ≤ n bảo đảm half ≥ i
        let a_l = if i > 0 { a[i - 1] as i64 } else { i64::MIN };
        let a_r = if i < m { a[i] as i64 } else { i64::MAX };
        let b_l = if j > 0 { b[j - 1] as i64 } else { i64::MIN };
        let b_r = if j < n { b[j] as i64 } else { i64::MAX };
        if a_l <= b_r && b_l <= a_r {
            let left = a_l.max(b_l) as f64;
            return if (m + n) % 2 == 1 { left } else { (left + a_r.min(b_r) as f64) / 2.0 };
        }
        if a_l > b_r { hi = i - 1 } else { lo = i + 1 }
    }
}

// SAI: chia nguyên khi tổng chẵn: (-3) / 2 = -1 trong Rust (cắt về 0), mất phần .5.
fn partition_int_median(a: &[i32], b: &[i32]) -> f64 {
    let (a, b) = if a.len() > b.len() { (b, a) } else { (a, b) };
    let (m, n) = (a.len(), b.len());
    let half = (m + n + 1) / 2;
    let (mut lo, mut hi) = (0, m);
    loop {
        let i = (lo + hi) / 2;
        let j = half - i;
        let a_l = if i > 0 { a[i - 1] as i64 } else { i64::MIN };
        let a_r = if i < m { a[i] as i64 } else { i64::MAX };
        let b_l = if j > 0 { b[j - 1] as i64 } else { i64::MIN };
        let b_r = if j < n { b[j] as i64 } else { i64::MAX };
        if a_l <= b_r && b_l <= a_r {
            let left = a_l.max(b_l);
            return if (m + n) % 2 == 1 { left as f64 } else { ((left + a_r.min(b_r)) / 2) as f64 };
        }
        if a_l > b_r { hi = i - 1 } else { lo = i + 1 }
    }
}

fn brute_force(a: &[i32], b: &[i32]) -> f64 {
    let mut all: Vec<i32> = a.iter().chain(b).copied().collect();
    all.sort_unstable();
    let t = all.len();
    if t % 2 == 1 { all[t / 2] as f64 } else { (all[t / 2 - 1] as f64 + all[t / 2] as f64) / 2.0 }
}

fn sorted_random(rnd: &mut impl FnMut(u64) -> u64, len: u64) -> Vec<i32> {
    let mut v: Vec<i32> = (0..len).map(|_| rnd(101) as i32 - 50).collect();
    v.sort_unstable();
    v
}

fn main() {
    let cases: Vec<(Vec<i32>, Vec<i32>, f64)> = vec![
        (vec![1, 3], vec![2], 2.0), (vec![1, 2], vec![3, 4], 2.5), (vec![], vec![1], 1.0), (vec![2], vec![], 2.0),
        (vec![], vec![2, 3], 2.5), (vec![-5, -3, -1], vec![-4, -2], -3.0), (vec![1, 1, 1], vec![1, 1], 1.0),
        (vec![1, 2, 3, 4, 5], vec![6, 7, 8, 9, 10, 11], 6.0), (vec![1, 2, 3, 4, 5, 6], vec![7], 4.0),
        (vec![-2, -1], vec![3], -1.0),
    ];
    let fns: [(&str, fn(&[i32], &[i32]) -> f64); 5] = [
        ("merge_then_pick", merge_then_pick), ("two_pointer", two_pointer), ("kth_elimination", kth_elimination),
        ("partition", partition), ("partition_int_median", partition_int_median),
    ];
    for (name, f) in fns {
        let bad: Vec<String> = cases
            .iter()
            .filter(|(a, b, want)| f(a, b) != *want)
            .map(|(a, b, _)| format!("{:?} {:?} → {}", a, b, f(a, b)))
            .collect();
        let extra = if bad.is_empty() { String::new() } else { format!("; sai ở {}", bad.join(", ")) };
        println!("{:<21} {}/{} ca đúng{}", name, cases.len() - bad.len(), cases.len(), extra);
    }

    // Đối chiếu ngẫu nhiên với nối rồi sort: 10⁵ cặp, mỗi mảng 0..20 phần tử, giá trị trong [-50, 50].
    let mut s: u64 = 42;
    let mut rnd = |m: u64| {
        s ^= s << 13;
        s ^= s >> 7;
        s ^= s << 17;
        s % m
    };
    let mut wrong = [0; 5];
    const PAIRS: usize = 100_000;
    for _ in 0..PAIRS {
        let la = rnd(21);
        let mut a = sorted_random(&mut rnd, la);
        let lb = rnd(21);
        let b = sorted_random(&mut rnd, lb);
        if a.is_empty() && b.is_empty() {
            a = vec![0];
        }
        let want = brute_force(&a, &b);
        for (k, (_, f)) in fns.iter().enumerate() {
            if f(&a, &b) != want {
                wrong[k] += 1;
            }
        }
    }
    println!("\nĐối chiếu với nối rồi sort, {} cặp ngẫu nhiên:", PAIRS);
    for (k, (name, _)) in fns.iter().enumerate() {
        println!("{:<21} sai {} cặp", name, wrong[k]);
    }
    println!("\n(-3) / 2 = {}   (-3).div_euclid(2) = {}   -3.0 / 2.0 = {}", -3 / 2, (-3i32).div_euclid(2), -3.0 / 2.0);
}
