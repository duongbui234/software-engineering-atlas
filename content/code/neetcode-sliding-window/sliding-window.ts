// Ga ARR-05: cửa sổ trượt. Giải 121, 3, 424, 567, 76, 239 và tự chạy test.
// Chạy: node sliding-window.ts

// 121: cửa sổ [ngày mua, ngày bán]; gặp giá rẻ hơn thì dời đầu trái tới đó.
function maxProfit(prices: number[]): number {
  let left = 0, best = 0;
  for (let right = 1; right < prices.length; right++) {
    if (prices[right] < prices[left]) left = right;
    else best = Math.max(best, prices[right] - prices[left]);
  }
  return best;
}

// 3: bất biến "không ký tự nào lặp"; nhảy left qua lần gặp trước nếu nó nằm trong cửa sổ.
function lengthOfLongestSubstring(s: string): number {
  const last = new Map<string, number>();
  let left = 0, best = 0;
  for (let right = 0; right < s.length; right++) {
    const prev = last.get(s[right]);
    if (prev !== undefined && prev >= left) left = prev + 1;
    last.set(s[right], right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}

// 424: bất biến "độ dài cửa sổ − số lần của chữ nhiều nhất ≤ k" (số chữ phải thay).
function characterReplacement(s: string, k: number): number {
  const count = new Array(26).fill(0);
  let left = 0, maxFreq = 0, best = 0;
  for (let right = 0; right < s.length; right++) {
    maxFreq = Math.max(maxFreq, ++count[s.charCodeAt(right) - 65]);
    if (right - left + 1 - maxFreq > k) count[s.charCodeAt(left++) - 65]--; // dời một bước: cửa sổ không bao giờ co lại
    best = Math.max(best, right - left + 1);
  }
  return best;
}

// 567: cửa sổ CỐ ĐỊNH dài |s1|; so bảng đếm 26 chữ, cập nhật số chữ khớp khi thêm/bớt một ký tự.
function checkInclusion(s1: string, s2: string): boolean {
  if (s1.length > s2.length) return false;
  const need = new Array(26).fill(0), have = new Array(26).fill(0);
  for (let i = 0; i < s1.length; i++) { need[s1.charCodeAt(i) - 97]++; have[s2.charCodeAt(i) - 97]++; }
  let matches = need.filter((x, i) => x === have[i]).length;
  for (let right = s1.length; ; right++) {
    if (matches === 26) return true;
    if (right === s2.length) return false;
    for (const [c, d] of [[s2.charCodeAt(right) - 97, 1], [s2.charCodeAt(right - s1.length) - 97, -1]]) {
      if (have[c] === need[c]) matches--;
      have[c] += d;
      if (have[c] === need[c]) matches++;
    }
  }
}

// 76: mở rộng tới khi đủ mọi ký tự của t, rồi co từ trái chừng nào còn đủ.
function minWindow(s: string, t: string): string {
  const need = new Map<string, number>();
  for (const c of t) need.set(c, (need.get(c) ?? 0) + 1);
  let missing = t.length, left = 0, bestL = 0, bestLen = Infinity;
  for (let right = 0; right < s.length; right++) {
    const r = s[right];
    if (need.has(r)) { if (need.get(r)! > 0) missing--; need.set(r, need.get(r)! - 1); }
    while (missing === 0) {
      if (right - left + 1 < bestLen) { bestLen = right - left + 1; bestL = left; }
      const l = s[left++];
      if (need.has(l)) { need.set(l, need.get(l)! + 1); if (need.get(l)! > 0) missing++; }
    }
  }
  return bestLen === Infinity ? "" : s.slice(bestL, bestL + bestLen);
}

// 239: hàng đợi hai đầu giữ CHỈ SỐ, giá trị giảm dần; đầu hàng là max của cửa sổ.
function maxSlidingWindow(nums: number[], k: number): number[] {
  const dq: number[] = [];
  let head = 0; // mảng + con trỏ đầu thay cho shift(), vốn O(n) mỗi lần
  const out: number[] = [];
  for (let i = 0; i < nums.length; i++) {
    while (dq.length > head && nums[dq[dq.length - 1]] <= nums[i]) dq.pop();
    dq.push(i);
    if (dq[head] <= i - k) head++; // phần tử đầu đã trượt ra khỏi cửa sổ
    if (i >= k - 1) out.push(nums[dq[head]]);
  }
  return out;
}

const eq = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
const tests = [
  maxProfit([7, 1, 5, 3, 6, 4]) === 5, maxProfit([7, 6, 4, 3, 1]) === 0,
  lengthOfLongestSubstring("abcabcbb") === 3, lengthOfLongestSubstring("abba") === 2,
  characterReplacement("ABAB", 2) === 4, characterReplacement("AABABBA", 1) === 4,
  checkInclusion("ab", "eidbaooo") === true, checkInclusion("ab", "eidboaoo") === false,
  minWindow("ADOBECODEBANC", "ABC") === "BANC", minWindow("a", "aa") === "",
  eq(maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3), [3, 3, 5, 5, 6, 7]), eq(maxSlidingWindow([1], 1), [1]),
];
console.log(`${tests.filter(Boolean).length}/${tests.length} ca đúng`);
