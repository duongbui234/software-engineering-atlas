// LC 133 Clone Graph: ba cách đúng (DFS đệ quy, BFS, DFS lặp) và bốn cách sai hay gặp.
// Chạy: go run clone_graph.go
package main

import (
	"fmt"
	"strings"
	"time"
)

type Node struct {
	Val       int
	Neighbors []*Node
}

// ---------- Cách 1: DFS đệ quy với sổ "cũ → mới" ----------
func cloneDfs(node *Node) *Node {
	if node == nil {
		return nil
	}
	copies := map[*Node]*Node{} // khóa là con trỏ: mỗi nút gốc một ô
	var visit func(old *Node) *Node
	visit = func(old *Node) *Node {
		if c, ok := copies[old]; ok {
			return c // đã sao rồi: dùng lại
		}
		c := &Node{Val: old.Val}
		copies[old] = c // ghi sổ TRƯỚC khi đi tiếp
		for _, nb := range old.Neighbors {
			c.Neighbors = append(c.Neighbors, visit(nb))
		}
		return c
	}
	return visit(node)
}

// ---------- Cách 2: BFS với sổ "cũ → mới" ----------
func cloneBfs(node *Node) *Node {
	if node == nil {
		return nil
	}
	copies := map[*Node]*Node{node: {Val: node.Val}}
	queue := []*Node{node}
	for head := 0; head < len(queue); head++ {
		old := queue[head]
		for _, nb := range old.Neighbors {
			c, ok := copies[nb]
			if !ok {
				c = &Node{Val: nb.Val} // tạo bản sao lúc thấy lần đầu, rồi mới xếp hàng
				copies[nb] = c
				queue = append(queue, nb)
			}
			copies[old].Neighbors = append(copies[old].Neighbors, c)
		}
	}
	return copies[node]
}

// ---------- Cách 3: DFS lặp với ngăn xếp ----------
func cloneDfsIterative(node *Node) *Node {
	if node == nil {
		return nil
	}
	copies := map[*Node]*Node{node: {Val: node.Val}}
	stack := []*Node{node}
	for len(stack) > 0 {
		old := stack[len(stack)-1]
		stack = stack[:len(stack)-1]
		for _, nb := range old.Neighbors {
			c, ok := copies[nb]
			if !ok {
				c = &Node{Val: nb.Val}
				copies[nb] = c
				stack = append(stack, nb)
			}
			copies[old].Neighbors = append(copies[old].Neighbors, c)
		}
	}
	return copies[node]
}

// ---------- Sai 1: sao nông ----------
func wrongShallow(node *Node) *Node {
	if node == nil {
		return nil
	}
	return &Node{Val: node.Val, Neighbors: node.Neighbors} // hàng xóm vẫn là nút CŨ
}

// Go không bắt được tràn ngăn xếp: chương trình chết với "fatal error: stack overflow".
// Để file chạy hết, hai bản sai đệ quy vô tận dừng ở độ sâu 10 000 bằng panic rồi recover.
const depthGuard = 10_000

type tooDeep struct{}

// ---------- Sai 2: đệ quy không có sổ ----------
func wrongNoMap(node *Node) *Node {
	var visit func(old *Node, depth int) *Node
	visit = func(old *Node, depth int) *Node {
		if depth > depthGuard {
			panic(tooDeep{})
		}
		c := &Node{Val: old.Val}
		for _, nb := range old.Neighbors {
			c.Neighbors = append(c.Neighbors, visit(nb, depth+1))
		}
		return c
	}
	if node == nil {
		return nil
	}
	return visit(node, 0)
}

// ---------- Sai 3: ghi sổ SAU khi đi hết hàng xóm ----------
func wrongMapAfterRecurse(node *Node) *Node {
	if node == nil {
		return nil
	}
	copies := map[*Node]*Node{}
	var visit func(old *Node, depth int) *Node
	visit = func(old *Node, depth int) *Node {
		if depth > depthGuard {
			panic(tooDeep{})
		}
		if c, ok := copies[old]; ok {
			return c
		}
		c := &Node{Val: old.Val}
		for _, nb := range old.Neighbors {
			c.Neighbors = append(c.Neighbors, visit(nb, depth+1))
		}
		copies[old] = c // quá muộn
		return c
	}
	return visit(node, 0)
}

// ---------- Sai 4: chỉ nhớ "đã thăm", không nhớ bản sao ----------
func wrongSetOnly(node *Node) *Node {
	if node == nil {
		return nil
	}
	visited := map[*Node]bool{}
	var visit func(old *Node) *Node
	visit = func(old *Node) *Node {
		visited[old] = true
		c := &Node{Val: old.Val}
		for _, nb := range old.Neighbors {
			if visited[nb] {
				c.Neighbors = append(c.Neighbors, &Node{Val: nb.Val})
			} else {
				c.Neighbors = append(c.Neighbors, visit(nb))
			}
		}
		return c
	}
	return visit(node)
}

// ---------- Dựng đồ thị và kiểm tra ----------
func build(adj [][]int) *Node {
	if len(adj) == 0 {
		return nil
	}
	nodes := make([]*Node, len(adj))
	for i := range adj {
		nodes[i] = &Node{Val: i + 1}
	}
	for i, nbs := range adj {
		for _, v := range nbs {
			nodes[i].Neighbors = append(nodes[i].Neighbors, nodes[v-1])
		}
	}
	return nodes[0]
}

func collect(start *Node) []*Node {
	if start == nil {
		return nil
	}
	seen := map[*Node]bool{start: true}
	order := []*Node{start}
	for h := 0; h < len(order); h++ {
		for _, nb := range order[h].Neighbors {
			if !seen[nb] {
				seen[nb] = true
				order = append(order, nb)
			}
		}
	}
	return order
}

func vals(ns []*Node) string {
	parts := make([]string, len(ns))
	for i, n := range ns {
		parts[i] = fmt.Sprint(n.Val)
	}
	return strings.Join(parts, ",")
}

func row(r []int) string {
	parts := make([]string, len(r))
	for i, v := range r {
		parts[i] = fmt.Sprint(v)
	}
	return strings.Join(parts, ",")
}

func check(adj [][]int, original, cp *Node) string {
	if len(adj) == 0 {
		if cp == nil {
			return ""
		}
		return "đồ thị rỗng nhưng không trả nil"
	}
	if cp == nil {
		return "trả nil"
	}
	old := map[*Node]bool{}
	for _, n := range collect(original) {
		old[n] = true
	}
	nodes := collect(cp)
	byVal := map[int]*Node{}
	for _, n := range nodes {
		if old[n] {
			return "dùng chung nút với bản gốc"
		}
		if _, dup := byVal[n.Val]; dup {
			cnt := 0
			for _, x := range nodes {
				if x.Val == n.Val {
					cnt++
				}
			}
			return fmt.Sprintf("nút %d bị sao %d lần", n.Val, cnt)
		}
		byVal[n.Val] = n
	}
	if len(nodes) != len(adj) {
		return fmt.Sprintf("có %d nút, cần %d", len(nodes), len(adj))
	}
	for i, r := range adj {
		if got := vals(byVal[i+1].Neighbors); got != row(r) {
			return fmt.Sprintf("hàng xóm của %d là [%s], cần [%s]", i+1, got, row(r))
		}
	}
	origByVal := map[int]*Node{}
	for _, n := range collect(original) {
		origByVal[n.Val] = n
	}
	for i, r := range adj {
		if vals(origByVal[i+1].Neighbors) != row(r) {
			return "làm hỏng đồ thị gốc"
		}
	}
	return ""
}

func mulberry32(seed uint32) func() float64 {
	a := seed
	return func() float64 {
		a += 0x6d2b79f5
		t := a
		t = (t ^ (t >> 15)) * (t | 1)
		t ^= t + (t^(t>>7))*(t|61)
		return float64(t^(t>>14)) / 4294967296
	}
}

func randomGraph(n, extra int, rnd func() float64) [][]int {
	adj := make([][]int, n)
	for i := range adj {
		adj[i] = []int{}
	}
	has := map[[2]int]bool{}
	add := func(a, b int) {
		if a == b || has[[2]int{a, b}] {
			return
		}
		has[[2]int{a, b}] = true
		has[[2]int{b, a}] = true
		adj[a] = append(adj[a], b+1)
		adj[b] = append(adj[b], a+1)
	}
	for i := 1; i < n; i++ {
		add(i, int(rnd()*float64(i)))
	}
	for k := 0; k < extra; k++ {
		a := int(rnd() * float64(n))
		b := int(rnd() * float64(n))
		add(a, b)
	}
	return adj
}

func chain(n int) [][]int {
	adj := make([][]int, n)
	for i := 0; i < n; i++ {
		adj[i] = []int{}
		if i > 0 {
			adj[i] = append(adj[i], i)
		}
		if i < n-1 {
			adj[i] = append(adj[i], i+2)
		}
	}
	return adj
}

func complete(n int) [][]int {
	adj := make([][]int, n)
	for i := 0; i < n; i++ {
		adj[i] = []int{}
		for j := 0; j < n; j++ {
			if j != i {
				adj[i] = append(adj[i], j+1)
			}
		}
	}
	return adj
}

type namedCase struct {
	label string
	adj   [][]int
}

type namedFn struct {
	name string
	fn   func(*Node) *Node
}

// Chạy fn, đổi panic tooDeep thành thông báo thay vì làm chết chương trình.
func run(fn func(*Node) *Node, g *Node) (res *Node, err string) {
	defer func() {
		if r := recover(); r != nil {
			if _, ok := r.(tooDeep); ok {
				err = fmt.Sprintf("đệ quy quá %d tầng (đi vòng mãi)", depthGuard)
				return
			}
			panic(r)
		}
	}()
	return fn(g), ""
}

func main() {
	cases := []namedCase{
		{"đồ thị rỗng", [][]int{}},
		{"một nút, không cạnh", [][]int{{}}},
		{"hai nút nối nhau", [][]int{{2}, {1}}},
		{"tam giác 1-2-3", [][]int{{2, 3}, {1, 3}, {1, 2}}},
		{"vuông 1-2-3-4 có đường chéo 1-3", [][]int{{2, 3, 4}, {1, 3}, {1, 2, 4}, {1, 3}}},
		{"ngôi sao: 1 nối 2..6", [][]int{{2, 3, 4, 5, 6}, {1}, {1}, {1}, {1}, {1}}},
		{"đường thẳng 5 nút", chain(5)},
		{"đồ thị đầy đủ 6 nút", complete(6)},
		{"đường thẳng 100 nút", chain(100)},
		{"ngẫu nhiên 100 nút, seed 42", randomGraph(100, 200, mulberry32(42))},
	}
	fns := []namedFn{
		{"cloneDfs", cloneDfs},
		{"cloneBfs", cloneBfs},
		{"cloneDfsIterative", cloneDfsIterative},
		{"wrongShallow", wrongShallow},
		{"wrongNoMap", wrongNoMap},
		{"wrongMapAfterRecurse", wrongMapAfterRecurse},
		{"wrongSetOnly", wrongSetOnly},
	}
	allOk := true
	for _, f := range fns {
		ok := 0
		var fails []string
		for _, c := range cases {
			g := build(c.adj)
			res, err := run(f.fn, g)
			if err == "" {
				err = check(c.adj, g, res)
			}
			if err == "" {
				ok++
			} else {
				fails = append(fails, c.label+" → "+err)
			}
		}
		if !strings.HasPrefix(f.name, "wrong") && ok != len(cases) {
			allOk = false
		}
		line := fmt.Sprintf("%-21s%d/%d ca đúng", f.name, ok, len(cases))
		if len(fails) > 0 {
			shown := strings.Join(fails[:min(2, len(fails))], ", ")
			if len(fails) > 2 {
				shown += fmt.Sprintf(" và %d ca khác", len(fails)-2)
			}
			line += "; sai ở " + shown
		}
		fmt.Println(line)
	}

	rnd := mulberry32(7)
	agree := 0
	for t := 0; t < 500; t++ {
		n := 1 + int(rnd()*100)
		adj := randomGraph(n, int(rnd()*3*float64(n)), rnd)
		g := build(adj)
		if check(adj, g, cloneDfs(g)) == "" && check(adj, g, cloneBfs(g)) == "" && check(adj, g, cloneDfsIterative(g)) == "" {
			agree++
		}
	}
	fmt.Printf("500 đồ thị ngẫu nhiên: cả ba cách đúng qua %d/500\n", agree)

	adj := chain(100_000)
	g := build(adj)
	for _, f := range fns[:3] {
		t0 := time.Now()
		res := f.fn(g)
		ms := float64(time.Since(t0).Microseconds()) / 1000
		status := "đúng"
		if check(adj, g, res) != "" {
			status = "sai"
		}
		fmt.Printf("đường thẳng 100 000 nút, %s: %s, %.1f ms\n", f.name, status, ms)
	}

	if allOk {
		fmt.Println("clone_graph: các cách đúng đều qua")
	} else {
		fmt.Println("clone_graph: CÓ CÁCH ĐÚNG BỊ SAI")
	}
}
