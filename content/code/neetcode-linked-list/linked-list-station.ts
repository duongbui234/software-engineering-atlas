// Ga LINK-01: con trỏ trên danh sách liên kết. Giải 206, 21, 141, 143, 19.
// Chạy: node linked-list-station.ts

class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val: number, next: ListNode | null = null) { this.val = val; this.next = next; }
}

function fromArray(a: number[]): ListNode | null {
  let head: ListNode | null = null;
  for (let i = a.length - 1; i >= 0; i--) head = new ListNode(a[i], head);
  return head;
}

function toArray(head: ListNode | null): number[] {
  const out: number[] = [];
  for (let p = head; p; p = p.next) out.push(p.val);
  return out;
}

// Dựng danh sách có vòng: nút cuối trỏ về nút thứ pos (pos = -1: không vòng).
function withCycle(a: number[], pos: number): ListNode | null {
  const head = fromArray(a);
  if (pos < 0 || !head) return head;
  let tail = head, target: ListNode | null = null, i = 0;
  for (let p: ListNode | null = head; p; p = p.next, i++) { if (i === pos) target = p; tail = p; }
  tail.next = target;
  return head;
}

// 206: lật từng con trỏ, giữ next trước khi cắt.
function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null, cur = head;
  while (cur) { const next: ListNode | null = cur.next; cur.next = prev; prev = cur; cur = next; }
  return prev;
}

// 21: nút giả đứng trước kết quả, nên không cần xử lý riêng nút đầu.
function mergeTwoLists(a: ListNode | null, b: ListNode | null): ListNode | null {
  const dummy = new ListNode(0);
  let tail = dummy;
  while (a && b) {
    if (a.val <= b.val) { tail.next = a; a = a.next; } else { tail.next = b; b = b.next; }
    tail = tail.next;
  }
  tail.next = a ?? b; // phần còn lại đã sắp sẵn, nối nguyên khúc
  return dummy.next;
}

// 141: con chậm đi 1 bước, con nhanh đi 2 bước; có vòng thì con nhanh đuổi kịp con chậm.
function hasCycle(head: ListNode | null): boolean {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}

// 143: tìm giữa bằng chậm/nhanh, lật nửa sau, rồi đan hai nửa.
function reorderList(head: ListNode | null): void {
  if (!head || !head.next) return;
  let slow: ListNode = head, fast: ListNode | null = head;
  while (fast.next && fast.next.next) { slow = slow.next!; fast = fast.next.next; }
  let second = reverseList(slow.next);
  slow.next = null; // cắt đôi
  let first: ListNode | null = head;
  while (second) {
    const n1: ListNode | null = first!.next, n2: ListNode | null = second.next;
    first!.next = second;
    second.next = n1;
    first = n1;
    second = n2;
  }
}

// 19: nút giả, con trước đi trước n + 1 bước; khi nó tới cuối, con sau đứng ngay trước nút cần xóa.
function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
  const dummy = new ListNode(0, head);
  let lead: ListNode | null = dummy, lag: ListNode = dummy;
  for (let i = 0; i <= n; i++) lead = lead!.next;
  while (lead) { lead = lead.next; lag = lag.next!; }
  lag.next = lag.next!.next;
  return dummy.next;
}

type Case = [string, () => unknown, unknown];
const cases: Case[] = [
  ["206 ví dụ", () => toArray(reverseList(fromArray([1, 2, 3, 4, 5]))), [5, 4, 3, 2, 1]],
  ["206 rỗng", () => toArray(reverseList(null)), []],
  ["21 ví dụ", () => toArray(mergeTwoLists(fromArray([1, 2, 4]), fromArray([1, 3, 4]))), [1, 1, 2, 3, 4, 4]],
  ["21 hai rỗng", () => toArray(mergeTwoLists(null, null)), []],
  ["21 một rỗng", () => toArray(mergeTwoLists(null, fromArray([0]))), [0]],
  ["141 vòng về nút 1", () => hasCycle(withCycle([3, 2, 0, -4], 1)), true],
  ["141 vòng về nút 0", () => hasCycle(withCycle([1, 2], 0)), true],
  ["141 không vòng", () => hasCycle(withCycle([1], -1)), false],
  ["143 chẵn", () => { const h = fromArray([1, 2, 3, 4]); reorderList(h); return toArray(h); }, [1, 4, 2, 3]],
  ["143 lẻ", () => { const h = fromArray([1, 2, 3, 4, 5]); reorderList(h); return toArray(h); }, [1, 5, 2, 4, 3]],
  ["143 một nút", () => { const h = fromArray([1]); reorderList(h); return toArray(h); }, [1]],
  ["19 ví dụ", () => toArray(removeNthFromEnd(fromArray([1, 2, 3, 4, 5]), 2)), [1, 2, 3, 5]],
  ["19 xóa nút duy nhất", () => toArray(removeNthFromEnd(fromArray([1]), 1)), []],
  ["19 xóa nút đầu", () => toArray(removeNthFromEnd(fromArray([1, 2]), 2)), [2]],
];
const bad = cases.filter(([, f, want]) => JSON.stringify(f()) !== JSON.stringify(want)).map(([name]) => name);
console.log(`linked-list-station ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(", ") : ""}`);

// Bộ sinh ngẫu nhiên mulberry32: trạng thái 32 bit, phép nhân qua Math.imul nên không mất chính xác.
function mulberry32(a: number): () => number {
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Đối chiếu với lời giải bằng mảng: 2 000 danh sách ngẫu nhiên cho 143 và 19.
const rnd = mulberry32(1);
let mismatch = 0;
for (let t = 0; t < 2000; t++) {
  const a = Array.from({ length: 1 + Math.floor(rnd() * 40) }, () => Math.floor(rnd() * 100));
  const h = fromArray(a); reorderList(h);
  const want143: number[] = [];
  for (let i = 0, j = a.length - 1; i <= j; i++, j--) { want143.push(a[i]); if (i !== j) want143.push(a[j]); }
  if (toArray(h).join() !== want143.join()) mismatch++;
  const n = 1 + Math.floor(rnd() * a.length);
  const want19 = a.filter((_, i) => i !== a.length - n);
  if (toArray(removeNthFromEnd(fromArray(a), n)).join() !== want19.join()) mismatch++;
}
console.log(`đối chiếu 2000 danh sách ngẫu nhiên (143, 19): ${mismatch} lần lệch`);

// 141: Set các nút đã gặp so với hai con trỏ, n = 10⁶, vòng quay về nút giữa.
function hasCycleSet(head: ListNode | null): boolean {
  const seen = new Set<ListNode>();
  for (let p = head; p; p = p.next) { if (seen.has(p)) return true; seen.add(p); }
  return false;
}
function median(f: () => void): number {
  const ts: number[] = [];
  for (let r = 0; r < 5; r++) { const t0 = performance.now(); f(); ts.push(performance.now() - t0); }
  return ts.sort((x, y) => x - y)[2];
}
const N = 1_000_000;
const cyc = withCycle(Array.from({ length: N }, (_, i) => i), N / 2);
console.log(`141, n = 10⁶ có vòng: Set ${median(() => hasCycleSet(cyc)).toFixed(1)} ms, chậm/nhanh ${median(() => hasCycle(cyc)).toFixed(1)} ms`);
