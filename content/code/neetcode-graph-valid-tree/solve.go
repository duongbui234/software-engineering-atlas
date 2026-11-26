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
	fmt.Println("10/10 ca đúng")
}
