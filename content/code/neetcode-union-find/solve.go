package main

import "fmt"

type edge [2]int

type disjointSet struct {
	parent, size []int
	count        int
}

func newDisjointSet(n int) *disjointSet {
	ds := &disjointSet{make([]int, n), make([]int, n), n}
	for i := range ds.parent {
		ds.parent[i], ds.size[i] = i, 1
	}
	return ds
}

func (ds *disjointSet) find(node int) int {
	for node != ds.parent[node] {
		ds.parent[node] = ds.parent[ds.parent[node]]
		node = ds.parent[node]
	}
	return node
}

func (ds *disjointSet) union(a, b int) bool {
	ra, rb := ds.find(a), ds.find(b)
	if ra == rb {
		return false
	}
	if ds.size[ra] < ds.size[rb] {
		ra, rb = rb, ra
	}
	ds.parent[rb] = ra
	ds.size[ra] += ds.size[rb]
	ds.count--
	return true
}

func adjacency(n int, edges []edge) [][]int {
	adj := make([][]int, n)
	for _, e := range edges {
		a, b := e[0], e[1]
		adj[a] = append(adj[a], b)
		adj[b] = append(adj[b], a)
	}
	return adj
}

func walk(adj [][]int, start int, seen []bool) int {
	pending := []int{start}
	seen[start] = true
	visited := 0
	for len(pending) > 0 {
		last := len(pending) - 1
		node := pending[last]
		pending = pending[:last]
		visited++
		for _, next := range adj[node] {
			if !seen[next] {
				seen[next] = true
				pending = append(pending, next)
			}
		}
	}
	return visited
}

func redundantByDsu(n int, edges []edge) edge {
	ds := newDisjointSet(n + 1)
	for _, e := range edges {
		if !ds.union(e[0], e[1]) {
			return e
		}
	}
	panic("Cần đúng một cạnh dư")
}

func redundantByWalk(n int, edges []edge) edge {
	adj := adjacency(n+1, nil)
	for _, e := range edges {
		a, b := e[0], e[1]
		seen := make([]bool, n+1)
		walk(adj, a, seen)
		if seen[b] {
			return e
		}
		adj[a] = append(adj[a], b)
		adj[b] = append(adj[b], a)
	}
	panic("Cần đúng một cạnh dư")
}

func componentsByDsu(n int, edges []edge) int {
	ds := newDisjointSet(n)
	for _, e := range edges {
		ds.union(e[0], e[1])
	}
	return ds.count
}

func componentsByWalk(n int, edges []edge) int {
	adj := adjacency(n, edges)
	seen := make([]bool, n)
	count := 0
	for vertex := range seen {
		if !seen[vertex] {
			walk(adj, vertex, seen)
			count++
		}
	}
	return count
}

func treeByDsu(n int, edges []edge) bool {
	if len(edges) != n-1 {
		return false
	}
	ds := newDisjointSet(n)
	for _, e := range edges {
		if !ds.union(e[0], e[1]) {
			return false
		}
	}
	return true
}

func treeByWalk(n int, edges []edge) bool {
	return len(edges) == n-1 && walk(adjacency(n, edges), 0, make([]bool, n)) == n
}

func main() {
	if redundantByDsu(5, []edge{{1, 4}, {2, 4}, {1, 2}, {4, 5}, {3, 5}}) != (edge{1, 2}) || redundantByWalk(5, []edge{{1, 4}, {2, 4}, {1, 2}, {4, 5}, {3, 5}}) != (edge{1, 2}) {
		panic("Ca redundant n=5")
	}
	if redundantByDsu(4, []edge{{1, 4}, {1, 3}, {2, 4}, {2, 3}}) != (edge{2, 3}) || redundantByWalk(4, []edge{{1, 4}, {1, 3}, {2, 4}, {2, 3}}) != (edge{2, 3}) {
		panic("Ca redundant n=4")
	}
	if redundantByDsu(6, []edge{{1, 4}, {3, 5}, {1, 5}, {3, 4}, {2, 6}, {2, 5}}) != (edge{3, 4}) || redundantByWalk(6, []edge{{1, 4}, {3, 5}, {1, 5}, {3, 4}, {2, 6}, {2, 5}}) != (edge{3, 4}) {
		panic("Ca redundant n=6")
	}

	if componentsByDsu(7, []edge{{0, 2}, {2, 4}, {0, 4}, {1, 3}}) != (4) || componentsByWalk(7, []edge{{0, 2}, {2, 4}, {0, 4}, {1, 3}}) != (4) {
		panic("Ca components n=7")
	}
	if componentsByDsu(5, []edge{{3, 4}, {1, 2}, {0, 4}, {2, 3}}) != (1) || componentsByWalk(5, []edge{{3, 4}, {1, 2}, {0, 4}, {2, 3}}) != (1) {
		panic("Ca components n=5")
	}
	if componentsByDsu(1, []edge{}) != (1) || componentsByWalk(1, []edge{}) != (1) {
		panic("Ca components n=1")
	}
	if componentsByDsu(6, []edge{{2, 5}}) != (5) || componentsByWalk(6, []edge{{2, 5}}) != (5) {
		panic("Ca components n=6")
	}
	if componentsByDsu(4, []edge{}) != (4) || componentsByWalk(4, []edge{}) != (4) {
		panic("Ca components n=4")
	}

	if treeByDsu(1, []edge{}) != (true) || treeByWalk(1, []edge{}) != (true) {
		panic("Ca tree n=1")
	}
	if treeByDsu(3, []edge{{0, 2}, {2, 1}}) != (true) || treeByWalk(3, []edge{{0, 2}, {2, 1}}) != (true) {
		panic("Ca tree n=3")
	}
	if treeByDsu(5, []edge{{0, 1}, {1, 2}, {0, 2}, {3, 4}}) != (false) || treeByWalk(5, []edge{{0, 1}, {1, 2}, {0, 2}, {3, 4}}) != (false) {
		panic("Ca tree n=5")
	}
	if treeByDsu(5, []edge{{0, 1}, {1, 2}, {3, 4}}) != (false) || treeByWalk(5, []edge{{0, 1}, {1, 2}, {3, 4}}) != (false) {
		panic("Ca tree n=5")
	}
	if treeByDsu(4, []edge{{0, 1}, {1, 3}, {2, 3}, {0, 2}}) != (false) || treeByWalk(4, []edge{{0, 1}, {1, 3}, {2, 3}, {0, 2}}) != (false) {
		panic("Ca tree n=4")
	}
	fmt.Println("26/26 ca đúng")
}
