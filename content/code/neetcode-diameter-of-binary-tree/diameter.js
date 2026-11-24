// LC 543 Diameter of Binary Tree: tính lại chiều cao, một lượt bằng closure, bản lặp, và bẫy biến toàn cục không đặt lại.
// Chạy: node diameter.js

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

const height = (node) => (node === null ? 0 : 1 + Math.max(height(node.left), height(node.right)));

// Cách 1: tính lại chiều cao ở mọi nút.
function diameterNaive(root) {
  if (root === null) return 0;
  return Math.max(height(root.left) + height(root.right), diameterNaive(root.left), diameterNaive(root.right));
}

// Cách 2: một lượt; best nằm trong closure, mỗi lần gọi hàm ngoài có một best mới.
function diameterOnePass(root) {
  let best = 0;
  const dfs = (node) => {
    if (node === null) return 0;
    const l = dfs(node.left), r = dfs(node.right);
    best = Math.max(best, l + r);
    return 1 + Math.max(l, r);
  };
  dfs(root);
  return best;
}

// Cách 3: tiền thứ tự bằng ngăn xếp, xử lý ngược; không giới hạn độ sâu.
function diameterIterative(root) {
  if (root === null) return 0;
  const order = [], stack = [root];
  while (stack.length > 0) {
    const node = stack.pop();
    order.push(node);
    if (node.left !== null) stack.push(node.left);
    if (node.right !== null) stack.push(node.right);
  }
  const h = new Map([[null, 0]]);
  let best = 0;
  for (let i = order.length - 1; i >= 0; i--) {
    const node = order[i];
    const l = h.get(node.left), r = h.get(node.right);
    best = Math.max(best, l + r);
    h.set(node, 1 + Math.max(l, r));
  }
  return best;
}

// SAI: best khai báo ngoài hàm và không đặt lại. Ca sau nhận số lớn nhất của các ca trước.
let best = 0;
function wrongGlobalNoReset(root) {
  const dfs = (node) => {
    if (node === null) return 0;
    const l = dfs(node.left), r = dfs(node.right);
    best = Math.max(best, l + r);
    return 1 + Math.max(l, r);
  };
  dfs(root);
  return best;
}

const cases = [
  ["một nút", () => build([7]), 0],
  ["hai nút", () => build([7, 3]), 1],
  ["rẽ ở gốc", () => build([1, 2, 3, null, 4, 5, 6]), 4],
  ["không đi qua gốc", () => build([1, 2, null, 3, 4, 5, null, null, 6, 7, null, null, 8]), 6],
  ["cây đầy 15 nút", () => build(Array.from({ length: 15 }, (_, i) => i)), 6],
  ["giá trị âm", () => build([-1, -2, -3, -4, null, null, -5]), 4],
  ["chuỗi lệch 10⁴ nút (giới hạn đề)", () => leftChain(10000), 9999],
];

for (const fn of [diameterNaive, diameterOnePass, diameterIterative, wrongGlobalNoReset]) {
  const bad = [];
  for (const [name, make, want] of cases) {
    let got;
    try { got = String(fn(make())); } catch (e) { got = "ném " + e.constructor.name; }
    if (got !== String(want)) bad.push(`${name} → ${got}`);
  }
  console.log(`${fn.name.padEnd(19)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(", ") : ""}`);
}
