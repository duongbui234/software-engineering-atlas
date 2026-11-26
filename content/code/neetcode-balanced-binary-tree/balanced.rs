use std::{cell::RefCell, rc::Rc};

type Node = Option<Rc<RefCell<TreeNode>>>;

struct TreeNode {
    _val: i32,
    left: Node,
    right: Node,
}

fn node(val: i32, left: Node, right: Node) -> Node {
    Some(Rc::new(RefCell::new(TreeNode {
        _val: val,
        left,
        right,
    })))
}

fn is_balanced(root: &Node) -> bool {
    fn height(root: &Node) -> Option<i32> {
        let Some(root) = root else { return Some(0) };
        let root = root.borrow();
        let left = height(&root.left)?;
        let right = height(&root.right)?;
        (left.abs_diff(right) <= 1).then_some(1 + left.max(right))
    }
    height(root).is_some()
}

fn main() {
    let leaf = node(3, None, None);
    let child = node(2, leaf.clone(), None);
    assert!(is_balanced(&None));
    assert!(is_balanced(&leaf));
    assert!(is_balanced(&node(1, child.clone(), leaf)));
    assert!(!is_balanced(&node(1, child.clone(), None)));
    assert!(!is_balanced(&node(0, node(1, child.clone(), None), child)));
    println!("5/5 ca đúng");
}
