// Maximum Subarray (LeetCode 53): vét O(n³), vét O(n²), chia để trị, tổng tiền tố, Kadane
// Chạy: rustc --edition 2021 -O kadane.rs -o /tmp/kadane && /tmp/kadane        (thêm tham số bench để đo thời gian)
use std::time::Instant;

// Cách chính: Kadane. Tổng đang mang mà âm thì bỏ, bắt đầu lại từ phần tử hiện tại
fn max_sub_array(nums: &[i32]) -> i32 {
    let mut cur = nums[0]; // tổng tốt nhất của đoạn kết thúc tại i
    let mut best = nums[0];
    for &x in &nums[1..] {
        cur = if cur < 0 { x } else { cur + x }; // phần đầu âm chỉ kéo tổng xuống
        best = best.max(cur);
    }
    best
}

// Kadane kèm biên: nhớ chỗ bắt đầu lại, chép biên mỗi khi phá kỷ lục
fn max_sub_array_bounds(nums: &[i32]) -> (i32, usize, usize) {
    let (mut cur, mut best) = (nums[0], nums[0]);
    let (mut start, mut lo, mut hi) = (0, 0, 0);
    for i in 1..nums.len() {
        if cur < 0 {
            cur = nums[i];
            start = i; // đoạn mới bắt đầu tại i
        } else {
            cur += nums[i];
        }
        if cur > best {
            (best, lo, hi) = (cur, start, i);
        }
    }
    (best, lo, hi)
}

// Tổng tiền tố: đoạn i..j có tổng P[j+1] - P[i], nên trừ đi tiền tố nhỏ nhất đứng trước
fn max_sub_array_prefix(nums: &[i32]) -> i32 {
    let (mut prefix, mut min_prefix) = (0, 0); // P[0] = 0: tiền tố rỗng
    let mut best = i32::MIN;
    for &x in nums {
        prefix += x;
        best = best.max(prefix - min_prefix);
        min_prefix = min_prefix.min(prefix);
    }
    best
}

// Chia để trị: đáp án nằm hẳn bên trái, hẳn bên phải, hoặc vắt qua điểm giữa
fn max_sub_array_divide(nums: &[i32]) -> i32 {
    fn solve(nums: &[i32], lo: usize, hi: usize) -> i32 {
        if lo == hi {
            return nums[lo];
        }
        let mid = (lo + hi) / 2;
        let (mut sum, mut left_best) = (0, i32::MIN); // tổng lớn nhất của đoạn kết thúc tại mid
        for i in (lo..=mid).rev() {
            sum += nums[i];
            left_best = left_best.max(sum);
        }
        let (mut sum, mut right_best) = (0, i32::MIN); // tổng lớn nhất của đoạn bắt đầu tại mid + 1
        for i in mid + 1..=hi {
            sum += nums[i];
            right_best = right_best.max(sum);
        }
        solve(nums, lo, mid).max(solve(nums, mid + 1, hi)).max(left_best + right_best)
    }
    solve(nums, 0, nums.len() - 1)
}

// Vét O(n²): cố định điểm đầu i, cộng dồn sang phải
fn max_sub_array_quadratic(nums: &[i32], adds: &mut u64) -> i32 {
    let mut best = i32::MIN;
    for i in 0..nums.len() {
        let mut sum = 0;
        for j in i..nums.len() {
            sum += nums[j];
            *adds += 1;
            best = best.max(sum);
        }
    }
    best
}

// Trọng tài O(n³): cộng lại từ đầu mọi đoạn i..j, không dùng chung dòng nào với các cách trên
fn max_sub_array_cubic(nums: &[i32]) -> i32 {
    let mut best = i32::MIN;
    for i in 0..nums.len() {
        for j in i..nums.len() {
            let mut sum = 0;
            for k in i..=j {
                sum += nums[k];
            }
            best = best.max(sum);
        }
    }
    best
}

// Bản sai: khởi tạo best = 0, coi như được chọn đoạn rỗng
fn max_sub_array_zero_init(nums: &[i32]) -> i32 {
    let (mut cur, mut best) = (0, 0);
    for &x in nums {
        cur = 0.max(cur + x);
        best = best.max(cur);
    }
    best
}

fn check(nums: &[i32], expected: i32) -> bool {
    let (best, lo, hi) = max_sub_array_bounds(nums);
    if lo > hi || hi >= nums.len() {
        return false;
    }
    if best != expected || nums[lo..=hi].iter().sum::<i32>() != best {
        return false;
    }
    let mut adds = 0;
    let answers = [
        max_sub_array(nums),
        max_sub_array_prefix(nums),
        max_sub_array_divide(nums),
        max_sub_array_quadratic(nums, &mut adds),
        max_sub_array_cubic(nums),
    ];
    answers.iter().all(|&a| a == expected)
}

// Sinh số giả ngẫu nhiên MINSTD, để bảy ngôn ngữ cùng sinh một dãy
struct Rng(u64);
impl Rng {
    fn next(&mut self) -> i32 {
        self.0 = self.0 * 48271 % 2147483647;
        self.0 as i32
    }
}

fn timed(f: &dyn Fn() -> i32, reps: u32) -> String {
    let t = Instant::now();
    for _ in 0..reps {
        std::hint::black_box(f()); // giữ kết quả để trình biên dịch không bỏ vòng lặp
    }
    format!("{:.3}", t.elapsed().as_secs_f64() * 1000.0 / reps as f64)
}

fn main() {
    let cases: Vec<(Vec<i32>, i32)> = vec![
        (vec![7], 7),
        (vec![-4], -4),
        (vec![-3, -1, -2], -1),
        (vec![0, 0, 0], 0),
        (vec![3, -2, 5, -1], 6),
        (vec![2, -8, 3, -2, 4, -10], 5),
        (vec![-1, 6, -7, 5, 3, -2], 8),
        (vec![10000, 10000, -1, 10000], 29999),
        (vec![-10000, -10000, -10000], -10000),
    ];
    let mut ok = 0;
    for (nums, expected) in &cases {
        if check(nums, *expected) {
            ok += 1;
        } else {
            println!("sai ở {:?}", nums);
        }
    }
    println!("{}/{} ca đúng", ok, cases.len());

    // Đối chiếu: 3000 mảng ngẫu nhiên dài 1–12, giá trị −10..10, so với trọng tài O(n³)
    let mut rng = Rng(2026);
    let (mut good, rounds) = (0, 3000);
    for _ in 0..rounds {
        let n = 1 + rng.next() % 12;
        let nums: Vec<i32> = (0..n).map(|_| rng.next() % 21 - 10).collect();
        if check(&nums, max_sub_array_cubic(&nums)) {
            good += 1;
        }
    }
    println!("{}/{} ca đúng (đối chiếu vét O(n³))", good, rounds);

    let neg = [-3, -1, -2];
    println!("Khởi tạo best = 0 với [-3,-1,-2]: ra {}, đúng là {}", max_sub_array_zero_init(&neg), max_sub_array(&neg));

    // Phép đo: n = 10000, giá trị −10000..10000
    let big: Vec<i32> = (0..10000).map(|_| rng.next() % 20001 - 10000).collect();
    let mut adds = 0;
    let slow = max_sub_array_quadratic(&big, &mut adds);
    let fast = max_sub_array(&big);
    let same = if slow == fast { fast.to_string() } else { "KHÁC NHAU".to_string() };
    println!("n = {}: O(n²) cộng {} lần, Kadane {} lần, cùng ra {}", big.len(), adds, big.len(), same);

    if std::env::args().any(|a| a == "bench") {
        // chạy cách nhanh nhiều lượt rồi chia, vì một lượt Kadane ngắn hơn độ phân giải của đồng hồ
        let b = std::hint::black_box(&big);
        println!(
            "thời gian mỗi lượt: O(n²) {} ms, chia để trị {} ms, Kadane {} ms",
            timed(&|| max_sub_array_quadratic(std::hint::black_box(b), &mut 0), 3),
            timed(&|| max_sub_array_divide(std::hint::black_box(b)), 100),
            timed(&|| max_sub_array(std::hint::black_box(b)), 1000)
        );
    }
}
