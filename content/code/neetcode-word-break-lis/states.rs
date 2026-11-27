fn word_break(s: &str, words: &[&str]) -> bool {
    let bytes = s.as_bytes();
    let mut reachable = vec![false; bytes.len() + 1];
    reachable[0] = true;
    for start in 0..bytes.len() {
        if !reachable[start] {
            continue;
        }
        for word in words {
            if bytes[start..].starts_with(word.as_bytes()) {
                reachable[start + word.len()] = true;
            }
        }
    }
    reachable[bytes.len()]
}

fn lis_length(nums: &[i32]) -> usize {
    let mut tails = Vec::new();
    for &value in nums {
        let i = tails.partition_point(|&tail| tail < value);
        if i == tails.len() {
            tails.push(value);
        } else {
            tails[i] = value;
        }
    }
    tails.len()
}

fn main() {
    let storage: Vec<String> = (1..=20).map(|i| "a".repeat(i)).collect();
    let prefixes: Vec<&str> = storage.iter().map(String::as_str).collect();
    let increasing: Vec<i32> = (-1250..1250).collect();
    let checks = [
        word_break("atlasroute", &["at", "atlas", "route"]),
        word_break("trailtrail", &["trail"]),
        !word_break("mapz", &["ma", "map", "ap"]),
        word_break("ababa", &["aba", "ab"]),
        !word_break(&("a".repeat(299) + "b"), &prefixes),
        word_break(&"a".repeat(300), &[&"a".repeat(20)]),
        word_break("survey", &["survey"]),
        !word_break("map", &["mapping"]),
        lis_length(&[-5, -3, -1, 0]) == 4,
        lis_length(&[10, 8, 6, 4]) == 1,
        lis_length(&[7, 7, 7]) == 1,
        lis_length(&[3, 5, 6, 2, 4]) == 3,
        lis_length(&[4, 4, 1, 2, 2, 3]) == 3,
        lis_length(&[6, 8, 2, 3, 5, 9]) == 4,
        lis_length(&increasing) == 2500,
        lis_length(&[-10000; 2500]) == 1,
    ];
    for (i, ok) in checks.iter().enumerate() {
        assert!(ok, "Ca kiểm tra sai: {}", i + 1);
    }
    println!("{0}/{0} ca đúng", checks.len());
}
