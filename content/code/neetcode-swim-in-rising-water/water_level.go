package main

import (
	"container/heap"
	"fmt"
)

const infinity = int(^uint(0) >> 1)

type neighbor struct{ node, weight int }
type entry struct{ cost, node int }
type frontier []entry

func (f frontier) Len() int           { return len(f) }
func (f frontier) Less(i, j int) bool { return f[i].cost < f[j].cost }
func (f frontier) Swap(i, j int)      { f[i], f[j] = f[j], f[i] }
func (f *frontier) Push(value any)    { *f = append(*f, value.(entry)) }
func (f *frontier) Pop() any {
	last := len(*f) - 1
	value := (*f)[last]
	*f = (*f)[:last]
	return value
}

func leastCosts(graph [][]neighbor, start, initial int, extend func(int, int) int) []int {
	best := make([]int, len(graph))
	for i := range best {
		best[i] = infinity
	}
	best[start] = initial
	pending := &frontier{{initial, start}}
	for pending.Len() > 0 {
		current := heap.Pop(pending).(entry)
		if current.cost != best[current.node] {
			continue
		}
		for _, edge := range graph[current.node] {
			candidate := extend(current.cost, edge.weight)
			if candidate < best[edge.node] {
				best[edge.node] = candidate
				heap.Push(pending, entry{candidate, edge.node})
			}
		}
	}
	return best
}

func swimTime(grid [][]int) int {
	n := len(grid)
	graph := make([][]neighbor, n*n)
	directions := [][2]int{{-1, 0}, {1, 0}, {0, -1}, {0, 1}}
	for row := range grid {
		for col := range grid[row] {
			for _, delta := range directions {
				r, c := row+delta[0], col+delta[1]
				if r >= 0 && r < n && c >= 0 && c < n {
					from := row*n + col
					graph[from] = append(graph[from], neighbor{r*n + c, grid[r][c]})
				}
			}
		}
	}
	return leastCosts(graph, 0, grid[0][0], func(a, b int) int { return max(a, b) })[n*n-1]
}

func swimByThreshold(grid [][]int, binary bool) int {
	n := len(grid)
	reachable := func(level int) bool {
		queue := [][2]int{{0, 0}}
		seen := make([]bool, n*n)
		seen[0] = true
		for head := 0; head < len(queue); head++ {
			row, col := queue[head][0], queue[head][1]
			if row == n-1 && col == n-1 {
				return true
			}
			for _, d := range [][2]int{{1, 0}, {-1, 0}, {0, 1}, {0, -1}} {
				r, c := row+d[0], col+d[1]
				if r >= 0 && r < n && c >= 0 && c < n && grid[r][c] <= level && !seen[r*n+c] {
					seen[r*n+c] = true
					queue = append(queue, [2]int{r, c})
				}
			}
		}
		return false
	}
	low, high := max(grid[0][0], grid[n-1][n-1]), n*n-1
	if !binary {
		for !reachable(low) {
			low++
		}
		return low
	}
	for low < high {
		mid := (low + high) / 2
		if reachable(mid) {
			high = mid
		} else {
			low = mid + 1
		}
	}
	return low
}

func main() {
	check := func(got, want int) {
		if got != want {
			panic(fmt.Sprintf("want %d, got %d", want, got))
		}
	}
	check(swimTime([][]int{{0}}), 0)
	check(swimByThreshold([][]int{{0}}, true), 0)
	check(swimByThreshold([][]int{{0}}, false), 0)
	check(swimTime([][]int{{3, 0}, {2, 1}}), 3)
	check(swimByThreshold([][]int{{3, 0}, {2, 1}}, true), 3)
	check(swimByThreshold([][]int{{3, 0}, {2, 1}}, false), 3)
	check(swimTime([][]int{{0, 8, 7}, {1, 6, 5}, {2, 3, 4}}), 4)
	check(swimByThreshold([][]int{{0, 8, 7}, {1, 6, 5}, {2, 3, 4}}, true), 4)
	check(swimByThreshold([][]int{{0, 8, 7}, {1, 6, 5}, {2, 3, 4}}, false), 4)
	check(swimTime([][]int{{0, 1, 8}, {7, 2, 6}, {5, 3, 4}}), 4)
	check(swimByThreshold([][]int{{0, 1, 8}, {7, 2, 6}, {5, 3, 4}}, true), 4)
	check(swimByThreshold([][]int{{0, 1, 8}, {7, 2, 6}, {5, 3, 4}}, false), 4)
	check(swimTime([][]int{{0, 1}, {2, 3}}), 3)
	check(swimByThreshold([][]int{{0, 1}, {2, 3}}, true), 3)
	check(swimByThreshold([][]int{{0, 1}, {2, 3}}, false), 3)
	fmt.Println("5/5 ca đúng")
}
