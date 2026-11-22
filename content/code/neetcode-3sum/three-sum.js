// LeetCode 15, 3Sum: ba cách và test.
// Chạy: node three-sum.js

function bruteForce(nums) {
  const seen = new Set(), out = [];
  for (let i = 0; i < nums.length; i++)
    for (let j = i + 1; j < nums.length; j++)
      for (let k = j + 1; k < nums.length; k++)
        if (nums[i] + nums[j] + nums[k] === 0) {
          const t = [nums[i], nums[j], nums[k]].sort((a, b) => a - b);
          const key = t.join(","); // Set so mảng theo tham chiếu, nên khóa phải là chuỗi
          if (!seen.has(key)) { seen.add(key); out.push(t); }
        }
  return out;
}

function hashPerAnchor(nums) {
  const seen = new Set(), out = [];
  for (let i = 0; i < nums.length; i++) {
    const met = new Set();
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

function sortTwoPointers(nums) {
  const a = [...nums].sort((x, y) => x - y), out = [];
  for (let i = 0; i < a.length - 2; i++) {
    if (a[i] > 0) break;
    if (i > 0 && a[i] === a[i - 1]) continue;
    let lo = i + 1, hi = a.length - 1;
    while (lo < hi) {
      const s = a[i] + a[lo] + a[hi];
      if (s < 0) lo++;
      else if (s > 0) hi--;
      else {
        out.push([a[i], a[lo], a[hi]]);
        lo++; hi--;
        while (lo < hi && a[lo] === a[lo - 1]) lo++;
      }
    }
  }
  return out;
}

const norm = (r) => r.map((t) => [...t].sort((x, y) => x - y).join(",")).sort().join(" | ");
const cases = [
  [[-1, 0, 1, 2, -1, -4], [[-1, -1, 2], [-1, 0, 1]]], [[0, 1, 1], []], [[0, 0, 0], [[0, 0, 0]]],
  [[0, 0, 0, 0], [[0, 0, 0]]], [[-2, 0, 1, 1, 2], [[-2, 0, 2], [-2, 1, 1]]],
  [[-4, -2, -2, -2, 0, 1, 2, 2, 2, 3, 3, 4, 4, 6, 6], [[-4, -2, 6], [-4, 0, 4], [-4, 1, 3], [-4, 2, 2], [-2, -2, 4], [-2, 0, 2]]],
  [[-10, 5, 5, -1, 11, -1], [[-10, -1, 11], [-10, 5, 5]]],
];
for (const fn of [bruteForce, hashPerAnchor, sortTwoPointers]) {
  const ok = cases.filter(([n, w]) => norm(fn(n)) === norm(w)).length;
  console.log(`${fn.name.padEnd(16)} ${ok}/${cases.length} ca đúng`);
}
