// LeetCode 329: đường tăng dài nhất trong ma trận, ba cách giải
package main

import "fmt"

var dirs = [4][2]int{{1, 0}, {-1, 0}, {0, 1}, {0, -1}}

// Vét cạn: DFS từ mọi ô, không nhớ gì
func longestPathBrute(grid [][]int, calls *int) int {
	rows, cols := len(grid), len(grid[0])
	var climb func(r, c int) int
	climb = func(r, c int) int {
		*calls++
		best := 1
		for _, d := range dirs {
			nr, nc := r+d[0], c+d[1]
			if nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] > grid[r][c] {
				best = max(best, 1+climb(nr, nc))
			}
		}
		return best
	}
	answer := 0
	for r := 0; r < rows; r++ {
		for c := 0; c < cols; c++ {
			answer = max(answer, climb(r, c))
		}
	}
	return answer
}

// DFS ghi nhớ: memo[ô] = độ dài đường tăng dài nhất bắt đầu ở ô đó.
// Không cần tập "đang thăm": cạnh chỉ đi lên giá trị lớn hơn nên không có vòng.
func longestPathMemo(grid [][]int, calls *int) int {
	rows, cols := len(grid), len(grid[0])
	memo := make([]int, rows*cols) // 0 = chưa tính, đáp án luôn ≥ 1
	var climb func(r, c int) int
	climb = func(r, c int) int {
		*calls++
		key := r*cols + c
		if memo[key] != 0 {
			return memo[key]
		}
		best := 1
		for _, d := range dirs {
			nr, nc := r+d[0], c+d[1]
			if nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] > grid[r][c] {
				best = max(best, 1+climb(nr, nc))
			}
		}
		memo[key] = best
		return best
	}
	answer := 0
	for r := 0; r < rows; r++ {
		for c := 0; c < cols; c++ {
			answer = max(answer, climb(r, c))
		}
	}
	return answer
}

// Bóc lớp theo thứ tự topo (Kahn): lớp đầu là các "đỉnh" không còn ô lớn hơn kề bên.
// Số lớp bóc được chính là độ dài đường dài nhất. Không đệ quy.
func longestIncreasingPath(grid [][]int) int {
	rows, cols := len(grid), len(grid[0])
	outDegree := make([]int, rows*cols) // số ô kề lớn hơn
	layer := []int{}
	for r := 0; r < rows; r++ {
		for c := 0; c < cols; c++ {
			for _, d := range dirs {
				nr, nc := r+d[0], c+d[1]
				if nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] > grid[r][c] {
					outDegree[r*cols+c]++
				}
			}
			if outDegree[r*cols+c] == 0 {
				layer = append(layer, r*cols+c)
			}
		}
	}
	layers := 0
	for len(layer) > 0 {
		layers++
		next := []int{}
		for _, cell := range layer {
			r, c := cell/cols, cell%cols
			for _, d := range dirs {
				nr, nc := r+d[0], c+d[1]
				// ô nhỏ hơn kề bên mất một lối lên; hết lối thì vào lớp sau
				if nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] < grid[r][c] {
					outDegree[nr*cols+nc]--
					if outDegree[nr*cols+nc] == 0 {
						next = append(next, nr*cols+nc)
					}
				}
			}
		}
		layer = next
	}
	return layers
}

// ---------- kiểm tra ----------
func filled(n, v int) [][]int {
	grid := make([][]int, n)
	for r := range grid {
		grid[r] = make([]int, n)
		for c := range grid[r] {
			grid[r][c] = v
		}
	}
	return grid
}

func snake(n int) [][]int {
	grid := filled(n, 0)
	for r := 0; r < n; r++ {
		for c := 0; c < n; c++ {
			if r%2 == 0 {
				grid[r][c] = r*n + c
			} else {
				grid[r][c] = r*n + n - 1 - c
			}
		}
	}
	return grid
}

// Hàng chẵn là lối đi zigzag, hàng lẻ là tường giá trị 0 chừa một ô nối.
// Từ ô (0, 0) chỉ có đúng một ô kề lớn hơn, nên DFS đi một mạch hết đường.
func corridor(n int) [][]int {
	grid := filled(n, 0)
	value := 0
	for k := 0; 2*k < n; k++ {
		r := 2 * k
		for i := 0; i < n; i++ {
			value++
			if k%2 == 0 {
				grid[r][i] = value
			} else {
				grid[r][n-1-i] = value
			}
		}
		if r+2 < n {
			value++
			if k%2 == 0 {
				grid[r+1][n-1] = value
			} else {
				grid[r+1][0] = value
			}
		}
	}
	return grid
}

func shape(flat []int, rows, cols int) [][]int {
	grid := make([][]int, rows)
	for r := range grid {
		grid[r] = append([]int{}, flat[r*cols:(r+1)*cols]...)
	}
	return grid
}

func permute(items, prefix []int, out *[][]int) {
	if len(items) == 0 {
		*out = append(*out, append([]int{}, prefix...))
		return
	}
	for i, v := range items {
		rest := append(append([]int{}, items[:i]...), items[i+1:]...)
		permute(rest, append(prefix, v), out)
	}
}

func main() {
	type tc struct {
		grid [][]int
		want int
	}
	small := []tc{
		{[][]int{{1}}, 1},
		{[][]int{{7, 7}, {7, 7}}, 1},
		{[][]int{{1, 2, 3}, {6, 5, 4}, {7, 8, 9}}, 9},
		{[][]int{{5, 4}, {2, 3}}, 4},
		{[][]int{{1, 3, 2, 4, 5}}, 3},
		{[][]int{{3}, {2}, {1}}, 3},
		{[][]int{{0, 2147483647}}, 2},
		{[][]int{{7, 8, 1}, {6, 2, 3}, {5, 4, 9}}, 6},
	}
	big := []tc{{filled(200, 5), 1}, {snake(200), 40000}, {corridor(200), 20100}}
	ok, calls := 0, 0
	for _, t := range small {
		if longestPathBrute(t.grid, &calls) == t.want && longestPathMemo(t.grid, &calls) == t.want && longestIncreasingPath(t.grid) == t.want {
			ok++
		} else {
			fmt.Println("sai:", t.grid)
		}
	}
	for _, t := range big {
		if longestIncreasingPath(t.grid) == t.want {
			ok++
		} else {
			fmt.Println("sai ở lưới lớn, mong", t.want)
		}
	}
	fmt.Printf("%d/%d ca đúng\n", ok, len(small)+len(big))

	// Đối chiếu: mọi lưới r×c (r·c ≤ 6) giá trị 0..2, và mọi lưới 2×3, 3×2 là hoán vị của 1..6
	total, agree := 0, 0
	check := func(grid [][]int) {
		total++
		want := longestPathBrute(grid, &calls)
		if longestPathMemo(grid, &calls) == want && longestIncreasingPath(grid) == want {
			agree++
		}
	}
	for rows := 1; rows <= 6; rows++ {
		for cols := 1; rows*cols <= 6; cols++ {
			size := rows * cols
			limit := 1
			for k := 0; k < size; k++ {
				limit *= 3
			}
			for code := 0; code < limit; code++ {
				flat := make([]int, size)
				for k, x := 0, code; k < size; k, x = k+1, x/3 {
					flat[k] = x % 3
				}
				check(shape(flat, rows, cols))
			}
		}
	}
	perms := [][]int{}
	permute([]int{1, 2, 3, 4, 5, 6}, []int{}, &perms)
	for _, p := range perms {
		check(shape(p, 2, 3))
		check(shape(p, 3, 2))
	}
	fmt.Printf("%d/%d ca đúng (đối chiếu vét cạn)\n", agree, total)

	// Đếm lượt gọi trên lưới 10×10 có giá trị i + j: rất nhiều đường tăng chồng lên nhau
	diagonal := filled(10, 0)
	for r := range diagonal {
		for c := range diagonal[r] {
			diagonal[r][c] = r + c
		}
	}
	bruteCalls, memoCalls := 0, 0
	longestPathBrute(diagonal, &bruteCalls)
	longestPathMemo(diagonal, &memoCalls)
	fmt.Printf("Lưới 10×10 giá trị i+j: vét cạn %d lượt gọi, memo %d lượt gọi\n", bruteCalls, memoCalls)

	// Lưới hành lang 200×200: DFS từ ô (0, 0) phải đệ quy sâu 20099 tầng.
	// Ngăn xếp goroutine tự nới rộng (tối đa 1 GB) nên Go không tràn ở đây.
	deep := corridor(200)
	fmt.Printf("Lưới hành lang 200×200: bóc lớp %d, memo đệ quy %d\n", longestIncreasingPath(deep), longestPathMemo(deep, &calls))
}
