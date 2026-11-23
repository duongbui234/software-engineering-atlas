// LeetCode 621, Task Scheduler: mô phỏng bằng max-heap + hàng chờ nguội, công thức khung, dựng lịch thật,
// ba bản sai, đối chiếu với tìm kiếm vét cạn và phép đo.
// Chạy: node task-scheduler.ts

// Max-heap trên mảng: cha ở i, hai con ở 2i+1 và 2i+2; phần tử lớn nhất luôn ở đỉnh a[0].
class MaxHeap {
  a: number[] = [];
  get size(): number { return this.a.length; }
  push(x: number): void {
    const a = this.a;
    a.push(x);
    let i = a.length - 1;
    while (i > 0) { // nổi lên
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
      for (;;) { // chìm xuống
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

// Đếm số lần xuất hiện của từng chữ 'A'..'Z'.
function countTasks(tasks: string[]): number[] {
  const cnt = new Array(26).fill(0);
  for (const t of tasks) cnt[t.charCodeAt(0) - 65]++;
  return cnt;
}

// Mô phỏng từng nhịp: heap giữ số lần còn lại của các việc sẵn sàng,
// hàng chờ giữ [số lần còn lại, nhịp được chạy lại] của các việc đang nguội.
function simulateHeap(tasks: string[], n: number): number {
  const heap = new MaxHeap();
  for (const c of countTasks(tasks)) if (c > 0) heap.push(c);
  const queue: [number, number][] = [];
  let head = 0, time = 0;
  while (heap.size > 0 || head < queue.length) {
    time++;
    if (heap.size > 0) {
      const c = heap.pop() - 1; // chạy việc còn nhiều nhất
      if (c > 0) queue.push([c, time + n]);
    } // heap rỗng: nhịp này nghỉ (idle)
    if (head < queue.length && queue[head][1] === time) heap.push(queue[head++][0]);
  }
  return time;
}

// Như trên, nhưng khi heap rỗng thì nhảy thẳng tới nhịp việc đầu hàng chờ hết nguội,
// thay vì đếm từng nhịp nghỉ. Số vòng lặp chỉ còn bằng số việc.
function simulateJump(tasks: string[], n: number): number {
  const heap = new MaxHeap();
  for (const c of countTasks(tasks)) if (c > 0) heap.push(c);
  const queue: [number, number][] = [];
  let head = 0, time = 0;
  while (heap.size > 0 || head < queue.length) {
    if (heap.size === 0) { // các nhịp tới queue[head][1] đều nghỉ: cộng cả dải một lần
      time = queue[head][1];
      heap.push(queue[head++][0]);
    }
    time++;
    const c = heap.pop() - 1;
    if (c > 0) queue.push([c, time + n]);
    if (head < queue.length && queue[head][1] === time) heap.push(queue[head++][0]);
  }
  return time;
}

// Công thức khung: f = số lần của việc nhiều nhất, k = số việc cùng đạt f.
// (f − 1) khung dài n + 1, cộng khung cuối k ô; nếu việc nhiều hơn chỗ trống thì không nghỉ nhịp nào.
function formula(tasks: string[], n: number): number {
  const cnt = countTasks(tasks);
  const f = Math.max(...cnt);
  const k = cnt.filter((c) => c === f).length;
  return Math.max(tasks.length, (f - 1) * (n + 1) + k);
}

// Dựng lịch thật theo đúng chứng minh: mỗi khung mở đầu bằng các việc đạt f,
// các việc còn lại (xếp theo số lần GIẢM dần) rải theo cột qua f − 1 khung đầu.
function frameSchedule(tasks: string[], n: number, ascending = false): string[] {
  const cnt = countTasks(tasks);
  const f = Math.max(...cnt);
  const letters = [...Array(26).keys()].filter((i) => cnt[i] > 0).map((i) => String.fromCharCode(65 + i));
  const top = letters.filter((c) => cnt[c.charCodeAt(0) - 65] === f);
  const rest = letters.filter((c) => cnt[c.charCodeAt(0) - 65] < f)
    .sort((a, b) => (cnt[b.charCodeAt(0) - 65] - cnt[a.charCodeAt(0) - 65]) * (ascending ? -1 : 1));
  const frames: string[][] = Array.from({ length: f }, () => [...top]);
  let p = 0;
  for (const c of rest) {
    for (let r = 0; r < cnt[c.charCodeAt(0) - 65]; r++) frames[p++ % (f - 1)].push(c); // đi xuống theo cột
  }
  const out: string[] = [];
  frames.forEach((fr, i) => {
    out.push(...fr);
    if (i < f - 1) for (let s = fr.length; s < n + 1; s++) out.push("idle"); // lấp khung còn thiếu bằng nhịp nghỉ
  });
  return out;
}

// Kiểm một lịch: đủ việc, và hai lần chạy cùng một việc cách nhau ít nhất n + 1 nhịp.
function isValid(schedule: string[], tasks: string[], n: number): boolean {
  const last = new Map<string, number>();
  const used = new Array(26).fill(0);
  for (let t = 0; t < schedule.length; t++) {
    const c = schedule[t];
    if (c === "idle") continue;
    if (last.has(c) && t - last.get(c)! < n + 1) return false;
    last.set(c, t);
    used[c.charCodeAt(0) - 65]++;
  }
  return countTasks(tasks).every((c, i) => c === used[i]);
}

// Vét cạn (chỉ cho input nhỏ): BFS trên trạng thái (số lần còn lại, số nhịp còn phải nguội) của từng việc.
function bruteForce(tasks: string[], n: number): number {
  const cnt = countTasks(tasks).filter((c) => c > 0);
  const start = cnt.map((c) => [c, 0]);
  const key = (s: number[][]) => s.map((x) => x.join(",")).join(";");
  let frontier = [start];
  const seen = new Set([key(start)]);
  for (let step = 0; ; step++) {
    const next: number[][][] = [];
    for (const s of frontier) {
      if (s.every(([c]) => c === 0)) return step;
      const cool = s.map(([c, w]) => [c, Math.max(0, w - 1)]);
      const moves = [cool]; // nghỉ một nhịp
      s.forEach(([c, w], i) => {
        if (c > 0 && w === 0) moves.push(cool.map((x, j) => (j === i ? [c - 1, n] : x)));
      });
      for (const m of moves) { const k = key(m); if (!seen.has(k)) { seen.add(k); next.push(m); } }
    }
    frontier = next;
  }
}

// SAI: quên lấy max với số việc: khi việc nhiều hơn chỗ trống, công thức khung đếm thiếu.
function wrongNoMax(tasks: string[], n: number): number {
  const cnt = countTasks(tasks);
  const f = Math.max(...cnt);
  const k = cnt.filter((c) => c === f).length;
  return (f - 1) * (n + 1) + k;
}

// SAI: khung cuối luôn 1 ô, quên rằng nhiều việc có thể cùng đạt f.
function wrongCountMax(tasks: string[], n: number): number {
  const cnt = countTasks(tasks);
  const f = Math.max(...cnt);
  return Math.max(tasks.length, (f - 1) * (n + 1) + 1);
}

// SAI: mỗi nhịp chạy việc sẵn sàng đầu tiên theo bảng chữ cái, không ưu tiên việc còn nhiều nhất.
function wrongAnyAvailable(tasks: string[], n: number): number {
  const cnt = countTasks(tasks);
  const ready = new Array(26).fill(1);
  let left = tasks.length, time = 0;
  while (left > 0) {
    time++;
    const i = cnt.findIndex((c, j) => c > 0 && ready[j] <= time);
    if (i >= 0) { cnt[i]--; ready[i] = time + n + 1; left--; }
  }
  return time;
}

const T = (s: string) => s.split("");
const cases: [string, number, number][] = [
  ["AAABBB", 2, 8], ["ACABDB", 1, 6], ["AAABBB", 3, 10], ["AAABBB", 0, 6], ["A", 100, 1],
  ["AAAAAABCDEFG", 2, 16], ["ABBB", 1, 5], ["AABBCCDD", 1, 8], ["AAABBBCCCDDE", 2, 12], ["AAAB", 3, 9],
];
const show = (s: string, n: number) => `${s} n=${n}`;
for (const fn of [simulateHeap, simulateJump, formula, (t: string[], n: number) => frameSchedule(t, n).length,
  bruteForce, wrongNoMax, wrongCountMax, wrongAnyAvailable]) {
  const name = fn.name || "frameSchedule";
  const bad = cases.filter(([s, n, want]) => fn(T(s), n) !== want).map(([s, n]) => `${show(s, n)} → ${fn(T(s), n)}`);
  console.log(`${name.padEnd(17)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(", ") : ""}`);
}

const ex = frameSchedule(T("AAAAAABCDEFG"), 2);
console.log(`\nlịch dựng theo khung cho AAAAAABCDEFG, n=2 (${ex.length} nhịp):\n  ${ex.join(" ")}`);

// mulberry32: bộ sinh số giả ngẫu nhiên 32 bit dùng Math.imul, để kết quả lặp lại được.
let seed = 621;
const rand = () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const randTasks = (len: number, letters: number) =>
  Array.from({ length: len }, () => String.fromCharCode(65 + Math.floor(rand() * letters)));

// Đối chiếu ngẫu nhiên trên input nhỏ: vét cạn là chuẩn.
let agree = 0, validDesc = 0, validAsc = 0;
const SMALL = 1500;
for (let r = 0; r < SMALL; r++) {
  const t = randTasks(1 + Math.floor(rand() * 9), 1 + Math.floor(rand() * 4));
  const n = Math.floor(rand() * 4);
  const want = bruteForce(t, n);
  if (simulateHeap(t, n) === want && simulateJump(t, n) === want && formula(t, n) === want) agree++;
  const d = frameSchedule(t, n);
  if (d.length === want && isValid(d, t, n)) validDesc++;
  const a = frameSchedule(t, n, true);
  if (a.length === want && isValid(a, t, n)) validAsc++;
}
console.log(`\nvét cạn so với 3 cách: khớp ${agree}/${SMALL} bộ nhỏ`);
console.log(`lịch dựng theo khung, việc xếp giảm dần: hợp lệ và ngắn nhất ở ${validDesc}/${SMALL}`);
console.log(`lịch dựng theo khung, việc xếp TĂNG dần: hợp lệ và ngắn nhất ở ${validAsc}/${SMALL}`);

// Ví dụ cụ thể khi rải việc theo thứ tự tăng dần.
for (const asc of [true, false]) {
  const s = frameSchedule(T("AAABBC"), 2, asc);
  console.log(`AAABBC, n=2, xếp ${asc ? "tăng" : "giảm"} dần: ${s.join(" ")} → hợp lệ? ${isValid(s, T("AAABBC"), 2)}`);
}

// Đối chiếu lớn: ba cách nhanh khớp nhau.
let agreeBig = 0;
for (let r = 0; r < 300; r++) {
  const t = randTasks(1 + Math.floor(rand() * 2000), 1 + Math.floor(rand() * 26));
  const n = Math.floor(rand() * 101);
  const f = formula(t, n);
  if (simulateHeap(t, n) === f && simulateJump(t, n) === f && frameSchedule(t, n).length === f && isValid(frameSchedule(t, n), t, n)) agreeBig++;
}
console.log(`bộ lớn (tới 2000 việc, n ≤ 100): khớp và hợp lệ ở ${agreeBig}/300`);

// Đo: trung vị 5 lần chạy.
function time(fn: (t: string[], n: number) => number, t: string[], n: number): number {
  const ts: number[] = [];
  for (let r = 0; r < 5; r++) { const t0 = performance.now(); fn(t, n); ts.push(performance.now() - t0); }
  return ts.sort((a, b) => a - b)[2];
}
const fmt = (ms: number) => (ms.toFixed(ms < 10 ? 2 : 1) + " ms").padStart(11);
console.log("\nsố việc   chữ  n       đáp án   heap từng nhịp  heap nhảy   công thức");
for (const [len, letters, n] of [[10000, 26, 2], [10000, 26, 100], [100000, 26, 100], [100000, 2, 100], [100000, 26, 10000], [1000000, 26, 100]]) {
  const t = randTasks(len, letters);
  const ans = formula(t, n);
  console.log(`${String(len).padEnd(9)} ${String(letters).padEnd(4)} ${String(n).padEnd(7)} ${String(ans).padStart(9)} ${fmt(time(simulateHeap, t, n)).padStart(15)} ${fmt(time(simulateJump, t, n))} ${fmt(time(formula, t, n))}`);
}
