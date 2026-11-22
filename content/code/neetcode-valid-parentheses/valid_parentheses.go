// LeetCode 20, Valid Parentheses: xóa cặp lặp và ngăn xếp bằng slice.
// Chạy: go run valid_parentheses.go
package main

import (
	"fmt"
	"strings"
)

func replacePairs(s string) bool {
	for prev := ""; s != prev; {
		prev = s
		s = strings.NewReplacer("()", "", "[]", "", "{}", "").Replace(s)
	}
	return s == ""
}

func stack(s string) bool {
	open := map[byte]byte{')': '(', ']': '[', '}': '{'}
	st := make([]byte, 0, len(s)) // slice làm ngăn xếp; cấp sẵn sức chứa để append không phải nới
	for i := 0; i < len(s); i++ {
		want, isClose := open[s[i]]
		if !isClose {
			st = append(st, s[i])
			continue
		}
		if len(st) == 0 || st[len(st)-1] != want { // st[len(st)-1] trên slice rỗng là panic: kiểm độ dài trước
			return false
		}
		st = st[:len(st)-1] // "pop": cắt bớt phần tử cuối
	}
	return len(st) == 0
}

func main() {
	cases := []struct {
		s    string
		want bool
	}{{"()", true}, {"()[]{}", true}, {"(]", false}, {"([)]", false}, {"{[]}", true},
		{"((", false}, {"){", false}, {"", true}, {"(((([]))))", true}}
	for _, f := range []struct {
		name string
		fn   func(string) bool
	}{{"replacePairs", replacePairs}, {"stack", stack}} {
		ok := 0
		for _, c := range cases {
			if f.fn(c.s) == c.want {
				ok++
			}
		}
		fmt.Printf("%-13s %d/%d ca đúng\n", f.name, ok, len(cases))
	}
}
