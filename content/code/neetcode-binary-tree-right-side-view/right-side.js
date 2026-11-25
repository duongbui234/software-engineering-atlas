// LC 199 Binary Tree Right Side View: BFS chụp cỡ tầng (lấy nút cuối), BFS phải trước (lấy nút đầu),
// DFS phải trước (ghi khi gặp tầng mới), DFS trái trước ghi đè, và ba cách sai chạy thật.
// Chạy: node right-side.js

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
  for (let v = n; v >= 1; v--) { const t = new TreeNode(v); t.left = root; root = t; }
  return root;
}

function complete(n) {
  return build(Array.from({ length: n }, (_, i) => i + 1));
}

// Cách 1: BFS, chụp cỡ tầng; nút cuối của tầng là nút nhìn thấy.
function bfsLast(root) {
  const res = [];
  if (root === null) return res;
  let queue = [root];
  while (queue.length > 0) {
    const size = queue.length;               // chụp cỡ tầng
    const next = [];
    for (let i = 0; i < size; i++) {
      const node = queue[i];
      if (i === size - 1) res.push(node.val);
      if (node.left) next.push(node.left);
      if (node.right) next.push(node.right);
    }
    queue = next;
  }
  return res;
}

// Cách 2: BFS đẩy con phải trước; nút đầu của tầng là nút nhìn thấy.
function bfsRightFirst(root) {
  const res = [];
  if (root === null) return res;
  const queue = [root];
  let head = 0;                              // chỉ số đầu hàng đợi thay cho shift()
  while (head < queue.length) {
    const size = queue.length - head;
    res.push(queue[head].val);
    for (let i = 0; i < size; i++) {
      const node = queue[head++];
      if (node.right) queue.push(node.right);
      if (node.left) queue.push(node.left);
    }
  }
  return res;
}

// Cách 3: DFS phải trước; nút đầu tiên chạm tới độ sâu mới là nút nhìn thấy.
function dfsRightFirst(root) {
  const res = [];
  const go = (node, depth) => {
    if (node === null) return;
    if (depth === res.length) res.push(node.val);
    go(node.right, depth + 1);
    go(node.left, depth + 1);
  };
  go(root, 0);
  return res;
}

// Cách 3b: DFS phải trước, bản lặp.
function dfsRightFirstIterative(root) {
  const res = [];
  if (root === null) return res;
  const stack = [[root, 0]];
  while (stack.length > 0) {
    const [node, depth] = stack.pop();
    if (depth === res.length) res.push(node.val);
    if (node.left) stack.push([node.left, depth + 1]);   // đẩy trái trước để phải được lấy ra trước
    if (node.right) stack.push([node.right, depth + 1]);
  }
  return res;
}

// Cách 4: DFS trái trước, ghi đè res[depth].
function dfsOverwrite(root) {
  const res = [];
  const go = (node, depth) => {
    if (node === null) return;
    res[depth] = node.val;
    go(node.left, depth + 1);
    go(node.right, depth + 1);
  };
  go(root, 0);
  return res;
}

// SAI: chỉ đi theo con trỏ phải.
function wrongRightPointers(root) {
  const res = [];
  for (let node = root; node !== null; node = node.right) res.push(node.val);
  return res;
}

// SAI: DFS trái trước mà vẫn ghi lần đầu gặp tầng.
function wrongLeftFirst(root) {
  const res = [];
  const go = (node, depth) => {
    if (node === null) return;
    if (depth === res.length) res.push(node.val);
    go(node.left, depth + 1);
    go(node.right, depth + 1);
  };
  go(root, 0);
  return res;
}

// SAI: không chụp cỡ tầng; queue.length đổi theo shift/push.
function wrongLiveLength(root) {
  const res = [];
  if (root === null) return res;
  const queue = [root];
  while (queue.length > 0) {
    let last = queue[0];
    for (let i = 0; i < queue.length; i++) {
      const node = queue.shift();
      last = node;
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    res.push(last.val);
  }
  return res;
}

const cases = [
  { name: "cây rỗng", make: () => build([]), want: [] },
  { name: "một nút", make: () => build([7]), want: [7] },
  { name: "cây đầy 7 nút", make: () => build([1, 2, 3, 4, 5, 6, 7]), want: [1, 3, 7] },
  { name: "nhánh trái sâu hơn", make: () => build([1, 2, 3, 4]), want: [1, 3, 4] },
  { name: "chỉ có nhánh trái", make: () => build([1, 2, null, 3]), want: [1, 2, 3] },
  { name: "chỉ có nhánh phải", make: () => build([1, null, 2, null, 3]), want: [1, 2, 3] },
  { name: "đáy nằm dưới cây con trái", make: () => build([1, 2, 3, null, 5, null, null, 6]), want: [1, 3, 5, 6] },
  { name: "zíc zắc", make: () => build([1, 2, 3, 4, null, null, null, null, 5]), want: [1, 3, 4, 5] },
  { name: "giá trị âm và biên", make: () => build([0, -100, 100, -50]), want: [0, 100, -50] },
  { name: "chuỗi trái 100 nút", make: () => leftChain(100), want: Array.from({ length: 100 }, (_, i) => i + 1) },
  { name: "cây đầy đủ 100 nút", make: () => complete(100), want: [1, 3, 7, 15, 31, 63, 100] },
];

const fns = [
  ["bfsLast", bfsLast],
  ["bfsRightFirst", bfsRightFirst],
  ["dfsRightFirst", dfsRightFirst],
  ["dfsRightFirstIterative", dfsRightFirstIterative],
  ["dfsOverwrite", dfsOverwrite],
  ["wrongRightPointers", wrongRightPointers],
  ["wrongLeftFirst", wrongLeftFirst],
  ["wrongLiveLength", wrongLiveLength],
];

const show = (a) => a.length > 8 ? `[${a.slice(0, 3).join(",")},…,${a.at(-1)}] (${a.length} số)` : `[${a.join(",")}]`;

for (const [name, fn] of fns) {
  const bad = [];
  for (const c of cases) {
    let got;
    try { got = show(fn(c.make())); } catch (e) { got = "ném " + e.constructor.name; }
    if (got !== show(c.want)) bad.push(`${c.name} → ${got}`);
  }
  const ok = cases.length - bad.length;
  console.log(`${name.padEnd(22)} ${ok}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(", ") : ""}`);
}

// Đối chiếu ngẫu nhiên (cùng bộ sinh mulberry32 seed 42 với bản TypeScript).
function mulberry32(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = mulberry32(42);
function randomTree(n) {
  if (n === 0) return null;
  const root = new TreeNode(Math.floor(rnd() * 201) - 100);
  const all = [root];
  while (all.length < n) {
    const p = all[Math.floor(rnd() * all.length)];
    const t = new TreeNode(Math.floor(rnd() * 201) - 100);
    if (rnd() < 0.5) { if (!p.left) { p.left = t; all.push(t); } }
    else if (!p.right) { p.right = t; all.push(t); }
  }
  return root;
}
let agree = 0, rightWrong = 0;
const TRIALS = 3000;
for (let t = 0; t < TRIALS; t++) {
  const root = randomTree(Math.floor(rnd() * 31));
  const ref = show(bfsLast(root));
  if ([bfsRightFirst, dfsRightFirst, dfsRightFirstIterative, dfsOverwrite].every((f) => show(f(root)) === ref)) agree++;
  if (show(wrongRightPointers(root)) !== ref) rightWrong++;
}
console.log(`\nđối chiếu ${TRIALS} cây ngẫu nhiên 0..30 nút: năm cách đúng khớp nhau ${agree}/${TRIALS}; wrongRightPointers sai ${rightWrong} cây`);
