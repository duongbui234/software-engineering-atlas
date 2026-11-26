// LeetCode 33, Search in Rotated Sorted Array: ba cách, một bản sai, kiểm toàn bộ ca nhỏ và bản có số trùng (81).
// Chạy: rustc --edition 2021 -O search_rotated.rs && ./search_rotated

fn linear_scan(nums: &[i32], target: i32) -> i32 {
    nums.iter().position(|&x| x == target).map_or(-1, |i| i as i32) // O(n)
}

// Cách một lượt: ở mỗi bước, ít nhất một nửa [lo, mid] hoặc [mid, hi] đã sắp xếp.
// Khoảng đóng cần hi = mid - 1 có thể xuống -1, nên chỉ số giữ ở i64.
fn one_pass(nums: &[i32], target: i32) -> i32 {
    let (mut lo, mut hi) = (0i64, nums.len() as i64 - 1);
    while lo <= hi {
        let mid = lo + (hi - lo) / 2;
        let (l, m, h) = (nums[lo as usize], nums[mid as usize], nums[hi as usize]);
        if m == target {
            return mid as i32;
        }
        if l <= m {
            // nửa trái [lo, mid] tăng dần (dấu = cần cho ca lo == mid)
            if l <= target && target < m { hi = mid - 1 } else { lo = mid + 1 }
        } else {
            // nửa phải [mid, hi] tăng dần
            if m < target && target <= h { lo = mid + 1 } else { hi = mid - 1 }
        }
    }
    -1
}

// Cách hai lượt: tìm điểm gãy (chỉ số của min, như bài 153), rồi binary_search trên nửa chứa target.
fn pivot_then_search(nums: &[i32], target: i32) -> i32 {
    let (mut lo, mut hi) = (0, nums.len() - 1);
    while lo < hi {
        let mid = lo + (hi - lo) / 2;
        if nums[mid] > nums[hi] { lo = mid + 1 } else { hi = mid }
    }
    let pivot = lo; // nums[pivot..] và nums[..pivot] đều tăng dần
    // Cắt slice thay vì truyền hai đầu: nửa trái là nums[..pivot], rỗng khi pivot = 0.
    let (offset, half) = if target >= nums[pivot] && target <= nums[nums.len() - 1] {
        (pivot, &nums[pivot..])
    } else {
        (0, &nums[..pivot])
    };
    match half.binary_search(&target) {
        Ok(i) => (offset + i) as i32, // chỉ số trong slice con phải cộng lại offset
        Err(_) => -1,
    }
}

// SAI: dùng < thay cho <= khi kiểm nửa trái. Khi lo == mid (còn hai phần tử), nó tưởng nửa phải đã sắp xếp.
fn wrong_strict(nums: &[i32], target: i32) -> i32 {
    let (mut lo, mut hi) = (0i64, nums.len() as i64 - 1);
    while lo <= hi {
        let mid = lo + (hi - lo) / 2;
        let (l, m, h) = (nums[lo as usize], nums[mid as usize], nums[hi as usize]);
        if m == target {
            return mid as i32;
        }
        if l < m {
            if l <= target && target < m { hi = mid - 1 } else { lo = mid + 1 }
        } else if m < target && target <= h {
            lo = mid + 1
        } else {
            hi = mid - 1
        }
    }
    -1
}

// LeetCode 81 (có số trùng): nums[lo] == nums[mid] == nums[hi] thì chỉ thu hẹp hai đầu được. Trả số bước.
fn search_with_duplicates_steps(nums: &[i32], target: i32) -> usize {
    let (mut lo, mut hi, mut steps) = (0i64, nums.len() as i64 - 1, 0);
    while lo <= hi {
        steps += 1;
        let mid = lo + (hi - lo) / 2;
        let (l, m, h) = (nums[lo as usize], nums[mid as usize], nums[hi as usize]);
        if m == target {
            return steps;
        }
        if l == m && m == h {
            lo += 1;
            hi -= 1;
        } else if l <= m {
            if l <= target && target < m { hi = mid - 1 } else { lo = mid + 1 }
        } else if m < target && target <= h {
            lo = mid + 1
        } else {
            hi = mid - 1
        }
    }
    steps
}

fn main() {
    let cases: Vec<(Vec<i32>, i32, i32)> = vec![
        (vec![4, 5, 6, 7, 0, 1, 2], 0, 4), (vec![4, 5, 6, 7, 0, 1, 2], 3, -1), (vec![1], 0, -1), (vec![1], 1, 0),
        (vec![3, 1], 1, 1), (vec![5, 1, 3], 3, 2), (vec![1, 3], 3, 1), (vec![6, 7, 1, 2, 3, 4, 5], 6, 0),
        (vec![1, 2, 3, 4, 5], 4, 3),
    ];
    let fns: [(&str, fn(&[i32], i32) -> i32); 4] = [
        ("linear_scan", linear_scan), ("one_pass", one_pass),
        ("pivot_then_search", pivot_then_search), ("wrong_strict", wrong_strict),
    ];
    for (name, f) in fns {
        let bad: Vec<String> = cases
            .iter()
            .filter(|(n, t, w)| f(n, *t) != *w)
            .map(|(n, t, _)| format!("{:?} t={} → {}", n, t, f(n, *t)))
            .collect();
        let extra = if bad.is_empty() { String::new() } else { format!("; sai ở {}", bad.join(" ")) };
        println!("{:<17} {}/{} ca đúng{}", name, cases.len() - bad.len(), cases.len(), extra);
    }

    // Kiểm ngẫu nhiên: mọi mảng xoay của 0..n-1 với n ≤ 12, mọi target trong -1..n.
    let (mut mismatches, mut wrong_mismatches, mut checked) = (0, 0, 0);
    for n in 1..=12usize {
        for k in 0..n {
            let a: Vec<i32> = (0..n).map(|i| ((i + k) % n) as i32).collect();
            for t in -1..=n as i32 {
                checked += 1;
                let want = linear_scan(&a, t);
                if one_pass(&a, t) != want || pivot_then_search(&a, t) != want {
                    mismatches += 1;
                }
                if wrong_strict(&a, t) != want {
                    wrong_mismatches += 1;
                }
            }
        }
    }
    println!(
        "\nđối chiếu với position: {} bộ (mảng, target), {} bộ lệch; bản sai wrong_strict lệch {} bộ",
        checked, mismatches, wrong_mismatches
    );

    println!("\nLeetCode 81, số bước khi target không có");
    for n in [1_000usize, 10_000, 100_000] {
        let mut same = vec![1; n];
        same[n * 9 / 10] = 0;
        let k = n * 37 / 100;
        let distinct: Vec<i32> = (0..n).map(|i| ((i + k) % n) as i32).collect();
        println!(
            "n = {:<7} toàn số 1 trừ một số 0: {:>6} bước;  không trùng: {} bước",
            n, search_with_duplicates_steps(&same, 2), search_with_duplicates_steps(&distinct, -1)
        );
    }
}
