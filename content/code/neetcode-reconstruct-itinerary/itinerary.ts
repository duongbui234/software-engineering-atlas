function findItinerary(tickets: [string, string][]): string[] {
  const outgoing = new Map<string, string[]>();
  for (const [from, to] of tickets) {
    const list = outgoing.get(from) ?? [];
    list.push(to);
    outgoing.set(from, list);
  }
  for (const list of outgoing.values()) list.sort().reverse();

  const stack = ["JFK"];
  const suffix = [];
  while (stack.length) {
    const list = outgoing.get(stack.at(-1)!);
    if (list?.length) stack.push(list.pop()!);
    else suffix.push(stack.pop()!);
  }
  return suffix.reverse();
}

// TESTS
const cases: [[string, string][], string[]][] = [
  [[["BBB", "CCC"], ["JFK", "AAA"], ["AAA", "BBB"]], ["JFK", "AAA", "BBB", "CCC"]],
  [[["JFK", "AAA"], ["JFK", "BBB"], ["BBB", "JFK"]], ["JFK", "BBB", "JFK", "AAA"]],
  [[["JFK", "AAA"], ["JFK", "AAA"], ["AAA", "JFK"]], ["JFK", "AAA", "JFK", "AAA"]],
  [[["JFK", "BBB"], ["BBB", "JFK"], ["JFK", "AAA"], ["AAA", "JFK"]], ["JFK", "AAA", "JFK", "BBB", "JFK"]],
  [[["JFK", "AAA"], ["AAA", "CCC"], ["CCC", "JFK"], ["AAA", "BBB"], ["BBB", "AAA"]], ["JFK", "AAA", "BBB", "AAA", "CCC", "JFK"]],
];
for (const [tickets, expected] of cases) {
  if (findItinerary(tickets).join(",") !== expected.join(",")) throw new Error("Sai hành trình");
}
console.log(`${cases.length}/${cases.length} ca đúng`);
