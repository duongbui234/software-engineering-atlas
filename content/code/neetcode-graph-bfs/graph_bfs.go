// Ga GRPH-02: một khuôn BFS cho bốn bài đồ thị.
// Chạy: go run graph_bfs.go
package main

import (
	"fmt"
	"math/rand"
	"reflect"
	"slices"
)

// ---------- Khuôn chung: BFS từ một hoặc nhiều điểm xuất phát ----------
func bfs[T comparable](starts []T, neighbors func(T) []T) map[T]int {
	dist := map[T]int{}
	queue := []T{}
	for _, s := range starts {
		if _, ok := dist[s]; ok {
			continue
		}
		dist[s] = 0 // ghi sổ ngay khi xếp hàng
		queue = append(queue, s)
	}
	for head := 0; head < len(queue); head++ {
		x := queue[head]
		for _, y := range neighbors(x) {
			if _, ok := dist[y]; ok {
				continue
			}
			dist[y] = dist[x] + 1
			queue = append(queue, y)
		}
	}
	return dist
}

// ---------- 133. Clone Graph: sổ đã thăm kiêm bảng "cũ → mới" ----------
type Node struct {
	Val       int
	Neighbors []*Node
}

func cloneGraph(node *Node) *Node {
	if node == nil {
		return nil
	}
	copyOf := map[*Node]*Node{node: {Val: node.Val}}
	queue := []*Node{node}
	for head := 0; head < len(queue); head++ {
		old := queue[head]
		for _, nb := range old.Neighbors {
			if _, ok := copyOf[nb]; !ok { // lần đầu gặp: tạo bản sao rồi xếp hàng
				copyOf[nb] = &Node{Val: nb.Val}
				queue = append(queue, nb)
			}
			copyOf[old].Neighbors = append(copyOf[old].Neighbors, copyOf[nb]) // nối cạnh giữa hai bản sao
		}
	}
	return copyOf[node]
}

// ---------- 417. Pacific Atlantic: đi ngược từ biển lên dốc ----------
type cell struct{ r, c int }

var dirs = []cell{{-1, 0}, {1, 0}, {0, -1}, {0, 1}}

// near trả về các ô kề trong lưới thỏa ok(từ, tới).
func near(R, C int, ok func(a, b cell) bool) func(cell) []cell {
	return func(x cell) []cell {
		var out []cell
		for _, d := range dirs {
			y := cell{x.r + d.r, x.c + d.c}
			if y.r >= 0 && y.r < R && y.c >= 0 && y.c < C && ok(x, y) {
				out = append(out, y)
			}
		}
		return out
	}
}

func pacificAtlantic(h [][]int) [][]int {
	R, C := len(h), len(h[0])
	// Từ ô x, nước có thể chảy NGƯỢC lên ô y nếu y không thấp hơn x.
	uphill := near(R, C, func(a, b cell) bool { return h[b.r][b.c] >= h[a.r][a.c] })
	var pacific, atlantic []cell
	for r := 0; r < R; r++ {
		pacific = append(pacific, cell{r, 0})
		atlantic = append(atlantic, cell{r, C - 1})
	}
	for c := 0; c < C; c++ {
		pacific = append(pacific, cell{0, c})
		atlantic = append(atlantic, cell{R - 1, c})
	}
	P, A := bfs(pacific, uphill), bfs(atlantic, uphill)
	out := [][]int{}
	for r := 0; r < R; r++ {
		for c := 0; c < C; c++ {
			_, p := P[cell{r, c}]
			_, a := A[cell{r, c}]
			if p && a {
				out = append(out, []int{r, c})
			}
		}
	}
	return out
}

// Vét cạn để đối chiếu: từ mỗi ô, thả nước chảy xuống và xem nó chạm biển nào.
func pacificAtlanticBrute(h [][]int) [][]int {
	R, C := len(h), len(h[0])
	downhill := near(R, C, func(a, b cell) bool { return h[b.r][b.c] <= h[a.r][a.c] })
	out := [][]int{}
	for r := 0; r < R; r++ {
		for c := 0; c < C; c++ {
			pac, atl := false, false
			for x := range bfs([]cell{{r, c}}, downhill) {
				pac = pac || x.r == 0 || x.c == 0
				atl = atl || x.r == R-1 || x.c == C-1
			}
			if pac && atl {
				out = append(out, []int{r, c})
			}
		}
	}
	return out
}

// ---------- 130. Surrounded Regions: đi từ mép vào, ô nào chạm tới là an toàn ----------
func solve(board [][]byte) {
	R, C := len(board), len(board[0])
	open := near(R, C, func(_, b cell) bool { return board[b.r][b.c] == 'O' })
	var border []cell
	for r := 0; r < R; r++ {
		for c := 0; c < C; c++ {
			if (r == 0 || c == 0 || r == R-1 || c == C-1) && board[r][c] == 'O' {
				border = append(border, cell{r, c})
			}
		}
	}
	safe := bfs(border, open)
	for r := 0; r < R; r++ {
		for c := 0; c < C; c++ {
			if _, ok := safe[cell{r, c}]; board[r][c] == 'O' && !ok {
				board[r][c] = 'X'
			}
		}
	}
}

// Vét cạn: một ô O bị lật khi lượt tô từ chính nó không chạm mép.
func solveBrute(board [][]byte) [][]byte {
	R, C := len(board), len(board[0])
	open := near(R, C, func(_, b cell) bool { return board[b.r][b.c] == 'O' })
	out := make([][]byte, R)
	for r := range board {
		out[r] = slices.Clone(board[r])
		for c := range board[r] {
			if board[r][c] != 'O' {
				continue
			}
			edge := false
			for x := range bfs([]cell{{r, c}}, open) {
				edge = edge || x.r == 0 || x.c == 0 || x.r == R-1 || x.c == C-1
			}
			if !edge {
				out[r][c] = 'X'
			}
		}
	}
	return out
}

// ---------- 127. Word Ladder: đồ thị ẩn, hàng xóm sinh theo luật ----------
// Cách 1: so từng cặp. Mỗi lần lấy một từ ra, quét cả danh sách.
func ladderNaive(begin, end string, words []string) int {
	if !slices.Contains(words, end) {
		return 0
	}
	oneApart := func(a, b string) bool {
		diff := 0
		for i := range a {
			if a[i] != b[i] {
				diff++
			}
		}
		return diff == 1
	}
	dist := map[string]int{begin: 1}
	queue := []string{begin}
	for head := 0; head < len(queue); head++ {
		w := queue[head]
		for _, v := range words {
			if _, ok := dist[v]; ok || !oneApart(w, v) {
				continue
			}
			if v == end {
				return dist[w] + 1
			}
			dist[v] = dist[w] + 1
			queue = append(queue, v)
		}
	}
	return 0
}

// Cách 2: xô theo mẫu. "hot" nằm trong các xô "*ot", "h*t", "ho*".
func ladderBuckets(begin, end string, words []string) int {
	if !slices.Contains(words, end) {
		return 0
	}
	buckets := map[string][]string{}
	for _, w := range append([]string{begin}, words...) {
		for i := range w {
			p := w[:i] + "*" + w[i+1:]
			buckets[p] = append(buckets[p], w)
		}
	}
	dist := map[string]int{begin: 1}
	queue := []string{begin}
	for head := 0; head < len(queue); head++ {
		w := queue[head]
		for i := range w {
			for _, v := range buckets[w[:i]+"*"+w[i+1:]] {
				if _, ok := dist[v]; ok {
					continue
				}
				if v == end {
					return dist[w] + 1
				}
				dist[v] = dist[w] + 1
				queue = append(queue, v)
			}
		}
	}
	return 0
}

// Cách 3: BFS hai đầu. Mỗi vòng mở rộng phía có ít từ hơn, dừng khi hai phía chạm nhau.
func ladderBidirectional(begin, end string, words []string) int {
	dict := map[string]bool{}
	for _, w := range words {
		dict[w] = true
	}
	if !dict[end] {
		return 0
	}
	front, back := map[string]bool{begin: true}, map[string]bool{end: true}
	seen := map[string]bool{begin: true, end: true}
	length := 1
	for len(front) > 0 && len(back) > 0 {
		if len(front) > len(back) {
			front, back = back, front
		}
		next := map[string]bool{}
		length++
		for w := range front {
			b := []byte(w)
			for i := range b {
				orig := b[i]
				for ch := byte('a'); ch <= 'z'; ch++ {
					b[i] = ch
					v := string(b)
					if back[v] {
						return length
					}
					if !dict[v] || seen[v] {
						continue
					}
					seen[v] = true
					next[v] = true
				}
				b[i] = orig
			}
		}
		front = next
	}
	return 0
}

// ---------- Kiểm tra ----------
func buildGraph(adj [][]int) *Node {
	if len(adj) == 0 {
		return nil
	}
	nodes := make([]*Node, len(adj))
	for i := range adj {
		nodes[i] = &Node{Val: i + 1}
	}
	for i, list := range adj {
		for _, v := range list {
			nodes[i].Neighbors = append(nodes[i].Neighbors, nodes[v-1])
		}
	}
	return nodes[0]
}

func toAdj(node *Node) ([][]int, map[*Node]int) {
	if node == nil {
		return nil, nil
	}
	seen := bfs([]*Node{node}, func(n *Node) []*Node { return n.Neighbors })
	adj := make([][]int, len(seen))
	for n := range seen {
		adj[n.Val-1] = []int{}
		for _, x := range n.Neighbors {
			adj[n.Val-1] = append(adj[n.Val-1], x.Val)
		}
	}
	return adj, seen
}

func board(rows ...string) [][]byte {
	out := make([][]byte, len(rows))
	for i, r := range rows {
		out[i] = []byte(r)
	}
	return out
}

func flipped(b [][]byte) [][]byte {
	x := make([][]byte, len(b))
	for i := range b {
		x[i] = slices.Clone(b[i])
	}
	solve(x)
	return x
}

func main() {
	rng := rand.New(rand.NewSource(42))
	square := [][]int{{2, 4}, {1, 3}, {2, 4}, {1, 3}}
	original := buildGraph(square)
	copyG := cloneGraph(original)
	copyAdj, copyNodes := toAdj(copyG)
	_, origNodes := toAdj(original)
	shared := false
	for n := range copyNodes {
		if _, ok := origNodes[n]; ok {
			shared = true
		}
	}
	single, _ := toAdj(cloneGraph(buildGraph([][]int{{}})))

	gridsAgree, boardsAgree, laddersAgree := true, true, true
	for t := 0; t < 200; t++ {
		R, C := 1+rng.Intn(5), 1+rng.Intn(5)
		g := make([][]int, R)
		for r := range g {
			g[r] = make([]int, C)
			for c := range g[r] {
				g[r][c] = rng.Intn(4)
			}
		}
		gridsAgree = gridsAgree && reflect.DeepEqual(pacificAtlantic(g), pacificAtlanticBrute(g))
	}
	for t := 0; t < 200; t++ {
		R, C := 1+rng.Intn(6), 1+rng.Intn(6)
		b := make([][]byte, R)
		for r := range b {
			b[r] = make([]byte, C)
			for c := range b[r] {
				b[r][c] = 'X'
				if rng.Float64() < 0.55 {
					b[r][c] = 'O'
				}
			}
		}
		boardsAgree = boardsAgree && reflect.DeepEqual(flipped(b), solveBrute(b))
	}
	randomWords := make([]string, 300)
	for i := range randomWords {
		w := make([]byte, 3)
		for j := range w {
			w[j] = "abcd"[rng.Intn(4)]
		}
		randomWords[i] = string(w)
	}
	for t := 0; t < 200; t++ {
		a, b := randomWords[rng.Intn(300)], randomWords[rng.Intn(300)]
		if a == b {
			continue
		}
		x, y, z := ladderNaive(a, b, randomWords), ladderBuckets(a, b, randomWords), ladderBidirectional(a, b, randomWords)
		laddersAgree = laddersAgree && x == y && y == z
	}
	words := []string{"cord", "card", "ward", "warm", "word", "worm", "wore", "core", "cold"}
	noWarm := slices.DeleteFunc(slices.Clone(words), func(w string) bool { return w == "warm" })

	cases := []struct {
		name string
		pass bool
	}{
		{"133 bản sao giữ đúng cạnh", reflect.DeepEqual(copyAdj, square)},
		{"133 bản sao không dùng chung nút nào", !shared},
		{"133 đồ thị rỗng", cloneGraph(nil) == nil},
		{"133 một nút không cạnh", reflect.DeepEqual(single, [][]int{{}})},
		{"417 lưới xoắn ốc", reflect.DeepEqual(pacificAtlantic([][]int{{1, 2, 3}, {8, 9, 4}, {7, 6, 5}}),
			[][]int{{0, 2}, {1, 0}, {1, 1}, {1, 2}, {2, 0}, {2, 1}, {2, 2}})},
		{"417 một ô", reflect.DeepEqual(pacificAtlantic([][]int{{5}}), [][]int{{0, 0}})},
		{"417 khớp vét cạn trên 200 lưới ngẫu nhiên", gridsAgree},
		{"130 vùng kín bị lật, ô ở mép giữ nguyên", reflect.DeepEqual(flipped(board("XXXX", "XOOX", "XXOX", "XOXX")),
			board("XXXX", "XXXX", "XXXX", "XOXX"))},
		{"130 vùng nối ra mép thì an toàn", reflect.DeepEqual(flipped(board("XOX", "XOX", "XXX")), board("XOX", "XOX", "XXX"))},
		{"130 khớp vét cạn trên 200 bảng ngẫu nhiên", boardsAgree},
		{"127 cold → warm cần 5 từ", ladderBuckets("cold", "warm", words) == 5},
		{"127 đích không có trong danh sách", ladderBuckets("cold", "warm", noWarm) == 0},
		{"127 đích cách một chữ", ladderBidirectional("cold", "cord", words) == 2},
		{"127 ba cách khớp nhau trên 200 cặp ngẫu nhiên", laddersAgree},
	}
	ok := 0
	for _, c := range cases {
		if c.pass {
			ok++
		} else {
			fmt.Println("SAI:", c.name)
		}
	}
	fmt.Printf("graph_bfs %d/%d ca đúng\n", ok, len(cases))
}
