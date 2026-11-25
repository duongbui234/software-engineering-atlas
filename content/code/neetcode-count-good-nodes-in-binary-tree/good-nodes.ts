// LeetCode 1448 Count Good Nodes in Binary Tree.
// Một nút là "tốt" nếu trên đường từ gốc xuống nó không có nút nào lớn hơn nó.
// Các cách: vét cạn leo ngược về gốc, DFS mang max đường đi xuống (đệ quy và lặp), BFS mang max, và các bản sai hay gặp.
// Chạy: node good-nodes.ts

class TreeNode {
  val: number;
  left: TreeNode | null = null;
  right: TreeNode | null = null;
  constructor(val: number) { this.val = val; }
}

// Dựng cây từ mảng theo tầng kiểu LeetCode, null là chỗ trống.
function build(arr: (number | null)[]): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]);
  const queue: TreeNode[] = [root];
  let head = 0, i = 1;
  while (i < arr.length) {
    const node = queue[head++];
    for (const side of ["left", "right"] as const) {
      if (i < arr.length && arr[i] !== null) {
        node[side] = new TreeNode(arr[i] as number);
        queue.push(node[side]!);
      }
      i++;
    }
  }
  return root;
}

// Chuỗi n nút, giá trị nút thứ i là valueAt(i), mọi nút chỉ có con một phía.
function chain(n: number, valueAt: (i: number) => number, side: "left" | "right"): TreeNode {
  const root = new TreeNode(valueAt(0));
  let cur = root;
  for (let i = 1; i < n; i++) { cur[side] = new TreeNode(valueAt(i)); cur = cur[side]!; }
  return root;
}

// ---------- Cách 1: vét cạn, mỗi nút leo ngược lên gốc. O(n·h). ----------
let compares = 0;
function goodBrute(root: TreeNode | null): number {
  if (root === null) return 0;
  const parent = new Map<TreeNode, TreeNode | null>([[root, null]]);
  const order: TreeNode[] = [root];
  for (let i = 0; i < order.length; i++) {
    const node = order[i];
    for (const child of [node.left, node.right]) {
      if (child !== null) { parent.set(child, node); order.push(child); }
    }
  }
  let good = 0;
  for (const node of order) {
    let ok = true;
    for (let a = parent.get(node) ?? null; a !== null; a = parent.get(a) ?? null) {
      compares++;
      if (a.val > node.val) { ok = false; break; }
    }
    if (ok) good++;
  }
  return good;
}

// ---------- Cách 2: DFS tiền thứ tự, mang max của đường đi xuống. O(n), O(h). ----------
function goodDfs(root: TreeNode | null): number {
  const go = (node: TreeNode | null, maxSoFar: number): number => {
    if (node === null) return 0;
    const good = node.val >= maxSoFar ? 1 : 0;   // bằng max vẫn là tốt
    const m = Math.max(maxSoFar, node.val);
    return good + go(node.left, m) + go(node.right, m);
  };
  return go(root, -Infinity);
}

// ---------- Cách 3: DFS lặp, ngăn xếp giữ cặp (nút, max tới nút đó). ----------
function goodIterative(root: TreeNode | null): number {
  if (root === null) return 0;
  let good = 0;
  const stack: [TreeNode, number][] = [[root, root.val]];
  while (stack.length > 0) {
    const [node, maxSoFar] = stack.pop()!;
    if (node.val >= maxSoFar) good++;
    const m = Math.max(maxSoFar, node.val);
    if (node.right !== null) stack.push([node.right, m]);
    if (node.left !== null) stack.push([node.left, m]);
  }
  return good;
}

// ---------- Cách 4: BFS theo tầng, hàng đợi giữ cặp (nút, max). Lấy ra bằng chỉ số head, không dùng shift(). ----------
function goodBfs(root: TreeNode | null): number {
  if (root === null) return 0;
  let good = 0;
  const queue: [TreeNode, number][] = [[root, root.val]];
  for (let head = 0; head < queue.length; head++) {
    const [node, maxSoFar] = queue[head];
    if (node.val >= maxSoFar) good++;
    const m = Math.max(maxSoFar, node.val);
    if (node.left !== null) queue.push([node.left, m]);
    if (node.right !== null) queue.push([node.right, m]);
  }
  return good;
}

// BFS giống hệt nhưng lấy ra bằng queue.shift(): đúng, nhưng shift() dời cả mảng.
function goodBfsShift(root: TreeNode | null): number {
  if (root === null) return 0;
  let good = 0;
  const queue: [TreeNode, number][] = [[root, root.val]];
  while (queue.length > 0) {
    const [node, maxSoFar] = queue.shift()!;
    if (node.val >= maxSoFar) good++;
    const m = Math.max(maxSoFar, node.val);
    if (node.left !== null) queue.push([node.left, m]);
    if (node.right !== null) queue.push([node.right, m]);
  }
  return good;
}

// ---------- Các bản sai ----------
// Sai 1: so ngặt. Nút bằng max của đường đi cũng là nút tốt.
function wrongStrict(root: TreeNode | null): number {
  if (root === null) return 0;
  let good = 1;                                   // gốc luôn tốt
  const stack: [TreeNode, number][] = [];
  if (root.right !== null) stack.push([root.right, root.val]);
  if (root.left !== null) stack.push([root.left, root.val]);
  while (stack.length > 0) {
    const [node, maxSoFar] = stack.pop()!;
    if (node.val > maxSoFar) good++;              // sai: phải là >=
    const m = Math.max(maxSoFar, node.val);
    if (node.right !== null) stack.push([node.right, m]);
    if (node.left !== null) stack.push([node.left, m]);
  }
  return good;
}

// Sai 2: khởi tạo max bằng 0. Giá trị có thể âm, nên gốc âm bị coi là "không tốt".
function wrongInitZero(root: TreeNode | null): number {
  if (root === null) return 0;
  let good = 0;
  const stack: [TreeNode, number][] = [[root, 0]];
  while (stack.length > 0) {
    const [node, maxSoFar] = stack.pop()!;
    if (node.val >= maxSoFar) good++;
    const m = Math.max(maxSoFar, node.val);
    if (node.right !== null) stack.push([node.right, m]);
    if (node.left !== null) stack.push([node.left, m]);
  }
  return good;
}

// Sai 3: một biến max dùng chung cho cả cây. Max của nhánh trái rò sang nhánh phải.
function wrongSharedMax(root: TreeNode | null): number {
  if (root === null) return 0;
  let max = -Infinity, good = 0;
  const stack: TreeNode[] = [root];
  while (stack.length > 0) {
    const node = stack.pop()!;
    if (node.val >= max) { good++; max = node.val; }
    if (node.right !== null) stack.push(node.right);
    if (node.left !== null) stack.push(node.left);
  }
  return good;
}

// ---------- Ca chạy thử chung ----------
const N = 100_000;
const upChain = chain(N, (i) => -10_000 + Math.floor(i / 5), "right");   // không giảm: mọi nút đều tốt
const downChain = chain(N, (i) => 10_000 - Math.floor(i / 5), "left");   // không tăng: chỉ 5 nút đầu (bằng gốc) là tốt

const cases: { name: string; tree: TreeNode | null; want: number }[] = [
  { name: "một nút", tree: build([7]), want: 1 },
  { name: "một nút âm", tree: build([-10000]), want: 1 },
  { name: "ba nút", tree: build([2, 1, 3]), want: 2 },
  { name: "bằng max vẫn tốt", tree: build([5, 5, 5]), want: 3 },
  { name: "toàn số âm", tree: build([-3, -5, -1, -4, null, null, -2]), want: 2 },
  { name: "max nhánh trái lớn", tree: build([1, 9, 2, null, null, 2, 3]), want: 5 },
  { name: "cây đầy 7 nút", tree: build([4, 2, 6, 1, 3, 5, 7]), want: 3 },
  { name: "xuống thấp rồi vượt lại", tree: build([6, 2, null, 1, 7]), want: 2 },
  { name: "chuỗi không giảm 10^5 nút", tree: upChain, want: N },
  { name: "chuỗi không tăng 10^5 nút", tree: downChain, want: 5 },
];

const fns: [string, (r: TreeNode | null) => number][] = [
  ["goodBrute", goodBrute],
  ["goodDfs", goodDfs],
  ["goodIterative", goodIterative],
  ["goodBfs", goodBfs],
  ["wrongStrict", wrongStrict],
  ["wrongInitZero", wrongInitZero],
  ["wrongSharedMax", wrongSharedMax],
];

const width = Math.max(...fns.map(([name]) => name.length)) + 1;
for (const [name, fn] of fns) {
  let ok = 0;
  const fails: string[] = [];
  for (const c of cases) {
    if (name === "goodBrute" && c.tree === upChain) { ok++; continue; } // vét cạn trên chuỗi 10^5 nút là 5·10^9 phép so; đo riêng ở dưới
    try {
      const got = fn(c.tree);
      if (got === c.want) ok++; else fails.push(`${c.name} → ${got}`);
    } catch (e) {
      fails.push(`${c.name} → ném ${(e as Error).constructor.name}`);
    }
  }
  console.log(`${name.padEnd(width)} ${ok}/${cases.length} ca đúng${fails.length ? "; sai ở " + fails.join(", ") : ""}`);
}

// ---------- Đối chiếu trên cây ngẫu nhiên ----------
function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(42);
function randomTree(n: number): TreeNode {
  const nodes = [new TreeNode(Math.floor(rand() * 7) - 3)];
  while (nodes.length < n) {
    const p = nodes[Math.floor(rand() * nodes.length)];
    const side = rand() < 0.5 ? "left" : "right";
    if (p[side] === null) { p[side] = new TreeNode(Math.floor(rand() * 7) - 3); nodes.push(p[side]!); }
  }
  return nodes[0];
}
const TRIALS = 3000;
let agree = 0;
const wrongMiss: Record<string, number> = { wrongStrict: 0, wrongInitZero: 0, wrongSharedMax: 0 };
for (let t = 0; t < TRIALS; t++) {
  const tree = randomTree(1 + Math.floor(rand() * 12));
  const want = goodBrute(tree);
  if (goodDfs(tree) === want && goodIterative(tree) === want && goodBfs(tree) === want && goodBfsShift(tree) === want) agree++;
  if (wrongStrict(tree) !== want) wrongMiss.wrongStrict++;
  if (wrongInitZero(tree) !== want) wrongMiss.wrongInitZero++;
  if (wrongSharedMax(tree) !== want) wrongMiss.wrongSharedMax++;
}
console.log(`\nđối chiếu ${TRIALS} cây ngẫu nhiên 1..12 nút, giá trị -3..3: bốn cách đúng khớp vét cạn ${agree}/${TRIALS}`);
console.log(`bản sai lệch với vét cạn: wrongStrict ${wrongMiss.wrongStrict}, wrongInitZero ${wrongMiss.wrongInitZero}, wrongSharedMax ${wrongMiss.wrongSharedMax} cây`);

// ---------- Đo ----------
function median(fn: () => void, runs = 5): number {
  const ts: number[] = [];
  for (let r = 0; r < runs; r++) { const t = performance.now(); fn(); ts.push(performance.now() - t); }
  ts.sort((a, b) => a - b);
  return ts[Math.floor(runs / 2)];
}

console.log("\nchuỗi không giảm (mọi nút tốt, vét cạn không dừng sớm), trung vị 5 lần (ms)");
console.log("n        vét cạn: phép so     ms   DFS lặp ms");
for (const n of [1000, 2000, 4000, 10000]) {
  const tree = chain(n, (i) => i, "right");
  compares = 0; goodBrute(tree); const c = compares;
  const tb = median(() => goodBrute(tree));
  const ti = median(() => goodIterative(tree));
  console.log(`${String(n).padEnd(8)} ${String(c).padStart(16)} ${tb.toFixed(2).padStart(8)} ${ti.toFixed(2).padStart(12)}`);
}

// Cây đầy đủ 10^5 nút (cao 17), giá trị giả ngẫu nhiên trong [-10^4, 10^4]: cùng bộ sinh tuyến tính ở cả năm ngôn ngữ.
let seed = 42;
const vals = Array.from({ length: N }, () => {
  seed = (Math.imul(seed, 1103515245) + 12345) & 0x7fffffff;   // = (seed·1103515245 + 12345) mod 2^31
  return (seed % 20001) - 10000;
});
const full = build(vals)!;
compares = 0; const fullWant = goodBrute(full); const fullCompares = compares;
console.log(`\ncây đầy đủ 10^5 nút (cao 17): ${fullWant} nút tốt, vét cạn ${fullCompares} phép so`);
for (const [name, fn] of [["vét cạn", goodBrute], ["DFS đệ quy", goodDfs], ["DFS lặp", goodIterative], ["BFS chỉ số head", goodBfs], ["BFS shift()", goodBfsShift]] as const) {
  if (fn(full) !== fullWant) throw new Error(name);
  console.log(`${name.padEnd(16)} ${median(() => fn(full)).toFixed(2).padStart(8)} ms`);
}

// Chuỗi dài nhất mà bản đệ quy còn chạy được (tìm nhị phân), đề cho tới 10^5 nút.
function survives(n: number): boolean {
  try { goodDfs(chain(n, (i) => i, "right")); return true; } catch { return false; }
}
let lo = 1, hi = N;
while (lo < hi) { const mid = Math.floor((lo + hi + 1) / 2); if (survives(mid)) lo = mid; else hi = mid - 1; }
console.log(`\nchuỗi dài nhất goodDfs đệ quy chạy được: ${lo} nút (đề cho tới 10^5)`);
console.log(`chuỗi 10^5 nút: goodIterative → ${goodIterative(upChain)}, goodBfs → ${goodBfs(upChain)}`);
