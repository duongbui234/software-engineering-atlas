// LeetCode 621, Task Scheduler bằng JavaScript: không có heap sẵn, nên so sắp xếp 26 số đếm mỗi vòng với heap tự viết.
// Chạy: node task-scheduler.js

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

function countTasks(tasks) {
  const cnt = new Array(26).fill(0);
  for (const t of tasks) cnt[t.charCodeAt(0) - 65]++;
  return cnt;
}

function heapSim(tasks, n) {
  const heap = new MaxHeap();
  for (const c of countTasks(tasks)) if (c > 0) heap.push(c);
  const queue = [];
  let head = 0, time = 0;
  while (heap.size > 0 || head < queue.length) {
    time++;
    if (heap.size > 0) {
      const c = heap.pop() - 1;
      if (c > 0) queue.push([c, time + n]);
    }
    if (head < queue.length && queue[head][1] === time) heap.push(queue[head++][0]);
  }
  return time;
}

// Chỉ có 26 loại việc: mỗi vòng n + 1 nhịp, sắp 26 số đếm giảm dần rồi chạy n + 1 việc nhiều nhất.
function roundsSort(tasks, n) {
  const cnt = countTasks(tasks);
  let total = 0;
  for (;;) {
    cnt.sort((a, b) => b - a);
    if (cnt[0] === 0) return total;
    let ran = 0;
    for (let i = 0; i < 26 && ran < n + 1 && cnt[i] > 0; i++) { cnt[i]--; ran++; }
    if (cnt.every((c) => c === 0)) return total + ran; // vòng cuối không phải nghỉ cho đủ
    total += n + 1;
  }
}

function formula(tasks, n) {
  const cnt = countTasks(tasks);
  const f = Math.max(...cnt);
  const k = cnt.filter((c) => c === f).length;
  return Math.max(tasks.length, (f - 1) * (n + 1) + k);
}

// SAI: sort() không hàm so sánh xếp số đếm theo chuỗi: "3" > "2" > "10".
function wrongDefaultSort(tasks, n) {
  const cnt = countTasks(tasks);
  let total = 0;
  for (;;) {
    cnt.sort().reverse();
    if (cnt.every((c) => c === 0)) return total;
    let ran = 0;
    for (let i = 0; i < 26 && ran < n + 1; i++) if (cnt[i] > 0) { cnt[i]--; ran++; }
    if (cnt.every((c) => c === 0)) return total + ran;
    total += n + 1;
  }
}

const cases = [
  ["AAABBB", 2, 8], ["ACABDB", 1, 6], ["AAABBB", 3, 10], ["AAABBB", 0, 6], ["A", 100, 1],
  ["AAAAAABCDEFG", 2, 16], ["ABBB", 1, 5], ["AABBCCDD", 1, 8], ["AAABBBCCCDDE", 2, 12], ["AAAB", 3, 9],
  ["AAAAAAAAAABBBCC", 1, 19],
];
for (const fn of [heapSim, roundsSort, formula, wrongDefaultSort]) {
  const bad = cases.filter(([s, n, want]) => fn(s.split(""), n) !== want).map(([s, n]) => `${s} n=${n} → ${fn(s.split(""), n)}`);
  console.log(`${fn.name.padEnd(16)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(", ") : ""}`);
}

// mulberry32: bộ sinh số giả ngẫu nhiên 32 bit dùng Math.imul.
let seed = 621;
const rand = () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const randTasks = (len, letters) => Array.from({ length: len }, () => String.fromCharCode(65 + Math.floor(rand() * letters)));

let agree = 0;
for (let r = 0; r < 300; r++) {
  const t = randTasks(1 + Math.floor(rand() * 2000), 1 + Math.floor(rand() * 26));
  const n = Math.floor(rand() * 101);
  const f = formula(t, n);
  if (heapSim(t, n) === f && roundsSort(t, n) === f) agree++;
}
console.log(`\nngẫu nhiên: ba cách khớp ở ${agree}/300 bộ`);

function time(fn, t, n) {
  const ts = [];
  for (let r = 0; r < 5; r++) { const t0 = performance.now(); fn(t, n); ts.push(performance.now() - t0); }
  return ts.sort((a, b) => a - b)[2];
}
const fmt = (ms) => (ms.toFixed(2) + " ms").padStart(10);
console.log("\nsố việc   n      heap       sắp mỗi vòng  công thức");
for (const [len, n] of [[10000, 2], [100000, 2], [100000, 100], [1000000, 100]]) {
  const t = randTasks(len, 26);
  console.log(`${String(len).padEnd(9)} ${String(n).padEnd(6)} ${fmt(time(heapSim, t, n))} ${fmt(time(roundsSort, t, n)).padStart(13)} ${fmt(time(formula, t, n))}`);
}
