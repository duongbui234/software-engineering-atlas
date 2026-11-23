// LeetCode 22, Generate Parentheses: quay lui, ngăn xếp tự quản, một bản sai vì dùng chung mảng nền, và test.
// Chạy: go run generate_parentheses.go
package main

import "fmt"

func backtrack(n int) []string {
	out := []string{}
	buf := make([]byte, 0, 2*n)
	var gen func(open, close int)
	gen = func(open, close int) {
		if len(buf) == 2*n {
			out = append(out, string(buf)) // string(buf) SAO CHÉP các byte; buf còn bị sửa tiếp
			return
		}
		if open < n {
			buf = append(buf, '(')
			gen(open+1, close)
			buf = buf[:len(buf)-1] // bỏ ký tự vừa thêm: cắt slice, không cấp phát
		}
		if close < open {
			buf = append(buf, ')')
			gen(open, close+1)
			buf = buf[:len(buf)-1]
		}
	}
	gen(0, 0)
	return out
}

// SAI: giữ lại chính slice buf thay vì một bản sao. Mọi kết quả cùng trỏ vào một mảng nền,
// nên cuối cùng tất cả đều mang nội dung của lần ghi sau cùng.
func backtrackAliased(n int) []string {
	saved := [][]byte{}
	buf := make([]byte, 0, 2*n)
	var gen func(open, close int)
	gen = func(open, close int) {
		if len(buf) == 2*n {
			saved = append(saved, buf)
			return
		}
		if open < n {
			buf = append(buf, '(')
			gen(open+1, close)
			buf = buf[:len(buf)-1]
		}
		if close < open {
			buf = append(buf, ')')
			gen(open, close+1)
			buf = buf[:len(buf)-1]
		}
	}
	gen(0, 0)
	out := make([]string, len(saved))
	for i, b := range saved {
		out[i] = string(b)
	}
	return out
}

func explicitStack(n int) []string {
	type state struct {
		s           string
		open, close int
	}
	out := []string{}
	st := []state{{"", 0, 0}}
	for len(st) > 0 {
		top := st[len(st)-1]
		st = st[:len(st)-1]
		if len(top.s) == 2*n {
			out = append(out, top.s)
			continue
		}
		if top.close < top.open {
			st = append(st, state{top.s + ")", top.open, top.close + 1})
		}
		if top.open < n {
			st = append(st, state{top.s + "(", top.open + 1, top.close})
		}
	}
	return out
}

func catalan(n int) int {
	c := 1
	for i := 0; i < n; i++ {
		c = c * 2 * (2*i + 1) / (i + 2)
	}
	return c
}

func correct(out []string, n int) bool {
	if len(out) != catalan(n) {
		return false
	}
	seen := map[string]bool{}
	for _, s := range out {
		bal := 0
		for _, ch := range s {
			if ch == '(' {
				bal++
			} else {
				bal--
			}
			if bal < 0 {
				return false
			}
		}
		if bal != 0 || len(s) != 2*n || seen[s] {
			return false
		}
		seen[s] = true
	}
	return true
}

func main() {
	for _, f := range []struct {
		name string
		fn   func(int) []string
	}{{"backtrack", backtrack}, {"explicitStack", explicitStack}, {"backtrackAliased", backtrackAliased}} {
		ok := 0
		for n := 1; n <= 8; n++ {
			if correct(f.fn(n), n) {
				ok++
			}
		}
		fmt.Printf("%-17s %d/8 ca đúng\n", f.name, ok)
	}
	fmt.Printf("\nbacktrackAliased(3) = %q\n", backtrackAliased(3))
}
