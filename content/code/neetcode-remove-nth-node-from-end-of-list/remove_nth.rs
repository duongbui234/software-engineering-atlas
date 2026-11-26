// LeetCode 19: Remove Nth Node From End of List.
// Chạy: rustc --edition 2021 -O remove_nth.rs && ./remove_nth

use std::panic;

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

// Hai lượt: đếm độ dài L bằng tham chiếu chỉ đọc, rồi đi L − n bước từ nút giả
// bằng tham chiếu ghi (&mut). Hai lượt không chồng nhau nên borrow checker cho qua.
fn two_pass(head: Option<Box<ListNode>>, n: i32) -> Option<Box<ListNode>> {
    let mut len = 0;
    let mut p = &head;
    while let Some(node) = p {
        len += 1;
        p = &node.next;
    }
    let mut dummy = Box::new(ListNode { val: 0, next: head });
    let mut prev = &mut dummy;
    for _ in 0..len - n {
        prev = prev.next.as_mut().unwrap();
    }
    let removed = prev.next.take().unwrap();
    prev.next = removed.next; // bỏ qua nút thứ n từ cuối
    dummy.next
}

// Một lượt: fast (chỉ đọc) và slow (ghi) cùng nằm trên một danh sách thì Rust từ chối,
// vì không được vừa mượn đọc vừa mượn ghi cùng một dữ liệu. Cách an toàn: fast chạy
// trên một bản sao. Vẫn là một lượt trên danh sách thật, nhưng tốn O(L) bộ nhớ cho bản sao.
fn one_pass(head: Option<Box<ListNode>>, n: i32) -> Option<Box<ListNode>> {
    let mut dummy = Box::new(ListNode { val: 0, next: head });
    let copy = dummy.clone();
    let mut fast: &Option<Box<ListNode>> = &copy.next;
    for _ in 0..n {
        fast = &fast.as_ref().unwrap().next; // fast đi trước n + 1 bước (tính cả nút giả)
    }
    let mut slow = &mut dummy;
    while let Some(f) = fast {
        fast = &f.next;
        slow = slow.next.as_mut().unwrap();
    }
    let removed = slow.next.take().unwrap();
    slow.next = removed.next;
    dummy.next
}

// Mảng các vị trí: đổi danh sách ra Vec giá trị, bỏ phần tử thứ n từ cuối, dựng lại.
// Rust không cho giữ nhiều con trỏ ghi vào các nút như mảng nút của TS.
fn value_vec(head: Option<Box<ListNode>>, n: i32) -> Option<Box<ListNode>> {
    let mut vals = to_vec(&head);
    let i = vals.len() - n as usize; // chỉ số nút cần xóa
    vals.remove(i);
    from_vec(&vals)
}

// SAI: không có nút giả; fast đi n bước từ head. Khi n = L (xóa chính đầu), fast thành None
// và unwrap() panic.
fn wrong_no_dummy(mut head: Option<Box<ListNode>>, n: i32) -> Option<Box<ListNode>> {
    let copy = head.clone();
    let mut fast = &copy;
    for _ in 0..n {
        fast = &fast.as_ref().unwrap().next;
    }
    let mut slow = head.as_mut().unwrap();
    while fast.as_ref().unwrap().next.is_some() {
        fast = &fast.as_ref().unwrap().next;
        slow = slow.next.as_mut().unwrap();
    }
    let removed = slow.next.take().unwrap();
    slow.next = removed.next;
    head
}

// SAI: có nút giả nhưng fast chỉ đi trước n bước (thiếu 1): slow dừng ở chính nút cần xóa.
fn wrong_gap(head: Option<Box<ListNode>>, n: i32) -> Option<Box<ListNode>> {
    let mut dummy = Box::new(ListNode { val: 0, next: head });
    let copy = dummy.clone();
    let mut fast: &Option<Box<ListNode>> = &Some(copy);
    for _ in 0..n {
        fast = &fast.as_ref().unwrap().next;
    }
    let mut slow = &mut dummy;
    while let Some(f) = fast {
        fast = &f.next;
        if slow.next.is_none() {
            break;
        }
        slow = slow.next.as_mut().unwrap();
    }
    if let Some(removed) = slow.next.take() {
        slow.next = removed.next;
    }
    dummy.next
}

fn show(a: &[i32]) -> String {
    format!("[{}]", a.iter().map(|v| v.to_string()).collect::<Vec<_>>().join(","))
}

fn main() {
    panic::set_hook(Box::new(|_| {})); // giữ màn hình gọn: panic được bắt và ghi vào kết quả
    let cases: Vec<(Vec<i32>, i32)> = vec![
        (vec![1, 2, 3, 4, 5], 2), // ví dụ 1 của đề
        (vec![1], 1),             // ví dụ 2
        (vec![1, 2], 1),          // ví dụ 3
        (vec![1, 2], 2),          // xóa đầu
        (vec![1, 2, 3], 3),       // xóa đầu
        (vec![1, 2, 3], 1),       // xóa đuôi
        (vec![5, 6, 7, 8], 3),
        (vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5),
    ];
    type F = fn(Option<Box<ListNode>>, i32) -> Option<Box<ListNode>>;
    let fns: [(&str, F); 5] = [
        ("two_pass", two_pass),
        ("one_pass", one_pass),
        ("value_vec", value_vec),
        ("wrong_no_dummy", wrong_no_dummy),
        ("wrong_gap", wrong_gap),
    ];
    for (name, f) in fns {
        let mut bad = vec![];
        for (a, n) in &cases {
            let mut want = a.clone();
            want.remove(a.len() - *n as usize);
            let (a2, n2) = (a.clone(), *n);
            let got = match panic::catch_unwind(move || to_vec(&f(from_vec(&a2), n2))) {
                Ok(v) => show(&v),
                Err(_) => "panic".to_string(),
            };
            if got != show(&want) {
                bad.push(format!("{} n={} → {}", show(a), n, got));
            }
        }
        let tail = if bad.is_empty() { String::new() } else { format!("; sai ở {}", bad.join(", ")) };
        println!("{:<14} {}/{} ca đúng{}", name, cases.len() - bad.len(), cases.len(), tail);
    }
}
