// LeetCode 42, Trapping Rain Water: bốn cách, một bản sai, test và đo.
// Chạy: node trapping-rain-water.ts
// Nước trên cột i = min(cao nhất bên trái, cao nhất bên phải) − h[i], tính cả cột i trong hai "cao nhất".

function bruteForce(h: number[]): number {
  let total = 0;
  for (let i = 0; i < h.length; i++) {
    let left = 0, right = 0;
    for (let k = 0; k <= i; k++) left = Math.max(left, h[k]);
    for (let k = i; k < h.length; k++) right = Math.max(right, h[k]);
    total += Math.min(left, right) - h[i];
  }
  return total;
}

// Hai mảng max tiền tố và max hậu tố: O(n) thời gian, O(n) bộ nhớ.
function prefixMax(h: number[]): number {
  const n = h.length;
  if (n === 0) return 0;
  const left = new Array(n), right = new Array(n);
  left[0] = h[0];
  for (let i = 1; i < n; i++) left[i] = Math.max(left[i - 1], h[i]);
  right[n - 1] = h[n - 1];
  for (let i = n - 2; i >= 0; i--) right[i] = Math.max(right[i + 1], h[i]);
  let total = 0;
  for (let i = 0; i < n; i++) total += Math.min(left[i], right[i]) - h[i];
  return total;
}

// Hai con trỏ: O(1) bộ nhớ. Bên nào có max nhỏ hơn thì nước ở bên đó đã biết chắc.
function twoPointers(h: number[]): number {
  let i = 0, j = h.length - 1, leftMax = 0, rightMax = 0, total = 0;
  while (i < j) {
    leftMax = Math.max(leftMax, h[i]);
    rightMax = Math.max(rightMax, h[j]);
    if (leftMax < rightMax) {
      total += leftMax - h[i]; // bên phải có cột ≥ rightMax > leftMax, nên leftMax là mực nước ở i
      i++;
    } else {
      total += rightMax - h[j];
      j--;
    }
  }
  return total;
}

// Ngăn xếp đơn điệu (ga 7): đổ nước theo từng lớp ngang khi gặp cột cao hơn đáy.
function monotonicStack(h: number[]): number {
  const stack: number[] = []; // chỉ số, chiều cao giảm dần từ đáy lên đỉnh
  let total = 0;
  for (let i = 0; i < h.length; i++) {
    while (stack.length && h[i] > h[stack[stack.length - 1]]) {
      const bottom = stack.pop()!;
      if (!stack.length) break; // không có bờ trái: nước tràn ra ngoài
      const l = stack[stack.length - 1];
      total += (i - l - 1) * (Math.min(h[l], h[i]) - h[bottom]);
    }
    stack.push(i);
  }
  return total;
}

// SAI: max hai bên KHÔNG tính cột i và không chặn ở 0. Cột cao hơn hai bên cho ra nước âm.
function exclusiveNoClamp(h: number[]): number {
  let total = 0;
  for (let i = 1; i < h.length - 1; i++) {
    const left = Math.max(...h.slice(0, i)), right = Math.max(...h.slice(i + 1));
    total += Math.min(left, right) - h[i];
  }
  return total;
}

const cases: [number[], number][] = [
  [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1], 6], [[4, 2, 0, 3, 2, 5], 9], [[], 0], [[3], 0],
  [[1, 2, 3, 4], 0], [[5, 4, 1, 2], 1], [[2, 0, 2], 2], [[3, 0, 0, 2, 0, 4], 10],
];
for (const fn of [bruteForce, prefixMax, twoPointers, monotonicStack, exclusiveNoClamp]) {
  const bad = cases.filter(([h, w]) => fn(h) !== w).map(([h, w]) => `${JSON.stringify(h)} → ${fn(h)} (đúng ${w})`);
  console.log(`${fn.name.padEnd(16)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(" ") : ""}`);
}

let seed = 3;
const rand = () => (seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31;
const median = (f: () => void, runs: number) => {
  const ts: number[] = [];
  for (let k = 0; k < runs; k++) { const t = performance.now(); f(); ts.push(performance.now() - t); }
  return ts.sort((x, y) => x - y)[Math.floor(runs / 2)];
};
console.log("\nn          vét cạn  max tiền tố  hai con trỏ  ngăn xếp   (ms, trung vị; chiều cao 0..10⁵)");
for (const n of [5_000, 10_000, 20_000, 1_000_000]) {
  const h = Array.from({ length: n }, () => Math.floor(rand() * 100_001));
  const bf = n <= 20_000 ? median(() => bruteForce(h), 3).toFixed(1) : "—";
  console.log(`${String(n).padEnd(10)} ${bf.padStart(7)} ${median(() => prefixMax(h), 5).toFixed(2).padStart(12)} ${median(() => twoPointers(h), 5).toFixed(2).padStart(12)} ${median(() => monotonicStack(h), 5).toFixed(2).padStart(9)}`);
}
