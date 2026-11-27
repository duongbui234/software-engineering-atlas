use std::collections::HashMap;

struct Op {
    kind: &'static str,
    from: String,
    to: String,
}

// Vét cạn: solve(i, j) = số bước ít nhất để biến a[i:] thành b[j:]
fn brute_solve(a: &[u8], b: &[u8], i: usize, j: usize, calls: &mut u64) -> usize {
    *calls += 1;
    if i == a.len() {
        return b.len() - j; // chèn hết phần còn lại của b
    }
    if j == b.len() {
        return a.len() - i; // xóa hết phần còn lại của a
    }
    if a[i] == b[j] {
        return brute_solve(a, b, i + 1, j + 1, calls);
    }
    let insert = brute_solve(a, b, i, j + 1, calls);
    let delete = brute_solve(a, b, i + 1, j, calls);
    let replace = brute_solve(a, b, i + 1, j + 1, calls);
    1 + insert.min(delete).min(replace)
}

fn edit_distance_brute(a: &str, b: &str, calls: &mut u64) -> usize {
    brute_solve(a.as_bytes(), b.as_bytes(), 0, 0, calls)
}

// Ghi nhớ: cùng công thức, mỗi cặp (i, j) chỉ tính một lần
fn memo_solve(a: &[u8], b: &[u8], i: usize, j: usize, memo: &mut Vec<Option<usize>>, calls: &mut u64) -> usize {
    *calls += 1;
    if i == a.len() {
        return b.len() - j;
    }
    if j == b.len() {
        return a.len() - i;
    }
    let key = i * (b.len() + 1) + j;
    if let Some(cached) = memo[key] {
        return cached;
    }
    let result = if a[i] == b[j] {
        memo_solve(a, b, i + 1, j + 1, memo, calls)
    } else {
        let insert = memo_solve(a, b, i, j + 1, memo, calls);
        let delete = memo_solve(a, b, i + 1, j, memo, calls);
        let replace = memo_solve(a, b, i + 1, j + 1, memo, calls);
        1 + insert.min(delete).min(replace)
    };
    memo[key] = Some(result);
    result
}

fn edit_distance_memo(a: &str, b: &str, calls: &mut u64) -> usize {
    let mut memo = vec![None; (a.len() + 1) * (b.len() + 1)];
    memo_solve(a.as_bytes(), b.as_bytes(), 0, 0, &mut memo, calls)
}

// Bảng đầy đủ: dp[i][j] = khoảng cách giữa tiền tố a[..i] và b[..j]
fn edit_distance_table(a: &[u8], b: &[u8]) -> Vec<Vec<usize>> {
    let mut dp = vec![vec![0; b.len() + 1]; a.len() + 1];
    for i in 0..=a.len() {
        dp[i][0] = i;
    }
    for j in 0..=b.len() {
        dp[0][j] = j;
    }
    for i in 1..=a.len() {
        for j in 1..=b.len() {
            dp[i][j] = if a[i - 1] == b[j - 1] {
                dp[i - 1][j - 1]
            } else {
                1 + dp[i - 1][j].min(dp[i][j - 1]).min(dp[i - 1][j - 1])
            };
        }
    }
    dp
}

// Một hàng và một biến chéo: bản nộp LeetCode
fn min_distance(word1: String, word2: String) -> i32 {
    let (mut a, mut b) = (word1.as_bytes(), word2.as_bytes());
    if b.len() > a.len() {
        std::mem::swap(&mut a, &mut b); // hàng dài theo chuỗi ngắn hơn
    }
    let mut row: Vec<usize> = (0..=b.len()).collect();
    for i in 1..=a.len() {
        let mut diagonal = row[0]; // dp[i-1][j-1]
        row[0] = i;
        for j in 1..=b.len() {
            let above = row[j]; // dp[i-1][j], sắp bị ghi đè
            row[j] = if a[i - 1] == b[j - 1] {
                diagonal
            } else {
                1 + above.min(row[j - 1]).min(diagonal)
            };
            diagonal = above;
        }
    }
    row[b.len()] as i32
}

// Lần ngược bảng đầy đủ để in kịch bản sửa
fn edit_script(a: &str, b: &str) -> Vec<Op> {
    let (x, y) = (a.as_bytes(), b.as_bytes());
    let dp = edit_distance_table(x, y);
    let ch = |c: u8| (c as char).to_string();
    let mut ops = Vec::new();
    let (mut i, mut j) = (x.len(), y.len());
    while i > 0 || j > 0 {
        if i > 0 && j > 0 && x[i - 1] == y[j - 1] && dp[i][j] == dp[i - 1][j - 1] {
            ops.push(Op { kind: "giữ", from: ch(x[i - 1]), to: ch(y[j - 1]) });
            i -= 1;
            j -= 1;
        } else if i > 0 && j > 0 && dp[i][j] == dp[i - 1][j - 1] + 1 {
            ops.push(Op { kind: "thay", from: ch(x[i - 1]), to: ch(y[j - 1]) });
            i -= 1;
            j -= 1;
        } else if i > 0 && dp[i][j] == dp[i - 1][j] + 1 {
            ops.push(Op { kind: "xóa", from: ch(x[i - 1]), to: String::new() });
            i -= 1;
        } else {
            ops.push(Op { kind: "chèn", from: String::new(), to: ch(y[j - 1]) });
            j -= 1;
        }
    }
    ops.reverse();
    ops
}

fn script_works(a: &str, b: &str, ops: &[Op], distance: usize) -> bool {
    let consumed: String = ops.iter().map(|op| op.from.as_str()).collect();
    let produced: String = ops.iter().map(|op| op.to.as_str()).collect();
    let cost = ops.iter().filter(|op| op.kind != "giữ").count();
    consumed == a && produced == b && cost == distance
}

fn describe(ops: &[Op]) -> String {
    ops.iter()
        .map(|op| match op.kind {
            "giữ" => format!("giữ {}", op.from),
            "thay" => format!("thay {}→{}", op.from, op.to),
            "xóa" => format!("xóa {}", op.from),
            _ => format!("chèn {}", op.to),
        })
        .collect::<Vec<_>>()
        .join(", ")
}

// BFS trên chính các chuỗi, độc lập với công thức DP
fn bfs_distance(a: &str, b: &str) -> usize {
    let limit = a.len().max(b.len());
    let mut seen: HashMap<String, usize> = HashMap::from([(a.to_string(), 0)]);
    let mut queue = vec![a.to_string()];
    let mut head = 0;
    while head < queue.len() {
        let s = queue[head].clone();
        head += 1;
        let d = seen[&s];
        if s == b {
            return d;
        }
        let mut next = Vec::new();
        for p in 0..s.len() {
            let flip = if &s[p..p + 1] == "a" { "b" } else { "a" };
            next.push(format!("{}{}", &s[..p], &s[p + 1..]));
            next.push(format!("{}{}{}", &s[..p], flip, &s[p + 1..]));
        }
        if s.len() < limit {
            for p in 0..=s.len() {
                next.push(format!("{}a{}", &s[..p], &s[p..]));
                next.push(format!("{}b{}", &s[..p], &s[p..]));
            }
        }
        for t in next {
            if !seen.contains_key(&t) {
                seen.insert(t.clone(), d + 1);
                queue.push(t);
            }
        }
    }
    usize::MAX
}

fn main() {
    let cases: Vec<(String, String, usize)> = vec![
        ("".into(), "".into(), 0),
        ("".into(), "abc".into(), 3),
        ("abc".into(), "".into(), 3),
        ("abc".into(), "abc".into(), 0),
        ("cat".into(), "cut".into(), 1),
        ("table".into(), "tables".into(), 1),
        ("ab".into(), "ba".into(), 2),
        ("kitten".into(), "sitting".into(), 3),
        ("flaw".into(), "lawn".into(), 2),
        ("sunday".into(), "saturday".into(), 3),
        ("pqrst".into(), "qrstu".into(), 2),
        ("ab".repeat(250), "ba".repeat(250), 2),
        ("a".repeat(500), "b".repeat(500), 500),
    ];
    let mut calls = 0u64;
    let mut ok = 0;
    for (a, b, expected) in &cases {
        let mut results = vec![
            min_distance(a.clone(), b.clone()) as usize,
            edit_distance_memo(a, b, &mut calls),
            edit_distance_table(a.as_bytes(), b.as_bytes())[a.len()][b.len()],
        ];
        if a.len() + b.len() <= 16 {
            results.push(edit_distance_brute(a, b, &mut calls));
        }
        if results.iter().all(|r| r == expected) && script_works(a, b, &edit_script(a, b), *expected) {
            ok += 1;
        }
    }
    println!("{}/{} ca đúng", ok, cases.len());

    let mut words = vec![String::new()];
    let mut k = 0;
    while k < words.len() {
        if words[k].len() < 4 {
            let w = words[k].clone();
            words.push(w.clone() + "a");
            words.push(w + "b");
        }
        k += 1;
    }
    let (mut exhaustive_ok, mut total) = (0, 0);
    for a in &words {
        for b in &words {
            total += 1;
            let expected = bfs_distance(a, b);
            let results = [
                edit_distance_brute(a, b, &mut calls),
                edit_distance_memo(a, b, &mut calls),
                min_distance(a.clone(), b.clone()) as usize,
                edit_distance_table(a.as_bytes(), b.as_bytes())[a.len()][b.len()],
            ];
            if results.iter().all(|&r| r == expected) && script_works(a, b, &edit_script(a, b), expected) {
                exhaustive_ok += 1;
            }
        }
    }
    println!("{}/{} ca đúng (đối chiếu BFS)", exhaustive_ok, total);

    let (mut brute, mut memo) = (0u64, 0u64);
    edit_distance_brute(&"a".repeat(8), &"b".repeat(8), &mut brute);
    edit_distance_memo(&"a".repeat(8), &"b".repeat(8), &mut memo);
    println!("Vét cạn: {} lượt gọi, memo: {} lượt gọi", brute, memo);
    println!("kitten → sitting: {}", describe(&edit_script("kitten", "sitting")));
}
