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

fn is_valid_bst(root: &Node) -> bool {
    fn check(root: &Node, lo: Option<i32>, hi: Option<i32>) -> bool {
        let Some(root) = root else { return true };
        let root = root.borrow();
        let val = root.val;
        if lo.is_some_and(|lo| val <= lo) || hi.is_some_and(|hi| val >= hi) {
            return false;
        }
        check(&root.left, lo, Some(val)) && check(&root.right, Some(val), hi)
    }
    check(root, None, None)
}

fn main() {
    assert!(is_valid_bst(&None));
    assert!(is_valid_bst(&node(
        0,
        node(i32::MIN, None, None),
        node(i32::MAX, None, None)
    )));
    assert!(!is_valid_bst(&node(1, node(1, None, None), None)));
    assert!(!is_valid_bst(&node(1, None, node(1, None, None))));
    assert!(!is_valid_bst(&node(
        5,
        node(3, None, node(6, None, None)),
        node(8, None, None)
    )));
    println!("5/5 ca đúng");
}
