use std::cmp::Reverse;
use std::collections::BinaryHeap;

#[derive(Default)]
struct MedianFinder {
    lower: BinaryHeap<i32>,
    upper: BinaryHeap<Reverse<i32>>,
}

impl MedianFinder {
    fn add_num(&mut self, num: i32) {
        self.lower.push(num);
        self.upper.push(Reverse(self.lower.pop().unwrap()));
        if self.lower.len() < self.upper.len() {
            self.lower.push(self.upper.pop().unwrap().0);
        }
    }

    fn find_median(&self) -> f64 {
        let lower = f64::from(*self.lower.peek().unwrap());
        if self.lower.len() > self.upper.len() {
            return lower;
        }
        let upper = f64::from(self.upper.peek().unwrap().0);
        (lower + upper) / 2.0
    }
}

fn main() {
    let cases: &[&[i32]] = &[
        &[1, 2, 3],
        &[7],
        &[5, 4, 3, 2, 1],
        &[1, 2, 3, 4, 5],
        &[7, 7, 7, 7],
        &[-1, -2, -3, -4, -5],
        &[9, -9, 8, -8, 7, -7, 6, -6, 5, -5, 0],
        &[-100000, 100000, -100000, 100000],
        &[i32::MIN, i32::MAX, i32::MAX],
    ];
    for &nums in cases {
        let mut finder = MedianFinder::default();
        let mut sorted = Vec::new();
        for &num in nums {
            finder.add_num(num);
            sorted.push(num);
            sorted.sort_unstable();
            let size = sorted.len();
            let expected = (f64::from(sorted[(size - 1) / 2]) + f64::from(sorted[size / 2])) / 2.0;
            assert_eq!(finder.find_median(), expected, "{sorted:?}");
        }
    }
    println!("{0}/{0} ca đúng", cases.len());
}
