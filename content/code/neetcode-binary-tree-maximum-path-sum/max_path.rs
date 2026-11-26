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

fn max_path_sum(root: &Node) -> i32 {
    fn gain(root: &Node, best: &mut i32) -> i32 {
        let Some(root) = root else { return 0 };
        let root = root.borrow();
        let left = gain(&root.left, best).max(0);
        let right = gain(&root.right, best).max(0);
        *best = (*best).max(root.val + left + right);
        root.val + left.max(right)
    }
    let mut best = i32::MIN;
    gain(root, &mut best);
    best
}

fn main() {
    let tree = node(
        -10,
        node(9, None, None),
        node(20, node(15, None, None), node(7, None, None)),
    );
    assert_eq!(max_path_sum(&tree), 42);
    assert_eq!(
        max_path_sum(&node(-3, node(-2, None, None), node(-1, None, None))),
        -1
    );
    assert_eq!(
        max_path_sum(&node(1, node(2, None, None), node(3, None, None))),
        6
    );
    assert_eq!(max_path_sum(&node(-1000, None, None)), -1000);
    println!("4/4 ca đúng");
}
