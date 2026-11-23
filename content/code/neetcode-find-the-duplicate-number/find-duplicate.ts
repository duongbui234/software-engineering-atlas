// LC 287 Find the Duplicate Number: sắp xếp, Set, đánh dấu âm, tìm nhị phân trên giá trị, đếm bit, và rùa và thỏ (Floyd) trên đồ thị i → nums[i].
// Chạy: node find-duplicate.ts

// Cách 1: sắp xếp một bản sao, số trùng nằm cạnh nhau. Không sửa mảng gốc nhưng tốn O(n) bộ nhớ.
function sortCopy(nums: number[]): number {
  const a = [...nums].sort((x, y) => x - y);
  for (let i = 1; i < a.length; i++) if (a[i] === a[i - 1]) return a[i];
  return -1;
}

// Cách 2: Set các số đã gặp. O(n) thời gian, O(n) bộ nhớ.
function hashSet(nums: number[]): number {
  const seen = new Set<number>();
  for (const x of nums) {
    if (seen.has(x)) return x;
    seen.add(x);
  }
  return -1;
}

// Cách 3: đánh dấu âm. Gặp x thì lật dấu nums[x]; ô đã âm nghĩa là x đã gặp. O(1) bộ nhớ nhưng SỬA mảng gốc.
function markNegative(nums: number[]): number {
  for (const v of nums) {
    const x = Math.abs(v);
    if (nums[x] < 0) return x;
    nums[x] = -nums[x];
  }
  return -1;
}

// Cách 4: tìm nhị phân trên giá trị. cnt(m) = số phần tử ≤ m; cnt(m) > m đúng từ số trùng trở đi (nguyên lý chuồng bồ câu).
function binaryCount(nums: number[]): number {
  let lo = 1, hi = nums.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    let cnt = 0;
    for (const x of nums) if (x <= mid) cnt++;
    if (cnt > mid) hi = mid; else lo = mid + 1;
  }
  return lo;
}

// Cách 5: đếm từng bit. Bit b của số trùng bật khi trong nums có nhiều số bật bit b hơn trong 1..n.
function bitCount(nums: number[]): number {
  const n = nums.length - 1;
  let ans = 0;
  for (let b = 0; (1 << b) <= n; b++) {
    const mask = 1 << b;
    let inNums = 0, inRange = 0;
    for (const x of nums) if (x & mask) inNums++;
    for (let v = 1; v <= n; v++) if (v & mask) inRange++;
    if (inNums > inRange) ans |= mask;
  }
  return ans;
}

// Cách 6: rùa và thỏ trên đồ thị i → nums[i]. Xuất phát từ chỉ số 0 (không ô nào trỏ về 0, nên 0 nằm ngoài vòng).
// Pha 1 tìm một điểm trong vòng; pha 2 đưa một con về 0, cả hai đi 1 bước, chỗ gặp là đầu vòng, tức số trùng.
function floyd(nums: number[]): number {
  let slow = 0, fast = 0;
  do {
    slow = nums[slow];
    fast = nums[nums[fast]];
  } while (slow !== fast);
  let a = 0;
  while (a !== slow) {
    a = nums[a];
    slow = nums[slow];
  }
  return a;
}

// SAI: đếm số phần tử < mid thay vì ≤ mid. Vị từ lệch một đơn vị nên dừng sai chỗ.
function wrongCountLess(nums: number[]): number {
  let lo = 1, hi = nums.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    let cnt = 0;
    for (const x of nums) if (x < mid) cnt++;
    if (cnt > mid) hi = mid; else lo = mid + 1;
  }
  return lo;
}

// SAI: pha 2 đưa con trỏ về nums[0] thay vì về 0. Nó đi trước một bước, nên hai con chỉ gặp nhau khi vòng dài 1.
function wrongResetToFirst(nums: number[]): number {
  let slow = 0, fast = 0;
  do {
    slow = nums[slow];
    fast = nums[nums[fast]];
  } while (slow !== fast);
  let a = nums[0];
  let guard = 0;
  while (a !== slow && guard++ < 4 * nums.length) {
    a = nums[a];
    slow = nums[slow];
  }
  return a === slow ? a : -1;
}

// Đúng nhưng chậm: indexOf tìm lần xuất hiện đầu tiên; ô nào không phải lần đầu là số trùng. O(n²).
function viaIndexOf(nums: number[]): number {
  for (let i = 0; i < nums.length; i++) if (nums.indexOf(nums[i]) !== i) return nums[i];
  return -1;
}

const cases: [number[], number, string][] = [
  [[1, 3, 4, 2, 2], 2, "ví dụ 1 của đề"],
  [[3, 1, 3, 4, 2], 3, "ví dụ 2 của đề"],
  [[3, 3, 3, 3, 3], 3, "ví dụ 3 của đề"],
  [[1, 1], 1, "n = 1"],
  [[1, 1, 2], 1, "trùng ở đầu"],
  [[2, 2, 2, 2, 2], 2, "toàn số 2"],
  [[2, 5, 9, 6, 9, 3, 8, 9, 7, 1], 9, "trùng ba lần"],
  [[1, 4, 4, 2, 4], 4, "trùng 4 ba lần"],
  [[2, 1, 2], 2, "vòng tự trỏ"],
  [[4, 3, 1, 4, 2], 4, "trùng ở cuối"],
];

const solvers: [string, (a: number[]) => number][] = [
  ["sortCopy", sortCopy], ["hashSet", hashSet], ["markNegative", markNegative], ["binaryCount", binaryCount],
  ["bitCount", bitCount], ["floyd", floyd], ["viaIndexOf", viaIndexOf],
  ["wrongCountLess", wrongCountLess], ["wrongResetToFirst", wrongResetToFirst],
];
for (const [name, fn] of solvers) {
  const bad: string[] = [];
  for (const [nums, want, label] of cases) {
    const got = fn([...nums]);
    if (got !== want) bad.push(`${label} [${nums}] → ${got}`);
  }
  console.log(`${name.padEnd(18)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(", ") : ""}`);
}

// markNegative trả đúng nhưng để lại mảng đã bị sửa.
{
  const nums = [1, 3, 4, 2, 2];
  const got = markNegative(nums);
  console.log(`\nmarkNegative([1,3,4,2,2]) = ${got}; mảng sau khi gọi: [${nums}]`);
}

// ---- Bộ sinh ngẫu nhiên mulberry32 ----
function mulberry32(seed: number): () => number {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Dựng một đầu vào hợp lệ: n + 1 số trong [1, n], đúng một giá trị d xuất hiện k ≥ 2 lần, các giá trị khác tối đa một lần.
function makeInput(n: number, k: number, rand: () => number): { nums: number[]; d: number } {
  const perm = Array.from({ length: n }, (_, i) => i + 1);
  for (let i = n - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [perm[i], perm[j]] = [perm[j], perm[i]]; }
  const d = perm[0];
  const nums = [d, ...perm]; // d hai lần, n − 1 số khác mỗi số một lần
  // Thay thêm k − 2 số khác bằng d (số bị thay biến mất khỏi mảng, vẫn hợp lệ).
  for (let r = 0, i = 2; r < k - 2 && i < nums.length; r++, i++) nums[i] = d;
  for (let i = nums.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [nums[i], nums[j]] = [nums[j], nums[i]]; }
  return { nums, d };
}

// Vét cạn: mọi mảng độ dài n + 1 trên [1, n] có đúng một giá trị lặp (n ≤ 6).
{
  let total = 0;
  const wrong: Record<string, number> = {};
  for (let n = 1; n <= 6; n++) {
    const len = n + 1;
    const a = new Array(len).fill(1);
    const counts = new Array(n + 1).fill(0);
    for (let code = 0; code < n ** len; code++) {
      let c = code;
      counts.fill(0);
      for (let i = 0; i < len; i++) { a[i] = (c % n) + 1; c = Math.floor(c / n); counts[a[i]]++; }
      let dups = 0, d = -1;
      for (let v = 1; v <= n; v++) if (counts[v] >= 2) { dups++; d = v; }
      if (dups !== 1) continue;
      total++;
      for (const [name, fn] of solvers) if (fn([...a]) !== d) wrong[name] = (wrong[name] ?? 0) + 1;
    }
  }
  const list = solvers.map(([name]) => `${name} ${wrong[name] ?? 0}`).join(", ");
  console.log(`vét cạn n = 1..6: ${total} mảng hợp lệ; số mảng sai: ${list}`);
}

// Ngẫu nhiên: 2 000 mảng, n tới 2 000, số lần lặp k tới n + 1.
{
  const rand = mulberry32(287);
  const T = 2000;
  const wrong: Record<string, number> = {};
  for (let t = 0; t < T; t++) {
    const n = 1 + Math.floor(rand() * 2000);
    const k = 2 + Math.floor(rand() * Math.min(n, rand() < 0.8 ? 3 : n));
    const { nums, d } = makeInput(n, k, rand);
    for (const [name, fn] of solvers) {
      if (name === "viaIndexOf") continue;
      if (fn([...nums]) !== d) wrong[name] = (wrong[name] ?? 0) + 1;
    }
  }
  const list = solvers.filter(([n]) => n !== "viaIndexOf").map(([name]) => `${name} ${wrong[name] ?? 0}`).join(", ");
  console.log(`ngẫu nhiên ${T} mảng (n ≤ 2000): số mảng sai: ${list}`);
}

// Độ dài đường đi trên đồ thị i → nums[i]: đuôi μ (từ 0 tới đầu vòng) và vòng λ.
function tailAndCycle(nums: number[]): { mu: number; lam: number } {
  const seen = new Map<number, number>();
  let x = 0, step = 0;
  while (!seen.has(x)) { seen.set(x, step++); x = nums[x]; }
  return { mu: seen.get(x)!, lam: step - seen.get(x)! };
}

function median(xs: number[]): number { const s = [...xs].sort((a, b) => a - b); return s[s.length >> 1]; }
function time(fn: () => void, reps = 5): number {
  const ts: number[] = [];
  for (let r = 0; r < reps; r++) { const t0 = performance.now(); fn(); ts.push(performance.now() - t0); }
  return median(ts);
}

// Đo: n = 10⁵ và 10⁶, số trùng xuất hiện 2 lần, mảng xáo ngẫu nhiên.
{
  const rand = mulberry32(2870);
  console.log("\nn          μ        λ      sortCopy   hashSet  markNeg  binaryCnt  bitCount    floyd   (ms, trung vị 5 lần)");
  for (const n of [100_000, 1_000_000]) {
    const { nums } = makeInput(n, 2, rand);
    const { mu, lam } = tailAndCycle(nums);
    const r = [
      time(() => sortCopy(nums)),
      time(() => hashSet(nums)),
      time(() => markNegative([...nums])),
      time(() => binaryCount(nums)),
      time(() => bitCount(nums)),
      time(() => floyd(nums)),
    ];
    console.log(`${String(n).padEnd(10)} ${String(mu).padStart(6)} ${String(lam).padStart(8)}  ${r.map((x) => x.toFixed(2).padStart(9)).join(" ")}`);
  }
  // Riêng markNegative có tính cả thời gian chép mảng; đo phần chép để trừ ra.
  const { nums } = makeInput(1_000_000, 2, rand);
  console.log(`chép mảng 10⁶ phần tử: ${time(() => [...nums]).toFixed(2)} ms (đã nằm trong cột markNeg)`);
}

// Đo: viaIndexOf là O(n²) khi số trùng nằm cuối mảng.
{
  console.log("\nn        viaIndexOf  floyd   (số trùng ở hai ô cuối, ms)");
  for (const n of [10_000, 20_000, 40_000]) {
    const nums = Array.from({ length: n }, (_, i) => i + 1);
    nums.push(n); // [1, 2, …, n, n]
    console.log(`${String(n).padEnd(8)} ${time(() => viaIndexOf(nums), 3).toFixed(1).padStart(10)} ${time(() => floyd(nums), 3).toFixed(3).padStart(7)}`);
  }
}

// Đo: cùng một hình dạng (đuôi μ = n − 1, vòng λ = 1), chỉ khác thứ tự các ô trong bộ nhớ.
// Tuần tự: 0 → 1 → 2 → … → n, rồi n tự trỏ. Ngẫu nhiên: cũng một chuỗi n bước nhưng các ô nhảy khắp mảng.
{
  const rand = mulberry32(28701);
  console.log("\nn          floyd tuần tự   floyd ngẫu nhiên   binaryCount   (μ = n − 1, λ = 1, ms)");
  for (const n of [1_000_000, 4_000_000]) {
    const seq = Array.from({ length: n + 1 }, (_, i) => Math.min(i + 1, n)); // [1, 2, …, n, n]
    const order = Array.from({ length: n }, (_, i) => i + 1);
    for (let i = n - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
    const rnd = new Array(n + 1);
    let prev = 0;
    for (const v of order) { rnd[prev] = v; prev = v; }
    rnd[prev] = prev; // ô cuối của chuỗi tự trỏ: đầu vòng là prev, xuất hiện hai lần
    const a = floyd(seq), b = floyd(rnd);
    if (a !== n || b !== prev) throw new Error("sai đáp án");
    console.log(`${String(n).padEnd(10)} ${time(() => floyd(seq)).toFixed(2).padStart(13)} ${time(() => floyd(rnd)).toFixed(2).padStart(18)} ${time(() => binaryCount(rnd)).toFixed(2).padStart(13)}`);
  }
}
