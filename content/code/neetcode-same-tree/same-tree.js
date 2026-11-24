// LC 100 Same Tree: đệ quy song song, ngăn xếp cặp nút, hàng đợi cặp nút, tuần tự hóa có đánh dấu null,
// và lối tắt JSON.stringify (đúng, nhưng cũng đệ quy).
// Chạy: node same-tree.js

class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

// Dựng cây từ mảng theo tầng kiểu LeetCode: null là chỗ trống.
function build(level) {
  if (level.length === 0 || level[0] === null) return null;
  const root = new TreeNode(level[0]);
  const queue = [root];
  let head = 0, i = 1;
  while (i < level.length) {
    const node = queue[head++];
    const l = level[i++];
    if (l !== null) { node.left = new TreeNode(l); queue.push(node.left); }
    if (i >= level.length) break;
    const r = level[i++];
    if (r !== null) { node.right = new TreeNode(r); queue.push(node.right); }
  }
  return root;
}

function chain(n, side = "left") {
  let root = null;
  for (let i = 0; i < n; i++) {
    const t = new TreeNode(1);
    t[side] = root;
    root = t;
  }
  return root;
}

// Cách 1: đệ quy song song. O(n) thời gian, O(h) ngăn xếp gọi hàm.
function isSameRecursive(p, q) {
  if (p === null || q === null) return p === q; // chỉ đúng khi cả hai cùng null
  return p.val === q.val && isSameRecursive(p.left, q.left) && isSameRecursive(p.right, q.right);
}

// Cách 2: ngăn xếp các cặp nút (DFS).
function isSameStack(p, q) {
  const stack = [[p, q]];
  while (stack.length > 0) {
    const [a, b] = stack.pop();
    if (a === null && b === null) continue;
    if (a === null || b === null || a.val !== b.val) return false;
    stack.push([a.right, b.right], [a.left, b.left]);
  }
  return true;
}

// Cách 3: hàng đợi các cặp nút (BFS).
function isSameQueue(p, q) {
  const queue = [[p, q]];
  for (let head = 0; head < queue.length; head++) {
    const [a, b] = queue[head];
    if (a === null && b === null) continue;
    if (a === null || b === null || a.val !== b.val) return false;
    queue.push([a.left, b.left], [a.right, b.right]);
  }
  return true;
}

// Preorder, null ghi thành null. Vòng lặp.
function serialize(root) {
  const out = [];
  const stack = [root];
  while (stack.length > 0) {
    const node = stack.pop();
    if (node === null) { out.push(null); continue; }
    out.push(node.val);
    stack.push(node.right, node.left);
  }
  return out;
}

// Cách 4: tuần tự hóa có đánh dấu null rồi so hai mảng.
function isSameSerialize(p, q) {
  const a = serialize(p), b = serialize(q);
  return a.length === b.length && a.every((x, i) => x === b[i]);
}

// Lối tắt: JSON.stringify ghi cả null nên so được hình dạng, nhưng nó cũng đi cây bằng đệ quy.
function isSameJson(p, q) {
  return JSON.stringify(p) === JSON.stringify(q);
}

// SAI: quên trường hợp đúng một bên null.
function wrongMissingOneNull(p, q) {
  if (p === null && q === null) return true;
  return p.val === q.val && wrongMissingOneNull(p.left, q.left) && wrongMissingOneNull(p.right, q.right);
}

const cases = [
  ["giống hệt", build([1, 2, 3]), build([1, 2, 3]), true],
  ["con trái và con phải", build([1, 2]), build([1, null, 2]), false],
  ["đổi chỗ giá trị", build([1, 2, 1]), build([1, 1, 2]), false],
  ["hai cây rỗng", build([]), build([]), true],
  ["một bên rỗng", build([]), build([1]), false],
  ["một nút", build([5]), build([5]), true],
  ["giá trị lớn hơn 127", build([1000, 2000]), build([1000, 2000]), true],
  ["số âm", build([-10000, null, 7]), build([-10000, null, 7]), true],
  ["cây đầy 7 nút", build([1, 2, 3, 4, 5, 6, 7]), build([1, 2, 3, 4, 5, 6, 7]), true],
  ["khác lá cuối", build([1, 2, 3, 4, 5, 6, 7]), build([1, 2, 3, 4, 5, 6, 8]), false],
  ["lệch trái và lệch phải", chain(50, "left"), chain(50, "right"), false],
  ["lệch trái 100 nút", chain(100), chain(100), true],
];

const fns = [isSameRecursive, isSameStack, isSameQueue, isSameSerialize, isSameJson, wrongMissingOneNull];
for (const fn of fns) {
  const bad = [];
  for (const [name, p, q, want] of cases) {
    let got;
    try { got = String(fn(p, q)); } catch (e) { got = "ném " + e.constructor.name; }
    if (got !== String(want)) bad.push(`${name} → ${got}`);
  }
  console.log(`${fn.name.padEnd(20)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(", ") : ""}`);
}

function works(fn, d) {
  try { return fn(chain(d), chain(d)); } catch { return false; }
}
function deepestOk(fn) {
  let lo = 1, hi = 2;
  while (works(fn, hi)) { lo = hi; hi *= 2; }
  while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (works(fn, mid)) lo = mid; else hi = mid; }
  return lo;
}
console.log("");
for (const fn of [isSameRecursive, isSameJson]) console.log(`${fn.name.padEnd(16)} độ sâu lớn nhất chạy được: ${deepestOk(fn)}`);
console.log(`isSameStack      cây lệch 10⁶ nút: ${works(isSameStack, 1_000_000)}`);
