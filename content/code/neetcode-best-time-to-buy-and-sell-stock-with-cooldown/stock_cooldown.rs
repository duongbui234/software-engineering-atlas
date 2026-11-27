// LeetCode 309: mua bán cổ phiếu, bán xong phải nghỉ một ngày
const NEG: i32 = -1_000_000_000; // trạng thái chưa thể xảy ra

// Vét cạn trên (ngày, đang cầm cổ phiếu hay không)
fn max_profit_brute(prices: &[i32], calls: &mut u64) -> i32 {
    fn go(prices: &[i32], day: usize, holding: bool, calls: &mut u64) -> i32 {
        *calls += 1;
        if day >= prices.len() {
            return 0;
        }
        let wait = go(prices, day + 1, holding, calls);
        if holding {
            wait.max(prices[day] + go(prices, day + 2, false, calls)) // bán, nhảy qua ngày nghỉ
        } else {
            wait.max(-prices[day] + go(prices, day + 1, true, calls)) // mua
        }
    }
    go(prices, 0, false, calls)
}

// Ghi nhớ: chỉ có 2n cặp (ngày, đang cầm); None nghĩa là chưa tính
fn max_profit_memo(prices: &[i32], calls: &mut u64) -> i32 {
    fn go(prices: &[i32], day: usize, holding: usize, memo: &mut [Vec<Option<i32>>; 2], calls: &mut u64) -> i32 {
        *calls += 1;
        if day >= prices.len() {
            return 0;
        }
        if let Some(saved) = memo[holding][day] {
            return saved;
        }
        let wait = go(prices, day + 1, holding, memo, calls);
        let act = if holding == 1 {
            prices[day] + go(prices, day + 2, 0, memo, calls)
        } else {
            -prices[day] + go(prices, day + 1, 1, memo, calls)
        };
        memo[holding][day] = Some(wait.max(act));
        wait.max(act)
    }
    let mut memo = [vec![None; prices.len()], vec![None; prices.len()]];
    go(prices, 0, 0, &mut memo, calls)
}

// Bảng ba trạng thái theo ngày: cầm, vừa bán, tay không
fn max_profit_table(prices: &[i32]) -> i32 {
    let n = prices.len();
    let (mut hold, mut sold, mut rest) = (vec![0; n], vec![0; n], vec![0; n]);
    hold[0] = -prices[0];
    sold[0] = NEG;
    for i in 1..n {
        hold[i] = hold[i - 1].max(rest[i - 1] - prices[i]);
        sold[i] = hold[i - 1] + prices[i];
        rest[i] = rest[i - 1].max(sold[i - 1]);
    }
    sold[n - 1].max(rest[n - 1])
}

// Ba biến cuộn: mỗi ngày chỉ đọc giá trị của hôm trước
fn max_profit(prices: &[i32]) -> i32 {
    let (mut hold, mut sold, mut rest) = (-prices[0], NEG, 0);
    for &price in &prices[1..] {
        let prev_sold = sold;
        sold = hold + price;
        hold = hold.max(rest - price);
        rest = rest.max(prev_sold);
    }
    sold.max(rest)
}

// Đối chiếu độc lập: liệt kê mọi tập giao dịch (mua b, bán s), lần mua sau từ s + 2
fn best_by_trades(prices: &[i32], start: usize) -> i32 {
    let mut best = 0;
    for b in start..prices.len() {
        for s in b + 1..prices.len() {
            best = best.max(prices[s] - prices[b] + best_by_trades(prices, s + 2));
        }
    }
    best
}

fn main() {
    let zigzag: Vec<i32> = (0..5000).map(|i| if i % 2 == 0 { 1 } else { 3 }).collect();
    let ramps: Vec<i32> = (0..5000).map(|i| i % 1000).collect();
    let cases: Vec<(Vec<i32>, i32)> = vec![
        (vec![7], 0),
        (vec![4, 2], 0),
        (vec![2, 9], 7),
        (vec![2, 6, 1, 7], 6),
        (vec![1, 3, 1, 5], 4),
        ((1..=10).collect(), 9),
        (vec![9, 8, 7, 6, 5], 0),
        (vec![1, 3, 1, 3, 1, 3, 1, 3], 4),
        (vec![3, 3, 3, 3], 0),
        (vec![6, 1, 6, 1, 6, 0, 9], 14),
        (vec![4, 1, 2, 8, 0, 5, 6], 8),
        (zigzag, 2500),
        (ramps, 4991),
    ];
    let mut ok = 0;
    for (prices, expected) in &cases {
        let mut calls = 0;
        let mut results = vec![max_profit(prices), max_profit_table(prices), max_profit_memo(prices, &mut calls)];
        if prices.len() <= 16 {
            results.push(max_profit_brute(prices, &mut calls));
        }
        if prices.len() <= 10 {
            results.push(best_by_trades(prices, 0));
        }
        if results.iter().all(|r| r == expected) {
            ok += 1;
        }
    }
    println!("{}/{} ca đúng", ok, cases.len());

    let (mut exhaustive_ok, mut total) = (0, 0);
    let mut arrays: Vec<Vec<i32>> = vec![vec![]];
    let mut k = 0;
    while k < arrays.len() {
        if arrays[k].len() < 6 {
            for v in 0..=3 {
                let mut prices = arrays[k].clone();
                prices.push(v);
                total += 1;
                let mut calls = 0;
                let expected = best_by_trades(&prices, 0);
                let results = [
                    max_profit_brute(&prices, &mut calls),
                    max_profit_memo(&prices, &mut calls),
                    max_profit_table(&prices),
                    max_profit(&prices),
                ];
                if results.iter().all(|&r| r == expected) {
                    exhaustive_ok += 1;
                }
                arrays.push(prices);
            }
        }
        k += 1;
    }
    println!("{}/{} ca đúng (đối chiếu liệt kê giao dịch)", exhaustive_ok, total);

    let sample = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8, 9, 7, 9, 3, 2, 3, 8, 4];
    let (mut brute_calls, mut memo_calls) = (0, 0);
    max_profit_brute(&sample, &mut brute_calls);
    max_profit_memo(&sample, &mut memo_calls);
    println!("20 ngày: vét cạn {} lượt gọi, memo {} lượt gọi", brute_calls, memo_calls);
}
