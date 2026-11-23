// LeetCode 33, Search in Rotated Sorted Array: ba cách và test.
// Chạy: go run search_rotated.go
package main

import (
	"fmt"
	"slices"
	"sort"
)

func linearScan(nums []int, target int) int {
	return slices.Index(nums, target)
}

func onePass(nums []int, target int) int {
	lo, hi := 0, len(nums)-1
	for lo <= hi {
		mid := lo + (hi-lo)/2
		if nums[mid] == target {
			return mid
		}
		if nums[lo] <= nums[mid] {
			if nums[lo] <= target && target < nums[mid] {
				hi = mid - 1
			} else {
				lo = mid + 1
			}
		} else {
			if nums[mid] < target && target <= nums[hi] {
				lo = mid + 1
			} else {
				hi = mid - 1
			}
		}
	}
	return -1
}

func pivotThenSearch(nums []int, target int) int {
	n := len(nums)
	pivot := sort.Search(n, func(i int) bool { return nums[i] < nums[0] }) // chỉ số đầu tiên nhỏ hơn nums[0]; = n nếu không xoay
	a, b := 0, pivot
	if pivot < n && target < nums[0] {
		a, b = pivot, n
	}
	i := a + sort.SearchInts(nums[a:b], target) // nums[a:b] là slice con, không sao chép
	if i < b && nums[i] == target {
		return i
	}
	return -1
}

func main() {
	cases := []struct {
		nums         []int
		target, want int
	}{
		{[]int{4, 5, 6, 7, 0, 1, 2}, 0, 4}, {[]int{4, 5, 6, 7, 0, 1, 2}, 3, -1}, {[]int{1}, 0, -1}, {[]int{1}, 1, 0},
		{[]int{3, 1}, 1, 1}, {[]int{5, 1, 3}, 3, 2}, {[]int{1, 3}, 3, 1}, {[]int{6, 7, 1, 2, 3, 4, 5}, 6, 0}, {[]int{1, 2, 3, 4, 5}, 4, 3},
	}
	for _, f := range []struct {
		name string
		fn   func([]int, int) int
	}{{"linearScan", linearScan}, {"onePass", onePass}, {"pivotThenSearch", pivotThenSearch}} {
		ok := 0
		for _, c := range cases {
			if f.fn(c.nums, c.target) == c.want {
				ok++
			}
		}
		fmt.Printf("%-16s %d/%d ca đúng\n", f.name, ok, len(cases))
	}
}
