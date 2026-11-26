fn max_area(height: &[i32]) -> i32 {
    let (mut left, mut right) = (0, height.len().saturating_sub(1));
    let mut best = 0;
    while left < right {
        best = best.max((right - left) as i32 * height[left].min(height[right]));
        if height[left] < height[right] {
            left += 1;
        } else {
            right -= 1;
        }
    }
    best
}

fn main() {
    let cases: &[(&[i32], i32)] = &[
        (&[1, 8, 6, 2, 5, 4, 8, 3, 7], 49),
        (&[1, 1], 1),
        (&[4, 0, 4], 8),
        (&[1, 2, 3, 4], 4),
    ];
    for &(input, expected) in cases {
        assert_eq!(max_area(input), expected);
    }
    println!("{0}/{0} ca đúng", cases.len());
}
