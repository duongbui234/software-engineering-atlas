fn largest_rectangle_area(height: &[i32]) -> i32 {
    let mut stack: Vec<usize> = Vec::new();
    let mut best = 0;
    for (right, current) in height.iter().copied().chain(std::iter::once(0)).enumerate() {
        while stack.last().is_some_and(|&i| height[i] > current) {
            let h = height[stack.pop().unwrap()];
            let start = stack.last().map_or(0, |&i| i + 1);
            best = best.max(h * (right - start) as i32);
        }
        stack.push(right);
    }
    best
}

fn main() {
    let cases: &[(&[i32], i32)] = &[
        (&[2, 1, 5, 6, 2, 3], 10),
        (&[2, 4], 4),
        (&[4, 3, 2, 1], 6),
        (&[2, 2, 2], 6),
        (&[2, 0, 2], 2),
    ];
    for &(height, expected) in cases {
        assert_eq!(largest_rectangle_area(height), expected);
    }
    println!("{0}/{0} ca đúng", cases.len());
}
