// LeetCode 155, Min Stack: bốn cách, một bản sai, test.
// Chạy: rustc --edition 2021 -O min_stack.rs && ./min_stack

trait MinStackLike { fn push(&mut self, x: i32); fn pop(&mut self); fn top(&self) -> i32; fn get_min(&self) -> i32; }

// Cách 1: chỉ một Vec; get_min duyệt cả Vec, O(n).
#[derive(Default)]
struct ScanMinStack { a: Vec<i32> }
impl MinStackLike for ScanMinStack {
    fn push(&mut self, x: i32) { self.a.push(x); }
    fn pop(&mut self) { self.a.pop(); }
    fn top(&self) -> i32 { *self.a.last().unwrap() }
    fn get_min(&self) -> i32 { *self.a.iter().min().unwrap() }
}

// Cách 2: mỗi tầng nhớ cặp (giá trị, min tới tầng này); tuple nằm liền trong Vec, không cấp phát riêng.
#[derive(Default)]
struct PairMinStack { a: Vec<(i32, i32)> }
impl MinStackLike for PairMinStack {
    fn push(&mut self, x: i32) {
        let m = self.a.last().map_or(x, |&(_, m)| m.min(x));
        self.a.push((x, m));
    }
    fn pop(&mut self) { self.a.pop(); }
    fn top(&self) -> i32 { self.a.last().unwrap().0 }
    fn get_min(&self) -> i32 { self.a.last().unwrap().1 }
}

// Cách 3: hai ngăn xếp; ngăn phụ chỉ nhận x khi x <= min hiện tại (phải có dấu =).
#[derive(Default)]
struct TwoStackMinStack { a: Vec<i32>, mins: Vec<i32>, strict: bool }
impl MinStackLike for TwoStackMinStack {
    fn push(&mut self, x: i32) {
        self.a.push(x);
        let take = match self.mins.last() {
            None => true,
            Some(&m) => if self.strict { x < m } else { x <= m }, // strict = bản sai thiếu dấu =
        };
        if take { self.mins.push(x); }
    }
    fn pop(&mut self) {
        if self.a.pop() == self.mins.last().copied() { self.mins.pop(); } // so hai Option<i32> theo giá trị
    }
    fn top(&self) -> i32 { *self.a.last().unwrap() }
    fn get_min(&self) -> i32 { *self.mins.last().unwrap() } // ngăn phụ rỗng: unwrap panic
}

// Cách 4: lưu hiệu x − min cũ và một biến min; hiệu âm nghĩa là tầng này đổi min.
// Hiệu của hai i32 có thể vượt i32 (2147483647 − (−2147483648)), nên lưu bằng i64.
#[derive(Default)]
struct DiffMinStack { d: Vec<i64>, min: i64 }
impl MinStackLike for DiffMinStack {
    fn push(&mut self, x: i32) {
        let x = x as i64;
        if self.d.is_empty() { self.d.push(0); self.min = x; return; }
        self.d.push(x - self.min);
        if x < self.min { self.min = x; }
    }
    fn pop(&mut self) {
        let diff = self.d.pop().unwrap();
        if diff < 0 { self.min -= diff; } // khôi phục min cũ
    }
    fn top(&self) -> i32 { let diff = *self.d.last().unwrap(); (if diff < 0 { self.min } else { self.min + diff }) as i32 }
    fn get_min(&self) -> i32 { self.min as i32 }
}

enum Op { Push(i32), Pop, Top, GetMin }
use Op::*;

fn main() {
    std::panic::set_hook(Box::new(|_| {})); // bản sai sẽ panic; bắt lại để in kết quả gọn
    let cases: Vec<(&str, Vec<Op>, Vec<i32>)> = vec![
        ("ví dụ của đề", vec![Push(-2), Push(0), Push(-3), GetMin, Pop, Top, GetMin], vec![-3, 0, -2]),
        ("min lặp lại", vec![Push(0), Push(1), Push(0), GetMin, Pop, GetMin], vec![0, 0]),
        ("tăng dần", vec![Push(1), Push(2), Push(3), GetMin, Pop, Pop, GetMin], vec![1, 1]),
        ("giảm dần", vec![Push(3), Push(2), Push(1), GetMin, Pop, GetMin, Pop, GetMin], vec![1, 2, 3]),
        ("biên 32 bit", vec![Push(2147483647), Push(-2147483648), GetMin, Top, Pop, GetMin, Top], vec![-2147483648, -2147483648, 2147483647, 2147483647]),
        ("số lớn hơn 127", vec![Push(500), Pop, Push(700), GetMin], vec![700]),
    ];
    let impls: Vec<(&str, fn() -> Box<dyn MinStackLike>)> = vec![
        ("ScanMinStack", || Box::new(ScanMinStack::default())),
        ("PairMinStack", || Box::new(PairMinStack::default())),
        ("TwoStackMinStack", || Box::new(TwoStackMinStack::default())),
        ("DiffMinStack", || Box::new(DiffMinStack::default())),
        ("StrictLessMinStack", || Box::new(TwoStackMinStack { strict: true, ..Default::default() })),
    ];
    for (name, make) in impls {
        let mut bad = Vec::new();
        for (cname, ops, want) in &cases {
            let got = std::panic::catch_unwind(|| {
                let mut s = make();
                let mut out = Vec::new();
                for op in ops {
                    match op { Push(x) => s.push(*x), Pop => s.pop(), Top => out.push(s.top()), GetMin => out.push(s.get_min()) }
                }
                out
            });
            match got {
                Ok(out) if out == *want => {}
                Ok(_) => bad.push(cname.to_string()),
                Err(_) => bad.push(format!("{} (panic)", cname)),
            }
        }
        let tail = if bad.is_empty() { String::new() } else { format!("; sai ở: {}", bad.join(", ")) };
        println!("{:<19} {}/{} ca đúng{}", name, cases.len() - bad.len(), cases.len(), tail);
    }
}
