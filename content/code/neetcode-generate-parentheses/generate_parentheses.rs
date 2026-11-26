// LeetCode 22, Generate Parentheses: ba cách đúng, một bản sai, test.
// Chạy: rustc --edition 2021 -O generate_parentheses.rs -o generate_parentheses && ./generate_parentheses
use std::collections::HashSet;

fn generate_all_filter(n: usize) -> Vec<String> {
    let mut out = Vec::new();
    for mask in 0u32..(1 << (2 * n)) {
        // 2^(2n) bộ, bit 1 là "("
        let mut s = String::with_capacity(2 * n);
        let mut bal = 0i32;
        for i in (0..2 * n).rev() {
            let open = (mask >> i) & 1 == 1;
            s.push(if open { '(' } else { ')' });
            bal += if open { 1 } else { -1 };
            if bal < 0 {
                break;
            }
        }
        if bal == 0 && s.len() == 2 * n {
            out.push(s);
        }
    }
    out
}

// Cách 2: quay lui với MỘT String dùng chung; push rồi pop để gỡ.
fn backtrack(n: usize) -> Vec<String> {
    fn go(cur: &mut String, open: usize, close: usize, n: usize, out: &mut Vec<String>) {
        if cur.len() == 2 * n {
            out.push(cur.clone()); // clone sao chép; borrow checker không cho đẩy chính cur vào out
            return;
        }
        if open < n {
            cur.push('(');
            go(cur, open + 1, close, n, out);
            cur.pop(); // bỏ ký tự vừa thêm
        }
        if close < open {
            cur.push(')');
            go(cur, open, close + 1, n, out);
            cur.pop();
        }
    }
    let mut out = Vec::new();
    go(&mut String::with_capacity(2 * n), 0, 0, n, &mut out);
    out
}

// Cách 3: ngăn xếp tự quản; mỗi phần tử giữ chuỗi riêng.
fn explicit_stack(n: usize) -> Vec<String> {
    let mut out = Vec::new();
    let mut st = vec![(String::new(), 0usize, 0usize)];
    while let Some((s, open, close)) = st.pop() {
        if s.len() == 2 * n {
            out.push(s);
            continue;
        }
        if close < open {
            st.push((format!("{s})"), open, close + 1));
        }
        if open < n {
            st.push((format!("{s}("), open + 1, close));
        }
    }
    out
}

// SAI: điều kiện đóng là close < n thay vì close < open.
fn wrong_close_lt_n(n: usize) -> Vec<String> {
    fn go(cur: &mut String, open: usize, close: usize, n: usize, out: &mut Vec<String>) {
        if cur.len() == 2 * n {
            out.push(cur.clone());
            return;
        }
        if open < n {
            cur.push('(');
            go(cur, open + 1, close, n, out);
            cur.pop();
        }
        if close < n {
            cur.push(')');
            go(cur, open, close + 1, n, out);
            cur.pop();
        }
    }
    let mut out = Vec::new();
    go(&mut String::new(), 0, 0, n, &mut out);
    out
}

fn valid(s: &str) -> bool {
    let mut bal = 0i32;
    for b in s.bytes() {
        bal += if b == b'(' { 1 } else { -1 };
        if bal < 0 {
            return false;
        }
    }
    bal == 0
}

fn catalan(n: usize) -> usize {
    let mut c = 1usize;
    for i in 0..n {
        c = c * 2 * (2 * i + 1) / (i + 2);
    }
    c
}

fn correct(out: &[String], n: usize) -> bool {
    let uniq: HashSet<&String> = out.iter().collect();
    out.len() == catalan(n) && uniq.len() == out.len() && out.iter().all(|s| s.len() == 2 * n && valid(s))
}

fn main() {
    let fns: [(&str, fn(usize) -> Vec<String>); 4] = [
        ("generate_all_filter", generate_all_filter),
        ("backtrack", backtrack),
        ("explicit_stack", explicit_stack),
        ("wrong_close_lt_n", wrong_close_lt_n),
    ];
    for (name, f) in fns {
        let ok = (1..=8).filter(|&n| correct(&f(n), n)).count();
        println!("{:<20} {}/8 ca đúng", name, ok);
    }
    println!("\nwrong_close_lt_n(2) = {:?}", wrong_close_lt_n(2));
    println!("backtrack(3)        = {:?}", backtrack(3));
}
