// LC 98 Validate Binary Search Tree: truyền khoảng (đệ quy và lặp), trung thứ tự (đệ quy, lặp, Morris),
// vét cạn max/min, và hai cách sai chạy thật.
// Chạy: node validate-bst.js

class TreeNode {
  constructor(val, left = null, right = null) { this.val = val; this.left = left; this.right = right; }
}

const INT_MIN = -2147483648;
const INT_MAX = 2147483647;

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

function balancedBST(lo, hi) {
  if (lo > hi) return null;
  const mid = (lo + hi) >> 1;
  return new TreeNode(mid, balancedBST(lo, mid - 1), balancedBST(mid + 1, hi));
}

function rightChain(n) {
  let root = null;
  for (let v = n; v >= 1; v--) root = new TreeNode(v, null, root);
  return root;
}

function chainBadBottom(n) {
  const root = rightChain(n - 1);
  let t = root;
  while (t.right !== null) t = t.right;
  t.left = new TreeNode(0);
  return root;
}

// Sai: chỉ so nút với hai con trực tiếp.
function wrongParentChild(root) {
  if (root === null) return true;
  if (root.left !== null && root.left.val >= root.val) return false;
  if (root.right !== null && root.right.val <= root.val) return false;
  return wrongParentChild(root.left) && wrongParentChild(root.right);
}

function scan(node) {
  let mn = Infinity, mx = -Infinity;
  const stack = [node];
  while (stack.length > 0) {
    const t = stack.pop();
    if (t.val < mn) mn = t.val;
    if (t.val > mx) mx = t.val;
    if (t.left !== null) stack.push(t.left);
    if (t.right !== null) stack.push(t.right);
  }
  return [mn, mx];
}

// Cách 1: vét cạn, ở mọi nút max(trái) < nút < min(phải). O(n·h).
function bruteMaxMin(root) {
  if (root === null) return true;
  const stack = [root];
  while (stack.length > 0) {
    const node = stack.pop();
    if (node.left !== null) {
      if (scan(node.left)[1] >= node.val) return false;
      stack.push(node.left);
    }
    if (node.right !== null) {
      if (scan(node.right)[0] <= node.val) return false;
      stack.push(node.right);
    }
  }
  return true;
}

// Cách 2: truyền khoảng mở. -Infinity và Infinity là số thật trong JS, so được với mọi giá trị.
function validBounds(root) {
  const go = (node, lo, hi) => {
    if (node === null) return true;
    if (node.val <= lo || node.val >= hi) return false;
    return go(node.left, lo, node.val) && go(node.right, node.val, hi);
  };
  return go(root, -Infinity, Infinity);
}

// Cách 2b: cùng phép kiểm, ngăn xếp tự quản lý.
function validBoundsIterative(root) {
  if (root === null) return true;
  const stack = [[root, -Infinity, Infinity]];
  while (stack.length > 0) {
    const [node, lo, hi] = stack.pop();
    if (node.val <= lo || node.val >= hi) return false;
    if (node.left !== null) stack.push([node.left, lo, node.val]);
    if (node.right !== null) stack.push([node.right, node.val, hi]);
  }
  return true;
}

// Cách 3: trung thứ tự đệ quy; prev = -Infinity nhỏ hơn mọi giá trị nên không cần cờ.
function validInorder(root) {
  let prev = -Infinity;
  const go = (node) => {
    if (node === null) return true;
    if (!go(node.left)) return false;
    if (node.val <= prev) return false;
    prev = node.val;
    return go(node.right);
  };
  return go(root);
}

// Cách 3b: trung thứ tự lặp.
function validInorderIterative(root) {
  const stack = [];
  let cur = root, prev = -Infinity;
  while (cur !== null || stack.length > 0) {
    while (cur !== null) { stack.push(cur); cur = cur.left; }
    cur = stack.pop();
    if (cur.val <= prev) return false;
    prev = cur.val;
    cur = cur.right;
  }
  return true;
}

// Cách 3c: Morris, bộ nhớ thêm O(1); đi tới hết để gỡ mọi sợi nối tạm.
function validMorris(root) {
  let cur = root, prev = -Infinity, ok = true;
  while (cur !== null) {
    if (cur.left === null) {
      if (cur.val <= prev) ok = false;
      prev = cur.val;
      cur = cur.right;
    } else {
      let p = cur.left;
      while (p.right !== null && p.right !== cur) p = p.right;
      if (p.right === null) { p.right = cur; cur = cur.left; }
      else {
        p.right = null;
        if (cur.val <= prev) ok = false;
        prev = cur.val;
        cur = cur.right;
      }
    }
  }
  return ok;
}

// Sai: cho phép trùng (< thay vì <=).
function wrongAllowDuplicates(root) {
  const go = (node, lo, hi) => {
    if (node === null) return true;
    if (node.val < lo || node.val > hi) return false;
    return go(node.left, lo, node.val) && go(node.right, node.val, hi);
  };
  return go(root, -Infinity, Infinity);
}

const cases = [
  ["một nút", () => build([1]), true],
  ["ba nút đúng", () => build([2, 1, 3]), true],
  ["cháu phải nhỏ hơn ông", () => build([8, 3, 10, null, null, 6, 12]), false],
  ["cháu trái lớn hơn ông", () => build([8, 3, 10, 1, 9]), false],
  ["trùng bên trái", () => build([5, 5]), false],
  ["trùng bên phải", () => build([5, null, 5]), false],
  ["một nút INT_MIN", () => build([INT_MIN]), true],
  ["một nút INT_MAX", () => build([INT_MAX]), true],
  ["INT_MIN rồi INT_MAX", () => build([INT_MIN, null, INT_MAX]), true],
  ["INT_MAX trùng", () => build([INT_MAX, INT_MAX]), false],
  ["cây cân 10^4 nút", () => balancedBST(1, 10000), true],
  ["chuỗi phải 10^4 nút", () => rightChain(10000), true],
  ["chuỗi 10^4 nút, đáy sai", () => chainBadBottom(10000), false],
];

const fns = [
  ["bruteMaxMin", bruteMaxMin],
  ["validBounds", validBounds],
  ["validBoundsIterative", validBoundsIterative],
  ["validInorder", validInorder],
  ["validInorderIterative", validInorderIterative],
  ["validMorris", validMorris],
  ["wrongParentChild", wrongParentChild],
  ["wrongAllowDuplicates", wrongAllowDuplicates],
];

for (const [name, fn] of fns) {
  const bad = [];
  for (const [cname, make, want] of cases) {
    let got;
    try { got = String(fn(make())); } catch (e) { got = "ném " + e.constructor.name; }
    if (got !== String(want)) bad.push(`${cname} → ${got}`);
  }
  console.log(`${name.padEnd(21)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(", ") : ""}`);
}
