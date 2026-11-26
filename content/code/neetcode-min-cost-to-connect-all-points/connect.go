package main

import (
	"cmp"
	"fmt"
	"math"
	"slices"
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

// TESTS
func main() {
	cases := []struct {
		points []point
		want   int64
	}{
		{[]point{{4, 8}}, 0},
		{[]point{{-2, 1}, {1, 3}}, 5},
		{[]point{{0, 0}, {2, 0}, {0, 2}, {2, 2}}, 6},
		{[]point{{0, 0}, {10, 0}, {11, 0}, {22, 0}}, 22},
		{[]point{{-3, -3}, {-3, 2}, {0, 2}, {0, 4}}, 10},
		{[]point{{-1000000, -1000000}, {1000000, 1000000}}, 4000000},
	}
	for _, test := range cases {
		if prim(test.points) != test.want || kruskal(test.points) != test.want {
			panic("Sai chi phí")
		}
	}
	fmt.Printf("%d/%d ca đúng\n", len(cases), len(cases))
}
