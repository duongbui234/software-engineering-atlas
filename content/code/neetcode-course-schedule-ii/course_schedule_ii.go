// LC 210 Course Schedule II: tìm một thứ tự học hợp lệ, hoặc [] nếu các môn chờ nhau thành vòng.
// Chạy: go run course_schedule_ii.go
package main

import (
	"fmt"
	"strings"
	"time"
)

var work = 0 // số bước cơ bản (nhìn qua một môn, xét một điều kiện), dùng cho phép đo

type solver func(n int, prereqs [][2]int) []int

// Cách 1: quét lặp. Mỗi lượt đi từ môn 0, lấy môn đầu tiên đã học đủ điều kiện. O(V·(V+E)).
func orderScan(n int, prereqs [][2]int) []int {
	need := make([][]int, n)
	for _, p := range prereqs {
		need[p[0]] = append(need[p[0]], p[1]) // muốn học a thì phải xong b
	}
	taken := make([]bool, n)
	order := make([]int, 0, n)
	for len(order) < n {
		found := -1
		for c := 0; c < n && found < 0; c++ {
			work++ // cả môn đã học cũng tốn một lần nhìn qua
			if taken[c] {
				continue
			}
			ready := true
			for _, b := range need[c] {
				work++
				if !taken[b] {
					ready = false
					break
				}
			}
			if ready {
				found = c
			}
		}
		if found < 0 {
			return []int{} // còn môn chưa học mà không môn nào đủ điều kiện: có vòng
		}
		taken[found] = true
		order = append(order, found)
	}
	return order
}

// Cách 2: Kahn. Đếm bậc vào, môn nào về 0 thì xếp hàng. Chính hàng đợi là thứ tự. O(V+E).
func orderKahn(n int, prereqs [][2]int) []int {
	next := make([][]int, n)
	indegree := make([]int, n)
	for _, p := range prereqs {
		next[p[1]] = append(next[p[1]], p[0]) // cạnh b → a: học b xong mới mở khóa a
		indegree[p[0]]++
	}
	queue := make([]int, 0, n)
	for c := 0; c < n; c++ {
		if indegree[c] == 0 {
			queue = append(queue, c)
		}
	}
	for head := 0; head < len(queue); head++ {
		c := queue[head]
		work++
		for _, d := range next[c] {
			work++
			indegree[d]--
			if indegree[d] == 0 {
				queue = append(queue, d)
			}
		}
	}
	if len(queue) < n {
		return []int{} // thiếu môn nghĩa là có vòng
	}
	return queue
}

const (
	white = iota // chưa tới
	gray         // đang trên đường đi
	black        // đã xong
)

// Cách 3: DFS ba màu. Môn xong hết đường phía sau thì ghi vào post; đảo post là thứ tự. O(V+E).
func orderDfs(n int, prereqs [][2]int) []int {
	next := make([][]int, n)
	for _, p := range prereqs {
		next[p[1]] = append(next[p[1]], p[0])
	}
	color := make([]int, n)
	post := make([]int, 0, n)
	var visit func(c int) bool
	visit = func(c int) bool {
		color[c] = gray
		work++
		for _, d := range next[c] {
			work++
			if color[d] == gray {
				return false // quay lại một môn đang xám: vòng
			}
			if color[d] == white && !visit(d) {
				return false
			}
		}
		color[c] = black
		post = append(post, c)
		return true
	}
	for c := 0; c < n; c++ {
		if color[c] == white && !visit(c) {
			return []int{}
		}
	}
	for i, j := 0, len(post)-1; i < j; i, j = i+1, j-1 {
		post[i], post[j] = post[j], post[i]
	}
	return post
}

// Bản sai 1: lật chiều cạnh (a → b). Thứ tự ra ngược hẳn.
func wrongEdgeDirection(n int, prereqs [][2]int) []int {
	flipped := make([][2]int, len(prereqs))
	for i, p := range prereqs {
		flipped[i] = [2]int{p[1], p[0]}
	}
	return orderKahn(n, flipped)
}

// Bản sai 2: DFS chỉ có một tập "đã thăm". Gặp lại môn đã xong cũng tưởng là vòng.
func wrongOneSetDfs(n int, prereqs [][2]int) []int {
	next := make([][]int, n)
	for _, p := range prereqs {
		next[p[1]] = append(next[p[1]], p[0])
	}
	seen := make([]bool, n)
	post := []int{}
	var visit func(c int) bool
	visit = func(c int) bool {
		seen[c] = true
		for _, d := range next[c] {
			if seen[d] || !visit(d) {
				return false
			}
		}
		post = append(post, c)
		return true
	}
	for c := 0; c < n; c++ {
		if !seen[c] && !visit(c) {
			return []int{}
		}
	}
	for i, j := 0, len(post)-1; i < j; i, j = i+1, j-1 {
		post[i], post[j] = post[j], post[i]
	}
	return post
}

// Bản sai 3: Kahn nhưng quên kiểm số môn đã xếp. Có vòng vẫn trả một thứ tự thiếu.
func wrongNoCycleCheck(n int, prereqs [][2]int) []int {
	next := make([][]int, n)
	indegree := make([]int, n)
	for _, p := range prereqs {
		next[p[1]] = append(next[p[1]], p[0])
		indegree[p[0]]++
	}
	queue := []int{}
	for c := 0; c < n; c++ {
		if indegree[c] == 0 {
			queue = append(queue, c)
		}
	}
	for head := 0; head < len(queue); head++ {
		for _, d := range next[queue[head]] {
			indegree[d]--
			if indegree[d] == 0 {
				queue = append(queue, d)
			}
		}
	}
	return queue
}

// Bộ chấm: không so với một đáp án cố định, mà kiểm mọi điều kiện đều đi xuôi.
func isValid(n int, prereqs [][2]int, order []int, possible bool) bool {
	if !possible {
		return len(order) == 0
	}
	if len(order) != n {
		return false
	}
	pos := make([]int, n)
	for i := range pos {
		pos[i] = -1
	}
	for i, c := range order {
		if c < 0 || c >= n || pos[c] != -1 {
			return false
		}
		pos[c] = i
	}
	for _, p := range prereqs {
		if pos[p[1]] >= pos[p[0]] {
			return false
		}
	}
	return true
}

type testCase struct {
	label    string
	n        int
	prereqs  [][2]int
	possible bool
}

// Gọi f với mọi hoán vị của 0..n-1; f trả true thì dừng sớm.
func eachPermutation(n int, f func([]int) bool) {
	perm := make([]int, n)
	used := make([]bool, n)
	var place func(i int) bool
	place = func(i int) bool {
		if i == n {
			return f(perm)
		}
		for c := 0; c < n; c++ {
			if !used[c] {
				used[c] = true
				perm[i] = c
				if place(i + 1) {
					return true
				}
				used[c] = false
			}
		}
		return false
	}
	place(0)
}

// Số ngẫu nhiên MINSTD: năm ngôn ngữ sinh cùng một dãy.
var seed int64 = 42

func rand(k int) int {
	seed = seed * 48271 % 2147483647
	return int(seed % int64(k))
}

func join(order []int) string {
	parts := make([]string, len(order))
	for i, c := range order {
		parts[i] = fmt.Sprint(c)
	}
	return strings.Join(parts, ",")
}

func main() {
	cases := []testCase{
		{"ví dụ sáu môn", 6, [][2]int{{4, 3}, {4, 0}, {1, 4}, {5, 4}, {2, 1}, {2, 5}}, true},
		{"không có điều kiện", 3, [][2]int{}, true},
		{"một môn", 1, [][2]int{}, true},
		{"hai môn", 2, [][2]int{{0, 1}}, true},
		{"vòng hai môn", 2, [][2]int{{0, 1}, {1, 0}}, false},
		{"vòng ba môn", 3, [][2]int{{0, 1}, {1, 2}, {2, 0}}, false},
		{"hình kim cương", 4, [][2]int{{0, 2}, {1, 2}, {3, 0}, {3, 1}}, true},
		{"vòng ở một góc", 5, [][2]int{{1, 0}, {2, 1}, {1, 2}, {3, 0}, {4, 3}}, false},
	}
	solvers := []struct {
		name  string
		solve solver
	}{
		{"orderScan", orderScan},
		{"orderKahn", orderKahn},
		{"orderDfs", orderDfs},
		{"wrongEdgeDirection", wrongEdgeDirection},
		{"wrongOneSetDfs", wrongOneSetDfs},
		{"wrongNoCycleCheck", wrongNoCycleCheck},
	}
	for _, s := range solvers {
		wrong := []string{}
		for _, tc := range cases {
			if !isValid(tc.n, tc.prereqs, s.solve(tc.n, tc.prereqs), tc.possible) {
				wrong = append(wrong, tc.label)
			}
		}
		tail := ""
		if len(wrong) > 0 {
			tail = "; sai ở " + strings.Join(wrong, ", ")
		}
		fmt.Printf("%-20s %d/%d ca đúng%s\n", s.name, len(cases)-len(wrong), len(cases), tail)
	}

	// Thứ tự không duy nhất: đếm mọi hoán vị hợp lệ của ví dụ sáu môn.
	ex := cases[0]
	fromKahn := orderKahn(ex.n, ex.prereqs)
	fromDfs := orderDfs(ex.n, ex.prereqs)
	allValid := 0
	eachPermutation(ex.n, func(o []int) bool {
		if isValid(ex.n, ex.prereqs, o, true) {
			allValid++
		}
		return false
	})
	both := isValid(ex.n, ex.prereqs, fromKahn, true) && isValid(ex.n, ex.prereqs, fromDfs, true)
	fmt.Printf("ví dụ sáu môn: Kahn → [%s], DFS → [%s]; cả hai hợp lệ: %v; có %d/720 thứ tự hợp lệ\n", join(fromKahn), join(fromDfs), both, allValid)
	verdict := "sai"
	if join(fromDfs) == join(fromKahn) {
		verdict = "đúng"
	}
	fmt.Printf("chấm bằng cách so với đáp án cố định [%s]: DFS bị chấm %s\n", join(fromKahn), verdict)

	// Đối chiếu với vét cạn: n ≤ 6, thử mọi hoán vị để biết có thứ tự hợp lệ hay không.
	agree, cyclic, trials := 0, 0, 1000
	for t := 0; t < trials; t++ {
		n := 1 + rand(6)
		m := rand(n*(n-1) + 1)
		keys := map[int]bool{}
		p := [][2]int{}
		for i := 0; i < m; i++ {
			a := rand(n)
			b := rand(n)
			if a != b && !keys[a*n+b] {
				keys[a*n+b] = true
				p = append(p, [2]int{a, b})
			}
		}
		possible := false
		eachPermutation(n, func(o []int) bool {
			possible = isValid(n, p, o, true)
			return possible
		})
		if !possible {
			cyclic++
		}
		ok := true
		for _, solve := range []solver{orderScan, orderKahn, orderDfs} {
			if !isValid(n, p, solve(n, p), possible) {
				ok = false
			}
		}
		if ok {
			agree++
		}
	}
	fmt.Printf("ngẫu nhiên: %d/%d đồ thị, ba cách đều hợp lệ (%d đồ thị có vòng)\n", agree, trials, cyclic)

	// Đo trên 2 000 môn.
	const N = 2000
	forward := [][2]int{}  // môn i+1 cần môn i
	backward := [][2]int{} // môn i cần môn i+1
	for i := 0; i+1 < N; i++ {
		forward = append(forward, [2]int{i + 1, i})
		backward = append(backward, [2]int{i, i + 1})
	}
	rank := make([]int, N)
	for i := range rank {
		rank[i] = i
	}
	for i := N - 1; i > 0; i-- {
		j := rand(i + 1)
		rank[i], rank[j] = rank[j], rank[i]
	}
	randomDag := [][2]int{}
	dagKeys := map[int]bool{}
	for len(randomDag) < 20000 {
		u := rand(N)
		v := rand(N)
		if u == v {
			continue
		}
		a, b := v, u
		if rank[u] > rank[v] { // môn hạng cao cần môn hạng thấp
			a, b = u, v
		}
		if dagKeys[a*N+b] {
			continue
		}
		dagKeys[a*N+b] = true
		randomDag = append(randomDag, [2]int{a, b})
	}
	graphs := []struct {
		label   string
		prereqs [][2]int
	}{
		{"chuỗi xuôi (i+1 cần i)", forward},
		{"chuỗi ngược (i cần i+1)", backward},
		{"DAG ngẫu nhiên, 20000 điều kiện", randomDag},
	}
	for _, g := range graphs {
		fmt.Printf("%s, %d môn:\n", g.label, N)
		for _, s := range solvers[:3] {
			work = 0
			t0 := time.Now()
			order := s.solve(N, g.prereqs)
			ms := float64(time.Since(t0).Microseconds()) / 1000
			fmt.Printf("  %-10s hợp lệ: %v, %d bước, %.2f ms\n", s.name, isValid(N, g.prereqs, order, true), work, ms)
		}
	}
}
