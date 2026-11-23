// LeetCode 19: Remove Nth Node From End of List. Chạy: node remove-nth.ts

class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val: number, next: ListNode | null = null) { this.val = val; this.next = next; }
}
const fromArray = (a: number[]): ListNode | null => a.reduceRight<ListNode | null>((next, v) => new ListNode(v, next), null);
const toArray = (h: ListNode | null): number[] => { const out: number[] = []; for (; h; h = h.next) out.push(h.val); return out; };

let steps = 0; // đếm số lần đi qua một con trỏ .next, để so hai cách

// Hai lượt: đếm độ dài L, rồi đi L − n bước từ nút giả để đứng ngay trước nút cần xóa.
function twoPass(head: ListNode | null, n: number): ListNode | null {
  let len = 0;
  for (let p = head; p; p = p.next) { len++; steps++; }
  const dummy = new ListNode(0, head);
  let prev = dummy;
  for (let i = 0; i < len - n; i++) { prev = prev.next!; steps++; }
  prev.next = prev.next!.next; // bỏ qua nút thứ n từ cuối
  return dummy.next;
}

// Một lượt: fast đi trước n + 1 bước từ nút giả; rồi cả hai cùng đi tới khi fast ra khỏi danh sách.
// Lúc đó slow đứng ngay trước nút cần xóa, vì khoảng cách giữa chúng luôn là n + 1.
function onePass(head: ListNode | null, n: number): ListNode | null {
  const dummy = new ListNode(0, head);
  let fast: ListNode | null = dummy, slow = dummy;
  for (let i = 0; i <= n; i++) { fast = fast!.next; steps++; }
  while (fast) { fast = fast.next; slow = slow.next!; steps += 2; }
  slow.next = slow.next!.next;
  return dummy.next;
}

// Mảng các nút: một lượt, nhưng tốn O(L) bộ nhớ cho mảng.
function nodeArray(head: ListNode | null, n: number): ListNode | null {
  const nodes: ListNode[] = [];
  for (let p = head; p; p = p.next) nodes.push(p);
  const i = nodes.length - n; // chỉ số nút cần xóa
  if (i === 0) return head!.next;
  nodes[i - 1].next = nodes[i].next;
  return head;
}

// SAI: không có nút giả; fast đi n bước từ head. Khi n = L (xóa chính đầu), fast thành null.
function wrongNoDummy(head: ListNode | null, n: number): ListNode | null {
  let fast = head, slow = head!;
  for (let i = 0; i < n; i++) fast = fast!.next;
  while (fast!.next) { fast = fast!.next; slow = slow.next!; }
  slow.next = slow.next!.next;
  return head;
}

// SAI: có nút giả nhưng fast chỉ đi trước n bước (thiếu 1): slow dừng ở chính nút cần xóa.
function wrongGap(head: ListNode | null, n: number): ListNode | null {
  const dummy = new ListNode(0, head);
  let fast: ListNode | null = dummy, slow = dummy;
  for (let i = 0; i < n; i++) fast = fast!.next;
  while (fast) { fast = fast.next; slow = slow.next!; }
  if (slow.next) slow.next = slow.next.next;
  return dummy.next;
}

const cases: [number[], number][] = [
  [[1, 2, 3, 4, 5], 2], // ví dụ 1 của đề
  [[1], 1],             // ví dụ 2
  [[1, 2], 1],          // ví dụ 3
  [[1, 2], 2],          // xóa đầu
  [[1, 2, 3], 3],       // xóa đầu
  [[1, 2, 3], 1],       // xóa đuôi
  [[5, 6, 7, 8], 3],
  [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5],
];
const show = (a: number[]) => `[${a.join(",")}]`;
const expect = (a: number[], n: number) => a.filter((_, i) => i !== a.length - n);
for (const fn of [twoPass, onePass, nodeArray, wrongNoDummy, wrongGap]) {
  const bad: string[] = [];
  for (const [a, n] of cases) {
    let got: string;
    try { got = show(toArray(fn(fromArray(a), n))); } catch (e) { got = (e as Error).constructor.name; }
    if (got !== show(expect(a, n))) bad.push(`${show(a)} n=${n} → ${got}`);
  }
  console.log(`${fn.name.padEnd(12)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(", ") : ""}`);
}

// "Một lượt" có đi ít bước hơn không? Đếm số lần theo .next ở L = 10⁶.
const L = 1_000_000;
const values = Array.from({ length: L }, (_, i) => i);
console.log(`\nsố bước theo .next, L = ${L}:`);
console.log("n          hai lượt     một lượt");
for (const n of [1, L / 2, L]) {
  steps = 0; twoPass(fromArray(values), n); const s2 = steps;
  steps = 0; onePass(fromArray(values), n); const s1 = steps;
  console.log(`${String(n).padEnd(10)} ${String(s2).padStart(9)} ${String(s1).padStart(12)}`);
}

// Đo thời gian: trung vị 5 lần, dựng lại danh sách mỗi lần (thao tác xóa làm đổi danh sách).
function bench(fn: (h: ListNode | null, n: number) => ListNode | null, n: number): number {
  const t: number[] = [];
  for (let r = 0; r < 5; r++) {
    const h = fromArray(values);
    const s = performance.now(); fn(h, n); t.push(performance.now() - s);
  }
  return t.sort((a, b) => a - b)[2];
}
console.log(`\nthời gian, L = ${L}:`);
console.log("n          hai lượt   một lượt   mảng nút");
for (const n of [1, L / 2, L]) {
  console.log(`${String(n).padEnd(10)} ${bench(twoPass, n).toFixed(2).padStart(6)} ms ${bench(onePass, n).toFixed(2).padStart(6)} ms ${bench(nodeArray, n).toFixed(2).padStart(6)} ms`);
}
