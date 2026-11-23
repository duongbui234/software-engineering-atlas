// LC 206 Reverse Linked List: lật chiều mọi con trỏ next.
// Chạy: node reverse-list.js

class ListNode {
  constructor(val, next = null) { this.val = val; this.next = next; }
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

// Lặp: giữ next trước khi lật cur.next.
function reverseIterative(head) {
  let prev = null, cur = head;
  while (cur) {
    const next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
  }
  return prev;
}

// Hoán đổi bằng destructuring: vế phải tính xong trước khi gán.
function reverseDestructuring(head) {
  let prev = null, cur = head;
  while (cur) [cur.next, prev, cur] = [prev, cur, cur.next];
  return prev;
}

// Đệ quy: mỗi nút một khung trên ngăn xếp gọi hàm của V8.
function reverseRecursive(head) {
  if (!head || !head.next) return head;
  const newHead = reverseRecursive(head.next);
  head.next.next = head;
  head.next = null;
  return newHead;
}

const cases = [[1, 2, 3, 4, 5], [1, 2], [], [1], [3, 3, 1], Array.from({ length: 5000 }, (_, i) => i)];
for (const fn of [reverseIterative, reverseDestructuring, reverseRecursive]) {
  const ok = cases.filter((c) => toArray(fn(fromArray(c))).join() === [...c].reverse().join()).length;
  console.log(`${fn.name.padEnd(20)} ${ok}/${cases.length} ca đúng`);
}

function bench(fn, n) {
  const ts = [];
  for (let r = 0; r < 5; r++) {
    const h = fromArray(Array.from({ length: n }, (_, i) => i));
    const t0 = performance.now();
    fn(h);
    ts.push(performance.now() - t0);
  }
  return ts.sort((x, y) => x - y)[2].toFixed(2);
}
console.log(`n = 10⁶: lặp ${bench(reverseIterative, 1e6)} ms, destructuring ${bench(reverseDestructuring, 1e6)} ms`);
