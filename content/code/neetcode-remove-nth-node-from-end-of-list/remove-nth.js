// LeetCode 19: Remove Nth Node From End of List. Chạy: node remove-nth.js

class ListNode {
  constructor(val, next = null) { this.val = val; this.next = next; }
}
const fromArray = (a) => a.reduceRight((next, v) => new ListNode(v, next), null);
const toArray = (h) => { const out = []; for (; h; h = h.next) out.push(h.val); return out; };

// Hai lượt: đếm độ dài, rồi đi L − n bước từ nút giả.
function twoPass(head, n) {
  let len = 0;
  for (let p = head; p; p = p.next) len++;
  const dummy = new ListNode(0, head);
  let prev = dummy;
  for (let i = 0; i < len - n; i++) prev = prev.next;
  prev.next = prev.next.next;
  return dummy.next;
}

// Một lượt: fast đi trước n + 1 bước từ nút giả, rồi hai con trỏ cùng đi.
function onePass(head, n) {
  const dummy = new ListNode(0, head);
  let fast = dummy, slow = dummy;
  for (let i = 0; i <= n; i++) fast = fast.next;
  while (fast) { fast = fast.next; slow = slow.next; }
  slow.next = slow.next.next;
  return dummy.next;
}

// SAI: không có nút giả; n = L thì fast là null và đọc fast.next ném TypeError.
function wrongNoDummy(head, n) {
  let fast = head, slow = head;
  for (let i = 0; i < n; i++) fast = fast.next;
  while (fast.next) { fast = fast.next; slow = slow.next; }
  slow.next = slow.next.next;
  return head;
}

const cases = [[[1, 2, 3, 4, 5], 2], [[1], 1], [[1, 2], 1], [[1, 2], 2], [[1, 2, 3], 3],
  [[1, 2, 3], 1], [[5, 6, 7, 8], 3], [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5]];
const show = (a) => `[${a.join(",")}]`;
for (const fn of [twoPass, onePass, wrongNoDummy]) {
  const bad = [];
  for (const [a, n] of cases) {
    let got;
    try { got = show(toArray(fn(fromArray(a), n))); } catch (e) { got = e.constructor.name; }
    if (got !== show(a.filter((_, i) => i !== a.length - n))) bad.push(`${show(a)} n=${n} → ${got}`);
  }
  console.log(`${fn.name.padEnd(12)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(", ") : ""}`);
}
