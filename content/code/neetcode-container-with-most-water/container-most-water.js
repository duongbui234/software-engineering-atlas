// LeetCode 11, Container With Most Water: hai cách và test.
// Chạy: node container-most-water.js

function bruteForce(h) {
  let best = 0;
  for (let i = 0; i < h.length; i++)
    for (let j = i + 1; j < h.length; j++) best = Math.max(best, (j - i) * Math.min(h[i], h[j]));
  return best;
}

function twoPointers(h) {
  let i = 0, j = h.length - 1, best = 0;
  while (i < j) {
    best = Math.max(best, (j - i) * Math.min(h[i], h[j]));
    if (h[i] < h[j]) i++; else j--;
  }
  return best;
}

const cases = [
  [[1, 8, 6, 2, 5, 4, 8, 3, 7], 49], [[1, 1], 1], [[4, 3, 2, 1, 4], 16], [[1, 2, 1], 2],
  [[2, 3, 4, 5, 18, 17, 6], 17], [[0, 0, 0], 0], [[1, 3, 2, 5, 25, 24, 5], 24],
];
for (const fn of [bruteForce, twoPointers]) {
  const ok = cases.filter(([h, w]) => fn(h) === w).length;
  console.log(`${fn.name.padEnd(12)} ${ok}/${cases.length} ca đúng`);
}
