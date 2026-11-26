import assert from "node:assert/strict";

function rolling(nums, start, end) {
  let twoBack = 0;
  let oneBack = 0;
  for (let i = start; i < end; i++) {
    const best = Math.max(oneBack, twoBack + nums[i]);
    twoBack = oneBack;
    oneBack = best;
  }
  return oneBack;
}

function table(nums, start, end) {
  const best = new Array(end - start + 2).fill(0);
  for (let i = start; i < end; i++) {
    const j = i - start;
    best[j + 2] = Math.max(best[j + 1], best[j] + nums[i]);
  }
  return best[end - start + 1];
}

function brute(nums, i, end) {
  if (i >= end) return 0;
  return Math.max(brute(nums, i + 1, end), nums[i] + brute(nums, i + 2, end));
}

function rob(nums, solve) {
  return solve(nums, 0, nums.length);
}

const cases = [
  [[8], 8],
  [[0, 0, 0], 0],
  [[8, 11, 8], 16],
  [[4, 9, 1, 8, 3, 7], 24],
  [[10, 1], 10],
];
let passed = 0;
for (const [nums, expected] of cases) {
  for (const solve of [brute, table, rolling]) {
    assert.equal(rob(nums, solve), expected);
    passed++;
  }
}
for (const solve of [table, rolling]) {
  assert.equal(rob(new Array(100).fill(3), solve), 150);
  passed++;
}
console.log(`${passed}/${cases.length * 3 + 2} ca đúng`);
