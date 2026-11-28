// Ga MISC-03: tham lam trên mảng, một lượt trái sang phải với một trạng thái nhỏ.
// Chạy: rustc --edition 2021 -O greedy.rs -o /tmp/greedy && /tmp/greedy

// Maximum Subarray (Kadane): tổng chạy âm thì bỏ, bắt đầu lại từ phần tử hiện tại.
fn max_sub_array(nums: &[i32]) -> i32 {
    let mut run = nums[0]; // tổng của đoạn tốt nhất kết thúc tại i
    let mut best = nums[0]; // tốt nhất từ trước tới giờ
    for &x in &nums[1..] {
        run = if run < 0 { x } else { run + x }; // tiền tố âm chỉ kéo tổng xuống: bỏ nó
        best = best.max(run);
    }
    best
}

// Jump Game: giữ chỗ xa nhất có thể tới; đứng ở ô ngoài tầm là kẹt.
fn can_jump(nums: &[i32]) -> bool {
    let mut reach = 0usize;
    for (i, &x) in nums.iter().enumerate() {
        if i > reach {
            return false; // không ô nào trước đó nhảy tới được i
        }
        reach = reach.max(i + x as usize);
    }
    true
}

// Jump Game II: quét theo lớp; hết lớp hiện tại thì nhảy thêm một bước.
fn jump(nums: &[i32]) -> i32 {
    let (mut jumps, mut end, mut far) = (0, 0usize, 0usize); // end: ô cuối của lớp; far: chỗ xa nhất của lớp kế
    for i in 0..nums.len() - 1 {
        far = far.max(i + nums[i] as usize);
        if i == end {
            // đã quét hết lớp này
            jumps += 1;
            end = far;
        }
    }
    jumps
}

// Gas Station: bình hụt ở trạm i thì không điểm nào từ start tới i xuất phát được.
fn can_complete_circuit(gas: &[i32], cost: &[i32]) -> i32 {
    let (mut total, mut tank, mut start) = (0, 0, 0usize);
    for i in 0..gas.len() {
        let diff = gas[i] - cost[i];
        total += diff;
        tank += diff;
        if tank < 0 {
            // xuất phát lại từ trạm kế tiếp
            start = i + 1;
            tank = 0;
        }
    }
    if total < 0 { -1 } else { start as i32 }
}

fn main() {
    let cases: Vec<(&str, String, String)> = vec![
        ("maxSubArray đoạn giữa", max_sub_array(&[2, -5, 4, -1, 3, -7, 2]).to_string(), "6".into()),
        ("maxSubArray toàn âm", max_sub_array(&[-3, -1, -2]).to_string(), "-1".into()),
        ("maxSubArray một phần tử", max_sub_array(&[5]).to_string(), "5".into()),
        ("maxSubArray toàn dương", max_sub_array(&[1, 2, 3]).to_string(), "6".into()),
        ("maxSubArray vượt qua số âm", max_sub_array(&[-1, 4, -2, 4, -10, 3]).to_string(), "6".into()),
        ("canJump kẹt ở số 0", can_jump(&[2, 0, 1, 0, 3]).to_string(), "false".into()),
        ("canJump tới đích", can_jump(&[1, 2, 0, 1, 0]).to_string(), "true".into()),
        ("canJump một ô", can_jump(&[0]).to_string(), "true".into()),
        ("canJump đứng yên", can_jump(&[0, 1]).to_string(), "false".into()),
        ("canJump kẹt giữa đường", can_jump(&[3, 0, 0, 1, 0, 2]).to_string(), "false".into()),
        ("jump ba bước", jump(&[1, 2, 0, 1, 0]).to_string(), "3".into()),
        ("jump hai bước", jump(&[3, 1, 1, 1, 1]).to_string(), "2".into()),
        ("jump một ô", jump(&[0]).to_string(), "0".into()),
        ("jump một bước", jump(&[4, 1, 1, 1, 1]).to_string(), "1".into()),
        ("jump từng ô", jump(&[1, 1, 1, 1]).to_string(), "3".into()),
        ("gas không đủ xăng", can_complete_circuit(&[2, 3, 4], &[3, 4, 3]).to_string(), "-1".into()),
        ("gas xuất phát ở trạm 3", can_complete_circuit(&[3, 1, 2, 5], &[2, 4, 3, 1]).to_string(), "3".into()),
        ("gas một trạm", can_complete_circuit(&[5], &[4]).to_string(), "0".into()),
        ("gas tổng bằng 0", can_complete_circuit(&[1, 4, 1], &[2, 1, 3]).to_string(), "1".into()),
    ];
    let mut ok = 0;
    for (name, got, want) in &cases {
        if got == want {
            ok += 1;
        } else {
            println!("SAI {}: được {}, cần {}", name, got, want);
        }
    }
    println!("{}/{} ca đúng", ok, cases.len());
}
