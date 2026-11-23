// Ga SRCH-03, heap và top K: giải 703, 1046, 973 và 215 bằng một min-heap viết tay.
// Chạy: node heap-station.js

// Min-heap theo khóa: cha ở i, hai con ở 2i + 1 và 2i + 2. Muốn max-heap thì truyền khóa âm.
class Heap {
  a = [];
  constructor(key) { this.key = key; }
  get size() { return this.a.length; }
  peek() { return this.a[0]; }
  push(x) {
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
  pop() {
    const a = this.a, key = this.key, top = a[0], last = a.pop();
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
  h = new Heap((x) => x);
  constructor(k, nums) { this.k = k; for (const x of nums) this.add(x); }
  add(val) {
    if (this.h.size < this.k) this.h.push(val);
    else if (val > this.h.peek()) { this.h.pop(); this.h.push(val); } // thay ứng viên yếu nhất
    return this.h.peek();
  }
}

// 1046: max-heap (khóa âm); mỗi lượt lấy hai viên nặng nhất, đập, bỏ phần dư lại vào heap.
function lastStoneWeight(stones) {
  const h = new Heap((x) => -x);
  for (const s of stones) h.push(s);
  while (h.size > 1) {
    const y = h.pop(), x = h.pop();
    if (y > x) h.push(y - x);
  }
  return h.size ? h.peek() : 0;
}

// 973: max-heap k chỗ theo bình phương khoảng cách; đỉnh là điểm xa nhất trong k điểm đang giữ.
function kClosest(points, k) {
  const d = (p) => p[0] * p[0] + p[1] * p[1]; // không cần căn: căn giữ thứ tự
  const h = new Heap((p) => -d(p));
  for (const p of points) {
    h.push(p);
    if (h.size > k) h.pop(); // bỏ điểm xa nhất
  }
  return h.a;
}

// 215: min-heap k chỗ trên cả mảng; đỉnh là số lớn thứ k.
function findKthLargest(nums, k) {
  const h = new Heap((x) => x);
  for (const x of nums) {
    if (h.size < k) h.push(x);
    else if (x > h.peek()) { h.pop(); h.push(x); } // chỉ số mạnh hơn đỉnh mới vào
  }
  return h.peek();
}

const sortPts = (ps) => JSON.stringify(ps.map((p) => p.join(",")).sort());
const cases = [
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
