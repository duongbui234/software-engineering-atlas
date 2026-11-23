// LC 141 Linked List Cycle: tập các nút đã thăm, rùa và thỏ (Floyd), thuật toán Brent, tìm đầu vòng (LC 142), và ba bản sai.
// Chạy: node list-cycle.ts
import v8 from "node:v8";
import vm from "node:vm";

class ListNode {
  val: number;
  next: ListNode | null = null;
  constructor(val: number) { this.val = val; }
}

// Dựng danh sách từ mảng; pos ≥ 0 thì nút cuối trỏ ngược về nút thứ pos (như đề LeetCode).
function build(vals: number[], pos: number): { head: ListNode | null; nodes: ListNode[] } {
  const nodes = vals.map((v) => new ListNode(v));
  for (let i = 0; i + 1 < nodes.length; i++) nodes[i].next = nodes[i + 1];
  if (pos >= 0 && nodes.length > 0) nodes[nodes.length - 1].next = nodes[pos];
  return { head: nodes[0] ?? null, nodes };
}

// Cách 1: nhớ mọi nút đã đi qua. Set so sánh object theo danh tính, không theo giá trị.
function hasCycleSet(head: ListNode | null): boolean {
  const seen = new Set<ListNode>();
  for (let cur = head; cur !== null; cur = cur.next) {
    if (seen.has(cur)) return true;
    seen.add(cur);
  }
  return false;
}

// Cách 2: rùa đi 1 bước, thỏ đi 2 bước. Có vòng thì thỏ đuổi kịp rùa; không vòng thì thỏ chạm null.
function hasCycleFloyd(head: ListNode | null): boolean {
  let slow = head, fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}

// Cách 3: Brent. Rùa đứng yên ở một mốc, thỏ đi từng bước; sau mỗi lũy thừa của 2 bước thì rùa nhảy tới chỗ thỏ.
function hasCycleBrent(head: ListNode | null): boolean {
  if (head === null) return false;
  let power = 1, steps = 1;
  let tortoise: ListNode = head, hare = head.next;
  while (hare !== null && hare !== tortoise) {
    if (steps === power) { tortoise = hare; power *= 2; steps = 0; }
    hare = hare.next;
    steps++;
  }
  return hare !== null;
}

// LC 142: tìm nút bắt đầu vòng. Gặp nhau xong, đưa một con về đầu; cả hai cùng đi 1 bước, chỗ gặp lại là đầu vòng.
function detectCycle(head: ListNode | null): ListNode | null {
  let slow = head, fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) {
      let a = head;
      while (a !== slow) { a = a!.next; slow = slow!.next; }
      return a;
    }
  }
  return null;
}

// SAI: nhớ giá trị thay vì nút. Hai nút khác nhau cùng giá trị bị coi là "đã thăm".
function wrongValueSet(head: ListNode | null): boolean {
  const seen = new Set<number>();
  for (let cur = head; cur !== null; cur = cur.next) {
    if (seen.has(cur.val)) return true;
    seen.add(cur.val);
  }
  return false;
}

// SAI: so sánh trước khi bước. Lúc đầu rùa và thỏ cùng ở head nên trả true ngay.
function wrongCompareFirst(head: ListNode | null): boolean {
  let slow = head, fast = head;
  while (fast !== null && fast.next !== null) {
    if (slow === fast) return true;
    slow = slow!.next;
    fast = fast.next.next;
  }
  return false;
}

// SAI: chỉ kiểm fast, quên fast.next. Danh sách không vòng có số nút lẻ thì thỏ dừng ở nút cuối, fast.next là null và fast.next.next ném lỗi.
function wrongNoNextCheck(head: ListNode | null): boolean {
  let slow = head, fast = head;
  while (fast !== null) {
    slow = slow!.next;
    fast = (fast.next as ListNode).next;
    if (slow === fast) return true;
  }
  return false;
}

// ---- Kiểm tra ----
const cases: [string, number[], number, boolean][] = [
  ["ví dụ 1 của đề", [3, 2, 0, -4], 1, true],
  ["ví dụ 2 của đề", [1, 2], 0, true],
  ["ví dụ 3 của đề", [1], -1, false],
  ["rỗng", [], -1, false],
  ["một nút tự trỏ", [1], 0, true],
  ["giá trị trùng, không vòng", [1, 1, 1], -1, false],
  ["chẵn, không vòng", [1, 2, 3, 4, 5, 6], -1, false],
  ["lẻ, không vòng", [1, 2, 3, 4, 5], -1, false],
  ["nút cuối tự trỏ", [1, 2, 3, 4, 5], 4, true],
  ["toàn số 0, có vòng", [0, 0, 0, 0, 0], 1, true],
];

const fns: ((h: ListNode | null) => boolean)[] = [hasCycleSet, hasCycleFloyd, hasCycleBrent, wrongValueSet, wrongCompareFirst, wrongNoNextCheck];
for (const fn of fns) {
  const bad: string[] = [];
  for (const [name, vals, pos, want] of cases) {
    let got: string;
    try { got = String(fn(build(vals, pos).head)); } catch (e) { got = "ném " + (e as Error).constructor.name; }
    if (got !== String(want)) bad.push(`${name} → ${got}`);
  }
  console.log(`${fn.name.padEnd(17)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(", ") : ""}`);
}

// LC 142 trên cùng bộ ca: trả đúng nút thứ pos (hoặc null).
{
  let ok = 0;
  for (const [, vals, pos] of cases) {
    const { head, nodes } = build(vals, pos);
    if (detectCycle(head) === (pos >= 0 ? nodes[pos] : null)) ok++;
  }
  console.log(`detectCycle       ${ok}/${cases.length} ca đúng (LC 142: trả nút đầu vòng)`);
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

// Đối chiếu ngẫu nhiên: 2 000 danh sách, độ dài 0..300, pos ngẫu nhiên hoặc -1.
{
  const rand = mulberry32(141);
  let agree = 0, startOk = 0;
  const T = 2000;
  for (let t = 0; t < T; t++) {
    const n = Math.floor(rand() * 301);
    const pos = n > 0 && rand() < 0.5 ? Math.floor(rand() * n) : -1;
    const vals = Array.from({ length: n }, () => Math.floor(rand() * 5)); // giá trị nhỏ để trùng nhiều
    const { head, nodes } = build(vals, pos);
    const a = hasCycleSet(head), b = hasCycleFloyd(head), c = hasCycleBrent(head);
    if (a === b && b === c && a === pos >= 0) agree++;
    if (detectCycle(head) === (pos >= 0 ? nodes[pos] : null)) startOk++;
  }
  console.log(`\nngẫu nhiên: Set, Floyd, Brent khớp nhau và khớp đáp án ở ${agree}/${T} danh sách; detectCycle đúng ở ${startOk}/${T}`);
}

// Kiểm chứng chứng minh: đuôi dài μ, vòng dài λ. Floyd gặp nhau ở bước t = bội nhỏ nhất của λ mà t ≥ max(μ, 1), nên t ≤ μ + λ.
{
  let ok = 0, total = 0, maxRatio = 0;
  for (let mu = 0; mu <= 200; mu++) {
    for (let lam = 1; lam <= 200; lam++) {
      const vals = new Array(mu + lam).fill(0);
      const { head } = build(vals, mu);
      let slow = head!, fast = head!, t = 0;
      do { slow = slow.next!; fast = fast.next!.next!; t++; } while (slow !== fast);
      const predicted = Math.max(1, Math.ceil(mu / lam)) * lam;
      total++;
      if (t === predicted && t <= mu + lam) ok++;
      maxRatio = Math.max(maxRatio, t / (mu + lam));
    }
  }
  console.log(`chứng minh: mọi (μ, λ) với 0 ≤ μ ≤ 200, 1 ≤ λ ≤ 200: số bước tới lúc gặp đúng bằng bội nhỏ nhất của λ không nhỏ hơn max(μ, 1) ở ${ok}/${total} bộ; t/(μ + λ) lớn nhất ${maxRatio.toFixed(3)}`);
}

// Đếm số lần đi theo next: Floyd tốn 3 lần mỗi bước (rùa 1, thỏ 2), Brent tốn 1 lần mỗi bước.
function floydMoves(head: ListNode | null): number {
  let slow = head, fast = head, moves = 0;
  while (fast !== null && fast.next !== null) {
    slow = slow!.next; fast = fast.next.next; moves += 3;
    if (slow === fast) return moves;
  }
  return moves;
}
function brentMoves(head: ListNode | null): number {
  if (head === null) return 0;
  let power = 1, steps = 1, moves = 1;
  let tortoise: ListNode = head, hare = head.next;
  while (hare !== null && hare !== tortoise) {
    if (steps === power) { tortoise = hare; power *= 2; steps = 0; }
    hare = hare.next; steps++; moves++;
  }
  return moves;
}
{
  console.log("\nsố lần đi next tới khi phát hiện vòng:");
  console.log("μ (đuôi)   λ (vòng)    Floyd      Brent");
  for (const [mu, lam] of [[0, 1000], [1000, 1], [1000, 1000], [100000, 3], [3, 100000], [50000, 50000]]) {
    const { head } = build(new Array(mu + lam).fill(0), mu);
    console.log(`${String(mu).padEnd(10)} ${String(lam).padEnd(10)} ${String(floydMoves(head)).padStart(8)} ${String(brentMoves(head)).padStart(10)}`);
  }
}

// ---- Đo thời gian và bộ nhớ ----
v8.setFlagsFromString("--expose-gc");
const gc = vm.runInNewContext("gc") as () => void;

function median(xs: number[]): number { const s = [...xs].sort((a, b) => a - b); return s[s.length >> 1]; }
function timeIt(fn: () => void, reps = 5): number {
  const ts: number[] = [];
  for (let r = 0; r < reps; r++) { const t0 = performance.now(); fn(); ts.push(performance.now() - t0); }
  return median(ts);
}

// Bộ nhớ thêm của Set: đo heapUsed khi Set còn sống, trừ lúc trước.
function setBytes(head: ListNode | null): number {
  gc();
  const before = process.memoryUsage().heapUsed;
  const seen = new Set<ListNode>();
  for (let cur = head; cur !== null && !seen.has(cur); cur = cur.next) seen.add(cur);
  gc();
  const after = process.memoryUsage().heapUsed;
  if (seen.size < 0) console.log(""); // giữ Set sống tới đây
  return after - before;
}

console.log("\nn nút      dạng            Set         Floyd       Brent       bộ nhớ Set");
for (const n of [100000, 1000000]) {
  for (const [label, pos] of [["không vòng", -1], ["vòng ở giữa", n >> 1]] as [string, number][]) {
    const { head } = build(new Array(n).fill(0), pos);
    const tSet = timeIt(() => hasCycleSet(head));
    const tFloyd = timeIt(() => hasCycleFloyd(head));
    const tBrent = timeIt(() => hasCycleBrent(head));
    const mb = setBytes(head) / 1e6;
    console.log(`${String(n).padEnd(10)} ${label.padEnd(15)} ${tSet.toFixed(2).padStart(8)} ms ${tFloyd.toFixed(2).padStart(8)} ms ${tBrent.toFixed(2).padStart(8)} ms ${mb.toFixed(1).padStart(8)} MB`);
  }
}
