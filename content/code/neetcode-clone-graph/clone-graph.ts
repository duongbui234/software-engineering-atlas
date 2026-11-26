// LC 133 Clone Graph: ba cách đúng (DFS đệ quy, BFS, DFS lặp) và bốn cách sai hay gặp.
// Chạy: node clone-graph.ts (Node 24 chạy thẳng file .ts)

class GraphNode {
  val: number;
  neighbors: GraphNode[];
  constructor(val: number, neighbors: GraphNode[] = []) {
    this.val = val;
    this.neighbors = neighbors;
  }
}

// ---------- Cách 1: DFS đệ quy với sổ "cũ → mới" ----------
function cloneDfs(node: GraphNode | null): GraphNode | null {
  if (node === null) return null;
  const copies = new Map<GraphNode, GraphNode>(); // nút gốc → bản sao của nó
  function visit(old: GraphNode): GraphNode {
    const seen = copies.get(old);
    if (seen !== undefined) return seen; // đã sao rồi: dùng lại, không sao lần hai
    const copy = new GraphNode(old.val);
    copies.set(old, copy); // ghi sổ TRƯỚC khi đi tiếp, để vòng quay lại thấy ngay
    for (const nb of old.neighbors) copy.neighbors.push(visit(nb));
    return copy;
  }
  return visit(node);
}

// ---------- Cách 2: BFS với sổ "cũ → mới" ----------
function cloneBfs(node: GraphNode | null): GraphNode | null {
  if (node === null) return null;
  const copies = new Map<GraphNode, GraphNode>([[node, new GraphNode(node.val)]]);
  const queue: GraphNode[] = [node];
  for (let head = 0; head < queue.length; head++) {
    const old = queue[head];
    const copy = copies.get(old)!;
    for (const nb of old.neighbors) {
      let nbCopy = copies.get(nb);
      if (nbCopy === undefined) {
        nbCopy = new GraphNode(nb.val);
        copies.set(nb, nbCopy); // tạo bản sao ngay lúc thấy lần đầu, rồi mới xếp hàng
        queue.push(nb);
      }
      copy.neighbors.push(nbCopy);
    }
  }
  return copies.get(node)!;
}

// ---------- Cách 3: DFS lặp với ngăn xếp ----------
function cloneDfsIterative(node: GraphNode | null): GraphNode | null {
  if (node === null) return null;
  const copies = new Map<GraphNode, GraphNode>([[node, new GraphNode(node.val)]]);
  const stack: GraphNode[] = [node];
  while (stack.length > 0) {
    const old = stack.pop()!;
    const copy = copies.get(old)!;
    for (const nb of old.neighbors) {
      let nbCopy = copies.get(nb);
      if (nbCopy === undefined) {
        nbCopy = new GraphNode(nb.val);
        copies.set(nb, nbCopy);
        stack.push(nb);
      }
      copy.neighbors.push(nbCopy);
    }
  }
  return copies.get(node)!;
}

// ---------- Sai 1: sao nông, mảng hàng xóm vẫn trỏ về nút gốc ----------
function wrongShallow(node: GraphNode | null): GraphNode | null {
  if (node === null) return null;
  return new GraphNode(node.val, node.neighbors); // nút mới, nhưng hàng xóm là nút CŨ
}

// ---------- Sai 2: đệ quy không có sổ, đi vòng mãi ----------
function wrongNoMap(node: GraphNode | null): GraphNode | null {
  if (node === null) return null;
  const copy = new GraphNode(node.val);
  for (const nb of node.neighbors) copy.neighbors.push(wrongNoMap(nb)!);
  return copy;
}

// ---------- Sai 3: có sổ nhưng ghi sổ SAU khi đi hết hàng xóm ----------
function wrongMapAfterRecurse(node: GraphNode | null): GraphNode | null {
  if (node === null) return null;
  const copies = new Map<GraphNode, GraphNode>();
  function visit(old: GraphNode): GraphNode {
    const seen = copies.get(old);
    if (seen !== undefined) return seen;
    const copy = new GraphNode(old.val);
    for (const nb of old.neighbors) copy.neighbors.push(visit(nb));
    copies.set(old, copy); // quá muộn: nút 2 quay lại nút 1 khi nút 1 chưa có trong sổ
    return copy;
  }
  return visit(node);
}

// ---------- Sai 4: chỉ nhớ "đã thăm", không nhớ bản sao là ai ----------
let createdBySetOnly = 0;
function wrongSetOnly(node: GraphNode | null): GraphNode | null {
  if (node === null) return null;
  const visited = new Set<GraphNode>();
  function visit(old: GraphNode): GraphNode {
    visited.add(old);
    const copy = new GraphNode(old.val);
    createdBySetOnly++;
    for (const nb of old.neighbors) {
      if (visited.has(nb)) {
        copy.neighbors.push(new GraphNode(nb.val)); // không biết bản sao cũ nằm đâu, đành tạo nút mới
        createdBySetOnly++;
      } else {
        copy.neighbors.push(visit(nb));
      }
    }
    return copy;
  }
  return visit(node);
}

// ---------- Dựng đồ thị và kiểm tra ----------
// adj[i] là danh sách hàng xóm của nút có giá trị i + 1 (đúng quy ước của đề).
function build(adj: number[][]): GraphNode | null {
  if (adj.length === 0) return null;
  const nodes = adj.map((_, i) => new GraphNode(i + 1));
  adj.forEach((nbs, i) => { nodes[i].neighbors = nbs.map((v) => nodes[v - 1]); });
  return nodes[0];
}

// Đi hết đồ thị từ start, trả về danh sách mọi nút (mỗi đối tượng một lần).
function collect(start: GraphNode | null): GraphNode[] {
  if (start === null) return [];
  const seen = new Set<GraphNode>([start]);
  const order: GraphNode[] = [start];
  for (let h = 0; h < order.length; h++) {
    for (const nb of order[h].neighbors) {
      if (!seen.has(nb)) { seen.add(nb); order.push(nb); }
    }
  }
  return order;
}

// Kiểm tra bản sao: rỗng đúng lúc, không chung nút nào với bản gốc,
// mỗi giá trị đúng một đối tượng, và danh sách kề giống hệt đầu vào.
function check(adj: number[][], original: GraphNode | null, copy: GraphNode | null): string | null {
  if (adj.length === 0) return copy === null ? null : "đồ thị rỗng nhưng không trả null";
  if (copy === null) return "trả null";
  const oldNodes = new Set(collect(original));
  const nodes = collect(copy);
  const byVal = new Map<number, GraphNode>();
  for (const n of nodes) {
    if (oldNodes.has(n)) return "dùng chung nút với bản gốc";
    if (byVal.has(n.val)) return `nút ${n.val} bị sao ${nodes.filter((x) => x.val === n.val).length} lần`;
    byVal.set(n.val, n);
  }
  if (nodes.length !== adj.length) return `có ${nodes.length} nút, cần ${adj.length}`;
  for (let i = 0; i < adj.length; i++) {
    const got = byVal.get(i + 1)!.neighbors.map((x) => x.val).join(",");
    if (got !== adj[i].join(",")) return `hàng xóm của ${i + 1} là [${got}], cần [${adj[i].join(",")}]`;
  }
  // bản gốc phải còn nguyên
  const origVals = collect(original).sort((a, b) => a.val - b.val).map((n) => n.neighbors.map((x) => x.val).join(","));
  if (origVals.join("|") !== adj.map((r) => r.join(",")).join("|")) return "làm hỏng đồ thị gốc";
  return null;
}

// Bộ sinh số giả ngẫu nhiên cố định (mulberry32) để năm ngôn ngữ dựng cùng đồ thị.
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Đồ thị liên thông ngẫu nhiên: một cây khung rồi thêm cạnh, không cạnh lặp, không khuyên.
function randomGraph(n: number, extra: number, rnd: () => number): number[][] {
  const adj: number[][] = Array.from({ length: n }, () => []);
  const has = new Set<string>();
  const add = (a: number, b: number) => {
    if (a === b || has.has(`${a},${b}`)) return;
    has.add(`${a},${b}`); has.add(`${b},${a}`);
    adj[a].push(b + 1); adj[b].push(a + 1);
  };
  for (let i = 1; i < n; i++) add(i, Math.floor(rnd() * i));
  for (let k = 0; k < extra; k++) add(Math.floor(rnd() * n), Math.floor(rnd() * n));
  return adj;
}

function chain(n: number): number[][] {
  return Array.from({ length: n }, (_, i) => [i > 0 ? i : 0, i < n - 1 ? i + 2 : 0].filter((v) => v > 0));
}

function complete(n: number): number[][] {
  return Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => j + 1).filter((v) => v !== i + 1));
}

const CASES: [string, number[][]][] = [
  ["đồ thị rỗng", []],
  ["một nút, không cạnh", [[]]],
  ["hai nút nối nhau", [[2], [1]]],
  ["tam giác 1-2-3", [[2, 3], [1, 3], [1, 2]]],
  ["vuông 1-2-3-4 có đường chéo 1-3", [[2, 3, 4], [1, 3], [1, 2, 4], [1, 3]]],
  ["ngôi sao: 1 nối 2..6", [[2, 3, 4, 5, 6], [1], [1], [1], [1], [1]]],
  ["đường thẳng 5 nút", chain(5)],
  ["đồ thị đầy đủ 6 nút", complete(6)],
  ["đường thẳng 100 nút", chain(100)],
  ["ngẫu nhiên 100 nút, seed 42", randomGraph(100, 200, mulberry32(42))],
];

type Fn = (n: GraphNode | null) => GraphNode | null;
const FNS: [string, Fn][] = [
  ["cloneDfs", cloneDfs],
  ["cloneBfs", cloneBfs],
  ["cloneDfsIterative", cloneDfsIterative],
  ["wrongShallow", wrongShallow],
  ["wrongNoMap", wrongNoMap],
  ["wrongMapAfterRecurse", wrongMapAfterRecurse],
  ["wrongSetOnly", wrongSetOnly],
];

let allOk = true;
for (const [name, fn] of FNS) {
  let ok = 0;
  const fails: string[] = [];
  for (const [label, adj] of CASES) {
    const g = build(adj);
    let err: string | null;
    try {
      err = check(adj, g, fn(g));
    } catch (e) {
      err = `ném ${(e as Error).constructor.name}`;
    }
    if (err === null) ok++;
    else fails.push(`${label} → ${err}`);
  }
  if (!name.startsWith("wrong") && ok !== CASES.length) allOk = false;
  const shown = fails.slice(0, 2).join(", ") + (fails.length > 2 ? ` và ${fails.length - 2} ca khác` : "");
  console.log(`${name.padEnd(21)}${ok}/${CASES.length} ca đúng${fails.length ? "; sai ở " + shown : ""}`);
}

// Kiểm chéo: 500 đồ thị ngẫu nhiên, ba cách đúng đều phải qua.
{
  const rnd = mulberry32(7);
  let agree = 0;
  for (let t = 0; t < 500; t++) {
    const n = 1 + Math.floor(rnd() * 100);
    const adj = randomGraph(n, Math.floor(rnd() * 3 * n), rnd);
    const g = build(adj);
    if (check(adj, g, cloneDfs(g)) === null && check(adj, g, cloneBfs(g)) === null && check(adj, g, cloneDfsIterative(g)) === null) agree++;
  }
  console.log(`500 đồ thị ngẫu nhiên: cả ba cách đúng qua ${agree}/500`);
}

// Sai 4 tạo bao nhiêu nút trên đồ thị đầy đủ 6 nút?
createdBySetOnly = 0;
wrongSetOnly(build(complete(6)));
console.log(`wrongSetOnly trên đồ thị đầy đủ 6 nút: tạo ${createdBySetOnly} nút thay vì 6`);

// Vượt giới hạn đề: đường thẳng 100 000 nút.
{
  const adj = chain(100_000);
  const g = build(adj);
  for (const [name, fn] of FNS.slice(0, 3)) {
    let msg: string;
    try {
      const t0 = performance.now();
      const c = fn(g);
      const ms = performance.now() - t0;
      msg = (check(adj, g, c) === null ? "đúng" : "sai") + `, ${ms.toFixed(1)} ms`;
    } catch (e) {
      msg = `ném ${(e as Error).constructor.name}`;
    }
    console.log(`đường thẳng 100 000 nút, ${name}: ${msg}`);
  }
}

console.log(allOk ? "clone-graph: các cách đúng đều qua" : "clone-graph: CÓ CÁCH ĐÚNG BỊ SAI");
