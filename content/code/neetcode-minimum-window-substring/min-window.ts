// LeetCode 76, Minimum Window Substring: ba cách, một bản sai, test và đo.
// Chạy: node min-window.ts

// Cách 1, vét cạn: từ mỗi đầu trái, kéo đầu phải tới khi chứa đủ t. O(n²).
function bruteForce(s: string, t: string): string {
  const need = new Map<string, number>();
  for (const c of t) need.set(c, (need.get(c) ?? 0) + 1);
  let best = "";
  for (let l = 0; l < s.length; l++) {
    const left = new Map(need);
    let missing = t.length;
    for (let r = l; r < s.length; r++) {
      const c = s[r];
      if ((left.get(c) ?? 0) > 0) missing--;
      left.set(c, (left.get(c) ?? 0) - 1);
      if (missing === 0) {
        if (best === "" || r - l + 1 < best.length) best = s.slice(l, r + 1);
        break;
      }
    }
  }
  return best;
}

// Cách 2, cửa sổ, nhưng mỗi bước so cả bảng đếm 128 ô để biết cửa sổ đã đủ chưa. O(128·n).
function windowCompareAll(s: string, t: string): string {
  const need = new Array(128).fill(0), have = new Array(128).fill(0);
  for (const c of t) need[c.charCodeAt(0)]++;
  const covers = () => need.every((x, i) => have[i] >= x);
  let best = [0, Infinity], l = 0;
  for (let r = 0; r < s.length; r++) {
    have[s.charCodeAt(r)]++;
    while (covers()) {
      if (r - l < best[1] - best[0]) best = [l, r];
      have[s.charCodeAt(l++)]--;
    }
  }
  return best[1] === Infinity ? "" : s.slice(best[0], best[1] + 1);
}

// Cách 3, cửa sổ với bảng "còn thiếu" và một biến missing: biết cửa sổ đủ hay chưa trong O(1). O(n + m).
function windowMissing(s: string, t: string): string {
  const need = new Array(128).fill(0); // need[c] > 0: còn thiếu c; < 0: cửa sổ có thừa c
  for (let i = 0; i < t.length; i++) need[t.charCodeAt(i)]++;
  let missing = t.length, l = 0, bestL = 0, bestLen = Infinity;
  for (let r = 0; r < s.length; r++) {
    if (need[s.charCodeAt(r)]-- > 0) missing--; // ký tự này lấp một chỗ thiếu
    while (missing === 0) { // đủ: co từ trái chừng nào còn đủ, ghi đáp án TRONG lúc co
      if (r - l + 1 < bestLen) { bestL = l; bestLen = r - l + 1; }
      if (++need[s.charCodeAt(l++)] > 0) missing++; // bỏ đi một ký tự cần thiết: lại thiếu
    }
  }
  return bestLen === Infinity ? "" : s.slice(bestL, bestL + bestLen);
}

// SAI: chỉ xét t có những CHỮ nào, quên số lần. t = "aa" chỉ cần một chữ a.
function ignoreMultiplicity(s: string, t: string): string {
  const need = new Set(t);
  let best = "";
  for (let l = 0; l < s.length; l++) {
    const seen = new Set<string>();
    for (let r = l; r < s.length; r++) {
      if (need.has(s[r])) seen.add(s[r]);
      if (seen.size === need.size) {
        if (best === "" || r - l + 1 < best.length) best = s.slice(l, r + 1);
        break;
      }
    }
  }
  return best;
}

const cases: [string, string, string][] = [
  ["ADOBECODEBANC", "ABC", "BANC"], ["a", "a", "a"], ["a", "aa", ""], ["aa", "aa", "aa"], ["ab", "b", "b"],
  ["bba", "ab", "ba"], ["cabwefgewcwaefgcf", "cae", "cwae"], ["abc", "d", ""],
];
for (const [name, fn] of Object.entries({ bruteForce, windowCompareAll, windowMissing, ignoreMultiplicity })) {
  const bad = cases.filter(([s, t, want]) => fn(s, t) !== want);
  console.log(`${name.padEnd(18)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.map(([s, t]) => `("${s}", "${t}") → "${fn(s, t)}"`).join(" ") : ""}`);
}

// Đo: s ngẫu nhiên trên 52 chữ A-Z a-z, t gồm 20 chữ ngẫu nhiên.
let seed = 42;
const rnd = () => (seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31;
const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const str = (n: number) => Array.from({ length: n }, () => ALPHA[Math.floor(rnd() * 52)]).join("");
const time = (f: () => unknown, runs: number) => {
  const ts: number[] = [];
  for (let i = 0; i < runs; i++) { const t0 = performance.now(); f(); ts.push(performance.now() - t0); }
  return ts.sort((a, b) => a - b)[Math.floor(runs / 2)];
};
const t = str(20);
console.log("\nn          vét cạn   so cả bảng   biến missing   (ms, trung vị)");
for (const n of [2_000, 8_000, 100_000, 1_000_000]) {
  const s = str(n);
  const bf = n <= 8_000 ? time(() => bruteForce(s, t), 3).toFixed(1) : "—";
  console.log(`${String(n).padEnd(10)} ${bf.padStart(7)} ${time(() => windowCompareAll(s, t), 3).toFixed(1).padStart(12)} ${time(() => windowMissing(s, t), 5).toFixed(2).padStart(14)}`);
}

// Ca tệ nhất của vét cạn: t có một ký tự không bao giờ xuất hiện trong s, nên không lần kéo nào dừng sớm.
console.log("\nt có ký tự không có trong s (ms, trung vị)");
for (const n of [2_000, 4_000, 8_000]) {
  const s = str(n);
  console.log(`${String(n).padEnd(10)} ${time(() => bruteForce(s, t + "#"), 3).toFixed(1).padStart(7)} ${time(() => windowMissing(s, t + "#"), 5).toFixed(2).padStart(29)}`);
}
