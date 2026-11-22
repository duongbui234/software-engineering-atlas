// LeetCode 239, Sliding Window Maximum: ba cách và test.
// Chạy: node sliding-window-max.js

function bruteForce(nums, k) {
  const out = [];
  for (let i = 0; i + k <= nums.length; i++) out.push(Math.max(...nums.slice(i, i + k))); // spread chỉ ổn khi k nhỏ
  return out;
}

function blocks(nums, k) {
  const n = nums.length;
  const pre = nums.slice(), suf = nums.slice();
  for (let i = 1; i < n; i++) if (i % k) pre[i] = Math.max(pre[i - 1], nums[i]);
  for (let i = n - 2; i >= 0; i--) if ((i + 1) % k) suf[i] = Math.max(suf[i + 1], nums[i]);
  const out = [];
  for (let i = 0; i + k <= n; i++) out.push(Math.max(suf[i], pre[i + k - 1]));
  return out;
}

function monotonicDeque(nums, k) {
  const q = new Int32Array(nums.length); // JS không có deque sẵn: mảng + head thay cho shift()
  let head = 0, tail = 0;
  const out = [];
  for (let i = 0; i < nums.length; i++) {
    if (head < tail && q[head] <= i - k) head++;
    while (head < tail && nums[q[tail - 1]] <= nums[i]) tail--;
    q[tail++] = i;
    if (i >= k - 1) out.push(nums[q[head]]);
  }
  return out;
}

const cases = [
  [[1, 3, -1, -3, 5, 3, 6, 7], 3, [3, 3, 5, 5, 6, 7]], [[1], 1, [1]], [[9, 8, 7, 6, 5], 2, [9, 8, 7, 6]],
  [[1, 2, 3, 4], 4, [4]], [[4, 4, 4, 1], 2, [4, 4, 4]], [[-7, -8, 7, 5, 7, 1, 6, 0], 4, [7, 7, 7, 7, 7]], [[5, 1, 2, 3], 2, [5, 2, 3]],
];
for (const fn of [bruteForce, blocks, monotonicDeque]) {
  const ok = cases.filter(([a, k, want]) => fn(a, k).join() === want.join()).length;
  console.log(`${fn.name.padEnd(15)} ${ok}/${cases.length} ca đúng`);
}
