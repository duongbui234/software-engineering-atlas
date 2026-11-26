// LC 210 Course Schedule II: tìm một thứ tự học hợp lệ, hoặc [] nếu các môn chờ nhau thành vòng.
// Chạy: rustc --edition 2021 -O course_schedule_ii.rs && ./course_schedule_ii

use std::cell::Cell;
use std::collections::{HashMap, HashSet, VecDeque};
use std::time::Instant;

thread_local! {
    // số bước cơ bản (nhìn qua một môn, xét một điều kiện), dùng cho phép đo
    static WORK: Cell<u64> = Cell::new(0);
}
fn tick() {
    WORK.with(|w| w.set(w.get() + 1));
}

type Solver = fn(usize, &[[usize; 2]]) -> Vec<usize>;

// Cách 1: quét lặp. Mỗi lượt đi từ môn 0, lấy môn đầu tiên đã học đủ điều kiện. O(V·(V+E)).
fn order_scan(n: usize, prereqs: &[[usize; 2]]) -> Vec<usize> {
    let mut need = vec![Vec::new(); n];
    for &[a, b] in prereqs {
        need[a].push(b); // muốn học a thì phải xong b
    }
    let mut taken = vec![false; n];
    let mut order = Vec::with_capacity(n);
    while order.len() < n {
        let mut found = None;
        for c in 0..n {
            tick(); // cả môn đã học cũng tốn một lần nhìn qua
            if taken[c] {
                continue;
            }
            let mut ready = true;
            for &b in &need[c] {
                tick();
                if !taken[b] {
                    ready = false;
                    break;
                }
            }
            if ready {
                found = Some(c);
                break;
            }
        }
        match found {
            Some(c) => {
                taken[c] = true;
                order.push(c);
            }
            None => return Vec::new(), // còn môn chưa học mà không môn nào đủ điều kiện: có vòng
        }
    }
    order
}

// Cách 2: Kahn. Đếm bậc vào, môn nào về 0 thì xếp hàng. Chính thứ tự lấy ra là đáp án. O(V+E).
fn order_kahn(n: usize, prereqs: &[[usize; 2]]) -> Vec<usize> {
    let mut next = vec![Vec::new(); n];
    let mut indegree = vec![0usize; n];
    for &[a, b] in prereqs {
        next[b].push(a); // cạnh b → a: học b xong mới mở khóa a
        indegree[a] += 1;
    }
    let mut queue: VecDeque<usize> = (0..n).filter(|&c| indegree[c] == 0).collect();
    let mut order = Vec::with_capacity(n);
    while let Some(c) = queue.pop_front() {
        tick();
        order.push(c);
        for &d in &next[c] {
            tick();
            indegree[d] -= 1;
            if indegree[d] == 0 {
                queue.push_back(d);
            }
        }
    }
    if order.len() == n { order } else { Vec::new() } // thiếu môn nghĩa là có vòng
}

// Cách 3: DFS ba màu. Môn xong hết đường phía sau thì ghi vào post; đảo post là thứ tự. O(V+E).
fn order_dfs(n: usize, prereqs: &[[usize; 2]]) -> Vec<usize> {
    let mut next = vec![Vec::new(); n];
    for &[a, b] in prereqs {
        next[b].push(a);
    }
    // 0 trắng: chưa tới, 1 xám: đang trên đường đi, 2 đen: đã xong
    fn visit(c: usize, next: &[Vec<usize>], color: &mut [u8], post: &mut Vec<usize>) -> bool {
        color[c] = 1;
        tick();
        for &d in &next[c] {
            tick();
            if color[d] == 1 {
                return false; // quay lại một môn đang xám: vòng
            }
            if color[d] == 0 && !visit(d, next, color, post) {
                return false;
            }
        }
        color[c] = 2;
        post.push(c);
        true
    }
    let mut color = vec![0u8; n];
    let mut post = Vec::with_capacity(n);
    for c in 0..n {
        if color[c] == 0 && !visit(c, &next, &mut color, &mut post) {
            return Vec::new();
        }
    }
    post.reverse(); // push rồi đảo một lần, không insert(0, …) từng phần tử
    post
}

// Bản sai 1: lật chiều cạnh (a → b). Thứ tự ra ngược hẳn.
fn wrong_edge_direction(n: usize, prereqs: &[[usize; 2]]) -> Vec<usize> {
    let flipped: Vec<[usize; 2]> = prereqs.iter().map(|&[a, b]| [b, a]).collect();
    order_kahn(n, &flipped)
}

// Bản sai 2: DFS chỉ có một tập "đã thăm". Gặp lại môn đã xong cũng tưởng là vòng.
fn wrong_one_set_dfs(n: usize, prereqs: &[[usize; 2]]) -> Vec<usize> {
    let mut next = vec![Vec::new(); n];
    for &[a, b] in prereqs {
        next[b].push(a);
    }
    fn visit(c: usize, next: &[Vec<usize>], seen: &mut [bool], post: &mut Vec<usize>) -> bool {
        seen[c] = true;
        for &d in &next[c] {
            if seen[d] || !visit(d, next, seen, post) {
                return false;
            }
        }
        post.push(c);
        true
    }
    let mut seen = vec![false; n];
    let mut post = Vec::new();
    for c in 0..n {
        if !seen[c] && !visit(c, &next, &mut seen, &mut post) {
            return Vec::new();
        }
    }
    post.reverse();
    post
}

// Bản sai 3: Kahn nhưng quên kiểm số môn đã xếp. Có vòng vẫn trả một thứ tự thiếu.
fn wrong_no_cycle_check(n: usize, prereqs: &[[usize; 2]]) -> Vec<usize> {
    let mut next = vec![Vec::new(); n];
    let mut indegree = vec![0usize; n];
    for &[a, b] in prereqs {
        next[b].push(a);
        indegree[a] += 1;
    }
    let mut queue: Vec<usize> = (0..n).filter(|&c| indegree[c] == 0).collect();
    let mut head = 0;
    while head < queue.len() {
        for &d in &next[queue[head]] {
            indegree[d] -= 1;
            if indegree[d] == 0 {
                queue.push(d);
            }
        }
        head += 1;
    }
    queue
}

// Bộ chấm: không so với một đáp án cố định, mà kiểm mọi điều kiện đều đi xuôi.
fn is_valid(n: usize, prereqs: &[[usize; 2]], order: &[usize], possible: bool) -> bool {
    if !possible {
        return order.is_empty();
    }
    if order.len() != n {
        return false;
    }
    let mut pos = vec![usize::MAX; n];
    for (i, &c) in order.iter().enumerate() {
        if c >= n || pos[c] != usize::MAX {
            return false;
        }
        pos[c] = i;
    }
    prereqs.iter().all(|&[a, b]| pos[b] < pos[a])
}

// Thứ tự không duy nhất: sinh mọi hoán vị (cùng thứ tự sinh như các ngôn ngữ kia).
fn permutations(n: usize) -> Vec<Vec<usize>> {
    if n == 0 {
        return vec![vec![]];
    }
    let mut out = Vec::new();
    for p in permutations(n - 1) {
        for i in 0..=p.len() {
            let mut q = p[..i].to_vec();
            q.push(n - 1);
            q.extend_from_slice(&p[i..]);
            out.push(q);
        }
    }
    out
}

// Số ngẫu nhiên MINSTD: các ngôn ngữ sinh cùng một dãy.
struct Minstd(u64);
impl Minstd {
    fn rand(&mut self, k: usize) -> usize {
        self.0 = self.0 * 48271 % 2147483647;
        (self.0 % k as u64) as usize
    }
}

fn join(v: &[usize]) -> String {
    v.iter().map(|x| x.to_string()).collect::<Vec<_>>().join(",")
}

fn main() {
    let cases: Vec<(&str, usize, Vec<[usize; 2]>, bool)> = vec![
        ("ví dụ sáu môn", 6, vec![[4, 3], [4, 0], [1, 4], [5, 4], [2, 1], [2, 5]], true),
        ("không có điều kiện", 3, vec![], true),
        ("một môn", 1, vec![], true),
        ("hai môn", 2, vec![[0, 1]], true),
        ("vòng hai môn", 2, vec![[0, 1], [1, 0]], false),
        ("vòng ba môn", 3, vec![[0, 1], [1, 2], [2, 0]], false),
        ("hình kim cương", 4, vec![[0, 2], [1, 2], [3, 0], [3, 1]], true),
        ("vòng ở một góc", 5, vec![[1, 0], [2, 1], [1, 2], [3, 0], [4, 3]], false),
    ];
    let solvers: [(&str, Solver); 6] = [
        ("order_scan", order_scan),
        ("order_kahn", order_kahn),
        ("order_dfs", order_dfs),
        ("wrong_edge_direction", wrong_edge_direction),
        ("wrong_one_set_dfs", wrong_one_set_dfs),
        ("wrong_no_cycle_check", wrong_no_cycle_check),
    ];
    for (name, solve) in solvers {
        let wrong: Vec<&str> = cases
            .iter()
            .filter(|(_, n, p, possible)| !is_valid(*n, p, &solve(*n, p), *possible))
            .map(|c| c.0)
            .collect();
        let tail = if wrong.is_empty() { String::new() } else { format!("; sai ở {}", wrong.join(", ")) };
        println!("{:<22} {}/{} ca đúng{}", name, cases.len() - wrong.len(), cases.len(), tail);
    }

    let (ex_n, ex_p) = (cases[0].1, &cases[0].2);
    let from_kahn = order_kahn(ex_n, ex_p);
    let from_dfs = order_dfs(ex_n, ex_p);
    let all_valid = permutations(ex_n).iter().filter(|o| is_valid(ex_n, ex_p, o, true)).count();
    let both = is_valid(ex_n, ex_p, &from_kahn, true) && is_valid(ex_n, ex_p, &from_dfs, true);
    println!(
        "ví dụ sáu môn: Kahn → [{}], DFS → [{}]; cả hai hợp lệ: {}; có {}/720 thứ tự hợp lệ",
        join(&from_kahn), join(&from_dfs), both, all_valid
    );
    println!(
        "chấm bằng cách so với đáp án cố định [{}]: DFS bị chấm {}",
        join(&from_kahn),
        if from_dfs == from_kahn { "đúng" } else { "sai" }
    );

    // Đối chiếu với vét cạn: n ≤ 6, thử mọi hoán vị để biết có thứ tự hợp lệ hay không.
    let mut rng = Minstd(42);
    let (mut agree, mut cyclic) = (0, 0);
    let trials = 1000;
    let mut perms_of: HashMap<usize, Vec<Vec<usize>>> = HashMap::new();
    for _ in 0..trials {
        let n = 1 + rng.rand(6);
        let m = rng.rand(n * (n - 1) + 1);
        let mut keys = HashSet::new();
        let mut p = Vec::new();
        for _ in 0..m {
            let (a, b) = (rng.rand(n), rng.rand(n));
            if a != b && keys.insert(a * n + b) {
                p.push([a, b]);
            }
        }
        let perms = perms_of.entry(n).or_insert_with(|| permutations(n));
        let possible = perms.iter().any(|o| is_valid(n, &p, o, true));
        if !possible {
            cyclic += 1;
        }
        if solvers[..3].iter().all(|(_, solve)| is_valid(n, &p, &solve(n, &p), possible)) {
            agree += 1;
        }
    }
    println!("ngẫu nhiên: {agree}/{trials} đồ thị, ba cách đều hợp lệ ({cyclic} đồ thị có vòng)");

    // Đo trên 2 000 môn.
    const N: usize = 2000;
    let forward: Vec<[usize; 2]> = (0..N - 1).map(|i| [i + 1, i]).collect(); // môn i+1 cần môn i
    let backward: Vec<[usize; 2]> = (0..N - 1).map(|i| [i, i + 1]).collect(); // môn i cần môn i+1
    let mut rank: Vec<usize> = (0..N).collect();
    for i in (1..N).rev() {
        let j = rng.rand(i + 1);
        rank.swap(i, j);
    }
    let mut random_dag = Vec::new();
    let mut dag_keys = HashSet::new();
    while random_dag.len() < 20000 {
        let (u, v) = (rng.rand(N), rng.rand(N));
        if u == v {
            continue;
        }
        let (a, b) = if rank[u] > rank[v] { (u, v) } else { (v, u) }; // môn hạng cao cần môn hạng thấp
        if !dag_keys.insert(a * N + b) {
            continue;
        }
        random_dag.push([a, b]);
    }
    let graphs = [
        ("chuỗi xuôi (i+1 cần i)", forward),
        ("chuỗi ngược (i cần i+1)", backward),
        ("DAG ngẫu nhiên, 20000 điều kiện", random_dag),
    ];
    for (label, p) in &graphs {
        println!("{label}, {N} môn:");
        for (name, solve) in &solvers[..3] {
            WORK.with(|w| w.set(0));
            let t0 = Instant::now();
            let order = solve(N, p);
            let ms = t0.elapsed().as_secs_f64() * 1000.0;
            let w = WORK.with(|w| w.get());
            println!("  {:<10} hợp lệ: {}, {} bước, {:.2} ms", name, is_valid(N, p, &order, true), w, ms);
        }
    }
}
