// LeetCode 22, Generate Parentheses: quay lui, ngăn xếp tự quản và test.
// Chạy: node generate-parentheses.js

function backtrack(n) {
  const out = [];
  const go = (s, open, close) => { // chuỗi JS bất biến: s + "(" là chuỗi mới, nhánh khác không bị ảnh hưởng
    if (s.length === 2 * n) { out.push(s); return; }
    if (open < n) go(s + "(", open + 1, close);
    if (close < open) go(s + ")", open, close + 1);
  };
  go("", 0, 0);
  return out;
}

function explicitStack(n) {
  const out = [];
  const st = [["", 0, 0]];
  while (st.length > 0) {
    const [s, open, close] = st.pop();
    if (s.length === 2 * n) { out.push(s); continue; }
    if (close < open) st.push([s + ")", open, close + 1]);
    if (open < n) st.push([s + "(", open + 1, close]);
  }
  return out;
}

const catalan = (n) => { let c = 1; for (let i = 0; i < n; i++) c = (c * 2 * (2 * i + 1)) / (i + 2); return c; };
const valid = (s) => { let b = 0; for (const ch of s) { b += ch === "(" ? 1 : -1; if (b < 0) return false; } return b === 0; };
const correct = (out, n) => out.length === catalan(n) && new Set(out).size === out.length && out.every((s) => s.length === 2 * n && valid(s));

for (const fn of [backtrack, explicitStack]) {
  let ok = 0;
  for (let n = 1; n <= 8; n++) if (correct(fn(n), n)) ok++;
  console.log(`${fn.name.padEnd(14)} ${ok}/8 ca đúng`);
}
