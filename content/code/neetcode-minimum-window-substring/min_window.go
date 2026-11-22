// LeetCode 76, Minimum Window Substring: hai cách và test.
// Chạy: go run min_window.go
package main

import "fmt"

func bruteForce(s, t string) string {
	best := ""
	for l := 0; l < len(s); l++ {
		var need [128]int
		for i := 0; i < len(t); i++ {
			need[t[i]]++
		}
		missing := len(t)
		for r := l; r < len(s); r++ {
			if need[s[r]] > 0 {
				missing--
			}
			need[s[r]]--
			if missing == 0 {
				if best == "" || r-l+1 < len(best) {
					best = s[l : r+1]
				}
				break
			}
		}
	}
	return best
}

func windowMissing(s, t string) string {
	var need [128]int // đề chỉ có chữ cái tiếng Anh: mảng 128 ô, chỉ số là byte
	for i := 0; i < len(t); i++ {
		need[t[i]]++
	}
	missing, l, bestL, bestLen := len(t), 0, 0, len(s)+1
	for r := 0; r < len(s); r++ {
		if need[s[r]] > 0 {
			missing--
		}
		need[s[r]]--
		for missing == 0 {
			if r-l+1 < bestLen {
				bestL, bestLen = l, r-l+1
			}
			need[s[l]]++
			if need[s[l]] > 0 {
				missing++
			}
			l++
		}
	}
	if bestLen > len(s) {
		return ""
	}
	return s[bestL : bestL+bestLen] // cắt chuỗi Go không sao chép: kết quả dùng chung bộ nhớ với s
}

func main() {
	cases := [][3]string{{"ADOBECODEBANC", "ABC", "BANC"}, {"a", "a", "a"}, {"a", "aa", ""}, {"aa", "aa", "aa"}, {"ab", "b", "b"},
		{"bba", "ab", "ba"}, {"cabwefgewcwaefgcf", "cae", "cwae"}, {"abc", "d", ""}}
	for _, f := range []struct {
		name string
		fn   func(string, string) string
	}{{"bruteForce", bruteForce}, {"windowMissing", windowMissing}} {
		ok := 0
		for _, c := range cases {
			if f.fn(c[0], c[1]) == c[2] {
				ok++
			}
		}
		fmt.Printf("%-14s %d/%d ca đúng\n", f.name, ok, len(cases))
	}
}
