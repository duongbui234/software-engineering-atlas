fn count_stairs(n: usize) -> i32 {
    let (mut older, mut latest) = (1, 1);
    for _ in 2..=n {
        (older, latest) = (latest, older + latest);
    }
    latest
}

fn cheapest_stairs(cost: &[i32]) -> i32 {
    let (mut older, mut latest) = (0, 0);
    for i in 2..=cost.len() {
        (older, latest) = (latest, (latest + cost[i - 1]).min(older + cost[i - 2]));
    }
    latest
}

fn rob_range(nums: &[i32]) -> i32 {
    let (mut older, mut latest) = (0, 0);
    for &x in nums {
        (older, latest) = (latest, latest.max(older + x));
    }
    latest
}

fn rob_ring(nums: &[i32]) -> i32 {
    if nums.len() == 1 {
        return nums[0];
    }
    rob_range(&nums[..nums.len() - 1]).max(rob_range(&nums[1..]))
}

fn decode(s: &[u8]) -> i32 {
    let (mut older, mut latest) = (1, i32::from(s[0] != b'0'));
    for pair in s.windows(2) {
        let value = (pair[0] - b'0') * 10 + pair[1] - b'0';
        let single = if pair[1] != b'0' { latest } else { 0 };
        let double = if (10..=26).contains(&value) { older } else { 0 };
        let next = single.saturating_add(double);
        (older, latest) = (latest, next);
    }
    latest
}

fn max_product(nums: &[i32]) -> i32 {
    let (mut high, mut low, mut best) = (nums[0], nums[0], nums[0]);
    for &x in &nums[1..] {
        (high, low) = (x.max(x * high).max(x * low), x.min(x * high).min(x * low));
        best = best.max(high);
    }
    best
}

fn main() {
    let checks = [
        count_stairs(6) == 13,
        cheapest_stairs(&[6, 2, 8, 1]) == 3,
        rob_range(&[4, 1, 1, 7, 2]) == 11,
        rob_ring(&[9, 1, 1, 9]) == 10,
        rob_ring(&[7]) == 7,
        decode(b"127") == 2,
        decode(&[&[b'1'; 60][..], b"00"].concat()) == 0,
        decode(b"100") == 0,
        max_product(&[-3, 2, -4]) == 24,
        max_product(&[-2, 0, -1]) == 0,
    ];
    assert!(checks.iter().all(|ok| *ok));
    println!("{0}/{0} ca đúng", checks.len());
}
