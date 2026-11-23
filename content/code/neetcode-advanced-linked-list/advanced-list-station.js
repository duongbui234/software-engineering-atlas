// Ga LINK-02: danh sách liên kết nâng cao. Giải 138, 2, 287, 146, 23, 25.
// Chạy: node advanced-list-station.js

class ListNode {
  constructor(val, next = null) { this.val = val; this.next = next; }
}

class RNode {
  constructor(val) { this.val = val; this.next = null; this.random = null; }
}

function fromArray(a) {
  let head = null;
  for (let i = a.length - 1; i >= 0; i--) head = new ListNode(a[i], head);
  return head;
}

function toArray(head) {
  const out = [];
  for (let p = head; p; p = p.next) out.push(p.val);
  return out;
}

// 138: chèn bản sao ngay sau mỗi nút, nối random qua bản sao, rồi tách hai danh sách. O(1) bộ nhớ thêm.
function copyRandomList(head) {
  for (let p = head; p; p = p.next.next) { const c = new RNode(p.val); c.next = p.next; p.next = c; }
  for (let p = head; p; p = p.next.next) p.next.random = p.random ? p.random.next : null;
  const dummy = new RNode(0);
  let tail = dummy;
  for (let p = head; p; p = p.next) { const c = p.next; p.next = c.next; tail.next = c; tail = c; }
  return dummy.next;
}

// 2: cộng từng chữ số từ hàng đơn vị, mang số nhớ sang nút sau.
function addTwoNumbers(a, b) {
  const dummy = new ListNode(0);
  let tail = dummy, carry = 0;
  while (a || b || carry) {
    const s = (a ? a.val : 0) + (b ? b.val : 0) + carry;
    carry = s >= 10 ? 1 : 0;
    tail.next = new ListNode(s % 10);
    tail = tail.next;
    a = a ? a.next : null;
    b = b ? b.next : null;
  }
  return dummy.next;
}

// 287: coi i → nums[i] là con trỏ next; số trùng là đầu vòng (Floyd), O(1) bộ nhớ, không sửa mảng.
function findDuplicate(nums) {
  let slow = 0, fast = 0;
  do { slow = nums[slow]; fast = nums[nums[fast]]; } while (slow !== fast);
  let p = 0;
  while (p !== slow) { p = nums[p]; slow = nums[slow]; }
  return p;
}

// 146: Map tra key → nút; danh sách hai chiều có hai nút canh, đầu là mới dùng nhất, cuối là cũ nhất.
class DNode {
  constructor(key, val) { this.key = key; this.val = val; this.prev = null; this.next = null; }
}

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
    this.head = new DNode(0, 0);
    this.tail = new DNode(0, 0);
    this.head.next = this.tail; this.tail.prev = this.head;
  }
  unlink(n) { n.prev.next = n.next; n.next.prev = n.prev; }
  pushFront(n) { n.next = this.head.next; n.prev = this.head; this.head.next.prev = n; this.head.next = n; }
  get(key) {
    const n = this.map.get(key);
    if (!n) return -1;
    this.unlink(n); this.pushFront(n);
    return n.val;
  }
  put(key, val) {
    const n = this.map.get(key);
    if (n) { n.val = val; this.unlink(n); this.pushFront(n); return; }
    if (this.map.size === this.capacity) { const old = this.tail.prev; this.unlink(old); this.map.delete(old.key); }
    const m = new DNode(key, val);
    this.map.set(key, m); this.pushFront(m);
  }
}

// 23: trộn từng cặp danh sách, mỗi vòng số danh sách giảm một nửa: O(N log k).
function mergeTwo(a, b) {
  const dummy = new ListNode(0);
  let tail = dummy;
  while (a && b) {
    if (a.val <= b.val) { tail.next = a; a = a.next; } else { tail.next = b; b = b.next; }
    tail = tail.next;
  }
  tail.next = a ?? b;
  return dummy.next;
}

function mergeKLists(lists) {
  if (lists.length === 0) return null;
  let cur = lists.slice();
  while (cur.length > 1) {
    const next = [];
    for (let i = 0; i < cur.length; i += 2) next.push(i + 1 < cur.length ? mergeTwo(cur[i], cur[i + 1]) : cur[i]);
    cur = next;
  }
  return cur[0];
}

// So sánh: trộn lần lượt vào một kết quả chung, O(N·k).
function mergeKSequential(lists) {
  let acc = null;
  for (const l of lists) acc = mergeTwo(acc, l);
  return acc;
}

// 25: đếm đủ k nút thì lật khúc đó tại chỗ và nối lại; khúc cuối thiếu nút giữ nguyên.
function reverseKGroup(head, k) {
  const dummy = new ListNode(0, head);
  let groupPrev = dummy;
  while (true) {
    let kth = groupPrev;
    for (let i = 0; i < k && kth; i++) kth = kth.next;
    if (!kth) break;
    const groupNext = kth.next;
    let prev = groupNext, cur = groupPrev.next;
    while (cur !== groupNext) { const nx = cur.next; cur.next = prev; prev = cur; cur = nx; }
    const first = groupPrev.next;
    groupPrev.next = kth;
    groupPrev = first;
  }
  return dummy.next;
}

// ---- kiểm tra ----
function buildRandom(spec) {
  const nodes = spec.map(([v]) => new RNode(v));
  nodes.forEach((n, i) => { n.next = nodes[i + 1] ?? null; const r = spec[i][1]; n.random = r === null ? null : nodes[r]; });
  return nodes[0] ?? null;
}
function describeRandom(head) {
  const idx = new Map();
  let i = 0;
  for (let p = head; p; p = p.next) idx.set(p, i++);
  const out = [];
  for (let p = head; p; p = p.next) out.push(`${p.val}:${p.random ? idx.get(p.random) : "null"}`);
  return out.join(",");
}
function sharesNode(a, b) {
  const s = new Set();
  for (let p = a; p; p = p.next) s.add(p);
  for (let p = b; p; p = p.next) if (s.has(p)) return true;
  return false;
}
function runLRU(cap, ops) {
  const c = new LRUCache(cap), out = [];
  for (const [op, k, v] of ops) { if (op === "get") out.push(c.get(k)); else c.put(k, v); }
  return out;
}

const checks = [
  ["138 ví dụ của đề", () => {
    const spec = [[7, null], [13, 0], [11, 4], [10, 2], [1, 0]];
    const h = buildRandom(spec), before = describeRandom(h), c = copyRandomList(h);
    return describeRandom(c) === before && describeRandom(h) === before && !sharesNode(h, c);
  }],
  ["138 danh sách rỗng", () => copyRandomList(null) === null],
  ["2 ví dụ của đề", () => toArray(addTwoNumbers(fromArray([2, 4, 3]), fromArray([5, 6, 4]))).join() === "7,0,8"],
  ["2 hai số 0", () => toArray(addTwoNumbers(fromArray([0]), fromArray([0]))).join() === "0"],
  ["2 nhớ tới cuối", () => toArray(addTwoNumbers(fromArray([9, 9, 9, 9, 9, 9, 9]), fromArray([9, 9, 9, 9]))).join() === "8,9,9,9,0,0,0,1"],
  ["287 [1,3,4,2,2]", () => findDuplicate([1, 3, 4, 2, 2]) === 2],
  ["287 [3,1,3,4,2]", () => findDuplicate([3, 1, 3, 4, 2]) === 3],
  ["287 [3,3,3,3,3]", () => findDuplicate([3, 3, 3, 3, 3]) === 3],
  ["146 ví dụ của đề", () => runLRU(2, [["put", 1, 1], ["put", 2, 2], ["get", 1], ["put", 3, 3], ["get", 2], ["put", 4, 4], ["get", 1], ["get", 3], ["get", 4]]).join() === "1,-1,-1,3,4"],
  ["146 cập nhật key cũ", () => runLRU(2, [["put", 2, 1], ["put", 1, 1], ["put", 2, 3], ["put", 4, 1], ["get", 1], ["get", 2]]).join() === "-1,3"],
  ["23 ví dụ của đề", () => toArray(mergeKLists([[1, 4, 5], [1, 3, 4], [2, 6]].map(fromArray))).join() === "1,1,2,3,4,4,5,6"],
  ["23 không có danh sách", () => mergeKLists([]) === null],
  ["23 một danh sách rỗng", () => mergeKLists([null]) === null],
  ["25 k = 2", () => toArray(reverseKGroup(fromArray([1, 2, 3, 4, 5]), 2)).join() === "2,1,4,3,5"],
  ["25 k = 3", () => toArray(reverseKGroup(fromArray([1, 2, 3, 4, 5]), 3)).join() === "3,2,1,4,5"],
];
const bad = checks.filter(([, f]) => !f()).map(([n]) => n);
console.log(`advanced-list-station ${checks.length - bad.length}/${checks.length} ca đúng${bad.length ? "; sai ở " + bad.join(", ") : ""}`);
