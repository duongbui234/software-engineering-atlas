fn least_interval(tasks: &[u8], cooldown: usize) -> usize {
    if tasks.is_empty() {
        return 0;
    }
    let mut counts = [0; 26];
    for &task in tasks {
        counts[usize::from(task - b'A')] += 1;
    }
    let most = *counts.iter().max().unwrap();
    let leaders = counts.iter().filter(|&&count| count == most).count();
    tasks.len().max((most - 1) * (cooldown + 1) + leaders)
}

fn main() {
    let cases: &[(&[u8], usize, usize)] = &[
        (b"AAABBB", 2, 8),
        (b"ACABDB", 1, 6),
        (b"AAABBB", 3, 10),
        (b"AAABBB", 0, 6),
        (b"ABBB", 1, 5),
        (b"AAAAAABCDEFG", 2, 16),
        (b"AABBCCDD", 2, 8),
        (b"AAABBBCCCDDE", 2, 12),
        (b"AAAB", 3, 9),
        (b"A", 100, 1),
    ];
    for &(tasks, cooldown, expected) in cases {
        assert_eq!(
            least_interval(tasks, cooldown),
            expected,
            "{tasks:?}, n = {cooldown}"
        );
    }
    println!("{0}/{0} ca đúng", cases.len());
}
