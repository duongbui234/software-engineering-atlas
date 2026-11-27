// Ga DP-07: DP khoảng (Burst Balloons) và DP khớp mẫu (Regular Expression Matching).
// Chạy: go run intervals.go
package main

import "fmt"

// best[l][r] = số xu nhiều nhất khi nổ hết bóng nằm giữa l và r (không tính l, r).
// Chọn k là quả nổ CUỐI CÙNG trong khoảng: lúc đó hai bên của k là l và r.
func maxCoins(nums []int) int {
	vals := append(append([]int{1}, nums...), 1) // thêm hai quả bóng giá 1 ở hai đầu
	size := len(vals)
	best := make([][]int, size)
	for i := range best {
		best[i] = make([]int, size)
	}
	for gap := 2; gap < size; gap++ { // khoảng ngắn trước, dài sau
		for l := 0; l+gap < size; l++ {
			r := l + gap
			for k := l + 1; k < r; k++ {
				coins := vals[l]*vals[k]*vals[r] + best[l][k] + best[k][r]
				best[l][r] = max(best[l][r], coins)
			}
		}
	}
	return best[0][size-1]
}

// match[i][j] = s[0:i] khớp trọn p[0:j]. Dấu * đi cùng ký tự đứng trước nó.
func isMatch(s, p string) bool {
	m, n := len(s), len(p)
	match := make([][]bool, m+1)
	for i := range match {
		match[i] = make([]bool, n+1)
	}
	match[0][0] = true
	for i := 0; i <= m; i++ {
		for j := 1; j <= n; j++ {
			if p[j-1] == '*' {
				// dùng x* không lần nào (đọc lùi hai cột), hoặc ăn thêm một ký tự của s
				eats := i > 0 && (p[j-2] == '.' || p[j-2] == s[i-1]) && match[i-1][j]
				match[i][j] = match[i][j-2] || eats
			} else {
				match[i][j] = i > 0 && (p[j-1] == '.' || p[j-1] == s[i-1]) && match[i-1][j-1]
			}
		}
	}
	return match[m][n]
}

func main() {
	balloonCases := []struct {
		nums []int
		want int
	}{
		{[]int{2, 4, 3}, 33}, {[]int{5}, 5}, {[]int{1, 5}, 10}, {[]int{0, 4}, 4},
		{[]int{3, 3, 3}, 39}, {[]int{9, 1, 2, 8}, 243}, {[]int{4, 2, 7, 1, 6}, 296},
	}
	patternCases := []struct {
		s, p string
		want bool
	}{
		{"", "", true}, {"", "a*", true}, {"", "a*b*.*", true}, {"abc", "abc", true},
		{"abc", "a.c", true}, {"abc", "ab", false}, {"aaa", "a*", true}, {"aaa", "ab*a*", true},
		{"xyz", ".*", true}, {"xyz", ".*q", false}, {"ab", ".*c", false}, {"aaab", "a*ab", true},
		{"ba", "a*ba*", true}, {"a", "ab*", true}, {"bbbba", ".*a*a", true}, {"ab", "a*", false},
	}
	ok := 0
	for _, c := range balloonCases {
		if got := maxCoins(c.nums); got == c.want {
			ok++
		} else {
			fmt.Printf("sai ở: maxCoins(%v) = %d, cần %d\n", c.nums, got, c.want)
		}
	}
	for _, c := range patternCases {
		if got := isMatch(c.s, c.p); got == c.want {
			ok++
		} else {
			fmt.Printf("sai ở: isMatch(%q, %q) = %v, cần %v\n", c.s, c.p, got, c.want)
		}
	}
	fmt.Printf("%d/%d ca đúng\n", ok, len(balloonCases)+len(patternCases))
}
