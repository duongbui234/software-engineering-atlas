package main

import "fmt"

const infinity = int(^uint(0) >> 1)

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

func cheapestByRoutes(n int, flights [][3]int, start, end, k int) int {
	adj := make([][][2]int, n)
	for _, flight := range flights {
		adj[flight[0]] = append(adj[flight[0]], [2]int{flight[1], flight[2]})
	}
	var visit func(int, int) int
	visit = func(city, remaining int) int {
		if city == end {
			return 0
		}
		if remaining == 0 {
			return infinity
		}
		best := infinity
		for _, edge := range adj[city] {
			tail := visit(edge[0], remaining-1)
			if tail != infinity {
				best = min(best, edge[1]+tail)
			}
		}
		return best
	}
	fare := visit(start, k+1)
	if fare == infinity {
		return -1
	}
	return fare
}

func main() {
	check := func(got, want int) {
		if got != want {
			panic(fmt.Sprintf("want %d, got %d", want, got))
		}
	}
	check(cheapestFlight(4, [][3]int{{0, 1, 1}, {1, 2, 1}, {0, 2, 6}, {2, 3, 1}}, 0, 3, 1), 7)
	check(cheapestByRoutes(4, [][3]int{{0, 1, 1}, {1, 2, 1}, {0, 2, 6}, {2, 3, 1}}, 0, 3, 1), 7)
	check(cheapestFlight(4, [][3]int{{0, 1, 1}, {1, 2, 1}, {0, 2, 6}, {2, 3, 1}}, 0, 3, 2), 3)
	check(cheapestByRoutes(4, [][3]int{{0, 1, 1}, {1, 2, 1}, {0, 2, 6}, {2, 3, 1}}, 0, 3, 2), 3)
	check(cheapestFlight(3, [][3]int{{0, 1, 1}, {1, 2, 1}, {0, 2, 8}}, 0, 2, 0), 8)
	check(cheapestByRoutes(3, [][3]int{{0, 1, 1}, {1, 2, 1}, {0, 2, 8}}, 0, 2, 0), 8)
	check(cheapestFlight(3, [][3]int{{0, 1, 1}, {1, 2, 1}}, 0, 2, 0), -1)
	check(cheapestByRoutes(3, [][3]int{{0, 1, 1}, {1, 2, 1}}, 0, 2, 0), -1)
	check(cheapestFlight(3, [][3]int{{0, 1, 4}, {1, 0, 1}, {1, 2, 2}}, 0, 2, 2), 6)
	check(cheapestByRoutes(3, [][3]int{{0, 1, 4}, {1, 0, 1}, {1, 2, 2}}, 0, 2, 2), 6)
	fmt.Println("5/5 ca đúng")
}
