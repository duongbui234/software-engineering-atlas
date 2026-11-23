// LC 2 Add Two Numbers: cộng từng chữ số có nhớ, và bẫy đưa chữ số dạng chuỗi vào ("4" + "6" là nối chuỗi).
// Chạy: node add-two-numbers.js

class ListNode {
  constructor(val, next = null) { this.val = val; this.next = next; }
}

const build = (d) => d.reduceRight((head, v) => new ListNode(v, head), null);
function toArray(h) { const out = []; for (; h !== null; h = h.next) out.push(h.val); return out; }

// Cách chuẩn: cộng từng cặp chữ số, mang số nhớ sang nút sau, nút giả giữ đầu kết quả.
function addDigits(l1, l2) {
  const dummy = new ListNode(0);
  let tail = dummy, carry = 0;
  while (l1 !== null || l2 !== null || carry !== 0) {
    const sum = (l1?.val ?? 0) + (l2?.val ?? 0) + carry;
    carry = Math.floor(sum / 10);
    tail.next = new ListNode(sum % 10);
    tail = tail.next;
    l1 = l1?.next ?? null;
    l2 = l2?.next ?? null;
  }
  return dummy.next;
}

function reference(a, b) {
  const out = [];
  let carry = 0;
  for (let i = 0; i < Math.max(a.length, b.length) || carry; i++) {
    const s = Number(a[i] ?? 0) + Number(b[i] ?? 0) + carry;
    out.push(s % 10);
    carry = Math.floor(s / 10);
  }
  return out;
}

// Chữ số tách từ chuỗi input "342" → ["2","4","3"]. Cùng một hàm addDigits: lần đầu đổi sang số, lần sau quên đổi.
const digitsOf = (s) => [...s].reverse();
const cases = [["ví dụ 1 của đề", "342", "465"], ["ví dụ 2", "0", "0"], ["ví dụ 3", "9999999", "9999"], ["[9,9] + [1]", "99", "1"], ["dài lệch nhau", "1", "899999"]];

for (const [label, conv] of [["addDigits (số)", (d) => d.map(Number)], ["addDigits (chuỗi)", (d) => d]]) {
  const bad = [];
  for (const [name, x, y] of cases) {
    const a = digitsOf(x), b = digitsOf(y);
    const got = toArray(addDigits(build(conv(a)), build(conv(b))));
    if (got.join(",") !== reference(a, b).join(",")) bad.push(`${name} → [${got.join(",")}]`);
  }
  console.log(`${label.padEnd(18)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(", ") : ""}`);
}
console.log(`\n"4" + "6" + 0 = ${JSON.stringify("4" + "6" + 0)}; Math.floor(${JSON.stringify("4" + "6" + 0)} / 10) = ${Math.floor(("4" + "6" + 0) / 10)}`);
