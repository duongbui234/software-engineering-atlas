// LeetCode 703, Kth Largest Element in a Stream: sắp lại mỗi lần, min-heap k chỗ, hai bản sai và phép đo.
// Chạy: node kth-largest-stream.ts

// Min-heap viết tay: JS/TS không có heap sẵn. Cha ở i, hai con ở 2i + 1 và 2i + 2.
class MinHeap {
  a: number[] = [];
  swaps = 0; // đếm số lần đổi chỗ, để so heapify với n lần push
  get size(): number { return this.a.length; }
  peek(): number { return this.a[0]; }
  push(x: number): void {
    const a = this.a;
    a.push(x);
    let i = a.length - 1;
    while (i > 0) { // nổi lên: đổi với cha khi nhỏ hơn cha
      const p = (i - 1) >> 1;
      if (a[p] <= a[i]) break;
      [a[p], a[i]] = [a[i], a[p]]; this.swaps++;
      i = p;
    }
  }
  pop(): number {
    const a = this.a, top = a[0], last = a.pop()!;
    if (a.length > 0) { a[0] = last; this.siftDown(0); }
    return top;
  }
  siftDown(i: number): void { // chìm xuống: đổi với con nhỏ hơn khi lớn hơn nó
    const a = this.a, n = a.length;
    for (;;) {
      const l = 2 * i + 1, r = l + 1;
      let m = i;
      if (l < n && a[l] < a[m]) m = l;
      if (r < n && a[r] < a[m]) m = r;
      if (m === i) return;
      [a[m], a[i]] = [a[i], a[m]]; this.swaps++;
      i = m;
    }
  }
  // Floyd: dựng heap từ mảng có sẵn bằng cách cho chìm từ cha cuối cùng về gốc. O(n).
  static heapify(xs: number[]): MinHeap {
    const h = new MinHeap();
    h.a = xs.slice();
    for (let i = (h.a.length >> 1) - 1; i >= 0; i--) h.siftDown(i);
    return h;
  }
}

interface Stream { add(val: number): number }

// Cách thẳng: giữ mọi số, mỗi lần add thì sắp lại và đọc ô thứ k từ cuối. O(n log n) mỗi lần add.
class SortEachAdd implements Stream {
  k: number; nums: number[];
  constructor(k: number, nums: number[]) { this.k = k; this.nums = nums.slice(); }
  add(val: number): number {
    this.nums.push(val);
    this.nums.sort((x, y) => x - y);
    return this.nums[this.nums.length - this.k];
  }
}

// Min-heap k chỗ: heap chỉ giữ k số lớn nhất đã thấy; số nhỏ nhất trong k số đó (đỉnh) là số lớn thứ k.
class KthLargest implements Stream {
  heap = new MinHeap();
  k: number;
  constructor(k: number, nums: number[]) {
    this.k = k;
    for (const x of nums) this.add(x);
  }
  add(val: number): number {
    if (this.heap.size < this.k) this.heap.push(val);
    else if (val > this.heap.peek()) { // mạnh hơn ứng viên yếu nhất: thay nó
      this.heap.a[0] = val;
      this.heap.siftDown(0);
    }
    return this.heap.peek();
  }
}

// SAI 1: quên bỏ bớt khi heap quá k phần tử. Đỉnh thành số nhỏ nhất của cả luồng.
class NoTrimKthLargest implements Stream {
  heap = new MinHeap();
  constructor(k: number, nums: number[]) { for (const x of nums) this.heap.push(x); }
  add(val: number): number {
    this.heap.push(val);
    return this.heap.peek();
  }
}

// SAI 2: dùng max-heap k chỗ (đảo dấu để mượn MinHeap). Giữ k số NHỎ nhất, đỉnh là số lớn nhất trong đó.
class MaxHeapKthLargest implements Stream {
  heap = new MinHeap(); // lưu -x
  k: number;
  constructor(k: number, nums: number[]) { this.k = k; for (const x of nums) this.add(x); }
  add(val: number): number {
    this.heap.push(-val);
    if (this.heap.size > this.k) this.heap.pop();
    return -this.heap.peek();
  }
}

// Ca thử: [k, nums, các số add, các kết quả mong đợi]
const cases: [string, number, number[], number[], number[]][] = [
  ["ví dụ của đề", 3, [4, 5, 8, 2], [3, 5, 10, 9, 4], [4, 5, 5, 8, 8]],
  ["nhiều số 7 trùng", 4, [7, 7, 7, 7, 8, 3], [2, 10, 9, 9], [7, 7, 7, 8]],
  ["nums rỗng, k = 1", 1, [], [-3, -2, -4, 0, 4], [-3, -2, -2, 0, 4]],
  ["nums thiếu một số", 2, [0], [-1, 1, -2, -4, 3], [-1, 0, 0, 0, 1]],
  ["số trùng", 2, [5, 5], [5, 1, 6], [5, 5, 5]],
  ["k bằng cả luồng", 3, [1, 2], [3, 0], [1, 1]],
  ["số âm", 2, [-10, -20], [-5, -30, -1], [-10, -10, -5]],
];

function makeRandom(seed: number) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 2 ** 32; };
}

// Thêm một ca ngẫu nhiên dài, đáp án lấy từ cách sắp lại mỗi lần.
{
  const rnd = makeRandom(7), k = 50;
  const nums = Array.from({ length: 200 }, () => Math.floor(rnd() * 20001) - 10000);
  const adds = Array.from({ length: 500 }, () => Math.floor(rnd() * 20001) - 10000);
  const ref = new SortEachAdd(k, nums);
  cases.push(["ngẫu nhiên 200 + 500 số, k = 50", k, nums, adds, adds.map((v) => ref.add(v))]);
}

type Ctor = new (k: number, nums: number[]) => Stream;
for (const C of [SortEachAdd, KthLargest, NoTrimKthLargest, MaxHeapKthLargest] as Ctor[]) {
  const bad: string[] = [];
  for (const [name, k, nums, adds, want] of cases) {
    const s = new C(k, nums);
    const got = adds.map((v) => s.add(v));
    if (got.join() !== want.join()) bad.push(adds.length <= 5 ? `${name} → [${got.join(", ")}]` : name);
  }
  console.log(`${C.name.padEnd(18)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở: " + bad.join("; ") : ""}`);
}

// Đo 1: 10⁴ số ban đầu, 10⁴ lần add, k = 100. Trung vị 5 lần.
function median(xs: number[]): number { const s = xs.slice().sort((a, b) => a - b); return s[s.length >> 1]; }
function time(fn: () => void): number { const t = performance.now(); fn(); return performance.now() - t; }
console.log("\nĐo: 10⁴ số ban đầu + n lần add, k = 100 (trung vị 5 lần)");
console.log("n add       sắp lại mỗi lần   min-heap k chỗ");
for (const n of [1_000, 10_000]) {
  const rnd = makeRandom(n);
  const nums = Array.from({ length: 10_000 }, () => Math.floor(rnd() * 20001) - 10000);
  const adds = Array.from({ length: n }, () => Math.floor(rnd() * 20001) - 10000);
  const run = (C: Ctor) => median(Array.from({ length: 5 }, () => time(() => { const s = new C(100, nums); for (const v of adds) s.add(v); })));
  console.log(`${String(n).padEnd(10)}${run(SortEachAdd).toFixed(1).padStart(12)} ms${run(KthLargest).toFixed(2).padStart(14)} ms`);
}
// Luồng tăng dần là ca xấu nhất của heap: số nào cũng lớn hơn đỉnh, nên lần add nào cũng phải chìm xuống.
{
  const nums = Array.from({ length: 10_000 }, (_, i) => i), adds = Array.from({ length: 10_000 }, (_, i) => 10_000 + i);
  const t = median(Array.from({ length: 5 }, () => time(() => { const s = new KthLargest(100, nums); for (const v of adds) s.add(v); })));
  const t2 = median(Array.from({ length: 5 }, () => time(() => { const s = new KthLargest(5000, nums); for (const v of adds) s.add(v); })));
  console.log(`luồng tăng dần, 10⁴ add: min-heap k = 100 mất ${t.toFixed(2)} ms, k = 5 000 mất ${t2.toFixed(2)} ms`);
}

// Đo 2: dựng heap n phần tử bằng n lần push so với heapify của Floyd. Đếm số lần đổi chỗ và thời gian.
console.log("\nĐo: dựng heap n phần tử ngẫu nhiên (trung vị 5 lần)");
console.log("n            n lần push              heapify (Floyd)");
for (const n of [100_000, 1_000_000]) {
  const rnd = makeRandom(n + 1);
  const xs = Array.from({ length: n }, () => Math.floor(rnd() * 1e9));
  let swPush = 0, swHeapify = 0;
  const tPush = median(Array.from({ length: 5 }, () => time(() => { const h = new MinHeap(); for (const x of xs) h.push(x); swPush = h.swaps; })));
  const tHeap = median(Array.from({ length: 5 }, () => time(() => { swHeapify = MinHeap.heapify(xs).swaps; })));
  console.log(`${String(n).padEnd(10)}${tPush.toFixed(1).padStart(8)} ms, ${String(swPush).padStart(8)} lần đổi${tHeap.toFixed(1).padStart(8)} ms, ${String(swHeapify).padStart(8)} lần đổi`);
}
// Dãy giảm dần là ca xấu nhất của push: mỗi số mới nổi lên tận gốc.
{
  const n = 1_000_000, xs = Array.from({ length: n }, (_, i) => n - i);
  const h = new MinHeap(); for (const x of xs) h.push(x);
  console.log(`dãy giảm dần, n = 10⁶: push ${h.swaps} lần đổi, heapify ${MinHeap.heapify(xs).swaps} lần đổi`);
}
