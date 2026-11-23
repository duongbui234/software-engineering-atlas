// LeetCode 84, Largest Rectangle in Histogram: các cách giải và test.
// Chạy: go run largest_rectangle.go
package main

import "fmt"

func bruteForce(h []int) int {
	best := 0
	for i := range h {
		low := h[i]
		for j := i; j < len(h); j++ {
			low = min(low, h[j])
			best = max(best, low*(j-i+1))
		}
	}
	return best
}

func divideConquer(h []int, lo, hi int) int {
	if lo > hi {
		return 0
	}
	m := lo
	for i := lo + 1; i <= hi; i++ {
		if h[i] < h[m] {
			m = i
		}
	}
	return max(h[m]*(hi-lo+1), divideConquer(h, lo, m-1), divideConquer(h, m+1, hi))
}

func monotonicStack(h []int) int {
	st := []int{}
	best := 0
	for i := 0; i <= len(h); i++ {
		cur := 0 // lính canh khi i == len(h)
		if i < len(h) {
			cur = h[i]
		}
		for len(st) > 0 && h[st[len(st)-1]] >= cur {
			height := h[st[len(st)-1]]
			st = st[:len(st)-1]
			left := -1
			if len(st) > 0 {
				left = st[len(st)-1]
			}
			best = max(best, height*(i-left-1))
		}
		st = append(st, i)
	}
	return best
}

func main() {
	cases := []struct {
		h    []int
		want int
	}{
		{[]int{2, 1, 5, 6, 2, 3}, 10}, {[]int{2, 4}, 4}, {[]int{1}, 1}, {[]int{0, 0}, 0}, {[]int{1, 2, 3, 4, 5}, 9},
		{[]int{5, 4, 3, 2, 1}, 9}, {[]int{2, 2, 2, 2}, 8}, {[]int{4, 2, 0, 3, 2, 5}, 6}, {[]int{6, 2, 5, 4, 5, 1, 6}, 12},
	}
	for _, f := range []struct {
		name string
		fn   func([]int) int
	}{{"bruteForce", bruteForce}, {"divideConquer", func(h []int) int { return divideConquer(h, 0, len(h)-1) }}, {"monotonicStack", monotonicStack}} {
		ok := 0
		for _, c := range cases {
			if f.fn(c.h) == c.want {
				ok++
			}
		}
		fmt.Printf("%-15s %d/%d ca đúng\n", f.name, ok, len(cases))
	}
	h := make([]int, 100_000)
	for i := range h {
		h[i] = i + 1
	}
	// Ngăn xếp của goroutine tự nới khi cần, nên đệ quy 10⁵ tầng vẫn chạy (chỉ chậm vì O(n²)).
	fmt.Println("\nchia để trị, 100 000 cột tăng dần:", divideConquer(h, 0, len(h)-1))
}
