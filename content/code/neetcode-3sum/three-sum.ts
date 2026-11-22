// LeetCode 15, 3Sum: ba cách, hai bản sai, test và đo.
// Chạy: node three-sum.ts

// Vét cạn: thử mọi bộ ba, lọc trùng bằng một Set khóa chuỗi. O(n³).
function bruteForce(nums: number[]): number[][] {
  const seen = new Set<string>(), out: number[][] = [];
  for (let i = 0; i < nums.length; i++)
    for (let j = i + 1; j < nums.length; j++)
      for (let k = j + 1; k < nums.length; k++)
        if (nums[i] + nums[j] + nums[k] === 0) {
          const t = [nums[i], nums[j], nums[k]].sort((a, b) => a - b);
          const key = t.join(",");
          if (!seen.has(key)) { seen.add(key); out.push(t); }
        }
  return out;
}

// Cố định nums[i], tìm cặp còn lại bằng hash set (khuôn ga 1). O(n²), vẫn cần Set để lọc trùng.
function hashPerAnchor(nums: number[]): number[][] {
  const seen = new Set<string>(), out: number[][] = [];
  for (let i = 0; i < nums.length; i++) {
    const met = new Set<number>();
    for (let j = i + 1; j < nums.length; j++) {
      const need = -nums[i] - nums[j];
      if (met.has(need)) {
        const t = [nums[i], nums[j], need].sort((a, b) => a - b);
        const key = t.join(",");
        if (!seen.has(key)) { seen.add(key); out.push(t); }
      }
      met.add(nums[j]);
    }
  }
  return out;
}

// Sắp xếp + hai con trỏ: cố định a = nums[i], tìm b + c = −a trên đoạn bên phải. Bỏ trùng bằng cách nhảy qua giá trị lặp.
function sortTwoPointers(nums: number[]): number[][] {
  const a = [...nums].sort((x, y) => x - y), out: number[][] = [];
  for (let i = 0; i < a.length - 2; i++) {
    if (a[i] > 0) break; // số nhỏ nhất đã dương thì tổng ba số không thể bằng 0
    if (i > 0 && a[i] === a[i - 1]) continue; // cùng giá trị neo: mọi bộ ba đã được tìm ở lần trước
    let lo = i + 1, hi = a.length - 1;
    while (lo < hi) {
      const s = a[i] + a[lo] + a[hi];
      if (s < 0) lo++;
      else if (s > 0) hi--;
      else {
        out.push([a[i], a[lo], a[hi]]);
        lo++; hi--;
        while (lo < hi && a[lo] === a[lo - 1]) lo++; // nhảy qua b trùng
      }
    }
  }
  return out;
}

// SAI 1: không bỏ trùng. Cùng một bộ ba xuất hiện nhiều lần.
function noDuplicateSkip(nums: number[]): number[][] {
  const a = [...nums].sort((x, y) => x - y), out: number[][] = [];
  for (let i = 0; i < a.length - 2; i++) {
    let lo = i + 1, hi = a.length - 1;
    while (lo < hi) {
      const s = a[i] + a[lo] + a[hi];
      if (s < 0) lo++;
      else if (s > 0) hi--;
      else { out.push([a[i], a[lo], a[hi]]); lo++; hi--; }
    }
  }
  return out;
}

// SAI 2: sort() không có hàm so sánh, so số như chuỗi: [-1, -4, 2, 10] thành [-1, -4, 10, 2].
function noComparator(nums: number[]): number[][] {
  const a = [...nums].sort(), out: number[][] = [];
  for (let i = 0; i < a.length - 2; i++) {
    if (i > 0 && a[i] === a[i - 1]) continue;
    let lo = i + 1, hi = a.length - 1;
    while (lo < hi) {
      const s = a[i] + a[lo] + a[hi];
      if (s < 0) lo++;
      else if (s > 0) hi--;
      else { out.push([a[i], a[lo], a[hi]]); lo++; hi--; while (lo < hi && a[lo] === a[lo - 1]) lo++; }
    }
  }
  return out;
}

const norm = (r: number[][]) => r.map((t) => [...t].sort((x, y) => x - y).join(",")).sort().join(" | ");
const cases: [number[], number[][]][] = [
  [[-1, 0, 1, 2, -1, -4], [[-1, -1, 2], [-1, 0, 1]]], [[0, 1, 1], []], [[0, 0, 0], [[0, 0, 0]]],
  [[0, 0, 0, 0], [[0, 0, 0]]], [[-2, 0, 1, 1, 2], [[-2, 0, 2], [-2, 1, 1]]], [[-4, -2, -2, -2, 0, 1, 2, 2, 2, 3, 3, 4, 4, 6, 6], [[-4, -2, 6], [-4, 0, 4], [-4, 1, 3], [-4, 2, 2], [-2, -2, 4], [-2, 0, 2]]],
  [[-10, 5, 5, -1, 11, -1], [[-10, -1, 11], [-10, 5, 5]]],
];
for (const fn of [bruteForce, hashPerAnchor, sortTwoPointers, noDuplicateSkip, noComparator]) {
  const bad = cases.filter(([n, w]) => norm(fn(n)) !== norm(w)).map(([n]) => JSON.stringify(n));
  console.log(`${fn.name.padEnd(16)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(" ") : ""}`);
}
console.log(`\nnoDuplicateSkip([0, 0, 0, 0]) = ${JSON.stringify(noDuplicateSkip([0, 0, 0, 0]))}`);
console.log(`[-1, -4, 2, 10].sort() = ${JSON.stringify([-1, -4, 2, 10].sort())}`);

// Đo: n số nguyên ngẫu nhiên trong −10⁵..10⁵ (giới hạn của đề), n tới 3000.
let seed = 42;
const rand = () => (seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31;
const median = (f: () => void, runs: number) => {
  const ts: number[] = [];
  for (let k = 0; k < runs; k++) { const t = performance.now(); f(); ts.push(performance.now() - t); }
  return ts.sort((x, y) => x - y)[Math.floor(runs / 2)];
};
console.log("\nn        vét cạn  hash theo neo  sắp xếp + hai con trỏ   (ms, trung vị)");
for (const n of [250, 500, 1000, 3000]) {
  const a = Array.from({ length: n }, () => Math.floor(rand() * 200_001) - 100_000);
  const bf = n <= 1000 ? median(() => bruteForce(a), 3).toFixed(1) : "—";
  console.log(`${String(n).padEnd(8)} ${bf.padStart(7)} ${median(() => hashPerAnchor(a), 3).toFixed(1).padStart(14)} ${median(() => sortTwoPointers(a), 5).toFixed(2).padStart(22)}`);
}
