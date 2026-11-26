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

func main() {
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
	fmt.Println("10/10 ca đúng")
}
