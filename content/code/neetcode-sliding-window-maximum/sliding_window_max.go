// LeetCode 239, Sliding Window Maximum: ba cách và test.
// Chạy: go run sliding_window_max.go
package main

import (
	"fmt"
	"slices"
)

func bruteForce(nums []int, k int) []int {
	out := []int{}
	for i := 0; i+k <= len(nums); i++ {
		out = append(out, slices.Max(nums[i:i+k]))
	}
	return out
}

func blocks(nums []int, k int) []int {
	n := len(nums)
	pre, suf := slices.Clone(nums), slices.Clone(nums)
	for i := 1; i < n; i++ {
		if i%k != 0 {
			pre[i] = max(pre[i-1], nums[i])
		}
	}
	for i := n - 2; i >= 0; i-- {
		if (i+1)%k != 0 {
			suf[i] = max(suf[i+1], nums[i])
		}
	}
	out := make([]int, 0, n-k+1)
	for i := 0; i+k <= n; i++ {
		out = append(out, max(suf[i], pre[i+k-1]))
	}
	return out
}

func monotonicDeque(nums []int, k int) []int {
	// slice + chỉ số head: q[head:] là hàng đợi. Viết q = q[1:] cũng O(1), nhưng mảng nền cũ vẫn bị giữ trong bộ nhớ.
	q := make([]int, 0, len(nums))
	head := 0
	out := make([]int, 0, len(nums)-k+1)
	for i, x := range nums {
		if head < len(q) && q[head] <= i-k {
			head++
		}
		for len(q) > head && nums[q[len(q)-1]] <= x {
			q = q[:len(q)-1]
		}
		q = append(q, i)
		if i >= k-1 {
			out = append(out, nums[q[head]])
		}
	}
	return out
}

func main() {
	cases := []struct {
		nums []int
		k    int
		want []int
	}{
		{[]int{1, 3, -1, -3, 5, 3, 6, 7}, 3, []int{3, 3, 5, 5, 6, 7}}, {[]int{1}, 1, []int{1}}, {[]int{9, 8, 7, 6, 5}, 2, []int{9, 8, 7, 6}},
		{[]int{1, 2, 3, 4}, 4, []int{4}}, {[]int{4, 4, 4, 1}, 2, []int{4, 4, 4}}, {[]int{-7, -8, 7, 5, 7, 1, 6, 0}, 4, []int{7, 7, 7, 7, 7}}, {[]int{5, 1, 2, 3}, 2, []int{5, 2, 3}},
	}
	for _, f := range []struct {
		name string
		fn   func([]int, int) []int
	}{{"bruteForce", bruteForce}, {"blocks", blocks}, {"monotonicDeque", monotonicDeque}} {
		ok := 0
		for _, c := range cases {
			if slices.Equal(f.fn(c.nums, c.k), c.want) {
				ok++
			}
		}
		fmt.Printf("%-15s %d/%d ca đúng\n", f.name, ok, len(cases))
	}
}
