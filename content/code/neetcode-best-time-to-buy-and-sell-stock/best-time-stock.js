// LeetCode 121, Best Time to Buy and Sell Stock: ba cách, test, và bẫy Math.min(...mảng lớn).
// Chạy: node best-time-stock.js

function bruteForce(prices) {
  let best = 0;
  for (let i = 0; i < prices.length; i++)
    for (let j = i + 1; j < prices.length; j++) best = Math.max(best, prices[j] - prices[i]);
  return best;
}

function runningMin(prices) {
  let minSoFar = Infinity, best = 0;
  for (const p of prices) {
    best = Math.max(best, p - minSoFar);
    minSoFar = Math.min(minSoFar, p);
  }
  return best;
}

function twoPointers(prices) {
  let left = 0, best = 0;
  for (let right = 1; right < prices.length; right++) {
    if (prices[right] < prices[left]) left = right;
    else best = Math.max(best, prices[right] - prices[left]);
  }
  return best;
}

const cases = [[[7, 1, 5, 3, 6, 4], 5], [[7, 6, 4, 3, 1], 0], [[2, 4, 1], 2], [[1], 0], [[3, 3, 3], 0], [[2, 1, 2, 1, 0, 1, 2], 2]];
for (const fn of [bruteForce, runningMin, twoPointers]) {
  const ok = cases.filter(([p, want]) => fn(p) === want).length;
  console.log(`${fn.name.padEnd(12)} ${ok}/${cases.length} ca đúng`);
}

// Math.min(...a) truyền mỗi phần tử thành một ĐỐI SỐ; mảng 10⁵ phần tử (đúng giới hạn của đề) có thể vượt giới hạn ngăn xếp.
for (const n of [1e4, 1e5, 1e6]) {
  try {
    Math.min(...new Array(n).fill(1));
    console.log(`Math.min(...mảng ${n}) chạy được`);
  } catch (e) {
    console.log(`Math.min(...mảng ${n}): ${e.constructor.name}: ${e.message}`);
  }
}
