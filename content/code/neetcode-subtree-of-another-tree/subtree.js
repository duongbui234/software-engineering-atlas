// LC 572 Subtree of Another Tree: so ở mọi nút O(m·n), tuần tự hóa + tìm chuỗi (có sẵn hoặc KMP),
// hash Merkle kiểm lại khi trùng, đánh số cây con, và lối tắt JSON.stringify.
// Chạy: node subtree.js

class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

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

// Cây lệch trái n nút giá trị 1, nút sâu nhất mang giá trị bottom.
function chain(n, bottom = 1) {
  let root = null;
  for (let i = 0; i < n; i++) root = new TreeNode(i === 0 ? bottom : 1, root);
  return root;
}

// So hai cây (bài 100), bản vòng lặp.
function isSame(p, q) {
  const stack = [p, q];
  while (stack.length > 0) {
    const b = stack.pop(), a = stack.pop();
    if (a === null && b === null) continue;
    if (a === null || b === null || a.val !== b.val) return false;
    stack.push(a.right, b.right, a.left, b.left);
  }
  return true;
}

function preorderNodes(root) {
  const out = [];
  const stack = [root];
  while (stack.length > 0) {
    const n = stack.pop();
    if (n === null) continue;
    out.push(n);
    stack.push(n.right, n.left);
  }
  return out;
}

// Cách 1 (dạng đệ quy quen thuộc).
function isSameRec(p, q) {
  if (p === null || q === null) return p === q;
  return p.val === q.val && isSameRec(p.left, q.left) && isSameRec(p.right, q.right);
}
function isSubtreeRecursive(root, sub) {
  if (root === null) return sub === null;
  return isSameRec(root, sub) || isSubtreeRecursive(root.left, sub) || isSubtreeRecursive(root.right, sub);
}

// Cách 1 (vòng lặp): thử so ở từng nút. O(m·n) xấu nhất.
function isSubtreeNaive(root, sub) {
  if (sub === null) return true;
  return preorderNodes(root).some((n) => isSame(n, sub));
}

// Mỗi nút ",giá trị", mỗi chỗ trống ",#". Dấu phẩy đứng TRƯỚC mỗi phần tử.
function serializeString(root) {
  const parts = [];
  const stack = [root];
  while (stack.length > 0) {
    const n = stack.pop();
    if (n === null) { parts.push(",#"); continue; }
    parts.push("," + n.val);
    stack.push(n.right, n.left);
  }
  return parts.join("");
}

// Cách 2a: tuần tự hóa rồi includes.
function isSubtreeString(root, sub) {
  return serializeString(root).includes(serializeString(sub));
}

const NONE = 1 << 30;
function serializeArray(root) {
  const out = [];
  const stack = [root];
  while (stack.length > 0) {
    const n = stack.pop();
    if (n === null) { out.push(NONE); continue; }
    out.push(n.val);
    stack.push(n.right, n.left);
  }
  return out;
}

function kmpContains(text, pat) {
  const fail = new Int32Array(pat.length);
  for (let i = 1, k = 0; i < pat.length; i++) {
    while (k > 0 && pat[i] !== pat[k]) k = fail[k - 1];
    if (pat[i] === pat[k]) k++;
    fail[i] = k;
  }
  for (let i = 0, k = 0; i < text.length; i++) {
    while (k > 0 && text[i] !== pat[k]) k = fail[k - 1];
    if (text[i] === pat[k]) k++;
    if (k === pat.length) return true;
  }
  return false;
}

// Cách 2b: tuần tự hóa thành mảng số rồi KMP.
function isSubtreeKmp(root, sub) {
  return kmpContains(serializeArray(root), serializeArray(sub));
}

// fmix32 của MurmurHash3; Math.imul nhân 32 bit không mất chính xác.
function fmix32(h) {
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  return (h ^ (h >>> 16)) >>> 0;
}
const NULL_HASH = 0x165667b1;
function nodeHash(val, hl, hr) {
  return fmix32(Math.imul(hl, 0x9e3779b1) ^ Math.imul(hr ^ 0x85ebca6b, 0xc2b2ae35) ^ ((val + 0x27d4eb2f) | 0));
}
function subtreeHashes(root) {
  const hash = new Map();
  const nodes = preorderNodes(root);
  for (let i = nodes.length - 1; i >= 0; i--) {
    const n = nodes[i];
    hash.set(n, nodeHash(n.val, n.left ? hash.get(n.left) : NULL_HASH, n.right ? hash.get(n.right) : NULL_HASH));
  }
  return hash;
}

// Cách 3: hash Merkle, trùng hash thì so lại thật.
function isSubtreeHash(root, sub) {
  if (sub === null) return true;
  const target = subtreeHashes(sub).get(sub);
  for (const [node, h] of subtreeHashes(root)) if (h === target && isSame(node, sub)) return true;
  return false;
}

// Cách 4: đánh số cây con, khóa chuỗi "giá trị,số trái,số phải".
function isSubtreeIds(root, sub) {
  if (sub === null) return true;
  const ids = new Map();
  const idOf = new Map();
  const subNodes = preorderNodes(sub);
  for (let i = subNodes.length - 1; i >= 0; i--) {
    const n = subNodes[i];
    const key = `${n.val},${n.left ? idOf.get(n.left) : 0},${n.right ? idOf.get(n.right) : 0}`;
    if (!ids.has(key)) ids.set(key, ids.size + 1);
    idOf.set(n, ids.get(key));
  }
  const target = idOf.get(sub);
  const rootNodes = preorderNodes(root);
  for (let i = rootNodes.length - 1; i >= 0; i--) {
    const n = rootNodes[i];
    const l = n.left ? idOf.get(n.left) : 0, r = n.right ? idOf.get(n.right) : 0;
    const id = l < 0 || r < 0 ? -1 : (ids.get(`${n.val},${l},${r}`) ?? -1);
    if (id === target) return true;
    idOf.set(n, id);
  }
  return false;
}

// Lối tắt: JSON.stringify có ngoặc và null nên là một cách tuần tự hóa đúng, nhưng nó đệ quy và includes có thể chậm.
function isSubtreeJson(root, sub) {
  return JSON.stringify(root).includes(JSON.stringify(sub));
}

// SAI: dấu phẩy chỉ đứng SAU mỗi phần tử.
function wrongNoLeadingDelimiter(root, sub) {
  const s = (t) => serializeString(t).slice(1) + ",";
  return s(root).includes(s(sub));
}

const cases = [
  ["khớp nhánh trái", build([7, 8, 9, 4, 5]), build([8, 4, 5]), true],
  ["nút 5 có thêm con", build([7, 8, 9, 4, 5, null, null, null, null, 6]), build([8, 4, 5]), false],
  ["12 và 2", build([12]), build([2]), false],
  ["-3 và 3", build([-3]), build([3]), false],
  ["trùng cả cây", build([1, 2, 3]), build([1, 2, 3]), true],
  ["sub là lá", build([1, 2, 3]), build([3]), true],
  ["lá và nút có con", build([1, 2, 3, null, null, 4]), build([3]), false],
  ["giá trị lặp", build([1, 1]), build([1]), true],
  ["trái và phải", build([1, 2]), build([1, null, 2]), false],
  ["cùng tổng giá trị", build([1, 2, 3]), build([3, 1, 2]), false],
  ["số âm", build([-1, -2, -3]), build([-3]), true],
  ["trùng Objects.hash", build([1, 1]), build([1, null, 961]), false],
  ["lệch 2000 và 1000", chain(2000), chain(1000), true],
  ["lệch, đáy khác", chain(2000), chain(1000, 2), false],
];

const fns = [isSubtreeRecursive, isSubtreeNaive, isSubtreeString, isSubtreeKmp, isSubtreeHash, isSubtreeIds, isSubtreeJson,
  wrongNoLeadingDelimiter];
for (const fn of fns) {
  const bad = [];
  for (const [name, root, sub, want] of cases) {
    let got;
    try { got = String(fn(root, sub)); } catch (e) { got = "ném " + e.constructor.name; }
    if (got !== String(want)) bad.push(`${name} → ${got}`);
  }
  console.log(`${fn.name.padEnd(24)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(", ") : ""}`);
}

// JSON.stringify đi cây bằng đệ quy: cây lệch 10⁴ nút đã vượt ngăn xếp mặc định của Node.
for (const m of [4000, 10000]) {
  let got;
  try { got = String(isSubtreeJson(chain(m), chain(10))); } catch (e) { got = `ném ${e.constructor.name}`; }
  const kmp = isSubtreeKmp(chain(m), chain(10));
  console.log(`cây lệch ${m} nút: isSubtreeJson → ${got}, isSubtreeKmp → ${kmp}`);
}
