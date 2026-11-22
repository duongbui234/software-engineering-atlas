// LeetCode 128, Longest Consecutive Sequence: ba cách và test.
// Chạy: go run longest_consecutive.go
package main

import (
	"fmt"
	"slices"
)

func bruteForce(nums []int) int {
	best := 0
	for _, x := range nums {
		length := 1
		for slices.Contains(nums, x+length) { // Contains duyệt cả slice: O(n) mỗi lần
			length++
		}
		best = max(best, length)
	}
	return best
}

func sortScan(nums []int) int {
	if len(nums) == 0 {
		return 0
	}
	a := slices.Clone(nums) // slices.Sort sửa tại chỗ; sao chép để không đụng mảng của người gọi
	slices.Sort(a)
	best, length := 1, 1
	for i := 1; i < len(a); i++ {
		if a[i] == a[i-1] {
			continue // số trùng: bỏ qua, không đứt dãy
		}
		if a[i] == a[i-1]+1 {
			length++
		} else {
			length = 1
		}
		best = max(best, length)
	}
	return best
}

func hashSet(nums []int) int {
	all := make(map[int]struct{}, len(nums))
	for _, x := range nums {
		all[x] = struct{}{}
	}
	best := 0
	for x := range all { // thứ tự duyệt map ngẫu nhiên mỗi lần chạy; kết quả không phụ thuộc thứ tự
		if _, ok := all[x-1]; ok {
			continue
		}
		length := 1
		for {
			if _, ok := all[x+length]; !ok {
				break
			}
			length++
		}
		best = max(best, length)
	}
	return best
}

func main() {
	cases := []struct {
		nums []int
		want int
	}{
		{[]int{100, 4, 200, 1, 3, 2}, 4}, {[]int{0, 3, 7, 2, 5, 8, 4, 6, 0, 1}, 9}, {[]int{1, 0, 1, 2}, 3},
		{[]int{}, 0}, {[]int{7}, 1}, {[]int{-3, -1, -2, 5}, 3}, {[]int{9, 10, 8}, 3},
	}
	for _, f := range []struct {
		name string
		fn   func([]int) int
	}{{"bruteForce", bruteForce}, {"sortScan", sortScan}, {"hashSet", hashSet}} {
		ok := 0
		for _, c := range cases {
			if f.fn(c.nums) == c.want {
				ok++
			}
		}
		fmt.Printf("%-12s %d/%d ca đúng\n", f.name, ok, len(cases))
	}
}
