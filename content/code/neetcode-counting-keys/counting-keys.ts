// Ga ARR-02, khóa chuẩn và đếm tần suất: biến mỗi phần tử thành một KHÓA, rồi đếm hoặc gom theo khóa đó.
// Chạy: node counting-keys.ts

// 242 Valid Anagram: khóa là chữ cái, giá trị là số lần; một mảng 26 ô thay cho Map.
function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) return false;
  const count = new Array(26).fill(0);
  for (let i = 0; i < s.length; i++) {
    count[s.charCodeAt(i) - 97]++;
    count[t.charCodeAt(i) - 97]--;
  }
  return count.every((c) => c === 0);
}

// 49 Group Anagrams: bảng đếm 26 ô CỦA MỖI TỪ trở thành khóa của một Map lớn.
function groupAnagrams(words: string[]): string[][] {
  const groups = new Map<string, string[]>();
  for (const w of words) {
    const count = new Array(26).fill(0);
    for (let i = 0; i < w.length; i++) count[w.charCodeAt(i) - 97]++;
    const key = count.join(","); // có dấu phẩy: [1,11] và [11,1] không được thành cùng chuỗi "111"
    const g = groups.get(key);
    if (g) g.push(w);
    else groups.set(key, [w]);
  }
  return [...groups.values()];
}

// 347 Top K Frequent Elements: đếm, rồi dùng chính SỐ LẦN làm chỉ số mảng (bucket sort).
function topKFrequent(nums: number[], k: number): number[] {
  const freq = new Map<number, number>();
  for (const x of nums) freq.set(x, (freq.get(x) ?? 0) + 1);
  const buckets: number[][] = Array.from({ length: nums.length + 1 }, () => []);
  for (const [x, c] of freq) buckets[c].push(x);
  const out: number[] = [];
  for (let c = nums.length; c > 0 && out.length < k; c--) out.push(...buckets[c]);
  return out.slice(0, k);
}

// 36 Valid Sudoku: khóa là (hàng, số), (cột, số), (ô 3×3, số); ô 3×3 có chỉ số chuẩn floor(r/3)*3 + floor(c/3).
function isValidSudoku(board: string[][]): boolean {
  const seen = new Set<string>();
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const d = board[r][c];
      if (d === ".") continue;
      const box = Math.floor(r / 3) * 3 + Math.floor(c / 3);
      for (const key of [`r${r}:${d}`, `c${c}:${d}`, `b${box}:${d}`]) {
        if (seen.has(key)) return false; // vẫn là khuôn của ga 1: hỏi trước, ghi sau
        seen.add(key);
      }
    }
  }
  return true;
}

const board = [
  "53..7....", "6..195...", ".98....6.", "8...6...3", "4..8.3..1",
  "7...2...6", ".6....28.", "...419..5", "....8..79",
].map((row) => row.split(""));
const broken = board.map((row) => [...row]);
broken[0][0] = "8"; // cột 0 đã có số 8 ở hàng 3, và ô 3×3 đầu tiên đã có số 8 ở hàng 2

const norm = (g: string[][]) => g.map((x) => [...x].sort().join(" ")).sort();
const cases: [string, unknown, unknown][] = [
  ["isAnagram anagram/nagaram", isAnagram("anagram", "nagaram"), true],
  ["isAnagram rat/car", isAnagram("rat", "car"), false],
  ["isAnagram aacc/ccac", isAnagram("aacc", "ccac"), false],
  ["groupAnagrams eat…bat", norm(groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"])), ["ate eat tea", "bat", "nat tan"]],
  ["groupAnagrams [\"\"]", groupAnagrams([""]), [[""]]],
  ["topKFrequent [1,1,1,2,2,3] 2", topKFrequent([1, 1, 1, 2, 2, 3], 2), [1, 2]],
  ["topKFrequent [1] 1", topKFrequent([1], 1), [1]],
  ["isValidSudoku ví dụ 1", isValidSudoku(board), true],
  ["isValidSudoku 8 ở góc", isValidSudoku(broken), false],
];
let ok = 0;
for (const [name, got, want] of cases) {
  if (JSON.stringify(got) === JSON.stringify(want)) ok++;
  else console.log("SAI", name, JSON.stringify(got), JSON.stringify(want));
}
console.log(`${ok}/${cases.length} ca đúng`);

// Đo: vì sao khóa cần dấu phân cách. Không có dấu phẩy, hai bảng đếm khác nhau có thể ghép ra cùng một chuỗi.
const a = new Array(26).fill(0), b = new Array(26).fill(0);
a[0] = 1; a[1] = 11; // "a" 1 lần, "b" 11 lần
b[0] = 11; b[1] = 1; // "a" 11 lần, "b" 1 lần
console.log(`join(""):  ${a.join("") === b.join("") ? "TRÙNG khóa" : "khác khóa"}; join(","): ${a.join(",") === b.join(",") ? "TRÙNG khóa" : "khác khóa"}`);
