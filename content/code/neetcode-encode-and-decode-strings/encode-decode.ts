// LeetCode 271, Encode and Decode Strings: ba cách mã hóa và test.
// Chạy: node encode-decode.ts

// Cách 1 (SAI): nối bằng dấu phân cách. Hỏng khi chuỗi chứa chính dấu đó, và [] với [""] ra cùng "".
const joinEncode = (strs: string[]) => strs.join(",");
const joinDecode = (s: string) => (s === "" ? [] : s.split(","));

// Cách 2: thoát ký tự. "/" thành "//", "," thành "/,", rồi mỗi chuỗi kết thúc bằng "," (không phải ngăn cách).
function escapeEncode(strs: string[]): string {
  return strs.map((s) => s.replaceAll("/", "//").replaceAll(",", "/,") + ",").join("");
}
function escapeDecode(s: string): string[] {
  const out: string[] = [];
  let cur = "";
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "/") cur += s[++i]; // ký tự sau "/" luôn là chữ thật
    else if (s[i] === ",") { out.push(cur); cur = ""; }
    else cur += s[i];
  }
  return out;
}

// Cách 3: tiền tố độ dài. Mỗi chuỗi thành "<độ dài>#<nội dung>"; nội dung có "#" hay chữ số cũng không sao.
function lengthEncode(strs: string[]): string {
  return strs.map((s) => `${s.length}#${s}`).join("");
}
function lengthDecode(s: string): string[] {
  const out: string[] = [];
  let i = 0;
  while (i < s.length) {
    const hash = s.indexOf("#", i); // "#" đầu tiên từ i luôn thuộc phần độ dài: độ dài chỉ có chữ số
    const len = Number(s.slice(i, hash));
    out.push(s.slice(hash + 1, hash + 1 + len));
    i = hash + 1 + len; // nhảy qua nội dung, không đọc bên trong
  }
  return out;
}

// Bản sai: mã hóa đếm theo đơn vị UTF-16 (s.length) nhưng giải mã đếm theo code point ([...s]).
function lengthDecodeCodePoints(s: string): string[] {
  const cps = [...s];
  const out: string[] = [];
  let i = 0;
  while (i < cps.length) {
    let j = i;
    while (j < cps.length && cps[j] !== "#") j++;
    if (j === cps.length) break; // đọc lệch: không còn "#" nào, dừng thay vì lặp mãi
    const len = Number(cps.slice(i, j).join(""));
    out.push(cps.slice(j + 1, j + 1 + len).join(""));
    i = j + 1 + len;
  }
  return out;
}

const cases: string[][] = [
  ["neet", "code", "love", "you"], ["we", "say", ":", "yes"], [], [""], ["", ""],
  ["a,b", "c"], ["12#ab", "#"], ["a/", "/,"], ["😀é", "x"],
];
const show = (a: string[]) => JSON.stringify(a);
const variants: [string, (a: string[]) => string, (s: string) => string[]][] = [
  ["join(\",\")", joinEncode, joinDecode],
  ["thoát ký tự", escapeEncode, escapeDecode],
  ["tiền tố độ dài", lengthEncode, lengthDecode],
  ["độ dài lệch đơn vị", lengthEncode, lengthDecodeCodePoints],
];
for (const [name, enc, dec] of variants) {
  const bad = cases.filter((c) => show(dec(enc(c))) !== show(c)).map(show);
  console.log(`${name.padEnd(19)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(" ") : ""}`);
}
console.log(`\nví dụ: ${show(["12#ab", "#"])} → ${JSON.stringify(lengthEncode(["12#ab", "#"]))}`);
console.log(`"😀".length = ${"😀".length}, [..."😀"].length = ${[..."😀"].length}`);
