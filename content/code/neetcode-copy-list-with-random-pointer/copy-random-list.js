// LC 138 Copy List with Random Pointer: Map cũ → mới, đan nút, và bẫy dùng object thường {} làm bảng.
// Chạy: node copy-random-list.js

class Node {
  constructor(val) { this.val = val; this.next = null; this.random = null; }
}

function build(spec) {
  const nodes = spec.map(([v]) => new Node(v));
  nodes.forEach((n, i) => { n.next = nodes[i + 1] ?? null; n.random = spec[i][1] === null ? null : nodes[spec[i][1]]; });
  return nodes[0] ?? null;
}

function toSpec(head) {
  const nodes = [];
  for (let cur = head; cur !== null && nodes.length <= 100000; cur = cur.next) nodes.push(cur);
  const index = new Map(nodes.map((n, i) => [n, i]));
  return nodes.map((n) => [n.val, n.random === null ? null : index.get(n.random) ?? -1]);
}

// Cách 1: Map nút cũ → nút mới, hai lượt. Map so khóa object bằng danh tính.
function copyTwoPass(head) {
  const map = new Map();
  for (let cur = head; cur !== null; cur = cur.next) map.set(cur, new Node(cur.val));
  for (let cur = head; cur !== null; cur = cur.next) {
    map.get(cur).next = cur.next === null ? null : map.get(cur.next);
    map.get(cur).random = cur.random === null ? null : map.get(cur.random);
  }
  return head === null ? null : map.get(head);
}

// Cách 3: đan bản sao sau nút gốc, đặt random, tách ra.
function copyInterleave(head) {
  if (head === null) return null;
  for (let cur = head; cur !== null; cur = cur.next.next) {
    const c = new Node(cur.val);
    c.next = cur.next;
    cur.next = c;
  }
  for (let cur = head; cur !== null; cur = cur.next.next) cur.next.random = cur.random === null ? null : cur.random.next;
  const newHead = head.next;
  for (let cur = head; cur !== null; cur = cur.next) {
    const c = cur.next;
    cur.next = c.next;
    c.next = c.next === null ? null : c.next.next;
  }
  return newHead;
}

// SAI: object thường {} làm bảng. Khóa object bị đổi thành chuỗi "[object Object]", nên mọi nút chung một ô.
function wrongObjectMap(head) {
  const map = {};
  for (let cur = head; cur !== null; cur = cur.next) map[cur] = new Node(cur.val);
  for (let cur = head; cur !== null; cur = cur.next) {
    map[cur].next = cur.next === null ? null : map[cur.next];
    map[cur].random = cur.random === null ? null : map[cur.random];
  }
  return head === null ? null : map[head];
}

function check(fn, spec) {
  const head = build(spec);
  const originals = new Set();
  for (let cur = head; cur !== null; cur = cur.next) originals.add(cur);
  const c = fn(head);
  for (let cur = c, steps = 0; cur !== null && steps <= spec.length + 1; cur = cur.next, steps++) {
    if (originals.has(cur) || (cur.random !== null && originals.has(cur.random))) return "dùng chung nút với danh sách gốc";
  }
  if (JSON.stringify(toSpec(c)) !== JSON.stringify(spec)) return "sai cấu trúc";
  if (JSON.stringify(toSpec(head)) !== JSON.stringify(spec)) return "danh sách gốc bị đổi";
  return null;
}

const cases = [
  ["ví dụ 1 của đề", [[7, null], [13, 0], [11, 4], [10, 2], [1, 0]]],
  ["ví dụ 2", [[1, 1], [2, 1]]],
  ["ví dụ 3 (giá trị trùng)", [[3, null], [3, 0], [3, null]]],
  ["rỗng", []],
  ["một nút tự trỏ", [[5, 0]]],
  ["mọi random null", [[1, null], [2, null], [3, null]]],
  ["mọi random trỏ nút cuối", [[1, 3], [2, 3], [3, 3], [4, 3]]],
];

for (const fn of [copyTwoPass, copyInterleave, wrongObjectMap]) {
  const bad = cases.flatMap(([name, spec]) => { const e = check(fn, spec); return e === null ? [] : [`${name} → ${e}`]; });
  console.log(`${fn.name.padEnd(15)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(", ") : ""}`);
}
console.log(`\nkhóa mà {} thực sự lưu cho một nút: ${JSON.stringify(Object.keys({ [new Node(1)]: 1 }))}`);
