// LeetCode 238, Product of Array Except Self: bốn cách và test.
// Chạy: go run product_except_self.go
package main

import (
	"fmt"
	"slices"
)

func bruteForce(nums []int) []int {
	out := make([]int, len(nums))
	for i := range nums {
		p := 1
		for j, x := range nums {
			if j != i {
				p *= x
			}
		}
		out[i] = p
	}
	return out
}

func divisionZeroAware(nums []int) []int {
	zeros, p := 0, 1
	for _, x := range nums {
		if x == 0 {
			zeros++
		} else {
			p *= x
		}
	}
	out := make([]int, len(nums)) // make điền sẵn 0: ca ≥ 2 số 0 không cần làm gì thêm
	for i, x := range nums {
		switch {
		case zeros == 1 && x == 0:
			out[i] = p
		case zeros == 0:
			out[i] = p / x // chia số nguyên cho 0 thì Go panic, nên phải loại số 0 trước
		}
	}
	return out
}

func prefixSuffixArrays(nums []int) []int {
	n := len(nums)
	prefix, suffix := make([]int, n), make([]int, n)
	prefix[0], suffix[n-1] = 1, 1
	for i := 1; i < n; i++ {
		prefix[i] = prefix[i-1] * nums[i-1]
	}
	for i := n - 2; i >= 0; i-- {
		suffix[i] = suffix[i+1] * nums[i+1]
	}
	out := make([]int, n)
	for i := range out {
		out[i] = prefix[i] * suffix[i]
	}
	return out
}

func prefixSuffixInPlace(nums []int) []int {
	n := len(nums)
	out := make([]int, n)
	left := 1
	for i := 0; i < n; i++ {
		out[i] = left
		left *= nums[i]
	}
	right := 1
	for i := n - 1; i >= 0; i-- {
		out[i] *= right
		right *= nums[i]
	}
	return out
}

func main() {
	cases := []struct{ nums, want []int }{
		{[]int{1, 2, 3, 4}, []int{24, 12, 8, 6}}, {[]int{-1, 1, 0, -3, 3}, []int{0, 0, 9, 0, 0}}, {[]int{2, 3}, []int{3, 2}},
		{[]int{0, 0, 5}, []int{0, 0, 0}}, {[]int{0, 4, 5}, []int{20, 0, 0}}, {[]int{-2, -3, 4}, []int{-12, -8, 6}},
	}
	for _, f := range []struct {
		name string
		fn   func([]int) []int
	}{{"bruteForce", bruteForce}, {"divisionZeroAware", divisionZeroAware}, {"prefixSuffixArrays", prefixSuffixArrays}, {"prefixSuffixInPlace", prefixSuffixInPlace}} {
		ok := 0
		for _, c := range cases {
			if slices.Equal(f.fn(c.nums), c.want) {
				ok++
			}
		}
		fmt.Printf("%-20s %d/%d ca đúng\n", f.name, ok, len(cases))
	}
}
