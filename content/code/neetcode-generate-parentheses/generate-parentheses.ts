// LeetCode 22, Generate Parentheses: ba cách, một bản sai, test và đo.
// Chạy: node generate-parentheses.ts

// Cách 1: sinh cả 2^(2n) chuỗi gồm "(" và ")", rồi lọc chuỗi hợp lệ bằng một bộ đếm.
function generateAllFilter(n: number): string[] {
  const out: string[] = [];
  for (let mask = 0; mask < 1 << (2 * n); mask++) {
    let s = "", bal = 0;
    for (let i = 0; i < 2 * n && bal >= 0; i++) {
      const open = ((mask >> i) & 1) === 0;
      s += open ? "(" : ")";
      bal += open ? 1 : -1;
    }
    if (s.length === 2 * n && bal === 0) out.push(s);
  }
  return out;
}

// Cách 2: quay lui. Chỉ thêm "(" khi còn dưới n ngoặc mở, chỉ thêm ")" khi số đóng còn ít hơn số mở.
function backtrack(n: number): string[] {
  const out: string[] = [];
  const cur: string[] = []; // chuỗi đang dựng là một ngăn xếp: thêm ký tự, thử, rồi bỏ đi
  const go = (open: number, close: number) => {
    if (cur.length === 2 * n) { out.push(cur.join("")); return; }
    if (open < n) { cur.push("("); go(open + 1, close); cur.pop(); }
    if (close < open) { cur.push(")"); go(open, close + 1); cur.pop(); }
  };
  go(0, 0);
  return out;
}

// Cách 3: cùng cây lựa chọn, nhưng tự quản ngăn xếp thay cho ngăn xếp gọi hàm.
function explicitStack(n: number): string[] {
  const out: string[] = [];
  const st: [string, number, number][] = [["", 0, 0]];
  while (st.length > 0) {
    const [s, open, close] = st.pop()!;
    if (s.length === 2 * n) { out.push(s); continue; }
    if (close < open) st.push([s + ")", open, close + 1]);
    if (open < n) st.push([s + "(", open + 1, close]);
  }
  return out;
}

// Bản SAI: điều kiện đóng là close < n thay vì close < open, nên đóng được cả khi chưa có gì để đóng.
function wrongCloseLtN(n: number): string[] {
  const out: string[] = [];
  const go = (s: string, open: number, close: number) => {
    if (s.length === 2 * n) { out.push(s); return; }
    if (open < n) go(s + "(", open + 1, close);
    if (close < n) go(s + ")", open, close + 1);
  };
  go("", 0, 0);
  return out;
}

const catalan = (n: number) => { let c = 1; for (let i = 0; i < n; i++) c = (c * 2 * (2 * i + 1)) / (i + 2); return c; };
const valid = (s: string) => { let b = 0; for (const ch of s) { b += ch === "(" ? 1 : -1; if (b < 0) return false; } return b === 0; };
// Đúng khi: đủ C(n) chuỗi, không trùng, chuỗi nào cũng dài 2n và hợp lệ. Ba điều đó cùng nhau nghĩa là đúng tập đáp án.
const correct = (out: string[], n: number) => out.length === catalan(n) && new Set(out).size === out.length && out.every((s) => s.length === 2 * n && valid(s));

const ns = [1, 2, 3, 4, 5, 6, 7, 8];
for (const fn of [generateAllFilter, backtrack, explicitStack, wrongCloseLtN]) {
  const bad = ns.filter((n) => !correct(fn(n), n));
  console.log(`${fn.name.padEnd(18)} ${ns.length - bad.length}/${ns.length} ca đúng${bad.length ? `; sai ở n = ${bad.join(", ")}` : ""}`);
}
console.log(`\nwrongCloseLtN(2) = ${JSON.stringify(wrongCloseLtN(2))}`);
console.log(`backtrack(3)     = ${JSON.stringify(backtrack(3))}`);

console.log("\nn    C(n)      2^(2n)");
for (let n = 1; n <= 10; n++) console.log(`${String(n).padEnd(4)} ${String(catalan(n)).padEnd(9)} ${2 ** (2 * n)}`);

const time = (fn: (n: number) => string[], n: number, runs: number) => {
  const ts: number[] = [];
  for (let k = 0; k < runs; k++) { const t = performance.now(); fn(n); ts.push(performance.now() - t); }
  return ts.sort((a, b) => a - b)[Math.floor(runs / 2)];
};
console.log("\nn    sinh hết rồi lọc   quay lui   ngăn xếp tự quản   (ms, trung vị 3 lần)");
for (const n of [8, 10, 12, 14]) {
  const all = n <= 12 ? time(generateAllFilter, n, 3).toFixed(1) : "—";
  console.log(`${String(n).padEnd(4)} ${all.padStart(16)} ${time(backtrack, n, 3).toFixed(1).padStart(10)} ${time(explicitStack, n, 3).toFixed(1).padStart(18)}`);
}
