use std::collections::VecDeque;

type Tree = Option<Box<TreeNode>>;

#[derive(PartialEq, Eq, Debug)]
struct TreeNode {
    value: i32,
    left: Tree,
    right: Tree,
}

fn add_children<T>(pending: &mut VecDeque<T>, left: T, right: T, by_level: bool) {
    if by_level {
        pending.push_back(left);
        pending.push_back(right);
    } else {
        pending.push_back(right);
        pending.push_back(left);
    }
}

fn serialize(root: &Tree, by_level: bool) -> String {
    let mut pending = VecDeque::from([root]);
    let mut tokens = Vec::new();
    while let Some(slot) = if by_level {
        pending.pop_front()
    } else {
        pending.pop_back()
    } {
        if let Some(node) = slot {
            tokens.push(node.value.to_string());
            add_children(&mut pending, &node.left, &node.right, by_level);
        } else {
            tokens.push("#".to_owned());
        }
    }
    tokens.join(",")
}

fn deserialize(wire: &str, by_level: bool) -> Result<Tree, &'static str> {
    let mut root: Tree = None;
    let mut pending = VecDeque::from([&mut root]);

    for token in wire.split(',') {
        let slot = if by_level {
            pending.pop_front()
        } else {
            pending.pop_back()
        }
        .ok_or("extra token")?;
        if token == "#" {
            continue;
        }

        let value = token.parse::<i32>().map_err(|_| "invalid token")?;
        if !(-1000..=1000).contains(&value) || value.to_string() != token {
            return Err("invalid token");
        }
        let node = slot.insert(Box::new(TreeNode {
            value,
            left: None,
            right: None,
        }));
        add_children(&mut pending, &mut node.left, &mut node.right, by_level);
    }

    if !pending.is_empty() {
        return Err("missing token");
    }
    Ok(root)
}

fn tree(value: i32, left: Tree, right: Tree) -> Tree {
    Some(Box::new(TreeNode { value, left, right }))
}

fn main() {
    let examples = [
        (None, "#", "#"),
        (tree(0, None, None), "0,#,#", "0,#,#"),
        (tree(5, tree(5, None, None), None), "5,5,#,#,#", "5,5,#,#,#"),
        (tree(5, None, tree(5, None, None)), "5,#,5,#,#", "5,#,5,#,#"),
        (
            tree(
                8,
                tree(-4, None, tree(0, None, None)),
                tree(8, tree(-1000, None, None), tree(1000, None, None)),
            ),
            "8,-4,#,0,#,#,8,-1000,#,#,1000,#,#",
            "8,-4,8,#,0,-1000,1000,#,#,#,#,#,#",
        ),
    ];
    let invalid = ["", "1,#", "#,", "1x,#,#", "1001,#,#"];

    for by_level in [false, true] {
        for (tree, preorder, level) in &examples {
            let wire = if by_level { *level } else { *preorder };
            assert_eq!(serialize(tree, by_level), wire);
            assert_eq!(&deserialize(wire, by_level).unwrap(), tree);
        }
        for left in [false, true] {
            let mut chain = None;
            for i in (0..10_000).rev() {
                let value = i % 11 - 5;
                chain = if left {
                    tree(value, chain, None)
                } else {
                    tree(value, None, chain)
                };
            }
            let wire = serialize(&chain, by_level);
            assert_eq!(wire.split(',').count(), 20_001);
            let restored = deserialize(&wire, by_level).unwrap();
            let mut current = restored.as_deref();
            for i in 0..10_000 {
                let node = current.unwrap();
                assert_eq!(node.value, i % 11 - 5);
                current = if left {
                    assert!(node.right.is_none());
                    node.left.as_deref()
                } else {
                    assert!(node.left.is_none());
                    node.right.as_deref()
                };
            }
            assert!(current.is_none());
        }
        for wire in invalid {
            assert!(deserialize(wire, by_level).is_err());
        }
    }

    println!("{}/12 ca đúng", examples.len() + 2 + invalid.len());
}
