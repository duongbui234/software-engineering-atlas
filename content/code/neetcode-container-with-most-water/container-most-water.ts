// LeetCode 11, Container With Most Water: hai cách, một bản sai, test và đo.
// Chạy: node container-most-water.ts

function bruteForce(h: number[]): number {
  let best = 0;
  for (let i = 0; i < h.length; i++)
    for (let j = i + 1; j < h.length; j++) best = Math.max(best, (j - i) * Math.min(h[i], h[j]));
  return best;
}

// Hai con trỏ: luôn dời cột THẤP hơn vào trong.
function twoPointers(h: number[]): number {
  let i = 0, j = h.length - 1, best = 0;
  while (i < j) {
    best = Math.max(best, (j - i) * Math.min(h[i], h[j]));
    // Cột thấp quyết định mực nước. Ghép cột thấp với bất kỳ cột nào gần hơn thì đáy hẹp đi
    // mà mực nước không vượt được nó: mọi cặp đó không thể tốt hơn. Bỏ hẳn cột thấp.
    if (h[i] < h[j]) i++; else j--;
  }
  return best;
}

// SAI: dời cột CAO hơn. Giữ lại cột thấp, tức giữ lại chính thứ đang giới hạn mực nước.
function moveTaller(h: number[]): number {
  let i = 0, j = h.length - 1, best = 0;
  while (i < j) {
    best = Math.max(best, (j - i) * Math.min(h[i], h[j]));
    if (h[i] > h[j]) i++; else j--;
  }
  return best;
}

const cases: [number[], number][] = [
  [[1, 8, 6, 2, 5, 4, 8, 3, 7], 49], [[1, 1], 1], [[4, 3, 2, 1, 4], 16], [[1, 2, 1], 2],
  [[2, 3, 4, 5, 18, 17, 6], 17], [[0, 0, 0], 0], [[1, 3, 2, 5, 25, 24, 5], 24],
];
for (const fn of [bruteForce, twoPointers, moveTaller]) {
  const bad = cases.filter(([h, w]) => fn(h) !== w).map(([h, w]) => `${JSON.stringify(h)} → ${fn(h)} (đúng ${w})`);
  console.log(`${fn.name.padEnd(12)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(" ") : ""}`);
}

let seed = 1;
const rand = () => (seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31;
const median = (f: () => void, runs: number) => {
  const ts: number[] = [];
  for (let k = 0; k < runs; k++) { const t = performance.now(); f(); ts.push(performance.now() - t); }
  return ts.sort((x, y) => x - y)[Math.floor(runs / 2)];
};
console.log("\nn          vét cạn   hai con trỏ   (ms, trung vị; chiều cao ngẫu nhiên 0..10⁴)");
for (const n of [5_000, 10_000, 20_000, 100_000, 1_000_000]) {
  const h = Array.from({ length: n }, () => Math.floor(rand() * 10_001));
  const bf = n <= 20_000 ? median(() => bruteForce(h), 3).toFixed(1) : "—";
  console.log(`${String(n).padEnd(10)} ${bf.padStart(7)} ${median(() => twoPointers(h), 5).toFixed(2).padStart(13)}`);
}
