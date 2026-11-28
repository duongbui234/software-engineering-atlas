// Palindrome Partitioning (LeetCode 131): cắt tại mọi tiền tố đối xứng của phần còn lại
// Chạy: go run cuts.go
package main

import (
	"fmt"
	"slices"
	"sort"
	"strings"
)

// Kiểm tra s[lo..hi] bằng hai con trỏ, đếm số phép so ký tự
func isPalindrome(s string, lo, hi int, compares *int) bool {
	for lo < hi {
		*compares++
		if s[lo] != s[hi] {
			return false
		}
		lo++
		hi--
	}
	return true
}

// Cách 1: ở mỗi vị trí start, thử mọi điểm cắt end và kiểm tra lại đoạn s[start..end] mỗi lần
func partitionCheck(s string, compares *int) [][]string {
	result := [][]string{}
	path := []string{}
	var walk func(start int)
	walk = func(start int) {
		if start == len(s) {
			result = append(result, slices.Clone(path))
			return
		}
		for end := start; end < len(s); end++ {
			if !isPalindrome(s, start, end, compares) {
				continue
			}
			path = append(path, s[start:end+1])
			walk(end + 1)
			path = path[:len(path)-1]
		}
	}
	walk(0)
	return result
}

// Cách chính: dựng bảng isPal[i][j] một lần (i đi từ phải sang trái), rồi quay lui chỉ tra bảng
func partition(s string, compares *int) [][]string {
	n := len(s)
	isPal := make([][]bool, n)
	for i := range isPal {
		isPal[i] = make([]bool, n)
	}
	for i := n - 1; i >= 0; i-- {
		for j := i; j < n; j++ {
			*compares++
			// đối xứng khi hai đầu bằng nhau và phần bên trong (ngắn hơn, đã tính) cũng đối xứng
			isPal[i][j] = s[i] == s[j] && (j-i < 2 || isPal[i+1][j-1])
		}
	}
	result := [][]string{}
	path := []string{}
	var walk func(start int)
	walk = func(start int) {
		if start == n {
			result = append(result, slices.Clone(path)) // cắt hết chuỗi: ghi một cách chia
			return
		}
		for end := start; end < n; end++ {
			if !isPal[start][end] {
				continue // mảnh đầu không đối xứng: bỏ cả nhánh
			}
			path = append(path, s[start:end+1])
			walk(end + 1)
			path = path[:len(path)-1]
		}
	}
	walk(0)
	return result
}

func reverse(p string) string {
	b := []byte(p)
	slices.Reverse(b)
	return string(b)
}

// Trọng tài độc lập: vét mọi 2^(n-1) cách đặt vết cắt, giữ cách mà mọi mảnh đọc xuôi ngược như nhau
func bruteForce(s string) [][]string {
	n := len(s)
	result := [][]string{}
	for mask := 0; mask < 1<<(n-1); mask++ {
		parts := []string{}
		from := 0
		for gap := 0; gap < n-1; gap++ {
			if mask&(1<<gap) != 0 {
				parts = append(parts, s[from:gap+1])
				from = gap + 1
			}
		}
		parts = append(parts, s[from:])
		all := true
		for _, p := range parts {
			if p != reverse(p) {
				all = false
				break
			}
		}
		if all {
			result = append(result, parts)
		}
	}
	return result
}

func canonical(list [][]string) string {
	keys := make([]string, len(list))
	for i, p := range list {
		keys[i] = strings.Join(p, "/")
	}
	sort.Strings(keys)
	return strings.Join(keys, "|")
}

func check(s string, expected [][]string) bool {
	if expected == nil {
		expected = bruteForce(s)
	}
	want := canonical(expected)
	compares := 0
	for _, got := range [][][]string{partition(s, &compares), partitionCheck(s, &compares)} {
		distinct := map[string]bool{}
		for _, p := range got {
			distinct[strings.Join(p, "/")] = true
		}
		if len(distinct) != len(got) || canonical(got) != want {
			return false
		}
	}
	return true
}

func main() {
	type tc struct {
		s        string
		expected [][]string
	}
	cases := []tc{
		{"x", [][]string{{"x"}}},
		{"noon", [][]string{{"n", "o", "o", "n"}, {"n", "oo", "n"}, {"noon"}}},
		{"abc", [][]string{{"a", "b", "c"}}},
		{"aaaa", nil},
		{"level", nil},
		{"racecar", nil},
		{"abcdefghijklmnop", [][]string{strings.Split("abcdefghijklmnop", "")}},
		{strings.Repeat("a", 16), nil},
	}
	ok := 0
	for _, c := range cases {
		if check(c.s, c.expected) {
			ok++
		} else {
			fmt.Println("sai ở", c.s)
		}
	}
	fmt.Printf("%d/%d ca đúng\n", ok, len(cases))

	// Đối chiếu: mọi chuỗi trên {a, b} dài 1–9
	total, good := 0, 0
	var build func(s string)
	build = func(s string) {
		if len(s) > 0 {
			total++
			if check(s, nil) {
				good++
			}
		}
		if len(s) == 9 {
			return
		}
		build(s + "a")
		build(s + "b")
	}
	build("")
	fmt.Printf("%d/%d ca đúng (đối chiếu vét mọi cách đặt vết cắt)\n", good, total)

	sixteen := strings.Repeat("a", 16)
	viaCheck := 0
	count := len(partitionCheck(sixteen, &viaCheck))
	viaTable := 0
	partition(sixteen, &viaTable)
	fmt.Printf("16 chữ a: %d cách chia; kiểm tra lại mỗi lần %d phép so, bảng isPal %d phép so\n", count, viaCheck, viaTable)
}
