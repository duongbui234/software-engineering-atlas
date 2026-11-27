package main

import (
	"fmt"
	"strings"
)

func lcsBrute(a, b string, calls *int) int {
	var solve func(i, j int) int
	solve = func(i, j int) int {
		*calls++
		if i == len(a) || j == len(b) {
			return 0
		}
		if a[i] == b[j] {
			return 1 + solve(i+1, j+1)
		}
		return max(solve(i+1, j), solve(i, j+1))
	}
	return solve(0, 0)
}

func lcsMemo(a, b string, calls *int) int {
	cache := make(map[[2]int]int)
	var solve func(i, j int) int
	solve = func(i, j int) int {
		*calls++
		if i == len(a) || j == len(b) {
			return 0
		}
		if saved, ok := cache[[2]int{i, j}]; ok {
			return saved
		}
		var best int
		if a[i] == b[j] {
			best = 1 + solve(i+1, j+1)
		} else {
			best = max(solve(i+1, j), solve(i, j+1))
		}
		cache[[2]int{i, j}] = best
		return best
	}
	return solve(0, 0)
}

func lcsTable(a, b string) [][]int {
	// dp[i][j]: LCS của a[:i] và b[:j]; hàng 0 và cột 0 là tiền tố rỗng
	dp := make([][]int, len(a)+1)
	for i := range dp {
		dp[i] = make([]int, len(b)+1)
	}
	for i := 1; i <= len(a); i++ {
		for j := 1; j <= len(b); j++ {
			if a[i-1] == b[j-1] {
				dp[i][j] = dp[i-1][j-1] + 1
			} else {
				dp[i][j] = max(dp[i-1][j], dp[i][j-1])
			}
		}
	}
	return dp
}

func lcsRow(a, b string) int {
	if len(b) > len(a) {
		a, b = b, a
	}
	row := make([]int, len(b)+1)
	for i := 1; i <= len(a); i++ {
		diagonal := 0 // dp[i-1][j-1], phải giữ trước khi ghi đè row[j]
		for j := 1; j <= len(b); j++ {
			above := row[j]
			if a[i-1] == b[j-1] {
				row[j] = diagonal + 1
			} else {
				row[j] = max(above, row[j-1])
			}
			diagonal = above
		}
	}
	return row[len(b)]
}

func rebuild(a, b string, dp [][]int) string {
	i, j := len(a), len(b)
	out := []byte{}
	for i > 0 && j > 0 {
		if a[i-1] == b[j-1] {
			out = append(out, a[i-1])
			i, j = i-1, j-1
		} else if dp[i-1][j] >= dp[i][j-1] {
			i--
		} else {
			j--
		}
	}
	for l, r := 0, len(out)-1; l < r; l, r = l+1, r-1 {
		out[l], out[r] = out[r], out[l]
	}
	return string(out)
}

func isSubsequence(small, big string) bool {
	k := 0
	for i := 0; i < len(big) && k < len(small); i++ {
		if big[i] == small[k] {
			k++
		}
	}
	return k == len(small)
}

func bySubsets(a, b string) int {
	best := 0
	for mask := 0; mask < 1<<len(a); mask++ {
		picked := []byte{}
		for k := 0; k < len(a); k++ {
			if mask>>k&1 == 1 {
				picked = append(picked, a[k])
			}
		}
		if len(picked) > best && isSubsequence(string(picked), b) {
			best = len(picked)
		}
	}
	return best
}

func allAgree(a, b string, expected int) bool {
	dp := lcsTable(a, b)
	path := rebuild(a, b, dp)
	return dp[len(a)][len(b)] == expected && lcsRow(a, b) == expected &&
		len(path) == expected && isSubsequence(path, a) && isSubsequence(path, b)
}

func check(ok bool) {
	if !ok {
		panic("ca kiểm tra sai")
	}
}

func main() {
	type testCase struct {
		a, b     string
		expected int
	}
	cases := []testCase{
		{"bread", "boardgame", 3},
		{"abc", "abc", 3},
		{"abc", "xyz", 0},
		{"a", "a", 1},
		{"a", "b", 0},
		{"ezupkr", "ubmrapg", 2},
		{"abcba", "abcbcba", 5},
		{strings.Repeat("ab", 500), strings.Repeat("ba", 500), 999},
		{strings.Repeat("a", 1000), strings.Repeat("a", 1000), 1000},
	}
	for _, tc := range cases {
		check(allAgree(tc.a, tc.b, tc.expected))
		if len(tc.a) <= 20 {
			calls := 0
			check(lcsMemo(tc.a, tc.b, &calls) == tc.expected)
		}
	}
	fmt.Printf("%d/%d ca đúng\n", len(cases), len(cases))

	words := []string{}
	for size := 1; size <= 5; size++ {
		for mask := 0; mask < 1<<size; mask++ {
			word := []byte{}
			for k := size - 1; k >= 0; k-- {
				if mask>>k&1 == 1 {
					word = append(word, 'b')
				} else {
					word = append(word, 'a')
				}
			}
			words = append(words, string(word))
		}
	}
	checked := 0
	for _, a := range words {
		for _, b := range words {
			expected := bySubsets(a, b)
			calls := 0
			check(allAgree(a, b, expected) && lcsMemo(a, b, &calls) == expected)
			if len(a)+len(b) <= 8 {
				check(lcsBrute(a, b, &calls) == expected)
			}
			checked++
		}
	}
	fmt.Printf("%d/%d ca đúng (đối chiếu mọi tập con, chuỗi a/b dài 1–5)\n", checked, checked)

	bruteCalls, memoCalls := 0, 0
	lcsBrute("abcdefghij", "klmnopqrst", &bruteCalls)
	lcsMemo("abcdefghij", "klmnopqrst", &memoCalls)
	fmt.Printf("Hai chuỗi 10 ký tự không chung chữ: vét cạn %d lượt gọi, memo %d lượt gọi\n", bruteCalls, memoCalls)
	fmt.Println("Một LCS của bread và boardgame:", rebuild("bread", "boardgame", lcsTable("bread", "boardgame")))
}
