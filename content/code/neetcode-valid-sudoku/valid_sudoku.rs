// LeetCode 36, Valid Sudoku: ba cách và test.
// Chạy: rustc --edition 2021 -O valid_sudoku.rs && ./valid_sudoku
use std::collections::HashSet;

// Cách 1, ba lượt: kiểm hàng, cột, từng ô 3×3.
fn three_pass(board: &[Vec<char>]) -> bool {
    fn unique(cells: impl Iterator<Item = char>) -> bool {
        let mut seen = HashSet::new();
        cells.filter(|&d| d != '.').all(|d| seen.insert(d))
    }
    (0..9).all(|i| {
        let (br, bc) = (i / 3 * 3, i % 3 * 3);
        unique(board[i].iter().copied())
            && unique(board.iter().map(|row| row[i]))
            && unique((0..9).map(|k| board[br + k / 3][bc + k % 3]))
    })
}

// Cách 2, một lượt với 27 HashSet. vec![HashSet::new(); 9] CLONE từng ô, không dùng chung.
fn one_pass(board: &[Vec<char>]) -> bool {
    let mut rows = vec![HashSet::new(); 9];
    let mut cols = vec![HashSet::new(); 9];
    let mut boxes = vec![HashSet::new(); 9];
    for r in 0..9 {
        for c in 0..9 {
            let d = board[r][c];
            if d == '.' {
                continue;
            }
            let b = r / 3 * 3 + c / 3;
            // insert trả false nếu đã có: kiểm và ghi trong một lần
            if !rows[r].insert(d) || !cols[c].insert(d) || !boxes[b].insert(d) {
                return false;
            }
        }
    }
    true
}

// Cách 3, bitmask 9 bit. Trong Rust, & đứng TRƯỚC != nên "x & bit != 0" đúng nghĩa.
fn bitmask(board: &[Vec<char>]) -> bool {
    let (mut rows, mut cols, mut boxes) = ([0u16; 9], [0u16; 9], [0u16; 9]);
    for r in 0..9 {
        for c in 0..9 {
            let d = board[r][c];
            if d == '.' {
                continue;
            }
            let bit = 1u16 << (d as u8 - b'1'); // char → u8: '1' là 49
            let b = r / 3 * 3 + c / 3;
            if (rows[r] | cols[c] | boxes[b]) & bit != 0 {
                return false;
            }
            rows[r] |= bit;
            cols[c] |= bit;
            boxes[b] |= bit;
        }
    }
    true
}

// Bản sai: chỉ số ô 3×3 thiếu nhân 3.
fn wrong_box_index(board: &[Vec<char>]) -> bool {
    let mut seen = HashSet::new();
    for r in 0..9 {
        for c in 0..9 {
            let d = board[r][c];
            if d == '.' {
                continue;
            }
            let b = r / 3 + c / 3;
            for k in [('r', r, d), ('c', c, d), ('b', b, d)] {
                if !seen.insert(k) {
                    return false;
                }
            }
        }
    }
    true
}

fn parse(rows: &[&str]) -> Vec<Vec<char>> {
    rows.iter().map(|r| r.chars().collect()).collect()
}

fn main() {
    let example = parse(&["53..7....", "6..195...", ".98....6.", "8...6...3", "4..8.3..1", "7...2...6", ".6....28.", "...419..5", "....8..79"]);
    let with_change = |r: usize, c: usize, d: char| {
        let mut b = example.clone();
        b[r][c] = d;
        b
    };
    let cases: Vec<(&str, Vec<Vec<char>>, bool)> = vec![
        ("ví dụ hợp lệ", example.clone(), true),
        ("8 ở góc (trùng cột và ô 3×3)", with_change(0, 0, '8'), false),
        ("trùng hàng 0", with_change(0, 8, '5'), false),
        ("trùng chỉ trong ô 3×3", with_change(1, 1, '8'), false),
        ("bảng trống", parse(&["........."; 9]), true),
        ("hai số 1 ở hai ô khác nhau", parse(&["...1.....", ".........", ".........", "1........", ".........", ".........", ".........", ".........", "........."]), true),
    ];
    let fns: [(&str, fn(&[Vec<char>]) -> bool); 4] = [
        ("threePass", three_pass),
        ("onePass", one_pass),
        ("bitmask", bitmask),
        ("wrongBoxIndex", wrong_box_index),
    ];
    for (name, f) in fns.iter() {
        let bad: Vec<&str> = cases.iter().filter(|(_, b, w)| f(b) != *w).map(|(n, _, _)| *n).collect();
        let tail = if bad.is_empty() { String::new() } else { format!("; sai ở: {}", bad.join(", ")) };
        println!("{:<14} {}/{} ca đúng{}", name, cases.len() - bad.len(), cases.len(), tail);
    }
}
