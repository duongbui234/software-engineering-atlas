// LeetCode 84, Largest Rectangle in Histogram: bốn cách, hai bản sai, test và đo.
// Chạy: node largest-rectangle.ts

// Vét cạn O(n²): cố định cột trái i, kéo cột phải j, giữ chiều cao nhỏ nhất của đoạn.
function bruteForce(h: number[]): number {
  let best = 0;
  for (let i = 0; i < h.length; i++) {
    let low = Infinity;
    for (let j = i; j < h.length; j++) {
      low = Math.min(low, h[j]);
      best = Math.max(best, low * (j - i + 1));
    }
  }
  return best;
}

// Chia để trị: hình lớn nhất hoặc đi qua cột thấp nhất (rộng cả đoạn), hoặc nằm hẳn bên trái/phải nó.
function divideConquer(h: number[], lo = 0, hi = h.length - 1): number {
  if (lo > hi) return 0;
  let m = lo;
  for (let i = lo + 1; i <= hi; i++) if (h[i] < h[m]) m = i;
  return Math.max(h[m] * (hi - lo + 1), divideConquer(h, lo, m - 1), divideConquer(h, m + 1, hi));
}

// Hai mảng: left[i] / right[i] = chỉ số cột thấp hơn h[i] gần nhất bên trái / bên phải.
function prevNextSmaller(h: number[]): number {
  const n = h.length, left = new Array(n), right = new Array(n), st: number[] = [];
  for (let i = 0; i < n; i++) {
    while (st.length && h[st[st.length - 1]] >= h[i]) st.pop();
    left[i] = st.length ? st[st.length - 1] : -1;
    st.push(i);
  }
  st.length = 0;
  for (let i = n - 1; i >= 0; i--) {
    while (st.length && h[st[st.length - 1]] >= h[i]) st.pop();
    right[i] = st.length ? st[st.length - 1] : n;
    st.push(i);
  }
  let best = 0;
  for (let i = 0; i < n; i++) best = Math.max(best, h[i] * (right[i] - left[i] - 1));
  return best;
}

// Một lượt, ngăn xếp chỉ số với chiều cao TĂNG dần. Cột lính canh cao 0 ở cuối đẩy mọi thứ còn lại ra.
function monotonicStack(h: number[]): number {
  const st: number[] = [];
  let best = 0;
  for (let i = 0; i <= h.length; i++) {
    const cur = i === h.length ? 0 : h[i]; // lính canh
    while (st.length && h[st[st.length - 1]] >= cur) {
      const height = h[st.pop()!];
      const left = st.length ? st[st.length - 1] : -1; // cột thấp hơn gần nhất bên trái, sau khi pop
      best = Math.max(best, height * (i - left - 1));
    }
    st.push(i);
  }
  return best;
}

// SAI 1: không có lính canh. Các cột còn trong ngăn xếp lúc hết mảng không bao giờ được tính.
function noSentinel(h: number[]): number {
  const st: number[] = [];
  let best = 0;
  for (let i = 0; i < h.length; i++) {
    while (st.length && h[st[st.length - 1]] >= h[i]) {
      const height = h[st.pop()!];
      best = Math.max(best, height * (i - (st.length ? st[st.length - 1] : -1) - 1));
    }
    st.push(i);
  }
  return best;
}

// SAI 2: lấy chiều rộng là i − (chỉ số vừa pop), tức chỉ tính từ cột bị pop sang phải, quên phần bên trái nó.
function widthFromPopped(h: number[]): number {
  const st: number[] = [];
  let best = 0;
  for (let i = 0; i <= h.length; i++) {
    const cur = i === h.length ? 0 : h[i];
    while (st.length && h[st[st.length - 1]] >= cur) {
      const top = st.pop()!;
      best = Math.max(best, h[top] * (i - top));
    }
    st.push(i);
  }
  return best;
}

const cases: [number[], number][] = [
  [[2, 1, 5, 6, 2, 3], 10], [[2, 4], 4], [[1], 1], [[0, 0], 0],
  [[1, 2, 3, 4, 5], 9], [[5, 4, 3, 2, 1], 9], [[2, 2, 2, 2], 8], [[4, 2, 0, 3, 2, 5], 6], [[6, 2, 5, 4, 5, 1, 6], 12],
];
for (const fn of [bruteForce, (h: number[]) => divideConquer(h), prevNextSmaller, monotonicStack, noSentinel, widthFromPopped]) {
  const name = fn.name || "divideConquer";
  const bad = cases.filter(([h, want]) => fn(h) !== want).map(([h]) => `${JSON.stringify(h)} → ${fn(h)}`);
  console.log(`${name.padEnd(16)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(" ") : ""}`);
}

// Đếm tổng số lần pop: mỗi chỉ số được đẩy một lần và lấy ra nhiều nhất một lần.
let seed = 7;
const rand = () => { seed = (seed + 0x6d2b79f5) | 0; let x = Math.imul(seed ^ (seed >>> 15), 1 | seed); x ^= x + Math.imul(x ^ (x >>> 7), 61 | x); return ((x ^ (x >>> 14)) >>> 0) / 4294967296; };
const randomH = (n: number) => Array.from({ length: n }, () => Math.floor(rand() * 10_001));
function countPops(h: number[]) {
  const st: number[] = []; let pops = 0;
  for (let i = 0; i <= h.length; i++) { const cur = i === h.length ? 0 : h[i]; while (st.length && h[st[st.length - 1]] >= cur) { st.pop(); pops++; } st.push(i); }
  return pops;
}
console.log(`\nn = 100 000 ngẫu nhiên: ${countPops(randomH(100_000))} lần pop; n = 100 000 tăng dần: ${countPops(Array.from({ length: 100_000 }, (_, i) => i + 1))} lần pop`);

// Đo
const median = (xs: number[]) => xs.sort((a, b) => a - b)[Math.floor(xs.length / 2)];
const time = (f: () => unknown, runs: number) => { const ts: number[] = []; for (let r = 0; r < runs; r++) { const t = performance.now(); f(); ts.push(performance.now() - t); } return median(ts); };
console.log("\nn          vét cạn   chia để trị   ngăn xếp   (ms, trung vị; chiều cao ngẫu nhiên)");
for (const n of [2_000, 4_000, 8_000, 16_000]) {
  const h = randomH(n);
  console.log(`${String(n).padEnd(10)} ${time(() => bruteForce(h), 3).toFixed(1).padStart(7)} ${time(() => divideConquer(h), 5).toFixed(2).padStart(13)} ${time(() => monotonicStack(h), 5).toFixed(2).padStart(10)}`);
}
for (const n of [100_000, 1_000_000]) {
  const h = randomH(n);
  console.log(`${String(n).padEnd(10)} ${"—".padStart(7)} ${time(() => divideConquer(h), 5).toFixed(2).padStart(13)} ${time(() => monotonicStack(h), 5).toFixed(2).padStart(10)}`);
}
console.log("\nchia để trị trên cột TĂNG dần (cột thấp nhất luôn ở mép, đệ quy sâu n tầng)");
for (const n of [1_000, 2_000, 4_000, 8_000, 100_000]) {
  const h = Array.from({ length: n }, (_, i) => i + 1);
  try { console.log(`n = ${String(n).padEnd(7)} ${time(() => divideConquer(h), 3).toFixed(1).padStart(7)} ms`); }
  catch (e) { console.log(`n = ${String(n).padEnd(7)} ${(e as Error).name}: ${(e as Error).message}`); }
}
