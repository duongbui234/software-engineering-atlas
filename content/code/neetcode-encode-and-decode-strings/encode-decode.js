// LeetCode 271, Encode and Decode Strings: ba cách mã hóa và test.
// Chạy: node encode-decode.js

const joinEncode = (strs) => strs.join(","); // SAI: [] và [""] cùng ra ""
const joinDecode = (s) => (s === "" ? [] : s.split(","));

function escapeEncode(strs) {
  return strs.map((s) => s.replaceAll("/", "//").replaceAll(",", "/,") + ",").join("");
}

function escapeDecode(s) {
  const out = [];
  let cur = "";
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "/") cur += s[++i];
    else if (s[i] === ",") { out.push(cur); cur = ""; }
    else cur += s[i];
  }
  return out;
}

function lengthEncode(strs) {
  return strs.map((s) => `${s.length}#${s}`).join(""); // length đếm đơn vị UTF-16
}

function lengthDecode(s) {
  const out = [];
  let i = 0;
  while (i < s.length) {
    const h = s.indexOf("#", i);
    const n = Number(s.slice(i, h));
    out.push(s.slice(h + 1, h + 1 + n)); // slice cũng đếm UTF-16: khớp với lúc mã hóa
    i = h + 1 + n;
  }
  return out;
}

const cases = [["neet", "code", "love", "you"], ["we", "say", ":", "yes"], [], [""], ["", ""],
  ["a,b", "c"], ["12#ab", "#"], ["a/", "/,"], ["😀é", "x"]];
for (const [name, enc, dec] of [["join(\",\")", joinEncode, joinDecode], ["thoát ký tự", escapeEncode, escapeDecode], ["tiền tố độ dài", lengthEncode, lengthDecode]]) {
  const ok = cases.filter((c) => JSON.stringify(dec(enc(c))) === JSON.stringify(c)).length;
  console.log(`${name.padEnd(15)} ${ok}/${cases.length} ca đúng`);
}
