// LC 2 Add Two Numbers: cộng từng chữ số có nhớ với nút giả, đổi ra số (Number, BigInt), và LC 445 (chữ số xuôi).
// Chạy: node add-two-numbers.ts

class ListNode {
  val: number;
  next: ListNode | null = null;
  constructor(val: number, next: ListNode | null = null) { this.val = val; this.next = next; }
}

function build(digits: number[]): ListNode | null {
  let head: ListNode | null = null;
  for (let i = digits.length - 1; i >= 0; i--) head = new ListNode(digits[i], head);
  return head;
}
function toArray(head: ListNode | null): number[] {
  const out: number[] = [];
  for (let cur = head; cur !== null; cur = cur.next) out.push(cur.val);
  return out;
}

// Cách chuẩn: cộng từng cặp chữ số từ hàng đơn vị, mang số nhớ sang nút sau. Nút giả giữ đầu kết quả.
function addDigits(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  const dummy = new ListNode(0);
  let tail = dummy, carry = 0;
  // chạy tiếp khi còn chữ số ở một bên HOẶC còn nhớ
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

// SAI: dừng khi cả hai danh sách hết, quên số nhớ cuối cùng. [9,9] + [1] ra [0,0] thay vì [0,0,1].
function wrongNoFinalCarry(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  const dummy = new ListNode(0);
  let tail = dummy, carry = 0;
  while (l1 !== null || l2 !== null) {
    const sum = (l1?.val ?? 0) + (l2?.val ?? 0) + carry;
    carry = Math.floor(sum / 10);
    tail.next = new ListNode(sum % 10);
    tail = tail.next;
    l1 = l1?.next ?? null;
    l2 = l2?.next ?? null;
  }
  return dummy.next;
}

// SAI: đổi mỗi danh sách ra Number, cộng, rồi tách chữ số. Number chỉ chính xác tới 2^53, và quá 1e21 thì String() ra dạng mũ.
function wrongViaNumber(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  const toNum = (l: ListNode | null) => { let n = 0, p = 1; for (; l !== null; l = l.next, p *= 10) n += l.val * p; return n; };
  const s = String(toNum(l1) + toNum(l2));
  return build([...s].reverse().map(Number));
}

// Đúng nhưng vòng vèo: đổi ra BigInt (số nguyên không giới hạn), cộng, đổi lại.
function viaBigInt(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  const toBig = (l: ListNode | null) => BigInt(toArray(l).reverse().join("") || "0");
  const s = (toBig(l1) + toBig(l2)).toString();
  return build([...s].reverse().map(Number));
}

// LC 445: chữ số xếp xuôi (hàng cao nhất ở đầu). Đẩy chữ số vào hai ngăn xếp rồi cộng từ đỉnh, chèn kết quả vào ĐẦU.
function addForward(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  const s1 = toArray(l1), s2 = toArray(l2);
  let head: ListNode | null = null, carry = 0;
  while (s1.length > 0 || s2.length > 0 || carry !== 0) {
    const sum = (s1.pop() ?? 0) + (s2.pop() ?? 0) + carry;
    carry = Math.floor(sum / 10);
    head = new ListNode(sum % 10, head);
  }
  return head;
}

// Đáp án tham chiếu: cộng hai mảng chữ số (hàng đơn vị trước) như trên giấy.
function reference(a: number[], b: number[]): number[] {
  const out: number[] = [];
  let carry = 0;
  for (let i = 0; i < Math.max(a.length, b.length) || carry; i++) {
    const s = (a[i] ?? 0) + (b[i] ?? 0) + carry;
    out.push(s % 10);
    carry = Math.floor(s / 10);
  }
  return out;
}

// ---- Bộ sinh ngẫu nhiên mulberry32 ----
function mulberry32(seed: number): () => number {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
// Số ngẫu nhiên n chữ số, hàng đơn vị trước; chữ số cao nhất khác 0 (trừ số 0).
function randomDigits(rand: () => number, n: number): number[] {
  const d = Array.from({ length: n }, () => Math.floor(rand() * 10));
  if (n > 1 && d[n - 1] === 0) d[n - 1] = 1 + Math.floor(rand() * 9);
  return d;
}

const rand = mulberry32(2);
const cases: [string, number[], number[]][] = [
  ["ví dụ 1 của đề", [2, 4, 3], [5, 6, 4]],
  ["ví dụ 2", [0], [0]],
  ["ví dụ 3", [9, 9, 9, 9, 9, 9, 9], [9, 9, 9, 9]],
  ["[9,9] + [1]", [9, 9], [1]],
  ["dài lệch nhau", [1], [9, 9, 9, 9, 9, 8]],
  ["16 chữ số", randomDigits(rand, 16), randomDigits(rand, 16)],
  ["100 chữ số (giới hạn đề)", randomDigits(rand, 100), randomDigits(rand, 100)],
];

const short = (a: number[]) => (a.length > 12 ? `[${a.slice(0, 5).join(",")},…] (${a.length} chữ số)` : `[${a.join(",")}]`);
for (const fn of [addDigits, wrongNoFinalCarry, wrongViaNumber, viaBigInt]) {
  const bad: string[] = [];
  for (const [name, a, b] of cases) {
    const got = toArray(fn(build(a), build(b)));
    if (got.join(",") !== reference(a, b).join(",")) bad.push(`${name} → ${short(got)}`);
  }
  console.log(`${fn.name.padEnd(17)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(", ") : ""}`);
}

// Đối chiếu ngẫu nhiên: 10 000 cặp dài 1..100 chữ số.
{
  const r = mulberry32(22);
  let ok = 0, okNum = 0;
  for (let t = 0; t < 10000; t++) {
    const a = randomDigits(r, 1 + Math.floor(r() * 100)), b = randomDigits(r, 1 + Math.floor(r() * 100));
    const want = reference(a, b).join(",");
    if (toArray(addDigits(build(a), build(b))).join(",") === want && toArray(viaBigInt(build(a), build(b))).join(",") === want) ok++;
    if (toArray(wrongViaNumber(build(a), build(b))).join(",") === want) okNum++;
  }
  console.log(`\nngẫu nhiên, 10000 cặp 1..100 chữ số: addDigits và viaBigInt đúng ${ok}/10000; wrongViaNumber đúng ${okNum}/10000`);
}

// Number đúng tới đâu: 2^53 + 1 và một số 17 chữ số cộng 0 (chữ số đọc xuôi cho dễ nhìn).
for (const [x, y] of [["9007199254740992", "1"], ["12345678901234567", "0"], ["1234567890123456789012", "0"]]) {
  const d = (s: string) => [...s].reverse().map(Number);
  const got = toArray(wrongViaNumber(build(d(x)), build(d(y)))).reverse().join("");
  console.log(`${x} + ${y} qua Number: ${got} (đúng: ${(BigInt(x) + BigInt(y)).toString()})`);
}

// LC 445: chữ số xuôi.
{
  const got = toArray(addForward(build([7, 2, 4, 3]), build([5, 6, 4])));
  console.log(`\nLC 445, [7,2,4,3] + [5,6,4] (chữ số xuôi): [${got.join(",")}]`);
}

// ---- Đo: cộng từng chữ số so với đổi qua BigInt ----
function bench(fn: (a: ListNode | null, b: ListNode | null) => ListNode | null, a: number[], b: number[]): number {
  const ts: number[] = [];
  for (let r = 0; r < 5; r++) {
    const l1 = build(a), l2 = build(b);
    const t0 = performance.now();
    fn(l1, l2);
    ts.push(performance.now() - t0);
  }
  return ts.sort((x, y) => x - y)[2];
}
console.log("\nn chữ số   từng chữ số     qua BigInt");
for (const n of [1e3, 1e4, 1e5, 1e6]) {
  const a = randomDigits(rand, n), b = randomDigits(rand, n);
  console.log(`${String(n).padEnd(10)} ${bench(addDigits, a, b).toFixed(2).padStart(8)} ms   ${bench(viaBigInt, a, b).toFixed(2).padStart(9)} ms`);
}
