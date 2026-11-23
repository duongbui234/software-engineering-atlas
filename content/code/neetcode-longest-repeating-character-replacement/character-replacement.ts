// LeetCode 424, Longest Repeating Character Replacement: ba cách, một bản sai, test và đo.
// Chạy: node character-replacement.ts

const idx = (s: string, i: number) => s.charCodeAt(i) - 65; // đề chỉ có chữ hoa A–Z

// Cách 1, vét cạn: mọi điểm bắt đầu, kéo dài và đếm. O(n²).
function bruteForce(s: string, k: number): number {
  let best = 0;
  for (let i = 0; i < s.length; i++) {
    const count = new Array(26).fill(0);
    let maxFreq = 0;
    for (let j = i; j < s.length; j++) {
      maxFreq = Math.max(maxFreq, ++count[idx(s, j)]);
      if (j - i + 1 - maxFreq <= k) best = Math.max(best, j - i + 1);
    }
  }
  return best;
}

// Cách 2, cửa sổ co bằng while, tính lại maxFreq đúng từ 26 ô mỗi lần co. O(26·n).
function windowRecount(s: string, k: number): number {
  const count = new Array(26).fill(0);
  let left = 0, best = 0;
  for (let right = 0; right < s.length; right++) {
    count[idx(s, right)]++;
    while (right - left + 1 - Math.max(...count) > k) count[idx(s, left++)]--;
    best = Math.max(best, right - left + 1);
  }
  return best;
}

// Cách 3, cửa sổ không bao giờ co: maxFreq chỉ tăng, không giảm khi bỏ ký tự bên trái. O(n).
function windowStaleMax(s: string, k: number): number {
  const count = new Array(26).fill(0);
  let left = 0, maxFreq = 0;
  for (let right = 0; right < s.length; right++) {
    maxFreq = Math.max(maxFreq, ++count[idx(s, right)]);
    if (right - left + 1 - maxFreq > k) count[idx(s, left++)]--; // "if", không phải "while": cửa sổ trượt nguyên khối
  }
  return s.length - left; // cửa sổ không bao giờ co, nên độ dài cuối cùng là độ dài lớn nhất từng đạt
}

// SAI: coi ký tự ở đầu trái là ký tự giữ lại, thay vì ký tự nhiều nhất trong cửa sổ.
function wrongKeepLeftChar(s: string, k: number): number {
  const count = new Array(26).fill(0);
  let left = 0, best = 0;
  for (let right = 0; right < s.length; right++) {
    count[idx(s, right)]++;
    while (right - left + 1 - count[idx(s, left)] > k) count[idx(s, left++)]--;
    best = Math.max(best, right - left + 1);
  }
  return best;
}

const cases: [string, number, number][] = [
  ["ABAB", 2, 4], ["AABABBA", 1, 4], ["A", 0, 1], ["ABCDE", 1, 2],
  ["AAAA", 0, 4], ["BAAAB", 2, 5], ["ABBB", 2, 4], ["ABCABCAA", 2, 5],
];
for (const fn of [bruteForce, windowRecount, windowStaleMax, wrongKeepLeftChar]) {
  const bad = cases.filter(([s, k, want]) => fn(s, k) !== want);
  console.log(`${fn.name.padEnd(17)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.map(([s, k]) => `${s} k=${k} → ${fn(s, k)}`).join(", ") : ""}`);
}

// maxFreq cũ lớn hơn max thật bao nhiêu lần, mà kết quả vẫn đúng?
// Bộ sinh ngẫu nhiên mulberry32: trạng thái là số nguyên 32 bit, mọi phép nhân qua Math.imul nên không mất chính xác.
function mix32(a: number): number { let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return (t ^ (t >>> 14)) >>> 0; }
const rand = (() => { let x = 11; return () => ((x = (x + 0x6d2b79f5) | 0), mix32(x) >>> 1) / 2 ** 31; })();
const make = (n: number, letters: number) => Array.from({ length: n }, () => String.fromCharCode(65 + Math.floor(rand() * letters))).join("");
{
  const s = make(100_000, 4), k = 3, count = new Array(26).fill(0);
  let left = 0, maxFreq = 0, stale = 0;
  for (let right = 0; right < s.length; right++) {
    maxFreq = Math.max(maxFreq, ++count[idx(s, right)]);
    if (right - left + 1 - maxFreq > k) count[idx(s, left++)]--;
    if (maxFreq > Math.max(...count)) stale++;
  }
  console.log(`\nn = 100000, 4 chữ, k = 3: maxFreq cũ lớn hơn max thật ở ${stale} bước; windowStaleMax = ${windowStaleMax(s, k)}, windowRecount = ${windowRecount(s, k)}`);
}

// Đối chiếu ngẫu nhiên với vét cạn: 5 000 chuỗi dài 1..30 trên 3 chữ, k từ 0 tới 3.
{
  let diff = 0;
  for (let t = 0; t < 5000; t++) {
    const s = make(1 + Math.floor(rand() * 30), 3), k = Math.floor(rand() * 4);
    if (windowStaleMax(s, k) !== bruteForce(s, k)) diff++;
  }
  console.log(`đối chiếu 5000 chuỗi ngẫu nhiên với vét cạn: ${diff} chuỗi lệch`);
}

const time = (f: () => unknown, runs: number) => {
  const ts: number[] = [];
  for (let r = 0; r < runs; r++) { const t = performance.now(); f(); ts.push(performance.now() - t); }
  return ts.sort((a, b) => a - b)[Math.floor(runs / 2)];
};
console.log("\nn          chữ   vét cạn   co + đếm lại   không co   (ms, trung vị)");
for (const [n, letters] of [[2_000, 26], [4_000, 26], [8_000, 26], [1_000_000, 26], [1_000_000, 2]] as const) {
  const s = make(n, letters), k = 2;
  const bf = n <= 8_000 ? time(() => bruteForce(s, k), 3).toFixed(1) : "—";
  console.log(`${String(n).padEnd(10)} ${String(letters).padStart(3)} ${bf.padStart(9)} ${time(() => windowRecount(s, k), 5).toFixed(2).padStart(14)} ${time(() => windowStaleMax(s, k), 5).toFixed(2).padStart(10)}`);
}
