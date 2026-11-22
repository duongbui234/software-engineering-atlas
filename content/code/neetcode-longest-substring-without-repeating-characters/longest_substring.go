// LeetCode 3, Longest Substring Without Repeating Characters: ba cách và test.
// Chạy: go run longest_substring.go
package main

import "fmt"

func bruteForce(s string) int {
	best := 0
	for i := 0; i < len(s); i++ {
		var seen [128]bool
		j := i
		for ; j < len(s) && !seen[s[j]]; j++ {
			seen[s[j]] = true
		}
		best = max(best, j-i)
	}
	return best
}

func windowSet(s string) int {
	var inWindow [128]bool // đề chỉ có ASCII: mảng 128 ô thay cho map
	left, best := 0, 0
	for right := 0; right < len(s); right++ {
		for inWindow[s[right]] {
			inWindow[s[left]] = false
			left++
		}
		inWindow[s[right]] = true
		best = max(best, right-left+1)
	}
	return best
}

func windowLastSeen(s string) int {
	var last [128]int // lưu vị trí + 1, để 0 nghĩa là "chưa gặp"
	left, best := 0, 0
	for right := 0; right < len(s); right++ { // s[right] là BYTE; với chuỗi ngoài ASCII phải duyệt bằng range để lấy rune
		c := s[right]
		left = max(left, last[c]) // last[c] = vị trí gặp trước + 1; max giữ left không lùi
		last[c] = right + 1
		best = max(best, right-left+1)
	}
	return best
}

func main() {
	cases := []struct {
		s    string
		want int
	}{{"abcabcbb", 3}, {"bbbbb", 1}, {"pwwkew", 3}, {"", 0}, {" ", 1}, {"abba", 2}, {"dvdf", 3}, {"tmmzuxt", 5}}
	for _, f := range []struct {
		name string
		fn   func(string) int
	}{{"bruteForce", bruteForce}, {"windowSet", windowSet}, {"windowLastSeen", windowLastSeen}} {
		ok := 0
		for _, c := range cases {
			if f.fn(c.s) == c.want {
				ok++
			}
		}
		fmt.Printf("%-15s %d/%d ca đúng\n", f.name, ok, len(cases))
	}
}
