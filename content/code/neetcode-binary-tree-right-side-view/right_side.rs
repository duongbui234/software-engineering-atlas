// LC 199 Binary Tree Right Side View: BFS lấy nút cuối mỗi tầng, BFS phải trước, DFS phải trước (đệ quy và lặp),
// DFS ghi đè, và ba cách sai.
// Chạy: rustc --edition 2021 -O right_side.rs && ./right_side
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
fn complete(n: i32) -> Node { build(&(1..=n).map(Some).collect::<Vec<_>>()) }

// Cách 1: BFS, chụp cỡ tầng, nút cuối của tầng là nút nhìn thấy.
fn bfs_last(root: &Node) -> Vec<i32> {
    let mut res = Vec::new();
    let mut queue: Vec<Rc<RefCell<TreeNode>>> = root.iter().cloned().collect();
    while !queue.is_empty() {
        res.push(queue.last().unwrap().borrow().val); // nút cuối của tầng
        let mut next = Vec::new();
        for node in &queue {
            let n = node.borrow();
            if let Some(l) = &n.left { next.push(l.clone()); }
            if let Some(r) = &n.right { next.push(r.clone()); }
        }
        queue = next;
    }
    res
}

// Cách 2: BFS đẩy con phải trước, nút đầu của tầng là nút nhìn thấy.
fn bfs_right_first(root: &Node) -> Vec<i32> {
    let mut res = Vec::new();
    let mut queue: VecDeque<Rc<RefCell<TreeNode>>> = root.iter().cloned().collect();
    while let Some(front) = queue.front() {
        res.push(front.borrow().val);
        for _ in 0..queue.len() { // 0..len() tính một lần: độ dài đã được chụp
            let node = queue.pop_front().unwrap();
            let n = node.borrow();
            if let Some(r) = &n.right { queue.push_back(r.clone()); }
            if let Some(l) = &n.left { queue.push_back(l.clone()); }
        }
    }
    res
}

// Cách 3: DFS phải trước; nút đầu tiên chạm tới một độ sâu mới là nút nhìn thấy.
fn dfs_right_first(root: &Node) -> Vec<i32> {
    fn go(node: &Node, depth: usize, res: &mut Vec<i32>) {
        let Some(n) = node else { return };
        let n = n.borrow();
        if depth == res.len() { res.push(n.val); }
        go(&n.right, depth + 1, res);
        go(&n.left, depth + 1, res);
    }
    let mut res = Vec::new();
    go(root, 0, &mut res);
    res
}

// Cách 3b: DFS phải trước bằng ngăn xếp tự quản.
fn dfs_right_first_iterative(root: &Node) -> Vec<i32> {
    let mut res = Vec::new();
    let mut stack: Vec<(Rc<RefCell<TreeNode>>, usize)> = root.iter().map(|r| (r.clone(), 0)).collect();
    while let Some((node, depth)) = stack.pop() {
        let n = node.borrow();
        if depth == res.len() { res.push(n.val); }
        if let Some(l) = &n.left { stack.push((l.clone(), depth + 1)); } // đẩy trái trước để phải ra trước
        if let Some(r) = &n.right { stack.push((r.clone(), depth + 1)); }
    }
    res
}

// Cách 4: DFS trái trước, ghi đè res[depth].
fn dfs_overwrite(root: &Node) -> Vec<i32> {
    fn go(node: &Node, depth: usize, res: &mut Vec<i32>) {
        let Some(n) = node else { return };
        let n = n.borrow();
        if depth == res.len() { res.push(n.val); } else { res[depth] = n.val; }
        go(&n.left, depth + 1, res);
        go(&n.right, depth + 1, res);
    }
    let mut res = Vec::new();
    go(root, 0, &mut res);
    res
}

fn wrong_right_pointers(root: &Node) -> Vec<i32> {
    let mut res = Vec::new();
    let mut node = root.clone();
    while let Some(n) = node { res.push(n.borrow().val); node = n.borrow().right.clone(); }
    res
}
fn wrong_left_first(root: &Node) -> Vec<i32> {
    fn go(node: &Node, depth: usize, res: &mut Vec<i32>) {
        let Some(n) = node else { return };
        let n = n.borrow();
        if depth == res.len() { res.push(n.val); }
        go(&n.left, depth + 1, res);
        go(&n.right, depth + 1, res);
    }
    let mut res = Vec::new();
    go(root, 0, &mut res);
    res
}
// Sai: đọc lại queue.len() mỗi vòng. Ở Rust phải tự viết while mới mắc được.
fn wrong_live_length(root: &Node) -> Vec<i32> {
    let mut res = Vec::new();
    let mut queue: VecDeque<Rc<RefCell<TreeNode>>> = root.iter().cloned().collect();
    while !queue.is_empty() {
        let mut last = queue[0].clone();
        let mut i = 0;
        while i < queue.len() {
            let node = queue.pop_front().unwrap();
            {
                let n = node.borrow();
                if let Some(l) = &n.left { queue.push_back(l.clone()); }
                if let Some(r) = &n.right { queue.push_back(r.clone()); }
            }
            last = node;
            i += 1;
        }
        res.push(last.borrow().val);
    }
    res
}

fn show(a: &[i32]) -> String {
    if a.len() > 8 { format!("[{},{},{},…,{}] ({} số)", a[0], a[1], a[2], a[a.len() - 1], a.len()) }
    else { format!("[{}]", a.iter().map(|x| x.to_string()).collect::<Vec<_>>().join(",")) }
}

fn main() {
    let o = |x: i32| Some(x);
    let cases: Vec<(&str, Node, Vec<i32>)> = vec![
        ("cây rỗng", build(&[]), vec![]),
        ("một nút", build(&[o(7)]), vec![7]),
        ("cây đầy 7 nút", build(&[o(1), o(2), o(3), o(4), o(5), o(6), o(7)]), vec![1, 3, 7]),
        ("nhánh trái sâu hơn", build(&[o(1), o(2), o(3), o(4)]), vec![1, 3, 4]),
        ("chỉ có nhánh trái", build(&[o(1), o(2), None, o(3)]), vec![1, 2, 3]),
        ("chỉ có nhánh phải", build(&[o(1), None, o(2), None, o(3)]), vec![1, 2, 3]),
        ("đáy nằm dưới cây con trái", build(&[o(1), o(2), o(3), None, o(5), None, None, o(6)]), vec![1, 3, 5, 6]),
        ("zíc zắc", build(&[o(1), o(2), o(3), o(4), None, None, None, None, o(5)]), vec![1, 3, 4, 5]),
        ("giá trị âm và biên", build(&[o(0), o(-100), o(100), o(-50)]), vec![0, 100, -50]),
        ("chuỗi trái 100 nút", left_chain(100), (1..=100).collect()),
        ("cây đầy đủ 100 nút", complete(100), vec![1, 3, 7, 15, 31, 63, 100]),
    ];
    type F = fn(&Node) -> Vec<i32>;
    let fns: [(&str, F); 8] = [
        ("bfs_last", bfs_last), ("bfs_right_first", bfs_right_first), ("dfs_right_first", dfs_right_first),
        ("dfs_right_first_iterative", dfs_right_first_iterative), ("dfs_overwrite", dfs_overwrite),
        ("wrong_right_pointers", wrong_right_pointers), ("wrong_left_first", wrong_left_first), ("wrong_live_length", wrong_live_length),
    ];
    for (name, f) in fns {
        let mut bad = Vec::new();
        for (label, root, want) in &cases {
            let got = show(&f(root));
            if got != show(want) { bad.push(format!("{label} → {got}")); }
        }
        let n = cases.len();
        let tail = if bad.is_empty() { String::new() } else { format!("; sai ở {}", bad.join(", ")) };
        println!("{:<25} {}/{} ca đúng{}", name, n - bad.len(), n, tail);
    }
    for (_, root, _) in cases { teardown(root); }

    let mut rng = Rng(42);
    let (trials, mut agree, mut right_wrong) = (3000, 0, 0);
    for _ in 0..trials {
        let n = rng.below(31);
        let mut all: Vec<Rc<RefCell<TreeNode>>> = Vec::new();
        if n > 0 { all.push(new_node(rng.below(201) as i32 - 100)); }
        while all.len() < n {
            let p = all[rng.below(all.len())].clone();
            let t = new_node(rng.below(201) as i32 - 100);
            let mut pb = p.borrow_mut();
            if rng.unit() < 0.5 { if pb.left.is_none() { pb.left = Some(t.clone()); all.push(t); } }
            else if pb.right.is_none() { pb.right = Some(t.clone()); all.push(t); }
        }
        let root: Node = all.first().cloned();
        let r = bfs_last(&root);
        if [bfs_right_first as F, dfs_right_first, dfs_right_first_iterative, dfs_overwrite].iter().all(|f| f(&root) == r) { agree += 1; }
        if wrong_right_pointers(&root) != r { right_wrong += 1; }
    }
    println!("\nđối chiếu {trials} cây ngẫu nhiên 0..30 nút: năm cách đúng khớp nhau {agree}/{trials}; wrong_right_pointers sai {right_wrong} cây");
}
