// LeetCode 981: Time Based Key-Value Store. Chạy: node time-map.ts
// get(key, t) trả giá trị của lần set có timestamp lớn nhất ≤ t, không có thì "".

interface TimeMapLike {
  set(key: string, value: string, timestamp: number): void;
  get(key: string, timestamp: number): string | null;
}

// Cách 1, quét lùi: duyệt lịch sử của key từ cuối về đầu, dừng ở mốc đầu tiên ≤ t. O(k) mỗi lần get.
class LinearTimeMap implements TimeMapLike {
  private store = new Map<string, { times: number[]; values: string[] }>();
  set(key: string, value: string, timestamp: number): void {
    let h = this.store.get(key);
    if (!h) this.store.set(key, (h = { times: [], values: [] }));
    h.times.push(timestamp); // đề hứa timestamp tăng dần: push giữ mảng đã sắp
    h.values.push(value);
  }
  get(key: string, timestamp: number): string {
    const h = this.store.get(key);
    if (!h) return "";
    for (let i = h.times.length - 1; i >= 0; i--) if (h.times[i] <= timestamp) return h.values[i];
    return "";
  }
}

// Cách 2, chia đôi: tìm vị trí đầu tiên có timestamp > t (cận trên), lùi một ô. O(log k) mỗi lần get.
class BinaryTimeMap implements TimeMapLike {
  protected store = new Map<string, { times: number[]; values: string[] }>();
  set(key: string, value: string, timestamp: number): void {
    let h = this.store.get(key);
    if (!h) this.store.set(key, (h = { times: [], values: [] }));
    h.times.push(timestamp);
    h.values.push(value);
  }
  get(key: string, timestamp: number): string {
    const h = this.store.get(key);
    if (!h) return "";
    let lo = 0, hi = h.times.length; // nửa mở [lo, hi): đếm số mốc ≤ timestamp
    while (lo < hi) {
      const mid = (lo + hi) >>> 1;
      if (h.times[mid] <= timestamp) lo = mid + 1;
      else hi = mid;
    }
    return lo === 0 ? "" : h.values[lo - 1]; // lo − 1 là mốc cuối cùng ≤ timestamp
  }
}

// SAI: dùng cận dưới (mốc đầu tiên ≥ t). Đúng khi t trùng một mốc, nhưng khi t nằm giữa hai mốc thì trả giá trị của mốc SAU, tức giá trị "từ tương lai".
class LowerBoundTimeMap extends BinaryTimeMap {
  override get(key: string, timestamp: number): string {
    const h = this.store.get(key);
    if (!h) return "";
    let lo = 0, hi = h.times.length;
    while (lo < hi) {
      const mid = (lo + hi) >>> 1;
      if (h.times[mid] < timestamp) lo = mid + 1;
      else hi = mid;
    }
    return lo === h.times.length ? "" : h.values[lo];
  }
}

// SAI: trả null khi không có thay vì chuỗi rỗng "" như đề yêu cầu.
class NullTimeMap extends BinaryTimeMap {
  override get(key: string, timestamp: number): string | null {
    const v = super.get(key, timestamp);
    return v === "" ? null : v;
  }
}

// Ca thử: mỗi ca là một dãy lệnh; lệnh get mang kết quả mong đợi.
type Op = ["set", string, string, number] | ["get", string, number, string];
const cases: [string, Op[]][] = [
  ["ví dụ của đề", [["set", "foo", "bar", 1], ["get", "foo", 1, "bar"], ["get", "foo", 3, "bar"], ["set", "foo", "bar2", 4], ["get", "foo", 4, "bar2"], ["get", "foo", 5, "bar2"]]],
  ["key chưa từng set", [["get", "x", 10, ""]]],
  ["t nhỏ hơn mốc đầu", [["set", "a", "v", 5], ["get", "a", 4, ""], ["get", "a", 5, "v"]]],
  ["t nằm giữa hai mốc", [["set", "a", "v1", 10], ["set", "a", "v2", 20], ["get", "a", 15, "v1"]]],
  ["t lớn hơn mốc cuối", [["set", "a", "v1", 10], ["set", "a", "v2", 20], ["get", "a", 99, "v2"]]],
  ["hai key xen kẽ", [["set", "a", "a1", 1], ["set", "b", "b1", 2], ["set", "a", "a2", 3], ["get", "b", 3, "b1"], ["get", "a", 2, "a1"], ["get", "b", 1, ""]]],
  ["trùng mốc ở giữa", [["set", "k", "1", 1], ["set", "k", "2", 2], ["set", "k", "3", 3], ["get", "k", 2, "2"]]],
  ["timestamp 10⁷", [["set", "k", "lo", 1], ["set", "k", "hi", 10_000_000], ["get", "k", 9_999_999, "lo"], ["get", "k", 10_000_000, "hi"]]],
];

const impls: [string, () => TimeMapLike][] = [
  ["LinearTimeMap", () => new LinearTimeMap()],
  ["BinaryTimeMap", () => new BinaryTimeMap()],
  ["LowerBoundTimeMap", () => new LowerBoundTimeMap()],
  ["NullTimeMap", () => new NullTimeMap()],
];
for (const [name, make] of impls) {
  const bad: string[] = [];
  for (const [label, ops] of cases) {
    const m = make();
    const got: string[] = [];
    let ok = true;
    for (const op of ops) {
      if (op[0] === "set") m.set(op[1], op[2], op[3]);
      else { const r = m.get(op[1], op[2]); got.push(JSON.stringify(r)); if (r !== op[3]) ok = false; }
    }
    if (!ok) bad.push(`${label} → [${got.join(", ")}]`);
  }
  console.log(`${name.padEnd(18)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở: " + bad.join("; ") : ""}`);
}

// Đo 1: một key có k mốc (timestamp 2, 4, 6, …), 10⁵ lần get. Hai kiểu truy vấn: t ngẫu nhiên, và t "gần đây" (trong 10 mốc cuối).
const median = (xs: number[]) => xs.sort((a, b) => a - b)[xs.length >> 1];
function time(fn: () => void): number {
  const rs: number[] = [];
  for (let r = 0; r < 5; r++) { const t0 = performance.now(); fn(); rs.push(performance.now() - t0); }
  return median(rs);
}
let seed = 42;
// Bộ sinh ngẫu nhiên mulberry32: trạng thái là số nguyên 32 bit, mọi phép nhân qua Math.imul nên không mất chính xác.
function mix32(a: number): number { let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return (t ^ (t >>> 14)) >>> 0; }
const rnd = () => (((seed = (seed + 0x6d2b79f5) | 0), mix32(seed) >>> 1) / 2147483648);
console.log("\nk mốc       quét lùi, t ngẫu nhiên  chia đôi, t ngẫu nhiên  quét lùi, t gần đây  chia đôi, t gần đây   (ms cho 10⁵ get, trung vị 5 lần)");
for (const k of [100, 1_000, 10_000, 100_000]) {
  const lin = new LinearTimeMap(), bin = new BinaryTimeMap();
  for (let i = 1; i <= k; i++) { lin.set("k", "v" + i, 2 * i); bin.set("k", "v" + i, 2 * i); }
  const Q = 100_000;
  const randQ = Array.from({ length: Q }, () => 1 + Math.floor(rnd() * 2 * k));
  const recentQ = Array.from({ length: Q }, () => 2 * k - Math.floor(rnd() * 20));
  let sink = 0;
  const run = (m: TimeMapLike, qs: number[]) => () => { for (const t of qs) sink += (m.get("k", t) as string).length; };
  const lr = k <= 10_000 ? time(run(lin, randQ)).toFixed(2) : "—";
  const br = time(run(bin, randQ)).toFixed(2);
  const lc = time(run(lin, recentQ)).toFixed(2);
  const bc = time(run(bin, recentQ)).toFixed(2);
  console.log(`${String(k).padEnd(10)}  ${lr.padStart(22)}  ${br.padStart(22)}  ${lc.padStart(19)}  ${bc.padStart(19)}${sink < 0 ? "!" : ""}`);
}

// Đo 2: cái giá của set khi timestamp KHÔNG tăng dần. Push (đề hứa tăng dần) so với chèn đúng chỗ bằng splice (O(k) mỗi lần dời phần tử).
console.log("\nn lần set    push, tăng dần   chèn đúng chỗ, thứ tự ngẫu nhiên   (ms, trung vị 5 lần)");
for (const n of [10_000, 100_000]) {
  const shuffled = Array.from({ length: n }, (_, i) => i + 1);
  for (let i = n - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; }
  const pushMs = time(() => { const ts: number[] = []; for (let i = 1; i <= n; i++) ts.push(i); });
  const insertMs = time(() => {
    const ts: number[] = [];
    for (const t of shuffled) {
      let lo = 0, hi = ts.length;
      while (lo < hi) { const mid = (lo + hi) >>> 1; if (ts[mid] < t) lo = mid + 1; else hi = mid; }
      ts.splice(lo, 0, t);
    }
  });
  console.log(`${String(n).padEnd(11)}  ${pushMs.toFixed(2).padStart(14)}  ${insertMs.toFixed(2).padStart(32)}`);
}
