use std::cell::RefCell;
use std::rc::Rc;

// Kiểu nút của LeetCode cho Rust.
#[derive(Debug, PartialEq, Eq)]
pub struct TreeNode {
    pub val: i32,
    pub left: Option<Rc<RefCell<TreeNode>>>,
    pub right: Option<Rc<RefCell<TreeNode>>>,
}

impl TreeNode {
    pub fn new(val: i32) -> Self {
        TreeNode { val, left: None, right: None }
    }
}

type Node = Option<Rc<RefCell<TreeNode>>>;

fn new_node(val: i32) -> Rc<RefCell<TreeNode>> {
    Rc::new(RefCell::new(TreeNode::new(val)))
}

// Đọc chuỗi kiểu "[1,null,2]" thành danh sách giá trị theo tầng.
fn lv(s: &str) -> Vec<Option<i32>> {
    let t = s.trim().trim_start_matches('[').trim_end_matches(']');
    if t.trim().is_empty() {
        return vec![];
    }
    t.split(',')
        .map(|x| {
            let x = x.trim();
            if x == "null" { None } else { Some(x.parse().unwrap()) }
        })
        .collect()
}

// Dựng cây từ mảng theo tầng kiểu LeetCode.
fn from_level(vals: &[Option<i32>]) -> Node {
    let first = (*vals.first()?)?;
    let root = new_node(first);
    let mut queue = vec![root.clone()];
    let (mut head, mut i) = (0, 1);
    while i < vals.len() {
        let node = queue[head].clone();
        head += 1;
        for side in 0..2 {
            if let Some(Some(v)) = vals.get(i) {
                let child = new_node(*v);
                if side == 0 {
                    node.borrow_mut().left = Some(child.clone());
                } else {
                    node.borrow_mut().right = Some(child.clone());
                }
                queue.push(child);
            }
            i += 1;
        }
    }
    Some(root)
}

// In một dòng "<tên> <đúng>/<tổng> ca đúng; sai ở ...".
fn report(name: &str, total: usize, bad: &[String], pad: usize) {
    let tail = if bad.is_empty() { String::new() } else { format!("; sai ở {}", bad.join(", ")) };
    println!("{:<pad$} {}/{} ca đúng{}", name, total - bad.len(), total, tail, pad = pad);
}

// Bộ sinh số giả ngẫu nhiên nhỏ (xorshift64*), đủ cho phép đối chiếu.
struct Rng(u64);
impl Rng {
    fn next(&mut self) -> u64 {
        self.0 ^= self.0 >> 12;
        self.0 ^= self.0 << 25;
        self.0 ^= self.0 >> 27;
        self.0.wrapping_mul(0x2545F4914F6CDD1D)
    }
    fn below(&mut self, n: usize) -> usize {
        (self.next() % n as u64) as usize
    }
}

// Cách 1: đệ quy. Độ sâu = 1 + độ sâu lớn hơn của hai cây con; cây rỗng (None) sâu 0.
fn max_depth_recursive(root: &Node) -> i32 {
    match root {
        None => 0,
        Some(n) => {
            let b = n.borrow();
            1 + max_depth_recursive(&b.left).max(max_depth_recursive(&b.right))
        }
    }
}

// Cách 2: ngăn xếp tự quản, mỗi phần tử là cặp (nút, độ sâu của nút).
fn max_depth_stack(root: &Node) -> i32 {
    let mut stack: Vec<(Rc<RefCell<TreeNode>>, i32)> = root.iter().map(|n| (n.clone(), 1)).collect();
    let mut best = 0;
    while let Some((n, d)) = stack.pop() {
        best = best.max(d);
        let b = n.borrow();
        if let Some(l) = &b.left { stack.push((l.clone(), d + 1)); }
        if let Some(r) = &b.right { stack.push((r.clone(), d + 1)); }
    }
    best
}

// Cách 3: BFS theo tầng với VecDeque; mỗi vòng ngoài lấy ra đúng số nút của một tầng.
fn max_depth_bfs(root: &Node) -> i32 {
    let mut queue: std::collections::VecDeque<Rc<RefCell<TreeNode>>> = root.iter().cloned().collect();
    let mut depth = 0;
    while !queue.is_empty() {
        depth += 1;
        for _ in 0..queue.len() {
            let n = queue.pop_front().unwrap();
            let b = n.borrow();
            queue.extend(b.left.iter().cloned());
            queue.extend(b.right.iter().cloned());
        }
    }
    depth
}

// Sai: quên vòng trong theo tầng, tăng depth mỗi lần lấy một nút ra, nên đếm ra số nút.
fn wrong_bfs_per_node(root: &Node) -> i32 {
    let mut queue: Vec<Rc<RefCell<TreeNode>>> = root.iter().cloned().collect();
    let (mut head, mut depth) = (0, 0);
    while head < queue.len() {
        let n = queue[head].clone();
        head += 1;
        depth += 1;
        let b = n.borrow();
        queue.extend(b.left.iter().cloned());
        queue.extend(b.right.iter().cloned());
    }
    depth
}

// Cây ngẫu nhiên tới 40 nút; độ sâu đúng được ghi lại ngay lúc dựng.
fn random_tree(rng: &mut Rng, n: usize) -> (Node, i32) {
    if n == 0 {
        return (None, 0);
    }
    let root = new_node(0);
    let mut slots = vec![(root.clone(), 0, 2), (root.clone(), 1, 2)];
    let mut depth = 1;
    for i in 1..n {
        let j = rng.below(slots.len());
        let (parent, side, d) = slots.swap_remove(j);
        let node = new_node(i as i32);
        if side == 0 {
            parent.borrow_mut().left = Some(node.clone());
        } else {
            parent.borrow_mut().right = Some(node.clone());
        }
        depth = depth.max(d);
        slots.push((node.clone(), 0, d + 1));
        slots.push((node, 1, d + 1));
    }
    (Some(root), depth)
}

fn main() {
    let cases = [
        ("cây rỗng", "[]", 0),
        ("một nút", "[5]", 1),
        ("chỉ có con phải", "[1,null,2]", 2),
        ("cây đủ 3 tầng", "[1,2,3,4,5,6,7]", 3),
        ("nhánh sâu bên phải", "[8,3,10,1,6,null,14,null,null,4,7,13]", 4),
        ("chuỗi trái 6 nút", "[1,2,null,3,null,4,null,5,null,6]", 6),
        ("zigzag 5 tầng", "[1,2,null,null,3,4,null,null,5]", 5),
        ("giá trị âm và 0", "[0,-1,-2,null,-3]", 3),
    ];
    let fns: [(&str, fn(&Node) -> i32); 4] = [
        ("max_depth_recursive", max_depth_recursive),
        ("max_depth_stack", max_depth_stack),
        ("max_depth_bfs", max_depth_bfs),
        ("wrong_bfs_per_node", wrong_bfs_per_node),
    ];
    for (name, f) in fns.iter() {
        let mut bad = vec![];
        for (cname, input, want) in cases.iter() {
            let got = f(&from_level(&lv(input)));
            if got != *want {
                bad.push(format!("{} → {} (đúng là {})", cname, got, want));
            }
        }
        report(name, cases.len(), &bad, 19);
    }

    let mut rng = Rng(104);
    let total = 2000;
    let mut ok = [0; 3];
    for _ in 0..total {
        let n = rng.below(41);
        let (root, want) = random_tree(&mut rng, n);
        for (j, (_, f)) in fns.iter().take(3).enumerate() {
            if f(&root) == want {
                ok[j] += 1;
            }
        }
    }
    let parts: Vec<String> = (0..3).map(|j| format!("{} {}/{}", fns[j].0, ok[j], total)).collect();
    println!("\nngẫu nhiên: {}", parts.join(", "));

    // Chuỗi lệch trái 10⁴ nút, cỡ lớn nhất của đề, trên luồng main (ngăn xếp 8 MB).
    let mut chain: Node = None;
    for i in 0..10000 {
        let node = new_node(i);
        node.borrow_mut().left = chain;
        chain = Some(node);
    }
    println!(
        "chuỗi trái 10000 nút: đệ quy → {}, ngăn xếp → {}",
        max_depth_recursive(&chain),
        max_depth_stack(&chain)
    );
}
