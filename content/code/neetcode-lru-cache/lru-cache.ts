// LeetCode 146: LRU Cache. Bảng băm + danh sách hai chiều, bản dùng Map của JavaScript, ba bản sai.
// Chạy: node lru-cache.ts

interface Cache { get(key: number): number; put(key: number, val: number): void; }

class DNode {
  key: number; val: number;
  prev: DNode | null = null; next: DNode | null = null;
  constructor(key: number, val: number) { this.key = key; this.val = val; }
}

// Cách 1: Map tra key → nút; danh sách hai chiều có hai nút canh. Sau head là mới dùng nhất, trước tail là cũ nhất.
class LRUList implements Cache {
  map = new Map<number, DNode>();
  head = new DNode(0, 0);
  tail = new DNode(0, 0);
  capacity: number;
  constructor(capacity: number) { this.capacity = capacity; this.head.next = this.tail; this.tail.prev = this.head; }
  unlink(n: DNode) { n.prev!.next = n.next; n.next!.prev = n.prev; }
  pushFront(n: DNode) { n.next = this.head.next; n.prev = this.head; this.head.next!.prev = n; this.head.next = n; }
  get(key: number): number {
    const n = this.map.get(key);
    if (n === undefined) return -1;
    this.unlink(n); this.pushFront(n); // vừa dùng: đưa lên đầu
    return n.val;
  }
  put(key: number, val: number): void {
    const n = this.map.get(key);
    if (n !== undefined) { n.val = val; this.unlink(n); this.pushFront(n); return; }
    if (this.map.size === this.capacity) {
      const old = this.tail.prev!; // cũ nhất nằm ngay trước nút canh cuối
      this.unlink(old);
      this.map.delete(old.key);
    }
    const m = new DNode(key, val);
    this.map.set(key, m); this.pushFront(m);
  }
}

// Cách 2: Map của JavaScript nhớ thứ tự chèn. Xóa rồi chèn lại là đưa key xuống cuối; key đầu tiên là cũ nhất.
class LRUMap implements Cache {
  map = new Map<number, number>();
  capacity: number;
  constructor(capacity: number) { this.capacity = capacity; }
  get(key: number): number {
    const v = this.map.get(key);
    if (v === undefined) return -1;
    this.map.delete(key); this.map.set(key, v);
    return v;
  }
  put(key: number, val: number): void {
    if (this.map.has(key)) this.map.delete(key);
    else if (this.map.size === this.capacity) this.map.delete(this.map.keys().next().value!);
    this.map.set(key, val);
  }
}

// SAI 1: get không đưa nút lên đầu. Key vừa đọc vẫn bị coi là cũ và bị đẩy ra trước.
class WrongNoMoveOnGet extends LRUList {
  get(key: number): number { const n = this.map.get(key); return n === undefined ? -1 : n.val; }
}

// SAI 2: đẩy nút cuối ra khỏi danh sách nhưng quên xóa khỏi Map.
class WrongKeepInMap extends LRUList {
  put(key: number, val: number): void {
    const n = this.map.get(key);
    if (n !== undefined) { n.val = val; this.unlink(n); this.pushFront(n); return; }
    if (this.map.size === this.capacity) this.unlink(this.tail.prev!); // thiếu this.map.delete(old.key)
    const m = new DNode(key, val);
    this.map.set(key, m); this.pushFront(m);
  }
}

// SAI 3: put cho key đã có chỉ sửa giá trị, không đưa lên đầu.
class WrongUpdateNoMove extends LRUList {
  put(key: number, val: number): void {
    const n = this.map.get(key);
    if (n !== undefined) { n.val = val; return; }
    super.put(key, val);
  }
}

// Bản chậm làm chuẩn để so: mảng key theo thứ tự dùng, O(capacity) mỗi thao tác.
class LRUSlow implements Cache {
  order: number[] = []; vals = new Map<number, number>(); capacity: number;
  constructor(capacity: number) { this.capacity = capacity; }
  touch(key: number) { this.order.splice(this.order.indexOf(key), 1); this.order.push(key); }
  get(key: number) { if (!this.vals.has(key)) return -1; this.touch(key); return this.vals.get(key)!; }
  put(key: number, val: number) {
    if (this.vals.has(key)) { this.vals.set(key, val); this.touch(key); return; }
    if (this.order.length === this.capacity) this.vals.delete(this.order.shift()!);
    this.order.push(key); this.vals.set(key, val);
  }
}

// Bộ sinh ngẫu nhiên mulberry32: trạng thái 32 bit, mọi phép nhân qua Math.imul.
function mulberry32(a: number) {
  return () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

type Op = [0, number] | [1, number, number]; // [0, key] là get, [1, key, val] là put
function randomOps(n: number, keys: number, seed: number): Op[] {
  const r = mulberry32(seed), ops: Op[] = [];
  for (let i = 0; i < n; i++) {
    const k = Math.floor(r() * keys);
    ops.push(r() < 0.5 ? [0, k] : [1, k, Math.floor(r() * 1000)]);
  }
  return ops;
}
function run(make: (cap: number) => Cache, cap: number, ops: Op[]): number[] {
  const c = make(cap), out: number[] = [];
  for (const o of ops) { if (o[0] === 0) out.push(c.get(o[1])); else c.put(o[1], o[2]); }
  return out;
}
function g(k: number): Op { return [0, k]; }
function p(k: number, v: number): Op { return [1, k, v]; }

const cases: { name: string; cap: number; ops: Op[] }[] = [
  { name: "ví dụ của đề", cap: 2, ops: [p(1, 1), p(2, 2), g(1), p(3, 3), g(2), p(4, 4), g(1), g(3), g(4)] },
  { name: "cập nhật key cũ", cap: 2, ops: [p(2, 1), p(1, 1), p(2, 3), p(4, 1), g(1), g(2)] },
  { name: "sức chứa 1", cap: 1, ops: [p(2, 1), g(2), p(3, 2), g(2), g(3)] },
  { name: "get key chưa có", cap: 2, ops: [g(5), p(5, 5), g(5)] },
  { name: "đẩy ra rồi thêm lại", cap: 2, ops: [p(1, 1), p(2, 2), p(3, 3), g(1), p(1, 10), g(1), g(2), g(3)] },
  { name: "ngẫu nhiên 1 (cap 3)", cap: 3, ops: randomOps(2000, 8, 1) },
  { name: "ngẫu nhiên 2 (cap 10)", cap: 10, ops: randomOps(2000, 25, 2) },
  { name: "ngẫu nhiên 3 (cap 50)", cap: 50, ops: randomOps(2000, 120, 3) },
];

const impls: [string, (cap: number) => Cache][] = [
  ["LRUList", (c) => new LRUList(c)],
  ["LRUMap", (c) => new LRUMap(c)],
  ["WrongNoMoveOnGet", (c) => new WrongNoMoveOnGet(c)],
  ["WrongKeepInMap", (c) => new WrongKeepInMap(c)],
  ["WrongUpdateNoMove", (c) => new WrongUpdateNoMove(c)],
];
for (const [name, make] of impls) {
  const bad: string[] = [];
  for (const c of cases) {
    const want = run((x) => new LRUSlow(x), c.cap, c.ops).join();
    let got: string;
    try { got = run(make, c.cap, c.ops).join(); } catch (e) { got = "ném " + (e as Error).name; }
    if (got !== want) bad.push(c.name);
  }
  console.log(`${name.padEnd(18)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(", ") : ""}`);
}

// SAI 2 làm Map phình ra: sau 10⁴ thao tác ngẫu nhiên với sức chứa 50.
{
  const ok = new LRUList(50), bad = new WrongKeepInMap(50);
  for (const o of randomOps(10000, 1000, 7)) {
    for (const c of [ok, bad]) { if (o[0] === 0) c.get(o[1]); else c.put(o[1], o[2]); }
  }
  let listLen = 0;
  for (let n = bad.head.next; n !== bad.tail; n = n!.next) listLen++;
  console.log(`\nsau 10⁴ thao tác, sức chứa 50: LRUList giữ ${ok.map.size} key; WrongKeepInMap có ${bad.map.size} key trong Map, ${listLen} nút trong danh sách`);
}

// Đo: 10⁶ thao tác, nửa get nửa put, key trong 0..2·cap − 1. Trung vị 5 lần chạy.
function median(xs: number[]) { const s = xs.slice().sort((a, b) => a - b); return s[s.length >> 1]; }
console.log("\nsức chứa   LRUList (danh sách tự viết)   LRUMap (Map xóa rồi chèn)");
for (const cap of [100, 10000]) {
  const ops = randomOps(1_000_000, 2 * cap, cap);
  const row: string[] = [];
  for (const make of [(c: number) => new LRUList(c), (c: number) => new LRUMap(c)]) {
    const ts: number[] = [];
    for (let r = 0; r < 5; r++) { const t = performance.now(); run(make, cap, ops); ts.push(performance.now() - t); }
    const ms = median(ts);
    row.push(`${ms.toFixed(1).padStart(7)} ms  ${(1e6 / ms / 1000).toFixed(1).padStart(5)} triệu thao tác/s`);
  }
  console.log(`${String(cap).padEnd(10)} ${row[0]}     ${row[1]}`);
}

// Tách riêng chỗ chậm của LRUMap: lấy key đầu bằng keys().next() so với chỉ xóa rồi chèn lại một key bất kỳ.
console.log("\nsức chứa   10⁶ lần xóa rồi chèn lại key ngẫu nhiên   10⁵ lần lấy key đầu, xóa, chèn key mới");
for (const cap of [100, 10000]) {
  const r = mulberry32(cap);
  const m = new Map<number, number>();
  for (let i = 0; i < cap; i++) m.set(i, i);
  let t = performance.now();
  for (let i = 0; i < 1e6; i++) { const k = Math.floor(r() * cap); const v = m.get(k)!; m.delete(k); m.set(k, v); }
  const moveMs = performance.now() - t;
  t = performance.now();
  for (let i = 0; i < 1e5; i++) { m.delete(m.keys().next().value!); m.set(cap + i, 0); }
  const evictMs = performance.now() - t;
  console.log(`${String(cap).padEnd(10)} ${moveMs.toFixed(1).padStart(8)} ms                          ${evictMs.toFixed(1).padStart(8)} ms`);
}
