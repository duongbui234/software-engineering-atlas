// Partition Labels (LeetCode 763): vét cạn từng vết cắt, gộp khoảng [đầu, cuối], tham lam một lượt
// Chạy: rustc --edition 2021 -O labels.rs -o labels && ./labels
use std::time::Instant;

// Vét cạn: vết cắt sau vị trí i an toàn khi không chữ nào nằm ở cả hai bên
fn partition_brute(s: &str, steps: &mut u64) -> Vec<i32> {
    let b = s.as_bytes();
    let n = b.len();
    let mut sizes = Vec::new();
    let mut prev: i64 = -1; // vết cắt an toàn gần nhất
    for i in 0..n {
        let mut left = [false; 26];
        let mut right = [false; 26];
        for j in 0..=i {
            left[(b[j] - b'a') as usize] = true;
        }
        for j in i + 1..n {
            right[(b[j] - b'a') as usize] = true;
        }
        *steps += n as u64;
        let safe = (0..26).all(|c| !(left[c] && right[c]));
        if safe {
            sizes.push((i as i64 - prev) as i32); // cắt ở mọi chỗ an toàn
            prev = i as i64;
        }
    }
    sizes
}

// Gộp khoảng: mỗi chữ là một khoảng [lần đầu, lần cuối]; khoảng chồng nhau phải chung một phần
fn partition_intervals(s: &str) -> Vec<i32> {
    let mut first = [usize::MAX; 26];
    let mut last = [0usize; 26];
    for (i, &ch) in s.as_bytes().iter().enumerate() {
        let c = (ch - b'a') as usize;
        if first[c] == usize::MAX {
            first[c] = i;
        }
        last[c] = i;
    }
    let mut spans: Vec<(usize, usize)> = (0..26).filter(|&c| first[c] != usize::MAX).map(|c| (first[c], last[c])).collect();
    spans.sort();
    let mut sizes = Vec::new();
    let (mut lo, mut hi) = spans[0];
    for &(a, b) in &spans[1..] {
        if a > hi {
            sizes.push((hi - lo + 1) as i32); // khoảng mới không chạm khoảng đang gộp: chốt một phần
            lo = a;
            hi = b;
        } else {
            hi = hi.max(b);
        }
    }
    sizes.push((hi - lo + 1) as i32);
    sizes
}

// Cách chính: bảng lần xuất hiện cuối, kéo end tới lần cuối xa nhất, cắt khi i chạm end
fn partition_labels(s: &str, steps: &mut u64) -> Vec<i32> {
    let b = s.as_bytes(); // &str không đánh chỉ số s[i] được: đi qua byte
    let mut last = [0usize; 26];
    for (i, &ch) in b.iter().enumerate() {
        last[(ch - b'a') as usize] = i;
        *steps += 1;
    }
    let mut sizes = Vec::new();
    let mut start = 0;
    let mut end = 0; // phần hiện tại phải kéo ít nhất tới đây
    for (i, &ch) in b.iter().enumerate() {
        end = end.max(last[(ch - b'a') as usize]);
        *steps += 1;
        if i == end {
            sizes.push((end - start + 1) as i32); // mọi chữ trong phần đã hết: cắt sớm nhất có thể
            start = i + 1;
        }
    }
    sizes
}

// Bản sai: cắt khi chữ hiện tại hết, quên các chữ khác trong phần
fn partition_no_max(s: &str) -> Vec<i32> {
    let b = s.as_bytes();
    let mut last = [0usize; 26];
    for (i, &ch) in b.iter().enumerate() {
        last[(ch - b'a') as usize] = i;
    }
    let mut sizes = Vec::new();
    let mut start = 0;
    for (i, &ch) in b.iter().enumerate() {
        if last[(ch - b'a') as usize] == i {
            sizes.push((i - start + 1) as i32);
            start = i + 1;
        }
    }
    sizes
}

fn walk(s: &mut String, total: &mut u32, good: &mut u32, wrong: &mut u32) {
    if !s.is_empty() {
        *total += 1;
        let mut d = 0;
        let b = partition_brute(s, &mut d);
        if b == partition_intervals(s) && b == partition_labels(s, &mut d) {
            *good += 1;
        }
        if b != partition_no_max(s) {
            *wrong += 1;
        }
    }
    if s.len() == 7 {
        return;
    }
    for ch in ['a', 'b', 'c'] {
        s.push(ch);
        walk(s, total, good, wrong);
        s.pop();
    }
}

fn main() {
    let cases: Vec<(&str, Vec<i32>)> = vec![
        ("a", vec![1]),
        ("abc", vec![1, 1, 1]),
        ("aaaa", vec![4]),
        ("abca", vec![4]),
        ("abbacdc", vec![4, 3]),
        ("xyzzyxw", vec![6, 1]),
        ("aabbccab", vec![8]),
        ("qwqeer", vec![3, 2, 1]),
    ];
    let mut ok = 0;
    let mut d = 0;
    for (s, want) in &cases {
        let got = [partition_brute(s, &mut d), partition_intervals(s), partition_labels(s, &mut d)];
        if got.iter().all(|x| x == want) {
            ok += 1;
        } else {
            println!("sai ở {} {:?}", s, got);
        }
    }
    println!("{}/{} ca đúng", ok, cases.len());

    // Đối chiếu: mọi chuỗi dài 1–7 trên bảng chữ {a, b, c}
    let (mut total, mut good, mut wrong) = (0, 0, 0);
    walk(&mut String::new(), &mut total, &mut good, &mut wrong);
    println!("{}/{} ca đúng (đối chiếu vét cạn)", good, total);
    println!("Cắt khi chữ hiện tại hết (bỏ max): sai {}/{} ca", wrong, total);

    // Đo: n = 10000, 5 khối 2000 ký tự, khối k chỉ dùng 5 chữ của riêng nó
    let n = 10000;
    let big: String = (0..n).map(|i| (b'a' + (5 * (i / 2000) + (i * 3) % 5) as u8) as char).collect();
    let (mut bs, mut gs) = (0u64, 0u64);
    let t0 = Instant::now();
    let b = partition_brute(&big, &mut bs);
    let brute_ms = t0.elapsed().as_secs_f64() * 1000.0;
    let t0 = Instant::now();
    let g = partition_labels(&big, &mut gs);
    let greedy_ms = t0.elapsed().as_secs_f64() * 1000.0;
    println!(
        "n = {}, {} phần ({}): vét cạn {} bước ({:.1} ms), tham lam {} bước ({:.2} ms)",
        n,
        g.len(),
        if b == g { "khớp" } else { "lệch" },
        bs,
        brute_ms,
        gs,
        greedy_ms
    );
}
