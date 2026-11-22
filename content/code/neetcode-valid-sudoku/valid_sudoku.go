// LeetCode 36, Valid Sudoku: ba cách và test.
// Chạy: go run valid_sudoku.go
package main

import "fmt"

func unique(cells []byte) bool {
	var seen [9]bool // chữ số 1..9 → chỉ số 0..8: mảng 9 ô thay cho map
	for _, d := range cells {
		if d == '.' {
			continue
		}
		if seen[d-'1'] {
			return false
		}
		seen[d-'1'] = true
	}
	return true
}

func threePass(board [][]byte) bool {
	for i := 0; i < 9; i++ {
		col, box := make([]byte, 0, 9), make([]byte, 0, 9)
		br, bc := i/3*3, i%3*3
		for k := 0; k < 9; k++ {
			col = append(col, board[k][i])
			box = append(box, board[br+k/3][bc+k%3])
		}
		if !unique(board[i]) || !unique(col) || !unique(box) {
			return false
		}
	}
	return true
}

func onePass(board [][]byte) bool {
	var rows, cols, boxes [9][9]bool
	for r := 0; r < 9; r++ {
		for c := 0; c < 9; c++ {
			if board[r][c] == '.' {
				continue
			}
			d, b := board[r][c]-'1', r/3*3+c/3
			if rows[r][d] || cols[c][d] || boxes[b][d] {
				return false
			}
			rows[r][d], cols[c][d], boxes[b][d] = true, true, true
		}
	}
	return true
}

func bitmask(board [][]byte) bool {
	var rows, cols, boxes [9]uint16
	for r := 0; r < 9; r++ {
		for c := 0; c < 9; c++ {
			if board[r][c] == '.' {
				continue
			}
			bit, b := uint16(1)<<(board[r][c]-'1'), r/3*3+c/3
			if (rows[r]|cols[c]|boxes[b])&bit != 0 { // Go: & đứng trước != nên không cần ngoặc thêm
				return false
			}
			rows[r] |= bit
			cols[c] |= bit
			boxes[b] |= bit
		}
	}
	return true
}

func parse(rows ...string) [][]byte {
	b := make([][]byte, 9)
	for i, r := range rows {
		b[i] = []byte(r)
	}
	return b
}

func main() {
	ex := []string{"53..7....", "6..195...", ".98....6.", "8...6...3", "4..8.3..1", "7...2...6", ".6....28.", "...419..5", "....8..79"}
	change := func(r, c int, d byte) [][]byte { b := parse(ex...); b[r][c] = d; return b }
	e := "........."
	cases := []struct {
		name  string
		board [][]byte
		want  bool
	}{
		{"ví dụ hợp lệ", parse(ex...), true},
		{"8 ở góc", change(0, 0, '8'), false},
		{"trùng hàng 0", change(0, 8, '5'), false},
		{"trùng chỉ trong ô 3×3", change(1, 1, '8'), false},
		{"bảng trống", parse(e, e, e, e, e, e, e, e, e), true},
		{"hai số 1 ở hai ô khác nhau", parse("...1.....", e, e, "1........", e, e, e, e, e), true},
	}
	for _, f := range []struct {
		name string
		fn   func([][]byte) bool
	}{{"threePass", threePass}, {"onePass", onePass}, {"bitmask", bitmask}} {
		ok := 0
		for _, c := range cases {
			if f.fn(c.board) == c.want {
				ok++
			}
		}
		fmt.Printf("%-10s %d/%d ca đúng\n", f.name, ok, len(cases))
	}
}
