// Word Search (LeetCode 79): tìm một từ trên lưới chữ, mỗi bước sang ô kề cạnh, không dùng lại ô.
// Chạy: go run search.go
package main

import "fmt"

var dirs = [4][2]int{{1, 0}, {-1, 0}, {0, 1}, {0, -1}}
var calls int

// Cách 1: DFS với một bảng visited riêng.
func existVisited(board [][]byte, word string) bool {
	rows, cols := len(board), len(board[0])
	visited := make([][]bool, rows)
	for r := range visited {
		visited[r] = make([]bool, cols)
	}
	var dfs func(r, c, k int) bool
	dfs = func(r, c, k int) bool {
		calls++
		if k == len(word) {
			return true
		}
		if r < 0 || c < 0 || r >= rows || c >= cols {
			return false
		}
		if visited[r][c] || board[r][c] != word[k] {
			return false
		}
		visited[r][c] = true
		for _, d := range dirs {
			if dfs(r+d[0], c+d[1], k+1) {
				visited[r][c] = false
				return true
			}
		}
		visited[r][c] = false
		return false
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

// Cách 2: đánh dấu ngay trên lưới bằng '#', trả lại chữ cũ khi quay lui.
func existInPlace(board [][]byte, word string) bool {
	rows, cols := len(board), len(board[0])
	var dfs func(r, c, k int) bool
	dfs = func(r, c, k int) bool {
		calls++
		if k == len(word) {
			return true
		}
		if r < 0 || c < 0 || r >= rows || c >= cols {
			return false
		}
		if board[r][c] != word[k] {
			return false
		}
		saved := board[r][c]
		board[r][c] = '#'
		found := false
		for _, d := range dirs {
			if dfs(r+d[0], c+d[1], k+1) {
				found = true
				break
			}
		}
		board[r][c] = saved
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

// Cách 3: cắt nhánh trước khi tìm. Đếm chữ, rồi đảo từ nếu chữ cuối hiếm hơn chữ đầu.
func existPruned(board [][]byte, word string) bool {
	var have, need [256]int
	for _, row := range board {
		for _, ch := range row {
			have[ch]++
		}
	}
	for i := 0; i < len(word); i++ {
		need[word[i]]++
	}
	for ch := 0; ch < 256; ch++ {
		if need[ch] > have[ch] {
			return false
		}
	}
	if have[word[len(word)-1]] < have[word[0]] {
		b := []byte(word)
		for i, j := 0, len(b)-1; i < j; i, j = i+1, j-1 {
			b[i], b[j] = b[j], b[i]
		}
		word = string(b)
	}
	return existInPlace(board, word)
}

// Trọng tài: liệt kê mọi đường đi đơn dài |word| trên lưới, ghép chữ rồi so cả chuỗi.
func bruteForce(board [][]byte, word string) bool {
	rows, cols := len(board), len(board[0])
	used := make([][]bool, rows)
	for r := range used {
		used[r] = make([]bool, cols)
	}
	hit := false
	var walk func(r, c int, text string)
	walk = func(r, c int, text string) {
		if hit {
			return
		}
		next := text + string(board[r][c])
		if len(next) == len(word) {
			if next == word {
				hit = true
			}
			return
		}
		used[r][c] = true
		for _, d := range dirs {
			nr, nc := r+d[0], c+d[1]
			if nr >= 0 && nc >= 0 && nr < rows && nc < cols && !used[nr][nc] {
				walk(nr, nc, next)
			}
		}
		used[r][c] = false
	}
	for r := 0; r < rows; r++ {
		for c := 0; c < cols; c++ {
			walk(r, c, "")
		}
	}
	return hit
}

func makeBoard(rows ...string) [][]byte {
	b := make([][]byte, len(rows))
	for i, s := range rows {
		b[i] = []byte(s)
	}
	return b
}

func clone(b [][]byte) [][]byte {
	out := make([][]byte, len(b))
	for i, row := range b {
		out[i] = append([]byte(nil), row...)
	}
	return out
}

func same(a, b [][]byte) bool {
	for r := range a {
		if string(a[r]) != string(b[r]) {
			return false
		}
	}
	return true
}

func main() {
	grid := makeBoard("cat", "ods", "gen")
	type tc struct {
		board [][]byte
		word  string
		want  bool
	}
	cases := []tc{
		{grid, "cat", true},
		{grid, "cod", true},
		{grid, "dog", true},
		{grid, "cats", true},
		{grid, "neds", true},
		{grid, "tact", false},
		{grid, "cab", false},
		{makeBoard("z"), "z", true},
		{makeBoard("z"), "zz", false},
		{makeBoard("ab", "ba"), "abab", true},
		{makeBoard("ab", "ba"), "abaa", false},
		{makeBoard("ab"), "aba", false},
	}
	ok := 0
	for _, t := range cases {
		b2, b3 := clone(t.board), clone(t.board)
		got := []bool{existVisited(clone(t.board), t.word), existInPlace(b2, t.word), existPruned(b3, t.word), bruteForce(t.board, t.word)}
		good := same(b2, t.board) && same(b3, t.board)
		for _, g := range got {
			if g != t.want {
				good = false
			}
		}
		if good {
			ok++
		} else {
			fmt.Println("sai ở", t.word, got)
		}
	}
	fmt.Printf("%d/%d ca đúng\n", ok, len(cases))

	// Đối chiếu: mọi lưới 2×2 và 2×3 trên {a, b}, mọi từ trên {a, b} dài 1–4.
	var words []string
	for length := 1; length <= 4; length++ {
		for mask := 0; mask < 1<<length; mask++ {
			w := make([]byte, length)
			for i := 0; i < length; i++ {
				if (mask>>i)&1 == 1 {
					w[i] = 'b'
				} else {
					w[i] = 'a'
				}
			}
			words = append(words, string(w))
		}
	}
	total, agree := 0, 0
	for _, cols := range []int{2, 3} {
		cells := 2 * cols
		for mask := 0; mask < 1<<cells; mask++ {
			board := [][]byte{make([]byte, cols), make([]byte, cols)}
			for i := 0; i < cells; i++ {
				ch := byte('a')
				if (mask>>i)&1 == 1 {
					ch = 'b'
				}
				board[i/cols][i%cols] = ch
			}
			for _, w := range words {
				total++
				want := bruteForce(board, w)
				b2, b3 := clone(board), clone(board)
				if existVisited(clone(board), w) == want && existInPlace(b2, w) == want &&
					existPruned(b3, w) == want && same(b2, board) && same(b3, board) {
					agree++
				}
			}
		}
	}
	fmt.Printf("%d/%d ca đúng (đối chiếu liệt kê mọi đường đi)\n", agree, total)

	// Phép đo: lưới 4×4 toàn chữ a, chữ b ở góc dưới phải bị hai chữ c chắn, từ aaaaaaab không có.
	trap := makeBoard("aaaa", "aaaa", "aaac", "aacb")
	calls = 0
	existInPlace(clone(trap), "aaaaaaab")
	plain := calls
	calls = 0
	existPruned(clone(trap), "aaaaaaab")
	fmt.Printf("Lưới 4×4 toàn a, b ở góc bị c chắn, từ aaaaaaab: không cắt nhánh %d lượt gọi, đảo từ %d lượt gọi\n", plain, calls)
}
