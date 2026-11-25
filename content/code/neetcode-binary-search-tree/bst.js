// Ga LINK-04: cây nhị phân tìm kiếm (BST). Giải 235, 98, 230.
// Chạy: node bst.js

class TreeNode {
  val;
  left;
  right;
  constructor(val, left = null, right = null) {
    this.val = val; this.left = left; this.right = right;
  }
}

// Dựng cây từ mảng theo tầng kiểu LeetCode: [1, null, 2] là gốc 1, con phải 2.
function fromLevel(a) {
  if (a.length === 0 || a[0] === null) return null;
  const root = new TreeNode(a[0]);
  const queue = [root];
  let i = 1;
  for (let q = 0; q < queue.length && i < a.length; q++) {
    const node = queue[q];
    if (i < a.length && a[i] !== null) { node.left = new TreeNode(a[i]); queue.push(node.left); }
    i++;
    if (i < a.length && a[i] !== null) { node.right = new TreeNode(a[i]); queue.push(node.right); }
    i++;
  }
  return root;
}

// Tìm nút có giá trị v bằng chính tính chất BST (đề 235 đưa sẵn nút p, q; ở đây ta tìm từ giá trị).
function find(root, v) {
  while (root && root.val !== v) root = v < root.val ? root.left : root.right;
  return root;
}

// 235: đi một đường từ gốc. Cả hai nhỏ hơn nút → sang trái; cả hai lớn hơn → sang phải;
// còn lại (hai bên tách nhau, hoặc nút chính là p hay q) → nút này là tổ tiên chung thấp nhất.
function lowestCommonAncestor(root, p, q) {
  let node = root;
  for (;;) {
    if (p.val < node.val && q.val < node.val) node = node.left;
    else if (p.val > node.val && q.val > node.val) node = node.right;
    else return node;
  }
}

// LCA cho cây nhị phân BẤT KỲ (bài 236): không dùng thứ tự, phải hỏi cả hai cây con. O(n).
function lcaGeneric(node, p, q) {
  if (!node || node === p || node === q) return node;
  const l = lcaGeneric(node.left, p, q), r = lcaGeneric(node.right, p, q);
  return l && r ? node : (l ?? r);
}

// 98: mỗi nút phải nằm trong khoảng mở (lo, hi) mà MỌI tổ tiên đặt ra, không chỉ cha.
// Rẽ trái thì hi hạ xuống giá trị nút; rẽ phải thì lo nâng lên giá trị nút.
function isValidBST(root) {
  const check = (node, lo, hi) => {
    if (!node) return true;
    if (node.val <= lo || node.val >= hi) return false;
    return check(node.left, lo, node.val) && check(node.right, node.val, hi);
  };
  return check(root, -Infinity, Infinity);
}

// 98 cách hai: duyệt trung thứ tự bằng ngăn xếp, giá trị phải tăng ngặt. Không đệ quy, chịu được cây lệch.
function isValidBSTInorder(root) {
  const stack = [];
  let node = root, prev = -Infinity;
  while (node || stack.length) {
    while (node) { stack.push(node); node = node.left; }
    node = stack.pop();
    if (node.val <= prev) return false;
    prev = node.val;
    node = node.right;
  }
  return true;
}

// BẪY của 98: chỉ so nút với hai con trực tiếp. Bỏ sót nút cháu vi phạm khoảng của ông.
function isValidBSTParentChild(node) {
  if (!node) return true;
  if (node.left && node.left.val >= node.val) return false;
  if (node.right && node.right.val <= node.val) return false;
  return isValidBSTParentChild(node.left) && isValidBSTParentChild(node.right);
}

// 230: trung thứ tự của BST là dãy tăng. Đi bằng ngăn xếp, đếm, dừng ở nút thứ k: O(h + k).
function kthSmallest(root, k) {
  const stack = [];
  let node = root;
  for (;;) {
    while (node) { stack.push(node); node = node.left; }
    node = stack.pop();
    if (--k === 0) return node.val;
    node = node.right;
  }
}

// 230 cách thẳng: gom cả trung thứ tự ra mảng rồi lấy phần tử k − 1. Luôn O(n).
function inorderValues(root, out = []) {
  if (root) { inorderValues(root.left, out); out.push(root.val); inorderValues(root.right, out); }
  return out;
}
function kthSmallestFull(root, k) {
  return inorderValues(root)[k - 1];
}

// Chèn vào BST, bỏ qua giá trị trùng. Trả true nếu đã chèn.
function insert(root, v) {
  let p = root;
  for (;;) {
    if (v === p.val) return false;
    if (v < p.val) { if (!p.left) { p.left = new TreeNode(v); return true; } p = p.left; }
    else { if (!p.right) { p.right = new TreeNode(v); return true; } p = p.right; }
  }
}

// BST cân bằng từ dãy 0, 2, 4, …: chọn giữa làm gốc, hai nửa làm hai cây con.
function balanced(lo, hi) {
  if (lo > hi) return null;
  const mid = (lo + hi) >> 1;
  return new TreeNode(2 * mid, balanced(lo, mid - 1), balanced(mid + 1, hi));
}

function preorder(root, out = []) {
  if (root) { out.push(root); preorder(root.left, out); preorder(root.right, out); }
  return out;
}

// Bộ sinh ngẫu nhiên mulberry32: trạng thái 32 bit, mọi phép nhân qua Math.imul nên không mất chính xác.
function mulberry32(a) {
  return () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

// 300 BST ngẫu nhiên: so 230 với dãy đã sắp, 235 với LCA tổng quát, 98 trước và sau khi sửa bừa một nút.
let broken = 0, naiveWrong = 0;
function randomChecks() {
  const rand = mulberry32(42);
  for (let t = 0; t < 300; t++) {
    const n = 1 + Math.floor(rand() * 30);
    const root = new TreeNode(Math.floor(rand() * 100));
    for (let size = 1; size < n;) if (insert(root, Math.floor(rand() * 100))) size++;
    const sorted = inorderValues(root);
    for (let k = 1; k <= n; k++) if (kthSmallest(root, k) !== sorted[k - 1]) return false;
    if (n >= 2) {
      const i = Math.floor(rand() * n), j = (i + 1 + Math.floor(rand() * (n - 1))) % n;
      const p = find(root, sorted[i]), q = find(root, sorted[j]);
      if (lowestCommonAncestor(root, p, q) !== lcaGeneric(root, p, q)) return false;
    }
    if (!isValidBST(root) || !isValidBSTInorder(root)) return false;
    // Sửa bừa một nút rồi chấm lại; đáp án chuẩn: trung thứ tự tăng ngặt.
    preorder(root)[Math.floor(rand() * n)].val = Math.floor(rand() * 100);
    const vals = inorderValues(root);
    const ok = vals.every((v, x) => x === 0 || vals[x - 1] < v);
    if (isValidBST(root) !== ok || isValidBSTInorder(root) !== ok) return false;
    if (!ok) { broken++; if (isValidBSTParentChild(root)) naiveWrong++; }
  }
  return true;
}

const T = fromLevel;
const sample = () => T([20, 10, 30, 5, 15, 25, 35, null, null, 12, 17]);
const lcaOf = (a, b) => { const r = sample(); return lowestCommonAncestor(r, find(r, a), find(r, b)).val; };
const chain = (n) => { const r = new TreeNode(0); let p = r; for (let v = 1; v < n; v++) { p.right = new TreeNode(v); p = p.right; } return r; };

const cases = [
  ["235 hai nút ở hai nhánh của gốc", () => lcaOf(10, 30) === 20],
  ["235 một nút là tổ tiên của nút kia", () => lcaOf(10, 17) === 10],
  ["235 hai lá cùng một cha", () => lcaOf(12, 17) === 15],
  ["235 tách nhau ở tầng giữa", () => lcaOf(5, 12) === 10],
  ["98 cây ba nút đúng thứ tự", () => isValidBST(T([5, 3, 8])) && isValidBSTInorder(T([5, 3, 8]))],
  ["98 nút sâu vi phạm khoảng của tổ tiên", () => !isValidBST(T([10, 5, 15, null, null, 12, 20, 9])) && !isValidBSTInorder(T([10, 5, 15, null, null, 12, 20, 9])) && isValidBSTParentChild(T([10, 5, 15, null, null, 12, 20, 9]))],
  ["98 giá trị trùng không hợp lệ", () => !isValidBST(T([5, 5])) && !isValidBST(T([5, null, 5]))],
  ["98 một nút bằng 2^31 − 1", () => isValidBST(T([2147483647])) && isValidBSTInorder(T([2147483647]))],
  ["98 hai đầu mút của int", () => isValidBST(T([-2147483648, null, 2147483647]))],
  ["230 nhỏ nhất, giữa, lớn nhất", () => kthSmallest(T([20, 10, 30, 5, 15, 25, 35]), 1) === 5 && kthSmallest(T([20, 10, 30, 5, 15, 25, 35]), 4) === 20 && kthSmallest(T([20, 10, 30, 5, 15, 25, 35]), 7) === 35],
  ["230 cây chỉ có nhánh trái", () => kthSmallest(T([4, 3, null, 2, null, 1]), 2) === 2],
  ["230 cây chỉ có nhánh phải", () => kthSmallest(T([1, null, 2, null, 3]), 3) === 3],
  ["random 300 BST: 235, 98, 230", randomChecks],
  ["98 và 230 trên chuỗi lệch 10^5 nút", () => isValidBSTInorder(chain(100_000)) && kthSmallest(chain(100_000), 99_999) === 99_998],
];

let ok = 0;
for (const [name, f] of cases) { if (f()) ok++; else console.log("SAI:", name); }
console.log(`bst ${ok}/${cases.length} ca đúng`);
console.log(`98 trên 300 cây bị sửa một nút: ${broken} cây hỏng, cách chỉ so cha-con nhận nhầm ${naiveWrong} cây`);

// Đo: BST cân bằng 10^6 nút (giá trị 0, 2, 4, …), cao 20.
function median(f) {
  const ts = [];
  for (let k = 0; k < 5; k++) { const t0 = performance.now(); f(); ts.push(performance.now() - t0); }
  return ts.sort((a, b) => a - b)[2];
}
const N = 1_000_000;
const big = balanced(0, N - 1);
const rand = mulberry32(7);
const pairs = [];
// Cặp hai giá trị liền nhau (v, v + 2): tổ tiên chung nằm sâu, đường đi dài gần bằng chiều cao.
for (let t = 0; t < 1000; t++) { const v = 2 * Math.floor(rand() * (N - 1)); pairs.push([find(big, v), find(big, v + 2)]); }

// Đo 1: 235 đi một đường theo giá trị, so với LCA tổng quát phải thăm cả cây.
const walk = median(() => { for (const [p, q] of pairs) lowestCommonAncestor(big, p, q); }) / pairs.length;
const generic = median(() => { for (let t = 0; t < 5; t++) lcaGeneric(big, pairs[t][0], pairs[t][1]); }) / 5;
console.log(`235 trên BST cân bằng 10^6 nút: đi theo giá trị ${(walk * 1000).toFixed(2)} µs/truy vấn, LCA tổng quát ${generic.toFixed(1)} ms/truy vấn`);

// Đo 2: 230 dừng sớm ở nút thứ k, so với gom cả cây ra mảng. k nhỏ chạy quá nhanh nên lặp 1000 lần rồi chia.
const fmt = (ms) => (ms < 1 ? `${(ms * 1000).toFixed(1)} µs` : `${ms.toFixed(1)} ms`);
for (const k of [10, N / 2]) {
  const reps = k < 1000 ? 1000 : 1;
  const early = median(() => { for (let r = 0; r < reps; r++) kthSmallest(big, k); }) / reps;
  console.log(`230 trên BST cân bằng 10^6 nút, k = ${k}: dừng sớm ${fmt(early)}, gom cả cây ${fmt(median(() => kthSmallestFull(big, k)))}`);
}
