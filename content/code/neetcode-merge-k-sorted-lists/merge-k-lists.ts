// LC 23 Merge k Sorted Lists: gom rồi sắp, trộn lần lượt, heap k đầu danh sách, chia để trị từng cặp.
// Chạy: node merge-k-lists.ts

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
function toArray(head: ListNode | null, limit = 1e7): number[] | "vòng" {
  const out: number[] = [];
  for (let cur = head; cur !== null; cur = cur.next) {
    if (out.length >= limit) return "vòng";
    out.push(cur.val);
  }
  return out;
}

// Trộn hai danh sách đã sắp bằng nút giả (bài 21).
function mergeTwo(a: ListNode | null, b: ListNode | null): ListNode | null {
  const dummy = new ListNode(0);
  let tail = dummy;
  while (a !== null && b !== null) {
    if (a.val <= b.val) { tail.next = a; a = a.next; } else { tail.next = b; b = b.next; }
    tail = tail.next;
  }
  tail.next = a !== null ? a : b;
  return dummy.next;
}

// Cách 1: gom mọi giá trị, sắp, dựng danh sách mới. O(N log N), tạo N nút mới.
function mergeCollectSort(lists: (ListNode | null)[]): ListNode | null {
  const vals: number[] = [];
  for (const l of lists) for (let cur = l; cur !== null; cur = cur.next) vals.push(cur.val);
  vals.sort((x, y) => x - y);
  return build(vals);
}

// Cách 2: trộn lần lượt vào một danh sách kết quả. Danh sách kết quả dài dần, nên O(kN).
function mergeOneByOne(lists: (ListNode | null)[]): ListNode | null {
  let acc: ListNode | null = null;
  for (const l of lists) acc = mergeTwo(acc, l);
  return acc;
}

// Min-heap các nút, so theo val. JS/TS không có heap sẵn.
class NodeHeap {
  private a: ListNode[] = [];
  get size(): number { return this.a.length; }
  push(n: ListNode): void {
    const a = this.a;
    a.push(n);
    let i = a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (a[p].val <= a[i].val) break;
      [a[p], a[i]] = [a[i], a[p]];
      i = p;
    }
  }
  pop(): ListNode {
    const a = this.a, top = a[0], last = a.pop()!;
    if (a.length > 0) {
      a[0] = last;
      let i = 0;
      for (;;) {
        const l = 2 * i + 1, r = l + 1;
        let m = i;
        if (l < a.length && a[l].val < a[m].val) m = l;
        if (r < a.length && a[r].val < a[m].val) m = r;
        if (m === i) break;
        [a[m], a[i]] = [a[i], a[m]];
        i = m;
      }
    }
    return top;
  }
}

// Cách 3: heap giữ tối đa k nút (đầu hiện tại của mỗi danh sách). O(N log k).
function mergeHeap(lists: (ListNode | null)[]): ListNode | null {
  const heap = new NodeHeap();
  for (const l of lists) if (l !== null) heap.push(l);
  const dummy = new ListNode(0);
  let tail = dummy;
  while (heap.size > 0) {
    const node = heap.pop();
    tail.next = node;
    tail = node;
    if (node.next !== null) heap.push(node.next);
  }
  return dummy.next;
}

// Cách 4: chia để trị, trộn từng cặp theo vòng: k → k/2 → … → 1 danh sách. O(N log k), không cần heap.
function mergeDivide(lists: (ListNode | null)[]): ListNode | null {
  if (lists.length === 0) return null;
  let cur = lists.slice();
  while (cur.length > 1) {
    const next: (ListNode | null)[] = [];
    for (let i = 0; i < cur.length; i += 2) next.push(i + 1 < cur.length ? mergeTwo(cur[i], cur[i + 1]) : cur[i]);
    cur = next;
  }
  return cur[0];
}

// Cách 4 viết đệ quy: chia đôi mảng danh sách. Độ sâu đệ quy chỉ khoảng log₂ k.
function mergeDivideRecursive(lists: (ListNode | null)[]): ListNode | null {
  const go = (lo: number, hi: number): ListNode | null => {
    if (lo > hi) return null;
    if (lo === hi) return lists[lo];
    const mid = (lo + hi) >> 1;
    return mergeTwo(go(lo, mid), go(mid + 1, hi));
  };
  return go(0, lists.length - 1);
}

// SAI: đẩy cả danh sách rỗng (null) vào heap. Ca có danh sách rỗng ném TypeError khi so null.val.
function wrongPushNull(lists: (ListNode | null)[]): ListNode | null {
  const heap = new NodeHeap();
  for (const l of lists) heap.push(l as ListNode);
  const dummy = new ListNode(0);
  let tail = dummy;
  while (heap.size > 0) {
    const node = heap.pop();
    tail.next = node;
    tail = node;
    if (node.next !== null) heap.push(node.next);
  }
  return dummy.next;
}

// SAI: gom rồi sort() không truyền hàm so sánh: sắp theo chuỗi, "-3" < "-5" < "10" < "9".
function wrongDefaultSort(lists: (ListNode | null)[]): ListNode | null {
  const vals: number[] = [];
  for (const l of lists) for (let cur = l; cur !== null; cur = cur.next) vals.push(cur.val);
  vals.sort();
  return build(vals);
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

const cases: [string, number[][]][] = [
  ["ví dụ của đề", [[1, 4, 5], [1, 3, 4], [2, 6]]],
  ["không có danh sách", []],
  ["một danh sách rỗng", [[]]],
  ["rỗng xen kẽ", [[], [1], [], [0, 2]]],
  ["một danh sách", [[1, 2, 3]]],
  ["số âm", [[-10, -5, 0], [-3, 10]]],
  ["9 và 10", [[9], [10], [2]]],
  ["20 danh sách 1 phần tử", Array.from({ length: 20 }, (_, i) => [(i * 7) % 20])],
  ["trùng hết", [[5, 5], [5], [5, 5, 5]]],
];
const expect = (input: number[][]) => input.flat().sort((x, y) => x - y);

const fns = [mergeCollectSort, mergeOneByOne, mergeHeap, mergeDivide, mergeDivideRecursive, wrongPushNull, wrongDefaultSort];
for (const fn of fns) {
  const bad: string[] = [];
  for (const [name, input] of cases) {
    let got: string;
    try {
      const r = toArray(fn(input.map(build)));
      got = r === "vòng" ? "vòng" : JSON.stringify(r);
    } catch (e) {
      got = "ném " + (e as Error).constructor.name;
    }
    if (got !== JSON.stringify(expect(input))) bad.push(`${name} → ${got}`);
  }
  console.log(`${fn.name.padEnd(20)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(", ") : ""}`);
}

// Đối chiếu ngẫu nhiên: 2000 bộ, k từ 0 tới 30, mỗi danh sách 0..20 phần tử trong [-50, 50].
{
  const rnd = mulberry32(23);
  const ok = [0, 0, 0, 0, 0];
  const T = 2000;
  for (let t = 0; t < T; t++) {
    const k = Math.floor(rnd() * 31);
    const input: number[][] = [];
    for (let i = 0; i < k; i++) {
      const len = Math.floor(rnd() * 21);
      const l = Array.from({ length: len }, () => Math.floor(rnd() * 101) - 50).sort((x, y) => x - y);
      input.push(l);
    }
    const want = JSON.stringify(expect(input));
    fns.slice(0, 5).forEach((fn, j) => { if (JSON.stringify(toArray(fn(input.map(build)))) === want) ok[j]++; });
  }
  console.log(`\nngẫu nhiên: ${fns.slice(0, 5).map((f, j) => `${f.name} ${ok[j]}/${T}`).join(", ")}`);
}

// Đo: N = 10⁵ nút chia đều cho k danh sách, giá trị ngẫu nhiên. Mỗi lần đo dựng lại danh sách (không tính giờ).
function makeInput(N: number, k: number, seed: number): number[][] {
  const rnd = mulberry32(seed);
  const per = Math.floor(N / k);
  return Array.from({ length: k }, () => Array.from({ length: per }, () => Math.floor(rnd() * 20001) - 10000).sort((x, y) => x - y));
}
function timeIt(fn: (l: (ListNode | null)[]) => ListNode | null, input: number[][], reps: number): number {
  const ts: number[] = [];
  for (let r = 0; r < reps; r++) {
    const lists = input.map(build);
    const t0 = performance.now();
    fn(lists);
    ts.push(performance.now() - t0);
  }
  ts.sort((x, y) => x - y);
  return ts[Math.floor(reps / 2)];
}
console.log("\nN = 100000 nút, trung vị 5 lần (ms)");
console.log("k          gom+sắp   lần lượt     heap   chia đôi");
for (const k of [10, 100, 1000, 10000]) {
  const input = makeInput(100000, k, k);
  const row = [mergeCollectSort, mergeOneByOne, mergeHeap, mergeDivide].map((fn) => timeIt(fn, input, 5).toFixed(2));
  console.log(`${String(k).padEnd(8)} ${row.map((x) => x.padStart(9)).join(" ")}`);
}
console.log("\nN = 1000000 nút, trung vị 5 lần (ms)");
console.log("k          gom+sắp     heap   chia đôi");
for (const k of [10, 1000, 100000]) {
  const input = makeInput(1000000, k, k + 1);
  const row = [mergeCollectSort, mergeHeap, mergeDivide].map((fn) => timeIt(fn, input, 5).toFixed(2));
  console.log(`${String(k).padEnd(8)} ${row.map((x) => x.padStart(9)).join(" ")}`);
}
