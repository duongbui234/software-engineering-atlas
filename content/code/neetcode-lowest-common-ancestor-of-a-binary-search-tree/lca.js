// LC 235 Lowest Common Ancestor of a Binary Search Tree: LCA tổng quát (hậu thứ tự), so hai đường đi,
// đi xuống theo thứ tự của BST (đệ quy và vòng lặp), và cách hiểu sai dùng <= / >=.
// Chạy: node lca.js

class TreeNode {
  constructor(val) { this.val = val; this.left = null; this.right = null; }
}

// Dựng cây từ mảng theo tầng kiểu LeetCode: null là chỗ trống.
function build(arr) {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]);
  const queue = [root];
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

function find(root, v) {
  let node = root;
  while (node !== null && node.val !== v) node = v < node.val ? node.left : node.right;
  return node;
}

// Chuỗi lệch phải 0 → 1 → … → n-1: BST hợp lệ, cao n.
function rightChain(n) {
  let root = null;
  for (let i = n - 1; i >= 0; i--) { const t = new TreeNode(i); t.right = root; root = t; }
  return root;
}

// Cách 1: LCA của cây nhị phân bất kỳ (LC 236), hậu thứ tự, O(n).
function lcaGeneral(root, p, q) {
  if (root === null || root === p || root === q) return root;
  const l = lcaGeneral(root.left, p, q);
  const r = lcaGeneral(root.right, p, q);
  if (l !== null && r !== null) return root;
  return l !== null ? l : r;
}

// Cách 2: hai đường đi từ gốc, nút chung cuối cùng.
function pathTo(root, target) {
  const path = [];
  let node = root;
  while (node !== null) {
    path.push(node);
    if (node === target) break;
    node = target.val < node.val ? node.left : node.right;
  }
  return path;
}
function lcaPaths(root, p, q) {
  const a = pathTo(root, p), b = pathTo(root, q);
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return a[i - 1];
}

// Cách 3: đi xuống theo thứ tự, đệ quy.
function lcaRecursive(node, p, q) {
  if (node === null) return null;
  if (p.val < node.val && q.val < node.val) return lcaRecursive(node.left, p, q);
  if (p.val > node.val && q.val > node.val) return lcaRecursive(node.right, p, q);
  return node;
}

// Cách 4: vòng lặp, O(1) bộ nhớ.
function lcaIterative(root, p, q) {
  let node = root;
  while (node !== null) {
    if (p.val < node.val && q.val < node.val) node = node.left;
    else if (p.val > node.val && q.val > node.val) node = node.right;
    else return node;
  }
  return null;
}

// Biến thể nhân hai hiệu: số của JS là số thực 64 bit, tích 4·10^18 mất độ chính xác nhưng giữ đúng dấu.
function lcaProduct(root, p, q) {
  let node = root;
  while (node !== null) {
    if ((node.val - p.val) * (node.val - q.val) <= 0) return node;
    node = p.val < node.val ? node.left : node.right;
  }
  return null;
}

// Hiểu sai: dùng <= và >=, quên rằng một nút có thể là tổ tiên của chính nó.
function wrongNonStrict(root, p, q) {
  let node = root;
  while (node !== null) {
    if (p.val <= node.val && q.val <= node.val) node = node.left;
    else if (p.val >= node.val && q.val >= node.val) node = node.right;
    else return node;
  }
  return null;
}

const T = [20, 10, 30, 5, 15, 25, 35, null, null, 12, 17];
const cases = [
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

function check(fn) {
  const bad = [];
  for (const [name, make, pv, qv, want] of cases) {
    const root = make();
    let got;
    try { const r = fn(root, find(root, pv), find(root, qv)); got = r === null ? "null" : String(r.val); }
    catch (e) { got = "ném " + e.constructor.name; }
    if (got !== String(want)) bad.push(`${name} → ${got}`);
  }
  console.log(`${fn.name.padEnd(18)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(", ") : ""}`);
}
for (const fn of [lcaGeneral, lcaPaths, lcaRecursive, lcaIterative, lcaProduct, wrongNonStrict]) check(fn);
