// LeetCode 3, Longest Substring Without Repeating Characters: ba cách và test.
// Chạy: node longest-substring.js

function bruteForce(s) {
  let best = 0;
  for (let i = 0; i < s.length; i++) {
    const seen = new Set();
    for (let j = i; j < s.length && !seen.has(s[j]); j++) seen.add(s[j]);
    best = Math.max(best, seen.size);
  }
  return best;
}

function windowSet(s) {
  const inWindow = new Set();
  let left = 0, best = 0;
  for (let right = 0; right < s.length; right++) {
    while (inWindow.has(s[right])) inWindow.delete(s[left++]);
    inWindow.add(s[right]);
    best = Math.max(best, right - left + 1);
  }
  return best;
}

function windowLastSeen(s) {
  const last = new Map();
  let left = 0, best = 0;
  for (let right = 0; right < s.length; right++) { // s[right] là một đơn vị UTF-16, không phải một ký tự emoji
    const prev = last.get(s[right]);
    if (prev !== undefined && prev >= left) left = prev + 1;
    last.set(s[right], right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}

const cases = [["abcabcbb", 3], ["bbbbb", 1], ["pwwkew", 3], ["", 0], [" ", 1], ["abba", 2], ["dvdf", 3], ["tmmzuxt", 5]];
for (const fn of [bruteForce, windowSet, windowLastSeen]) {
  const ok = cases.filter(([s, want]) => fn(s) === want).length;
  console.log(`${fn.name.padEnd(15)} ${ok}/${cases.length} ca đúng`);
}
