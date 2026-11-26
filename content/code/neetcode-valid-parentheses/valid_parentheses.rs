// LeetCode 20, Valid Parentheses: các cách đúng, ba bản sai, test.
// Chạy: rustc --edition 2021 -O valid_parentheses.rs && ./valid_parentheses

fn open_of(ch: char) -> Option<char> {
    match ch { ')' => Some('('), ']' => Some('['), '}' => Some('{'), _ => None }
}

// SAI: một bộ đếm chung. Không phân biệt loại ngoặc: "(]" thành hợp lệ.
fn single_counter(s: &str) -> bool {
    let mut depth = 0i32;
    for ch in s.chars() {
        depth += if "([{".contains(ch) { 1 } else { -1 };
        if depth < 0 { return false; }
    }
    depth == 0
}

// SAI: ba bộ đếm riêng. Đúng số lượng từng loại nhưng không biết thứ tự lồng: "([)]" thành hợp lệ.
fn three_counters(s: &str) -> bool {
    let mut depth = [0i32; 3];
    let slot = |c: char| "([{".find(c).unwrap();
    for ch in s.chars() {
        match open_of(ch) {
            None => depth[slot(ch)] += 1,
            Some(o) => { depth[slot(o)] -= 1; if depth[slot(o)] < 0 { return false; } }
        }
    }
    depth == [0, 0, 0]
}

// Đúng nhưng O(n²): xóa lặp lại các cặp kề nhau "()", "[]", "{}" tới khi không xóa được nữa.
fn replace_pairs(s: &str) -> bool {
    let mut s = s.to_string();
    loop {
        let next = s.replace("()", "").replace("[]", "").replace("{}", "");
        if next == s { return s.is_empty(); }
        s = next;
    }
}

// Ngăn xếp: ngoặc mở thì đẩy vào, ngoặc đóng thì phải khớp với ngoặc mở trên đỉnh.
fn stack(s: &str) -> bool {
    if s.len() % 2 == 1 { return false; } // độ dài lẻ thì chắc chắn có ngoặc lẻ đôi
    let mut st: Vec<char> = Vec::with_capacity(s.len());
    for ch in s.chars() {
        match open_of(ch) {
            None => st.push(ch),
            // pop() trả Option: ngăn xếp rỗng là None, khác Some('('), nên không cần kiểm riêng
            Some(o) => if st.pop() != Some(o) { return false; },
        }
    }
    st.is_empty() // còn ngoặc mở chưa đóng thì sai
}

// SAI: quên kiểm ngăn xếp rỗng ở cuối: "((" thành hợp lệ.
fn stack_no_final_check(s: &str) -> bool {
    let mut st: Vec<char> = Vec::new();
    for ch in s.chars() {
        match open_of(ch) {
            None => st.push(ch),
            Some(o) => if st.pop() != Some(o) { return false; },
        }
    }
    true
}

fn main() {
    let cases = [
        ("()", true), ("()[]{}", true), ("(]", false), ("([)]", false), ("{[]}", true),
        ("((", false), ("){", false), ("", true), ("(((([]))))", true),
    ];
    let fns: [(&str, fn(&str) -> bool); 5] = [
        ("singleCounter", single_counter), ("threeCounters", three_counters), ("replacePairs", replace_pairs),
        ("stack", stack), ("stackNoFinalCheck", stack_no_final_check),
    ];
    for (name, f) in fns {
        let bad: Vec<String> = cases.iter().filter(|&&(s, want)| f(s) != want).map(|&(s, _)| format!("{:?}", s)).collect();
        let tail = if bad.is_empty() { String::new() } else { format!("; sai ở {}", bad.join(" ")) };
        println!("{:<18} {}/{} ca đúng{}", name, cases.len() - bad.len(), cases.len(), tail);
    }
}
