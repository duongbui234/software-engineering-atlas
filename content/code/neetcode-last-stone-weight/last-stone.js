// LeetCode 1046, Last Stone Weight: max-heap tự viết và mảng giữ thứ tự bằng chèn nhị phân.
// Chạy: node last-stone.js

// JS không có heap sẵn. Max-heap trên mảng: cha ở i, con ở 2i+1 và 2i+2.
class MaxHeap {
  constructor() { this.a = []; }
  get size() { return this.a.length; }
  push(x) {
    const a = this.a;
    a.push(x);
    let i = a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (a[p] >= a[i]) break;
      [a[p], a[i]] = [a[i], a[p]];
      i = p;
    }
  }
  pop() {
    const a = this.a, top = a[0], last = a.pop();
    if (a.length > 0) {
      a[0] = last;
      let i = 0;
      for (;;) {
        const l = 2 * i + 1, r = l + 1;
        let m = i;
        if (l < a.length && a[l] > a[m]) m = l;
        if (r < a.length && a[r] > a[m]) m = r;
        if (m === i) break;
        [a[m], a[i]] = [a[i], a[m]];
        i = m;
      }
    }
    return top;
  }
}

function heapSim(stones) {
  const h = new MaxHeap();
  for (const s of stones) h.push(s);
  while (h.size > 1) {
    const y = h.pop(), x = h.pop();
    if (y > x) h.push(y - x);
  }
  return h.size === 1 ? h.pop() : 0;
}

// Giữ mảng tăng dần: lấy hai phần tử cuối, chèn phần dư vào đúng chỗ bằng tìm nhị phân.
// Tìm chỗ O(log n), nhưng splice dời các phần tử phía sau: O(n) mỗi lần chèn.
function sortedInsert(stones) {
  const s = [...stones].sort((a, b) => a - b);
  while (s.length > 1) {
    const y = s.pop(), x = s.pop();
    if (y > x) {
      const d = y - x;
      let lo = 0, hi = s.length;
      while (lo < hi) { const mid = (lo + hi) >>> 1; if (s[mid] < d) lo = mid + 1; else hi = mid; }
      s.splice(lo, 0, d);
    }
  }
  return s.length === 1 ? s[0] : 0;
}

const cases = [
  [[2, 7, 4, 1, 8, 1], 1], [[1], 1], [[2, 2], 0], [[3, 3, 3], 3], [[10, 4, 2, 10], 2],
  [[10, 2, 9], 1], [[1000, 1], 999], [[7, 6, 7, 6, 9], 3], [[31, 26, 33, 21, 40], 9],
];
for (const fn of [heapSim, sortedInsert]) {
  const ok = cases.filter(([s, want]) => fn(s) === want).length;
  console.log(`${fn.name.padEnd(12)} ${ok}/${cases.length} ca đúng`);
}

// Đo với cân nặng tới 10⁹ (ít cặp bằng nhau, phần dư thường lớn): trung vị 5 lần.
// mulberry32: bộ sinh số giả ngẫu nhiên 32 bit dùng Math.imul, để kết quả lặp lại được.
let seed = 11;
const rand = () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
console.log("\nn         heap      chèn nhị phân");
for (const n of [1e4, 3e4, 1e5, 3e5]) {
  const s = Array.from({ length: n }, () => 1 + Math.floor(rand() * 1e9));
  const t = (fn) => { const ts = []; for (let r = 0; r < 5; r++) { const t0 = performance.now(); fn(s); ts.push(performance.now() - t0); } return ts.sort((a, b) => a - b)[2].toFixed(1); };
  console.log(`${String(n).padEnd(9)} ${t(heapSim).padStart(6)} ms ${t(sortedInsert).padStart(8)} ms`);
}
