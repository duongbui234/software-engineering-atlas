type Ticket = [string, string];

function explore(tickets: Ticket[]): [number, string[]] {
  let probes = 0;
  const used = Array<boolean>(tickets.length).fill(false);
  const route = ["JFK"];
  const edges = tickets.map(([_from, to], i) => [to, i] as const).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0);

  function search(): boolean {
    if (route.length === tickets.length + 1) return true;
    const current = route.at(-1)!;
    for (const [to, i] of edges) {
      if (used[i] || tickets[i][0] !== current) continue;
      probes++;
      used[i] = true;
      route.push(to);
      if (search()) return true;
      route.pop();
      used[i] = false;
    }
    return false;
  }

  if (!search()) throw new Error("Không tìm thấy hành trình");
  return [probes, route];
}

const tickets: Ticket[] = [["JFK", "AAA"], ["JFK", "BBB"], ["BBB", "JFK"]];
for (const airport of ["CAA", "CBB", "CCC", "CDD", "CEE", "CFF"]) {
  tickets.push(["AAA", airport], [airport, "AAA"]);
}
const [attempts, route] = explore(tickets);
if (route.slice(0, 4).join(" ") !== "JFK BBB JFK AAA" || route.length !== tickets.length + 1) {
  throw new Error("Sai hành trình");
}
console.log(`Quay lui thử ${attempts} vé, Hierholzer lấy ${tickets.length} vé`);

const n = 1000;
const pairs = n * (n - 1) / 2;
if (pairs !== 499500) throw new Error("Sai số cặp");
console.log(`Với n=${n}: Kruskal lưu ${pairs} cạnh, Prim lưu ${n} khóa best`);
console.log("2/2 ca đúng");
