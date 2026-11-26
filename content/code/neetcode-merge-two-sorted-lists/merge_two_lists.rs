// LeetCode 21: Merge Two Sorted Lists.
// Chạy: rustc --edition 2021 -O merge_two_lists.rs && ./merge_two_lists

#[derive(PartialEq, Eq, Clone, Debug)]
pub struct ListNode {
    pub val: i32,
    pub next: Option<Box<ListNode>>,
}

type List = Option<Box<ListNode>>;

fn from_vec(a: &[i32]) -> List {
    let mut head = None;
    for &v in a.iter().rev() {
        head = Some(Box::new(ListNode { val: v, next: head }));
    }
    head
}

fn to_vec(mut p: &List) -> Vec<i32> {
    let mut out = vec![];
    while let Some(n) = p {
        out.push(n.val);
        p = &n.next;
    }
    out
}

// Hủy từng nút một: Drop mặc định của Box hủy lồng nhau theo chuỗi.
fn drop_iterative(mut h: List) {
    while let Some(mut n) = h {
        h = n.next.take();
    }
}

// Nút giả: tail là một &mut trỏ vào ô next cuối cùng của kết quả.
fn merge_dummy(mut a: List, mut b: List) -> List {
    let mut dummy = Box::new(ListNode { val: 0, next: None });
    let mut tail = &mut dummy;
    while let (Some(x), Some(y)) = (&a, &b) {
        let src = if x.val <= y.val { &mut a } else { &mut b }; // <= giữ nút của a trước khi bằng nhau
        let mut node = src.take().unwrap();
        *src = node.next.take(); // danh sách nguồn tiến một nút
        tail.next = Some(node);
        tail = tail.next.as_mut().unwrap();
    }
    tail.next = if a.is_some() { a } else { b }; // nối nguyên phần còn lại
    dummy.next
}

// Đệ quy: đầu nhỏ hơn đứng trước, phần sau là kết quả trộn phần còn lại.
fn merge_recursive(a: List, b: List) -> List {
    match (a, b) {
        (None, r) | (r, None) => r,
        (Some(mut x), Some(mut y)) => {
            if x.val <= y.val {
                x.next = merge_recursive(x.next.take(), Some(y));
                Some(x)
            } else {
                y.next = merge_recursive(Some(x), y.next.take());
                Some(y)
            }
        }
    }
}

fn concat_sort(a: List, b: List) -> List {
    let mut all = to_vec(&a);
    all.extend(to_vec(&b));
    all.sort(); // sort của Rust ổn định và so số với số
    from_vec(&all)
}

// SAI: bỏ nút giả, gọi unwrap() khi một bên có thể rỗng: panic.
fn wrong_no_dummy(mut a: List, mut b: List) -> List {
    let take_a = a.as_ref().unwrap().val <= b.as_ref().unwrap().val;
    let src = if take_a { &mut a } else { &mut b };
    let mut head = src.take().unwrap();
    *src = head.next.take();
    head.next = merge_dummy(a, b);
    Some(head)
}

// SAI: quên nối phần còn lại.
fn wrong_forget_tail(mut a: List, mut b: List) -> List {
    let mut dummy = Box::new(ListNode { val: 0, next: None });
    let mut tail = &mut dummy;
    while let (Some(x), Some(y)) = (&a, &b) {
        let src = if x.val <= y.val { &mut a } else { &mut b };
        let mut node = src.take().unwrap();
        *src = node.next.take();
        tail.next = Some(node);
        tail = tail.next.as_mut().unwrap();
    }
    dummy.next
}

// SAI: quên tiến tail. Gán đè tail.next làm Rust hủy luôn nút cũ.
fn wrong_no_advance(mut a: List, mut b: List) -> List {
    let mut dummy = Box::new(ListNode { val: 0, next: None });
    let tail = &mut dummy;
    while let (Some(x), Some(y)) = (&a, &b) {
        let src = if x.val <= y.val { &mut a } else { &mut b };
        let mut node = src.take().unwrap();
        *src = node.next.take();
        tail.next = Some(node);
    }
    tail.next = if a.is_some() { a } else { b };
    dummy.next
}

fn main() {
    let args: Vec<String> = std::env::args().collect();
    if args.len() == 3 {
        // tiến trình con: trộn đệ quy tổng n nút
        let n: i32 = args[2].parse().unwrap();
        let a: Vec<i32> = (0..n).step_by(2).collect();
        let b: Vec<i32> = (1..n).step_by(2).collect();
        drop_iterative(merge_recursive(from_vec(&a), from_vec(&b)));
        println!("ok");
        return;
    }
    std::panic::set_hook(Box::new(|_| {})); // tắt dòng báo panic mặc định, tự in ở dưới

    let cases: Vec<(Vec<i32>, Vec<i32>)> = vec![
        (vec![1, 2, 4], vec![1, 3, 4]),
        (vec![], vec![]),
        (vec![], vec![0]),
        (vec![5], vec![1, 2, 3]),
        (vec![1, 2, 3], vec![]),
        (vec![-100, 0, 100], vec![-100, -50]),
        (vec![2, 2, 2], vec![2, 2]),
        (vec![1, 5, 9], vec![2, 3, 4, 6, 7, 8, 10]),
    ];
    let show = |v: &[i32]| format!("[{}]", v.iter().map(|x| x.to_string()).collect::<Vec<_>>().join(","));
    let fns: [(&str, fn(List, List) -> List); 6] = [
        ("merge_dummy", merge_dummy),
        ("merge_recursive", merge_recursive),
        ("concat_sort", concat_sort),
        ("wrong_no_dummy", wrong_no_dummy),
        ("wrong_forget_tail", wrong_forget_tail),
        ("wrong_no_advance", wrong_no_advance),
    ];
    for (name, f) in fns {
        let mut bad = vec![];
        for (a, b) in &cases {
            let mut want = [a.clone(), b.clone()].concat();
            want.sort();
            let (la, lb) = (from_vec(a), from_vec(b));
            let got = match std::panic::catch_unwind(move || to_vec(&f(la, lb))) {
                Ok(v) => show(&v),
                Err(_) => "panic (unwrap trên None)".to_string(),
            };
            if got != show(&want) {
                bad.push(format!("{}+{} → {}", show(a), show(b), got));
            }
        }
        let tail = if bad.is_empty() { String::new() } else { format!("; sai ở {}", bad.join(", ")) };
        println!("{:<17} {}/{} ca đúng{}", name, cases.len() - bad.len(), cases.len(), tail);
    }

    println!();
    for n in [10_000, 100_000, 1_000_000] {
        let ok = std::process::Command::new(&args[0]).args(["child", &n.to_string()]).output().unwrap().status.success();
        println!("đệ quy, tổng {} nút: {}", n, if ok { "chạy xong" } else { "tiến trình sập (tràn ngăn xếp)" });
    }
}
