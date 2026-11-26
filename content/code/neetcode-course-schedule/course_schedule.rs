// LC 207 Course Schedule: có học hết được mọi môn không? Cùng bộ ca với năm ngôn ngữ kia.
// Chạy: rustc --edition 2021 -O course_schedule.rs && ./course_schedule

use std::cell::Cell;
use std::collections::{HashSet, VecDeque};
use std::time::Instant;

thread_local! {
    static WORK: Cell<u64> = Cell::new(0); // số lần nhìn một cạnh, dùng cho phép đo
    static PASSES: Cell<u64> = Cell::new(0);
}
fn tick() {
    WORK.with(|w| w.set(w.get() + 1));
}

type Solver = fn(usize, &[[usize; 2]]) -> bool;

// Cặp [a, b] nghĩa là "muốn học a phải học b trước": cạnh đi từ b sang a.
fn build_graph(n: usize, prerequisites: &[[usize; 2]]) -> (Vec<Vec<usize>>, Vec<usize>) {
    let mut adj = vec![Vec::new(); n];
    let mut indegree = vec![0usize; n];
    for &[a, b] in prerequisites {
        adj[b].push(a);
        indegree[a] += 1;
    }
    (adj, indegree)
}

// Cách 1: quét lặp. Mỗi lượt quét mọi môn, học môn nào đã đủ tiên quyết.
fn can_finish_scan(n: usize, prerequisites: &[[usize; 2]]) -> bool {
    let mut needs = vec![Vec::new(); n];
    for &[a, b] in prerequisites {
        needs[a].push(b);
    }
    let mut done = vec![false; n];
    let mut count = 0;
    let mut passes = 0;
    let mut progress = true;
    while progress {
        progress = false;
        passes += 1;
        for c in 0..n {
            if done[c] {
                continue;
            }
            let mut ready = true;
            for &b in &needs[c] {
                tick();
                if !done[b] {
                    ready = false;
                    break;
                }
            }
            if ready {
                done[c] = true;
                count += 1;
                progress = true;
            }
        }
    }
    PASSES.with(|p| p.set(passes));
    count == n
}

// Cách 2: Kahn. Môn có bậc vào 0 thì học được ngay; học xong thì trừ bậc vào
// của các môn đứng sau. Đếm số môn học được. O(V + E).
fn can_finish_kahn(n: usize, prerequisites: &[[usize; 2]]) -> bool {
    let (adj, mut indegree) = build_graph(n, prerequisites);
    let mut queue: VecDeque<usize> = (0..n).filter(|&c| indegree[c] == 0).collect();
    let mut taken = 0;
    while let Some(u) = queue.pop_front() {
        taken += 1;
        for &v in &adj[u] {
            tick();
            indegree[v] -= 1; // usize: chỉ trừ khi chắc > 0, nếu không bản debug panic
            if indegree[v] == 0 {
                queue.push_back(v);
            }
        }
    }
    taken == n // thiếu môn nào là môn đó kẹt trong một vòng
}

const WHITE: u8 = 0;
const GRAY: u8 = 1;
const BLACK: u8 = 2;

// Cách 3: DFS ba màu, đệ quy. Trắng = chưa đụng, xám = đang trên đường đi,
// đen = đã xong. Gặp lại một đỉnh xám là có vòng. O(V + E).
fn can_finish_dfs(n: usize, prerequisites: &[[usize; 2]]) -> bool {
    let (adj, _) = build_graph(n, prerequisites);
    let mut color = vec![WHITE; n];
    // Hàm lồng thay cho closure: closure đệ quy cần mượn &mut color hai lần, borrow checker không cho.
    fn visit(u: usize, adj: &[Vec<usize>], color: &mut [u8]) -> bool {
        color[u] = GRAY;
        for &v in &adj[u] {
            tick();
            if color[v] == GRAY {
                return false; // quay về đỉnh đang trên đường: vòng
            }
            if color[v] == WHITE && !visit(v, adj, color) {
                return false;
            }
        }
        color[u] = BLACK;
        true
    }
    for u in 0..n {
        if color[u] == WHITE && !visit(u, &adj, &mut color) {
            return false;
        }
    }
    true
}

// Cách 3b: cùng DFS ba màu nhưng tự giữ ngăn xếp, không đệ quy.
fn can_finish_dfs_stack(n: usize, prerequisites: &[[usize; 2]]) -> bool {
    let (adj, _) = build_graph(n, prerequisites);
    let mut color = vec![WHITE; n];
    let mut next = vec![0usize; n]; // hàng xóm kế tiếp cần xem của mỗi đỉnh
    for s in 0..n {
        if color[s] != WHITE {
            continue;
        }
        let mut stack = vec![s];
        color[s] = GRAY;
        while let Some(&u) = stack.last() {
            if next[u] < adj[u].len() {
                let v = adj[u][next[u]];
                next[u] += 1;
                tick();
                if color[v] == GRAY {
                    return false;
                }
                if color[v] == WHITE {
                    color[v] = GRAY;
                    stack.push(v);
                }
            } else {
                color[u] = BLACK;
                stack.pop();
            }
        }
    }
    true
}

// Bản sai 1: DFS chỉ có một tập "đã thăm", gặp lại đỉnh đã thăm là kết luận có vòng.
fn wrong_one_visited_set(n: usize, prerequisites: &[[usize; 2]]) -> bool {
    let (adj, _) = build_graph(n, prerequisites);
    fn visit(u: usize, adj: &[Vec<usize>], visited: &mut HashSet<usize>) -> bool {
        if !visited.insert(u) {
            return false;
        }
        adj[u].iter().all(|&v| visit(v, adj, visited))
    }
    let mut visited = HashSet::new();
    (0..n).all(|u| visited.contains(&u) || visit(u, &adj, &mut visited))
}

// Bản sai 2: chỉ hỏi "có môn nào học được ngay không?".
fn wrong_has_start(n: usize, prerequisites: &[[usize; 2]]) -> bool {
    build_graph(n, prerequisites).1.iter().any(|&d| d == 0)
}

fn cases() -> Vec<(&'static str, usize, Vec<[usize; 2]>, bool)> {
    vec![
        ("hai môn", 2, vec![[1, 0]], true),
        ("hai môn chờ nhau", 2, vec![[1, 0], [0, 1]], false),
        ("kim cương", 4, vec![[1, 0], [2, 0], [3, 1], [3, 2]], true),
        ("ví dụ năm môn", 5, vec![[1, 0], [2, 0], [3, 1], [3, 2], [4, 3]], true),
        ("học được một môn rồi kẹt", 4, vec![[1, 0], [2, 1], [3, 2], [1, 3]], false),
        ("môn tự cần chính nó", 2, vec![[1, 1]], false),
        ("không có tiên quyết", 3, vec![], true),
        ("hai mảnh, mảnh sau có vòng", 6, vec![[1, 0], [3, 2], [4, 3], [2, 4]], false),
    ]
}

fn check(name: &str, solve: Solver) {
    let cs = cases();
    let mut ok = 0;
    let mut wrong = Vec::new();
    for (label, n, pre, want) in &cs {
        let got = solve(*n, pre);
        if got == *want {
            ok += 1;
        } else {
            wrong.push(format!("{label} → {got}"));
        }
    }
    let tail = if wrong.is_empty() { String::new() } else { format!("; sai ở {}", wrong.join(", ")) };
    println!("{:<22} {}/{} ca đúng{}", name, ok, cs.len(), tail);
}

// Bộ sinh số giả ngẫu nhiên MINSTD: các ngôn ngữ ra cùng một dãy, cùng đồ thị.
struct Minstd(u64);
impl Minstd {
    fn rand(&mut self, k: usize) -> usize {
        self.0 = self.0 * 48271 % 2147483647;
        (self.0 % k as u64) as usize
    }
}

fn measure(name: &str, solve: Solver, n: usize, pre: &[[usize; 2]], with_passes: bool) {
    let mut best = f64::INFINITY;
    let mut got = false;
    let mut w = 0;
    for _ in 0..3 {
        WORK.with(|c| c.set(0));
        let t0 = Instant::now();
        got = solve(n, pre);
        best = best.min(t0.elapsed().as_secs_f64() * 1000.0);
        w = WORK.with(|c| c.get());
    }
    let extra = if with_passes { format!(", {} lượt quét", PASSES.with(|p| p.get())) } else { String::new() };
    println!("  {:<22} {}, {} lần nhìn cạnh{}, {:.1} ms", name, got, w, extra, best);
}

fn main() {
    let solvers: [(&str, Solver); 6] = [
        ("can_finish_scan", can_finish_scan),
        ("can_finish_kahn", can_finish_kahn),
        ("can_finish_dfs", can_finish_dfs),
        ("can_finish_dfs_stack", can_finish_dfs_stack),
        ("wrong_one_visited_set", wrong_one_visited_set),
        ("wrong_has_start", wrong_has_start),
    ];
    for (name, f) in solvers {
        check(name, f);
    }

    let mut rng = Minstd(20261126);
    let (mut agree, mut finishable) = (0, 0);
    for _ in 0..2000 {
        let n = 1 + rng.rand(8);
        let m = rng.rand(n * 2 + 1);
        let mut seen = HashSet::new();
        let mut pre = Vec::new();
        for _ in 0..m {
            let (a, b) = (rng.rand(n), rng.rand(n));
            if !seen.insert(a * n + b) {
                continue;
            }
            pre.push([a, b]);
        }
        let r: Vec<bool> = solvers[..4].iter().map(|(_, f)| f(n, &pre)).collect();
        if r.iter().all(|&x| x == r[0]) {
            agree += 1;
        }
        if r[0] {
            finishable += 1;
        }
    }
    println!("ngẫu nhiên: {agree}/2000 đồ thị, bốn cách khớp nhau ({finishable} học hết được, {} có vòng)", 2000 - finishable);

    const N: usize = 2000;
    let reversed_chain: Vec<[usize; 2]> = (0..N - 1).map(|i| [i, i + 1]).collect();
    println!("chuỗi {N} môn, môn i cần môn i+1:");
    for (i, (name, f)) in solvers[..4].iter().enumerate() {
        measure(name, *f, N, &reversed_chain, i == 0);
    }

    let mut perm: Vec<usize> = (0..N).collect();
    for i in (1..N).rev() {
        let j = rng.rand(i + 1);
        perm.swap(i, j);
    }
    let mut dag_seen = HashSet::new();
    let mut dag = Vec::new();
    while dag.len() < 5000 {
        let (x, y) = (rng.rand(N), rng.rand(N));
        if x == y {
            continue;
        }
        let (lo, hi) = (x.min(y), x.max(y));
        if !dag_seen.insert(lo * N + hi) {
            continue;
        }
        dag.push([perm[hi], perm[lo]]);
    }
    println!("ngẫu nhiên {N} môn, 5000 cặp, không vòng:");
    for (i, (name, f)) in solvers[..4].iter().enumerate() {
        measure(name, *f, N, &dag, i == 0);
    }

    // Đệ quy sâu chạy trên luồng chính (stack 8 MB). Khung của visit nhỏ nên 100 000 tầng vẫn vừa;
    // nếu tràn thì Rust abort cả tiến trình, không bắt được như ngoại lệ.
    println!("đệ quy sâu, chuỗi môn i+1 cần môn i:");
    for len in [2000usize, 100000] {
        let chain: Vec<[usize; 2]> = (0..len - 1).map(|i| [i + 1, i]).collect();
        let parts: Vec<String> = [solvers[2], solvers[3], solvers[1]]
            .iter()
            .map(|(name, f)| format!("{name} {}", f(len, &chain)))
            .collect();
        println!("  {len} môn: {}", parts.join("; "));
    }
}
