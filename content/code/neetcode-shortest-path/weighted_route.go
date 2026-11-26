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

func networkDelay(edges [][3]int, n, start int) int {
	graph := make([][]neighbor, n)
	for _, edge := range edges {
		from, to, time := edge[0]-1, edge[1]-1, edge[2]
		graph[from] = append(graph[from], neighbor{to, time})
	}
	lastArrival := 0
	for _, time := range leastCosts(graph, start-1, 0, func(cost, time int) int { return cost + time }) {
		if time == infinity {
			return -1
		}
		lastArrival = max(lastArrival, time)
	}
	return lastArrival
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

func cheapestFlight(n int, flights [][3]int, start, end, k int) int {
	best := make([]int, n)
	for i := range best {
		best[i] = infinity
	}
	best[start] = 0
	for used := 0; used <= k; used++ {
		next := append([]int(nil), best...)
		for _, flight := range flights {
			from, to, price := flight[0], flight[1], flight[2]
			if best[from] != infinity {
				next[to] = min(next[to], best[from]+price)
			}
		}
		best = next
	}
	if best[end] == infinity {
		return -1
	}
	return best[end]
}

func main() {
	passed := 0
	check := func(got, want int) {
		if got != want {
			panic(fmt.Sprintf("want %d, got %d", want, got))
		}
		passed++
	}
	check(networkDelay([][3]int{{1, 2, 9}, {1, 3, 2}, {3, 2, 1}, {2, 4, 4}}, 4, 1), 7)
	check(networkDelay([][3]int{{1, 2, 0}, {2, 3, 0}}, 3, 1), 0)
	check(networkDelay([][3]int{{2, 1, 7}}, 3, 2), -1)
	check(networkDelay([][3]int{}, 1, 1), 0)
	check(networkDelay([][3]int{{1, 2, 8}, {1, 3, 2}, {3, 2, 6}, {3, 4, 1}, {4, 2, 1}}, 4, 1), 4)
	check(swimTime([][]int{{0}}), 0)
	check(swimTime([][]int{{3, 0}, {2, 1}}), 3)
	check(swimTime([][]int{{0, 8, 7}, {1, 6, 5}, {2, 3, 4}}), 4)
	check(swimTime([][]int{{0, 1, 8}, {7, 2, 6}, {5, 3, 4}}), 4)
	check(swimTime([][]int{{0, 1}, {2, 3}}), 3)
	check(cheapestFlight(4, [][3]int{{0, 1, 1}, {1, 2, 1}, {0, 2, 6}, {2, 3, 1}}, 0, 3, 1), 7)
	check(cheapestFlight(4, [][3]int{{0, 1, 1}, {1, 2, 1}, {0, 2, 6}, {2, 3, 1}}, 0, 3, 2), 3)
	check(cheapestFlight(3, [][3]int{{0, 1, 1}, {1, 2, 1}, {0, 2, 8}}, 0, 2, 0), 8)
	check(cheapestFlight(3, [][3]int{{0, 1, 1}, {1, 2, 1}}, 0, 2, 0), -1)
	check(cheapestFlight(3, [][3]int{{0, 1, 4}, {1, 0, 1}, {1, 2, 2}}, 0, 2, 2), 6)
	fmt.Printf("%d/15 ca đúng\n", passed)
}
