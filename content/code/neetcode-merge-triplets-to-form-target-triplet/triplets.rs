// Merge Triplets to Form Target Triplet (LeetCode 1899): vét cạn mọi tập con, lọc bộ an toàn, max của bộ an toàn
// Chạy: rustc --edition 2021 -O triplets.rs -o triplets && ./triplets
use std::time::Instant;

// Vét cạn: thử mọi tập con khác rỗng, gộp bằng max từng thành phần, xem có ra đúng target không
fn merge_triplets_brute(triplets: &[[i32; 3]], target: &[i32; 3], steps: &mut u64) -> bool {
    let n = triplets.len();
    for mask in 1usize..(1usize << n) {
        let (mut a, mut b, mut c) = (0, 0, 0);
        for i in 0..n {
            *steps += 1;
            if (mask >> i) & 1 == 1 {
                let t = &triplets[i];
                a = a.max(t[0]);
                b = b.max(t[1]);
                c = c.max(t[2]);
            }
        }
        if [a, b, c] == *target {
            return true;
        }
    }
    false
}

// Cách chính: bỏ mọi bộ có thành phần vượt target, trong số còn lại đánh dấu thành phần nào khớp đúng
fn merge_triplets(triplets: &[[i32; 3]], target: &[i32; 3], steps: &mut u64) -> bool {
    let [x, y, z] = *target;
    let mut found = [false; 3];
    for t in triplets {
        *steps += 1;
        if t[0] > x || t[1] > y || t[2] > z {
            continue; // bộ không an toàn: gộp vào là vượt, không gỡ được
        }
        for k in 0..3 {
            if t[k] == target[k] {
                found[k] = true; // bộ an toàn này mang đúng giá trị cần ở vị trí k
            }
        }
    }
    found.iter().all(|&f| f)
}

// Cách tương đương: gộp hết mọi bộ an toàn bằng max, so với target
fn merge_triplets_max(triplets: &[[i32; 3]], target: &[i32; 3]) -> bool {
    let mut m = [0; 3];
    for t in triplets {
        if t[0] > target[0] || t[1] > target[1] || t[2] > target[2] {
            continue;
        }
        for k in 0..3 {
            m[k] = m[k].max(t[k]);
        }
    }
    m == *target
}

// Bản sai: không lọc, thấy thành phần nào bằng target là đánh dấu
fn merge_triplets_no_filter(triplets: &[[i32; 3]], target: &[i32; 3]) -> bool {
    let mut found = [false; 3];
    for t in triplets {
        for k in 0..3 {
            if t[k] == target[k] {
                found[k] = true;
            }
        }
    }
    found.iter().all(|&f| f)
}

fn build(list: &mut Vec<[i32; 3]>, values: &[[i32; 3]], total: &mut u32, good: &mut u32, wrong: &mut u32) {
    let target = [2, 2, 2];
    if !list.is_empty() {
        *total += 1;
        let mut s = 0;
        let b = merge_triplets_brute(list, &target, &mut s);
        if merge_triplets(list, &target, &mut s) == b && merge_triplets_max(list, &target) == b {
            *good += 1;
        }
        if merge_triplets_no_filter(list, &target) != b {
            *wrong += 1;
        }
    }
    if list.len() == 4 {
        return;
    }
    for v in values {
        list.push(*v);
        build(list, values, total, good, wrong);
        list.pop();
    }
}

fn main() {
    let cases: Vec<(Vec<[i32; 3]>, [i32; 3], bool)> = vec![
        (vec![[1, 2, 3]], [1, 2, 3], true),
        (vec![[2, 9, 5], [1, 7, 1]], [2, 7, 5], false),
        (vec![[3, 1, 1], [1, 4, 1], [1, 1, 6]], [3, 4, 6], true),
        (vec![[3, 4, 6], [5, 1, 1]], [3, 4, 6], true),
        (vec![[1, 1, 1], [2, 2, 2]], [3, 3, 3], false),
        (vec![[4, 2, 1], [1, 2, 4], [4, 4, 4]], [4, 2, 4], true),
        (vec![[2, 3, 4], [2, 3, 4]], [2, 3, 5], false),
    ];
    let mut ok = 0;
    for (triplets, target, want) in &cases {
        let mut s = 0;
        let got = [merge_triplets_brute(triplets, target, &mut s), merge_triplets(triplets, target, &mut s), merge_triplets_max(triplets, target)];
        if got.iter().all(|g| g == want) {
            ok += 1;
        } else {
            println!("sai ở {:?} {:?} {:?}", triplets, target, got);
        }
    }
    println!("{}/{} ca đúng", ok, cases.len());

    // Đối chiếu: mọi danh sách 1–4 bộ, mỗi thành phần trong {1, 2, 3}, target [2, 2, 2]
    let mut values = Vec::new();
    for a in 1..=3 {
        for b in 1..=3 {
            for c in 1..=3 {
                values.push([a, b, c]);
            }
        }
    }
    let (mut total, mut good, mut wrong) = (0, 0, 0);
    build(&mut Vec::new(), &values, &mut total, &mut good, &mut wrong);
    println!("{}/{} ca đúng (đối chiếu vét cạn)", good, total);
    println!("Bỏ bước lọc: sai {}/{} ca", wrong, total);

    // Đo 1: n = 18, mọi bộ an toàn nhưng không bộ nào có z = 1000, nên vét cạn phải thử hết 2^18 - 1 tập con
    let small: Vec<[i32; 3]> = (0..18).map(|i| [if i == 0 { 1000 } else { i + 1 }, if i == 1 { 1000 } else { i + 1 }, i + 1]).collect();
    let big = [1000, 1000, 1000];
    let (mut bs, mut gs) = (0, 0);
    let t0 = Instant::now();
    let rb = merge_triplets_brute(&small, &big, &mut bs);
    let brute_ms = t0.elapsed().as_secs_f64() * 1000.0;
    let t0 = Instant::now();
    let rg = merge_triplets(&small, &big, &mut gs);
    let greedy_ms = t0.elapsed().as_secs_f64() * 1000.0;
    println!("n = 18, đáp án {}/{}: vét cạn {} bước ({:.1} ms), tham lam {} bước ({:.3} ms)", rb, rg, bs, brute_ms, gs, greedy_ms);

    // Đo 2: n = 100000 (giới hạn của đề), bộ thứ i = [(7i mod 1000) + 1, (13i mod 1000) + 1, (31i mod 1000) + 1]
    let full: Vec<[i32; 3]> = (0..100000).map(|i| [(7 * i) % 1000 + 1, (13 * i) % 1000 + 1, (31 * i) % 1000 + 1]).collect();
    let goal = [700, 800, 900];
    let mut fs = 0;
    let t0 = Instant::now();
    let rf = merge_triplets(&full, &goal, &mut fs);
    let full_ms = t0.elapsed().as_secs_f64() * 1000.0;
    println!("n = 100000, đáp án {}: tham lam {} bước ({:.2} ms)", rf, fs, full_ms);
}
