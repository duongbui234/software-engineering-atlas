// LeetCode 42, Trapping Rain Water: bốn cách và test.
// Chạy: node trapping-rain-water.js

function bruteForce(h) {
  let total = 0;
  for (let i = 0; i < h.length; i++) {
    let left = 0, right = 0;
    for (let k = 0; k <= i; k++) left = Math.max(left, h[k]);
    for (let k = i; k < h.length; k++) right = Math.max(right, h[k]);
    total += Math.min(left, right) - h[i];
  }
  return total;
}

function prefixMax(h) {
  const n = h.length;
  if (n === 0) return 0;
  const left = new Array(n), right = new Array(n);
  left[0] = h[0];
  for (let i = 1; i < n; i++) left[i] = Math.max(left[i - 1], h[i]);
  right[n - 1] = h[n - 1];
  for (let i = n - 2; i >= 0; i--) right[i] = Math.max(right[i + 1], h[i]);
  let total = 0;
  for (let i = 0; i < n; i++) total += Math.min(left[i], right[i]) - h[i];
  return total;
}

function twoPointers(h) {
  let i = 0, j = h.length - 1, leftMax = 0, rightMax = 0, total = 0;
  while (i < j) {
    leftMax = Math.max(leftMax, h[i]);
    rightMax = Math.max(rightMax, h[j]);
    if (leftMax < rightMax) total += leftMax - h[i++];
    else total += rightMax - h[j--];
  }
  return total;
}

function monotonicStack(h) {
  const stack = [];
  let total = 0;
  for (let i = 0; i < h.length; i++) {
    while (stack.length && h[i] > h[stack.at(-1)]) {
      const bottom = stack.pop();
      if (!stack.length) break;
      const l = stack.at(-1);
      total += (i - l - 1) * (Math.min(h[l], h[i]) - h[bottom]);
    }
    stack.push(i);
  }
  return total;
}

const cases = [
  [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1], 6], [[4, 2, 0, 3, 2, 5], 9], [[], 0], [[3], 0],
  [[1, 2, 3, 4], 0], [[5, 4, 1, 2], 1], [[2, 0, 2], 2], [[3, 0, 0, 2, 0, 4], 10],
];
for (const fn of [bruteForce, prefixMax, twoPointers, monotonicStack]) {
  const ok = cases.filter(([h, w]) => fn(h) === w).length;
  console.log(`${fn.name.padEnd(15)} ${ok}/${cases.length} ca đúng`);
}
