// LC 102 Binary Tree Level Order Traversal: BFS chụp kích thước tầng, BFS hai danh sách,
// BFS có vạch ngăn tầng, DFS mang độ sâu; ba cách sai chạy thật; đo shift() và chỉ số đầu hàng.
// Chạy: node level-order.ts

class TreeNode {
  val: number;
  left: TreeNode | null = null;
  right: TreeNode | null = null;
  constructor(val: number) { this.val = val; }
}

// Dựng cây từ mảng theo tầng kiểu LeetCode: null là chỗ trống.
function build(arr: (number | null)[]): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]);
  const queue: TreeNode[] = [root];
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

// Chuỗi lệch trái n nút: mỗi tầng một nút, cây sâu n tầng.
function leftChain(n: number): TreeNode | null {
  let root: TreeNode | null = null;
  for (let v = n; v >= 1; v--) { const t = new TreeNode(v); t.left = root; root = t; }
  return root;
}

// Cách 1: BFS, chụp kích thước tầng trước khi lấy ra. Hàng đợi là mảng + chỉ số đầu hàng.
function levelSnapshot(root: TreeNode | null): number[][] {
  const res: number[][] = [];
  if (root === null) return res;
  const queue: TreeNode[] = [root];
  let head = 0;
  while (head < queue.length) {
    const size = queue.length - head; // số nút của tầng này, chụp lại trước khi đẩy con vào
    const level: number[] = [];
    for (let i = 0; i < size; i++) {
      const node = queue[head++];
      level.push(node.val);
      if (node.left !== null) queue.push(node.left);
      if (node.right !== null) queue.push(node.right);
    }
    res.push(level);
  }
  return res;
}

// Cách 1 nhưng lấy ra bằng shift(): đúng, chỉ để đo.
function levelSnapshotShift(root: TreeNode | null): number[][] {
  const res: number[][] = [];
  if (root === null) return res;
  const queue: TreeNode[] = [root];
  while (queue.length > 0) {
    const size = queue.length;
    const level: number[] = [];
    for (let i = 0; i < size; i++) {
      const node = queue.shift()!;
      level.push(node.val);
      if (node.left !== null) queue.push(node.left);
      if (node.right !== null) queue.push(node.right);
    }
    res.push(level);
  }
  return res;
}

// Cách 2: hai danh sách. Tầng hiện tại sinh ra tầng sau; không cần hàng đợi.
function levelTwoLists(root: TreeNode | null): number[][] {
  const res: number[][] = [];
  let cur: TreeNode[] = root === null ? [] : [root];
  while (cur.length > 0) {
    res.push(cur.map((n) => n.val));
    const next: TreeNode[] = [];
    for (const node of cur) {
      if (node.left !== null) next.push(node.left);
      if (node.right !== null) next.push(node.right);
    }
    cur = next;
  }
  return res;
}

// Cách 3: vạch ngăn tầng. null trong hàng đợi nghĩa là "hết một tầng".
function levelMarker(root: TreeNode | null): number[][] {
  const res: number[][] = [];
  if (root === null) return res;
  const queue: (TreeNode | null)[] = [root, null];
  let head = 0;
  let level: number[] = [];
  while (head < queue.length) {
    const node = queue[head++];
    if (node === null) {
      res.push(level);
      level = [];
      if (head < queue.length) queue.push(null); // còn tầng sau thì đặt vạch cho nó
    } else {
      level.push(node.val);
      if (node.left !== null) queue.push(node.left);
      if (node.right !== null) queue.push(node.right);
    }
  }
  return res;
}

// Cách 4: DFS tiền thứ tự mang độ sâu. Trái trước phải, nên mỗi tầng tự xếp từ trái sang.
function levelDfs(root: TreeNode | null): number[][] {
  const res: number[][] = [];
  const go = (node: TreeNode | null, depth: number): void => {
    if (node === null) return;
    if (res.length === depth) res.push([]); // lần đầu xuống tới tầng này
    res[depth].push(node.val);
    go(node.left, depth + 1);
    go(node.right, depth + 1);
  };
  go(root, 0);
  return res;
}

// Sai 1: không chụp kích thước tầng. queue.length - head đổi ngay khi đẩy con vào.
function wrongLiveLength(root: TreeNode | null): number[][] {
  const res: number[][] = [];
  if (root === null) return res;
  const queue: TreeNode[] = [root];
  let head = 0;
  while (head < queue.length) {
    const level: number[] = [];
    for (let i = 0; i < queue.length - head; i++) {
      const node = queue[head++];
      level.push(node.val);
      if (node.left !== null) queue.push(node.left);
      if (node.right !== null) queue.push(node.right);
    }
    res.push(level);
  }
  return res;
}

// Sai 2: DFS đi phải trước trái: đủ tầng nhưng mỗi tầng bị đảo.
function wrongRightFirst(root: TreeNode | null): number[][] {
  const res: number[][] = [];
  const go = (node: TreeNode | null, depth: number): void => {
    if (node === null) return;
    if (res.length === depth) res.push([]);
    res[depth].push(node.val);
    go(node.right, depth + 1);
    go(node.left, depth + 1);
  };
  go(root, 0);
  return res;
}

// Sai 3: cây rỗng trả null thay vì [].
function wrongEmptyNull(root: TreeNode | null): number[][] | null {
  if (root === null) return null;
  return levelSnapshot(root);
}

// ---------- ca chạy thử ----------

const limitArr: number[] = Array.from({ length: 2000 }, (_, i) => (i * 37) % 2001 - 1000);
function splitLevels(arr: number[]): number[][] {
  const out: number[][] = [];
  for (let start = 0, w = 1; start < arr.length; start += w, w *= 2) out.push(arr.slice(start, start + w));
  return out;
}

type Case = { name: string; tree: () => TreeNode | null; want: number[][] };
const cases: Case[] = [
  { name: "cây rỗng", tree: () => null, want: [] },
  { name: "một nút", tree: () => build([7]), want: [[7]] },
  { name: "ba tầng có chỗ trống", tree: () => build([5, 2, 8, null, 4, 7, 9]), want: [[5], [2, 8], [4, 7, 9]] },
  { name: "chỉ con trái", tree: () => build([1, 2, null, 3, null, 4]), want: [[1], [2], [3], [4]] },
  { name: "chỉ con phải", tree: () => build([1, null, 2, null, 3]), want: [[1], [2], [3]] },
  { name: "cây đầy 15 nút", tree: () => build(Array.from({ length: 15 }, (_, i) => i + 1)),
    want: [[1], [2, 3], [4, 5, 6, 7], [8, 9, 10, 11, 12, 13, 14, 15]] },
  { name: "nhánh so le", tree: () => build([1, 2, 3, 4, null, null, 5, 6, null, null, 7]),
    want: [[1], [2, 3], [4, 5], [6, 7]] },
  { name: "giá trị âm và trùng", tree: () => build([0, -1000, 1000, -1000, null, null, 1000]),
    want: [[0], [-1000, 1000], [-1000, 1000]] },
  { name: "cây đủ 2000 nút", tree: () => build(limitArr), want: splitLevels(limitArr) },
  { name: "chuỗi trái 2000 nút", tree: () => leftChain(2000), want: Array.from({ length: 2000 }, (_, i) => [i + 1]) },
];

function same(a: unknown, b: unknown): boolean { return JSON.stringify(a) === JSON.stringify(b); }
function short(x: unknown): string {
  const s = JSON.stringify(x);
  return s === undefined ? String(x) : s.length > 40 ? s.slice(0, 37) + "..." : s;
}

function run(name: string, fn: (r: TreeNode | null) => unknown): void {
  let ok = 0;
  const bad: string[] = [];
  for (const c of cases) {
    try {
      const got = fn(c.tree());
      if (same(got, c.want)) ok++;
      else bad.push(`${c.name} → ${short(got)}`);
    } catch (e) {
      bad.push(`${c.name} → ném ${(e as Error).constructor.name}`);
    }
  }
  console.log(`${name.padEnd(18)} ${ok}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(", ") : ""}`);
}

run("levelSnapshot", levelSnapshot);
run("levelSnapshotShift", levelSnapshotShift);
run("levelTwoLists", levelTwoLists);
run("levelMarker", levelMarker);
run("levelDfs", levelDfs);
run("wrongLiveLength", wrongLiveLength);
run("wrongRightFirst", wrongRightFirst);
run("wrongEmptyNull", wrongEmptyNull);

// ---------- đối chiếu ngẫu nhiên ----------

function mulberry32(seed: number): () => number {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(42);
function randomTree(n: number): TreeNode | null {
  if (n === 0) return null;
  const nodes: TreeNode[] = [new TreeNode(Math.floor(rand() * 2001) - 1000)];
  while (nodes.length < n) {
    const parent = nodes[Math.floor(rand() * nodes.length)];
    const child = new TreeNode(Math.floor(rand() * 2001) - 1000);
    if (rand() < 0.5) { if (parent.left === null) { parent.left = child; nodes.push(child); } }
    else if (parent.right === null) { parent.right = child; nodes.push(child); }
  }
  return nodes[0];
}
let agree = 0;
const RANDOM = 3000;
for (let t = 0; t < RANDOM; t++) {
  const root = randomTree(Math.floor(rand() * 60));
  const a = levelSnapshot(root);
  if (same(a, levelTwoLists(root)) && same(a, levelMarker(root)) && same(a, levelDfs(root)) && same(a, levelSnapshotShift(root))) agree++;
}
console.log(`\nđối chiếu ${RANDOM} cây ngẫu nhiên 0..59 nút: năm cách khớp nhau ${agree}/${RANDOM}`);

// ---------- đo ----------

function complete(n: number): TreeNode | null { return build(Array.from({ length: n }, (_, i) => i)); }
function median(xs: number[]): number { const s = [...xs].sort((a, b) => a - b); return s[s.length >> 1]; }
function time(fn: (r: TreeNode | null) => unknown, root: TreeNode | null): number {
  const xs: number[] = [];
  for (let k = 0; k < 5; k++) { const t0 = performance.now(); fn(root); xs.push(performance.now() - t0); }
  return median(xs);
}

console.log("\nthời gian trung vị 5 lần (ms), cây đầy");
console.log("n".padStart(9) + "  rộng nhất" + "  chụp tầng" + "  shift()" + "  hai danh sách" + "  vạch ngăn" + "     DFS");
for (const n of [2000, (1 << 14) - 1, (1 << 15) - 1, (1 << 17) - 1]) {
  const root = complete(n);
  for (const fn of [levelSnapshot, levelSnapshotShift, levelTwoLists, levelMarker, levelDfs]) fn(root); // làm nóng
  const width = levelSnapshot(root).reduce((m, l) => Math.max(m, l.length), 0);
  console.log(
    String(n).padStart(9) + String(width).padStart(11) +
    time(levelSnapshot, root).toFixed(2).padStart(11) + time(levelSnapshotShift, root).toFixed(2).padStart(9) +
    time(levelTwoLists, root).toFixed(2).padStart(15) + time(levelMarker, root).toFixed(2).padStart(11) +
    time(levelDfs, root).toFixed(2).padStart(8),
  );
}

// shift() lấy hết một mảng từ đầu: giá mỗi lần lấy theo cỡ mảng.
console.log("\nlấy hết một mảng bằng shift(): ns mỗi lần");
for (const N of [4000, 16000, 16384, 65536]) {
  const a = Array.from({ length: N }, (_, i) => i);
  const t0 = performance.now();
  let s = 0;
  while (a.length > 0) s += a.shift()!;
  const t = performance.now() - t0;
  console.log(`${String(N).padStart(6)} phần tử: ${((t * 1e6) / N).toFixed(0).padStart(5)} ns mỗi shift()`);
}
