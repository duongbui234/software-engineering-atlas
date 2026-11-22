// LeetCode 125, Valid Palindrome: hai cách, một bản sai, test và đo.
// Chạy: node valid-palindrome.ts

const isAlnum = (c: number) => (c >= 48 && c <= 57) || (c >= 65 && c <= 90) || (c >= 97 && c <= 122); // 0-9, A-Z, a-z
const lower = (c: number) => (c >= 65 && c <= 90 ? c + 32 : c);

// Cách 1: lọc ra chuỗi sạch, đảo ngược, so. O(n) thời gian, O(n) bộ nhớ phụ.
function cleanReverse(s: string): boolean {
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, "");
  return clean === [...clean].reverse().join("");
}

// Cách 2: hai con trỏ từ hai đầu, bỏ qua ký tự không phải chữ hoặc số. O(1) bộ nhớ phụ.
function twoPointers(s: string): boolean {
  let i = 0, j = s.length - 1;
  while (i < j) {
    const a = s.charCodeAt(i), b = s.charCodeAt(j);
    if (!isAlnum(a)) { i++; continue; }
    if (!isAlnum(b)) { j--; continue; }
    if (lower(a) !== lower(b)) return false; // khác nhau: dừng ngay, không cần đọc phần giữa
    i++; j--;
  }
  return true;
}

// SAI: dùng \w để lọc. \w gồm cả dấu gạch dưới "_", mà đề chỉ giữ chữ và số.
function wordRegex(s: string): boolean {
  const clean = s.toLowerCase().replace(/\W/g, "");
  return clean === [...clean].reverse().join("");
}

const cases: [string, boolean][] = [
  ["A man, a plan, a canal: Panama", true], ["race a car", false], [" ", true], ["", true],
  ["0P", false], ["a_", true], ["No 'x' in Nixon", true], [".,", true],
];
for (const fn of [cleanReverse, twoPointers, wordRegex]) {
  const bad = cases.filter(([s, want]) => fn(s) !== want).map(([s]) => JSON.stringify(s));
  console.log(`${fn.name.padEnd(13)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(" ") : ""}`);
}

// Đo: chuỗi 10⁶ ký tự là palindrome (phải đọc hết) và chuỗi lệch ngay ký tự đầu (dừng sớm).
const half = Array.from({ length: 250_000 }, (_, i) => "Ab, " [i % 4]).join("");
const pal = half + [...half].reverse().join("");
const notPal = "x" + pal.slice(1);
const median = (f: () => void) => {
  const ts: number[] = [];
  for (let k = 0; k < 5; k++) { const t = performance.now(); f(); ts.push(performance.now() - t); }
  return ts.sort((a, b) => a - b)[2];
};
console.log("\nn = 10⁶ ký tự          lọc + đảo   hai con trỏ   (ms, trung vị 5 lần)");
for (const [name, s] of [["palindrome", pal], ["sai ở ký tự đầu", notPal]] as const) {
  console.log(`${name.padEnd(22)} ${median(() => cleanReverse(s)).toFixed(2).padStart(9)} ${median(() => twoPointers(s)).toFixed(3).padStart(13)}`);
}
