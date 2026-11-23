// LeetCode 150, Evaluate Reverse Polish Notation: hai cách đúng và test.
// Chạy: node eval-rpn.js

const OPS = new Set(["+", "-", "*", "/"]);

function apply(op, a, b) {
  if (op === "+") return a + b;
  if (op === "-") return a - b;
  if (op === "*") return a * b;
  return Math.trunc(a / b); // a / b là chia số thực; | 0 cũng làm tròn về 0 nhưng cắt về 32 bit
}

function evalStack(tokens) {
  const st = [];
  for (const t of tokens) {
    if (OPS.has(t)) {
      const b = st.pop(), a = st.pop();
      st.push(apply(t, a, b));
    } else st.push(Number(t));
  }
  return st[0];
}

function evalRecursive(tokens) {
  let i = tokens.length - 1;
  const go = () => {
    const t = tokens[i--];
    if (!OPS.has(t)) return Number(t);
    const b = go(), a = go();
    return apply(t, a, b);
  };
  return go();
}

const cases = [
  [["2", "1", "+", "3", "*"], 9], [["4", "13", "5", "/", "+"], 6],
  [["10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"], 22],
  [["3", "4", "-"], -1], [["7", "-2", "/"], -3], [["-7", "2", "/"], -3], [["42"], 42],
];
for (const fn of [evalStack, evalRecursive]) {
  const ok = cases.filter(([t, want]) => fn(t) === want).length;
  console.log(`${fn.name.padEnd(14)} ${ok}/${cases.length} ca đúng`);
}
