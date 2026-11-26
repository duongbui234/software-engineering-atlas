package main

import "fmt"

type cell struct{ row, col int }

var directions = [...]cell{{-1, 0}, {1, 0}, {0, -1}, {0, 1}}

func inside(r, c, rows, cols int) bool {
	return r >= 0 && r < rows && c >= 0 && c < cols
}

func simulate(grid [][]int) (int, int) {
	rows, cols := len(grid), len(grid[0])
	fresh, minutes, scans := 0, 0, 0
	for _, row := range grid {
		for _, value := range row {
			if value == 1 {
				fresh++
			}
		}
	}

	for fresh > 0 {
		next := []cell{}
		for r, row := range grid {
			for c, value := range row {
				scans++
				if value != 1 {
					continue
				}
				for _, d := range directions {
					nr, nc := r+d.row, c+d.col
					if inside(nr, nc, rows, cols) && grid[nr][nc] == 2 {
						next = append(next, cell{r, c})
						break
					}
				}
			}
		}
		if len(next) == 0 {
			return -1, scans
		}
		for _, p := range next {
			grid[p.row][p.col] = 2
		}
		fresh -= len(next)
		minutes++
	}
	return minutes, scans
}

func spread(grid [][]int) (int, int) {
	rows, cols := len(grid), len(grid[0])
	queue := []cell{}
	fresh := 0
	for r, row := range grid {
		for c, value := range row {
			if value == 2 {
				queue = append(queue, cell{r, c})
			}
			if value == 1 {
				fresh++
			}
		}
	}

	head, minutes := 0, 0
	for head < len(queue) {
		end := len(queue)
		for head < end {
			p := queue[head]
			head++
			for _, d := range directions {
				nr, nc := p.row+d.row, p.col+d.col
				if !inside(nr, nc, rows, cols) || grid[nr][nc] != 1 {
					continue
				}
				grid[nr][nc] = 2
				fresh--
				queue = append(queue, cell{nr, nc})
			}
		}
		if len(queue) > end {
			minutes++
		}
	}
	if fresh > 0 {
		return -1, head
	}
	return minutes, head
}

func clone(grid [][]int) [][]int {
	copyRows := make([][]int, len(grid))
	for r, row := range grid {
		copyRows[r] = append([]int(nil), row...)
	}
	return copyRows
}

func main() {
	cases := []struct {
		grid [][]int
		want int
	}{
		{[][]int{{2, 1, 1, 0, 2}, {0, 1, 1, 1, 1}}, 3},
		{[][]int{{2, 1, 0, 1}, {0, 1, 0, 1}}, -1},
		{[][]int{{0, 2, 0}}, 0},
		{[][]int{{1}}, -1},
		{[][]int{{0}}, 0},
		{[][]int{{2, 1, 2}}, 1},
		{[][]int{{2, 1, 1, 1, 1, 1, 1, 1, 1, 1}}, 9},
	}
	for _, test := range cases {
		slow, _ := simulate(clone(test.grid))
		fast, _ := spread(clone(test.grid))
		if slow != test.want || fast != test.want {
			panic(fmt.Sprintf("unexpected result for %v", test.grid))
		}
	}

	corridor := cases[len(cases)-1].grid
	_, scans := simulate(clone(corridor))
	_, pops := spread(clone(corridor))
	if scans != 90 || pops != 10 {
		panic("unexpected operation counts")
	}
	fmt.Printf("%d/%d ca đúng\n", len(cases), len(cases))
	fmt.Printf("Quét: %d; lấy khỏi hàng đợi: %d\n", scans, pops)
}
