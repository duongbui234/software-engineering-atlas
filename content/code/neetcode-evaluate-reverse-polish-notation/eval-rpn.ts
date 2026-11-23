// LeetCode 150, Evaluate Reverse Polish Notation: hai cách đúng, ba bản sai, test và đo.
// Chạy: node eval-rpn.ts

const OPS = new Set(["+", "-", "*", "/"]);

function apply(op: string, a: number, b: number): number {
  switch (op) {
    case "+": return a + b;
    case "-": return a - b;
    case "*": return a * b;
    default: return Math.trunc(a / b); // đề: chia làm tròn về 0. Math.floor(-7 / 2) = -4, Math.trunc = -3
  }
}

// Cách 1: ngăn xếp. Số thì đẩy vào; toán tử thì lấy hai số trên đỉnh, số lấy ra SAU là vế trái.
function evalStack(tokens: string[]): number {
  const st: number[] = [];
  for (const t of tokens) {
    if (OPS.has(t)) { // so cả token với tập toán tử: "-11" không nằm trong tập
      const b = st.pop()!, a = st.pop()!;
      st.push(apply(t, a, b));
    } else st.push(Number(t));
  }
  return st[0];
}

// Cách 2: đệ quy từ cuối. Token cuối là gốc của cây biểu thức; vế phải nằm ngay trước nó.
function evalRecursive(tokens: string[]): number {
  let i = tokens.length - 1;
  const go = (): number => {
    const t = tokens[i--];
    if (!OPS.has(t)) return Number(t);
    const b = go(), a = go(); // vế phải được đọc trước khi đi ngược
    return apply(t, a, b);
  };
  return go();
}

// SAI: lấy hai số ra rồi tính theo thứ tự lấy ra (đỉnh làm vế trái).
function evalSwapped(tokens: string[]): number {
  const st: number[] = [];
  for (const t of tokens) {
    if (OPS.has(t)) { const a = st.pop()!, b = st.pop()!; st.push(apply(t, a, b)); }
    else st.push(Number(t));
  }
  return st[0];
}

// SAI: chia bằng Math.floor (giống // của Python): lệch 1 khi kết quả âm và không chia hết.
function evalFloor(tokens: string[]): number {
  const st: number[] = [];
  for (const t of tokens) {
    if (OPS.has(t)) {
      const b = st.pop()!, a = st.pop()!;
      st.push(t === "/" ? Math.floor(a / b) : apply(t, a, b));
    } else st.push(Number(t));
  }
  return st[0];
}

// SAI: nhận toán tử bằng ký tự đầu. "-11" bị coi là phép trừ.
function evalFirstChar(tokens: string[]): number {
  const st: number[] = [];
  for (const t of tokens) {
    if ("+-*/".includes(t[0])) { const b = st.pop()!, a = st.pop()!; st.push(apply(t[0], a, b)); }
    else st.push(Number(t));
  }
  return st[0];
}

const cases: [string[], number][] = [
  [["2", "1", "+", "3", "*"], 9],
  [["4", "13", "5", "/", "+"], 6],
  [["10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"], 22],
  [["3", "4", "-"], -1],
  [["7", "-2", "/"], -3],
  [["-7", "2", "/"], -3],
  [["42"], 42],
];
for (const fn of [evalStack, evalRecursive, evalSwapped, evalFloor, evalFirstChar]) {
  const bad = cases.filter(([t, want]) => fn(t) !== want).map(([t]) => `[${t.join(" ")}] → ${fn(t)}`);
  console.log(`${fn.name.padEnd(14)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(", ") : ""}`);
}

// Đo: biểu thức "1 1 + 1 + 1 + …" (cây lệch trái, sâu n). Đệ quy đi sâu n tầng.
const leftDeep = (n: number) => { const t = ["1"]; for (let i = 0; i < n; i++) t.push("1", "+"); return t; };
const median = (fn: () => void, runs: number) => {
  const ts: number[] = [];
  for (let k = 0; k < runs; k++) { const s = performance.now(); fn(); ts.push(performance.now() - s); }
  return ts.sort((a, b) => a - b)[Math.floor(runs / 2)];
};
console.log("\nsố toán tử   ngăn xếp    đệ quy   (ms, trung vị 5 lần)");
for (const n of [1_000, 5_000, 100_000, 1_000_000]) {
  const t = leftDeep(n);
  let rec: string;
  try { rec = median(() => evalRecursive(t), 5).toFixed(2); } catch (e) { rec = (e as Error).constructor.name; }
  console.log(`${String(n).padEnd(12)} ${median(() => evalStack(t), 5).toFixed(2).padStart(8)}  ${rec.padStart(10)}`);
}
