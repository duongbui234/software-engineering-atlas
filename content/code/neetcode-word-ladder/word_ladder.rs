use std::collections::{HashSet, VecDeque};

fn ladder_length(begin: &str, end: &str, words: &[&str]) -> usize {
    let mut unseen: HashSet<_> = words.iter().map(|word| word.as_bytes()).collect();
    if !unseen.contains(end.as_bytes()) {
        return 0;
    }
    unseen.remove(begin.as_bytes());
    let mut queue = VecDeque::from([(begin.as_bytes().to_vec(), 1)]);
    while let Some((mut word, distance)) = queue.pop_front() {
        if word == end.as_bytes() {
            return distance;
        }
        for i in 0..word.len() {
            let original = word[i];
            for letter in b'a'..=b'z' {
                word[i] = letter;
                if unseen.remove(word.as_slice()) {
                    queue.push_back((word.clone(), distance + 1));
                }
            }
            word[i] = original;
        }
    }
    0
}

fn main() {
    let cases: &[(&str, &str, &[&str], usize)] = &[
        ("hit", "cog", &["hot", "dot", "dog", "lot", "log", "cog"], 5),
        ("hit", "cog", &["hot", "dot", "dog", "lot", "log"], 0),
        ("hit", "cog", &["cog", "cat"], 0),
        ("a", "c", &["a", "b", "c"], 2),
        ("aaa", "bbb", &["aab", "aba", "abb", "bbb", "aaa"], 4),
    ];
    for &(begin, end, words, expected) in cases {
        assert_eq!(ladder_length(begin, end, words), expected);
    }
    println!("{0}/{0} ca đúng", cases.len());
}
