// LeetCode 74, Search a 2D Matrix: bốn cách, hai bản sai và test.
// Chạy: rustc --edition 2021 -O search_2d_matrix.rs && ./search_2d_matrix

// Cách 1, quét hết: O(m·n).
fn linear_scan(matrix: &[Vec<i32>], target: i32) -> bool {
    matrix.iter().any(|row| row.contains(&target))
}

// Cách 2, hai lần chia đôi: partition_point đếm số hàng có phần tử đầu ≤ target,
// hàng cần tìm là hàng ngay trước đó; rồi binary_search trong hàng.
fn two_binary_search(matrix: &[Vec<i32>], target: i32) -> bool {
    let rows = matrix.partition_point(|row| row[0] <= target);
    if rows == 0 {
        return false; // target nhỏ hơn mọi phần tử; rows - 1 với usize sẽ panic
    }
    matrix[rows - 1].binary_search(&target).is_ok()
}

// Cách 3, một lần chia đôi trên chỉ số phẳng k ∈ [0, m·n): hàng = k / n, cột = k % n (n là số CỘT).
fn flat_binary_search(matrix: &[Vec<i32>], target: i32) -> bool {
    let (m, n) = (matrix.len(), matrix[0].len());
    let (mut lo, mut hi) = (0usize, m * n);
    while lo < hi {
        let mid = lo + (hi - lo) / 2;
        let x = matrix[mid / n][mid % n]; // usize chia usize là chia nguyên
        if x == target {
            return true;
        }
        if x < target {
            lo = mid + 1;
        } else {
            hi = mid;
        }
    }
    false
}

// Cách 4, bậc thang từ góc trên phải: lớn hơn target thì sang trái, nhỏ hơn thì xuống. O(m + n).
fn staircase(matrix: &[Vec<i32>], target: i32) -> bool {
    let (mut r, mut c) = (0usize, matrix[0].len() as i64 - 1); // c giảm xuống -1, nên không để usize
    while r < matrix.len() && c >= 0 {
        let x = matrix[r][c as usize];
        if x == target {
            return true;
        }
        if x > target { c -= 1 } else { r += 1 }
    }
    false
}

// SAI: lấy hàng đầu tiên có phần tử đầu > target thay vì hàng ngay trước nó.
fn wrong_row_pick(matrix: &[Vec<i32>], target: i32) -> bool {
    let rows = matrix.partition_point(|row| row[0] <= target);
    rows < matrix.len() && matrix[rows].contains(&target)
}

// SAI: chia chỉ số phẳng cho số HÀNG m thay vì số cột n. Đúng khi ma trận vuông, sai khi m ≠ n.
fn wrong_flat_index(matrix: &[Vec<i32>], target: i32) -> bool {
    let m = matrix.len();
    let (mut lo, mut hi) = (0usize, m * matrix[0].len());
    while lo < hi {
        let mid = lo + (hi - lo) / 2;
        // get trả None thay vì panic khi ô không tồn tại
        let x = matrix.get(mid / m).and_then(|row| row.get(mid % m)).copied();
        if x == Some(target) {
            return true;
        }
        match x {
            Some(v) if v < target => lo = mid + 1,
            _ => hi = mid,
        }
    }
    false
}

fn main() {
    let ex = vec![vec![1, 3, 5, 7], vec![10, 11, 16, 20], vec![23, 30, 34, 60]];
    let cases: Vec<(&str, Vec<Vec<i32>>, i32, bool)> = vec![
        ("ví dụ → 3", ex.clone(), 3, true), ("ví dụ → 13", ex.clone(), 13, false),
        ("ví dụ → 60 (cuối)", ex.clone(), 60, true), ("ví dụ → 23 (đầu hàng cuối)", ex.clone(), 23, true),
        ("ví dụ → 0 (nhỏ hơn hết)", ex.clone(), 0, false), ("ví dụ → 61 (lớn hơn hết)", ex.clone(), 61, false),
        ("[[1]] → 1", vec![vec![1]], 1, true), ("[[1]] → 2", vec![vec![1]], 2, false),
        ("một cột [[1],[3]] → 3", vec![vec![1], vec![3]], 3, true),
        ("vuông [[1,2],[3,4]] → 4", vec![vec![1, 2], vec![3, 4]], 4, true),
    ];
    let fns: [(&str, fn(&[Vec<i32>], i32) -> bool); 6] = [
        ("linear_scan", linear_scan), ("two_binary_search", two_binary_search),
        ("flat_binary_search", flat_binary_search), ("staircase", staircase),
        ("wrong_row_pick", wrong_row_pick), ("wrong_flat_index", wrong_flat_index),
    ];
    for (name, f) in fns {
        let bad: Vec<&str> = cases.iter().filter(|(_, m, t, want)| f(m, *t) != *want).map(|c| c.0).collect();
        let extra = if bad.is_empty() { String::new() } else { format!("; sai ở: {}", bad.join(", ")) };
        println!("{:<18} {}/{} ca đúng{}", name, cases.len() - bad.len(), cases.len(), extra);
    }
}
