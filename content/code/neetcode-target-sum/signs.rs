use std::collections::HashMap;

fn enumerate_signs(nums: &[i32], target: i32) -> i32 {
    match nums.split_first() {
        None => i32::from(target == 0),
        Some((&x, rest)) => enumerate_signs(rest, target - x) + enumerate_signs(rest, target + x),
    }
}

fn count_by_signed_sum(nums: &[i32], target: i32) -> i32 {
    let mut ways = HashMap::from([(0, 1)]);
    for &x in nums {
        let mut next = HashMap::new();
        for (sum, count) in ways {
            *next.entry(sum + x).or_insert(0) += count;
            *next.entry(sum - x).or_insert(0) += count;
        }
        ways = next;
    }
    ways.get(&target).copied().unwrap_or(0)
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
    let cases: [(&[i32], i32, i32); 11] = [
        (&[1, 2, 5], 4, 1),
        (&[0, 0, 2, 3], 1, 4),
        (&[0, 0, 2, 3], -1, 4),
        (&[2, 5], 0, 0),
        (&[2, 5], 8, 0),
        (&[2, 5], -8, 0),
        (&[3, 3, 3, 3], 0, 6),
        (&[1000], -1000, 1),
        (&[0], 0, 2),
        (&[0; 20], 0, 1048576),
        (&[1; 16], 0, 12870),
    ];
    for (nums, target, want) in cases {
        assert_eq!(count_by_signed_sum(nums, target), want);
        assert_eq!(count_by_subset(nums, target), want);
        if nums.len() <= 16 {
            assert_eq!(enumerate_signs(nums, target), want);
        }
    }
    println!("{0}/{0} ca đúng", cases.len());
}
