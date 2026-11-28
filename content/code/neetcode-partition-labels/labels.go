// Partition Labels (LeetCode 763): vét cạn từng vết cắt, gộp khoảng [đầu, cuối], tham lam một lượt
// Chạy: go run labels.go
package main

import (
	"fmt"
	"slices"
	"sort"
	"strings"
	"time"
)

// Vét cạn: vết cắt sau vị trí i an toàn khi không chữ nào nằm ở cả hai bên
func partitionBrute(s string, steps *int64) []int {
	n := len(s)
	sizes := []int{}
	prev := -1 // vết cắt an toàn gần nhất
	for i := 0; i < n; i++ {
		var left, right [26]bool
		for j := 0; j <= i; j++ {
			left[s[j]-'a'] = true
		}
		for j := i + 1; j < n; j++ {
			right[s[j]-'a'] = true
		}
		*steps += int64(n)
		safe := true
		for c := 0; c < 26; c++ {
			if left[c] && right[c] {
				safe = false
			}
		}
		if safe {
			sizes = append(sizes, i-prev) // cắt ở mọi chỗ an toàn
			prev = i
		}
	}
	return sizes
}

// Gộp khoảng: mỗi chữ là một khoảng [lần đầu, lần cuối]; khoảng chồng nhau phải chung một phần
func partitionIntervals(s string) []int {
	var first, last [26]int
	for c := range first {
		first[c] = -1
	}
	for i := 0; i < len(s); i++ {
		c := s[i] - 'a'
		if first[c] == -1 {
			first[c] = i
		}
		last[c] = i
	}
	spans := [][2]int{}
	for c := 0; c < 26; c++ {
		if first[c] != -1 {
			spans = append(spans, [2]int{first[c], last[c]})
		}
	}
	sort.Slice(spans, func(a, b int) bool { return spans[a][0] < spans[b][0] })
	sizes := []int{}
	lo, hi := spans[0][0], spans[0][1]
	for _, sp := range spans[1:] {
		if sp[0] > hi {
			sizes = append(sizes, hi-lo+1) // khoảng mới không chạm khoảng đang gộp: chốt một phần
			lo, hi = sp[0], sp[1]
		} else {
			hi = max(hi, sp[1])
		}
	}
	return append(sizes, hi-lo+1)
}

// Cách chính: bảng lần xuất hiện cuối, kéo end tới lần cuối xa nhất, cắt khi i chạm end
func partitionLabels(s string, steps *int64) []int {
	var last [26]int
	for i := 0; i < len(s); i++ {
		last[s[i]-'a'] = i // s[i] là byte, không phải rune
		*steps++
	}
	sizes := []int{}
	start, end := 0, 0 // phần hiện tại phải kéo ít nhất tới end
	for i := 0; i < len(s); i++ {
		end = max(end, last[s[i]-'a'])
		*steps++
		if i == end {
			sizes = append(sizes, end-start+1) // mọi chữ trong phần đã hết: cắt sớm nhất có thể
			start = i + 1
		}
	}
	return sizes
}

// Bản sai: cắt khi chữ hiện tại hết, quên các chữ khác trong phần
func partitionNoMax(s string) []int {
	var last [26]int
	for i := 0; i < len(s); i++ {
		last[s[i]-'a'] = i
	}
	sizes := []int{}
	start := 0
	for i := 0; i < len(s); i++ {
		if last[s[i]-'a'] == i {
			sizes = append(sizes, i-start+1)
			start = i + 1
		}
	}
	return sizes
}

func main() {
	var dummy int64
	cases := []struct {
		s    string
		want []int
	}{
		{"a", []int{1}},
		{"abc", []int{1, 1, 1}},
		{"aaaa", []int{4}},
		{"abca", []int{4}},
		{"abbacdc", []int{4, 3}},
		{"xyzzyxw", []int{6, 1}},
		{"aabbccab", []int{8}},
		{"qwqeer", []int{3, 2, 1}},
	}
	ok := 0
	for _, c := range cases {
		b, iv, g := partitionBrute(c.s, &dummy), partitionIntervals(c.s), partitionLabels(c.s, &dummy)
		if slices.Equal(b, c.want) && slices.Equal(iv, c.want) && slices.Equal(g, c.want) {
			ok++
		} else {
			fmt.Println("sai ở", c.s, b, iv, g)
		}
	}
	fmt.Printf("%d/%d ca đúng\n", ok, len(cases))

	// Đối chiếu: mọi chuỗi dài 1–7 trên bảng chữ {a, b, c}
	total, good, wrong := 0, 0, 0
	var walk func(s string)
	walk = func(s string) {
		if len(s) > 0 {
			total++
			b := partitionBrute(s, &dummy)
			if slices.Equal(b, partitionIntervals(s)) && slices.Equal(b, partitionLabels(s, &dummy)) {
				good++
			}
			if !slices.Equal(b, partitionNoMax(s)) {
				wrong++
			}
		}
		if len(s) == 7 {
			return
		}
		for _, ch := range "abc" {
			walk(s + string(ch))
		}
	}
	walk("")
	fmt.Printf("%d/%d ca đúng (đối chiếu vét cạn)\n", good, total)
	fmt.Printf("Cắt khi chữ hiện tại hết (bỏ max): sai %d/%d ca\n", wrong, total)

	// Đo: n = 10000, 5 khối 2000 ký tự, khối k chỉ dùng 5 chữ của riêng nó
	n := 10000
	var sb strings.Builder
	for i := 0; i < n; i++ {
		sb.WriteByte(byte('a' + 5*(i/2000) + (i*3)%5))
	}
	big := sb.String()
	var bs, gs int64
	t0 := time.Now()
	b := partitionBrute(big, &bs)
	bruteMs := float64(time.Since(t0).Microseconds()) / 1000
	t0 = time.Now()
	g := partitionLabels(big, &gs)
	greedyMs := float64(time.Since(t0).Nanoseconds()) / 1e6
	match := "lệch"
	if slices.Equal(b, g) {
		match = "khớp"
	}
	fmt.Printf("n = %d, %d phần (%s): vét cạn %d bước (%.1f ms), tham lam %d bước (%.2f ms)\n", n, len(g), match, bs, bruteMs, gs, greedyMs)
}
