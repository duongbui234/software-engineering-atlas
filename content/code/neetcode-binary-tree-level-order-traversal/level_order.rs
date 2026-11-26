// LC 102 Binary Tree Level Order Traversal: BFS chụp kích thước tầng (VecDeque và Vec::remove(0)), hai danh sách,
// vạch ngăn tầng, DFS mang độ sâu, và các bản sai.
// Chạy: rustc --edition 2021 -O level_order.rs && ./level_order
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

fn left_chain(n: i32) -> Node {
    let mut root: Node = None;
    for v in (1..=n).rev() { let t = new_node(v); t.borrow_mut().left = root; root = Some(t); }
    root
}

// Cách 1: BFS, chụp số nút của tầng trước khi đẩy con vào. VecDeque lấy đầu hàng O(1).
fn level_snapshot(root: &Node) -> Vec<Vec<i32>> {
    let mut res = Vec::new();
    let Some(r) = root else { return res };
    let mut queue = VecDeque::from([r.clone()]);
    while !queue.is_empty() {
        let size = queue.len(); // chụp một lần cho cả tầng
        let mut level = Vec::with_capacity(size);
        for _ in 0..size {
            let node = queue.pop_front().unwrap();
            let n = node.borrow();
            level.push(n.val);
            if let Some(l) = &n.left { queue.push_back(l.clone()); }
            if let Some(r) = &n.right { queue.push_back(r.clone()); }
        }
        res.push(level);
    }
    res
}

// Cùng cách đó với Vec::remove(0): dời mọi phần tử còn lại, O(n) mỗi lần lấy.
fn level_snapshot_remove0(root: &Node) -> Vec<Vec<i32>> {
    let mut res = Vec::new();
    let Some(r) = root else { return res };
    let mut queue = vec![r.clone()];
    while !queue.is_empty() {
        let size = queue.len();
        let mut level = Vec::with_capacity(size);
        for _ in 0..size {
            let node = queue.remove(0);
            let n = node.borrow();
            level.push(n.val);
            if let Some(l) = &n.left { queue.push(l.clone()); }
            if let Some(r) = &n.right { queue.push(r.clone()); }
        }
        res.push(level);
    }
    res
}

// Cách 2: hai danh sách, tầng hiện tại và tầng sau.
fn level_two_lists(root: &Node) -> Vec<Vec<i32>> {
    let mut res = Vec::new();
    let mut cur: Vec<Rc<RefCell<TreeNode>>> = root.iter().cloned().collect();
    while !cur.is_empty() {
        res.push(cur.iter().map(|n| n.borrow().val).collect());
        let mut next = Vec::new();
        for node in &cur {
            let n = node.borrow();
            if let Some(l) = &n.left { next.push(l.clone()); }
            if let Some(r) = &n.right { next.push(r.clone()); }
        }
        cur = next;
    }
    res
}

// Cách 3: vạch ngăn tầng. Hàng đợi chứa Option: None là vạch.
fn level_marker(root: &Node) -> Vec<Vec<i32>> {
    let mut res = Vec::new();
    let Some(r) = root else { return res };
    let mut queue: VecDeque<Node> = VecDeque::from([Some(r.clone()), None]);
    let mut level = Vec::new();
    while let Some(item) = queue.pop_front() {
        match item {
            None => {
                res.push(std::mem::take(&mut level));
                if !queue.is_empty() { queue.push_back(None); } // còn tầng sau thì đặt vạch cho nó
            }
            Some(node) => {
                let n = node.borrow();
                level.push(n.val);
                if let Some(l) = &n.left { queue.push_back(Some(l.clone())); }
                if let Some(r) = &n.right { queue.push_back(Some(r.clone())); }
            }
        }
    }
    res
}

// Cách 4: DFS tiền thứ tự mang độ sâu; res đi qua &mut.
fn level_dfs(root: &Node) -> Vec<Vec<i32>> {
    fn go(node: &Node, depth: usize, res: &mut Vec<Vec<i32>>) {
        let Some(n) = node else { return };
        if res.len() == depth { res.push(Vec::new()); } // lần đầu xuống tới tầng này
        let n = n.borrow();
        res[depth].push(n.val);
        go(&n.left, depth + 1, res);
        go(&n.right, depth + 1, res);
    }
    let mut res = Vec::new();
    go(root, 0, &mut res);
    res
}

// Sai: đọc lại độ dài hàng đợi trong điều kiện vòng (Rust không cho for i in 0..queue.len() đổi giữa chừng,
// nên phải viết while mới mắc được lỗi này).
fn wrong_live_length(root: &Node) -> Vec<Vec<i32>> {
    let mut res = Vec::new();
    let Some(r) = root else { return res };
    let mut queue = VecDeque::from([r.clone()]);
    while !queue.is_empty() {
        let mut level = Vec::new();
        let mut i = 0;
        while i < queue.len() {
            let node = queue.pop_front().unwrap();
            let n = node.borrow();
            level.push(n.val);
            if let Some(l) = &n.left { queue.push_back(l.clone()); }
            if let Some(r) = &n.right { queue.push_back(r.clone()); }
            i += 1;
        }
        res.push(level);
    }
    res
}

// Sai: DFS đi phải trước.
fn wrong_right_first(root: &Node) -> Vec<Vec<i32>> {
    fn go(node: &Node, depth: usize, res: &mut Vec<Vec<i32>>) {
        let Some(n) = node else { return };
        if res.len() == depth { res.push(Vec::new()); }
        let n = n.borrow();
        res[depth].push(n.val);
        go(&n.right, depth + 1, res);
        go(&n.left, depth + 1, res);
    }
    let mut res = Vec::new();
    go(root, 0, &mut res);
    res
}

fn fmt(v: &[Vec<i32>]) -> String {
    let s = format!("[{}]", v.iter().map(|l| format!("[{}]", l.iter().map(|x| x.to_string()).collect::<Vec<_>>().join(","))).collect::<Vec<_>>().join(","));
    if s.chars().count() > 40 { format!("{}...", s.chars().take(37).collect::<String>()) } else { s }
}

fn run() {
    let limit: Vec<i32> = (0..2000).map(|i| (i * 37) % 2001 - 1000).collect();
    let split = |arr: &[i32]| { let mut out = Vec::new(); let (mut s, mut w) = (0, 1); while s < arr.len() { out.push(arr[s..(s + w).min(arr.len())].to_vec()); s += w; w *= 2; } out };
    let some = |xs: &[i32]| xs.iter().map(|&x| Some(x)).collect::<Vec<_>>();
    let o = |x: i32| Some(x);
    let cases: Vec<(&str, Node, Vec<Vec<i32>>)> = vec![
        ("cây rỗng", None, vec![]),
        ("một nút", build(&[o(7)]), vec![vec![7]]),
        ("ba tầng có chỗ trống", build(&[o(5), o(2), o(8), None, o(4), o(7), o(9)]), vec![vec![5], vec![2, 8], vec![4, 7, 9]]),
        ("chỉ con trái", build(&[o(1), o(2), None, o(3), None, o(4)]), vec![vec![1], vec![2], vec![3], vec![4]]),
        ("chỉ con phải", build(&[o(1), None, o(2), None, o(3)]), vec![vec![1], vec![2], vec![3]]),
        ("cây đầy 15 nút", build(&some(&(1..=15).collect::<Vec<_>>())), vec![vec![1], vec![2, 3], vec![4, 5, 6, 7], (8..=15).collect()]),
        ("nhánh so le", build(&[o(1), o(2), o(3), o(4), None, None, o(5), o(6), None, None, o(7)]), vec![vec![1], vec![2, 3], vec![4, 5], vec![6, 7]]),
        ("giá trị âm và trùng", build(&[o(0), o(-1000), o(1000), o(-1000), None, None, o(1000)]), vec![vec![0], vec![-1000, 1000], vec![-1000, 1000]]),
        ("cây đủ 2000 nút", build(&some(&limit)), split(&limit)),
        ("chuỗi trái 2000 nút", left_chain(2000), (1..=2000).map(|i| vec![i]).collect()),
    ];
    type F = fn(&Node) -> Vec<Vec<i32>>;
    let fns: [(&str, F); 7] = [
        ("level_snapshot", level_snapshot), ("level_snapshot_remove0", level_snapshot_remove0),
        ("level_two_lists", level_two_lists), ("level_marker", level_marker), ("level_dfs", level_dfs),
        ("wrong_live_length", wrong_live_length), ("wrong_right_first", wrong_right_first),
    ];
    for (name, f) in fns {
        let mut bad = Vec::new();
        for (label, root, want) in &cases {
            let got = f(root);
            if &got != want { bad.push(format!("{label} → {}", fmt(&got))); }
        }
        let n = cases.len();
        let tail = if bad.is_empty() { String::new() } else { format!("; sai ở {}", bad.join(", ")) };
        println!("{:<22} {}/{} ca đúng{}", name, n - bad.len(), n, tail);
    }
    for (_, root, _) in cases { teardown(root); }

    // Đối chiếu ngẫu nhiên.
    let mut rng = Rng(42);
    let total = 3000;
    let mut agree = 0;
    for _ in 0..total {
        let n = rng.below(60);
        let mut nodes: Vec<Rc<RefCell<TreeNode>>> = Vec::new();
        if n > 0 { nodes.push(new_node(rng.below(2001) as i32 - 1000)); }
        while nodes.len() < n {
            let parent = nodes[rng.below(nodes.len())].clone();
            let child = new_node(rng.below(2001) as i32 - 1000);
            let mut p = parent.borrow_mut();
            if rng.unit() < 0.5 { if p.left.is_none() { p.left = Some(child.clone()); nodes.push(child); } }
            else if p.right.is_none() { p.right = Some(child.clone()); nodes.push(child); }
        }
        let root: Node = nodes.first().cloned();
        let a = level_snapshot(&root);
        if a == level_two_lists(&root) && a == level_marker(&root) && a == level_dfs(&root) && a == level_snapshot_remove0(&root) { agree += 1; }
    }
    println!("\nđối chiếu {total} cây ngẫu nhiên 0..59 nút: năm cách khớp nhau {agree}/{total}");

    // Đo: VecDeque so với Vec::remove(0) trên cây đầy.
    println!("\nthời gian trung vị 5 lần (ms), cây đầy");
    println!("        n  VecDeque  Vec::remove(0)");
    for n in [2000, 16383, 32767, 131071] {
        let root = build(&some(&(0..n).collect::<Vec<_>>()));
        let mut row = Vec::new();
        for f in [level_snapshot as F, level_snapshot_remove0 as F] {
            let mut ts: Vec<f64> = (0..5).map(|_| { let t0 = std::time::Instant::now(); std::hint::black_box(f(&root)); t0.elapsed().as_secs_f64() * 1e3 }).collect();
            ts.sort_by(|a, b| a.partial_cmp(b).unwrap());
            row.push(ts[2]);
        }
        println!("{:>9} {:>9.2} {:>15.2}", n, row[0], row[1]);
        teardown(root);
    }
}

fn main() {
    // Đệ quy DFS đi 2000 tầng: luồng chính 8 MB vẫn đủ, nhưng chạy trong luồng 64 MB cho chắc. Tràn ngăn xếp ở Rust không bắt được.
    std::thread::Builder::new().stack_size(64 << 20).spawn(run).unwrap().join().unwrap();
}
