// Ga DP-07: DP khoảng (Burst Balloons) và DP khớp mẫu (Regular Expression Matching).
// Chạy: rustc --edition 2021 -O intervals.rs -o /tmp/intervals && /tmp/intervals

// best[l][r] = số xu nhiều nhất khi nổ hết bóng nằm giữa l và r (không tính l, r).
// Chọn k là quả nổ CUỐI CÙNG trong khoảng: lúc đó hai bên của k là l và r.
fn max_coins(nums: &[i32]) -> i32 {
    let mut vals = vec![1]; // thêm hai quả bóng giá 1 ở hai đầu
    vals.extend_from_slice(nums);
    vals.push(1);
    let size = vals.len();
    let mut best = vec![vec![0i32; size]; size];
    for gap in 2..size { // khoảng ngắn trước, dài sau
        for l in 0..size - gap {
            let r = l + gap;
            for k in l + 1..r {
                let coins = vals[l] * vals[k] * vals[r] + best[l][k] + best[k][r];
                best[l][r] = best[l][r].max(coins);
            }
        }
    }
    best[0][size - 1]
}

// matched[i][j] = s[0:i] khớp trọn p[0:j]. Dấu * đi cùng ký tự đứng trước nó.
fn is_match(s: &str, p: &str) -> bool {
    let (s, p) = (s.as_bytes(), p.as_bytes());
    let (m, n) = (s.len(), p.len());
    let mut matched = vec![vec![false; n + 1]; m + 1];
    matched[0][0] = true;
    for i in 0..=m {
        for j in 1..=n {
            if p[j - 1] == b'*' {
                // dùng x* không lần nào (đọc lùi hai cột), hoặc ăn thêm một ký tự của s
                let eats = i > 0 && (p[j - 2] == b'.' || p[j - 2] == s[i - 1]) && matched[i - 1][j];
                matched[i][j] = matched[i][j - 2] || eats;
            } else {
                matched[i][j] = i > 0 && (p[j - 1] == b'.' || p[j - 1] == s[i - 1]) && matched[i - 1][j - 1];
            }
        }
    }
    matched[m][n]
}

fn main() {
    let balloon_cases: Vec<(Vec<i32>, i32)> = vec![
        (vec![2, 4, 3], 33), (vec![5], 5), (vec![1, 5], 10), (vec![0, 4], 4),
        (vec![3, 3, 3], 39), (vec![9, 1, 2, 8], 243), (vec![4, 2, 7, 1, 6], 296),
    ];
    let pattern_cases = [
        ("", "", true), ("", "a*", true), ("", "a*b*.*", true), ("abc", "abc", true),
        ("abc", "a.c", true), ("abc", "ab", false), ("aaa", "a*", true), ("aaa", "ab*a*", true),
        ("xyz", ".*", true), ("xyz", ".*q", false), ("ab", ".*c", false), ("aaab", "a*ab", true),
        ("ba", "a*ba*", true), ("a", "ab*", true), ("bbbba", ".*a*a", true), ("ab", "a*", false),
    ];
    let mut ok = 0;
    for (nums, want) in &balloon_cases {
        let got = max_coins(nums);
        if got == *want { ok += 1; } else { println!("sai ở: max_coins({:?}) = {}, cần {}", nums, got, want); }
    }
    for (s, p, want) in &pattern_cases {
        let got = is_match(s, p);
        if got == *want { ok += 1; } else { println!("sai ở: is_match({:?}, {:?}) = {}, cần {}", s, p, got, want); }
    }
    println!("{}/{} ca đúng", ok, balloon_cases.len() + pattern_cases.len());
}
