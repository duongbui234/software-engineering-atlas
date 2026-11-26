use std::collections::BinaryHeap;

fn last_stone_weight(stones: Vec<i32>) -> i32 {
    let mut heap = BinaryHeap::from(stones);
    while heap.len() > 1 {
        let heavier = heap.pop().unwrap();
        let lighter = heap.pop().unwrap();
        if heavier > lighter {
            heap.push(heavier - lighter);
        }
    }
    heap.pop().unwrap_or(0)
}

fn main() {
    let cases = [
        (vec![2, 7, 4, 1, 8, 1], 1),
        (vec![1], 1),
        (vec![3, 3], 0),
        (vec![3, 3, 3], 3),
        (vec![4, 4, 2, 2], 0),
        (vec![10, 2, 9], 1),
        (vec![1000, 1], 999),
    ];
    let count = cases.len();
    for (stones, expected) in cases {
        assert_eq!(last_stone_weight(stones), expected);
    }
    println!("{count}/{count} ca đúng");
}
