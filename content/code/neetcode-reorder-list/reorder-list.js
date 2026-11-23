// LC 143 Reorder List: ba bước và mảng các nút, kèm bản dùng shift() để lấy đầu mảng.
// Chạy: node reorder-list.js

class ListNode {
  constructor(val, next = null) { this.val = val; this.next = next; }
}

function build(vals) {
  let head = null;
  for (let i = vals.length - 1; i >= 0; i--) head = new ListNode(vals[i], head);
  return head;
}

function toArray(head, limit) {
  const out = [];
  for (let cur = head; cur !== null; cur = cur.next) {
    if (out.length >= limit) return "vòng";
    out.push(cur.val);
  }
  return out;
}

function expected(vals) {
  const out = [];
  for (let i = 0, j = vals.length - 1; i <= j; i++, j--) { out.push(vals[i]); if (i !== j) out.push(vals[j]); }
  return out;
}

function reverse(head) {
  let prev = null, cur = head;
  while (cur !== null) { const nxt = cur.next; cur.next = prev; prev = cur; cur = nxt; }
  return prev;
}

// Cách 1: tìm giữa, cắt, đảo nửa sau, đan xen.
function reorderThreeSteps(head) {
  if (head === null || head.next === null) return;
  let slow = head, fast = head;
  while (fast.next !== null && fast.next.next !== null) { slow = slow.next; fast = fast.next.next; }
  let second = reverse(slow.next);
  slow.next = null;
  let first = head;
  while (second !== null) {
    const n1 = first.next, n2 = second.next;
    first.next = second; second.next = n1;
    first = n1; second = n2;
  }
}

// Cách 2: mảng các nút với hai chỉ số.
function reorderArray(head) {
  const nodes = [];
  for (let cur = head; cur !== null; cur = cur.next) nodes.push(cur);
  let i = 0, j = nodes.length - 1;
  while (i < j) {
    nodes[i].next = nodes[j];
    i++;
    if (i === j) break;
    nodes[j].next = nodes[i];
    j--;
  }
  if (nodes.length > 0) nodes[i].next = null;
}

// Đúng nhưng chậm: dùng mảng như deque, lấy đầu bằng shift(). shift() dời cả mảng nên mỗi lần O(n).
function reorderShift(head) {
  const nodes = [];
  for (let cur = head; cur !== null; cur = cur.next) nodes.push(cur);
  let tail = null, left = true;
  while (nodes.length > 0) {
    const node = left ? nodes.shift() : nodes.pop();
    if (tail !== null) tail.next = node;
    tail = node;
    left = !left;
  }
  if (tail !== null) tail.next = null;
}

const cases = [[1, 2, 3, 4], [1, 2, 3, 4, 5], [1], [1, 2], [1, 2, 3], [], [10, 20, 30, 40, 50, 60], [7, 7, 7, 8, 8]];
for (const fn of [reorderThreeSteps, reorderArray, reorderShift]) {
  const bad = [];
  for (const vals of cases) {
    const head = build(vals);
    fn(head);
    const got = toArray(head, 2 * vals.length + 2);
    if (JSON.stringify(got) !== JSON.stringify(expected(vals))) bad.push(`[${vals}] → ${got}`);
  }
  console.log(`${fn.name.padEnd(17)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(", ") : ""}`);
}

console.log("\nn nút      ba bước      mảng        shift()");
for (const n of [10000, 100000]) {
  const row = [String(n).padEnd(10)];
  for (const fn of [reorderThreeSteps, reorderArray, reorderShift]) {
    const ts = [];
    for (let r = 0; r < 5; r++) {
      const head = build(Array.from({ length: n }, (_, i) => i));
      const t0 = performance.now();
      fn(head);
      ts.push(performance.now() - t0);
    }
    ts.sort((a, b) => a - b);
    row.push(`${ts[2].toFixed(2).padStart(8)} ms`);
  }
  console.log(row.join(" "));
}
