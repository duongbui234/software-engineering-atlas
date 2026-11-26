// LC 235 Lowest Common Ancestor of a Binary Search Tree: LCA tổng quát (hậu thứ tự), so hai đường đi,
// đi xuống theo thứ tự của BST (đệ quy và vòng lặp), và hai cách hiểu sai.
// Chạy: rustc --edition 2021 -O lca.rs && ./lca
use std::cell::RefCell;
use std::collections::VecDeque;
use std::rc::Rc;

// Hình dạng nút giống hệt LeetCode.
#[derive(Debug)]
pub struct TreeNode {
    pub val: i32,
    pub left: Option<Rc<RefCell<TreeNode>>>,
    pub right: Option<Rc<RefCell<TreeNode>>>,
}
type Node = Option<Rc<RefCell<TreeNode>>>;

fn new_node(val: i32) -> Rc<RefCell<TreeNode>> {
    Rc::new(RefCell::new(TreeNode { val, left: None, right: None }))
}

// Dựng cây từ mảng theo tầng kiểu LeetCode: None là chỗ trống.
fn build(arr: &[Option<i32>]) -> Node {
    let first = (*arr.first()?)?;
    let root = new_node(first);
    let mut queue = VecDeque::from([root.clone()]);
    let mut i = 1;
    while let Some(node) = queue.pop_front() {
        if i >= arr.len() { break; }
        if let Some(v) = arr[i] { let c = new_node(v); node.borrow_mut().left = Some(c.clone()); queue.push_back(c); }
        i += 1;
        if i < arr.len() { if let Some(v) = arr[i] { let c = new_node(v); node.borrow_mut().right = Some(c.clone()); queue.push_back(c); } }
        i += 1;
    }
    Some(root)
}

fn find(root: &Node, v: i32) -> Rc<RefCell<TreeNode>> {
    let mut node = root.clone();
    while let Some(n) = node {
        let val = n.borrow().val;
        if val == v { return n; }
        node = if v < val { n.borrow().left.clone() } else { n.borrow().right.clone() };
    }
    panic!("không có nút {v}");
}

// Chuỗi lệch phải 0 → 1 → … → n-1: BST hợp lệ, cao n.
fn right_chain(n: i32) -> Node {
    let mut root: Node = None;
    for i in (0..n).rev() { let t = new_node(i); t.borrow_mut().right = root; root = Some(t); }
    root
}

// Tháo cây bằng vòng lặp: Drop mặc định của Rc/Box đệ quy, chuỗi 10⁵ nút sẽ tràn ngăn xếp khi bị hủy.
fn teardown(root: Node) {
    let mut stack: Vec<Rc<RefCell<TreeNode>>> = root.into_iter().collect();
    while let Some(n) = stack.pop() {
        let mut b = n.borrow_mut();
        if let Some(l) = b.left.take() { stack.push(l); }
        if let Some(r) = b.right.take() { stack.push(r); }
    }
}

type R = Rc<RefCell<TreeNode>>;

// Cách 1: LCA của cây nhị phân bất kỳ (LC 236), hậu thứ tự, O(n). So danh tính bằng Rc::ptr_eq.
fn lca_general(root: &Node, p: &R, q: &R) -> Node {
    let n = root.as_ref()?;
    if Rc::ptr_eq(n, p) || Rc::ptr_eq(n, q) { return Some(n.clone()); }
    let l = lca_general(&n.borrow().left, p, q);
    let r = lca_general(&n.borrow().right, p, q);
    match (l, r) {
        (Some(_), Some(_)) => Some(n.clone()),
        (l, r) => l.or(r),
    }
}

// Cách 2: ghi đường từ gốc tới p và tới q, nút chung cuối cùng là đáp án.
fn path_to(root: &Node, target: &R) -> Vec<R> {
    let mut path = Vec::new();
    let tv = target.borrow().val;
    let mut node = root.clone();
    while let Some(n) = node {
        path.push(n.clone());
        if Rc::ptr_eq(&n, target) { break; }
        node = if tv < n.borrow().val { n.borrow().left.clone() } else { n.borrow().right.clone() };
    }
    path
}
fn lca_paths(root: &Node, p: &R, q: &R) -> Node {
    let (a, b) = (path_to(root, p), path_to(root, q));
    let mut i = 0;
    while i < a.len() && i < b.len() && Rc::ptr_eq(&a[i], &b[i]) { i += 1; }
    Some(a[i - 1].clone())
}

// Cách 3: đi xuống theo thứ tự, đệ quy.
fn lca_recursive(node: &Node, p: &R, q: &R) -> Node {
    let n = node.as_ref()?;
    let (v, pv, qv) = (n.borrow().val, p.borrow().val, q.borrow().val);
    if pv < v && qv < v { return lca_recursive(&n.borrow().left, p, q); }
    if pv > v && qv > v { return lca_recursive(&n.borrow().right, p, q); }
    Some(n.clone())
}

// Cách 4: vòng lặp, O(1) bộ nhớ.
fn lca_iterative(root: &Node, p: &R, q: &R) -> Node {
    let (pv, qv) = (p.borrow().val, q.borrow().val);
    let mut node = root.clone();
    while let Some(n) = node {
        let v = n.borrow().val;
        if pv < v && qv < v { node = n.borrow().left.clone(); }
        else if pv > v && qv > v { node = n.borrow().right.clone(); }
        else { return Some(n); }
    }
    None
}

// Hiểu sai 1: tưởng p nhỏ hơn q.
fn wrong_assume_ordered(root: &Node, p: &R, q: &R) -> Node {
    let (pv, qv) = (p.borrow().val, q.borrow().val);
    let mut node = root.clone();
    while let Some(n) = node {
        let v = n.borrow().val;
        if qv < v { node = n.borrow().left.clone(); }
        else if pv > v { node = n.borrow().right.clone(); }
        else { return Some(n); }
    }
    None
}

// Hiểu sai 2: dùng <= và >=.
fn wrong_non_strict(root: &Node, p: &R, q: &R) -> Node {
    let (pv, qv) = (p.borrow().val, q.borrow().val);
    let mut node = root.clone();
    while let Some(n) = node {
        let v = n.borrow().val;
        if pv <= v && qv <= v { node = n.borrow().left.clone(); }
        else if pv >= v && qv >= v { node = n.borrow().right.clone(); }
        else { return Some(n); }
    }
    None
}

// Nhân hai hiệu: đổi sang i64 TRƯỚC khi trừ. Với i32, 10⁹ − (−10⁹) đã tràn; bản debug panic, bản -O quay vòng im lặng.
fn lca_product(root: &Node, p: &R, q: &R) -> Node {
    let (pv, qv) = (p.borrow().val as i64, q.borrow().val as i64);
    let mut node = root.clone();
    while let Some(n) = node {
        let v = n.borrow().val as i64;
        if (v - pv) * (v - qv) <= 0 { return Some(n); }
        node = if pv < v { n.borrow().left.clone() } else { n.borrow().right.clone() };
    }
    None
}

type LcaFn = fn(&Node, &R, &R) -> Node;

fn run() {
    let t: Vec<Option<i32>> = [Some(20), Some(10), Some(30), Some(5), Some(15), Some(25), Some(35), None, None, Some(12), Some(17)].to_vec();
    let tt = t.clone();
    let mk = move || build(&tt);
    let cases: Vec<(&str, Box<dyn Fn() -> Node>, i32, i32, i32)> = vec![
        ("hai phía của gốc (5, 35)", Box::new(mk.clone()), 5, 35, 20),
        ("cùng bên trái (5, 17)", Box::new(mk.clone()), 5, 17, 10),
        ("p là tổ tiên của q (10, 12)", Box::new(mk.clone()), 10, 12, 10),
        ("p lớn hơn q (17, 12)", Box::new(mk.clone()), 17, 12, 15),
        ("cùng bên phải (25, 35)", Box::new(mk.clone()), 25, 35, 30),
        ("gốc là p (20, 17)", Box::new(mk.clone()), 20, 17, 20),
        ("cây 2 nút (2, 1)", Box::new(|| build(&[Some(2), Some(1)])), 2, 1, 2),
        ("giá trị ±10⁹ (10⁹, 10⁹ − 1)", Box::new(|| build(&[Some(-1_000_000_000), None, Some(1_000_000_000), Some(999_999_999)])), 1_000_000_000, 999_999_999, 1_000_000_000),
        ("cùng phía, hiệu cỡ 5·10⁴ (50000, 50001)", Box::new(|| build(&[Some(0), None, Some(50000), None, Some(50001)])), 50000, 50001, 50000),
        ("chuỗi tăng 10⁵ nút (99998, 99999)", Box::new(|| right_chain(100_000)), 99998, 99999, 99998),
    ];
    let fns: [(&str, LcaFn); 7] = [
        ("lca_general", lca_general), ("lca_paths", lca_paths), ("lca_recursive", lca_recursive),
        ("lca_iterative", lca_iterative), ("lca_product", lca_product),
        ("wrong_assume_ordered", wrong_assume_ordered), ("wrong_non_strict", wrong_non_strict),
    ];
    for (name, f) in fns {
        let mut bad = Vec::new();
        for (label, make, pv, qv, want) in &cases {
            let root = make();
            let got = match f(&root, &find(&root, *pv), &find(&root, *qv)) { Some(n) => n.borrow().val.to_string(), None => "None".into() };
            teardown(root);
            if got != want.to_string() { bad.push(format!("{label} → {got}")); }
        }
        let n = cases.len();
        let tail = if bad.is_empty() { String::new() } else { format!("; sai ở {}", bad.join(", ")) };
        println!("{:<20} {}/{} ca đúng{}", name, n - bad.len(), n, tail);
    }

    // Đối chiếu trên BST ngẫu nhiên (bộ sinh xorshift, không cần crate).
    let mut s: u64 = 235;
    let mut rnd = move |m: usize| -> usize { s ^= s << 13; s ^= s >> 7; s ^= s << 17; (s % m as u64) as usize };
    let total = 3000;
    let mut agree = 0;
    for _ in 0..total {
        let n = 2 + rnd(30);
        let mut vals: Vec<i32> = (0..n as i32).map(|i| i * 3 - 40).collect();
        for i in (1..n).rev() { let j = rnd(i + 1); vals.swap(i, j); }
        let mut root: Node = None;
        for &v in &vals {
            let t2 = new_node(v);
            let Some(r) = root.clone() else { root = Some(t2); continue };
            let mut cur = r;
            loop {
                let go_left = v < cur.borrow().val;
                let next = if go_left { cur.borrow().left.clone() } else { cur.borrow().right.clone() };
                match next {
                    Some(nx) => cur = nx,
                    None => { if go_left { cur.borrow_mut().left = Some(t2); } else { cur.borrow_mut().right = Some(t2); } break; }
                }
            }
        }
        let i = rnd(n);
        let mut j = rnd(n - 1); if j >= i { j += 1; }
        let (p, q) = (find(&root, vals[i]), find(&root, vals[j]));
        let a = lca_general(&root, &p, &q).unwrap();
        let same = |x: Node| x.map_or(false, |x| Rc::ptr_eq(&x, &a));
        if same(lca_paths(&root, &p, &q)) && same(lca_recursive(&root, &p, &q)) && same(lca_iterative(&root, &p, &q)) && same(lca_product(&root, &p, &q)) { agree += 1; }
    }
    println!("\nđối chiếu {total} BST ngẫu nhiên 2..31 nút: năm cách khớp nhau {agree}/{total}");
}

fn main() {
    // Tràn ngăn xếp trong Rust không bắt được: tiến trình bị hủy. Nên chạy trong một luồng có ngăn xếp 256 MB
    // để bản đệ quy đi hết chuỗi 10⁵ nút; ngăn xếp mặc định 8 MB của luồng chính thì không đủ.
    std::thread::Builder::new().stack_size(256 << 20).spawn(run).unwrap().join().unwrap();
}
