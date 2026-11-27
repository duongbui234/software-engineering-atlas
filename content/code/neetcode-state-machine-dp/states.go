// Ga DP-06: DP có trạng thái. Chạy: go run states.go
package main

import "fmt"

const negInf = -1 << 30 // như −∞, còn chỗ trừ thêm mà không tràn int

func maxProfitCooldown(prices []int) int {
	hold, sold, rest := negInf, negInf, 0 // đang giữ, vừa bán, tay không
	for _, price := range prices {
		hold, sold, rest = max(hold, rest-price), hold+price, max(rest, sold)
	}
	return max(rest, sold)
}

var dirs = [4][2]int{{1, 0}, {-1, 0}, {0, 1}, {0, -1}}

func longestIncreasingPath(grid [][]int) int {
	m, n := len(grid), len(grid[0])
	memo := make([][]int, m)
	for r := range memo {
		memo[r] = make([]int, n)
	}
	var dfs func(r, c int) int
	dfs = func(r, c int) int {
		if memo[r][c] > 0 {
			return memo[r][c]
		}
		best := 1
		for _, d := range dirs {
			nr, nc := r+d[0], c+d[1]
			if nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] > grid[r][c] {
				best = max(best, 1+dfs(nr, nc))
			}
		}
		memo[r][c] = best
		return best
	}
	answer := 0
	for r := 0; r < m; r++ {
		for c := 0; c < n; c++ {
			answer = max(answer, dfs(r, c))
		}
	}
	return answer
}

func longestIncreasingPathLayers(grid [][]int) int {
	m, n := len(grid), len(grid[0])
	out := make([][]int, m)
	var layer [][2]int
	for r := 0; r < m; r++ {
		out[r] = make([]int, n)
		for c := 0; c < n; c++ {
			for _, d := range dirs {
				nr, nc := r+d[0], c+d[1]
				if nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] > grid[r][c] {
					out[r][c]++
				}
			}
			if out[r][c] == 0 {
				layer = append(layer, [2]int{r, c})
			}
		}
	}
	layers := 0
	for len(layer) > 0 {
		layers++
		var next [][2]int
		for _, cell := range layer {
			r, c := cell[0], cell[1]
			for _, d := range dirs {
				nr, nc := r+d[0], c+d[1]
				if nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] < grid[r][c] {
					out[nr][nc]--
					if out[nr][nc] == 0 {
						next = append(next, [2]int{nr, nc})
					}
				}
			}
		}
		layer = next
	}
	return layers
}

func main() {
	stockCases := []struct {
		prices []int
		want   int
	}{
		{[]int{5}, 0}, {[]int{5, 4, 3}, 0}, {[]int{1, 2}, 1}, {[]int{1, 3, 2, 8}, 7}, {[]int{2, 4, 1, 7}, 6},
		{[]int{1, 4, 2, 7}, 6}, {[]int{3, 1, 4, 8, 2, 6}, 7}, {[]int{6, 1, 6, 4, 3, 0, 2}, 7}, {[]int{1, 2, 4, 2, 5, 7, 2, 4, 9, 0}, 11},
	}
	gridCases := []struct {
		grid [][]int
		want int
	}{
		{[][]int{{7}}, 1}, {[][]int{{1, 2}, {4, 3}}, 4}, {[][]int{{3, 3}, {3, 3}}, 1},
		{[][]int{{5, 4, 3}, {6, 1, 2}, {7, 8, 9}}, 9}, {[][]int{{1, 2, 3, 4, 5}}, 5}, {[][]int{{3}, {2}, {1}}, 3},
	}
	ok, total := 0, 0
	for _, tc := range stockCases {
		total++
		if maxProfitCooldown(tc.prices) == tc.want {
			ok++
		} else {
			fmt.Println("sai ở", tc.prices)
		}
	}
	for _, tc := range gridCases {
		total++
		if longestIncreasingPath(tc.grid) == tc.want && longestIncreasingPathLayers(tc.grid) == tc.want {
			ok++
		} else {
			fmt.Println("sai ở", tc.grid)
		}
	}
	fmt.Printf("%d/%d ca đúng\n", ok, total)
}
