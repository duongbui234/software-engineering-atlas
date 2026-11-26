fn decode_count(s: &str) -> i32 {
    let bytes = s.as_bytes();
    let (mut before_previous, mut previous) = (0_i32, 1_i32);
    for (i, &digit) in bytes.iter().enumerate() {
        let mut current = if digit == b'0' { 0 } else { previous };
        if i > 0 && (bytes[i - 1] == b'1' || (bytes[i - 1] == b'2' && digit <= b'6')) {
            current = current.saturating_add(before_previous);
        }
        if current == 0 {
            return 0;
        }
        (before_previous, previous) = (previous, current);
    }
    previous
}

fn decode_by_cuts(digits: &str, memoized: bool) -> i32 {
    fn visit(bytes: &[u8], index: usize, memo: &mut Option<Vec<Option<i32>>>) -> i32 {
        if index == bytes.len() {
            return 1;
        }
        if bytes[index] == b'0' {
            return 0;
        }
        if let Some(saved) = memo.as_ref().and_then(|values| values[index]) {
            return saved;
        }
        let mut count = visit(bytes, index + 1, memo);
        if index + 1 < bytes.len()
            && (bytes[index] == b'1' || (bytes[index] == b'2' && bytes[index + 1] <= b'6'))
        {
            count += visit(bytes, index + 2, memo);
        }
        if let Some(values) = memo.as_mut() {
            values[index] = Some(count);
        }
        count
    }
    visit(
        digits.as_bytes(),
        0,
        &mut memoized.then(|| vec![None; digits.len()]),
    )
}

fn main() {
    check(decode_count("11204"), 2);
    check(decode_by_cuts("11204", true), 2);
    check(decode_by_cuts("11204", false), 2);
    check(decode_count("27"), 1);
    check(decode_by_cuts("27", true), 1);
    check(decode_by_cuts("27", false), 1);
    check(decode_count("1010"), 1);
    check(decode_by_cuts("1010", true), 1);
    check(decode_by_cuts("1010", false), 1);
    check(decode_count("100"), 0);
    check(decode_by_cuts("100", true), 0);
    check(decode_by_cuts("100", false), 0);
    check(decode_count("07"), 0);
    check(decode_by_cuts("07", true), 0);
    check(decode_by_cuts("07", false), 0);
    check(decode_count("1234"), 3);
    check(decode_by_cuts("1234", true), 3);
    check(decode_by_cuts("1234", false), 3);
    check(decode_count("301"), 0);
    check(decode_by_cuts("301", true), 0);
    check(decode_by_cuts("301", false), 0);
    check(decode_count("9"), 1);
    check(decode_by_cuts("9", true), 1);
    check(decode_by_cuts("9", false), 1);
    check(decode_count("0"), 0);
    check(decode_by_cuts("0", true), 0);
    check(decode_by_cuts("0", false), 0);
    check(decode_count("1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111300"), 0);
    check(decode_by_cuts("1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111300", true), 0);
    println!("10/10 ca đúng");
}

fn check(got: i32, want: i32) {
    assert_eq!(got, want);
}
