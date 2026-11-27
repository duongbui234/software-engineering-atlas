fn brute(nums: &[usize], target: usize) -> bool {
    if target == 0 {
        return true;
    }
    let Some((&x, rest)) = nums.split_first() else {
        return false;
    };
    (target >= x && brute(rest, target - x)) || brute(rest, target)
}

fn table(nums: &[usize], target: usize) -> bool {
    let mut rows = vec![vec![false; target + 1]; nums.len() + 1];
    rows[0][0] = true;
    for (i, &x) in nums.iter().enumerate() {
        for sum in 0..=target {
            rows[i + 1][sum] = rows[i][sum] || (sum >= x && rows[i][sum - x]);
        }
    }
    rows[nums.len()][target]
}

fn descending(nums: &[usize], target: usize) -> bool {
    let mut reachable = vec![false; target + 1];
    reachable[0] = true;
    for &x in nums {
        for sum in (x..=target).rev() {
            reachable[sum] |= reachable[sum - x];
        }
    }
    reachable[target]
}

fn bitset(nums: &[usize], target: usize) -> bool {
    let mut words = vec![0u32; target / 32 + 1];
    words[0] = 1;
    for &x in nums {
        let (offset, shift) = (x / 32, x % 32);
        for dst in (offset..words.len()).rev() {
            let src = dst - offset;
            let mut moved = words[src] << shift;
            if shift != 0 && src > 0 {
                moved |= words[src - 1] >> (32 - shift);
            }
            words[dst] |= moved;
        }
    }
    words[target / 32] & (1 << (target % 32)) != 0
}

fn main() {
    let limits = [100; 200];
    let mut impossible = limits;
    impossible[199] = 98;
    let cases: &[(&[usize], bool)] = &[
        (&[8], false),
        (&[2, 2], true),
        (&[3, 6, 7, 10], true),
        (&[2, 3, 7], false),
        (&[1, 4, 8], false),
        (&[2, 2, 2], false),
        (&[31, 31], true),
        (&[32, 32], true),
        (&[33, 33], true),
        (&[31, 2, 30, 3], true),
        (&[32, 1, 17, 16], true),
        (&[33, 31, 30, 34], true),
        (&[63, 2, 33, 32], true),
        (&[100, 40, 40], false),
        (&limits, true),
        (&impossible, false),
    ];
    let solvers: [fn(&[usize], usize) -> bool; 3] = [table, descending, bitset];
    for &(nums, expected) in cases {
        let total: usize = nums.iter().sum();
        for solve in solvers {
            assert_eq!(total % 2 == 0 && solve(nums, total / 2), expected);
        }
        if nums.len() < 20 {
            assert_eq!(total % 2 == 0 && brute(nums, total / 2), expected);
        }
    }
    println!("{0}/{0} ca đúng", cases.len());
}
