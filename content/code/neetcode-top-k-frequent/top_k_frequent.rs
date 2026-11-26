// NC-05 Top K Frequent Elements (LeetCode 347): sắp xếp, heap, bucket sort, quickselect.
// Chạy: rustc --edition 2021 -O top_k_frequent.rs && ./top_k_frequent
use std::cmp::Reverse;
use std::collections::{BinaryHeap, HashMap};

fn count_all(nums: &[i32]) -> HashMap<i32, usize> {
    let mut count = HashMap::new();
    for &x in nums {
        *count.entry(x).or_insert(0) += 1;
    }
    count
}

// Cách 1, đếm rồi sắp xếp theo tần suất giảm dần: O(n + m log m).
fn by_sorting(nums: &[i32], k: usize) -> Vec<i32> {
    let mut e: Vec<(i32, usize)> = count_all(nums).into_iter().collect();
    e.sort_unstable_by(|a, b| b.1.cmp(&a.1)); // cmp, không trừ: không có bẫy tràn số
    e.into_iter().take(k).map(|(v, _)| v).collect()
}

// Cách 2, heap k phần tử: BinaryHeap là heap LỚN nhất; bọc Reverse để thành heap nhỏ nhất.
fn by_heap(nums: &[i32], k: usize) -> Vec<i32> {
    let mut heap = BinaryHeap::with_capacity(k + 1);
    for (v, c) in count_all(nums) {
        heap.push(Reverse((c, v))); // so tần suất trước, giá trị sau
        if heap.len() > k {
            heap.pop(); // đẩy kẻ yếu nhất ra
        }
    }
    heap.into_iter().map(|Reverse((_, v))| v).collect()
}

// Cách 3, bucket sort theo tần suất: O(n).
fn by_buckets(nums: &[i32], k: usize) -> Vec<i32> {
    let mut buckets: Vec<Vec<i32>> = vec![Vec::new(); nums.len() + 1];
    for (v, c) in count_all(nums) {
        buckets[c].push(v);
    }
    buckets.into_iter().rev().flatten().take(k).collect()
}

// Cách 4, quickselect: thư viện chuẩn có sẵn select_nth_unstable_by, O(m) trung bình.
fn by_quickselect(nums: &[i32], k: usize) -> Vec<i32> {
    let mut e: Vec<(i32, usize)> = count_all(nums).into_iter().collect();
    let want = e.len() - k;
    if want > 0 {
        e.select_nth_unstable_by(want, |a, b| a.1.cmp(&b.1)); // từ want trở đi là k phần tử lớn nhất
    }
    e[want..].iter().map(|&(v, _)| v).collect()
}

fn main() {
    let cases: Vec<(Vec<i32>, usize, Vec<i32>)> = vec![
        (vec![1, 1, 1, 2, 2, 3], 2, vec![1, 2]),
        (vec![1], 1, vec![1]),
        (vec![4, 4, 4, 4, -1, -1, -1, 2, 2, 7], 3, vec![-1, 2, 4]),
        (vec![5, 3, 5, 3, 5, 9, 9, 9, 9], 1, vec![9]),
    ];
    let fns: [(&str, fn(&[i32], usize) -> Vec<i32>); 4] = [
        ("bySorting", by_sorting),
        ("byHeap", by_heap),
        ("byBuckets", by_buckets),
        ("byQuickselect", by_quickselect),
    ];
    for (name, f) in fns.iter() {
        let ok = cases
            .iter()
            .filter(|(n, k, w)| {
                let mut got = f(n, *k);
                got.sort();
                got == *w
            })
            .count();
        println!("{:<14} {}/{} ca đúng", name, ok, cases.len());
    }

    // ── bẫy: BinaryHeap không bọc Reverse là heap LỚN nhất ──────────────────────
    let max_heap: BinaryHeap<i32> = [3, 1, 2].into_iter().collect();
    let min_heap: BinaryHeap<Reverse<i32>> = [3, 1, 2].into_iter().map(Reverse).collect();
    println!("\nBinaryHeap peek: {:?} | bọc Reverse: {:?}", max_heap.peek(), min_heap.peek().map(|r| r.0));
}
