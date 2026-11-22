// Ga ARR-03: tiền tố, hậu tố và mã hóa. Giải 271 và 238, tự chạy test.
// Chạy: node prefix-suffix-encoding.ts

// 271: ghi độ dài TRƯỚC nội dung, để người đọc biết cắt ở đâu mà không phải đoán dấu phân cách.
function encode(strs: string[]): string {
  return strs.map((s) => `${s.length}#${s}`).join("");
}
function decode(s: string): string[] {
  const out: string[] = [];
  for (let i = 0; i < s.length; ) {
    const h = s.indexOf("#", i);
    const n = Number(s.slice(i, h));
    out.push(s.slice(h + 1, h + 1 + n));
    i = h + 1 + n;
  }
  return out;
}

// 238: lượt trái → phải ghi tích tiền tố, lượt phải → trái nhân tích hậu tố.
function productExceptSelf(nums: number[]): number[] {
  const out = new Array(nums.length).fill(1);
  let left = 1;
  for (let i = 0; i < nums.length; i++) { out[i] = left; left *= nums[i]; }
  let right = 1;
  for (let i = nums.length - 1; i >= 0; i--) { out[i] *= right; right *= nums[i]; }
  return out;
}

const eq = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
const tests = [
  eq(decode(encode(["neet", "code", "love", "you"])), ["neet", "code", "love", "you"]),
  eq(decode(encode([])), []), eq(decode(encode([""])), [""]), eq(decode(encode(["12#ab", "#"])), ["12#ab", "#"]),
  eq(productExceptSelf([1, 2, 3, 4]), [24, 12, 8, 6]), eq(productExceptSelf([-1, 1, 0, -3, 3]), [0, 0, 9, 0, 0]),
  eq(productExceptSelf([0, 0, 5]), [0, 0, 0]),
];
console.log(`${tests.filter(Boolean).length}/${tests.length} ca đúng`);
