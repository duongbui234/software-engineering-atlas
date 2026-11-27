const CAP: u64 = 1 << 31; // đáp án LeetCode luôn nhỏ hơn mức này

fn search(
    s: &[u8], t: &[u8], i: usize, j: usize,
    cache: &mut Option<Vec<Vec<Option<u64>>>>, calls: &mut u64,
) -> u64 {
    *calls += 1;
    if j == t.len() {
        return 1;
    }
    if s.len() - i < t.len() - j {
        return 0;
    }
    if let Some(Some(saved)) = cache.as_ref().map(|c| c[i][j]) {
        return saved;
    }
    let mut ways = search(s, t, i + 1, j, cache, calls);
    if s[i] == t[j] {
        ways = (ways + search(s, t, i + 1, j + 1, cache, calls)).min(CAP);
    }
    if let Some(c) = cache.as_mut() {
        c[i][j] = Some(ways);
    }
    ways
}

fn count_search(s: &str, t: &str, memo: bool, calls: &mut u64) -> u64 {
    let mut cache = memo.then(|| vec![vec![None; t.len() + 1]; s.len() + 1]);
    search(s.as_bytes(), t.as_bytes(), 0, 0, &mut cache, calls)
}

fn count_table(s: &str, t: &str) -> u64 {
    let (a, b) = (s.as_bytes(), t.as_bytes());
    let (m, n) = (a.len(), b.len());
    // ways[i][j]: số cách chọn t[:j] làm dãy con của s[:i]
    let mut ways = vec![vec![0u64; n + 1]; m + 1];
    for row in ways.iter_mut() {
        row[0] = 1;
    }
    for i in 1..=m {
        for j in 1..=n {
            ways[i][j] = ways[i - 1][j];
            if a[i - 1] == b[j - 1] {
                ways[i][j] = (ways[i][j] + ways[i - 1][j - 1]).min(CAP);
            }
        }
    }
    ways[m][n]
}

fn fill_row(s: &str, t: &str, cap: u64) -> Vec<u64> {
    let t = t.as_bytes();
    let mut row = vec![0u64; t.len() + 1];
    row[0] = 1;
    for &ch in s.as_bytes() {
        // đi ngược để row[j - 1] vẫn là giá trị của hàng trước
        for j in (1..=t.len()).rev() {
            if ch == t[j - 1] {
                row[j] = (row[j] + row[j - 1]).min(cap);
            }
        }
    }
    row
}

fn count_row(s: &str, t: &str, cap: u64) -> u64 {
    fill_row(s, t, cap)[t.len()]
}

fn all_match(s: &str, t: &str, expected: u64) -> bool {
    let mut calls = 0;
    count_table(s, t) == expected
        && count_row(s, t, CAP) == expected
        && count_search(s, t, true, &mut calls) == expected
        && (s.len() > 20 || count_search(s, t, false, &mut calls) == expected)
}

fn count_oracle(s: &str, t: &str) -> u64 {
    let bytes = s.as_bytes();
    (0..1usize << s.len())
        .filter(|mask| {
            let picked: Vec<u8> = (0..s.len()).filter(|k| mask >> k & 1 == 1).map(|k| bytes[k]).collect();
            picked == t.as_bytes()
        })
        .count() as u64
}

fn strings_of(size: usize) -> Vec<String> {
    (0..1usize << size)
        .map(|mask| (0..size).rev().map(|k| if mask >> k & 1 == 1 { 'b' } else { 'a' }).collect())
        .collect()
}

fn main() {
    let a = |count: usize| "a".repeat(count);
    let cases: Vec<(String, String, u64)> = vec![
        ("banana".into(), "ban".into(), 3),
        ("banana".into(), "ana".into(), 4),
        ("aaa".into(), "aa".into(), 3),
        ("ab".into(), "abc".into(), 0),
        ("abc".into(), "d".into(), 0),
        ("Aa".into(), "a".into(), 1),
        ("mississippi".into(), "sip".into(), 12),
        (a(1000), a(3), 166167000),
        (a(1000), a(1000), 1),
        (a(1000), a(499) + "b", 0),
        ("ab".repeat(100), "abab".into(), 4249575),
    ];
    for (s, t, expected) in &cases {
        assert!(all_match(s, t, *expected), "Ca kiểm tra sai");
    }
    println!("{0}/{0} ca đúng", cases.len());

    let targets: Vec<String> = (1..=3).flat_map(strings_of).collect();
    let mut probes = 0;
    for size in 0..8 {
        for s in strings_of(size) {
            for t in &targets {
                let expected = count_oracle(&s, t);
                assert!(
                    all_match(&s, t, expected) && count_row(&s, t, 3) == expected.min(3),
                    "Ca vét đối chiếu sai"
                );
                probes += 1;
            }
        }
    }
    println!("{0}/{0} ca đúng (vét mọi tập vị trí)", probes);

    let row = fill_row(&a(1000), &(a(499) + "b"), CAP);
    let full = row.iter().filter(|&&value| value == CAP).count();
    println!("Hàng cuối: {}/{} ô chạm 2^31, đáp án {}", full, row.len(), row[500]);
}
