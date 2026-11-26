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

func networkByRounds(edges [][3]int, n, start int) int {
	best := make([]int, n)
	for i := range best {
		best[i] = infinity
	}
	best[start-1] = 0
	for layer := 1; layer < n; layer++ {
		next := append([]int(nil), best...)
		for _, edge := range edges {
			from, to, weight := edge[0]-1, edge[1]-1, edge[2]
			if best[from] != infinity {
				next[to] = min(next[to], best[from]+weight)
			}
		}
		best = next
	}
	last := 0
	for _, arrival := range best {
		if arrival == infinity {
			return -1
		}
		last = max(last, arrival)
	}
	return last
}

func main() {
	check := func(got, want int) {
		if got != want {
			panic(fmt.Sprintf("want %d, got %d", want, got))
		}
	}
	check(networkDelay([][3]int{{1, 2, 9}, {1, 3, 2}, {3, 2, 1}, {2, 4, 4}}, 4, 1), 7)
	check(networkByRounds([][3]int{{1, 2, 9}, {1, 3, 2}, {3, 2, 1}, {2, 4, 4}}, 4, 1), 7)
	check(networkDelay([][3]int{{1, 2, 0}, {2, 3, 0}}, 3, 1), 0)
	check(networkByRounds([][3]int{{1, 2, 0}, {2, 3, 0}}, 3, 1), 0)
	check(networkDelay([][3]int{{2, 1, 7}}, 3, 2), -1)
	check(networkByRounds([][3]int{{2, 1, 7}}, 3, 2), -1)
	check(networkDelay([][3]int{}, 1, 1), 0)
	check(networkByRounds([][3]int{}, 1, 1), 0)
	check(networkDelay([][3]int{{1, 2, 8}, {1, 3, 2}, {3, 2, 6}, {3, 4, 1}, {4, 2, 1}}, 4, 1), 4)
	check(networkByRounds([][3]int{{1, 2, 8}, {1, 3, 2}, {3, 2, 6}, {3, 4, 1}, {4, 2, 1}}, 4, 1), 4)
	fmt.Println("5/5 ca đúng")
}
