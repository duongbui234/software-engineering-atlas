// Valid Parenthesis String (LeetCode 678): vét cạn 3^k cách hiểu, DP nhớ (i, số mở), hai ngăn xếp, khoảng [lo, hi]
// Chạy: go run wildcard.go
package main

import (
	"fmt"
	"strings"
	"time"
)

// Vét cạn: thử mọi cách hiểu của từng dấu * (")" , rỗng, "("), kiểm từng chuỗi ngoặc thu được
func checkBrute(s string, steps *int64) bool {
	buf := make([]byte, 0, len(s))
	balanced := func() bool {
		open := 0
		for _, c := range buf {
			if c == '(' {
				open++
			} else {
				open--
			}
			if open < 0 {
				return false
			}
		}
		return open == 0
	}
	var walk func(i int) bool
	walk = func(i int) bool {
		if i == len(s) {
			*steps++ // một cách hiểu trọn vẹn
			return balanced()
		}
		if s[i] != '*' {
			buf = append(buf, s[i])
			r := walk(i + 1)
			buf = buf[:len(buf)-1]
			return r
		}
		found := false
		for _, pick := range []byte{')', 0, '('} {
			if pick != 0 {
				buf = append(buf, pick)
			}
			if walk(i + 1) {
				found = true // không dừng sớm: đếm đủ 3^k cách hiểu
			}
			if pick != 0 {
				buf = buf[:len(buf)-1]
			}
		}
		return found
	}
	return walk(0)
}

// DP nhớ: f(i, open) = phần s[i..] có đóng được đúng open ngoặc đang mở không
func checkDP(s string, steps *int64) bool {
	n := len(s)
	memo := make([]int8, (n+1)*(n+2)) // 0: chưa tính, 1: sai, 2: đúng
	var f func(i, open int) bool
	f = func(i, open int) bool {
		if open < 0 {
			return false // đóng nhiều hơn mở ở một tiền tố
		}
		if i == n {
			return open == 0
		}
		key := i*(n+2) + open
		if memo[key] != 0 {
			return memo[key] == 2
		}
		*steps++ // một trạng thái mới
		var r bool
		switch s[i] {
		case '(':
			r = f(i+1, open+1)
		case ')':
			r = f(i+1, open-1)
		default:
			r = f(i+1, open-1) || f(i+1, open) || f(i+1, open+1)
		}
		memo[key] = 1
		if r {
			memo[key] = 2
		}
		return r
	}
	return f(0, 0)
}

// Hai ngăn xếp chỉ số: ")" ăn "(" gần nhất trước, hết thì ăn "*"; cuối cùng mỗi "(" còn lại cần một "*" đứng sau nó
func checkStacks(s string) bool {
	var opens, stars []int
	for i := 0; i < len(s); i++ {
		switch {
		case s[i] == '(':
			opens = append(opens, i)
		case s[i] == '*':
			stars = append(stars, i)
		case len(opens) > 0:
			opens = opens[:len(opens)-1]
		case len(stars) > 0:
			stars = stars[:len(stars)-1]
		default:
			return false // ")" không có gì để khớp
		}
	}
	for len(opens) > 0 && len(stars) > 0 {
		if opens[len(opens)-1] > stars[len(stars)-1] {
			return false // "*" đứng trước "(" thì không đóng được nó
		}
		opens = opens[:len(opens)-1]
		stars = stars[:len(stars)-1]
	}
	return len(opens) == 0
}

// Cách chính: giữ khoảng [lo, hi] các số ngoặc mở có thể có
func checkValidString(s string, steps *int64) bool {
	lo := 0 // số ngoặc mở ít nhất có thể
	hi := 0 // số ngoặc mở nhiều nhất có thể
	for i := 0; i < len(s); i++ {
		*steps++
		switch s[i] {
		case '(':
			lo++
			hi++
		case ')':
			lo--
			hi--
		default:
			lo-- // "*" là ")"
			hi++ // "*" là "("
		}
		if hi < 0 {
			return false // kể cả coi mọi "*" là "(" vẫn đóng thừa
		}
		if lo < 0 {
			lo = 0 // bỏ các cách hiểu làm số mở âm
		}
	}
	return lo == 0 // 0 nằm trong khoảng: có cách hiểu đóng hết
}

// Bản sai: không kẹp lo về 0, rồi "sửa" bằng lo <= 0
func checkNoClamp(s string) bool {
	lo, hi := 0, 0
	for i := 0; i < len(s); i++ {
		switch s[i] {
		case '(':
			lo++
			hi++
		case ')':
			lo--
			hi--
		default:
			lo--
			hi++
		}
		if hi < 0 {
			return false
		}
	}
	return lo <= 0
}

var total, good, wrong int

func gen(prefix string) {
	var x int64
	if len(prefix) > 0 {
		total++
		b := checkBrute(prefix, &x)
		if checkDP(prefix, &x) == b && checkStacks(prefix) == b && checkValidString(prefix, &x) == b {
			good++
		}
		if checkNoClamp(prefix) != b {
			wrong++
		}
	}
	if len(prefix) == 8 {
		return
	}
	for _, c := range "()*" {
		gen(prefix + string(c))
	}
}

func main() {
	cases := []struct {
		s    string
		want bool
	}{
		{"*", true},
		{")", false},
		{"*(", false},
		{"(*", true},
		{"((*", false},
		{"(()*", true},
		{"*)(*", true},
		{"(*)*)(", false},
		{"**())", true},
		{"((**)", true},
	}
	ok := 0
	var x int64
	for _, c := range cases {
		got := []bool{checkBrute(c.s, &x), checkDP(c.s, &x), checkStacks(c.s), checkValidString(c.s, &x)}
		all := true
		for _, g := range got {
			if g != c.want {
				all = false
			}
		}
		if all {
			ok++
		} else {
			fmt.Println("sai ở", c.s, got)
		}
	}
	fmt.Printf("%d/%d ca đúng\n", ok, len(cases))

	// Đối chiếu: mọi chuỗi độ dài 1–8 trên ba ký tự ( ) *
	gen("")
	fmt.Printf("%d/%d ca đúng (đối chiếu vét cạn)\n", good, total)
	fmt.Printf("Không kẹp lo: sai %d/%d ca\n", wrong, total)

	// Đo ở giới hạn n = 100: 99 dấu * rồi một "(", đáp án sai nên DP phải đi hết mọi trạng thái
	big := strings.Repeat("*", 99) + "("
	var dc, gc, bc int64
	t0 := time.Now()
	d := checkDP(big, &dc)
	dpMs := float64(time.Since(t0).Nanoseconds()) / 1e6
	t0 = time.Now()
	g := checkValidString(big, &gc)
	greedyMs := float64(time.Since(t0).Nanoseconds()) / 1e6
	fmt.Printf("n = 100, đáp án %v/%v: DP %d trạng thái (%.2f ms), khoảng [lo, hi] %d bước (%.3f ms)\n", d, g, dc, dpMs, gc, greedyMs)

	// Vét cạn ở cỡ nhỏ: 12 dấu * rồi một "("
	small := strings.Repeat("*", 12) + "("
	t0 = time.Now()
	b := checkBrute(small, &bc)
	bruteMs := float64(time.Since(t0).Nanoseconds()) / 1e6
	fmt.Printf("n = 13, đáp án %v: vét cạn %d cách hiểu (%.1f ms)\n", b, bc, bruteMs)
}
