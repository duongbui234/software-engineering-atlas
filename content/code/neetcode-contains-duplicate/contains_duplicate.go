// NC-01 Contains Duplicate (LeetCode 217), Go.
// Chạy: go run contains_duplicate.go
package main

import (
	"fmt"
	"slices"
)

// map[int]struct{} là cách viết "set" trong Go: struct{} không chiếm byte nào.
func containsDuplicate(nums []int) bool {
	seen := make(map[int]struct{}, len(nums)) // cấp sẵn chỗ, tránh nới bảng nhiều lần
	for _, x := range nums {
		if _, ok := seen[x]; ok {
			return true
		}
		seen[x] = struct{}{}
	}
	return false
}

func containsDuplicateSorted(nums []int) bool {
	a := slices.Clone(nums) // đừng sắp xếp đè lên slice của người gọi
	slices.Sort(a)          // pdqsort từ Go 1.19
	for i := 1; i < len(a); i++ {
		if a[i] == a[i-1] {
			return true
		}
	}
	return false
}

func main() {
	cases := []struct {
		nums []int
		want bool
	}{
		{[]int{1, 2, 3, 1}, true},
		{[]int{1, 2, 3, 4}, false},
		{[]int{1, 1, 1, 3, 3, 4, 3, 2, 4, 2}, true},
		{[]int{}, false},
	}
	for _, c := range cases {
		a, b := containsDuplicate(c.nums), containsDuplicateSorted(c.nums)
		ok := "✓"
		if a != c.want || b != c.want {
			ok = "✗ SAI"
		}
		fmt.Printf("%v → set %v, sắp xếp %v %s\n", c.nums, a, b, ok)
	}
}
