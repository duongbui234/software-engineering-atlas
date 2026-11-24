// LC 226 Invert Binary Tree: đổi chỗ hai con ở mọi nút, bằng đệ quy, ngăn xếp tự quản, hoặc BFS theo tầng.
// Chạy: node invert-tree.ts

class TreeNode {
  val: number;
  left: TreeNode | null = null;
  right: TreeNode | null = null;
  constructor(val: number) { this.val = val; }
}

// Dựng cây từ mảng theo tầng kiểu LeetCode, ví dụ [2, 1, 3]: null là chỗ trống.
function fromLevel(vals: (number | null)[]): TreeNode | null {
  if (vals.length === 0 || vals[0] === null) return null;
  const root = new TreeNode(vals[0]);
  const queue: TreeNode[] = [root];
  let head = 0, i = 1;
  while (i < vals.length) {
    const node = queue[head++];
    for (const side of ["left", "right"] as const) {
      const v = i < vals.length ? vals[i] : null;
      if (v !== null) { const child = new TreeNode(v); node[side] = child; queue.push(child); }
      i++;
    }
  }
  return root;
}

// Đọc cây ra mảng theo tầng (bỏ các null ở cuối), cùng định dạng với đầu vào.
function toLevel(root: TreeNode | null): (number | null)[] {
  const out: (number | null)[] = [];
  const queue: (TreeNode | null)[] = [root];
  for (let head = 0; head < queue.length; head++) {
    const node = queue[head];
    out.push(node === null ? null : node.val);
    if (node !== null) queue.push(node.left, node.right);
  }
  while (out.length > 0 && out[out.length - 1] === null) out.pop();
  return out;
}

// Cách 1: đệ quy. Đảo hai cây con rồi gắn chéo. Gán phá cấu trúc tính cả vế phải trước khi gán,
// nên không cần biến tạm. O(n) thời gian, O(h) ngăn xếp gọi hàm.
function invertRecursive(root: TreeNode | null): TreeNode | null {
  if (root === null) return null;
  [root.left, root.right] = [invertRecursive(root.right), invertRecursive(root.left)];
  return root;
}

// Cách 2: ngăn xếp tự quản. Thứ tự thăm không quan trọng: mỗi nút chỉ cần được đổi hai con đúng một lần.
function invertStack(root: TreeNode | null): TreeNode | null {
  const stack: TreeNode[] = root === null ? [] : [root];
  while (stack.length > 0) {
    const node = stack.pop()!;
    const tmp = node.left;
    node.left = node.right;
    node.right = tmp;
    if (node.left !== null) stack.push(node.left);
    if (node.right !== null) stack.push(node.right);
  }
  return root;
}

// Cách 3: BFS theo tầng bằng hàng đợi (mảng + chỉ số đầu, vì shift() là O(n)).
function invertBfs(root: TreeNode | null): TreeNode | null {
  const queue: TreeNode[] = root === null ? [] : [root];
  for (let head = 0; head < queue.length; head++) {
    const node = queue[head];
    const tmp = node.left;
    node.left = node.right;
    node.right = tmp;
    if (node.left !== null) queue.push(node.left);
    if (node.right !== null) queue.push(node.right);
  }
  return root;
}

// SAI: hai câu gán nối tiếp. Câu thứ hai đọc root.left lúc đã bị ghi đè, nên đảo lại chính cây con phải:
// hai con cùng trỏ vào cây con phải cũ, cây con trái cũ mất hẳn.
function wrongOverwrite(root: TreeNode | null): TreeNode | null {
  if (root === null) return null;
  root.left = wrongOverwrite(root.right);
  root.right = wrongOverwrite(root.left);
  return root;
}

// SAI: đổi ở giữa (trung thứ tự). Sau khi đổi, root.right là cây con trái cũ, vừa được đảo xong,
// nên nó bị đảo lần hai (về lại như cũ), còn cây con phải cũ không được đảo lần nào.
function wrongInOrder(root: TreeNode | null): TreeNode | null {
  if (root === null) return null;
  wrongInOrder(root.left);
  const tmp = root.left;
  root.left = root.right;
  root.right = tmp;
  wrongInOrder(root.right);
  return root;
}

// Bộ sinh ngẫu nhiên mulberry32: trạng thái 32 bit, mọi phép nhân qua Math.imul nên không mất chính xác.
function mulberry32(seed: number): () => number {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const cases: [string, (number | null)[], (number | null)[]][] = [
  ["cây rỗng", [], []],
  ["một nút", [1], [1]],
  ["chỉ có con trái", [1, 2], [1, null, 2]],
  ["ba nút", [2, 1, 3], [2, 3, 1]],
  ["cây đủ 3 tầng", [5, 3, 8, 1, 4, 7, 9], [5, 8, 3, 9, 7, 4, 1]],
  ["chuỗi trái thành chuỗi phải", [1, 2, null, 3], [1, null, 2, null, 3]],
  ["lệch hai bên", [1, 2, 3, null, 4, null, 5], [1, 3, 2, 5, null, 4]],
  ["giá trị âm và 0", [0, -1, null, -2, -3], [0, null, -1, -3, -2]],
];

const fns = [invertRecursive, invertStack, invertBfs, wrongOverwrite, wrongInOrder];
for (const fn of fns) {
  const bad: string[] = [];
  for (const [name, input, want] of cases) {
    const got = JSON.stringify(toLevel(fn(fromLevel(input))));
    if (got !== JSON.stringify(want)) bad.push(`${name} → ${got}`);
  }
  console.log(`${fn.name.padEnd(16)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(", ") : ""}`);
}

// Đối chiếu ngẫu nhiên với một "gương" độc lập: viết cây ra chuỗi theo thứ tự phải → gốc → trái.
// Cây đã đảo, viết theo thứ tự trái → gốc → phải, phải ra đúng chuỗi đó.
const ser = (t: TreeNode | null): string => (t === null ? "#" : `(${ser(t.left)} ${t.val} ${ser(t.right)})`);
const serMirror = (t: TreeNode | null): string => (t === null ? "#" : `(${serMirror(t.right)} ${t.val} ${serMirror(t.left)})`);
function randomTree(rnd: () => number, n: number): TreeNode | null {
  if (n === 0) return null;
  const root = new TreeNode(0);
  const slots: [TreeNode, "left" | "right"][] = [[root, "left"], [root, "right"]];
  for (let i = 1; i < n; i++) {
    const j = Math.floor(rnd() * slots.length);
    const [parent, side] = slots[j];
    slots[j] = slots[slots.length - 1];
    slots.pop();
    const node = new TreeNode(i);
    parent[side] = node;
    slots.push([node, "left"], [node, "right"]);
  }
  return root;
}
{
  const rnd = mulberry32(226);
  const T = 2000;
  const ok = [0, 0, 0];
  for (let t = 0; t < T; t++) {
    const n = Math.floor(rnd() * 41);
    const seedTree = Math.floor(rnd() * 2 ** 31);
    fns.slice(0, 3).forEach((fn, j) => {
      const root = randomTree(mulberry32(seedTree), n); // mỗi cách đảo một bản riêng của cùng một cây
      const want = serMirror(root);
      if (ser(fn(root)) === want) ok[j]++;
    });
  }
  console.log(`\nngẫu nhiên: ${fns.slice(0, 3).map((f, j) => `${f.name} ${ok[j]}/${T}`).join(", ")}`);
}

function median(fn: () => void, reps: number): number {
  const ts: number[] = [];
  for (let r = 0; r < reps; r++) { const t0 = performance.now(); fn(); ts.push(performance.now() - t0); }
  ts.sort((x, y) => x - y);
  return ts[Math.floor(reps / 2)];
}
function tryTime(fn: (r: TreeNode | null) => TreeNode | null, root: TreeNode): string {
  try { return median(() => fn(root), 5).toFixed(2); } catch (e) { return (e as Error).constructor.name; }
}

// Đảo năm lần liên tiếp vẫn là một phép đảo hợp lệ, nên đo thẳng trên cùng một cây.
{
  const n = (1 << 20) - 1;
  const nodes = Array.from({ length: n }, (_, i) => new TreeNode(i));
  for (let i = 0; 2 * i + 2 < n; i++) { nodes[i].left = nodes[2 * i + 1]; nodes[i].right = nodes[2 * i + 2]; }
  console.log(`\nCây đầy đủ ${n} nút, trung vị 5 lần (ms)`);
  for (const fn of fns.slice(0, 3)) console.log(`${fn.name.padEnd(16)} ${tryTime(fn, nodes[0]).padStart(8)}`);
}
{
  console.log("\nChuỗi lệch trái d nút, trung vị 5 lần (ms)");
  console.log("d          đệ quy   ngăn xếp        BFS");
  for (const d of [1_000, 10_000, 100_000]) {
    const root = new TreeNode(0);
    let cur = root;
    for (let i = 1; i < d; i++) { cur.left = new TreeNode(i); cur = cur.left; }
    const row = fns.slice(0, 3).map((fn) => tryTime(fn, root));
    console.log(`${String(d).padEnd(8)} ${row.map((x) => x.padStart(10)).join(" ")}`);
  }
}
