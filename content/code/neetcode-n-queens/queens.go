// N-Queens (LeetCode 51): vét mọi hoán vị, quay lui với ba tập xung đột, đếm bằng bitmask
// Chạy: go run queens.go
package main

import (
	"fmt"
	"sort"
	"strings"
)

var calls int

// Đổi danh sách cột (cols[r] là cột của hậu ở hàng r) thành bàn cờ dạng chuỗi
func toBoard(cols []int) []string {
	n := len(cols)
	board := make([]string, n)
	for r, c := range cols {
		board[r] = strings.Repeat(".", c) + "Q" + strings.Repeat(".", n-c-1)
	}
	return board
}

// Cách 1: mỗi hàng một hậu, mỗi cột một hậu, tức một hoán vị cột; dựng xong mới xét hai đường chéo
func solveBrute(n int) [][]string {
	result := [][]string{}
	cols := []int{}
	used := make([]bool, n)
	var walk func()
	walk = func() {
		calls++
		if len(cols) == n {
			if diagonalsOk(cols) {
				result = append(result, toBoard(cols))
			}
			return
		}
		for c := 0; c < n; c++ {
			if used[c] {
				continue
			}
			used[c] = true
			cols = append(cols, c)
			walk()
			cols = cols[:len(cols)-1]
			used[c] = false
		}
	}
	walk()
	return result
}

func diagonalsOk(cols []int) bool {
	for a := 0; a < len(cols); a++ {
		for b := a + 1; b < len(cols); b++ {
			d := cols[a] - cols[b]
			if d < 0 {
				d = -d
			}
			if d == b-a {
				return false
			}
		}
	}
	return true
}

// Cách 2: đặt từng hàng; ba mảng đánh dấu cột, chéo chính (r - c + n - 1) và chéo phụ (r + c)
func solveNQueens(n int) [][]string {
	result := [][]string{}
	cols := []int{}
	colUsed := make([]bool, n)
	diag := make([]bool, 2*n-1)
	anti := make([]bool, 2*n-1)
	var place func(r int)
	place = func(r int) {
		calls++
		if r == n {
			result = append(result, toBoard(cols)) // chỉ dựng chuỗi ở lá
			return
		}
		for c := 0; c < n; c++ {
			d, a := r-c+n-1, r+c
			if colUsed[c] || diag[d] || anti[a] {
				continue
			}
			colUsed[c], diag[d], anti[a] = true, true, true
			cols = append(cols, c)
			place(r + 1)
			cols = cols[:len(cols)-1]
			colUsed[c], diag[d], anti[a] = false, false, false // gỡ cả ba dấu
		}
	}
	place(0)
	return result
}

// Cách 3: chỉ đếm; ba tập là ba số nguyên, bit 1 là cột bị chiếu ở hàng đang xét
func countBits(n int) int {
	full := (1 << n) - 1
	var goDeep func(cols, left, right int) int
	goDeep = func(cols, left, right int) int {
		calls++
		if cols == full {
			return 1
		}
		count := 0
		free := full &^ (cols | left | right)
		for free != 0 {
			bit := free & -free // bit 1 thấp nhất: một cột còn trống
			free -= bit
			// chéo dịch một cột sang trái hoặc phải khi xuống hàng sau
			count += goDeep(cols|bit, ((left|bit)<<1)&full, (right|bit)>>1)
		}
		return count
	}
	return goDeep(0, 0, 0)
}

// Bản sai: quên gỡ dấu chéo phụ khi quay lui
func countForgetAnti(n int) int {
	colUsed := make([]bool, n)
	diag := make([]bool, 2*n-1)
	anti := make([]bool, 2*n-1)
	var place func(r int) int
	place = func(r int) int {
		if r == n {
			return 1
		}
		count := 0
		for c := 0; c < n; c++ {
			d, a := r-c+n-1, r+c
			if colUsed[c] || diag[d] || anti[a] {
				continue
			}
			colUsed[c], diag[d], anti[a] = true, true, true
			count += place(r + 1)
			colUsed[c], diag[d] = false, false
		}
		return count
	}
	return place(0)
}

// Kiểm tra độc lập: đọc lại bàn cờ từ chuỗi
func validBoard(board []string, n int) bool {
	if len(board) != n {
		return false
	}
	cols, diags, antis := map[int]bool{}, map[int]bool{}, map[int]bool{}
	for r, row := range board {
		if len(row) != n || strings.Count(row, "Q") != 1 || strings.Trim(row, "Q.") != "" {
			return false
		}
		c := strings.Index(row, "Q")
		cols[c], diags[r-c], antis[r+c] = true, true, true
	}
	return len(cols) == n && len(diags) == n && len(antis) == n
}

func key(boards [][]string) string {
	keys := make([]string, len(boards))
	for i, b := range boards {
		keys[i] = strings.Join(b, "/")
	}
	sort.Strings(keys)
	return strings.Join(keys, "|")
}

func main() {
	known := []int{1, 0, 0, 2, 10, 4, 40, 92, 352}
	ok, total := 0, 0
	check := func(cond bool, name string) {
		total++
		if cond {
			ok++
		} else {
			fmt.Println("sai ở", name)
		}
	}
	for n := 1; n <= 9; n++ {
		check(len(solveNQueens(n)) == known[n-1] && countBits(n) == known[n-1], fmt.Sprintf("n = %d", n))
	}
	found := false
	for _, b := range solveNQueens(5) {
		if strings.Join(b, "/") == "Q..../..Q../....Q/.Q.../...Q." {
			found = true
		}
	}
	check(found, "n = 5 có bàn mẫu")
	six := solveNQueens(6)
	allValid := true
	seen := map[string]bool{}
	for _, b := range six {
		allValid = allValid && validBoard(b, 6)
		seen[strings.Join(b, "/")] = true
	}
	check(allValid, "n = 6 mọi bàn hợp lệ")
	check(len(seen) == len(six), "n = 6 không trùng")
	fmt.Printf("%d/%d ca đúng\n", ok, total)

	crossOk := 0
	for n := 1; n <= 7; n++ {
		if key(solveBrute(n)) == key(solveNQueens(n)) {
			crossOk++
		}
	}
	fmt.Printf("%d/7 ca đúng (đối chiếu vét mọi hoán vị)\n", crossOk)

	calls = 0
	solveBrute(8)
	brute := calls
	calls = 0
	solveNQueens(8)
	sets := calls
	calls = 0
	countBits(8)
	bits := calls
	fmt.Printf("n = 8: vét hoán vị %d lượt gọi, ba tập %d lượt gọi, bitmask %d lượt gọi\n", brute, sets, bits)
	fmt.Printf("Quên gỡ chéo phụ: n = 8 ra %d bàn, đúng là 92\n", countForgetAnti(8))
}
