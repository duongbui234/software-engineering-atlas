// LeetCode 167, Two Sum II (mảng đã sắp xếp): bốn cách và test.
// Chạy: go run two_sum_ii.go
package main

import (
	"fmt"
	"slices"
	"sort"
)

func bruteForce(nums []int, target int) []int {
	for i := range nums {
		for j := i + 1; j < len(nums); j++ {
			if nums[i]+nums[j] == target {
				return []int{i + 1, j + 1}
			}
		}
	}
	return nil
}

func binarySearch(nums []int, target int) []int {
	for i, x := range nums {
		rest := nums[i+1:] // slice con dùng chung mảng gốc, không sao chép
		k := sort.SearchInts(rest, target-x)
		if k < len(rest) && rest[k] == target-x {
			return []int{i + 1, i + 2 + k}
		}
	}
	return nil
}

func hashMap(nums []int, target int) []int {
	seen := map[int]int{}
	for i, x := range nums {
		if j, ok := seen[target-x]; ok {
			return []int{j + 1, i + 1}
		}
		seen[x] = i
	}
	return nil
}

func twoPointers(nums []int, target int) []int {
	for i, j := 0, len(nums)-1; i < j; {
		switch s := nums[i] + nums[j]; {
		case s == target:
			return []int{i + 1, j + 1}
		case s < target:
			i++
		default:
			j--
		}
	}
	return nil
}

func main() {
	cases := []struct {
		nums   []int
		target int
		want   []int
	}{{[]int{2, 7, 11, 15}, 9, []int{1, 2}}, {[]int{2, 3, 4}, 6, []int{1, 3}}, {[]int{-1, 0}, -1, []int{1, 2}},
		{[]int{3, 3}, 6, []int{1, 2}}, {[]int{1, 2, 3, 4, 4, 9, 56, 90}, 8, []int{4, 5}}, {[]int{-10, -3, 0, 5, 9}, 6, []int{2, 5}}}
	for _, f := range []struct {
		name string
		fn   func([]int, int) []int
	}{{"bruteForce", bruteForce}, {"binarySearch", binarySearch}, {"hashMap", hashMap}, {"twoPointers", twoPointers}} {
		ok := 0
		for _, c := range cases {
			if slices.Equal(f.fn(c.nums, c.target), c.want) {
				ok++
			}
		}
		fmt.Printf("%-13s %d/%d ca đúng\n", f.name, ok, len(cases))
	}
}
