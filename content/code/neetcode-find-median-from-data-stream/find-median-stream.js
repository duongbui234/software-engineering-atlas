// LC 295 Find Median from Data Stream bằng JavaScript: JS không có heap sẵn, nên viết một min-heap số.
// Chạy: node find-median-stream.js

// Min-heap số; max-heap thì đưa vào số âm.
class NumHeap {
  constructor() { this.a = []; }
  get size() { return this.a.length; }
  peek() { return this.a[0]; }
  push(x) {
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
  pop() {
    const a = this.a, top = a[0], last = a.pop();
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

// Hai heap: lower giữ nửa nhỏ (số âm), upper giữ nửa lớn; lower có thể hơn một phần tử.
class MedianFinder {
  constructor() { this.lower = new NumHeap(); this.upper = new NumHeap(); }
  addNum(x) {
    this.lower.push(-x);
    this.upper.push(-this.lower.pop()); // số lớn nhất nửa nhỏ sang nửa lớn
    if (this.upper.size > this.lower.size) this.lower.push(-this.upper.pop());
  }
  findMedian() {
    if (this.lower.size > this.upper.size) return -this.lower.peek();
    return (-this.lower.peek() + this.upper.peek()) / 2;
  }
}

// SAI: thêm vào mảng rồi sort() không truyền hàm so sánh: JS so theo chuỗi, "10" < "9".
class DefaultSortFinder {
  constructor() { this.a = []; }
  addNum(x) { this.a.push(x); this.a.sort(); }
  findMedian() {
    const a = this.a, n = a.length;
    return n % 2 === 1 ? a[n >> 1] : (a[n / 2 - 1] + a[n / 2]) / 2;
  }
}

function medianOf(xs) {
  const a = [...xs].sort((p, q) => p - q), n = a.length;
  return n % 2 === 1 ? a[n >> 1] : (a[n / 2 - 1] + a[n / 2]) / 2;
}

const cases = [
  ["ví dụ của đề", [1, 2, 3]],
  ["một số", [5]],
  ["giảm dần", [5, 4, 3, 2, 1]],
  ["tăng dần", [1, 2, 3, 4, 5, 6]],
  ["trùng nhau", [7, 7, 7, 7]],
  ["số âm", [-1, -2, -3, -4, -5]],
  ["xen kẽ", [6, 10, 2, 6, 5, 0, 6, 3, 1, 0, 0]],
  ["biên đề", [-100000, 100000, -100000, 100000]],
];

for (const Cls of [MedianFinder, DefaultSortFinder]) {
  const bad = [];
  for (const [label, xs] of cases) {
    const f = new Cls(), got = [];
    let ok = true;
    xs.forEach((x, i) => { f.addNum(x); const v = f.findMedian(); got.push(v); if (v !== medianOf(xs.slice(0, i + 1))) ok = false; });
    if (!ok) bad.push(`${label} → [${got.join(", ")}]`);
  }
  console.log(`${Cls.name.padEnd(17)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở: " + bad.join("; ") : ""}`);
}
