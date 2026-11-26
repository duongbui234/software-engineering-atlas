use std::collections::HashMap;

fn find_itinerary<'a>(tickets: &[(&'a str, &'a str)]) -> Vec<&'a str> {
    let mut outgoing: HashMap<&str, Vec<&str>> = HashMap::new();
    for &(from, to) in tickets {
        outgoing.entry(from).or_default().push(to);
    }
    for destinations in outgoing.values_mut() {
        destinations.sort_unstable_by(|a, b| b.cmp(a));
    }

    let mut stack = vec!["JFK"];
    let mut suffix = Vec::with_capacity(tickets.len() + 1);
    while let Some(&current) = stack.last() {
        if let Some(next) = outgoing.get_mut(current).and_then(Vec::pop) {
            stack.push(next);
        } else {
            suffix.push(stack.pop().unwrap());
        }
    }
    suffix.reverse();
    suffix
}

// TESTS
fn main() {
    let cases: &[(&[(&str, &str)], &str)] = &[
        (
            &[("BBB", "CCC"), ("JFK", "AAA"), ("AAA", "BBB")],
            "JFK AAA BBB CCC",
        ),
        (
            &[("JFK", "AAA"), ("JFK", "BBB"), ("BBB", "JFK")],
            "JFK BBB JFK AAA",
        ),
        (
            &[("JFK", "AAA"), ("JFK", "AAA"), ("AAA", "JFK")],
            "JFK AAA JFK AAA",
        ),
        (
            &[
                ("JFK", "BBB"),
                ("BBB", "JFK"),
                ("JFK", "AAA"),
                ("AAA", "JFK"),
            ],
            "JFK AAA JFK BBB JFK",
        ),
        (
            &[
                ("JFK", "AAA"),
                ("AAA", "CCC"),
                ("CCC", "JFK"),
                ("AAA", "BBB"),
                ("BBB", "AAA"),
            ],
            "JFK AAA BBB AAA CCC JFK",
        ),
    ];
    for &(tickets, expected) in cases {
        assert_eq!(find_itinerary(tickets).join(" "), expected);
    }
    println!("{0}/{0} ca đúng", cases.len());
}
