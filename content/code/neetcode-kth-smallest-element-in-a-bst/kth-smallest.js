// LC 230 Kth Smallest Element in a BST: sắp xếp, trung thứ tự hết cây, trung thứ tự dừng sớm (đệ quy và ngăn xếp),
// Morris, và cây có cỡ cây con cho câu hỏi phụ "chèn/xóa liên tục".
// Chạy: node kth-smallest.js

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

function leftChain(n) {
  let root = null;
  for (let v = 1; v <= n; v++) { const t = new TreeNode(v); t.left = root; root = t; }
  return root;
}

function rightChain(n) {
  let root = null;
  for (let v = n; v >= 1; v--) { const t = new TreeNode(v); t.right = root; root = t; }
  return root;
}

// Cách 1: gom mọi giá trị, sắp xếp CÓ hàm so sánh, lấy phần tử k-1. O(n log n).
function kthSort(root, k) {
  const vals = [], stack = root ? [root] : [];
  while (stack.length > 0) {
    const node = stack.pop();
    vals.push(node.val);
    if (node.left !== null) stack.push(node.left);
    if (node.right !== null) stack.push(node.right);
  }
  vals.sort((a, b) => a - b);
  return vals[k - 1];
}

// Cách 2: trung thứ tự đệ quy gom hết (dãy tăng), lấy phần tử k-1. O(n).
function kthInorderAll(root, k) {
  const out = [];
  const walk = (node) => {
    if (node === null) return;
    walk(node.left);
    out.push(node.val);
    walk(node.right);
  };
  walk(root);
  return out[k - 1];
}

// Cách 3: trung thứ tự đệ quy, đếm và dừng khi đủ k. O(h + k).
function kthRecursive(root, k) {
  let count = 0, answer = -1;
  const walk = (node) => {
    if (node === null || count >= k) return;
    walk(node.left);
    if (count >= k) return;
    count++;
    if (count === k) { answer = node.val; return; }
    walk(node.right);
  };
  walk(root);
  return answer;
}

// Cách 4: trung thứ tự bằng ngăn xếp tự quản lý, lấy ra đủ k nút. O(h + k).
function kthIterative(root, k) {
  const stack = [];
  let node = root;
  for (;;) {
    while (node !== null) { stack.push(node); node = node.left; }
    node = stack.pop();
    if (--k === 0) return node.val;
    node = node.right;
  }
}

// Cách 5: Morris, O(1) bộ nhớ. Chỉ dừng khi đã có đáp án và không còn sợi chỉ nào.
function kthMorris(root, k) {
  let cur = root, count = 0, answer = -1, pending = 0;
  while (cur !== null) {
    if (cur.left === null) {
      if (++count === k) answer = cur.val;
      if (count >= k && pending === 0) break;
      cur = cur.right;
    } else {
      let pred = cur.left;
      while (pred.right !== null && pred.right !== cur) pred = pred.right;
      if (pred.right === null) { pred.right = cur; pending++; cur = cur.left; } // buộc chỉ
      else {
        pred.right = null; pending--;                                          // gỡ chỉ
        if (++count === k) answer = cur.val;
        if (count >= k && pending === 0) break;
        cur = cur.right;
      }
    }
  }
  return answer;
}

// Cách 6 (câu hỏi phụ): mỗi nút nhớ cỡ cây con.
class SizedNode {
  constructor(val) { this.val = val; this.left = null; this.right = null; this.size = 1; }
}
const sizeOf = (n) => (n === null ? 0 : n.size);

function kthBySize(root, k) {
  let node = root;
  for (;;) {
    const leftSize = sizeOf(node.left);
    if (k <= leftSize) node = node.left;
    else if (k === leftSize + 1) return node.val;
    else { k -= leftSize + 1; node = node.right; }
  }
}

function insertSized(node, v) {
  if (node === null) return new SizedNode(v);
  if (v < node.val) node.left = insertSized(node.left, v);
  else node.right = insertSized(node.right, v);
  node.size++;
  return node;
}

function removeSized(node, v) {
  if (v < node.val) node.left = removeSized(node.left, v);
  else if (v > node.val) node.right = removeSized(node.right, v);
  else {
    if (node.left === null) return node.right;
    if (node.right === null) return node.left;
    let succ = node.right;
    while (succ.left !== null) succ = succ.left;
    node.val = succ.val;
    node.right = removeSized(node.right, succ.val);
  }
  node.size = 1 + sizeOf(node.left) + sizeOf(node.right);
  return node;
}

// Chép cây thường thành cây có size, không đệ quy.
function augment(root) {
  if (root === null) return null;
  const top = new SizedNode(root.val);
  const order = [], stack = [[root, top]];
  while (stack.length > 0) {
    const [t, s] = stack.pop();
    order.push(s);
    if (t.left !== null) { s.left = new SizedNode(t.left.val); stack.push([t.left, s.left]); }
    if (t.right !== null) { s.right = new SizedNode(t.right.val); stack.push([t.right, s.right]); }
  }
  for (let i = order.length - 1; i >= 0; i--) order[i].size = 1 + sizeOf(order[i].left) + sizeOf(order[i].right);
  return top;
}

const kthAugmented = (root, k) => kthBySize(augment(root), k);

// SAI: sort() không có hàm so sánh so theo chuỗi: "10" < "2".
function wrongSortNoComparator(root, k) {
  const vals = [], stack = root ? [root] : [];
  while (stack.length > 0) {
    const node = stack.pop();
    vals.push(node.val);
    if (node.left !== null) stack.push(node.left);
    if (node.right !== null) stack.push(node.right);
  }
  vals.sort();
  return vals[k - 1];
}

// SAI: if (l) coi đáp án 0 là "chưa thấy".
function wrongFalsyZero(root, k) {
  let count = 0;
  const walk = (node) => {
    if (node === null) return null;
    const l = walk(node.left);
    if (l) return l;
    if (++count === k) return node.val;
    return walk(node.right);
  };
  return walk(root);
}

const cases = [
  ["một nút, k = 1", () => build([9]), 1, 9],
  ["cây đầy 7 nút, k = 1", () => build([8, 4, 12, 2, 6, 10, 14]), 1, 2],
  ["cây đầy 7 nút, k = 4 (gốc)", () => build([8, 4, 12, 2, 6, 10, 14]), 4, 8],
  ["cây đầy 7 nút, k = 7", () => build([8, 4, 12, 2, 6, 10, 14]), 7, 14],
  ["có giá trị 0, k = 1", () => build([3, 1, 5, 0, 2, 4, 6]), 1, 0],
  ["có giá trị 0, k = 2", () => build([3, 1, 5, 0, 2, 4, 6]), 2, 1],
  ["đáp án trong cây con phải của con trái, k = 3", () => build([10, 5, 15, null, 7, null, 20, 6, 8]), 3, 7],
  ["chuỗi lệch trái 10⁴ nút, k = 1", () => leftChain(10000), 1, 1],
  ["chuỗi lệch trái 10⁴ nút, k = 5000", () => leftChain(10000), 5000, 5000],
  ["chuỗi lệch phải 10⁴ nút, k = 10⁴", () => rightChain(10000), 10000, 10000],
];

const fns = [kthSort, kthInorderAll, kthRecursive, kthIterative, kthMorris, kthAugmented, wrongSortNoComparator, wrongFalsyZero];
for (const fn of fns) {
  const bad = [];
  for (const [name, make, k, want] of cases) {
    let got;
    try { got = String(fn(make(), k)); } catch (e) { got = "ném " + e.constructor.name; }
    if (got !== String(want)) bad.push(`${name} → ${got}`);
  }
  console.log(`${fn.name.padEnd(21)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(", ") : ""}`);
}

// Câu hỏi phụ: chèn, xóa và hỏi xen kẽ trên cây có size, đối chiếu với một mảng luôn sắp xếp.
{
  let seed = 7;
  const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
  let root = null;
  const sorted = [];
  let queries = 0, ok = 0;
  for (let op = 0; op < 5000; op++) {
    const r = rnd();
    if (sorted.length === 0 || r < 0.45) {
      const v = Math.floor(rnd() * 10001);
      if (sorted.includes(v)) continue;
      root = insertSized(root, v);
      let i = 0;
      while (i < sorted.length && sorted[i] < v) i++;
      sorted.splice(i, 0, v);
    } else if (r < 0.7) {
      const i = Math.floor(rnd() * sorted.length);
      root = removeSized(root, sorted[i]);
      sorted.splice(i, 1);
    } else {
      const k = 1 + Math.floor(rnd() * sorted.length);
      queries++;
      if (kthBySize(root, k) === sorted[k - 1] && sizeOf(root) === sorted.length) ok++;
    }
  }
  console.log(`\ncây có size: 5000 thao tác chèn/xóa/hỏi ngẫu nhiên, ${ok}/${queries} câu hỏi khớp mảng sắp xếp`);
}
