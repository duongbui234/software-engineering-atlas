type Link = Option<Box<ListNode>>;

struct ListNode {
    val: i32,
    next: Link,
}

use std::cmp::Ordering;
use std::collections::BinaryHeap;

struct Entry(Box<ListNode>);

impl Ord for Entry {
    fn cmp(&self, other: &Self) -> Ordering {
        other.0.val.cmp(&self.0.val)
    }
}

impl PartialOrd for Entry {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

impl PartialEq for Entry {
    fn eq(&self, other: &Self) -> bool {
        self.0.val == other.0.val
    }
}

impl Eq for Entry {}

fn merge_k_lists(lists: Vec<Link>) -> Link {
    let mut heap: BinaryHeap<_> = lists.into_iter().flatten().map(Entry).collect();
    let mut result = None;
    let mut tail = &mut result;
    while let Some(Entry(mut node)) = heap.pop() {
        if let Some(next) = node.next.take() {
            heap.push(Entry(next));
        }
        tail = &mut tail.insert(node).next;
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
    let cases: &[(&[&[i32]], &[i32])] = &[
        (
            &[&[1, 4, 5], &[1, 3, 4], &[2, 6]],
            &[1, 1, 2, 3, 4, 4, 5, 6],
        ),
        (&[], &[]),
        (&[&[], &[-2, 0], &[], &[-2, 10]], &[-2, -2, 0, 10]),
        (&[&[9], &[10]], &[9, 10]),
    ];
    for &(lists, expected) in cases {
        assert_eq!(
            values_of(&merge_k_lists(
                lists.iter().map(|list| list_from(list)).collect()
            )),
            expected
        );
    }
    println!("{0}/{0} ca đúng", cases.len());
}
