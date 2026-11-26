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

fn is_same_tree(a: &Node, b: &Node) -> bool {
    match (a, b) {
        (None, None) => true,
        (Some(a), Some(b)) => {
            let a = a.borrow();
            let b = b.borrow();
            a.val == b.val && is_same_tree(&a.left, &b.left) && is_same_tree(&a.right, &b.right)
        }
        _ => false,
    }
}

fn main() {
    assert!(is_same_tree(&None, &None));
    assert!(!is_same_tree(&None, &node(0, None, None)));
    assert!(is_same_tree(
        &node(-1, node(200, None, None), None),
        &node(-1, node(200, None, None), None)
    ));
    assert!(!is_same_tree(
        &node(1, node(2, None, None), None),
        &node(1, None, node(2, None, None))
    ));
    assert!(!is_same_tree(&node(1, None, None), &node(2, None, None)));
    println!("5/5 ca đúng");
}
