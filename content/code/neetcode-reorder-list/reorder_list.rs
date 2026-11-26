// LC 143 Reorder List: ba bước (đếm/cắt ở giữa, đảo nửa sau, đan xen) và mảng các nút.
// Chạy: rustc --edition 2021 -O reorder_list.rs && ./reorder_list

use std::time::Instant;

#[derive(PartialEq, Eq, Clone, Debug)]
pub struct ListNode {
    pub val: i32,
    pub next: Option<Box<ListNode>>,
}

type List = Option<Box<ListNode>>;

fn build(a: &[i32]) -> List {
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

fn expected(v: &[i32]) -> Vec<i32> {
    let mut out = vec![];
    let (mut i, mut j) = (0i64, v.len() as i64 - 1);
    while i <= j {
        out.push(v[i as usize]);
        if i != j {
            out.push(v[j as usize]);
        }
        i += 1;
        j -= 1;
    }
    out
}

fn drop_iterative(mut h: List) {
    while let Some(mut n) = h {
        h = n.next.take();
    }
}

fn reverse(mut cur: List) -> List {
    let mut prev = None;
    while let Some(mut node) = cur {
        cur = node.next.take();
        node.next = prev;
        prev = Some(node);
    }
    prev
}

// Cách 1: ba bước. Box không cho giữ hai con trỏ slow, fast cùng đi trên một danh sách
// (fast mượn cả chuỗi, slow lại muốn sửa giữa chuỗi), nên bước 1 đếm độ dài rồi đi tới giữa.
pub fn reorder_three_steps(head: &mut List) {
    let mut n = 0;
    let mut p = head.as_ref();
    while let Some(x) = p {
        n += 1;
        p = x.next.as_ref();
    }
    if n < 3 {
        return;
    }
    // bước 1: đi tới nút cuối của nửa đầu ((n + 1) / 2 nút)
    let mut mid = head.as_mut().unwrap();
    for _ in 1..(n + 1) / 2 {
        mid = mid.next.as_mut().unwrap();
    }
    // bước 2: take() vừa cắt vừa lấy nửa sau, rồi đảo nó
    let mut second = reverse(mid.next.take());
    // bước 3: đan xen, tail là ô next cuối của kết quả
    let mut first = head.take();
    let mut tail = head;
    while let Some(mut a) = first {
        first = a.next.take();
        *tail = Some(a);
        tail = &mut tail.as_mut().unwrap().next;
        if let Some(mut b) = second {
            second = b.next.take();
            *tail = Some(b);
            tail = &mut tail.as_mut().unwrap().next;
        }
    }
}

// Cách 2: tháo mọi nút vào một Vec, rồi nối lại từ cuối thứ tự L0, Ln, L1, …
pub fn reorder_vec(head: &mut List) {
    let mut nodes: Vec<Box<ListNode>> = vec![];
    let mut cur = head.take();
    while let Some(mut node) = cur {
        cur = node.next.take();
        nodes.push(node);
    }
    let mut order = Vec::with_capacity(nodes.len());
    let (mut i, mut j) = (0usize, nodes.len());
    while i < j {
        order.push(i);
        i += 1;
        if i < j {
            j -= 1;
            order.push(j);
        }
    }
    let mut slots: Vec<Option<Box<ListNode>>> = nodes.into_iter().map(Some).collect();
    let mut result = None;
    for &k in order.iter().rev() {
        let mut node = slots[k].take().unwrap();
        node.next = result;
        result = Some(node);
    }
    *head = result;
}

// SAI: cắt ở n / 2 nên nửa sau dài hơn nửa đầu; độ dài lẻ thì unwrap() gặp None.
pub fn wrong_second_longer(head: &mut List) {
    let mut n = 0;
    let mut p = head.as_ref();
    while let Some(x) = p {
        n += 1;
        p = x.next.as_ref();
    }
    if n < 2 {
        return;
    }
    let mut mid = head.as_mut().unwrap();
    for _ in 1..n / 2 {
        mid = mid.next.as_mut().unwrap();
    }
    let mut second = reverse(mid.next.take());
    let mut first = head.take();
    let mut tail = head;
    while let Some(mut b) = second {
        let mut a = first.unwrap(); // nửa đầu hết trước: panic
        first = a.next.take();
        second = b.next.take();
        *tail = Some(a);
        tail = &mut tail.as_mut().unwrap().next;
        *tail = Some(b);
        tail = &mut tail.as_mut().unwrap().next;
    }
}

fn main() {
    std::panic::set_hook(Box::new(|_| {}));
    let cases: Vec<Vec<i32>> = vec![
        vec![1, 2, 3, 4],
        vec![1, 2, 3, 4, 5],
        vec![1],
        vec![1, 2],
        vec![1, 2, 3],
        vec![],
        vec![10, 20, 30, 40, 50, 60],
        vec![7, 7, 7, 8, 8],
    ];
    let show = |v: &[i32]| format!("[{}]", v.iter().map(|x| x.to_string()).collect::<Vec<_>>().join(","));
    let fns: [(&str, fn(&mut List)); 3] = [
        ("reorder_three_steps", reorder_three_steps),
        ("reorder_vec", reorder_vec),
        ("wrong_second_longer", wrong_second_longer),
    ];
    for (name, f) in fns {
        let mut bad = vec![];
        for vals in &cases {
            let mut head = build(vals);
            let got = match std::panic::catch_unwind(move || {
                f(&mut head);
                to_vec(&head)
            }) {
                Ok(v) => show(&v),
                Err(_) => "panic (unwrap trên None)".to_string(),
            };
            if got != show(&expected(vals)) {
                bad.push(format!("{} → {}", show(vals), got));
            }
        }
        let tail = if bad.is_empty() { String::new() } else { format!("; sai ở {}", bad.join(", ")) };
        println!("{:<19} {}/{} ca đúng{}", name, cases.len() - bad.len(), cases.len(), tail);
    }
    println!("wrongNoCut: trình biên dịch từ chối (một nút không thể có hai chủ), không chạy được");

    println!();
    for n in [100_000, 1_000_000] {
        let vals: Vec<i32> = (1..=n).collect();
        let mut row = vec![];
        for (name, f) in [("ba bước", reorder_three_steps as fn(&mut List)), ("Vec các nút", reorder_vec)] {
            let mut h = build(&vals);
            let t0 = Instant::now();
            f(&mut h);
            row.push(format!("{} {:.2} ms", name, t0.elapsed().as_secs_f64() * 1e3));
            drop_iterative(h);
        }
        println!("n = {}: {}", n, row.join(", "));
    }
}
