use std::collections::HashSet;

// Cách 1: lấy hoặc bỏ từng phần tử, mỗi lá của cây là một tập con
fn subsets_take_skip(nums: &[i32]) -> Vec<Vec<i32>> {
    fn walk(nums: &[i32], i: usize, path: &mut Vec<i32>, result: &mut Vec<Vec<i32>>) {
        if i == nums.len() {
            result.push(path.clone()); // bắt buộc clone: không thể vừa cất vừa sửa tiếp path
            return;
        }
        path.push(nums[i]); // lấy nums[i]
        walk(nums, i + 1, path, result);
        path.pop();
        walk(nums, i + 1, path, result); // bỏ nums[i]
    }
    let mut result = Vec::new();
    walk(nums, 0, &mut Vec::new(), &mut result);
    result
}

// Cách 2: chỉ số bắt đầu, mỗi nút của cây là một tập con
fn subsets_start(nums: &[i32]) -> Vec<Vec<i32>> {
    fn walk(nums: &[i32], start: usize, path: &mut Vec<i32>, result: &mut Vec<Vec<i32>>) {
        result.push(path.clone());
        for i in start..nums.len() {
            path.push(nums[i]);
            walk(nums, i + 1, path, result); // chỉ xét các phần tử sau i, nên [a, b] không có bản sao [b, a]
            path.pop();
        }
    }
    let mut result = Vec::new();
    walk(nums, 0, &mut Vec::new(), &mut result);
    result
}

// Cách 3: bit thứ i của mask cho biết có lấy nums[i] hay không
fn subsets_bitmask(nums: &[i32]) -> Vec<Vec<i32>> {
    (0..1u32 << nums.len())
        .map(|mask| (0..nums.len()).filter(|&i| mask >> i & 1 == 1).map(|i| nums[i]).collect())
        .collect()
}

// Cách 4: nhân đôi danh sách, mỗi tập cũ sinh thêm một bản có x
fn subsets_doubling(nums: &[i32]) -> Vec<Vec<i32>> {
    let mut result: Vec<Vec<i32>> = vec![vec![]];
    for &x in nums {
        let size = result.len();
        for k in 0..size {
            let mut next = result[k].clone();
            next.push(x);
            result.push(next);
        }
    }
    result
}

// Dạng chuẩn để so không phụ thuộc thứ tự: sắp từng tập, rồi sắp cả danh sách
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

// Mọi cách phải cho đủ 2^n tập, không tập nào lặp, và khớp đáp án viết tay nếu có
fn check(nums: &[i32], expected: Option<&[Vec<i32>]>) -> bool {
    let approaches: [fn(&[i32]) -> Vec<Vec<i32>>; 4] =
        [subsets_take_skip, subsets_start, subsets_bitmask, subsets_doubling];
    let reference = canonical(&subsets_bitmask(nums));
    for solve in approaches {
        let got = solve(nums);
        if got.len() != 1 << nums.len() {
            return false;
        }
        let keys = canonical(&got);
        if keys.iter().collect::<HashSet<_>>().len() != got.len() {
            return false;
        }
        if let Some(e) = expected {
            if keys != canonical(e) {
                return false;
            }
        }
        if keys != reference {
            return false;
        }
    }
    true
}

fn build(arr: &mut Vec<i32>, total: &mut usize, good: &mut usize) {
    *total += 1;
    if check(arr, None) {
        *good += 1;
    }
    if arr.len() == 4 {
        return;
    }
    for v in -2..=2 {
        if !arr.contains(&v) {
            arr.push(v);
            build(arr, total, good);
            arr.pop();
        }
    }
}

fn main() {
    let cases: Vec<(Vec<i32>, Option<Vec<Vec<i32>>>)> = vec![
        (vec![5], Some(vec![vec![], vec![5]])),
        (vec![4, -2], Some(vec![vec![], vec![4], vec![-2], vec![4, -2]])),
        (
            vec![7, 1, 9],
            Some(vec![vec![], vec![7], vec![1], vec![9], vec![7, 1], vec![7, 9], vec![1, 9], vec![7, 1, 9]]),
        ),
        (vec![-10, 10], Some(vec![vec![], vec![-10], vec![10], vec![-10, 10]])),
        (vec![3, -1, 0, 8], None),
        (vec![-5, -4, -3, -2, -1, 0, 1, 2, 3, 4], None),
        (
            vec![6, -6, 2],
            Some(vec![vec![], vec![6], vec![-6], vec![2], vec![6, -6], vec![6, 2], vec![-6, 2], vec![6, -6, 2]]),
        ),
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

    // Đối chiếu chéo: mọi mảng gồm các giá trị khác nhau lấy từ {-2..2}, dài 0–4, mọi thứ tự
    let (mut total, mut good) = (0, 0);
    build(&mut Vec::new(), &mut total, &mut good);
    println!("{}/{} ca đúng (đối chiếu chéo bốn cách)", good, total);
    // Rust không có dòng "quên sao chép": result.push(*path) báo E0507,
    // còn cất &path rồi path.push(...) báo E0502, nên bản lỗi không biên dịch được.
}
