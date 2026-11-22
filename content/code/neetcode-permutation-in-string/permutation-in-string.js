// LeetCode 567, Permutation in String: ba cách và test.
// Chạy: node permutation-in-string.js

function sortEachWindow(s1, s2) {
  const key = [...s1].sort().join("");
  for (let i = 0; i + s1.length <= s2.length; i++) {
    if ([...s2.slice(i, i + s1.length)].sort().join("") === key) return true;
  }
  return false;
}

function slideCompare26(s1, s2) {
  const m = s1.length;
  if (m > s2.length) return false;
  const need = new Array(26).fill(0), have = new Array(26).fill(0);
  for (let i = 0; i < m; i++) { need[s1.charCodeAt(i) - 97]++; have[s2.charCodeAt(i) - 97]++; }
  const same = () => need.every((x, c) => x === have[c]); // need === have so tham chiếu: luôn false
  if (same()) return true;
  for (let r = m; r < s2.length; r++) {
    have[s2.charCodeAt(r) - 97]++;
    have[s2.charCodeAt(r - m) - 97]--;
    if (same()) return true;
  }
  return false;
}

function matchesCounter(s1, s2) {
  const m = s1.length;
  if (m > s2.length) return false;
  const diff = new Array(26).fill(0);
  for (let i = 0; i < m; i++) { diff[s1.charCodeAt(i) - 97]--; diff[s2.charCodeAt(i) - 97]++; }
  let matches = diff.filter((d) => d === 0).length;
  const bump = (c, delta) => {
    if (diff[c] === 0) matches--;
    diff[c] += delta;
    if (diff[c] === 0) matches++;
  };
  for (let r = m; r < s2.length && matches < 26; r++) {
    bump(s2.charCodeAt(r) - 97, 1);
    bump(s2.charCodeAt(r - m) - 97, -1);
  }
  return matches === 26;
}

const cases = [["ab", "eidbaooo", true], ["ab", "eidboaoo", false], ["adc", "dcda", true], ["abc", "ab", false],
  ["a", "a", true], ["aab", "abbab", false], ["aab", "xxbaa", true], ["hello", "ooolleoooleh", false]];
for (const fn of [sortEachWindow, slideCompare26, matchesCounter]) {
  const ok = cases.filter(([a, b, want]) => fn(a, b) === want).length;
  console.log(`${fn.name.padEnd(15)} ${ok}/${cases.length} ca đúng`);
}
