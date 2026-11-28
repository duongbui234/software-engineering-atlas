// Combination Sum II (LeetCode 40): mỗi vị trí dùng tối đa một lần, mảng có thể có số trùng.
use std::cell::Cell;
use std::collections::HashSet;

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

// Sắp xếp, bỏ số trùng ở cùng một tầng, cắt nhánh khi số đã lớn hơn phần còn lại.
fn combination_sum2(candidates: &[i32], target: i32) -> Vec<Vec<i32>> {
    fn dfs(nums: &[i32], start: usize, remain: i32, path: &mut Vec<i32>, out: &mut Vec<Vec<i32>>) {
        tick();
        if remain == 0 {
            out.push(path.clone()); // chép ra, path còn bị sửa tiếp
            return;
        }
        for i in start..nums.len() {
            if i > start && nums[i] == nums[i - 1] {
                continue; // cùng tầng đã thử giá trị này rồi
            }
            if nums[i] > remain {
                break;
            }
            path.push(nums[i]);
            dfs(nums, i + 1, remain - nums[i], path, out); // i + 1: vị trí này đã dùng
            path.pop();
        }
    }
    let mut nums = candidates.to_vec();
    nums.sort();
    let mut out = Vec::new();
    dfs(&nums, 0, target, &mut Vec::new(), &mut out);
    out
}

// Cùng cây đó nhưng không bỏ trùng: sinh lặp rồi khử bằng tập khóa.
fn combination_sum2_set(candidates: &[i32], target: i32) -> Vec<Vec<i32>> {
    fn dfs(nums: &[i32], start: usize, remain: i32, path: &mut Vec<i32>, seen: &mut HashSet<Vec<i32>>, out: &mut Vec<Vec<i32>>) {
        tick();
        if remain == 0 {
            if seen.insert(path.clone()) {
                out.push(path.clone());
            }
            return;
        }
        for i in start..nums.len() {
            if nums[i] > remain {
                break;
            }
            path.push(nums[i]);
            dfs(nums, i + 1, remain - nums[i], path, seen, out);
            path.pop();
        }
    }
    let mut nums = candidates.to_vec();
    nums.sort();
    let mut out = Vec::new();
    dfs(&nums, 0, target, &mut Vec::new(), &mut HashSet::new(), &mut out);
    out
}

// Vét mọi tập con theo bitmask, sắp từng tập rồi khử trùng.
fn brute(candidates: &[i32], target: i32) -> Vec<Vec<i32>> {
    let mut seen = HashSet::new();
    let n = candidates.len();
    for mask in 0..(1u32 << n) {
        let mut pick: Vec<i32> = (0..n).filter(|i| mask >> i & 1 == 1).map(|i| candidates[i]).collect();
        if pick.iter().sum::<i32>() == target {
            pick.sort();
            seen.insert(pick);
        }
    }
    seen.into_iter().collect()
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
        (vec![3, 1, 3, 5, 1, 1], 8, vec![vec![1, 1, 1, 5], vec![1, 1, 3, 3], vec![3, 5]]),
        (vec![2, 2, 2], 4, vec![vec![2, 2]]),
        (vec![5], 3, vec![]),
        (vec![4, 1, 4, 1], 5, vec![vec![1, 4]]),
        (vec![1; 20], 10, vec![vec![1; 10]]),
        (vec![6, 2, 4, 2], 6, vec![vec![2, 4], vec![6]]),
        (vec![50, 30], 30, vec![vec![30]]),
    ];
    let mut ok = 0;
    for (cand, target, want) in &cases {
        let a = combination_sum2(cand, *target);
        if norm(&a) == norm(want) && norm(&combination_sum2_set(cand, *target)) == norm(want) {
            ok += 1;
        } else {
            println!("sai ở {:?} {} {:?}", cand, target, a);
        }
    }
    println!("{}/{} ca đúng", ok, cases.len());

    let (mut good, mut total) = (0, 0);
    for n in 1..=6u32 {
        let mut digits = vec![0i32; n as usize];
        for _ in 0..3usize.pow(n) {
            let cand: Vec<i32> = digits.iter().map(|d| d + 1).collect();
            for target in 1..=8 {
                total += 1;
                let want = norm(&brute(&cand, target));
                if norm(&combination_sum2(&cand, target)) == want && norm(&combination_sum2_set(&cand, target)) == want {
                    good += 1;
                } else {
                    println!("sai ở {:?} {}", cand, target);
                }
            }
            for j in (0..n as usize).rev() {
                digits[j] += 1;
                if digits[j] < 3 {
                    break;
                }
                digits[j] = 0;
            }
        }
    }
    println!("{}/{} ca đúng (đối chiếu vét tập con)", good, total);

    reset();
    combination_sum2_set(&vec![1; 20], 10);
    let set_calls = calls();
    reset();
    combination_sum2(&vec![1; 20], 10);
    println!("20 số 1, target 10: khử trùng bằng tập {} lượt gọi, bỏ trùng cùng tầng {} lượt gọi", set_calls, calls());
}
