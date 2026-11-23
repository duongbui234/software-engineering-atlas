// LeetCode 1046, Last Stone Weight: sắp xếp mỗi lượt, max-heap, đếm theo cân nặng, một bản sai và phép đo.
// Chạy: node last-stone.ts

// Max-heap trên mảng: cha ở i, hai con ở 2i+1 và 2i+2; phần tử lớn nhất luôn ở đỉnh a[0].
class MaxHeap {
  a: number[] = [];
  get size(): number { return this.a.length; }
  push(x: number): void {
    const a = this.a;
    a.push(x);
    let i = a.length - 1;
    while (i > 0) { // nổi lên: đổi chỗ với cha khi lớn hơn cha
      const p = (i - 1) >> 1;
      if (a[p] >= a[i]) break;
      [a[p], a[i]] = [a[i], a[p]];
      i = p;
    }
  }
  pop(): number {
    const a = this.a, top = a[0], last = a.pop()!;
    if (a.length > 0) {
      a[0] = last;
      let i = 0;
      for (;;) { // chìm xuống: đổi chỗ với con lớn hơn khi nhỏ hơn nó
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

// Max-heap: lấy hai viên nặng nhất, đẩy phần dư (nếu có) trở lại. O(n log n).
function heapSim(stones: number[]): number {
  const h = new MaxHeap();
  for (const s of stones) h.push(s);
  while (h.size > 1) {
    const y = h.pop(), x = h.pop(); // y >= x
    if (y > x) h.push(y - x);
  }
  return h.size === 1 ? h.pop() : 0;
}

// Sắp xếp lại cả mảng mỗi lượt rồi lấy hai phần tử cuối. Đúng, nhưng O(n² log n).
function sortEachRound(stones: number[]): number {
  const s = [...stones];
  while (s.length > 1) {
    s.sort((a, b) => a - b);
    const y = s.pop()!, x = s.pop()!;
    if (y > x) s.push(y - x);
  }
  return s.length === 1 ? s[0] : 0;
}

// Đếm theo cân nặng (đề cho cân nặng <= 1000): cnt[w] là số viên nặng w.
// Hai viên cùng cân nặng đập nhau thì cùng mất, nên chỉ cần cnt[w] % 2.
function countingBuckets(stones: number[], maxW = 1000): number {
  const cnt = new Array(maxW + 1).fill(0);
  for (const s of stones) cnt[s]++;
  let i = maxW;
  for (;;) {
    while (i > 0 && cnt[i] === 0) i--;
    if (i === 0) return 0;
    cnt[i] %= 2; // các cặp bằng nhau triệt tiêu nhau
    if (cnt[i] === 0) continue;
    let j = i - 1; // viên nặng thứ hai
    while (j > 0 && cnt[j] === 0) j--;
    if (j === 0) return i; // chỉ còn một viên
    cnt[i] = 0; cnt[j]--; cnt[i - j]++;
    i = Math.max(j, i - j); // mọi ô trong (j, i) đều rỗng, trừ ô i - j vừa thêm
  }
}

// SAI: sort() không truyền hàm so sánh thì JS so sánh theo chuỗi: [10, 2, 9] giữ nguyên thứ tự, "10" < "2".
function wrongDefaultSort(stones: number[]): number {
  const s = [...stones];
  while (s.length > 1) {
    s.sort();
    const y = s.pop()!, x = s.pop()!;
    if (y !== x) s.push(Math.abs(y - x));
  }
  return s.length === 1 ? s[0] : 0;
}

const cases: [number[], number][] = [
  [[2, 7, 4, 1, 8, 1], 1], [[1], 1], [[2, 2], 0], [[3, 3, 3], 3], [[10, 4, 2, 10], 2],
  [[10, 2, 9], 1], [[1000, 1], 999], [[7, 6, 7, 6, 9], 3], [[31, 26, 33, 21, 40], 9],
];
for (const fn of [sortEachRound, heapSim, countingBuckets, wrongDefaultSort]) {
  const bad = cases.filter(([s, want]) => fn(s) !== want).map(([s]) => `[${s}] → ${fn(s)}`);
  console.log(`${fn.name.padEnd(16)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(", ") : ""}`);
}

// Đối chiếu ngẫu nhiên: ba cách đúng phải khớp nhau.
// mulberry32: bộ sinh số giả ngẫu nhiên 32 bit dùng Math.imul, để kết quả lặp lại được.
let seed = 7;
const rand = () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const randStones = (n: number, maxW: number) => Array.from({ length: n }, () => 1 + Math.floor(rand() * maxW));
let agree = 0;
for (let t = 0; t < 2000; t++) {
  const s = randStones(1 + Math.floor(rand() * 30), 1 + Math.floor(rand() * 1000));
  const r = sortEachRound(s);
  if (heapSim(s) === r && countingBuckets(s) === r) agree++;
}
console.log(`\nngẫu nhiên: ba cách khớp nhau ở ${agree}/2000 bộ`);

// Đo: trung vị 5 lần chạy.
function time(fn: (s: number[]) => number, s: number[]): number {
  const ts: number[] = [];
  for (let r = 0; r < 5; r++) { const t0 = performance.now(); fn(s); ts.push(performance.now() - t0); }
  return ts.sort((a, b) => a - b)[2];
}
const f = (ms: number) => (ms.toFixed(ms < 10 ? 2 : 1) + " ms").padStart(12);
console.log("\nn         sắp mỗi lượt         heap  đếm (W=1000)");
for (const n of [1000, 3000, 10000, 100000, 1000000]) {
  const s = randStones(n, 1000);
  const sorted = n <= 10000 ? f(time(sortEachRound, s)) : "(không chạy)".padStart(12);
  console.log(`${String(n).padEnd(9)} ${sorted} ${f(time(heapSim, s))} ${f(time(countingBuckets, s))}`);
}
