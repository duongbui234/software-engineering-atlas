// NC-05 Top K Frequent Elements (LeetCode 347): sắp xếp, heap, bucket sort, quickselect; phép đo.
// Chạy: node top-k-frequent.ts

function countAll(nums: number[]): Map<number, number> {
  const count = new Map<number, number>();
  for (const x of nums) count.set(x, (count.get(x) ?? 0) + 1);
  return count;
}

// Cách 1, đếm rồi sắp xếp m giá trị khác nhau theo tần suất: O(n + m log m).
function bySorting(nums: number[], k: number): number[] {
  return [...countAll(nums)].sort((a, b) => b[1] - a[1]).slice(0, k).map(([v]) => v);
}

// Heap nhỏ nhất (min-heap) trên mảng: cha ở i, con ở 2i+1 và 2i+2. JS/TS không có sẵn.
class MinHeap<T> {
  private a: T[] = [];
  private less: (x: T, y: T) => boolean;
  constructor(less: (x: T, y: T) => boolean) { this.less = less; } // Node chỉ bỏ kiểu, không hỗ trợ "constructor(private less)"
  get size() { return this.a.length; }
  peek() { return this.a[0]; }
  push(x: T) {
    const a = this.a; a.push(x);
    for (let i = a.length - 1; i > 0; ) { // nổi lên
      const p = (i - 1) >> 1;
      if (!this.less(a[i], a[p])) break;
      [a[i], a[p]] = [a[p], a[i]]; i = p;
    }
  }
  pop(): T | undefined {
    const a = this.a, top = a[0], last = a.pop()!;
    if (a.length) {
      a[0] = last;
      for (let i = 0; ; ) { // chìm xuống
        const l = 2 * i + 1, r = l + 1; let m = i;
        if (l < a.length && this.less(a[l], a[m])) m = l;
        if (r < a.length && this.less(a[r], a[m])) m = r;
        if (m === i) break;
        [a[i], a[m]] = [a[m], a[i]]; i = m;
      }
    }
    return top;
  }
}

// Cách 2, heap giữ k phần tử phổ biến nhất: O(n + m log k). Đỉnh heap là "kẻ yếu nhất trong top k".
function byHeap(nums: number[], k: number): number[] {
  const heap = new MinHeap<[number, number]>((x, y) => x[1] < y[1]);
  for (const e of countAll(nums)) {
    heap.push(e);
    if (heap.size > k) heap.pop(); // đẩy kẻ yếu nhất ra
  }
  const out: number[] = [];
  while (heap.size) out.push(heap.pop()![0]);
  return out.reverse();
}

// Cách 3, bucket sort theo tần suất: tần suất chỉ từ 1 tới n, nên có n ô. O(n).
function byBuckets(nums: number[], k: number): number[] {
  const buckets: number[][] = Array.from({ length: nums.length + 1 }, () => []);
  for (const [v, c] of countAll(nums)) buckets[c].push(v);
  const out: number[] = [];
  for (let f = nums.length; f > 0 && out.length < k; f--)
    for (const v of buckets[f]) { out.push(v); if (out.length === k) break; }
  return out;
}

// Cách 4, quickselect: phân hoạch quanh một chốt ngẫu nhiên cho tới khi k phần tử lớn nhất nằm cuối. O(n) trung bình.
function byQuickselect(nums: number[], k: number): number[] {
  const e = [...countAll(nums)];
  const want = e.length - k; // vị trí ranh giới khi sắp tăng dần
  let lo = 0, hi = e.length - 1;
  while (lo < hi) {
    const p = lo + Math.floor(Math.random() * (hi - lo + 1));
    [e[p], e[hi]] = [e[hi], e[p]];
    let s = lo;
    for (let i = lo; i < hi; i++) if (e[i][1] < e[hi][1]) { [e[i], e[s]] = [e[s], e[i]]; s++; }
    [e[s], e[hi]] = [e[hi], e[s]];
    if (s === want) break;
    if (s < want) lo = s + 1; else hi = s - 1;
  }
  return e.slice(want).map(([v]) => v);
}

const cases: [number[], number, number[]][] = [
  [[1, 1, 1, 2, 2, 3], 2, [1, 2]],
  [[1], 1, [1]],
  [[4, 4, 4, 4, -1, -1, -1, 2, 2, 7], 3, [-1, 2, 4]],
  [[5, 3, 5, 3, 5, 9, 9, 9, 9], 1, [9]],
];
const same = (a: number[], b: number[]) => JSON.stringify([...a].sort((x, y) => x - y)) === JSON.stringify(b);
for (const fn of [bySorting, byHeap, byBuckets, byQuickselect]) {
  const ok = cases.filter(([n, k, w]) => same(fn(n, k), w)).length;
  console.log(`${fn.name.padEnd(14)} ${ok}/${cases.length} ca đúng`);
}

// ── đo: n = 1 000 000 số; m là số giá trị khác nhau ──────────────────────────
function data(n: number, range: number, skew: boolean): number[] {
  let seed = 42;
  const rnd = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  return Array.from({ length: n }, () => Math.floor(range * (skew ? rnd() ** 3 : rnd()))); // lũy thừa 3: dồn về số nhỏ
}
function median(fn: () => unknown): number {
  const t: number[] = [];
  for (let r = 0; r < 5; r++) { const s = performance.now(); fn(); t.push(performance.now() - s); }
  return t.sort((a, b) => a - b)[2];
}
console.log('\nn = 1 000 000                   chỉ đếm  sắp xếp     heap   bucket  quickselect  (ms, trung vị 5 lần)');
for (const [range, skew, k] of [[1_000, true, 10], [100_000, true, 10], [1_000_000, false, 10], [1_000_000, false, 10_000]] as const) {
  const a = data(1_000_000, range, skew);
  const m = countAll(a).size;
  const row = [() => countAll(a), () => bySorting(a, k), () => byHeap(a, k), () => byBuckets(a, k), () => byQuickselect(a, k)]
    .map((fn) => median(fn).toFixed(0).padStart(8));
  console.log(`m = ${String(m).padEnd(7)} k = ${String(k).padEnd(6)} ${skew ? 'lệch ' : 'đều  '}  ${row.join(' ')}`);
}
