// Tham lam theo nhóm (NeetCode MISC-04): bốn bài, mỗi bài một luật cục bộ bị ép buộc.
use std::collections::BTreeMap;

// Hand of Straights: lá nhỏ nhất còn lại chỉ có thể mở một nhóm, nên mở nhóm ở đó.
fn is_n_straight_hand(hand: &[i32], group_size: i32) -> bool {
    if hand.len() % group_size as usize != 0 {
        return false;
    }
    let mut count: BTreeMap<i32, i32> = BTreeMap::new(); // khóa luôn được giữ theo thứ tự tăng
    for &x in hand {
        *count.entry(x).or_insert(0) += 1;
    }
    let keys: Vec<i32> = count.keys().copied().collect(); // chụp khóa trước, vì vòng trong sửa map
    for x in keys {
        let c = count[&x]; // c lá x còn lại: cả c lá đều phải mở nhóm
        if c == 0 {
            continue;
        }
        for v in x..x + group_size {
            match count.get_mut(&v) {
                Some(have) if *have >= c => *have -= c,
                _ => return false, // thiếu lá v: có nhóm không đi tiếp được
            }
        }
    }
    true
}

// Merge Triplets: bỏ bộ ba nào vượt target ở bất kỳ vị trí nào; các bộ còn lại gộp hết cũng không hại.
fn merge_triplets(triplets: &[[i32; 3]], target: [i32; 3]) -> bool {
    let mut good = [false; 3]; // vị trí i đã có bộ an toàn chạm đúng target[i] chưa
    for t in triplets {
        if (0..3).any(|i| t[i] > target[i]) {
            continue; // dùng là hỏng vĩnh viễn
        }
        for i in 0..3 {
            if t[i] == target[i] {
                good[i] = true;
            }
        }
    }
    good.iter().all(|&g| g)
}

// Partition Labels: phần phải kéo tới lần xuất hiện cuối của mọi chữ trong nó.
fn partition_labels(s: &str) -> Vec<i32> {
    let b = s.as_bytes();
    let mut last = [0usize; 26];
    for (i, &c) in b.iter().enumerate() {
        last[(c - b'a') as usize] = i;
    }
    let mut sizes = Vec::new();
    let (mut start, mut end) = (0usize, 0usize); // end: mốc xa nhất mà phần hiện tại buộc phải chạm
    for (i, &c) in b.iter().enumerate() {
        end = end.max(last[(c - b'a') as usize]);
        if i == end {
            // không chữ nào của phần này còn ở phía sau: cắt
            sizes.push((end - start + 1) as i32);
            start = i + 1;
        }
    }
    sizes
}

// Valid Parenthesis String: giữ khoảng [lo, hi] số ngoặc mở chưa đóng có thể có.
fn check_valid_string(s: &str) -> bool {
    let (mut lo, mut hi) = (0i32, 0i32); // lo: mọi '*' nghiêng về ')'; hi: mọi '*' nghiêng về '('
    for c in s.chars() {
        match c {
            '(' => { lo += 1; hi += 1; }
            ')' => { lo -= 1; hi -= 1; }
            _ => { lo -= 1; hi += 1; }
        }
        if hi < 0 {
            return false; // kể cả khi mọi '*' là '(' vẫn thừa ')'
        }
        lo = lo.max(0); // số ngoặc mở không âm: bỏ các cách đọc vô nghĩa
    }
    lo == 0
}

fn main() {
    let labels = |s: &str| format!("{:?}", partition_labels(s));
    // Đáp án mong đợi tính trước bằng vét cạn độc lập (thử mọi cách chia, mọi tập con, mọi cách đọc '*').
    let cases: Vec<(&str, String, &str)> = vec![
        ("hand thiếu lá 7", is_n_straight_hand(&[3, 1, 5, 8, 2, 6, 4, 5, 3], 3).to_string(), "false"),
        ("hand ba nhóm", is_n_straight_hand(&[1, 2, 2, 3, 3, 4, 4, 5, 6], 3).to_string(), "true"),
        ("hand không chia hết", is_n_straight_hand(&[1, 2, 3, 4, 5], 4).to_string(), "false"),
        ("hand nhóm cỡ 1", is_n_straight_hand(&[7], 1).to_string(), "true"),
        ("hand chưa sắp", is_n_straight_hand(&[2, 1], 2).to_string(), "true"),
        ("hand hai nhóm giống nhau", is_n_straight_hand(&[1, 1, 2, 2, 3, 3], 3).to_string(), "true"),
        ("hand hở ở 3", is_n_straight_hand(&[1, 2, 4, 5, 6, 7], 3).to_string(), "false"),
        ("triplets bỏ bộ vượt", merge_triplets(&[[1, 4, 2], [3, 1, 5], [2, 6, 9], [3, 4, 1]], [3, 4, 5]).to_string(), "true"),
        ("triplets thiếu vị trí 3", merge_triplets(&[[4, 1, 1], [1, 4, 1]], [4, 4, 4]).to_string(), "false"),
        ("triplets một bộ đúng", merge_triplets(&[[5, 5, 5]], [5, 5, 5]).to_string(), "true"),
        ("triplets bộ duy nhất chạm bị vượt", merge_triplets(&[[2, 9, 1], [1, 1, 3]], [2, 2, 3]).to_string(), "false"),
        ("triplets không chạm", merge_triplets(&[[1, 2, 3], [1, 2, 3]], [1, 2, 4]).to_string(), "false"),
        ("labels hai phần", labels("abacdcbe"), "[7, 1]"),
        ("labels từng chữ", labels("xyz"), "[1, 1, 1]"),
        ("labels một chữ", labels("aaaa"), "[4]"),
        ("labels nối dài", labels("abcab"), "[5]"),
        ("labels năm phần", labels("ccbbaddx"), "[2, 2, 1, 2, 1]"),
        ("paren sao ở giữa", check_valid_string("(*)").to_string(), "true"),
        ("paren sao làm (", check_valid_string("(*))").to_string(), "true"),
        ("paren mở ở cuối", check_valid_string("*)(").to_string(), "false"),
        ("paren đóng trước", check_valid_string(")*").to_string(), "false"),
        ("paren thừa mở", check_valid_string("(((*").to_string(), "false"),
        ("paren một sao", check_valid_string("*").to_string(), "true"),
        ("paren hai sao", check_valid_string("((*)*)").to_string(), "true"),
        ("paren sao làm )", check_valid_string("(*(*)").to_string(), "true"),
        ("paren sao không cứu", check_valid_string("**((").to_string(), "false"),
    ];
    let mut ok = 0;
    for (name, got, want) in &cases {
        if got == want {
            ok += 1;
        } else {
            println!("SAI {}: được {}, cần {}", name, got, want);
        }
    }
    println!("{}/{} ca đúng", ok, cases.len());
}
