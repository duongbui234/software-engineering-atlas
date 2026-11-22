// NC-01 Contains Duplicate (LeetCode 217): bốn cách giải, test và phép đo.
// Chạy: node contains-duplicate.ts   (Node 22.6+ tự bỏ kiểu TypeScript)

// Cách 1, vét cạn: so mọi cặp. O(n²) thời gian, O(1) bộ nhớ.
function bruteForce(nums: number[]): boolean {
  for (let i = 0; i < nums.length; i++)
    for (let j = i + 1; j < nums.length; j++)
      if (nums[i] === nums[j]) return true;
  return false;
}

// Cách 2, sắp xếp rồi quét: số trùng nằm cạnh nhau. O(n log n), O(n) vì sao chép mảng.
function sortThenScan(nums: number[]): boolean {
  const a = [...nums].sort((x, y) => x - y); // so sánh số; mặc định JS so sánh chuỗi
  for (let i = 1; i < a.length; i++) if (a[i] === a[i - 1]) return true;
  return false;
}

// Cách 3, sổ đã thấy (hash set): O(n) trung bình, O(n) bộ nhớ, dừng sớm khi gặp trùng.
function hashSet(nums: number[]): boolean {
  const seen = new Set<number>();
  for (const x of nums) {
    if (seen.has(x)) return true;
    seen.add(x);
  }
  return false;
}

// Cách 4, một dòng: gọn, nhưng luôn đọc hết mảng và dựng cả Set.
const setSize = (nums: number[]): boolean => new Set(nums).size !== nums.length;

// ── test ─────────────────────────────────────────────────────────────────────
const cases: [number[], boolean][] = [
  [[1, 2, 3, 1], true],
  [[1, 2, 3, 4], false],
  [[1, 1, 1, 3, 3, 4, 3, 2, 4, 2], true],
  [[], false],
  [[7], false],
  [[-1_000_000_000, 1_000_000_000, -1_000_000_000], true],
];
const solutions = { bruteForce, sortThenScan, hashSet, setSize };
let failed = 0;
for (const [name, fn] of Object.entries(solutions))
  for (const [input, want] of cases)
    if (fn(input) !== want) { failed++; console.log(`SAI ${name}(${JSON.stringify(input)})`); }
console.log(`test: ${Object.keys(solutions).length} cách × ${cases.length} ca, ${failed} ca sai\n`);

// ── bẫy: sort() mặc định của JS so sánh theo chuỗi ──────────────────────────
console.log('[10, 9, 1, 100].sort()           →', JSON.stringify([10, 9, 1, 100].sort()));
console.log('[10, 9, 1, 100].sort((a,b)=>a-b) →', JSON.stringify([10, 9, 1, 100].sort((a, b) => a - b)));
console.log('Set coi NaN bằng NaN:', new Set([NaN, NaN]).size === 1, '| NaN === NaN:', NaN === NaN, '\n');

// ── đo: mảng không có số trùng (ca tệ nhất, không ai dừng sớm) ──────────────
function distinct(n: number): number[] {
  const a = Array.from({ length: n }, (_, i) => i * 7 - n); // n số khác nhau
  for (let i = n - 1; i > 0; i--) { const j = (i * 2654435761) % (i + 1); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
function ms(fn: () => unknown, runs = 5): number {
  const t: number[] = [];
  for (let r = 0; r < runs; r++) { const s = performance.now(); fn(); t.push(performance.now() - s); }
  return t.sort((x, y) => x - y)[Math.floor(runs / 2)]; // trung vị
}
const fmt = (x: number | null) => (x === null ? '       –' : `${x.toFixed(2).padStart(8)}`);
console.log('n           vét cạn   sắp xếp  hash set   một dòng   (ms, trung vị 5 lần)');
for (const n of [1_000, 10_000, 100_000, 1_000_000]) {
  const a = distinct(n);
  const row = [n <= 10_000 ? ms(() => bruteForce(a), 3) : null, ms(() => sortThenScan(a)), ms(() => hashSet(a)), ms(() => setSize(a))];
  console.log(`${String(n).padEnd(10)}${row.map(fmt).join('  ')}`);
}

// Có số trùng ngay đầu mảng: hash set dừng sau 2 phần tử, sắp xếp vẫn phải sắp cả mảng.
const early = distinct(1_000_000); early[1] = early[0];
console.log(`\ntrùng ở vị trí 0 và 1, n = 1 000 000: sắp xếp ${ms(() => sortThenScan(early)).toFixed(2)} ms, hash set ${ms(() => hashSet(early)).toFixed(3)} ms, một dòng ${ms(() => setSize(early)).toFixed(2)} ms`);
