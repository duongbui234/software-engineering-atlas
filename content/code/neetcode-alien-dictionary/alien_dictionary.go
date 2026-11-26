// LC 269 Alien Dictionary: rút thứ tự chữ cái từ một danh sách từ đã xếp sẵn.
// Chạy: go run alien_dictionary.go
package main

import (
	"fmt"
	"sort"
	"strings"
	"time"
)

type graph struct {
	present [26]bool
	adj     [26][26]bool
	indeg   [26]int
}

// Bước chung: so từng cặp từ KỀ NHAU, lấy chữ khác ĐẦU TIÊN làm một cạnh u → v.
// Trả nil khi danh sách tự mâu thuẫn: một từ đứng trước phần đầu của chính nó.
func buildGraph(words []string) *graph {
	g := &graph{}
	for _, w := range words {
		for i := 0; i < len(w); i++ {
			g.present[w[i]-'a'] = true // chữ nào có mặt cũng phải ra
		}
	}
	for i := 0; i+1 < len(words); i++ {
		a, b := words[i], words[i+1]
		n := min(len(a), len(b))
		j := 0
		for j < n && a[j] == b[j] {
			j++
		}
		if j == n {
			if len(a) > len(b) {
				return nil // "abc" đứng trước "ab": danh bạ sai
			}
			continue // "ab" trước "abc": hợp lệ, không có manh mối
		}
		u, v := a[j]-'a', b[j]-'a'
		if !g.adj[u][v] {
			g.adj[u][v] = true
			g.indeg[v]++ // cạnh trùng chỉ đếm một lần
		}
	}
	return g
}

func countPresent(p [26]bool) int {
	n := 0
	for _, x := range p {
		if x {
			n++
		}
	}
	return n
}

// Kahn trên một đồ thị đã dựng: chữ nào không còn chữ nào phải đứng trước (bậc vào 0) thì viết ra.
func kahnOrder(g *graph) string {
	indeg := g.indeg // mảng trong Go được chép khi gán, g.indeg giữ nguyên
	queue := []int{}
	for c := 0; c < 26; c++ {
		if g.present[c] && indeg[c] == 0 {
			queue = append(queue, c)
		}
	}
	out := make([]byte, 0, 26)
	for head := 0; head < len(queue); head++ {
		u := queue[head]
		out = append(out, byte('a'+u))
		for v := 0; v < 26; v++ {
			if g.adj[u][v] {
				indeg[v]--
				if indeg[v] == 0 {
					queue = append(queue, v)
				}
			}
		}
	}
	if len(out) != countPresent(g.present) {
		return "" // thiếu chữ nghĩa là có vòng
	}
	return string(out)
}

// Cách 2: dựng đồ thị rồi chạy Kahn.
func alienOrderKahn(words []string) string {
	g := buildGraph(words)
	if g == nil {
		return ""
	}
	return kahnOrder(g)
}

// Bản sai: mỗi bản sửa đúng một chỗ của buildGraph rồi vẫn chạy kahnOrder.
func buildGraphBuggy(words []string, bug string) *graph {
	g := &graph{}
	for _, w := range words {
		for i := 0; i < len(w); i++ {
			g.present[w[i]-'a'] = true
		}
	}
	for i := 0; i+1 < len(words); i++ {
		a, b := words[i], words[i+1]
		n := min(len(a), len(b))
		j := 0
		for j < n && a[j] == b[j] {
			j++
		}
		if j == n {
			if len(a) > len(b) && bug != "noPrefix" { // noPrefix: quên kiểm tra
				return nil
			}
			continue
		}
		for ; j < n; j++ {
			if a[j] == b[j] {
				continue
			}
			u, v := a[j]-'a', b[j]-'a'
			if bug == "dupIndeg" {
				g.indeg[v]++ // dupIndeg: đếm cả cạnh trùng
			}
			if !g.adj[u][v] {
				g.adj[u][v] = true
				if bug != "dupIndeg" {
					g.indeg[v]++
				}
			}
			if bug != "allDiffs" {
				break // allDiffs: lấy MỌI chữ khác làm manh mối
			}
		}
	}
	if bug == "edgeLettersOnly" {
		// edgeLettersOnly: chỉ tính những chữ có mặt trong một cạnh nào đó
		for c := 0; c < 26; c++ {
			g.present[c] = false
			for x := 0; x < 26; x++ {
				if g.adj[c][x] || g.adj[x][c] {
					g.present[c] = true
				}
			}
		}
	}
	return g
}

func wrongOrder(words []string, bug string) string {
	g := buildGraphBuggy(words, bug)
	if g == nil {
		return ""
	}
	return kahnOrder(g)
}

// Cách 3: DFS ba màu. Trắng = chưa thăm, xám = đang trên đường đi, đen = xong.
const (
	white = iota
	gray
	black
)

func alienOrderDfs(words []string) string {
	g := buildGraph(words)
	if g == nil {
		return ""
	}
	var color [26]int
	post := []int{}
	var visit func(u int) bool
	visit = func(u int) bool {
		color[u] = gray
		for v := 0; v < 26; v++ {
			if !g.adj[u][v] {
				continue
			}
			if color[v] == gray {
				return false // quay về một chữ đang trên đường: có vòng
			}
			if color[v] == white && !visit(v) {
				return false
			}
		}
		color[u] = black
		post = append(post, u) // u xong sau mọi chữ phải đứng sau nó
		return true
	}
	for u := 0; u < 26; u++ {
		if g.present[u] && color[u] == white && !visit(u) {
			return ""
		}
	}
	buf := make([]byte, len(post))
	for i, u := range post {
		buf[len(post)-1-i] = byte('a' + u)
	}
	return string(buf)
}

// Biến thể LintCode 892: nhiều đáp án thì trả chuỗi nhỏ nhất theo a..z.
// Mỗi lượt lấy chữ NHỎ NHẤT đang sẵn sàng. Chỉ có 26 chữ nên quét 26 ô thay cho một min-heap.
func alienOrderSmallest(words []string) string {
	g := buildGraph(words)
	if g == nil {
		return ""
	}
	indeg := g.indeg
	var done [26]bool
	total := countPresent(g.present)
	out := make([]byte, 0, total)
	for len(out) < total {
		pick := -1
		for c := 0; c < 26; c++ {
			if g.present[c] && !done[c] && indeg[c] == 0 {
				pick = c
				break
			}
		}
		if pick == -1 {
			return "" // còn chữ mà không chữ nào sẵn sàng: có vòng
		}
		done[pick] = true
		out = append(out, byte('a'+pick))
		for v := 0; v < 26; v++ {
			if g.adj[pick][v] {
				indeg[v]--
			}
		}
	}
	return string(out)
}

// Kiểm tra: danh sách có thật sự xếp đúng theo bảng chữ `rank` không?
func isSorted(words []string, rank *[26]int) bool {
	for i := 0; i+1 < len(words); i++ {
		a, b := words[i], words[i+1]
		n := min(len(a), len(b))
		j := 0
		for j < n && a[j] == b[j] {
			j++
		}
		if j == n {
			if len(a) > len(b) {
				return false
			}
			continue
		}
		if rank[a[j]-'a'] > rank[b[j]-'a'] {
			return false
		}
	}
	return true
}

func lettersOf(words []string) string {
	var seen [26]bool
	for _, w := range words {
		for i := 0; i < len(w); i++ {
			seen[w[i]-'a'] = true
		}
	}
	var s []byte
	for c := 0; c < 26; c++ {
		if seen[c] {
			s = append(s, byte('a'+c))
		}
	}
	return string(s)
}

// Cách 1: vét cạn. Thử mọi hoán vị theo thứ tự từ điển, dừng ở hoán vị đầu tiên hợp lệ.
var tried = 0

func alienOrderBrute(words []string) string {
	letters := lettersOf(words)
	var rank [26]int
	used := make([]bool, len(letters))
	perm := []byte{}
	var try func() bool
	try = func() bool {
		if len(perm) == len(letters) {
			tried++
			for i, ch := range perm {
				rank[ch-'a'] = i
			}
			return isSorted(words, &rank)
		}
		for i := 0; i < len(letters); i++ {
			if used[i] {
				continue
			}
			used[i] = true
			perm = append(perm, letters[i])
			if try() {
				return true
			}
			used[i] = false
			perm = perm[:len(perm)-1]
		}
		return false
	}
	if try() {
		return string(perm)
	}
	return ""
}

// Một đáp án đúng khi: danh sách hợp lệ thì chuỗi chứa đủ mỗi chữ một lần và xếp đúng danh sách;
// danh sách mâu thuẫn thì chuỗi rỗng. LeetCode nhận MỌI thứ tự hợp lệ, nên không so với một chuỗi cố định.
func isValidAnswer(words []string, answer string, expectValid bool) bool {
	if !expectValid {
		return answer == ""
	}
	b := []byte(answer)
	sort.Slice(b, func(i, j int) bool { return b[i] < b[j] })
	if string(b) != lettersOf(words) {
		return false
	}
	var rank [26]int
	for i := 0; i < len(answer); i++ {
		rank[answer[i]-'a'] = i
	}
	return isSorted(words, &rank)
}

func show(s string) string {
	if s == "" {
		return `""`
	}
	return s
}

var seed uint32 = 2026

func rnd(n int) int {
	seed ^= seed << 13
	seed ^= seed >> 17
	seed ^= seed << 5
	return int(seed % uint32(n))
}

func sortBy(words []string, rank *[26]int) {
	sort.SliceStable(words, func(x, y int) bool {
		a, b := words[x], words[y]
		n := min(len(a), len(b))
		for j := 0; j < n; j++ {
			if a[j] != b[j] {
				return rank[a[j]-'a'] < rank[b[j]-'a']
			}
		}
		return len(a) < len(b)
	})
}

type testCase struct {
	words       []string
	expectValid bool
}

func main() {
	cases := []testCase{
		{[]string{"bcae", "bcd", "cb", "cab", "ad"}, true}, // ví dụ trong bài
		{[]string{"zx"}, true},                             // một từ: không có manh mối nào, thứ tự nào cũng được
		{[]string{"abc", "ab"}, false},                     // từ dài đứng trước phần đầu của nó
		{[]string{"a", "b", "a"}, false},                   // a trước b và b trước a: vòng
		{[]string{"ab", "ab"}, true},                       // hai từ giống nhau
		{[]string{"ab", "abc"}, true},                      // phần đầu đứng trước: hợp lệ
		{[]string{"ac", "ab", "zc", "zb"}, true},           // cạnh c → b xuất hiện hai lần
		{[]string{"ab", "ba"}, true},                       // chỉ chữ khác ĐẦU TIÊN mới là manh mối
	}

	ok := 0
	for i, c := range cases {
		tried = 0
		kahn := alienOrderKahn(c.words)
		dfs := alienOrderDfs(c.words)
		small := alienOrderSmallest(c.words)
		brute := alienOrderBrute(c.words)
		good := small == brute
		for _, ans := range []string{kahn, dfs, small, brute} {
			if !isValidAnswer(c.words, ans, c.expectValid) {
				good = false
			}
		}
		verdict := "SAI"
		if good {
			ok++
			verdict = "đúng"
		}
		fmt.Printf("ca %d [%s]: Kahn %s, DFS %s, nhỏ nhất %s, vét cạn %s (%d hoán vị) %s\n",
			i+1, strings.Join(c.words, " "), show(kahn), show(dfs), show(small), show(brute), tried, verdict)
	}
	fmt.Printf("%d/%d ca đúng\n", ok, len(cases))

	// Bản sai: chạy bốn bản sai trên cùng 8 ca.
	for _, bug := range []string{"allDiffs", "noPrefix", "edgeLettersOnly", "dupIndeg"} {
		right := 0
		for _, c := range cases {
			if isValidAnswer(c.words, wrongOrder(c.words, bug), c.expectValid) {
				right++
			}
		}
		fmt.Printf("bản sai %s: đúng %d/%d ca\n", bug, right, len(cases))
	}

	// Đối chiếu ngẫu nhiên: 2 000 danh sách nhỏ, một nửa xếp theo một bảng chữ ngẫu nhiên.
	const runs = 2000
	agree, validCount := 0, 0
	for t := 0; t < runs; t++ {
		k := 2 + rnd(5)
		order := make([]int, k)
		for i := range order {
			order[i] = i
		}
		for i := k - 1; i > 0; i-- {
			j := rnd(i + 1)
			order[i], order[j] = order[j], order[i]
		}
		var rank [26]int
		for i, c := range order {
			rank[c] = i
		}
		n := 1 + rnd(6)
		words := make([]string, 0, n)
		for i := 0; i < n; i++ {
			length := 1 + rnd(4)
			w := make([]byte, length)
			for j := range w {
				w[j] = byte('a' + rnd(k))
			}
			words = append(words, string(w))
		}
		if rnd(2) == 0 {
			sortBy(words, &rank)
		}
		brute := alienOrderBrute(words)
		valid := brute != ""
		if valid {
			validCount++
		}
		answers := []string{alienOrderKahn(words), alienOrderDfs(words), alienOrderSmallest(words)}
		good := answers[2] == brute
		for _, ans := range answers {
			if !isValidAnswer(words, ans, valid) {
				good = false
			}
		}
		if good {
			agree++
		}
	}
	fmt.Printf("đối chiếu %d danh sách ngẫu nhiên (%d hợp lệ): khớp vét cạn %d/%d\n", runs, validCount, agree, runs)

	// Đo: k chữ, 100 từ xếp theo bảng chữ ngược (k-1)..a, tức hoán vị cuối cùng vét cạn gặp.
	for _, k := range []int{7, 8, 9} {
		var rank [26]int
		target := make([]byte, k)
		for i := 0; i < k; i++ {
			target[i] = byte('a' + k - 1 - i)
			rank[k-1-i] = i
		}
		words := make([]string, 0, 100)
		for i := 0; i < 100; i++ {
			length := 1 + rnd(10)
			w := make([]byte, length)
			for j := range w {
				w[j] = byte('a' + rnd(k))
			}
			words = append(words, string(w))
		}
		sortBy(words, &rank)
		tried = 0
		t0 := time.Now()
		brute := alienOrderBrute(words)
		bruteMs := float64(time.Since(t0).Microseconds()) / 1000
		t0 = time.Now()
		kahn := ""
		for r := 0; r < 1000; r++ {
			kahn = alienOrderKahn(words)
		}
		kahnUs := float64(time.Since(t0).Nanoseconds()) / 1e6 // tổng 1 000 lần (ms) = µs mỗi lần
		fmt.Printf("đo %d chữ, 100 từ: vét cạn ra %s sau %d hoán vị, %.1f ms; Kahn ra %s, %.1f µs\n",
			k, brute, tried, bruteMs, kahn, kahnUs)
	}
}
