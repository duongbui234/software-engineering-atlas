// Ga DP-05: bảng theo lưới và theo hai tiền tố
package main

import "fmt"

func uniquePaths(m, n int) int {
	row := make([]int, n)
	for j := range row {
		row[j] = 1 // hàng 0: mọi ô có đúng một đường
	}
	for i := 1; i < m; i++ {
		for j := 1; j < n; j++ {
			row[j] += row[j-1] // trên + trái
		}
	}
	return row[n-1]
}

func longestCommonSubsequence(a, b string) int {
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
	return dp[len(a)][len(b)]
}

func isInterleave(s1, s2, s3 string) bool {
	if len(s1)+len(s2) != len(s3) {
		return false
	}
	row := make([]bool, len(s2)+1)
	for i := 0; i <= len(s1); i++ {
		for j := 0; j <= len(s2); j++ {
			if i == 0 && j == 0 {
				row[j] = true
				continue
			}
			c := s3[i+j-1]
			fromTop := i > 0 && row[j] && s1[i-1] == c
			fromLeft := j > 0 && row[j-1] && s2[j-1] == c
			row[j] = fromTop || fromLeft
		}
	}
	return row[len(s2)]
}

func numDistinct(s, t string) int {
	ways := make([]int, len(t)+1)
	ways[0] = 1 // t rỗng: một cách, bỏ hết
	for i := 1; i <= len(s); i++ {
		for j := len(t); j >= 1; j-- { // đi lùi để còn đọc hàng cũ
			if s[i-1] == t[j-1] {
				ways[j] += ways[j-1]
			}
		}
	}
	return ways[len(t)]
}

func minDistance(a, b string) int {
	row := make([]int, len(b)+1)
	for j := range row {
		row[j] = j // a rỗng: chèn j ký tự
	}
	for i := 1; i <= len(a); i++ {
		diag := row[0] // dp[i-1][j-1]
		row[0] = i
		for j := 1; j <= len(b); j++ {
			top := row[j]
			if a[i-1] == b[j-1] {
				row[j] = diag
			} else {
				row[j] = 1 + min(diag, top, row[j-1]) // thay, xóa, chèn
			}
			diag = top
		}
	}
	return row[len(b)]
}

func main() {
	checks := []bool{
		uniquePaths(3, 7) == 28,
		uniquePaths(3, 2) == 3,
		uniquePaths(1, 1) == 1,
		uniquePaths(23, 12) == 193536720,
		longestCommonSubsequence("abcde", "ace") == 3,
		longestCommonSubsequence("abc", "def") == 0,
		longestCommonSubsequence("map", "mop") == 2,
		isInterleave("aabcc", "dbbca", "aadbbcbcac"),
		!isInterleave("aabcc", "dbbca", "aadbbbaccc"),
		isInterleave("", "", ""),
		!isInterleave("a", "", "ab"),
		numDistinct("rabbbit", "rabbit") == 3,
		numDistinct("babgbag", "bag") == 5,
		numDistinct("a", "b") == 0,
		minDistance("horse", "ros") == 3,
		minDistance("intention", "execution") == 5,
		minDistance("", "abc") == 3,
	}
	for _, ok := range checks {
		if !ok {
			panic("Ca kiểm tra sai")
		}
	}
	fmt.Printf("%d/%d ca đúng\n", len(checks), len(checks))
}
