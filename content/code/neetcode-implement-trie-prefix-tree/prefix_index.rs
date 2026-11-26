use std::collections::HashMap;

#[derive(Default)]
struct Trie {
    children: HashMap<u8, Trie>,
    terminal: bool,
}

impl Trie {
    fn insert(&mut self, word: &str) {
        let mut node = self;
        for letter in word.bytes() {
            node = node.children.entry(letter).or_default();
        }
        node.terminal = true;
    }

    fn find(&self, text: &str) -> Option<&Trie> {
        let mut node = self;
        for letter in text.bytes() {
            node = node.children.get(&letter)?;
        }
        Some(node)
    }

    fn search(&self, word: &str) -> bool {
        self.find(word).is_some_and(|node| node.terminal)
    }

    fn starts_with(&self, prefix: &str) -> bool {
        self.find(prefix).is_some()
    }
}

fn main() {
    let mut trie = Trie::default();
    let long = "a".repeat(2000);
    enum Operation {
        Insert,
        Search(bool),
        Prefix(bool),
    }
    use Operation::{Insert, Prefix, Search};
    let cases = [
        (Prefix(false), "c"),
        (Insert, "cart"),
        (Prefix(true), "car"),
        (Search(false), "car"),
        (Search(true), "cart"),
        (Insert, "car"),
        (Insert, "car"),
        (Insert, "cab"),
        (Search(true), "car"),
        (Search(true), "cab"),
        (Search(false), "cad"),
        (Insert, &long),
        (Prefix(true), &long[..1999]),
        (Search(false), &long[..1999]),
        (Search(true), &long),
    ];
    let total = cases.len();
    for (operation, input) in cases {
        match operation {
            Insert => trie.insert(input),
            Search(expected) => assert_eq!(trie.search(input), expected),
            Prefix(expected) => assert_eq!(trie.starts_with(input), expected),
        }
    }
    println!("{total}/{total} ca đúng");
}
