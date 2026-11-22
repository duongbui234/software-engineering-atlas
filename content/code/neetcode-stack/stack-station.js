// Ga ARR-06: ngăn xếp. Giải 20, 155, 150 và 22, tự chạy test.
// Chạy: node stack-station.js

// 20
function isValid(s) {
  const open = { ")": "(", "]": "[", "}": "{" };
  const st = [];
  for (const ch of s) {
    if (!(ch in open)) st.push(ch);
    else if (st.pop() !== open[ch]) return false;
  }
  return st.length === 0;
}

// 155: mỗi tầng nhớ kèm min tới tầng đó.
class MinStack {
  st = [];
  push(x) { this.st.push([x, this.st.length ? Math.min(x, this.getMin()) : x]); }
  pop() { this.st.pop(); }
  top() { return this.st.at(-1)[0]; }
  getMin() { return this.st.at(-1)[1]; }
}

// 150
function evalRPN(tokens) {
  const st = [];
  for (const t of tokens) {
    if (!["+", "-", "*", "/"].includes(t)) { st.push(Number(t)); continue; }
    const b = st.pop(), a = st.pop();
    st.push(t === "+" ? a + b : t === "-" ? a - b : t === "*" ? a * b : Math.trunc(a / b)); // Math.floor(-3.5) = -4, sai
  }
  return st[0];
}

// 22
function generateParenthesis(n) {
  const out = [], cur = [];
  const go = (open, close) => {
    if (cur.length === 2 * n) { out.push(cur.join("")); return; }
    if (open < n) { cur.push("("); go(open + 1, close); cur.pop(); }
    if (close < open) { cur.push(")"); go(open, close + 1); cur.pop(); }
  };
  go(0, 0);
  return out;
}

const ms = new MinStack();
ms.push(-2); ms.push(0); ms.push(-3);
const m1 = ms.getMin(); ms.pop();
const tests = [
  isValid("()[]{}"), !isValid("([)]"), !isValid("(("),
  m1 === -3 && ms.top() === 0 && ms.getMin() === -2,
  evalRPN(["2", "1", "+", "3", "*"]) === 9, evalRPN(["4", "13", "5", "/", "+"]) === 6,
  evalRPN(["10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"]) === 22, evalRPN(["-7", "2", "/"]) === -3,
  JSON.stringify(generateParenthesis(3)) === JSON.stringify(["((()))", "(()())", "(())()", "()(())", "()()()"]),
  generateParenthesis(4).length === 14,
];
console.log(`${tests.filter(Boolean).length}/${tests.length} ca đúng`);
