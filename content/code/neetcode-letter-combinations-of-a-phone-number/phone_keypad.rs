// Letter Combinations of a Phone Number (LeetCode 17): ba cách cho cùng một bài.
// Chạy: rustc --edition 2021 -O phone_keypad.rs -o /tmp/phone_keypad && /tmp/phone_keypad
use std::cell::Cell;
use std::collections::HashSet;

fn keys(digit: u8) -> &'static [u8] {
    match digit {
        b'2' => b"abc",
        b'3' => b"def",
        b'4' => b"ghi",
        b'5' => b"jkl",
        b'6' => b"mno",
        b'7' => b"pqrs",
        b'8' => b"tuv",
        b'9' => b"wxyz",
        _ => b"",
    }
}

thread_local! { static CALLS: Cell<usize> = Cell::new(0); }

// Cách 1: quay lui với một Vec<u8> làm bộ đệm, thêm rồi gỡ ở mỗi tầng.
fn combine_backtrack(digits: &str) -> Vec<String> {
    let mut result = Vec::new();
    if digits.is_empty() {
        return result; // chuỗi rỗng cho [], không phải [""]
    }
    let mut buffer = Vec::with_capacity(digits.len());
    walk(digits.as_bytes(), 0, &mut buffer, &mut result);
    result
}

fn walk(digits: &[u8], index: usize, buffer: &mut Vec<u8>, result: &mut Vec<String>) {
    CALLS.with(|c| c.set(c.get() + 1));
    if index == digits.len() {
        result.push(String::from_utf8(buffer.clone()).unwrap());
        return;
    }
    for &letter in keys(digits[index]) {
        buffer.push(letter);
        walk(digits, index + 1, buffer, result);
        buffer.pop();
    }
}

// Cách 2: dựng dần theo từng chữ số, nối mỗi tiền tố với mọi chữ cái của phím kế tiếp.
fn combine_iterative(digits: &str) -> Vec<String> {
    if digits.is_empty() {
        return Vec::new();
    }
    let mut layer = vec![String::new()];
    for &digit in digits.as_bytes() {
        let mut next = Vec::with_capacity(layer.len() * keys(digit).len());
        for prefix in &layer {
            for &letter in keys(digit) {
                let mut word = prefix.clone();
                word.push(letter as char);
                next.push(word);
            }
        }
        layer = next;
    }
    layer
}

// Cách 3: bộ đếm hỗn cơ số, mỗi vị trí đếm từ 0 tới số chữ cái của phím đó.
fn combine_counter(digits: &str) -> Vec<String> {
    let bytes = digits.as_bytes();
    let n = bytes.len();
    let mut result = Vec::new();
    if n == 0 {
        return result;
    }
    let mut odometer = vec![0usize; n];
    loop {
        let word: String = (0..n).map(|i| keys(bytes[i])[odometer[i]] as char).collect();
        result.push(word);
        let mut pos = n;
        while pos > 0 && odometer[pos - 1] == keys(bytes[pos - 1]).len() - 1 {
            odometer[pos - 1] = 0;
            pos -= 1;
        }
        if pos == 0 {
            return result;
        }
        odometer[pos - 1] += 1;
    }
}

struct Case {
    digits: &'static str,
    count: usize,
    first: &'static str,
    last: &'static str,
    full: Option<&'static str>,
}

fn fits(got: &[String], c: &Case) -> bool {
    if got.len() != c.count {
        return false;
    }
    if c.count > 0 && (got[0] != c.first || got[c.count - 1] != c.last) {
        return false;
    }
    if let Some(full) = c.full {
        if got.join(",") != full {
            return false;
        }
    }
    got.iter().collect::<HashSet<_>>().len() == got.len()
}

fn each(prefix: &mut String, total: &mut usize, same: &mut usize) {
    *total += 1;
    let want = combine_iterative(prefix);
    if combine_backtrack(prefix) == want && combine_counter(prefix) == want {
        *same += 1;
    }
    if prefix.len() < 4 {
        for d in "23456789".chars() {
            prefix.push(d);
            each(prefix, total, same);
            prefix.pop();
        }
    }
}

fn main() {
    let cases = [
        Case { digits: "23", count: 9, first: "ad", last: "cf", full: Some("ad,ae,af,bd,be,bf,cd,ce,cf") },
        Case { digits: "", count: 0, first: "", last: "", full: Some("") },
        Case { digits: "2", count: 3, first: "a", last: "c", full: Some("a,b,c") },
        Case { digits: "7", count: 4, first: "p", last: "s", full: Some("p,q,r,s") },
        Case { digits: "9", count: 4, first: "w", last: "z", full: Some("w,x,y,z") },
        Case { digits: "22", count: 9, first: "aa", last: "cc", full: Some("aa,ab,ac,ba,bb,bc,ca,cb,cc") },
        Case { digits: "79", count: 16, first: "pw", last: "sz", full: None },
        Case { digits: "56", count: 9, first: "jm", last: "lo", full: None },
        Case { digits: "234", count: 27, first: "adg", last: "cfi", full: None },
        Case { digits: "2345", count: 81, first: "adgj", last: "cfil", full: None },
        Case { digits: "7999", count: 256, first: "pwww", last: "szzz", full: None },
    ];
    let mut ok = 0;
    for c in &cases {
        if fits(&combine_backtrack(c.digits), c) && fits(&combine_iterative(c.digits), c) && fits(&combine_counter(c.digits), c) {
            ok += 1;
        } else {
            println!("sai ở {:?}", c.digits);
        }
    }
    println!("{}/{} ca đúng", ok, cases.len());

    // Đối chiếu: mọi chuỗi chữ số 2–9 dài 0–4, so với cách dựng lặp.
    let (mut total, mut same) = (0, 0);
    each(&mut String::new(), &mut total, &mut same);
    println!("{}/{} ca đúng (đối chiếu tích Descartes lặp)", same, total);

    CALLS.with(|c| c.set(0));
    let sample = combine_backtrack("7999");
    println!("7999: {} tổ hợp, {} lượt gọi quay lui", sample.len(), CALLS.with(|c| c.get()));
}
