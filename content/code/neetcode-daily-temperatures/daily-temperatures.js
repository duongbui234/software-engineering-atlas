// LeetCode 739, Daily Temperatures: ba cách và test.
// Chạy: node daily-temperatures.js

function bruteForce(t) {
  const out = new Array(t.length).fill(0);
  for (let i = 0; i < t.length; i++)
    for (let j = i + 1; j < t.length; j++)
      if (t[j] > t[i]) { out[i] = j - i; break; }
  return out;
}

function monotonicStack(t) {
  const out = new Array(t.length).fill(0);
  const stack = [];
  for (let i = 0; i < t.length; i++) {
    while (stack.length > 0 && t[i] > t[stack.at(-1)]) { // at(-1): phần tử cuối; stack[-1] là undefined
      const j = stack.pop();
      out[j] = i - j;
    }
    stack.push(i);
  }
  return out;
}

function jumpFromRight(t) {
  const n = t.length;
  const out = new Array(n).fill(0);
  for (let i = n - 2; i >= 0; i--) {
    let j = i + 1;
    while (j < n && t[j] <= t[i]) {
      if (out[j] === 0) { j = n; break; }
      j += out[j];
    }
    if (j < n) out[i] = j - i;
  }
  return out;
}

const cases = [
  [[73, 74, 75, 71, 69, 72, 76, 73], [1, 1, 4, 2, 1, 1, 0, 0]], [[30, 40, 50, 60], [1, 1, 1, 0]], [[30, 60, 90], [1, 1, 0]],
  [[90, 80, 70], [0, 0, 0]], [[70, 70, 71], [2, 1, 0]], [[50], [0]],
  [[55, 38, 53, 81, 61, 93, 97, 32, 43, 78], [3, 1, 1, 2, 1, 1, 0, 1, 1, 0]],
];
for (const fn of [bruteForce, monotonicStack, jumpFromRight]) {
  const ok = cases.filter(([t, want]) => fn(t).every((x, i) => x === want[i]) && fn(t).length === want.length).length;
  console.log(`${fn.name.padEnd(15)} ${ok}/${cases.length} ca đúng`);
}
