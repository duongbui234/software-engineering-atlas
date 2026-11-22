// LeetCode 11, Container With Most Water: hai cách và test.
// Chạy: go run container_most_water.go
package main

import "fmt"

func bruteForce(h []int) int {
	best := 0
	for i := range h {
		for j := i + 1; j < len(h); j++ {
			best = max(best, (j-i)*min(h[i], h[j])) // min, max có sẵn từ Go 1.21
		}
	}
	return best
}

func twoPointers(h []int) int {
	i, j, best := 0, len(h)-1, 0
	for i < j {
		best = max(best, (j-i)*min(h[i], h[j]))
		if h[i] < h[j] {
			i++
		} else {
			j--
		}
	}
	return best
}

func main() {
	cases := []struct {
		h    []int
		want int
	}{{[]int{1, 8, 6, 2, 5, 4, 8, 3, 7}, 49}, {[]int{1, 1}, 1}, {[]int{4, 3, 2, 1, 4}, 16}, {[]int{1, 2, 1}, 2},
		{[]int{2, 3, 4, 5, 18, 17, 6}, 17}, {[]int{0, 0, 0}, 0}, {[]int{1, 3, 2, 5, 25, 24, 5}, 24}}
	for _, f := range []struct {
		name string
		fn   func([]int) int
	}{{"bruteForce", bruteForce}, {"twoPointers", twoPointers}} {
		ok := 0
		for _, c := range cases {
			if f.fn(c.h) == c.want {
				ok++
			}
		}
		fmt.Printf("%-12s %d/%d ca đúng\n", f.name, ok, len(cases))
	}
}
