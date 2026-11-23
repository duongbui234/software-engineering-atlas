// Đo độ sâu đệ quy tối đa của cách "đệ quy từ cuối" bằng tìm kiếm nhị phân trên n.
// Chạy: node recursion-depth.js
const OPS = new Set(["+", "-", "*", "/"]);
const apply = (t, a, b) => t === "+" ? a + b : t === "-" ? a - b : t === "*" ? a * b : Math.trunc(a / b);
function evalRecursive(tokens) { let i = tokens.length - 1; const go = () => { const t = tokens[i--]; if (!OPS.has(t)) return Number(t); const b = go(), a = go(); return apply(t, a, b); }; return go(); }
const make = (n) => { const t = ["1"]; for (let k = 0; k < n; k++) t.push("1", "+"); return t; };
const ok = (n) => { try { evalRecursive(make(n)); return true; } catch { return false; } };
let lo = 1, hi = 100000; while (lo < hi) { const m = (lo + hi + 1) >> 1; ok(m) ? (lo = m) : (hi = m - 1); }
console.log("JS max depth", lo);
