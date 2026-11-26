// LeetCode 704, Binary Search: tìm tuyến tính, hai quy ước khoảng, cận dưới, thư viện chuẩn và hai bản sai.
// Chạy: rustc --edition 2021 -O binary_search.rs && ./binary_search

fn linear_scan(nums: &[i32], target: i32) -> i32 {
    nums.iter().position(|&x| x == target).map_or(-1, |i| i as i32)
}

// Khoảng đóng [lo, hi]. Chỉ số kiểu usize không âm được, nên giữ hi = "một sau ô cuối" (lo..hi)
// hoặc dùng i64. Ở đây dùng i64 để giữ đúng dáng khoảng đóng.
fn closed_interval(nums: &[i32], target: i32) -> i32 {
    let (mut lo, mut hi) = (0i64, nums.len() as i64 - 1); // usize: 0 - 1 làm chương trình panic
    while lo <= hi {
        let mid = lo + (hi - lo) / 2;
        let v = nums[mid as usize];
        if v == target {
            return mid as i32;
        }
        if v < target {
            lo = mid + 1;
        } else {
            hi = mid - 1;
        }
    }
    -1
}

// Khoảng nửa mở [lo, hi): hợp với usize, vì hi không bao giờ phải xuống dưới 0.
fn half_open(nums: &[i32], target: i32) -> i32 {
    let (mut lo, mut hi) = (0usize, nums.len());
    while lo < hi {
        let mid = lo + (hi - lo) / 2;
        match nums[mid].cmp(&target) {
            std::cmp::Ordering::Equal => return mid as i32,
            std::cmp::Ordering::Less => lo = mid + 1,
            std::cmp::Ordering::Greater => hi = mid,
        }
    }
    -1
}

// Thư viện chuẩn: binary_search trả Ok(vị trí) hoặc Err(vị trí chèn); partition_point là cận dưới.
fn via_std(nums: &[i32], target: i32) -> i32 {
    match nums.binary_search(&target) {
        Ok(i) => i as i32,
        Err(_) => -1,
    }
}

fn via_partition_point(nums: &[i32], target: i32) -> i32 {
    let i = nums.partition_point(|&x| x < target); // vị trí đầu tiên có nums[i] >= target
    if i < nums.len() && nums[i] == target { i as i32 } else { -1 }
}

// SAI 1: khoảng đóng nhưng điều kiện lặp là lo < hi.
fn wrong_loop_condition(nums: &[i32], target: i32) -> i32 {
    let (mut lo, mut hi) = (0i64, nums.len() as i64 - 1);
    while lo < hi {
        let mid = lo + (hi - lo) / 2;
        let v = nums[mid as usize];
        if v == target {
            return mid as i32;
        }
        if v < target { lo = mid + 1 } else { hi = mid - 1 }
    }
    -1
}

// SAI 2: lo = mid thay vì mid + 1: lặp mãi khi hi = lo + 1. Có giới hạn số vòng.
fn wrong_lo_equals_mid(nums: &[i32], target: i32) -> Result<i32, String> {
    let (mut lo, mut hi, mut steps) = (0i64, nums.len() as i64 - 1, 0);
    while lo <= hi {
        steps += 1;
        if steps > 1000 {
            return Err("lặp mãi".to_string());
        }
        let mid = lo + (hi - lo) / 2;
        let v = nums[mid as usize];
        if v == target {
            return Ok(mid as i32);
        }
        if v < target { lo = mid } else { hi = mid - 1 }
    }
    Ok(-1)
}

fn main() {
    let cases: Vec<(Vec<i32>, i32, i32)> = vec![
        (vec![-1, 0, 3, 5, 9, 12], 9, 4), (vec![-1, 0, 3, 5, 9, 12], 2, -1), (vec![5], 5, 0), (vec![5], 7, -1),
        (vec![1, 3], 3, 1), (vec![1, 3], 0, -1), (vec![1, 3, 5, 7, 9, 11, 13], 13, 6), (vec![1, 3, 5, 7, 9, 11, 13], 1, 0),
    ];
    let fns: Vec<(&str, Box<dyn Fn(&[i32], i32) -> Result<i32, String>>)> = vec![
        ("linear_scan", Box::new(|n, t| Ok(linear_scan(n, t)))),
        ("closed_interval", Box::new(|n, t| Ok(closed_interval(n, t)))),
        ("half_open", Box::new(|n, t| Ok(half_open(n, t)))),
        ("via_std", Box::new(|n, t| Ok(via_std(n, t)))),
        ("via_partition_point", Box::new(|n, t| Ok(via_partition_point(n, t)))),
        ("wrong_loop_condition", Box::new(|n, t| Ok(wrong_loop_condition(n, t)))),
        ("wrong_lo_equals_mid", Box::new(wrong_lo_equals_mid)),
    ];
    for (name, f) in &fns {
        let mut bad = vec![];
        for (nums, t, want) in &cases {
            let got = match f(nums, *t) {
                Ok(v) => v.to_string(),
                Err(e) => e,
            };
            if got != want.to_string() {
                bad.push(format!("{:?} t={} → {}", nums, t, got));
            }
        }
        let extra = if bad.is_empty() { String::new() } else { format!("; sai ở {}", bad.join(", ")) };
        println!("{:<20} {}/{} ca đúng{}", name, cases.len() - bad.len(), cases.len(), extra);
    }

    // i32 tràn: bản debug panic, bản -O cuộn vòng im lặng. wrapping_add cho thấy cuộn vòng ra số âm.
    let (lo, hi) = (1_500_000_000i32, 2_000_000_000i32);
    println!("\nlo = {}, hi = {}", lo, hi);
    println!("lo.wrapping_add(hi) / 2 = {}", lo.wrapping_add(hi) / 2);
    println!("lo + (hi - lo) / 2      = {}", lo + (hi - lo) / 2);
    println!("lo.checked_add(hi)      = {:?}", lo.checked_add(hi));
    println!("[1, 3, 5].binary_search(&4) = {:?}", [1, 3, 5].binary_search(&4));
}
