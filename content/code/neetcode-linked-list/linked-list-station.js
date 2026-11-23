// Ga LINK-01: con trỏ trên danh sách liên kết. Giải 206, 21, 141, 143, 19.
// Chạy: node linked-list-station.js

class ListNode {
  constructor(val = 0, next = null) { this.val = val; this.next = next; }
}

const fromArray = (a) => a.reduceRight((next, v) => new ListNode(v, next), null);

function toArray(head) {
  const out = [];
  for (let p = head; p; p = p.next) out.push(p.val);
  return out;
}

function withCycle(a, pos) {
  const head = fromArray(a);
  if (pos < 0 || !head) return head;
  let tail = head, target = null, i = 0;
  for (let p = head; p; p = p.next, i++) { if (i === pos) target = p; tail = p; }
  tail.next = target;
  return head;
}

// 206: lật từng con trỏ.
function reverseList(head) {
  let prev = null, cur = head;
  while (cur) { const next = cur.next; cur.next = prev; prev = cur; cur = next; }
  return prev;
}

// 21: nút giả đứng trước kết quả.
function mergeTwoLists(a, b) {
  const dummy = new ListNode();
  let tail = dummy;
  while (a && b) {
    if (a.val <= b.val) { tail.next = a; a = a.next; } else { tail.next = b; b = b.next; }
    tail = tail.next;
  }
  tail.next = a ?? b;
  return dummy.next;
}

// 141: === so hai tham chiếu, tức cùng một đối tượng.
function hasCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}

// 143: tìm giữa, lật nửa sau, đan hai nửa.
function reorderList(head) {
  if (!head || !head.next) return;
  let slow = head, fast = head;
  while (fast.next && fast.next.next) { slow = slow.next; fast = fast.next.next; }
  let second = reverseList(slow.next);
  slow.next = null;
  let first = head;
  while (second) {
    const n1 = first.next, n2 = second.next;
    first.next = second;
    second.next = n1;
    first = n1;
    second = n2;
  }
}

// 19: nút giả, con trước đi trước n + 1 bước.
function removeNthFromEnd(head, n) {
  const dummy = new ListNode(0, head);
  let lead = dummy, lag = dummy;
  for (let i = 0; i <= n; i++) lead = lead.next;
  while (lead) { lead = lead.next; lag = lag.next; }
  lag.next = lag.next.next;
  return dummy.next;
}

const reordered = (a) => { const h = fromArray(a); reorderList(h); return toArray(h); };
const cases = [
  ["206 ví dụ", () => toArray(reverseList(fromArray([1, 2, 3, 4, 5]))), [5, 4, 3, 2, 1]],
  ["206 rỗng", () => toArray(reverseList(null)), []],
  ["21 ví dụ", () => toArray(mergeTwoLists(fromArray([1, 2, 4]), fromArray([1, 3, 4]))), [1, 1, 2, 3, 4, 4]],
  ["21 hai rỗng", () => toArray(mergeTwoLists(null, null)), []],
  ["21 một rỗng", () => toArray(mergeTwoLists(null, fromArray([0]))), [0]],
  ["141 vòng về nút 1", () => hasCycle(withCycle([3, 2, 0, -4], 1)), true],
  ["141 vòng về nút 0", () => hasCycle(withCycle([1, 2], 0)), true],
  ["141 không vòng", () => hasCycle(withCycle([1], -1)), false],
  ["143 chẵn", () => reordered([1, 2, 3, 4]), [1, 4, 2, 3]],
  ["143 lẻ", () => reordered([1, 2, 3, 4, 5]), [1, 5, 2, 4, 3]],
  ["143 một nút", () => reordered([1]), [1]],
  ["19 ví dụ", () => toArray(removeNthFromEnd(fromArray([1, 2, 3, 4, 5]), 2)), [1, 2, 3, 5]],
  ["19 xóa nút duy nhất", () => toArray(removeNthFromEnd(fromArray([1]), 1)), []],
  ["19 xóa nút đầu", () => toArray(removeNthFromEnd(fromArray([1, 2]), 2)), [2]],
];
const bad = cases.filter(([, f, want]) => JSON.stringify(f()) !== JSON.stringify(want)).map(([name]) => name);
console.log(`linked-list-station ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(", ") : ""}`);
