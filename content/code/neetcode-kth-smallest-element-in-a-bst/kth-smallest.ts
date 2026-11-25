// LC 230 Kth Smallest Element in a BST: sắp xếp, trung thứ tự hết cây, trung thứ tự dừng sớm (đệ quy và ngăn xếp),
// Morris, và cây có cỡ cây con cho câu hỏi phụ "chèn/xóa liên tục".
// Chạy: node kth-smallest.ts

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

// Chuỗi lệch trái: gốc là n, con trái n-1, ..., lá là 1.
function leftChain(n: number): TreeNode | null {
  let root: TreeNode | null = null;
  for (let v = 1; v <= n; v++) { const t = new TreeNode(v); t.left = root; root = t; }
  return root;
}

// Chuỗi lệch phải: gốc là 1, con phải 2, ..., lá là n.
function rightChain(n: number): TreeNode | null {
  let root: TreeNode | null = null;
  for (let v = n; v >= 1; v--) { const t = new TreeNode(v); t.right = root; root = t; }
  return root;
}

// Cây cân từ dãy lo..hi: lấy giữa làm gốc. Giá trị nhỏ thứ k là lo + k - 1.
function balancedRange(lo: number, hi: number): TreeNode | null {
  if (lo > hi) return null;
  const mid = (lo + hi) >> 1;
  const t = new TreeNode(mid);
  t.left = balancedRange(lo, mid - 1);
  t.right = balancedRange(mid + 1, hi);
  return t;
}

// Cách 1: gom mọi giá trị (thứ tự nào cũng được), sắp xếp, lấy phần tử k-1. O(n log n).
function kthSort(root: TreeNode | null, k: number): number {
  const vals: number[] = [];
  const stack: TreeNode[] = root ? [root] : [];
  while (stack.length > 0) {
    const node = stack.pop()!;
    vals.push(node.val);
    if (node.left !== null) stack.push(node.left);
    if (node.right !== null) stack.push(node.right);
  }
  vals.sort((a, b) => a - b);
  return vals[k - 1];
}

// Cách 2: trung thứ tự của cây tìm kiếm đã là dãy tăng. Gom hết rồi lấy phần tử k-1. O(n).
function kthInorderAll(root: TreeNode | null, k: number): number {
  const out: number[] = [];
  const walk = (node: TreeNode | null): void => {
    if (node === null) return;
    walk(node.left);
    out.push(node.val);
    walk(node.right);
  };
  walk(root);
  return out[k - 1];
}

// Cách 3: trung thứ tự đệ quy, đếm và dừng khi đủ k. O(h + k).
function kthRecursive(root: TreeNode | null, k: number): number {
  let count = 0;
  let answer = -1;
  const walk = (node: TreeNode | null): void => {
    if (node === null || count >= k) return;
    walk(node.left);
    if (count >= k) return; // đã tìm thấy bên trái: khỏi đếm nút này và cây con phải
    count++;
    if (count === k) { answer = node.val; return; }
    walk(node.right);
  };
  walk(root);
  return answer;
}

// Cách 4: trung thứ tự bằng ngăn xếp tự quản lý, lấy ra đủ k nút thì trả. O(h + k), không giới hạn độ sâu.
function kthIterative(root: TreeNode | null, k: number): number {
  const stack: TreeNode[] = [];
  let node = root;
  for (;;) {
    while (node !== null) { stack.push(node); node = node.left; } // đi hết về bên trái
    node = stack.pop()!;                                           // nút nhỏ nhất chưa thăm
    if (--k === 0) return node.val;
    node = node.right;
  }
}

// Cách 5: Morris. Mượn con trỏ right đang rỗng của nút liền trước làm "sợi chỉ" quay về, nên không cần ngăn xếp: O(1) bộ nhớ.
// Chỉ được dừng khi đã thấy đáp án VÀ mọi sợi chỉ đã gỡ (pending = 0), nếu không cây bị để lại sai.
function kthMorris(root: TreeNode | null, k: number): number {
  let cur = root, count = 0, answer = -1, pending = 0;
  while (cur !== null) {
    if (cur.left === null) {
      if (++count === k) answer = cur.val;
      if (count >= k && pending === 0) break;
      cur = cur.right;
    } else {
      let pred = cur.left;
      while (pred.right !== null && pred.right !== cur) pred = pred.right;
      if (pred.right === null) {
        pred.right = cur; // buộc chỉ: xong cây con trái thì quay về cur
        pending++;
        cur = cur.left;
      } else {
        pred.right = null; // gỡ chỉ: cây con trái của cur đã thăm xong
        pending--;
        if (++count === k) answer = cur.val;
        if (count >= k && pending === 0) break;
        cur = cur.right;
      }
    }
  }
  return answer;
}

// Cách 6 (câu hỏi phụ): mỗi nút nhớ cỡ cây con của nó. Hỏi phần tử thứ k đi đúng một đường từ gốc: O(h).
class SizedNode {
  val: number;
  left: SizedNode | null = null;
  right: SizedNode | null = null;
  size = 1;
  constructor(val: number) { this.val = val; }
}

const sizeOf = (n: SizedNode | null): number => (n === null ? 0 : n.size);

function kthBySize(root: SizedNode | null, k: number): number {
  let node = root!;
  for (;;) {
    const leftSize = sizeOf(node.left);
    if (k <= leftSize) node = node.left!;                 // đáp án nằm trong cây con trái
    else if (k === leftSize + 1) return node.val;         // đúng nút này
    else { k -= leftSize + 1; node = node.right!; }       // bỏ qua cả bên trái và nút này
  }
}

// Chèn một giá trị chưa có: mọi nút trên đường đi xuống tăng size thêm 1.
function insertSized(node: SizedNode | null, v: number): SizedNode {
  if (node === null) return new SizedNode(v);
  if (v < node.val) node.left = insertSized(node.left, v);
  else node.right = insertSized(node.right, v);
  node.size++;
  return node;
}

// Xóa một giá trị đang có, rồi tính lại size trên đường quay lên.
function removeSized(node: SizedNode, v: number): SizedNode | null {
  if (v < node.val) node.left = removeSized(node.left!, v);
  else if (v > node.val) node.right = removeSized(node.right!, v);
  else {
    if (node.left === null) return node.right;
    if (node.right === null) return node.left;
    let succ = node.right;
    while (succ.left !== null) succ = succ.left; // nút liền sau: nhỏ nhất bên phải
    node.val = succ.val;
    node.right = removeSized(node.right, succ.val);
  }
  node.size = 1 + sizeOf(node.left) + sizeOf(node.right);
  return node;
}

// Chép một cây thường thành cây có size, không đệ quy (chuỗi 10^4 nút vẫn an toàn).
function augment(root: TreeNode | null): SizedNode | null {
  if (root === null) return null;
  const top = new SizedNode(root.val);
  const order: SizedNode[] = [];
  const stack: [TreeNode, SizedNode][] = [[root, top]];
  while (stack.length > 0) {
    const [t, s] = stack.pop()!;
    order.push(s);
    if (t.left !== null) { s.left = new SizedNode(t.left.val); stack.push([t.left, s.left]); }
    if (t.right !== null) { s.right = new SizedNode(t.right.val); stack.push([t.right, s.right]); }
  }
  for (let i = order.length - 1; i >= 0; i--) order[i].size = 1 + sizeOf(order[i].left) + sizeOf(order[i].right);
  return top;
}

const kthAugmented = (root: TreeNode | null, k: number): number => kthBySize(augment(root), k);

// SAI: tiền thứ tự không phải dãy tăng.
function wrongPreorder(root: TreeNode | null, k: number): number {
  const out: number[] = [];
  const stack: TreeNode[] = root ? [root] : [];
  while (stack.length > 0) {
    const node = stack.pop()!;
    out.push(node.val);
    if (node.right !== null) stack.push(node.right);
    if (node.left !== null) stack.push(node.left);
  }
  return out[k - 1];
}

// SAI: sort() không có hàm so sánh đổi số thành chuỗi, nên 10 đứng trước 2.
function wrongSortNoComparator(root: TreeNode | null, k: number): number {
  const vals: number[] = [];
  const stack: TreeNode[] = root ? [root] : [];
  while (stack.length > 0) {
    const node = stack.pop()!;
    vals.push(node.val);
    if (node.left !== null) stack.push(node.left);
    if (node.right !== null) stack.push(node.right);
  }
  vals.sort();
  return vals[k - 1];
}

// SAI: trả "giá trị hoặc null" rồi kiểm bằng if (l). Đáp án 0 bị coi là "chưa thấy".
function wrongFalsyZero(root: TreeNode | null, k: number): number | null {
  let count = 0;
  const walk = (node: TreeNode | null): number | null => {
    if (node === null) return null;
    const l = walk(node.left);
    if (l) return l;
    if (++count === k) return node.val;
    return walk(node.right);
  };
  return walk(root);
}

// SAI: Morris trả về ngay khi đủ k. Đáp án đúng, nhưng các sợi chỉ chưa gỡ ở lại trong cây.
function wrongMorrisEarlyReturn(root: TreeNode | null, k: number): number {
  let cur = root, count = 0;
  while (cur !== null) {
    if (cur.left === null) {
      if (++count === k) return cur.val;
      cur = cur.right;
    } else {
      let pred = cur.left;
      while (pred.right !== null && pred.right !== cur) pred = pred.right;
      if (pred.right === null) { pred.right = cur; cur = cur.left; }
      else {
        pred.right = null;
        if (++count === k) return cur.val;
        cur = cur.right;
      }
    }
  }
  return -1;
}

// Chụp lại mọi con trỏ của cây để kiểm tra hàm không để cây bị đổi.
function snapshot(root: TreeNode | null): [TreeNode, TreeNode | null, TreeNode | null][] {
  const out: [TreeNode, TreeNode | null, TreeNode | null][] = [];
  const stack: TreeNode[] = root ? [root] : [];
  while (stack.length > 0) {
    const n = stack.pop()!;
    out.push([n, n.left, n.right]);
    if (n.left !== null) stack.push(n.left);
    if (n.right !== null) stack.push(n.right);
  }
  return out;
}
const intact = (snap: [TreeNode, TreeNode | null, TreeNode | null][]): boolean =>
  snap.every(([n, l, r]) => n.left === l && n.right === r);

const cases: [string, () => TreeNode | null, number, number][] = [
  ["một nút, k = 1", () => build([9]), 1, 9],
  ["cây đầy 7 nút, k = 1", () => build([8, 4, 12, 2, 6, 10, 14]), 1, 2],
  ["cây đầy 7 nút, k = 4 (gốc)", () => build([8, 4, 12, 2, 6, 10, 14]), 4, 8],
  ["cây đầy 7 nút, k = 7", () => build([8, 4, 12, 2, 6, 10, 14]), 7, 14],
  ["có giá trị 0, k = 1", () => build([3, 1, 5, 0, 2, 4, 6]), 1, 0],
  ["có giá trị 0, k = 2", () => build([3, 1, 5, 0, 2, 4, 6]), 2, 1],
  ["đáp án trong cây con phải của con trái, k = 3", () => build([10, 5, 15, null, 7, null, 20, 6, 8]), 3, 7],
  ["chuỗi lệch trái 10⁴ nút, k = 1", () => leftChain(10000), 1, 1],
  ["chuỗi lệch trái 10⁴ nút, k = 5000", () => leftChain(10000), 5000, 5000],
  ["chuỗi lệch phải 10⁴ nút, k = 10⁴", () => rightChain(10000), 10000, 10000],
];

type Kth = (root: TreeNode | null, k: number) => number | null;
const fns: Kth[] = [kthSort, kthInorderAll, kthRecursive, kthIterative, kthMorris, kthAugmented,
  wrongPreorder, wrongSortNoComparator, wrongFalsyZero, wrongMorrisEarlyReturn];
for (const fn of fns) {
  const bad: string[] = [];
  for (const [name, make, k, want] of cases) {
    const root = make();
    const snap = snapshot(root);
    let got: string;
    try { got = String(fn(root, k)); } catch (e) { got = "ném " + (e as Error).constructor.name; }
    if (got !== String(want)) bad.push(`${name} → ${got}`);
    else if (!intact(snap)) bad.push(`${name} → ${got} nhưng cây bị đổi`);
  }
  console.log(`${fn.name.padEnd(22)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(", ") : ""}`);
}

// Sau wrongMorrisEarlyReturn, cây còn sợi chỉ tạo vòng: duyệt trung thứ tự thường không bao giờ kết thúc.
{
  const root = build([8, 4, 12, 2, 6, 10, 14]);
  wrongMorrisEarlyReturn(root, 1);
  const cap = 1000;
  let steps = 0;
  const stack: TreeNode[] = [];
  let node = root;
  while ((node !== null || stack.length > 0) && steps < cap) {
    while (node !== null && steps < cap) { stack.push(node); node = node.left; steps++; }
    node = stack.pop()!;
    node = node.right;
  }
  console.log(`\nsau wrongMorrisEarlyReturn(k = 1) trên cây 7 nút: duyệt trung thứ tự vẫn chạy sau ${steps} bước (cây có vòng)`);
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

// Chèn vào cây tìm kiếm thường (không lặp, không đệ quy).
function insertBST(root: TreeNode | null, v: number): TreeNode {
  const t = new TreeNode(v);
  if (root === null) return t;
  let cur = root;
  for (;;) {
    if (v < cur.val) { if (cur.left === null) { cur.left = t; return root; } cur = cur.left; }
    else { if (cur.right === null) { cur.right = t; return root; } cur = cur.right; }
  }
}

{
  const rnd = mulberry32(230);
  const T = 2000;
  let agree = 0;
  for (let t = 0; t < T; t++) {
    const n = 1 + Math.floor(rnd() * 30);
    const seen = new Set<number>();
    let root: TreeNode | null = null;
    while (seen.size < n) {
      const v = Math.floor(rnd() * 101);
      if (!seen.has(v)) { seen.add(v); root = insertBST(root, v); }
    }
    const k = 1 + Math.floor(rnd() * n);
    const want = [...seen].sort((a, b) => a - b)[k - 1];
    const got = [kthSort, kthInorderAll, kthRecursive, kthIterative, kthMorris, kthAugmented].map((f) => f(root, k));
    if (got.every((g) => g === want)) agree++;
  }
  console.log(`\nđối chiếu ${T} cây tìm kiếm ngẫu nhiên 1..30 nút: sáu cách khớp với mảng sắp xếp ${agree}/${T}`);
}

// Câu hỏi phụ: chèn, xóa và hỏi xen kẽ trên cây có size, đối chiếu với một mảng luôn sắp xếp.
{
  const rnd = mulberry32(7);
  let root: SizedNode | null = null;
  const sorted: number[] = [];
  let queries = 0, ok = 0;
  for (let op = 0; op < 5000; op++) {
    const r = rnd();
    if (sorted.length === 0 || r < 0.45) {
      const v = Math.floor(rnd() * 10001);
      if (sorted.includes(v)) continue;
      root = insertSized(root, v);
      sorted.splice(sorted.findIndex((x) => x > v) === -1 ? sorted.length : sorted.findIndex((x) => x > v), 0, v);
    } else if (r < 0.7) {
      const i = Math.floor(rnd() * sorted.length);
      root = removeSized(root!, sorted[i]);
      sorted.splice(i, 1);
    } else {
      const k = 1 + Math.floor(rnd() * sorted.length);
      queries++;
      if (kthBySize(root, k) === sorted[k - 1] && sizeOf(root) === sorted.length) ok++;
    }
  }
  console.log(`cây có size: 5000 thao tác chèn/xóa/hỏi ngẫu nhiên, ${ok}/${queries} câu hỏi khớp mảng sắp xếp`);
}

function median(f: () => void, reps = 5): number {
  const ts: number[] = [];
  for (let r = 0; r < reps; r++) { const t0 = performance.now(); f(); ts.push(performance.now() - t0); }
  ts.sort((a, b) => a - b);
  return ts[Math.floor(reps / 2)];
}

{
  const n = 2 ** 20 - 1;
  const root = balancedRange(0, n - 1);
  const sized = augment(root);
  console.log(`\ncây cân ${n} nút (cao 20), thời gian trung vị 5 lần (ms)`);
  console.log("k          sắp xếp  trung thứ tự hết  đệ quy dừng sớm  ngăn xếp   Morris   theo size");
  for (const k of [1, 100, (n + 1) / 2, n]) {
    const ms = [
      median(() => kthSort(root, k)),
      median(() => kthInorderAll(root, k)),
      median(() => kthRecursive(root, k)),
      median(() => kthIterative(root, k)),
      median(() => kthMorris(root, k)),
      median(() => kthBySize(sized, k)),
    ];
    if (kthIterative(root, k) !== k - 1 || kthMorris(root, k) !== k - 1 || kthBySize(sized, k) !== k - 1) throw new Error("sai đáp án");
    const w = [8, 18, 17, 10, 9, 12];
    console.log(String(k).padEnd(8) + ms.map((m, i) => m.toFixed(3).padStart(w[i])).join(""));
  }
}

{
  const rnd = mulberry32(99);
  const n = 100000, Q = 2000;
  let root: SizedNode | null = null;
  const used = new Set<number>();
  while (used.size < n) { const v = Math.floor(rnd() * 1e9); if (!used.has(v)) { used.add(v); root = insertSized(root, v); } }
  const ks = Array.from({ length: Q }, () => 1 + Math.floor(rnd() * n));
  let s1 = 0, s2 = 0;
  const t1 = median(() => { s1 = 0; for (const k of ks) s1 += kthIterative(root as unknown as TreeNode, k); }, 3);
  const t2 = median(() => { s2 = 0; for (const k of ks) s2 += kthBySize(root, k); }, 3);
  if (s1 !== s2) throw new Error("hai cách lệch nhau");
  console.log(`\ncây ngẫu nhiên ${n} nút, ${Q} câu hỏi k ngẫu nhiên: ngăn xếp ${t1.toFixed(1)} ms, theo size ${t2.toFixed(2)} ms`);
}
