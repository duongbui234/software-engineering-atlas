// LeetCode 739, Daily Temperatures: ba cách và test.
// Chạy: go run daily_temperatures.go
package main

import (
	"fmt"
	"slices"
)

func bruteForce(t []int) []int {
	out := make([]int, len(t))
	for i := range t {
		for j := i + 1; j < len(t); j++ {
			if t[j] > t[i] {
				out[i] = j - i
				break
			}
		}
	}
	return out
}

func monotonicStack(t []int) []int {
	out := make([]int, len(t))
	stack := make([]int, 0, len(t)) // cấp sẵn sức chứa: append không phải cấp phát lại
	for i, x := range t {
		for len(stack) > 0 && x > t[stack[len(stack)-1]] {
			j := stack[len(stack)-1]
			stack = stack[:len(stack)-1] // pop bằng cắt slice
			out[j] = i - j
		}
		stack = append(stack, i)
	}
	return out
}

func jumpFromRight(t []int) []int {
	n := len(t)
	out := make([]int, n)
	for i := n - 2; i >= 0; i-- {
		j := i + 1
		for j < n && t[j] <= t[i] {
			if out[j] == 0 {
				j = n
				break
			}
			j += out[j]
		}
		if j < n {
			out[i] = j - i
		}
	}
	return out
}

func main() {
	cases := []struct{ t, want []int }{
		{[]int{73, 74, 75, 71, 69, 72, 76, 73}, []int{1, 1, 4, 2, 1, 1, 0, 0}}, {[]int{30, 40, 50, 60}, []int{1, 1, 1, 0}},
		{[]int{30, 60, 90}, []int{1, 1, 0}}, {[]int{90, 80, 70}, []int{0, 0, 0}}, {[]int{70, 70, 71}, []int{2, 1, 0}}, {[]int{50}, []int{0}},
		{[]int{55, 38, 53, 81, 61, 93, 97, 32, 43, 78}, []int{3, 1, 1, 2, 1, 1, 0, 1, 1, 0}},
	}
	for _, f := range []struct {
		name string
		fn   func([]int) []int
	}{{"bruteForce", bruteForce}, {"monotonicStack", monotonicStack}, {"jumpFromRight", jumpFromRight}} {
		ok := 0
		for _, c := range cases {
			if slices.Equal(f.fn(c.t), c.want) {
				ok++
			}
		}
		fmt.Printf("%-15s %d/%d ca đúng\n", f.name, ok, len(cases))
	}
}
