// LeetCode 215, Kth Largest Element in an Array: sắp xếp, min-heap k phần tử, quickselect (ba kiểu phân hoạch),
// đếm theo giá trị, hai bản sai, đối chiếu ngẫu nhiên và phép đo trên ba dạng input.
// Chạy: node kth-largest.ts

// Phần tử lớn thứ k là phần tử ở vị trí n - k khi mảng xếp tăng dần (đếm từ 0).

// Cách 1: sắp xếp. Phải truyền hàm so sánh số, vì sort() mặc định so sánh chuỗi.
function sortThenPick(nums: number[], k: number): number {
  const a = [...nums].sort((x, y) => x - y);
  return a[a.length - k];
}

// Min-heap trên mảng: cha ở i, hai con ở 2i + 1 và 2i + 2; phần tử nhỏ nhất luôn ở a[0].
class MinHeap {
  a: number[] = [];
  get size(): number { return this.a.length; }
  peek(): number { return this.a[0]; }
  push(x: number): void {
    const a = this.a;
    a.push(x);
    let i = a.length - 1;
    while (i > 0) { // nổi lên: đổi chỗ với cha khi nhỏ hơn cha
      const p = (i - 1) >> 1;
      if (a[p] <= a[i]) break;
      [a[p], a[i]] = [a[i], a[p]];
      i = p;
    }
  }
  pop(): number {
    const a = this.a, top = a[0], last = a.pop()!;
    if (a.length > 0) {
      a[0] = last;
      let i = 0;
      for (;;) { // chìm xuống: đổi chỗ với con nhỏ hơn khi lớn hơn nó
        const l = 2 * i + 1, r = l + 1;
        let m = i;
        if (l < a.length && a[l] < a[m]) m = l;
        if (r < a.length && a[r] < a[m]) m = r;
        if (m === i) break;
        [a[m], a[i]] = [a[i], a[m]];
        i = m;
      }
    }
    return top;
  }
}

// Cách 2: giữ min-heap k phần tử lớn nhất đã thấy. Đỉnh là phần tử yếu nhất trong top k,
// nên khi duyệt xong, đỉnh chính là phần tử lớn thứ k. O(n log k) thời gian, O(k) bộ nhớ.
function heapOfK(nums: number[], k: number): number {
  const h = new MinHeap();
  for (const x of nums) {
    h.push(x);
    if (h.size > k) h.pop(); // bỏ phần tử nhỏ nhất: nó không thể lọt top k
  }
  return h.peek();
}

// Phân hoạch Lomuto với chốt a[hi]: dồn mọi phần tử < chốt sang trái, đặt chốt ngay sau chúng, trả vị trí chốt.
function lomuto(a: number[], lo: number, hi: number): number {
  const pivot = a[hi];
  let i = lo;
  for (let j = lo; j < hi; j++) {
    if (a[j] < pivot) { [a[i], a[j]] = [a[j], a[i]]; i++; }
  }
  [a[i], a[hi]] = [a[hi], a[i]];
  return i;
}

// Cách 3a: quickselect, chốt cố định là phần tử cuối. Mảng đã sắp: chốt luôn là max của đoạn,
// mỗi vòng chỉ bớt được 1 phần tử, nên O(n²).
function quickselectLast(nums: number[], k: number): number {
  const a = [...nums], target = a.length - k;
  let lo = 0, hi = a.length - 1;
  for (;;) {
    const p = lomuto(a, lo, hi);
    if (p === target) return a[p];
    if (p < target) lo = p + 1; else hi = p - 1;
  }
}

// Cách 3b: quickselect, chốt ngẫu nhiên, vẫn Lomuto. Hết sợ mảng đã sắp, nhưng mảng toàn giá trị bằng nhau
// vẫn O(n²): không phần tử nào < chốt, chốt luôn rơi về mép trái của đoạn.
function quickselectRandom(nums: number[], k: number): number {
  const a = [...nums], target = a.length - k;
  let lo = 0, hi = a.length - 1;
  for (;;) {
    const r = lo + Math.floor(Math.random() * (hi - lo + 1));
    [a[r], a[hi]] = [a[hi], a[r]];
    const p = lomuto(a, lo, hi);
    if (p === target) return a[p];
    if (p < target) lo = p + 1; else hi = p - 1;
  }
}

// Cách 3c: quickselect với phân hoạch Hoare. Hai con trỏ đi từ hai đầu và dừng ở phần tử BẰNG chốt,
// nên giá trị bằng nhau bị chia đều sang hai phía thay vì dồn về một phía.
function quickselectHoare(nums: number[], k: number): number {
  const a = [...nums], target = a.length - k;
  let lo = 0, hi = a.length - 1;
  while (lo < hi) {
    const pivot = a[lo + Math.floor(Math.random() * (hi - lo + 1))];
    let i = lo - 1, j = hi + 1;
    for (;;) {
      do i++; while (a[i] < pivot);
      do j--; while (a[j] > pivot);
      if (i >= j) break;
      [a[i], a[j]] = [a[j], a[i]];
    }
    // Sau vòng này: mọi phần tử trong [lo, j] <= chốt <= mọi phần tử trong [j + 1, hi].
    if (target <= j) hi = j; else lo = j + 1;
  }
  return a[lo];
}

// Cách 3d: quickselect phân hoạch ba phần (cờ Hà Lan): [lo, lt) < chốt, [lt, gt] = chốt, (gt, hi] > chốt.
// Vị trí đích rơi vào khúc "bằng chốt" là xong ngay, nên mảng toàn giá trị bằng nhau chỉ cần một lượt.
function quickselect3Way(nums: number[], k: number): number {
  const a = [...nums], target = a.length - k;
  let lo = 0, hi = a.length - 1;
  for (;;) {
    const pivot = a[lo + Math.floor(Math.random() * (hi - lo + 1))];
    let lt = lo, i = lo, gt = hi;
    while (i <= gt) {
      if (a[i] < pivot) { [a[lt], a[i]] = [a[i], a[lt]]; lt++; i++; }
      else if (a[i] > pivot) { [a[i], a[gt]] = [a[gt], a[i]]; gt--; }
      else i++;
    }
    if (target < lt) hi = lt - 1;
    else if (target > gt) lo = gt + 1;
    else return pivot;
  }
}

// Cách 4: đếm theo giá trị. Đề cho -10⁴ <= nums[i] <= 10⁴, nên chỉ có 20 001 giá trị khả dĩ.
// Đếm số lần xuất hiện, rồi đi từ giá trị lớn nhất xuống, trừ dần k. O(n + 20 001).
function countingPick(nums: number[], k: number): number {
  const OFF = 10_000, cnt = new Int32Array(2 * OFF + 1);
  for (const x of nums) cnt[x + OFF]++;
  for (let v = 2 * OFF; v >= 0; v--) {
    k -= cnt[v];
    if (k <= 0) return v - OFF;
  }
  throw new Error("k lớn hơn n");
}

// SAI 1: quên hàm so sánh. sort() mặc định đổi số thành chuỗi rồi so từng ký tự: "10" < "9".
function wrongDefaultSort(nums: number[], k: number): number {
  const a = [...nums].sort();
  return a[a.length - k];
}

// SAI 2: bỏ trùng trước khi chọn. Đề hỏi phần tử lớn thứ k "theo thứ tự đã sắp", không phải giá trị khác nhau thứ k.
function wrongDistinct(nums: number[], k: number): number {
  const a = [...new Set(nums)].sort((x, y) => x - y);
  return a[a.length - k];
}

// Bẫy độ sâu: quickselect viết đệ quy, chốt ngẫu nhiên, Lomuto. Mảng toàn giá trị bằng nhau làm mỗi lần gọi
// chỉ bớt 1 phần tử, nên độ sâu đệ quy xấp xỉ n - k.
function quickselectRecursive(a: number[], lo: number, hi: number, target: number): number {
  const r = lo + Math.floor(Math.random() * (hi - lo + 1));
  [a[r], a[hi]] = [a[hi], a[r]];
  const p = lomuto(a, lo, hi);
  if (p === target) return a[p];
  return p < target ? quickselectRecursive(a, p + 1, hi, target) : quickselectRecursive(a, lo, p - 1, target);
}

type Fn = (nums: number[], k: number) => number;
const cases: [number[], number, number][] = [
  [[3, 2, 1, 5, 6, 4], 2, 5], // ví dụ 1 của đề
  [[3, 2, 3, 1, 2, 4, 5, 5, 6], 4, 4], // ví dụ 2 của đề, có trùng
  [[1], 1, 1],
  [[7, 7, 7, 7], 2, 7], // toàn giá trị bằng nhau
  [[-1, -2, -3], 1, -1],
  [[-10000, 10000], 2, -10000], // hai biên giá trị
  [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3, 8], // đã sắp tăng
  [[10, 9, 8, 7, 6, 5, 4, 3, 2, 1], 10, 1], // đã sắp giảm, k = n
  [[10, 9, 1], 1, 10], // "10" < "9" theo chuỗi
  [[2, -1, 10, -20], 2, 2], // số âm và số hai chữ số
];

const fns: Fn[] = [sortThenPick, heapOfK, quickselectLast, quickselectRandom, quickselectHoare, quickselect3Way, countingPick, wrongDefaultSort, wrongDistinct];
for (const fn of fns) {
  const bad = cases.filter(([n, k, want]) => fn(n, k) !== want).map(([n, k]) => `[${n}] k=${k} → ${fn(n, k)}`);
  console.log(`${fn.name.padEnd(17)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(", ") : ""}`);
}
console.log(`[10, 9, 1].sort() = [${[10, 9, 1].sort()}]`);

// Đối chiếu ngẫu nhiên: 20 000 mảng dài 1..60, giá trị trong [-5, 5] (để có nhiều trùng) hoặc trong [-10⁴, 10⁴].
{
  const good = [heapOfK, quickselectLast, quickselectRandom, quickselectHoare, quickselect3Way, countingPick];
  const miss = new Map<string, number>(good.map((f) => [f.name, 0]));
  const T = 20_000;
  for (let t = 0; t < T; t++) {
    const n = 1 + Math.floor(Math.random() * 60), span = t % 2 ? 5 : 10_000;
    const nums = Array.from({ length: n }, () => Math.floor(Math.random() * (2 * span + 1)) - span);
    const k = 1 + Math.floor(Math.random() * n), want = sortThenPick(nums, k);
    for (const f of good) if (f(nums, k) !== want) miss.set(f.name, miss.get(f.name)! + 1);
  }
  console.log(`\nngẫu nhiên, ${T} mảng: lệch sắp xếp ở ` + [...miss].map(([n, c]) => `${n} ${c}`).join(", "));
}

// Đo: n = 10⁵ (giới hạn của đề), k = n / 2, ba dạng input. Trung vị 5 lần; ô chậm chỉ chạy 1 lần.
const N = 100_000, K = N / 2;
const shapes: [string, number[]][] = [
  ["ngẫu nhiên", Array.from({ length: N }, () => Math.floor(Math.random() * 20_001) - 10_000)],
  ["đã sắp", Array.from({ length: N }, (_, i) => Math.floor((i * 20_001) / N) - 10_000)], // tăng dần, trong [-10⁴, 10⁴]
  ["toàn bằng nhau", Array.from({ length: N }, () => 42)],
];
const median = (xs: number[]) => xs.sort((a, b) => a - b)[xs.length >> 1];
function time(f: Fn, nums: number[], runs: number): number {
  const ts: number[] = [];
  for (let r = 0; r < runs; r++) { const t0 = performance.now(); f(nums, K); ts.push(performance.now() - t0); }
  return median(ts);
}
console.log(`\nđo n = ${N}, k = ${K} (ms):`);
console.log("cách".padEnd(18) + shapes.map(([s]) => s.padStart(16)).join(""));
for (const f of [sortThenPick, heapOfK, quickselectLast, quickselectRandom, quickselectHoare, quickselect3Way, countingPick]) {
  const row = shapes.map(([s, nums]) => {
    const slow = (f === quickselectLast && s !== "ngẫu nhiên") || (f === quickselectRandom && s === "toàn bằng nhau");
    return (time(f, nums, slow ? 1 : 5).toFixed(1) + (slow ? "*" : "")).padStart(16);
  });
  console.log(f.name.padEnd(18) + row.join(""));
}
console.log("(* chạy 1 lần)");

// O(n²) thật sự: nhân đôi n thì thời gian gấp khoảng 4.
console.log("\nquickselectRandom trên mảng toàn bằng nhau, k = n / 2:");
for (const n of [10_000, 20_000, 40_000]) {
  const a = new Array(n).fill(42), t0 = performance.now();
  quickselectRandom(a, n / 2);
  console.log(`  n = ${String(n).padStart(6)}: ${(performance.now() - t0).toFixed(1)} ms`);
}

// Bẫy độ sâu đệ quy: tìm n lớn nhất mà bản đệ quy còn chạy được trên mảng toàn bằng nhau, k = 1.
{
  const ok = (n: number) => { try { quickselectRecursive(new Array(n).fill(42), 0, n - 1, n - 1); return true; } catch { return false; } };
  let lo = 1, hi = 100_000;
  while (lo < hi) { const m = (lo + hi + 1) >> 1; if (ok(m)) lo = m; else hi = m - 1; }
  console.log(`\nquickselect đệ quy, mảng toàn bằng nhau: chạy được tới n = ${lo}; n = 100000 → ${ok(100_000) ? "chạy được" : "RangeError"}`);
}
