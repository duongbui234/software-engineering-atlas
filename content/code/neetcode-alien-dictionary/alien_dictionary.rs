fn alien_order(words: &[&str]) -> String {
    let index = |b: u8| usize::from(b - b'a');
    let (mut present, mut indegree, mut edges) = ([false; 26], [0; 26], [[false; 26]; 26]);
    for word in words {
        for b in word.bytes() {
            present[index(b)] = true;
        }
    }
    for pair in words.windows(2) {
        let (a, b) = (pair[0], pair[1]);
        if let Some((u, v)) = a.bytes().zip(b.bytes()).find(|(u, v)| u != v) {
            let (u, v) = (index(u), index(v));
            if !edges[u][v] {
                edges[u][v] = true;
                indegree[v] += 1;
            }
        } else if a.len() > b.len() {
            return String::new();
        }
    }
    let mut queue: Vec<_> = (0..26)
        .filter(|&i| present[i] && indegree[i] == 0)
        .collect();
    let mut head = 0;
    while head < queue.len() {
        let u = queue[head];
        head += 1;
        for (v, degree) in indegree.iter_mut().enumerate() {
            if edges[u][v] {
                *degree -= 1;
                if *degree == 0 {
                    queue.push(v);
                }
            }
        }
    }
    if queue.len() != present.iter().filter(|&&found| found).count() {
        return String::new();
    }
    queue
        .into_iter()
        .map(|i| char::from(b'a' + i as u8))
        .collect()
}

fn main() {
    let cases: &[(&[&str], &str)] = &[
        (&["wrt", "wrf", "er", "ett", "rftt"], "wertf"),
        (&["z", "x", "z"], ""),
        (&["abc", "ab"], ""),
        (&["ab", "ab", "ac"], "abc"),
        (&["z"], "z"),
    ];
    for &(words, expected) in cases {
        assert_eq!(alien_order(words), expected);
    }
    println!("{0}/{0} ca đúng", cases.len());
}
