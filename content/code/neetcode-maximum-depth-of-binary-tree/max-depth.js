// LC 104 Maximum Depth of Binary Tree: đệ quy hậu thứ tự, DFS bằng ngăn xếp tự quản, BFS đếm tầng.
// Chạy: node max-depth.js

class TreeNode {
  constructor(val) { this.val = val; this.left = null; this.right = null; }
}

// Dựng cây từ mảng theo tầng kiểu LeetCode, ví dụ [1, null, 2]: null là chỗ trống.
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

// Cách 1: đệ quy. Độ sâu = 1 + độ sâu lớn hơn của hai cây con; cây rỗng sâu 0.
function maxDepthRecursive(root) {
  if (root === null) return 0;
  return 1 + Math.max(maxDepthRecursive(root.left), maxDepthRecursive(root.right));
}

// Cách 2: DFS với ngăn xếp tự quản; mỗi nút đi kèm độ sâu của nó.
function maxDepthStack(root) {
  if (root === null) return 0;
  const nodes = [root], depths = [1];
  let best = 0;
  while (nodes.length > 0) {
    const node = nodes.pop(), d = depths.pop();
    if (d > best) best = d;
    if (node.left !== null) { nodes.push(node.left); depths.push(d + 1); }
    if (node.right !== null) { nodes.push(node.right); depths.push(d + 1); }
  }
  return best;
}

// Cách 3: BFS theo tầng; số vòng ngoài là độ sâu.
function maxDepthBfs(root) {
  if (root === null) return 0;
  let level = [root], depth = 0;
  while (level.length > 0) {
    depth++;
    const next = [];
    for (const node of level) {
      if (node.left !== null) next.push(node.left);
      if (node.right !== null) next.push(node.right);
    }
    level = next;
  }
  return depth;
}

// SAI: viết gọn bằng `&&`. Với root là null, `root && …` trả về chính null chứ không phải 0.
// Bên trong vẫn chạy đúng vì `Math.max(null, null)` đổi null thành 0, chỉ cây rỗng ở ngoài cùng ra null.
const wrongShortCircuit = (root) => root && 1 + Math.max(wrongShortCircuit(root.left), wrongShortCircuit(root.right));

const cases = [
  ["cây rỗng", [], 0],
  ["một nút", [5], 1],
  ["chỉ có con phải", [1, null, 2], 2],
  ["cây đủ 3 tầng", [1, 2, 3, 4, 5, 6, 7], 3],
  ["nhánh sâu bên phải", [8, 3, 10, 1, 6, null, 14, null, null, 4, 7, 13], 4],
  ["chuỗi trái 6 nút", [1, 2, null, 3, null, 4, null, 5, null, 6], 6],
  ["zigzag 5 tầng", [1, 2, null, null, 3, 4, null, null, 5], 5],
  ["giá trị âm và 0", [0, -1, -2, null, -3], 3],
];

const fns = [maxDepthRecursive, maxDepthStack, maxDepthBfs, wrongShortCircuit];
for (const fn of fns) {
  const bad = [];
  for (const [name, vals, want] of cases) {
    const got = fn(fromLevel(vals));
    if (got !== want) bad.push(`${name} → ${got} (đúng là ${want})`);
  }
  console.log(`${fn.name.padEnd(18)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(", ") : ""}`);
}

// Chuỗi lệch trái d nút: độ sâu bằng số nút, ca xấu nhất cho đệ quy.
function chain(d) {
  const root = new TreeNode(0);
  let cur = root;
  for (let i = 1; i < d; i++) { cur.left = new TreeNode(i); cur = cur.left; }
  return root;
}
console.log("");
for (const d of [10_000, 100_000]) {
  for (const fn of [maxDepthRecursive, maxDepthStack]) {
    let out;
    try { out = String(fn(chain(d))); } catch (e) { out = "ném " + e.constructor.name + ": " + e.message; }
    console.log(`chuỗi ${d} nút, ${fn.name}: ${out}`);
  }
}
