// LeetCode 875, Koko Eating Bananas: thử tốc độ lần lượt, tìm nhị phân trên đáp án và ba bản sai.
// Chạy: rustc --edition 2021 -O koko_eating.rs && ./koko_eating

// Số giờ để ăn hết với tốc độ k: mỗi đống mất ⌈p / k⌉ giờ. Cộng trong i64: tổng có thể tới 10¹³.
fn hours_needed(piles: &[i32], k: i64) -> i64 {
    piles.iter().map(|&p| (p as i64 + k - 1) / k).sum() // i64::div_ceil cũng được (Rust 1.73+)
}

// Thử k = 1, 2, 3… tới tốc độ đầu tiên kịp giờ. Đúng, nhưng O(max(piles) · n).
fn linear_scan(piles: &[i32], h: i32) -> i32 {
    let mut k = 1;
    while hours_needed(piles, k) > h as i64 {
        k += 1;
    }
    k as i32
}

// Tìm nhị phân trên đáp án. Bất biến: hi luôn kịp; mọi tốc độ nhỏ hơn lo đều không kịp.
fn min_eating_speed(piles: &[i32], h: i32) -> i32 {
    let (mut lo, mut hi) = (1i64, *piles.iter().max().unwrap() as i64); // max() trả Option: mảng rỗng thì None
    while lo < hi {
        let mid = lo + (hi - lo) / 2;
        if hours_needed(piles, mid) <= h as i64 {
            hi = mid; // mid kịp: có thể chính là đáp án, giữ lại
        } else {
            lo = mid + 1;
        }
    }
    lo as i32
}

// SAI 1: chia làm tròn xuống, nên tốc độ quá chậm cũng "kịp".
fn wrong_floor_div(piles: &[i32], h: i32) -> Result<i32, String> {
    let (mut lo, mut hi) = (1i64, *piles.iter().max().unwrap() as i64);
    while lo < hi {
        let mid = lo + (hi - lo) / 2;
        let hours: i64 = piles.iter().map(|&p| p as i64 / mid).sum();
        if hours <= h as i64 { hi = mid } else { lo = mid + 1 }
    }
    Ok(lo as i32)
}

// SAI 2: mid kịp thì gán hi = mid - 1, bỏ luôn ô có thể là đáp án.
fn wrong_drop_mid(piles: &[i32], h: i32) -> Result<i32, String> {
    let (mut lo, mut hi) = (1i64, *piles.iter().max().unwrap() as i64);
    while lo < hi {
        let mid = lo + (hi - lo) / 2;
        if hours_needed(piles, mid) <= h as i64 { hi = mid - 1 } else { lo = mid + 1 }
    }
    Ok(lo as i32)
}

// SAI 3: lo = 0. Khi khoảng còn [0, 1], mid = 0: chia số nguyên cho 0 làm Rust panic.
// Ở đây dùng checked_div để trả lỗi thay vì dừng cả chương trình.
fn lo_from_zero(piles: &[i32], h: i32) -> Result<i32, String> {
    let (mut lo, mut hi) = (0i64, *piles.iter().max().unwrap() as i64);
    while lo < hi {
        let mid = lo + (hi - lo) / 2;
        let mut hours = 0i64;
        for &p in piles {
            hours += (p as i64 + mid - 1).checked_div(mid).ok_or("chia cho 0")?;
        }
        if hours <= h as i64 { hi = mid } else { lo = mid + 1 }
    }
    Ok(lo as i32)
}

fn main() {
    let cases: Vec<(Vec<i32>, i32, i32)> = vec![
        (vec![3, 6, 7, 11], 8, 4), (vec![30, 11, 23, 4, 20], 5, 30), (vec![30, 11, 23, 4, 20], 6, 23),
        (vec![1], 1, 1), (vec![1, 1], 5, 1), (vec![1000000000], 2, 500000000), (vec![312884470], 312884469, 2),
        (vec![805306368, 805306368, 805306368], 1000000000, 3), (vec![2, 2], 2, 2), (vec![7], 3, 3),
    ];
    let fns: [(&str, fn(&[i32], i32) -> Result<i32, String>); 5] = [
        ("linear_scan", |p, h| Ok(linear_scan(p, h))),
        ("min_eating_speed", |p, h| Ok(min_eating_speed(p, h))),
        ("wrong_floor_div", wrong_floor_div),
        ("wrong_drop_mid", wrong_drop_mid),
        ("lo_from_zero", lo_from_zero),
    ];
    for (name, f) in fns {
        let mut bad = vec![];
        let mut n = 0;
        for (piles, h, want) in &cases {
            if name == "linear_scan" && *want > 1000 {
                continue; // thử từng tốc độ tới 5·10⁸ thì quá lâu
            }
            n += 1;
            let got = match f(piles, *h) {
                Ok(v) => v.to_string(),
                Err(e) => e,
            };
            if got != want.to_string() {
                bad.push(format!("{:?} h={} → {}", piles, h, got));
            }
        }
        let extra = if bad.is_empty() { String::new() } else { format!("; sai ở {}", bad.join(", ")) };
        println!("{:<16} {}/{} ca đúng{}", name, n - bad.len(), n, extra);
    }

    // Kiểm ngẫu nhiên: so tìm nhị phân với thử lần lượt trên 2 000 bộ nhỏ (bộ sinh xorshift, không cần crate).
    let mut s: u64 = 7;
    let mut rand = |m: u64| {
        s ^= s << 13;
        s ^= s >> 7;
        s ^= s << 17;
        s % m
    };
    let mut agree = 0;
    for _ in 0..2000 {
        let n = 1 + rand(8) as usize;
        let piles: Vec<i32> = (0..n).map(|_| 1 + rand(50) as i32).collect();
        let h = n as i32 + rand(40) as i32;
        if min_eating_speed(&piles, h) == linear_scan(&piles, h) {
            agree += 1;
        }
    }
    println!("\nngẫu nhiên: tìm nhị phân khớp thử lần lượt ở {}/2000 bộ", agree);

    // Cộng trong i32 thì ca ba đống 805 306 368 tràn: checked_add báo None thay vì cuộn vòng im lặng.
    let sum32 = [805306368i32; 3].iter().try_fold(0i32, |acc, &p| acc.checked_add(p));
    println!("tổng ba đống 805306368 trong i32: {:?}", sum32);
}
