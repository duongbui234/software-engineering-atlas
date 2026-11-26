fn find_duplicate(nums: &[usize]) -> usize {
    let (mut slow, mut fast) = (0, 0);
    loop {
        slow = nums[slow];
        fast = nums[nums[fast]];
        if slow == fast {
            break;
        }
    }
    let mut entry = 0;
    while entry != slow {
        entry = nums[entry];
        slow = nums[slow];
    }
    entry
}

fn main() {
    let cases: &[(&[usize], usize)] = &[
        (&[1, 3, 4, 2, 2], 2),
        (&[3, 1, 3, 4, 2], 3),
        (&[3, 3, 3, 3, 3], 3),
        (&[1, 1], 1),
        (&[1, 2, 3, 4, 4], 4),
    ];
    for &(nums, expected) in cases {
        assert_eq!(find_duplicate(nums), expected);
    }
    println!("{0}/{0} ca đúng", cases.len());
}
