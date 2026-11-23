// LeetCode 155, Min Stack: bốn cách, hai bản sai, test và đo.
// Chạy: node min-stack.ts

interface MinStackLike { push(x: number): void; pop(): void; top(): number; getMin(): number }

// Cách 1: chỉ một mảng; getMin duyệt cả mảng, O(n).
class ScanMinStack implements MinStackLike {
  private a: number[] = [];
  push(x: number) { this.a.push(x); }
  pop() { this.a.pop(); }
  top() { return this.a[this.a.length - 1]; }
  getMin() { let m = Infinity; for (const x of this.a) if (x < m) m = x; return m; }
}

// Cách 2: mỗi tầng nhớ cặp [giá trị, min tới tầng này].
class PairMinStack implements MinStackLike {
  private a: [number, number][] = [];
  push(x: number) {
    const m = this.a.length === 0 ? x : Math.min(x, this.a[this.a.length - 1][1]);
    this.a.push([x, m]);
  }
  pop() { this.a.pop(); }
  top() { return this.a[this.a.length - 1][0]; }
  getMin() { return this.a[this.a.length - 1][1]; }
}

// Cách 3: hai ngăn xếp; ngăn phụ chỉ nhận x khi x <= min hiện tại (phải có dấu =).
class TwoStackMinStack implements MinStackLike {
  private a: number[] = [];
  private mins: number[] = [];
  push(x: number) {
    this.a.push(x);
    if (this.mins.length === 0 || x <= this.mins[this.mins.length - 1]) this.mins.push(x);
  }
  pop() {
    const x = this.a.pop();
    if (x === this.mins[this.mins.length - 1]) this.mins.pop();
  }
  top() { return this.a[this.a.length - 1]; }
  getMin() { return this.mins[this.mins.length - 1]; }
}

// Cách 4: lưu hiệu x − min cũ và một biến min; hiệu âm nghĩa là tầng này đổi min.
// Trong JS số là double nên hiệu của hai số 32 bit vẫn chính xác; Java với int thì tràn.
class DiffMinStack implements MinStackLike {
  private d: number[] = [];
  private min = 0;
  push(x: number) {
    if (this.d.length === 0) { this.d.push(0); this.min = x; return; }
    this.d.push(x - this.min);
    if (x < this.min) this.min = x;
  }
  pop() {
    const diff = this.d.pop()!;
    if (diff < 0) this.min = this.min - diff; // khôi phục min cũ: min cũ = x − diff, mà x chính là min hiện tại
  }
  top() { const diff = this.d[this.d.length - 1]; return diff < 0 ? this.min : this.min + diff; }
  getMin() { return this.min; }
}

// Bản sai: ngăn phụ chỉ nhận x khi x < min (thiếu dấu =). Hai số min bằng nhau, pop một cái là mất min.
class StrictLessMinStack extends TwoStackMinStack {
  push(x: number) {
    (this as any).a.push(x);
    const mins = (this as any).mins as number[];
    if (mins.length === 0 || x < mins[mins.length - 1]) mins.push(x);
  }
}

type Op = ["push", number] | ["pop"] | ["top"] | ["getMin"];
const cases: { name: string; ops: Op[]; want: number[] }[] = [
  { name: "ví dụ của đề", ops: [["push", -2], ["push", 0], ["push", -3], ["getMin"], ["pop"], ["top"], ["getMin"]], want: [-3, 0, -2] },
  { name: "min lặp lại", ops: [["push", 0], ["push", 1], ["push", 0], ["getMin"], ["pop"], ["getMin"]], want: [0, 0] },
  { name: "tăng dần", ops: [["push", 1], ["push", 2], ["push", 3], ["getMin"], ["pop"], ["pop"], ["getMin"]], want: [1, 1] },
  { name: "giảm dần", ops: [["push", 3], ["push", 2], ["push", 1], ["getMin"], ["pop"], ["getMin"], ["pop"], ["getMin"]], want: [1, 2, 3] },
  { name: "biên 32 bit", ops: [["push", 2147483647], ["push", -2147483648], ["getMin"], ["top"], ["pop"], ["getMin"], ["top"]], want: [-2147483648, -2147483648, 2147483647, 2147483647] },
  { name: "số lớn hơn 127", ops: [["push", 500], ["pop"], ["push", 700], ["getMin"]], want: [700] },
];
const run = (make: () => MinStackLike, ops: Op[]) => {
  const s = make(), out: number[] = [];
  for (const op of ops) {
    if (op[0] === "push") s.push(op[1]);
    else if (op[0] === "pop") s.pop();
    else out.push(op[0] === "top" ? s.top() : s.getMin());
  }
  return out;
};
const impls: [string, () => MinStackLike][] = [
  ["ScanMinStack", () => new ScanMinStack()], ["PairMinStack", () => new PairMinStack()],
  ["TwoStackMinStack", () => new TwoStackMinStack()], ["DiffMinStack", () => new DiffMinStack()],
  ["StrictLessMinStack", () => new StrictLessMinStack()],
];
for (const [name, make] of impls) {
  const bad = cases.filter((c) => JSON.stringify(run(make, c.ops)) !== JSON.stringify(c.want)).map((c) => c.name);
  console.log(`${name.padEnd(19)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở: " + bad.join(", ") : ""}`);
}

// Đo: n lần push ngẫu nhiên, mỗi lần push gọi getMin một lần.
let seed = 42;
// Bộ sinh ngẫu nhiên mulberry32: trạng thái là số nguyên 32 bit, mọi phép nhân qua Math.imul nên không mất chính xác.
function mix32(a: number): number { let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return (t ^ (t >>> 14)) >>> 0; }
const rand = () => ((seed = (seed + 0x6d2b79f5) | 0), mix32(seed) >>> 1);
const time = (make: () => MinStackLike, n: number, runs: number) => {
  const xs = Array.from({ length: n }, () => rand() - 2 ** 30);
  const ts: number[] = [];
  for (let k = 0; k < runs; k++) {
    const t = performance.now();
    const s = make();
    let sink = 0;
    for (const x of xs) { s.push(x); sink += s.getMin(); }
    ts.push(performance.now() - t);
    if (sink === 0.5) console.log(sink);
  }
  return ts.sort((a, b) => a - b)[Math.floor(runs / 2)];
};
console.log("\nn          duyệt    cặp     hai ngăn  hiệu    (ms, trung vị)");
for (const n of [5_000, 10_000, 20_000, 40_000]) {
  console.log(`${String(n).padEnd(10)} ${time(impls[0][1], n, 3).toFixed(1).padStart(6)} ${time(impls[1][1], n, 5).toFixed(2).padStart(7)} ${time(impls[2][1], n, 5).toFixed(2).padStart(8)} ${time(impls[3][1], n, 5).toFixed(2).padStart(7)}`);
}
const big = 1_000_000;
console.log(`${String(big).padEnd(10)} ${"—".padStart(6)} ${time(impls[1][1], big, 5).toFixed(2).padStart(7)} ${time(impls[2][1], big, 5).toFixed(2).padStart(8)} ${time(impls[3][1], big, 5).toFixed(2).padStart(7)}`);
