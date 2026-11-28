// Word Search (LeetCode 79): tìm một từ trên lưới chữ, mỗi bước sang ô kề cạnh, không dùng lại ô.
// Chạy: rustc --edition 2021 -O word_search.rs -o /tmp/word_search && /tmp/word_search
use std::cell::Cell;

const DIRS: [(i32, i32); 4] = [(1, 0), (-1, 0), (0, 1), (0, -1)];

thread_local! {
    static CALLS: Cell<u64> = Cell::new(0);
}

fn tick() {
    CALLS.with(|c| c.set(c.get() + 1));
}

// Cách 1: DFS với một bảng visited riêng.
fn exist_visited(board: &[Vec<u8>], word: &[u8]) -> bool {
    fn dfs(board: &[Vec<u8>], word: &[u8], visited: &mut Vec<Vec<bool>>, r: i32, c: i32, k: usize) -> bool {
        tick();
        if k == word.len() {
            return true;
        }
        if r < 0 || c < 0 || r as usize >= board.len() || c as usize >= board[0].len() {
            return false;
        }
        let (ru, cu) = (r as usize, c as usize);
        if visited[ru][cu] || board[ru][cu] != word[k] {
            return false;
        }
        visited[ru][cu] = true;
        for (dr, dc) in DIRS {
            if dfs(board, word, visited, r + dr, c + dc, k + 1) {
                visited[ru][cu] = false;
                return true;
            }
        }
        visited[ru][cu] = false;
        false
    }
    let mut visited = vec![vec![false; board[0].len()]; board.len()];
    for r in 0..board.len() {
        for c in 0..board[0].len() {
            if dfs(board, word, &mut visited, r as i32, c as i32, 0) {
                return true;
            }
        }
    }
    false
}

// Cách 2: đánh dấu ngay trên lưới bằng b'#', trả lại chữ cũ khi quay lui.
// Hàm đệ quy nhận &mut lưới; mỗi lần chỉ có một lời gọi đang mượn nó.
fn exist_in_place(board: &mut Vec<Vec<u8>>, word: &[u8]) -> bool {
    fn dfs(board: &mut Vec<Vec<u8>>, word: &[u8], r: i32, c: i32, k: usize) -> bool {
        tick();
        if k == word.len() {
            return true;
        }
        if r < 0 || c < 0 || r as usize >= board.len() || c as usize >= board[0].len() {
            return false;
        }
        let (ru, cu) = (r as usize, c as usize);
        if board[ru][cu] != word[k] {
            return false;
        }
        let saved = board[ru][cu];
        board[ru][cu] = b'#';
        let mut found = false;
        for (dr, dc) in DIRS {
            if dfs(board, word, r + dr, c + dc, k + 1) {
                found = true;
                break;
            }
        }
        board[ru][cu] = saved;
        found
    }
    for r in 0..board.len() {
        for c in 0..board[0].len() {
            if dfs(board, word, r as i32, c as i32, 0) {
                return true;
            }
        }
    }
    false
}

// Cách 3: cắt nhánh trước khi tìm. Đếm chữ, rồi đảo từ nếu chữ cuối hiếm hơn chữ đầu.
fn exist_pruned(board: &mut Vec<Vec<u8>>, word: &[u8]) -> bool {
    let mut have = [0usize; 256];
    let mut need = [0usize; 256];
    for row in board.iter() {
        for &ch in row {
            have[ch as usize] += 1;
        }
    }
    for &ch in word {
        need[ch as usize] += 1;
    }
    if (0..256).any(|ch| need[ch] > have[ch]) {
        return false;
    }
    let mut w = word.to_vec();
    if have[w[w.len() - 1] as usize] < have[w[0] as usize] {
        w.reverse();
    }
    exist_in_place(board, &w)
}

// Trọng tài: liệt kê mọi đường đi đơn dài |word| trên lưới, ghép chữ rồi so cả chuỗi.
fn brute_force(board: &[Vec<u8>], word: &[u8]) -> bool {
    fn walk(board: &[Vec<u8>], word: &[u8], used: &mut Vec<Vec<bool>>, r: usize, c: usize, text: &mut Vec<u8>) -> bool {
        text.push(board[r][c]);
        let mut hit = false;
        if text.len() == word.len() {
            hit = text.as_slice() == word;
        } else {
            used[r][c] = true;
            for (dr, dc) in DIRS {
                let (nr, nc) = (r as i32 + dr, c as i32 + dc);
                if nr < 0 || nc < 0 || nr as usize >= board.len() || nc as usize >= board[0].len() {
                    continue;
                }
                let (nr, nc) = (nr as usize, nc as usize);
                if !used[nr][nc] && walk(board, word, used, nr, nc, text) {
                    hit = true;
                    break;
                }
            }
            used[r][c] = false;
        }
        text.pop();
        hit
    }
    let mut used = vec![vec![false; board[0].len()]; board.len()];
    let mut text = Vec::new();
    for r in 0..board.len() {
        for c in 0..board[0].len() {
            if walk(board, word, &mut used, r, c, &mut text) {
                return true;
            }
        }
    }
    false
}

fn board(rows: &[&str]) -> Vec<Vec<u8>> {
    rows.iter().map(|s| s.as_bytes().to_vec()).collect()
}

fn main() {
    let grid = board(&["cat", "ods", "gen"]);
    let cases: Vec<(Vec<Vec<u8>>, &str, bool)> = vec![
        (grid.clone(), "cat", true),
        (grid.clone(), "cod", true),
        (grid.clone(), "dog", true),
        (grid.clone(), "cats", true),
        (grid.clone(), "neds", true),
        (grid.clone(), "tact", false),
        (grid.clone(), "cab", false),
        (board(&["z"]), "z", true),
        (board(&["z"]), "zz", false),
        (board(&["ab", "ba"]), "abab", true),
        (board(&["ab", "ba"]), "abaa", false),
        (board(&["ab"]), "aba", false),
    ];
    let mut ok = 0;
    for (b, word, want) in &cases {
        let w = word.as_bytes();
        let (mut b2, mut b3) = (b.clone(), b.clone());
        let got = [exist_visited(b, w), exist_in_place(&mut b2, w), exist_pruned(&mut b3, w), brute_force(b, w)];
        if got.iter().all(|g| g == want) && &b2 == b && &b3 == b {
            ok += 1;
        } else {
            println!("sai ở {} {:?}", word, got);
        }
    }
    println!("{}/{} ca đúng", ok, cases.len());

    // Đối chiếu: mọi lưới 2×2 và 2×3 trên {a, b}, mọi từ trên {a, b} dài 1–4.
    let mut words: Vec<Vec<u8>> = Vec::new();
    for len in 1..=4 {
        for mask in 0..(1u32 << len) {
            words.push((0..len).map(|i| if (mask >> i) & 1 == 1 { b'b' } else { b'a' }).collect());
        }
    }
    let (mut total, mut agree) = (0, 0);
    for cols in [2usize, 3] {
        let cells = 2 * cols;
        for mask in 0..(1u32 << cells) {
            let mut b = vec![vec![b'a'; cols]; 2];
            for i in 0..cells {
                if (mask >> i) & 1 == 1 {
                    b[i / cols][i % cols] = b'b';
                }
            }
            for w in &words {
                total += 1;
                let want = brute_force(&b, w);
                let (mut b2, mut b3) = (b.clone(), b.clone());
                if exist_visited(&b, w) == want
                    && exist_in_place(&mut b2, w) == want
                    && exist_pruned(&mut b3, w) == want
                    && b2 == b
                    && b3 == b
                {
                    agree += 1;
                }
            }
        }
    }
    println!("{}/{} ca đúng (đối chiếu liệt kê mọi đường đi)", agree, total);

    // Phép đo: lưới 4×4 toàn chữ a, chữ b ở góc dưới phải bị hai chữ c chắn, từ aaaaaaab không có.
    let trap = board(&["aaaa", "aaaa", "aaac", "aacb"]);
    CALLS.with(|c| c.set(0));
    exist_in_place(&mut trap.clone(), b"aaaaaaab");
    let plain = CALLS.with(|c| c.get());
    CALLS.with(|c| c.set(0));
    exist_pruned(&mut trap.clone(), b"aaaaaaab");
    let pruned = CALLS.with(|c| c.get());
    println!(
        "Lưới 4×4 toàn a, b ở góc bị c chắn, từ aaaaaaab: không cắt nhánh {} lượt gọi, đảo từ {} lượt gọi",
        plain, pruned
    );
}
