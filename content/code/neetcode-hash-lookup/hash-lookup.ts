// Ga ARR-01, tra cứu bằng hash: ba bài, cùng một khuôn "hỏi bảng, rồi ghi vào bảng".
// Chạy: node hash-lookup.ts

// 217 Contains Duplicate: hỏi chính x; bảng là Set các giá trị đã gặp.
function containsDuplicate(nums: number[]): boolean {
  const seen = new Set<number>();
  for (const x of nums) {
    if (seen.has(x)) return true; // hỏi trước
    seen.add(x); // ghi sau
  }
  return false;
}

// 1 Two Sum: hỏi phần bù target - x; bảng là Map giá trị → chỉ số.
function twoSum(nums: number[], target: number): [number, number] | null {
  const seen = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const j = seen.get(target - nums[i]);
    if (j !== undefined) return [j, i];
    seen.set(nums[i], i);
  }
  return null;
}

// 128 Longest Consecutive Sequence: ghi HẾT vào bảng trước, rồi hỏi x - 1 để biết x có phải đầu dãy.
function longestConsecutive(nums: number[]): number {
  const all = new Set(nums);
  let best = 0;
  for (const x of all) { // duyệt Set, không duyệt nums: số trùng không được đếm lại
    if (all.has(x - 1)) continue; // x không phải đầu dãy, dãy của nó sẽ được đếm từ đầu dãy
    let len = 1;
    while (all.has(x + len)) len++;
    best = Math.max(best, len);
  }
  return best;
}

// Bản sai thường gặp: duyệt nums thay vì Set. Đúng kết quả, nhưng mỗi bản sao của một đầu dãy đi lại cả dãy.
function longestConsecutiveOverArray(nums: number[]): number {
  const all = new Set(nums);
  let best = 0;
  for (const x of nums) {
    if (all.has(x - 1)) continue;
    let len = 1;
    while (all.has(x + len)) len++;
    best = Math.max(best, len);
  }
  return best;
}

const cases: [string, unknown, unknown][] = [
  ["containsDuplicate [1,2,3,1]", containsDuplicate([1, 2, 3, 1]), true],
  ["containsDuplicate [1,2,3,4]", containsDuplicate([1, 2, 3, 4]), false],
  ["containsDuplicate []", containsDuplicate([]), false],
  ["twoSum [2,7,11,15] 9", twoSum([2, 7, 11, 15], 9), [0, 1]],
  ["twoSum [3,2,4] 6", twoSum([3, 2, 4], 6), [1, 2]],
  ["twoSum [3,3] 6", twoSum([3, 3], 6), [0, 1]],
  ["longestConsecutive [100,4,200,1,3,2]", longestConsecutive([100, 4, 200, 1, 3, 2]), 4],
  ["longestConsecutive [0,3,7,2,5,8,4,6,0,1]", longestConsecutive([0, 3, 7, 2, 5, 8, 4, 6, 0, 1]), 9],
  ["longestConsecutive []", longestConsecutive([]), 0],
];
let ok = 0;
for (const [name, got, want] of cases) {
  if (JSON.stringify(got) === JSON.stringify(want)) ok++;
  else console.log("SAI", name, got, want);
}
console.log(`${ok}/${cases.length} ca đúng`);

// Đo: một dãy 1..20 000, và số 1 (đầu dãy) lặp lại 20 000 lần.
const n = 20_000;
const nums = [...Array.from({ length: n }, (_, i) => i + 1), ...Array(n).fill(1)];
for (const [name, fn] of [["duyệt Set", longestConsecutive], ["duyệt mảng", longestConsecutiveOverArray]] as const) {
  const t = performance.now();
  const r = fn(nums);
  console.log(`${name.padEnd(11)} kết quả ${r}, ${(performance.now() - t).toFixed(1)} ms`);
}
