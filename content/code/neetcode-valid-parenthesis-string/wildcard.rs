// Valid Parenthesis String (LeetCode 678): vét cạn 3^k cách hiểu, DP nhớ (i, số mở), hai ngăn xếp, khoảng [lo, hi]
// Chạy: rustc --edition 2021 -O wildcard.rs -o wildcard && ./wildcard
use std::time::Instant;

// Vét cạn: thử mọi cách hiểu của từng dấu * (")" , rỗng, "("), kiểm từng chuỗi ngoặc thu được
fn check_brute(s: &[u8], steps: &mut u64) -> bool {
    fn balanced(buf: &[u8]) -> bool {
        let mut open = 0i32;
        for &c in buf {
            open += if c == b'(' { 1 } else { -1 };
            if open < 0 {
                return false;
            }
        }
        open == 0
    }
    fn go(s: &[u8], i: usize, buf: &mut Vec<u8>, steps: &mut u64) -> bool {
        if i == s.len() {
            *steps += 1; // một cách hiểu trọn vẹn
            return balanced(buf);
        }
        if s[i] != b'*' {
            buf.push(s[i]);
            let r = go(s, i + 1, buf, steps);
            buf.pop();
            return r;
        }
        let mut found = false;
        for pick in [b')', 0, b'('] {
            if pick != 0 {
                buf.push(pick);
            }
            if go(s, i + 1, buf, steps) {
                found = true; // không dừng sớm: đếm đủ 3^k cách hiểu
            }
            if pick != 0 {
                buf.pop();
            }
        }
        found
    }
    go(s, 0, &mut Vec::with_capacity(s.len()), steps)
}

// DP nhớ: f(i, open) = phần s[i..] có đóng được đúng open ngoặc đang mở không
fn check_dp(s: &[u8], steps: &mut u64) -> bool {
    fn f(s: &[u8], i: usize, open: i32, memo: &mut Vec<i8>, steps: &mut u64) -> bool {
        let n = s.len();
        if open < 0 {
            return false; // đóng nhiều hơn mở ở một tiền tố
        }
        if i == n {
            return open == 0;
        }
        let key = i * (n + 2) + open as usize;
        if memo[key] != -1 {
            return memo[key] == 1;
        }
        *steps += 1; // một trạng thái mới
        let r = match s[i] {
            b'(' => f(s, i + 1, open + 1, memo, steps),
            b')' => f(s, i + 1, open - 1, memo, steps),
            _ => {
                f(s, i + 1, open - 1, memo, steps)
                    || f(s, i + 1, open, memo, steps)
                    || f(s, i + 1, open + 1, memo, steps)
            }
        };
        memo[key] = if r { 1 } else { 0 };
        r
    }
    let n = s.len();
    let mut memo = vec![-1i8; (n + 1) * (n + 2)]; // -1: chưa tính, 0: sai, 1: đúng
    f(s, 0, 0, &mut memo, steps)
}

// Hai ngăn xếp chỉ số: ")" ăn "(" gần nhất trước, hết thì ăn "*"; cuối cùng mỗi "(" còn lại cần một "*" đứng sau nó
fn check_stacks(s: &[u8]) -> bool {
    let mut opens: Vec<usize> = Vec::new();
    let mut stars: Vec<usize> = Vec::new();
    for (i, &c) in s.iter().enumerate() {
        if c == b'(' {
            opens.push(i);
        } else if c == b'*' {
            stars.push(i);
        } else if opens.pop().is_none() && stars.pop().is_none() {
            return false; // ")" không có gì để khớp
        }
    }
    while let (Some(&o), Some(&t)) = (opens.last(), stars.last()) {
        if o > t {
            return false; // "*" đứng trước "(" thì không đóng được nó
        }
        opens.pop();
        stars.pop();
    }
    opens.is_empty()
}

// Cách chính: giữ khoảng [lo, hi] các số ngoặc mở có thể có
fn check_valid_string(s: &[u8], steps: &mut u64) -> bool {
    let mut lo: i32 = 0; // số ngoặc mở ít nhất có thể
    let mut hi: i32 = 0; // số ngoặc mở nhiều nhất có thể
    for &c in s {
        *steps += 1;
        match c {
            b'(' => {
                lo += 1;
                hi += 1;
            }
            b')' => {
                lo -= 1;
                hi -= 1;
            }
            _ => {
                lo -= 1; // "*" là ")"
                hi += 1; // "*" là "("
            }
        }
        if hi < 0 {
            return false; // kể cả coi mọi "*" là "(" vẫn đóng thừa
        }
        if lo < 0 {
            lo = 0; // bỏ các cách hiểu làm số mở âm
        }
    }
    lo == 0 // 0 nằm trong khoảng: có cách hiểu đóng hết
}

// Bản sai: không kẹp lo về 0, rồi "sửa" bằng lo <= 0
fn check_no_clamp(s: &[u8]) -> bool {
    let (mut lo, mut hi) = (0i32, 0i32);
    for &c in s {
        match c {
            b'(' => {
                lo += 1;
                hi += 1;
            }
            b')' => {
                lo -= 1;
                hi -= 1;
            }
            _ => {
                lo -= 1;
                hi += 1;
            }
        }
        if hi < 0 {
            return false;
        }
    }
    lo <= 0
}

fn gen(prefix: &mut Vec<u8>, total: &mut u32, good: &mut u32, wrong: &mut u32) {
    let mut x = 0u64;
    if !prefix.is_empty() {
        *total += 1;
        let b = check_brute(prefix, &mut x);
        if check_dp(prefix, &mut x) == b && check_stacks(prefix) == b && check_valid_string(prefix, &mut x) == b {
            *good += 1;
        }
        if check_no_clamp(prefix) != b {
            *wrong += 1;
        }
    }
    if prefix.len() == 8 {
        return;
    }
    for c in [b'(', b')', b'*'] {
        prefix.push(c);
        gen(prefix, total, good, wrong);
        prefix.pop();
    }
}

fn main() {
    let cases: [(&str, bool); 10] = [
        ("*", true),
        (")", false),
        ("*(", false),
        ("(*", true),
        ("((*", false),
        ("(()*", true),
        ("*)(*", true),
        ("(*)*)(", false),
        ("**())", true),
        ("((**)", true),
    ];
    let mut ok = 0;
    let mut x = 0u64;
    for (s, want) in cases {
        let b = s.as_bytes();
        let got = [check_brute(b, &mut x), check_dp(b, &mut x), check_stacks(b), check_valid_string(b, &mut x)];
        if got.iter().all(|&g| g == want) {
            ok += 1;
        } else {
            println!("sai ở {} {:?}", s, got);
        }
    }
    println!("{}/{} ca đúng", ok, cases.len());

    // Đối chiếu: mọi chuỗi độ dài 1–8 trên ba ký tự ( ) *
    let (mut total, mut good, mut wrong) = (0u32, 0u32, 0u32);
    gen(&mut Vec::new(), &mut total, &mut good, &mut wrong);
    println!("{}/{} ca đúng (đối chiếu vét cạn)", good, total);
    println!("Không kẹp lo: sai {}/{} ca", wrong, total);

    // Đo ở giới hạn n = 100: 99 dấu * rồi một "(", đáp án sai nên DP phải đi hết mọi trạng thái
    let big = format!("{}(", "*".repeat(99));
    let (mut dc, mut gc, mut bc) = (0u64, 0u64, 0u64);
    let t0 = Instant::now();
    let d = check_dp(big.as_bytes(), &mut dc);
    let dp_ms = t0.elapsed().as_secs_f64() * 1000.0;
    let t0 = Instant::now();
    let g = check_valid_string(big.as_bytes(), &mut gc);
    let greedy_ms = t0.elapsed().as_secs_f64() * 1000.0;
    println!("n = 100, đáp án {}/{}: DP {} trạng thái ({:.2} ms), khoảng [lo, hi] {} bước ({:.3} ms)", d, g, dc, dp_ms, gc, greedy_ms);

    // Vét cạn ở cỡ nhỏ: 12 dấu * rồi một "("
    let small = format!("{}(", "*".repeat(12));
    let t0 = Instant::now();
    let b = check_brute(small.as_bytes(), &mut bc);
    let brute_ms = t0.elapsed().as_secs_f64() * 1000.0;
    println!("n = 13, đáp án {}: vét cạn {} cách hiểu ({:.1} ms)", b, bc, brute_ms);
}
