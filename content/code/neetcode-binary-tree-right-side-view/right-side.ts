// LC 199 Binary Tree Right Side View: BFS chụp cỡ tầng (lấy nút cuối), BFS phải trước (lấy nút đầu),
// DFS phải trước (ghi khi gặp tầng mới), DFS trái trước ghi đè, và ba cách sai chạy thật.
// Chạy: node right-side.ts

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

// Chuỗi lệch trái n nút: 1 → 2 → … → n, mỗi nút chỉ có con trái.
function leftChain(n: number): TreeNode | null {
  let root: TreeNode | null = null;
  for (let v = n; v >= 1; v--) { const t = new TreeNode(v); t.left = root; root = t; }
  return root;
}

// Cây đầy đủ (complete) n nút, giá trị 1..n theo thứ tự tầng.
function complete(n: number): TreeNode | null {
  return build(Array.from({ length: n }, (_, i) => i + 1));
}

// Cách 1: BFS, chụp cỡ tầng trước khi lấy ra, nút cuối của tầng là nút nhìn thấy.
function bfsLast(root: TreeNode | null): number[] {
  const res: number[] = [];
  if (root === null) return res;
  let queue: TreeNode[] = [root];
  while (queue.length > 0) {
    const size = queue.length;              // chụp cỡ tầng: chỉ chừng này nút thuộc tầng hiện tại
    const next: TreeNode[] = [];
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

// Cách 2: BFS đẩy con phải trước con trái, nút đầu của tầng là nút nhìn thấy.
function bfsRightFirst(root: TreeNode | null): number[] {
  const res: number[] = [];
  if (root === null) return res;
  const queue: TreeNode[] = [root];
  let head = 0;                            // chỉ số đầu hàng đợi thay cho shift()
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

// Cách 3: DFS phải trước; nút đầu tiên chạm tới một độ sâu mới là nút nhìn thấy.
function dfsRightFirst(root: TreeNode | null): number[] {
  const res: number[] = [];
  const go = (node: TreeNode | null, depth: number): void => {
    if (node === null) return;
    if (depth === res.length) res.push(node.val);
    go(node.right, depth + 1);
    go(node.left, depth + 1);
  };
  go(root, 0);
  return res;
}

// Cách 3b: DFS phải trước, bản lặp với ngăn xếp tự quản lý (không giới hạn độ sâu).
function dfsRightFirstIterative(root: TreeNode | null): number[] {
  const res: number[] = [];
  if (root === null) return res;
  const stack: [TreeNode, number][] = [[root, 0]];
  while (stack.length > 0) {
    const [node, depth] = stack.pop()!;
    if (depth === res.length) res.push(node.val);
    if (node.left) stack.push([node.left, depth + 1]);   // đẩy trái trước để phải được lấy ra trước
    if (node.right) stack.push([node.right, depth + 1]);
  }
  return res;
}

// Cách 4: DFS trái trước nhưng ghi đè res[depth]; lần ghi cuối ở mỗi tầng là nút phải nhất.
function dfsOverwrite(root: TreeNode | null): number[] {
  const res: number[] = [];
  const go = (node: TreeNode | null, depth: number): void => {
    if (node === null) return;
    res[depth] = node.val;
    go(node.left, depth + 1);
    go(node.right, depth + 1);
  };
  go(root, 0);
  return res;
}

// SAI: chỉ đi theo con trỏ phải từ gốc.
function wrongRightPointers(root: TreeNode | null): number[] {
  const res: number[] = [];
  for (let node = root; node !== null; node = node.right) res.push(node.val);
  return res;
}

// SAI: DFS trái trước mà vẫn ghi "lần đầu gặp tầng": ra góc nhìn bên trái.
function wrongLeftFirst(root: TreeNode | null): number[] {
  const res: number[] = [];
  const go = (node: TreeNode | null, depth: number): void => {
    if (node === null) return;
    if (depth === res.length) res.push(node.val);
    go(node.left, depth + 1);
    go(node.right, depth + 1);
  };
  go(root, 0);
  return res;
}

// SAI: không chụp cỡ tầng; điều kiện vòng for đọc lại queue.length mỗi lượt trong khi shift/push làm nó đổi.
function wrongLiveLength(root: TreeNode | null): number[] {
  const res: number[] = [];
  if (root === null) return res;
  const queue: TreeNode[] = [root];
  while (queue.length > 0) {
    let last = queue[0];
    for (let i = 0; i < queue.length; i++) {
      const node = queue.shift()!;
      last = node;
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    res.push(last.val);
  }
  return res;
}

type Case = { name: string; make: () => TreeNode | null; want: number[] };
const cases: Case[] = [
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

const fns: [string, (r: TreeNode | null) => number[]][] = [
  ["bfsLast", bfsLast],
  ["bfsRightFirst", bfsRightFirst],
  ["dfsRightFirst", dfsRightFirst],
  ["dfsRightFirstIterative", dfsRightFirstIterative],
  ["dfsOverwrite", dfsOverwrite],
  ["wrongRightPointers", wrongRightPointers],
  ["wrongLeftFirst", wrongLeftFirst],
  ["wrongLiveLength", wrongLiveLength],
];

const show = (a: number[]) => a.length > 8 ? `[${a.slice(0, 3).join(",")},…,${a.at(-1)}] (${a.length} số)` : `[${a.join(",")}]`;

for (const [name, fn] of fns) {
  const bad: string[] = [];
  for (const c of cases) {
    let got: string;
    try { got = show(fn(c.make())); } catch (e) { got = "ném " + (e as Error).constructor.name; }
    if (got !== show(c.want)) bad.push(`${c.name} → ${got}`);
  }
  const ok = cases.length - bad.length;
  console.log(`${name.padEnd(22)} ${ok}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(", ") : ""}`);
}

// Đối chiếu ngẫu nhiên: cây 0..30 nút, hình dạng ngẫu nhiên, giá trị −100..100.
function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = mulberry32(42);
function randomTree(n: number): TreeNode | null {
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

// Bộ nhớ: hàng đợi BFS lớn nhất bao nhiêu, ngăn xếp DFS sâu nhất bao nhiêu.
function maxQueue(root: TreeNode | null): number {
  let queue = root ? [root] : [], best = queue.length;
  while (queue.length > 0) {
    const next: TreeNode[] = [];
    for (const n of queue) { if (n.left) next.push(n.left); if (n.right) next.push(n.right); }
    best = Math.max(best, next.length);
    queue = next;
  }
  return best;
}
function height(root: TreeNode | null): number {
  let h = 0, queue = root ? [root] : [];
  while (queue.length > 0) {
    h++;
    const next: TreeNode[] = [];
    for (const n of queue) { if (n.left) next.push(n.left); if (n.right) next.push(n.right); }
    queue = next;
  }
  return h;
}
console.log("\nbộ nhớ phụ: hàng đợi BFS lớn nhất (nút) và độ sâu DFS lớn nhất (tầng)");
for (const [name, make] of [
  ["cây đầy đủ 100 nút", () => complete(100)],
  ["chuỗi trái 100 nút", () => leftChain(100)],
  ["cây đầy đủ 2^20 − 1 nút", () => complete(2 ** 20 - 1)],
  ["chuỗi trái 10^5 nút", () => leftChain(100000)],
] as const) {
  const r = make();
  console.log(`${name.padEnd(24)} BFS ${String(maxQueue(r)).padStart(7)}   DFS ${String(height(r)).padStart(7)}`);
}

// Thời gian: hàng đợi bằng shift() so với mảng mới mỗi tầng và chỉ số đầu, trên cây đầy đủ cỡ tăng gấp đôi.
function bfsShift(root: TreeNode | null): number[] {
  const res: number[] = [];
  if (root === null) return res;
  const queue: TreeNode[] = [root];
  while (queue.length > 0) {
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const node = queue.shift()!;
      if (i === size - 1) res.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }
  return res;
}
function median(fn: () => void, runs = 5): number {
  const ts: number[] = [];
  for (let i = 0; i < runs; i++) { const t0 = performance.now(); fn(); ts.push(performance.now() - t0); }
  ts.sort((a, b) => a - b);
  return ts[runs >> 1];
}
console.log("\nthời gian trung vị 5 lần (ms)");
for (const [name, n] of [["cây đầy đủ 2^15 − 1 nút", 2 ** 15 - 1], ["cây đầy đủ 2^16 − 1 nút", 2 ** 16 - 1], ["cây đầy đủ 2^17 − 1 nút", 2 ** 17 - 1]] as const) {
  const r = complete(n);
  const cols = [
    ["bfsLast", median(() => bfsLast(r))],
    ["bfsRightFirst", median(() => bfsRightFirst(r))],
    ["bfsShift", median(() => bfsShift(r))],
    ["dfsRightFirst", median(() => dfsRightFirst(r))],
  ] as const;
  console.log(`${name.padEnd(24)} ` + cols.map(([k, v]) => `${k} ${v.toFixed(2)}`).join("   "));
}
