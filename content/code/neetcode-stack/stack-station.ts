// Ga ARR-06: ngăn xếp. Giải 20, 155, 150 và 22, tự chạy test.
// Chạy: node stack-station.ts

// 20: ngoặc đóng phải khớp với ngoặc mở gần nhất chưa đóng, tức đỉnh ngăn xếp.
function isValid(s: string): boolean {
  const open: Record<string, string> = { ")": "(", "]": "[", "}": "{" };
  const st: string[] = [];
  for (const ch of s) {
    if (!(ch in open)) st.push(ch);
    else if (st.pop() !== open[ch]) return false;
  }
  return st.length === 0;
}

// 155: mỗi tầng ngăn xếp nhớ kèm giá trị nhỏ nhất tính tới tầng đó.
class MinStack {
  private st: [number, number][] = []; // [giá trị, min tới tầng này]
  push(x: number) { this.st.push([x, this.st.length ? Math.min(x, this.getMin()) : x]); }
  pop() { this.st.pop(); }
  top() { return this.st[this.st.length - 1][0]; }
  getMin() { return this.st[this.st.length - 1][1]; }
}

// 150: số thì đẩy vào; toán tử thì lấy hai số trên đỉnh (số lấy ra SAU là vế trái).
function evalRPN(tokens: string[]): number {
  const st: number[] = [];
  for (const t of tokens) {
    if (!"+-*/".includes(t) || t.length > 1) { st.push(Number(t)); continue; } // "-11" là số, không phải phép trừ
    const b = st.pop()!, a = st.pop()!;
    st.push(t === "+" ? a + b : t === "-" ? a - b : t === "*" ? a * b : Math.trunc(a / b)); // chia làm tròn về 0
  }
  return st[0];
}

// 22: quay lui; chuỗi đang dựng chính là ngăn xếp các lựa chọn, thêm ký tự rồi bỏ đi.
function generateParenthesis(n: number): string[] {
  const out: string[] = [];
  const cur: string[] = [];
  const go = (open: number, close: number) => {
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
