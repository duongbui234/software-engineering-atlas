// LeetCode 76, Minimum Window Substring: hai cách và test.
// Chạy: node min-window.js

function bruteForce(s, t) {
  let best = "";
  for (let l = 0; l < s.length; l++) {
    const need = new Map();
    for (const c of t) need.set(c, (need.get(c) ?? 0) + 1);
    let missing = t.length;
    for (let r = l; r < s.length; r++) {
      if ((need.get(s[r]) ?? 0) > 0) missing--;
      need.set(s[r], (need.get(s[r]) ?? 0) - 1); // ?? 0: Map.get của khóa chưa có là undefined, undefined - 1 là NaN
      if (missing === 0) {
        if (best === "" || r - l + 1 < best.length) best = s.slice(l, r + 1);
        break;
      }
    }
  }
  return best;
}

function windowMissing(s, t) {
  const need = new Array(128).fill(0);
  for (let i = 0; i < t.length; i++) need[t.charCodeAt(i)]++;
  let missing = t.length, l = 0, bestL = 0, bestLen = Infinity;
  for (let r = 0; r < s.length; r++) {
    if (need[s.charCodeAt(r)]-- > 0) missing--;
    while (missing === 0) {
      if (r - l + 1 < bestLen) { bestL = l; bestLen = r - l + 1; }
      if (++need[s.charCodeAt(l++)] > 0) missing++;
    }
  }
  return bestLen === Infinity ? "" : s.slice(bestL, bestL + bestLen);
}

const cases = [
  ["ADOBECODEBANC", "ABC", "BANC"], ["a", "a", "a"], ["a", "aa", ""], ["aa", "aa", "aa"], ["ab", "b", "b"],
  ["bba", "ab", "ba"], ["cabwefgewcwaefgcf", "cae", "cwae"], ["abc", "d", ""],
];
for (const fn of [bruteForce, windowMissing]) {
  const ok = cases.filter(([s, t, want]) => fn(s, t) === want).length;
  console.log(`${fn.name.padEnd(14)} ${ok}/${cases.length} ca đúng`);
}
