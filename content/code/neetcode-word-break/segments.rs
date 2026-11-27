fn search_word_break(s: &[u8], words: &[&str], i: usize, cache: &mut [Option<bool>]) -> bool {
    if i == s.len() {
        return true;
    }
    if let Some(Some(saved)) = cache.get(i).copied() {
        return saved;
    }
    let found = words.iter().any(|word| {
        s[i..].starts_with(word.as_bytes()) && search_word_break(s, words, i + word.len(), cache)
    });
    if let Some(entry) = cache.get_mut(i) {
        *entry = Some(found);
    }
    found
}

fn word_break_dp(s: &str, words: &[&str]) -> bool {
    let bytes = s.as_bytes();
    let mut reachable = vec![false; bytes.len() + 1];
    reachable[0] = true;
    for i in 0..bytes.len() {
        if !reachable[i] {
            continue;
        }
        for word in words {
            if bytes[i..].starts_with(word.as_bytes()) {
                reachable[i + word.len()] = true;
            }
        }
    }
    reachable[bytes.len()]
}

fn main() {
    let max_word = "abcdefghijklmnopqrst";
    let repeated_word = max_word.repeat(15);
    let late_failure = "a".repeat(18) + "b";
    let long_failure = "a".repeat(299) + "b";
    let cases: [(&str, &[&str], bool); 11] = [
        ("cabin", &["cab", "ca", "bin"], true),
        ("cabin", &["cab", "bin"], false),
        ("cabin", &["c", "ca", "bin"], true),
        ("mintminttea", &["mint", "tea"], true),
        ("teas", &["teashop", "tea", "s"], true),
        ("s", &["ss"], false),
        ("bot", &["bot"], true),
        ("ababab", &["ab", "aba"], true),
        (&late_failure, &["a", "aa"], false),
        (&repeated_word, &[max_word], true),
        (&long_failure, &["a", "aa"], false),
    ];
    for (s, words, expected) in cases {
        assert_eq!(word_break_dp(s, words), expected);
        assert_eq!(
            search_word_break(s.as_bytes(), words, 0, &mut vec![None; s.len()]),
            expected
        );
        if s.len() <= 20 {
            assert_eq!(search_word_break(s.as_bytes(), words, 0, &mut []), expected);
        }
    }
    println!("{0}/{0} ca đúng", cases.len());
}
