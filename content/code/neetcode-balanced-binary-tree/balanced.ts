// LC 110 Balanced Binary Tree: từ trên xuống tính lại chiều cao, từ dưới lên với giá trị canh -1, và bản lặp.
// Chạy: node balanced.ts

class TreeNode {
  val: number;
  left: TreeNode | null = null;
  right: TreeNode | null = null;
  constructor(val: number) { this.val = val; }
}

// Dựng cây từ mảng theo tầng kiểu LeetCode: null là chỗ trống.
function build(arr: (number | null)[]): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]);
  const queue: TreeNode[] = [root];
  let i = 1;
  for (let q = 0; q < queue.length && i < arr.length; q++) {
    const node = queue[q];
    const l = arr[i++];
    if (l !== null && l !== undefined) { node.left = new TreeNode(l); queue.push(node.left); }
    const r = i < arr.length ? arr[i++] : null;
    if (r !== null && r !== undefined) { node.right = new TreeNode(r); queue.push(node.right); }
  }
  return root;
}

function leftChain(n: number): TreeNode | null {
  let root: TreeNode | null = null;
  for (let i = 0; i < n; i++) { const t = new TreeNode(i); t.left = root; root = t; }
  return root;
}

// Cây Fibonacci bậc h: con trái bậc h-1, con phải bậc h-2. Cân ở mọi nút nhưng lá nằm ở nhiều độ sâu.
function fibTree(h: number): TreeNode | null {
  if (h <= 0) return null;
  const t = new TreeNode(h);
  t.left = fibTree(h - 1);
  t.right = fibTree(h - 2);
  return t;
}

// Cây "răng lược" với sống dài L: nút sống thứ i có con trái là nút sống kế, con phải là một chuỗi L-1-i nút.
// Mọi nút trên sống đều cân (hai bên cao bằng nhau), nhưng các chuỗi dài từ 3 nút thì lệch.
function combTree(L: number): TreeNode | null {
  let spine: TreeNode | null = null;
  for (let i = L - 1; i >= 0; i--) {
    const s = new TreeNode(i);
    s.left = spine;
    s.right = leftChain(L - 1 - i);
    spine = s;
  }
  return spine;
}

let visits = 0;

// Số nút trên đường dài nhất đi xuống; cây rỗng là 0.
function height(node: TreeNode | null): number {
  if (node === null) return 0;
  visits++;
  return 1 + Math.max(height(node.left), height(node.right));
}

// Cách 1: từ trên xuống. Ở mỗi nút tính lại chiều cao hai cây con rồi mới xét hai cây con.
function balancedTopDown(root: TreeNode | null): boolean {
  if (root === null) return true;
  return Math.abs(height(root.left) - height(root.right)) <= 1 && balancedTopDown(root.left) && balancedTopDown(root.right);
}

// Cách 2: từ dưới lên. check trả chiều cao, hoặc -1 nếu cây con đã lệch ở đâu đó. -1 không bao giờ là chiều cao thật.
function balancedBottomUp(root: TreeNode | null): boolean {
  const check = (node: TreeNode | null): number => {
    if (node === null) return 0;
    visits++;
    const l = check(node.left);
    if (l === -1) return -1; // bên trái đã lệch: khỏi xét bên phải
    const r = check(node.right);
    if (r === -1 || Math.abs(l - r) > 1) return -1;
    return 1 + Math.max(l, r);
  };
  return check(root) !== -1;
}

// Cách 3: cùng phép tính từ dưới lên, không đệ quy: tiền thứ tự bằng ngăn xếp, xử lý ngược.
function balancedIterative(root: TreeNode | null): boolean {
  if (root === null) return true;
  const order: TreeNode[] = [];
  const stack: TreeNode[] = [root];
  while (stack.length > 0) {
    const node = stack.pop()!;
    order.push(node);
    if (node.left !== null) stack.push(node.left);
    if (node.right !== null) stack.push(node.right);
  }
  const h = new Map<TreeNode | null, number>([[null, 0]]);
  for (let i = order.length - 1; i >= 0; i--) {
    const node = order[i];
    const l = h.get(node.left)!, r = h.get(node.right)!;
    if (Math.abs(l - r) > 1) return false;
    h.set(node, 1 + Math.max(l, r));
  }
  return true;
}

// SAI: chỉ so hai cây con của gốc.
function wrongRootOnly(root: TreeNode | null): boolean {
  return root === null || Math.abs(height(root.left) - height(root.right)) <= 1;
}

// SAI: "cân" nghĩa là lá nông nhất và lá sâu nhất chênh không quá 1. Đó là định nghĩa khác, chặt hơn.
function wrongMinMaxDepth(root: TreeNode | null): boolean {
  if (root === null) return true;
  let lo = Infinity, hi = 0;
  const stack: [TreeNode, number][] = [[root, 1]];
  while (stack.length > 0) {
    const [n, d] = stack.pop()!;
    if (n.left === null && n.right === null) { lo = Math.min(lo, d); hi = Math.max(hi, d); }
    if (n.left !== null) stack.push([n.left, d + 1]);
    if (n.right !== null) stack.push([n.right, d + 1]);
  }
  return hi - lo <= 1;
}

// SAI: quên kiểm tra -1 từ con. Hai bên cùng -1, hoặc -1 cạnh 0, vẫn lọt qua phép so |l - r| <= 1.
function wrongIgnoreSentinel(root: TreeNode | null): boolean {
  const check = (node: TreeNode | null): number => {
    if (node === null) return 0;
    const l = check(node.left), r = check(node.right);
    if (Math.abs(l - r) > 1) return -1;
    return 1 + Math.max(l, r);
  };
  return check(root) !== -1;
}

const cases: [string, () => TreeNode | null, boolean][] = [
  ["cây rỗng", () => null, true],
  ["một nút", () => build([1]), true],
  ["cây đầy 7 nút", () => build([1, 2, 3, 4, 5, 6, 7]), true],
  ["lệch ngay ở gốc", () => build([1, 2, null, 3]), false],
  ["gốc cân, con lệch", () => build([1, 2, 3, 4, null, null, 5, 6, null, null, 7]), false],
  ["chuỗi 4 nút (-1 cạnh 0)", () => build([1, 2, null, 3, null, 4]), false],
  ["cây Fibonacci bậc 5", () => fibTree(5), true],
  ["cây đủ 5000 nút", () => build(Array.from({ length: 5000 }, (_, i) => i)), true],
  ["chuỗi lệch 5000 nút (giới hạn đề)", () => leftChain(5000), false],
];

const fns = [balancedTopDown, balancedBottomUp, balancedIterative, wrongRootOnly, wrongMinMaxDepth, wrongIgnoreSentinel];
for (const fn of fns) {
  const bad: string[] = [];
  for (const [name, make, want] of cases) {
    let got: string;
    try { got = String(fn(make())); } catch (e) { got = "ném " + (e as Error).constructor.name; }
    if (got !== String(want)) bad.push(`${name} → ${got}`);
  }
  console.log(`${fn.name.padEnd(19)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(", ") : ""}`);
}

// Bộ sinh ngẫu nhiên mulberry32: trạng thái 32 bit, mọi phép nhân qua Math.imul nên không mất chính xác.
function mulberry32(seed: number): () => number {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Cây ngẫu nhiên nhỏ: mỗi nút mới gắn vào một chỗ trống ngẫu nhiên. Phần lớn lệch, một phần cân.
function randomTree(n: number, rnd: () => number): TreeNode | null {
  if (n === 0) return null;
  const nodes = [new TreeNode(0)];
  for (let i = 1; i < n; i++) {
    const t = new TreeNode(i);
    for (;;) {
      const p = nodes[Math.floor(rnd() * nodes.length)];
      if (rnd() < 0.5) { if (p.left === null) { p.left = t; break; } }
      else if (p.right === null) { p.right = t; break; }
    }
    nodes.push(t);
  }
  return nodes[0];
}

{
  const rnd = mulberry32(110);
  let agree = 0, balancedCount = 0;
  const T = 3000;
  for (let t = 0; t < T; t++) {
    const root = randomTree(Math.floor(rnd() * 16), rnd);
    const a = balancedTopDown(root), b = balancedBottomUp(root), c = balancedIterative(root);
    if (a === b && b === c) agree++;
    if (a) balancedCount++;
  }
  console.log(`\nđối chiếu ${T} cây ngẫu nhiên 0..15 nút: ba cách khớp nhau ${agree}/${T} (${balancedCount} cây cân)`);
}

function bench(fn: (r: TreeNode | null) => boolean, root: TreeNode | null, reps = 5): [number, string, boolean] {
  const ts: number[] = [];
  let v = 0, res = false;
  for (let r = 0; r < reps; r++) {
    visits = 0;
    const t0 = performance.now();
    res = fn(root);
    ts.push(performance.now() - t0);
    v = visits;
  }
  ts.sort((x, y) => x - y);
  return [v, ts[Math.floor(reps / 2)].toFixed(2), res];
}

console.log("\ncây hoàn hảo (cân, đáp án true): số lần ghé nút và thời gian trung vị (ms)");
console.log("n          trên xuống: ghé       ms   dưới lên: ghé      ms");
for (const k of [10, 14, 17, 20]) {
  const n = 2 ** k - 1;
  const root = build(Array.from({ length: n }, (_, i) => i));
  const [v1, t1] = bench(balancedTopDown, root);
  const [v2, t2] = bench(balancedBottomUp, root);
  console.log(`${String(n).padEnd(10)} ${String(v1).padStart(16)} ${t1.padStart(8)} ${String(v2).padStart(14)} ${t2.padStart(7)}`);
}

console.log("\ncây răng lược sống L (đáp án false): số lần ghé nút");
console.log("L      n            trên xuống: ghé   ghé / n^1.5        ms   dưới lên: ghé      ms");
for (const L of [250, 500, 1000]) {
  const root = combTree(L);
  visits = 0;
  height(root);
  const n = visits;
  const [v1, t1] = bench(balancedTopDown, root, 3);
  const [v2, t2] = bench(balancedBottomUp, root, 3);
  console.log(`${String(L).padEnd(6)} ${String(n).padEnd(12)} ${String(v1).padStart(16)} ${(v1 / n ** 1.5).toFixed(3).padStart(13)} ${t1.padStart(9)} ${String(v2).padStart(14)} ${t2.padStart(7)}`);
}

{
  const root = leftChain(1000000);
  const [, t] = bench(balancedIterative, root);
  let msg: string;
  try { msg = String(balancedBottomUp(root)); } catch (e) { msg = "ném " + (e as Error).constructor.name; }
  console.log(`\nchuỗi lệch 10⁶ nút: bản lặp → ${balancedIterative(root)} (${t} ms), đệ quy dưới lên → ${msg}`);
}
