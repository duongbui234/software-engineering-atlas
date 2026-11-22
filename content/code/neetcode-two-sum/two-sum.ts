// NC-03 Two Sum (LeetCode 1): vét cạn, hai con trỏ, hash map một lượt; bẫy sort; đo chi phí mỗi lần ghi Map.
// Chạy: node two-sum.ts

// Cách 1, vét cạn: thử mọi cặp i < j. O(n²).
function bruteForce(nums: number[], target: number): [number, number] | null {
  for (let i = 0; i < nums.length; i++)
    for (let j = i + 1; j < nums.length; j++)
      if (nums[i] + nums[j] === target) return [i, j];
  return null;
}

// Cách 2, sắp xếp + hai con trỏ: O(n log n). Phải sắp xếp CHỈ SỐ để còn trả về vị trí gốc.
function twoPointers(nums: number[], target: number): [number, number] | null {
  const idx = nums.map((_, i) => i).sort((a, b) => nums[a] - nums[b]);
  let l = 0, r = idx.length - 1;
  while (l < r) {
    const sum = nums[idx[l]] + nums[idx[r]];
    if (sum === target) return [Math.min(idx[l], idx[r]), Math.max(idx[l], idx[r])];
    if (sum < target) l++; else r--; // tổng nhỏ quá: tăng số bé; lớn quá: giảm số lớn
  }
  return null;
}

// Cách 3, hash map một lượt: với mỗi x, hỏi "đã gặp target - x chưa?" rồi mới ghi x. O(n).
function onePass(nums: number[], target: number): [number, number] | null {
  const seen = new Map<number, number>(); // giá trị → chỉ số
  for (let i = 0; i < nums.length; i++) {
    const j = seen.get(target - nums[i]);
    if (j !== undefined) return [j, i]; // hỏi TRƯỚC khi ghi: không bao giờ ghép x với chính nó
    seen.set(nums[i], i);
  }
  return null;
}

// Biến thể sai: ghi TRƯỚC rồi mới hỏi.
function onePassWrongOrder(nums: number[], target: number): [number, number] | null {
  const seen = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    seen.set(nums[i], i);
    const j = seen.get(target - nums[i]);
    if (j !== undefined) return [j, i];
  }
  return null;
}

const cases: [number[], number, [number, number]][] = [
  [[2, 7, 11, 15], 9, [0, 1]],
  [[3, 2, 4], 6, [1, 2]],
  [[3, 3], 6, [0, 1]],
  [[-3, 4, 3, 90], 0, [0, 2]],
  [[1_000_000_000, -999_999_999, 5], 1, [0, 1]],
];
const same = (a: [number, number] | null, b: [number, number]) => !!a && a[0] === b[0] && a[1] === b[1];
for (const fn of [bruteForce, twoPointers, onePass, onePassWrongOrder]) {
  const bad = cases.filter(([n, t, w]) => !same(fn(n, t), w));
  console.log(`${fn.name.padEnd(18)} ${cases.length - bad.length}/${cases.length} ca đúng` +
    (bad.length ? `; sai ở ${JSON.stringify(bad[0][0])}, target ${bad[0][1]} → ${JSON.stringify(fn(bad[0][0], bad[0][1]))}` : ''));
}

// ── bẫy: hai con trỏ trên mảng sắp xếp bằng sort() mặc định (so sánh chuỗi) ──
function pointersOn(sorted: number[], target: number): string {
  let l = 0, r = sorted.length - 1;
  while (l < r) {
    const s = sorted[l] + sorted[r];
    if (s === target) return `${sorted[l]} + ${sorted[r]}`;
    if (s < target) l++; else r--;
  }
  return 'không tìm thấy';
}
console.log(`\n[10, 9, 1, 100], target 11:`);
console.log(`  sort() mặc định → ${JSON.stringify([10, 9, 1, 100].sort())}: ${pointersOn([10, 9, 1, 100].sort(), 11)}`);
console.log(`  sort((a,b)=>a-b) → ${JSON.stringify([10, 9, 1, 100].sort((a, b) => a - b))}: ${pointersOn([10, 9, 1, 100].sort((a, b) => a - b), 11)}`);

// ── đo: chi phí trung bình mỗi lần Map.set gần như không đổi khi n tăng (O(1) khấu hao) ──
console.log('\nn            ns mỗi lần set   ns mỗi lần get');
for (const n of [1_000, 10_000, 100_000, 1_000_000, 4_000_000]) {
  const m = new Map<number, number>();
  let t0 = performance.now();
  for (let i = 0; i < n; i++) m.set(i * 2654435761 % 4294967296, i);
  const setNs = ((performance.now() - t0) * 1e6) / n;
  t0 = performance.now(); let hit = 0;
  for (let i = 0; i < n; i++) if (m.get(i * 2654435761 % 4294967296) !== undefined) hit++;
  const getNs = ((performance.now() - t0) * 1e6) / n;
  console.log(`${String(n).padEnd(12)} ${setNs.toFixed(1).padStart(14)}   ${getNs.toFixed(1).padStart(14)}`);
}

// ── đo: ba cách trên n = 20 000, cặp đúng nằm ở cuối ──
const n = 20_000;
const big = Array.from({ length: n }, (_, i) => i * 3);
const target = big[n - 2] + big[n - 1];
for (const fn of [bruteForce, twoPointers, onePass]) {
  const t0 = performance.now(); fn(big, target);
  console.log(`${fn.name.padEnd(12)} n = 20 000: ${(performance.now() - t0).toFixed(2).padStart(8)} ms`);
}
