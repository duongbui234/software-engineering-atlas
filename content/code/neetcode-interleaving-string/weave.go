package main

import (
	"fmt"
	"strings"
)

func interleaveSearch(s1, s2, s3 string, memo bool, calls *int) bool {
	if len(s1)+len(s2) != len(s3) {
		return false
	}
	var cache map[[2]int]bool
	if memo {
		cache = make(map[[2]int]bool)
	}
	var search func(i, j int) bool
	search = func(i, j int) bool {
		*calls++
		if i == len(s1) && j == len(s2) {
			return true
		}
		if saved, ok := cache[[2]int{i, j}]; ok {
			return saved
		}
		k := i + j
		found := (i < len(s1) && s1[i] == s3[k] && search(i+1, j)) ||
			(j < len(s2) && s2[j] == s3[k] && search(i, j+1))
		if cache != nil {
			cache[[2]int{i, j}] = found
		}
		return found
	}
	return search(0, 0)
}

func interleaveTable(s1, s2, s3 string) bool {
	m, n := len(s1), len(s2)
	if m+n != len(s3) {
		return false
	}
	// ok[i][j]: s1[:i] và s2[:j] đan thành s3[:i + j]
	ok := make([][]bool, m+1)
	for i := range ok {
		ok[i] = make([]bool, n+1)
	}
	ok[0][0] = true
	for i := 0; i <= m; i++ {
		for j := 0; j <= n; j++ {
			if i > 0 && ok[i-1][j] && s1[i-1] == s3[i+j-1] {
				ok[i][j] = true
			}
			if j > 0 && ok[i][j-1] && s2[j-1] == s3[i+j-1] {
				ok[i][j] = true
			}
		}
	}
	return ok[m][n]
}

func interleaveRow(s1, s2, s3 string) bool {
	m, n := len(s1), len(s2)
	if m+n != len(s3) {
		return false
	}
	row := make([]bool, n+1)
	for i := 0; i <= m; i++ {
		for j := 0; j <= n; j++ {
			if i == 0 && j == 0 {
				row[j] = true
				continue
			}
			// row[j] còn giữ hàng i - 1 (ô trên), row[j - 1] đã là hàng i (ô trái)
			fromTop := i > 0 && row[j] && s1[i-1] == s3[i+j-1]
			fromLeft := j > 0 && row[j-1] && s2[j-1] == s3[i+j-1]
			row[j] = fromTop || fromLeft
		}
	}
	return row[n]
}

func interleaveAll(s1, s2, s3 string) []bool {
	calls := 0
	answers := []bool{interleaveTable(s1, s2, s3), interleaveRow(s1, s2, s3),
		interleaveSearch(s1, s2, s3, true, &calls)}
	if len(s3) <= 24 {
		answers = append(answers, interleaveSearch(s1, s2, s3, false, &calls))
	}
	return answers
}

func allEqual(answers []bool, expected bool) bool {
	for _, answer := range answers {
		if answer != expected {
			return false
		}
	}
	return true
}

func interleaveOracle(s1, s2, s3 string) bool {
	total := len(s3)
	if len(s1)+len(s2) != total {
		return false
	}
	for mask := 0; mask < 1<<total; mask++ {
		var first, second strings.Builder
		for k := 0; k < total; k++ {
			if mask&(1<<k) != 0 {
				first.WriteByte(s3[k])
			} else {
				second.WriteByte(s3[k])
			}
		}
		if first.String() == s1 && second.String() == s2 {
			return true
		}
	}
	return false
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
		s1, s2, s3 string
		expected   bool
	}{
		{"ab", "cd", "acbd", true},
		{"ab", "cd", "acdb", true},
		{"ab", "cd", "badc", false},
		{"ab", "ac", "acab", true},
		{"a", "b", "abc", false},
		{"", "", "", true},
		{"", "kiwi", "kiwi", true},
		{"", "kiwi", "kiwj", false},
		{"aab", "aac", "aacaab", true},
		{"aab", "aac", "abaaac", false},
		{a(100), a(100), a(200), true},
		{a(100), a(99) + "b", a(198) + "ba", true},
		{a(100), a(99) + "b", a(198) + "bb", false},
	}
	for _, c := range cases {
		if !allEqual(interleaveAll(c.s1, c.s2, c.s3), c.expected) {
			panic("Ca kiểm tra sai")
		}
	}
	fmt.Printf("%d/%d ca đúng\n", len(cases), len(cases))

	var words []string
	for size := 0; size <= 3; size++ {
		words = append(words, stringsOf(size)...)
	}
	probes := 0
	for _, s1 := range words {
		for _, s2 := range words {
			for _, size := range []int{len(s1) + len(s2), len(s1) + len(s2) + 1} {
				for _, s3 := range stringsOf(size) {
					if !allEqual(interleaveAll(s1, s2, s3), interleaveOracle(s1, s2, s3)) {
						panic("Ca vét đối chiếu sai")
					}
					probes++
				}
			}
		}
	}
	fmt.Printf("%d/%d ca đúng (vét mọi cách chia)\n", probes, probes)

	brute, memo := 0, 0
	interleaveSearch(a(10), a(10), a(19)+"b", false, &brute)
	interleaveSearch(a(10), a(10), a(19)+"b", true, &memo)
	fmt.Printf("Vét cạn: %d lượt gọi, memo: %d lượt gọi\n", brute, memo)
}
