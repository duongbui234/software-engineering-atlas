// LeetCode 704, Binary Search: hai quy ước khoảng và thư viện chuẩn.
// Chạy: go run binary_search.go
package main

import (
	"fmt"
	"slices"
	"sort"
)

func closedInterval(nums []int, target int) int {
	lo, hi := 0, len(nums)-1
	for lo <= hi {
		mid := lo + (hi-lo)/2 // int của Go là 64 bit trên máy 64 bit, nhưng cách viết này đúng ở mọi cỡ
		switch {
		case nums[mid] == target:
			return mid
		case nums[mid] < target:
			lo = mid + 1
		default:
			hi = mid - 1
		}
	}
	return -1
}

func halfOpen(nums []int, target int) int {
	lo, hi := 0, len(nums)
	for lo < hi {
		mid := int(uint(lo+hi) >> 1) // cách sort.Search viết: cộng trong uint rồi dịch, không âm
		switch {
		case nums[mid] == target:
			return mid
		case nums[mid] < target:
			lo = mid + 1
		default:
			hi = mid
		}
	}
	return -1
}

func viaSortSearch(nums []int, target int) int {
	i := sort.Search(len(nums), func(i int) bool { return nums[i] >= target }) // i nhỏ nhất làm hàm trả true
	if i < len(nums) && nums[i] == target {
		return i
	}
	return -1
}

func viaSlices(nums []int, target int) int {
	if i, found := slices.BinarySearch(nums, target); found { // trả cả vị trí chèn lẫn cờ "tìm thấy"
		return i
	}
	return -1
}

func main() {
	cases := []struct {
		nums       []int
		target, ok int
	}{
		{[]int{-1, 0, 3, 5, 9, 12}, 9, 4}, {[]int{-1, 0, 3, 5, 9, 12}, 2, -1}, {[]int{5}, 5, 0}, {[]int{5}, 7, -1},
		{[]int{1, 3}, 3, 1}, {[]int{1, 3}, 0, -1}, {[]int{1, 3, 5, 7, 9, 11, 13}, 13, 6}, {[]int{1, 3, 5, 7, 9, 11, 13}, 1, 0},
	}
	for _, f := range []struct {
		name string
		fn   func([]int, int) int
	}{{"closedInterval", closedInterval}, {"halfOpen", halfOpen}, {"viaSortSearch", viaSortSearch}, {"viaSlices", viaSlices}} {
		ok := 0
		for _, c := range cases {
			if f.fn(c.nums, c.target) == c.ok {
				ok++
			}
		}
		fmt.Printf("%-15s %d/%d ca đúng\n", f.name, ok, len(cases))
	}
	i, found := slices.BinarySearch([]int{1, 3, 5}, 4)
	fmt.Printf("\nslices.BinarySearch([1 3 5], 4) = %d, %v\n", i, found)
}
