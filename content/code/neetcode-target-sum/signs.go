package main

import "fmt"

func enumerateSigns(nums []int, target int) int {
	if len(nums) == 0 {
		if target == 0 {
			return 1
		}
		return 0
	}
	return enumerateSigns(nums[1:], target-nums[0]) + enumerateSigns(nums[1:], target+nums[0])
}

func countBySignedSum(nums []int, target int) int {
	ways := map[int]int{0: 1}
	for _, x := range nums {
		next := make(map[int]int)
		for sum, count := range ways {
			next[sum+x] += count
			next[sum-x] += count
		}
		ways = next
	}
	return ways[target]
}

func countBySubset(nums []int, target int) int {
	sum := 0
	for _, x := range nums {
		sum += x
	}
	twice := sum - target
	if target > sum || target < -sum || twice%2 != 0 {
		return 0
	}
	goal := twice / 2
	ways := make([]int, goal+1)
	ways[0] = 1
	for _, x := range nums {
		for s := goal; s >= x; s-- {
			ways[s] += ways[s-x]
		}
	}
	return ways[goal]
}

func main() {
	ones := make([]int, 16)
	for i := range ones {
		ones[i] = 1
	}
	cases := []struct {
		nums         []int
		target, want int
	}{
		{[]int{1, 2, 5}, 4, 1}, {[]int{0, 0, 2, 3}, 1, 4}, {[]int{0, 0, 2, 3}, -1, 4},
		{[]int{2, 5}, 0, 0}, {[]int{2, 5}, 8, 0}, {[]int{2, 5}, -8, 0},
		{[]int{3, 3, 3, 3}, 0, 6}, {[]int{1000}, -1000, 1}, {[]int{0}, 0, 2},
		{make([]int, 20), 0, 1048576}, {ones, 0, 12870},
	}
	for _, c := range cases {
		if countBySignedSum(c.nums, c.target) != c.want || countBySubset(c.nums, c.target) != c.want ||
			(len(c.nums) <= 16 && enumerateSigns(c.nums, c.target) != c.want) {
			panic(c)
		}
	}
	fmt.Printf("%d/%d ca đúng\n", len(cases), len(cases))
}
