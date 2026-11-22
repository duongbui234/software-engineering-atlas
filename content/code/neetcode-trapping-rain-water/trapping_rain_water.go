// LeetCode 42, Trapping Rain Water: bốn cách và test.
// Chạy: go run trapping_rain_water.go
package main

import "fmt"

func bruteForce(h []int) int {
	total := 0
	for i := range h {
		left, right := 0, 0
		for k := 0; k <= i; k++ {
			left = max(left, h[k])
		}
		for k := i; k < len(h); k++ {
			right = max(right, h[k])
		}
		total += min(left, right) - h[i]
	}
	return total
}

func prefixMax(h []int) int {
	n := len(h)
	if n == 0 {
		return 0 // h[0] với slice rỗng sẽ panic: index out of range
	}
	left, right := make([]int, n), make([]int, n)
	left[0], right[n-1] = h[0], h[n-1]
	for i := 1; i < n; i++ {
		left[i] = max(left[i-1], h[i])
	}
	for i := n - 2; i >= 0; i-- {
		right[i] = max(right[i+1], h[i])
	}
	total := 0
	for i := range h {
		total += min(left[i], right[i]) - h[i]
	}
	return total
}

func twoPointers(h []int) int {
	i, j, leftMax, rightMax, total := 0, len(h)-1, 0, 0, 0
	for i < j {
		leftMax, rightMax = max(leftMax, h[i]), max(rightMax, h[j])
		if leftMax < rightMax {
			total += leftMax - h[i]
			i++
		} else {
			total += rightMax - h[j]
			j--
		}
	}
	return total
}

func monotonicStack(h []int) int {
	stack, total := []int{}, 0
	for i, x := range h {
		for len(stack) > 0 && x > h[stack[len(stack)-1]] {
			bottom := stack[len(stack)-1]
			stack = stack[:len(stack)-1]
			if len(stack) == 0 {
				break
			}
			l := stack[len(stack)-1]
			total += (i - l - 1) * (min(h[l], x) - h[bottom])
		}
		stack = append(stack, i)
	}
	return total
}

func main() {
	cases := []struct {
		h    []int
		want int
	}{{[]int{0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1}, 6}, {[]int{4, 2, 0, 3, 2, 5}, 9}, {[]int{}, 0}, {[]int{3}, 0},
		{[]int{1, 2, 3, 4}, 0}, {[]int{5, 4, 1, 2}, 1}, {[]int{2, 0, 2}, 2}, {[]int{3, 0, 0, 2, 0, 4}, 10}}
	for _, f := range []struct {
		name string
		fn   func([]int) int
	}{{"bruteForce", bruteForce}, {"prefixMax", prefixMax}, {"twoPointers", twoPointers}, {"monotonicStack", monotonicStack}} {
		ok := 0
		for _, c := range cases {
			if f.fn(c.h) == c.want {
				ok++
			}
		}
		fmt.Printf("%-15s %d/%d ca đúng\n", f.name, ok, len(cases))
	}
}
