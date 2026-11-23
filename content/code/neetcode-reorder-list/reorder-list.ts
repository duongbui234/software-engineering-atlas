// LC 143 Reorder List: ba bước (tìm giữa, đảo nửa sau, đan xen), mảng các nút, và các bản sai về chỗ cắt.
// Chạy: node reorder-list.ts
import v8 from "node:v8";
import vm from "node:vm";

class ListNode {
  val: number;
  next: ListNode | null = null;
  constructor(val: number) { this.val = val; }
}

function build(vals: number[]): ListNode | null {
  let head: ListNode | null = null;
  for (let i = vals.length - 1; i >= 0; i--) { const n = new ListNode(vals[i]); n.next = head; head = n; }
  return head;
}

// Đọc danh sách ra mảng; đi quá limit bước thì coi là có vòng.
function toArray(head: ListNode | null, limit: number): number[] | "vòng" {
  const out: number[] = [];
  for (let cur = head; cur !== null; cur = cur.next) {
    if (out.length >= limit) return "vòng";
    out.push(cur.val);
  }
  return out;
}

// Đáp án mong đợi: L0, Ln, L1, Ln-1, …
function expected(vals: number[]): number[] {
  const out: number[] = [];
  for (let i = 0, j = vals.length - 1; i <= j; i++, j--) { out.push(vals[i]); if (i !== j) out.push(vals[j]); }
  return out;
}

// Đảo một danh sách tại chỗ, trả đầu mới.
function reverse(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null, cur = head;
  while (cur !== null) { const nxt = cur.next; cur.next = prev; prev = cur; cur = nxt; }
  return prev;
}

// Cách 1: ba bước, O(1) bộ nhớ thêm.
function reorderThreeSteps(head: ListNode | null): void {
  if (head === null || head.next === null) return;
  // bước 1: slow dừng ở cuối nửa đầu (nửa đầu dài hơn hoặc bằng nửa sau)
  let slow = head, fast = head;
  while (fast.next !== null && fast.next.next !== null) { slow = slow.next!; fast = fast.next.next; }
  // bước 2: cắt rồi đảo nửa sau
  let second = reverse(slow.next);
  slow.next = null;
  // bước 3: đan xen, mỗi vòng lấy một nút nửa đầu rồi một nút nửa sau
  let first: ListNode | null = head;
  while (second !== null) {
    const n1: ListNode | null = first!.next, n2: ListNode | null = second.next;
    first!.next = second;
    second.next = n1;
    first = n1;
    second = n2;
  }
}

// Cách 2: chép các nút vào mảng rồi nối lại bằng hai chỉ số. O(n) bộ nhớ thêm.
function reorderArray(head: ListNode | null): void {
  const nodes: ListNode[] = [];
  for (let cur = head; cur !== null; cur = cur.next) nodes.push(cur);
  let i = 0, j = nodes.length - 1;
  while (i < j) {
    nodes[i].next = nodes[j];
    i++;
    if (i === j) break;
    nodes[j].next = nodes[i];
    j--;
  }
  if (nodes.length > 0) nodes[i].next = null;
}

// Biến thể: slow dừng ở giữa thứ hai (điều kiện fast && fast.next). Nửa đầu dài hơn nửa sau tới 2 nút, vẫn đúng.
function reorderSecondMiddle(head: ListNode | null): void {
  if (head === null || head.next === null) return;
  let slow = head, fast: ListNode | null = head;
  while (fast !== null && fast.next !== null) { slow = slow.next!; fast = fast.next.next; }
  let second = reverse(slow.next);
  slow.next = null;
  let first: ListNode | null = head;
  while (second !== null) {
    const n1: ListNode | null = first!.next, n2: ListNode | null = second.next;
    first!.next = second; second.next = n1; first = n1; second = n2;
  }
}

// SAI: quên cắt (slow.next = null). Nửa đầu vẫn nối vào nút giữa cũ, nút đó giờ là đuôi nửa sau đã đảo: sinh vòng.
function wrongNoCut(head: ListNode | null): void {
  if (head === null || head.next === null) return;
  let slow = head, fast = head;
  while (fast.next !== null && fast.next.next !== null) { slow = slow.next!; fast = fast.next.next; }
  let second = reverse(slow.next);
  let first: ListNode | null = head;
  while (second !== null) {
    const n1: ListNode | null = first!.next, n2: ListNode | null = second.next;
    first!.next = second; second.next = n1; first = n1; second = n2;
  }
}

// SAI: cắt trước giữa thứ hai, nên nửa sau dài hơn nửa đầu. Độ dài lẻ thì first hết trước và first.next ném lỗi.
function wrongSecondLonger(head: ListNode | null): void {
  if (head === null || head.next === null) return;
  let prev: ListNode | null = null, slow: ListNode = head, fast: ListNode | null = head;
  while (fast !== null && fast.next !== null) { prev = slow; slow = slow.next!; fast = fast.next.next; }
  prev!.next = null;
  let second = reverse(slow);
  let first: ListNode | null = head;
  while (second !== null) {
    const n1: ListNode | null = first!.next, n2: ListNode | null = second.next;
    first!.next = second; second.next = n1; first = n1; second = n2;
  }
}

const cases: number[][] = [[1, 2, 3, 4], [1, 2, 3, 4, 5], [1], [1, 2], [1, 2, 3], [], [10, 20, 30, 40, 50, 60], [7, 7, 7, 8, 8]];

for (const fn of [reorderThreeSteps, reorderArray, reorderSecondMiddle, wrongNoCut, wrongSecondLonger]) {
  const bad: string[] = [];
  for (const vals of cases) {
    const head = build(vals);
    let got: string;
    try { fn(head); const r = toArray(head, 2 * vals.length + 2); got = r === "vòng" ? r : `[${r.join(",")}]`; }
    catch (e) { got = "ném " + (e as Error).constructor.name; }
    if (got !== `[${expected(vals).join(",")}]`) bad.push(`[${vals.join(",")}] → ${got}`);
  }
  console.log(`${fn.name.padEnd(19)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(", ") : ""}`);
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

// Đối chiếu: mọi độ dài 0..300, giá trị ngẫu nhiên; ba cách đúng phải ra cùng một thứ tự nút (so cả danh tính nút).
{
  const rand = mulberry32(143);
  let agree = 0;
  for (let n = 0; n <= 300; n++) {
    const vals = Array.from({ length: n }, () => Math.floor(rand() * 1000));
    const orders = [reorderThreeSteps, reorderArray, reorderSecondMiddle].map((fn) => {
      const nodes = vals.map((v) => new ListNode(v));
      for (let i = 0; i + 1 < n; i++) nodes[i].next = nodes[i + 1];
      fn(nodes[0] ?? null);
      const ids: number[] = [];
      for (let cur = nodes[0] ?? null; cur !== null && ids.length <= n; cur = cur.next) ids.push(nodes.indexOf(cur));
      return ids.join(",");
    });
    const want = expected(Array.from({ length: n }, (_, i) => i)).join(",");
    if (orders.every((o) => o === want)) agree++;
  }
  console.log(`\nmọi độ dài 0..300: ba cách đúng cho đúng thứ tự nút L0, Ln, L1, … ở ${agree}/301 độ dài`);
}

// ---- Đo ----
v8.setFlagsFromString("--expose-gc");
const gc = vm.runInNewContext("gc") as () => void;

function bench(fn: (h: ListNode | null) => void, n: number): { ms: number; mb: number } {
  const ts: number[] = [];
  let mb = 0;
  for (let r = 0; r < 5; r++) {
    const head = build(Array.from({ length: n }, (_, i) => i));
    gc();
    const before = process.memoryUsage().heapUsed;
    const t0 = performance.now();
    fn(head);
    ts.push(performance.now() - t0);
    mb = Math.max(mb, (process.memoryUsage().heapUsed - before) / 1e6);
  }
  ts.sort((a, b) => a - b);
  return { ms: ts[2], mb };
}

console.log("\nn nút      ba bước              mảng các nút");
for (const n of [100000, 1000000]) {
  const a = bench(reorderThreeSteps, n), b = bench(reorderArray, n);
  console.log(`${String(n).padEnd(10)} ${a.ms.toFixed(2).padStart(7)} ms ${a.mb.toFixed(1).padStart(6)} MB   ${b.ms.toFixed(2).padStart(7)} ms ${b.mb.toFixed(1).padStart(6)} MB`);
}
