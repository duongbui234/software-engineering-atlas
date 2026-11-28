// Letter Combinations of a Phone Number (LeetCode 17): ba cách cho cùng một bài.
// Chạy: go run keypad.go
package main

import (
	"fmt"
	"strings"
)

var keys = map[byte]string{
	'2': "abc", '3': "def", '4': "ghi", '5': "jkl",
	'6': "mno", '7': "pqrs", '8': "tuv", '9': "wxyz",
}

var calls int

// Cách 1: quay lui với một bộ đệm byte, thêm rồi gỡ ở mỗi tầng.
func combineBacktrack(digits string) []string {
	result := []string{}
	if len(digits) == 0 {
		return result // chuỗi rỗng cho [], không phải [""]
	}
	buffer := make([]byte, 0, len(digits))
	var walk func(index int)
	walk = func(index int) {
		calls++
		if index == len(digits) {
			result = append(result, string(buffer))
			return
		}
		letters := keys[digits[index]]
		for i := 0; i < len(letters); i++ {
			buffer = append(buffer, letters[i])
			walk(index + 1)
			buffer = buffer[:len(buffer)-1]
		}
	}
	walk(0)
	return result
}

// Cách 2: dựng dần theo từng chữ số, nối mỗi tiền tố với mọi chữ cái của phím kế tiếp.
func combineIterative(digits string) []string {
	if len(digits) == 0 {
		return []string{}
	}
	layer := []string{""}
	for i := 0; i < len(digits); i++ {
		letters := keys[digits[i]]
		next := make([]string, 0, len(layer)*len(letters))
		for _, prefix := range layer {
			for j := 0; j < len(letters); j++ {
				next = append(next, prefix+string(letters[j]))
			}
		}
		layer = next
	}
	return layer
}

// Cách 3: bộ đếm hỗn cơ số, mỗi vị trí đếm từ 0 tới số chữ cái của phím đó.
func combineCounter(digits string) []string {
	result := []string{}
	n := len(digits)
	if n == 0 {
		return result
	}
	odometer := make([]int, n)
	word := make([]byte, n)
	for {
		for i := 0; i < n; i++ {
			word[i] = keys[digits[i]][odometer[i]]
		}
		result = append(result, string(word))
		pos := n - 1
		for pos >= 0 && odometer[pos] == len(keys[digits[pos]])-1 {
			odometer[pos] = 0
			pos--
		}
		if pos < 0 {
			return result
		}
		odometer[pos]++
	}
}

type testCase struct {
	digits      string
	count       int
	first, last string
	full        string // "-" nghĩa là không so cả danh sách
}

var cases = []testCase{
	{"23", 9, "ad", "cf", "ad,ae,af,bd,be,bf,cd,ce,cf"},
	{"", 0, "", "", ""},
	{"2", 3, "a", "c", "a,b,c"},
	{"7", 4, "p", "s", "p,q,r,s"},
	{"9", 4, "w", "z", "w,x,y,z"},
	{"22", 9, "aa", "cc", "aa,ab,ac,ba,bb,bc,ca,cb,cc"},
	{"79", 16, "pw", "sz", "-"},
	{"56", 9, "jm", "lo", "-"},
	{"234", 27, "adg", "cfi", "-"},
	{"2345", 81, "adgj", "cfil", "-"},
	{"7999", 256, "pwww", "szzz", "-"},
}

func fits(got []string, c testCase) bool {
	if len(got) != c.count {
		return false
	}
	if c.count > 0 && (got[0] != c.first || got[c.count-1] != c.last) {
		return false
	}
	if c.full != "-" && strings.Join(got, ",") != c.full {
		return false
	}
	seen := map[string]bool{}
	for _, w := range got {
		if seen[w] {
			return false
		}
		seen[w] = true
	}
	return true
}

func main() {
	ok := 0
	for _, c := range cases {
		if fits(combineBacktrack(c.digits), c) && fits(combineIterative(c.digits), c) && fits(combineCounter(c.digits), c) {
			ok++
		} else {
			fmt.Printf("sai ở %q\n", c.digits)
		}
	}
	fmt.Printf("%d/%d ca đúng\n", ok, len(cases))

	// Đối chiếu: mọi chuỗi chữ số 2–9 dài 0–4, so với cách dựng lặp.
	total, same := 0, 0
	var each func(prefix string)
	each = func(prefix string) {
		total++
		want := strings.Join(combineIterative(prefix), ",")
		if strings.Join(combineBacktrack(prefix), ",") == want && strings.Join(combineCounter(prefix), ",") == want {
			same++
		}
		if len(prefix) < 4 {
			for _, d := range "23456789" {
				each(prefix + string(d))
			}
		}
	}
	each("")
	fmt.Printf("%d/%d ca đúng (đối chiếu tích Descartes lặp)\n", same, total)

	calls = 0
	sample := combineBacktrack("7999")
	fmt.Printf("7999: %d tổ hợp, %d lượt gọi quay lui\n", len(sample), calls)
}
