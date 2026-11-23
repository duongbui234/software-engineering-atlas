// LC 23 Merge k Sorted Lists: heap tự viết (JS không có sẵn) và chia để trị từng cặp.
// Chạy: node merge-k-lists.js

class ListNode {
  constructor(val, next = null) { this.val = val; this.next = next; }
}

function build(vals) {
  let head = null;
  for (let i = vals.length - 1; i >= 0; i--) head = new ListNode(vals[i], head);
  return head;
}

function toArray(head) {
  const out = [];
  for (; head !== null; head = head.next) out.push(head.val);
  return out;
}

function mergeTwo(a, b) {
  const dummy = new ListNode(0);
  let tail = dummy;
  while (a !== null && b !== null) {
    if (a.val <= b.val) { tail.next = a; a = a.next; } else { tail.next = b; b = b.next; }
    tail = tail.next;
  }
  tail.next = a !== null ? a : b;
  return dummy.next;
}

// Heap k đầu danh sách, mảng nhị phân tự viết.
function mergeHeap(lists) {
  const h = lists.filter((l) => l !== null);
  const less = (i, j) => h[i].val < h[j].val;
  const swap = (i, j) => { const t = h[i]; h[i] = h[j]; h[j] = t; };
  const down = (i) => {
    for (;;) {
      const l = 2 * i + 1, r = l + 1;
      let m = i;
      if (l < h.length && less(l, m)) m = l;
      if (r < h.length && less(r, m)) m = r;
      if (m === i) return;
      swap(m, i);
      i = m;
    }
  };
  for (let i = (h.length >> 1) - 1; i >= 0; i--) down(i);
  const dummy = new ListNode(0);
  let tail = dummy;
  while (h.length > 0) {
    const node = h[0];
    tail.next = node;
    tail = node;
    // thay đỉnh bằng nút kế của chính danh sách đó; hết thì lấy phần tử cuối lên
    if (node.next !== null) h[0] = node.next;
    else { const last = h.pop(); if (h.length > 0) h[0] = last; }
    if (h.length > 0) down(0);
  }
  return dummy.next;
}

// Chia để trị: trộn từng cặp cho tới khi còn một danh sách.
function mergeDivide(lists) {
  if (lists.length === 0) return null;
  let cur = lists.slice();
  while (cur.length > 1) {
    const next = [];
    for (let i = 0; i < cur.length; i += 2) next.push(i + 1 < cur.length ? mergeTwo(cur[i], cur[i + 1]) : cur[i]);
    cur = next;
  }
  return cur[0];
}

// SAI: gom rồi sort() mặc định so theo chuỗi.
function wrongDefaultSort(lists) {
  const vals = [];
  for (const l of lists) for (let cur = l; cur !== null; cur = cur.next) vals.push(cur.val);
  return build(vals.sort());
}

const cases = [
  ["ví dụ của đề", [[1, 4, 5], [1, 3, 4], [2, 6]]],
  ["không có danh sách", []],
  ["một danh sách rỗng", [[]]],
  ["rỗng xen kẽ", [[], [1], [], [0, 2]]],
  ["một danh sách", [[1, 2, 3]]],
  ["số âm", [[-10, -5, 0], [-3, 10]]],
  ["9 và 10", [[9], [10], [2]]],
  ["20 danh sách 1 phần tử", Array.from({ length: 20 }, (_, i) => [(i * 7) % 20])],
  ["trùng hết", [[5, 5], [5], [5, 5, 5]]],
];
for (const fn of [mergeHeap, mergeDivide, wrongDefaultSort]) {
  const bad = [];
  for (const [name, input] of cases) {
    const want = JSON.stringify(input.flat().sort((x, y) => x - y));
    const got = JSON.stringify(toArray(fn(input.map(build))));
    if (got !== want) bad.push(`${name} → ${got}`);
  }
  console.log(`${fn.name.padEnd(17)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(", ") : ""}`);
}
