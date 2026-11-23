// LeetCode 84, Largest Rectangle in Histogram: các cách giải và test.
// Chạy: node largest-rectangle.js

function bruteForce(h) {
  let best = 0;
  for (let i = 0; i < h.length; i++) {
    let low = Infinity;
    for (let j = i; j < h.length; j++) {
      low = Math.min(low, h[j]);
      best = Math.max(best, low * (j - i + 1));
    }
  }
  return best;
}

function divideConquer(h, lo = 0, hi = h.length - 1) {
  if (lo > hi) return 0;
  let m = lo;
  for (let i = lo + 1; i <= hi; i++) if (h[i] < h[m]) m = i;
  return Math.max(h[m] * (hi - lo + 1), divideConquer(h, lo, m - 1), divideConquer(h, m + 1, hi));
}

function monotonicStack(h) {
  const st = [];
  let best = 0;
  for (let i = 0; i <= h.length; i++) {
    const cur = i === h.length ? 0 : h[i]; // lính canh
    while (st.length && h[st[st.length - 1]] >= cur) {
      const height = h[st.pop()];
      const left = st.length ? st[st.length - 1] : -1;
      best = Math.max(best, height * (i - left - 1));
    }
    st.push(i);
  }
  return best;
}

const cases = [[[2, 1, 5, 6, 2, 3], 10], [[2, 4], 4], [[1], 1], [[0, 0], 0], [[1, 2, 3, 4, 5], 9],
  [[5, 4, 3, 2, 1], 9], [[2, 2, 2, 2], 8], [[4, 2, 0, 3, 2, 5], 6], [[6, 2, 5, 4, 5, 1, 6], 12]];
for (const [name, fn] of [["bruteForce", bruteForce], ["divideConquer", (h) => divideConquer(h)], ["monotonicStack", monotonicStack]]) {
  const ok = cases.filter(([h, want]) => fn(h) === want).length;
  console.log(`${name.padEnd(15)} ${ok}/${cases.length} ca đúng`);
}
