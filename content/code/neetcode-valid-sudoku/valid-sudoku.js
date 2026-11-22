// LeetCode 36, Valid Sudoku: ba cách và test.
// Chạy: node valid-sudoku.js

function unique(cells) {
  const digits = cells.filter((d) => d !== ".");
  return new Set(digits).size === digits.length;
}

function threePass(board) {
  for (let i = 0; i < 9; i++) {
    const col = board.map((r) => r[i]);
    const br = Math.floor(i / 3) * 3, bc = (i % 3) * 3;
    const box = [];
    for (let k = 0; k < 9; k++) box.push(board[br + Math.floor(k / 3)][bc + (k % 3)]);
    if (!unique(board[i]) || !unique(col) || !unique(box)) return false;
  }
  return true;
}

function onePass(board) {
  // Array(9).fill(new Set()) là bẫy: chín ô cùng trỏ về MỘT Set. Dùng Array.from với hàm tạo.
  const rows = Array.from({ length: 9 }, () => new Set());
  const cols = Array.from({ length: 9 }, () => new Set());
  const boxes = Array.from({ length: 9 }, () => new Set());
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const d = board[r][c];
      if (d === ".") continue;
      const b = Math.floor(r / 3) * 3 + Math.floor(c / 3);
      if (rows[r].has(d) || cols[c].has(d) || boxes[b].has(d)) return false;
      rows[r].add(d); cols[c].add(d); boxes[b].add(d);
    }
  }
  return true;
}

function bitmask(board) {
  const rows = new Array(9).fill(0), cols = new Array(9).fill(0), boxes = new Array(9).fill(0);
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const d = board[r][c];
      if (d === ".") continue;
      const bit = 1 << (Number(d) - 1);
      const b = Math.floor(r / 3) * 3 + Math.floor(c / 3);
      if ((rows[r] | cols[c] | boxes[b]) & bit) return false;
      rows[r] |= bit; cols[c] |= bit; boxes[b] |= bit;
    }
  }
  return true;
}

const parse = (rows) => rows.map((r) => r.split(""));
const ex = ["53..7....", "6..195...", ".98....6.", "8...6...3", "4..8.3..1", "7...2...6", ".6....28.", "...419..5", "....8..79"];
const change = (r, c, d) => { const b = parse(ex); b[r][c] = d; return b; };
const e = ".........";
const cases = [
  ["ví dụ hợp lệ", parse(ex), true],
  ["8 ở góc", change(0, 0, "8"), false],
  ["trùng hàng 0", change(0, 8, "5"), false],
  ["trùng chỉ trong ô 3×3", change(1, 1, "8"), false],
  ["bảng trống", parse(Array(9).fill(e)), true],
  ["hai số 1 ở hai ô khác nhau", parse(["...1.....", e, e, "1........", e, e, e, e, e]), true],
];
for (const fn of [threePass, onePass, bitmask]) {
  const ok = cases.filter(([, b, want]) => fn(b) === want).length;
  console.log(`${fn.name.padEnd(10)} ${ok}/${cases.length} ca đúng`);
}
