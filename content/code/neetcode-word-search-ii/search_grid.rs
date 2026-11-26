use std::collections::HashMap;

#[derive(Default)]
struct TrieNode<'a> {
    children: HashMap<u8, TrieNode<'a>>,
    word: Option<&'a str>,
}

fn find_words<'a>(board: &mut [Vec<u8>], words: &[&'a str]) -> Vec<&'a str> {
    let mut root = TrieNode::default();
    for &word in words {
        let mut node = &mut root;
        for letter in word.bytes() {
            node = node.children.entry(letter).or_default();
        }
        node.word = Some(word);
    }

    let mut found = Vec::new();
    for row in 0..board.len() {
        for col in 0..board[row].len() {
            visit(board, &mut root, row as isize, col as isize, &mut found);
        }
    }
    found
}

fn visit<'a>(
    board: &mut [Vec<u8>],
    parent: &mut TrieNode<'a>,
    row: isize,
    col: isize,
    found: &mut Vec<&'a str>,
) {
    if row < 0 || col < 0 {
        return;
    }
    let Some(&letter) = board
        .get(row as usize)
        .and_then(|letters| letters.get(col as usize))
    else {
        return;
    };
    let Some(node) = parent.children.get_mut(&letter) else {
        return;
    };

    if let Some(word) = node.word.take() {
        found.push(word);
    }

    if !node.children.is_empty() {
        board[row as usize][col as usize] = b'#';
        visit(board, node, row - 1, col, found);
        visit(board, node, row + 1, col, found);
        visit(board, node, row, col - 1, found);
        visit(board, node, row, col + 1, found);
        board[row as usize][col as usize] = letter;
    }

    if node.children.is_empty() {
        parent.children.remove(&letter);
    }
}

fn main() {
    let cases: &[(&[&str], &[&str], &[&str])] = &[
        (
            &["oaan", "etae", "ihkr", "iflv"],
            &["oath", "pea", "eat", "rain"],
            &["eat", "oath"],
        ),
        (
            &["car", "tpx", "xex"],
            &["cap", "cape", "car", "cart", "capa", "cat"],
            &["cap", "cape", "car"],
        ),
        (
            &["ab", "ba"],
            &["a", "ab", "aba", "abab", "ababa", "aa"],
            &["a", "ab", "aba", "abab"],
        ),
        (&["a"], &["a", "aa", "b"], &["a"]),
        (&["ab"], &["z", "aa"], &[]),
    ];
    for (i, &(rows, words, expected)) in cases.iter().enumerate() {
        let mut board: Vec<_> = rows.iter().map(|row| row.as_bytes().to_vec()).collect();
        let mut actual = find_words(&mut board, words);
        actual.sort_unstable();
        assert_eq!(actual, expected, "case {i}");
        assert!(board
            .iter()
            .zip(rows)
            .all(|(actual, original)| actual == original.as_bytes()));
    }
    println!("{0}/{0} ca đúng", cases.len());
}
