// LeetCode 703, Kth Largest Element in a Stream: sắp lại mỗi lần, min-heap k chỗ (BinaryHeap + Reverse), bản sai quên Reverse.
// Chạy: rustc --edition 2021 -O kth_largest_stream.rs && ./kth_largest_stream
use std::cmp::Reverse;
use std::collections::BinaryHeap;

trait Stream {
    fn add(&mut self, val: i32) -> i32;
}

// Cách thẳng: giữ mọi số, mỗi lần add thì sắp lại và đọc ô thứ k từ cuối. O(n log n) mỗi lần add.
struct SortEachAdd {
    k: usize,
    nums: Vec<i32>,
}

impl SortEachAdd {
    fn new(k: i32, nums: Vec<i32>) -> Self {
        SortEachAdd { k: k as usize, nums }
    }
}

impl Stream for SortEachAdd {
    fn add(&mut self, val: i32) -> i32 {
        self.nums.push(val);
        self.nums.sort_unstable();
        self.nums[self.nums.len() - self.k]
    }
}

// Min-heap k chỗ. BinaryHeap của Rust là max-heap; bọc Reverse để số nhỏ nhất nằm ở đỉnh.
struct KthLargest {
    k: usize,
    heap: BinaryHeap<Reverse<i32>>,
}

impl KthLargest {
    fn new(k: i32, nums: Vec<i32>) -> Self {
        let mut s = KthLargest { k: k as usize, heap: BinaryHeap::with_capacity(k as usize + 1) };
        for x in nums {
            s.add(x);
        }
        s
    }
}

impl Stream for KthLargest {
    fn add(&mut self, val: i32) -> i32 {
        if self.heap.len() < self.k {
            self.heap.push(Reverse(val));
        } else if let Some(mut top) = self.heap.peek_mut() {
            // peek_mut cho sửa đỉnh tại chỗ; khi `top` ra khỏi phạm vi, heap tự cho nó chìm xuống một lần.
            if val > top.0 {
                *top = Reverse(val);
            }
        }
        self.heap.peek().unwrap().0 // đề hứa luôn có đủ k số khi gọi add, nên đỉnh tồn tại
    }
}

// SAI: quên Reverse. BinaryHeap<i32> là max-heap: pop bỏ số lớn nhất, giữ k số nhỏ nhất.
struct NoReverseKthLargest {
    k: usize,
    heap: BinaryHeap<i32>,
}

impl NoReverseKthLargest {
    fn new(k: i32, nums: Vec<i32>) -> Self {
        let mut s = NoReverseKthLargest { k: k as usize, heap: BinaryHeap::new() };
        for x in nums {
            s.add(x);
        }
        s
    }
}

impl Stream for NoReverseKthLargest {
    fn add(&mut self, val: i32) -> i32 {
        self.heap.push(val);
        if self.heap.len() > self.k {
            self.heap.pop();
        }
        *self.heap.peek().unwrap()
    }
}

// Cùng bộ sinh số với bản TS (LCG 32 bit): wrapping_mul/wrapping_add cuộn vòng như >>> 0 của JS.
struct Lcg(u32);
impl Lcg {
    fn next(&mut self) -> f64 {
        self.0 = self.0.wrapping_mul(1664525).wrapping_add(1013904223);
        self.0 as f64 / 4294967296.0
    }
}

type Case = (String, i32, Vec<i32>, Vec<i32>, Vec<i32>);

fn main() {
    let mut cases: Vec<Case> = vec![
        ("ví dụ của đề".into(), 3, vec![4, 5, 8, 2], vec![3, 5, 10, 9, 4], vec![4, 5, 5, 8, 8]),
        ("nhiều số 7 trùng".into(), 4, vec![7, 7, 7, 7, 8, 3], vec![2, 10, 9, 9], vec![7, 7, 7, 8]),
        ("nums rỗng, k = 1".into(), 1, vec![], vec![-3, -2, -4, 0, 4], vec![-3, -2, -2, 0, 4]),
        ("nums thiếu một số".into(), 2, vec![0], vec![-1, 1, -2, -4, 3], vec![-1, 0, 0, 0, 1]),
        ("số trùng".into(), 2, vec![5, 5], vec![5, 1, 6], vec![5, 5, 5]),
        ("k bằng cả luồng".into(), 3, vec![1, 2], vec![3, 0], vec![1, 1]),
        ("số âm".into(), 2, vec![-10, -20], vec![-5, -30, -1], vec![-10, -10, -5]),
    ];
    let mut rnd = Lcg(7);
    let nums: Vec<i32> = (0..200).map(|_| (rnd.next() * 20001.0).floor() as i32 - 10000).collect();
    let adds: Vec<i32> = (0..500).map(|_| (rnd.next() * 20001.0).floor() as i32 - 10000).collect();
    let mut reference = SortEachAdd::new(50, nums.clone());
    let want: Vec<i32> = adds.iter().map(|&v| reference.add(v)).collect();
    cases.push(("ngẫu nhiên 200 + 500 số, k = 50".into(), 50, nums, adds, want));

    let makers: Vec<(&str, fn(i32, Vec<i32>) -> Box<dyn Stream>)> = vec![
        ("SortEachAdd", |k, n| Box::new(SortEachAdd::new(k, n))),
        ("KthLargest", |k, n| Box::new(KthLargest::new(k, n))),
        ("NoReverseKthLargest", |k, n| Box::new(NoReverseKthLargest::new(k, n))),
    ];
    for (name, make) in &makers {
        let mut bad = Vec::new();
        for (case, k, nums, adds, want) in &cases {
            let mut s = make(*k, nums.clone());
            let got: Vec<i32> = adds.iter().map(|&v| s.add(v)).collect();
            if &got != want {
                bad.push(if adds.len() <= 5 { format!("{} → {:?}", case, got) } else { case.clone() });
            }
        }
        let tail = if bad.is_empty() { String::new() } else { format!("; sai ở: {}", bad.join("; ")) };
        println!("{:<20} {}/{} ca đúng{}", name, cases.len() - bad.len(), cases.len(), tail);
    }

    // peek() trả Option: heap rỗng thì None, không phải panic hay giá trị rác.
    let empty: BinaryHeap<Reverse<i32>> = BinaryHeap::new();
    println!("\nheap rỗng: peek() = {:?}", empty.peek());
}
