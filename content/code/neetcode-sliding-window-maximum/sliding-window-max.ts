// LeetCode 239, Sliding Window Maximum: bốn cách, một bản sai, test và đo.
// Chạy: node sliding-window-max.ts

// Cách 1, vét cạn: mỗi cửa sổ tìm max lại từ đầu. O(n·k).
function bruteForce(nums: number[], k: number): number[] {
  const out: number[] = [];
  for (let i = 0; i + k <= nums.length; i++) {
    let m = nums[i];
    for (let j = i + 1; j < i + k; j++) m = Math.max(m, nums[j]);
    out.push(m);
  }
  return out;
}

// SAI: giữ một max chạy, chỉ so với phần tử mới. Khi max cũ trượt ra khỏi cửa sổ, nó vẫn bị giữ lại.
function runningMaxOnly(nums: number[], k: number): number[] {
  const out: number[] = [];
  let m = -Infinity;
  for (let i = 0; i < nums.length; i++) {
    m = Math.max(m, nums[i]);
    if (i >= k - 1) out.push(m);
  }
  return out;
}

// Cách 2, chia khối k: max tiền tố trong khối và max hậu tố trong khối. Cửa sổ [i, i+k-1] cắt đúng một ranh giới khối.
function blocks(nums: number[], k: number): number[] {
  const n = nums.length;
  const pre = new Array(n), suf = new Array(n);
  for (let i = 0; i < n; i++) pre[i] = i % k === 0 ? nums[i] : Math.max(pre[i - 1], nums[i]);
  for (let i = n - 1; i >= 0; i--) suf[i] = i === n - 1 || (i + 1) % k === 0 ? nums[i] : Math.max(suf[i + 1], nums[i]);
  const out: number[] = [];
  for (let i = 0; i + k <= n; i++) out.push(Math.max(suf[i], pre[i + k - 1]));
  return out;
}

// Cách 3, hàng đợi đơn điệu: mảng chỉ số + biến head thay cho shift(). Giá trị theo chỉ số giảm dần từ head.
function monotonicDeque(nums: number[], k: number): number[] {
  const q = new Int32Array(nums.length); // chỉ số; q[head..tail-1] là hàng đợi
  let head = 0, tail = 0;
  const out: number[] = [];
  for (let i = 0; i < nums.length; i++) {
    if (head < tail && q[head] <= i - k) head++; // đầu hàng đã trượt ra khỏi cửa sổ
    while (head < tail && nums[q[tail - 1]] <= nums[i]) tail--; // bỏ mọi phần tử không lớn hơn phần tử mới
    q[tail++] = i;
    if (i >= k - 1) out.push(nums[q[head]]);
  }
  return out;
}

// Cách 3 nhưng bỏ đầu hàng bằng shift(): đúng, nhưng shift() dời cả mảng.
function monotonicShift(nums: number[], k: number): number[] {
  const q: number[] = [];
  const out: number[] = [];
  for (let i = 0; i < nums.length; i++) {
    if (q.length && q[0] <= i - k) q.shift();
    while (q.length && nums[q[q.length - 1]] <= nums[i]) q.pop();
    q.push(i);
    if (i >= k - 1) out.push(nums[q[0]]);
  }
  return out;
}

const cases: [number[], number, number[]][] = [
  [[1, 3, -1, -3, 5, 3, 6, 7], 3, [3, 3, 5, 5, 6, 7]], [[1], 1, [1]], [[9, 8, 7, 6, 5], 2, [9, 8, 7, 6]],
  [[1, 2, 3, 4], 4, [4]], [[4, 4, 4, 1], 2, [4, 4, 4]], [[-7, -8, 7, 5, 7, 1, 6, 0], 4, [7, 7, 7, 7, 7]], [[5, 1, 2, 3], 2, [5, 2, 3]],
];
const fns = { bruteForce, runningMaxOnly, blocks, monotonicDeque, monotonicShift };
for (const [name, fn] of Object.entries(fns)) {
  const bad = cases.filter(([a, k, want]) => fn(a, k).join() !== want.join());
  console.log(`${name.padEnd(15)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.map(([a, k]) => `[${a}] k=${k} → [${fn(a, k)}]`).join(" ") : ""}`);
}

// Đo. Dãy giảm dần là ca tệ nhất cho hàng đợi: nó dài đúng k, và mỗi bước phải bỏ đầu hàng.
const time = (f: () => unknown, runs: number) => {
  const ts: number[] = [];
  for (let r = 0; r < runs; r++) { const t = performance.now(); f(); ts.push(performance.now() - t); }
  return ts.sort((a, b) => a - b)[Math.floor(runs / 2)];
};
console.log("\nn        k        dữ liệu     vét cạn   khối   hàng đợi (head)   hàng đợi (shift)   (ms, trung vị 3 lần)");
for (const [n, k] of [[100_000, 1_000], [200_000, 100_000]] as const) {
  for (const kind of ["giảm dần", "ngẫu nhiên"]) {
    const a = kind === "giảm dần" ? Array.from({ length: n }, (_, i) => n - i) : Array.from({ length: n }, (_, i) => ((i * 2654435761) >>> 0) % 1_000_000);
    const bf = n * k <= 1e9 ? time(() => bruteForce(a, k), 3).toFixed(1) : "—";
    console.log(`${String(n).padEnd(8)} ${String(k).padEnd(8)} ${kind.padEnd(11)} ${bf.padStart(8)} ${time(() => blocks(a, k), 3).toFixed(1).padStart(6)} ${time(() => monotonicDeque(a, k), 3).toFixed(1).padStart(17)} ${time(() => monotonicShift(a, k), 3).toFixed(1).padStart(18)}`);
  }
}
