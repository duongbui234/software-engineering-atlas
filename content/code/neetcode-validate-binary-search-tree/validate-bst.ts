// LC 98 Validate Binary Search Tree: vét cạn max/min cây con, truyền khoảng (đệ quy và lặp),
// trung thứ tự (đệ quy, lặp, Morris), và bốn cách sai chạy thật.
// Chạy: node validate-bst.ts

class TreeNode {
  val: number;
  left: TreeNode | null = null;
  right: TreeNode | null = null;
  constructor(val: number) { this.val = val; }
}

const INT_MIN = -2147483648;
const INT_MAX = 2147483647;

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

// Cây tìm kiếm cân từ dãy tăng lo..hi.
function balancedBST(lo: number, hi: number): TreeNode | null {
  if (lo > hi) return null;
  const mid = (lo + hi) >> 1;
  const t = new TreeNode(mid);
  t.left = balancedBST(lo, mid - 1);
  t.right = balancedBST(mid + 1, hi);
  return t;
}

// Chuỗi lệch phải 1, 2, ..., n: một cây tìm kiếm đúng nhưng sâu n tầng.
function rightChain(n: number): TreeNode | null {
  let root: TreeNode | null = null;
  for (let v = n; v >= 1; v--) { const t = new TreeNode(v); t.right = root; root = t; }
  return root;
}

// Chuỗi phải 1..n-1, rồi nút đáy là con trái của n-1 với giá trị 0:
// so với cha (0 < n-1) thì đúng, nhưng 0 nằm trong cây con phải của mọi nút phía trên.
function chainBadBottom(n: number): TreeNode | null {
  const root = rightChain(n - 1)!;
  let t = root;
  while (t.right !== null) t = t.right;
  t.left = new TreeNode(0);
  return root;
}

let visits = 0;

// Sai 1: chỉ so nút với hai con trực tiếp.
function wrongParentChild(root: TreeNode | null): boolean {
  if (root === null) return true;
  if (root.left !== null && root.left.val >= root.val) return false;
  if (root.right !== null && root.right.val <= root.val) return false;
  return wrongParentChild(root.left) && wrongParentChild(root.right);
}

// Đi hết một cây con bằng ngăn xếp tự quản lý, trả giá trị nhỏ nhất và lớn nhất.
function scan(node: TreeNode): [number, number] {
  let mn = Infinity, mx = -Infinity;
  const stack: TreeNode[] = [node];
  while (stack.length > 0) {
    const t = stack.pop()!;
    visits++;
    if (t.val < mn) mn = t.val;
    if (t.val > mx) mx = t.val;
    if (t.left !== null) stack.push(t.left);
    if (t.right !== null) stack.push(t.right);
  }
  return [mn, mx];
}

// Cách 1: vét cạn. Ở mọi nút: max cây con trái < nút < min cây con phải. O(n·h), chuỗi lệch là O(n²).
// Vòng ngoài cũng lặp bằng ngăn xếp, để phép đo chỉ đo thời gian, không đụng giới hạn đệ quy.
function bruteMaxMin(root: TreeNode | null): boolean {
  if (root === null) return true;
  const stack: TreeNode[] = [root];
  while (stack.length > 0) {
    const node = stack.pop()!;
    if (node.left !== null) {
      if (scan(node.left)[1] >= node.val) return false;
      stack.push(node.left);
    }
    if (node.right !== null) {
      if (scan(node.right)[0] <= node.val) return false;
      stack.push(node.right);
    }
  }
  return true;
}

// Cách 2: truyền khoảng mở (lo, hi) xuống. null nghĩa là chưa có cận, nên không cần giá trị canh nào.
function validBounds(root: TreeNode | null): boolean {
  const go = (node: TreeNode | null, lo: number | null, hi: number | null): boolean => {
    if (node === null) return true;
    visits++;
    if ((lo !== null && node.val <= lo) || (hi !== null && node.val >= hi)) return false;
    return go(node.left, lo, node.val) && go(node.right, node.val, hi);
  };
  return go(root, null, null);
}

// Cách 2b: cùng phép kiểm khoảng, ngăn xếp tự quản lý thay cho đệ quy.
function validBoundsIterative(root: TreeNode | null): boolean {
  if (root === null) return true;
  const stack: [TreeNode, number, number][] = [[root, -Infinity, Infinity]];
  while (stack.length > 0) {
    const [node, lo, hi] = stack.pop()!;
    visits++;
    if (node.val <= lo || node.val >= hi) return false;
    if (node.left !== null) stack.push([node.left, lo, node.val]);
    if (node.right !== null) stack.push([node.right, node.val, hi]);
  }
  return true;
}

// Cách 3: trung thứ tự đệ quy. Cây tìm kiếm đúng khi dãy trung thứ tự tăng ngặt.
function validInorder(root: TreeNode | null): boolean {
  let prev: number | null = null;
  const go = (node: TreeNode | null): boolean => {
    if (node === null) return true;
    if (!go(node.left)) return false;
    visits++;
    if (prev !== null && node.val <= prev) return false;
    prev = node.val;
    return go(node.right);
  };
  return go(root);
}

// Cách 3b: trung thứ tự lặp: đi trái hết mức, lấy ra, sang phải.
function validInorderIterative(root: TreeNode | null): boolean {
  const stack: TreeNode[] = [];
  let cur = root;
  let prev: number | null = null;
  while (cur !== null || stack.length > 0) {
    while (cur !== null) { stack.push(cur); cur = cur.left; }
    cur = stack.pop()!;
    visits++;
    if (prev !== null && cur.val <= prev) return false;
    prev = cur.val;
    cur = cur.right;
  }
  return true;
}

// Cách 3c: Morris, bộ nhớ thêm O(1). Tạm nối nút cuối của cây con trái về nút hiện tại.
// Gặp chỗ sai vẫn phải đi tiếp tới hết để gỡ mọi sợi nối tạm.
function validMorris(root: TreeNode | null): boolean {
  let cur = root;
  let prev: number | null = null;
  let ok = true;
  while (cur !== null) {
    if (cur.left === null) {
      visits++;
      if (prev !== null && cur.val <= prev) ok = false;
      prev = cur.val;
      cur = cur.right;
    } else {
      let p = cur.left;
      while (p.right !== null && p.right !== cur) p = p.right;
      if (p.right === null) { p.right = cur; cur = cur.left; }
      else {
        p.right = null;
        visits++;
        if (prev !== null && cur.val <= prev) ok = false;
        prev = cur.val;
        cur = cur.right;
      }
    }
  }
  return ok;
}

// Sai 2: Morris nhưng return false ngay chỗ sai, bỏ lại sợi nối tạm trong cây.
function wrongMorrisEarlyReturn(root: TreeNode | null): boolean {
  let cur = root;
  let prev: number | null = null;
  while (cur !== null) {
    if (cur.left === null) {
      if (prev !== null && cur.val <= prev) return false;
      prev = cur.val;
      cur = cur.right;
    } else {
      let p = cur.left;
      while (p.right !== null && p.right !== cur) p = p.right;
      if (p.right === null) { p.right = cur; cur = cur.left; }
      else {
        p.right = null;
        if (prev !== null && cur.val <= prev) return false;
        prev = cur.val;
        cur = cur.right;
      }
    }
  }
  return true;
}

// Sai 3: cho phép trùng (<= thay vì <).
function wrongAllowDuplicates(root: TreeNode | null): boolean {
  const go = (node: TreeNode | null, lo: number, hi: number): boolean => {
    if (node === null) return true;
    if (node.val < lo || node.val > hi) return false;
    return go(node.left, lo, node.val) && go(node.right, node.val, hi);
  };
  return go(root, -Infinity, Infinity);
}

// Sai 4: dùng INT_MIN làm "giá trị trước" đầu tiên, như thể không nút nào bằng nó.
function wrongPrevIntMin(root: TreeNode | null): boolean {
  let prev = INT_MIN;
  const go = (node: TreeNode | null): boolean => {
    if (node === null) return true;
    if (!go(node.left)) return false;
    if (node.val <= prev) return false;
    prev = node.val;
    return go(node.right);
  };
  return go(root);
}

// Chụp lại mọi con trỏ trái/phải trước khi chạy, để biết hàm có sửa cây không.
function snapshot(root: TreeNode | null): [TreeNode, TreeNode | null, TreeNode | null][] {
  const out: [TreeNode, TreeNode | null, TreeNode | null][] = [];
  const stack = root === null ? [] : [root];
  while (stack.length > 0) {
    const t = stack.pop()!;
    out.push([t, t.left, t.right]);
    if (t.left !== null) stack.push(t.left);
    if (t.right !== null) stack.push(t.right);
  }
  return out;
}
const unchanged = (snap: ReturnType<typeof snapshot>) => snap.every(([t, l, r]) => t.left === l && t.right === r);

type Case = { name: string; make: () => TreeNode | null; want: boolean };
const cases: Case[] = [
  { name: "một nút", make: () => build([1]), want: true },
  { name: "ba nút đúng", make: () => build([2, 1, 3]), want: true },
  { name: "cháu phải nhỏ hơn ông", make: () => build([8, 3, 10, null, null, 6, 12]), want: false },
  { name: "cháu trái lớn hơn ông", make: () => build([8, 3, 10, 1, 9]), want: false },
  { name: "trùng bên trái", make: () => build([5, 5]), want: false },
  { name: "trùng bên phải", make: () => build([5, null, 5]), want: false },
  { name: "một nút INT_MIN", make: () => build([INT_MIN]), want: true },
  { name: "một nút INT_MAX", make: () => build([INT_MAX]), want: true },
  { name: "INT_MIN rồi INT_MAX", make: () => build([INT_MIN, null, INT_MAX]), want: true },
  { name: "INT_MAX trùng", make: () => build([INT_MAX, INT_MAX]), want: false },
  { name: "cây cân 10^4 nút", make: () => balancedBST(1, 10000), want: true },
  { name: "chuỗi phải 10^4 nút", make: () => rightChain(10000), want: true },
  { name: "chuỗi 10^4 nút, đáy sai", make: () => chainBadBottom(10000), want: false },
];

const fns: [string, (r: TreeNode | null) => boolean][] = [
  ["bruteMaxMin", bruteMaxMin],
  ["validBounds", validBounds],
  ["validBoundsIterative", validBoundsIterative],
  ["validInorder", validInorder],
  ["validInorderIterative", validInorderIterative],
  ["validMorris", validMorris],
  ["wrongParentChild", wrongParentChild],
  ["wrongAllowDuplicates", wrongAllowDuplicates],
  ["wrongPrevIntMin", wrongPrevIntMin],
];

for (const [name, fn] of fns) {
  const bad: string[] = [];
  for (const c of cases) {
    let got: string;
    try { got = String(fn(c.make())); } catch (e) { got = "ném " + (e as Error).constructor.name; }
    if (got !== String(c.want)) bad.push(`${c.name} → ${got}`);
  }
  const ok = cases.length - bad.length;
  console.log(`${name.padEnd(21)} ${ok}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(", ") : ""}`);
}

// Morris có để lại cây nguyên vẹn không?
console.log("\nMorris: cây còn nguyên sau khi chạy?");
for (const [name, fn] of [["validMorris", validMorris], ["wrongMorrisEarlyReturn", wrongMorrisEarlyReturn]] as const) {
  const broken: string[] = [];
  for (const c of cases) {
    const root = c.make();
    const snap = snapshot(root);
    fn(root);
    if (!unchanged(snap)) broken.push(c.name);
  }
  console.log(`${name.padEnd(23)} ${broken.length === 0 ? "cây nguyên vẹn ở cả " + cases.length + " ca" : "để lại sợi nối ở: " + broken.join(", ")}`);
}

// Đối chiếu ngẫu nhiên: cây nhỏ, giá trị 0..5 để hay có trùng và hay sai.
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
  const leftSize = Math.floor(rnd() * n);
  const t = new TreeNode(Math.floor(rnd() * 6));
  t.left = randomTree(leftSize);
  t.right = randomTree(n - 1 - leftSize);
  return t;
}
let agree = 0, valid = 0, parentChildWrong = 0;
const TRIALS = 5000;
for (let i = 0; i < TRIALS; i++) {
  const root = randomTree(1 + Math.floor(rnd() * 8));
  const answers = [bruteMaxMin, validBounds, validBoundsIterative, validInorder, validInorderIterative, validMorris].map((f) => f(root));
  if (answers.every((a) => a === answers[0])) agree++;
  if (answers[0]) valid++;
  if (wrongParentChild(root) !== answers[0]) parentChildWrong++;
}
console.log(`\nđối chiếu ${TRIALS} cây ngẫu nhiên 1..8 nút: sáu cách khớp nhau ${agree}/${TRIALS} (${valid} cây đúng); wrongParentChild sai ${parentChildWrong} cây`);

// Đo: số lần ghé nút và thời gian trung vị 5 lần.
function measure(fn: (r: TreeNode | null) => boolean, root: TreeNode | null): [number, number] {
  const times: number[] = [];
  let v = 0;
  for (let k = 0; k < 5; k++) {
    visits = 0;
    const t0 = performance.now();
    fn(root);
    times.push(performance.now() - t0);
    v = visits;
  }
  times.sort((a, b) => a - b);
  return [v, times[2]];
}
console.log("\nsố lần ghé nút và thời gian trung vị 5 lần (ms), mọi cây đều đúng");
console.log("cây                       n   vét cạn: ghé        ms   khoảng: ghé      ms   trung thứ tự lặp: ghé      ms");
for (const [label, root, n] of [
  ["cây cân", balancedBST(1, 10000), 10000],
  ["chuỗi phải", rightChain(1000), 1000],
  ["chuỗi phải", rightChain(2000), 2000],
  ["chuỗi phải", rightChain(4000), 4000],
  ["chuỗi phải", rightChain(10000), 10000],
] as const) {
  const [bv, bt] = measure(bruteMaxMin, root);
  const [kv, kt] = measure(validBoundsIterative, root);
  const [iv, it] = measure(validInorderIterative, root);
  console.log(`${label.padEnd(18)} ${String(n).padStart(6)} ${String(bv).padStart(14)} ${bt.toFixed(2).padStart(9)} ${String(kv).padStart(12)} ${kt.toFixed(2).padStart(7)} ${String(iv).padStart(22)} ${it.toFixed(2).padStart(7)}`);
}

// Độ sâu đệ quy: chuỗi phải dài nhất mà bản đệ quy còn chạy được (tìm nhị phân), so với giới hạn đề 10^4.
function maxDepth(fn: (r: TreeNode | null) => boolean): number {
  let lo = 1000, hi = 100000;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    try { fn(rightChain(mid)); lo = mid; } catch { hi = mid - 1; }
  }
  return lo;
}
console.log("\nchuỗi phải dài nhất bản đệ quy chạy được (đề cho tới 10^4 nút):");
for (const [name, fn] of [["validBounds", validBounds], ["validInorder", validInorder]] as const) {
  console.log(`${name.padEnd(13)} ${maxDepth(fn)} nút`);
}
const big = rightChain(100000);
console.log(`chuỗi phải 10^5 nút: validInorderIterative → ${validInorderIterative(big)}, validMorris → ${validMorris(big)}`);
