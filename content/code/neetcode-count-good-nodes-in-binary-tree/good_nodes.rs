// LC 1448 Count Good Nodes in Binary Tree: vét cạn leo lên gốc, DFS mang max (đệ quy và lặp), BFS, và ba bản sai.
// Chạy: rustc --edition 2021 -O good_nodes.rs && ./good_nodes
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

// Tháo cây bằng vòng lặp: Drop mặc định của Rc đệ quy, cây sâu vài nghìn tầng có thể tràn ngăn xếp khi bị hủy.
fn teardown(root: Node) {
    let mut stack: Vec<Rc<RefCell<TreeNode>>> = root.into_iter().collect();
    while let Some(n) = stack.pop() {
        let mut b = n.borrow_mut();
        if let Some(l) = b.left.take() { stack.push(l); }
        if let Some(r) = b.right.take() { stack.push(r); }
    }
}

// Bộ sinh ngẫu nhiên xorshift64, không cần crate.
struct Rng(u64);
impl Rng {
    fn next(&mut self) -> u64 { let mut s = self.0; s ^= s << 13; s ^= s >> 7; s ^= s << 17; self.0 = s; s }
    fn below(&mut self, m: usize) -> usize { (self.next() % m as u64) as usize }
    fn unit(&mut self) -> f64 { (self.next() >> 11) as f64 / (1u64 << 53) as f64 }
}
use std::collections::HashMap;

type R = Rc<RefCell<TreeNode>>;

fn chain(n: usize, value_at: impl Fn(usize) -> i32, right: bool) -> R {
    let root = new_node(value_at(0));
    let mut cur = root.clone();
    for i in 1..n {
        let t = new_node(value_at(i));
        if right { cur.borrow_mut().right = Some(t.clone()); } else { cur.borrow_mut().left = Some(t.clone()); }
        cur = t;
    }
    root
}

// Cách 1: vét cạn, mỗi nút leo ngược lên gốc. O(n·h). Bảng cha khóa theo địa chỉ nút (Rc::as_ptr).
fn good_brute(root: &Node) -> i32 {
    let Some(r) = root else { return 0 };
    let mut parent: HashMap<*const RefCell<TreeNode>, Option<R>> = HashMap::new();
    parent.insert(Rc::as_ptr(r), None);
    let mut order = vec![r.clone()];
    let mut i = 0;
    while i < order.len() {
        let node = order[i].clone();
        for child in [node.borrow().left.clone(), node.borrow().right.clone()].into_iter().flatten() {
            parent.insert(Rc::as_ptr(&child), Some(node.clone()));
            order.push(child);
        }
        i += 1;
    }
    let mut good = 0;
    for node in &order {
        let v = node.borrow().val;
        let mut a = parent[&Rc::as_ptr(node)].clone();
        let mut ok = true;
        while let Some(p) = a {
            if p.borrow().val > v { ok = false; break; }
            a = parent[&Rc::as_ptr(&p)].clone();
        }
        if ok { good += 1; }
    }
    good
}

// Cách 2: DFS tiền thứ tự, mang max của đường đi xuống. O(n), O(h).
fn good_dfs(root: &Node) -> i32 {
    fn go(node: &Node, max_so_far: i32) -> i32 {
        let Some(n) = node else { return 0 };
        let n = n.borrow();
        let good = if n.val >= max_so_far { 1 } else { 0 }; // bằng max vẫn là tốt
        let m = max_so_far.max(n.val);
        good + go(&n.left, m) + go(&n.right, m)
    }
    go(root, i32::MIN)
}

// Cách 3: DFS lặp, ngăn xếp giữ cặp (nút, max tới nút đó).
fn good_iterative(root: &Node) -> i32 {
    let Some(r) = root else { return 0 };
    let mut good = 0;
    let mut stack = vec![(r.clone(), r.borrow().val)];
    while let Some((node, max_so_far)) = stack.pop() {
        let n = node.borrow();
        if n.val >= max_so_far { good += 1; }
        let m = max_so_far.max(n.val);
        if let Some(c) = &n.right { stack.push((c.clone(), m)); }
        if let Some(c) = &n.left { stack.push((c.clone(), m)); }
    }
    good
}

// Cách 4: BFS, VecDeque giữ cặp (nút, max).
fn good_bfs(root: &Node) -> i32 {
    let Some(r) = root else { return 0 };
    let mut good = 0;
    let mut queue = VecDeque::from([(r.clone(), r.borrow().val)]);
    while let Some((node, max_so_far)) = queue.pop_front() {
        let n = node.borrow();
        if n.val >= max_so_far { good += 1; }
        let m = max_so_far.max(n.val);
        if let Some(c) = &n.left { queue.push_back((c.clone(), m)); }
        if let Some(c) = &n.right { queue.push_back((c.clone(), m)); }
    }
    good
}

// Sai 1: so ngặt.
fn wrong_strict(root: &Node) -> i32 {
    let Some(r) = root else { return 0 };
    let mut good = 1;
    let rv = r.borrow().val;
    let mut stack = Vec::new();
    if let Some(c) = &r.borrow().right { stack.push((c.clone(), rv)); }
    if let Some(c) = &r.borrow().left { stack.push((c.clone(), rv)); }
    while let Some((node, max_so_far)) = stack.pop() {
        let n = node.borrow();
        if n.val > max_so_far { good += 1; } // sai: phải là >=
        let m = max_so_far.max(n.val);
        if let Some(c) = &n.right { stack.push((c.clone(), m)); }
        if let Some(c) = &n.left { stack.push((c.clone(), m)); }
    }
    good
}
// Sai 2: khởi tạo max bằng 0.
fn wrong_init_zero(root: &Node) -> i32 {
    let Some(r) = root else { return 0 };
    let mut good = 0;
    let mut stack = vec![(r.clone(), 0)];
    while let Some((node, max_so_far)) = stack.pop() {
        let n = node.borrow();
        if n.val >= max_so_far { good += 1; }
        let m = max_so_far.max(n.val);
        if let Some(c) = &n.right { stack.push((c.clone(), m)); }
        if let Some(c) = &n.left { stack.push((c.clone(), m)); }
    }
    good
}
// Sai 3: một biến max dùng chung cho cả cây.
fn wrong_shared_max(root: &Node) -> i32 {
    let Some(r) = root else { return 0 };
    let (mut max, mut good) = (i32::MIN, 0);
    let mut stack = vec![r.clone()];
    while let Some(node) = stack.pop() {
        let n = node.borrow();
        if n.val >= max { good += 1; max = n.val; }
        if let Some(c) = &n.right { stack.push(c.clone()); }
        if let Some(c) = &n.left { stack.push(c.clone()); }
    }
    good
}

fn run() {
    const N: usize = 100_000;
    let up = chain(N, |i| -10_000 + (i / 5) as i32, true);
    let down = chain(N, |i| 10_000 - (i / 5) as i32, false);
    let o = |x: i32| Some(x);
    let cases: Vec<(&str, Node, i32)> = vec![
        ("một nút", build(&[o(7)]), 1),
        ("một nút âm", build(&[o(-10000)]), 1),
        ("ba nút", build(&[o(2), o(1), o(3)]), 2),
        ("bằng max vẫn tốt", build(&[o(5), o(5), o(5)]), 3),
        ("toàn số âm", build(&[o(-3), o(-5), o(-1), o(-4), None, None, o(-2)]), 2),
        ("max nhánh trái lớn", build(&[o(1), o(9), o(2), None, None, o(2), o(3)]), 5),
        ("cây đầy 7 nút", build(&[o(4), o(2), o(6), o(1), o(3), o(5), o(7)]), 3),
        ("xuống thấp rồi vượt lại", build(&[o(6), o(2), None, o(1), o(7)]), 2),
        ("chuỗi không giảm 10^5 nút", Some(up.clone()), N as i32),
        ("chuỗi không tăng 10^5 nút", Some(down.clone()), 5),
    ];
    type F = fn(&Node) -> i32;
    let fns: [(&str, F); 7] = [
        ("good_brute", good_brute), ("good_dfs", good_dfs), ("good_iterative", good_iterative), ("good_bfs", good_bfs),
        ("wrong_strict", wrong_strict), ("wrong_init_zero", wrong_init_zero), ("wrong_shared_max", wrong_shared_max),
    ];
    for (name, f) in fns {
        let (mut ok, mut fails) = (0, Vec::new());
        for (label, tree, want) in &cases {
            // vét cạn trên chuỗi 10^5 nút là 5·10^9 phép so
            if name == "good_brute" && tree.as_ref().map_or(false, |t| Rc::ptr_eq(t, &up)) { ok += 1; continue; }
            let got = f(tree);
            if got == *want { ok += 1; } else { fails.push(format!("{label} → {got}")); }
        }
        let tail = if fails.is_empty() { String::new() } else { format!("; sai ở {}", fails.join(", ")) };
        println!("{:<16} {}/{} ca đúng{}", name, ok, cases.len(), tail);
    }
    drop(up); drop(down);
    for (_, t, _) in cases { teardown(t); }

    let mut rng = Rng(42);
    let trials = 3000;
    let mut agree = 0;
    let mut miss = [0; 3];
    for _ in 0..trials {
        let n = 1 + rng.below(12);
        let mut nodes = vec![new_node(rng.below(7) as i32 - 3)];
        while nodes.len() < n {
            let p = nodes[rng.below(nodes.len())].clone();
            let left = rng.unit() < 0.5;
            let mut pb = p.borrow_mut();
            let slot = if left { &mut pb.left } else { &mut pb.right };
            if slot.is_none() { let t = new_node(rng.below(7) as i32 - 3); *slot = Some(t.clone()); nodes.push(t); }
        }
        let tree: Node = Some(nodes[0].clone());
        let want = good_brute(&tree);
        if good_dfs(&tree) == want && good_iterative(&tree) == want && good_bfs(&tree) == want { agree += 1; }
        for (k, f) in [wrong_strict as F, wrong_init_zero, wrong_shared_max].iter().enumerate() { if f(&tree) != want { miss[k] += 1; } }
    }
    println!("\nđối chiếu {trials} cây ngẫu nhiên 1..12 nút, giá trị -3..3: ba cách đúng khớp vét cạn {agree}/{trials}");
    println!("bản sai lệch với vét cạn: wrong_strict {}, wrong_init_zero {}, wrong_shared_max {} cây", miss[0], miss[1], miss[2]);
}

fn main() {
    // DFS đệ quy đi hết chuỗi 10^5 nút: cần ngăn xếp lớn. Tràn ngăn xếp ở Rust làm tiến trình chết, không bắt được.
    std::thread::Builder::new().stack_size(256 << 20).spawn(run).unwrap().join().unwrap();
}
