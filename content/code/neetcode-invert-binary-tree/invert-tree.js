// LC 226 Invert Binary Tree: đổi chỗ hai con ở mọi nút, bằng đệ quy, ngăn xếp tự quản, hoặc BFS theo tầng.
// Chạy: node invert-tree.js

class TreeNode {
  constructor(val) { this.val = val; this.left = null; this.right = null; }
}

// Dựng cây từ mảng theo tầng kiểu LeetCode, ví dụ [2, 1, 3]: null là chỗ trống.
function fromLevel(vals) {
  if (vals.length === 0 || vals[0] === null) return null;
  const root = new TreeNode(vals[0]);
  const queue = [root];
  let head = 0, i = 1;
  while (i < vals.length) {
    const node = queue[head++];
    for (const side of ["left", "right"]) {
      const v = i < vals.length ? vals[i] : null;
      if (v !== null) { const child = new TreeNode(v); node[side] = child; queue.push(child); }
      i++;
    }
  }
  return root;
}

// Đọc cây ra mảng theo tầng (bỏ các null ở cuối).
function toLevel(root) {
  const out = [], queue = [root];
  for (let head = 0; head < queue.length; head++) {
    const node = queue[head];
    out.push(node === null ? null : node.val);
    if (node !== null) queue.push(node.left, node.right);
  }
  while (out.length > 0 && out[out.length - 1] === null) out.pop();
  return out;
}

// Cách 1: đệ quy, gán phá cấu trúc: vế phải được tính xong hết rồi mới gán.
function invertRecursive(root) {
  if (root === null) return null;
  [root.left, root.right] = [invertRecursive(root.right), invertRecursive(root.left)];
  return root;
}

// Cách 2: ngăn xếp tự quản.
function invertStack(root) {
  const stack = root === null ? [] : [root];
  while (stack.length > 0) {
    const node = stack.pop();
    [node.left, node.right] = [node.right, node.left];
    if (node.left !== null) stack.push(node.left);
    if (node.right !== null) stack.push(node.right);
  }
  return root;
}

// Cách 3: BFS theo tầng bằng mảng + chỉ số đầu.
function invertBfs(root) {
  const queue = root === null ? [] : [root];
  for (let head = 0; head < queue.length; head++) {
    const node = queue[head];
    [node.left, node.right] = [node.right, node.left];
    if (node.left !== null) queue.push(node.left);
    if (node.right !== null) queue.push(node.right);
  }
  return root;
}

// SAI: cùng cách 2 nhưng viết kiểu không chấm phẩy. Dòng bắt đầu bằng `[` bị nối vào dòng trên:
// JavaScript đọc thành `const node = stack.pop()[node.left, node.right] = [...]`,
// tức dùng node ngay trong câu khai báo nó, và ném ReferenceError.
/* eslint-disable */
function wrongNoSemicolon(root) {
  const stack = root === null ? [] : [root]
  while (stack.length > 0) {
    const node = stack.pop()
    [node.left, node.right] = [node.right, node.left]
    if (node.left !== null) stack.push(node.left)
    if (node.right !== null) stack.push(node.right)
  }
  return root
}
/* eslint-enable */

const cases = [
  ["cây rỗng", [], []],
  ["một nút", [1], [1]],
  ["chỉ có con trái", [1, 2], [1, null, 2]],
  ["ba nút", [2, 1, 3], [2, 3, 1]],
  ["cây đủ 3 tầng", [5, 3, 8, 1, 4, 7, 9], [5, 8, 3, 9, 7, 4, 1]],
  ["chuỗi trái thành chuỗi phải", [1, 2, null, 3], [1, null, 2, null, 3]],
  ["lệch hai bên", [1, 2, 3, null, 4, null, 5], [1, 3, 2, 5, null, 4]],
  ["giá trị âm và 0", [0, -1, null, -2, -3], [0, null, -1, -3, -2]],
];

for (const fn of [invertRecursive, invertStack, invertBfs, wrongNoSemicolon]) {
  const bad = [];
  for (const [name, input, want] of cases) {
    let got;
    try { got = JSON.stringify(toLevel(fn(fromLevel(input)))); } catch (e) { got = "ném " + e.constructor.name; }
    if (got !== JSON.stringify(want)) bad.push(`${name} → ${got}`);
  }
  console.log(`${fn.name.padEnd(16)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(", ") : ""}`);
}
try { wrongNoSemicolon(fromLevel([1])); } catch (e) { console.log(`\nwrongNoSemicolon([1]): ${e.constructor.name}: ${e.message}`); }
