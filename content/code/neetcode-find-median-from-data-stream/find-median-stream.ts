// LC 295 Find Median from Data Stream: chèn vào mảng đã sắp, hai heap, đếm theo giá trị, và hai bản sai.
// Chạy: node find-median-stream.ts

// Min-heap số: cha ở i, hai con ở 2i + 1 và 2i + 2. Max-heap thì đưa vào số âm.
class NumHeap {
  a: number[] = [];
  get size(): number { return this.a.length; }
  peek(): number { return this.a[0]; }
  push(x: number): void {
    const a = this.a;
    a.push(x);
    let i = a.length - 1;
    while (i > 0) { // nổi lên
      const p = (i - 1) >> 1;
      if (a[p] <= a[i]) break;
      [a[p], a[i]] = [a[i], a[p]];
      i = p;
    }
  }
  pop(): number {
    const a = this.a, top = a[0], last = a.pop()!;
    if (a.length > 0) {
      a[0] = last;
      let i = 0; // chìm xuống
      for (;;) {
        const l = 2 * i + 1, r = l + 1;
        let m = i;
        if (l < a.length && a[l] < a[m]) m = l;
        if (r < a.length && a[r] < a[m]) m = r;
        if (m === i) break;
        [a[m], a[i]] = [a[i], a[m]];
        i = m;
      }
    }
    return top;
  }
}

interface Finder { addNum(x: number): void; findMedian(): number; }

// Cách 1: giữ một mảng đã sắp; tìm chỗ bằng chia đôi, chèn bằng splice (dời phần sau): O(n) mỗi lần thêm.
class SortedInsertFinder implements Finder {
  a: number[] = [];
  addNum(x: number): void {
    let lo = 0, hi = this.a.length;
    while (lo < hi) { const mid = (lo + hi) >>> 1; if (this.a[mid] < x) lo = mid + 1; else hi = mid; }
    this.a.splice(lo, 0, x);
  }
  findMedian(): number {
    const a = this.a, n = a.length;
    return n % 2 === 1 ? a[n >> 1] : (a[n / 2 - 1] + a[n / 2]) / 2;
  }
}

// Cách 2: hai heap. lower là max-heap (lưu số âm) giữ nửa nhỏ, upper là min-heap giữ nửa lớn.
// Bất biến: lower.size = upper.size hoặc upper.size + 1, và max(lower) ≤ min(upper).
class TwoHeapsFinder implements Finder {
  lower = new NumHeap(); // số âm
  upper = new NumHeap();
  addNum(x: number): void {
    this.lower.push(-x);                     // vào nửa nhỏ trước
    this.upper.push(-this.lower.pop());      // số lớn nhất nửa nhỏ sang nửa lớn: giữ max(lower) ≤ min(upper)
    if (this.upper.size > this.lower.size) { // cân lại cỡ: lower được hơn một phần tử
      this.lower.push(-this.upper.pop());
    }
  }
  findMedian(): number {
    if (this.lower.size > this.upper.size) return -this.lower.peek();
    return (-this.lower.peek() + this.upper.peek()) / 2;
  }
}

// Cách 3: mọi số trong [0, 100]: đếm số lần xuất hiện, trung vị là chỗ tổng dồn vượt nửa. O(1) thêm, O(101) tìm.
class CountingFinder implements Finder {
  cnt = new Array<number>(101).fill(0);
  n = 0;
  addNum(x: number): void { this.cnt[x]++; this.n++; }
  kth(k: number): number { // số thứ k (đếm từ 0) theo thứ tự tăng
    let seen = 0;
    for (let v = 0; v <= 100; v++) { seen += this.cnt[v]; if (seen > k) return v; }
    return -1;
  }
  findMedian(): number {
    const n = this.n;
    return n % 2 === 1 ? this.kth(n >> 1) : (this.kth(n / 2 - 1) + this.kth(n / 2)) / 2;
  }
}

// SAI: chia luân phiên theo cỡ, không qua heap bên kia. Cỡ đúng, nhưng max(lower) ≤ min(upper) bị vỡ.
class AlternateFinder extends TwoHeapsFinder {
  addNum(x: number): void {
    if (this.lower.size === this.upper.size) this.lower.push(-x);
    else this.upper.push(x);
  }
}

// SAI: so với đỉnh lower để chọn nửa nhưng không cân lại cỡ. Thứ tự đúng, cỡ lệch dần.
class NoRebalanceFinder extends TwoHeapsFinder {
  addNum(x: number): void {
    if (this.lower.size === 0 || x <= -this.lower.peek()) this.lower.push(-x);
    else this.upper.push(x);
  }
}

// Trung vị đúng để đối chiếu: sắp lại cả mảng.
function medianOf(xs: number[]): number {
  const a = [...xs].sort((p, q) => p - q), n = a.length;
  return n % 2 === 1 ? a[n >> 1] : (a[n / 2 - 1] + a[n / 2]) / 2;
}

// Mỗi ca: dãy số thêm vào; sau mỗi lần thêm gọi findMedian và so với medianOf.
const cases: [string, number[]][] = [
  ["ví dụ của đề", [1, 2, 3]],
  ["một số", [5]],
  ["giảm dần", [5, 4, 3, 2, 1]],
  ["tăng dần", [1, 2, 3, 4, 5, 6]],
  ["trùng nhau", [7, 7, 7, 7]],
  ["số âm", [-1, -2, -3, -4, -5]],
  ["xen kẽ", [6, 10, 2, 6, 5, 0, 6, 3, 1, 0, 0]],
  ["biên đề", [-100000, 100000, -100000, 100000]],
];

function run(make: () => Finder, xs: number[]): number[] {
  const f = make(), out: number[] = [];
  for (const x of xs) { f.addNum(x); out.push(f.findMedian()); }
  return out;
}
function want(xs: number[]): number[] { return xs.map((_, i) => medianOf(xs.slice(0, i + 1))); }

const finders: [string, () => Finder][] = [
  ["SortedInsert", () => new SortedInsertFinder()],
  ["TwoHeaps", () => new TwoHeapsFinder()],
  ["Alternate", () => new AlternateFinder()],
  ["NoRebalance", () => new NoRebalanceFinder()],
];
for (const [name, make] of finders) {
  const bad = cases.filter(([, xs]) => run(make, xs).join() !== want(xs).join())
    .map(([label, xs]) => `${label} → [${run(make, xs).join(", ")}]`);
  console.log(`${name.padEnd(13)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở: " + bad.join("; ") : ""}`);
}
const small = cases.filter(([, xs]) => xs.every((x) => x >= 0 && x <= 100));
const badC = small.filter(([, xs]) => run(() => new CountingFinder(), xs).join() !== want(xs).join()).length;
console.log(`${"Counting".padEnd(13)} ${small.length - badC}/${small.length} ca đúng (chỉ các ca có mọi số trong [0, 100])`);

// Bộ sinh ngẫu nhiên mulberry32: trạng thái 32 bit, phép nhân qua Math.imul.
function mulberry32(seed: number): () => number {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Đối chiếu ngẫu nhiên: 2 000 dãy, mỗi dãy 1–60 số trong [-50, 50] (nhiều số trùng).
{
  const rnd = mulberry32(2026);
  let mism = 0, checks = 0;
  for (let t = 0; t < 2000; t++) {
    const n = 1 + Math.floor(rnd() * 60);
    const xs = Array.from({ length: n }, () => Math.floor(rnd() * 101) - 50);
    const w = want(xs), got = run(() => new TwoHeapsFinder(), xs);
    checks += n;
    for (let i = 0; i < n; i++) if (got[i] !== w[i]) { mism++; break; }
  }
  console.log(`đối chiếu ngẫu nhiên: 2000 dãy (${checks} lần findMedian), TwoHeaps lệch ${mism} dãy`);
}

// Đo: n lần addNum, mỗi lần kèm một findMedian. Trung vị 5 lần chạy.
function time(make: () => Finder, xs: number[]): number {
  const ts: number[] = [];
  for (let r = 0; r < 5; r++) {
    const t0 = performance.now();
    const f = make();
    let s = 0;
    for (const x of xs) { f.addNum(x); s += f.findMedian(); }
    ts.push(performance.now() - t0);
    if (Number.isNaN(s)) console.log("NaN");
  }
  ts.sort((p, q) => p - q);
  return ts[2];
}
console.log("\nn          dữ liệu              chèn mảng sắp   hai heap    đếm [0,100]   (ms, trung vị 5 lần)");
for (const n of [10_000, 100_000, 200_000, 1_000_000]) {
  const rnd = mulberry32(n);
  const xs = Array.from({ length: n }, () => Math.floor(rnd() * 200_001) - 100_000);
  const ins = n <= 200_000 ? time(() => new SortedInsertFinder(), xs).toFixed(1).padStart(12) : "—".padStart(12);
  const two = time(() => new TwoHeapsFinder(), xs).toFixed(1).padStart(10);
  const ys = xs.map((x) => ((x % 101) + 101) % 101);
  const cnt = time(() => new CountingFinder(), ys).toFixed(1).padStart(12);
  console.log(`${String(n).padEnd(10)} ngẫu nhiên ±10⁵ ${ins}  ${two}  ${cnt}`);
}
{
  const n = 200_000;
  const xs = Array.from({ length: n }, (_, i) => n - i); // giảm dần: mỗi số mới chèn vào đầu mảng
  console.log(`${String(n).padEnd(10)} giảm dần        ${time(() => new SortedInsertFinder(), xs).toFixed(1).padStart(12)}  ${time(() => new TwoHeapsFinder(), xs).toFixed(1).padStart(10)}`);
}
