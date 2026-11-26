// Ga GRPH-03: sắp xếp topo cho ba bài Course Schedule, Course Schedule II, Alien Dictionary.
// Chạy: go run topological_sort.go
package main

import (
	"fmt"
	"sort"
	"strings"
)

// ---------- Khuôn chung: thuật toán Kahn ----------
// n đỉnh 0..n-1, edges là các cặp {trước, sau}. Trả về thứ tự lấy ra được.
// Nếu thứ tự ngắn hơn n thì đồ thị có chu trình.
func kahn(n int, edges [][2]int) []int {
	adj := make([][]int, n)
	indeg := make([]int, n)
	for _, e := range edges {
		before, after := e[0], e[1]
		adj[before] = append(adj[before], after)
		indeg[after]++ // "after" còn chờ thêm một việc
	}
	queue := []int{}
	for v := 0; v < n; v++ {
		if indeg[v] == 0 {
			queue = append(queue, v)
		}
	}
	order := []int{}
	for head := 0; head < len(queue); head++ {
		v := queue[head]
		order = append(order, v)
		for _, w := range adj[v] {
			indeg[w]--
			if indeg[w] == 0 { // hết việc phải chờ: sẵn sàng
				queue = append(queue, w)
			}
		}
	}
	return order
}

// Đề cho [a, b] nghĩa là "học b trước a", tức cạnh b → a.
func toEdges(prerequisites [][]int) [][2]int {
	edges := make([][2]int, len(prerequisites))
	for i, p := range prerequisites {
		edges[i] = [2]int{p[1], p[0]}
	}
	return edges
}

func buildAdj(n int, prerequisites [][]int) [][]int {
	adj := make([][]int, n)
	for _, e := range toEdges(prerequisites) {
		adj[e[0]] = append(adj[e[0]], e[1])
	}
	return adj
}

// ---------- 207. Course Schedule: chỉ hỏi có học hết được không ----------
func canFinish(numCourses int, prerequisites [][]int) bool {
	return len(kahn(numCourses, toEdges(prerequisites))) == numCourses
}

// Cách thứ hai: DFS ba màu. Trắng = chưa thăm, xám = đang trên đường đi, đen = đã xong.
const (
	white = 0
	gray  = 1
	black = 2
)

func canFinishDfs(numCourses int, prerequisites [][]int) bool {
	adj := buildAdj(numCourses, prerequisites)
	color := make([]int, numCourses)
	var hasCycleFrom func(v int) bool
	hasCycleFrom = func(v int) bool {
		color[v] = gray
		for _, w := range adj[v] {
			if color[w] == gray { // quay lại một đỉnh còn trên đường: chu trình
				return true
			}
			if color[w] == white && hasCycleFrom(w) {
				return true
			}
		}
		color[v] = black
		return false
	}
	for v := 0; v < numCourses; v++ {
		if color[v] == white && hasCycleFrom(v) {
			return false
		}
	}
	return true
}

// ---------- 210. Course Schedule II: trả về một thứ tự học ----------
func findOrder(numCourses int, prerequisites [][]int) []int {
	order := kahn(numCourses, toEdges(prerequisites))
	if len(order) != numCourses {
		return []int{}
	}
	return order
}

// DFS: một môn "xong" (tô đen) sau mọi môn đứng sau nó. Đảo ngược thứ tự xong là thứ tự topo.
func findOrderDfs(numCourses int, prerequisites [][]int) []int {
	adj := buildAdj(numCourses, prerequisites)
	color := make([]int, numCourses)
	finished := []int{}
	var visit func(v int) bool
	visit = func(v int) bool {
		color[v] = gray
		for _, w := range adj[v] {
			if color[w] == gray {
				return false
			}
			if color[w] == white && !visit(w) {
				return false
			}
		}
		color[v] = black
		finished = append(finished, v)
		return true
	}
	for v := 0; v < numCourses; v++ {
		if color[v] == white && !visit(v) {
			return []int{}
		}
	}
	for i, j := 0, len(finished)-1; i < j; i, j = i+1, j-1 {
		finished[i], finished[j] = finished[j], finished[i]
	}
	return finished
}

// ---------- 269. Alien Dictionary: tự dựng cạnh từ các cặp từ kề nhau ----------
// Đề chỉ dùng chữ thường a-z, nên mình đi theo byte.
func alienOrder(words []string) string {
	letters := []byte{} // theo thứ tự xuất hiện đầu tiên
	id := map[byte]int{}
	for _, word := range words {
		for i := 0; i < len(word); i++ {
			if _, ok := id[word[i]]; !ok {
				id[word[i]] = len(letters)
				letters = append(letters, word[i])
			}
		}
	}
	edges := [][2]int{}
	seenEdge := map[[2]byte]bool{}
	for i := 0; i+1 < len(words); i++ {
		a, b := words[i], words[i+1]
		n := min(len(a), len(b))
		j := 0
		for j < n && a[j] == b[j] {
			j++
		}
		if j == n {
			if len(a) > len(b) {
				return "" // "abc" đứng trước "ab": danh sách sai
			}
			continue // một từ là đầu của từ kia: không cho biết gì
		}
		key := [2]byte{a[j], b[j]}
		if !seenEdge[key] { // mỗi cạnh chỉ thêm một lần, để danh sách kề và bậc vào khớp nhau
			seenEdge[key] = true
			edges = append(edges, [2]int{id[a[j]], id[b[j]]})
		}
	}
	order := kahn(len(letters), edges)
	if len(order) != len(letters) {
		return ""
	}
	var sb strings.Builder
	for _, v := range order {
		sb.WriteByte(letters[v])
	}
	return sb.String()
}

// ---------- Kiểm tra ----------
func isValidOrder(n int, prerequisites [][]int, order []int) bool {
	if len(order) != n {
		return false
	}
	pos := make([]int, n)
	for i := range pos {
		pos[i] = -1
	}
	for i, v := range order {
		if v < 0 || v >= n || pos[v] != -1 {
			return false
		}
		pos[v] = i
	}
	for _, p := range prerequisites {
		if pos[p[1]] >= pos[p[0]] {
			return false
		}
	}
	return true
}

func lessBy(rank map[byte]int, a, b string) int {
	for i := 0; i < min(len(a), len(b)); i++ {
		if a[i] != b[i] {
			return rank[a[i]] - rank[b[i]]
		}
	}
	return len(a) - len(b)
}

// Danh sách từ có được xếp đúng theo bảng chữ `alphabet` không, và có đủ mọi chữ không.
func sortedBy(words []string, alphabet string) bool {
	rank := map[byte]int{}
	for i := 0; i < len(alphabet); i++ {
		rank[alphabet[i]] = i
	}
	all := map[byte]bool{}
	for _, w := range words {
		for i := 0; i < len(w); i++ {
			if _, ok := rank[w[i]]; !ok {
				return false
			}
			all[w[i]] = true
		}
	}
	if len(all) != len(alphabet) || len(rank) != len(alphabet) {
		return false
	}
	for i := 0; i+1 < len(words); i++ {
		if lessBy(rank, words[i], words[i+1]) > 0 {
			return false
		}
	}
	return true
}

// Bộ sinh số giả ngẫu nhiên cố định hạt giống, để lần chạy nào cũng như nhau.
var seed = 42

func rand(k int) int {
	seed = seed * 48271 % 2147483647
	return seed % k
}

type graph struct {
	n int
	p [][]int
}

func main() {
	// Trang phục buổi sáng: 0 tất, 1 quần, 2 áo sơ mi, 3 giày, 4 thắt lưng, 5 cà vạt, 6 áo khoác.
	outfit := [][]int{{3, 0}, {3, 1}, {4, 1}, {4, 2}, {5, 2}, {6, 5}, {6, 4}}
	chain := [][]int{}
	for i := 0; i < 1999; i++ {
		chain = append(chain, []int{i + 1, i})
	}
	graphs := []graph{}
	for t := 0; t < 300; t++ {
		n := 1 + rand(8)
		m := rand(10)
		p := [][]int{}
		for i := 0; i < m; i++ {
			a := rand(n)
			b := rand(n)
			p = append(p, []int{a, b})
		}
		graphs = append(graphs, graph{n, p})
	}
	alienLists := [][]string{}
	for t := 0; t < 200; t++ {
		pool := "abcdef"[:2+rand(5)]
		words := []string{}
		k := 2 + rand(6)
		for i := 0; i < k; i++ {
			l := 1 + rand(3)
			var sb strings.Builder
			for c := 0; c < l; c++ {
				sb.WriteByte(pool[rand(len(pool))])
			}
			words = append(words, sb.String())
		}
		// xếp theo một bảng chữ đảo ngược, để đáp án không trùng thứ tự a-z
		rank := map[byte]int{}
		for i := 0; i < len(pool); i++ {
			rank[pool[i]] = len(pool) - 1 - i
		}
		sort.SliceStable(words, func(i, j int) bool { return lessBy(rank, words[i], words[j]) < 0 })
		alienLists = append(alienLists, words)
	}

	all := func(f func(g graph) bool) bool {
		for _, g := range graphs {
			if !f(g) {
				return false
			}
		}
		return true
	}
	eq := func(a []int, b ...int) bool {
		if len(a) != len(b) {
			return false
		}
		for i := range a {
			if a[i] != b[i] {
				return false
			}
		}
		return true
	}

	type tc struct {
		name string
		pass bool
	}
	cases := []tc{
		{"207 hai môn, một điều kiện", canFinish(2, [][]int{{1, 0}}) == true},
		{"207 hai môn chờ nhau: chu trình", canFinish(2, [][]int{{1, 0}, {0, 1}}) == false},
		{"207 môn tự cần chính nó", canFinish(1, [][]int{{0, 0}}) == false},
		{"207 chuỗi 2 000 môn", canFinish(2000, chain) && canFinishDfs(2000, chain)},
		{"207 Kahn và DFS ba màu khớp nhau trên 300 đồ thị",
			all(func(g graph) bool { return canFinish(g.n, g.p) == canFinishDfs(g.n, g.p) })},
		{"210 trang phục buổi sáng", eq(findOrder(7, outfit), 0, 1, 2, 3, 4, 5, 6)},
		{"210 DFS cũng cho thứ tự hợp lệ", isValidOrder(7, outfit, findOrderDfs(7, outfit))},
		{"210 có chu trình thì trả mảng rỗng", len(findOrder(3, [][]int{{0, 1}, {1, 2}, {2, 0}})) == 0},
		{"210 thứ tự hợp lệ trên 300 đồ thị", all(func(g graph) bool {
			o := findOrder(g.n, g.p)
			if canFinish(g.n, g.p) {
				return isValidOrder(g.n, g.p, o) && isValidOrder(g.n, g.p, findOrderDfs(g.n, g.p))
			}
			return len(o) == 0
		})},
		{"269 ví dụ bốn từ", alienOrder([]string{"ba", "bc", "ac", "cab"}) == "bac"},
		{"269 hai chữ ngược nhau: chu trình", alienOrder([]string{"z", "x", "z"}) == ""},
		{"269 từ dài đứng trước đầu của nó", alienOrder([]string{"abc", "ab"}) == ""},
		{"269 chữ không có cạnh vẫn phải có mặt", sortedBy([]string{"za", "zb"}, alienOrder([]string{"za", "zb"}))},
		{"269 khớp bảng chữ trên 200 danh sách ngẫu nhiên", func() bool {
			for _, l := range alienLists {
				if !sortedBy(l, alienOrder(l)) {
					return false
				}
			}
			return true
		}()},
	}

	ok := 0
	for _, c := range cases {
		if c.pass {
			ok++
		} else {
			fmt.Println("SAI:", c.name)
		}
	}
	fmt.Printf("topological_sort %d/%d ca đúng\n", ok, len(cases))
}
