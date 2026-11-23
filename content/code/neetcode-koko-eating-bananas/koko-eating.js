// LeetCode 875, Koko Eating Bananas: tìm nhị phân trên đáp án, và Math.ceil(p / k) có an toàn không.
// Chạy: node koko-eating.js

// Hai cách tính ⌈p / k⌉: qua số thực (Math.ceil) hoặc chỉ bằng số nguyên.
const ceilFloat = (p, k) => Math.ceil(p / k);
const ceilInt = (p, k) => Math.floor((p + k - 1) / k);

function hoursNeeded(piles, k) {
  let hours = 0;
  for (const p of piles) hours += ceilInt(p, k);
  return hours;
}

function minEatingSpeed(piles, h) {
  let lo = 1, hi = Math.max(...piles);
  while (lo < hi) { // bất biến: hi luôn kịp, mọi tốc độ < lo đều trễ
    const mid = (lo + hi) >>> 1;
    if (hoursNeeded(piles, mid) <= h) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}

const cases = [
  [[3, 6, 7, 11], 8, 4], [[30, 11, 23, 4, 20], 5, 30], [[30, 11, 23, 4, 20], 6, 23],
  [[1], 1, 1], [[1, 1], 5, 1], [[1000000000], 2, 500000000], [[312884470], 312884469, 2],
  [[805306368, 805306368, 805306368], 1000000000, 3], [[2, 2], 2, 2], [[7], 3, 3],
];
const bad = cases.filter(([p, h, want]) => minEatingSpeed(p, h) !== want);
console.log(`minEatingSpeed  ${cases.length - bad.length}/${cases.length} ca đúng`);

// p và k tới 10⁹ (giới hạn của đề): p / k là double làm tròn đúng, nên Math.ceil không bao giờ lệch.
// Kiểm 10⁶ cặp ngẫu nhiên, nửa số cặp có p chia hết cho k.
let seed = 7, diff = 0;
const rand = () => (seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31;
for (let t = 0; t < 1_000_000; t++) {
  const k = 1 + Math.floor(rand() * 1e9);
  const p = t % 2 ? k * Math.floor(1 + rand() * (1e9 / k)) : 1 + Math.floor(rand() * 1e9);
  if (ceilFloat(p, k) !== ceilInt(p, k)) diff++;
}
console.log(`Math.ceil(p / k) lệch cách số nguyên ở ${diff}/1000000 cặp (p, k <= 10⁹)`);
// Vượt 2⁵³ thì chính p đã không biểu diễn đúng được: 2⁵³ + 1 thành 2⁵³.
console.log(`2 ** 53 + 1 = ${2 ** 53 + 1}`);
