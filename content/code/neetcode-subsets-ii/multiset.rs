use std::collections::{BTreeMap, HashSet};

// Cách chính: sắp xếp, rồi ở mỗi tầng chỉ dùng phần tử đầu của mỗi nhóm giá trị bằng nhau
fn subsets_with_dup(nums: &[i32], calls: &mut usize) -> Vec<Vec<i32>> {
    fn walk(sorted: &[i32], start: usize, path: &mut Vec<i32>, result: &mut Vec<Vec<i32>>, calls: &mut usize) {
        *calls += 1;
        result.push(path.clone());
        for i in start..sorted.len() {
            // i > start: cùng tầng, giá trị này đã được thử ở anh em đứng trước
            if i > start && sorted[i] == sorted[i - 1] {
                continue;
            }
            path.push(sorted[i]);
            walk(sorted, i + 1, path, result, calls);
            path.pop();
        }
    }
    let mut sorted = nums.to_vec();
    sorted.sort();
    let mut result = Vec::new();
    walk(&sorted, 0, &mut Vec::new(), &mut result, calls);
    result
}

// Bản sai: bỏ mọi phần tử bằng phần tử đứng trước, kể cả khi nó là lựa chọn đầu của tầng
fn subsets_skip_always(nums: &[i32]) -> Vec<Vec<i32>> {
    fn walk(sorted: &[i32], start: usize, path: &mut Vec<i32>, result: &mut Vec<Vec<i32>>) {
        result.push(path.clone());
        for i in start..sorted.len() {
            if i > 0 && sorted[i] == sorted[i - 1] {
                continue;
            }
            path.push(sorted[i]);
            walk(sorted, i + 1, path, result);
            path.pop();
        }
    }
    let mut sorted = nums.to_vec();
    sorted.sort();
    let mut result = Vec::new();
    walk(&sorted, 0, &mut Vec::new(), &mut result);
    result
}

// Cách lọc sau: sinh đủ 2^n tập của mảng đã sắp, cất Vec vào HashSet để bỏ trùng
fn subsets_with_set(nums: &[i32], generated: &mut usize) -> Vec<Vec<i32>> {
    let mut sorted = nums.to_vec();
    sorted.sort();
    let mut seen: HashSet<Vec<i32>> = HashSet::new();
    for mask in 0..1u32 << sorted.len() {
        let subset: Vec<i32> = (0..sorted.len()).filter(|&i| mask >> i & 1 == 1).map(|i| sorted[i]).collect();
        *generated += 1;
        seen.insert(subset);
    }
    seen.into_iter().collect()
}

// Tham chiếu độc lập: đếm số lần xuất hiện, mỗi giá trị lấy 0..count bản
fn subsets_by_count(nums: &[i32]) -> Vec<Vec<i32>> {
    let mut counts: BTreeMap<i32, usize> = BTreeMap::new();
    for &x in nums {
        *counts.entry(x).or_insert(0) += 1;
    }
    let mut result: Vec<Vec<i32>> = vec![vec![]];
    for (&value, &count) in &counts {
        let mut next = Vec::new();
        for subset in &result {
            for k in 0..=count {
                let mut grown = subset.clone();
                grown.extend(std::iter::repeat(value).take(k));
                next.push(grown);
            }
        }
        result = next;
    }
    result
}

fn canonical(sets: &[Vec<i32>]) -> Vec<Vec<i32>> {
    let mut keys: Vec<Vec<i32>> = sets
        .iter()
        .map(|s| {
            let mut c = s.clone();
            c.sort();
            c
        })
        .collect();
    keys.sort();
    keys
}

fn check(nums: &[i32], expected: Option<&[Vec<i32>]>) -> bool {
    let reference = canonical(&subsets_by_count(nums));
    for got in [subsets_with_dup(nums, &mut 0), subsets_with_set(nums, &mut 0)] {
        let keys = canonical(&got);
        if keys.iter().collect::<HashSet<_>>().len() != keys.len() {
            return false; // không được có tập lặp
        }
        if keys != reference {
            return false;
        }
        if let Some(e) = expected {
            if keys != canonical(e) {
                return false;
            }
        }
    }
    true
}

fn build(arr: &mut Vec<i32>, total: &mut usize, good: &mut usize) {
    *total += 1;
    if check(arr, None) {
        *good += 1;
    }
    if arr.len() == 5 {
        return;
    }
    for v in 1..=3 {
        arr.push(v);
        build(arr, total, good);
        arr.pop();
    }
}

fn main() {
    let cases: Vec<(Vec<i32>, Option<Vec<Vec<i32>>>)> = vec![
        (vec![3, 3], Some(vec![vec![], vec![3], vec![3, 3]])),
        (vec![5, 5, 1], Some(vec![vec![], vec![1], vec![1, 5], vec![1, 5, 5], vec![5], vec![5, 5]])),
        (vec![4, 4, 4, 4], Some(vec![vec![], vec![4], vec![4, 4], vec![4, 4, 4], vec![4, 4, 4, 4]])),
        (vec![0, -1, 0], Some(vec![vec![], vec![-1], vec![-1, 0], vec![-1, 0, 0], vec![0], vec![0, 0]])),
        (vec![7], Some(vec![vec![], vec![7]])),
        (vec![1, 1, 2, 2, 3], None),
        (vec![2; 10], None),
        ((-5..5).collect(), None),
    ];
    let mut ok = 0;
    for (nums, expected) in &cases {
        if check(nums, expected.as_deref()) {
            ok += 1;
        } else {
            println!("sai ở {:?}", nums);
        }
    }
    println!("{}/{} ca đúng", ok, cases.len());

    // Đối chiếu: mọi mảng dài 0–5 với giá trị trong {1, 2, 3}
    let (mut total, mut good) = (0, 0);
    build(&mut Vec::new(), &mut total, &mut good);
    println!("{}/{} ca đúng (đối chiếu đếm theo nhóm)", good, total);

    let wrong = subsets_skip_always(&[5, 5, 1]).len();
    let right = subsets_with_dup(&[5, 5, 1], &mut 0).len();
    println!("Bỏ trùng mọi lúc với [5,5,1]: {} tập, đúng là {}", wrong, right);

    let heavy = [4, 4, 4, 4, 4, 9, 9, 9, 9, 9];
    let mut generated = 0;
    let kept = subsets_with_set(&heavy, &mut generated).len();
    let mut calls = 0;
    subsets_with_dup(&heavy, &mut calls);
    println!("[4×5, 9×5]: Set sinh {} tập để giữ {}, cắt cùng tầng sinh {}", generated, kept, calls);
}
