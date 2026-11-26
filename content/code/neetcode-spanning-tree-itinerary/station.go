package main

import (
	"cmp"
	"fmt"
	"math"
	"slices"
	"strings"
)

type point [2]int
type edge struct{ weight, a, b int }

func distance(p, q point) int {
	x, y := p[0]-q[0], p[1]-q[1]
	if x < 0 {
		x = -x
	}
	if y < 0 {
		y = -y
	}
	return x + y
}

func prim(points []point) int64 {
	n := len(points)
	inTree := make([]bool, n)
	best := make([]int, n)
	for i := 1; i < n; i++ {
		best[i] = math.MaxInt
	}

	var total int64
	for range n {
		next := -1
		for i := range n {
			if !inTree[i] && (next == -1 || best[i] < best[next]) {
				next = i
			}
		}
		inTree[next] = true
		total += int64(best[next])
		for i := range n {
			if !inTree[i] {
				best[i] = min(best[i], distance(points[next], points[i]))
			}
		}
	}
	return total
}

func kruskal(points []point) int64 {
	n := len(points)
	edges := make([]edge, 0, n*(n-1)/2)
	for a := range n {
		for b := a + 1; b < n; b++ {
			edges = append(edges, edge{distance(points[a], points[b]), a, b})
		}
	}
	slices.SortFunc(edges, func(a, b edge) int { return cmp.Compare(a.weight, b.weight) })
	parent := make([]int, n)
	size := make([]int, n)
	for i := range n {
		parent[i], size[i] = i, 1
	}
	root := func(i int) int {
		for parent[i] != i {
			parent[i] = parent[parent[i]]
			i = parent[i]
		}
		return i
	}
	var total int64
	used := 0
	for _, e := range edges {
		x, y := root(e.a), root(e.b)
		if x == y {
			continue
		}
		if size[x] < size[y] {
			x, y = y, x
		}
		parent[y] = x
		size[x] += size[y]
		total += int64(e.weight)
		used++
		if used == n-1 {
			break
		}
	}
	return total
}

func findItinerary(tickets [][2]string) []string {
	outgoing := make(map[string][]string)
	for _, ticket := range tickets {
		from, to := ticket[0], ticket[1]
		outgoing[from] = append(outgoing[from], to)
	}
	for _, destinations := range outgoing {
		slices.Sort(destinations)
		slices.Reverse(destinations)
	}

	stack := []string{"JFK"}
	suffix := make([]string, 0, len(tickets)+1)
	for len(stack) > 0 {
		last := len(stack) - 1
		current := stack[last]
		destinations := outgoing[current]
		if len(destinations) > 0 {
			end := len(destinations) - 1
			stack = append(stack, destinations[end])
			outgoing[current] = destinations[:end]
		} else {
			suffix = append(suffix, current)
			stack = stack[:last]
		}
	}
	slices.Reverse(suffix)
	return suffix
}

// EXAMPLE
func main() {
	points := []point{{0, 0}, {4, 0}, {5, 0}, {5, 2}}
	tickets := [][2]string{{"JFK", "AAA"}, {"JFK", "BBB"}, {"BBB", "JFK"}}
	if prim(points) != 7 || kruskal(points) != 7 {
		panic("Sai giá nối")
	}
	if strings.Join(findItinerary(tickets), " ") != "JFK BBB JFK AAA" {
		panic("Sai hành trình")
	}
	fmt.Println("2/2 ca đúng")
}
