use std::collections::BinaryHeap;

fn k_closest(points: &[[i32; 2]], k: usize) -> Vec<[i32; 2]> {
    let mut heap = BinaryHeap::with_capacity(k);
    for &[x, y] in points {
        let distance = x * x + y * y;
        if heap.len() < k {
            heap.push((distance, [x, y]));
        } else {
            let mut farthest = heap.peek_mut().unwrap();
            if distance < farthest.0 {
                *farthest = (distance, [x, y]);
            }
        }
    }
    heap.into_iter().map(|(_, point)| point).collect()
}

fn main() {
    let cases = [
        (vec![[1, 3], [-2, 2]], 1, vec![[-2, 2]]),
        (vec![[3, 3], [5, -1], [-2, 4]], 2, vec![[3, 3], [-2, 4]]),
        (vec![[0, 0]], 1, vec![[0, 0]]),
        (vec![[1, -1], [-1, 1], [2, 2]], 2, vec![[1, -1], [-1, 1]]),
        (
            vec![[10000, -10000], [0, 9999]],
            2,
            vec![[10000, -10000], [0, 9999]],
        ),
    ];
    let count = cases.len();
    for (points, k, mut expected) in cases {
        let mut actual = k_closest(&points, k);
        expected.sort_unstable();
        actual.sort_unstable();
        assert_eq!(actual, expected, "{points:?}, k = {k}");
    }
    println!("{count}/{count} ca đúng");
}
