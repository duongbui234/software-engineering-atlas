// LC 543 Diameter of Binary Tree: tính lại chiều cao ở mọi nút, một lượt hậu thứ tự, và bản lặp không đệ quy.
// Chạy: node diameter.ts

class TreeNode {
  val: number;
  left: TreeNode | null = null;
  right: TreeNode | null = null;
  constructor(val: number) { this.val = val; }
}

// Dựng cây từ mảng theo tầng kiểu LeetCode: null là chỗ trống, con của chỗ trống không được ghi.
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

// Chuỗi lệch trái n nút: cây sâu nhất có thể, dựng bằng vòng lặp.
function leftChain(n: number): TreeNode | null {
  let root: TreeNode | null = null;
  for (let i = 0; i < n; i++) { const t = new TreeNode(i); t.left = root; root = t; }
  return root;
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

// Cây ngẫu nhiên n nút: mỗi nút mới gắn vào một chỗ trống ngẫu nhiên của một nút đã có.
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

let visits = 0; // đếm số lần ghé nút trong height(), để so cách 1 với cách 2

// Chiều cao tính theo số nút trên đường dài nhất đi xuống: cây rỗng 0, một nút 1.
function height(node: TreeNode | null): number {
  if (node === null) return 0;
  visits++;
  return 1 + Math.max(height(node.left), height(node.right));
}

// Cách 1: đường kính = max(đi qua nút này, đường kính cây trái, đường kính cây phải).
// height() đi lại cả cây con ở mỗi nút: O(n log n) với cây cân, O(n²) với chuỗi lệch.
function diameterNaive(root: TreeNode | null): number {
  if (root === null) return 0;
  const through = height(root.left) + height(root.right);
  return Math.max(through, diameterNaive(root.left), diameterNaive(root.right));
}

// Cách 2: một lượt hậu thứ tự. dfs trả chiều cao cho cha, còn đường kính tốt nhất ghi vào biến ngoài. O(n).
function diameterOnePass(root: TreeNode | null): number {
  let best = 0;
  const dfs = (node: TreeNode | null): number => {
    if (node === null) return 0;
    visits++;
    const l = dfs(node.left);
    const r = dfs(node.right);
    best = Math.max(best, l + r); // đường đi rẽ ở node: l cạnh xuống trái + r cạnh xuống phải
    return 1 + Math.max(l, r);
  };
  dfs(root);
  return best;
}

// Cách 3: cùng phép tính, không đệ quy. Duyệt tiền thứ tự bằng ngăn xếp rồi xử lý theo thứ tự ngược:
// mỗi nút được xử lý sau mọi con cháu của nó. Không giới hạn độ sâu.
function diameterIterative(root: TreeNode | null): number {
  if (root === null) return 0;
  const order: TreeNode[] = [];
  const stack: TreeNode[] = [root];
  while (stack.length > 0) {
    const node = stack.pop()!;
    order.push(node);
    if (node.left !== null) stack.push(node.left);
    if (node.right !== null) stack.push(node.right);
  }
  const h = new Map<TreeNode, number>();
  let best = 0;
  for (let i = order.length - 1; i >= 0; i--) {
    const node = order[i];
    const l = node.left === null ? 0 : h.get(node.left)!;
    const r = node.right === null ? 0 : h.get(node.right)!;
    best = Math.max(best, l + r);
    h.set(node, 1 + Math.max(l, r));
  }
  return best;
}

// SAI: đếm số nút trên đường thay vì số cạnh. Lệch 1 ở mọi ca.
function wrongCountNodes(root: TreeNode | null): number {
  let best = 0;
  const dfs = (node: TreeNode | null): number => {
    if (node === null) return 0;
    const l = dfs(node.left), r = dfs(node.right);
    best = Math.max(best, l + r + 1);
    return 1 + Math.max(l, r);
  };
  dfs(root);
  return best;
}

// SAI: chỉ xét đường đi qua gốc. Sai khi đường dài nhất nằm trọn trong một cây con.
function wrongThroughRoot(root: TreeNode | null): number {
  return root === null ? 0 : height(root.left) + height(root.right);
}

// SAI: best là biến toàn cục không được đặt lại. LeetCode chạy nhiều ca trong cùng một tiến trình,
// nên ca sau nhận số lớn nhất của các ca trước.
let globalBest = 0;
function wrongGlobalNoReset(root: TreeNode | null): number {
  const dfs = (node: TreeNode | null): number => {
    if (node === null) return 0;
    const l = dfs(node.left), r = dfs(node.right);
    globalBest = Math.max(globalBest, l + r);
    return 1 + Math.max(l, r);
  };
  dfs(root);
  return globalBest;
}

// Kiểm chứng theo định nghĩa: BFS từ mọi nút trên cây vô hướng, lấy khoảng cách lớn nhất. O(n²), chỉ cho cây nhỏ.
function diameterByDefinition(root: TreeNode | null): number {
  if (root === null) return 0;
  const adj = new Map<TreeNode, TreeNode[]>();
  const all: TreeNode[] = [];
  const walk = [root];
  while (walk.length > 0) {
    const n = walk.pop()!;
    all.push(n);
    if (!adj.has(n)) adj.set(n, []);
    for (const c of [n.left, n.right]) {
      if (c === null) continue;
      adj.get(n)!.push(c);
      adj.set(c, [n]);
      walk.push(c);
    }
  }
  let best = 0;
  for (const s of all) {
    const dist = new Map<TreeNode, number>([[s, 0]]);
    const q = [s];
    for (let i = 0; i < q.length; i++) {
      for (const nb of adj.get(q[i])!) if (!dist.has(nb)) { dist.set(nb, dist.get(q[i])! + 1); q.push(nb); best = Math.max(best, dist.get(nb)!); }
    }
  }
  return best;
}

const cases: [string, () => TreeNode | null, number][] = [
  ["một nút", () => build([7]), 0],
  ["hai nút", () => build([7, 3]), 1],
  ["rẽ ở gốc", () => build([1, 2, 3, null, 4, 5, 6]), 4],
  ["không đi qua gốc", () => build([1, 2, null, 3, 4, 5, null, null, 6, 7, null, null, 8]), 6],
  ["cây đầy 15 nút", () => build(Array.from({ length: 15 }, (_, i) => i)), 6],
  ["giá trị âm", () => build([-1, -2, -3, -4, null, null, -5]), 4],
  ["chuỗi lệch 10⁴ nút (giới hạn đề)", () => leftChain(10000), 9999],
];

const fns = [diameterNaive, diameterOnePass, diameterIterative, wrongCountNodes, wrongThroughRoot, wrongGlobalNoReset];
for (const fn of fns) {
  const bad: string[] = [];
  for (const [name, make, want] of cases) {
    let got: string;
    try { got = String(fn(make())); } catch (e) { got = "ném " + (e as Error).constructor.name; }
    if (got !== String(want)) bad.push(`${name} → ${got}`);
  }
  console.log(`${fn.name.padEnd(19)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(", ") : ""}`);
}

// Đối chiếu ngẫu nhiên với định nghĩa: 2000 cây, 1..60 nút.
{
  const rnd = mulberry32(543);
  const ok = [0, 0, 0];
  const T = 2000;
  for (let t = 0; t < T; t++) {
    const root = randomTree(1 + Math.floor(rnd() * 60), rnd);
    const want = diameterByDefinition(root);
    [diameterNaive, diameterOnePass, diameterIterative].forEach((fn, j) => { if (fn(root) === want) ok[j]++; });
  }
  console.log(`\nđối chiếu với định nghĩa (BFS từ mọi nút): ${["diameterNaive", "diameterOnePass", "diameterIterative"].map((n, j) => `${n} ${ok[j]}/${T}`).join(", ")}`);
}

// Đếm số lần ghé nút và đo thời gian (trung vị 5 lần).
function bench(fn: (r: TreeNode | null) => number, root: TreeNode | null): [number, string] {
  const ts: number[] = [];
  let v = 0;
  for (let r = 0; r < 5; r++) {
    visits = 0;
    const t0 = performance.now();
    try { fn(root); } catch { return [-1, "RangeError"]; }
    ts.push(performance.now() - t0);
    v = visits;
  }
  ts.sort((x, y) => x - y);
  return [v, ts[2].toFixed(2)];
}

console.log("\nchuỗi lệch n nút: số lần ghé nút và thời gian trung vị (ms)");
console.log("n        tính lại: ghé       ms   một lượt: ghé      ms");
for (const n of [1000, 2000, 4000, 8000]) {
  const root = leftChain(n);
  const [v1, t1] = bench(diameterNaive, root);
  const [v2, t2] = bench(diameterOnePass, root);
  console.log(`${String(n).padEnd(8)} ${String(v1).padStart(14)} ${t1.padStart(8)} ${String(v2).padStart(14)} ${t2.padStart(7)}`);
}

console.log("\ncây ngẫu nhiên n nút: số lần ghé nút và thời gian trung vị (ms)");
console.log("n        tính lại: ghé       ms   một lượt: ghé      ms    bản lặp ms");
for (const n of [10000, 100000, 1000000]) {
  const root = randomTree(n, mulberry32(n));
  const [v1, t1] = bench(diameterNaive, root);
  const [v2, t2] = bench(diameterOnePass, root);
  const [, t3] = bench(diameterIterative, root);
  console.log(`${String(n).padEnd(8)} ${String(v1).padStart(14)} ${t1.padStart(8)} ${String(v2).padStart(14)} ${t2.padStart(7)} ${t3.padStart(13)}`);
}

// Độ sâu đệ quy tối đa của diameterOnePass trên chuỗi lệch: tìm nhị phân trên n.
function maxDepth(): number {
  const ok = (n: number) => { try { diameterOnePass(leftChain(n)); return true; } catch { return false; } };
  let lo = 1, hi = 1000000;
  while (lo < hi) { const m = (lo + hi + 1) >> 1; ok(m) ? (lo = m) : (hi = m - 1); }
  return lo;
}
console.log(`\nđệ quy một lượt sâu tối đa: ${maxDepth()} nút`);
{
  const root = leftChain(1000000);
  const [, t] = bench(diameterIterative, root);
  console.log(`bản lặp, chuỗi lệch 10⁶ nút: ${diameterIterative(root)} cạnh, ${t} ms`);
}
