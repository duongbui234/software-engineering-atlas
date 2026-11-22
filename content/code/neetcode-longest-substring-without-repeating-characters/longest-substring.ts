// LeetCode 3, Longest Substring Without Repeating Characters: ba cách, một bản sai, test và đo.
// Chạy: node longest-substring.ts

// Cách 1, vét cạn: từ mỗi vị trí đầu i, kéo dài tới khi gặp ký tự lặp. O(n²) (O(n·k) với k ký tự khác nhau).
function bruteForce(s: string): number {
  let best = 0;
  for (let i = 0; i < s.length; i++) {
    const seen = new Set<string>();
    for (let j = i; j < s.length && !seen.has(s[j]); j++) seen.add(s[j]);
    best = Math.max(best, seen.size);
  }
  return best;
}

// Cách 2, cửa sổ trượt với Set: thêm s[right]; nếu trùng thì bỏ dần từ bên trái tới khi hết trùng.
function windowSet(s: string): number {
  const inWindow = new Set<string>();
  let left = 0, best = 0;
  for (let right = 0; right < s.length; right++) {
    while (inWindow.has(s[right])) inWindow.delete(s[left++]); // co cửa sổ: mỗi ký tự bị xóa tối đa một lần
    inWindow.add(s[right]);
    best = Math.max(best, right - left + 1);
  }
  return best;
}

// Cách 3, cửa sổ trượt với vị trí gặp gần nhất: nhảy left thẳng qua ký tự trùng.
function windowLastSeen(s: string): number {
  const last = new Map<string, number>();
  let left = 0, best = 0;
  for (let right = 0; right < s.length; right++) {
    const prev = last.get(s[right]);
    if (prev !== undefined && prev >= left) left = prev + 1; // chỉ nhảy khi lần gặp trước nằm TRONG cửa sổ
    last.set(s[right], right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}

// SAI: nhảy left mà không kiểm tra lần gặp trước còn trong cửa sổ không, nên left có thể lùi lại.
function windowJumpBack(s: string): number {
  const last = new Map<string, number>();
  let left = 0, best = 0;
  for (let right = 0; right < s.length; right++) {
    const prev = last.get(s[right]);
    if (prev !== undefined) left = prev + 1; // "abba": tới chữ a cuối, left lùi từ 2 về 1
    last.set(s[right], right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}

const cases: [string, number][] = [
  ["abcabcbb", 3], ["bbbbb", 1], ["pwwkew", 3], ["", 0], [" ", 1], ["abba", 2], ["dvdf", 3], ["tmmzuxt", 5],
];
for (const fn of [bruteForce, windowSet, windowLastSeen, windowJumpBack]) {
  const bad = cases.filter(([s, want]) => fn(s) !== want);
  console.log(`${fn.name.padEnd(15)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.map(([s]) => JSON.stringify(s) + " → " + fn(s)).join(" ") : ""}`);
}
console.log(`\n"a😀😀".length = ${"a😀😀".length}; windowLastSeen("a😀😀") = ${windowLastSeen("a😀😀")} (đúng phải là 2)`);

// Đo: chuỗi ngẫu nhiên trên bảng chữ cái k ký tự.
const rand = (() => { let x = 5; return () => (x = (x * 1103515245 + 12345) % 2 ** 31) / 2 ** 31; })();
const make = (n: number, k: number) => Array.from({ length: n }, () => String.fromCharCode(32 + Math.floor(rand() * k))).join("");
const time = (fn: (s: string) => number, s: string, runs: number) => {
  const ts: number[] = [];
  for (let r = 0; r < runs; r++) { const t = performance.now(); fn(s); ts.push(performance.now() - t); }
  return ts.sort((a, b) => a - b)[Math.floor(runs / 2)];
};
console.log("\nn          bảng chữ   vét cạn   Set   vị trí gần nhất   (ms, trung vị 5 lần)");
for (const [n, k] of [[100_000, 26], [100_000, 95], [1_000_000, 26], [1_000_000, 95]]) {
  const s = make(n, k);
  console.log(`${String(n).padEnd(10)} ${String(k).padStart(8)} ${time(bruteForce, s, 5).toFixed(1).padStart(9)} ${time(windowSet, s, 5).toFixed(1).padStart(5)} ${time(windowLastSeen, s, 5).toFixed(1).padStart(17)}`);
}
