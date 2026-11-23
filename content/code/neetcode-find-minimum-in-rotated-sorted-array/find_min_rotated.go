// LeetCode 153, Find Minimum in Rotated Sorted Array: ba cách và test.
// Chạy: go run find_min_rotated.go
package main

import "fmt"

func linearScan(nums []int) int {
	m := nums[0]
	for _, x := range nums {
		m = min(m, x)
	}
	return m
}

func binaryVsHi(nums []int) int {
	lo, hi := 0, len(nums)-1
	for lo < hi {
		mid := lo + (hi-lo)/2 // không viết (lo+hi)/2: với int32 hay mảng rất lớn, tổng có thể tràn
		if nums[mid] > nums[hi] {
			lo = mid + 1
		} else {
			hi = mid
		}
	}
	return nums[lo]
}

func binaryVsFirst(nums []int) int {
	if nums[0] <= nums[len(nums)-1] {
		return nums[0]
	}
	lo, hi := 0, len(nums)-1
	for lo < hi {
		mid := lo + (hi-lo)/2
		if nums[mid] >= nums[0] {
			lo = mid + 1
		} else {
			hi = mid
		}
	}
	return nums[lo]
}

func main() {
	cases := []struct {
		nums []int
		want int
	}{
		{[]int{3, 4, 5, 1, 2}, 1}, {[]int{4, 5, 6, 7, 0, 1, 2}, 0}, {[]int{11, 13, 15, 17}, 11}, {[]int{1}, 1},
		{[]int{2, 1}, 1}, {[]int{1, 2}, 1}, {[]int{5, 1, 2, 3, 4}, 1}, {[]int{2, 3, 4, 5, 1}, 1},
	}
	for _, f := range []struct {
		name string
		fn   func([]int) int
	}{{"linearScan", linearScan}, {"binaryVsHi", binaryVsHi}, {"binaryVsFirst", binaryVsFirst}} {
		ok := 0
		for _, c := range cases {
			if f.fn(c.nums) == c.want {
				ok++
			}
		}
		fmt.Printf("%-14s %d/%d ca đúng\n", f.name, ok, len(cases))
	}
}
