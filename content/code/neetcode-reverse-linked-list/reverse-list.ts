// LC 206 Reverse Linked List: lật chiều mọi con trỏ next.
// Chạy: node reverse-list.ts

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

// Đọc tối đa limit nút; nếu còn nút sau đó thì danh sách có vòng (hoặc quá dài).
function toArray(head: ListNode | null, limit = 1e7): number[] | "VÒNG" {
  const out: number[] = [];
  for (let p = head; p; p = p.next) { if (out.length === limit) return "VÒNG"; out.push(p.val); }
  return out;
}

// Lặp: ba con trỏ prev, cur, next. Giữ next trước khi lật cur.next.
function reverseIterative(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let cur = head;
  while (cur) {
    const next = cur.next; // giữ phần còn lại trước khi cắt
    cur.next = prev;       // lật một con trỏ
    prev = cur;            // tiến hai con trỏ
    cur = next;
  }
  return prev;
}

// Đệ quy: lật phần sau head, rồi gắn head vào cuối phần đã lật.
function reverseRecursive(head: ListNode | null): ListNode | null {
  if (!head || !head.next) return head;
  const newHead = reverseRecursive(head.next);
  head.next.next = head; // nút sau head giờ trỏ ngược về head
  head.next = null;      // head thành đuôi
  return newHead;
}

// Chép giá trị ra mảng rồi ghi ngược lại: đúng, nhưng tốn O(n) bộ nhớ phụ.
function reverseViaArray(head: ListNode | null): ListNode | null {
  const vals: number[] = [];
  for (let p = head; p; p = p.next) vals.push(p.val);
  let i = vals.length - 1;
  for (let p = head; p; p = p.next) p.val = vals[i--];
  return head;
}

// SAI: lật cur.next rồi mới đi tiếp theo cur.next, nên đi ngược về prev và mất phần còn lại.
function wrongLoseNext(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let cur = head;
  while (cur) {
    cur.next = prev;
    prev = cur;
    cur = cur.next; // cur.next giờ là prev cũ, không phải nút kế
  }
  return prev;
}

// SAI: đệ quy quên head.next = null, nên nút đầu cũ và nút thứ hai trỏ vào nhau thành vòng.
function wrongNoNullHead(head: ListNode | null): ListNode | null {
  if (!head || !head.next) return head;
  const newHead = wrongNoNullHead(head.next);
  head.next.next = head;
  return newHead;
}

// Bộ sinh ngẫu nhiên mulberry32: trạng thái 32 bit, phép nhân qua Math.imul nên không mất chính xác.
function mulberry32(a: number): () => number {
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const cases: number[][] = [[1, 2, 3, 4, 5], [1, 2], [], [1], [3, 3, 1], Array.from({ length: 5000 }, (_, i) => i)];
const names = ["ví dụ 1", "ví dụ 2", "rỗng", "một nút", "trùng giá trị", "5000 nút (giới hạn đề)"];
const fns = [reverseIterative, reverseRecursive, reverseViaArray, wrongLoseNext, wrongNoNullHead];
for (const fn of fns) {
  const bad: string[] = [];
  cases.forEach((c, k) => {
    const got = toArray(fn(fromArray(c)), c.length + 1);
    const want = [...c].reverse();
    if (got === "VÒNG" || got.join() !== want.join()) bad.push(`${names[k]} → ${got === "VÒNG" ? "VÒNG" : "[" + got.slice(0, 5).join(",") + (got.length > 5 ? ",…" : "") + "]"}`);
  });
  console.log(`${fn.name.padEnd(17)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(", ") : ""}`);
}

// Đối chiếu ngẫu nhiên: 2 000 danh sách, độ dài 0..50, giá trị từ mulberry32.
const rnd = mulberry32(206);
let mismatch = 0;
for (let t = 0; t < 2000; t++) {
  const a = Array.from({ length: Math.floor(rnd() * 51) }, () => Math.floor(rnd() * 100));
  const want = [...a].reverse().join();
  for (const fn of [reverseIterative, reverseRecursive, reverseViaArray]) if ((toArray(fn(fromArray(a))) as number[]).join() !== want) mismatch++;
}
console.log(`đối chiếu 2000 danh sách ngẫu nhiên: ${mismatch} lần lệch`);

// Độ sâu đệ quy tối đa: tìm nhị phân trên n, mỗi n dựng lại danh sách.
function maxDepth(): number {
  const ok = (n: number) => { try { reverseRecursive(fromArray(Array.from({ length: n }, (_, i) => i))); return true; } catch { return false; } };
  let lo = 1, hi = 200000;
  while (lo < hi) { const m = (lo + hi + 1) >> 1; ok(m) ? (lo = m) : (hi = m - 1); }
  return lo;
}
console.log(`đệ quy sâu tối đa: ${maxDepth()} nút`);

// Đo thời gian: trung vị 5 lần, mỗi lần dựng danh sách mới (không tính thời gian dựng).
function bench(fn: (h: ListNode | null) => ListNode | null, n: number): string {
  const ts: number[] = [];
  for (let r = 0; r < 5; r++) {
    const h = fromArray(Array.from({ length: n }, (_, i) => i));
    const t0 = performance.now();
    try { fn(h); } catch { return "RangeError"; }
    ts.push(performance.now() - t0);
  }
  ts.sort((x, y) => x - y);
  return ts[2].toFixed(2) + " ms";
}
console.log("n          lặp          đệ quy        chép ra mảng");
for (const n of [1000, 5000, 100000, 1000000]) {
  console.log(`${String(n).padEnd(10)} ${bench(reverseIterative, n).padEnd(12)} ${bench(reverseRecursive, n).padEnd(13)} ${bench(reverseViaArray, n)}`);
}

// Bộ nhớ: cần node --expose-gc để gọi gc() trước mỗi lần đọc heapUsed; không có thì bỏ qua.
const gc = (globalThis as { gc?: () => void }).gc;
const keepAlive: unknown[] = [];
if (gc) {
  const N = 1_000_000;
  const heap = () => { gc(); gc(); return process.memoryUsage().heapUsed; };
  heap();
  let h0 = heap();
  let list: ListNode | null = null;
  for (let i = N - 1; i >= 0; i--) list = new ListNode(i, list);
  const perNode = (heap() - h0) / N;
  h0 = heap();
  const vals: number[] = [];
  for (let p = list; p; p = p.next) vals.push(p.val);
  const perVal = (heap() - h0) / N;
  keepAlive.push(list, vals); // giữ cả hai sống tới sau lần đo, nếu không V8 có thể thu hồi list sớm
  console.log(`bộ nhớ, n = 10⁶: mỗi nút danh sách ~${perNode.toFixed(1)} byte; mảng chép giá trị thêm ~${perVal.toFixed(1)} byte mỗi phần tử (${((perVal * N) / 2 ** 20).toFixed(1)} MiB); bản lặp thêm 3 biến`);
} else {
  console.log("bộ nhớ: chạy node --expose-gc reverse-list.ts để đo");
}
