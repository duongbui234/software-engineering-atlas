def find_itinerary(tickets):
    outgoing = {}
    for start, end in tickets:
        outgoing.setdefault(start, []).append(end)
    for destinations in outgoing.values():
        destinations.sort(reverse=True)

    stack = ["JFK"]
    suffix = []
    while stack:
        destinations = outgoing.get(stack[-1])
        if destinations:
            stack.append(destinations.pop())
        else:
            suffix.append(stack.pop())
    return suffix[::-1]


# TESTS
cases = [
    ([("BBB", "CCC"), ("JFK", "AAA"), ("AAA", "BBB")], "JFK AAA BBB CCC"),
    ([("JFK", "AAA"), ("JFK", "BBB"), ("BBB", "JFK")], "JFK BBB JFK AAA"),
    ([("JFK", "AAA"), ("JFK", "AAA"), ("AAA", "JFK")], "JFK AAA JFK AAA"),
    ([("JFK", "BBB"), ("BBB", "JFK"), ("JFK", "AAA"), ("AAA", "JFK")], "JFK AAA JFK BBB JFK"),
    ([("JFK", "AAA"), ("AAA", "CCC"), ("CCC", "JFK"), ("AAA", "BBB"), ("BBB", "AAA")], "JFK AAA BBB AAA CCC JFK"),
]
for tickets, expected in cases:
    assert find_itinerary(tickets) == expected.split()
print(f"{len(cases)}/{len(cases)} ca đúng")
