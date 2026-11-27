fn can_partition(nums: &[usize]) -> bool {
    let sum: usize = nums.iter().sum();
    if sum % 2 != 0 {
        return false;
    }
    let goal = sum / 2;
    let mut reachable = vec![false; goal + 1];
    reachable[0] = true;
    for &x in nums {
        for s in (x..=goal).rev() {
            reachable[s] |= reachable[s - x];
        }
    }
    reachable[goal]
}

fn min_coins(coins: &[usize], amount: usize) -> i32 {
    let mut best = vec![amount + 1; amount + 1];
    best[0] = 0;
    for &coin in coins {
        for s in coin..=amount {
            best[s] = best[s].min(best[s - coin] + 1);
        }
    }
    if best[amount] == amount + 1 {
        -1
    } else {
        best[amount] as i32
    }
}

fn coin_combinations(coins: &[usize], amount: usize) -> i32 {
    let mut ways = vec![0_i32; amount + 1];
    ways[0] = 1;
    for &coin in coins {
        for s in coin..=amount {
            ways[s] = ways[s].saturating_add(ways[s - coin]);
        }
    }
    ways[amount]
}

fn count_by_subset(nums: &[i32], target: i32) -> i32 {
    let sum: i32 = nums.iter().sum();
    let twice = sum - target;
    if target.abs() > sum || twice % 2 != 0 {
        return 0;
    }
    let goal = (twice / 2) as usize;
    let mut ways = vec![0; goal + 1];
    ways[0] = 1;
    for &x in nums {
        let x = x as usize;
        for s in (x..=goal).rev() {
            ways[s] += ways[s - x];
        }
    }
    ways[goal]
}

fn main() {
    let mut many_even_coins: Vec<_> = (2..=598).step_by(2).collect();
    many_even_coins.push(4999);
    let checks = [
        can_partition(&[4, 4, 6, 2]),
        !can_partition(&[2, 3, 7]),
        min_coins(&[1, 4, 6], 8) == 2,
        min_coins(&[4, 6], 7) == -1,
        min_coins(&[2147483647], 0) == 0,
        coin_combinations(&[2, 3, 4], 7) == 2,
        coin_combinations(&[4, 6], 0) == 1,
        coin_combinations(&many_even_coins, 4999) == 1,
        count_by_subset(&[0, 0, 2, 3], -1) == 4,
        count_by_subset(&[2, 5], 0) == 0,
    ];
    assert!(checks.iter().all(|x| *x));
    println!("{0}/{0} ca đúng", checks.len());
}
