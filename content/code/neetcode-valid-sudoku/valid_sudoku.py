# LeetCode 36, Valid Sudoku: ba cách và test.
# Chạy: python3 valid_sudoku.py


def unique(cells) -> bool:
    digits = [d for d in cells if d != "."]
    return len(digits) == len(set(digits))


def three_pass(board: list[list[str]]) -> bool:
    for i in range(9):
        row = board[i]
        col = [board[r][i] for r in range(9)]
        br, bc = i // 3 * 3, i % 3 * 3
        box = [board[r][c] for r in range(br, br + 3) for c in range(bc, bc + 3)]
        if not (unique(row) and unique(col) and unique(box)):
            return False
    return True


def one_pass(board: list[list[str]]) -> bool:
    rows = [set() for _ in range(9)]
    cols = [set() for _ in range(9)]
    boxes = [set() for _ in range(9)]  # đừng viết [set()] * 9: chín phần tử cùng trỏ về MỘT set
    for r in range(9):
        for c in range(9):
            d = board[r][c]
            if d == ".":
                continue
            b = r // 3 * 3 + c // 3
            if d in rows[r] or d in cols[c] or d in boxes[b]:
                return False
            rows[r].add(d)
            cols[c].add(d)
            boxes[b].add(d)
    return True


def bitmask(board: list[list[str]]) -> bool:
    rows, cols, boxes = [0] * 9, [0] * 9, [0] * 9  # int là bất biến, nên [0] * 9 không có bẫy như [set()] * 9
    for r in range(9):
        for c in range(9):
            d = board[r][c]
            if d == ".":
                continue
            bit = 1 << (int(d) - 1)
            b = r // 3 * 3 + c // 3
            if (rows[r] | cols[c] | boxes[b]) & bit:
                return False
            rows[r] |= bit
            cols[c] |= bit
            boxes[b] |= bit
    return True


def one_pass_shared_sets(board: list[list[str]]) -> bool:  # bản sai: [set()] * 9
    rows, cols, boxes = [set()] * 9, [set()] * 9, [set()] * 9
    for r in range(9):
        for c in range(9):
            d = board[r][c]
            if d == ".":
                continue
            b = r // 3 * 3 + c // 3
            if d in rows[r] or d in cols[c] or d in boxes[b]:
                return False
            rows[r].add(d)
            cols[c].add(d)
            boxes[b].add(d)
    return True


example = [list(r) for r in ["53..7....", "6..195...", ".98....6.", "8...6...3", "4..8.3..1", "7...2...6", ".6....28.", "...419..5", "....8..79"]]


def with_change(r, c, d):
    b = [row[:] for row in example]
    b[r][c] = d
    return b


cases = [
    ("ví dụ hợp lệ", example, True),
    ("8 ở góc", with_change(0, 0, "8"), False),
    ("trùng hàng 0", with_change(0, 8, "5"), False),
    ("trùng chỉ trong ô 3×3", with_change(1, 1, "8"), False),
    ("bảng trống", [["."] * 9 for _ in range(9)], True),
    ("hai số 1 ở hai ô khác nhau", [list(r) for r in ["...1....."] + ["........."] * 2 + ["1........"] + ["........."] * 5], True),
]
for fn in (three_pass, one_pass, bitmask, one_pass_shared_sets):
    bad = [name for name, b, want in cases if fn(b) != want]
    print(f"{fn.__name__:21} {len(cases) - len(bad)}/{len(cases)} ca đúng" + (f"; sai ở: {', '.join(bad)}" if bad else ""))
