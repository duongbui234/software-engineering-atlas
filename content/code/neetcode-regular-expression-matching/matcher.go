// Regular Expression Matching (LeetCode 10): vét cạn, ghi nhớ và bảng trên hai tiền tố.
// Chạy: go run matcher.go
package main

import (
	"fmt"
	"regexp"
	"strings"
)

func matchBrute(s, p string, calls *int) bool {
	// Đệ quy thuần trên hậu tố s[i:] và p[j:]; calls đếm số lần gọi.
	var goFn func(i, j int) bool
	goFn = func(i, j int) bool {
		*calls++
		if j == len(p) {
			return i == len(s)
		}
		first := i < len(s) && (p[j] == s[i] || p[j] == '.')
		if j+1 < len(p) && p[j+1] == '*' {
			// bỏ qua cặp "x*" (0 lần) hoặc ăn một ký tự và giữ nguyên "x*"
			return goFn(i, j+2) || (first && goFn(i+1, j))
		}
		return first && goFn(i+1, j+1)
	}
	return goFn(0, 0)
}

func matchMemo(s, p string, calls *int) bool {
	// Cùng đệ quy, nhưng lưu kết quả của từng cặp (i, j): 0 chưa tính, 1 sai, 2 đúng.
	memo := make([][]int8, len(s)+1)
	for i := range memo {
		memo[i] = make([]int8, len(p)+1)
	}
	var goFn func(i, j int) bool
	goFn = func(i, j int) bool {
		*calls++
		if memo[i][j] != 0 {
			return memo[i][j] == 2
		}
		var ans bool
		if j == len(p) {
			ans = i == len(s)
		} else {
			first := i < len(s) && (p[j] == s[i] || p[j] == '.')
			if j+1 < len(p) && p[j+1] == '*' {
				ans = goFn(i, j+2) || (first && goFn(i+1, j))
			} else {
				ans = first && goFn(i+1, j+1)
			}
		}
		memo[i][j] = 1
		if ans {
			memo[i][j] = 2
		}
		return ans
	}
	return goFn(0, 0)
}

func isMatch(s, p string) bool {
	// dp[i][j]: tiền tố s[:i] có khớp trọn mẫu p[:j] không.
	n, m := len(s), len(p)
	dp := make([][]bool, n+1)
	for i := range dp {
		dp[i] = make([]bool, m+1)
	}
	dp[0][0] = true
	for j := 2; j <= m; j++ {
		// chuỗi rỗng chỉ khớp được các cặp "x*" lấy 0 lần
		dp[0][j] = p[j-1] == '*' && dp[0][j-2]
	}
	for i := 1; i <= n; i++ {
		for j := 1; j <= m; j++ {
			if p[j-1] == '*' {
				zero := dp[i][j-2]
				more := (p[j-2] == s[i-1] || p[j-2] == '.') && dp[i-1][j]
				dp[i][j] = zero || more
			} else {
				dp[i][j] = (p[j-1] == s[i-1] || p[j-1] == '.') && dp[i-1][j-1]
			}
		}
	}
	return dp[n][m]
}

type testCase struct {
	s, p string
	want bool
}

func product(items []string, k int) []string {
	out := []string{""}
	for r := 0; r < k; r++ {
		next := []string{}
		for _, pre := range out {
			for _, x := range items {
				next = append(next, pre+x)
			}
		}
		out = next
	}
	return out
}

func main() {
	cases := []testCase{
		{"ba", "b", false},
		{"bb", "b*", true},
		{"xy", ".*", true},
		{"kkd", "z*k*d", true},
		{"tomato", "to*ma*to", true},
		{"tomato", "t.m*a*t", false},
		{"ab", ".*z", false},
		{"aaa", "a*a", true},
		{"aaa", "ab*a*c*a", true},
		{"a", "ab*", true},
		{"bbbba", ".*a*a", true},
		{"abcd", "d*", false},
		{"", "a*b*", true},
		{"a", ".*..a*", false},
		{strings.Repeat("a", 20), strings.Repeat("a*", 7) + "b", false},
	}
	ok := 0
	for _, c := range cases {
		var x, y int
		a, b, d := isMatch(c.s, c.p), matchMemo(c.s, c.p, &x), matchBrute(c.s, c.p, &y)
		if a == c.want && b == c.want && d == c.want {
			ok++
		} else {
			fmt.Println("sai:", c.s, c.p, a, b, d, c.want)
		}
	}
	fmt.Printf("%d/%d ca đúng\n", ok, len(cases))

	// Vét mọi chuỗi a/b dài 0–4 và mọi mẫu 0–3 phần tử (a, b, . có hoặc không có *).
	var strs, patterns []string
	for n := 0; n <= 4; n++ {
		strs = append(strs, product([]string{"a", "b"}, n)...)
	}
	for k := 0; k <= 3; k++ {
		patterns = append(patterns, product([]string{"a", "a*", "b", "b*", ".", ".*"}, k)...)
	}
	good, total := 0, 0
	for _, p := range patterns {
		native := regexp.MustCompile(`^(?:` + p + `)$`) // MatchString chỉ cần khớp một đoạn nếu không neo
		for _, s := range strs {
			total++
			want := native.MatchString(s)
			var x, y int
			if isMatch(s, p) == want && matchMemo(s, p, &x) == want && matchBrute(s, p, &y) == want {
				good++
			}
		}
	}
	fmt.Printf("%d/%d ca đúng (đối chiếu regex của ngôn ngữ)\n", good, total)

	var brute, memo int
	matchBrute(strings.Repeat("a", 20), strings.Repeat("a*", 7)+"b", &brute)
	matchMemo(strings.Repeat("a", 20), strings.Repeat("a*", 7)+"b", &memo)
	fmt.Printf("20 chữ a với (a*)×7 rồi b: vét cạn %d lượt gọi, memo %d lượt gọi\n", brute, memo)
}
