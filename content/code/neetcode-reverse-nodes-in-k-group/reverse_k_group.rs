type Link = Option<Box<ListNode>>;

struct ListNode {
    val: i32,
    next: Link,
}

fn reverse_k_group(mut head: Link, k: usize) -> Link {
    if k <= 1 {
        return head;
    }
    let mut result = None;
    let mut tail = &mut result;
    loop {
        let mut probe = head.as_deref();
        for _ in 0..k {
            let Some(node) = probe else {
                *tail = head;
                return result;
            };
            probe = node.next.as_deref();
        }
        let mut group = None;
        for _ in 0..k {
            let mut node = head.take().unwrap();
            head = node.next.take();
            node.next = group;
            group = Some(node);
        }
        *tail = group;
        for _ in 0..k {
            tail = &mut tail.as_mut().unwrap().next;
        }
    }
}

fn list_from(values: &[i32]) -> Link {
    values
        .iter()
        .rev()
        .fold(None, |next, &val| Some(Box::new(ListNode { val, next })))
}

fn values_of(head: &Link) -> Vec<i32> {
    let mut out = Vec::new();
    let mut current = head.as_deref();
    while let Some(node) = current {
        out.push(node.val);
        current = node.next.as_deref();
    }
    out
}

fn main() {
    let cases: &[(&[i32], usize, &[i32])] = &[
        (&[1, 2, 3, 4, 5], 2, &[2, 1, 4, 3, 5]),
        (&[1, 2, 3, 4, 5], 3, &[3, 2, 1, 4, 5]),
        (&[1, 2], 1, &[1, 2]),
        (&[1, 1, 2, 3], 4, &[3, 2, 1, 1]),
        (&[1], 1, &[1]),
    ];
    for &(list, k, expected) in cases {
        assert_eq!(values_of(&reverse_k_group(list_from(list), k)), expected);
    }
    println!("{0}/{0} ca đúng", cases.len());
}
