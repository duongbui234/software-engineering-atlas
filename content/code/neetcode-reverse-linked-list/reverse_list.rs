// LC 206 Reverse Linked List: lật chiều mọi con trỏ next.
// Chạy: rustc --edition 2021 -O reverse_list.rs && ./reverse_list

use std::time::Instant;

// Đúng hình LeetCode cho Rust: mỗi nút sở hữu nút sau nó.
#[derive(PartialEq, Eq, Clone, Debug)]
pub struct ListNode {
    pub val: i32,
    pub next: Option<Box<ListNode>>,
}

fn from_vec(a: &[i32]) -> Option<Box<ListNode>> {
    let mut head = None;
    for &v in a.iter().rev() {
        head = Some(Box::new(ListNode { val: v, next: head }));
    }
    head
}

fn to_vec(mut p: &Option<Box<ListNode>>) -> Vec<i32> {
    let mut out = vec![];
    while let Some(n) = p {
        out.push(n.val);
        p = &n.next;
    }
    out
}

// Lặp: take() lấy phần còn lại ra khỏi cur.next, để lại None: đúng bước "giữ next trước khi lật".
fn reverse_iterative(head: Option<Box<ListNode>>) -> Option<Box<ListNode>> {
    let mut prev = None;
    let mut cur = head;
    while let Some(mut node) = cur {
        cur = node.next.take(); // giữ phần còn lại
        node.next = prev; // lật một con trỏ
        prev = Some(node);
    }
    prev
}

// Đệ quy: Box không cho hai nút cùng trỏ tới một nút, nên không viết được
// "head.next.next = head". Thay vào đó truyền phần đã lật xuống như một tham số.
fn reverse_recursive(head: Option<Box<ListNode>>) -> Option<Box<ListNode>> {
    fn go(cur: Option<Box<ListNode>>, prev: Option<Box<ListNode>>) -> Option<Box<ListNode>> {
        match cur {
            None => prev,
            Some(mut node) => {
                let rest = node.next.take();
                node.next = prev;
                go(rest, Some(node))
            }
        }
    }
    go(head, None)
}

// Chép giá trị ra Vec rồi ghi ngược lại: O(n) bộ nhớ phụ.
fn reverse_via_vec(mut head: Option<Box<ListNode>>) -> Option<Box<ListNode>> {
    let mut vals = to_vec(&head);
    let mut p = &mut head;
    while let Some(n) = p {
        n.val = vals.pop().unwrap();
        p = &mut n.next;
    }
    head
}

// Hủy từng nút một. Để Rust tự hủy thì Drop của Box gọi lồng nhau theo chuỗi,
// danh sách đủ dài là tràn ngăn xếp.
fn drop_iterative(mut head: Option<Box<ListNode>>) {
    while let Some(mut n) = head {
        head = n.next.take();
    }
}

type Rev = fn(Option<Box<ListNode>>) -> Option<Box<ListNode>>;

fn main() {
    // Tiến trình con: dựng n nút rồi để Rust tự hủy, hoặc chạy bản đệ quy.
    let args: Vec<String> = std::env::args().collect();
    if args.len() == 4 {
        let n: i32 = args[2].parse().unwrap();
        let list = from_vec(&(0..n).collect::<Vec<_>>());
        if args[3] == "drop" {
            drop(list);
        } else {
            drop_iterative(reverse_recursive(list));
        }
        println!("ok");
        return;
    }

    let big: Vec<i32> = (0..5000).collect();
    let cases: Vec<Vec<i32>> = vec![vec![1, 2, 3, 4, 5], vec![1, 2], vec![], vec![1], vec![3, 3, 1], big];
    let names = ["ví dụ 1", "ví dụ 2", "rỗng", "một nút", "trùng giá trị", "5000 nút (giới hạn đề)"];
    let fns: [(&str, Rev); 3] = [
        ("reverse_iterative", reverse_iterative),
        ("reverse_recursive", reverse_recursive),
        ("reverse_via_vec", reverse_via_vec),
    ];
    for (name, f) in fns {
        let mut bad = vec![];
        for (k, c) in cases.iter().enumerate() {
            let want: Vec<i32> = c.iter().rev().cloned().collect();
            if to_vec(&f(from_vec(c))) != want {
                bad.push(names[k]);
            }
        }
        let tail = if bad.is_empty() { String::new() } else { format!("; sai ở {}", bad.join(", ")) };
        println!("{:<17} {}/{} ca đúng{}", name, cases.len() - bad.len(), cases.len(), tail);
    }
    // Hai bản sai của các ngôn ngữ kia không biên dịch được ở đây:
    // đi theo cur.next sau khi đã chuyển nó cho prev là "use after move",
    // và hai nút trỏ vào nhau cần hai chủ sở hữu cho một Box.
    println!("wrongLoseNext, wrongNoNullHead: trình biên dịch từ chối, không chạy được");

    let me = &args[0];
    for n in [10_000, 100_000, 1_000_000] {
        let run = |mode: &str| {
            let st = std::process::Command::new(me).args(["child", &n.to_string(), mode]).output().unwrap();
            if st.status.success() { "chạy xong".to_string() } else { "tiến trình sập (tràn ngăn xếp)".to_string() }
        };
        println!("n = {}: đệ quy {}; để Rust tự hủy danh sách {}", n, run("rec"), run("drop"));
    }

    for n in [100_000, 1_000_000] {
        let mut ts = vec![];
        for _ in 0..5 {
            let h = from_vec(&(0..n).collect::<Vec<_>>());
            let t0 = Instant::now();
            let r = reverse_iterative(h);
            ts.push(t0.elapsed().as_secs_f64() * 1e3);
            drop_iterative(r);
        }
        ts.sort_by(|a, b| a.partial_cmp(b).unwrap());
        println!("n = {}: lặp {:.2} ms", n, ts[2]);
    }
}
