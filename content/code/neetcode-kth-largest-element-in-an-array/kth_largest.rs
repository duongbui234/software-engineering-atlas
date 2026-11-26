use std::cmp::Reverse;
use std::collections::BinaryHeap;

fn find_kth_largest(nums: &[i32], k: usize) -> i32 {
    let mut top: BinaryHeap<_> = nums[..k].iter().copied().map(Reverse).collect();
    for &num in &nums[k..] {
        let mut smallest = top.peek_mut().unwrap();
        if num > smallest.0 {
            *smallest = Reverse(num);
        }
    }
    top.peek().unwrap().0
}

fn main() {
    let cases = [
        (vec![3, 2, 1, 5, 6, 4], 2, 5),
        (vec![3, 2, 3, 1, 2, 4, 5, 5, 6], 4, 4),
        (vec![-5, -1, -2], 1, -1),
        (vec![-10000, 10000], 2, -10000),
        (vec![2, 2, 2, 2], 3, 2),
        (vec![42], 1, 42),
    ];
    let count = cases.len();
    for (nums, k, expected) in cases {
        assert_eq!(find_kth_largest(&nums, k), expected, "{nums:?}, k = {k}");
    }
    println!("{count}/{count} ca đúng");
}
