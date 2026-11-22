// Ga ARR-04: hai con trỏ. Giải 125, 167, 15, 11, 42 bằng cùng một khuôn, tự chạy test.
// Chạy: node two-pointers.ts
// Khuôn: i ở đầu, j ở cuối; mỗi bước dời ĐÚNG MỘT con trỏ, và chỉ dời khi chắc rằng phần bị bỏ không chứa đáp án.

const alnum = /[a-z0-9]/i;

// 125: hai đầu phải khớp nhau; bỏ qua ký tự không phải chữ hoặc số.
function isPalindrome(s: string): boolean {
  for (let i = 0, j = s.length - 1; i < j; ) {
    if (!alnum.test(s[i])) i++;
    else if (!alnum.test(s[j])) j--;
    else if (s[i++].toLowerCase() !== s[j--].toLowerCase()) return false;
  }
  return true;
}

// 167: tổng nhỏ thì tăng i, tổng lớn thì giảm j. Chỉ số đếm từ 1.
function twoSumSorted(nums: number[], target: number): number[] {
  for (let i = 0, j = nums.length - 1; i < j; ) {
    const s = nums[i] + nums[j];
    if (s === target) return [i + 1, j + 1];
    if (s < target) i++; else j--;
  }
  return [];
}

// 15: sắp xếp, cố định a[i], chạy khuôn 167 trên đoạn bên phải với target −a[i].
function threeSum(nums: number[]): number[][] {
  const a = [...nums].sort((x, y) => x - y), out: number[][] = [];
  for (let i = 0; i < a.length - 2 && a[i] <= 0; i++) {
    if (i > 0 && a[i] === a[i - 1]) continue;
    for (let lo = i + 1, hi = a.length - 1; lo < hi; ) {
      const s = a[i] + a[lo] + a[hi];
      if (s < 0) lo++;
      else if (s > 0) hi--;
      else {
        out.push([a[i], a[lo++], a[hi--]]);
        while (lo < hi && a[lo] === a[lo - 1]) lo++;
      }
    }
  }
  return out;
}

// 11: dời cột thấp hơn; cột thấp ghép với cột nào gần hơn cũng không thể tốt hơn.
function maxArea(h: number[]): number {
  let best = 0;
  for (let i = 0, j = h.length - 1; i < j; ) {
    best = Math.max(best, (j - i) * Math.min(h[i], h[j]));
    if (h[i] < h[j]) i++; else j--;
  }
  return best;
}

// 42: bên có max nhỏ hơn thì mực nước ở bên đó đã chắc chắn.
function trap(h: number[]): number {
  let total = 0, lm = 0, rm = 0;
  for (let i = 0, j = h.length - 1; i < j; ) {
    lm = Math.max(lm, h[i]);
    rm = Math.max(rm, h[j]);
    if (lm < rm) total += lm - h[i++];
    else total += rm - h[j--];
  }
  return total;
}

const eq = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
const tests = [
  isPalindrome("A man, a plan, a canal: Panama"), !isPalindrome("race a car"), isPalindrome(" "),
  eq(twoSumSorted([2, 7, 11, 15], 9), [1, 2]), eq(twoSumSorted([-1, 0], -1), [1, 2]),
  eq(threeSum([-1, 0, 1, 2, -1, -4]), [[-1, -1, 2], [-1, 0, 1]]), eq(threeSum([0, 0, 0, 0]), [[0, 0, 0]]),
  maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]) === 49, maxArea([1, 1]) === 1,
  trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]) === 6, trap([4, 2, 0, 3, 2, 5]) === 9,
];
console.log(`${tests.filter(Boolean).length}/${tests.length} ca đúng`);
