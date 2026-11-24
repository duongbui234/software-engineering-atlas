// LC 104 Maximum Depth of Binary Tree: đệ quy hậu thứ tự, DFS bằng ngăn xếp tự quản, BFS đếm tầng.
// Chạy: node max-depth.ts

class TreeNode {
  val: number;
  left: TreeNode | null = null;
  right: TreeNode | null = null;
  constructor(val: number) { this.val = val; }
}

// Dựng cây từ mảng theo tầng kiểu LeetCode, ví dụ [1, null, 2]: null là chỗ trống.
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

// Cách 1: đệ quy. Độ sâu = 1 + độ sâu lớn hơn của hai cây con; cây rỗng sâu 0. O(n) thời gian, O(h) ngăn xếp.
function maxDepthRecursive(root: TreeNode | null): number {
  if (root === null) return 0;
  return 1 + Math.max(maxDepthRecursive(root.left), maxDepthRecursive(root.right));
}

// Cách 2: DFS với ngăn xếp tự quản; mỗi nút đi kèm độ sâu của nó. Không dùng ngăn xếp gọi hàm.
function maxDepthStack(root: TreeNode | null): number {
  if (root === null) return 0;
  const nodes: TreeNode[] = [root];
  const depths: number[] = [1];
  let best = 0;
  while (nodes.length > 0) {
    const node = nodes.pop()!;
    const d = depths.pop()!;
    if (d > best) best = d;
    if (node.left !== null) { nodes.push(node.left); depths.push(d + 1); }
    if (node.right !== null) { nodes.push(node.right); depths.push(d + 1); }
  }
  return best;
}

// Cách 3: BFS theo tầng. Mỗi vòng ngoài xử lý trọn một tầng, nên số vòng chính là độ sâu.
function maxDepthBfs(root: TreeNode | null): number {
  if (root === null) return 0;
  let level: TreeNode[] = [root];
  let depth = 0;
  while (level.length > 0) {
    depth++;
    const next: TreeNode[] = [];
    for (const node of level) {
      if (node.left !== null) next.push(node.left);
      if (node.right !== null) next.push(node.right);
    }
    level = next;
  }
  return depth;
}

// SAI: BFS tăng độ sâu mỗi lần lấy ra một nút thay vì mỗi tầng, nên thực ra đếm số nút.
function wrongBfsPerNode(root: TreeNode | null): number {
  if (root === null) return 0;
  const queue: TreeNode[] = [root];
  let head = 0, depth = 0;
  while (head < queue.length) {
    const node = queue[head++];
    depth++;
    if (node.left !== null) queue.push(node.left);
    if (node.right !== null) queue.push(node.right);
  }
  return depth;
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

const cases: [string, (number | null)[], number][] = [
  ["cây rỗng", [], 0],
  ["một nút", [5], 1],
  ["chỉ có con phải", [1, null, 2], 2],
  ["cây đủ 3 tầng", [1, 2, 3, 4, 5, 6, 7], 3],
  ["nhánh sâu bên phải", [8, 3, 10, 1, 6, null, 14, null, null, 4, 7, 13], 4],
  ["chuỗi trái 6 nút", [1, 2, null, 3, null, 4, null, 5, null, 6], 6],
  ["zigzag 5 tầng", [1, 2, null, null, 3, 4, null, null, 5], 5],
  ["giá trị âm và 0", [0, -1, -2, null, -3], 3],
];

const fns = [maxDepthRecursive, maxDepthStack, maxDepthBfs, wrongBfsPerNode];
for (const fn of fns) {
  const bad: string[] = [];
  for (const [name, vals, want] of cases) {
    const got = fn(fromLevel(vals));
    if (got !== want) bad.push(`${name} → ${got} (đúng là ${want})`);
  }
  console.log(`${fn.name.padEnd(18)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(", ") : ""}`);
}

// Cây ngẫu nhiên n nút: mỗi nút mới gắn vào một chỗ trống chọn ngẫu nhiên. Độ sâu đúng được ghi lại lúc dựng.
function randomTree(rnd: () => number, n: number): [TreeNode | null, number] {
  if (n === 0) return [null, 0];
  const root = new TreeNode(0);
  const slots: [TreeNode, "left" | "right", number][] = [[root, "left", 2], [root, "right", 2]];
  let depth = 1;
  for (let i = 1; i < n; i++) {
    const j = Math.floor(rnd() * slots.length);
    const [parent, side, d] = slots[j];
    slots[j] = slots[slots.length - 1];
    slots.pop();
    const node = new TreeNode(i);
    parent[side] = node;
    if (d > depth) depth = d;
    slots.push([node, "left", d + 1], [node, "right", d + 1]);
  }
  return [root, depth];
}
{
  const rnd = mulberry32(104);
  const T = 2000;
  const ok = [0, 0, 0];
  for (let t = 0; t < T; t++) {
    const [root, want] = randomTree(rnd, Math.floor(rnd() * 41));
    fns.slice(0, 3).forEach((fn, j) => { if (fn(root) === want) ok[j]++; });
  }
  console.log(`\nngẫu nhiên: ${fns.slice(0, 3).map((f, j) => `${f.name} ${ok[j]}/${T}`).join(", ")}`);
}

// Chuỗi lệch trái d nút: cây xấu nhất cho đệ quy, độ sâu bằng số nút.
function chain(d: number): TreeNode {
  const root = new TreeNode(0);
  let cur = root;
  for (let i = 1; i < d; i++) { cur.left = new TreeNode(i); cur = cur.left; }
  return root;
}
function median(fn: () => void, reps: number): number {
  const ts: number[] = [];
  for (let r = 0; r < reps; r++) { const t0 = performance.now(); fn(); ts.push(performance.now() - t0); }
  ts.sort((x, y) => x - y);
  return ts[Math.floor(reps / 2)];
}
function tryTime(fn: (r: TreeNode) => number, root: TreeNode, want: number): string {
  try {
    let got = 0;
    const ms = median(() => { got = fn(root); }, 5);
    return got === want ? ms.toFixed(2) : `sai ${got}`;
  } catch (e) {
    return (e as Error).constructor.name;
  }
}

console.log("\nChuỗi lệch trái d nút, trung vị 5 lần (ms)");
console.log("d          đệ quy   ngăn xếp        BFS");
for (const d of [1_000, 10_000, 100_000, 1_000_000]) {
  const root = chain(d);
  const row = [maxDepthRecursive, maxDepthStack, maxDepthBfs].map((fn) => tryTime(fn, root, d));
  console.log(`${String(d).padEnd(8)} ${row.map((x) => x.padStart(10)).join(" ")}`);
}

// Tìm độ sâu lớn nhất mà bản đệ quy chịu được (chia đôi), sau khi hàm đã được JIT tối ưu ở phần trên.
{
  let lo = 1_000, hi = 1_000_000;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    try { maxDepthRecursive(chain(mid)); lo = mid; } catch { hi = mid; }
  }
  console.log(`đệ quy chịu được tối đa ${lo} tầng (ngăn xếp mặc định của Node)`);
}

// Cây đầy đủ 2^20 − 1 nút (khoảng 10⁶), cao 20 tầng: cả ba cách đều an toàn, chỉ so tốc độ.
{
  const n = (1 << 20) - 1;
  const nodes = Array.from({ length: n }, (_, i) => new TreeNode(i));
  for (let i = 0; 2 * i + 1 < n; i++) { nodes[i].left = nodes[2 * i + 1]; nodes[i].right = nodes[2 * i + 2]; }
  console.log(`\nCây đầy đủ ${n} nút, trung vị 5 lần (ms)`);
  for (const fn of [maxDepthRecursive, maxDepthStack, maxDepthBfs]) {
    console.log(`${fn.name.padEnd(18)} ${tryTime(fn, nodes[0], 20).padStart(8)}`);
  }
}
