import assert from "node:assert/strict";

type Allocation = { cells: number };

function brute(nums: number[], target: number, i = 0): boolean {
  if (target === 0) return true;
  if (target < 0 || i === nums.length) return false;
  return brute(nums, target - nums[i], i + 1) || brute(nums, target, i + 1);
}

function table(nums: number[], target: number, allocation?: Allocation): boolean {
  const rows = Array.from({ length: nums.length + 1 }, () => new Uint8Array(target + 1));
  rows[0][0] = 1;
  for (let i = 0; i < nums.length; i++) {
    const x = nums[i];
    for (let sum = 0; sum <= target; sum++) {
      rows[i + 1][sum] = rows[i][sum] || (sum >= x ? rows[i][sum - x] : 0);
    }
  }
  if (allocation) allocation.cells = rows.reduce((total, row) => total + row.length, 0);
  return rows[nums.length][target] === 1;
}

function descending(nums: number[], target: number, allocation?: Allocation): boolean {
  const reachable = new Uint8Array(target + 1);
  reachable[0] = 1;
  for (const x of nums) {
    for (let sum = target; sum >= x; sum--) {
      reachable[sum] |= reachable[sum - x];
    }
  }
  if (allocation) allocation.cells = reachable.length;
  return reachable[target] === 1;
}

function bitset(nums: number[], target: number): boolean {
  const goal = 1n << BigInt(target);
  const mask = (goal << 1n) - 1n;
  let reachable = 1n;
  for (const x of nums) {
    reachable = (reachable | (reachable << BigInt(x))) & mask;
  }
  return (reachable & goal) !== 0n;
}

const cases: [number[], boolean][] = [
  [[8], false],
  [[2, 2], true],
  [[3, 6, 7, 10], true],
  [[2, 3, 7], false],
  [[1, 4, 8], false],
  [[2, 2, 2], false],
  [[31, 31], true],
  [[32, 32], true],
  [[33, 33], true],
  [[31, 2, 30, 3], true],
  [[32, 1, 17, 16], true],
  [[33, 31, 30, 34], true],
  [[63, 2, 33, 32], true],
  [[100, 40, 40], false],
  [Array<number>(200).fill(100), true],
  [[...Array<number>(199).fill(100), 98], false],
];

const solvers = [table, descending, bitset];

for (const [nums, expected] of cases) {
  const total = nums.reduce((sum, x) => sum + x, 0);
  for (const solve of solvers) {
    assert.equal(total % 2 === 0 && solve(nums, total / 2), expected);
  }
  if (nums.length < 20) {
    assert.equal(total % 2 === 0 && brute(nums, total / 2), expected);
  }
}

let checked = 0;
function crossCheck(prefix: number[], left: number): void {
  if (prefix.length > 0) {
    const total = prefix.reduce((sum, x) => sum + x, 0);
    const expected = total % 2 === 0 && brute(prefix, total / 2);
    for (const solve of solvers) {
      assert.equal(total % 2 === 0 && solve(prefix, total / 2), expected);
    }
    checked++;
  }
  if (left === 0) return;
  for (let x = 1; x <= 4; x++) crossCheck([...prefix, x], left - 1);
}
crossCheck([], 6);

const large = cases[cases.length - 1][0];
const tableAllocation = { cells: 0 };
const rowAllocation = { cells: 0 };
assert.equal(table(large, 9_999, tableAllocation), false);
assert.equal(descending(large, 9_999, rowAllocation), false);

console.log(`${cases.length}/${cases.length} ca đúng`);
console.log(`Đối chiếu vét cạn: ${checked} mảng`);
console.log(`T=9999: bảng ${tableAllocation.cells} ô, một hàng ${rowAllocation.cells} ô`);
