// Ga MISC-02: quay lui khi thứ tự có ý nghĩa, với trạng thái phải gỡ ra.
// Chạy: rustc --edition 2021 -O search.rs -o /tmp/search && /tmp/search
use std::collections::HashSet;

// Permutations: không có start; đánh dấu phần tử đã nằm trong path.
fn permute(nums: &[i32], calls: &mut usize) -> Vec<Vec<i32>> {
    fn walk(nums: &[i32], used: &mut Vec<bool>, path: &mut Vec<i32>, result: &mut Vec<Vec<i32>>, calls: &mut usize) {
        *calls += 1;
        if path.len() == nums.len() {
            result.push(path.clone()); // chép path, vì path còn đổi tiếp
            return;
        }
        for i in 0..nums.len() {
            if used[i] {
                continue; // đã nằm trong path
            }
            used[i] = true; // đánh dấu
            path.push(nums[i]); // chọn
            walk(nums, used, path, result, calls); // đi sâu
            path.pop(); // gỡ lựa chọn
            used[i] = false; // gỡ dấu
        }
    }
    let mut result = Vec::new();
    walk(nums, &mut vec![false; nums.len()], &mut Vec::new(), &mut result, calls);
    result
}

// Word Search: ghi đè ô đang đi qua, khôi phục khi quay lui.
fn exist(board: &mut Vec<Vec<u8>>, word: &str) -> bool {
    fn dfs(board: &mut Vec<Vec<u8>>, word: &[u8], r: i32, c: i32, k: usize) -> bool {
        if r < 0 || c < 0 || r as usize >= board.len() || c as usize >= board[0].len() {
            return false;
        }
        let (ru, cu) = (r as usize, c as usize);
        if board[ru][cu] != word[k] {
            return false;
        }
        if k == word.len() - 1 {
            return true;
        }
        let saved = board[ru][cu];
        board[ru][cu] = b'#'; // đánh dấu đang đi qua
        let found = dfs(board, word, r + 1, c, k + 1)
            || dfs(board, word, r - 1, c, k + 1)
            || dfs(board, word, r, c + 1, k + 1)
            || dfs(board, word, r, c - 1, k + 1);
        board[ru][cu] = saved; // khôi phục
        found
    }
    for r in 0..board.len() {
        for c in 0..board[0].len() {
            if dfs(board, word.as_bytes(), r as i32, c as i32, 0) {
                return true;
            }
        }
    }
    false
}

// Palindrome Partitioning: chọn vị trí cắt tiếp theo, chỉ đi sâu nếu mảnh vừa cắt là palindrome.
fn partition(s: &str) -> Vec<Vec<String>> {
    fn is_palindrome(b: &[u8], mut lo: usize, mut hi: usize) -> bool {
        while lo < hi {
            if b[lo] != b[hi] {
                return false;
            }
            lo += 1;
            hi -= 1;
        }
        true
    }
    fn walk(s: &str, start: usize, path: &mut Vec<String>, result: &mut Vec<Vec<String>>) {
        if start == s.len() {
            result.push(path.clone());
            return;
        }
        for end in start..s.len() {
            if !is_palindrome(s.as_bytes(), start, end) {
                continue; // cắt nhánh sớm
            }
            path.push(s[start..=end].to_string());
            walk(s, end + 1, path, result);
            path.pop();
        }
    }
    let mut result = Vec::new();
    walk(s, 0, &mut Vec::new(), &mut result);
    result
}

// N-Queens: mỗi hàng một hậu; ba tập xung đột cho cột, chéo chính và chéo phụ.
fn solve_n_queens(n: usize, calls: &mut usize) -> Vec<Vec<String>> {
    struct State {
        n: usize,
        col_of: Vec<usize>,
        cols: HashSet<i32>,
        diag: HashSet<i32>, // chéo chính: r - c
        anti: HashSet<i32>, // chéo phụ: r + c
        result: Vec<Vec<String>>,
    }
    fn place(st: &mut State, r: usize, calls: &mut usize) {
        *calls += 1;
        let n = st.n;
        if r == n {
            let rows = st.col_of.iter().map(|&c| ".".repeat(c) + "Q" + &".".repeat(n - c - 1)).collect();
            st.result.push(rows);
            return;
        }
        for c in 0..n {
            let (ri, ci) = (r as i32, c as i32);
            if st.cols.contains(&ci) || st.diag.contains(&(ri - ci)) || st.anti.contains(&(ri + ci)) {
                continue;
            }
            st.cols.insert(ci);
            st.diag.insert(ri - ci);
            st.anti.insert(ri + ci);
            st.col_of.push(c);
            place(st, r + 1, calls);
            st.col_of.pop();
            st.cols.remove(&ci);
            st.diag.remove(&(ri - ci));
            st.anti.remove(&(ri + ci));
        }
    }
    let mut st = State { n, col_of: Vec::new(), cols: HashSet::new(), diag: HashSet::new(), anti: HashSet::new(), result: Vec::new() };
    place(&mut st, 0, calls);
    st.result
}

fn canon<T: std::fmt::Debug>(lists: &[Vec<T>]) -> Vec<String> {
    let mut parts: Vec<String> = lists.iter().map(|x| format!("{:?}", x)).collect();
    parts.sort();
    parts
}

fn grid(rows: &[&str]) -> Vec<Vec<u8>> {
    rows.iter().map(|r| r.as_bytes().to_vec()).collect()
}

fn strs(rows: &[&[&str]]) -> Vec<Vec<String>> {
    rows.iter().map(|r| r.iter().map(|s| s.to_string()).collect()).collect()
}

fn main() {
    let board = ["TOP", "ARE", "NED"];
    let mut sink = 0usize;
    let s = &mut sink;
    let six: HashSet<Vec<i32>> = permute(&[1, 2, 3, 4, 5, 6], s).into_iter().collect();
    let cases: Vec<(&str, bool)> = vec![
        ("permute [4,7,9]", canon(&permute(&[4, 7, 9], s)) == canon(&[vec![4, 7, 9], vec![4, 9, 7], vec![7, 4, 9], vec![7, 9, 4], vec![9, 4, 7], vec![9, 7, 4]])),
        ("permute [5]", canon(&permute(&[5], s)) == canon(&[vec![5]])),
        ("permute 6 số", six.len() == 720),
        ("exist TOP", exist(&mut grid(&board), "TOP")),
        ("exist TAN", exist(&mut grid(&board), "TAN")),
        ("exist PERE", exist(&mut grid(&board), "PERE")),
        ("exist ROPED", exist(&mut grid(&board), "ROPED")),
        ("exist TOT (không dùng lại ô)", !exist(&mut grid(&board), "TOT")),
        ("exist ARENA", !exist(&mut grid(&board), "ARENA")),
        ("exist NEED", !exist(&mut grid(&board), "NEED")),
        ("partition noon", canon(&partition("noon")) == canon(&strs(&[&["noon"], &["n", "oo", "n"], &["n", "o", "o", "n"]]))),
        ("partition abc", canon(&partition("abc")) == canon(&strs(&[&["a", "b", "c"]]))),
        ("partition aaa", canon(&partition("aaa")) == canon(&strs(&[&["aaa"], &["a", "aa"], &["aa", "a"], &["a", "a", "a"]]))),
        ("partition 8 chữ a", partition("aaaaaaaa").len() == 128),
        ("partition racecar", partition("racecar").len() == 4),
        ("nQueens 4", canon(&solve_n_queens(4, s)) == canon(&strs(&[&[".Q..", "...Q", "Q...", "..Q."], &["..Q.", "Q...", "...Q", ".Q.."]]))),
        ("nQueens 1", canon(&solve_n_queens(1, s)) == canon(&strs(&[&["Q"]]))),
        ("nQueens 3", solve_n_queens(3, s).is_empty()),
        ("nQueens 6", solve_n_queens(6, s).len() == 4),
    ];
    let ok = cases.iter().filter(|c| c.1).count();
    println!("{}/{} ca đúng", ok, cases.len());
    let fails: Vec<&str> = cases.iter().filter(|c| !c.1).map(|c| c.0).collect();
    if !fails.is_empty() {
        println!("sai ở: {}", fails.join("; "));
    }
    let mut permute_calls = 0;
    let perms = permute(&[1, 2, 3, 4, 5, 6, 7, 8], &mut permute_calls).len();
    let mut queen_calls = 0;
    let boards = solve_n_queens(8, &mut queen_calls).len();
    println!("Hoán vị 8 số: {} lần gọi, {} kết quả", permute_calls, perms);
    println!("8 hậu: {} lần gọi, {} lời giải", queen_calls, boards);
}
