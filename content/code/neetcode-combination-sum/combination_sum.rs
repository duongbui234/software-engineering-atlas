// Combination Sum (LeetCode 39): liệt kê mọi tổ hợp, mỗi số được dùng lại nhiều lần.
use std::cell::Cell;

thread_local! {
    static CALLS: Cell<u64> = Cell::new(0);
}

fn tick() {
    CALLS.with(|c| c.set(c.get() + 1));
}

fn calls() -> u64 {
    CALLS.with(|c| c.get())
}

fn reset() {
    CALLS.with(|c| c.set(0));
}

// Quay lui không sắp xếp, không cắt nhánh: đi tới khi phần còn lại âm.
fn combination_sum_plain(candidates: &[i32], target: i32) -> Vec<Vec<i32>> {
    fn dfs(c: &[i32], start: usize, remain: i32, path: &mut Vec<i32>, out: &mut Vec<Vec<i32>>) {
        tick();
        if remain == 0 {
            out.push(path.clone()); // chép ra, path còn bị sửa tiếp
            return;
        }
        if remain < 0 {
            return;
        }
        for i in start..c.len() {
            path.push(c[i]);
            dfs(c, i, remain - c[i], path, out); // vẫn là i: được dùng lại số này
            path.pop();
        }
    }
    let mut out = Vec::new();
    dfs(candidates, 0, target, &mut Vec::new(), &mut out);
    out
}

// Sắp xếp rồi cắt nhánh: số đầu tiên lớn hơn phần còn lại thì mọi số sau cũng vậy.
fn combination_sum(candidates: &[i32], target: i32) -> Vec<Vec<i32>> {
    fn dfs(nums: &[i32], start: usize, remain: i32, path: &mut Vec<i32>, out: &mut Vec<Vec<i32>>) {
        tick();
        if remain == 0 {
            out.push(path.clone());
            return;
        }
        for i in start..nums.len() {
            if nums[i] > remain {
                break;
            }
            path.push(nums[i]);
            dfs(nums, i, remain - nums[i], path, out); // vẫn là i: được dùng lại số này
            path.pop();
        }
    }
    let mut nums = candidates.to_vec();
    nums.sort();
    let mut out = Vec::new();
    dfs(&nums, 0, target, &mut Vec::new(), &mut out);
    out
}

// DP đếm số tổ hợp (như Coin Change II): chỉ ra con số, không ra danh sách.
fn count_ways(candidates: &[i32], target: i32) -> usize {
    let t = target as usize;
    let mut ways = vec![0usize; t + 1];
    ways[0] = 1;
    for &c in candidates {
        for s in c as usize..=t {
            ways[s] += ways[s - c as usize];
        }
    }
    ways[t]
}

// Vét mọi vector số lần dùng (0..target/c cho từng số), giữ vector có tổng đúng.
fn brute(candidates: &[i32], target: i32) -> Vec<Vec<i32>> {
    fn gen(c: &[i32], target: i32, i: usize, counts: &mut Vec<i32>, out: &mut Vec<Vec<i32>>) {
        if i == c.len() {
            let sum: i32 = counts.iter().zip(c).map(|(k, v)| k * v).sum();
            if sum == target {
                let mut combo = Vec::new();
                for (j, &k) in counts.iter().enumerate() {
                    for _ in 0..k {
                        combo.push(c[j]);
                    }
                }
                out.push(combo);
            }
            return;
        }
        for k in 0..=target / c[i] {
            counts[i] = k;
            gen(c, target, i + 1, counts, out);
        }
        counts[i] = 0;
    }
    let mut out = Vec::new();
    gen(candidates, target, 0, &mut vec![0; candidates.len()], &mut out);
    out
}

fn norm(combos: &[Vec<i32>]) -> String {
    let mut keys: Vec<String> = combos
        .iter()
        .map(|c| {
            let mut s = c.clone();
            s.sort();
            s.iter().map(|v| v.to_string()).collect::<Vec<_>>().join(",")
        })
        .collect();
    keys.sort();
    keys.join("|")
}

fn main() {
    let cases: Vec<(Vec<i32>, i32, Vec<Vec<i32>>)> = vec![
        (vec![4, 5, 9], 9, vec![vec![4, 5], vec![9]]),
        (vec![3, 4, 7], 10, vec![vec![3, 3, 4], vec![3, 7]]),
        (vec![6], 4, vec![]),
        (vec![8, 2, 5], 10, vec![vec![2, 2, 2, 2, 2], vec![2, 8], vec![5, 5]]),
        (vec![2, 3], 1, vec![]),
        (vec![40], 40, vec![vec![40]]),
        (vec![39, 2], 3, vec![]),
    ];
    let mut ok = 0;
    for (cand, target, want) in &cases {
        let got = combination_sum(cand, *target);
        if norm(&combination_sum_plain(cand, *target)) == norm(want)
            && norm(&got) == norm(want)
            && got.len() == count_ways(cand, *target)
        {
            ok += 1;
        } else {
            println!("sai ở {:?} {} {:?}", cand, target, got);
        }
    }
    println!("{}/{} ca đúng", ok, cases.len());

    let pool = [2, 3, 4, 5, 6, 7];
    let (mut good, mut total) = (0, 0);
    for mask in 1..(1 << pool.len()) {
        let cand: Vec<i32> = (0..pool.len()).filter(|i| mask >> i & 1 == 1).map(|i| pool[i]).collect();
        for target in 1..15 {
            total += 1;
            let want = norm(&brute(&cand, target));
            let a = combination_sum(&cand, target);
            if norm(&a) == want
                && norm(&combination_sum_plain(&cand, target)) == want
                && a.len() == count_ways(&cand, target)
            {
                good += 1;
            } else {
                println!("sai ở {:?} {}", cand, target);
            }
        }
    }
    println!("{}/{} ca đúng (đối chiếu vét số lần dùng)", good, total);

    let primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37];
    reset();
    combination_sum_plain(&primes, 40);
    let plain_calls = calls();
    reset();
    let found = combination_sum(&primes, 40).len();
    println!(
        "12 số nguyên tố tới 37, target 40: không cắt nhánh {} lượt gọi, sắp xếp + cắt nhánh {} lượt gọi, {} tổ hợp",
        plain_calls,
        calls(),
        found
    );
}
