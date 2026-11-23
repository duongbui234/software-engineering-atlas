// Ga SRCH-03, heap và top K: giải 703, 1046, 973 và 215 bằng một min-heap viết tay.
// Chạy: node heap-station.ts

// Min-heap theo khóa: cha ở i, hai con ở 2i + 1 và 2i + 2. Muốn max-heap thì truyền khóa âm.
class Heap<T> {
  a: T[] = [];
  key: (x: T) => number;
  constructor(key: (x: T) => number) { this.key = key; }
  get size(): number { return this.a.length; }
  peek(): T { return this.a[0]; }
  push(x: T): void {
    const a = this.a, key = this.key;
    a.push(x);
    let i = a.length - 1;
    while (i > 0) { // nổi lên
      const p = (i - 1) >> 1;
      if (key(a[p]) <= key(a[i])) break;
      [a[p], a[i]] = [a[i], a[p]];
      i = p;
    }
  }
  pop(): T {
    const a = this.a, key = this.key, top = a[0], last = a.pop()!;
    if (a.length > 0) {
      a[0] = last;
      let i = 0; // chìm xuống
      for (;;) {
        const l = 2 * i + 1, r = l + 1;
        let m = i;
        if (l < a.length && key(a[l]) < key(a[m])) m = l;
        if (r < a.length && key(a[r]) < key(a[m])) m = r;
        if (m === i) break;
        [a[m], a[i]] = [a[i], a[m]];
        i = m;
      }
    }
    return top;
  }
}

// 703: min-heap giữ k số lớn nhất; đỉnh là số lớn thứ k.
class KthLargest {
  k: number;
  h = new Heap<number>((x) => x);
  constructor(k: number, nums: number[]) { this.k = k; for (const x of nums) this.add(x); }
  add(val: number): number {
    if (this.h.size < this.k) this.h.push(val);
    else if (val > this.h.peek()) { this.h.pop(); this.h.push(val); } // thay ứng viên yếu nhất
    return this.h.peek();
  }
}

// 1046: max-heap (khóa âm); mỗi lượt lấy hai viên nặng nhất, đập, bỏ phần dư lại vào heap.
function lastStoneWeight(stones: number[]): number {
  const h = new Heap<number>((x) => -x);
  for (const s of stones) h.push(s);
  while (h.size > 1) {
    const y = h.pop(), x = h.pop();
    if (y > x) h.push(y - x);
  }
  return h.size ? h.peek() : 0;
}

// 973: max-heap k chỗ theo bình phương khoảng cách; đỉnh là điểm xa nhất trong k điểm đang giữ.
function kClosest(points: number[][], k: number): number[][] {
  const d = (p: number[]) => p[0] * p[0] + p[1] * p[1]; // không cần căn: căn giữ thứ tự
  const h = new Heap<number[]>((p) => -d(p));
  for (const p of points) {
    h.push(p);
    if (h.size > k) h.pop(); // bỏ điểm xa nhất
  }
  return h.a;
}

// 215: min-heap k chỗ trên cả mảng; đỉnh là số lớn thứ k.
function findKthLargest(nums: number[], k: number): number {
  const h = new Heap<number>((x) => x);
  for (const x of nums) {
    if (h.size < k) h.push(x);
    else if (x > h.peek()) { h.pop(); h.push(x); } // chỉ số mạnh hơn đỉnh mới vào
  }
  return h.peek();
}

const sortPts = (ps: number[][]) => JSON.stringify(ps.map((p) => p.join(",")).sort());
const cases: [string, () => unknown, unknown][] = [
  ["703 ví dụ của đề", () => { const s = new KthLargest(3, [4, 5, 8, 2]); return [3, 5, 10, 9, 4].map((v) => s.add(v)); }, [4, 5, 5, 8, 8]],
  ["703 nums rỗng", () => { const s = new KthLargest(1, []); return [-3, -2, -4, 0, 4].map((v) => s.add(v)); }, [-3, -2, -2, 0, 4]],
  ["703 số trùng", () => { const s = new KthLargest(2, [5, 5]); return [5, 1, 6].map((v) => s.add(v)); }, [5, 5, 5]],
  ["1046 ví dụ của đề", () => lastStoneWeight([2, 7, 4, 1, 8, 1]), 1],
  ["1046 một viên", () => lastStoneWeight([1]), 1],
  ["1046 vỡ hết", () => lastStoneWeight([2, 2]), 0],
  ["1046 [3, 7, 2]", () => lastStoneWeight([3, 7, 2]), 2],
  ["973 ví dụ 1", () => sortPts(kClosest([[1, 3], [-2, 2]], 1)), sortPts([[-2, 2]])],
  ["973 ví dụ 2", () => sortPts(kClosest([[3, 3], [5, -1], [-2, 4]], 2)), sortPts([[3, 3], [-2, 4]])],
  ["973 k = n", () => sortPts(kClosest([[0, 1], [1, 0]], 2)), sortPts([[0, 1], [1, 0]])],
  ["215 ví dụ 1", () => findKthLargest([3, 2, 1, 5, 6, 4], 2), 5],
  ["215 ví dụ 2", () => findKthLargest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4), 4],
  ["215 một phần tử", () => findKthLargest([1], 1), 1],
  ["215 số âm trùng", () => findKthLargest([-1, -1], 2), -1],
];
const bad = cases.filter(([, f, want]) => JSON.stringify(f()) !== JSON.stringify(want)).map(([n]) => n);
console.log(`heap-station ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở: " + bad.join(", ") : ""}`);

// Đo (215): số lớn thứ k trong 10⁶ số ngẫu nhiên. Sắp cả mảng, min-heap k chỗ, và quickselect.
// Quickselect: chia mảng quanh một chốt ngẫu nhiên, chỉ đi tiếp vào phía chứa vị trí cần tìm. Trung bình O(n).
function quickselect(nums: number[], k: number): number {
  const a = nums.slice(), target = a.length - k; // vị trí của số lớn thứ k sau khi sắp tăng dần
  let lo = 0, hi = a.length - 1;
  while (lo < hi) {
    const p = a[lo + Math.floor(Math.random() * (hi - lo + 1))];
    let i = lo, j = hi;
    while (i <= j) { // chia Hoare: bên trái <= p, bên phải >= p
      while (a[i] < p) i++;
      while (a[j] > p) j--;
      if (i <= j) { [a[i], a[j]] = [a[j], a[i]]; i++; j--; }
    }
    if (target <= j) hi = j;
    else if (target >= i) lo = i;
    else return a[target];
  }
  return a[target];
}
// Cùng min-heap k chỗ nhưng thêm mọi số rồi mới bỏ đỉnh: số nào cũng nổi lên và chìm xuống.
function pushThenPop(nums: number[], k: number): number {
  const h = new Heap<number>((x) => x);
  for (const x of nums) {
    h.push(x);
    if (h.size > k) h.pop();
  }
  return h.peek();
}
{
  let s = 12345;
  const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s; };
  const xs = Array.from({ length: 1_000_000 }, rnd);
  const med = (f: () => void) => {
    const ts = [];
    for (let r = 0; r < 5; r++) { const t = performance.now(); f(); ts.push(performance.now() - t); }
    return ts.sort((a, b) => a - b)[2];
  };
  console.log("\nĐo: số lớn thứ k trong 10⁶ số ngẫu nhiên (trung vị 5 lần)");
  console.log("k           sắp cả mảng   heap: thêm rồi bỏ   heap: so đỉnh trước   quickselect");
  for (const k of [10, 1_000, 500_000]) {
    const want = xs.slice().sort((a, b) => a - b)[xs.length - k];
    if (findKthLargest(xs, k) !== want || pushThenPop(xs, k) !== want || quickselect(xs, k) !== want) throw new Error("sai ở k = " + k);
    const tSort = med(() => xs.slice().sort((a, b) => a - b)[xs.length - k]);
    const tPush = med(() => pushThenPop(xs, k));
    const tHeap = med(() => findKthLargest(xs, k));
    const tQs = med(() => quickselect(xs, k));
    console.log(`${String(k).padEnd(10)}${tSort.toFixed(1).padStart(10)} ms${tPush.toFixed(1).padStart(17)} ms${tHeap.toFixed(1).padStart(19)} ms${tQs.toFixed(1).padStart(12)} ms`);
  }
}
