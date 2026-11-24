// LC 572 Subtree of Another Tree: so ở mọi nút O(m·n), tuần tự hóa + tìm chuỗi (có sẵn hoặc KMP),
// hash Merkle kiểm lại khi trùng, và đánh số cây con (không va chạm).
// Chạy: node subtree.ts

class TreeNode {
  val: number;
  left: TreeNode | null = null;
  right: TreeNode | null = null;
  constructor(val: number) { this.val = val; }
}

// Dựng cây từ mảng theo tầng kiểu LeetCode: null là chỗ trống.
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

// Cây lệch trái n nút giá trị 1; bottom là giá trị của nút sâu nhất.
function chain(n: number, bottom = 1): TreeNode | null {
  let root: TreeNode | null = null;
  for (let i = 0; i < n; i++) {
    const t = new TreeNode(i === 0 ? bottom : 1);
    t.left = root;
    root = t;
  }
  return root;
}

// So hai cây (bài 100), bản vòng lặp để không vướng giới hạn đệ quy.
function isSame(p: TreeNode | null, q: TreeNode | null): boolean {
  const stack: (TreeNode | null)[] = [p, q];
  while (stack.length > 0) {
    const b = stack.pop()!, a = stack.pop()!;
    if (a === null && b === null) continue;
    if (a === null || b === null || a.val !== b.val) return false;
    stack.push(a.right, b.right, a.left, b.left);
  }
  return true;
}

// Mọi nút của cây theo preorder (cha đứng trước con). Vòng lặp.
function preorderNodes(root: TreeNode | null): TreeNode[] {
  const out: TreeNode[] = [];
  const stack: (TreeNode | null)[] = [root];
  while (stack.length > 0) {
    const n = stack.pop()!;
    if (n === null) continue;
    out.push(n);
    stack.push(n.right, n.left);
  }
  return out;
}

// Cách 1 (dạng đệ quy quen thuộc): cây con bắt đầu ở gốc, hoặc nằm trong nhánh trái, hoặc nhánh phải.
function isSameRec(p: TreeNode | null, q: TreeNode | null): boolean {
  if (p === null || q === null) return p === q;
  return p.val === q.val && isSameRec(p.left, q.left) && isSameRec(p.right, q.right);
}
function isSubtreeRecursive(root: TreeNode | null, sub: TreeNode | null): boolean {
  if (root === null) return sub === null;
  return isSameRec(root, sub) || isSubtreeRecursive(root.left, sub) || isSubtreeRecursive(root.right, sub);
}

// Cách 1 (vòng lặp): thử so ở từng nút của root. O(m·n) thời gian xấu nhất.
function isSubtreeNaive(root: TreeNode | null, sub: TreeNode | null): boolean {
  if (sub === null) return true;
  for (const node of preorderNodes(root)) if (isSame(node, sub)) return true;
  return false;
}

// Tuần tự hóa preorder thành chuỗi: mỗi nút ",giá trị", mỗi chỗ trống ",#". Dấu phẩy đứng TRƯỚC mỗi phần tử.
function serializeString(root: TreeNode | null): string {
  const parts: string[] = [];
  const stack: (TreeNode | null)[] = [root];
  while (stack.length > 0) {
    const n = stack.pop()!;
    if (n === null) { parts.push(",#"); continue; }
    parts.push("," + n.val);
    stack.push(n.right, n.left);
  }
  return parts.join("");
}

// Cách 2a: tuần tự hóa rồi tìm chuỗi bằng includes có sẵn.
function isSubtreeString(root: TreeNode | null, sub: TreeNode | null): boolean {
  return serializeString(root).includes(serializeString(sub));
}

// Tuần tự hóa preorder thành mảng số; chỗ trống là NONE (ngoài khoảng giá trị của đề).
const NONE = 1 << 30;
function serializeArray(root: TreeNode | null): number[] {
  const out: number[] = [];
  const stack: (TreeNode | null)[] = [root];
  while (stack.length > 0) {
    const n = stack.pop()!;
    if (n === null) { out.push(NONE); continue; }
    out.push(n.val);
    stack.push(n.right, n.left);
  }
  return out;
}

// KMP: tìm mẫu pat trong text, O(|text| + |pat|) trong mọi trường hợp.
function kmpContains(text: number[], pat: number[]): boolean {
  const fail = new Int32Array(pat.length); // fail[i]: độ dài tiền tố dài nhất cũng là hậu tố của pat[0..i]
  for (let i = 1, k = 0; i < pat.length; i++) {
    while (k > 0 && pat[i] !== pat[k]) k = fail[k - 1];
    if (pat[i] === pat[k]) k++;
    fail[i] = k;
  }
  for (let i = 0, k = 0; i < text.length; i++) {
    while (k > 0 && text[i] !== pat[k]) k = fail[k - 1];
    if (text[i] === pat[k]) k++;
    if (k === pat.length) return true;
  }
  return false;
}

// Cách 2b: tuần tự hóa thành mảng số rồi tìm bằng KMP. Không có chuyện "12" chứa "2" vì mỗi giá trị là một ô.
function isSubtreeKmp(root: TreeNode | null, sub: TreeNode | null): boolean {
  return kmpContains(serializeArray(root), serializeArray(sub));
}

// Hàm trộn của mulberry32 (32 bit).
function mix32(a: number): number {
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return (t ^ (t >>> 14)) >>> 0;
}
// Hàm trộn cuối của MurmurHash3 (fmix32): là một hoán vị trên 2³² giá trị, hai đầu vào khác nhau luôn ra khác nhau.
function fmix32(h: number): number {
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  return (h ^ (h >>> 16)) >>> 0;
}
const NULL_HASH = 0x165667b1;
// Hash Merkle 32 bit: từ giá trị của nút và hash hai con. Trái và phải nhân hệ số khác nhau nên đổi chỗ thì hash khác.
function nodeHash(val: number, hl: number, hr: number): number {
  return fmix32(Math.imul(hl, 0x9e3779b1) ^ Math.imul(hr ^ 0x85ebca6b, 0xc2b2ae35) ^ ((val + 0x27d4eb2f) | 0));
}
// Cùng công thức nhưng trộn bằng mix32 của mulberry32, vốn KHÔNG phải hoán vị (nhân với 1 | a phụ thuộc chính a).
function nodeHashMulberry(val: number, hl: number, hr: number): number {
  return mix32(Math.imul(hl, 0x9e3779b1) ^ Math.imul(hr ^ 0x85ebca6b, 0xc2b2ae35) ^ ((val + 0x27d4eb2f) | 0));
}
// Hash của mọi cây con, tính từ dưới lên (duyệt preorder ngược: con luôn xong trước cha).
function subtreeHashes(root: TreeNode | null, h: (v: number, l: number, r: number) => number, nullH: number): Map<TreeNode, number> {
  const hash = new Map<TreeNode, number>();
  const nodes = preorderNodes(root);
  for (let i = nodes.length - 1; i >= 0; i--) {
    const n = nodes[i];
    hash.set(n, h(n.val, n.left ? hash.get(n.left)! : nullH, n.right ? hash.get(n.right)! : nullH));
  }
  return hash;
}

// Cách 3: hash Merkle. Hash trùng thì so lại thật bằng isSame, vì hai cây khác nhau vẫn có thể trùng hash.
function isSubtreeHash(root: TreeNode | null, sub: TreeNode | null): boolean {
  if (sub === null) return true;
  const target = subtreeHashes(sub, nodeHash, NULL_HASH).get(sub)!;
  for (const [node, h] of subtreeHashes(root, nodeHash, NULL_HASH)) if (h === target && isSame(node, sub)) return true;
  return false;
}

// Cách 4: đánh số cây con. Mỗi bộ (giá trị, số của con trái, số của con phải) khác nhau được một số riêng,
// nên hai cây cùng số khi và chỉ khi giống hệt nhau: không có va chạm. Chỉ cần đánh số các cây con của sub.
function isSubtreeIds(root: TreeNode | null, sub: TreeNode | null): boolean {
  if (sub === null) return true;
  const ids = new Map<string, number>();
  const idOf = new Map<TreeNode, number>();
  const subNodes = preorderNodes(sub);
  for (let i = subNodes.length - 1; i >= 0; i--) {
    const n = subNodes[i];
    const key = `${n.val},${n.left ? idOf.get(n.left) : 0},${n.right ? idOf.get(n.right) : 0}`;
    if (!ids.has(key)) ids.set(key, ids.size + 1);
    idOf.set(n, ids.get(key)!);
  }
  const target = idOf.get(sub)!;
  const rootNodes = preorderNodes(root);
  for (let i = rootNodes.length - 1; i >= 0; i--) {
    const n = rootNodes[i];
    const l = n.left ? idOf.get(n.left)! : 0, r = n.right ? idOf.get(n.right)! : 0;
    // con không có trong sub (số -1) thì cha cũng không thể có
    const id = l < 0 || r < 0 ? -1 : (ids.get(`${n.val},${l},${r}`) ?? -1);
    if (id === target) return true;
    idOf.set(n, id);
  }
  return false;
}

// SAI: tuần tự hóa không ghi chỗ trống. [8,4,5] khớp vào giữa dãy 7,8,4,5,6,9 dù nút 5 có thêm con.
function wrongNoNullMarkers(root: TreeNode | null, sub: TreeNode | null): boolean {
  const vals = (t: TreeNode | null) => preorderNodes(t).map((n) => "," + n.val).join("");
  return vals(root).includes(vals(sub));
}

// SAI: dấu phẩy chỉ đứng SAU mỗi phần tử. "12,#,#," chứa "2,#,#," nên cây [12] bị coi là chứa cây [2].
function wrongNoLeadingDelimiter(root: TreeNode | null, sub: TreeNode | null): boolean {
  const s = (t: TreeNode | null) => serializeString(t).slice(1) + ",";
  return s(root).includes(s(sub));
}

// SAI: hash yếu (tổng giá trị) và không kiểm lại khi trùng.
function wrongWeakHash(root: TreeNode | null, sub: TreeNode | null): boolean {
  if (sub === null) return true;
  const sum = (v: number, l: number, r: number) => v + l + r;
  const target = subtreeHashes(sub, sum, 0).get(sub)!;
  for (const h of subtreeHashes(root, sum, 0).values()) if (h === target) return true;
  return false;
}

// Bộ sinh ngẫu nhiên mulberry32.
function mulberry32(seed: number): () => number {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    return mix32(a) / 4294967296;
  };
}

type Case = [string, TreeNode | null, TreeNode | null, boolean];
const cases: Case[] = [
  ["khớp nhánh trái", build([7, 8, 9, 4, 5]), build([8, 4, 5]), true],
  ["nút 5 có thêm con", build([7, 8, 9, 4, 5, null, null, null, null, 6]), build([8, 4, 5]), false],
  ["12 và 2", build([12]), build([2]), false],
  ["-3 và 3", build([-3]), build([3]), false],
  ["trùng cả cây", build([1, 2, 3]), build([1, 2, 3]), true],
  ["sub là lá", build([1, 2, 3]), build([3]), true],
  ["lá và nút có con", build([1, 2, 3, null, null, 4]), build([3]), false],
  ["giá trị lặp", build([1, 1]), build([1]), true],
  ["trái và phải", build([1, 2]), build([1, null, 2]), false],
  ["cùng tổng giá trị", build([1, 2, 3]), build([3, 1, 2]), false],
  ["số âm", build([-1, -2, -3]), build([-3]), true],
  ["trùng Objects.hash", build([1, 1]), build([1, null, 961]), false],
  ["lệch 2000 và 1000", chain(2000), chain(1000), true],
  ["lệch, đáy khác", chain(2000), chain(1000, 2), false],
];

const fns = [isSubtreeRecursive, isSubtreeNaive, isSubtreeString, isSubtreeKmp, isSubtreeHash, isSubtreeIds,
  wrongNoNullMarkers, wrongNoLeadingDelimiter, wrongWeakHash];
for (const fn of fns) {
  const bad: string[] = [];
  for (const [name, root, sub, want] of cases) {
    let got: string;
    try { got = String(fn(root, sub)); } catch (e) { got = "ném " + (e as Error).constructor.name; }
    if (got !== String(want)) bad.push(`${name} → ${got}`);
  }
  console.log(`${fn.name.padEnd(24)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(", ") : ""}`);
}

// Đối chiếu ngẫu nhiên: 3000 cặp. Một nửa sub là bản chép của một cây con trong root, một nửa là cây ngẫu nhiên.
// Đáp án mẫu: tập JSON của mọi cây con trong root.
{
  const rnd = mulberry32(572);
  const randomTree = (n: number): TreeNode | null => {
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
  const clone = (t: TreeNode | null): TreeNode | null => {
    if (t === null) return null;
    const c = new TreeNode(t.val);
    c.left = clone(t.left);
    c.right = clone(t.right);
    return c;
  };
  const toObj = (t: TreeNode | null): unknown => (t === null ? null : [t.val, toObj(t.left), toObj(t.right)]);
  const T = 3000;
  const ok = new Array(6).fill(0);
  let trueCount = 0;
  for (let i = 0; i < T; i++) {
    const root = randomTree(1 + Math.floor(rnd() * 12));
    let sub: TreeNode | null;
    if (rnd() < 0.5) {
      const nodes = preorderNodes(root);
      sub = clone(nodes[Math.floor(rnd() * nodes.length)]);
    } else sub = randomTree(1 + Math.floor(rnd() * 4));
    const all = new Set(preorderNodes(root).map((n) => JSON.stringify(toObj(n))));
    const want = all.has(JSON.stringify(toObj(sub)));
    if (want) trueCount++;
    fns.slice(0, 6).forEach((fn, j) => { if (fn(root, sub) === want) ok[j]++; });
  }
  console.log(`\nngẫu nhiên (${trueCount} cặp có): ${fns.slice(0, 6).map((f, j) => `${f.name} ${ok[j]}/${T}`).join(", ")}`);
}

// Va chạm hash 32 bit: cây ngẫu nhiên 10⁶ nút. Đánh số cây con cho biết chính xác cây nào giống hệt cây nào;
// đếm các giá trị hash bị hai cây con khác nhau dùng chung.
{
  const rnd = mulberry32(2026);
  const N = 1_000_000;
  const nodes: TreeNode[] = [new TreeNode(0)];
  for (let i = 1; i < N; i++) {
    // gắn nút mới vào một chỗ trống của một nút ngẫu nhiên đã có: cây cao khoảng vài chục tầng
    const t = new TreeNode(Math.floor(rnd() * 20001) - 10000);
    for (;;) {
      const p = nodes[Math.floor(rnd() * nodes.length)];
      if (p.left === null) { p.left = t; break; }
      if (p.right === null) { p.right = t; break; }
    }
    nodes.push(t);
  }
  const root = nodes[0];
  const ids = new Map<string, number>();
  const idOf = new Map<TreeNode, number>();
  const order = preorderNodes(root);
  for (let i = order.length - 1; i >= 0; i--) {
    const n = order[i];
    const key = `${n.val},${n.left ? idOf.get(n.left) : 0},${n.right ? idOf.get(n.right) : 0}`;
    if (!ids.has(key)) ids.set(key, ids.size + 1);
    idOf.set(n, ids.get(key)!);
  }
  const D = ids.size;
  console.log(`\n${N} nút, ${D} cây con khác nhau; lý thuyết với hash ngẫu nhiên 32 bit ≈ ${(D * (D - 1) / 2 / 2 ** 32).toFixed(1)} cặp va chạm`);
  for (const [name, h] of [["fmix32", nodeHash], ["mix32 của mulberry32", nodeHashMulberry]] as const) {
    const hashes = subtreeHashes(root, h, NULL_HASH);
    const idsByHash = new Map<number, Set<number>>();
    for (const n of order) {
      const v = hashes.get(n)!;
      if (!idsByHash.has(v)) idsByHash.set(v, new Set());
      idsByHash.get(v)!.add(idOf.get(n)!);
    }
    let collided = 0;
    for (const s of idsByHash.values()) if (s.size > 1) collided++;
    console.log(`  ${name.padEnd(22)} ${collided} giá trị hash bị ≥ 2 cây con khác nhau dùng chung`);
  }
}

// Đo trên đầu vào xấu cho cách so ở mọi nút: root lệch m nút toàn 1, sub lệch n nút toàn 1 trừ đáy là 2 (đáp án false).
function median(fn: () => void, reps = 5): number {
  const ts: number[] = [];
  for (let r = 0; r < reps; r++) { const t0 = performance.now(); fn(); ts.push(performance.now() - t0); }
  ts.sort((x, y) => x - y);
  return ts[Math.floor(reps / 2)];
}
console.log("\nroot lệch m nút, sub lệch n nút khác ở đáy, trung vị 5 lần (ms)");
console.log(`${"m".padEnd(9)} ${"n".padEnd(8)} ${["mọi nút", "includes", "KMP", "hash", "đánh số"].map((x) => x.padStart(8)).join(" ")}`);
for (const [m, n] of [[2000, 1000], [20000, 10000], [200000, 100000], [2_000_000, 1_000_000]]) {
  const root = chain(m), sub = chain(n, 2);
  // so ở mọi nút và includes chậm theo m·n trên đầu vào này: chỉ chạy ở hai cỡ nhỏ
  const row = [isSubtreeNaive, isSubtreeString, isSubtreeKmp, isSubtreeHash, isSubtreeIds].map((fn) =>
    (fn === isSubtreeNaive || fn === isSubtreeString) && m > 20000 ? "" : median(() => fn(root, sub)).toFixed(2));
  console.log(`${String(m).padEnd(9)} ${String(n).padEnd(8)} ${row.map((x) => x.padStart(8)).join(" ")}`);
}
