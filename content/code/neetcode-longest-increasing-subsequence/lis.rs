fn lis_by_brute(nums: &[i32], last: Option<i32>) -> usize {
    let Some((&x, rest)) = nums.split_first() else {
        return 0;
    };
    let skip = lis_by_brute(rest, last);
    if last.is_none_or(|value| value < x) {
        skip.max(1 + lis_by_brute(rest, Some(x)))
    } else {
        skip
    }
}

fn lis_by_endpoint(nums: &[i32]) -> usize {
    let mut longest = vec![1; nums.len()];
    let mut best = 0;
    for (i, &x) in nums.iter().enumerate() {
        for j in 0..i {
            if nums[j] < x {
                longest[i] = longest[i].max(longest[j] + 1);
            }
        }
        best = best.max(longest[i]);
    }
    best
}

fn lis_by_tails(nums: &[i32]) -> usize {
    let mut tails = Vec::new();
    for &x in nums {
        let (mut lo, mut hi) = (0, tails.len());
        while lo < hi {
            let mid = lo + (hi - lo) / 2;
            if tails[mid] < x {
                lo = mid + 1;
            } else {
                hi = mid;
            }
        }
        if lo == tails.len() {
            tails.push(x);
        } else {
            tails[lo] = x;
        }
    }
    tails.len()
}

fn main() {
    let ascending: Vec<i32> = (-1250..1250).collect();
    let descending: Vec<i32> = ascending.iter().copied().rev().collect();
    let cases: [(&[i32], usize); 12] = [
        (&[], 0),
        (&[-10000], 1),
        (&[4, 8, 1, 6, 9, 2], 3),
        (&[1, 4, 9, -1], 3),
        (&[3, 3, 3, 3], 1),
        (&[8, 6, 4, 2], 1),
        (&[-10000, -2, 0, 10000], 4),
        (&[1, 3, 3, 8], 3),
        (&[-3, -1, -2, 0], 3),
        (&[2, 6, 3, 4, 1, 5], 4),
        (&ascending, 2500),
        (&descending, 1),
    ];
    for (nums, want) in cases {
        assert_eq!(lis_by_endpoint(nums), want);
        assert_eq!(lis_by_tails(nums), want);
        if nums.len() <= 10 {
            assert_eq!(lis_by_brute(nums, None), want);
        }
    }
    println!("{0}/{0} ca đúng", cases.len());
}
