type RangeSolver = fn(&[i32], usize, usize) -> i32;

fn rolling(nums: &[i32], start: usize, end: usize) -> i32 {
    let (mut two_back, mut one_back) = (0, 0);
    for &value in &nums[start..end] {
        (two_back, one_back) = (one_back, one_back.max(two_back + value));
    }
    one_back
}

fn table(nums: &[i32], start: usize, end: usize) -> i32 {
    let mut best = vec![0; end - start + 2];
    for (j, &value) in nums[start..end].iter().enumerate() {
        best[j + 2] = best[j + 1].max(best[j] + value);
    }
    best[best.len() - 1]
}

fn brute(nums: &[i32], i: usize, end: usize) -> i32 {
    if i >= end {
        return 0;
    }
    brute(nums, i + 1, end).max(nums[i] + brute(nums, i + 2, end))
}

fn rob(nums: &[i32], solve: RangeSolver) -> i32 {
    if nums.len() == 1 {
        return nums[0];
    }
    solve(nums, 0, nums.len() - 1).max(solve(nums, 1, nums.len()))
}

fn main() {
    let cases: &[(&[i32], i32)] = &[
        (&[8], 8),
        (&[0, 0, 0], 0),
        (&[8, 11, 8], 11),
        (&[9, 1, 1, 9], 10),
        (&[4, 9, 1, 8, 3, 7], 24),
        (&[10, 1], 10),
    ];
    let mut passed = 0;
    let methods: [RangeSolver; 3] = [brute, table, rolling];
    for &(nums, expected) in cases {
        for solve in methods {
            assert_eq!(rob(nums, solve), expected);
            passed += 1;
        }
    }
    for solve in &methods[1..] {
        assert_eq!(rob(&[3; 100], *solve), 150);
        passed += 1;
    }
    println!("{passed}/{} ca đúng", cases.len() * 3 + 2);
}
