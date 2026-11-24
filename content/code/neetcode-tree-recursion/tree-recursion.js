// Ga LINK-03: đệ quy trên cây. Giải 226, 104, 543, 110, 100, 572.
// Chạy: node tree-recursion.js

class TreeNode {
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

// Ngược lại: cây → mảng theo tầng, bỏ các null ở cuối.
function toLevel(root) {
  const out = [];
  const queue = [root];
  for (let q = 0; q < queue.length; q++) {
    const node = queue[q];
    out.push(node ? node.val : null);
    if (node) queue.push(node.left, node.right);
  }
  while (out.length && out[out.length - 1] === null) out.pop();
  return out;
}

// 226: đổi chỗ hai con ở mọi nút. Thứ tự duyệt nào cũng được, miễn đi hết mọi nút.
function invertTree(root) {
  if (!root) return null;
  const left = invertTree(root.left);
  root.left = invertTree(root.right);
  root.right = left;
  return root;
}

// 104: chiều cao = 1 + chiều cao con cao hơn. Cây rỗng cao 0.
function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}

// 104 không đệ quy: ngăn xếp tự quản lý giữ (nút, độ sâu), không phụ thuộc call stack.
function maxDepthIter(root) {
  let best = 0;
  const stack = root ? [[root, 1]] : [];
  while (stack.length) {
    const [node, d] = stack.pop();
    if (d > best) best = d;
    if (node.left) stack.push([node.left, d + 1]);
    if (node.right) stack.push([node.right, d + 1]);
  }
  return best;
}

// 543: hàm đệ quy TRẢ VỀ chiều cao, còn đường kính được GHI vào biến ngoài ở mỗi nút.
function diameterOfBinaryTree(root) {
  let best = 0;
  const height = (node) => {
    if (!node) return 0;
    const l = height(node.left), r = height(node.right);
    best = Math.max(best, l + r); // đường dài nhất đi qua node: xuống trái l cạnh, xuống phải r cạnh
    return 1 + Math.max(l, r);
  };
  height(root);
  return best;
}

// 543 không đệ quy: hậu thứ tự bằng ngăn xếp, cờ "đã thăm con" quyết định khi nào tính nút.
function diameterIter(root) {
  if (!root) return 0;
  const h = new Map([[null, 0]]);
  const stack = [[root, false]];
  let best = 0;
  while (stack.length) {
    const [node, childrenDone] = stack.pop();
    if (childrenDone) {
      const l = h.get(node.left), r = h.get(node.right);
      best = Math.max(best, l + r);
      h.set(node, 1 + Math.max(l, r));
    } else {
      stack.push([node, true]);
      if (node.right) stack.push([node.right, false]);
      if (node.left) stack.push([node.left, false]);
    }
  }
  return best;
}

// 110: trả chiều cao, hoặc -1 làm giá trị canh nghĩa là "đã lệch ở đâu đó bên dưới".
function isBalanced(root) {
  const check = (node) => {
    if (!node) return 0;
    const l = check(node.left);
    if (l === -1) return -1;
    const r = check(node.right);
    if (r === -1 || Math.abs(l - r) > 1) return -1;
    return 1 + Math.max(l, r);
  };
  return check(root) !== -1;
}

// 100: đệ quy trên hai cây cùng lúc, đi song song từng cặp nút.
function isSameTree(p, q) {
  if (!p || !q) return p === q;
  return p.val === q.val && isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}

// 572: thử mọi nút của root làm gốc, mỗi lần so cả cây bằng isSameTree. O(m · n) trường hợp xấu nhất.
function isSubtree(root, sub) {
  if (!root) return sub === null;
  return isSameTree(root, sub) || isSubtree(root.left, sub) || isSubtree(root.right, sub);
}

// Bản ngây thơ để so: tính lại chiều cao từ đầu ở mỗi nút, O(n²) trên cây lệch.
function heightSlow(node) {
  return node ? 1 + Math.max(heightSlow(node.left), heightSlow(node.right)) : 0;
}
function diameterSlow(node) {
  if (!node) return 0;
  return Math.max(heightSlow(node.left) + heightSlow(node.right), diameterSlow(node.left), diameterSlow(node.right));
}
function balancedSlow(node) {
  if (!node) return true;
  return Math.abs(heightSlow(node.left) - heightSlow(node.right)) <= 1 && balancedSlow(node.left) && balancedSlow(node.right);
}

// Bộ sinh ngẫu nhiên mulberry32: trạng thái 32 bit, mọi phép nhân qua Math.imul nên không mất chính xác.
function mulberry32(a) {
  return () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

// Cây ngẫu nhiên n nút: mỗi nút mới đi từ gốc, rẽ trái hoặc phải ngẫu nhiên tới chỗ trống đầu tiên.
function randomTree(n, rand) {
  let root = null;
  for (let k = 0; k < n; k++) {
    const node = new TreeNode(Math.floor(rand() * 3));
    if (!root) { root = node; continue; }
    let p = root;
    for (;;) {
      if (rand() < 0.5) { if (!p.left) { p.left = node; break; } p = p.left; }
      else { if (!p.right) { p.right = node; break; } p = p.right; }
    }
  }
  return root;
}

function nodes(root) {
  const out = [];
  const stack = root ? [root] : [];
  while (stack.length) { const n = stack.pop(); out.push(n); if (n.left) stack.push(n.left); if (n.right) stack.push(n.right); }
  return out;
}

function clone(root) {
  return root ? new TreeNode(root.val, clone(root.left), clone(root.right)) : null;
}

// Cây lệch hẳn sang trái: n nút nối thành một chuỗi, chiều cao n.
function chain(n) {
  let root = null;
  for (let k = 0; k < n; k++) root = new TreeNode(k, root, null);
  return root;
}

function randomCasesAgree() {
  const rand = mulberry32(42);
  for (let t = 0; t < 300; t++) {
    const root = randomTree(Math.floor(rand() * 40), rand);
    if (maxDepth(root) !== maxDepthIter(root)) return false;
    if (diameterOfBinaryTree(root) !== diameterSlow(root) || diameterIter(root) !== diameterSlow(root)) return false;
    if (isBalanced(root) !== balancedSlow(root)) return false;
    const copy = clone(root);
    if (!isSameTree(invertTree(invertTree(copy)), root)) return false;
    const all = nodes(root);
    if (all.length && !isSubtree(root, clone(all[Math.floor(rand() * all.length)]))) return false;
  }
  return true;
}

const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const T = fromLevel;

const checks = [
  ["226 ví dụ của đề", () => eq(toLevel(invertTree(T([4, 2, 7, 1, 3, 6, 9]))), [4, 7, 2, 9, 6, 3, 1])],
  ["226 cây rỗng", () => invertTree(null) === null],
  ["104 ví dụ của đề", () => maxDepth(T([3, 9, 20, null, null, 15, 7])) === 3],
  ["104 chỉ có nhánh phải", () => maxDepth(T([1, null, 2])) === 2],
  ["543 ví dụ của đề", () => diameterOfBinaryTree(T([1, 2, 3, 4, 5])) === 3],
  ["543 hai nút", () => diameterOfBinaryTree(T([1, 2])) === 1],
  ["543 đường dài nhất không qua gốc", () => diameterOfBinaryTree(T([1, 2, null, 3, 4, 5, null, null, 6])) === 4],
  ["110 cây cân bằng", () => isBalanced(T([3, 9, 20, null, null, 15, 7])) === true],
  ["110 lệch ở nhánh trái", () => isBalanced(T([1, 2, 2, 3, 3, null, null, 4, 4])) === false],
  ["110 gốc cân nhưng con lệch", () => isBalanced(T([1, 2, 2, 3, null, null, 3, 4, null, null, 4])) === false],
  ["100 hai cây giống nhau", () => isSameTree(T([1, 2, 3]), T([1, 2, 3])) === true],
  ["100 cùng giá trị, khác hình", () => isSameTree(T([1, 2]), T([1, null, 2])) === false],
  ["572 có cây con", () => isSubtree(T([3, 4, 5, 1, 2]), T([4, 1, 2])) === true],
  ["572 khớp đầu nhưng thừa nút dưới", () => isSubtree(T([3, 4, 5, 1, 2, null, null, null, null, 0]), T([4, 1, 2])) === false],
  ["300 cây ngẫu nhiên khớp bản chậm", randomCasesAgree],
  ["chuỗi lệch 100 000 nút, bản lặp", () => maxDepthIter(chain(100_000)) === 100_000 && diameterIter(chain(100_000)) === 99_999],
];

const bad = checks.filter(([, f]) => !f()).map(([n]) => n);
console.log(`tree-recursion ${checks.length - bad.length}/${checks.length} ca đúng${bad.length ? "; sai ở " + bad.join(", ") : ""}`);

// Đo 1: cây lệch sâu bao nhiêu thì bản đệ quy tràn call stack (RangeError). Tìm nhị phân trên n.
function survives(n) {
  const root = chain(n);
  try { maxDepth(root); return true; } catch (e) { if (e instanceof RangeError) return false; throw e; }
}
let lo = 1000, hi = 1_000_000;
while (lo < hi) { const mid = Math.ceil((lo + hi) / 2); if (survives(mid)) lo = mid; else hi = mid - 1; }
console.log(`104 đệ quy trên cây lệch: chịu được ${lo} nút, ${lo + 1} nút thì RangeError`);

// Đo 2: cây ngẫu nhiên 10^6 nút (cao vài chục tầng), đệ quy so với ngăn xếp tự quản lý. Trung vị 5 lần.
function median(f) {
  const ts = [];
  for (let k = 0; k < 5; k++) { const t0 = performance.now(); f(); ts.push(performance.now() - t0); }
  return ts.sort((a, b) => a - b)[2];
}
const big = randomTree(1_000_000, mulberry32(7));
console.log(`543 trên cây ngẫu nhiên 10^6 nút (cao ${maxDepthIter(big)}): đệ quy ${median(() => diameterOfBinaryTree(big)).toFixed(1)} ms, ngăn xếp ${median(() => diameterIter(big)).toFixed(1)} ms`);

// Đo 3: bản ngây thơ tính lại chiều cao ở mỗi nút, O(n²) trên chuỗi lệch; bản trả chiều cao lên chỉ O(n).
for (const n of [1000, 2000, 4000]) {
  const c = chain(n);
  diameterSlow(c); diameterOfBinaryTree(c); // chạy nóng một lần trước khi đo
  let t0 = performance.now(); diameterSlow(c); const slow = performance.now() - t0;
  t0 = performance.now(); diameterOfBinaryTree(c); const fast = performance.now() - t0;
  console.log(`543 trên chuỗi ${n} nút: tính lại chiều cao ${slow.toFixed(2)} ms, trả chiều cao lên ${fast.toFixed(2)} ms`);
}
