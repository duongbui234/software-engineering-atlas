// LeetCode 703, Kth Largest Element in a Stream: min-heap viết tay, và bẫy sort() mặc định so chuỗi.
// Chạy: node kth-largest-stream.js

// Min-heap k chỗ trên một mảng: cha ở i, hai con ở 2i + 1 và 2i + 2.
class KthLargest {
  constructor(k, nums) {
    this.k = k;
    this.h = [];
    for (const x of nums) this.add(x);
  }
  add(val) {
    const h = this.h;
    if (h.length < this.k) {
      h.push(val);
      let i = h.length - 1; // nổi lên
      while (i > 0 && h[(i - 1) >> 1] > h[i]) {
        const p = (i - 1) >> 1;
        [h[p], h[i]] = [h[i], h[p]];
        i = p;
      }
    } else if (val > h[0]) {
      h[0] = val;
      let i = 0; // chìm xuống
      for (;;) {
        const l = 2 * i + 1, r = l + 1;
        let m = i;
        if (l < h.length && h[l] < h[m]) m = l;
        if (r < h.length && h[r] < h[m]) m = r;
        if (m === i) break;
        [h[m], h[i]] = [h[i], h[m]];
        i = m;
      }
    }
    return h[0];
  }
}

// SAI: sắp lại mỗi lần bằng sort() không truyền hàm so sánh. JS so theo chuỗi: "10" < "9".
class DefaultSortKthLargest {
  constructor(k, nums) { this.k = k; this.nums = nums.slice(); }
  add(val) {
    this.nums.push(val);
    this.nums.sort();
    return this.nums[this.nums.length - this.k];
  }
}

const cases = [
  ["ví dụ của đề", 3, [4, 5, 8, 2], [3, 5, 10, 9, 4], [4, 5, 5, 8, 8]],
  ["nhiều số 7 trùng", 4, [7, 7, 7, 7, 8, 3], [2, 10, 9, 9], [7, 7, 7, 8]],
  ["nums rỗng, k = 1", 1, [], [-3, -2, -4, 0, 4], [-3, -2, -2, 0, 4]],
  ["nums thiếu một số", 2, [0], [-1, 1, -2, -4, 3], [-1, 0, 0, 0, 1]],
  ["số trùng", 2, [5, 5], [5, 1, 6], [5, 5, 5]],
  ["k bằng cả luồng", 3, [1, 2], [3, 0], [1, 1]],
  ["số âm", 2, [-10, -20], [-5, -30, -1], [-10, -10, -5]],
];
for (const C of [KthLargest, DefaultSortKthLargest]) {
  const bad = [];
  for (const [name, k, nums, adds, want] of cases) {
    const s = new C(k, nums);
    const got = adds.map((v) => s.add(v));
    if (got.join() !== want.join()) bad.push(`${name} → [${got.join(", ")}]`);
  }
  console.log(`${C.name.padEnd(22)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở: " + bad.join("; ") : ""}`);
}
console.log("\n[4, 5, 8, 2, 10].sort() =", JSON.stringify([4, 5, 8, 2, 10].sort()));
