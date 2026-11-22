// LeetCode 121, Best Time to Buy and Sell Stock: ba cách, một bản sai, test và đo.
// Chạy: node best-time-stock.ts

// Cách 1, vét cạn: thử mọi cặp (ngày mua i, ngày bán j > i).
function bruteForce(prices: number[]): number {
  let best = 0;
  for (let i = 0; i < prices.length; i++)
    for (let j = i + 1; j < prices.length; j++) best = Math.max(best, prices[j] - prices[i]);
  return best;
}

// SAI: lấy giá cao nhất trừ giá thấp nhất, bỏ qua thứ tự ngày (bán trước khi mua).
function maxMinusMin(prices: number[]): number {
  return Math.max(...prices) - Math.min(...prices);
}

// Cách 2, giá thấp nhất từ trước tới nay: mỗi ngày hỏi "nếu bán hôm nay thì lời bao nhiêu?".
function runningMin(prices: number[]): number {
  let minSoFar = Infinity, best = 0;
  for (const p of prices) {
    best = Math.max(best, p - minSoFar); // bán hôm nay, mua ở ngày rẻ nhất TRƯỚC đó
    minSoFar = Math.min(minSoFar, p);
  }
  return best;
}

// Cách 3, hai con trỏ (cửa sổ trượt): left là ngày mua, right là ngày bán; gặp giá rẻ hơn thì dời left tới đó.
function twoPointers(prices: number[]): number {
  let left = 0, best = 0;
  for (let right = 1; right < prices.length; right++) {
    if (prices[right] < prices[left]) left = right; // cửa sổ cũ không thể cho lời hơn khi mua ở đây
    else best = Math.max(best, prices[right] - prices[left]);
  }
  return best;
}

const cases: [number[], number][] = [
  [[7, 1, 5, 3, 6, 4], 5], [[7, 6, 4, 3, 1], 0], [[2, 4, 1], 2], [[1], 0], [[3, 3, 3], 0], [[2, 1, 2, 1, 0, 1, 2], 2],
];
for (const fn of [bruteForce, maxMinusMin, runningMin, twoPointers]) {
  const bad = cases.filter(([p, want]) => fn(p) !== want);
  console.log(`${fn.name.padEnd(12)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.map(([p]) => JSON.stringify(p) + " → " + fn(p)).join(" ") : ""}`);
}

// Đo trên giá ngẫu nhiên 0..10⁴.
const rand = (() => { let s = 11; return () => (s = (s * 1103515245 + 12345) % 2 ** 31) / 2 ** 31; })();
const make = (n: number) => Array.from({ length: n }, () => Math.floor(rand() * 10_001));
const time = (fn: (a: number[]) => number, a: number[], runs: number) => {
  const ts: number[] = [];
  for (let k = 0; k < runs; k++) { const t = performance.now(); fn(a); ts.push(performance.now() - t); }
  return ts.sort((x, y) => x - y)[Math.floor(runs / 2)];
};
console.log("\nn          vét cạn   giá thấp nhất   hai con trỏ   (ms, trung vị)");
for (const n of [5_000, 10_000, 20_000, 40_000, 1_000_000]) {
  const a = make(n);
  const bf = n <= 40_000 ? time(bruteForce, a, 3).toFixed(1) : "—";
  console.log(`${String(n).padEnd(10)} ${bf.padStart(8)} ${time(runningMin, a, 5).toFixed(2).padStart(15)} ${time(twoPointers, a, 5).toFixed(2).padStart(13)}`);
}
