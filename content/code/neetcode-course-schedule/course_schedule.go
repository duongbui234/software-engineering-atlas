// LC 207 Course Schedule: có học hết được mọi môn không? Cùng bộ ca với bản TypeScript.
// Chạy: go run course_schedule.go
package main

import (
	"fmt"
	"strings"
	"time"
)

var work = 0 // số lần nhìn một cạnh (một môn tiên quyết), dùng cho phép đo
var passes = 0

type solver func(n int, prerequisites [][]int) bool

// Cặp [a, b] nghĩa là "muốn học a phải học b trước": cạnh đi từ b sang a.
func buildGraph(n int, prerequisites [][]int) ([][]int, []int) {
	adj := make([][]int, n)
	indegree := make([]int, n)
	for _, p := range prerequisites {
		a, b := p[0], p[1]
		adj[b] = append(adj[b], a)
		indegree[a]++
	}
	return adj, indegree
}

// Cách 1: quét lặp. Mỗi lượt quét mọi môn, học môn nào đã đủ tiên quyết.
// Một lượt không học thêm được môn nào thì dừng. Xấu nhất O(V·(V + E)).
func canFinishScan(n int, prerequisites [][]int) bool {
	needs := make([][]int, n)
	for _, p := range prerequisites {
		needs[p[0]] = append(needs[p[0]], p[1])
	}
	done := make([]bool, n)
	count := 0
	passes = 0
	for progress := true; progress; {
		progress = false
		passes++
		for c := 0; c < n; c++ {
			if done[c] {
				continue
			}
			ready := true
			for _, b := range needs[c] {
				work++
				if !done[b] {
					ready = false
					break
				}
			}
			if ready {
				done[c] = true
				count++
				progress = true
			}
		}
	}
	return count == n
}

// Cách 2: Kahn. Môn có bậc vào 0 thì học được ngay; học xong thì trừ bậc vào
// của các môn đứng sau. Đếm số môn học được. O(V + E).
func canFinishKahn(n int, prerequisites [][]int) bool {
	adj, indegree := buildGraph(n, prerequisites)
	queue := []int{}
	for c := 0; c < n; c++ {
		if indegree[c] == 0 {
			queue = append(queue, c)
		}
	}
	taken := 0
	for head := 0; head < len(queue); head++ {
		u := queue[head]
		taken++
		for _, v := range adj[u] {
			work++
			indegree[v]--
			if indegree[v] == 0 {
				queue = append(queue, v)
			}
		}
	}
	return taken == n // thiếu môn nào là môn đó kẹt trong một vòng
}

const (
	white = 0
	gray  = 1
	black = 2
)

// Cách 3: DFS ba màu, đệ quy. Trắng = chưa đụng, xám = đang trên đường đi,
// đen = đã xong. Gặp lại một đỉnh xám là có vòng. O(V + E).
func canFinishDfs(n int, prerequisites [][]int) bool {
	adj, _ := buildGraph(n, prerequisites)
	color := make([]int, n)
	var visit func(u int) bool
	visit = func(u int) bool {
		color[u] = gray
		for _, v := range adj[u] {
			work++
			if color[v] == gray { // quay về đỉnh đang trên đường: vòng
				return false
			}
			if color[v] == white && !visit(v) {
				return false
			}
		}
		color[u] = black
		return true
	}
	for u := 0; u < n; u++ {
		if color[u] == white && !visit(u) {
			return false
		}
	}
	return true
}

// Cách 3b: cùng DFS ba màu nhưng tự giữ ngăn xếp, không đệ quy.
func canFinishDfsStack(n int, prerequisites [][]int) bool {
	adj, _ := buildGraph(n, prerequisites)
	color := make([]int, n)
	next := make([]int, n) // hàng xóm kế tiếp cần xem của mỗi đỉnh
	for s := 0; s < n; s++ {
		if color[s] != white {
			continue
		}
		stack := []int{s}
		color[s] = gray
		for len(stack) > 0 {
			u := stack[len(stack)-1]
			if next[u] < len(adj[u]) {
				v := adj[u][next[u]]
				next[u]++
				work++
				if color[v] == gray {
					return false
				}
				if color[v] == white {
					color[v] = gray
					stack = append(stack, v)
				}
			} else {
				color[u] = black
				stack = stack[:len(stack)-1]
			}
		}
	}
	return true
}

// Bản sai 1: DFS chỉ có một tập "đã thăm", gặp lại đỉnh đã thăm là kết luận có vòng.
func wrongOneVisitedSet(n int, prerequisites [][]int) bool {
	adj, _ := buildGraph(n, prerequisites)
	visited := make([]bool, n)
	var visit func(u int) bool
	visit = func(u int) bool {
		if visited[u] {
			return false
		}
		visited[u] = true
		for _, v := range adj[u] {
			if !visit(v) {
				return false
			}
		}
		return true
	}
	for u := 0; u < n; u++ {
		if !visited[u] && !visit(u) {
			return false
		}
	}
	return true
}

// Bản sai 2: chỉ hỏi "có môn nào học được ngay không?".
func wrongHasStart(n int, prerequisites [][]int) bool {
	_, indegree := buildGraph(n, prerequisites)
	for _, d := range indegree {
		if d == 0 {
			return true
		}
	}
	return false
}

type testCase struct {
	label string
	n     int
	pre   [][]int
	want  bool
}

var cases = []testCase{
	{"hai môn", 2, [][]int{{1, 0}}, true},
	{"hai môn chờ nhau", 2, [][]int{{1, 0}, {0, 1}}, false},
	{"kim cương", 4, [][]int{{1, 0}, {2, 0}, {3, 1}, {3, 2}}, true},
	{"ví dụ năm môn", 5, [][]int{{1, 0}, {2, 0}, {3, 1}, {3, 2}, {4, 3}}, true},
	{"học được một môn rồi kẹt", 4, [][]int{{1, 0}, {2, 1}, {3, 2}, {1, 3}}, false},
	{"môn tự cần chính nó", 2, [][]int{{1, 1}}, false},
	{"không có tiên quyết", 3, [][]int{}, true},
	{"hai mảnh, mảnh sau có vòng", 6, [][]int{{1, 0}, {3, 2}, {4, 3}, {2, 4}}, false},
}

func check(name string, solve solver) {
	ok := 0
	wrong := []string{}
	for _, c := range cases {
		got := solve(c.n, c.pre)
		if got == c.want {
			ok++
		} else {
			wrong = append(wrong, fmt.Sprintf("%s → %v", c.label, got))
		}
	}
	tail := ""
	if len(wrong) > 0 {
		tail = "; sai ở " + strings.Join(wrong, ", ")
	}
	fmt.Printf("%-20s %d/%d ca đúng%s\n", name, ok, len(cases), tail)
}

// Bộ sinh số giả ngẫu nhiên MINSTD: năm ngôn ngữ ra cùng một dãy, cùng đồ thị.
var seed int64 = 20261126

func rand(k int) int {
	seed = seed * 48271 % 2147483647
	return int(seed % int64(k))
}

func measure(name string, solve solver, n int, pre [][]int, extra func() string) {
	best := 1e18
	got := false
	w := 0
	for r := 0; r < 3; r++ {
		work = 0
		t0 := time.Now()
		got = solve(n, pre)
		ms := float64(time.Since(t0).Microseconds()) / 1000
		if ms < best {
			best = ms
		}
		w = work
	}
	fmt.Printf("  %-18s %v, %d lần nhìn cạnh%s, %.1f ms\n", name, got, w, extra(), best)
}

func none() string { return "" }

func main() {
	check("canFinishScan", canFinishScan)
	check("canFinishKahn", canFinishKahn)
	check("canFinishDfs", canFinishDfs)
	check("canFinishDfsStack", canFinishDfsStack)
	check("wrongOneVisitedSet", wrongOneVisitedSet)
	check("wrongHasStart", wrongHasStart)

	// Đối chiếu bốn cách đúng trên 2 000 đồ thị nhỏ ngẫu nhiên (có thể có vòng, có môn tự cần mình).
	agree, finishable := 0, 0
	for t := 0; t < 2000; t++ {
		n := 1 + rand(8)
		m := rand(n*2 + 1)
		seen := map[int]bool{}
		pre := [][]int{}
		for i := 0; i < m; i++ {
			a := rand(n)
			b := rand(n)
			if seen[a*n+b] {
				continue
			}
			seen[a*n+b] = true
			pre = append(pre, []int{a, b})
		}
		r := []bool{canFinishScan(n, pre), canFinishKahn(n, pre), canFinishDfs(n, pre), canFinishDfsStack(n, pre)}
		if r[0] == r[1] && r[1] == r[2] && r[2] == r[3] {
			agree++
		}
		if r[0] {
			finishable++
		}
	}
	fmt.Printf("ngẫu nhiên: %d/2000 đồ thị, bốn cách khớp nhau (%d học hết được, %d có vòng)\n", agree, finishable, 2000-finishable)

	scanExtra := func() string { return fmt.Sprintf(", %d lượt quét", passes) }

	// Chuỗi 2 000 môn, môn i cần môn i+1: mỗi lượt quét chỉ học thêm được đúng một môn.
	const N = 2000
	reversedChain := [][]int{}
	for i := 0; i+1 < N; i++ {
		reversedChain = append(reversedChain, []int{i, i + 1})
	}
	fmt.Printf("chuỗi %d môn, môn i cần môn i+1:\n", N)
	measure("canFinishScan", canFinishScan, N, reversedChain, scanExtra)
	measure("canFinishKahn", canFinishKahn, N, reversedChain, none)
	measure("canFinishDfs", canFinishDfs, N, reversedChain, none)
	measure("canFinishDfsStack", canFinishDfsStack, N, reversedChain, none)

	// 2 000 môn, 5 000 cặp không vòng: xếp môn theo một hoán vị ngẫu nhiên, chỉ cho môn sau cần môn trước.
	perm := make([]int, N)
	for i := range perm {
		perm[i] = i
	}
	for i := N - 1; i > 0; i-- {
		j := rand(i + 1)
		perm[i], perm[j] = perm[j], perm[i]
	}
	dagSeen := map[int]bool{}
	dag := [][]int{}
	for len(dag) < 5000 {
		x := rand(N)
		y := rand(N)
		if x == y {
			continue
		}
		lo, hi := min(x, y), max(x, y)
		if dagSeen[lo*N+hi] {
			continue
		}
		dagSeen[lo*N+hi] = true
		dag = append(dag, []int{perm[hi], perm[lo]})
	}
	fmt.Printf("ngẫu nhiên %d môn, 5000 cặp, không vòng:\n", N)
	measure("canFinishScan", canFinishScan, N, dag, scanExtra)
	measure("canFinishKahn", canFinishKahn, N, dag, none)
	measure("canFinishDfs", canFinishDfs, N, dag, none)
	measure("canFinishDfsStack", canFinishDfsStack, N, dag, none)

	// Đệ quy sâu: môn i+1 cần môn i, nên DFS từ môn 0 đi một mạch hết chuỗi.
	// Ngăn xếp của goroutine tự nới tới 1 GB, nên Go không tràn ở 100 000 tầng.
	fmt.Println("đệ quy sâu, chuỗi môn i+1 cần môn i:")
	for _, length := range []int{2000, 100000} {
		chain := [][]int{}
		for i := 0; i+1 < length; i++ {
			chain = append(chain, []int{i + 1, i})
		}
		fmt.Printf("  %d môn: canFinishDfs %v; canFinishDfsStack %v; canFinishKahn %v\n", length,
			canFinishDfs(length, chain), canFinishDfsStack(length, chain), canFinishKahn(length, chain))
	}
}
