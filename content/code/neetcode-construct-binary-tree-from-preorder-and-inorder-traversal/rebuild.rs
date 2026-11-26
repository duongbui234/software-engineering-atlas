// LC 105: dựng cây từ tiền thứ tự và trung thứ tự. Ba cách: quét, tra chỉ mục, ngăn xếp.
// Chạy: rustc --edition 2021 -O rebuild.rs && ./rebuild
use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::Rc;

// Hình dạng nút giống LeetCode.
pub struct TreeNode {
    pub val: i32,
    pub left: Option<Rc<RefCell<TreeNode>>>,
    pub right: Option<Rc<RefCell<TreeNode>>>,
}
type Node = Option<Rc<RefCell<TreeNode>>>;

fn new_node(val: i32) -> Rc<RefCell<TreeNode>> {
    Rc::new(RefCell::new(TreeNode { val, left: None, right: None }))
}

// find_root(value, lo) trả vị trí của gốc trong trung thứ tự.
fn build_ranges(preorder: &[i32], find_root: &dyn Fn(i32, usize) -> usize) -> Node {
    fn build(lo: usize, hi: usize, next: &mut usize, preorder: &[i32], find_root: &dyn Fn(i32, usize) -> usize) -> Node {
        if lo == hi {
            return None;
        }
        let value = preorder[*next];
        *next += 1;
        let root = new_node(value);
        let mid = find_root(value, lo);
        let left = build(lo, mid, next, preorder, find_root);
        let right = build(mid + 1, hi, next, preorder, find_root);
        root.borrow_mut().left = left;
        root.borrow_mut().right = right;
        Some(root)
    }
    let mut next = 0;
    build(0, preorder.len(), &mut next, preorder, find_root)
}

fn scan_from(inorder: &[i32], value: i32, mut lo: usize) -> usize {
    while inorder[lo] != value {
        lo += 1;
    }
    lo
}

fn by_scan(preorder: &[i32], inorder: &[i32]) -> Node {
    build_ranges(preorder, &|value, lo| scan_from(inorder, value, lo))
}

fn by_index(preorder: &[i32], inorder: &[i32]) -> Node {
    let index: HashMap<i32, usize> = inorder.iter().enumerate().map(|(i, &v)| (v, i)).collect();
    build_ranges(preorder, &|value, _lo| index[&value])
}

fn by_stack(preorder: &[i32], inorder: &[i32]) -> Node {
    if preorder.is_empty() {
        return None;
    }
    let root = new_node(preorder[0]);
    let mut pending = vec![root.clone()];
    let mut next_in = 0;

    for &value in &preorder[1..] {
        let child = new_node(value);
        // clone Rc của đỉnh: giữ tham chiếu vào `pending` thì không pop được bên dưới
        let mut parent = pending.last().unwrap().clone();

        if parent.borrow().val != inorder[next_in] {
            parent.borrow_mut().left = Some(child.clone());
        } else {
            while pending.last().map_or(false, |top| top.borrow().val == inorder[next_in]) {
                parent = pending.pop().unwrap();
                next_in += 1;
            }
            parent.borrow_mut().right = Some(child.clone());
        }

        pending.push(child);
    }

    Some(root)
}

fn check(root: Node, preorder: &[i32], inorder: &[i32]) {
    let (mut before, mut between, mut pending) = (Vec::new(), Vec::new(), Vec::new());
    let mut cur = root;
    while cur.is_some() || !pending.is_empty() {
        while let Some(node) = cur {
            before.push(node.borrow().val);
            cur = node.borrow().left.clone();
            pending.push(node);
        }
        let node = pending.pop().unwrap();
        between.push(node.borrow().val);
        cur = node.borrow().right.clone();
    }
    assert_eq!(before, preorder);
    assert_eq!(between, inorder);
}

fn main() {
    let cases: Vec<(Vec<i32>, Vec<i32>)> = vec![
        (vec![-3000], vec![-3000]),
        (vec![8, 14, 5, -2, 4, 0], vec![14, 5, 8, 4, -2, 0]),
        (vec![1, 2, 3, 4], vec![4, 3, 2, 1]),
        (vec![1, 2, 3, 4], vec![1, 2, 3, 4]),
        (vec![1, -2, 3, -4], vec![-2, -4, 3, 1]),
    ];
    type Rebuild = fn(&[i32], &[i32]) -> Node;
    let mut ok = 0;
    for rebuild in [by_scan as Rebuild, by_index, by_stack] {
        for (preorder, inorder) in &cases {
            check(rebuild(preorder, inorder), preorder, inorder);
            ok += 1;
        }
    }

    // chuỗi 3000 nút: thả chuỗi Rc dài là đệ quy trong drop, 3000 tầng vẫn an toàn
    let straight: Vec<i32> = (1..=3000).collect();
    let reversed: Vec<i32> = straight.iter().rev().copied().collect();
    for inorder in [&straight, &reversed] {
        check(by_stack(&straight, inorder), &straight, inorder);
        ok += 1;
    }
    println!("{}/{} ca đúng", ok, cases.len() * 3 + 2);
}
