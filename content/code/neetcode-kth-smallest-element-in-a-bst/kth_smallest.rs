use std::{cell::RefCell, rc::Rc};

type Node = Option<Rc<RefCell<TreeNode>>>;

struct TreeNode {
    val: i32,
    left: Node,
    right: Node,
}

fn node(val: i32, left: Node, right: Node) -> Node {
    Some(Rc::new(RefCell::new(TreeNode { val, left, right })))
}

fn kth_smallest(root: &Node, mut k: usize) -> Option<i32> {
    let mut current = root.clone();
    let mut stack = Vec::new();
    while k > 0 {
        while let Some(node) = current {
            current = node.borrow().left.clone();
            stack.push(node);
        }
        let node = stack.pop()?;
        let node = node.borrow();
        k -= 1;
        if k == 0 {
            return Some(node.val);
        }
        current = node.right.clone();
    }
    None
}

fn main() {
    let tree = node(
        3,
        node(1, node(0, None, None), node(2, None, None)),
        node(4, None, None),
    );
    for (i, expected) in [0, 1, 2, 3, 4].into_iter().enumerate() {
        assert_eq!(kth_smallest(&tree, i + 1), Some(expected));
    }
    assert_eq!(kth_smallest(&tree, 6), None);
    println!("6/6 ca đúng");
}
