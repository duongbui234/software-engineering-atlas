// LeetCode 20, Valid Parentheses: các cách đúng, ba bản sai, test và đo.
// Chạy: node valid-parentheses.ts

// SAI: một bộ đếm chung. Không phân biệt loại ngoặc: "(]" thành hợp lệ.
function singleCounter(s: string): boolean {
  let depth = 0;
  for (const ch of s) {
    depth += "([{".includes(ch) ? 1 : -1;
    if (depth < 0) return false;
  }
  return depth === 0;
}

// SAI: ba bộ đếm riêng. Đúng số lượng từng loại nhưng không biết thứ tự lồng: "([)]" thành hợp lệ.
function threeCounters(s: string): boolean {
  const depth: Record<string, number> = { "(": 0, "[": 0, "{": 0 };
  const open: Record<string, string> = { ")": "(", "]": "[", "}": "{" };
  for (const ch of s) {
    if (ch in depth) depth[ch]++;
    else if (--depth[open[ch]] < 0) return false;
  }
  return Object.values(depth).every((d) => d === 0);
}

// Đúng nhưng O(n²): xóa lặp lại các cặp kề nhau "()", "[]", "{}" tới khi không xóa được nữa.
function replacePairs(s: string): boolean {
  let prev = "";
  while (s !== prev) {
    prev = s;
    s = s.replaceAll("()", "").replaceAll("[]", "").replaceAll("{}", "");
  }
  return s === "";
}

// Ngăn xếp: ngoặc mở thì đẩy vào, ngoặc đóng thì phải khớp với ngoặc mở trên đỉnh.
function stack(s: string): boolean {
  if (s.length % 2 === 1) return false; // độ dài lẻ thì chắc chắn có ngoặc lẻ đôi
  const open: Record<string, string> = { ")": "(", "]": "[", "}": "{" };
  const st: string[] = [];
  for (const ch of s) {
    if (!(ch in open)) st.push(ch);
    else if (st.pop() !== open[ch]) return false; // pop trên mảng rỗng trả undefined, cũng khác "(" nên vẫn đúng
  }
  return st.length === 0; // còn ngoặc mở chưa đóng thì sai
}

// SAI: quên kiểm ngăn xếp rỗng ở cuối: "((" thành hợp lệ.
function stackNoFinalCheck(s: string): boolean {
  const open: Record<string, string> = { ")": "(", "]": "[", "}": "{" };
  const st: string[] = [];
  for (const ch of s) {
    if (!(ch in open)) st.push(ch);
    else if (st.pop() !== open[ch]) return false;
  }
  return true;
}

const cases: [string, boolean][] = [
  ["()", true], ["()[]{}", true], ["(]", false], ["([)]", false], ["{[]}", true],
  ["((", false], ["){", false], ["", true], ["(((([]))))", true],
];
for (const fn of [singleCounter, threeCounters, replacePairs, stack, stackNoFinalCheck]) {
  const bad = cases.filter(([s, want]) => fn(s) !== want).map(([s]) => JSON.stringify(s));
  console.log(`${fn.name.padEnd(18)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(" ") : ""}`);
}

// Đo: chuỗi lồng sâu "((((…))))", trường hợp tệ nhất của replacePairs (mỗi lượt chỉ xóa được một cặp ở giữa).
const median = (xs: number[]) => xs.sort((a, b) => a - b)[Math.floor(xs.length / 2)];
const time = (fn: (s: string) => boolean, s: string, runs: number) => {
  const ts: number[] = [];
  for (let k = 0; k < runs; k++) { const t = performance.now(); fn(s); ts.push(performance.now() - t); }
  return median(ts);
};
console.log("\nn (độ dài)   xóa cặp lặp   ngăn xếp   (ms, trung vị 3 lần, chuỗi lồng sâu)");
for (const n of [2_000, 4_000, 8_000, 16_000]) {
  const s = "(".repeat(n / 2) + ")".repeat(n / 2);
  console.log(`${String(n).padEnd(12)} ${time(replacePairs, s, 3).toFixed(1).padStart(11)} ${time(stack, s, 3).toFixed(2).padStart(10)}`);
}
const big = "(".repeat(500_000) + ")".repeat(500_000);
console.log(`${"1000000".padEnd(12)} ${"—".padStart(11)} ${time(stack, big, 3).toFixed(2).padStart(10)}`);
