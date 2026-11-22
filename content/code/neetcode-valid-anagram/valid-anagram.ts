// NC-02 Valid Anagram (LeetCode 242): ba cách, test, và bẫy Unicode.
// Chạy: node valid-anagram.ts

// Cách 1, sắp xếp rồi so: O(n log n). split('') tách theo code unit UTF-16.
function bySorting(s: string, t: string): boolean {
  if (s.length !== t.length) return false;
  return s.split('').sort().join('') === t.split('').sort().join('');
}

// Cách 2, mảng đếm 26 ô: chỉ đúng khi chắc chắn input là 'a'..'z'. O(n), O(1) bộ nhớ.
function byCount26(s: string, t: string): boolean {
  if (s.length !== t.length) return false;
  const count = new Array<number>(26).fill(0);
  for (let i = 0; i < s.length; i++) {
    count[s.charCodeAt(i) - 97]++; // 97 là mã của 'a'
    count[t.charCodeAt(i) - 97]--;
  }
  return count.every((c) => c === 0);
}

// Cách 3, đếm bằng Map theo code point, sau khi chuẩn hóa Unicode (NFC). Dùng cho chữ bất kỳ.
function byMap(s: string, t: string): boolean {
  s = s.normalize('NFC'); t = t.normalize('NFC');
  const count = new Map<string, number>();
  for (const ch of s) count.set(ch, (count.get(ch) ?? 0) + 1); // for…of đi theo code point
  for (const ch of t) {
    const c = count.get(ch);
    if (!c) return false; // không có hoặc đã dùng hết
    count.set(ch, c - 1);
  }
  return [...count.values()].every((c) => c === 0);
}

const cases: [string, string, boolean][] = [
  ['anagram', 'nagaram', true],
  ['rat', 'car', false],
  ['a', 'ab', false],
  ['aacc', 'ccac', false],
  ['', '', true],
];
let failed = 0;
for (const fn of [bySorting, byCount26, byMap])
  for (const [s, t, want] of cases) if (fn(s, t) !== want) { failed++; console.log(`SAI ${fn.name}("${s}", "${t}")`); }
console.log(`test chữ thường: 3 cách × ${cases.length} ca, ${failed} ca sai\n`);

// ── bẫy 1: cùng chữ "é" nhưng hai cách mã hóa ───────────────────────────────
const composed = 'café';     // é là một code point U+00E9
const decomposed = 'éfac'; // e + dấu sắc kết hợp U+0301
console.log(`"${composed}" vs "${decomposed}": length ${composed.length} vs ${decomposed.length}`);
console.log(`  bySorting: ${bySorting(composed, decomposed)}, byMap (NFC): ${byMap(composed, decomposed)}\n`);

// ── bẫy 2: tách theo code unit làm vỡ emoji, cho ra "anagram" sai ────────────
const a = '😀🌃';                     // U+1F600 U+1F303
const b = '\u{1F703}\u{1F200}';       // U+1F703 U+1F200: hai ký tự khác hẳn
const units = (x: string) => x.split('').map((u) => u.charCodeAt(0).toString(16)).join(' ');
console.log(`"${a}" code unit: ${units(a)}`);
console.log(`"${b}" code unit: ${units(b)}`);
console.log(`  bySorting: ${bySorting(a, b)} (sai), byMap: ${byMap(a, b)}`);
console.log(`  byCount26 với chữ có dấu: count['é'.charCodeAt(0) - 97] = count[${'é'.charCodeAt(0) - 97}] → ghi ra ngoài 26 ô`);

// ── đo: hai chuỗi 1 000 000 chữ thường là anagram của nhau ──────────────────
const n = 1_000_000;
const s1 = Array.from({ length: n }, (_, i) => String.fromCharCode(97 + ((i * 7) % 26))).join('');
const s2 = [...s1].reverse().join('');
for (const fn of [bySorting, byCount26, byMap]) {
  const t0 = performance.now(); const r = fn(s1, s2);
  console.log(`${fn.name.padEnd(10)} n = 1 000 000: ${(performance.now() - t0).toFixed(1).padStart(7)} ms (${r})`);
}
