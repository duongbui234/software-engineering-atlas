fn maximum_product(values: &[i32]) -> i32 {
    let (mut high, mut low, mut best) = (values[0], values[0], values[0]);
    for &x in &values[1..] {
        let (extend_high, extend_low) = (high * x, low * x);
        high = x.max(extend_high).max(extend_low);
        low = x.min(extend_high).min(extend_low);
        best = best.max(high);
    }
    best
}

fn maximum_by_intervals(nums: &[i32]) -> i32 {
    let mut best = nums[0];
    for left in 0..nums.len() {
        let mut product = 1;
        for &value in &nums[left..] {
            product *= value;
            best = best.max(product);
        }
    }
    best
}

fn main() {
    check(maximum_product(&[-2, 3, -4]), 24);
    check(maximum_by_intervals(&[-2, 3, -4]), 24);
    check(maximum_product(&[-3]), -3);
    check(maximum_by_intervals(&[-3]), -3);
    check(maximum_product(&[-2, -3, -4]), 12);
    check(maximum_by_intervals(&[-2, -3, -4]), 12);
    check(maximum_product(&[0, -2, 0, -3, -4]), 12);
    check(maximum_by_intervals(&[0, -2, 0, -3, -4]), 12);
    check(maximum_product(&[0, -3, 0]), 0);
    check(maximum_by_intervals(&[0, -3, 0]), 0);
    check(maximum_product(&[1]), 1);
    check(maximum_by_intervals(&[1]), 1);
    check(maximum_product(&[2, 3, 0, -2, -4]), 8);
    check(maximum_by_intervals(&[2, 3, 0, -2, -4]), 8);
    println!("7/7 ca đúng");
}

fn check(got: i32, want: i32) {
    assert_eq!(got, want);
}
