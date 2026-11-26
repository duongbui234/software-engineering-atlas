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

// Đọc cây ra mảng theo tầng, bỏ các null ở cuối.
fn to_level(root: &Node) -> Vec<Option<i32>> {
    let mut out = vec![];
    let mut queue = vec![root.clone()];
    let mut head = 0;
    while head < queue.len() {
        let node = queue[head].clone();
        head += 1;
        match node {
            None => out.push(None),
            Some(n) => {
                let b = n.borrow();
                out.push(Some(b.val));
                queue.push(b.left.clone());
                queue.push(b.right.clone());
            }
        }
    }
    while out.last() == Some(&None) {
        out.pop();
    }
    out
}

fn show(v: &[Option<i32>]) -> String {
    let parts: Vec<String> = v
        .iter()
        .map(|x| match x { Some(n) => n.to_string(), None => "null".to_string() })
        .collect();
    format!("[{}]", parts.join(","))
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

// Cách 1: đệ quy. take() lấy hai con ra khỏi nút (để lại None), đảo từng con, rồi gắn chéo.
fn invert_recursive(root: Node) -> Node {
    if let Some(n) = &root {
        let mut b = n.borrow_mut();
        let (l, r) = (b.left.take(), b.right.take());
        b.left = invert_recursive(r);
        b.right = invert_recursive(l);
    }
    root
}

// Cách 2: ngăn xếp tự quản; std::mem::swap đổi hai con tại chỗ.
fn invert_stack(root: Node) -> Node {
    let mut stack: Vec<Rc<RefCell<TreeNode>>> = root.iter().cloned().collect();
    while let Some(n) = stack.pop() {
        let mut b = n.borrow_mut();
        let b = &mut *b;
        std::mem::swap(&mut b.left, &mut b.right);
        stack.extend(b.left.iter().cloned());
        stack.extend(b.right.iter().cloned());
    }
    root
}

// Cách 3: BFS với VecDeque.
fn invert_bfs(root: Node) -> Node {
    let mut queue: std::collections::VecDeque<Rc<RefCell<TreeNode>>> = root.iter().cloned().collect();
    while let Some(n) = queue.pop_front() {
        let mut b = n.borrow_mut();
        let b = &mut *b;
        std::mem::swap(&mut b.left, &mut b.right);
        queue.extend(b.left.iter().cloned());
        queue.extend(b.right.iter().cloned());
    }
    root
}

// Sai: hai câu gán nối tiếp. clone() trên Rc chỉ chép con trỏ, nên câu sau đọc
// đúng cây con câu trước vừa gắn vào.
fn wrong_overwrite(root: Node) -> Node {
    if let Some(n) = &root {
        let r = n.borrow().right.clone();
        let new_left = wrong_overwrite(r);
        n.borrow_mut().left = new_left;
        let l = n.borrow().left.clone();
        let new_right = wrong_overwrite(l);
        n.borrow_mut().right = new_right;
    }
    root
}

fn ser(t: &Node) -> String {
    match t {
        None => "#".into(),
        Some(n) => {
            let b = n.borrow();
            format!("({} {} {})", ser(&b.left), b.val, ser(&b.right))
        }
    }
}

fn ser_mirror(t: &Node) -> String {
    match t {
        None => "#".into(),
        Some(n) => {
            let b = n.borrow();
            format!("({} {} {})", ser_mirror(&b.right), b.val, ser_mirror(&b.left))
        }
    }
}

fn random_tree(rng: &mut Rng, n: usize) -> Node {
    if n == 0 {
        return None;
    }
    let root = new_node(0);
    let mut slots = vec![(root.clone(), 0), (root.clone(), 1)];
    for i in 1..n {
        let j = rng.below(slots.len());
        let (parent, side) = slots.swap_remove(j);
        let node = new_node(i as i32);
        if side == 0 {
            parent.borrow_mut().left = Some(node.clone());
        } else {
            parent.borrow_mut().right = Some(node.clone());
        }
        slots.push((node.clone(), 0));
        slots.push((node, 1));
    }
    Some(root)
}

fn main() {
    let cases = [
        ("cây rỗng", "[]", "[]"),
        ("một nút", "[1]", "[1]"),
        ("chỉ có con trái", "[1,2]", "[1,null,2]"),
        ("ba nút", "[2,1,3]", "[2,3,1]"),
        ("cây đủ 3 tầng", "[5,3,8,1,4,7,9]", "[5,8,3,9,7,4,1]"),
        ("chuỗi trái thành chuỗi phải", "[1,2,null,3]", "[1,null,2,null,3]"),
        ("lệch hai bên", "[1,2,3,null,4,null,5]", "[1,3,2,5,null,4]"),
        ("giá trị âm và 0", "[0,-1,null,-2,-3]", "[0,null,-1,-3,-2]"),
    ];
    let fns: [(&str, fn(Node) -> Node); 4] = [
        ("invert_recursive", invert_recursive),
        ("invert_stack", invert_stack),
        ("invert_bfs", invert_bfs),
        ("wrong_overwrite", wrong_overwrite),
    ];
    for (name, f) in fns.iter() {
        let mut bad = vec![];
        for (cname, input, want) in cases.iter() {
            let got = show(&to_level(&f(from_level(&lv(input)))));
            if got != show(&lv(want)) {
                bad.push(format!("{} → {}", cname, got));
            }
        }
        report(name, cases.len(), &bad, 16);
    }

    // Đối chiếu ngẫu nhiên với "gương" độc lập.
    let mut rng = Rng(226);
    let total = 2000;
    let mut ok = [0; 3];
    for _ in 0..total {
        let n = rng.below(41);
        let seed = rng.next() | 1;
        for (j, (_, f)) in fns.iter().take(3).enumerate() {
            let root = random_tree(&mut Rng(seed), n); // mỗi cách đảo một bản riêng của cùng một cây
            let want = ser_mirror(&root);
            if ser(&f(root)) == want {
                ok[j] += 1;
            }
        }
    }
    let parts: Vec<String> = (0..3).map(|j| format!("{} {}/{}", fns[j].0, ok[j], total)).collect();
    println!("\nngẫu nhiên: {}", parts.join(", "));
}
