// LeetCode 153, Find Minimum in Rotated Sorted Array: ba cách, hai bản sai và bản có số trùng (154).
// Chạy: rustc --edition 2021 -O find_min_rotated.rs && ./find_min_rotated

// Cách 1, quét tuyến tính: O(n).
fn linear_scan(nums: &[i32]) -> i32 {
    *nums.iter().min().unwrap()
}

// Cách 2, chia đôi so với nums[hi]. Bất biến: phần tử nhỏ nhất luôn nằm trong [lo, hi].
fn binary_vs_hi(nums: &[i32]) -> i32 {
    let (mut lo, mut hi) = (0, nums.len() - 1);
    while lo < hi {
        let mid = lo + (hi - lo) / 2;
        if nums[mid] > nums[hi] {
            lo = mid + 1; // min nằm hẳn bên phải mid
        } else {
            hi = mid; // đoạn [mid, hi] tăng dần: min là mid hoặc ở bên trái
        }
    }
    nums[lo]
}

// Cách 3, tìm điểm gãy: partition_point trả vị trí đầu tiên nhỏ hơn nums[0]
// (vị từ "x >= nums[0]" đúng ở nửa đầu, sai ở nửa sau).
fn binary_vs_first(nums: &[i32]) -> i32 {
    if nums[0] <= nums[nums.len() - 1] {
        return nums[0]; // không xoay: min ở đầu
    }
    nums[nums.partition_point(|&x| x >= nums[0])]
}

// SAI: so với nums[lo] mà không kiểm ca không xoay.
fn wrong_vs_lo(nums: &[i32]) -> Result<i32, String> {
    let (mut lo, mut hi) = (0, nums.len() - 1);
    while lo < hi {
        let mid = lo + (hi - lo) / 2;
        if nums[mid] >= nums[lo] { lo = mid + 1 } else { hi = mid }
    }
    Ok(nums[lo])
}

// SAI: lo <= hi với hi = mid: khi lo == hi thì không bao giờ dừng. Có giới hạn bước để báo lỗi.
fn wrong_loop_condition(nums: &[i32]) -> Result<i32, String> {
    let (mut lo, mut hi, mut steps) = (0, nums.len() - 1, 0);
    while lo <= hi {
        steps += 1;
        if steps > 100 {
            return Err("lặp vô hạn".into());
        }
        let mid = lo + (hi - lo) / 2;
        if nums[mid] > nums[hi] { lo = mid + 1 } else { hi = mid }
    }
    Ok(nums[lo])
}

// LeetCode 154 (có số trùng): nums[mid] == nums[hi] thì chỉ bỏ được hi. Trả (min, số bước).
fn binary_with_duplicates(nums: &[i32]) -> (i32, usize) {
    let (mut lo, mut hi, mut steps) = (0, nums.len() - 1, 0);
    while lo < hi {
        steps += 1;
        let mid = lo + (hi - lo) / 2;
        match nums[mid].cmp(&nums[hi]) {
            std::cmp::Ordering::Greater => lo = mid + 1,
            std::cmp::Ordering::Less => hi = mid,
            std::cmp::Ordering::Equal => hi -= 1,
        }
    }
    (nums[lo], steps)
}

fn main() {
    let cases: Vec<(Vec<i32>, i32)> = vec![
        (vec![3, 4, 5, 1, 2], 1), (vec![4, 5, 6, 7, 0, 1, 2], 0), (vec![11, 13, 15, 17], 11), (vec![1], 1),
        (vec![2, 1], 1), (vec![1, 2], 1), (vec![5, 1, 2, 3, 4], 1), (vec![2, 3, 4, 5, 1], 1),
    ];
    let fns: [(&str, fn(&[i32]) -> Result<i32, String>); 5] = [
        ("linear_scan", |n| Ok(linear_scan(n))),
        ("binary_vs_hi", |n| Ok(binary_vs_hi(n))),
        ("binary_vs_first", |n| Ok(binary_vs_first(n))),
        ("wrong_vs_lo", wrong_vs_lo),
        ("wrong_loop_condition", wrong_loop_condition),
    ];
    for (name, f) in fns {
        let mut bad = vec![];
        for (nums, want) in &cases {
            let got = match f(nums) {
                Ok(v) => v.to_string(),
                Err(e) => e,
            };
            if got != want.to_string() {
                bad.push(format!("{:?} → {}", nums, got));
            }
        }
        let extra = if bad.is_empty() { String::new() } else { format!("; sai ở {}", bad.join(" ")) };
        println!("{:<20} {}/{} ca đúng{}", name, cases.len() - bad.len(), cases.len(), extra);
    }

    println!("\nLeetCode 154, số bước vòng lặp");
    for n in [1_000usize, 10_000, 100_000] {
        let mut all_same = vec![1; n];
        all_same[n * 9 / 10] = 0;
        let k = n * 37 / 100;
        let distinct: Vec<i32> = (0..n).map(|i| ((i + k) % n) as i32).collect();
        println!(
            "n = {:<7} một số khác giữa toàn số 1: {:>6} bước;  không trùng: {} bước",
            n, binary_with_duplicates(&all_same).1, binary_with_duplicates(&distinct).1
        );
    }
}
