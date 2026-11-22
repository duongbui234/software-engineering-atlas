// LeetCode 36, Valid Sudoku: ba cách và test.
// Chạy: node valid-sudoku.ts

// Cách 1, ba lượt: kiểm hàng, kiểm cột, kiểm từng ô 3×3, mỗi nhóm một Set mới.
function threePass(board: string[][]): boolean {
  const unique = (cells: string[]) => {
    const seen = new Set<string>();
    for (const d of cells) {
      if (d === ".") continue;
      if (seen.has(d)) return false;
      seen.add(d);
    }
    return true;
  };
  for (let i = 0; i < 9; i++) {
    const row = board[i];
    const col = board.map((r) => r[i]);
    const br = Math.floor(i / 3) * 3, bc = (i % 3) * 3; // ô 3×3 thứ i: góc trên trái
    const box: string[] = [];
    for (let r = br; r < br + 3; r++) for (let c = bc; c < bc + 3; c++) box.push(board[r][c]);
    if (!unique(row) || !unique(col) || !unique(box)) return false;
  }
  return true;
}

// Cách 2, một lượt với 27 Set: rows[r], cols[c], boxes[b].
function onePass(board: string[][]): boolean {
  const rows = Array.from({ length: 9 }, () => new Set<string>());
  const cols = Array.from({ length: 9 }, () => new Set<string>());
  const boxes = Array.from({ length: 9 }, () => new Set<string>());
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

// Cách 3, bitmask: mỗi hàng/cột/ô 3×3 là một số nguyên 9 bit; bit k bật nghĩa là đã có chữ số k+1.
function bitmask(board: string[][]): boolean {
  const rows = new Array(9).fill(0), cols = new Array(9).fill(0), boxes = new Array(9).fill(0);
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const d = board[r][c];
      if (d === ".") continue;
      const bit = 1 << (d.charCodeAt(0) - 49); // "1" là mã 49 → bit 0
      const b = Math.floor(r / 3) * 3 + Math.floor(c / 3);
      if ((rows[r] | cols[c] | boxes[b]) & bit) return false;
      rows[r] |= bit; cols[c] |= bit; boxes[b] |= bit;
    }
  }
  return true;
}

// Bản sai hay gặp: chỉ số ô 3×3 viết thành r/3 + c/3 (thiếu nhân 3): ô (0,3) và ô (3,0) bị gộp chung.
function wrongBoxIndex(board: string[][]): boolean {
  const seen = new Set<string>();
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const d = board[r][c];
      if (d === ".") continue;
      const b = Math.floor(r / 3) + Math.floor(c / 3);
      for (const k of [`r${r}${d}`, `c${c}${d}`, `b${b}${d}`]) {
        if (seen.has(k)) return false;
        seen.add(k);
      }
    }
  }
  return true;
}

const parse = (rows: string[]) => rows.map((r) => r.split(""));
const example = parse(["53..7....", "6..195...", ".98....6.", "8...6...3", "4..8.3..1", "7...2...6", ".6....28.", "...419..5", "....8..79"]);
const withChange = (r: number, c: number, d: string) => { const b = example.map((row) => [...row]); b[r][c] = d; return b; };
const empty = parse(Array(9).fill("........."));
const twoBoxes = parse(["...1.....", ".........", ".........", "1........", ".........", ".........", ".........", ".........", "........."]); // số 1 ở (0,3) và (3,0): khác hàng, khác cột, khác ô 3×3 (ô 1 và ô 3): hợp lệ

const cases: [string, string[][], boolean][] = [
  ["ví dụ hợp lệ", example, true],
  ["8 ở góc (trùng cột và ô 3×3)", withChange(0, 0, "8"), false],
  ["trùng hàng 0", withChange(0, 8, "5"), false],
  ["trùng chỉ trong ô 3×3", withChange(1, 1, "8"), false],
  ["bảng trống", empty, true],
  ["hai số 1 ở hai ô khác nhau", twoBoxes, true],
];
for (const [name, fn] of Object.entries({ threePass, onePass, bitmask, wrongBoxIndex })) {
  const bad = cases.filter(([, b, want]) => fn(b) !== want).map(([n]) => n);
  console.log(`${name.padEnd(14)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? `; sai ở: ${bad.join(", ")}` : ""}`);
}

// Đo: kiểm 100 000 lần cùng một bảng hợp lệ (bảng luôn 9×9, nên đây là đo hằng số, không phải độ phức tạp).
const median = (xs: number[]) => xs.sort((a, b) => a - b)[Math.floor(xs.length / 2)];
console.log("\n100 000 lần kiểm bảng ví dụ (ms, trung vị 5 lần)");
for (const [name, fn] of Object.entries({ threePass, onePass, bitmask })) {
  const times: number[] = [];
  for (let k = 0; k < 5; k++) {
    const t = performance.now();
    for (let i = 0; i < 100_000; i++) fn(example);
    times.push(performance.now() - t);
  }
  console.log(`${name.padEnd(10)} ${median(times).toFixed(1).padStart(7)}`);
}
