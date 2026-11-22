// LeetCode 424, Longest Repeating Character Replacement: ba cách và test.
// Chạy: node character-replacement.js

function bruteForce(s, k) {
  let best = 0;
  for (let i = 0; i < s.length; i++) {
    const count = new Array(26).fill(0);
    let maxFreq = 0;
    for (let j = i; j < s.length; j++) {
      maxFreq = Math.max(maxFreq, ++count[s.charCodeAt(j) - 65]);
      if (j - i + 1 - maxFreq <= k) best = Math.max(best, j - i + 1);
    }
  }
  return best;
}

function windowRecount(s, k) {
  const count = new Array(26).fill(0);
  let left = 0, best = 0;
  for (let right = 0; right < s.length; right++) {
    count[s.charCodeAt(right) - 65]++;
    while (right - left + 1 - Math.max(...count) > k) count[s.charCodeAt(left++) - 65]--;
    best = Math.max(best, right - left + 1);
  }
  return best;
}

function windowStaleMax(s, k) {
  const count = new Array(26).fill(0);
  let left = 0, maxFreq = 0;
  for (let right = 0; right < s.length; right++) {
    maxFreq = Math.max(maxFreq, ++count[s.charCodeAt(right) - 65]);
    if (right - left + 1 - maxFreq > k) count[s.charCodeAt(left++) - 65]--;
  }
  return s.length - left;
}

const cases = [["ABAB", 2, 4], ["AABABBA", 1, 4], ["A", 0, 1], ["ABCDE", 1, 2], ["AAAA", 0, 4], ["BAAAB", 2, 5], ["ABBB", 2, 4], ["ABCABCAA", 2, 5]];
for (const fn of [bruteForce, windowRecount, windowStaleMax]) {
  const ok = cases.filter(([s, k, want]) => fn(s, k) === want).length;
  console.log(`${fn.name.padEnd(15)} ${ok}/${cases.length} ca đúng`);
}
