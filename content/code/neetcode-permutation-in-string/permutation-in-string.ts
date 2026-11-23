// LeetCode 567, Permutation in String: ba cách, hai bản sai, test và đo.
// Chạy: node permutation-in-string.ts

const at = (s: string, i: number) => s.charCodeAt(i) - 97; // đề chỉ có chữ thường a–z

// Cách 1: mọi cửa sổ dài m, sắp xếp rồi so với s1 đã sắp xếp. O(n · m log m).
function sortEachWindow(s1: string, s2: string): boolean {
  const key = [...s1].sort().join("");
  for (let i = 0; i + s1.length <= s2.length; i++) {
    if ([...s2.slice(i, i + s1.length)].sort().join("") === key) return true;
  }
  return false;
}

// Cách 2: cửa sổ cố định dài m, trượt bảng đếm 26 ô, so cả 26 ô mỗi bước. O(26 · n).
function slideCompare26(s1: string, s2: string): boolean {
  const m = s1.length;
  if (m > s2.length) return false;
  const need = new Array(26).fill(0), have = new Array(26).fill(0);
  for (let i = 0; i < m; i++) { need[at(s1, i)]++; have[at(s2, i)]++; }
  const same = () => need.every((x, c) => x === have[c]);
  if (same()) return true;
  for (let r = m; r < s2.length; r++) {
    have[at(s2, r)]++;      // ký tự vào bên phải
    have[at(s2, r - m)]--;  // ký tự ra bên trái
    if (same()) return true;
  }
  return false;
}

// Cách 3: đếm số chữ cái đang khớp (0..26). Mỗi bước chỉ hai ô đổi, nên chỉ cập nhật hai ô đó. O(n).
function matchesCounter(s1: string, s2: string): boolean {
  const m = s1.length;
  if (m > s2.length) return false;
  const diff = new Array(26).fill(0); // diff[c] = số lần c trong cửa sổ − số lần c trong s1
  for (let i = 0; i < m; i++) { diff[at(s1, i)]--; diff[at(s2, i)]++; }
  let matches = diff.filter((d) => d === 0).length;
  const bump = (c: number, delta: number) => {
    if (diff[c] === 0) matches--;  // ô đang khớp sắp lệch
    diff[c] += delta;
    if (diff[c] === 0) matches++;  // ô vừa khớp lại
  };
  for (let r = m; r < s2.length && matches < 26; r++) {
    bump(at(s2, r), +1);
    bump(at(s2, r - m), -1);
  }
  return matches === 26;
}

// SAI 1: so tập ký tự, bỏ qua số lần xuất hiện.
function wrongSetOnly(s1: string, s2: string): boolean {
  const want = new Set(s1);
  for (let i = 0; i + s1.length <= s2.length; i++) {
    const got = new Set(s2.slice(i, i + s1.length));
    if (got.size === want.size && [...want].every((c) => got.has(c))) return true;
  }
  return false;
}

// SAI 2: so hai mảng đếm bằng ===. Mảng so theo tham chiếu, nên không bao giờ bằng.
function wrongArrayEquals(s1: string, s2: string): boolean {
  const m = s1.length;
  if (m > s2.length) return false;
  const need = new Array(26).fill(0), have = new Array(26).fill(0);
  for (let i = 0; i < m; i++) { need[at(s1, i)]++; have[at(s2, i)]++; }
  for (let r = m; ; r++) {
    if ((need as unknown) === have) return true;
    if (r === s2.length) return false;
    have[at(s2, r)]++; have[at(s2, r - m)]--;
  }
}

const cases: [string, string, boolean][] = [
  ["ab", "eidbaooo", true], ["ab", "eidboaoo", false], ["adc", "dcda", true], ["abc", "ab", false],
  ["a", "a", true], ["aab", "abbab", false], ["aab", "xxbaa", true], ["hello", "ooolleoooleh", false],
];
for (const fn of [sortEachWindow, slideCompare26, matchesCounter, wrongSetOnly, wrongArrayEquals]) {
  const bad = cases.filter(([a, b, want]) => fn(a, b) !== want);
  console.log(`${fn.name.padEnd(16)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.map(([a, b]) => `(${a}, ${b})`).join(" ") : ""}`);
}

// Bộ sinh ngẫu nhiên mulberry32: trạng thái là số nguyên 32 bit, mọi phép nhân qua Math.imul nên không mất chính xác.
function mix32(a: number): number { let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return (t ^ (t >>> 14)) >>> 0; }
const rand = (() => { let x = 5; return () => ((x = (x + 0x6d2b79f5) | 0), mix32(x) >>> 1) / 2 ** 31; })();
const make = (n: number) => Array.from({ length: n }, () => String.fromCharCode(97 + Math.floor(rand() * 26))).join("");
const time = (f: () => unknown, runs: number) => {
  const ts: number[] = [];
  for (let r = 0; r < runs; r++) { const t = performance.now(); f(); ts.push(performance.now() - t); }
  return ts.sort((a, b) => a - b)[Math.floor(runs / 2)];
};
console.log("\nn = |s2|    m = |s1|   sắp xếp   so 26 ô   đếm khớp   (ms, trung vị; không có hoán vị nên quét hết)");
for (const [n, m] of [[10_000, 10], [10_000, 1_000], [1_000_000, 10], [1_000_000, 1_000]]) {
  const s2 = make(n), s1 = "z".repeat(m); // "zzz…" gần như chắc chắn không xuất hiện: buộc quét tới cuối
  const sorted = n * m <= 10_000_000 ? time(() => sortEachWindow(s1, s2), 3).toFixed(1) : "—";
  console.log(`${String(n).padEnd(11)} ${String(m).padEnd(9)} ${sorted.padStart(9)} ${time(() => slideCompare26(s1, s2), 5).toFixed(2).padStart(9)} ${time(() => matchesCounter(s1, s2), 5).toFixed(2).padStart(10)}`);
}

// Ca xấu cho "so 26 ô": mọi cửa sổ khớp 24 ô đầu (a..x), lệch ở ô y, nên every phải đi gần hết 26 ô.
{
  const s1 = "abcdefghijklmnopqrstuvwxyy", s2 = "abcdefghijklmnopqrstuvwxyz".repeat(40_000);
  console.log(`${String(s2.length).padEnd(11)} ${"26".padEnd(9)} ${"—".padStart(9)} ${time(() => slideCompare26(s1, s2), 5).toFixed(2).padStart(9)} ${time(() => matchesCounter(s1, s2), 5).toFixed(2).padStart(10)}   ← mọi cửa sổ gần khớp`);
}
