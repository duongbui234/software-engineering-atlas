// Vì sao cửa sổ trượt hỏng khi mảng có số âm: đếm số đoạn liên tiếp có tổng đúng bằng k.
// Chạy: node negative-numbers.ts

// Cửa sổ: tổng vượt k thì co trái. Chỉ đúng khi mọi số đều dương (thêm phần tử luôn làm tổng tăng).
function windowCount(nums: number[], k: number): number {
  let left = 0, sum = 0, count = 0;
  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];
    while (sum > k && left <= right) sum -= nums[left++];
    if (sum === k) count++;
  }
  return count;
}

// Tổng tiền tố + bảng băm: đoạn (i, j] có tổng k khi P[j] − P[i] = k. Đúng với mọi dấu.
function prefixCount(nums: number[], k: number): number {
  const seen = new Map<number, number>([[0, 1]]);
  let p = 0, count = 0;
  for (const x of nums) {
    p += x;
    count += seen.get(p - k) ?? 0;
    seen.set(p, (seen.get(p) ?? 0) + 1);
  }
  return count;
}

const bruteCount = (nums: number[], k: number) => {
  let c = 0;
  for (let i = 0; i < nums.length; i++) for (let j = i, s = 0; j < nums.length; j++) if ((s += nums[j]) === k) c++;
  return c;
};

const cases: [number[], number][] = [[[1, 2, 3], 3], [[1, 1, 1], 2], [[3, 4, 7, 2, -3, 1, 4, 2], 7], [[1, -1, 0], 0], [[2, -1, 2], 3]];
for (const [nums, k] of cases)
  console.log(`${JSON.stringify(nums).padEnd(26)} k=${String(k).padEnd(2)} vét cạn ${bruteCount(nums, k)}  cửa sổ ${windowCount(nums, k)}  tiền tố ${prefixCount(nums, k)}`);
