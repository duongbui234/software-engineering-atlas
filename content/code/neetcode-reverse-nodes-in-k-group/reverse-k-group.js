// LC 25 Reverse Nodes in k-Group: lặp với nút giả, đệ quy, và kiểm vét mọi n ≤ 12.
// Chạy: node reverse-k-group.js

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
  for (; head !== null; head = head.next) {
    if (out.length >= limit) return "vòng";
    out.push(head.val);
  }
  return out;
}

function expected(vals, k) {
  const out = [];
  for (let i = 0; i < vals.length; i += k) {
    const chunk = vals.slice(i, i + k);
    out.push(...(chunk.length === k ? chunk.reverse() : chunk));
  }
  return out;
}

// Lặp: groupPrev đứng trước nhóm, kth là nút cuối nhóm.
function reverseKGroup(head, k) {
  const dummy = new ListNode(0, head);
  let groupPrev = dummy;
  for (;;) {
    let kth = groupPrev;
    for (let i = 0; i < k && kth !== null; i++) kth = kth.next;
    if (kth === null) return dummy.next;
    const groupNext = kth.next;
    let prev = groupNext, cur = groupPrev.next;
    while (cur !== groupNext) { const nxt = cur.next; cur.next = prev; prev = cur; cur = nxt; }
    const oldFirst = groupPrev.next;
    groupPrev.next = kth;
    groupPrev = oldFirst;
  }
}

// Đệ quy: sâu n/k tầng.
function reverseKGroupRecursive(head, k) {
  let probe = head;
  for (let i = 0; i < k; i++) { if (probe === null) return head; probe = probe.next; }
  let prev = reverseKGroupRecursive(probe, k), cur = head;
  for (let i = 0; i < k; i++) { const nxt = cur.next; cur.next = prev; prev = cur; cur = nxt; }
  return prev;
}

const cases = [
  ["ví dụ 1 của đề", [1, 2, 3, 4, 5], 2],
  ["ví dụ 2 của đề", [1, 2, 3, 4, 5], 3],
  ["k = 1", [1, 2, 3], 1],
  ["k = n", [1, 2, 3, 4], 4],
  ["một nút", [7], 1],
  ["hai nhóm đủ", [1, 2, 3, 4, 5, 6], 3],
  ["7 nút, k = 3", [1, 2, 3, 4, 5, 6, 7], 3],
  ["giá trị trùng", [5, 5, 6, 6, 7], 2],
];
for (const fn of [reverseKGroup, reverseKGroupRecursive]) {
  const bad = [];
  for (const [name, vals, k] of cases) {
    const got = JSON.stringify(toArray(fn(build(vals), k), 2 * vals.length + 2));
    if (got !== JSON.stringify(expected(vals, k))) bad.push(`${name} → ${got}`);
  }
  console.log(`${fn.name.padEnd(23)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(", ") : ""}`);
}

let total = 0, ok = 0;
for (let n = 1; n <= 12; n++) for (let k = 1; k <= n; k++) {
  total++;
  const vals = Array.from({ length: n }, (_, i) => i + 1);
  if (JSON.stringify(toArray(reverseKGroup(build(vals), k), 2 * n + 2)) === JSON.stringify(expected(vals, k))) ok++;
}
console.log(`\nmọi n ≤ 12, mọi k ≤ n: lặp ${ok}/${total}`);
