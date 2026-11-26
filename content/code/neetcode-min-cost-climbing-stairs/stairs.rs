fn brute(
    i: usize,
    add: &impl Fn(usize) -> i32,
    choose: &impl Fn(i32, i32) -> i32,
    base: i32,
) -> i32 {
    if i < 2 {
        return base;
    }
    choose(
        brute(i - 1, add, choose, base) + add(i - 1),
        brute(i - 2, add, choose, base) + add(i - 2),
    )
}

fn check(
    n: usize,
    add: impl Fn(usize) -> i32,
    choose: impl Fn(i32, i32) -> i32,
    base: i32,
    expected: i32,
    small: bool,
) {
    if small {
        assert_eq!(brute(n, &add, &choose, base), expected);
    }
    let mut dp = vec![base; n + 1];
    let (mut two_back, mut one_back) = (base, base);
    for i in 2..=n {
        dp[i] = choose(dp[i - 1] + add(i - 1), dp[i - 2] + add(i - 2));
        (two_back, one_back) = (
            one_back,
            choose(one_back + add(i - 1), two_back + add(i - 2)),
        );
    }
    assert_eq!(dp[n], expected);
    assert_eq!(one_back, expected);
}

fn main() {
    let cases: [(&[i32], i32); 5] = [
        (&[6, 2, 8, 1], 3),
        (&[19, 4], 4),
        (&[0, 0, 0, 0], 0),
        (&[5, 0, 9, 0, 3], 0),
        (&[999; 1000], 499500),
    ];
    for &(input, expected) in &cases {
        check(
            input.len(),
            |i| input[i],
            i32::min,
            0,
            expected,
            input.len() <= 18,
        );
    }
    println!("{0}/{0} ca đúng", cases.len());
}
