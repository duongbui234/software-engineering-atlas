// LC 25 Reverse Nodes in k-Group: lặp với nút giả và groupPrev, đệ quy, mảng các nút, và ba bản sai.
// Chạy: node reverse-k-group.ts

class ListNode {
  val: number;
  next: ListNode | null = null;
  constructor(val: number) { this.val = val; }
}

function build(vals: number[]): ListNode | null {
  let head: ListNode | null = null;
  for (let i = vals.length - 1; i >= 0; i--) { const n = new ListNode(vals[i]); n.next = head; head = n; }
  return head;
}

// Đọc danh sách ra mảng; đi quá limit bước thì coi là có vòng.
function toArray(head: ListNode | null, limit: number): number[] | "vòng" {
  const out: number[] = [];
  for (let cur = head; cur !== null; cur = cur.next) {
    if (out.length >= limit) return "vòng";
    out.push(cur.val);
  }
  return out;
}

// Đáp án mong đợi: đảo từng khúc đủ k phần tử, khúc cuối thiếu thì giữ nguyên.
function expected(vals: number[], k: number): number[] {
  const out: number[] = [];
  for (let i = 0; i < vals.length; i += k) {
    const chunk = vals.slice(i, i + k);
    out.push(...(chunk.length === k ? chunk.reverse() : chunk));
  }
  return out;
}

// Cách 1: lặp, O(1) bộ nhớ thêm. groupPrev là nút đứng ngay trước nhóm sắp đảo.
function reverseKGroup(head: ListNode | null, k: number): ListNode | null {
  const dummy = new ListNode(0);
  dummy.next = head;
  let groupPrev = dummy;
  for (;;) {
    // đi trước k bước tìm nút cuối nhóm; không đủ k nút thì dừng, khúc cuối giữ nguyên
    let kth: ListNode | null = groupPrev;
    for (let i = 0; i < k && kth !== null; i++) kth = kth.next;
    if (kth === null) break;
    const groupNext = kth.next;
    // đảo nhóm: prev bắt đầu từ groupNext, nên nút đầu nhóm cũ trỏ thẳng sang nhóm sau
    let prev: ListNode | null = groupNext, cur = groupPrev.next;
    while (cur !== groupNext) { const nxt: ListNode | null = cur!.next; cur!.next = prev; prev = cur; cur = nxt; }
    // nối: nút đầu nhóm cũ giờ là nút cuối, và là groupPrev của nhóm sau
    const oldFirst = groupPrev.next!;
    groupPrev.next = kth;
    groupPrev = oldFirst;
  }
  return dummy.next;
}

// Cách 2: đệ quy. Đảo k nút đầu, rồi nối đuôi nhóm vào kết quả đệ quy của phần còn lại. Sâu n/k tầng.
function reverseKGroupRecursive(head: ListNode | null, k: number): ListNode | null {
  let probe = head;
  for (let i = 0; i < k; i++) { if (probe === null) return head; probe = probe.next; }
  let prev: ListNode | null = reverseKGroupRecursive(probe, k), cur = head;
  for (let i = 0; i < k; i++) { const nxt: ListNode | null = cur!.next; cur!.next = prev; prev = cur; cur = nxt; }
  return prev;
}

// Cách 3: chép các nút vào mảng, đảo từng khúc trong mảng, rồi nối lại. O(n) bộ nhớ thêm.
function reverseKGroupArray(head: ListNode | null, k: number): ListNode | null {
  const nodes: ListNode[] = [];
  for (let cur = head; cur !== null; cur = cur.next) nodes.push(cur);
  for (let i = 0; i + k <= nodes.length; i += k) {
    for (let a = i, b = i + k - 1; a < b; a++, b--) { const t = nodes[a]; nodes[a] = nodes[b]; nodes[b] = t; }
  }
  for (let i = 0; i + 1 < nodes.length; i++) nodes[i].next = nodes[i + 1];
  if (nodes.length > 0) nodes[nodes.length - 1].next = null;
  return nodes.length > 0 ? nodes[0] : null;
}

// SAI: đảo cả khúc cuối thiếu k nút.
function wrongReverseTail(head: ListNode | null, k: number): ListNode | null {
  const dummy = new ListNode(0);
  dummy.next = head;
  let groupPrev = dummy;
  while (groupPrev.next !== null) {
    let kth: ListNode = groupPrev;
    for (let i = 0; i < k && kth.next !== null; i++) kth = kth.next; // thiếu nút thì dừng ở nút cuối, vẫn đảo
    const groupNext = kth.next;
    let prev: ListNode | null = groupNext, cur = groupPrev.next;
    while (cur !== groupNext) { const nxt: ListNode | null = cur!.next; cur!.next = prev; prev = cur; cur = nxt; }
    const oldFirst = groupPrev.next!;
    groupPrev.next = kth;
    groupPrev = oldFirst;
  }
  return dummy.next;
}

// SAI: đảo nhóm với prev = null, nên đuôi nhóm trỏ null và mất đường sang nhóm sau.
function wrongLoseNext(head: ListNode | null, k: number): ListNode | null {
  const dummy = new ListNode(0);
  dummy.next = head;
  let groupPrev = dummy;
  for (;;) {
    let kth: ListNode | null = groupPrev;
    for (let i = 0; i < k && kth !== null; i++) kth = kth.next;
    if (kth === null) break;
    const groupNext = kth.next;
    let prev: ListNode | null = null, cur = groupPrev.next;
    while (cur !== groupNext) { const nxt: ListNode | null = cur!.next; cur!.next = prev; prev = cur; cur = nxt; }
    const oldFirst = groupPrev.next!;
    groupPrev.next = kth;
    groupPrev = oldFirst;
  }
  return dummy.next;
}

// SAI: quên dời groupPrev sang cuối nhóm vừa đảo. Vòng sau đảo lại đúng nhóm đầu, mãi mãi.
// File chặn ở 1000 vòng và báo "không dừng" thay vì treo.
function wrongNoGroupPrevMove(head: ListNode | null, k: number): ListNode | null {
  const dummy = new ListNode(0);
  dummy.next = head;
  const groupPrev = dummy;
  for (let round = 0; ; round++) {
    if (round === 1000) throw new Error("không dừng");
    let kth: ListNode | null = groupPrev;
    for (let i = 0; i < k && kth !== null; i++) kth = kth.next;
    if (kth === null) break;
    const groupNext = kth.next;
    let prev: ListNode | null = groupNext, cur = groupPrev.next;
    while (cur !== groupNext) { const nxt: ListNode | null = cur!.next; cur!.next = prev; prev = cur; cur = nxt; }
    groupPrev.next = kth;
    // thiếu: groupPrev = nút đầu nhóm cũ
    if (groupNext === null) break;
  }
  return dummy.next;
}

const cases: [string, number[], number][] = [
  ["ví dụ 1 của đề", [1, 2, 3, 4, 5], 2],
  ["ví dụ 2 của đề", [1, 2, 3, 4, 5], 3],
  ["k = 1", [1, 2, 3], 1],
  ["k = n", [1, 2, 3, 4], 4],
  ["một nút", [7], 1],
  ["hai nhóm đủ", [1, 2, 3, 4, 5, 6], 3],
  ["7 nút, k = 3", [1, 2, 3, 4, 5, 6, 7], 3],
  ["giá trị trùng", [5, 5, 6, 6, 7], 2],
];

const fns = [reverseKGroup, reverseKGroupRecursive, reverseKGroupArray, wrongReverseTail, wrongLoseNext, wrongNoGroupPrevMove];
for (const fn of fns) {
  const bad: string[] = [];
  for (const [name, vals, k] of cases) {
    let s: string;
    try {
      const got = toArray(fn(build(vals), k), 2 * vals.length + 2);
      s = got === "vòng" ? "vòng" : `[${got.join(",")}]`;
    } catch (e) {
      s = (e as Error).message === "không dừng" ? "không dừng" : "ném " + (e as Error).constructor.name;
    }
    if (s !== `[${expected(vals, k).join(",")}]`) bad.push(`${name} → ${s}`);
  }
  console.log(`${fn.name.padEnd(22)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(", ") : ""}`);
}

// Kiểm vét: mọi n từ 1 tới 12, mọi k từ 1 tới n (78 bộ), danh sách 1..n.
{
  let total = 0;
  const ok = [0, 0, 0];
  for (let n = 1; n <= 12; n++) for (let k = 1; k <= n; k++) {
    total++;
    const vals = Array.from({ length: n }, (_, i) => i + 1);
    const want = JSON.stringify(expected(vals, k));
    [reverseKGroup, reverseKGroupRecursive, reverseKGroupArray].forEach((fn, j) => {
      if (JSON.stringify(toArray(fn(build(vals), k), 2 * n + 2)) === want) ok[j]++;
    });
  }
  console.log(`\nmọi n ≤ 12, mọi k ≤ n: lặp ${ok[0]}/${total}, đệ quy ${ok[1]}/${total}, mảng ${ok[2]}/${total}`);
}

// Độ sâu đệ quy: cách đệ quy sâu n/k tầng. Tìm n lớn nhất chạy được với k = 1 và k = 2.
for (const k of [1, 2]) {
  let lo = 1, hi = 1 << 20;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    try { reverseKGroupRecursive(build(Array.from({ length: mid }, (_, i) => i)), k); lo = mid; } catch { hi = mid - 1; }
  }
  console.log(`đệ quy, k = ${k}: chạy được tới n = ${lo} (sâu ${Math.floor(lo / k)} tầng)`);
}

// Đo: n = 10⁶ nút, trung vị 5 lần. Mỗi lần dựng lại danh sách (không tính giờ).
function timeIt(fn: (h: ListNode | null, k: number) => ListNode | null, n: number, k: number): string {
  const ts: number[] = [];
  for (let r = 0; r < 5; r++) {
    const head = build(Array.from({ length: n }, (_, i) => i));
    const t0 = performance.now();
    try { fn(head, k); } catch (e) { return (e as Error).constructor.name; }
    ts.push(performance.now() - t0);
  }
  ts.sort((x, y) => x - y);
  return ts[2].toFixed(2) + " ms";
}
console.log("\nn = 1000000 nút, trung vị 5 lần");
console.log("k          lặp           đệ quy        mảng các nút");
for (const k of [2, 3, 100, 1000]) {
  console.log(`${String(k).padEnd(8)} ${[reverseKGroup, reverseKGroupRecursive, reverseKGroupArray].map((fn) => timeIt(fn, 1e6, k).padStart(12)).join("  ")}`);
}
