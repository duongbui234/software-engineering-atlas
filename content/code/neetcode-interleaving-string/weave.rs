fn search(
    s1: &[u8], s2: &[u8], s3: &[u8], i: usize, j: usize,
    cache: &mut Option<Vec<Vec<Option<bool>>>>, calls: &mut u64,
) -> bool {
    *calls += 1;
    if i == s1.len() && j == s2.len() {
        return true;
    }
    if let Some(Some(saved)) = cache.as_ref().map(|c| c[i][j]) {
        return saved;
    }
    let k = i + j;
    let found = (i < s1.len() && s1[i] == s3[k] && search(s1, s2, s3, i + 1, j, cache, calls))
        || (j < s2.len() && s2[j] == s3[k] && search(s1, s2, s3, i, j + 1, cache, calls));
    if let Some(c) = cache.as_mut() {
        c[i][j] = Some(found);
    }
    found
}

fn interleave_search(s1: &str, s2: &str, s3: &str, memo: bool, calls: &mut u64) -> bool {
    if s1.len() + s2.len() != s3.len() {
        return false;
    }
    let mut cache = memo.then(|| vec![vec![None; s2.len() + 1]; s1.len() + 1]);
    search(s1.as_bytes(), s2.as_bytes(), s3.as_bytes(), 0, 0, &mut cache, calls)
}

fn interleave_table(s1: &str, s2: &str, s3: &str) -> bool {
    let (a, b, c) = (s1.as_bytes(), s2.as_bytes(), s3.as_bytes());
    let (m, n) = (a.len(), b.len());
    if m + n != c.len() {
        return false;
    }
    // ok[i][j]: s1[:i] và s2[:j] đan thành s3[:i + j]
    let mut ok = vec![vec![false; n + 1]; m + 1];
    ok[0][0] = true;
    for i in 0..=m {
        for j in 0..=n {
            if i > 0 && ok[i - 1][j] && a[i - 1] == c[i + j - 1] {
                ok[i][j] = true;
            }
            if j > 0 && ok[i][j - 1] && b[j - 1] == c[i + j - 1] {
                ok[i][j] = true;
            }
        }
    }
    ok[m][n]
}

fn interleave_row(s1: &str, s2: &str, s3: &str) -> bool {
    let (a, b, c) = (s1.as_bytes(), s2.as_bytes(), s3.as_bytes());
    let (m, n) = (a.len(), b.len());
    if m + n != c.len() {
        return false;
    }
    let mut row = vec![false; n + 1];
    for i in 0..=m {
        for j in 0..=n {
            if i == 0 && j == 0 {
                row[j] = true;
                continue;
            }
            // row[j] còn giữ hàng i - 1 (ô trên), row[j - 1] đã là hàng i (ô trái)
            let from_top = i > 0 && row[j] && a[i - 1] == c[i + j - 1];
            let from_left = j > 0 && row[j - 1] && b[j - 1] == c[i + j - 1];
            row[j] = from_top || from_left;
        }
    }
    row[n]
}

fn all_match(s1: &str, s2: &str, s3: &str, expected: bool) -> bool {
    let mut calls = 0;
    interleave_table(s1, s2, s3) == expected
        && interleave_row(s1, s2, s3) == expected
        && interleave_search(s1, s2, s3, true, &mut calls) == expected
        && (s3.len() > 24 || interleave_search(s1, s2, s3, false, &mut calls) == expected)
}

fn interleave_oracle(s1: &str, s2: &str, s3: &str) -> bool {
    let total = s3.len();
    if s1.len() + s2.len() != total {
        return false;
    }
    let c = s3.as_bytes();
    (0..1usize << total).any(|mask| {
        let first: Vec<u8> = (0..total).filter(|k| mask >> k & 1 == 1).map(|k| c[k]).collect();
        let second: Vec<u8> = (0..total).filter(|k| mask >> k & 1 == 0).map(|k| c[k]).collect();
        first == s1.as_bytes() && second == s2.as_bytes()
    })
}

fn strings_of(size: usize) -> Vec<String> {
    (0..1usize << size)
        .map(|mask| (0..size).rev().map(|k| if mask >> k & 1 == 1 { 'b' } else { 'a' }).collect())
        .collect()
}

fn main() {
    let a = |count: usize| "a".repeat(count);
    let cases: Vec<(String, String, String, bool)> = vec![
        ("ab".into(), "cd".into(), "acbd".into(), true),
        ("ab".into(), "cd".into(), "acdb".into(), true),
        ("ab".into(), "cd".into(), "badc".into(), false),
        ("ab".into(), "ac".into(), "acab".into(), true),
        ("a".into(), "b".into(), "abc".into(), false),
        ("".into(), "".into(), "".into(), true),
        ("".into(), "kiwi".into(), "kiwi".into(), true),
        ("".into(), "kiwi".into(), "kiwj".into(), false),
        ("aab".into(), "aac".into(), "aacaab".into(), true),
        ("aab".into(), "aac".into(), "abaaac".into(), false),
        (a(100), a(100), a(200), true),
        (a(100), a(99) + "b", a(198) + "ba", true),
        (a(100), a(99) + "b", a(198) + "bb", false),
    ];
    for (s1, s2, s3, expected) in &cases {
        assert!(all_match(s1, s2, s3, *expected), "Ca kiểm tra sai");
    }
    println!("{0}/{0} ca đúng", cases.len());

    let words: Vec<String> = (0..=3).flat_map(strings_of).collect();
    let mut probes = 0;
    for s1 in &words {
        for s2 in &words {
            for size in [s1.len() + s2.len(), s1.len() + s2.len() + 1] {
                for s3 in strings_of(size) {
                    assert!(all_match(s1, s2, &s3, interleave_oracle(s1, s2, &s3)), "Ca vét đối chiếu sai");
                    probes += 1;
                }
            }
        }
    }
    println!("{0}/{0} ca đúng (vét mọi cách chia)", probes);

    let (mut brute, mut memo) = (0, 0);
    interleave_search(&a(10), &a(10), &(a(19) + "b"), false, &mut brute);
    interleave_search(&a(10), &a(10), &(a(19) + "b"), true, &mut memo);
    println!("Vét cạn: {} lượt gọi, memo: {} lượt gọi", brute, memo);
}
