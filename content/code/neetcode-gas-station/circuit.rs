// Gas Station (LeetCode 134): vét cạn từ mọi trạm, tham lam một lượt, tổng tiền tố nhỏ nhất
// Chạy: rustc --edition 2021 -O circuit.rs -o circuit && ./circuit
use std::time::Instant;

// Vét cạn: thử xuất phát ở từng trạm, chạy trọn vòng hoặc tới khi bình âm
fn can_complete_brute(gas: &[i32], cost: &[i32], steps: &mut u64) -> i32 {
    let n = gas.len();
    for s in 0..n {
        let mut tank = 0;
        let mut ok = true;
        for k in 0..n {
            let j = (s + k) % n;
            tank += gas[j] - cost[j];
            *steps += 1;
            if tank < 0 {
                ok = false; // hụt xăng trên đoạn j -> j+1
                break;
            }
        }
        if ok {
            return s as i32;
        }
    }
    -1
}

// Cách chính: một lượt, bình âm ở i thì bỏ mọi trạm từ start tới i, đặt start = i + 1
fn can_complete_circuit(gas: &[i32], cost: &[i32], steps: &mut u64) -> i32 {
    let mut total = 0; // tổng gas - cost của cả vòng
    let mut tank = 0; // xăng còn lại tính từ start
    let mut start = 0;
    for i in 0..gas.len() {
        let d = gas[i] - cost[i]; // i32, không phải u32: hiệu có thể âm
        total += d;
        tank += d;
        *steps += 1;
        if tank < 0 {
            start = i + 1; // không trạm nào trong [start, i] đi qua được i
            tank = 0;
        }
    }
    if total < 0 { -1 } else { start as i32 } // tổng không âm thì start chắc chắn đi trọn vòng
}

// Tổng tiền tố: xuất phát ngay sau chỗ tổng tiền tố thấp nhất (lần đầu đạt mức thấp nhất)
fn can_complete_prefix(gas: &[i32], cost: &[i32]) -> i32 {
    let mut prefix = 0;
    let mut lowest = 0; // tiền tố rỗng (trước trạm 0) bằng 0
    let mut lowest_at: i32 = -1;
    for i in 0..gas.len() {
        prefix += gas[i] - cost[i];
        if prefix < lowest {
            lowest = prefix;
            lowest_at = i as i32;
        }
    }
    if prefix < 0 { -1 } else { lowest_at + 1 }
}

// Bản sai: quên kiểm tra tổng, luôn trả start cuối cùng
fn can_complete_no_total(gas: &[i32], cost: &[i32]) -> i32 {
    let mut tank = 0;
    let mut start = 0;
    for i in 0..gas.len() {
        tank += gas[i] - cost[i];
        if tank < 0 {
            start = i + 1;
            tank = 0;
        }
    }
    start as i32
}

// Mô phỏng một điểm xuất phát, dùng để xác nhận đáp án
fn completes(gas: &[i32], cost: &[i32], s: i32) -> bool {
    let n = gas.len();
    if s < 0 || s as usize >= n {
        return false;
    }
    let mut tank = 0;
    for k in 0..n {
        let j = (s as usize + k) % n;
        tank += gas[j] - cost[j];
        if tank < 0 {
            return false;
        }
    }
    true
}

// Đúng khi: tham lam khớp tiền tố, và trả -1 đúng lúc vét cạn trả -1, còn không thì trạm trả về đi trọn vòng
fn agrees(gas: &[i32], cost: &[i32]) -> bool {
    let mut steps = 0;
    let g = can_complete_circuit(gas, cost, &mut steps);
    let p = can_complete_prefix(gas, cost);
    let b = can_complete_brute(gas, cost, &mut steps);
    if g != p {
        return false;
    }
    if b == -1 {
        return g == -1;
    }
    completes(gas, cost, g)
}

fn build(gas: &mut Vec<i32>, cost: &mut Vec<i32>, total: &mut u32, good: &mut u32, wrong: &mut u32) {
    if !gas.is_empty() {
        *total += 1;
        if agrees(gas, cost) {
            *good += 1;
        }
        let b = can_complete_brute(gas, cost, &mut 0);
        let w = can_complete_no_total(gas, cost);
        if if b == -1 { w != -1 } else { !completes(gas, cost, w) } {
            *wrong += 1;
        }
    }
    if gas.len() == 4 {
        return;
    }
    for g in 0..=2 {
        for c in 0..=2 {
            gas.push(g);
            cost.push(c);
            build(gas, cost, total, good, wrong);
            gas.pop();
            cost.pop();
        }
    }
}

fn main() {
    let cases: Vec<(Vec<i32>, Vec<i32>, i32)> = vec![
        (vec![5], vec![5], 0),
        (vec![2], vec![3], -1),
        (vec![1, 6, 2], vec![3, 1, 4], 1),
        (vec![4, 0, 5, 1, 2], vec![2, 3, 1, 4, 2], 2),
        (vec![0, 0, 0, 9], vec![2, 2, 2, 1], 3),
        (vec![3, 3, 3], vec![3, 3, 4], -1),
        (vec![0, 2, 0], vec![1, 0, 1], 1),
    ];
    let mut ok = 0;
    for (gas, cost, want) in &cases {
        let mut steps = 0;
        let got = [can_complete_brute(gas, cost, &mut steps), can_complete_circuit(gas, cost, &mut steps), can_complete_prefix(gas, cost)];
        if got.iter().all(|x| x == want) {
            ok += 1;
        } else {
            println!("sai ở {:?} {:?} {:?}", gas, cost, got);
        }
    }
    println!("{}/{} ca đúng", ok, cases.len());

    // Đối chiếu: mọi vòng 1–4 trạm với gas, cost trong {0, 1, 2}
    let (mut total, mut good, mut wrong) = (0, 0, 0);
    build(&mut Vec::new(), &mut Vec::new(), &mut total, &mut good, &mut wrong);
    println!("{}/{} ca đúng (đối chiếu vét cạn)", good, total);
    println!("Bỏ kiểm tra tổng: sai {}/{} ca", wrong, total);

    // Đo: n trạm, trạm n-2 tốn rất nhiều xăng, chỉ trạm cuối đi trọn vòng
    let n = 10000;
    let mut gas = vec![1; n];
    let mut cost = vec![0; n];
    cost[n - 2] = n as i32 + 1; // trạm n-2: gas 1, cost n+1, tức hụt n
    gas[n - 1] = 2;
    let (mut bs, mut gs) = (0, 0);
    let t0 = Instant::now();
    let b = can_complete_brute(&gas, &cost, &mut bs);
    let brute_ms = t0.elapsed().as_secs_f64() * 1000.0;
    let t0 = Instant::now();
    let g = can_complete_circuit(&gas, &cost, &mut gs);
    let greedy_ms = t0.elapsed().as_secs_f64() * 1000.0;
    println!("n = {}, đáp án {}/{}: vét cạn {} bước ({:.1} ms), tham lam {} bước ({:.2} ms)", n, b, g, bs, brute_ms, gs, greedy_ms);
}
