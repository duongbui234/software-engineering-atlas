// NC-05 Top K Frequent Elements (LeetCode 347), JavaScript thuần: bucket sort, O(n).
// Chạy: node top-k-frequent.js

/** @param {number[]} nums @param {number} k @returns {number[]} */
function topKFrequent(nums, k) {
  const count = new Map();
  for (const x of nums) count.set(x, (count.get(x) || 0) + 1);

  // buckets[f] = các giá trị xuất hiện đúng f lần. Một giá trị xuất hiện tối đa n lần.
  const buckets = Array.from({ length: nums.length + 1 }, () => []);
  for (const [value, freq] of count) buckets[freq].push(value);

  const out = [];
  for (let f = buckets.length - 1; f > 0; f--) {
    for (const v of buckets[f]) {
      out.push(v);
      if (out.length === k) return out;
    }
  }
  return out;
}

console.log(topKFrequent([1, 1, 1, 2, 2, 3], 2)); // [ 1, 2 ]
console.log(topKFrequent([1], 1));                // [ 1 ]
console.log(topKFrequent([4, 4, 4, 4, -1, -1, -1, 2, 2, 7], 3)); // [ 4, -1, 2 ]
