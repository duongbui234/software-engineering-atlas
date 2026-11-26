// LC 130 Surrounded Regions: mọi cách giải trên trang, kèm các bản sai hay gặp.
// Chạy: go run surrounded.go
package main

import (
	"fmt"
	"strings"
	"time"
)

type Board = [][]byte

var dirs = [4][2]int{{-1, 0}, {1, 0}, {0, -1}, {0, 1}}
var bruteVisits = 0

func onBorder(r, c, m, n int) bool { return r == 0 || r == m-1 || c == 0 || c == n-1 }

// Cách 0: vét cạn. Với từng ô O, chạy một BFS riêng để xem nó có tới được biên không. O((mn)²).
func bruteForcePerCell(board Board) {
	m, n := len(board), len(board[0])
	stamp := make([]int, m*n)
	round := 0
	var toFlip []int
	for r := 0; r < m; r++ {
		for c := 0; c < n; c++ {
			if board[r][c] != 'O' {
				continue
			}
			round++
			queue := []int{r*n + c}
			stamp[r*n+c] = round
			escaped := false
			for head := 0; head < len(queue) && !escaped; head++ {
				bruteVisits++
				cr, cc := queue[head]/n, queue[head]%n
				if onBorder(cr, cc, m, n) {
					escaped = true
				}
				for _, d := range dirs {
					nr, nc := cr+d[0], cc+d[1]
					if nr < 0 || nr >= m || nc < 0 || nc >= n || board[nr][nc] != 'O' || stamp[nr*n+nc] == round {
						continue
					}
					stamp[nr*n+nc] = round
					queue = append(queue, nr*n+nc)
				}
			}
			if !escaped {
				toFlip = append(toFlip, r*n+c) // chưa đổi ngay, để các ô sau còn đọc đúng
			}
		}
	}
	for _, id := range toFlip {
		board[id/n][id%n] = 'X'
	}
}

// Cách 1: tô từng vùng, duyệt xong mới đổi. O(mn).
func regionFill(board Board) {
	m, n := len(board), len(board[0])
	seen := make([]bool, m*n)
	for r := 0; r < m; r++ {
		for c := 0; c < n; c++ {
			if board[r][c] != 'O' || seen[r*n+c] {
				continue
			}
			seen[r*n+c] = true
			region := []int{r*n + c}
			touches := false
			for head := 0; head < len(region); head++ {
				cr, cc := region[head]/n, region[head]%n
				if onBorder(cr, cc, m, n) {
					touches = true
				}
				for _, d := range dirs {
					nr, nc := cr+d[0], cc+d[1]
					if nr < 0 || nr >= m || nc < 0 || nc >= n || board[nr][nc] != 'O' || seen[nr*n+nc] {
						continue
					}
					seen[nr*n+nc] = true
					region = append(region, nr*n+nc)
				}
			}
			if !touches {
				for _, id := range region {
					board[id/n][id%n] = 'X'
				}
			}
		}
	}
}

func finish(board Board) {
	for _, row := range board {
		for c, ch := range row {
			if ch == 'O' {
				row[c] = 'X'
			} else if ch == 'S' {
				row[c] = 'O'
			}
		}
	}
}

func borderCells(m, n int, visit func(r, c int)) {
	for r := 0; r < m; r++ {
		visit(r, 0)
		visit(r, n-1)
	}
	for c := 0; c < n; c++ {
		visit(0, c)
		visit(m-1, c)
	}
}

// Cách 2 (nên dùng): đi ngược từ biên bằng BFS nhiều nguồn, đánh dấu an toàn 'S'.
func borderBfs(board Board) {
	m, n := len(board), len(board[0])
	var queue []int
	borderCells(m, n, func(r, c int) {
		if board[r][c] == 'O' {
			board[r][c] = 'S'
			queue = append(queue, r*n+c)
		}
	})
	for head := 0; head < len(queue); head++ {
		cr, cc := queue[head]/n, queue[head]%n
		for _, d := range dirs {
			nr, nc := cr+d[0], cc+d[1]
			if nr < 0 || nr >= m || nc < 0 || nc >= n || board[nr][nc] != 'O' {
				continue
			}
			board[nr][nc] = 'S'
			queue = append(queue, nr*n+nc)
		}
	}
	finish(board)
}

// Cách 3: DFS đệ quy từ biên. Stack của goroutine tự lớn (tới 1 GB), nên Go không tràn ở 200×200.
func borderDfsRecursive(board Board) {
	m, n := len(board), len(board[0])
	var dfs func(r, c int)
	dfs = func(r, c int) {
		if r < 0 || r >= m || c < 0 || c >= n || board[r][c] != 'O' {
			return
		}
		board[r][c] = 'S'
		dfs(r-1, c)
		dfs(r+1, c)
		dfs(r, c-1)
		dfs(r, c+1)
	}
	borderCells(m, n, dfs)
	finish(board)
}

// Cách 4: DFS với ngăn xếp tự quản lý.
func borderDfsIterative(board Board) {
	m, n := len(board), len(board[0])
	var stack []int
	borderCells(m, n, func(r, c int) {
		if board[r][c] == 'O' {
			board[r][c] = 'S'
			stack = append(stack, r*n+c)
		}
	})
	for len(stack) > 0 {
		id := stack[len(stack)-1]
		stack = stack[:len(stack)-1]
		cr, cc := id/n, id%n
		for _, d := range dirs {
			nr, nc := cr+d[0], cc+d[1]
			if nr < 0 || nr >= m || nc < 0 || nc >= n || board[nr][nc] != 'O' {
				continue
			}
			board[nr][nc] = 'S'
			stack = append(stack, nr*n+nc)
		}
	}
	finish(board)
}

// Cách 5: Union-Find với một nút ảo "biên".
func unionFind(board Board) {
	m, n := len(board), len(board[0])
	border := m * n
	parent := make([]int, m*n+1)
	size := make([]int, m*n+1)
	for i := range parent {
		parent[i], size[i] = i, 1
	}
	find := func(x int) int {
		root := x
		for parent[root] != root {
			root = parent[root]
		}
		for parent[x] != root {
			parent[x], x = root, parent[x]
		}
		return root
	}
	union := func(a, b int) {
		ra, rb := find(a), find(b)
		if ra == rb {
			return
		}
		if size[ra] < size[rb] {
			ra, rb = rb, ra
		}
		parent[rb] = ra
		size[ra] += size[rb]
	}
	for r := 0; r < m; r++ {
		for c := 0; c < n; c++ {
			if board[r][c] != 'O' {
				continue
			}
			id := r*n + c
			if onBorder(r, c, m, n) {
				union(id, border)
			}
			if r+1 < m && board[r+1][c] == 'O' {
				union(id, id+n)
			}
			if c+1 < n && board[r][c+1] == 'O' {
				union(id, id+1)
			}
		}
	}
	for r := 0; r < m; r++ {
		for c := 0; c < n; c++ {
			if board[r][c] == 'O' && find(r*n+c) != find(border) {
				board[r][c] = 'X'
			}
		}
	}
}

// SAI 1: đổi mọi ô O không nằm trên biên.
func wrongNotOnBorder(board Board) {
	for r := 1; r < len(board)-1; r++ {
		for c := 1; c < len(board[0])-1; c++ {
			if board[r][c] == 'O' {
				board[r][c] = 'X'
			}
		}
	}
}

// SAI 2: đổi ô thành X ngay lúc tìm; && dừng sớm nên phần còn lại không được thăm.
func wrongFlipDuringSearch(board Board) {
	m, n := len(board), len(board[0])
	var surrounded func(r, c int) bool
	surrounded = func(r, c int) bool {
		if r < 0 || r >= m || c < 0 || c >= n {
			return false
		}
		if board[r][c] != 'O' {
			return true
		}
		board[r][c] = 'X'
		return surrounded(r-1, c) && surrounded(r+1, c) && surrounded(r, c-1) && surrounded(r, c+1)
	}
	for r := 0; r < m; r++ {
		for c := 0; c < n; c++ {
			if board[r][c] == 'O' {
				surrounded(r, c)
			}
		}
	}
}

// SAI 3: gán lại biến board bằng một bảng mới. Người gọi vẫn giữ slice cũ.
func wrongNewBoard(board Board) {
	board = clone(board)
	borderBfs(board)
}

// ---------- ca thử ----------
func parse(rows ...string) Board {
	b := make(Board, len(rows))
	for i, row := range rows {
		b[i] = []byte(row)
	}
	return b
}

func clone(b Board) Board { // chép từng hàng; copy(dst, b) chỉ chép con trỏ tới hàng
	out := make(Board, len(b))
	for i := range b {
		out[i] = append([]byte(nil), b[i]...)
	}
	return out
}

func show(b Board) string {
	rows := make([]string, len(b))
	for i, row := range b {
		rows[i] = string(row)
	}
	return strings.Join(rows, "/")
}

func square(n int, fill func(r, c int) byte) Board {
	b := make(Board, n)
	for r := range b {
		b[r] = make([]byte, n)
		for c := range b[r] {
			b[r][c] = fill(r, c)
		}
	}
	return b
}

func framed(n int) Board {
	return square(n, func(r, c int) byte {
		if onBorder(r, c, n, n) {
			return 'X'
		}
		return 'O'
	})
}

type testCase struct {
	name        string
	board, want Board
}

func main() {
	allO := func(r, c int) byte { return 'O' }
	allX := func(r, c int) byte { return 'X' }
	cases := []testCase{
		{"ví dụ 5×5 ở trên", parse("XXXXX", "XOOXX", "XXOXX", "XOXOO", "XOXXX"), parse("XXXXX", "XXXXX", "XXXXX", "XOXOO", "XOXXX")},
		{"một ô O", parse("O"), parse("O")},
		{"một ô X", parse("X"), parse("X")},
		{"3×3 toàn O", parse("OOO", "OOO", "OOO"), parse("OOO", "OOO", "OOO")},
		{"vòng X bao một ô O", parse("XXX", "XOX", "XXX"), parse("XXX", "XXX", "XXX")},
		{"một hàng OXO", parse("OXO"), parse("OXO")},
		{"chạm chéo không tính là nối", parse("OXXX", "XOXX", "XXOX", "XXXX"), parse("OXXX", "XXXX", "XXXX", "XXXX")},
		{"đường vòng vèo ra biên", parse("XXXXXX", "XOOOOX", "XXXXOX", "XOOOOX", "XOXXXX", "XOXXXX"),
			parse("XXXXXX", "XOOOOX", "XXXXOX", "XOOOOX", "XOXXXX", "XOXXXX")},
		{"200×200 toàn O", square(200, allO), square(200, allO)},
		{"200×200 viền X, trong toàn O", framed(200), square(200, allX)},
	}
	solvers := []struct {
		name  string
		solve func(Board)
	}{
		{"bruteForcePerCell", bruteForcePerCell}, {"regionFill", regionFill}, {"borderBfs", borderBfs},
		{"borderDfsRecursive", borderDfsRecursive}, {"borderDfsIterative", borderDfsIterative}, {"unionFind", unionFind},
		{"wrongNotOnBorder", wrongNotOnBorder}, {"wrongFlipDuringSearch", wrongFlipDuringSearch}, {"wrongNewBoard", wrongNewBoard},
	}
	for _, s := range solvers {
		mine := cases
		if s.name == "bruteForcePerCell" { // vét cạn chỉ chạy các ca nhỏ: ở 200×200 nó cần khoảng 1,5·10⁹ lượt thăm
			mine = cases[:8]
		}
		ok := 0
		var bad []string
		for _, tc := range mine {
			b := clone(tc.board)
			s.solve(b)
			if show(b) == show(tc.want) {
				ok++
			} else {
				bad = append(bad, tc.name)
			}
		}
		note := ""
		if len(mine) < len(cases) {
			note = " (chỉ các ca nhỏ)"
		}
		tail := ""
		if len(bad) > 0 {
			tail = "; sai ở " + strings.Join(bad, ", ")
		}
		fmt.Printf("%-22s %d/%d ca đúng%s%s\n", s.name, ok, len(mine), note, tail)
	}

	// Đối chiếu ngẫu nhiên với vét cạn.
	seed := uint32(42)
	rand := func() float64 {
		seed += 0x6d2b79f5
		t := seed
		t = (t ^ (t >> 15)) * (1 | t)
		t = (t + (t^(t>>7))*(61|t)) ^ t
		return float64(t^(t>>14)) / 4294967296
	}
	const trials = 2000
	agree := 0
	for i := 0; i < trials; i++ {
		m, n := 1+int(rand()*8), 1+int(rand()*8)
		board := make(Board, m)
		for r := range board {
			board[r] = make([]byte, n)
			for c := range board[r] {
				if rand() < 0.6 {
					board[r][c] = 'O'
				} else {
					board[r][c] = 'X'
				}
			}
		}
		ref := clone(board)
		bruteForcePerCell(ref)
		good := true
		for _, solve := range []func(Board){regionFill, borderBfs, borderDfsRecursive, borderDfsIterative, unionFind} {
			b := clone(board)
			solve(b)
			good = good && show(b) == show(ref)
		}
		if good {
			agree++
		}
	}
	fmt.Printf("đối chiếu ngẫu nhiên: %d/%d bảng, năm cách đúng khớp vét cạn\n", agree, trials)

	// Đo: vét cạn O((mn)²) so với tô từng vùng O(mn).
	for _, size := range []int{30, 60, 90} {
		b := framed(size)
		bruteVisits = 0
		t0 := time.Now()
		bruteForcePerCell(b)
		brute := time.Since(t0)
		b = framed(size)
		t0 = time.Now()
		regionFill(b)
		fast := time.Since(t0)
		fmt.Printf("%d×%d: vét cạn %d lượt thăm, %.1f ms; tô từng vùng %.2f ms\n", size, size, bruteVisits,
			float64(brute.Microseconds())/1000, float64(fast.Microseconds())/1000)
	}
}
