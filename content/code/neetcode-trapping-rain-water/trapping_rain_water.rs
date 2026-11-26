fn trap(height: &[i32]) -> i32 {
    let (mut left, mut right) = (0, height.len()); // [left, right)
    let (mut left_max, mut right_max, mut water) = (0, 0, 0);
    while left < right {
        if left_max <= right_max {
            left_max = left_max.max(height[left]);
            water += left_max - height[left];
            left += 1;
        } else {
            right -= 1;
            right_max = right_max.max(height[right]);
            water += right_max - height[right];
        }
    }
    water
}

fn main() {
    let cases: &[(&[i32], i32)] = &[
        (&[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1], 6),
        (&[4, 2, 0, 3, 2, 5], 9),
        (&[], 0),
        (&[3, 0, 3], 3),
        (&[3, 2, 1], 0),
    ];
    for &(height, expected) in cases {
        assert_eq!(trap(height), expected);
    }
    println!("{0}/{0} ca đúng", cases.len());
}
