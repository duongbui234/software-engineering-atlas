// LeetCode 973, K Closest Points to Origin: sắp xếp, max-heap k chỗ, min-heap cả mảng, quickselect, một bản sai và phép đo.
// Chạy: node k-closest.ts

type P = [number, number];
const dist2 = ([x, y]: P) => x * x + y * y; // bình phương khoảng cách: cùng thứ tự với khoảng cách, không cần căn

// Sắp xếp theo khoảng cách rồi lấy k điểm đầu. O(n log n).
function sortAll(points: P[], k: number): P[] {
  return [...points].sort((a, b) => dist2(a) - dist2(b)).slice(0, k);
}

// Heap nhị phân trên mảng chỉ số, so sánh bằng key[i]. max = true thì đỉnh là key lớn nhất.
class IndexHeap {
  a: number[] = [];
  key: Float64Array;
  max: boolean;
  constructor(key: Float64Array, max: boolean) { this.key = key; this.max = max; }
  above(i: number, j: number): boolean { // a[i] có nên nằm trên a[j] không
    const ki = this.key[this.a[i]], kj = this.key[this.a[j]];
    return this.max ? ki > kj : ki < kj;
  }
  swap(i: number, j: number): void { [this.a[i], this.a[j]] = [this.a[j], this.a[i]]; }
  get size(): number { return this.a.length; }
  top(): number { return this.a[0]; }
  push(v: number): void {
    this.a.push(v);
    for (let i = this.a.length - 1; i > 0; ) {
      const p = (i - 1) >> 1;
      if (!this.above(i, p)) break;
      this.swap(i, p); i = p;
    }
  }
  siftDown(i: number): void {
    for (const n = this.a.length; ; ) {
      const l = 2 * i + 1, r = l + 1;
      let m = i;
      if (l < n && this.above(l, m)) m = l;
      if (r < n && this.above(r, m)) m = r;
      if (m === i) return;
      this.swap(i, m); i = m;
    }
  }
  pop(): number {
    const top = this.a[0], last = this.a.pop()!;
    if (this.a.length > 0) { this.a[0] = last; this.siftDown(0); }
    return top;
  }
  heapify(vals: number[]): void { // dựng heap từ dưới lên: O(n)
    this.a = vals;
    for (let i = (vals.length >> 1) - 1; i >= 0; i--) this.siftDown(i);
  }
}

const keys = (points: P[]) => Float64Array.from(points, dist2);

// Max-heap giữ k điểm gần nhất đã thấy; đỉnh là điểm XA nhất trong số đó, bị thay khi có điểm gần hơn. O(n log k).
function maxHeapK(points: P[], k: number): P[] {
  const key = keys(points), h = new IndexHeap(key, true);
  for (let i = 0; i < points.length; i++) {
    if (h.size < k) h.push(i);
    else if (key[i] < key[h.top()]) { h.a[0] = i; h.siftDown(0); }
  }
  return h.a.map((i) => points[i]);
}

// Min-heap của cả n điểm (dựng O(n)), rồi lấy ra k lần. O(n + k log n).
function minHeapAll(points: P[], k: number): P[] {
  const key = keys(points), h = new IndexHeap(key, false);
  h.heapify(points.map((_, i) => i));
  const out: P[] = [];
  for (let t = 0; t < k; t++) out.push(points[h.pop()]);
  return out;
}

// Quickselect: chia mảng quanh một chốt ngẫu nhiên tới khi k điểm gần nhất nằm ở đầu. Trung bình O(n), tệ nhất O(n²).
function quickselect(points: P[], k: number): P[] {
  const key = keys(points), idx = points.map((_, i) => i);
  let lo = 0, hi = idx.length - 1;
  while (lo < hi) {
    const pivot = key[idx[lo + Math.floor(Math.random() * (hi - lo + 1))]];
    // chia ba phần: < chốt | = chốt | > chốt
    let lt = lo, i = lo, gt = hi;
    while (i <= gt) {
      const d = key[idx[i]];
      if (d < pivot) { [idx[lt], idx[i]] = [idx[i], idx[lt]]; lt++; i++; }
      else if (d > pivot) { [idx[i], idx[gt]] = [idx[gt], idx[i]]; gt--; }
      else i++;
    }
    if (k <= lt) hi = lt - 1; // k điểm gần nhất nằm hết trong phần "<"
    else if (k > gt + 1) lo = gt + 1; // cần thêm từ phần ">"
    else break; // ranh giới k rơi vào phần "= chốt": xong
  }
  return idx.slice(0, k).map((i) => points[i]);
}

// SAI: dùng min-heap k chỗ (ngược chiều). Đỉnh là điểm GẦN nhất, nên nó bị đẩy ra trước; heap giữ lại k điểm xa nhất.
function wrongMinHeapK(points: P[], k: number): P[] {
  const key = keys(points), h = new IndexHeap(key, false);
  for (let i = 0; i < points.length; i++) {
    if (h.size < k) h.push(i);
    else if (key[i] > key[h.top()]) { h.a[0] = i; h.siftDown(0); }
  }
  return h.a.map((i) => points[i]);
}

// Đề hứa đáp án duy nhất (trừ thứ tự): so sánh sau khi sắp xếp.
const norm = (ps: P[]) => ps.map((p) => p.join(",")).sort().join(" ");
const cases: [P[], number, P[]][] = [
  [[[1, 3], [-2, 2]], 1, [[-2, 2]]],
  [[[3, 3], [5, -1], [-2, 4]], 2, [[3, 3], [-2, 4]]],
  [[[0, 0]], 1, [[0, 0]]],
  [[[1, 0], [0, 1], [2, 2], [-1, -1]], 3, [[1, 0], [0, 1], [-1, -1]]],
  [[[1, 1], [2, 2], [3, 3]], 3, [[1, 1], [2, 2], [3, 3]]],
  [[[-5, -5], [4, 4], [-1, 0], [10, -10]], 2, [[-1, 0], [4, 4]]],
  [[[10000, 10000], [-10000, -10000], [1, 1]], 1, [[1, 1]]],
  [[[2, 2], [1, 1], [3, 3], [0, 1], [5, 0]], 2, [[0, 1], [1, 1]]],
];
for (const fn of [sortAll, maxHeapK, minHeapAll, quickselect, wrongMinHeapK]) {
  const bad = cases.filter(([p, k, want]) => norm(fn(p, k)) !== norm(want)).map(([p, k]) => `k=${k} [${p.map((q) => `[${q}]`)}] → [${fn(p, k).map((q) => `[${q}]`)}]`);
  console.log(`${fn.name.padEnd(13)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.slice(0, 2).join(", ") : ""}`);
}

// mulberry32: bộ sinh số giả ngẫu nhiên 32 bit, để kết quả lặp lại được.
let seed = 973;
const rand = () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const randPoints = (n: number, c: number): P[] => Array.from({ length: n }, () => [Math.floor(rand() * (2 * c + 1)) - c, Math.floor(rand() * (2 * c + 1)) - c]);

// Đối chiếu ngẫu nhiên, có nhiều điểm cùng khoảng cách: so dãy khoảng cách đã sắp (đáp án nào cũng hợp lệ khi hòa).
const dsig = (ps: P[]) => ps.map(dist2).sort((a, b) => a - b).join(",");
let agree = 0;
for (let t = 0; t < 2000; t++) {
  const pts = randPoints(1 + Math.floor(rand() * 40), 5), k = 1 + Math.floor(rand() * pts.length);
  const want = dsig(sortAll(pts, k));
  if ([maxHeapK, minHeapAll, quickselect].every((fn) => dsig(fn(pts, k)) === want)) agree++;
}
console.log(`\nngẫu nhiên (toạ độ -5..5, nhiều điểm hòa): bốn cách khớp nhau ở ${agree}/2000 bộ`);

// Ngoài giới hạn đề: toạ độ cỡ 10⁸ thì x² + y² vượt 2⁵³ và số thực 64 bit làm tròn mất đơn vị cuối.
const near: P = [94906266, 0], far: P = [94906266, 1];
console.log(`\nx = 94906266: x² + 0 = ${dist2(near)}, x² + 1 = ${dist2(far)}, bằng nhau? ${dist2(near) === dist2(far)}`);
console.log(`BigInt: ${94906266n ** 2n} và ${94906266n ** 2n + 1n}`);
console.log(`sortAll([[${far}], [${near}]], 1) trả [${sortAll([far, near], 1)[0]}], điểm xa hơn`);

// Đo: n = 10⁶ điểm, toạ độ -10⁴..10⁴, trung vị 5 lần.
const pts = randPoints(1_000_000, 10_000);
function time(fn: (p: P[], k: number) => P[], k: number): string {
  const ts: number[] = [];
  for (let r = 0; r < 5; r++) { const t0 = performance.now(); fn(pts, k); ts.push(performance.now() - t0); }
  return ts.sort((a, b) => a - b)[2].toFixed(0).padStart(6) + " ms";
}
console.log("\nn = 10⁶    sắp xếp   max-heap k   min-heap n   quickselect");
for (const k of [10, 1000, 100_000, 500_000]) {
  console.log(`k=${String(k).padEnd(8)} ${time(sortAll, k)} ${time(maxHeapK, k).padStart(12)} ${time(minHeapAll, k).padStart(12)} ${time(quickselect, k).padStart(13)}`);
}
const hyp = (() => { const ts: number[] = []; for (let r = 0; r < 5; r++) { const t0 = performance.now(); [...pts].sort((a, b) => Math.hypot(a[0], a[1]) - Math.hypot(b[0], b[1])); ts.push(performance.now() - t0); } return ts.sort((a, b) => a - b)[2]; })();
console.log(`sắp xếp bằng Math.hypot thay cho x² + y²: ${hyp.toFixed(0)} ms`);
