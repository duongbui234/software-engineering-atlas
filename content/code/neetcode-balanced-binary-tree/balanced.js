// LC 110 Balanced Binary Tree: từ trên xuống, từ dưới lên với giá trị canh -1, bản lặp, và hai cách hiểu sai chữ "cân".
// Chạy: node balanced.js

class TreeNode {
  constructor(val, left = null, right = null) { this.val = val; this.left = left; this.right = right; }
}

// Dựng cây từ mảng theo tầng kiểu LeetCode; null là chỗ trống.
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

function leftChain(n) {
  let root = null;
  for (let i = 0; i < n; i++) root = new TreeNode(i, root);
  return root;
}

const fibTree = (h) => (h <= 0 ? null : new TreeNode(h, fibTree(h - 1), fibTree(h - 2)));
const height = (node) => (node === null ? 0 : 1 + Math.max(height(node.left), height(node.right)));

// Cách 1: từ trên xuống.
function balancedTopDown(root) {
  if (root === null) return true;
  return Math.abs(height(root.left) - height(root.right)) <= 1 && balancedTopDown(root.left) && balancedTopDown(root.right);
}

// Cách 2: từ dưới lên; -1 nghĩa là "đã lệch".
function balancedBottomUp(root) {
  const check = (node) => {
    if (node === null) return 0;
    const l = check(node.left);
    if (l === -1) return -1;
    const r = check(node.right);
    if (r === -1 || Math.abs(l - r) > 1) return -1;
    return 1 + Math.max(l, r);
  };
  return check(root) !== -1;
}

// Cách 3: tiền thứ tự bằng ngăn xếp, xử lý ngược.
function balancedIterative(root) {
  if (root === null) return true;
  const order = [], stack = [root];
  while (stack.length > 0) {
    const node = stack.pop();
    order.push(node);
    if (node.left !== null) stack.push(node.left);
    if (node.right !== null) stack.push(node.right);
  }
  const h = new Map([[null, 0]]);
  for (let i = order.length - 1; i >= 0; i--) {
    const node = order[i];
    const l = h.get(node.left), r = h.get(node.right);
    if (Math.abs(l - r) > 1) return false;
    h.set(node, 1 + Math.max(l, r));
  }
  return true;
}

// SAI: so lá nông nhất với lá sâu nhất.
function wrongMinMaxDepth(root) {
  if (root === null) return true;
  let lo = Infinity, hi = 0;
  const stack = [[root, 1]];
  while (stack.length > 0) {
    const [n, d] = stack.pop();
    if (n.left === null && n.right === null) { lo = Math.min(lo, d); hi = Math.max(hi, d); }
    if (n.left !== null) stack.push([n.left, d + 1]);
    if (n.right !== null) stack.push([n.right, d + 1]);
  }
  return hi - lo <= 1;
}

// SAI: quên kiểm tra -1 từ con.
function wrongIgnoreSentinel(root) {
  const check = (node) => {
    if (node === null) return 0;
    const l = check(node.left), r = check(node.right);
    if (Math.abs(l - r) > 1) return -1;
    return 1 + Math.max(l, r);
  };
  return check(root) !== -1;
}

const cases = [
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

for (const fn of [balancedTopDown, balancedBottomUp, balancedIterative, wrongMinMaxDepth, wrongIgnoreSentinel]) {
  const bad = [];
  for (const [name, make, want] of cases) {
    let got;
    try { got = String(fn(make())); } catch (e) { got = "ném " + e.constructor.name; }
    if (got !== String(want)) bad.push(`${name} → ${got}`);
  }
  console.log(`${fn.name.padEnd(19)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(", ") : ""}`);
}
