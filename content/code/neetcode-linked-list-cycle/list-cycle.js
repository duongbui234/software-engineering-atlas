// LC 141 Linked List Cycle: Set các nút đã thăm, rùa và thỏ (Floyd), tìm đầu vòng (LC 142), và bẫy dùng object thường làm tập.
// Chạy: node list-cycle.js

class ListNode {
  constructor(val) { this.val = val; this.next = null; }
}

function build(vals, pos) {
  const nodes = vals.map((v) => new ListNode(v));
  for (let i = 0; i + 1 < nodes.length; i++) nodes[i].next = nodes[i + 1];
  if (pos >= 0 && nodes.length > 0) nodes[nodes.length - 1].next = nodes[pos];
  return { head: nodes[0] ?? null, nodes };
}

// Cách 1: Set nhớ object theo danh tính.
function hasCycleSet(head) {
  const seen = new Set();
  for (let cur = head; cur !== null; cur = cur.next) {
    if (seen.has(cur)) return true;
    seen.add(cur);
  }
  return false;
}

// Cách 2: rùa và thỏ.
function hasCycleFloyd(head) {
  let slow = head, fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}

// LC 142: gặp nhau xong, đưa một con về đầu; cùng đi 1 bước, chỗ gặp lại là đầu vòng.
function detectCycle(head) {
  let slow = head, fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) {
      let a = head;
      while (a !== slow) { a = a.next; slow = slow.next; }
      return a;
    }
  }
  return null;
}

// SAI: object thường làm tập. Khóa của object luôn là chuỗi, mọi nút đều thành "[object Object]".
function wrongObjectSet(head) {
  const seen = {};
  for (let cur = head; cur !== null; cur = cur.next) {
    if (seen[cur]) return true;
    seen[cur] = true;
  }
  return false;
}

const cases = [
  ["ví dụ 1 của đề", [3, 2, 0, -4], 1, true],
  ["ví dụ 2 của đề", [1, 2], 0, true],
  ["ví dụ 3 của đề", [1], -1, false],
  ["rỗng", [], -1, false],
  ["một nút tự trỏ", [1], 0, true],
  ["giá trị trùng, không vòng", [1, 1, 1], -1, false],
  ["chẵn, không vòng", [1, 2, 3, 4, 5, 6], -1, false],
  ["lẻ, không vòng", [1, 2, 3, 4, 5], -1, false],
  ["nút cuối tự trỏ", [1, 2, 3, 4, 5], 4, true],
  ["toàn số 0, có vòng", [0, 0, 0, 0, 0], 1, true],
];

for (const fn of [hasCycleSet, hasCycleFloyd, wrongObjectSet]) {
  const bad = cases.filter(([, v, p, want]) => fn(build(v, p).head) !== want).map(([name]) => name);
  console.log(`${fn.name.padEnd(15)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(", ") : ""}`);
}
let ok = 0;
for (const [, v, p] of cases) {
  const { head, nodes } = build(v, p);
  if (detectCycle(head) === (p >= 0 ? nodes[p] : null)) ok++;
}
console.log(`${"detectCycle".padEnd(15)} ${ok}/${cases.length} ca đúng (LC 142)`);
console.log(`khóa object của một nút: ${JSON.stringify(Object.keys({ [new ListNode(7)]: 1 }))}`);
