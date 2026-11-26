// LeetCode 150, Evaluate Reverse Polish Notation: hai cách đúng, một bản sai, test.
// Chạy: rustc --edition 2021 -O eval_rpn.rs -o eval_rpn && ./eval_rpn

fn is_op(t: &str) -> bool {
    matches!(t, "+" | "-" | "*" | "/") // so cả token: "-11" không khớp
}

fn apply(op: &str, a: i32, b: i32) -> i32 {
    match op {
        "+" => a + b,
        "-" => a - b,
        "*" => a * b,
        _ => a / b, // chia i32 của Rust làm tròn về 0; div_euclid thì khác với số âm
    }
}

// Cách 1: ngăn xếp. Số lấy ra SAU là vế trái.
fn eval_stack(tokens: &[&str]) -> i32 {
    let mut st: Vec<i32> = Vec::new();
    for &t in tokens {
        if is_op(t) {
            let b = st.pop().unwrap();
            let a = st.pop().unwrap();
            st.push(apply(t, a, b));
        } else {
            st.push(t.parse().unwrap()); // parse::<i32>() đọc được cả "-11"
        }
    }
    st[0]
}

// Cách 2: đệ quy từ token cuối; chỉ số i truyền bằng &mut.
fn eval_recursive(tokens: &[&str]) -> i32 {
    fn go(tokens: &[&str], i: &mut usize) -> i32 {
        let t = tokens[*i];
        if *i > 0 {
            *i -= 1;
        }
        if !is_op(t) {
            return t.parse().unwrap();
        }
        let b = go(tokens, i);
        let a = go(tokens, i);
        apply(t, a, b)
    }
    let mut i = tokens.len() - 1;
    go(tokens, &mut i)
}

// SAI: chia bằng div_euclid (phần dư luôn không âm), lệch khi số chia âm.
fn eval_euclid(tokens: &[&str]) -> i32 {
    let mut st: Vec<i32> = Vec::new();
    for &t in tokens {
        if is_op(t) {
            let b = st.pop().unwrap();
            let a = st.pop().unwrap();
            st.push(if t == "/" { a.div_euclid(b) } else { apply(t, a, b) });
        } else {
            st.push(t.parse().unwrap());
        }
    }
    st[0]
}

fn main() {
    let cases: Vec<(Vec<&str>, i32)> = vec![
        (vec!["2", "1", "+", "3", "*"], 9),
        (vec!["4", "13", "5", "/", "+"], 6),
        (vec!["10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"], 22),
        (vec!["3", "4", "-"], -1),
        (vec!["7", "-2", "/"], -3),
        (vec!["-7", "2", "/"], -3),
        (vec!["42"], 42),
    ];
    let fns: [(&str, fn(&[&str]) -> i32); 3] = [
        ("eval_stack", eval_stack),
        ("eval_recursive", eval_recursive),
        ("eval_euclid", eval_euclid),
    ];
    for (name, f) in fns {
        let bad: Vec<String> = cases
            .iter()
            .filter_map(|(t, want)| {
                let got = f(t);
                (got != *want).then(|| format!("[{}] → {}", t.join(" "), got))
            })
            .collect();
        let tail = if bad.is_empty() { String::new() } else { format!("; sai ở {}", bad.join(", ")) };
        println!("{:<14} {}/{} ca đúng{}", name, cases.len() - bad.len(), cases.len(), tail);
    }

    println!(
        "\n-7 / 2 = {}, (-7i32).div_euclid(2) = {}, 7 / -2 = {}, 7i32.div_euclid(-2) = {}",
        -7 / 2,
        (-7i32).div_euclid(2),
        7 / -2,
        7i32.div_euclid(-2)
    );
    let mut deep: Vec<&str> = vec!["1"];
    for _ in 0..100_000 {
        deep.push("1");
        deep.push("+");
    }
    // Stack overflow trong Rust không bắt được (tiến trình bị hủy), nên chỉ chạy độ sâu chắc chắn qua.
    println!("đệ quy 10⁵ tầng: {}", eval_recursive(&deep));
    println!("ngăn xếp 10⁵ tầng: {}", eval_stack(&deep));
}
