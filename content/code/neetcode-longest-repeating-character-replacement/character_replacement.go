// LeetCode 424, Longest Repeating Character Replacement: ba cách và test.
// Chạy: go run character_replacement.go
package main

import (
	"fmt"
	"slices"
)

func bruteForce(s string, k int) int {
	best := 0
	for i := 0; i < len(s); i++ {
		var count [26]int
		maxFreq := 0
		for j := i; j < len(s); j++ {
			count[s[j]-'A']++
			maxFreq = max(maxFreq, count[s[j]-'A'])
			if j-i+1-maxFreq <= k {
				best = max(best, j-i+1)
			}
		}
	}
	return best
}

func windowRecount(s string, k int) int {
	var count [26]int // mảng cố định: không cấp phát, tự điền 0
	left, best := 0, 0
	for right := 0; right < len(s); right++ {
		count[s[right]-'A']++
		for right-left+1-slices.Max(count[:]) > k {
			count[s[left]-'A']--
			left++
		}
		best = max(best, right-left+1)
	}
	return best
}

func windowStaleMax(s string, k int) int {
	var count [26]int
	left, maxFreq := 0, 0
	for right := 0; right < len(s); right++ { // s[right] là byte: đúng vì đề chỉ có chữ hoa ASCII
		count[s[right]-'A']++
		maxFreq = max(maxFreq, count[s[right]-'A'])
		if right-left+1-maxFreq > k {
			count[s[left]-'A']--
			left++
		}
	}
	return len(s) - left
}

func main() {
	cases := []struct {
		s       string
		k, want int
	}{{"ABAB", 2, 4}, {"AABABBA", 1, 4}, {"A", 0, 1}, {"ABCDE", 1, 2}, {"AAAA", 0, 4}, {"BAAAB", 2, 5}, {"ABBB", 2, 4}, {"ABCABCAA", 2, 5}}
	for _, f := range []struct {
		name string
		fn   func(string, int) int
	}{{"bruteForce", bruteForce}, {"windowRecount", windowRecount}, {"windowStaleMax", windowStaleMax}} {
		ok := 0
		for _, c := range cases {
			if f.fn(c.s, c.k) == c.want {
				ok++
			}
		}
		fmt.Printf("%-15s %d/%d ca đúng\n", f.name, ok, len(cases))
	}
}
