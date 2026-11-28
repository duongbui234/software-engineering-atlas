// Ga MISC-02: quay lui khi thứ tự có ý nghĩa, với trạng thái phải gỡ ra.
// Chạy: go run search.go
package main

import (
	"fmt"
	"sort"
	"strings"
)

var permuteCalls, queenCalls int

// Permutations: không có start; đánh dấu phần tử đã nằm trong path.
func permute(nums []int) [][]int {
	result := [][]int{}
	path := []int{}
	used := make([]bool, len(nums))
	var walk func()
	walk = func() {
		permuteCalls++
		if len(path) == len(nums) {
			result = append(result, append([]int(nil), path...)) // chép path, vì path còn đổi tiếp
			return
		}
		for i := range nums {
			if used[i] {
				continue // đã nằm trong path
			}
			used[i] = true               // đánh dấu
			path = append(path, nums[i]) // chọn
			walk()                       // đi sâu
			path = path[:len(path)-1]    // gỡ lựa chọn
			used[i] = false              // gỡ dấu
		}
	}
	walk()
	return result
}

// Word Search: ghi đè ô đang đi qua, khôi phục khi quay lui.
func exist(board [][]byte, word string) bool {
	rows, cols := len(board), len(board[0])
	var dfs func(r, c, k int) bool
	dfs = func(r, c, k int) bool {
		if r < 0 || c < 0 || r >= rows || c >= cols || board[r][c] != word[k] {
			return false
		}
		if k == len(word)-1 {
			return true
		}
		saved := board[r][c]
		board[r][c] = '#' // đánh dấu đang đi qua
		found := dfs(r+1, c, k+1) || dfs(r-1, c, k+1) || dfs(r, c+1, k+1) || dfs(r, c-1, k+1)
		board[r][c] = saved // khôi phục
		return found
	}
	for r := 0; r < rows; r++ {
		for c := 0; c < cols; c++ {
			if dfs(r, c, 0) {
				return true
			}
		}
	}
	return false
}

// Palindrome Partitioning: chọn vị trí cắt tiếp theo, chỉ đi sâu nếu mảnh vừa cắt là palindrome.
func partition(s string) [][]string {
	result := [][]string{}
	path := []string{}
	isPalindrome := func(lo, hi int) bool {
		for lo < hi {
			if s[lo] != s[hi] {
				return false
			}
			lo++
			hi--
		}
		return true
	}
	var walk func(start int)
	walk = func(start int) {
		if start == len(s) {
			result = append(result, append([]string(nil), path...))
			return
		}
		for end := start; end < len(s); end++ {
			if !isPalindrome(start, end) {
				continue // cắt nhánh sớm
			}
			path = append(path, s[start:end+1])
			walk(end + 1)
			path = path[:len(path)-1]
		}
	}
	walk(0)
	return result
}

// N-Queens: mỗi hàng một hậu; ba tập xung đột cho cột, chéo chính và chéo phụ.
func solveNQueens(n int) [][]string {
	result := [][]string{}
	colOf := []int{}
	cols := map[int]bool{}
	diag := map[int]bool{} // chéo chính: r - c
	anti := map[int]bool{} // chéo phụ: r + c
	var place func(r int)
	place = func(r int) {
		queenCalls++
		if r == n {
			rows := make([]string, n)
			for i, c := range colOf {
				rows[i] = strings.Repeat(".", c) + "Q" + strings.Repeat(".", n-c-1)
			}
			result = append(result, rows)
			return
		}
		for c := 0; c < n; c++ {
			if cols[c] || diag[r-c] || anti[r+c] {
				continue
			}
			cols[c], diag[r-c], anti[r+c] = true, true, true
			colOf = append(colOf, c)
			place(r + 1)
			colOf = colOf[:len(colOf)-1]
			delete(cols, c)
			delete(diag, r-c)
			delete(anti, r+c)
		}
	}
	place(0)
	return result
}

func key[T any](lists [][]T) string {
	parts := make([]string, len(lists))
	for i, x := range lists {
		parts[i] = fmt.Sprintf("%q", fmt.Sprint(x))
	}
	sort.Strings(parts)
	return strings.Join(parts, "|")
}

func grid(rows []string) [][]byte {
	g := make([][]byte, len(rows))
	for i, row := range rows {
		g[i] = []byte(row)
	}
	return g
}

func main() {
	board := []string{"TOP", "ARE", "NED"}
	distinct := func(ps [][]int) int {
		seen := map[string]bool{}
		for _, p := range ps {
			seen[fmt.Sprint(p)] = true
		}
		return len(seen)
	}
	type tc struct {
		name string
		got  any
		want any
	}
	cases := []tc{
		{"permute [4,7,9]", key(permute([]int{4, 7, 9})), key([][]int{{4, 7, 9}, {4, 9, 7}, {7, 4, 9}, {7, 9, 4}, {9, 4, 7}, {9, 7, 4}})},
		{"permute [5]", key(permute([]int{5})), key([][]int{{5}})},
		{"permute 6 số", distinct(permute([]int{1, 2, 3, 4, 5, 6})), 720},
		{"exist TOP", exist(grid(board), "TOP"), true},
		{"exist TAN", exist(grid(board), "TAN"), true},
		{"exist PERE", exist(grid(board), "PERE"), true},
		{"exist ROPED", exist(grid(board), "ROPED"), true},
		{"exist TOT (không dùng lại ô)", exist(grid(board), "TOT"), false},
		{"exist ARENA", exist(grid(board), "ARENA"), false},
		{"exist NEED", exist(grid(board), "NEED"), false},
		{"partition noon", key(partition("noon")), key([][]string{{"noon"}, {"n", "oo", "n"}, {"n", "o", "o", "n"}})},
		{"partition abc", key(partition("abc")), key([][]string{{"a", "b", "c"}})},
		{"partition aaa", key(partition("aaa")), key([][]string{{"aaa"}, {"a", "aa"}, {"aa", "a"}, {"a", "a", "a"}})},
		{"partition 8 chữ a", len(partition("aaaaaaaa")), 128},
		{"partition racecar", len(partition("racecar")), 4},
		{"nQueens 4", key(solveNQueens(4)), key([][]string{{".Q..", "...Q", "Q...", "..Q."}, {"..Q.", "Q...", "...Q", ".Q.."}})},
		{"nQueens 1", key(solveNQueens(1)), key([][]string{{"Q"}})},
		{"nQueens 3", len(solveNQueens(3)), 0},
		{"nQueens 6", len(solveNQueens(6)), 4},
	}
	ok := 0
	fails := []string{}
	for _, c := range cases {
		if c.got == c.want {
			ok++
		} else {
			fails = append(fails, c.name)
		}
	}
	fmt.Printf("%d/%d ca đúng\n", ok, len(cases))
	if len(fails) > 0 {
		fmt.Println("sai ở: " + strings.Join(fails, "; "))
	}
	permuteCalls = 0
	perms := len(permute([]int{1, 2, 3, 4, 5, 6, 7, 8}))
	queenCalls = 0
	boards := len(solveNQueens(8))
	fmt.Printf("Hoán vị 8 số: %d lần gọi, %d kết quả\n", permuteCalls, perms)
	fmt.Printf("8 hậu: %d lần gọi, %d lời giải\n", queenCalls, boards)
}
