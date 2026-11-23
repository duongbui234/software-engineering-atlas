// LeetCode 981: Time Based Key-Value Store. Chạy: node time-map.js
// get(key, t) trả giá trị của lần set có timestamp lớn nhất ≤ t, không có thì "".

// Dùng Map, không dùng object thường: key của đề là chữ thường và số, nên "constructor" là key hợp lệ.
class TimeMap {
  constructor() { this.store = new Map(); }
  set(key, value, timestamp) {
    let h = this.store.get(key);
    if (!h) this.store.set(key, (h = { times: [], values: [] }));
    h.times.push(timestamp); // đề hứa timestamp tăng dần: push giữ mảng đã sắp
    h.values.push(value);
  }
  get(key, timestamp) {
    const h = this.store.get(key);
    if (!h) return "";
    let lo = 0, hi = h.times.length; // nửa mở [lo, hi): đếm số mốc ≤ timestamp
    while (lo < hi) {
      const mid = (lo + hi) >>> 1;
      if (h.times[mid] <= timestamp) lo = mid + 1;
      else hi = mid;
    }
    return lo === 0 ? "" : h.values[lo - 1];
  }
}

// SAI: kho là object thường {}. store["constructor"] đã có sẵn (kế thừa từ Object.prototype), nên "key chưa từng set" không còn là undefined.
class ObjectTimeMap {
  constructor() { this.store = {}; }
  set(key, value, timestamp) {
    const h = this.store[key] || (this.store[key] = { times: [], values: [] });
    h.times.push(timestamp);
    h.values.push(value);
  }
  get(key, timestamp) {
    const h = this.store[key];
    if (!h) return "";
    let lo = 0, hi = h.times.length;
    while (lo < hi) {
      const mid = (lo + hi) >>> 1;
      if (h.times[mid] <= timestamp) lo = mid + 1;
      else hi = mid;
    }
    return lo === 0 ? "" : h.values[lo - 1];
  }
}

const cases = [
  ["ví dụ của đề", [["set", "foo", "bar", 1], ["get", "foo", 1, "bar"], ["get", "foo", 3, "bar"], ["set", "foo", "bar2", 4], ["get", "foo", 4, "bar2"], ["get", "foo", 5, "bar2"]]],
  ["key chưa từng set", [["get", "x", 10, ""]]],
  ["t nhỏ hơn mốc đầu", [["set", "a", "v", 5], ["get", "a", 4, ""], ["get", "a", 5, "v"]]],
  ["t nằm giữa hai mốc", [["set", "a", "v1", 10], ["set", "a", "v2", 20], ["get", "a", 15, "v1"]]],
  ["t lớn hơn mốc cuối", [["set", "a", "v1", 10], ["set", "a", "v2", 20], ["get", "a", 99, "v2"]]],
  ["hai key xen kẽ", [["set", "a", "a1", 1], ["set", "b", "b1", 2], ["set", "a", "a2", 3], ["get", "b", 3, "b1"], ["get", "a", 2, "a1"], ["get", "b", 1, ""]]],
  ["trùng mốc ở giữa", [["set", "k", "1", 1], ["set", "k", "2", 2], ["set", "k", "3", 3], ["get", "k", 2, "2"]]],
  ["timestamp 10⁷", [["set", "k", "lo", 1], ["set", "k", "hi", 10_000_000], ["get", "k", 9_999_999, "lo"], ["get", "k", 10_000_000, "hi"]]],
  ["key \"constructor\"", [["get", "constructor", 5, ""], ["set", "constructor", "c1", 1], ["get", "constructor", 5, "c1"]]],
];

for (const Impl of [TimeMap, ObjectTimeMap]) {
  const bad = [];
  for (const [label, ops] of cases) {
    const m = new Impl();
    const got = [];
    let ok = true;
    for (const op of ops) {
      if (op[0] === "set") { try { m.set(op[1], op[2], op[3]); } catch (e) { got.push(`set ném ${e.constructor.name}`); ok = false; } }
      else {
        try {
          const r = m.get(op[1], op[2]);
          got.push(JSON.stringify(r));
          if (r !== op[3]) ok = false;
        } catch (e) { got.push(`get ném ${e.constructor.name}`); ok = false; }
      }
    }
    if (!ok) bad.push(`${label} → [${got.join(", ")}]`);
  }
  console.log(`${Impl.name.padEnd(14)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở: " + bad.join("; ") : ""}`);
}

const plain = {};
console.log(`\n({})["constructor"] = ${plain["constructor"]}`);
console.log(`new Map().get("constructor") = ${new Map().get("constructor")}`);
