#[derive(Default)]
struct Stats {
    start: usize,
    length: usize,
    count: usize,
}

fn palindromes(text: &str, reuse_mirror: bool) -> Stats {
    let bytes = text.as_bytes();
    let last = 2 * bytes.len();
    let mut radius = if reuse_mirror {
        vec![0; last + 1]
    } else {
        Vec::new()
    };
    let (mut center, mut right) = (0, 0);
    let mut answer = Stats::default();

    for i in 0..=last {
        let mut length = if reuse_mirror && i < right {
            radius[2 * center - i].min(right - i)
        } else {
            0
        };
        while i > length && i + length < last {
            let (left, next) = (i - length - 1, i + length + 1);
            if left % 2 != 0 && bytes[left / 2] != bytes[next / 2] {
                break;
            }
            length += 1;
        }
        if reuse_mirror {
            radius[i] = length;
            if i + length > right {
                (center, right) = (i, i + length);
            }
        }
        if length > answer.length {
            (answer.start, answer.length) = ((i - length) / 2, length);
        }
        answer.count += (length + 1) / 2;
    }
    answer
}

fn longest_palindrome(text: &str, reuse_mirror: bool) -> &str {
    let result = palindromes(text, reuse_mirror);
    &text[result.start..result.start + result.length]
}

// TESTS
fn main() {
    let long = "a".repeat(1000);
    let cases = [
        ("", ""),
        ("c", "c"),
        ("xabbaq", "abba"),
        ("tacocatx", "tacocat"),
        ("abab", "aba"),
        ("zzzz", "zzzz"),
        ("xyz", "x"),
        (&long, &long),
    ];
    for (text, expected) in cases {
        assert_eq!(longest_palindrome(text, false), expected);
        assert_eq!(longest_palindrome(text, true), expected);
    }
    println!("{0}/{0} ca đúng", cases.len());
}
