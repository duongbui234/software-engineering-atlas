// LeetCode 271, Encode and Decode Strings: ba cách mã hóa và test.
// Chạy: rustc --edition 2021 -O encode_decode.rs && ./encode_decode

// Cách 1 (SAI): nối bằng dấu phân cách.
fn join_encode(strs: &[String]) -> String {
    strs.join(",")
}
fn join_decode(s: &str) -> Vec<String> {
    if s.is_empty() { vec![] } else { s.split(',').map(String::from).collect() }
}

// Cách 2: thoát ký tự. "/" thành "//", "," thành "/,", mỗi chuỗi kết thúc bằng ",".
fn escape_encode(strs: &[String]) -> String {
    strs.iter().map(|s| s.replace('/', "//").replace(',', "/,") + ",").collect()
}
fn escape_decode(s: &str) -> Vec<String> {
    let mut out = Vec::new();
    let mut cur = String::new();
    let mut it = s.chars();
    while let Some(c) = it.next() {
        match c {
            '/' => cur.push(it.next().unwrap()), // ký tự sau "/" luôn là chữ thật
            ',' => out.push(std::mem::take(&mut cur)),
            _ => cur.push(c),
        }
    }
    out
}

// Cách 3: tiền tố độ dài. len() đếm BYTE UTF-8, và cắt chuỗi cũng theo byte: hai bên khớp.
fn length_encode(strs: &[String]) -> String {
    strs.iter().map(|s| format!("{}#{}", s.len(), s)).collect()
}
fn length_decode(s: &str) -> Vec<String> {
    let mut out = Vec::new();
    let mut i = 0;
    while i < s.len() {
        let hash = i + s[i..].find('#').unwrap(); // "#" đầu tiên từ i thuộc phần độ dài
        let len: usize = s[i..hash].parse().unwrap();
        out.push(s[hash + 1..hash + 1 + len].to_string());
        i = hash + 1 + len;
    }
    out
}

// Bản sai: mã hóa đếm byte nhưng giải mã đếm char (code point).
fn length_decode_chars(s: &str) -> Vec<String> {
    let cs: Vec<char> = s.chars().collect();
    let mut out = Vec::new();
    let mut i = 0;
    while i < cs.len() {
        let Some(off) = cs[i..].iter().position(|&c| c == '#') else { break };
        let j = i + off;
        let len: usize = cs[i..j].iter().collect::<String>().parse().unwrap_or(0);
        let end = (j + 1 + len).min(cs.len());
        out.push(cs[j + 1..end].iter().collect());
        i = j + 1 + len;
    }
    out
}

fn main() {
    let raw: Vec<Vec<&str>> = vec![
        vec!["neet", "code", "love", "you"], vec!["we", "say", ":", "yes"], vec![], vec![""], vec!["", ""],
        vec!["a,b", "c"], vec!["12#ab", "#"], vec!["a/", "/,"], vec!["😀é", "x"],
    ];
    let cases: Vec<Vec<String>> = raw.iter().map(|c| c.iter().map(|s| s.to_string()).collect()).collect();
    type Enc = fn(&[String]) -> String;
    type Dec = fn(&str) -> Vec<String>;
    let variants: [(&str, Enc, Dec); 4] = [
        ("join(\",\")", join_encode, join_decode),
        ("thoát ký tự", escape_encode, escape_decode),
        ("tiền tố độ dài", length_encode, length_decode),
        ("độ dài lệch đơn vị", length_encode, length_decode_chars),
    ];
    for (name, enc, dec) in variants.iter() {
        let bad: Vec<String> = cases.iter().filter(|c| dec(&enc(c)) != **c).map(|c| format!("{:?}", c)).collect();
        let pad = 19 - name.chars().count();
        let tail = if bad.is_empty() { String::new() } else { format!("; sai ở {}", bad.join(" ")) };
        println!("{}{} {}/{} ca đúng{}", name, " ".repeat(pad), cases.len() - bad.len(), cases.len(), tail);
    }
    let ex = vec!["12#ab".to_string(), "#".to_string()];
    println!("\nví dụ: {:?} → {:?}", ex, length_encode(&ex));
    println!("\"😀\".len() = {}, \"😀\".chars().count() = {}", "😀".len(), "😀".chars().count());
}
