package main

import (
	"fmt"
	"strings"
)

type op struct{ kind, from, to string }

// Vét cạn: solve(i, j) = số bước ít nhất để biến a[i:] thành b[j:]
func editDistanceBrute(a, b string, calls *int) int {
	var solve func(i, j int) int
	solve = func(i, j int) int {
		*calls++
		if i == len(a) {
			return len(b) - j // chèn hết phần còn lại của b
		}
		if j == len(b) {
			return len(a) - i // xóa hết phần còn lại của a
		}
		if a[i] == b[j] {
			return solve(i+1, j+1)
		}
		return 1 + min(solve(i, j+1), solve(i+1, j), solve(i+1, j+1))
	}
	return solve(0, 0)
}

// Ghi nhớ: cùng công thức, mỗi cặp (i, j) chỉ tính một lần
func editDistanceMemo(a, b string, calls *int) int {
	width := len(b) + 1
	memo := make([]int, (len(a)+1)*width)
	for k := range memo {
		memo[k] = -1
	}
	var solve func(i, j int) int
	solve = func(i, j int) int {
		*calls++
		if i == len(a) {
			return len(b) - j
		}
		if j == len(b) {
			return len(a) - i
		}
		key := i*width + j
		if memo[key] != -1 {
			return memo[key]
		}
		var result int
		if a[i] == b[j] {
			result = solve(i+1, j+1)
		} else {
			result = 1 + min(solve(i, j+1), solve(i+1, j), solve(i+1, j+1))
		}
		memo[key] = result
		return result
	}
	return solve(0, 0)
}

// Bảng đầy đủ: dp[i][j] = khoảng cách giữa tiền tố a[:i] và b[:j]
func editDistanceTable(a, b string) [][]int {
	dp := make([][]int, len(a)+1)
	for i := range dp {
		dp[i] = make([]int, len(b)+1)
		dp[i][0] = i
	}
	for j := 0; j <= len(b); j++ {
		dp[0][j] = j
	}
	for i := 1; i <= len(a); i++ {
		for j := 1; j <= len(b); j++ {
			if a[i-1] == b[j-1] {
				dp[i][j] = dp[i-1][j-1]
			} else {
				dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
			}
		}
	}
	return dp
}

// Một hàng và một biến chéo: bản nộp LeetCode
func minDistance(a, b string) int {
	if len(b) > len(a) {
		a, b = b, a // hàng dài theo chuỗi ngắn hơn
	}
	row := make([]int, len(b)+1)
	for j := range row {
		row[j] = j
	}
	for i := 1; i <= len(a); i++ {
		diagonal := row[0] // dp[i-1][j-1]
		row[0] = i
		for j := 1; j <= len(b); j++ {
			above := row[j] // dp[i-1][j], sắp bị ghi đè
			if a[i-1] == b[j-1] {
				row[j] = diagonal
			} else {
				row[j] = 1 + min(above, row[j-1], diagonal)
			}
			diagonal = above
		}
	}
	return row[len(b)]
}

// Lần ngược bảng đầy đủ để in kịch bản sửa
func editScript(a, b string) []op {
	dp := editDistanceTable(a, b)
	var ops []op
	i, j := len(a), len(b)
	for i > 0 || j > 0 {
		if i > 0 && j > 0 && a[i-1] == b[j-1] && dp[i][j] == dp[i-1][j-1] {
			ops = append(ops, op{"giữ", a[i-1 : i], b[j-1 : j]})
			i, j = i-1, j-1
		} else if i > 0 && j > 0 && dp[i][j] == dp[i-1][j-1]+1 {
			ops = append(ops, op{"thay", a[i-1 : i], b[j-1 : j]})
			i, j = i-1, j-1
		} else if i > 0 && dp[i][j] == dp[i-1][j]+1 {
			ops = append(ops, op{"xóa", a[i-1 : i], ""})
			i--
		} else {
			ops = append(ops, op{"chèn", "", b[j-1 : j]})
			j--
		}
	}
	for l, r := 0, len(ops)-1; l < r; l, r = l+1, r-1 {
		ops[l], ops[r] = ops[r], ops[l]
	}
	return ops
}

func scriptWorks(a, b string, ops []op, distance int) bool {
	var consumed, produced strings.Builder
	cost := 0
	for _, o := range ops {
		consumed.WriteString(o.from)
		produced.WriteString(o.to)
		if o.kind != "giữ" {
			cost++
		}
	}
	return consumed.String() == a && produced.String() == b && cost == distance
}

func describe(ops []op) string {
	parts := make([]string, len(ops))
	for k, o := range ops {
		switch o.kind {
		case "giữ":
			parts[k] = "giữ " + o.from
		case "thay":
			parts[k] = "thay " + o.from + "→" + o.to
		case "xóa":
			parts[k] = "xóa " + o.from
		default:
			parts[k] = "chèn " + o.to
		}
	}
	return strings.Join(parts, ", ")
}

// BFS trên chính các chuỗi, độc lập với công thức DP
func bfsDistance(a, b string) int {
	limit := max(len(a), len(b))
	seen := map[string]int{a: 0}
	queue := []string{a}
	for head := 0; head < len(queue); head++ {
		s := queue[head]
		d := seen[s]
		if s == b {
			return d
		}
		var next []string
		for p := 0; p < len(s); p++ {
			flip := "a"
			if s[p] == 'a' {
				flip = "b"
			}
			next = append(next, s[:p]+s[p+1:], s[:p]+flip+s[p+1:])
		}
		if len(s) < limit {
			for p := 0; p <= len(s); p++ {
				next = append(next, s[:p]+"a"+s[p:], s[:p]+"b"+s[p:])
			}
		}
		for _, t := range next {
			if _, ok := seen[t]; !ok {
				seen[t] = d + 1
				queue = append(queue, t)
			}
		}
	}
	return -1
}

func allEqual(results []int, expected int) bool {
	for _, r := range results {
		if r != expected {
			return false
		}
	}
	return true
}

func main() {
	cases := []struct {
		a, b     string
		expected int
	}{
		{"", "", 0},
		{"", "abc", 3},
		{"abc", "", 3},
		{"abc", "abc", 0},
		{"cat", "cut", 1},
		{"table", "tables", 1},
		{"ab", "ba", 2},
		{"kitten", "sitting", 3},
		{"flaw", "lawn", 2},
		{"sunday", "saturday", 3},
		{"pqrst", "qrstu", 2},
		{strings.Repeat("ab", 250), strings.Repeat("ba", 250), 2},
		{strings.Repeat("a", 500), strings.Repeat("b", 500), 500},
	}
	ok, calls := 0, 0
	for _, c := range cases {
		results := []int{minDistance(c.a, c.b), editDistanceMemo(c.a, c.b, &calls), editDistanceTable(c.a, c.b)[len(c.a)][len(c.b)]}
		if len(c.a)+len(c.b) <= 16 {
			results = append(results, editDistanceBrute(c.a, c.b, &calls))
		}
		if allEqual(results, c.expected) && scriptWorks(c.a, c.b, editScript(c.a, c.b), c.expected) {
			ok++
		}
	}
	fmt.Printf("%d/%d ca đúng\n", ok, len(cases))

	words := []string{""}
	for k := 0; k < len(words); k++ {
		if len(words[k]) < 4 {
			words = append(words, words[k]+"a", words[k]+"b")
		}
	}
	exhaustiveOk, total := 0, 0
	for _, a := range words {
		for _, b := range words {
			total++
			expected := bfsDistance(a, b)
			results := []int{editDistanceBrute(a, b, &calls), editDistanceMemo(a, b, &calls), minDistance(a, b), editDistanceTable(a, b)[len(a)][len(b)]}
			if allEqual(results, expected) && scriptWorks(a, b, editScript(a, b), expected) {
				exhaustiveOk++
			}
		}
	}
	fmt.Printf("%d/%d ca đúng (đối chiếu BFS)\n", exhaustiveOk, total)

	brute, memo := 0, 0
	editDistanceBrute(strings.Repeat("a", 8), strings.Repeat("b", 8), &brute)
	editDistanceMemo(strings.Repeat("a", 8), strings.Repeat("b", 8), &memo)
	fmt.Printf("Vét cạn: %d lượt gọi, memo: %d lượt gọi\n", brute, memo)
	fmt.Printf("kitten → sitting: %s\n", describe(editScript("kitten", "sitting")))
}
