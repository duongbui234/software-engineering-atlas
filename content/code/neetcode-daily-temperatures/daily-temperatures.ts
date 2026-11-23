// LeetCode 739, Daily Temperatures: ba cách, một bản sai, test và đo.
// Chạy: node daily-temperatures.ts

// Cách 1, vét cạn: với mỗi ngày, đi tới trước tìm ngày ấm hơn đầu tiên.
function bruteForce(t: number[]): number[] {
  const out = new Array(t.length).fill(0);
  for (let i = 0; i < t.length; i++) {
    for (let j = i + 1; j < t.length; j++) {
      if (t[j] > t[i]) { out[i] = j - i; break; }
    }
  }
  return out;
}

// Cách 2, ngăn xếp đơn điệu: giữ CHỈ SỐ các ngày chưa tìm được ngày ấm hơn, nhiệt độ giảm dần từ đáy lên đỉnh.
function monotonicStack(t: number[]): number[] {
  const out = new Array(t.length).fill(0);
  const stack: number[] = [];
  for (let i = 0; i < t.length; i++) {
    while (stack.length > 0 && t[i] > t[stack[stack.length - 1]]) {
      const j = stack.pop()!; // ngày j vừa gặp ngày ấm hơn đầu tiên của nó: ngày i
      out[j] = i - j;
    }
    stack.push(i);
  }
  return out; // các ngày còn trên ngăn xếp không có ngày ấm hơn: giữ 0
}

// Cách 3, đi từ phải và nhảy theo đáp án: không cần ngăn xếp, O(1) bộ nhớ phụ.
function jumpFromRight(t: number[]): number[] {
  const n = t.length;
  const out = new Array(n).fill(0);
  for (let i = n - 2; i >= 0; i--) {
    let j = i + 1;
    while (j < n && t[j] <= t[i]) {
      if (out[j] === 0) { j = n; break; } // j không có ngày ấm hơn, nên i cũng không
      j += out[j]; // nhảy thẳng tới ngày ấm hơn j
    }
    if (j < n) out[i] = j - i;
  }
  return out;
}

// SAI: pop cả khi bằng nhau (>=). Ngày cùng nhiệt độ bị coi là "ấm hơn".
function popOnEqual(t: number[]): number[] {
  const out = new Array(t.length).fill(0);
  const stack: number[] = [];
  for (let i = 0; i < t.length; i++) {
    while (stack.length > 0 && t[i] >= t[stack[stack.length - 1]]) {
      const j = stack.pop()!;
      out[j] = i - j;
    }
    stack.push(i);
  }
  return out;
}

const cases: [number[], number[]][] = [
  [[73, 74, 75, 71, 69, 72, 76, 73], [1, 1, 4, 2, 1, 1, 0, 0]],
  [[30, 40, 50, 60], [1, 1, 1, 0]],
  [[30, 60, 90], [1, 1, 0]],
  [[90, 80, 70], [0, 0, 0]],
  [[70, 70, 71], [2, 1, 0]],
  [[50], [0]],
  [[55, 38, 53, 81, 61, 93, 97, 32, 43, 78], [3, 1, 1, 2, 1, 1, 0, 1, 1, 0]],
];
const same = (a: number[], b: number[]) => a.length === b.length && a.every((x, i) => x === b[i]);
for (const fn of [bruteForce, monotonicStack, jumpFromRight, popOnEqual]) {
  const bad = cases.filter(([t, want]) => !same(fn(t), want));
  console.log(`${fn.name.padEnd(15)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.map(([t]) => `[${t}] → [${fn(t)}]`).join(" ") : ""}`);
}

// Đo. Hai loại dữ liệu: giảm dần (ca tệ nhất của vét cạn: mỗi ngày quét tới cuối) và ngẫu nhiên 30..100 như đề.
let seed = 42;
// Bộ sinh ngẫu nhiên mulberry32: trạng thái là số nguyên 32 bit, mọi phép nhân qua Math.imul nên không mất chính xác.
function mix32(a: number): number { let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return (t ^ (t >>> 14)) >>> 0; }
const rand = () => ((seed = (seed + 0x6d2b79f5) | 0), mix32(seed) >>> 1) / 2 ** 31;
const decreasing = (n: number) => Array.from({ length: n }, (_, i) => 100 - Math.floor((70 * i) / n));
const random = (n: number) => Array.from({ length: n }, () => 30 + Math.floor(rand() * 71));
const time = (fn: (t: number[]) => number[], t: number[], runs: number) => {
  const ts: number[] = [];
  for (let k = 0; k < runs; k++) { const s = performance.now(); fn(t); ts.push(performance.now() - s); }
  return ts.sort((a, b) => a - b)[Math.floor(runs / 2)];
};
console.log("\nn        dữ liệu      vét cạn   ngăn xếp   nhảy từ phải   (ms, trung vị)");
for (const n of [10_000, 20_000, 40_000]) {
  for (const [name, gen] of [["giảm dần", decreasing], ["ngẫu nhiên", random]] as const) {
    const t = gen(n);
    console.log(`${String(n).padEnd(8)} ${name.padEnd(12)} ${time(bruteForce, t, 3).toFixed(1).padStart(7)} ${time(monotonicStack, t, 5).toFixed(2).padStart(10)} ${time(jumpFromRight, t, 5).toFixed(2).padStart(14)}`);
  }
}
for (const [name, gen] of [["giảm dần", decreasing], ["ngẫu nhiên", random]] as const) {
  const t = gen(1_000_000);
  console.log(`${"1000000".padEnd(8)} ${name.padEnd(12)} ${"—".padStart(7)} ${time(monotonicStack, t, 5).toFixed(2).padStart(10)} ${time(jumpFromRight, t, 5).toFixed(2).padStart(14)}`);
}

// Đếm tổng số lần pop: mỗi chỉ số vào ngăn xếp một lần, ra tối đa một lần.
let pops = 0;
{
  const t = random(1_000_000), stack: number[] = [];
  for (let i = 0; i < t.length; i++) {
    while (stack.length && t[i] > t[stack[stack.length - 1]]) { stack.pop(); pops++; }
    stack.push(i);
  }
  console.log(`\nn = 1000000 ngẫu nhiên: ${pops} lần pop, ${t.length - pops} chỉ số còn lại trên ngăn xếp (tổng = n)`);
}
