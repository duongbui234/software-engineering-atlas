// NC-04 Group Anagrams (LeetCode 49): khóa sắp xếp, khóa đếm, bẫy nối khóa, phép đo.
// Chạy: node group-anagrams.ts

// Cách 1, khóa = chữ cái đã sắp xếp: "eat", "tea", "ate" → "aet". O(n · k log k).
function bySortedKey(strs: string[]): string[][] {
  const groups = new Map<string, string[]>();
  for (const s of strs) {
    const key = s.split('').sort().join('');
    const g = groups.get(key);
    if (g) g.push(s); else groups.set(key, [s]);
  }
  return [...groups.values()];
}

// Cách 2, khóa = bảng đếm 26 chữ: O(n · k). Nối có dấu phân cách để khóa không mơ hồ.
function byCountKey(strs: string[]): string[][] {
  const groups = new Map<string, string[]>();
  for (const s of strs) {
    const count = new Array<number>(26).fill(0);
    for (let i = 0; i < s.length; i++) count[s.charCodeAt(i) - 97]++;
    const key = count.join('#');
    const g = groups.get(key);
    if (g) g.push(s); else groups.set(key, [s]);
  }
  return [...groups.values()];
}

// Biến thể lỗi: nối bảng đếm KHÔNG có dấu phân cách.
function byCountKeyNoSeparator(strs: string[]): string[][] {
  const groups = new Map<string, string[]>();
  for (const s of strs) {
    const count = new Array<number>(26).fill(0);
    for (let i = 0; i < s.length; i++) count[s.charCodeAt(i) - 97]++;
    const key = count.join('');
    groups.set(key, [...(groups.get(key) ?? []), s]);
  }
  return [...groups.values()];
}

// Đề cho phép trả về theo thứ tự bất kỳ: chuẩn hóa trước khi so.
const normalize = (gs: string[][]) => JSON.stringify(gs.map((g) => [...g].sort()).sort());
const cases: [string[], string[][]][] = [
  [['eat', 'tea', 'tan', 'ate', 'nat', 'bat'], [['bat'], ['nat', 'tan'], ['ate', 'eat', 'tea']]],
  [[''], [['']]],
  [['a'], [['a']]],
  [['abc', 'bca', 'cab', 'abd'], [['abc', 'bca', 'cab'], ['abd']]],
];
for (const fn of [bySortedKey, byCountKey, byCountKeyNoSeparator]) {
  const ok = cases.filter(([inp, want]) => normalize(fn(inp)) === normalize(want)).length;
  console.log(`${fn.name.padEnd(22)} ${ok}/${cases.length} ca đúng`);
}

// ── bẫy: 1 chữ a + 11 chữ b, và 11 chữ a + 1 chữ b ───────────────────────────
const x = 'a' + 'b'.repeat(11), y = 'a'.repeat(11) + 'b';
const head = (s: string, sep: string) => {
  const c = new Array<number>(26).fill(0);
  for (const ch of s) c[ch.charCodeAt(0) - 97]++;
  return c.slice(0, 3).join(sep) + sep + '…';
};
console.log(`\n"${x}" và "${y}" không phải anagram`);
console.log(`  khóa không phân cách: ${head(x, '')} và ${head(y, '')}`);
console.log(`  khóa có '#':          ${head(x, '#')} và ${head(y, '#')}`);
console.log(`  byCountKeyNoSeparator gom chung: ${JSON.stringify(byCountKeyNoSeparator([x, y]))}`);
console.log(`  byCountKey tách riêng:           ${JSON.stringify(byCountKey([x, y]))}`);

// ── đo: 10 000 từ, mỗi từ k chữ, khoảng 100 nhóm ─────────────────────────────
function words(n: number, k: number): string[] {
  const out: string[] = [];
  let seed = 7;
  const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
  const bases = Array.from({ length: 100 }, () => Array.from({ length: k }, () => String.fromCharCode(97 + Math.floor(rnd() * 26))));
  for (let i = 0; i < n; i++) {
    const w = [...bases[i % 100]];
    for (let j = w.length - 1; j > 0; j--) { const r = Math.floor(rnd() * (j + 1)); [w[j], w[r]] = [w[r], w[j]]; }
    out.push(w.join(''));
  }
  return out;
}
console.log('\nn = 10 000 từ   khóa sắp xếp   khóa đếm');
for (const k of [5, 20, 100, 1000]) {
  const ws = words(10_000, k);
  const t = [bySortedKey, byCountKey].map((fn) => { const t0 = performance.now(); fn(ws); return performance.now() - t0; });
  console.log(`k = ${String(k).padEnd(10)} ${t[0].toFixed(1).padStart(10)} ms ${t[1].toFixed(1).padStart(9)} ms`);
}
