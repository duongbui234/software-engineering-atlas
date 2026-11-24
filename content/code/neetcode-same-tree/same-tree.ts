// LC 100 Same Tree: đệ quy song song, ngăn xếp cặp nút, hàng đợi cặp nút, tuần tự hóa có đánh dấu null.
// Chạy: node same-tree.ts

class TreeNode {
  val: number;
  left: TreeNode | null = null;
  right: TreeNode | null = null;
  constructor(val: number) { this.val = val; }
}

// Dựng cây từ mảng theo tầng kiểu LeetCode: null là chỗ trống, không có con.
function build(level: (number | null)[]): TreeNode | null {
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

// Cây lệch: n nút nối nhau qua left (side = "left") hoặc right. Dựng bằng vòng lặp, không đệ quy.
function chain(n: number, side: "left" | "right" = "left", val = 1): TreeNode | null {
  let root: TreeNode | null = null;
  for (let i = 0; i < n; i++) {
    const t = new TreeNode(val);
    t[side] = root;
    root = t;
  }
  return root;
}

// Cách 1: đệ quy song song trên hai cây. O(n) thời gian, O(h) ngăn xếp gọi hàm (h là chiều cao).
function isSameRecursive(p: TreeNode | null, q: TreeNode | null): boolean {
  if (p === null || q === null) return p === q; // chỉ đúng khi cả hai cùng null
  return p.val === q.val && isSameRecursive(p.left, q.left) && isSameRecursive(p.right, q.right);
}

// Cách 2: vòng lặp với ngăn xếp các cặp nút (DFS). O(n) thời gian, O(h) phần tử trên ngăn xếp.
function isSameStack(p: TreeNode | null, q: TreeNode | null): boolean {
  const stack: [TreeNode | null, TreeNode | null][] = [[p, q]];
  while (stack.length > 0) {
    const [a, b] = stack.pop()!;
    if (a === null && b === null) continue;
    if (a === null || b === null || a.val !== b.val) return false;
    stack.push([a.right, b.right], [a.left, b.left]);
  }
  return true;
}

// Cách 3: hàng đợi các cặp nút (BFS), so theo từng tầng. O(n) thời gian, O(w) bộ nhớ (w là tầng rộng nhất).
function isSameQueue(p: TreeNode | null, q: TreeNode | null): boolean {
  const queue: [TreeNode | null, TreeNode | null][] = [[p, q]];
  for (let head = 0; head < queue.length; head++) {
    const [a, b] = queue[head];
    if (a === null && b === null) continue;
    if (a === null || b === null || a.val !== b.val) return false;
    queue.push([a.left, b.left], [a.right, b.right]);
  }
  return true;
}

// Tuần tự hóa preorder, ghi null thành dấu (ở đây là giá trị null). Vòng lặp, không đệ quy.
function serialize(root: TreeNode | null): (number | null)[] {
  const out: (number | null)[] = [];
  const stack: (TreeNode | null)[] = [root];
  while (stack.length > 0) {
    const node = stack.pop()!;
    if (node === null) { out.push(null); continue; }
    out.push(node.val);
    stack.push(node.right, node.left);
  }
  return out;
}

// Cách 4: tuần tự hóa cả hai cây (có đánh dấu null) rồi so hai mảng. O(n) thời gian, O(n) bộ nhớ thêm.
function isSameSerialize(p: TreeNode | null, q: TreeNode | null): boolean {
  const a = serialize(p), b = serialize(q);
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

// SAI: so preorder nhưng bỏ qua null. [1,2] và [1,null,2] đều ra 1,2.
function wrongPreorderNoNull(p: TreeNode | null, q: TreeNode | null): boolean {
  const a = serialize(p).filter((x) => x !== null), b = serialize(q).filter((x) => x !== null);
  return a.length === b.length && a.every((x, i) => x === b[i]);
}

// SAI: chỉ xử lý "cả hai null", quên trường hợp đúng một bên null.
function wrongMissingOneNull(p: TreeNode | null, q: TreeNode | null): boolean {
  if (p === null && q === null) return true;
  return p!.val === q!.val && wrongMissingOneNull(p!.left, q!.left) && wrongMissingOneNull(p!.right, q!.right);
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

type Case = [string, TreeNode | null, TreeNode | null, boolean];
const cases: Case[] = [
  ["giống hệt", build([1, 2, 3]), build([1, 2, 3]), true],
  ["con trái và con phải", build([1, 2]), build([1, null, 2]), false],
  ["đổi chỗ giá trị", build([1, 2, 1]), build([1, 1, 2]), false],
  ["hai cây rỗng", build([]), build([]), true],
  ["một bên rỗng", build([]), build([1]), false],
  ["một nút", build([5]), build([5]), true],
  ["giá trị lớn hơn 127", build([1000, 2000]), build([1000, 2000]), true],
  ["số âm", build([-10000, null, 7]), build([-10000, null, 7]), true],
  ["cây đầy 7 nút", build([1, 2, 3, 4, 5, 6, 7]), build([1, 2, 3, 4, 5, 6, 7]), true],
  ["khác lá cuối", build([1, 2, 3, 4, 5, 6, 7]), build([1, 2, 3, 4, 5, 6, 8]), false],
  ["lệch trái và lệch phải", chain(50, "left"), chain(50, "right"), false],
  ["lệch trái 100 nút", chain(100, "left"), chain(100, "left"), true],
];

const fns = [isSameRecursive, isSameStack, isSameQueue, isSameSerialize, wrongPreorderNoNull, wrongMissingOneNull];
for (const fn of fns) {
  const bad: string[] = [];
  for (const [name, p, q, want] of cases) {
    let got: string;
    try { got = String(fn(p, q)); } catch (e) { got = "ném " + (e as Error).constructor.name; }
    if (got !== String(want)) bad.push(`${name} → ${got}`);
  }
  console.log(`${fn.name.padEnd(20)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(", ") : ""}`);
}

// Đối chiếu ngẫu nhiên: 3000 cặp cây nhỏ, giá trị trong [0, 2] để hay trùng. Đáp án mẫu lấy từ JSON lồng nhau.
{
  const rnd = mulberry32(100);
  const randomTree = (n: number): TreeNode | null => {
    // chèn n nút vào một chỗ trống ngẫu nhiên: hình dạng nào cũng có thể ra
    let root: TreeNode | null = null;
    for (let i = 0; i < n; i++) {
      const t = new TreeNode(Math.floor(rnd() * 3));
      if (root === null) { root = t; continue; }
      let cur = root;
      for (;;) {
        const side = rnd() < 0.5 ? "left" : "right";
        if (cur[side] === null) { cur[side] = t; break; }
        cur = cur[side]!;
      }
    }
    return root;
  };
  const toObj = (t: TreeNode | null): unknown => (t === null ? null : [t.val, toObj(t.left), toObj(t.right)]);
  const ok = [0, 0, 0, 0];
  let equalPairs = 0;
  const T = 3000;
  for (let i = 0; i < T; i++) {
    const p = randomTree(Math.floor(rnd() * 6));
    const q = randomTree(Math.floor(rnd() * 6));
    const want = JSON.stringify(toObj(p)) === JSON.stringify(toObj(q));
    if (want) equalPairs++;
    fns.slice(0, 4).forEach((fn, j) => { if (fn(p, q) === want) ok[j]++; });
  }
  console.log(`\nngẫu nhiên (${equalPairs} cặp giống nhau): ${fns.slice(0, 4).map((f, j) => `${f.name} ${ok[j]}/${T}`).join(", ")}`);
}

// Cây lệch sâu d nút: độ sâu lớn nhất mà bản đệ quy còn chạy (tìm nhị phân), và bản vòng lặp ở 10⁶ nút.
function works(fn: (p: TreeNode | null, q: TreeNode | null) => boolean, d: number): boolean {
  const p = chain(d), q = chain(d);
  try { return fn(p, q); } catch (e) { return false; }
}
function deepestOk(fn: (p: TreeNode | null, q: TreeNode | null) => boolean): number {
  let lo = 1, hi = 2;
  while (works(fn, hi)) { lo = hi; hi *= 2; }
  while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (works(fn, mid)) lo = mid; else hi = mid; }
  return lo;
}
{
  let err = "";
  try { isSameRecursive(chain(1_000_000), chain(1_000_000)); } catch (e) { err = `${(e as Error).constructor.name}: ${(e as Error).message}`; }
  console.log(`\ncây lệch 10⁶ nút, đệ quy: ${err}`);
  console.log(`độ sâu lớn nhất bản đệ quy chạy được: ${deepestOk(isSameRecursive)}`);
  for (const fn of [isSameStack, isSameQueue, isSameSerialize]) console.log(`${fn.name.padEnd(16)} cây lệch 10⁶ nút: ${works(fn, 1_000_000)}`);
}

// Đo: hai cây giống hệt 10⁶ nút (cây tìm kiếm nhị phân dựng từ khóa ngẫu nhiên, cao khoảng 50), trung vị 5 lần.
{
  const rnd = mulberry32(7);
  const keys = Array.from({ length: 1_000_000 }, () => Math.floor(rnd() * 2 ** 31));
  const bst = (): TreeNode | null => {
    let root: TreeNode | null = null;
    for (const k of keys) {
      const t = new TreeNode(k);
      if (root === null) { root = t; continue; }
      let cur = root;
      for (;;) {
        const side = k < cur.val ? "left" : "right";
        if (cur[side] === null) { cur[side] = t; break; }
        cur = cur[side]!;
      }
    }
    return root;
  };
  const p = bst(), q = bst();
  let height = 0;
  const st: [TreeNode, number][] = [[p!, 1]];
  while (st.length) { const [n, d] = st.pop()!; height = Math.max(height, d); if (n.left) st.push([n.left, d + 1]); if (n.right) st.push([n.right, d + 1]); }
  console.log(`\nhai cây giống hệt 10⁶ nút, cao ${height}, trung vị 5 lần (ms)`);
  for (const fn of [isSameRecursive, isSameStack, isSameQueue, isSameSerialize]) {
    const ts: number[] = [];
    for (let r = 0; r < 5; r++) { const t0 = performance.now(); fn(p, q); ts.push(performance.now() - t0); }
    ts.sort((x, y) => x - y);
    console.log(`${fn.name.padEnd(16)} ${ts[2].toFixed(2).padStart(8)}`);
  }
}
