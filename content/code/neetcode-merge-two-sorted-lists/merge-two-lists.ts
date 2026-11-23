// LeetCode 21: Merge Two Sorted Lists. Chạy: node merge-two-lists.ts

class ListNode {
  val: number;
  next: ListNode | null;
  tag: string; // nhãn để xem nút đến từ danh sách nào (chỉ dùng khi kiểm tính ổn định)
  constructor(val: number, next: ListNode | null = null, tag = "") { this.val = val; this.next = next; this.tag = tag; }
}

function fromArray(a: number[], tag = ""): ListNode | null {
  let head: ListNode | null = null;
  for (let i = a.length - 1; i >= 0; i--) head = new ListNode(a[i], head, tag);
  return head;
}
function toArray(h: ListNode | null): number[] {
  const out: number[] = [];
  for (; h; h = h.next) out.push(h.val);
  return out;
}

// Nút giả (dummy) đứng trước đầu kết quả: mọi nút thật đều được nối vào "sau một nút nào đó",
// nên không cần trường hợp riêng cho đầu danh sách.
function mergeDummy(a: ListNode | null, b: ListNode | null): ListNode | null {
  const dummy = new ListNode(0);
  let tail = dummy;
  while (a && b) {
    if (a.val <= b.val) { tail.next = a; a = a.next; } // <= giữ nút của a trước khi bằng nhau
    else { tail.next = b; b = b.next; }
    tail = tail.next;
  }
  tail.next = a ?? b; // phần còn lại đã sắp sẵn: nối nguyên đuôi, O(1)
  return dummy.next;
}

// Không có nút giả: phải chọn đầu kết quả trước vòng lặp, và phải lo cả hai danh sách rỗng.
function mergeNoDummy(a: ListNode | null, b: ListNode | null): ListNode | null {
  if (!a) return b;
  if (!b) return a;
  let head: ListNode;
  if (a.val <= b.val) { head = a; a = a.next; } else { head = b; b = b.next; }
  let tail = head;
  while (a && b) {
    if (a.val <= b.val) { tail.next = a; a = a.next; } else { tail.next = b; b = b.next; }
    tail = tail.next;
  }
  tail.next = a ?? b;
  return head;
}

// Đệ quy: đầu nhỏ hơn đứng trước, phần sau là kết quả trộn của phần còn lại. Sâu bằng tổng số nút.
function mergeRecursive(a: ListNode | null, b: ListNode | null): ListNode | null {
  if (!a) return b;
  if (!b) return a;
  if (a.val <= b.val) { a.next = mergeRecursive(a.next, b); return a; }
  b.next = mergeRecursive(a, b.next);
  return b;
}

// Tạo nút mới thay vì nối lại nút cũ: hai danh sách gốc không đổi, nhưng tốn m + n lần cấp phát.
function mergeCopy(a: ListNode | null, b: ListNode | null): ListNode | null {
  const dummy = new ListNode(0);
  let tail = dummy;
  while (a || b) {
    if (b === null || (a !== null && a.val <= b.val)) { tail.next = new ListNode(a!.val); a = a!.next; }
    else { tail.next = new ListNode(b.val); b = b.next; }
    tail = tail.next;
  }
  return dummy.next;
}

// SAI: bỏ nút giả nhưng quên trường hợp một danh sách rỗng: đọc .val của null.
function wrongNoDummy(a: ListNode | null, b: ListNode | null): ListNode | null {
  let head: ListNode;
  if (a!.val <= b!.val) { head = a!; a = a!.next; } else { head = b!; b = b!.next; }
  let tail = head;
  while (a && b) {
    if (a.val <= b.val) { tail.next = a; a = a.next; } else { tail.next = b; b = b.next; }
    tail = tail.next;
  }
  tail.next = a ?? b;
  return head;
}

// SAI: hết vòng lặp thì dừng, quên nối phần còn lại của danh sách chưa hết.
function wrongForgetTail(a: ListNode | null, b: ListNode | null): ListNode | null {
  const dummy = new ListNode(0);
  let tail = dummy;
  while (a && b) {
    if (a.val <= b.val) { tail.next = a; a = a.next; } else { tail.next = b; b = b.next; }
    tail = tail.next;
  }
  return dummy.next;
}

// SAI: quên tiến tail, nên mỗi lần nối đè lên dummy.next.
function wrongNoAdvance(a: ListNode | null, b: ListNode | null): ListNode | null {
  const dummy = new ListNode(0);
  const tail = dummy;
  while (a && b) {
    if (a.val <= b.val) { tail.next = a; a = a.next; } else { tail.next = b; b = b.next; }
  }
  tail.next = a ?? b;
  return dummy.next;
}

// Gom hết vào mảng, sắp, dựng lại: đúng nhưng O((m + n) log(m + n)) và bỏ phí việc hai danh sách đã sắp.
function concatSort(a: ListNode | null, b: ListNode | null): ListNode | null {
  return fromArray([...toArray(a), ...toArray(b)].sort((x, y) => x - y));
}

const cases: [number[], number[]][] = [
  [[1, 2, 4], [1, 3, 4]], // ví dụ 1 của đề
  [[], []],              // ví dụ 2
  [[], [0]],             // ví dụ 3
  [[5], [1, 2, 3]],
  [[1, 2, 3], []],
  [[-100, 0, 100], [-100, -50]],
  [[2, 2, 2], [2, 2]],
  [[1, 5, 9], [2, 3, 4, 6, 7, 8, 10]],
];
const expect = (a: number[], b: number[]) => [...a, ...b].sort((x, y) => x - y);
const show = (a: number[]) => `[${a.join(",")}]`;

for (const fn of [mergeDummy, mergeNoDummy, mergeRecursive, mergeCopy, concatSort, wrongNoDummy, wrongForgetTail, wrongNoAdvance]) {
  const bad: string[] = [];
  for (const [a, b] of cases) {
    let got: string;
    try { got = show(toArray(fn(fromArray(a), fromArray(b)))); }
    catch (e) { got = (e as Error).constructor.name; }
    if (got !== show(expect(a, b))) bad.push(`${show(a)}+${show(b)} → ${got}`);
  }
  console.log(`${fn.name.padEnd(15)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(", ") : ""}`);
}

// Tính ổn định: khi bằng nhau, nút của danh sách thứ nhất có đứng trước không?
function mergeStrict(a: ListNode | null, b: ListNode | null): ListNode | null {
  const dummy = new ListNode(0);
  let tail = dummy;
  while (a && b) {
    if (a.val < b.val) { tail.next = a; a = a.next; } else { tail.next = b; b = b.next; } // < thay vì <=
    tail = tail.next;
  }
  tail.next = a ?? b;
  return dummy.next;
}
const tags = (h: ListNode | null) => { const t: string[] = []; for (; h; h = h.next) t.push(`${h.val}${h.tag}`); return t.join(" "); };
console.log("\nổn định, [1,2,2] (a) với [2,3] (b):");
console.log("  <= :", tags(mergeDummy(fromArray([1, 2, 2], "a"), fromArray([2, 3], "b"))));
console.log("  <  :", tags(mergeStrict(fromArray([1, 2, 2], "a"), fromArray([2, 3], "b"))));

// Bộ sinh ngẫu nhiên mulberry32: trạng thái 32 bit, mọi phép nhân qua Math.imul nên không mất chính xác.
function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(21);
const sortedRandom = (n: number) => Array.from({ length: n }, () => Math.floor(rand() * 2 * n)).sort((x, y) => x - y);

// Độ sâu đệ quy: tìm tổng số nút lớn nhất mà mergeRecursive còn chạy được (tìm kiếm nhị phân trên n).
const recOk = (n: number) => {
  const a = fromArray(Array.from({ length: n >> 1 }, (_, i) => 2 * i));
  const b = fromArray(Array.from({ length: n - (n >> 1) }, (_, i) => 2 * i + 1));
  try { mergeRecursive(a, b); return true; } catch { return false; }
};
let lo = 1, hi = 1 << 20;
while (lo < hi) { const m = (lo + hi + 1) >>> 1; if (recOk(m)) lo = m; else hi = m - 1; }
console.log(`\nđệ quy chạy được tới tổng ${lo} nút; ${lo + 1} nút ném RangeError`);

// Đo: trung vị 5 lần. Mỗi lần dựng lại hai danh sách vì các cách nối lại nút làm đổi danh sách gốc.
function bench(fn: typeof mergeDummy, a: number[], b: number[]): number {
  const t: number[] = [];
  for (let r = 0; r < 5; r++) {
    const x = fromArray(a), y = fromArray(b);
    const s = performance.now(); fn(x, y); t.push(performance.now() - s);
  }
  return t.sort((p, q) => p - q)[2];
}
console.log("\nm = n      dummy     đệ quy    tạo nút mới  gom rồi sắp");
for (const n of [1000, 4000, 100000, 1000000]) {
  const a = sortedRandom(n), b = sortedRandom(n);
  const rec = 2 * n <= lo ? bench(mergeRecursive, a, b).toFixed(2) + " ms" : "RangeError";
  console.log(`${String(n).padEnd(9)}${bench(mergeDummy, a, b).toFixed(2).padStart(7)} ms ${rec.padStart(10)} ${bench(mergeCopy, a, b).toFixed(2).padStart(9)} ms ${bench(concatSort, a, b).toFixed(2).padStart(9)} ms`);
}
