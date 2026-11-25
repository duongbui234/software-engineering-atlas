// LC 235 Lowest Common Ancestor of a Binary Search Tree: LCA tổng quát (hậu thứ tự), so hai đường đi,
// đi xuống theo thứ tự của BST (đệ quy và vòng lặp), và hai cách hiểu sai.
// Chạy: node lca.ts

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

// Tìm nút có giá trị v trong BST (để lấy tham chiếu p, q như đề đưa vào).
function find(root: TreeNode | null, v: number): TreeNode {
  let node = root;
  while (node !== null && node.val !== v) node = v < node.val ? node.left : node.right;
  if (node === null) throw new Error("không có nút " + v);
  return node;
}

// Chuỗi lệch phải 0 → 1 → … → n-1: BST hợp lệ, cao n (chèn các số đã sắp xếp vào BST không tự cân).
function rightChain(n: number): TreeNode | null {
  let root: TreeNode | null = null;
  for (let i = n - 1; i >= 0; i--) { const t = new TreeNode(i); t.right = root; root = t; }
  return root;
}

// BST cân dựng từ dãy đã sắp xếp: phần tử giữa làm gốc.
function balancedBST(vals: number[], lo = 0, hi = vals.length - 1): TreeNode | null {
  if (lo > hi) return null;
  const mid = (lo + hi) >> 1;
  const node = new TreeNode(vals[mid]);
  node.left = balancedBST(vals, lo, mid - 1);
  node.right = balancedBST(vals, mid + 1, hi);
  return node;
}

// Cách 1: LCA của cây nhị phân bất kỳ (LC 236), không dùng thứ tự. Hậu thứ tự, ghé tới O(n) nút.
function lcaGeneral(root: TreeNode | null, p: TreeNode, q: TreeNode): TreeNode | null {
  if (root === null || root === p || root === q) return root;
  const l = lcaGeneral(root.left, p, q);
  const r = lcaGeneral(root.right, p, q);
  if (l !== null && r !== null) return root; // p một bên, q một bên
  return l !== null ? l : r;
}

// Cách 2: ghi đường từ gốc tới p và tới q (tìm kiếm BST), nút chung cuối cùng là đáp án. O(h) thời gian và bộ nhớ.
function pathTo(root: TreeNode | null, target: TreeNode): TreeNode[] {
  const path: TreeNode[] = [];
  let node = root;
  while (node !== null) {
    path.push(node);
    if (node === target) break;
    node = target.val < node.val ? node.left : node.right;
  }
  return path;
}
function lcaPaths(root: TreeNode | null, p: TreeNode, q: TreeNode): TreeNode | null {
  const a = pathTo(root, p), b = pathTo(root, q);
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return a[i - 1];
}

// Cách 3: đi xuống theo thứ tự, đệ quy. Cả hai nhỏ hơn thì sang trái, cả hai lớn hơn thì sang phải, còn lại là điểm tách.
function lcaRecursive(node: TreeNode | null, p: TreeNode, q: TreeNode): TreeNode | null {
  if (node === null) return null;
  if (p.val < node.val && q.val < node.val) return lcaRecursive(node.left, p, q);
  if (p.val > node.val && q.val > node.val) return lcaRecursive(node.right, p, q);
  return node;
}

// Cách 4: cùng phép đi đó bằng vòng lặp. O(h) thời gian, O(1) bộ nhớ.
function lcaIterative(root: TreeNode | null, p: TreeNode, q: TreeNode): TreeNode | null {
  let node = root;
  while (node !== null) {
    if (p.val < node.val && q.val < node.val) node = node.left;
    else if (p.val > node.val && q.val > node.val) node = node.right;
    else return node;
  }
  return null;
}

// Hiểu sai 1: tưởng đề cho p nhỏ hơn q, nên chỉ so q với nút khi rẽ trái và p khi rẽ phải.
function wrongAssumeOrdered(root: TreeNode | null, p: TreeNode, q: TreeNode): TreeNode | null {
  let node = root;
  while (node !== null) {
    if (q.val < node.val) node = node.left;
    else if (p.val > node.val) node = node.right;
    else return node;
  }
  return null;
}

// Hiểu sai 2: dùng <= và >=, quên rằng một nút có thể là tổ tiên của chính nó.
function wrongNonStrict(root: TreeNode | null, p: TreeNode, q: TreeNode): TreeNode | null {
  let node = root;
  while (node !== null) {
    if (p.val <= node.val && q.val <= node.val) node = node.left;
    else if (p.val >= node.val && q.val >= node.val) node = node.right;
    else return node;
  }
  return null;
}

// Biến thể "nhân hai hiệu": cùng dấu thì p, q cùng một bên. Ở TS tích là số thực 64 bit nên dấu vẫn đúng.
function lcaProduct(root: TreeNode | null, p: TreeNode, q: TreeNode): TreeNode | null {
  let node = root;
  while (node !== null) {
    const s = (node.val - p.val) * (node.val - q.val);
    if (s <= 0) return node;
    node = p.val < node.val ? node.left : node.right;
  }
  return null;
}

const T = [20, 10, 30, 5, 15, 25, 35, null, null, 12, 17];
type Case = [string, () => TreeNode | null, number, number, number];
const cases: Case[] = [
  ["hai phía của gốc (5, 35)", () => build(T), 5, 35, 20],
  ["cùng bên trái (5, 17)", () => build(T), 5, 17, 10],
  ["p là tổ tiên của q (10, 12)", () => build(T), 10, 12, 10],
  ["p lớn hơn q (17, 12)", () => build(T), 17, 12, 15],
  ["cùng bên phải (25, 35)", () => build(T), 25, 35, 30],
  ["gốc là p (20, 17)", () => build(T), 20, 17, 20],
  ["cây 2 nút (2, 1)", () => build([2, 1]), 2, 1, 2],
  ["giá trị ±10⁹ (10⁹, 10⁹ − 1)", () => build([-1e9, null, 1e9, 999999999]), 1e9, 999999999, 1e9],
  ["cùng phía, hiệu cỡ 5·10⁴ (50000, 50001)", () => build([0, null, 50000, null, 50001]), 50000, 50001, 50000],
  ["chuỗi tăng 10⁵ nút (99998, 99999)", () => rightChain(100000), 99998, 99999, 99998],
];

type Fn = (r: TreeNode | null, p: TreeNode, q: TreeNode) => TreeNode | null;
function check(fn: Fn) {
  const bad: string[] = [];
  for (const [name, make, pv, qv, want] of cases) {
    const root = make();
    let got: string;
    try { const r = fn(root, find(root, pv), find(root, qv)); got = r === null ? "null" : String(r.val); }
    catch (e) { got = "ném " + (e as Error).constructor.name; }
    if (got !== String(want)) bad.push(`${name} → ${got}`);
  }
  console.log(`${fn.name.padEnd(18)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(", ") : ""}`);
}
for (const fn of [lcaGeneral, lcaPaths, lcaRecursive, lcaIterative, lcaProduct, wrongAssumeOrdered, wrongNonStrict]) check(fn);

// Bộ sinh ngẫu nhiên mulberry32.
function mulberry32(seed: number): () => number {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Đối chiếu trên BST ngẫu nhiên: chèn các giá trị khác nhau theo thứ tự ngẫu nhiên.
{
  const rnd = mulberry32(235);
  let agree = 0;
  const N = 3000;
  for (let t = 0; t < N; t++) {
    const n = 2 + Math.floor(rnd() * 30);
    const vals = Array.from({ length: n }, (_, i) => i * 3 - 40);
    for (let i = n - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [vals[i], vals[j]] = [vals[j], vals[i]]; }
    let root: TreeNode | null = null;
    for (const v of vals) {
      const t2 = new TreeNode(v);
      if (root === null) { root = t2; continue; }
      let cur = root;
      for (;;) {
        if (v < cur.val) { if (cur.left === null) { cur.left = t2; break; } cur = cur.left; }
        else { if (cur.right === null) { cur.right = t2; break; } cur = cur.right; }
      }
    }
    const i = Math.floor(rnd() * n);
    let j = Math.floor(rnd() * (n - 1)); if (j >= i) j++;
    const p = find(root, vals[i]), q = find(root, vals[j]);
    const a = lcaGeneral(root, p, q);
    if (a === lcaPaths(root, p, q) && a === lcaRecursive(root, p, q) && a === lcaIterative(root, p, q) && a === lcaProduct(root, p, q)) agree++;
  }
  console.log(`\nđối chiếu ${N} BST ngẫu nhiên 2..31 nút: năm cách khớp nhau ${agree}/${N}`);
}

// Đếm số nút mỗi cách ghé, trên BST cân.
let visits = 0;
function generalCounted(root: TreeNode | null, p: TreeNode, q: TreeNode): TreeNode | null {
  if (root === null) return null;
  visits++;
  if (root === p || root === q) return root;
  const l = generalCounted(root.left, p, q);
  const r = generalCounted(root.right, p, q);
  if (l !== null && r !== null) return root;
  return l !== null ? l : r;
}
function iterativeCounted(root: TreeNode | null, p: TreeNode, q: TreeNode): TreeNode | null {
  let node = root;
  while (node !== null) {
    visits++;
    if (p.val < node.val && q.val < node.val) node = node.left;
    else if (p.val > node.val && q.val > node.val) node = node.right;
    else return node;
  }
  return null;
}

console.log("\nBST cân, cặp (p, q) ngẫu nhiên: số nút ghé trung bình và thời gian mỗi truy vấn (µs)");
console.log("n          tổng quát: ghé        µs   đi theo thứ tự: ghé   cặp sâu nhất      µs");
for (const k of [10, 17, 20]) {
  const n = 2 ** k - 1;
  const root = balancedBST(Array.from({ length: n }, (_, i) => i));
  const rnd = mulberry32(k);
  const pairs: [TreeNode, TreeNode][] = [];
  for (let i = 0; i < 2000; i++) {
    const a = Math.floor(rnd() * n);
    let b = Math.floor(rnd() * (n - 1)); if (b >= a) b++;
    pairs.push([find(root, a), find(root, b)]);
  }
  const G = k === 20 ? 40 : 400; // tổng quát chậm: ít truy vấn hơn
  visits = 0;
  for (let i = 0; i < G; i++) generalCounted(root, pairs[i][0], pairs[i][1]);
  const gv = visits / G;
  for (let i = 0; i < 3; i++) lcaGeneral(root, pairs[i][0], pairs[i][1]);
  let t0 = performance.now();
  for (let i = 0; i < G; i++) lcaGeneral(root, pairs[i][0], pairs[i][1]);
  const gt = (performance.now() - t0) * 1000 / G;
  visits = 0;
  for (const [p, q] of pairs) iterativeCounted(root, p, q);
  const wv = visits / pairs.length;
  visits = 0;
  iterativeCounted(root, find(root, 0), find(root, 2)); // hai lá kề nhau ở tầng đáy: điểm tách sâu nhất
  const deep = visits;
  let sink = 0;
  for (let rep = 0; rep < 50; rep++) for (const [p, q] of pairs) sink += lcaIterative(root, p, q)!.val;
  t0 = performance.now();
  for (let rep = 0; rep < 50; rep++) for (const [p, q] of pairs) sink += lcaIterative(root, p, q)!.val;
  const wt = (performance.now() - t0) * 1000 / (50 * pairs.length);
  console.log(`${String(n).padEnd(10)} ${gv.toFixed(0).padStart(14)} ${gt.toFixed(1).padStart(9)} ${wv.toFixed(1).padStart(20)} ${String(deep).padStart(14)} ${wt.toFixed(3).padStart(7)}${sink < 0 ? "" : ""}`);
}

{
  const root = rightChain(100000);
  const p = find(root, 99998), q = find(root, 99999);
  const t0 = performance.now();
  const r = lcaIterative(root, p, q)!;
  const t = performance.now() - t0;
  let msg: string;
  try { msg = String(lcaRecursive(root, p, q)!.val); } catch (e) { msg = "ném " + (e as Error).constructor.name; }
  console.log(`\nchuỗi tăng 10⁵ nút, (99998, 99999): vòng lặp → ${r.val} (${t.toFixed(2)} ms), đệ quy → ${msg}`);
}
