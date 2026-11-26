use std::collections::HashMap;

#[derive(Default)]
struct TrieNode {
    children: HashMap<u8, TrieNode>,
    terminal: bool,
}

#[derive(Default)]
struct WordDictionary {
    root: TrieNode,
}

impl WordDictionary {
    fn add_word(&mut self, word: &str) {
        let mut node = &mut self.root;
        for letter in word.bytes() {
            node = node.children.entry(letter).or_default();
        }
        node.terminal = true;
    }

    fn search(&self, pattern: &str) -> bool {
        Self::matches(&self.root, pattern.as_bytes())
    }

    fn matches(node: &TrieNode, pattern: &[u8]) -> bool {
        let Some((&letter, rest)) = pattern.split_first() else {
            return node.terminal;
        };
        if letter == b'.' {
            return node
                .children
                .values()
                .any(|child| Self::matches(child, rest));
        }
        node.children
            .get(&letter)
            .is_some_and(|child| Self::matches(child, rest))
    }
}

fn main() {
    let mut dictionary = WordDictionary::default();
    assert!(!dictionary.search("."));
    for word in ["bad", "dad", "mad", "bad", "cap", "cape", &"a".repeat(25)] {
        dictionary.add_word(word);
    }
    let cases = [
        ("pad", false),
        ("bad", true),
        (".ad", true),
        ("b..", true),
        ("..z", false),
        (".", false),
        ("ca", false),
        ("ca.", true),
        ("ca..", true),
        ("ca..e", false),
        (&format!("{}.", "a".repeat(24)), true),
    ];
    for (pattern, expected) in cases {
        assert_eq!(dictionary.search(pattern), expected, "{pattern}");
    }
    println!("{0}/{0} ca đúng", cases.len() + 1);
}
