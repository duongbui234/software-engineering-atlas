package main

import (
	"fmt"
	"strings"
)

const CAP = 1 << 31 // đáp án LeetCode luôn nhỏ hơn mức này

func countSearch(s, t string, memo bool, calls *int) int {
	var cache map[[2]int]int
	if memo {
		cache = make(map[[2]int]int)
	}
	var search func(i, j int) int
	search = func(i, j int) int {
		*calls++
		if j == len(t) {
			return 1
		}
		if len(s)-i < len(t)-j {
			return 0
		}
		if saved, ok := cache[[2]int{i, j}]; ok {
			return saved
		}
		ways := search(i+1, j)
		if s[i] == t[j] {
			ways = min(ways+search(i+1, j+1), CAP)
		}
		if cache != nil {
			cache[[2]int{i, j}] = ways
		}
		return ways
	}
	return search(0, 0)
}

func countTable(s, t string) int {
	m, n := len(s), len(t)
	// ways[i][j]: số cách chọn t[:j] làm dãy con của s[:i]
	ways := make([][]int, m+1)
	for i := range ways {
		ways[i] = make([]int, n+1)
		ways[i][0] = 1
	}
	for i := 1; i <= m; i++ {
		for j := 1; j <= n; j++ {
			ways[i][j] = ways[i-1][j]
			if s[i-1] == t[j-1] {
				ways[i][j] = min(ways[i][j]+ways[i-1][j-1], CAP)
			}
		}
	}
	return ways[m][n]
}

func fillRow(s, t string, limit int) []int {
	row := make([]int, len(t)+1)
	row[0] = 1
	for i := 0; i < len(s); i++ {
		// đi ngược để row[j - 1] vẫn là giá trị của hàng trước
		for j := len(t); j >= 1; j-- {
			if s[i] == t[j-1] {
				row[j] = min(row[j]+row[j-1], limit)
			}
		}
	}
	return row
}

func countRow(s, t string, limit int) int {
	return fillRow(s, t, limit)[len(t)]
}

func allEqual(s, t string, expected int) bool {
	calls := 0
	answers := []int{countTable(s, t), countRow(s, t, CAP), countSearch(s, t, true, &calls)}
	if len(s) <= 20 {
		answers = append(answers, countSearch(s, t, false, &calls))
	}
	for _, answer := range answers {
		if answer != expected {
			return false
		}
	}
	return true
}

func countOracle(s, t string) int {
	found := 0
	for mask := 0; mask < 1<<len(s); mask++ {
		var picked strings.Builder
		for k := 0; k < len(s); k++ {
			if mask&(1<<k) != 0 {
				picked.WriteByte(s[k])
			}
		}
		if picked.String() == t {
			found++
		}
	}
	return found
}

func stringsOf(size int) []string {
	var out []string
	for mask := 0; mask < 1<<size; mask++ {
		word := make([]byte, size)
		for k := 0; k < size; k++ {
			word[k] = 'a'
			if mask&(1<<(size-1-k)) != 0 {
				word[k] = 'b'
			}
		}
		out = append(out, string(word))
	}
	return out
}

func main() {
	a := func(count int) string { return strings.Repeat("a", count) }
	cases := []struct {
		s, t     string
		expected int
	}{
		{"banana", "ban", 3},
		{"banana", "ana", 4},
		{"aaa", "aa", 3},
		{"ab", "abc", 0},
		{"abc", "d", 0},
		{"Aa", "a", 1},
		{"mississippi", "sip", 12},
		{a(1000), a(3), 166167000},
		{a(1000), a(1000), 1},
		{a(1000), a(499) + "b", 0},
		{strings.Repeat("ab", 100), "abab", 4249575},
	}
	for _, c := range cases {
		if !allEqual(c.s, c.t, c.expected) {
			panic("Ca kiểm tra sai")
		}
	}
	fmt.Printf("%d/%d ca đúng\n", len(cases), len(cases))

	var targets []string
	for size := 1; size <= 3; size++ {
		targets = append(targets, stringsOf(size)...)
	}
	probes := 0
	for size := 0; size < 8; size++ {
		for _, s := range stringsOf(size) {
			for _, t := range targets {
				expected := countOracle(s, t)
				if !allEqual(s, t, expected) || countRow(s, t, 3) != min(expected, 3) {
					panic("Ca vét đối chiếu sai")
				}
				probes++
			}
		}
	}
	fmt.Printf("%d/%d ca đúng (vét mọi tập vị trí)\n", probes, probes)

	row := fillRow(a(1000), a(499)+"b", CAP)
	full := 0
	for _, value := range row {
		if value == CAP {
			full++
		}
	}
	fmt.Printf("Hàng cuối: %d/%d ô chạm 2^31, đáp án %d\n", full, len(row), row[500])
}
