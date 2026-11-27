fn enumerate_counts(amount: usize, coins: &[usize]) -> i32 {
    let Some((&coin, others)) = coins.split_first() else {
        return i32::from(amount == 0);
    };
    (0..=amount / coin)
        .map(|copies| enumerate_counts(amount - copies * coin, others))
        .sum()
}

fn count_table(amount: usize, coins: &[usize]) -> i32 {
    let mut first = vec![0_i32; amount + 1];
    first[0] = 1;
    let mut rows = vec![first];
    for &coin in coins {
        let previous = &rows[rows.len() - 1];
        let mut current = previous.clone();
        for total in coin..=amount {
            current[total] = previous[total].saturating_add(current[total - coin]);
        }
        rows.push(current);
    }
    rows[coins.len()][amount]
}

fn count_combinations(amount: usize, coins: &[usize]) -> i32 {
    let mut ways = vec![0_i32; amount + 1];
    ways[0] = 1;
    for &coin in coins {
        for total in coin..=amount {
            ways[total] = ways[total].saturating_add(ways[total - coin]);
        }
    }
    ways[amount]
}

fn main() {
    let mut many: Vec<_> = (2..=598).step_by(2).collect();
    many.push(4999);
    let cases: [(usize, &[usize], i32); 10] = [
        (8, &[2, 3, 5], 3),
        (5, &[3, 2], 1),
        (10, &[5, 2, 3], 4),
        (7, &[6, 4], 0),
        (16, &[4], 1),
        (0, &[7, 11], 1),
        (2, &[3, 5000], 0),
        (4, &[2, 1], 3),
        (120, &[6, 1, 4, 9, 17], 4131),
        (4999, &many, 1),
    ];
    for (amount, coins, expected) in cases {
        assert_eq!(count_table(amount, coins), expected);
        assert_eq!(count_combinations(amount, coins), expected);
        if amount <= 20 {
            assert_eq!(enumerate_counts(amount, coins), expected);
        }
    }
    println!("{0}/{0} ca đúng", cases.len());
}
