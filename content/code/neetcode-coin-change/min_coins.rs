fn min_coins(coins: &[usize], amount: usize) -> i32 {
    let impossible = amount + 1;
    let mut dp = vec![impossible; amount + 1];
    dp[0] = 0;

    for &coin in coins {
        for sum in coin..=amount {
            dp[sum] = dp[sum].min(dp[sum - coin] + 1);
        }
    }
    if dp[amount] == impossible {
        -1
    } else {
        dp[amount] as i32
    }
}

fn by_amount(coins: &[usize], amount: usize) -> i32 {
    let impossible = amount + 1;
    let mut dp = vec![impossible; amount + 1];
    dp[0] = 0;

    for sum in 1..=amount {
        for &coin in coins {
            if coin <= sum {
                dp[sum] = dp[sum].min(dp[sum - coin] + 1);
            }
        }
    }
    if dp[amount] == impossible {
        -1
    } else {
        dp[amount] as i32
    }
}

fn visit(
    coins: &[usize],
    remaining: usize,
    impossible: usize,
    memo: &mut Option<Vec<Option<usize>>>,
    calls: &mut usize,
) -> usize {
    *calls += 1;
    if remaining == 0 {
        return 0;
    }
    if let Some(value) = memo.as_ref().and_then(|cache| cache[remaining]) {
        return value;
    }
    let mut best = impossible;
    for &coin in coins {
        if coin <= remaining {
            best = best.min(visit(coins, remaining - coin, impossible, memo, calls) + 1);
        }
    }
    if let Some(cache) = memo {
        cache[remaining] = Some(best);
    }
    best
}

fn search(coins: &[usize], amount: usize, use_memo: bool) -> (i32, usize) {
    let impossible = amount + 1;
    let mut memo = use_memo.then(|| vec![None; amount + 1]);
    let mut calls = 0;
    let best = visit(coins, amount, impossible, &mut memo, &mut calls);
    (if best == impossible { -1 } else { best as i32 }, calls)
}

fn main() {
    let cases: [(&[usize], usize, i32); 10] = [
        (&[4, 7], 14, 2),
        (&[4, 7], 13, -1),
        (&[1, 5, 7], 10, 2),
        (&[1], 10000, 10000),
        (&[2147483647, 3], 9, 3),
        (&[8, 9], 0, 0),
        (&[4, 6], 7, -1),
        (&[9, 4], 12, 3),
        (&[14, 21], 28, 2),
        (&[10, 15, 25], 30, 2),
    ];
    for &(coins, amount, want) in &cases {
        assert_eq!(min_coins(coins, amount), want);
        assert_eq!(by_amount(coins, amount), want);
        if amount <= 30 {
            assert_eq!(search(coins, amount, false).0, want);
            assert_eq!(search(coins, amount, true).0, want);
        }
    }
    println!("{0}/{0} ca đúng", cases.len());

    let (brute, brute_calls) = search(&[4, 6, 9], 36, false);
    let (memoized, memo_calls) = search(&[4, 6, 9], 36, true);
    assert_eq!(brute, 4);
    assert_eq!(memoized, brute);
    println!("A=36: vét cạn {brute_calls}, memo {memo_calls} lượt gọi");
}
