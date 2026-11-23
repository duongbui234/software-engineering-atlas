// LeetCode 21: Merge Two Sorted Lists. Chạy: node merge-two-lists.js

class ListNode {
  constructor(val, next = null) { this.val = val; this.next = next; }
}
const fromArray = (a) => a.reduceRight((next, v) => new ListNode(v, next), null);
const toArray = (h) => { const out = []; for (; h; h = h.next) out.push(h.val); return out; };

// Nút giả đứng trước đầu kết quả; "a ?? b" nối nguyên phần còn lại.
function mergeDummy(a, b) {
  const dummy = new ListNode(0);
  let tail = dummy;
  while (a && b) {
    if (a.val <= b.val) { tail.next = a; a = a.next; }
    else { tail.next = b; b = b.next; }
    tail = tail.next;
  }
  tail.next = a ?? b;
  return dummy.next;
}

function mergeRecursive(a, b) {
  if (!a) return b;
  if (!b) return a;
  if (a.val <= b.val) { a.next = mergeRecursive(a.next, b); return a; }
  b.next = mergeRecursive(a, b.next);
  return b;
}

// SAI: gom vào mảng rồi sort() không có hàm so sánh: so theo chuỗi, "10" đứng trước "2".
function wrongConcatDefaultSort(a, b) {
  return fromArray([...toArray(a), ...toArray(b)].sort());
}

const cases = [
  [[1, 2, 4], [1, 3, 4]], [[], []], [[], [0]], [[5], [1, 2, 3]], [[1, 2, 3], []],
  [[-100, 0, 100], [-100, -50]], [[2, 2, 2], [2, 2]], [[1, 5, 9], [2, 3, 4, 6, 7, 8, 10]],
];
const show = (a) => `[${a.join(",")}]`;
for (const fn of [mergeDummy, mergeRecursive, wrongConcatDefaultSort]) {
  const bad = cases
    .filter(([a, b]) => show(toArray(fn(fromArray(a), fromArray(b)))) !== show([...a, ...b].sort((x, y) => x - y)))
    .map(([a, b]) => `${show(a)}+${show(b)} → ${show(toArray(fn(fromArray(a), fromArray(b))))}`);
  console.log(`${fn.name.padEnd(22)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(", ") : ""}`);
}
