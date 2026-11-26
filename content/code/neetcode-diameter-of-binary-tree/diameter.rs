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

fn diameter(root: &Node) -> i32 {
    fn height(root: &Node, best: &mut i32) -> i32 {
        let Some(root) = root else { return 0 };
        let root = root.borrow();
        let left = height(&root.left, best);
        let right = height(&root.right, best);
        *best = (*best).max(left + right);
        1 + left.max(right)
    }
    let mut best = 0;
    height(root, &mut best);
    best
}

fn main() {
    assert_eq!(diameter(&None), 0);
    assert_eq!(diameter(&node(4, None, None)), 0);
    assert_eq!(
        diameter(&node(2, node(2, None, None), node(2, None, None))),
        2
    );
    let path = node(
        2,
        node(3, node(4, None, None), None),
        node(5, node(6, None, None), None),
    );
    assert_eq!(diameter(&node(1, path, None)), 4);
    let chain = (0..10_000).fold(None, |left, val| node(val, left, None));
    assert_eq!(diameter(&chain), 9_999);
    println!("5/5 ca đúng");
}
