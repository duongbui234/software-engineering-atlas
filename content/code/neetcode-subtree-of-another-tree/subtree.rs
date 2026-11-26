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

fn same_tree(a: &Node, b: &Node) -> bool {
    match (a, b) {
        (None, None) => true,
        (Some(a), Some(b)) => {
            let a = a.borrow();
            let b = b.borrow();
            a.val == b.val && same_tree(&a.left, &b.left) && same_tree(&a.right, &b.right)
        }
        _ => false,
    }
}

fn is_subtree(root: &Node, sub: &Node) -> bool {
    if sub.is_none() {
        return true;
    }
    if same_tree(root, sub) {
        return true;
    }
    let Some(root) = root else { return false };
    let root = root.borrow();
    is_subtree(&root.left, sub) || is_subtree(&root.right, sub)
}

fn main() {
    let sub = node(4, node(1, None, None), node(2, None, None));
    assert!(is_subtree(
        &node(3, sub.clone(), node(5, None, None)),
        &node(4, node(1, None, None), node(2, None, None))
    ));
    assert!(!is_subtree(&sub, &node(4, node(1, None, None), None)));
    assert!(!is_subtree(&node(12, None, None), &node(2, None, None)));
    assert!(!is_subtree(
        &node(4, None, node(1, None, None)),
        &node(4, node(1, None, None), None)
    ));
    assert!(is_subtree(&sub, &node(2, None, None)));
    println!("5/5 ca đúng");
}
