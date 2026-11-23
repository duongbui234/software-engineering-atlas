// LeetCode 155, Min Stack: ba cách và test.
// Chạy: node min-stack.js

class PairMinStack {
  constructor() { this.a = []; }
  push(x) {
    const m = this.a.length === 0 ? x : Math.min(x, this.a[this.a.length - 1][1]);
    this.a.push([x, m]);
  }
  pop() { this.a.pop(); }
  top() { return this.a[this.a.length - 1][0]; }
  getMin() { return this.a[this.a.length - 1][1]; }
}

class TwoStackMinStack {
  constructor() { this.a = []; this.mins = []; }
  push(x) {
    this.a.push(x);
    if (this.mins.length === 0 || x <= this.mins[this.mins.length - 1]) this.mins.push(x);
  }
  pop() {
    if (this.a.pop() === this.mins[this.mins.length - 1]) this.mins.pop();
  }
  top() { return this.a[this.a.length - 1]; }
  getMin() { return this.mins[this.mins.length - 1]; } // ngăn rỗng thì trả undefined, không ném lỗi
}

class DiffMinStack {
  constructor() { this.d = []; this.min = 0; }
  push(x) {
    if (this.d.length === 0) { this.d.push(0); this.min = x; return; }
    this.d.push(x - this.min); // số của JS là double: hiệu hai số 32 bit vẫn chính xác
    if (x < this.min) this.min = x;
  }
  pop() { const diff = this.d.pop(); if (diff < 0) this.min -= diff; }
  top() { const diff = this.d[this.d.length - 1]; return diff < 0 ? this.min : this.min + diff; }
  getMin() { return this.min; }
}

const cases = [
  [[["push", -2], ["push", 0], ["push", -3], ["getMin"], ["pop"], ["top"], ["getMin"]], [-3, 0, -2]],
  [[["push", 0], ["push", 1], ["push", 0], ["getMin"], ["pop"], ["getMin"]], [0, 0]],
  [[["push", 1], ["push", 2], ["push", 3], ["getMin"], ["pop"], ["pop"], ["getMin"]], [1, 1]],
  [[["push", 3], ["push", 2], ["push", 1], ["getMin"], ["pop"], ["getMin"], ["pop"], ["getMin"]], [1, 2, 3]],
  [[["push", 2147483647], ["push", -2147483648], ["getMin"], ["top"], ["pop"], ["getMin"], ["top"]], [-2147483648, -2147483648, 2147483647, 2147483647]],
  [[["push", 500], ["pop"], ["push", 700], ["getMin"]], [700]],
];
for (const Cls of [PairMinStack, TwoStackMinStack, DiffMinStack]) {
  const ok = cases.filter(([ops, want]) => {
    const s = new Cls(), out = [];
    for (const [op, x] of ops) op === "push" ? s.push(x) : op === "pop" ? s.pop() : out.push(s[op]());
    return JSON.stringify(out) === JSON.stringify(want);
  }).length;
  console.log(`${Cls.name.padEnd(17)} ${ok}/${cases.length} ca đúng`);
}
