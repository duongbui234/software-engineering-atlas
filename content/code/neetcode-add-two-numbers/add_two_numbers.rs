type Link = Option<Box<ListNode>>;

struct ListNode {
    val: i32,
    next: Link,
}

fn add_two_numbers(a: &Link, b: &Link) -> Link {
    let (mut a, mut b) = (a.as_deref(), b.as_deref());
    let mut result = None;
    let mut tail = &mut result;
    let mut carry = 0;
    while a.is_some() || b.is_some() || carry != 0 {
        let sum = a.map_or(0, |n| n.val) + b.map_or(0, |n| n.val) + carry;
        carry = sum / 10;
        tail = &mut tail
            .insert(Box::new(ListNode {
                val: sum % 10,
                next: None,
            }))
            .next;
        a = a.and_then(|n| n.next.as_deref());
        b = b.and_then(|n| n.next.as_deref());
    }
    result
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
    let cases: &[(&[i32], &[i32], &[i32])] = &[
        (&[2, 4, 3], &[5, 6, 4], &[7, 0, 8]),
        (&[0], &[0], &[0]),
        (&[9, 9, 9], &[1], &[0, 0, 0, 1]),
        (&[5], &[5], &[0, 1]),
    ];
    for &(a, b, expected) in cases {
        assert_eq!(
            values_of(&add_two_numbers(&list_from(a), &list_from(b))),
            expected
        );
    }
    println!("{0}/{0} ca đúng", cases.len());
}
