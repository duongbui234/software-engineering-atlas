// LeetCode 875, Koko Eating Bananas: thử tốc độ lần lượt, tìm nhị phân trên đáp án, ba bản sai và phép đo.
// Chạy: node koko-eating.ts

// Số giờ để ăn hết với tốc độ k: mỗi đống mất ⌈p / k⌉ giờ. Chia làm tròn lên bằng số nguyên.
function hoursNeeded(piles: number[], k: number): number {
  let hours = 0;
  for (const p of piles) hours += Math.floor((p + k - 1) / k);
  return hours;
}

// Thử k = 1, 2, 3… tới tốc độ đầu tiên kịp giờ. Đúng, nhưng O(max(piles) · n).
function linearScan(piles: number[], h: number): number {
  let k = 1;
  while (hoursNeeded(piles, k) > h) k++;
  return k;
}

// Tìm nhị phân trên đáp án: "ăn tốc độ k có kịp không?" sai rồi đúng đúng một lần khi k tăng.
// Bất biến: hi luôn kịp; mọi tốc độ nhỏ hơn lo đều không kịp. Khoảng [lo, hi] thu về một ô.
function minEatingSpeed(piles: number[], h: number): number {
  let lo = 1, hi = Math.max(...piles); // tốc độ max(piles) ăn mỗi đống trong 1 giờ, luôn kịp vì h >= n
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (hoursNeeded(piles, mid) <= h) hi = mid; // mid kịp: có thể chính là đáp án, giữ lại
    else lo = mid + 1; // mid không kịp: mọi tốc độ <= mid đều không kịp
  }
  return lo;
}

// SAI 1: chia làm tròn xuống. Đống 7 chuối với k = 4 tính 1 giờ thay vì 2, nên tốc độ quá chậm cũng "kịp".
function wrongFloorDiv(piles: number[], h: number): number {
  let lo = 1, hi = Math.max(...piles);
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    let hours = 0;
    for (const p of piles) hours += Math.floor(p / mid);
    if (hours <= h) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}

// SAI 2: mid kịp thì gán hi = mid - 1, bỏ luôn ô có thể là đáp án.
function wrongDropMid(piles: number[], h: number): number {
  let lo = 1, hi = Math.max(...piles);
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (hoursNeeded(piles, mid) <= h) hi = mid - 1;
    else lo = mid + 1;
  }
  return lo;
}

// SAI 3 (trông vô hại trong JS): lo = 0. Khi khoảng còn [0, 1], mid = 0 và p / 0 = Infinity.
// JS không ném lỗi: Infinity > h nên lo = 1, kết quả vẫn đúng. Python và Java thì ném lỗi chia cho 0.
function loFromZero(piles: number[], h: number): number {
  let lo = 0, hi = Math.max(...piles);
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (hoursNeeded(piles, mid) <= h) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}

const cases: [number[], number, number][] = [
  [[3, 6, 7, 11], 8, 4], [[30, 11, 23, 4, 20], 5, 30], [[30, 11, 23, 4, 20], 6, 23],
  [[1], 1, 1], [[1, 1], 5, 1], [[1000000000], 2, 500000000], [[312884470], 312884469, 2],
  [[805306368, 805306368, 805306368], 1000000000, 3], [[2, 2], 2, 2], [[7], 3, 3],
];
for (const fn of [linearScan, minEatingSpeed, wrongFloorDiv, wrongDropMid, loFromZero]) {
  const bad: string[] = [];
  for (const [piles, h, want] of cases) {
    if (fn === linearScan && want > 1000) continue; // thử từng tốc độ tới 5·10⁸ thì quá lâu
    const got = fn(piles, h);
    if (got !== want) bad.push(`${JSON.stringify(piles)} h=${h} → ${got}`);
  }
  const n = fn === linearScan ? cases.filter((c) => c[2] <= 1000).length : cases.length;
  console.log(`${fn.name.padEnd(15)} ${n - bad.length}/${n} ca đúng${bad.length ? "; sai ở " + bad.join(", ") : ""}`);
}

// Kiểm ngẫu nhiên: so tìm nhị phân với thử lần lượt trên 2 000 bộ nhỏ.
let seed = 7;
const rand = () => (seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31;
let agree = 0;
for (let t = 0; t < 2000; t++) {
  const n = 1 + Math.floor(rand() * 8);
  const piles = Array.from({ length: n }, () => 1 + Math.floor(rand() * 50));
  const h = n + Math.floor(rand() * 40);
  if (minEatingSpeed(piles, h) === linearScan(piles, h)) agree++;
}
console.log(`\nngẫu nhiên: tìm nhị phân khớp thử lần lượt ở ${agree}/2000 bộ`);

// Số lần gọi hàm kiểm tra cho ví dụ của đề.
let calls = 0;
const traced = (piles: number[], h: number) => {
  let lo = 1, hi = Math.max(...piles);
  const steps: string[] = [];
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    const hrs = hoursNeeded(piles, mid); calls++;
    steps.push(`k=${mid}: ${hrs} giờ ${hrs <= h ? "kịp" : "trễ"}`);
    if (hrs <= h) hi = mid; else lo = mid + 1;
  }
  return { k: lo, steps };
};
const tr = traced([3, 6, 7, 11], 8);
console.log(`[3,6,7,11] h=8: ${tr.steps.join(" → ")} → đáp án ${tr.k} (${calls} lần kiểm tra)`);

// Đo: n = 1 000 đống, mỗi đống tới 10⁵ chuối, h = 2n. Trung vị 5 lần chạy.
let sink = 0;
const median = (xs: number[]) => xs.sort((a, b) => a - b)[Math.floor(xs.length / 2)];
const time = (f: () => number) => { const t0 = performance.now(); sink += f(); return performance.now() - t0; };
console.log("\nmax đống    đáp án    thử lần lượt   tìm nhị phân   (ms, n = 1 000, h = 2n, trung vị 5 lần)");
for (const maxP of [1_000, 10_000, 100_000, 1_000_000_000]) {
  const piles = Array.from({ length: 1000 }, () => 1 + Math.floor(rand() * maxP));
  const h = 2000, k = minEatingSpeed(piles, h);
  const lin = maxP <= 100_000 ? median(Array.from({ length: 5 }, () => time(() => linearScan(piles, h)))).toFixed(1) : "—";
  const bin = median(Array.from({ length: 5 }, () => time(() => minEatingSpeed(piles, h)))).toFixed(3);
  console.log(`${String(maxP).padEnd(11)} ${String(k).padEnd(9)} ${lin.padStart(12)} ${bin.padStart(14)}`);
}
if (sink === 0.5) console.log(sink);
