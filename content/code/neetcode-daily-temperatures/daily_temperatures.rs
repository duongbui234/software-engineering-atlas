// LeetCode 739, Daily Temperatures: ba cách, một bản sai, test và đo.
// Chạy: rustc --edition 2021 -O daily_temperatures.rs -o daily_temperatures && ./daily_temperatures
use std::time::Instant;

fn brute_force(t: &[i32]) -> Vec<i32> {
    let mut out = vec![0; t.len()];
    for i in 0..t.len() {
        for j in i + 1..t.len() {
            if t[j] > t[i] {
                out[i] = (j - i) as i32;
                break;
            }
        }
    }
    out
}

// Cách 2, ngăn xếp đơn điệu: Vec<usize> giữ CHỈ SỐ, nhiệt độ giảm dần từ đáy lên đỉnh.
fn monotonic_stack(t: &[i32]) -> Vec<i32> {
    let mut out = vec![0; t.len()];
    let mut stack: Vec<usize> = Vec::with_capacity(t.len());
    for (i, &x) in t.iter().enumerate() {
        while let Some(&j) = stack.last() {
            // last() trả Option: ngăn xếp rỗng là None, không có chỉ số âm để đọc nhầm
            if x <= t[j] {
                break;
            }
            stack.pop();
            out[j] = (i - j) as i32;
        }
        stack.push(i);
    }
    out
}

// Cách 3, đi từ phải và nhảy theo đáp án: không cần ngăn xếp.
fn jump_from_right(t: &[i32]) -> Vec<i32> {
    let n = t.len();
    let mut out = vec![0; n];
    // n - 2 trên usize tràn khi n = 1; saturating_sub(1) cho khoảng rỗng thay vì panic.
    for i in (0..n.saturating_sub(1)).rev() {
        let mut j = i + 1;
        while j < n && t[j] <= t[i] {
            if out[j] == 0 {
                j = n; // j không có ngày ấm hơn, nên i cũng không
                break;
            }
            j += out[j] as usize; // nhảy thẳng tới ngày ấm hơn j
        }
        if j < n {
            out[i] = (j - i) as i32;
        }
    }
    out
}

// SAI: lấy ra cả khi bằng nhiệt độ (>=).
fn pop_on_equal(t: &[i32]) -> Vec<i32> {
    let mut out = vec![0; t.len()];
    let mut stack: Vec<usize> = Vec::new();
    for (i, &x) in t.iter().enumerate() {
        while let Some(&j) = stack.last() {
            if x < t[j] {
                break;
            }
            stack.pop();
            out[j] = (i - j) as i32;
        }
        stack.push(i);
    }
    out
}

fn main() {
    let cases: Vec<(Vec<i32>, Vec<i32>)> = vec![
        (vec![73, 74, 75, 71, 69, 72, 76, 73], vec![1, 1, 4, 2, 1, 1, 0, 0]),
        (vec![30, 40, 50, 60], vec![1, 1, 1, 0]),
        (vec![30, 60, 90], vec![1, 1, 0]),
        (vec![90, 80, 70], vec![0, 0, 0]),
        (vec![70, 70, 71], vec![2, 1, 0]),
        (vec![50], vec![0]),
        (vec![55, 38, 53, 81, 61, 93, 97, 32, 43, 78], vec![3, 1, 1, 2, 1, 1, 0, 1, 1, 0]),
    ];
    let fns: [(&str, fn(&[i32]) -> Vec<i32>); 4] = [
        ("brute_force", brute_force),
        ("monotonic_stack", monotonic_stack),
        ("jump_from_right", jump_from_right),
        ("pop_on_equal", pop_on_equal),
    ];
    for (name, f) in fns {
        let bad: Vec<String> = cases
            .iter()
            .filter_map(|(t, want)| {
                let got = f(t);
                (got != *want).then(|| format!("{:?} → {:?}", t, got))
            })
            .collect();
        let tail = if bad.is_empty() { String::new() } else { format!("; sai ở {}", bad.join(", ")) };
        println!("{:<16} {}/{} ca đúng{}", name, cases.len() - bad.len(), cases.len(), tail);
    }

    // Đo ở n = 10^6, dữ liệu giảm dần: ngăn xếp dài nhất.
    let n = 1_000_000usize;
    let t: Vec<i32> = (0..n).map(|i| 100 - (70 * i / n) as i32).collect();
    print!("\nn = 1000000 giảm dần (ms, trung vị 3 lần):");
    let timed: [(&str, fn(&[i32]) -> Vec<i32>); 2] = [("monotonic_stack", monotonic_stack), ("jump_from_right", jump_from_right)];
    for (name, f) in timed {
        let mut ms: Vec<f64> = (0..3)
            .map(|_| {
                let s = Instant::now();
                std::hint::black_box(f(&t));
                s.elapsed().as_secs_f64() * 1000.0
            })
            .collect();
        ms.sort_by(|a, b| a.partial_cmp(b).unwrap());
        print!(" {} {:.2}", name, ms[1]);
    }
    println!();
}
