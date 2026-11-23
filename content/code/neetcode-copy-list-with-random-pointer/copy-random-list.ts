// LC 138 Copy List with Random Pointer: bảng băm cũ → mới (hai lượt, một lượt), đan nút O(1) bộ nhớ, và các bản sai.
// Chạy: node copy-random-list.ts
import v8 from "node:v8";
import vm from "node:vm";

class Node {
  val: number;
  next: Node | null = null;
  random: Node | null = null;
  constructor(val: number) { this.val = val; }
}

// Dựng danh sách từ dạng của đề: [giá trị, chỉ số nút mà random trỏ tới hoặc null].
function build(spec: [number, number | null][]): Node | null {
  const nodes = spec.map(([v]) => new Node(v));
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].next = nodes[i + 1] ?? null;
    const r = spec[i][1];
    nodes[i].random = r === null ? null : nodes[r];
  }
  return nodes[0] ?? null;
}

// Đọc ngược về dạng của đề; random được đổi thành chỉ số trong chính danh sách đó (-1: trỏ ra ngoài danh sách).
function toSpec(head: Node | null): [number, number | null][] {
  const nodes: Node[] = [];
  for (let cur = head; cur !== null && nodes.length <= 100000; cur = cur.next) nodes.push(cur);
  const index = new Map(nodes.map((n, i) => [n, i]));
  return nodes.map((n) => [n.val, n.random === null ? null : index.get(n.random) ?? -1]);
}

// Cách 1: bảng băm nút cũ → nút mới, hai lượt.
function copyTwoPass(head: Node | null): Node | null {
  const map = new Map<Node, Node>();
  // lượt 1: tạo mọi nút mới, chưa nối gì
  for (let cur = head; cur !== null; cur = cur.next) map.set(cur, new Node(cur.val));
  // lượt 2: nối next và random qua bảng
  for (let cur = head; cur !== null; cur = cur.next) {
    const copy = map.get(cur)!;
    copy.next = cur.next === null ? null : map.get(cur.next)!;
    copy.random = cur.random === null ? null : map.get(cur.random)!;
  }
  return head === null ? null : map.get(head)!;
}

// Cách 2: một lượt, nút nào chưa có bản sao thì tạo ngay khi cần (get-or-create).
function copyOnePass(head: Node | null): Node | null {
  const map = new Map<Node, Node>();
  const get = (n: Node | null): Node | null => {
    if (n === null) return null;
    let c = map.get(n);
    if (c === undefined) { c = new Node(n.val); map.set(n, c); }
    return c;
  };
  for (let cur = head; cur !== null; cur = cur.next) {
    const copy = get(cur)!;
    copy.next = get(cur.next);
    copy.random = get(cur.random);
  }
  return get(head);
}

// Cách 3: đan bản sao ngay sau nút gốc (A → A' → B → B' …), đặt random, rồi tách ra. O(1) bộ nhớ thêm.
function copyInterleave(head: Node | null): Node | null {
  if (head === null) return null;
  // bước 1: chèn A' ngay sau A
  for (let cur: Node | null = head; cur !== null; cur = cur.next!.next) {
    const copy = new Node(cur.val);
    copy.next = cur.next;
    cur.next = copy;
  }
  // bước 2: bản sao của X.random chính là X.random.next
  for (let cur: Node | null = head; cur !== null; cur = cur.next!.next) {
    cur.next!.random = cur.random === null ? null : cur.random.next;
  }
  // bước 3: tách hai danh sách, trả lại next cho danh sách gốc
  const newHead = head.next!;
  for (let cur: Node | null = head; cur !== null; cur = cur.next) {
    const copy: Node = cur.next!;
    cur.next = copy.next;
    copy.next = copy.next === null ? null : copy.next.next;
  }
  return newHead;
}

// SAI: chép next đúng nhưng random vẫn trỏ vào nút của danh sách CŨ. In ra trông giống hệt.
function wrongRandomToOld(head: Node | null): Node | null {
  const dummy = new Node(0);
  let tail = dummy;
  for (let cur = head; cur !== null; cur = cur.next) {
    const copy = new Node(cur.val);
    copy.random = cur.random; // nút cũ, không phải bản sao
    tail.next = copy;
    tail = copy;
  }
  return dummy.next;
}

// SAI: đan rồi tách bản sao ra nhưng quên trả next cho danh sách gốc. Bản sao đúng, danh sách gốc bị hỏng.
function wrongNoRestore(head: Node | null): Node | null {
  if (head === null) return null;
  for (let cur: Node | null = head; cur !== null; cur = cur.next!.next) {
    const copy = new Node(cur.val);
    copy.next = cur.next;
    cur.next = copy;
  }
  for (let cur: Node | null = head; cur !== null; cur = cur.next!.next) {
    cur.next!.random = cur.random === null ? null : cur.random.next;
  }
  const newHead = head.next!;
  for (let copy: Node | null = newHead; copy !== null; copy = copy.next) {
    copy.next = copy.next === null ? null : copy.next.next;
  }
  return newHead;
}

// Kiểm một bản sao: đúng cấu trúc, không nút nào dùng chung với danh sách gốc, và danh sách gốc còn nguyên.
function check(fn: (h: Node | null) => Node | null, spec: [number, number | null][]): string | null {
  const head = build(spec);
  const originals = new Set<Node>();
  for (let cur = head; cur !== null; cur = cur.next) originals.add(cur);
  let copy: Node | null;
  try { copy = fn(head); } catch (e) { return "ném " + (e as Error).constructor.name; }
  for (let cur = copy; cur !== null; cur = cur.next) {
    if (originals.has(cur) || (cur.random !== null && originals.has(cur.random))) return "dùng chung nút với danh sách gốc";
  }
  if (JSON.stringify(toSpec(copy)) !== JSON.stringify(spec)) return "sai cấu trúc";
  if (JSON.stringify(toSpec(head)) !== JSON.stringify(spec)) return "danh sách gốc bị đổi";
  return null;
}

const cases: [string, [number, number | null][]][] = [
  ["ví dụ 1 của đề", [[7, null], [13, 0], [11, 4], [10, 2], [1, 0]]],
  ["ví dụ 2", [[1, 1], [2, 1]]],
  ["ví dụ 3 (giá trị trùng)", [[3, null], [3, 0], [3, null]]],
  ["rỗng", []],
  ["một nút tự trỏ", [[5, 0]]],
  ["mọi random null", [[1, null], [2, null], [3, null]]],
  ["mọi random trỏ nút cuối", [[1, 3], [2, 3], [3, 3], [4, 3]]],
];

for (const fn of [copyTwoPass, copyOnePass, copyInterleave, wrongRandomToOld, wrongNoRestore]) {
  const bad: string[] = [];
  for (const [name, spec] of cases) {
    const err = check(fn, spec);
    if (err !== null) bad.push(`${name} → ${err}`);
  }
  console.log(`${fn.name.padEnd(16)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(", ") : ""}`);
}

// Bản sao "trông đúng" của wrongRandomToOld lộ ra khi sửa danh sách gốc: random của bản sao đổi theo.
{
  const head = build([[7, null], [13, 0], [11, 4], [10, 2], [1, 0]]);
  const copy = wrongRandomToOld(head);
  const before = toVals(copy);
  for (let cur = head; cur !== null; cur = cur.next) cur.val += 100;
  console.log(`\nwrongRandomToOld, giá trị random của bản sao: trước ${before} → sau khi sửa danh sách gốc ${toVals(copy)}`);
}
function toVals(head: Node | null): string {
  const out: string[] = [];
  for (let cur = head; cur !== null; cur = cur.next) out.push(cur.random === null ? "null" : String(cur.random.val));
  return `[${out.join(",")}]`;
}

// ---- Bộ sinh ngẫu nhiên mulberry32 ----
function mulberry32(seed: number): () => number {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function randomSpec(rand: () => number, n: number): [number, number | null][] {
  return Array.from({ length: n }, () => [Math.floor(rand() * 20001) - 10000, rand() < 0.2 ? null : Math.floor(rand() * n)] as [number, number | null]);
}

// Đối chiếu ngẫu nhiên: 2000 danh sách dài 0..60.
{
  const rand = mulberry32(138);
  let ok = 0;
  for (let t = 0; t < 2000; t++) {
    const spec = randomSpec(rand, Math.floor(rand() * 61));
    if ([copyTwoPass, copyOnePass, copyInterleave].every((fn) => check(fn, spec) === null)) ok++;
  }
  console.log(`ngẫu nhiên: ba cách đúng qua kiểm tra (cấu trúc, không dùng chung nút, gốc còn nguyên) ở ${ok}/2000 danh sách`);
}

// structuredClone cũng sao chép được đồ thị có vòng và giữ chỗ dùng chung, nhưng mất lớp (class) của nút.
{
  const head = build([[7, null], [13, 0], [11, 4], [10, 2], [1, 0]]);
  const c = structuredClone(head) as Node;
  const sharedKept = c.next!.random === c;
  console.log(`\nstructuredClone: cấu trúc ${JSON.stringify(toSpec(c)) === JSON.stringify(toSpec(head)) ? "đúng" : "sai"}, random của nút 2 trỏ đúng nút 1 của bản sao: ${sharedKept}, còn là Node: ${c instanceof Node}`);
  try { JSON.stringify(head); console.log("JSON.stringify: được"); }
  catch (e) { console.log(`JSON.stringify(head): ném ${(e as Error).constructor.name}`); }
}

// ---- Đo ----
v8.setFlagsFromString("--expose-gc");
const gc = vm.runInNewContext("gc") as () => void;

function bench(fn: (h: Node | null) => Node | null, spec: [number, number | null][]): { ms: number; mb: number } {
  const ts: number[] = [];
  let mb = 0;
  for (let r = 0; r < 5; r++) {
    const head = build(spec);
    gc();
    const before = process.memoryUsage().heapUsed;
    const t0 = performance.now();
    const copy = fn(head);
    ts.push(performance.now() - t0);
    mb = Math.max(mb, (process.memoryUsage().heapUsed - before) / 1e6);
    if (copy === null && spec.length > 0) throw new Error("rỗng");
  }
  ts.sort((a, b) => a - b);
  return { ms: ts[2], mb };
}

// structuredClone đi theo các con trỏ bằng đệ quy: danh sách dài làm tràn ngăn xếp. Tìm độ dài lớn nhất bằng chia đôi.
{
  const ok = (n: number) => { try { structuredClone(build(Array.from({ length: n }, (_, i) => [i, null] as [number, null]))); return true; } catch { return false; } };
  let lo = 1, hi = 100000;
  while (lo < hi) { const m = (lo + hi + 1) >> 1; if (ok(m)) lo = m; else hi = m - 1; }
  console.log(`structuredClone sao chép được danh sách dài tối đa ${lo} nút; dài hơn thì ném RangeError`);
}

console.log("\nn nút      hai lượt (Map)         một lượt (Map)         đan nút");
const rand = mulberry32(2026);
for (const n of [1e5, 1e6]) {
  const spec = randomSpec(rand, n);
  const cells = [copyTwoPass, copyOnePass, copyInterleave].map((fn) => {
    const r = bench(fn, spec);
    return `${r.ms.toFixed(2).padStart(8)} ms ${r.mb.toFixed(1).padStart(5)} MB`;
  });
  console.log(`${String(n).padEnd(10)} ${cells.join("   ")}`);
}
